window.mountDemo = function (root) {
  var selected = "s1";
  var flash = "";

  var students = [
    { id: "s1", name: "Arif Hassan", belt: "kuning", inn: false, time: "", gradeDue: false, fee: 80, paid: false, ping: false },
    { id: "s2", name: "Siti Zahra", belt: "hijau", inn: false, time: "", gradeDue: true, fee: 80, paid: false, ping: false },
    { id: "s3", name: "Daniel Chong", belt: "putih", inn: false, time: "", gradeDue: false, fee: 60, paid: false, ping: false },
    { id: "s4", name: "Mei Ling", belt: "biru", inn: false, time: "", gradeDue: true, fee: 90, paid: false, ping: false },
    { id: "s5", name: "Hakim Zain", belt: "kuning", inn: false, time: "", gradeDue: false, fee: 80, paid: false, ping: false },
    { id: "s6", name: "Nurul Iman", belt: "putih", inn: false, time: "", gradeDue: false, fee: 60, paid: false, ping: false },
    { id: "s7", name: "Rajesh Kumar", belt: "hijau", inn: false, time: "", gradeDue: false, fee: 80, paid: false, ping: false },
    { id: "s8", name: "Aina Roslan", belt: "putih", inn: false, time: "", gradeDue: false, fee: 60, paid: false, ping: false }
  ];

  function find(id) { return desk.find(students, id); }
  function inN() { return students.filter(function (s) { return s.inn; }).length; }
  function gradeN() { return students.filter(function (s) { return s.gradeDue && !s.paid; }).length; }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "D-Clix · Kelana club"));
    bar.appendChild(el("div", "shell-hint", inN() + " / 8 IN · " + gradeN() + " grading due"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 students · not a live dojo"));
    root.appendChild(hint);
    var s = find(selected);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(s));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Morning · " + inN() + " sudah masuk"));
    var list = el("div", "list");
    students.forEach(function (s) {
      var t = el("button", "ticket" + (s.id === selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", s.name));
      body.appendChild(el("div", "meta", "sabuk " + s.belt + (s.time ? " · " + s.time : "")));
      t.appendChild(body);
      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag" + (s.inn ? " ok" : ""), s.inn ? "IN" : "belum"));
      if (s.gradeDue && !s.paid) chips.appendChild(el("span", "tag warn", "grading"));
      t.appendChild(chips);
      t.addEventListener("click", function () { selected = s.id; flash = ""; render(); });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function cardPanel(s) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Student"));
    panel.appendChild(el("div", "serving-name", s.name));
    panel.appendChild(el("p", "desk-sub", "Sabuk " + s.belt + " · sample"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "QR"));
    kv.appendChild(el("div", "", s.inn ? "IN · " + s.time : "not scanned"));
    kv.appendChild(el("div", "k", "Grading fee"));
    kv.appendChild(el("div", "", desk.rm(s.fee)));
    kv.appendChild(el("div", "k", "Parent ping"));
    kv.appendChild(el("div", "", s.ping ? "sudah sampai · queued" : "none"));
    panel.appendChild(kv);
    var actions = el("div", "actions");
    var qr = el("button", "btn-sm" + (s.inn ? " ghost" : ""), "QR in");
    qr.type = "button";
    qr.disabled = s.inn;
    qr.addEventListener("click", function () {
      s.inn = true;
      s.time = desk.hms();
      flash = "QR · " + s.name + " · IN · " + s.time + " · no camera";
      render();
    });
    actions.appendChild(qr);
    var ping = el("button", "btn-sm ghost", s.ping ? "Ping queued" : "Parent “sudah sampai”");
    ping.type = "button";
    ping.disabled = s.ping;
    ping.addEventListener("click", function () {
      s.ping = true;
      flash = "Ping queued · " + s.name + " sudah sampai · not sent";
      render();
    });
    actions.appendChild(ping);
    var fee = el("button", "btn-sm ghost", s.paid ? "Fee collected" : "Collect grading fee");
    fee.type = "button";
    fee.disabled = s.paid;
    fee.addEventListener("click", function () {
      s.paid = true;
      s.gradeDue = false;
      flash = "Collected · " + s.name + " · " + desk.rm(s.fee);
      render();
    });
    actions.appendChild(fee);
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    panel.appendChild(el("p", "empty", "Not ClassFlow. QR is a button. No camera."));
    return panel;
  }

  render();
};
