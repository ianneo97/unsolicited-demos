window.mountDemo = function (root, c) {
  document.head.appendChild(Object.assign(document.createElement("link"), { rel: "icon", href: "data:," }));
  var el = window.el;
  var desk = window.desk;
  var selected = "p1";
  var flash = "";
  var techs = ["Aiman Rosli", "Mei Lin", "Kumar Raj"];

  var contracts = [
    { id: "p1", no: "PP-101", premise: "Kedai Kopi Ah Seng", kind: "kopitiam", pest: "rodent", frequency: "monthly", months: 1, fee: 280, tech: "", visit: "", treated: "", next: "", invoice: 0 },
    { id: "p2", no: "PP-102", premise: "Kondo Seri Wawasan · Block B", kind: "kondo block", pest: "denggi", frequency: "monthly", months: 1, fee: 420, tech: "", visit: "", treated: "", next: "", invoice: 0 },
    { id: "p3", no: "PP-103", premise: "Kilang Maju Jaya", kind: "kilang", pest: "termite", frequency: "quarterly", months: 3, fee: 1250, tech: "", visit: "", treated: "", next: "", invoice: 0 },
    { id: "p4", no: "PP-104", premise: "Tadika Bintang Ceria", kind: "kindergarten", pest: "denggi", frequency: "monthly", months: 1, fee: 320, tech: "", visit: "", treated: "", next: "", invoice: 0 },
    { id: "p5", no: "PP-105", premise: "Roti Harmoni Bakery", kind: "bakery", pest: "rodent", frequency: "quarterly", months: 3, fee: 460, tech: "", visit: "", treated: "", next: "", invoice: 0 },
    { id: "p6", no: "PP-106", premise: "Medan Selera Puteri", kind: "food court", pest: "termite", frequency: "quarterly", months: 3, fee: 780, tech: "", visit: "", treated: "", next: "", invoice: 0 }
  ];

  function find(id) { return desk.find(contracts, id); }
  function date(offset) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }
  function addMonths(value, months) {
    var parts = value.split("-").map(Number);
    var last = new Date(Date.UTC(parts[0], parts[1] - 1 + months + 1, 0)).getUTCDate();
    return new Date(Date.UTC(parts[0], parts[1] - 1 + months, Math.min(parts[2], last))).toISOString().slice(0, 10);
  }
  function openCount() {
    return contracts.filter(function (contract) { return !contract.treated; }).length;
  }
  function invoicedTotal() {
    return contracts.reduce(function (total, contract) { return total + contract.invoice; }, 0);
  }
  function myr(value) { return "MYR " + Number(value).toFixed(2); }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · contract job board"));
    bar.appendChild(el("div", "shell-hint", openCount() + " open jobs · " + myr(invoicedTotal()) + " invoiced"));
    root.appendChild(bar);
    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 recurring contracts · in-memory only"));
    root.appendChild(sample);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function pestChip(contract) {
    var tone = contract.pest === "termite" ? " warn" : contract.pest === "rodent" ? " ok" : "";
    return el("span", "tag" + tone, contract.pest);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Contracts · " + openCount() + " open"));
    var list = el("div", "list");
    contracts.forEach(function (contract) {
      var ticket = el("button", "ticket" + (contract.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", contract.premise));
      body.appendChild(el("div", "meta", contract.no + " · " + contract.kind + " · " + contract.frequency));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      chips.appendChild(pestChip(contract));
      if (contract.treated) chips.appendChild(el("span", "tag ok", "treated"));
      if (contract.invoice) chips.appendChild(el("span", "tag", myr(contract.invoice)));
      ticket.appendChild(chips);
      ticket.addEventListener("click", function () {
        selected = contract.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function detailPanel(contract) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Contract · " + contract.no));
    panel.appendChild(el("div", "serving-name", contract.premise));
    panel.appendChild(el("p", "desk-sub", contract.kind + " · sample premise"));
    var chips = el("div", "desk-chips");
    chips.appendChild(pestChip(contract));
    if (contract.treated) chips.appendChild(el("span", "tag ok", "☑ photo-ready"));
    panel.appendChild(chips);

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Frequency"));
    kv.appendChild(el("div", "", contract.frequency));
    kv.appendChild(el("div", "k", "Technician"));
    kv.appendChild(el("div", "", contract.tech || "unassigned"));
    kv.appendChild(el("div", "k", "Visit date"));
    kv.appendChild(el("div", "", contract.visit || "not scheduled"));
    kv.appendChild(el("div", "k", "Next visit"));
    kv.appendChild(el("div", "", contract.next || "closes with report"));
    kv.appendChild(el("div", "k", "Invoice"));
    kv.appendChild(el("div", "", contract.invoice ? myr(contract.invoice) : "not invoiced"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var assign = el("button", "btn-sm" + (contract.tech ? " ghost" : ""), "Assign tech");
    assign.type = "button";
    assign.disabled = !!contract.tech;
    assign.addEventListener("click", function () {
      var index = contracts.indexOf(contract);
      contract.tech = techs[index % techs.length];
      contract.visit = date(index + 1);
      flash = contract.tech + " assigned · visit " + contract.visit;
      render();
    });
    actions.appendChild(assign);

    var close = el("button", "btn-sm" + (contract.treated ? " ghost" : ""), "Close report");
    close.type = "button";
    close.disabled = !contract.tech || !!contract.treated;
    close.addEventListener("click", function () {
      contract.treated = desk.hms();
      contract.next = addMonths(contract.visit, contract.months);
      flash = "Report closed · next visit " + contract.next + " · photo-ready";
      render();
    });
    actions.appendChild(close);

    var invoice = el("button", "btn-sm ghost", "Invoice");
    invoice.type = "button";
    invoice.disabled = !contract.treated || !!contract.invoice;
    invoice.addEventListener("click", function () {
      contract.invoice = contract.fee;
      flash = contract.no + " invoiced " + myr(contract.invoice) + " · total " + myr(invoicedTotal());
      render();
    });
    actions.appendChild(invoice);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (contract.treated) panel.appendChild(el("div", "stamp on", "TREATED · " + contract.treated + " · ☑ PHOTO-READY"));
    panel.appendChild(el("p", "empty", "Recurring pest-control desk. No live photos, messages or payments."));
    return panel;
  }

  render();
};
