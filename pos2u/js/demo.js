window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var SST = 0.06;
  var selected = "t1";
  var today = 0;
  var splitPax = 2;
  var nextKitchen = 3;
  var flash = "";

  var menus = [
    [{ name: "Roti canai", price: 2.2 }, { name: "Teh tarik", price: 2.8 }],
    [{ name: "Kaya toast", price: 3.6 }, { name: "Kopi O", price: 2.4 }],
    [{ name: "Mee goreng mamak", price: 7.5 }, { name: "Limau ais", price: 2.6 }],
    [{ name: "Nasi lemak ayam", price: 8.9 }, { name: "Teh O ais", price: 2.6 }],
    [{ name: "Curry laksa", price: 9.5 }, { name: "Barley ais", price: 2.8 }],
    [{ name: "Half-boiled eggs", price: 3.8 }, { name: "Cham panas", price: 2.7 }]
  ];

  var tables = [
    { id: "t1", name: "Table 1", status: "empty", items: [], split: 0, opened: "" },
    { id: "t2", name: "Table 2", status: "seated", items: copyMenu(1, true), split: 0, opened: "Today · 12:05:18" },
    { id: "t3", name: "Table 3", status: "empty", items: [], split: 0, opened: "" },
    { id: "t4", name: "Table 4", status: "bill", items: copyMenu(3, true), split: 3, opened: "Today · 12:11:42" },
    { id: "t5", name: "Table 5", status: "empty", items: [], split: 0, opened: "" },
    { id: "t6", name: "Table 6", status: "seated", items: copyMenu(5, false), split: 0, opened: "Today · 12:16:09" }
  ];

  var kitchen = [
    { id: "K" + desk.pad(1), table: "Table 2", items: "Kaya toast · Kopi O", time: "12:06:02" },
    { id: "K" + desk.pad(2), table: "Table 4", items: "Nasi lemak ayam · Teh O ais", time: "12:12:10" }
  ];

  function copyMenu(index, sent) {
    return menus[index].map(function (item) {
      return { name: item.name, price: item.price, sent: sent };
    });
  }

  function find(id) {
    return desk.find(tables, id);
  }

  function round(n) {
    return Math.round(n * 100) / 100;
  }

  function subtotal(table) {
    return round(table.items.reduce(function (sum, item) { return sum + item.price; }, 0));
  }

  function sst(table) {
    return round(subtotal(table) * SST);
  }

  function total(table) {
    return round(subtotal(table) + sst(table));
  }

  function hasUnsent(table) {
    return table.items.some(function (item) { return !item.sent; });
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", (c ? c.name : "POS2U") + " · Kopitiam floor"));
    bar.appendChild(el("div", "shell-hint", "Today " + desk.rm(today) + " · " + kitchen.length + " kitchen tickets"));
    root.appendChild(bar);

    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 tables · not a live restaurant"));
    root.appendChild(hint);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(tablePanel());
    grid.appendChild(billPanel(find(selected)));
    root.appendChild(grid);
  }

  function tablePanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Floor · 6 tables"));
    var list = el("div", "list");

    tables.forEach(function (table) {
      var ticket = el("button", "ticket" + (table.id === selected ? " on" : ""));
      ticket.type = "button";

      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", table.name));
      body.appendChild(el("div", "meta", table.items.length ? table.items.length + " items · " + desk.rm(total(table)) : "Ready for guests"));
      ticket.appendChild(body);

      var cls = "tag";
      if (table.status === "seated") cls += " ok";
      if (table.status === "bill") cls += " warn";
      ticket.appendChild(el("span", cls, table.status));
      ticket.addEventListener("click", function () {
        selected = table.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });

    panel.appendChild(list);
    return panel;
  }

  function billPanel(table) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Bill · SST 6%"));
    panel.appendChild(el("div", "serving-name", table.name));
    panel.appendChild(el("p", "desk-sub", table.opened || "Empty table · ready for QR order"));

    if (!table.items.length) {
      panel.appendChild(el("p", "empty", "No items yet. QR order adds two sample kopitiam items."));
    }

    table.items.forEach(function (item) {
      var row = el("div", "tx");
      var left = el("div");
      left.appendChild(el("div", "", item.name));
      left.appendChild(el("div", "sub", item.sent ? "Sent to kitchen" : "New QR item"));
      row.appendChild(left);
      row.appendChild(el("div", "amt", desk.rm(item.price)));
      panel.appendChild(row);
    });

    var kv = el("div", "desk-kv");
    addKv(kv, "Status", table.status);
    addKv(kv, "Subtotal", desk.rm(subtotal(table)), "money");
    addKv(kv, "SST 6%", desk.rm(sst(table)), "money");
    addKv(kv, "Total", desk.rm(total(table)), "money");
    if (table.split) addKv(kv, table.split + " pax", desk.rm(total(table) / table.split) + " each", "money");
    panel.appendChild(kv);

    var paxLabel = el("label", "lbl", "Split pax");
    var pax = el("select", "select");
    pax.setAttribute("aria-label", "Split pax");
    [2, 3, 4].forEach(function (n) {
      var option = el("option", "", String(n));
      option.value = String(n);
      option.selected = n === splitPax;
      pax.appendChild(option);
    });
    pax.disabled = table.status === "bill";
    pax.addEventListener("change", function () {
      splitPax = Number(pax.value);
    });
    paxLabel.appendChild(pax);
    panel.appendChild(paxLabel);

    var actions = el("div", "actions");
    actions.appendChild(action("QR order", table.status === "bill", function () {
      var index = Number(table.id.slice(1)) - 1;
      table.items = table.items.concat(copyMenu(index, false));
      table.status = "seated";
      table.split = 0;
      if (!table.opened) table.opened = desk.stamp("Today");
      flash = "QR order added · " + menus[index].map(function (item) { return item.name; }).join(" + ");
      render();
    }));

    actions.appendChild(action("Kitchen ticket", !table.items.length || !hasUnsent(table), function () {
      var ordered = table.items.filter(function (item) { return !item.sent; });
      ordered.forEach(function (item) { item.sent = true; });
      kitchen.unshift({
        id: "K" + desk.pad(nextKitchen++),
        table: table.name,
        items: ordered.map(function (item) { return item.name; }).join(" · "),
        time: desk.hms()
      });
      flash = "Kitchen ticket fired · " + table.name + " · " + kitchen[0].time;
      render();
    }));

    actions.appendChild(action("Split bill", !table.items.length || hasUnsent(table), function () {
      table.split = splitPax;
      table.status = "bill";
      flash = "Split " + table.split + " pax · " + desk.rm(total(table) / table.split) + " each";
      render();
    }));

    actions.appendChild(action("Settle table", table.status !== "bill", function () {
      var paid = total(table);
      today = round(today + paid);
      table.status = "empty";
      table.items = [];
      table.split = 0;
      table.opened = "";
      flash = "Settled " + desk.rm(paid) + " · today " + desk.rm(today);
      render();
    }, true));
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "desk-flash", flash));

    var stamp = el("div", "stamp on");
    if (table.status === "bill") stamp.textContent = "Bill ready · " + table.split + " pax · " + desk.rm(total(table) / table.split) + " each";
    else if (table.items.length && !hasUnsent(table)) stamp.textContent = "Kitchen fired · bill open";
    else if (table.items.length) stamp.textContent = "QR order received · kitchen pending";
    else stamp.textContent = "Table empty · QR order ready";
    panel.appendChild(stamp);

    panel.appendChild(kitchenPanel());
    return panel;
  }

  function addKv(kv, label, value, cls) {
    kv.appendChild(el("div", "k", label));
    kv.appendChild(el("div", cls || "", value));
  }

  function action(label, disabled, onClick, ghost) {
    var button = el("button", "btn-sm" + (ghost ? " ghost" : ""), label);
    button.type = "button";
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    return button;
  }

  function kitchenPanel() {
    var box = el("div");
    box.appendChild(el("h3", "", "Kitchen queue · " + kitchen.length));
    kitchen.forEach(function (ticket) {
      var row = el("div", "tx");
      var left = el("div");
      left.appendChild(el("div", "", ticket.id + " · " + ticket.table));
      left.appendChild(el("div", "sub", ticket.items));
      row.appendChild(left);
      row.appendChild(el("div", "amt", ticket.time));
      box.appendChild(row);
    });
    return box;
  }

  render();
};
