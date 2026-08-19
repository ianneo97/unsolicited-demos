window.mountDemo = function (root) {
  var selected = "p1";
  var flash = "";
  var nextRcpt = 3;

  var payers = [
    { id: "p1", name: "Encik Razak", kid: "Aina (Thn 3)", due: 80, paid: 0, wa: false, rcpt: "" },
    { id: "p2", name: "Puan Mei Ling", kid: "Jun (Thn 4)", due: 80, paid: 0, wa: false, rcpt: "" },
    { id: "p3", name: "Encik Kumar", kid: "Devi (Thn 2)", due: 0, paid: 80, wa: false, rcpt: "YU-RCT-001" },
    { id: "p4", name: "Puan Aisyah", kid: "Hafiz (Thn 5)", due: 160, paid: 0, wa: false, rcpt: "" },
    { id: "p5", name: "Encik Daniel", kid: "Chloe (Thn 1)", due: 80, paid: 0, wa: false, rcpt: "" },
    { id: "p6", name: "Puan Zahra", kid: "Arif (Thn 3)", due: 0, paid: 80, wa: false, rcpt: "YU-RCT-002" },
    { id: "p7", name: "Encik Chong", kid: "Mei (Thn 4)", due: 80, paid: 0, wa: false, rcpt: "" },
    { id: "p8", name: "Puan Iman", kid: "Hakim (Thn 2)", due: 40, paid: 40, wa: false, rcpt: "" }
  ];

  function find(id) { return desk.find(payers, id); }
  function overdue() {
    return payers.reduce(function (s, p) { return s + p.due; }, 0);
  }
  function dueN() { return payers.filter(function (p) { return p.due > 0; }).length; }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "Yuran.my · KAFA Demo, PJS"));
    bar.appendChild(el("div", "shell-hint", "Overdue " + desk.rm(overdue()) + " · " + dueN() + " open"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 payers · not a live KAFA"));
    root.appendChild(hint);
    var p = find(selected);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(p));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Payers · " + dueN() + " overdue"));
    var list = el("div", "list");
    payers.forEach(function (p) {
      var t = el("button", "ticket" + (p.id === selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", p.name));
      body.appendChild(el("div", "meta", p.kid + " · sample"));
      t.appendChild(body);
      if (p.due > 0) t.appendChild(el("span", "tag warn", desk.rm(p.due)));
      else t.appendChild(el("span", "tag ok", "clear"));
      t.addEventListener("click", function () { selected = p.id; flash = ""; render(); });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function cardPanel(p) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Treasurer"));
    panel.appendChild(el("div", "serving-name", p.name));
    panel.appendChild(el("p", "desk-sub", p.kid + " · KAFA Demo, PJS"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Overdue"));
    kv.appendChild(el("div", "money", desk.rm(p.due)));
    kv.appendChild(el("div", "k", "Paid this year"));
    kv.appendChild(el("div", "", desk.rm(p.paid)));
    kv.appendChild(el("div", "k", "Block overdue"));
    kv.appendChild(el("div", "", desk.rm(overdue())));
    kv.appendChild(el("div", "k", "Last receipt"));
    kv.appendChild(el("div", "", p.rcpt || "none"));
    panel.appendChild(kv);
    var actions = el("div", "actions");
    var wa = el("button", "btn-sm" + (p.wa ? " ghost" : ""), p.wa ? "Pay link queued" : "Queue WhatsApp pay link");
    wa.type = "button";
    wa.disabled = p.due === 0 || p.wa;
    wa.addEventListener("click", function () {
      p.wa = true;
      flash = "queued to +60 12-000 4400 · " + p.name + " · " + desk.rm(p.due) + " · not sent";
      render();
    });
    actions.appendChild(wa);
    var rec = el("button", "btn-sm ghost", "Receive + reprint");
    rec.type = "button";
    rec.disabled = p.due === 0;
    rec.addEventListener("click", function () {
      var got = p.due;
      p.paid += got;
      p.due = 0;
      p.rcpt = "YU-RCT-" + desk.pad(nextRcpt++);
      flash = "Reprinted · " + p.rcpt + " · " + desk.rm(got);
      render();
    });
    actions.appendChild(rec);
    var reprint = el("button", "btn-sm ghost", "Reprint receipt");
    reprint.type = "button";
    reprint.disabled = !p.rcpt;
    reprint.addEventListener("click", function () {
      flash = "Reprint · " + p.rcpt + " · " + p.name + " · on this page";
      render();
    });
    actions.appendChild(reprint);
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (p.rcpt) panel.appendChild(el("div", "stamp on", p.rcpt + " · " + p.kid + " · sample"));
    panel.appendChild(el("p", "empty", "Not a tadika face-scan. Pay link does not open wa.me."));
    return panel;
  }

  render();
};
