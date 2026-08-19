window.mountDemo = function (root) {
  injectCss();

  var einvoice = false;
  var issued = false;
  var paid = false;
  var tender = 50;
  var nextLine = 1;
  var nextRcpt = 1;
  var payMode = "cash";
  var drawer = 200;
  var lastSale = null;
  var SST = 0.06;

  var skus = [
    { id: "g1", name: "Gardenia white loaf", form: "400 g", price: 3.8, qty: 24 },
    { id: "g2", name: "Telur Gred A 10s", form: "tray", price: 8.5, qty: 18 },
    { id: "g3", name: "Minyak masak 1 L", form: "bottle", price: 9.9, qty: 12 },
    { id: "g4", name: "Milo 200 ml", form: "can", price: 3.2, qty: 30 },
    { id: "g5", name: "Maggi kari pack", form: "5 sachets", price: 5.6, qty: 16 }
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

  function subtotal() {
    return basket.reduce(function (s, line) { return s + line.qty * line.price; }, 0);
  }

  function sstAmt() {
    return Math.round(subtotal() * SST * 100) / 100;
  }

  function total() {
    return Math.round((subtotal() + sstAmt()) * 100) / 100;
  }

  function changeDue() {
    if (payMode !== "cash") return 0;
    return Math.round((tender - total()) * 100) / 100;
  }

  function addSku(s) {
    if (paid || s.qty < 1) return;
    var existing = null;
    basket.forEach(function (line) {
      if (line.skuId === s.id) existing = line;
    });
    if (existing) existing.qty += 1;
    else {
      basket.push({
        id: "l" + (nextLine++),
        skuId: s.id,
        name: s.name,
        qty: 1,
        price: s.price
      });
    }
    s.qty -= 1;
    issued = false;
    lastSale = null;
    var tot = total();
    if (tender < tot) {
      tender = Math.ceil(tot / 10) * 10;
      if (tender < 20) tender = 20;
    }
    render();
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Flexsoft · Sri Damansara till"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", "Drawer " + rm(drawer) + " · " + (basket.length ? basket.length + " lines · " + rm(total()) : "basket empty")));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · grocery counter · not a live shop"));
    root.appendChild(hint);
    var grid = el("div", "shell-grid fx-2");
    grid.appendChild(shelfPanel());
    grid.appendChild(tillPanel());
    root.appendChild(grid);
  }

  function shelfPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Shelf · 5 SKUs"));
    var list = el("div", "list");
    skus.forEach(function (s) {
      var t = el("button", "ticket");
      t.type = "button";
      t.disabled = paid || s.qty < 1;
      var body = el("div", "fx-grow");
      body.appendChild(el("div", "who", s.name));
      body.appendChild(el("div", "meta", s.form + " · " + rm(s.price)));
      t.appendChild(body);
      t.appendChild(el("span", "tag" + (s.qty < 8 ? " warn" : " ok"), s.qty + " left"));
      t.addEventListener("click", function () { addSku(s); });
      list.appendChild(t);
    });
    panel.appendChild(list);
    panel.appendChild(el("p", "empty", "Tap a SKU to add a line. Qty drops on the shelf."));
    return panel;
  }

  function tillPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Till · SST 6%"));
    if (!basket.length) {
      panel.appendChild(el("p", "empty", "Basket empty. Scan a SKU."));
    }
    basket.forEach(function (line) {
      var row = el("div", "tx");
      var left = el("div");
      left.appendChild(el("div", "", line.name));
      left.appendChild(el("div", "sub", line.qty + " × " + rm(line.price)));
      row.appendChild(left);
      var right = el("div", "fx-right");
      right.appendChild(el("div", "amt", rm(line.qty * line.price)));
      if (!paid) {
        var rmBtn = el("button", "btn-sm ghost fx-x", "Remove");
        rmBtn.type = "button";
        rmBtn.addEventListener("click", function () {
          var s = findSku(line.skuId);
          s.qty += line.qty;
          basket = basket.filter(function (x) { return x.id !== line.id; });
          issued = false;
          lastSale = null;
          render();
        });
        right.appendChild(rmBtn);
      }
      row.appendChild(right);
      panel.appendChild(row);
    });

    var pl = el("div", "pl");
    function line(lab, n, cls) {
      var r = el("div", "pl-row" + (cls ? " " + cls : ""));
      r.appendChild(el("div", "", lab));
      r.appendChild(el("div", "money", rm(n)));
      pl.appendChild(r);
    }
    line("Subtotal", subtotal());
    line("SST 6%", sstAmt());
    line("Total", total(), "total");
    panel.appendChild(pl);

    var modes = el("div", "fx-modes");
    ["cash", "card"].forEach(function (m) {
      var b = el("button", "tab" + (payMode === m ? " on" : ""), m);
      b.type = "button";
      b.disabled = paid;
      b.addEventListener("click", function () {
        payMode = m;
        render();
      });
      modes.appendChild(b);
    });
    panel.appendChild(modes);

    if (payMode === "cash" && !paid) {
      panel.appendChild(el("label", "lbl", "Tendered (MYR)"));
      var ten = el("input", "field");
      ten.type = "number";
      ten.min = "0";
      ten.step = "0.5";
      ten.value = String(tender);
      ten.setAttribute("aria-label", "Cash tendered");
      ten.addEventListener("change", function () {
        var n = Number(ten.value);
        tender = isNaN(n) || n < 0 ? 0 : n;
        render();
      });
      panel.appendChild(ten);
    }

    var chg = changeDue();
    var chgRow = el("div", "pl-row");
    chgRow.appendChild(el("div", "", paid ? "Change given" : (payMode === "cash" ? "Change" : "Card · no change")));
    chgRow.appendChild(el("div", "money" + (!paid && chg < 0 ? " fx-short" : ""), rm(chg)));
    panel.appendChild(chgRow);
    if (!paid && payMode === "cash" && chg < 0) {
      panel.appendChild(el("p", "empty", "Short · tender more than " + rm(total()) + "."));
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

    var actions = el("div", "actions");
    var issue = el("button", "btn-sm" + (issued ? " ghost" : ""), issued ? "e-invoice issued" : "Issue e-invoice");
    issue.type = "button";
    issue.disabled = !basket.length || issued;
    issue.addEventListener("click", function () {
      issued = true;
      einvoice = true;
      render();
    });
    actions.appendChild(issue);
    var take = el("button", "btn-sm" + (paid ? " ghost" : ""), paid ? "Paid" : "Take payment");
    take.type = "button";
    take.disabled = paid || !basket.length || (payMode === "cash" && chg < 0);
    take.addEventListener("click", function () {
      var tot = total();
      if (payMode === "cash") drawer = Math.round((drawer + tot) * 100) / 100;
      lastSale = {
        no: "FX-RCPT-" + String(nextRcpt++).padStart(3, "0"),
        mode: payMode,
        tender: payMode === "cash" ? tender : tot,
        change: payMode === "cash" ? chg : 0,
        sub: subtotal(),
        sst: sstAmt(),
        tot: tot,
        lines: basket.map(function (line) {
          return {
            name: line.name,
            qty: line.qty,
            amt: line.qty * line.price,
            left: findSku(line.skuId).qty
          };
        })
      };
      paid = true;
      render();
    });
    actions.appendChild(take);
    if (paid) {
      var next = el("button", "btn-sm ghost", "Next customer");
      next.type = "button";
      next.addEventListener("click", function () {
        basket = [];
        paid = false;
        issued = false;
        einvoice = false;
        tender = 50;
        payMode = "cash";
        lastSale = null;
        render();
      });
      actions.appendChild(next);
    }
    panel.appendChild(actions);

    if (lastSale) {
      var rec = el("div", "fx-rcpt");
      rec.appendChild(el("div", "fx-rcpt-h", "Receipt · " + lastSale.no + " · sample"));
      lastSale.lines.forEach(function (line) {
        rec.appendChild(el("div", "meta", line.name + " · × " + line.qty + " · " + rm(line.amt) + " · shelf now " + line.left));
      });
      rec.appendChild(el("div", "meta", "Subtotal " + rm(lastSale.sub) + " · SST " + rm(lastSale.sst)));
      rec.appendChild(el("div", "", lastSale.mode + " · tendered " + rm(lastSale.tender) + " · change " + rm(lastSale.change) + " · drawer " + rm(drawer)));
      panel.appendChild(rec);
    }

    var stamp = el("div", "stamp" + (einvoice || paid ? " on" : ""));
    if (paid && einvoice) stamp.textContent = "Paid · MyInvois (sample) · MYINV-SAMPLE-FX-0819";
    else if (paid) stamp.textContent = "Paid · paper · " + lastSale.no;
    else if (issued || einvoice) stamp.textContent = "MyInvois (sample) · MYINV-SAMPLE-FX-0819";
    else stamp.textContent = "Paper receipt · e-invoice off";
    panel.appendChild(stamp);
    return panel;
  }

  function injectCss() {
    if (document.getElementById("flexsoft-demo-css")) return;
    var s = document.createElement("style");
    s.id = "flexsoft-demo-css";
    s.textContent = [
      "#demo-root .fx-2{grid-template-columns:minmax(240px,.95fr) minmax(280px,1.15fr)}",
      "#demo-root .fx-grow{flex:1;min-width:0}",
      "#demo-root .fx-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px}",
      "#demo-root .fx-x{padding:3px 8px;font-size:11px}",
      "#demo-root .fx-short{color:color-mix(in srgb,var(--danger) 70%,var(--shell-ink))}",
      "#demo-root .fx-modes{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 8px}",
      "#demo-root .fx-rcpt{margin-top:12px;padding:10px 12px;border:1px solid color-mix(in srgb,var(--ok) 40%,var(--shell-line));border-radius:var(--r);background:var(--shell-lift);font-size:13px}",
      "#demo-root .fx-rcpt-h{font-family:var(--mono);font-size:12px;margin-bottom:4px}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .fx-2{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
