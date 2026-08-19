window.mountDemo = function (root) {
  injectCss();

  var selected = "d1";
  var riders = ["Encik Hafiz", "Puan Siti"];

  var drops = [
    { id: "d1", code: "PJ-01", who: "Kedai Runcit SS2", addr: "Jalan SS2/24, PJ", cell: "1,2", rider: "", pod: false, photo: false, ts: "" },
    { id: "d2", code: "PJ-02", who: "Residensi Kelana", addr: "Jalan SS7/19, Kelana Jaya", cell: "2,1", rider: "", pod: false, photo: false, ts: "" },
    { id: "d3", code: "PJ-03", who: "Ara Damansara lot", addr: "Jalan PJU 1A/3, Ara", cell: "0,3", rider: "", pod: false, photo: false, ts: "" },
    { id: "d4", code: "PJ-04", who: "Sunway Nexis lobby", addr: "Jalan PJU 5/1, Kota Damansara", cell: "3,0", rider: "", pod: false, photo: false, ts: "" },
    { id: "d5", code: "PJ-05", who: "Laundry Oval", addr: "Jalan SS2/72, PJ", cell: "1,0", rider: "", pod: false, photo: false, ts: "" },
    { id: "d6", code: "PJ-06", who: "Distributor Kelana", addr: "Jalan SS7/26, Kelana Jaya", cell: "2,3", rider: "", pod: false, photo: false, ts: "" },
    { id: "d7", code: "PJ-07", who: "Sunway Giza desk", addr: "Jalan PJU 5/14, Kota Damansara", cell: "3,2", rider: "", pod: false, photo: false, ts: "" },
    { id: "d8", code: "PJ-08", who: "Ara Walk pickup", addr: "Jalan PJU 1A/41, Ara", cell: "0,1", rider: "", pod: false, photo: false, ts: "" }
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

  function assignedN() {
    return drops.filter(function (d) { return d.rider && !d.pod; }).length;
  }

  function podN() {
    return drops.filter(function (d) { return d.pod; }).length;
  }

  function openN() {
    return drops.filter(function (d) { return !d.rider; }).length;
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Flitz · PJ dispatch"));
    bar.appendChild(left);
    bar.appendChild(el("div", "shell-hint", openN() + " open · " + assignedN() + " out · " + podN() + " POD"));
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
    var list = el("div", "list");
    drops.forEach(function (d) {
      var t = el("button", "ticket" + (d.id === selected ? " on" : "") + (d.pod ? " fz-done" : ""));
      t.type = "button";
      var body = el("div", "fz-grow");
      body.appendChild(el("div", "who", d.code + " · " + d.who));
      body.appendChild(el("div", "meta", d.addr));
      t.appendChild(body);
      var tag = "open";
      var cls = "tag";
      if (d.pod) { tag = "POD"; cls = "tag ok"; }
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
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Job · " + d.code));
    panel.appendChild(el("div", "serving-name", d.who));
    panel.appendChild(el("p", "fz-sub", d.addr + " · sample"));

    var kv = el("div", "fz-kv");
    kv.appendChild(el("div", "k", "Rider"));
    kv.appendChild(el("div", "", d.rider || "unassigned"));
    kv.appendChild(el("div", "k", "Photo"));
    kv.appendChild(el("div", "", d.photo ? "ticked" : "no photo"));
    kv.appendChild(el("div", "k", "POD"));
    kv.appendChild(el("div", "", d.pod ? d.ts : "open"));
    panel.appendChild(kv);

    var assign = el("div", "actions");
    riders.forEach(function (r) {
      var b = el("button", "tab" + (d.rider === r ? " on" : ""), r);
      b.type = "button";
      b.disabled = d.pod;
      b.addEventListener("click", function () {
        d.rider = r;
        render();
      });
      assign.appendChild(b);
    });
    panel.appendChild(assign);

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = d.photo;
    box.disabled = d.pod;
    box.addEventListener("change", function () {
      d.photo = box.checked;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("Photo on POD"));
    panel.appendChild(tog);

    var actions = el("div", "actions");
    var pod = el("button", "btn-sm" + (d.pod ? " ghost" : ""), d.pod ? "POD marked" : "Mark POD");
    pod.type = "button";
    pod.disabled = d.pod || !d.rider;
    pod.addEventListener("click", function () {
      d.pod = true;
      d.ts = stamp();
      if (!d.photo) d.photo = true;
      render();
    });
    actions.appendChild(pod);
    panel.appendChild(actions);
    if (!d.rider) {
      panel.appendChild(el("p", "empty", "Assign Hafiz or Siti before POD."));
    }
    if (d.pod) {
      panel.appendChild(el("div", "stamp on", "POD · " + d.rider + " · " + d.ts + (d.photo ? " · photo" : "")));
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
          cell.className += " has" + (hit.id === selected ? " on" : "") + (hit.pod ? " pod" : "");
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
    var legend = el("p", "empty", "SS2 left · Kelana mid · Ara top · Sunway right. Selected " + d.code + ".");
    panel.appendChild(legend);
    return panel;
  }

  function injectCss() {
    if (document.getElementById("flitz-demo-css")) return;
    var s = document.createElement("style");
    s.id = "flitz-demo-css";
    s.textContent = [
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
      "#demo-root .fz-cell:disabled{cursor:default;opacity:.55}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .fz-3{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
