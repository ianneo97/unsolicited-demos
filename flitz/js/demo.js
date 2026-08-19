window.mountDemo = function (root) {
  injectCss();

  var selected = "d1";
  var riders = ["Encik Hafiz", "Puan Siti"];

  var drops = [
    { id: "d1", code: "PJ-01", who: "Kedai Runcit SS2", addr: "Jalan SS2/24, PJ", cell: "1,2", rider: "", status: "open", photo: false, sign: false, recv: "Encik Ali (sample)", ts: "", reason: "" },
    { id: "d2", code: "PJ-02", who: "Residensi Kelana", addr: "Jalan SS7/19, Kelana Jaya", cell: "2,1", rider: "", status: "open", photo: false, sign: false, recv: "Puan Aina (sample)", ts: "", reason: "" },
    { id: "d3", code: "PJ-03", who: "Ara Damansara lot", addr: "Jalan PJU 1A/3, Ara", cell: "0,3", rider: "", status: "open", photo: false, sign: false, recv: "Guard desk (sample)", ts: "", reason: "" },
    { id: "d4", code: "PJ-04", who: "Sunway Nexis lobby", addr: "Jalan PJU 5/1, Kota Damansara", cell: "3,0", rider: "", status: "open", photo: false, sign: false, recv: "Lobby (sample)", ts: "", reason: "" },
    { id: "d5", code: "PJ-05", who: "Laundry Oval", addr: "Jalan SS2/72, PJ", cell: "1,0", rider: "", status: "open", photo: false, sign: false, recv: "Counter (sample)", ts: "", reason: "" },
    { id: "d6", code: "PJ-06", who: "Distributor Kelana", addr: "Jalan SS7/26, Kelana Jaya", cell: "2,3", rider: "", status: "open", photo: false, sign: false, recv: "Store (sample)", ts: "", reason: "" },
    { id: "d7", code: "PJ-07", who: "Sunway Giza desk", addr: "Jalan PJU 5/14, Kota Damansara", cell: "3,2", rider: "", status: "open", photo: false, sign: false, recv: "Tenant (sample)", ts: "", reason: "" },
    { id: "d8", code: "PJ-08", who: "Ara Walk pickup", addr: "Jalan PJU 1A/41, Ara", cell: "0,1", rider: "", status: "open", photo: false, sign: false, recv: "Shop (sample)", ts: "", reason: "" }
  ];

  function findDrop(id) {
    var i;
    for (i = 0; i < drops.length; i++) {
      if (drops[i].id === id) return drops[i];
    }
    return drops[0];
  }

  function stamp() {
    var d = new Date();
    function p(n) { return n < 10 ? "0" + n : String(n); }
    return "19 Aug 2026 · " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }

  function riderLoad(name) {
    return drops.filter(function (d) { return d.rider === name && d.status !== "pod" && d.status !== "fail"; }).length;
  }

  function assignedN() {
    return drops.filter(function (d) { return d.rider && d.status === "out"; }).length;
  }

  function podN() {
    return drops.filter(function (d) { return d.status === "pod"; }).length;
  }

  function failN() {
    return drops.filter(function (d) { return d.status === "fail"; }).length;
  }

  function openN() {
    return drops.filter(function (d) { return d.status === "open"; }).length;
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Flitz · PJ dispatch"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", openN() + " open · " + assignedN() + " out · " + podN() + " POD · " + failN() + " fail"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 drops · fake grid · not live GPS"));
    root.appendChild(hint);
    var d = findDrop(selected);
    var grid = el("div", "shell-grid fz-3");
    grid.appendChild(boardPanel());
    grid.appendChild(jobPanel(d));
    grid.appendChild(mapPanel(d));
    root.appendChild(grid);
  }

  function boardPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Drops · " + openN() + " unassigned"));
    panel.appendChild(el("p", "fz-sub", "Hafiz load " + riderLoad("Encik Hafiz") + " · Siti load " + riderLoad("Puan Siti")));
    var list = el("div", "list");
    drops.forEach(function (d) {
      var t = el("button", "ticket" + (d.id === selected ? " on" : "") + (d.status === "pod" || d.status === "fail" ? " fz-done" : ""));
      t.type = "button";
      var body = el("div", "fz-grow");
      body.appendChild(el("div", "who", d.code + " · " + d.who));
      body.appendChild(el("div", "meta", d.addr));
      t.appendChild(body);
      var tag = "open";
      var cls = "tag";
      if (d.status === "pod") { tag = "POD"; cls = "tag ok"; }
      else if (d.status === "fail") { tag = "fail"; cls = "tag warn"; }
      else if (d.rider) { tag = d.rider.split(" ")[1]; cls = "tag warn"; }
      t.appendChild(el("span", cls, tag));
      t.addEventListener("click", function () {
        selected = d.id;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function jobPanel(d) {
    var locked = d.status === "pod" || d.status === "fail";
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Job · " + d.code));
    panel.appendChild(el("div", "serving-name", d.who));
    panel.appendChild(el("p", "fz-sub", d.addr + " · sample"));

    var kv = el("div", "fz-kv");
    kv.appendChild(el("div", "k", "Rider"));
    kv.appendChild(el("div", "", d.rider || "unassigned"));
    kv.appendChild(el("div", "k", "Recipient"));
    kv.appendChild(el("div", "", d.recv));
    kv.appendChild(el("div", "k", "Photo"));
    kv.appendChild(el("div", "", d.photo ? "ticked" : "no photo"));
    kv.appendChild(el("div", "k", "Sign"));
    kv.appendChild(el("div", "", d.sign ? "ticked" : "no sign"));
    kv.appendChild(el("div", "k", "Status"));
    kv.appendChild(el("div", "", d.status === "pod" ? "POD · " + d.ts : d.status === "fail" ? "fail · " + d.reason : d.status));
    panel.appendChild(kv);

    var assign = el("div", "actions");
    riders.forEach(function (r) {
      var b = el("button", "tab" + (d.rider === r ? " on" : ""), r + " · " + riderLoad(r));
      b.type = "button";
      b.disabled = locked;
      b.addEventListener("click", function () {
        d.rider = r;
        d.status = "out";
        render();
      });
      assign.appendChild(b);
    });
    panel.appendChild(assign);

    var photo = el("label", "toggle");
    var pbox = document.createElement("input");
    pbox.type = "checkbox";
    pbox.checked = d.photo;
    pbox.disabled = locked;
    pbox.addEventListener("change", function () {
      d.photo = pbox.checked;
      render();
    });
    photo.appendChild(pbox);
    photo.appendChild(document.createTextNode("Photo on POD"));
    panel.appendChild(photo);

    var sign = el("label", "toggle");
    var sbox = document.createElement("input");
    sbox.type = "checkbox";
    sbox.checked = d.sign;
    sbox.disabled = locked;
    sbox.addEventListener("change", function () {
      d.sign = sbox.checked;
      render();
    });
    sign.appendChild(sbox);
    sign.appendChild(document.createTextNode("Signature on POD"));
    panel.appendChild(sign);

    var actions = el("div", "actions");
    var pod = el("button", "btn-sm" + (d.status === "pod" ? " ghost" : ""), d.status === "pod" ? "POD marked" : "Mark POD");
    pod.type = "button";
    pod.disabled = locked || !d.rider;
    pod.addEventListener("click", function () {
      d.status = "pod";
      d.ts = stamp();
      if (!d.photo) d.photo = true;
      if (!d.sign) d.sign = true;
      render();
    });
    actions.appendChild(pod);

    var fail = el("button", "btn-sm ghost", d.status === "fail" ? "Failed" : "Fail · not home");
    fail.type = "button";
    fail.disabled = locked || !d.rider;
    fail.addEventListener("click", function () {
      d.status = "fail";
      d.reason = "not home";
      d.ts = stamp();
      render();
    });
    actions.appendChild(fail);
    panel.appendChild(actions);

    if (!d.rider) {
      panel.appendChild(el("p", "empty", "Assign Hafiz or Siti before POD."));
    }
    if (d.status === "pod") {
      panel.appendChild(el("div", "stamp on", "POD · " + d.rider + " · " + d.recv + " · " + d.ts + (d.photo ? " · photo" : "") + (d.sign ? " · sign" : "")));
    }
    if (d.status === "fail") {
      panel.appendChild(el("div", "stamp", "Failed · " + d.reason + " · " + d.ts + " · " + d.rider));
    }
    return panel;
  }

  function mapPanel(d) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Grid · fake map"));
    panel.appendChild(el("p", "fz-sub", "Not Google. Not live GPS."));
    var map = el("div", "fz-map");
    var r, c;
    for (r = 0; r < 4; r++) {
      for (c = 0; c < 4; c++) {
        var cell = el("button", "fz-cell");
        cell.type = "button";
        var key = c + "," + r;
        var here = drops.filter(function (x) { return x.cell === key; });
        if (here.length) {
          var hit = here[0];
          cell.className += " has" + (hit.id === selected ? " on" : "") + (hit.status === "pod" ? " pod" : "") + (hit.status === "fail" ? " fail" : "");
          cell.textContent = hit.code.slice(-2);
          cell.addEventListener("click", function (drop) {
            return function () {
              selected = drop.id;
              render();
            };
          }(hit));
        } else {
          cell.disabled = true;
          cell.textContent = "·";
        }
        map.appendChild(cell);
      }
    }
    panel.appendChild(map);
    panel.appendChild(el("p", "empty", "SS2 left · Kelana mid · Ara top · Sunway right. Selected " + d.code + "."));
    return panel;
  }

  function injectCss() {
    if (document.getElementById("flitz-demo-css")) return;
    if (!document.getElementById("flitz-font")) {
      var l = document.createElement("link");
      l.id = "flitz-font";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&display=swap";
      document.head.appendChild(l);
    }
    var s = document.createElement("style");
    s.id = "flitz-demo-css";
    s.textContent = [
      "#demo-root{--shell:#141210;--shell-lift:#1c1916;--shell-line:#3a322c;--shell-ink:#f6efe6;--shell-muted:#b9a898;background:repeating-linear-gradient(90deg,transparent,transparent 12px,rgba(226,74,42,.05) 12px,rgba(226,74,42,.05) 13px),#141210}",
      "#demo-root .shell-title{font-family:\"Barlow Condensed\",var(--sans);letter-spacing:.14em;text-transform:uppercase;font-size:16px}",
      "#demo-root .who{font-family:\"Barlow Condensed\",var(--sans);letter-spacing:.04em;text-transform:uppercase}",
      "#demo-root .fz-cell{font-family:\"Barlow Condensed\",var(--sans);font-size:16px;font-weight:700;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}",
      "#demo-root .ticket{border-radius:0;border-left:4px solid #e24a2a}",
      "#demo-root .fz-3{grid-template-columns:minmax(230px,1.05fr) minmax(220px,.95fr) minmax(200px,.85fr)}",
      "#demo-root .fz-grow{flex:1;min-width:0}",
      "#demo-root .ticket.fz-done{opacity:.6}",
      "#demo-root .fz-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .fz-kv{display:grid;grid-template-columns:5.5rem 1fr;gap:7px 12px;font-size:14px;margin:4px 0 12px}",
      "#demo-root .fz-kv .k{color:var(--shell-muted)}",
      "#demo-root .fz-map{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0 12px}",
      "#demo-root .fz-cell{min-height:44px;border:1px solid var(--shell-line);border-radius:var(--r);background:var(--shell-lift);color:var(--shell-muted);font:inherit;font-family:var(--mono);font-size:11px;cursor:pointer}",
      "#demo-root .fz-cell.has{color:var(--shell-ink);background:color-mix(in srgb,var(--accent) 10%,var(--shell-lift))}",
      "#demo-root .fz-cell.on{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}",
      "#demo-root .fz-cell.pod{background:color-mix(in srgb,var(--ok) 16%,var(--shell-lift));color:#b7e0cc}",
      "#demo-root .fz-cell.fail{background:color-mix(in srgb,var(--danger) 16%,var(--shell-lift))}",
      "#demo-root .fz-cell:disabled{cursor:default;opacity:.55}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .fz-3{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
