window.mountDemo = function (root) {
  var selected = "r1";
  var drivers = ["Encik Hafiz · WMH 4412", "Puan Siti · BQQ 2290"];

  var rots = [
    { id: "r1", no: "ROT-4411", box: "MSKU 3829102", from: "Northport", to: "Westports", cell: "0,1", driver: "", pod: false, photo: false, ts: "", inv: 0, charge: 420 },
    { id: "r2", no: "ROT-4412", box: "TCLU 1182736", from: "Westports", to: "Northport", cell: "3,0", driver: "", pod: false, photo: false, ts: "", inv: 0, charge: 390 },
    { id: "r3", no: "ROT-4413", box: "FSCU 7721904", from: "Northport", to: "Padang Jawa", cell: "1,3", driver: "", pod: false, photo: false, ts: "", inv: 0, charge: 280 },
    { id: "r4", no: "ROT-4414", box: "GESU 4401288", from: "Westports", to: "Shah Alam", cell: "2,2", driver: "", pod: false, photo: false, ts: "", inv: 0, charge: 310 },
    { id: "r5", no: "ROT-4415", box: "TEMU 9033411", from: "Northport", to: "Westports", cell: "0,3", driver: "", pod: false, photo: false, ts: "", inv: 0, charge: 420 },
    { id: "r6", no: "ROT-4416", box: "HLXU 2210987", from: "Westports", to: "Port Klang free zone", cell: "3,3", driver: "", pod: false, photo: false, ts: "", inv: 0, charge: 250 }
  ];

  function find(id) { return desk.find(rots, id); }
  function openN() { return rots.filter(function (r) { return !r.driver; }).length; }
  function podN() { return rots.filter(function (r) { return r.pod; }).length; }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "Gussmann · Port Klang board"));
    bar.appendChild(el("div", "shell-hint", openN() + " open · " + podN() + " POD"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 ROTs · fake grid · not live GPS"));
    root.appendChild(hint);
    var r = find(selected);
    var grid = el("div", "shell-grid desk-3");
    grid.appendChild(listPanel());
    grid.appendChild(jobPanel(r));
    grid.appendChild(mapPanel(r));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "ROTs · " + openN() + " unassigned"));
    var list = el("div", "list");
    rots.forEach(function (r) {
      var t = el("button", "ticket" + (r.id === selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", r.no + " · " + r.box));
      body.appendChild(el("div", "meta", r.from + " → " + r.to));
      t.appendChild(body);
      t.appendChild(el("span", "tag" + (r.pod ? " ok" : r.driver ? " warn" : ""), r.pod ? "POD" : (r.driver ? "out" : "open")));
      t.addEventListener("click", function () { selected = r.id; render(); });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function jobPanel(r) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Job · " + r.no));
    panel.appendChild(el("div", "serving-name", r.box));
    panel.appendChild(el("p", "desk-sub", r.from + " → " + r.to + " · sample"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Driver"));
    kv.appendChild(el("div", "", r.driver || "unassigned"));
    kv.appendChild(el("div", "k", "Charge"));
    kv.appendChild(el("div", "", desk.rm(r.charge)));
    kv.appendChild(el("div", "k", "POD"));
    kv.appendChild(el("div", "", r.pod ? r.ts : "open"));
    kv.appendChild(el("div", "k", "Invoice"));
    kv.appendChild(el("div", "", r.inv ? desk.rm(r.inv) : "none"));
    panel.appendChild(kv);
    var assign = el("div", "actions");
    drivers.forEach(function (d) {
      var b = el("button", "tab" + (r.driver === d ? " on" : ""), d.split(" · ")[0]);
      b.type = "button";
      b.disabled = r.pod;
      b.addEventListener("click", function () { r.driver = d; render(); });
      assign.appendChild(b);
    });
    panel.appendChild(assign);
    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = r.photo;
    box.disabled = r.pod;
    box.addEventListener("change", function () { r.photo = box.checked; render(); });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("Photo on POD"));
    panel.appendChild(tog);
    var actions = el("div", "actions");
    var pod = el("button", "btn-sm" + (r.pod ? " ghost" : ""), r.pod ? "POD marked" : "Mark POD");
    pod.type = "button";
    pod.disabled = r.pod || !r.driver || !r.photo;
    pod.addEventListener("click", function () {
      r.pod = true;
      r.ts = desk.stamp("20 Aug 2026");
      render();
    });
    actions.appendChild(pod);
    var inv = el("button", "btn-sm ghost", r.inv ? "Invoiced" : "Raise invoice");
    inv.type = "button";
    inv.disabled = !r.pod || !!r.inv;
    inv.addEventListener("click", function () { r.inv = r.charge; render(); });
    actions.appendChild(inv);
    panel.appendChild(actions);
    if (r.pod) panel.appendChild(el("div", "stamp on", "POD · " + r.driver + " · " + r.ts));
    if (r.inv) panel.appendChild(el("div", "stamp on", "INV-GS-" + r.no.slice(-4) + " · " + desk.rm(r.inv)));
    if (!r.driver) panel.appendChild(el("p", "empty", "Assign a truck before POD. Not Flitz parcels."));
    else if (!r.photo && !r.pod) panel.appendChild(el("p", "empty", "Tick photo, then Mark POD."));
    return panel;
  }

  function mapPanel(cur) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Grid · fake map"));
    panel.appendChild(el("p", "desk-sub", "Not Google. Northport left · Westports right."));
    var map = el("div", "desk-map");
    var r, c;
    for (r = 0; r < 4; r++) {
      for (c = 0; c < 4; c++) {
        var cell = el("button", "desk-cell");
        cell.type = "button";
        var key = c + "," + r;
        var hit = rots.filter(function (x) { return x.cell === key; })[0];
        if (hit) {
          cell.className += " has" + (hit.id === cur.id ? " on" : "") + (hit.pod ? " pod" : "");
          cell.textContent = hit.no.slice(-2);
          cell.addEventListener("click", function (drop) {
            return function () { selected = drop.id; render(); };
          }(hit));
        } else {
          cell.disabled = true;
          cell.textContent = "·";
        }
        map.appendChild(cell);
      }
    }
    panel.appendChild(map);
    return panel;
  }

  render();
};
