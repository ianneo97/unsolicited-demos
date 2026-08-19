window.mountDemo = function (root) {
  injectCss();

  var selected = "c1";
  var flash = "";

  function nowStamp() {
    var d = new Date();
    function p(n) { return n < 10 ? "0" + n : String(n); }
    return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }

  var kids = [
    { id: "c1", name: "Aina Roslan", age: 5, className: "Kelas Merah", parent: "Puan Roslan", phone: "+60 12-000 3301", allergy: "", status: "out", time: "", outTime: "", fee: 350, feeDue: false, invoice: 0, ping: false },
    { id: "c2", name: "Hakim Zain", age: 4, className: "Kelas Merah", parent: "Encik Zain", phone: "+60 12-000 3302", allergy: "kacang", status: "out", time: "", outTime: "", fee: 350, feeDue: true, invoice: 0, ping: false },
    { id: "c3", name: "Mei Ling", age: 5, className: "Kelas Kuning", parent: "Puan Ling", phone: "+60 12-000 3303", allergy: "", status: "out", time: "", outTime: "", fee: 380, feeDue: false, invoice: 0, ping: false },
    { id: "c4", name: "Arif Hassan", age: 6, className: "Kelas Kuning", parent: "Encik Hassan", phone: "+60 12-000 3304", allergy: "susu", status: "out", time: "", outTime: "", fee: 400, feeDue: true, invoice: 0, ping: false },
    { id: "c5", name: "Siti Zahra", age: 4, className: "Kelas Hijau", parent: "Puan Zahra", phone: "+60 12-000 3305", allergy: "", status: "out", time: "", outTime: "", fee: 350, feeDue: false, invoice: 0, ping: false },
    { id: "c6", name: "Daniel Chong", age: 5, className: "Kelas Hijau", parent: "Encik Chong", phone: "+60 12-000 3306", allergy: "", status: "out", time: "", outTime: "", fee: 350, feeDue: false, invoice: 0, ping: false },
    { id: "c7", name: "Nurul Iman", age: 3, className: "Kelas Biru", parent: "Puan Iman", phone: "+60 12-000 3307", allergy: "", status: "out", time: "", outTime: "", fee: 320, feeDue: false, invoice: 0, ping: false },
    { id: "c8", name: "Rajesh Kumar", age: 6, className: "Kelas Biru", parent: "Encik Kumar", phone: "+60 12-000 3308", allergy: "", status: "out", time: "", outTime: "", fee: 400, feeDue: false, invoice: 0, ping: false }
  ];

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findKid(id) {
    var i;
    for (i = 0; i < kids.length; i++) {
      if (kids[i].id === id) return kids[i];
    }
    return kids[0];
  }

  function inCount() {
    return kids.filter(function (k) { return k.status === "in"; }).length;
  }

  function dueCount() {
    return kids.filter(function (k) { return k.feeDue && k.invoice === 0; }).length;
  }

  function feesToday() {
    return kids.reduce(function (s, k) { return s + k.invoice; }, 0);
  }

  function statusChip(k) {
    if (k.status === "in") return el("span", "tag ok", "IN");
    if (k.status === "absent") return el("span", "tag warn", "absent");
    if (k.status === "gone") return el("span", "tag", "OUT");
    return el("span", "tag", "belum");
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "ClassFlow · tadika morning"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", inCount() + " / 8 IN · " + dueCount() + " fee due · fees " + rm(feesToday())));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 children · not a live tadika"));
    root.appendChild(hint);
    var k = findKid(selected);
    var grid = el("div", "shell-grid cf-2");
    grid.appendChild(boardPanel());
    grid.appendChild(childPanel(k));
    root.appendChild(grid);
  }

  function boardPanel() {
    var panel = el("div", "panel");
    var head = el("div", "cf-head");
    head.appendChild(el("h3", "", "Morning · " + inCount() + " sudah masuk"));
    panel.appendChild(head);
    var list = el("div", "list");
    kids.forEach(function (k) {
      var t = el("button", "ticket" + (k.id === selected ? " on" : "") + (k.status === "in" ? " cf-in" : ""));
      t.type = "button";
      var q = el("div", "cf-qwrap");
      q.appendChild(el("div", "cf-qno", k.className.split(" ")[1].slice(0, 1)));
      var body = el("div", "cf-grow");
      body.appendChild(el("div", "who", k.name));
      var meta = k.className + " · " + k.age + " thn";
      if (k.time) meta += " · in " + k.time;
      if (k.allergy) meta += " · " + k.allergy;
      body.appendChild(el("div", "meta", meta));
      t.appendChild(q);
      t.appendChild(body);
      var chips = el("div", "cf-chips");
      chips.appendChild(statusChip(k));
      if (k.feeDue && k.invoice === 0) chips.appendChild(el("span", "tag warn", "fee due"));
      else if (k.invoice) chips.appendChild(el("span", "tag ok", "invois"));
      t.appendChild(chips);
      t.addEventListener("click", function () {
        selected = k.id;
        flash = "";
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function childPanel(k) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Child · " + k.name));
    panel.appendChild(el("div", "serving-name cf-sticker", k.name));
    panel.appendChild(el("p", "cf-sub", k.age + " thn · " + k.className + " · sample"));

    var kv = el("div", "cf-kv");
    kv.appendChild(el("div", "k", "Parent"));
    kv.appendChild(el("div", "", k.parent + " · " + k.phone));
    kv.appendChild(el("div", "k", "Allergy"));
    kv.appendChild(el("div", k.allergy ? "cf-due" : "", k.allergy || "none"));
    kv.appendChild(el("div", "k", "Status"));
    kv.appendChild(el("div", "", k.status === "in" ? "IN · " + k.time : k.status === "gone" ? "OUT · " + k.outTime : k.status === "absent" ? "absent" : "belum scan"));
    kv.appendChild(el("div", "k", "Yuran August"));
    kv.appendChild(el("div", "", rm(k.fee)));
    kv.appendChild(el("div", "k", "Fee"));
    kv.appendChild(el("div", k.feeDue && !k.invoice ? "cf-due" : "", k.invoice ? "issued " + rm(k.invoice) : (k.feeDue ? "due" : "clear")));
    kv.appendChild(el("div", "k", "Parent ping"));
    kv.appendChild(el("div", "", k.ping ? "sudah sampai · queued" : "none"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var scan = el("button", "btn-sm" + (k.status === "in" ? " ghost" : ""), k.status === "in" ? "Sudah IN" : "Face-scan in");
    scan.type = "button";
    scan.disabled = k.status === "in" || k.status === "absent";
    scan.addEventListener("click", function () {
      k.status = "in";
      k.time = nowStamp();
      flash = "Face-scan · " + k.name + " · IN · " + k.time + " · no camera";
      render();
    });
    actions.appendChild(scan);

    var out = el("button", "btn-sm ghost", "Face-scan out");
    out.type = "button";
    out.disabled = k.status !== "in";
    out.addEventListener("click", function () {
      k.status = "gone";
      k.outTime = nowStamp();
      flash = "Face-scan out · " + k.name + " · " + k.outTime;
      render();
    });
    actions.appendChild(out);

    var abs = el("button", "btn-sm ghost", k.status === "absent" ? "Marked absent" : "Mark absent");
    abs.type = "button";
    abs.disabled = k.status === "in" || k.status === "absent";
    abs.addEventListener("click", function () {
      k.status = "absent";
      flash = "Absent · " + k.name;
      render();
    });
    actions.appendChild(abs);

    var ping = el("button", "btn-sm ghost", k.ping ? "Ping queued" : "Parent “sudah sampai”");
    ping.type = "button";
    ping.disabled = k.ping;
    ping.addEventListener("click", function () {
      k.ping = true;
      flash = "Ping queued · " + k.parent + " · " + k.phone + " · " + k.name + " sudah sampai · not sent";
      render();
    });
    actions.appendChild(ping);

    var inv = el("button", "btn-sm ghost", k.invoice ? "August issued" : "Issue August invoice");
    inv.type = "button";
    inv.disabled = k.invoice > 0;
    inv.addEventListener("click", function () {
      k.invoice = k.fee;
      k.feeDue = false;
      flash = "Invoice August · " + k.name + " · " + rm(k.invoice) + " · fees today " + rm(feesToday());
      render();
    });
    actions.appendChild(inv);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "cf-flash", flash));
    if (k.invoice) {
      panel.appendChild(el("div", "stamp on", "INV-DEMO-CF-0819 · " + k.name + " · " + rm(k.invoice) + " · sample"));
    }
    panel.appendChild(el("p", "empty", "Face-scan is a button. There is no camera. Fees today " + rm(feesToday()) + "."));
    return panel;
  }

  function injectCss() {
    if (document.getElementById("classflow-demo-css")) return;
    if (!document.getElementById("classflow-font")) {
      var l = document.createElement("link");
      l.id = "classflow-font";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap";
      document.head.appendChild(l);
    }
    var s = document.createElement("style");
    s.id = "classflow-demo-css";
    s.textContent = [
      "#demo-root{--shell:#1b1712;--shell-lift:#241e16;--shell-line:#4a3d2c;--shell-ink:#f6ead2;--shell-muted:#b9a88a;background:radial-gradient(circle at 12% 8%,rgba(217,119,6,.18),transparent 42%),#1b1712}",
      "#demo-root .shell-bar{background:#2a2218}",
      "#demo-root .cf-sticker{display:inline-block;font-family:Fraunces,Georgia,serif;background:#f3e2b8;color:#3a2a12;padding:8px 16px 6px;border-radius:3px 12px 3px 12px;transform:rotate(-1.5deg);box-shadow:2px 3px 0 #0003}",
      "#demo-root .ticket{border-radius:14px 4px 14px 4px;background:#261f16}",
      "#demo-root .ticket.cf-in{background:#24301c}",
      "#demo-root .who{font-family:Fraunces,Georgia,serif}",
      "#demo-root .cf-2{grid-template-columns:minmax(260px,1.05fr) minmax(240px,.95fr)}",
      "#demo-root .cf-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}",
      "#demo-root .cf-head h3{margin-bottom:0}",
      "#demo-root .cf-qwrap{flex:0 0 auto}",
      "#demo-root .cf-qno{font-family:var(--mono);font-weight:600;font-size:15px;min-width:22px;color:color-mix(in srgb,var(--accent) 50%,var(--shell-ink))}",
      "#demo-root .ticket.on .cf-qno{color:var(--shell-ink)}",
      "#demo-root .cf-grow{flex:1;min-width:0}",
      "#demo-root .cf-chips{display:flex;flex-direction:column;align-items:flex-end;gap:4px}",
      "#demo-root .ticket.cf-in{border-color:color-mix(in srgb,var(--ok) 40%,var(--shell-line))}",
      "#demo-root .cf-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .cf-kv{display:grid;grid-template-columns:7.5rem 1fr;gap:7px 12px;font-size:14px;margin:4px 0 12px}",
      "#demo-root .cf-kv .k{color:var(--shell-muted)}",
      "#demo-root .cf-due{color:color-mix(in srgb,var(--accent) 45%,#f0c080)}",
      "#demo-root .cf-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .cf-2{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
