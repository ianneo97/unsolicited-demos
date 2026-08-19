window.mountDemo = function (root) {
  injectCss();

  var selected = "u1";
  var flash = "";
  var LATE = 0.10;

  function rates(sqft) {
    return {
      maint: Math.round(sqft * 0.30),
      sink: Math.round(sqft * 0.10)
    };
  }

  var units = [
    {
      id: "u1", no: "A-5-02", owner: "Farah Aziz", phone: "+60 12-000 2201",
      sqft: 850, jul: 340, aug: 0, late: 0, issued: false, wa: false
    },
    {
      id: "u2", no: "B-2-11", owner: "Wong Jia Hao", phone: "+60 12-000 2202",
      sqft: 1100, jul: 0, aug: 0, late: 0, issued: false, wa: false
    },
    {
      id: "u3", no: "C-9-08", owner: "Priya Devi", phone: "+60 12-000 2203",
      sqft: 980, jul: 392, aug: 0, late: 0, issued: false, wa: false
    },
    {
      id: "u4", no: "A-12-04", owner: "Hafiz Omar", phone: "+60 12-000 2204",
      sqft: 850, jul: 340, aug: 0, late: 0, issued: false, wa: false
    },
    {
      id: "u5", no: "D-1-06", owner: "Tan Wei Ming", phone: "+60 12-000 2205",
      sqft: 1250, jul: 0, aug: 0, late: 0, issued: false, wa: false
    }
  ];

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

  function dueOf(u) {
    return u.jul + u.late + u.aug;
  }

  function monthDue() {
    return units.reduce(function (s, u) { return s + u.aug + u.late; }, 0);
  }

  function arrearsCount() {
    return units.filter(function (u) { return dueOf(u) > 0; }).length;
  }

  function paidThisMonth() {
    return units.reduce(function (s, u) {
      if (!u.issued) return s;
      var r = rates(u.sqft);
      var billed = r.maint + r.sink + u.late;
      return s + (billed - u.aug);
    }, 0);
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "myLivin' · Residensi Demo, SS7"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", "This month still due · " + rm(monthDue())));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · treasurer · " + arrearsCount() + " in arrears · not a live JMB"));
    root.appendChild(hint);
    var u = findUnit(selected);
    var grid = el("div", "shell-grid lv-2");
    grid.appendChild(unitPanel());
    grid.appendChild(monthPanel(u));
    root.appendChild(grid);
  }

  function unitPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Units · " + arrearsCount() + " in arrears"));
    var list = el("div", "list");
    units.forEach(function (u) {
      var due = dueOf(u);
      var t = el("button", "ticket" + (u.id === selected ? " on" : ""));
      t.type = "button";
      var q = el("div", "lv-qwrap");
      q.appendChild(el("div", "lv-qno", u.no.split("-")[0]));
      var body = el("div", "lv-grow");
      body.appendChild(el("div", "who", u.no + " · " + u.owner));
      var meta = u.sqft + " sq ft";
      if (u.jul) meta += " · Jul open " + rm(u.jul);
      else meta += " · Jul clear";
      body.appendChild(el("div", "meta", meta));
      t.appendChild(q);
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

  function monthPanel(u) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "This month · " + u.no));
    panel.appendChild(el("div", "serving-name", u.owner));
    panel.appendChild(el("p", "lv-sub", u.no + " · Residensi Demo, SS7 · sample"));

    var r = rates(u.sqft);
    var kv = el("div", "lv-kv");
    kv.appendChild(el("div", "k", "Jul still open"));
    kv.appendChild(el("div", "money" + (u.jul ? " lv-due" : ""), rm(u.jul)));
    kv.appendChild(el("div", "k", "Late interest 10%"));
    kv.appendChild(el("div", "money" + (u.late ? " lv-due" : ""), rm(u.late)));
    kv.appendChild(el("div", "k", "Aug maintenance"));
    kv.appendChild(el("div", "", u.issued ? rm(r.maint) : "not issued"));
    kv.appendChild(el("div", "k", "Aug sinking"));
    kv.appendChild(el("div", "", u.issued ? rm(r.sink) : "not issued"));
    kv.appendChild(el("div", "k", "Due now"));
    kv.appendChild(el("div", "money" + (dueOf(u) ? " lv-due" : ""), rm(dueOf(u))));
    panel.appendChild(kv);

    var mix = el("div", "lv-mix");
    mix.appendChild(el("div", "meta", "Block this month"));
    mix.appendChild(el("div", "", "Still due " + rm(monthDue()) + " · paid after issue " + rm(Math.max(0, paidThisMonth()))));
    panel.appendChild(mix);

    var actions = el("div", "actions");
    var issue = el("button", "btn-sm" + (u.issued ? " ghost" : ""), u.issued ? "August issued" : "Issue August");
    issue.type = "button";
    issue.disabled = u.issued;
    issue.addEventListener("click", function () {
      var rr = rates(u.sqft);
      u.aug = rr.maint + rr.sink;
      if (u.jul > 0) u.late = Math.round(u.jul * LATE);
      u.issued = true;
      flash = "August issued · " + u.no + " · " + rm(u.aug) + (u.late ? " + late " + rm(u.late) : " · no late");
      render();
    });
    actions.appendChild(issue);

    var pay = el("button", "btn-sm ghost", "Receive payment");
    pay.type = "button";
    pay.disabled = dueOf(u) === 0;
    pay.addEventListener("click", function () {
      var got = 0;
      var which = "";
      if (u.jul > 0) {
        got = u.jul;
        which = "Jul " + rm(got);
        u.jul = 0;
      } else if (u.late > 0) {
        got = u.late;
        which = "late " + rm(got);
        u.late = 0;
      } else if (u.aug > 0) {
        got = u.aug;
        which = "Aug " + rm(got);
        u.aug = 0;
      }
      flash = "Received · " + which + " · due now " + rm(dueOf(u));
      render();
    });
    actions.appendChild(pay);

    var wa = el("button", "btn-sm ghost" + (u.wa ? "" : ""), u.wa ? "Pay link queued" : "Queue WhatsApp pay link");
    wa.type = "button";
    wa.disabled = dueOf(u) === 0 || u.wa;
    wa.addEventListener("click", function () {
      u.wa = true;
      flash = "queued to " + u.phone + " · pay " + rm(dueOf(u)) + " · " + u.no + " · not sent";
      render();
    });
    actions.appendChild(wa);
    panel.appendChild(actions);

    if (flash) panel.appendChild(el("p", "lv-flash", flash));
    panel.appendChild(el("p", "empty", "Late interest is 10% of Jul, only if August is issued while Jul is still open."));
    return panel;
  }

  function injectCss() {
    if (document.getElementById("mylivin-demo-css")) return;
    var s = document.createElement("style");
    s.id = "mylivin-demo-css";
    s.textContent = [
      "#demo-root .lv-2{grid-template-columns:minmax(240px,.95fr) minmax(280px,1.15fr)}",
      "#demo-root .lv-qwrap{flex:0 0 auto}",
      "#demo-root .lv-qno{font-family:var(--mono);font-weight:600;font-size:15px;min-width:28px;color:color-mix(in srgb,var(--accent) 45%,var(--shell-ink))}",
      "#demo-root .ticket.on .lv-qno{color:var(--shell-ink)}",
      "#demo-root .lv-grow{flex:1;min-width:0}",
      "#demo-root .lv-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .lv-kv{display:grid;grid-template-columns:10rem 1fr;gap:7px 14px;font-size:14px;margin:4px 0 12px}",
      "#demo-root .lv-kv .k{color:var(--shell-muted)}",
      "#demo-root .lv-due{color:color-mix(in srgb,var(--accent) 40%,#f0c080)}",
      "#demo-root .lv-mix{margin-bottom:12px;font-size:13px}",
      "#demo-root .lv-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .lv-2{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
