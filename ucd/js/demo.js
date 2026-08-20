window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var favicon = el("link");
  favicon.rel = "icon";
  favicon.href = "data:,";
  document.head.appendChild(favicon);
  var selected = "u1";
  var flash = "Select a unit, then run its yard paperwork.";
  var nextLot = 14;
  var nextVso = 83;
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  function daysAgo(n) {
    var d = new Date(today);
    d.setDate(d.getDate() - n);
    return d;
  }

  function daysFromNow(n) {
    var d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  }

  var rows = [
    { id: "u1", plate: "WVR 4821", model: "Myvi", year: 2016, asking: 32800, lot: "", stockAt: null, vso: "", soldAt: null, debt: 0, due: null, hutangOffer: 3800 },
    { id: "u2", plate: "BMT 907", model: "Hilux", year: 2018, asking: 88900, lot: "UCD-L-008", stockAt: daysAgo(11), vso: "", soldAt: null, debt: 0, due: null, hutangOffer: 7200 },
    { id: "u3", plate: "VCF 7310", model: "City", year: 2019, asking: 67900, lot: "UCD-L-009", stockAt: daysAgo(7), vso: "UCD-VSO-081", soldAt: daysAgo(1), debt: 5200, due: daysFromNow(12), hutangOffer: 5200 },
    { id: "u4", plate: "JTU 2086", model: "Axia", year: 2017, asking: 29800, lot: "", stockAt: null, vso: "", soldAt: null, debt: 0, due: null, hutangOffer: 2900 },
    { id: "u5", plate: "PND 6143", model: "Alza", year: 2020, asking: 64800, lot: "UCD-L-010", stockAt: daysAgo(4), vso: "", soldAt: null, debt: 0, due: null, hutangOffer: 6100 },
    { id: "u6", plate: "QAB 3351", model: "Saga", year: 2018, asking: 36800, lot: "UCD-L-011", stockAt: daysAgo(2), vso: "", soldAt: null, debt: 0, due: null, hutangOffer: 3500 },
    { id: "u7", plate: "KDW 9504", model: "Vios", year: 2017, asking: 55800, lot: "", stockAt: null, vso: "", soldAt: null, debt: 0, due: null, hutangOffer: 4900 },
    { id: "u8", plate: "VBP 7726", model: "X70", year: 2021, asking: 98800, lot: "UCD-L-012", stockAt: daysAgo(1), vso: "UCD-VSO-082", soldAt: daysAgo(0), debt: 0, due: null, hutangOffer: 8600 }
  ];

  function find(id) { return desk.find(rows, id); }

  function date(d) {
    return d ? d.toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  }

  function yardDays(r) {
    return r.stockAt ? Math.max(0, Math.floor((today - r.stockAt) / 86400000)) : 0;
  }

  function inStock() {
    return rows.filter(function (r) { return r.lot && !r.vso; }).length;
  }

  function underVso() {
    return rows.filter(function (r) { return r.vso; }).length;
  }

  function totalDebt() {
    return rows.reduce(function (sum, r) { return sum + r.debt; }, 0);
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · used-car yard"));
    bar.appendChild(el("div", "shell-hint", inStock() + " in stock · " + underVso() + " under VSO · hutang " + desk.rm(totalDebt())));
    root.appendChild(bar);

    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · Bandar Sunway, PJ · 8 fake units · " + desk.hms()));
    root.appendChild(sample);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Yard board · 8 units"));
    var list = el("div", "list");

    rows.forEach(function (r) {
      var ticket = el("button", "ticket" + (r.id === selected ? " on" : ""));
      ticket.type = "button";

      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", r.plate));
      body.appendChild(el("div", "meta", r.model + " " + r.year + " · asking " + desk.rm(r.asking)));
      body.appendChild(el("div", "meta", r.lot ? r.lot + " · " + yardDays(r) + "d in yard" : "awaiting stock-in"));
      if (r.vso) body.appendChild(el("div", "meta", "SOLD · " + r.vso + " · " + desk.rm(r.asking)));
      if (r.debt) body.appendChild(el("div", "meta", "hutang " + desk.rm(r.debt) + " · due " + date(r.due)));
      ticket.appendChild(body);

      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag warn", desk.rm(r.asking)));
      if (r.lot) chips.appendChild(el("span", "tag", r.lot));
      if (r.vso) chips.appendChild(el("span", "tag ok", r.vso));
      if (r.debt) chips.appendChild(el("span", "tag warn", "hutang " + desk.rm(r.debt)));
      ticket.appendChild(chips);

      ticket.addEventListener("click", function () {
        selected = r.id;
        flash = "Selected " + r.plate + " · " + r.model + " " + r.year + ".";
        render();
      });
      list.appendChild(ticket);
    });

    panel.appendChild(list);
    return panel;
  }

  function detailPanel(r) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Selected unit"));
    panel.appendChild(el("div", "serving-name", r.plate));
    panel.appendChild(el("p", "desk-sub", r.model + " " + r.year + " · sample used-car yard record"));

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Asking"));
    kv.appendChild(el("div", "money", desk.rm(r.asking)));
    kv.appendChild(el("div", "k", "Stock-in"));
    kv.appendChild(el("div", "", r.lot ? r.lot + " · " + date(r.stockAt) : "not stocked"));
    kv.appendChild(el("div", "k", "Days in yard"));
    kv.appendChild(el("div", "", r.lot ? yardDays(r) + " days" : "—"));
    kv.appendChild(el("div", "k", "Buyer contract"));
    kv.appendChild(el("div", "", r.vso ? r.vso + " · sold " + date(r.soldAt) : "no VSO"));
    kv.appendChild(el("div", "k", "Hutang-tepi"));
    kv.appendChild(el("div", "money", r.debt ? desk.rm(r.debt) : desk.rm(0)));
    kv.appendChild(el("div", "k", "Next due"));
    kv.appendChild(el("div", "", date(r.due)));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var stock = el("button", "btn-sm", "Stock in");
    stock.type = "button";
    stock.disabled = !!r.lot;
    stock.addEventListener("click", function () {
      r.lot = "UCD-L-" + desk.pad(nextLot++, 3);
      r.stockAt = new Date(today);
      flash = "Stock in · " + r.lot + " · " + date(r.stockAt) + " · " + desk.stamp("Today");
      render();
    });
    actions.appendChild(stock);

    var contract = el("button", "btn-sm ghost", "Buyer contract");
    contract.type = "button";
    contract.disabled = !r.lot || !!r.vso;
    contract.addEventListener("click", function () {
      r.vso = "UCD-VSO-" + desk.pad(nextVso++, 3);
      r.soldAt = new Date(today);
      flash = "Buyer contract · " + r.vso + " · sale " + desk.rm(r.asking) + " · " + desk.stamp("Today");
      render();
    });
    actions.appendChild(contract);

    var hutang = el("button", "btn-sm ghost", "Hutang-tepi");
    hutang.type = "button";
    hutang.disabled = !r.vso || !!r.debt;
    hutang.addEventListener("click", function () {
      r.debt = r.hutangOffer;
      r.due = daysFromNow(30);
      flash = "Hutang-tepi · " + desk.rm(r.debt) + " outstanding · due " + date(r.due) + " · " + desk.hms();
      render();
    });
    actions.appendChild(hutang);
    panel.appendChild(actions);

    panel.appendChild(el("p", "desk-flash", flash));

    var stamp = r.lot ? "STOCKED · " + r.lot + " · " + date(r.stockAt) + " · " + yardDays(r) + "d in yard" : "AWAITING STOCK-IN";
    if (r.vso) stamp += " · SOLD " + r.vso;
    if (r.debt) stamp += " · HUTANG " + desk.rm(r.debt) + " · DUE " + date(r.due);
    panel.appendChild(el("div", "stamp on", stamp));
    panel.appendChild(el("p", "empty", "Used-car yard DMS only · no workshop labour hours, gold weights or rental records."));
    return panel;
  }

  render();
};
