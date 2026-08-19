window.mountDemo = function (root, c) {
  var selected = "k1";
  var attendance = 0;
  var infaq = 0;
  var amount = 10;
  var nextReceipt = 1;
  var lastReceipt = "";
  var lastAmount = 0;
  var lastStamp = "";
  var flash = "";

  var kariah = [
    { id: "k1", name: "Ahmad Firdaus", zone: "Seksyen 7", inn: false, time: "", khairat: false },
    { id: "k2", name: "Nur Aisyah", zone: "Seksyen 8", inn: false, time: "", khairat: true },
    { id: "k3", name: "Mohd Rizal", zone: "Seksyen 9", inn: false, time: "", khairat: false },
    { id: "k4", name: "Siti Hajar", zone: "Seksyen 10", inn: false, time: "", khairat: false },
    { id: "k5", name: "Hafiz Rahman", zone: "Seksyen 11", inn: false, time: "", khairat: false },
    { id: "k6", name: "Farah Nadia", zone: "Seksyen 12", inn: false, time: "", khairat: false },
    { id: "k7", name: "Ismail Zulkifli", zone: "Seksyen 13", inn: false, time: "", khairat: false },
    { id: "k8", name: "Nadia Sofea", zone: "Seksyen 14", inn: false, time: "", khairat: false }
  ];

  function find(id) { return desk.find(kariah, id); }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · Masjid Demo"));
    bar.appendChild(el("div", "shell-hint", attendance + " / 8 hadir · infaq " + desk.rm(infaq)));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 kariah · not a live mosque"));
    root.appendChild(hint);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Jumaat · " + attendance + " / 8 hadir"));
    var list = el("div", "list");
    kariah.forEach(function (person) {
      var ticket = el("button", "ticket" + (person.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", person.name));
      body.appendChild(el("div", "meta", person.zone + (person.time ? " · " + person.time : "")));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag" + (person.inn ? " ok" : ""), person.inn ? "IN" : "belum"));
      if (person.khairat) chips.appendChild(el("span", "tag warn", "khairat"));
      ticket.appendChild(chips);
      ticket.addEventListener("click", function () {
        selected = person.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function amountButton(value) {
    var button = el("button", "btn-sm" + (amount === value ? "" : " ghost"), desk.rm(value));
    button.type = "button";
    button.setAttribute("aria-pressed", String(amount === value));
    button.addEventListener("click", function () {
      amount = value;
      flash = "";
      render();
    });
    return button;
  }

  function cardPanel(person) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Kariah"));
    panel.appendChild(el("div", "serving-name", person.name));
    panel.appendChild(el("p", "desk-sub", person.zone + " · sample kariah"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Jumaat"));
    kv.appendChild(el("div", "", person.inn ? "IN · " + person.time : "belum check-in"));
    kv.appendChild(el("div", "k", "Kariah ID"));
    kv.appendChild(el("div", "", person.id.toUpperCase()));
    kv.appendChild(el("div", "k", "Attendance"));
    kv.appendChild(el("div", "", attendance + " / 8"));
    kv.appendChild(el("div", "k", "Infaq today"));
    kv.appendChild(el("div", "money", desk.rm(infaq)));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var checkin = el("button", "btn-sm", "Jumaat check-in");
    checkin.type = "button";
    checkin.disabled = person.inn;
    checkin.addEventListener("click", function () {
      person.inn = true;
      person.time = desk.hms();
      attendance += 1;
      flash = "Checked in · " + person.name + " · " + person.time + " · " + attendance + " / 8";
      render();
    });
    actions.appendChild(checkin);
    actions.appendChild(amountButton(10));
    actions.appendChild(amountButton(50));
    var record = el("button", "btn-sm ghost", "Record infaq");
    record.type = "button";
    record.addEventListener("click", function () {
      infaq = Math.round((infaq + amount) * 100) / 100;
      lastAmount = amount;
      lastReceipt = "MP-INF-" + desk.pad(nextReceipt++);
      lastStamp = desk.stamp("Today");
      flash = "Recorded · " + lastReceipt + " · " + desk.rm(lastAmount) + " · total " + desk.rm(infaq);
      render();
    });
    actions.appendChild(record);
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (lastReceipt) panel.appendChild(el("div", "stamp on", lastReceipt + " · " + desk.rm(lastAmount) + " · " + lastStamp));
    panel.appendChild(el("p", "empty", "Sample data only. No live attendance or payment."));
    return panel;
  }

  render();
};
