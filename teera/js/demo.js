window.mountDemo = function (root) {
  var cats = ["Uncategorized", "Sales", "Cost of sales", "Operating expense", "Other"];
  var txs = [
    { id: 1, date: "18 Aug 2026", who: "Received \u00b7 Acme Trading", memo: "Sample sale", amt: 2400, cat: "Uncategorized" },
    { id: 2, date: "17 Aug 2026", who: "Shopee Ads", memo: "Sample ad spend", amt: -186.5, cat: "Uncategorized" },
    { id: 3, date: "16 Aug 2026", who: "Office rent", memo: "Sample opex", amt: -1800, cat: "Uncategorized" },
    { id: 4, date: "15 Aug 2026", who: "Grab / petrol", memo: "Sample opex", amt: -94.2, cat: "Uncategorized" }
  ];
  var submitted = false;

  function money(n) {
    var sign = n < 0 ? "\u2212" : "";
    return sign + "RM " + Math.abs(n).toFixed(2);
  }

  function totals() {
    var income = 0;
    var expense = 0;
    txs.forEach(function (t) {
      if (t.cat === "Uncategorized") return;
      if (t.amt > 0) income += t.amt;
      else expense += Math.abs(t.amt);
    });
    return { income: income, expense: expense, net: income - expense };
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "Bookkeeping inbox"));
    bar.appendChild(el("div", "shell-hint", "SAMPLE DATA \u00b7 4 MYR lines"));
    root.appendChild(bar);

    var grid = el("div", "shell-grid cols-2");
    grid.appendChild(inboxPanel());
    grid.appendChild(rightPanel());
    root.appendChild(grid);
  }

  function inboxPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Transactions"));
    txs.forEach(function (t) {
      var row = el("div", "tx");
      var left = el("div");
      left.appendChild(el("div", "who", t.who));
      left.appendChild(el("div", "sub", t.date + " \u00b7 " + t.memo));
      row.appendChild(left);
      row.appendChild(el("div", "amt", money(t.amt)));
      var actions = el("div", "tx-actions");
      cats.forEach(function (c) {
        if (c === "Uncategorized") return;
        var chip = el("button", "tab" + (t.cat === c ? " on" : ""), c);
        chip.type = "button";
        chip.addEventListener("click", function () {
          t.cat = (t.cat === c) ? "Uncategorized" : c;
          render();
        });
        actions.appendChild(chip);
      });
      row.appendChild(actions);
      panel.appendChild(row);
    });
    return panel;
  }

  function rightPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "P&L \u00b7 categorized only"));
    var t = totals();
    var pl = el("div", "pl");
    function line(label, n, cls) {
      var r = el("div", "pl-row" + (cls ? " " + cls : ""));
      r.appendChild(el("span", "", label));
      r.appendChild(el("span", "money", money(n)));
      pl.appendChild(r);
    }
    line("Income", t.income);
    line("Expenses", -t.expense);
    line("Net", t.net, "total");
    panel.appendChild(pl);
    panel.appendChild(el("p", "empty", "Uncategorized lines stay out of this P&L."));

    panel.appendChild(el("h3", "", "Sample invoice"));
    var kv = el("div", "kv");
    kv.appendChild(el("div", "k", "INV-DEMO-001"));
    kv.appendChild(el("div", "money", "RM 2400.00"));
    kv.appendChild(el("div", "k", "Buyer"));
    kv.appendChild(el("div", "", "Acme Trading (sample)"));
    panel.appendChild(kv);

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = submitted;
    box.addEventListener("change", function () {
      submitted = box.checked;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("MyInvois / e-invoice"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (submitted ? " on" : ""));
    stamp.textContent = submitted
      ? "Submitted (sample) \u00b7 MyInvois \u00b7 INV-DEMO-001"
      : "Not submitted \u00b7 toggle to stamp this sample invoice";
    panel.appendChild(stamp);
    return panel;
  }

  render();
};
