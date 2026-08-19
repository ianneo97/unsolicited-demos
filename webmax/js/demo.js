window.mountDemo = function (root) {
  injectCss();

  var nextPart = 20;
  var tab = "job";
  var selected = "v1";
  var waMsg = "";

  var stock = [
    { id: "s1", name: "185/55 R15 tyre", sku: "TY-185-15", qty: 8, price: 220 },
    { id: "s2", name: "195/55 R16 tyre", sku: "TY-195-16", qty: 6, price: 280 },
    { id: "s3", name: "Engine oil 4L", sku: "OL-4L", qty: 14, price: 85 },
    { id: "s4", name: "Oil filter", sku: "FL-OIL", qty: 11, price: 28 },
    { id: "s5", name: "Brake pad (front)", sku: "BR-F", qty: 4, price: 95 }
  ];

  var jobs = [
    {
      id: "v1", plate: "WVK 3841", make: "Perodua Myvi", year: "2018",
      job: "tukar tayar", status: "serving", time: "08:40",
      owner: "Encik Razak", phone: "+60 12-000 1101",
      km: 68420, size: "185/55 R15", nextDue: "19 Nov 2026", nextBooked: false,
      complaint: "Depan kiri botak. Customer mahu pair depan.",
      labour: 40, einvoice: false, wa: false,
      parts: [
        { id: "p1", stockId: "s1", name: "185/55 R15 tyre", qty: 2, price: 220 }
      ],
      history: [
        { date: "12 Feb 2026", job: "tukar tayar", km: 61200, total: 480 },
        { date: "3 Sep 2025", job: "service", km: 54880, total: 165 }
      ]
    },
    {
      id: "v2", plate: "BNH 2290", make: "Honda City", year: "2016",
      job: "service", status: "waiting", time: "09:05",
      owner: "Puan Mei Ling", phone: "+60 12-000 1102",
      km: 98210, size: "185/55 R16", nextDue: "due now · 10,000 km", nextBooked: false,
      complaint: "10,000 km service. Minyak hitam. Tiada bunyi pelik.",
      labour: 80, einvoice: false, wa: false,
      parts: [
        { id: "p2", stockId: "s3", name: "Engine oil 4L", qty: 1, price: 85 },
        { id: "p3", stockId: "s4", name: "Oil filter", qty: 1, price: 28 }
      ],
      history: [
        { date: "18 Mar 2026", job: "service", km: 88100, total: 190 },
        { date: "9 Jan 2026", job: "alignment", km: 86040, total: 60 }
      ]
    },
    {
      id: "v3", plate: "WYA 1107", make: "Toyota Hilux", year: "2020",
      job: "alignment", status: "waiting", time: "09:20",
      owner: "Encik Kumar", phone: "+60 12-000 1103",
      km: 45200, size: "265/65 R17", nextDue: "2 Feb 2027", nextBooked: false,
      complaint: "Steering tarik ke kanan lepas tukar tayar minggu lepas.",
      labour: 60, einvoice: false, wa: false,
      parts: [],
      history: [
        { date: "11 Aug 2026", job: "tukar tayar", km: 44980, total: 920 }
      ]
    },
    {
      id: "v4", plate: "VAG 5518", make: "Proton Saga", year: "2019",
      job: "tukar tayar", status: "waiting", time: "09:35",
      owner: "Puan Aisyah", phone: "+60 12-000 1104",
      km: 73110, size: "185/55 R15", nextDue: "4 Dec 2026", nextBooked: false,
      complaint: "Tayar belakang pecah paku. Spare dah pakai.",
      labour: 25, einvoice: false, wa: false,
      parts: [
        { id: "p4", stockId: "s1", name: "185/55 R15 tyre", qty: 1, price: 220 }
      ],
      history: [
        { date: "22 May 2026", job: "service", km: 69000, total: 155 }
      ]
    },
    {
      id: "v5", plate: "BQP 7732", make: "Nissan Almera", year: "2021",
      job: "service", status: "waiting", time: "09:50",
      owner: "Encik Daniel", phone: "+60 12-000 1105",
      km: 31840, size: "195/55 R16", nextDue: "due now · brake", nextBooked: false,
      complaint: "Bunyi brake depan. Nak check pad dan minyak.",
      labour: 90, einvoice: false, wa: false,
      parts: [
        { id: "p5", stockId: "s5", name: "Brake pad (front)", qty: 1, price: 95 }
      ],
      history: [
        { date: "14 Apr 2026", job: "service", km: 24100, total: 170 }
      ]
    }
  ];

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findJob(id) {
    var i;
    for (i = 0; i < jobs.length; i++) {
      if (jobs[i].id === id) return jobs[i];
    }
    return jobs[0];
  }

  function findStock(id) {
    var i;
    for (i = 0; i < stock.length; i++) {
      if (stock[i].id === id) return stock[i];
    }
    return null;
  }

  function waiting() {
    return jobs.filter(function (j) { return j.status === "waiting"; });
  }

  function partsTotal(j) {
    return j.parts.reduce(function (s, p) { return s + p.qty * p.price; }, 0);
  }

  function jobTotal(j) {
    return partsTotal(j) + j.labour;
  }

  function jobChip(kind) {
    if (kind === "tukar tayar") return el("span", "tag warn", "tukar tayar");
    if (kind === "alignment") return el("span", "tag", "alignment");
    return el("span", "tag", "service");
  }

  function statusChip(status) {
    if (status === "serving") return el("span", "tag ok", "in bay");
    if (status === "done") return el("span", "tag ok", "done");
    return el("span", "tag", "waiting");
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "WebMax · Selayang morning"));
    bar.appendChild(left);
    var tabs = el("div", "tabs");
    [
      { key: "job", label: "Job card" },
      { key: "stock", label: "Stock" }
    ].forEach(function (t) {
      var b = el("button", "tab" + (tab === t.key ? " on" : ""), t.label);
      b.type = "button";
      b.addEventListener("click", function () {
        tab = t.key;
        render();
      });
      tabs.appendChild(b);
    });
    bar.appendChild(tabs);
    root.appendChild(bar);

    var hintBar = el("div", "shell-bar");
    hintBar.appendChild(el(
      "div",
      "shell-hint",
      "SAMPLE DATA · 5 vehicles · not a live workshop"
    ));
    root.appendChild(hintBar);

    if (tab === "stock") {
      root.appendChild(stockPanel());
      return;
    }

    var j = findJob(selected);
    var grid = el("div", "shell-grid wm-3");
    grid.appendChild(queuePanel());
    grid.appendChild(cardPanel(j));
    grid.appendChild(billPanel(j));
    root.appendChild(grid);
  }

  function queuePanel() {
    var panel = el("div", "panel");
    var head = el("div", "wm-head");
    var waitN = waiting().length;
    head.appendChild(el("h3", "", "Bay · " + waitN + " waiting"));
    var call = el("button", "btn-sm", "Call next");
    call.type = "button";
    call.disabled = waitN === 0;
    call.addEventListener("click", function () {
      jobs.forEach(function (x) {
        if (x.status === "serving") x.status = "done";
      });
      var next = waiting()[0];
      if (next) {
        next.status = "serving";
        selected = next.id;
      }
      waMsg = "";
      render();
    });
    head.appendChild(call);
    panel.appendChild(head);

    var list = el("div", "list");
    jobs.forEach(function (j) {
      var t = el("button", "ticket" + (j.id === selected ? " on" : "") + (j.status === "done" ? " wm-done" : ""));
      t.type = "button";
      var qwrap = el("div", "wm-qwrap");
      qwrap.appendChild(el("div", "wm-qno", j.plate.split(" ")[0]));
      var body = el("div", "wm-grow");
      body.appendChild(el("div", "who", j.plate + " · " + j.owner.split(" ").slice(-1)[0]));
      body.appendChild(el("div", "meta", j.km.toLocaleString("en-MY") + " km · " + j.job + " · " + j.time));
      t.appendChild(qwrap);
      t.appendChild(body);
      var chips = el("div", "wm-chips");
      chips.appendChild(jobChip(j.job));
      chips.appendChild(statusChip(j.status));
      t.appendChild(chips);
      t.addEventListener("click", function () {
        selected = j.id;
        waMsg = "";
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    if (waitN === 0) {
      panel.appendChild(el("p", "empty", "Morning bay clear."));
    }
    return panel;
  }

  function cardPanel(j) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Job card"));
    panel.appendChild(el("div", "serving-name", j.plate));
    panel.appendChild(el("p", "wm-sub", j.make + " · " + j.year + " · " + j.size));

    var kv = el("div", "wm-kv");
    kv.appendChild(el("div", "k", "Owner"));
    kv.appendChild(el("div", "", j.owner + " · sample"));
    kv.appendChild(el("div", "k", "Phone"));
    kv.appendChild(el("div", "", j.phone));
    kv.appendChild(el("div", "k", "Odometer"));
    var kmWrap = el("div", "wm-km-row");
    var km = el("input", "field wm-km");
    km.type = "number";
    km.min = "0";
    km.step = "10";
    km.value = String(j.km);
    km.setAttribute("aria-label", "Odometer km");
    km.addEventListener("change", function () {
      var n = Number(km.value);
      j.km = isNaN(n) || n < 0 ? j.km : Math.round(n);
      render();
    });
    kmWrap.appendChild(km);
    kmWrap.appendChild(el("span", "meta", "km"));
    kv.appendChild(kmWrap);
    kv.appendChild(el("div", "k", "Next service"));
    kv.appendChild(el("div", j.nextBooked ? "" : "wm-due", j.nextBooked ? "booked · " + j.nextDue : j.nextDue));
    panel.appendChild(kv);

    panel.appendChild(el("label", "lbl", "Last jobs · this plate"));
    j.history.forEach(function (h) {
      var row = el("div", "tx");
      var left = el("div");
      left.appendChild(el("div", "", h.job));
      left.appendChild(el("div", "sub", h.date + " · " + h.km.toLocaleString("en-MY") + " km"));
      row.appendChild(left);
      row.appendChild(el("div", "amt", rm(h.total)));
      panel.appendChild(row);
    });

    panel.appendChild(el("label", "lbl", "Complaint"));
    var cc = el("textarea", "field wm-cc");
    cc.rows = 2;
    cc.value = j.complaint;
    cc.setAttribute("aria-label", "Job complaint");
    cc.addEventListener("input", function () {
      j.complaint = cc.value;
    });
    panel.appendChild(cc);

    panel.appendChild(el("label", "lbl", "Parts"));
    if (!j.parts.length) {
      panel.appendChild(el("p", "empty", "No parts on this card."));
    }
    j.parts.forEach(function (p) {
      var row = el("div", "wm-part");
      var left = el("div", "wm-grow");
      left.appendChild(el("div", "", p.name));
      left.appendChild(el("div", "meta", p.qty + " × " + rm(p.price)));
      row.appendChild(left);
      row.appendChild(el("div", "money", rm(p.qty * p.price)));
      var rmBtn = el("button", "btn-sm ghost wm-x", "Remove");
      rmBtn.type = "button";
      rmBtn.addEventListener("click", function () {
        var item = findStock(p.stockId);
        if (item) item.qty += p.qty;
        j.parts = j.parts.filter(function (x) { return x.id !== p.id; });
        render();
      });
      row.appendChild(rmBtn);
      panel.appendChild(row);
    });

    var addRow = el("div", "row");
    var sel = el("select", "select wm-add");
    sel.setAttribute("aria-label", "Add part from stock");
    stock.forEach(function (s) {
      var opt = el("option", "", s.name + " · " + rm(s.price) + " · " + s.qty + " left");
      opt.value = s.id;
      opt.disabled = s.qty < 1;
      sel.appendChild(opt);
    });
    var add = el("button", "btn-sm", "Add part");
    add.type = "button";
    add.addEventListener("click", function () {
      var item = findStock(sel.value);
      if (!item || item.qty < 1) return;
      var existing = null;
      j.parts.forEach(function (p) {
        if (p.stockId === item.id) existing = p;
      });
      if (existing) {
        existing.qty += 1;
      } else {
        j.parts.push({
          id: "p" + (nextPart++),
          stockId: item.id,
          name: item.name,
          qty: 1,
          price: item.price
        });
      }
      item.qty -= 1;
      render();
    });
    addRow.appendChild(sel);
    addRow.appendChild(add);
    panel.appendChild(addRow);

    panel.appendChild(el("label", "lbl", "Labour (MYR)"));
    var lab = el("input", "field");
    lab.type = "number";
    lab.min = "0";
    lab.step = "5";
    lab.value = String(j.labour);
    lab.setAttribute("aria-label", "Labour amount");
    lab.addEventListener("change", function () {
      var n = Number(lab.value);
      j.labour = isNaN(n) || n < 0 ? 0 : n;
      render();
    });
    panel.appendChild(lab);
    return panel;
  }

  function billPanel(j) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Bill"));
    panel.appendChild(el("p", "wm-sub", j.owner + " · " + j.plate + " · sample"));

    var parts = el("div", "tx");
    parts.appendChild(el("div", "", "Parts"));
    parts.appendChild(el("div", "amt", rm(partsTotal(j))));
    panel.appendChild(parts);

    var labour = el("div", "tx");
    labour.appendChild(el("div", "", "Labour"));
    labour.appendChild(el("div", "amt", rm(j.labour)));
    panel.appendChild(labour);

    var pl = el("div", "pl");
    var tot = el("div", "pl-row total");
    tot.appendChild(el("div", "", "Total"));
    tot.appendChild(el("div", "money", rm(jobTotal(j))));
    pl.appendChild(tot);
    panel.appendChild(pl);

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = j.einvoice;
    box.addEventListener("change", function () {
      j.einvoice = box.checked;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("MyInvois / e-invoice"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (j.einvoice ? " on" : ""));
    stamp.textContent = j.einvoice
      ? "MyInvois (sample) · MYINV-SAMPLE-" + j.plate.replace(/\s+/g, "") + "-0819"
      : "Paper jobsheet · e-invoice off";
    panel.appendChild(stamp);

    var actions = el("div", "actions");
    var book = el("button", "btn-sm" + (j.nextBooked ? " ghost" : ""), j.nextBooked ? "Next service booked" : "Book next service");
    book.type = "button";
    book.disabled = j.nextBooked;
    book.addEventListener("click", function () {
      j.nextBooked = true;
      if (j.nextDue.indexOf("due now") === 0) {
        j.nextDue = "19 Nov 2026";
      }
      render();
    });
    actions.appendChild(book);

    var wa = el("button", "btn-sm" + (j.wa ? " ghost" : ""), j.wa ? "WhatsApp queued" : "WhatsApp bill");
    wa.type = "button";
    wa.addEventListener("click", function () {
      j.wa = true;
      waMsg = "queued to " + j.phone + " · " + j.plate + " · " + rm(jobTotal(j)) + " · not sent";
      render();
    });
    actions.appendChild(wa);
    panel.appendChild(actions);

    if (j.nextBooked) {
      panel.appendChild(el("div", "stamp on", "Next service booked · " + j.nextDue + " · " + j.km.toLocaleString("en-MY") + " km today"));
    }
    if (waMsg) {
      panel.appendChild(el("p", "wm-flash", waMsg));
    }
    return panel;
  }

  function stockPanel() {
    var wrap = el("div", "panel");
    wrap.appendChild(el("h3", "", "Stock · tyre bay"));
    wrap.appendChild(el("p", "wm-sub", "SAMPLE DATA · qty drops when you add a part to a job"));

    var list = el("div", "list");
    stock.forEach(function (s) {
      var t = el("div", "ticket wm-stock");
      var body = el("div", "wm-grow");
      body.appendChild(el("div", "who", s.name));
      body.appendChild(el("div", "meta", s.sku + " · " + rm(s.price)));
      t.appendChild(body);
      t.appendChild(el("span", "tag" + (s.qty < 5 ? " warn" : " ok"), s.qty + " left"));
      list.appendChild(t);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function injectCss() {
    if (document.getElementById("webmax-demo-css")) return;
    var s = document.createElement("style");
    s.id = "webmax-demo-css";
    s.textContent = [
      "#demo-root .wm-3{grid-template-columns:minmax(220px,.95fr) minmax(250px,1.15fr) minmax(210px,.9fr)}",
      "#demo-root .wm-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}",
      "#demo-root .wm-head h3{margin-bottom:0}",
      "#demo-root .wm-qwrap{flex:0 0 auto}",
      "#demo-root .wm-qno{font-family:var(--mono);font-weight:600;font-size:13px;letter-spacing:-.03em;min-width:36px;color:color-mix(in srgb,var(--accent) 50%,var(--shell-ink))}",
      "#demo-root .ticket.on .wm-qno{color:var(--shell-ink)}",
      "#demo-root .wm-grow{flex:1;min-width:0}",
      "#demo-root .wm-chips{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:0 0 auto}",
      "#demo-root .ticket.wm-done{opacity:.55}",
      "#demo-root .wm-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .wm-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root textarea.wm-cc{min-height:56px}",
      "#demo-root .wm-part{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--shell-line)}",
      "#demo-root .wm-x{padding:4px 8px;font-size:11px}",
      "#demo-root .wm-add{flex:1;min-width:0;padding:8px 10px;font-size:13px}",
      "#demo-root .ticket.wm-stock{cursor:default}",
      "#demo-root .ticket{align-items:center}",
      "#demo-root .wm-kv{display:grid;grid-template-columns:6.8rem 1fr;gap:7px 12px;font-size:13px;margin:4px 0 10px;align-items:center}",
      "#demo-root .wm-kv .k{color:var(--shell-muted)}",
      "#demo-root .wm-km-row{display:flex;align-items:center;gap:8px}",
      "#demo-root .wm-km{width:7.5rem;padding:6px 8px}",
      "#demo-root .wm-due{color:color-mix(in srgb,var(--accent) 45%,#f0c080)}",
      "@media (max-width:860px){#demo-root .wm-3{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
