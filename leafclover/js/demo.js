window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var bins = ["A-01", "A-02", "A-03", "A-04", "B-01", "B-02", "B-03", "B-04"];
  var selected = "p6";
  var flash = "Inbound PCH-260816-06 is ready for putaway.";
  var nextCharge = 2;
  var storageRate = 1.2;
  var pickFee = 6.5;

  var rows = [
    { id: "p1", client: "Maju Mart Sdn Bhd", sku: "SKU-MJM-240", lot: "PCH-260808-01", inbound: "08 Aug 2026", age: 12, kind: "pallet", bin: "A-03", picked: false, pickedFrom: "" },
    { id: "p2", client: "Dapur Kita Foods", sku: "SKU-DKF-118", lot: "PCH-260810-02", inbound: "10 Aug 2026", age: 10, kind: "carton", bin: "A-01", picked: false, pickedFrom: "" },
    { id: "p3", client: "Rasa Jaya Trading", sku: "SKU-RJT-072", lot: "PCH-260811-03", inbound: "11 Aug 2026", age: 9, kind: "pallet", bin: "B-02", picked: false, pickedFrom: "" },
    { id: "p4", client: "Kedai Mesra Utara", sku: "SKU-KMU-311", lot: "PCH-260813-04", inbound: "13 Aug 2026", age: 7, kind: "carton", bin: "A-04", picked: false, pickedFrom: "" },
    { id: "p5", client: "Bumi Segar Supply", sku: "SKU-BSS-450", lot: "PCH-260814-05", inbound: "14 Aug 2026", age: 6, kind: "pallet", bin: "B-01", picked: false, pickedFrom: "" },
    { id: "p6", client: "Nusa Home Retail", sku: "SKU-NHR-205", lot: "PCH-260816-06", inbound: "16 Aug 2026", age: 4, kind: "carton", bin: "", picked: false, pickedFrom: "" },
    { id: "p7", client: "Sinar Pagi Niaga", sku: "SKU-SPN-093", lot: "PCH-260817-07", inbound: "17 Aug 2026", age: 3, kind: "pallet", bin: "", picked: false, pickedFrom: "" },
    { id: "p8", client: "Tiga Bintang Mart", sku: "SKU-TBM-166", lot: "PCH-260818-08", inbound: "18 Aug 2026", age: 2, kind: "carton", bin: "", picked: false, pickedFrom: "" }
  ];

  var charges = [
    { id: "CHG-001", label: "Opening storage", detail: "44 pallet-days × RM 1.20/day", amount: 52.8, time: "20 Aug 2026 · opening" }
  ];

  function find(id) { return desk.find(rows, id); }

  function freeBin() {
    return bins.filter(function (bin) {
      return !rows.some(function (r) { return !r.picked && r.bin === bin; });
    })[0] || "";
  }

  function oldest() {
    return rows.filter(function (r) {
      return r.bin && !r.picked;
    }).reduce(function (best, r) {
      return !best || r.age > best.age ? r : best;
    }, null);
  }

  function total() {
    return charges.reduce(function (sum, charge) { return sum + charge.amount; }, 0);
  }

  function addCharge(label, detail, amount) {
    charges.push({
      id: "CHG-" + desk.pad(nextCharge++, 3),
      label: label,
      detail: detail,
      amount: amount,
      time: desk.stamp("20 Aug 2026")
    });
  }

  function putaway(r) {
    var bin = freeBin();
    if (r.picked) {
      flash = r.lot + " was already picked from " + r.pickedFrom + ".";
    } else if (r.bin) {
      flash = r.lot + " is already in bin " + r.bin + ".";
    } else if (!bin) {
      flash = "No free bin. FIFO pick a lot first.";
    } else {
      r.bin = bin;
      var amount = r.age * storageRate;
      addCharge("Storage · " + r.client, r.age + "d × " + desk.rm(storageRate) + "/day · " + bin, amount);
      flash = "Putaway · " + r.lot + " → " + bin + " · storage " + r.age + "d added.";
    }
    render();
  }

  function fifoPick() {
    var r = oldest();
    if (!r) {
      flash = "No stored lot is available to pick.";
    } else {
      var bin = r.bin;
      r.picked = true;
      r.pickedFrom = bin;
      r.bin = "";
      selected = r.id;
      addCharge("FIFO pick · " + r.client, r.lot + " · " + bin, pickFee);
      flash = "FIFO picked " + r.lot + " · oldest: " + r.age + "d in bin " + bin + ".";
    }
    render();
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", (c && c.name ? c.name : "LeafClover") + " · Puchong warehouse"));
    bar.appendChild(el("div", "shell-hint", rows.filter(function (r) { return r.bin; }).length + "/8 bins · billable " + desk.rm(total())));
    root.appendChild(bar);

    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · Port Klang inbound · not Gussmann ROT/POD · not Flitz last-mile · " + desk.hms()));
    root.appendChild(sample);

    var r = find(selected);
    var grid = el("div", "shell-grid desk-3");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(r));
    grid.appendChild(boardPanel());
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Inbound · 8 lots"));
    var list = el("div", "list");
    rows.forEach(function (r) {
      var ticket = el("button", "ticket" + (r.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", r.client));
      body.appendChild(el("div", "meta", r.sku + " · " + r.lot + " · " + r.age + "d"));
      ticket.appendChild(body);
      ticket.appendChild(el("span", "tag" + (r.picked ? " gone" : r.bin ? " ok" : " warn"), r.picked ? "picked" : (r.bin || "inbound")));
      ticket.addEventListener("click", function () {
        selected = r.id;
        flash = "Selected " + r.lot + " · " + r.age + "d old.";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function detailPanel(r) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Lot · " + r.lot));
    panel.appendChild(el("div", "serving-name", r.client));
    panel.appendChild(el("p", "desk-sub", r.kind + " inbound from Port Klang · sample"));

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "SKU"));
    kv.appendChild(el("div", "", r.sku));
    kv.appendChild(el("div", "k", "Inbound"));
    kv.appendChild(el("div", "", r.inbound));
    kv.appendChild(el("div", "k", "Lot age"));
    kv.appendChild(el("div", "", r.age + " days"));
    kv.appendChild(el("div", "k", "Location"));
    kv.appendChild(el("div", "", r.picked ? "picked from " + r.pickedFrom : (r.bin || "inbound staging")));
    kv.appendChild(el("div", "k", "Storage"));
    kv.appendChild(el("div", "", desk.rm(storageRate) + " / pallet-day"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var put = el("button", "btn-sm", "Putaway");
    put.type = "button";
    put.disabled = !!r.bin || r.picked || !freeBin();
    put.addEventListener("click", function () { putaway(r); });
    actions.appendChild(put);
    var pick = el("button", "btn-sm ghost", "FIFO pick");
    pick.type = "button";
    pick.disabled = !oldest();
    pick.addEventListener("click", fifoPick);
    actions.appendChild(pick);
    panel.appendChild(actions);
    panel.appendChild(el("p", "desk-flash", flash));

    if (r.picked) {
      panel.appendChild(el("div", "stamp on", "PICKED · " + r.lot + " · from " + r.pickedFrom));
    } else if (r.bin) {
      panel.appendChild(el("div", "stamp on", "STORED · " + r.lot + " · bin " + r.bin));
    }
    return panel;
  }

  function boardPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Bins + billable"));
    panel.appendChild(el("p", "desk-sub", "Storage " + desk.rm(storageRate) + "/day · pick " + desk.rm(pickFee)));

    var map = el("div", "desk-map");
    bins.forEach(function (bin) {
      var hit = rows.filter(function (r) { return !r.picked && r.bin === bin; })[0];
      var cell = el("div", "desk-cell" + (hit ? " has" : "") + (hit && hit.id === selected ? " on" : ""), bin + (hit ? " · " + hit.lot.slice(-2) : " · free"));
      map.appendChild(cell);
    });
    panel.appendChild(map);

    var sum = el("div", "pl");
    var totalRow = el("div", "pl-row total");
    totalRow.appendChild(el("div", "", "Running total"));
    totalRow.appendChild(el("div", "money", desk.rm(total())));
    sum.appendChild(totalRow);
    panel.appendChild(sum);

    charges.slice().reverse().forEach(function (charge) {
      var receipt = el("div", "stamp on");
      receipt.appendChild(el("div", "", charge.id + " · " + charge.label + " · " + desk.rm(charge.amount)));
      receipt.appendChild(el("div", "meta", charge.detail + " · " + charge.time));
      panel.appendChild(receipt);
    });
    return panel;
  }

  render();
};
