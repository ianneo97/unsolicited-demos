window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var selected = "g1";
  var rate = 430;
  var flash = "";
  var nextTag = 417;
  var nextInvoice = 1;

  var items = [
    { id: "g1", name: "Puan Nurul", item: "Rantai tangan bunga", weight: 12.48, mutu: 916, spread: 31, pajak: false, tag: "", tagAt: "", tradeAt: "", invoice: "", invoiceAt: "" },
    { id: "g2", name: "Encik Firdaus", item: "Dinar Kelantan", weight: 4.25, mutu: 999, spread: 24, pajak: false, tag: "", tagAt: "", tradeAt: "", invoice: "", invoiceAt: "" },
    { id: "g3", name: "Puan Siew Mei", item: "Gelang padu", weight: 18.72, mutu: 835, spread: 37, pajak: false, tag: "", tagAt: "", tradeAt: "", invoice: "", invoiceAt: "" },
    { id: "g4", name: "Encik Hafiz", item: "Cincin batu nilam", weight: 6.14, mutu: 750, spread: 44, pajak: true, tag: "", tagAt: "", tradeAt: "", invoice: "", invoiceAt: "" },
    { id: "g5", name: "Puan Kavitha", item: "Loket daun", weight: 8.36, mutu: 585, spread: 56, pajak: false, tag: "", tagAt: "", tradeAt: "", invoice: "", invoiceAt: "" },
    { id: "g6", name: "Encik Roslan", item: "Rantai leher halus", weight: 21.09, mutu: 916, spread: 31, pajak: false, tag: "", tagAt: "", tradeAt: "", invoice: "", invoiceAt: "" }
  ];

  function find(id) { return desk.find(items, id); }
  function amount(item, perGram) {
    return Math.round(item.weight * (item.mutu / 1000) * perGram * 100) / 100;
  }
  function sale(item) { return amount(item, rate); }
  function buyBack(item) { return amount(item, Math.max(0, rate - item.spread)); }
  function totalSale() {
    return items.reduce(function (sum, item) { return sum + sale(item); }, 0);
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · one gold counter"));
    bar.appendChild(el("div", "shell-hint", "6 items · sale stock " + desk.rm(totalSale())));
    root.appendChild(bar);

    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · Kota Bharu · not live stock or LHDN"));
    root.appendChild(hint);

    var rateBar = el("div", "shell-bar");
    var label = el("label", "shell-hint", "LIVE RATE · MYR / g");
    var input = el("input", "field");
    input.type = "number";
    input.min = "1";
    input.step = "1";
    input.value = String(rate);
    input.setAttribute("aria-label", "Live MYR/g rate");
    input.addEventListener("input", function () {
      var nextRate = Number(input.value);
      if (!isFinite(nextRate) || nextRate <= 0) return;
      var cursor = input.selectionStart;
      rate = nextRate;
      flash = "Rate updated · " + desk.rm(rate) + " / g · all quotes recomputed";
      render();
      var replacement = root.querySelector("[aria-label='Live MYR/g rate']");
      replacement.focus();
      if (cursor != null) replacement.setSelectionRange(cursor, cursor);
    });
    label.appendChild(input);
    rateBar.appendChild(label);
    rateBar.appendChild(el("div", "shell-hint", "Sale = weight × mutu × rate"));
    root.appendChild(rateBar);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Counter · 6 items"));
    var list = el("div", "list");
    items.forEach(function (item) {
      var ticket = el("button", "ticket" + (item.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", item.name));
      body.appendChild(el("div", "meta", item.item + " · " + item.weight.toFixed(2) + " g"));
      body.appendChild(el("div", "meta", (item.invoice ? "sale " : "sale quote ") + desk.rm(sale(item)) + " · " + (item.tradeAt ? "buy-back " : "buy-back quote ") + desk.rm(buyBack(item))));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag warn", item.mutu));
      chips.appendChild(el("span", "tag", "−" + item.spread + "/g"));
      if (item.pajak) chips.appendChild(el("span", "tag", "pajak"));
      if (item.tag) chips.appendChild(el("span", "tag ok", item.tag));
      ticket.appendChild(chips);
      ticket.addEventListener("click", function () {
        selected = item.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function detailPanel(item) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Gold counter"));
    panel.appendChild(el("div", "serving-name", item.name));
    panel.appendChild(el("p", "desk-sub", item.item + " · " + (item.pajak ? "pajak item" : "retail item")));

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Weight"));
    kv.appendChild(el("div", "", item.weight.toFixed(2) + " g"));
    kv.appendChild(el("div", "k", "Mutu"));
    kv.appendChild(el("div", "", item.mutu + " · factor " + (item.mutu / 1000).toFixed(3)));
    kv.appendChild(el("div", "k", "Live rate"));
    kv.appendChild(el("div", "money", desk.rm(rate) + " / g"));
    kv.appendChild(el("div", "k", "Sale"));
    kv.appendChild(el("div", "money", desk.rm(sale(item))));
    kv.appendChild(el("div", "k", "Buy-back"));
    kv.appendChild(el("div", "money", desk.rm(buyBack(item))));
    kv.appendChild(el("div", "k", "Spread"));
    kv.appendChild(el("div", "", "−" + desk.rm(item.spread) + " / g"));
    kv.appendChild(el("div", "k", "Tag"));
    kv.appendChild(el("div", "", item.tag ? item.tag + " · " + item.tagAt : "not weighed"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var weigh = el("button", "btn-sm", "Weigh / tag");
    weigh.type = "button";
    weigh.disabled = !!item.tag;
    weigh.addEventListener("click", function () {
      item.tag = "SE-" + desk.pad(nextTag++, 4);
      item.tagAt = desk.hms();
      flash = "Tagged · " + item.tag + " · " + item.weight.toFixed(2) + " g · " + item.tagAt;
      render();
    });
    actions.appendChild(weigh);

    var trade = el("button", "btn-sm ghost", "Trade-in");
    trade.type = "button";
    trade.disabled = !item.tag || !!item.tradeAt;
    trade.addEventListener("click", function () {
      item.tradeAt = desk.hms();
      flash = "Buy-back written · " + desk.rm(buyBack(item)) + " · " + item.tradeAt;
      render();
    });
    actions.appendChild(trade);

    var invoice = el("button", "btn-sm ghost", "Issue e-invoice");
    invoice.type = "button";
    invoice.disabled = !item.tag || !!item.invoice;
    invoice.addEventListener("click", function () {
      item.invoice = "SE-INV-" + desk.pad(nextInvoice++);
      item.invoiceAt = desk.stamp("Today");
      flash = "Sale written · " + item.invoice + " · " + desk.rm(sale(item));
      render();
    });
    actions.appendChild(invoice);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    var stampText = item.tag ? item.tag + " · " + item.tagAt : "Awaiting weight tag";
    if (item.tradeAt) stampText += " · trade-in " + desk.rm(buyBack(item));
    if (item.invoice) stampText += " · " + item.invoice + " · " + item.invoiceAt;
    panel.appendChild(el("div", "stamp" + (item.tag ? " on" : ""), stampText));
    panel.appendChild(el("p", "empty", item.pajak ? "Marked pajak. This row may use pawn handling." : "Retail gold. Not pawn; only rows marked pajak use pawn handling."));
    return panel;
  }

  render();
};
