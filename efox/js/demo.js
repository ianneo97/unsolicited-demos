window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var selected = "t1";
  var flash = "";
  var nextReceipt = 1;
  var rates = { USD: 4.72, SGD: 3.48, THB: 0.13 };

  var rows = [
    { id: "t1", name: "Aina Zulkifli", doc: "Passport SAMPLE-P-A1001", pair: "USD", foreign: 250, hit: false, aml: "pending", checked: "", receipt: null },
    { id: "t2", name: "Daniel Tan", doc: "IC SAMPLE-IC-0202", pair: "SGD", foreign: 380, hit: false, aml: "pending", checked: "", receipt: null },
    { id: "t3", name: "Kavitha Nair", doc: "Passport SAMPLE-P-K3003", pair: "THB", foreign: 12000, hit: false, aml: "pending", checked: "", receipt: null },
    { id: "t4", name: "Faris Hakim", doc: "IC SAMPLE-IC-0404", pair: "USD", foreign: 1000, hit: true, aml: "pending", checked: "", receipt: null },
    { id: "t5", name: "Mei Lin Wong", doc: "Passport SAMPLE-P-M5005", pair: "SGD", foreign: 650, hit: false, aml: "pending", checked: "", receipt: null },
    { id: "t6", name: "Harjit Singh", doc: "IC SAMPLE-IC-0606", pair: "THB", foreign: 8500, hit: false, aml: "pending", checked: "", receipt: null }
  ];

  function myr(row) {
    return row.foreign * rates[row.pair];
  }

  function foreign(row) {
    return row.pair + " " + row.foreign.toFixed(2);
  }

  function tillTotal() {
    return rows.reduce(function (sum, row) {
      return sum + (row.receipt ? row.receipt.myr : 0);
    }, 0);
  }

  function printedCount() {
    return rows.filter(function (row) { return row.receipt; }).length;
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · Times Square changer till"));
    bar.appendChild(el("div", "shell-hint", printedCount() + " receipts · till " + desk.rm(tillTotal())));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 fake customers · in-memory only"));
    root.appendChild(hint);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(desk.find(rows, selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Tickets · " + printedCount() + " printed"));
    var list = el("div", "list");
    rows.forEach(function (row) {
      var ticket = el("button", "ticket" + (row.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", row.name));
      body.appendChild(el("div", "meta", foreign(row) + " · " + desk.rm(myr(row))));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      if (row.aml === "watchlist") chips.appendChild(el("span", "tag danger", "watchlist"));
      else if (row.aml === "clear") chips.appendChild(el("span", "tag ok", "clear · " + row.checked));
      else chips.appendChild(el("span", "tag", "AML pending"));
      if (row.receipt) chips.appendChild(el("span", "tag ok", row.receipt.id));
      ticket.appendChild(chips);
      ticket.addEventListener("click", function () {
        selected = row.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function detailPanel(row) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Changer till"));
    panel.appendChild(el("div", "serving-name", row.name));
    panel.appendChild(el("p", "desk-sub", row.doc + " · clearly fake sample"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Pair"));
    kv.appendChild(el("div", "", row.pair + " → MYR"));
    kv.appendChild(el("div", "k", "Foreign"));
    kv.appendChild(el("div", "money", foreign(row)));
    kv.appendChild(el("div", "k", "Rate"));
    kv.appendChild(el("div", "money", rates[row.pair].toFixed(4)));
    kv.appendChild(el("div", "k", "MYR amount"));
    kv.appendChild(el("div", "money", desk.rm(myr(row))));
    kv.appendChild(el("div", "k", "AML"));
    kv.appendChild(el("div", "", row.aml === "pending" ? "not checked" : row.aml + " · " + row.checked));
    kv.appendChild(el("div", "k", "Receipt"));
    kv.appendChild(el("div", "", row.receipt ? row.receipt.id : "none"));
    panel.appendChild(kv);

    panel.appendChild(el("h3", "", "Rates → MYR"));
    var rateGrid = el("div", "desk-kv");
    ["USD", "SGD", "THB"].forEach(function (currency) {
      rateGrid.appendChild(el("label", "k", currency + " → MYR"));
      var input = el("input", "field");
      input.type = "number";
      input.min = "0.0001";
      input.step = "0.0001";
      input.value = String(rates[currency]);
      input.setAttribute("aria-label", currency + " to MYR rate");
      input.addEventListener("change", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value) || value <= 0) {
          flash = currency + " rate must be greater than 0.";
        } else {
          rates[currency] = value;
          flash = currency + " rate updated · selected amount " + desk.rm(myr(row));
        }
        render();
      });
      rateGrid.appendChild(input);
    });
    panel.appendChild(rateGrid);

    var actions = el("div", "actions");
    var aml = el("button", "btn-sm", "AML check");
    aml.type = "button";
    aml.disabled = row.aml !== "pending";
    aml.addEventListener("click", function () {
      row.aml = row.hit ? "watchlist" : "clear";
      row.checked = desk.hms();
      flash = row.hit
        ? "WATCHLIST HIT · " + row.name + " · receipt blocked"
        : "AML clear · " + row.name + " · " + row.checked;
      render();
    });
    actions.appendChild(aml);

    var print = el("button", "btn-sm ghost", "Print receipt");
    print.type = "button";
    print.addEventListener("click", function () {
      if (row.aml === "watchlist") {
        flash = "Blocked · watchlist hit must be reviewed.";
      } else if (row.aml !== "clear") {
        flash = "Run AML check before printing.";
      } else if (row.receipt) {
        flash = row.receipt.id + " already printed.";
      } else {
        row.receipt = {
          id: "EFOX-RCT-" + desk.pad(nextReceipt++),
          myr: myr(row),
          foreign: foreign(row),
          printed: desk.stamp("Printed")
        };
        flash = row.receipt.id + " added · till " + desk.rm(tillTotal());
      }
      render();
    });
    actions.appendChild(print);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (row.receipt) {
      panel.appendChild(el("div", "stamp on", row.receipt.id + " · " + desk.rm(row.receipt.myr) + " · " + row.receipt.foreign + " · " + row.receipt.printed));
    }
    panel.appendChild(el("p", "empty", "Static sample till. Not a bank inbox, not TEERA, and not Yuran."));
    return panel;
  }

  function injectCss() {
    if (document.getElementById("efox-demo-css")) return;
    var style = document.createElement("style");
    style.id = "efox-demo-css";
    style.textContent = "#demo-root .tag.danger{background:color-mix(in srgb,var(--danger) 24%,#0c0c0f);color:#ffb4b4}";
    document.head.appendChild(style);
  }

  injectCss();
  render();
};
