window.mountDemo = function (root) {
  var selected = "m1";
  var today = 0;
  var flash = "";

  var machines = [
    { id: "m1", name: "Washer 1", kind: "washer", kg: 12, status: "idle", price: 8, wallet: false, ts: "", sales: 0 },
    { id: "m2", name: "Washer 2", kind: "washer", kg: 12, status: "idle", price: 8, wallet: false, ts: "", sales: 0 },
    { id: "m3", name: "Washer 3", kind: "washer", kg: 18, status: "fault", price: 12, wallet: false, ts: "", sales: 0 },
    { id: "m4", name: "Dryer 1", kind: "dryer", kg: 12, status: "idle", price: 6, wallet: false, ts: "", sales: 0 },
    { id: "m5", name: "Dryer 2", kind: "dryer", kg: 18, status: "idle", price: 9, wallet: false, ts: "", sales: 0 },
    { id: "m6", name: "Dryer 3", kind: "dryer", kg: 12, status: "idle", price: 6, wallet: false, ts: "", sales: 0 }
  ];

  function find(id) { return desk.find(machines, id); }
  function runningN() { return machines.filter(function (m) { return m.status === "running"; }).length; }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "theLaundro · Oval owner phone"));
    bar.appendChild(el("div", "shell-hint", "Today " + desk.rm(today) + " · " + runningN() + " running"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 machines · not live IoT"));
    root.appendChild(hint);
    var m = find(selected);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(m));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Floor · " + runningN() + " running"));
    var list = el("div", "list");
    machines.forEach(function (m) {
      var t = el("button", "ticket" + (m.id === selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", m.name));
      body.appendChild(el("div", "meta", m.kind + " · " + m.kg + " kg · today " + desk.rm(m.sales)));
      t.appendChild(body);
      var tag = "idle";
      var cls = "tag";
      if (m.status === "running") { tag = "running"; cls = "tag ok"; }
      if (m.status === "fault") { tag = "fault"; cls = "tag warn"; }
      t.appendChild(el("span", cls, tag));
      t.addEventListener("click", function () { selected = m.id; flash = ""; render(); });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function cardPanel(m) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Machine"));
    panel.appendChild(el("div", "serving-name", m.name));
    panel.appendChild(el("p", "desk-sub", m.kind + " · " + m.kg + " kg · " + desk.rm(m.price) + " / cycle"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Status"));
    kv.appendChild(el("div", "", m.status + (m.ts ? " · " + m.ts : "")));
    kv.appendChild(el("div", "k", "This machine"));
    kv.appendChild(el("div", "money", desk.rm(m.sales)));
    kv.appendChild(el("div", "k", "Today all"));
    kv.appendChild(el("div", "money", desk.rm(today)));
    panel.appendChild(kv);
    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = m.wallet;
    box.disabled = m.status !== "idle";
    box.addEventListener("change", function () { m.wallet = box.checked; render(); });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("E-wallet charged"));
    panel.appendChild(tog);
    var actions = el("div", "actions");
    var start = el("button", "btn-sm", "Remote start");
    start.type = "button";
    start.disabled = m.status !== "idle" || !m.wallet;
    start.addEventListener("click", function () {
      m.status = "running";
      m.ts = desk.hms();
      m.sales = Math.round((m.sales + m.price) * 100) / 100;
      today = Math.round((today + m.price) * 100) / 100;
      flash = "Started · " + m.name + " · " + desk.rm(m.price) + " · today " + desk.rm(today);
      render();
    });
    actions.appendChild(start);
    var stop = el("button", "btn-sm ghost", "Mark idle");
    stop.type = "button";
    stop.disabled = m.status !== "running";
    stop.addEventListener("click", function () {
      m.status = "idle";
      m.wallet = false;
      flash = m.name + " idle";
      render();
    });
    actions.appendChild(stop);
    panel.appendChild(actions);
    if (m.status === "fault") {
      panel.appendChild(el("p", "empty", "Fault · do not start. Call the tech. Sample only."));
    } else if (!m.wallet && m.status === "idle") {
      panel.appendChild(el("p", "empty", "Tick e-wallet before remote start."));
    }
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    panel.appendChild(el("p", "empty", "Not Telos kiosk hardware. No live IoT."));
    return panel;
  }

  render();
};
