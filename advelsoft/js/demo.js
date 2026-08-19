window.mountDemo = function (root) {
  injectCss();

  var selected = "u1";
  var flash = "";

  function charge(id, ym, kind, amt, paid) {
    return { id: id, ym: ym, kind: kind, amt: amt, paid: paid };
  }

  function rates(sqft) {
    return {
      maint: Math.round(sqft * 0.30),
      sink: Math.round(sqft * 0.10)
    };
  }

  var units = [
    {
      id: "u1", no: "A-3-12", owner: "Nurul Aina", sqft: 850,
      issuedAug: false, einvoice: false,
      charges: [
        charge("c1", "Jun 2026", "Maintenance", 255, false),
        charge("c2", "Jun 2026", "Sinking fund", 85, false),
        charge("c3", "Jul 2026", "Maintenance", 255, true),
        charge("c4", "Jul 2026", "Sinking fund", 85, true)
      ]
    },
    {
      id: "u2", no: "B-8-05", owner: "Goh Jia Wei", sqft: 1100,
      issuedAug: true, einvoice: false,
      charges: [
        charge("c5", "Jun 2026", "Maintenance", 330, true),
        charge("c6", "Jun 2026", "Sinking fund", 110, true),
        charge("c7", "Jul 2026", "Maintenance", 330, true),
        charge("c8", "Jul 2026", "Sinking fund", 110, true),
        charge("c9", "Aug 2026", "Maintenance", 330, true),
        charge("c10", "Aug 2026", "Sinking fund", 110, true)
      ]
    },
    {
      id: "u3", no: "C-12-01", owner: "Rajeswari Nair", sqft: 980,
      issuedAug: false, einvoice: false,
      charges: [
        charge("c11", "Jun 2026", "Maintenance", 294, false),
        charge("c12", "Jun 2026", "Sinking fund", 98, false),
        charge("c13", "Jul 2026", "Maintenance", 294, false),
        charge("c14", "Jul 2026", "Sinking fund", 98, false)
      ]
    },
    {
      id: "u4", no: "A-15-08", owner: "Ahmad Faiz", sqft: 850,
      issuedAug: false, einvoice: false,
      charges: [
        charge("c15", "Jun 2026", "Maintenance", 255, true),
        charge("c16", "Jun 2026", "Sinking fund", 85, true),
        charge("c17", "Jul 2026", "Maintenance", 255, false),
        charge("c18", "Jul 2026", "Sinking fund", 85, true)
      ]
    },
    {
      id: "u5", no: "D-2-03", owner: "Chloe Tan", sqft: 1250,
      issuedAug: false, einvoice: false,
      charges: [
        charge("c19", "Jun 2026", "Maintenance", 375, true),
        charge("c20", "Jun 2026", "Sinking fund", 125, true),
        charge("c21", "Jul 2026", "Maintenance", 375, true),
        charge("c22", "Jul 2026", "Sinking fund", 125, true)
      ]
    }
  ];

  var nextCharge = 30;

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findUnit(id) {
    var i;
    for (i = 0; i < units.length; i++) {
      if (units[i].id === id) return units[i];
    }
    return units[0];
  }

  function arrearsOf(u) {
    return u.charges.reduce(function (s, c) {
      return s + (c.paid ? 0 : c.amt);
    }, 0);
  }

  function blockArrears() {
    return units.reduce(function (s, u) { return s + arrearsOf(u); }, 0);
  }

  function unpaid(u) {
    return u.charges.filter(function (c) { return !c.paid; });
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Advelsoft · Residensi Demo, Seksyen 13"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", "Block arrears · " + rm(blockArrears())));
    root.appendChild(bar);

    var hintBar = el("div", "shell-bar");
    hintBar.appendChild(el(
      "div",
      "shell-hint",
      "SAMPLE DATA · 5 units · not a live JMB"
    ));
    root.appendChild(hintBar);

    var u = findUnit(selected);
    var grid = el("div", "shell-grid ad-2");
    grid.appendChild(unitPanel());
    grid.appendChild(ledgerPanel(u));
    root.appendChild(grid);
  }

  function unitPanel() {
    var panel = el("div", "panel");
    var owing = units.filter(function (u) { return arrearsOf(u) > 0; }).length;
    panel.appendChild(el("h3", "", "Units · " + owing + " in arrears"));

    var list = el("div", "list");
    units.forEach(function (u) {
      var due = arrearsOf(u);
      var t = el("button", "ticket" + (u.id === selected ? " on" : ""));
      t.type = "button";
      var qwrap = el("div", "ad-qwrap");
      qwrap.appendChild(el("div", "ad-qno", u.no.split("-")[0]));
      var body = el("div", "ad-grow");
      body.appendChild(el("div", "who", u.no + " · " + u.owner));
      body.appendChild(el("div", "meta", u.sqft + " sq ft · sample owner"));
      t.appendChild(qwrap);
      t.appendChild(body);
      if (due > 0) t.appendChild(el("span", "tag warn", rm(due)));
      else t.appendChild(el("span", "tag ok", "clear"));
      t.addEventListener("click", function () {
        selected = u.id;
        flash = "";
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function ledgerPanel(u) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Ledger · " + u.no));
    panel.appendChild(el("div", "serving-name", u.owner));
    panel.appendChild(el("p", "ad-sub", u.no + " · " + u.sqft + " sq ft · Residensi Demo"));

    var due = arrearsOf(u);
    var kv = el("div", "ad-kv");
    kv.appendChild(el("div", "k", "Running arrears"));
    kv.appendChild(el("div", "money" + (due > 0 ? " ad-due" : ""), rm(due)));
    kv.appendChild(el("div", "k", "Share of block"));
    kv.appendChild(el("div", "", u.sqft + " / 5,030 sq ft"));
    panel.appendChild(kv);

    u.charges.forEach(function (c) {
      var row = el("div", "tx" + (c.paid ? " ad-paid" : ""));
      var left = el("div");
      left.appendChild(el("div", "", c.kind));
      left.appendChild(el("div", "sub", c.ym + " · " + (c.paid ? "paid" : "open")));
      row.appendChild(left);
      row.appendChild(el("div", "amt", rm(c.amt)));
      panel.appendChild(row);
    });

    var actions = el("div", "actions");
    var issue = el("button", "btn-sm" + (u.issuedAug ? " ghost" : ""), u.issuedAug ? "August issued" : "Issue August bill");
    issue.type = "button";
    issue.disabled = u.issuedAug;
    issue.addEventListener("click", function () {
      var r = rates(u.sqft);
      u.charges.push(charge("c" + (nextCharge++), "Aug 2026", "Maintenance", r.maint, false));
      u.charges.push(charge("c" + (nextCharge++), "Aug 2026", "Sinking fund", r.sink, false));
      u.issuedAug = true;
      flash = "August bill issued · " + u.no + " · " + rm(r.maint + r.sink) + " added to arrears";
      render();
    });
    actions.appendChild(issue);

    var pay = el("button", "btn-sm ghost", "Mark paid");
    pay.type = "button";
    pay.disabled = unpaid(u).length === 0;
    pay.addEventListener("click", function () {
      var open = unpaid(u)[0];
      if (!open) return;
      open.paid = true;
      flash = "Received · " + open.kind + " · " + open.ym + " · " + rm(open.amt) + " · arrears now " + rm(arrearsOf(u));
      render();
    });
    actions.appendChild(pay);
    panel.appendChild(actions);

    if (flash) {
      panel.appendChild(el("p", "ad-flash", flash));
    }

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = u.einvoice;
    box.addEventListener("change", function () {
      u.einvoice = box.checked;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("MyInvois / e-statement"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (u.einvoice ? " on" : ""));
    stamp.textContent = u.einvoice
      ? "e-statement (sample) · ADV-EST-" + u.no.replace(/-/g, "") + "-0819"
      : "Paper statement · e-statement off";
    panel.appendChild(stamp);
    return panel;
  }

  function injectCss() {
    if (document.getElementById("advelsoft-demo-css")) return;
    var s = document.createElement("style");
    s.id = "advelsoft-demo-css";
    s.textContent = [
      "#demo-root .ad-2{grid-template-columns:minmax(240px,.95fr) minmax(280px,1.15fr)}",
      "#demo-root .ad-qwrap{flex:0 0 auto}",
      "#demo-root .ad-qno{font-family:var(--mono);font-weight:600;font-size:15px;letter-spacing:-.03em;min-width:28px;color:color-mix(in srgb,var(--accent) 45%,var(--shell-ink))}",
      "#demo-root .ticket.on .ad-qno{color:var(--shell-ink)}",
      "#demo-root .ad-grow{flex:1;min-width:0}",
      "#demo-root .ad-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .ad-kv{display:grid;grid-template-columns:9rem 1fr;gap:8px 14px;font-size:14px;margin:4px 0 14px}",
      "#demo-root .ad-kv .k{color:var(--shell-muted)}",
      "#demo-root .ad-due{color:color-mix(in srgb,var(--accent) 40%,#f0c080)}",
      "#demo-root .tx.ad-paid{opacity:.55}",
      "#demo-root .ad-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .ad-2{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
