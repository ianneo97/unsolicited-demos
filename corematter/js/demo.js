window.mountDemo = function (root) {
  injectCss();

  var selected = "m1";
  var pdfOn = false;
  var tick = null;
  var nextBill = 1;

  var matters = [
    {
      id: "m1", no: "CM-2411", title: "Sale of Lot 88, SS2",
      kind: "conveyancing", client: "Encik Razak (sample)",
      rate: 400, clientAc: 12000, officeAc: 0, wip: 0, minutes: 0, disb: 0,
      running: false, lastBill: 0, billNo: "", log: []
    },
    {
      id: "m2", no: "CM-2503", title: "Saman vs Kedai Demo",
      kind: "litigation", client: "Puan Mei Ling (sample)",
      rate: 350, clientAc: 3000, officeAc: 800, wip: 140, minutes: 24, disb: 0,
      running: false, lastBill: 0, billNo: "", log: [{ min: 24, note: "Review affidavits", amt: 140 }]
    },
    {
      id: "m3", no: "CM-2507", title: "Retainer · Atap Trading",
      kind: "retainer", client: "Atap Trading Sdn Bhd (sample)",
      rate: 300, clientAc: 5000, officeAc: 1500, wip: 0, minutes: 0, disb: 0,
      running: false, lastBill: 0, billNo: "", log: []
    }
  ];

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findMatter(id) {
    var i;
    for (i = 0; i < matters.length; i++) {
      if (matters[i].id === id) return matters[i];
    }
    return matters[0];
  }

  function timeWip(m) {
    return Math.round((m.minutes / 60) * m.rate * 100) / 100;
  }

  function wipOf(m) {
    return Math.round((timeWip(m) + m.disb) * 100) / 100;
  }

  function sstOf(n) {
    return Math.round(n * 0.08 * 100) / 100;
  }

  function stopTick() {
    if (tick) {
      clearInterval(tick);
      tick = null;
    }
  }

  function startTick() {
    stopTick();
    tick = setInterval(function () {
      var m = findMatter(selected);
      if (!m.running) {
        stopTick();
        return;
      }
      m.minutes += 1;
      m.wip = wipOf(m);
      render();
    }, 1000);
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "CoreMatter · sole-prop desk"));
    bar.appendChild(left);
    var office = matters.reduce(function (s, x) { return s + x.officeAc; }, 0);
    var trust = matters.reduce(function (s, x) { return s + x.clientAc; }, 0);
    bar.appendChild(el("div", "shell-hint", "Trust " + rm(trust) + " · office " + rm(office)));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 3 matters · not a live firm"));
    root.appendChild(hint);
    var m = findMatter(selected);
    var grid = el("div", "shell-grid cm-2");
    grid.appendChild(listPanel());
    grid.appendChild(matterPanel(m));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Matters · 3 files"));
    var list = el("div", "list");
    matters.forEach(function (m) {
      var t = el("button", "ticket" + (m.id === selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "cm-grow");
      body.appendChild(el("div", "who", m.no + " · " + m.kind));
      body.appendChild(el("div", "meta", m.title + " · WIP " + rm(wipOf(m))));
      t.appendChild(body);
      t.appendChild(el("span", "tag" + (m.running ? " ok" : ""), m.running ? "timer" : m.kind));
      t.addEventListener("click", function () {
        selected = m.id;
        pdfOn = false;
        render();
        if (findMatter(selected).running) startTick();
        else stopTick();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function matterPanel(m) {
    m.wip = wipOf(m);
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Matter · " + m.no));
    panel.appendChild(el("div", "serving-name", m.title));
    panel.appendChild(el("p", "cm-sub", m.client + " · " + rm(m.rate) + " / hour"));

    var kv = el("div", "cm-kv");
    kv.appendChild(el("div", "k", "Elapsed"));
    kv.appendChild(el("div", "", m.minutes + " min" + (m.running ? " · running" : "")));
    kv.appendChild(el("div", "k", "Time WIP"));
    kv.appendChild(el("div", "money", rm(timeWip(m))));
    kv.appendChild(el("div", "k", "Disbursement"));
    kv.appendChild(el("div", "money", rm(m.disb)));
    kv.appendChild(el("div", "k", "WIP total"));
    kv.appendChild(el("div", "money", rm(m.wip)));
    kv.appendChild(el("div", "k", "Client account"));
    kv.appendChild(el("div", "money", rm(m.clientAc)));
    kv.appendChild(el("div", "k", "Office account"));
    kv.appendChild(el("div", "money", rm(m.officeAc)));
    panel.appendChild(kv);

    if (m.log.length) {
      panel.appendChild(el("label", "lbl", "Time log"));
      m.log.forEach(function (row) {
        var tx = el("div", "tx");
        tx.appendChild(el("div", "", row.note + " · " + row.min + " min"));
        tx.appendChild(el("div", "amt", rm(row.amt)));
        panel.appendChild(tx);
      });
    }

    var actions = el("div", "actions");
    var start = el("button", "btn-sm" + (m.running ? " ghost" : ""), m.running ? "Stop timer" : "Start timer");
    start.type = "button";
    start.addEventListener("click", function () {
      if (m.running) {
        m.running = false;
        stopTick();
        if (m.minutes) {
          m.log.push({ min: m.minutes, note: "Timer stop", amt: timeWip(m) });
        }
      } else {
        matters.forEach(function (x) { x.running = false; });
        m.running = true;
        startTick();
      }
      render();
    });
    actions.appendChild(start);

    var disb = el("button", "btn-sm ghost", "Add filing RM 50");
    disb.type = "button";
    disb.addEventListener("click", function () {
      m.disb = Math.round((m.disb + 50) * 100) / 100;
      m.wip = wipOf(m);
      render();
    });
    actions.appendChild(disb);

    var trust = el("button", "btn-sm ghost", "Pay into trust RM 500");
    trust.type = "button";
    trust.addEventListener("click", function () {
      m.clientAc = Math.round((m.clientAc + 500) * 100) / 100;
      render();
    });
    actions.appendChild(trust);

    var bill = el("button", "btn-sm ghost", "Raise bill");
    bill.type = "button";
    bill.disabled = m.wip <= 0;
    bill.addEventListener("click", function () {
      var amt = m.wip;
      var fromTrust = Math.min(m.clientAc, amt);
      m.clientAc = Math.round((m.clientAc - fromTrust) * 100) / 100;
      m.officeAc = Math.round((m.officeAc + amt) * 100) / 100;
      m.lastBill = amt;
      m.billNo = "CM-BILL-" + String(nextBill++).padStart(3, "0");
      m.minutes = 0;
      m.disb = 0;
      m.wip = 0;
      m.running = false;
      stopTick();
      pdfOn = false;
      render();
    });
    actions.appendChild(bill);

    var pdf = el("button", "btn-sm ghost", pdfOn ? "Hide SST preview" : "SST PDF");
    pdf.type = "button";
    pdf.addEventListener("click", function () {
      pdfOn = !pdfOn;
      render();
      if (m.running) startTick();
    });
    actions.appendChild(pdf);
    panel.appendChild(actions);

    if (m.lastBill) {
      panel.appendChild(el("p", "cm-flash", m.billNo + " · last bill " + rm(m.lastBill) + " · office now " + rm(m.officeAc)));
    }

    if (pdfOn) {
      var billBase = m.lastBill || m.wip || m.rate;
      var sst = sstOf(billBase);
      var box = el("div", "cm-pdf");
      box.appendChild(el("div", "cm-pdf-h", "SST preview · sample · not a file"));
      box.appendChild(el("div", "", (m.billNo || m.no) + " · " + m.title));
      box.appendChild(el("div", "meta", m.client));
      var pl = el("div", "pl");
      var r1 = el("div", "pl-row");
      r1.appendChild(el("div", "", "Fees + disbursement"));
      r1.appendChild(el("div", "money", rm(billBase)));
      pl.appendChild(r1);
      var r2 = el("div", "pl-row");
      r2.appendChild(el("div", "", "SST 8%"));
      r2.appendChild(el("div", "money", rm(sst)));
      pl.appendChild(r2);
      var r3 = el("div", "pl-row total");
      r3.appendChild(el("div", "", "Total"));
      r3.appendChild(el("div", "money", rm(billBase + sst)));
      pl.appendChild(r3);
      box.appendChild(pl);
      box.appendChild(el("p", "empty", "No download. No fake AI draft."));
      panel.appendChild(box);
    }
    return panel;
  }

  function injectCss() {
    if (document.getElementById("corematter-demo-css")) return;
    var s = document.createElement("style");
    s.id = "corematter-demo-css";
    s.textContent = [
      "#demo-root .cm-2{grid-template-columns:minmax(240px,.9fr) minmax(280px,1.2fr)}",
      "#demo-root .cm-grow{flex:1;min-width:0}",
      "#demo-root .cm-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .cm-kv{display:grid;grid-template-columns:9.5rem 1fr;gap:7px 14px;font-size:14px;margin:4px 0 12px}",
      "#demo-root .cm-kv .k{color:var(--shell-muted)}",
      "#demo-root .cm-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root .cm-pdf{margin-top:12px;padding:12px;border:1px dashed var(--shell-line);border-radius:var(--r);background:var(--shell-lift)}",
      "#demo-root .cm-pdf-h{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--shell-muted);margin-bottom:8px}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .cm-2{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
