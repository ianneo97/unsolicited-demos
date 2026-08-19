window.mountDemo = function (root) {
  injectCss();

  var rxNo = "RX-DEMO-0819-014";
  var labelled = false;
  var einvoice = false;
  var warn = "";
  var nextLine = 1;

  var skus = [
    {
      id: "par", name: "Paracetamol 500 mg", form: "10 tabs", price: 6.5,
      batches: [
        { lot: "PCM-A11", expiry: "2026-11-30", qty: 18 },
        { lot: "PCM-B03", expiry: "2027-03-15", qty: 40 }
      ]
    },
    {
      id: "amx", name: "Amoxicillin 250 mg", form: "capsule", price: 18,
      batches: [
        { lot: "AMX-A09", expiry: "2026-09-30", qty: 12 },
        { lot: "AMX-B01", expiry: "2027-01-20", qty: 30 }
      ]
    },
    {
      id: "cet", name: "Cetirizine 10 mg", form: "10 tabs", price: 9.5,
      batches: [
        { lot: "CET-A10", expiry: "2026-10-31", qty: 8 },
        { lot: "CET-B04", expiry: "2027-04-12", qty: 22 }
      ]
    },
    {
      id: "ors", name: "ORS sachet", form: "box of 10", price: 7,
      batches: [
        { lot: "ORS-A08", expiry: "2026-08-31", qty: 6 },
        { lot: "ORS-B02", expiry: "2027-02-28", qty: 16 }
      ]
    },
    {
      id: "cgh", name: "Cough syrup 100 ml", form: "bottle", price: 14.5,
      batches: [
        { lot: "CGH-A12", expiry: "2026-12-15", qty: 9 },
        { lot: "CGH-B05", expiry: "2027-05-01", qty: 14 }
      ]
    }
  ];

  var basket = [];

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findSku(id) {
    var i;
    for (i = 0; i < skus.length; i++) {
      if (skus[i].id === id) return skus[i];
    }
    return skus[0];
  }

  function findBatch(sku, lot) {
    var i;
    for (i = 0; i < sku.batches.length; i++) {
      if (sku.batches[i].lot === lot) return sku.batches[i];
    }
    return sku.batches[0];
  }

  function earlierOpen(sku, expiry) {
    var i;
    for (i = 0; i < sku.batches.length; i++) {
      var b = sku.batches[i];
      if (b.qty > 0 && b.expiry < expiry) return b;
    }
    return null;
  }

  function earliest(sku) {
    var best = null;
    sku.batches.forEach(function (b) {
      if (b.qty < 1) return;
      if (!best || b.expiry < best.expiry) best = b;
    });
    return best;
  }

  function basketTotal() {
    return basket.reduce(function (s, line) { return s + line.qty * line.price; }, 0);
  }

  function addLine(sku, batch) {
    var older = earlierOpen(sku, batch.expiry);
    if (older) {
      warn = "FEFO · " + sku.name + " still has " + older.lot + " exp " + older.expiry + " before " + batch.lot;
    } else {
      warn = "";
    }
    if (batch.qty < 1) {
      warn = batch.lot + " is empty.";
      render();
      return;
    }
    var existing = null;
    basket.forEach(function (line) {
      if (line.skuId === sku.id && line.lot === batch.lot) existing = line;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      basket.push({
        id: "l" + (nextLine++),
        skuId: sku.id,
        name: sku.name,
        lot: batch.lot,
        expiry: batch.expiry,
        qty: 1,
        price: sku.price
      });
    }
    batch.qty -= 1;
    labelled = false;
    render();
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Didi · Mont Kiara counter"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", basket.length ? basket.length + " lines · " + rm(basketTotal()) : "basket empty"));
    root.appendChild(bar);

    var hintBar = el("div", "shell-bar");
    hintBar.appendChild(el(
      "div",
      "shell-hint",
      "SAMPLE DATA · retail counter · not a live pharmacy"
    ));
    root.appendChild(hintBar);

    var grid = el("div", "shell-grid dd-3");
    grid.appendChild(skuPanel());
    grid.appendChild(pickPanel());
    grid.appendChild(billPanel());
    root.appendChild(grid);
  }

  function skuPanel() {
    var panel = el("div", "panel");
    var head = el("div", "dd-head");
    head.appendChild(el("h3", "", "Shelf · 5 SKUs"));
    panel.appendChild(head);

    var list = el("div", "list");
    skus.forEach(function (s) {
      var first = earliest(s);
      var t = el("button", "ticket");
      t.type = "button";
      t.disabled = !first;
      var body = el("div", "dd-grow");
      body.appendChild(el("div", "who", s.name));
      var meta = s.form + " · " + rm(s.price);
      if (first) meta += " · FEFO " + first.lot;
      else meta += " · out";
      body.appendChild(el("div", "meta", meta));
      t.appendChild(body);
      var left = s.batches.reduce(function (n, b) { return n + b.qty; }, 0);
      t.appendChild(el("span", "tag" + (left < 10 ? " warn" : " ok"), left + " on shelf"));
      t.addEventListener("click", function () {
        var batch = earliest(s);
        if (!batch) return;
        addLine(s, batch);
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    panel.appendChild(el("p", "empty", "Scan / pick adds the earliest expiry (FEFO)."));
    return panel;
  }

  function pickPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Batch pick"));
    panel.appendChild(el("p", "dd-sub", "Pick a later lot on purpose to fire the FEFO warning."));

    skus.forEach(function (s) {
      var block = el("div", "dd-sku");
      block.appendChild(el("div", "dd-sku-h", s.name));
      var lots = el("div", "dd-lots");
      s.batches.forEach(function (b) {
        var older = earlierOpen(s, b.expiry);
        var label = b.lot + " · exp " + b.expiry + " · " + b.qty;
        var btn = el("button", "tab" + (older && b.qty > 0 ? " dd-late" : ""), label);
        btn.type = "button";
        btn.disabled = b.qty < 1;
        btn.title = older ? "Later than " + older.lot : "Earliest open lot";
        btn.addEventListener("click", function () {
          addLine(s, b);
        });
        lots.appendChild(btn);
      });
      block.appendChild(lots);
      panel.appendChild(block);
    });

    if (warn) {
      var w = el("div", "dd-warn", warn);
      panel.appendChild(w);
    }
    return panel;
  }

  function billPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Script + invoice"));

    var kv = el("div", "dd-kv");
    kv.appendChild(el("div", "k", "Rx no"));
    kv.appendChild(el("div", "", rxNo));
    kv.appendChild(el("div", "k", "Patient"));
    kv.appendChild(el("div", "", "Puan Zainab (sample)"));
    kv.appendChild(el("div", "k", "Prescriber"));
    kv.appendChild(el("div", "", "Dr Demo · KK sample"));
    panel.appendChild(kv);

    if (!basket.length) {
      panel.appendChild(el("p", "empty", "Basket empty. Scan a SKU or pick a lot."));
    }

    basket.forEach(function (line) {
      var row = el("div", "tx");
      var left = el("div");
      left.appendChild(el("div", "", line.name));
      left.appendChild(el("div", "sub", line.lot + " · exp " + line.expiry + " · × " + line.qty));
      row.appendChild(left);
      var right = el("div", "dd-line-r");
      right.appendChild(el("div", "amt", rm(line.qty * line.price)));
      var rmBtn = el("button", "btn-sm ghost dd-x", "Remove");
      rmBtn.type = "button";
      rmBtn.addEventListener("click", function () {
        var sku = findSku(line.skuId);
        var batch = findBatch(sku, line.lot);
        batch.qty += line.qty;
        basket = basket.filter(function (x) { return x.id !== line.id; });
        labelled = false;
        warn = "";
        render();
      });
      right.appendChild(rmBtn);
      row.appendChild(right);
      panel.appendChild(row);
    });

    var pl = el("div", "pl");
    var tot = el("div", "pl-row total");
    tot.appendChild(el("div", "", "Total"));
    tot.appendChild(el("div", "money", rm(basketTotal())));
    pl.appendChild(tot);
    panel.appendChild(pl);

    var actions = el("div", "actions");
    var label = el("button", "btn-sm" + (labelled ? " ghost" : ""), labelled ? "Label printed" : "Print script label");
    label.type = "button";
    label.disabled = basket.length === 0;
    label.addEventListener("click", function () {
      labelled = true;
      render();
    });
    actions.appendChild(label);
    panel.appendChild(actions);

    if (labelled) {
      var lab = el("div", "dd-label");
      lab.appendChild(el("div", "dd-label-h", rxNo + " · sample"));
      lab.appendChild(el("div", "", "Puan Zainab · not a live Rx"));
      basket.forEach(function (line) {
        lab.appendChild(el("div", "meta", line.name + " · " + line.lot + " · exp " + line.expiry));
      });
      panel.appendChild(lab);
    }

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = einvoice;
    box.addEventListener("change", function () {
      einvoice = box.checked;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("MyInvois / e-invoice"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (einvoice ? " on" : ""));
    stamp.textContent = einvoice
      ? "MyInvois (sample) · MYINV-SAMPLE-DD-0819"
      : "Paper invoice · e-invoice off";
    panel.appendChild(stamp);
    return panel;
  }

  function injectCss() {
    if (document.getElementById("didi-demo-css")) return;
    var s = document.createElement("style");
    s.id = "didi-demo-css";
    s.textContent = [
      "#demo-root .dd-3{grid-template-columns:minmax(220px,.95fr) minmax(240px,1.1fr) minmax(230px,1fr)}",
      "#demo-root .dd-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}",
      "#demo-root .dd-head h3{margin-bottom:0}",
      "#demo-root .dd-grow{flex:1;min-width:0}",
      "#demo-root .dd-sub{font-size:13px;color:var(--shell-muted);margin-bottom:12px}",
      "#demo-root .dd-sku{padding:8px 0;border-bottom:1px solid var(--shell-line)}",
      "#demo-root .dd-sku-h{font-size:13px;font-weight:550;letter-spacing:-.02em;margin-bottom:6px}",
      "#demo-root .dd-lots{display:flex;flex-wrap:wrap;gap:6px}",
      "#demo-root .dd-lots .tab{font-size:11px;padding:4px 8px}",
      "#demo-root .dd-lots .tab.dd-late{border-color:color-mix(in srgb,var(--accent) 45%,var(--shell-line));color:#e8d9a8}",
      "#demo-root .dd-warn{margin-top:12px;padding:10px 12px;border-radius:var(--r);border:1px solid color-mix(in srgb,var(--accent) 50%,var(--shell-line));background:color-mix(in srgb,var(--accent) 14%,var(--shell-lift));font-family:var(--mono);font-size:12px;color:#e8d9a8}",
      "#demo-root .dd-kv{display:grid;grid-template-columns:6.5rem 1fr;gap:6px 12px;font-size:13px;margin-bottom:12px}",
      "#demo-root .dd-kv .k{color:var(--shell-muted)}",
      "#demo-root .dd-line-r{display:flex;flex-direction:column;align-items:flex-end;gap:4px}",
      "#demo-root .dd-x{padding:3px 8px;font-size:11px}",
      "#demo-root .dd-label{margin-top:12px;padding:10px 12px;border:1px dashed var(--shell-line);border-radius:var(--r);background:var(--shell-lift);font-size:13px}",
      "#demo-root .dd-label-h{font-family:var(--mono);font-size:12px;margin-bottom:4px}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .dd-3{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
