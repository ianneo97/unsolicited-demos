window.mountDemo = function (root) {
  var selected = "c1";
  var flash = "";
  var nextRcpt = 1;

  var people = [
    { id: "c1", name: "Ahmad Faiz", cls: "D", kpp: "KPP02", inn: false, time: "", fee: 120, due: false, rcpt: "" },
    { id: "c2", name: "Nurul Aina", cls: "D", kpp: "KPP02", inn: false, time: "", fee: 120, due: true, rcpt: "" },
    { id: "c3", name: "Lim Wei Jun", cls: "B2", kpp: "KPP02", inn: false, time: "", fee: 90, due: false, rcpt: "" },
    { id: "c4", name: "Priya Devi", cls: "D", kpp: "KPP03", inn: false, time: "", fee: 150, due: true, rcpt: "" },
    { id: "c5", name: "Hafiz Omar", cls: "B2", kpp: "KPP02", inn: false, time: "", fee: 90, due: false, rcpt: "" },
    { id: "c6", name: "Chloe Tan", cls: "D", kpp: "KPP02", inn: false, time: "", fee: 120, due: false, rcpt: "" }
  ];

  function find(id) { return desk.find(people, id); }
  function inN() { return people.filter(function (p) { return p.inn; }).length; }
  function dueN() { return people.filter(function (p) { return p.due && !p.rcpt; }).length; }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "E-Driving · Perling counter"));
    bar.appendChild(el("div", "shell-hint", inN() + " / 6 IN · " + dueN() + " fee due"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 candidates · not a live JPJ kiosk"));
    root.appendChild(hint);
    var p = find(selected);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(p));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Candidates · " + inN() + " thumbprint in"));
    var list = el("div", "list");
    people.forEach(function (p) {
      var t = el("button", "ticket" + (p.id === selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", p.name));
      body.appendChild(el("div", "meta", "class " + p.cls + " · " + p.kpp + (p.time ? " · " + p.time : "")));
      t.appendChild(body);
      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag" + (p.inn ? " ok" : ""), p.inn ? "IN" : "belum"));
      if (p.due && !p.rcpt) chips.appendChild(el("span", "tag warn", "fee due"));
      else if (p.rcpt) chips.appendChild(el("span", "tag ok", "paid"));
      t.appendChild(chips);
      t.addEventListener("click", function () { selected = p.id; flash = ""; render(); });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function cardPanel(p) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "KPP desk"));
    panel.appendChild(el("div", "serving-name", p.name));
    panel.appendChild(el("p", "desk-sub", "Class " + p.cls + " · " + p.kpp + " · sample"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Thumbprint"));
    kv.appendChild(el("div", "", p.inn ? "IN · " + p.time : "not scanned"));
    kv.appendChild(el("div", "k", "Fee"));
    kv.appendChild(el("div", "", desk.rm(p.fee)));
    kv.appendChild(el("div", "k", "Receipt"));
    kv.appendChild(el("div", "", p.rcpt || "none"));
    panel.appendChild(kv);
    var actions = el("div", "actions");
    var thumb = el("button", "btn-sm" + (p.inn ? " ghost" : ""), p.inn ? "KPP02 in" : "Thumbprint KPP02");
    thumb.type = "button";
    thumb.disabled = p.inn;
    thumb.addEventListener("click", function () {
      p.inn = true;
      p.time = desk.hms();
      flash = "Thumbprint · " + p.name + " · " + p.kpp + " · " + p.time;
      render();
    });
    actions.appendChild(thumb);
    var rec = el("button", "btn-sm ghost", p.rcpt ? "Receipt issued" : "Issue receipt");
    rec.type = "button";
    rec.disabled = !!p.rcpt;
    rec.addEventListener("click", function () {
      p.rcpt = "ED-RCT-" + desk.pad(nextRcpt++);
      p.due = false;
      flash = p.rcpt + " · " + p.name + " · " + desk.rm(p.fee);
      render();
    });
    actions.appendChild(rec);
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (p.rcpt) panel.appendChild(el("div", "stamp on", p.rcpt + " · class " + p.cls + " · " + desk.rm(p.fee) + " · sample"));
    panel.appendChild(el("p", "empty", "Not a tadika board. Thumbprint is a button. No live JPJ link."));
    return panel;
  }

  render();
};
