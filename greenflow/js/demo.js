window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var selected = "hp1";
  var flash = "";
  var nextReceipt = 18;
  var collectedToday = 0;
  var seededToday = new Date(2026, 7, 20);

  var agreements = [
    { id: "hp1", borrower: "Nur Aisyah Rahman", item: "Yamaha Y15ZR", financed: 18900, monthly: 525, paid: 14, tenure: 36, nextDue: "2026-08-05", receipt: null },
    { id: "hp2", borrower: "Lim Wei Jian", item: "Honda Wave Alpha", financed: 9600, monthly: 320, paid: 8, tenure: 30, nextDue: "2026-08-12", receipt: null },
    { id: "hp3", borrower: "Raj Kumar Nair", item: "Perodua Myvi 1.5", financed: 52800, monthly: 1100, paid: 12, tenure: 48, nextDue: "2026-08-20", receipt: null },
    { id: "hp4", borrower: "Siti Mariam Hassan", item: "Modenas Kriss 110", financed: 7920, monthly: 220, paid: 20, tenure: 36, nextDue: "2026-09-01", receipt: null },
    { id: "hp5", borrower: "Lee Jia Hui", item: "Toyota Vios 1.5", financed: 63000, monthly: 1050, paid: 24, tenure: 60, nextDue: "2026-08-25", receipt: null },
    { id: "hp6", borrower: "Ahmad Faizal Ismail", item: "Proton Saga 1.3", financed: 39600, monthly: 825, paid: 15, tenure: 48, nextDue: "2026-09-10", receipt: { id: "GF-RCT-017", at: "19 Aug 2026 · 16:42:10", amount: 825 } }
  ];

  agreements.forEach(function (a) {
    a.outstanding = a.financed - a.paid * a.monthly;
  });

  function parseDate(iso) {
    var p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function isoDate(d) {
    return d.getFullYear() + "-" + desk.pad(d.getMonth() + 1, 2) + "-" + desk.pad(d.getDate(), 2);
  }

  function addMonth(iso) {
    var d = parseDate(iso);
    var day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
    return isoDate(d);
  }

  function formatDate(iso) {
    return parseDate(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
  }

  function daysLate(a) {
    return Math.max(0, Math.floor((seededToday - parseDate(a.nextDue)) / 86400000));
  }

  function arrearsCount() {
    return agreements.filter(function (a) { return daysLate(a) > 0 && a.outstanding > 0; }).length;
  }

  function outstandingTotal() {
    return agreements.reduce(function (sum, a) { return sum + a.outstanding; }, 0);
  }

  function find(id) {
    return desk.find(agreements, id);
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · Instalment counter"));
    bar.appendChild(el("div", "shell-hint", "Collected today " + desk.rm(collectedToday) + " · " + arrearsCount() + " in arrears"));
    root.appendChild(bar);

    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 HP agreements · seeded 20 Aug 2026"));
    sample.appendChild(el("div", "shell-hint", "Outstanding " + desk.rm(outstandingTotal())));
    root.appendChild(sample);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Agreements · " + arrearsCount() + " late"));
    var list = el("div", "list");

    agreements.forEach(function (a) {
      var late = daysLate(a);
      var ticket = el("button", "ticket" + (a.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", a.borrower));
      body.appendChild(el("div", "meta", a.item + " · " + a.paid + "/" + a.tenure + " paid"));
      ticket.appendChild(body);
      ticket.appendChild(el("span", late ? "tag warn" : "tag ok", late ? "late " + late + "d" : "due " + formatDate(a.nextDue)));
      ticket.addEventListener("click", function () {
        selected = a.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });

    panel.appendChild(list);
    return panel;
  }

  function detailPanel(a) {
    var late = daysLate(a);
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Agreement detail"));
    panel.appendChild(el("div", "serving-name", a.borrower));
    panel.appendChild(el("p", "desk-sub", a.id.toUpperCase() + " · " + a.item + " · sample"));

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Amount financed"));
    kv.appendChild(el("div", "money", desk.rm(a.financed)));
    kv.appendChild(el("div", "k", "Monthly instalment"));
    kv.appendChild(el("div", "money", desk.rm(a.monthly)));
    kv.appendChild(el("div", "k", "Tenure progress"));
    kv.appendChild(el("div", "", a.paid + " / " + a.tenure + " paid"));
    kv.appendChild(el("div", "k", "Outstanding"));
    kv.appendChild(el("div", "money", desk.rm(a.outstanding)));
    kv.appendChild(el("div", "k", "Next due"));
    kv.appendChild(el("div", "", formatDate(a.nextDue)));
    kv.appendChild(el("div", "k", "Status"));
    kv.appendChild(el("div", "", late ? late + " days late" : "Current"));
    kv.appendChild(el("div", "k", "Last receipt"));
    kv.appendChild(el("div", "", a.receipt ? a.receipt.id : "None"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var receive = el("button", "btn-sm", "Receive instalment");
    receive.type = "button";
    receive.disabled = a.outstanding === 0;
    receive.addEventListener("click", function () {
      var amount = Math.min(a.monthly, a.outstanding);
      a.outstanding -= amount;
      a.paid += 1;
      a.nextDue = addMonth(a.nextDue);
      collectedToday += amount;
      a.receipt = {
        id: "GF-RCT-" + desk.pad(nextReceipt++),
        at: desk.stamp("20 Aug 2026"),
        amount: amount
      };
      flash = "Received " + desk.rm(amount) + " · next due " + formatDate(a.nextDue);
      render();
    });
    actions.appendChild(receive);

    var reprint = el("button", "btn-sm ghost", "Reprint receipt");
    reprint.type = "button";
    reprint.disabled = !a.receipt;
    reprint.addEventListener("click", function () {
      flash = "Reprinted " + a.receipt.id + " · " + desk.rm(a.receipt.amount);
      render();
    });
    actions.appendChild(reprint);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (a.receipt) panel.appendChild(el("div", "stamp on", a.receipt.id + " · " + a.receipt.at + " · " + desk.rm(a.receipt.amount)));
    panel.appendChild(el("p", "empty", "Instalment collection only. No VSO, stock-in or yard workflow."));
    return panel;
  }

  render();
};
