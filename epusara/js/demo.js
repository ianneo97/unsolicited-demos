window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var selected = "a1";
  var query = "";
  var flash = "";
  var jobNumber = 31;

  var sections = {
    A: { used: 18, total: 60 },
    B: { used: 41, total: 72 },
    C: { used: 7, total: 40 }
  };

  var records = [
    { id: "a1", name: "Nur Aisyah binti Rahman", year: 2024, section: "B", lot: 41, registered: "2024-11-08", nisan: null },
    { id: "a2", name: "Lim Mei Lan", year: 2020, section: "A", lot: 18, registered: "2020-06-17", nisan: null },
    { id: "a3", name: "Raj Kumar a/l Muthu", year: 2018, section: "C", lot: 7, registered: "2018-02-12", nisan: { id: "NIS-029", status: "done", at: "2018-03-03 · 15:40:00" } },
    { id: "a4", name: "Ahmad bin Yusof", year: 2025, section: "B", lot: null, registered: "", nisan: null },
    { id: "a5", name: "Siti Mariam binti Daud", year: 2022, section: "A", lot: null, registered: "", nisan: null },
    { id: "a6", name: "Tan Kok Wai", year: 2023, section: "B", lot: 40, registered: "2023-09-21", nisan: null },
    { id: "a7", name: "Devaki a/p Subramaniam", year: 2017, section: "C", lot: 6, registered: "2017-04-29", nisan: { id: "NIS-030", status: "in progress", at: "" } },
    { id: "a8", name: "Zainab binti Ismail", year: 2026, section: "B", lot: null, registered: "", nisan: null }
  ];

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function find(id) {
    return desk.find(records, id);
  }

  function plotLabel(record) {
    return "Seksyen " + record.section + " / " + (record.lot ? "Lot " + desk.pad(record.lot, 2) : "plot pending");
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · cemetery registry"));
    bar.appendChild(el("div", "shell-hint", records.length + " arwah records"));
    root.appendChild(bar);

    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · fictional names · not a live cemetery register"));
    root.appendChild(sample);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Search arwah"));

    var label = el("label", "lbl", "Name");
    label.htmlFor = "arwah-search";
    panel.appendChild(label);

    var input = el("input", "field");
    input.id = "arwah-search";
    input.type = "search";
    input.placeholder = "Search sample name";
    input.value = query;
    input.addEventListener("input", function () {
      query = input.value;
      render();
      var next = root.querySelector("#arwah-search");
      next.focus();
      next.setSelectionRange(query.length, query.length);
    });
    panel.appendChild(input);

    var needle = query.trim().toLowerCase();
    var visible = records.filter(function (record) {
      return record.name.toLowerCase().includes(needle);
    });
    panel.appendChild(el("p", "desk-sub", visible.length + " record" + (visible.length === 1 ? "" : "s") + " shown"));

    var list = el("div", "list");
    visible.forEach(function (record) {
      var ticket = el("button", "ticket" + (record.id === selected ? " on" : ""));
      ticket.type = "button";

      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", record.name));
      body.appendChild(el("div", "meta", "Wafat " + record.year + " · " + plotLabel(record)));
      ticket.appendChild(body);

      var chips = el("div", "desk-chips");
      if (!record.lot) chips.appendChild(el("span", "tag warn", "plot pending"));
      if (record.nisan) chips.appendChild(el("span", "tag " + (record.nisan.status === "done" ? "ok" : "warn"), "nisan " + record.nisan.status));
      ticket.appendChild(chips);

      ticket.addEventListener("click", function () {
        selected = record.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    if (!visible.length) list.appendChild(el("p", "empty", "No sample arwah matches this name."));
    panel.appendChild(list);

    panel.appendChild(el("h3", "", "Sections"));
    var summary = el("div", "desk-kv");
    Object.keys(sections).forEach(function (key) {
      var section = sections[key];
      summary.appendChild(el("div", "k", "Seksyen " + key));
      summary.appendChild(el("div", "", section.used + " used · " + (section.total - section.used) + " free"));
    });
    panel.appendChild(summary);
    return panel;
  }

  function detailPanel(record) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Arwah record"));
    panel.appendChild(el("div", "serving-name", record.name));
    panel.appendChild(el("p", "desk-sub", "Fictional sample record · wafat " + record.year));

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Plot"));
    kv.appendChild(el("div", "", plotLabel(record)));
    kv.appendChild(el("div", "k", "Registered"));
    kv.appendChild(el("div", "", record.registered || "not registered"));
    kv.appendChild(el("div", "k", "Nisan job"));
    kv.appendChild(el("div", "", record.nisan ? record.nisan.id + " · " + record.nisan.status : "not raised"));
    if (record.nisan && record.nisan.at) {
      kv.appendChild(el("div", "k", "Completed"));
      kv.appendChild(el("div", "", record.nisan.at));
    }
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var register = el("button", "btn-sm" + (record.lot ? " ghost" : ""), record.lot ? "Plot registered" : "Register plot");
    register.type = "button";
    register.disabled = Boolean(record.lot);
    register.addEventListener("click", function () {
      var section = sections[record.section];
      section.used += 1;
      record.lot = section.used;
      record.registered = today();
      flash = plotLabel(record) + " registered · " + record.registered;
      render();
    });
    actions.appendChild(register);

    var nisanLabel = !record.nisan ? "Nisan job" : (record.nisan.status === "in progress" ? "Complete nisan job" : "Nisan job done");
    var nisan = el("button", "btn-sm" + (record.nisan && record.nisan.status === "done" ? " ghost" : ""), nisanLabel);
    nisan.type = "button";
    nisan.disabled = Boolean(record.nisan && record.nisan.status === "done");
    nisan.addEventListener("click", function () {
      if (!record.nisan) {
        record.nisan = { id: "NIS-" + desk.pad(jobNumber), status: "in progress", at: "" };
        jobNumber += 1;
        flash = record.nisan.id + " raised · in progress";
      } else {
        record.nisan.status = "done";
        record.nisan.at = today() + " · " + desk.hms();
        flash = record.nisan.id + " completed · " + record.nisan.at;
      }
      render();
    });
    actions.appendChild(nisan);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (record.nisan) {
      panel.appendChild(el("div", "stamp on", record.nisan.id + " · " + record.nisan.status.toUpperCase() + (record.nisan.at ? " · " + record.nisan.at : "")));
    } else if (record.lot) {
      panel.appendChild(el("div", "stamp on", plotLabel(record) + " · REGISTERED " + record.registered));
    }
    panel.appendChild(el("p", "empty", "Registry actions stay in this sample desk. No payments or messages."));
    return panel;
  }

  render();
};
