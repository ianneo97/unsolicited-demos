window.mountDemo = function (root) {
  injectCss();

  var CATS = ["Sales", "COGS", "Opex", "Owner"];
  var OPEN = 8200;
  var selected = "t1";
  var submitted = false;

  var txs = [
    {
      id: "t1", date: "19 Aug", bank: "Maybank · *4421",
      who: "Received · Kedai Runcit Kim Huat", memo: "POS settlement · 18 Aug",
      amt: 1860, cat: "", suggest: "Sales", flag: ""
    },
    {
      id: "t2", date: "18 Aug", bank: "Maybank · *4421",
      who: "Shopee Ads", memo: "Campaign · kopi pack",
      amt: -186.5, cat: "", suggest: "Opex", flag: ""
    },
    {
      id: "t3", date: "17 Aug", bank: "Maybank · *4421",
      who: "Rent · Jalan Bandar Rawang", memo: "August shop lot",
      amt: -2800, cat: "", suggest: "Opex", flag: "rent"
    },
    {
      id: "t4", date: "16 Aug", bank: "Maybank · *4421",
      who: "Grab / petrol", memo: "Delivery run · Rawang",
      amt: -94.2, cat: "", suggest: "Opex", flag: ""
    },
    {
      id: "t5", date: "15 Aug", bank: "Maybank · *4421",
      who: "Received · Acme Trading", memo: "INV-DEMO-1042 paid",
      amt: 2400, cat: "", suggest: "Sales", flag: "acme"
    },
    {
      id: "t6", date: "14 Aug", bank: "Maybank · *4421",
      who: "Pasar Borong Selayang", memo: "Supplier · raw goods",
      amt: -420, cat: "", suggest: "COGS", flag: ""
    },
    {
      id: "t7", date: "13 Aug", bank: "Maybank · *4421",
      who: "Owner draw", memo: "Transfer to personal",
      amt: -800, cat: "", suggest: "Owner", flag: ""
    },
    {
      id: "t8", date: "12 Aug", bank: "CIMB · *1187",
      who: "TNG merchant", memo: "Weekend POS · shop",
      amt: 640, cat: "", suggest: "Sales", flag: ""
    }
  ];

  function money(n) {
    var neg = n < 0;
    var parts = Math.abs(n).toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (neg ? "−" : "") + "RM " + parts.join(".");
  }

  function findTx(id) {
    var i;
    for (i = 0; i < txs.length; i++) {
      if (txs[i].id === id) return txs[i];
    }
    return txs[0];
  }

  function uncat() {
    return txs.filter(function (t) { return !t.cat; });
  }

  function rentPosted() {
    var t = txs.filter(function (x) { return x.flag === "rent"; })[0];
    return t && t.cat === "Opex";
  }

  function acmePosted() {
    var t = txs.filter(function (x) { return x.flag === "acme"; })[0];
    return t && t.cat === "Sales";
  }

  function books() {
    var sales = 0;
    var cogs = 0;
    var opex = 0;
    var owner = 0;
    txs.forEach(function (t) {
      if (!t.cat) return;
      if (t.cat === "Sales") sales += t.amt;
      else if (t.cat === "COGS") cogs += Math.abs(t.amt);
      else if (t.cat === "Opex") opex += Math.abs(t.amt);
      else if (t.cat === "Owner") owner += Math.abs(t.amt);
    });
    return {
      sales: sales,
      cogs: cogs,
      opex: opex,
      owner: owner,
      gross: sales - cogs,
      net: sales - cogs - opex
    };
  }

  function forecast() {
    var b = books();
    var postedOut = b.cogs + b.opex + b.owner;
    var open = OPEN + b.sales - postedOut;
    var days = [
      { date: "20 Aug", dow: "Thu", items: [] },
      { date: "21 Aug", dow: "Fri", items: [{ label: "Shopee Ads · booked", amt: -120 }] },
      { date: "22 Aug", dow: "Sat", items: [{ label: "TNB · shop", amt: -340 }] },
      { date: "23 Aug", dow: "Sun", items: [] },
      { date: "24 Aug", dow: "Mon", items: [] },
      { date: "25 Aug", dow: "Tue", items: [{ label: "Wages · 2 staff", amt: -2400 }] },
      { date: "26 Aug", dow: "Wed", items: [] }
    ];
    if (!rentPosted()) {
      days[5].items.push({ label: "Rent still due", amt: -2800 });
    }
    var run = open;
    var peak = Math.max(open, 1);
    days.forEach(function (d) {
      d.net = 0;
      d.items.forEach(function (it) { d.net += it.amt; });
      run += d.net;
      d.close = run;
      if (Math.abs(d.close) > peak) peak = Math.abs(d.close);
      if (open > peak) peak = open;
    });
    return { open: open, days: days, peak: peak, end: run, postedIn: b.sales, postedOut: postedOut };
  }

  function setCat(t, cat) {
    t.cat = t.cat === cat ? "" : cat;
    selected = t.id;
    render();
  }

  function postSuggested() {
    var t = findTx(selected);
    if (t.cat) {
      var next = uncat()[0];
      if (!next) return;
      t = next;
    }
    t.cat = t.suggest;
    var after = uncat()[0];
    selected = after ? after.id : t.id;
    render();
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Books · Atap Trading · 19 Aug 2026"));
    bar.appendChild(left);
    var n = uncat().length;
    var post = el("button", "btn-sm", n ? "Post suggested" : "Inbox posted");
    post.type = "button";
    post.disabled = n === 0;
    post.addEventListener("click", postSuggested);
    bar.appendChild(post);
    root.appendChild(bar);

    var hintBar = el("div", "shell-bar");
    hintBar.appendChild(el("div", "shell-hint", "SAMPLE DATA · MYR · August 2026 books · not a live ledger"));
    root.appendChild(hintBar);

    var grid = el("div", "shell-grid tr-3");
    grid.appendChild(inboxPanel());
    grid.appendChild(plPanel());
    grid.appendChild(rightPanel());
    root.appendChild(grid);
  }

  function inboxPanel() {
    var n = uncat().length;
    var panel = el("div", "panel");
    var head = el("div", "tr-head");
    head.appendChild(el("h3", "", "Bank inbox · " + n + " uncat"));
    panel.appendChild(head);

    var list = el("div", "list");
    txs.forEach(function (t) {
      var row = el("div", "tr-tx" + (t.id === selected ? " on" : "") + (t.cat ? " posted" : ""));
      var top = el("button", "tr-tx-main");
      top.type = "button";
      var body = el("div", "tr-grow");
      body.appendChild(el("div", "who", t.who));
      var meta = t.date + " · " + t.bank + " · " + t.memo;
      body.appendChild(el("div", "meta", meta));
      top.appendChild(body);
      var amt = el("div", "amt" + (t.amt > 0 ? " in" : " out"), money(t.amt));
      top.appendChild(amt);
      top.addEventListener("click", function () {
        selected = t.id;
        render();
      });
      row.appendChild(top);

      var chips = el("div", "tr-chips");
      if (!t.cat) {
        chips.appendChild(el("span", "tag warn", "suggested · " + t.suggest));
      } else {
        chips.appendChild(el("span", "tag ok", t.cat));
      }
      CATS.forEach(function (c) {
        var chip = el("button", "tab" + (t.cat === c ? " on" : ""), c);
        chip.type = "button";
        chip.addEventListener("click", function (e) {
          e.stopPropagation();
          setCat(t, c);
        });
        chips.appendChild(chip);
      });
      row.appendChild(chips);
      list.appendChild(row);
    });
    panel.appendChild(list);
    if (n === 0) {
      panel.appendChild(el("p", "empty", "Inbox posted · August bank feed clear."));
    }
    return panel;
  }

  function plPanel() {
    var b = books();
    var n = uncat().length;
    var uncatAmt = 0;
    uncat().forEach(function (t) { uncatAmt += t.amt; });

    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "P&L · August 2026"));

    var mix = el("div", "tr-mix");
    var max = Math.max(b.sales, b.cogs, b.opex, 1);
    function mixRow(label, n, kind) {
      var r = el("div", "tr-mix-row");
      var lab = el("div", "tr-mix-lab", label);
      var track = el("div", "tr-mix-track");
      var fill = el("div", "tr-mix-fill " + kind);
      fill.style.width = Math.max(n ? 4 : 0, (n / max) * 100) + "%";
      track.appendChild(fill);
      r.appendChild(lab);
      r.appendChild(track);
      mix.appendChild(r);
    }
    mixRow("Sales", b.sales, "in");
    mixRow("COGS", b.cogs, "cogs");
    mixRow("Opex", b.opex, "opex");
    panel.appendChild(mix);

    var pl = el("div", "pl");
    function line(label, n, cls) {
      var r = el("div", "pl-row" + (cls ? " " + cls : ""));
      r.appendChild(el("span", "", label));
      r.appendChild(el("span", "money", money(n)));
      pl.appendChild(r);
    }
    line("Sales", b.sales);
    line("COGS", b.cogs ? -b.cogs : 0);
    line("Gross", b.gross, "tr-em");
    line("Opex", b.opex ? -b.opex : 0);
    line("Net", b.net, "total");
    line("Owner draw", b.owner ? -b.owner : 0);
    panel.appendChild(pl);

    var foot = el("p", "empty tr-uncat");
    if (n) {
      foot.textContent = n + " uncategorized · " + money(uncatAmt) + " stays out of this P&L.";
    } else {
      foot.textContent = "All inbox lines are in this P&L. Owner draw sits below net.";
    }
    panel.appendChild(foot);
    return panel;
  }

  function rightPanel() {
    var wrap = el("div", "panel");
    wrap.appendChild(forecastBlock());
    wrap.appendChild(invoiceBlock());
    return wrap;
  }

  function forecastBlock() {
    var f = forecast();
    var box = el("div", "tr-block");
    var head = el("div", "tr-head");
    head.appendChild(el("h3", "", "Cash · next 7 days"));
    box.appendChild(head);

    var open = el("div", "tr-cash-open");
    open.appendChild(el("span", "k", "Open 20 Aug"));
    open.appendChild(el("span", "money", money(f.open)));
    box.appendChild(open);
    box.appendChild(el("p", "tr-posted-note",
      "Inbox posted · in " + money(f.postedIn) + " · out " + money(-f.postedOut)));

    f.days.forEach(function (d) {
      var row = el("div", "tr-day" + (d.close < 3000 ? " tight" : ""));
      var when = el("div", "tr-when");
      when.appendChild(el("div", "tr-dow", d.dow));
      when.appendChild(el("div", "meta", d.date));
      row.appendChild(when);

      var mid = el("div", "tr-day-mid");
      var track = el("div", "tr-bar-track");
      var fill = el("div", "tr-bar-fill" + (d.close < 3000 ? " warn" : ""));
      fill.style.width = Math.max(6, (Math.max(d.close, 0) / f.peak) * 100) + "%";
      track.appendChild(fill);
      mid.appendChild(track);
      var hint = d.items.length
        ? d.items.map(function (it) { return it.label + " " + money(it.amt); }).join(" · ")
        : "—";
      mid.appendChild(el("div", "meta", hint));
      row.appendChild(mid);

      var close = el("div", "tr-close");
      close.appendChild(el("div", "money", money(d.close)));
      close.appendChild(el("div", "meta", d.net ? money(d.net) : "flat"));
      row.appendChild(close);
      box.appendChild(row);
    });

    var end = el("div", "pl-row total tr-end");
    end.appendChild(el("span", "", "Close 26 Aug"));
    end.appendChild(el("span", "money", money(f.end)));
    box.appendChild(end);
    if (!rentPosted()) {
      box.appendChild(el("p", "empty", "Rent still due Tue · post the 17 Aug line as Opex to drop it."));
    }
    return box;
  }

  function invoiceBlock() {
    var box = el("div", "tr-inv");
    box.appendChild(el("h3", "", "Customer invoice"));

    var kv = el("div", "kv");
    kv.appendChild(el("div", "k", "INV-DEMO-1042"));
    kv.appendChild(el("div", "money", "RM 2,400.00"));
    kv.appendChild(el("div", "k", "Buyer"));
    kv.appendChild(el("div", "", "Acme Trading Sdn Bhd"));
    kv.appendChild(el("div", "k", "Issued"));
    kv.appendChild(el("div", "", "8 Aug 2026 · due 15 Aug"));
    kv.appendChild(el("div", "k", "Payment"));
    kv.appendChild(el("div", "", acmePosted() ? "Posted to Sales · 15 Aug" : "In inbox · 15 Aug Maybank"));
    box.appendChild(kv);

    var tog = el("label", "toggle");
    var boxEl = document.createElement("input");
    boxEl.type = "checkbox";
    boxEl.checked = submitted;
    boxEl.addEventListener("change", function () {
      submitted = boxEl.checked;
      render();
    });
    tog.appendChild(boxEl);
    tog.appendChild(document.createTextNode("MyInvois / e-invoice"));
    box.appendChild(tog);

    var stamp = el("div", "stamp" + (submitted ? " on" : ""));
    stamp.textContent = submitted
      ? "LHDN · MYINV-20260808-1042 · submitted (sample)"
      : "Not submitted · toggle to stamp a sample LHDN id";
    box.appendChild(stamp);
    return box;
  }

  function injectCss() {
    if (document.getElementById("teera-demo-css")) return;
    var s = document.createElement("style");
    s.id = "teera-demo-css";
    s.textContent = [
      "#demo-root .tr-3{grid-template-columns:minmax(270px,1.2fr) minmax(200px,.82fr) minmax(230px,.98fr)}",
      "#demo-root .tr-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}",
      "#demo-root .tr-head h3{margin-bottom:0}",
      "#demo-root .tr-tx{border:1px solid var(--shell-line);border-radius:var(--r);background:var(--shell-lift);padding:8px 10px 8px}",
      "#demo-root .tr-tx.on{opacity:1;border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--shell-lift));box-shadow:inset 0 0 0 1px var(--accent)}",
      "#demo-root .tr-tx.posted{opacity:.72}",
      "#demo-root .tr-tx-main{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:0;cursor:pointer}",
      "#demo-root .tr-grow{flex:1;min-width:0}",
      "#demo-root .tr-tx .who{font-size:13px;font-weight:550;letter-spacing:-.02em}",
      "#demo-root .tr-tx .amt{font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:12px;white-space:nowrap}",
      "#demo-root .tr-tx .amt.in{color:#b7e0cc}",
      "#demo-root .tr-tx .amt.out{color:color-mix(in srgb,var(--danger) 70%,var(--shell-ink))}",
      "#demo-root .tr-chips{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-top:7px}",
      "#demo-root .tr-chips .tab{padding:3px 8px;font-size:11px}",
      "#demo-root .tr-mix{display:flex;flex-direction:column;gap:6px;margin:2px 0 12px}",
      "#demo-root .tr-mix-row{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:center}",
      "#demo-root .tr-mix-lab{font-family:var(--mono);font-size:10px;color:var(--shell-muted);letter-spacing:.04em;text-transform:uppercase}",
      "#demo-root .tr-mix-track{height:7px;background:#1c1c20;border-radius:99px;overflow:hidden}",
      "#demo-root .tr-mix-fill{height:100%;border-radius:99px;background:var(--ok)}",
      "#demo-root .tr-mix-fill.cogs{background:color-mix(in srgb,var(--accent) 70%,#8a5a2a)}",
      "#demo-root .tr-mix-fill.opex{background:var(--danger)}",
      "#demo-root .pl-row.tr-em{color:var(--shell-muted);font-size:13px}",
      "#demo-root .tr-uncat{margin-top:10px}",
      "#demo-root .tr-block{margin-bottom:4px}",
      "#demo-root .tr-cash-open{display:flex;justify-content:space-between;align-items:baseline;font-size:14px;margin-bottom:4px}",
      "#demo-root .tr-cash-open .k{color:var(--shell-muted)}",
      "#demo-root .tr-posted-note{font-family:var(--mono);font-size:11px;color:var(--shell-muted);margin:0 0 10px}",
      "#demo-root .tr-day{display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--shell-line)}",
      "#demo-root .tr-day:last-of-type{border-bottom:none}",
      "#demo-root .tr-dow{font-size:12px;font-weight:550;letter-spacing:-.02em}",
      "#demo-root .tr-day-mid{min-width:0}",
      "#demo-root .tr-bar-track{height:7px;background:#1c1c20;border-radius:99px;overflow:hidden;margin-bottom:3px}",
      "#demo-root .tr-bar-fill{height:100%;border-radius:99px;background:var(--ok)}",
      "#demo-root .tr-bar-fill.warn{background:var(--accent)}",
      "#demo-root .tr-day.tight .tr-close .money{color:color-mix(in srgb,var(--accent) 50%,var(--shell-ink))}",
      "#demo-root .tr-close{text-align:right;font-size:12px}",
      "#demo-root .tr-end{margin-top:8px}",
      "#demo-root .tr-inv{margin-top:16px;padding-top:14px;border-top:1px solid var(--shell-line)}",
      "@media (max-width:860px){#demo-root .tr-3{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
