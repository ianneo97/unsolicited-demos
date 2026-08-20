window.mountDemo = function (root, c) {
  var selected = "d1";
  var poojas = 0;
  var donations = 0;
  var amount = 20;
  var nextReceipt = 12;
  var bookingIndex = 0;
  var hallIndex = 0;
  var flash = "";
  var stamp = "";
  var rites = ["Archanai", "Abhishekam", "Ubayam"];
  var slots = ["09:30", "10:15", "11:00"];
  var hallDates = ["29 Aug 2026", "5 Sep 2026", "12 Sep 2026"];

  var devotees = [
    { id: "d1", name: "Kavitha Subramaniam", ref: "Queue A01", pooja: "", hall: "" },
    { id: "d2", name: "Arjun Nair", ref: "Queue A02", pooja: "", hall: "" },
    { id: "d3", name: "Meena Rajendran", ref: "Queue A03", pooja: "", hall: "" },
    { id: "d4", name: "Suresh Kumar", ref: "Queue A04", pooja: "", hall: "" },
    { id: "d5", name: "Priya Krishnan", ref: "Queue A05", pooja: "", hall: "" },
    { id: "d6", name: "Lim Wei Jian", ref: "Queue T01", pooja: "", hall: "" },
    { id: "d7", name: "Tan Mei Ling", ref: "Queue T02", pooja: "", hall: "" },
    { id: "d8", name: "Lee Jia Hui", ref: "Queue T03", pooja: "", hall: "" }
  ];

  function find(id) { return desk.find(devotees, id); }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · Temple Counter"));
    bar.appendChild(el("div", "shell-hint", poojas + " poojas today · donations " + desk.rm(donations)));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 devotees · not a live temple"));
    root.appendChild(hint);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Counter queue · " + poojas + " poojas booked"));
    var list = el("div", "list");
    devotees.forEach(function (person) {
      var ticket = el("button", "ticket" + (person.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", person.name));
      body.appendChild(el("div", "meta", person.ref + (person.pooja ? " · " + person.pooja : " · counter enquiry")));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag" + (person.pooja ? " ok" : ""), person.pooja ? "pooja" : "waiting"));
      if (person.hall) chips.appendChild(el("span", "tag warn", "Hall · " + person.hall));
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
    panel.appendChild(el("h3", "", "Devotee counter"));
    panel.appendChild(el("div", "serving-name", person.name));
    panel.appendChild(el("p", "desk-sub", person.ref + " · sample devotee"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Pooja"));
    kv.appendChild(el("div", "", person.pooja || "not booked"));
    kv.appendChild(el("div", "k", "Devotee ID"));
    kv.appendChild(el("div", "", person.id.toUpperCase()));
    kv.appendChild(el("div", "k", "Today's poojas"));
    kv.appendChild(el("div", "", String(poojas)));
    kv.appendChild(el("div", "k", "Donations today"));
    kv.appendChild(el("div", "money", desk.rm(donations)));
    kv.appendChild(el("div", "k", "Hall booking"));
    kv.appendChild(el("div", "", person.hall || "none"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var book = el("button", "btn-sm", "Book pooja");
    book.type = "button";
    book.disabled = Boolean(person.pooja);
    book.addEventListener("click", function () {
      person.pooja = rites[bookingIndex % rites.length] + " · " + slots[bookingIndex % slots.length];
      bookingIndex += 1;
      poojas += 1;
      flash = "Booked · " + person.name + " · " + person.pooja;
      stamp = "Pooja ticket · " + desk.stamp("Today");
      render();
    });
    actions.appendChild(book);
    actions.appendChild(amountButton(20));
    actions.appendChild(amountButton(50));
    var donate = el("button", "btn-sm ghost", "Donation receipt");
    donate.type = "button";
    donate.addEventListener("click", function () {
      donations = Math.round((donations + amount) * 100) / 100;
      var receipt = "GT-DN-" + desk.pad(nextReceipt++);
      flash = "Received · " + receipt + " · " + desk.rm(amount) + " · total " + desk.rm(donations);
      stamp = receipt + " · " + desk.rm(amount) + " · " + desk.stamp("Today");
      render();
    });
    actions.appendChild(donate);
    var hall = el("button", "btn-sm ghost", "Hall date");
    hall.type = "button";
    hall.disabled = Boolean(person.hall);
    hall.addEventListener("click", function () {
      person.hall = hallDates[hallIndex % hallDates.length];
      hallIndex += 1;
      flash = "Hall booked · " + person.name + " · " + person.hall;
      stamp = "Hall date · " + person.hall + " · " + desk.stamp("Today");
      render();
    });
    actions.appendChild(hall);
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (stamp) panel.appendChild(el("div", "stamp on", stamp));
    panel.appendChild(el("p", "empty", "Sample data only. No live bookings, donations or kiosk."));
    return panel;
  }

  render();
};
