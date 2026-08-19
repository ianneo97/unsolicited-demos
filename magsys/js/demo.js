window.mountDemo = function (root) {
  injectCss();

  var clinic = {
    key: "clinic",
    tab: "C-MagSys",
    title: "C-MagSys · morning clinic",
    hint: "SAMPLE DATA · GP morning · not a live clinic",
    selected: "a12",
    patients: [
      {
        id: "a12", q: "A12", name: "Farah Ismail", age: 28, sex: "F",
        kind: "walk-in", wait: 22, status: "serving",
        complaint: "Fever and dry cough, two days",
        bp: "118/76", temp: "38.2", note: "", noteSaved: false,
        consult: 55, mcFee: 15, mc: false, einvoice: false
      },
      {
        id: "a13", q: "A13", name: "Lim Wei Jun", age: 44, sex: "M",
        kind: "appointment", wait: 14, status: "waiting",
        complaint: "Blood pressure review. Home readings high this week.",
        bp: "142/88", temp: "36.8", note: "", noteSaved: false,
        consult: 60, mcFee: 15, mc: false, einvoice: false
      },
      {
        id: "a14", q: "A14", name: "Kumar Subramaniam", age: 36, sex: "M",
        kind: "walk-in", wait: 9, status: "waiting",
        complaint: "Flu since Monday. Needs MC for work.",
        bp: "124/80", temp: "37.6", note: "", noteSaved: false,
        consult: 45, mcFee: 15, mc: false, einvoice: false
      },
      {
        id: "a15", q: "A15", name: "Siti Mariam", age: 31, sex: "F",
        kind: "appointment", wait: 6, status: "waiting",
        complaint: "Sore throat, pain on swallowing.",
        bp: "110/70", temp: "37.4", note: "", noteSaved: false,
        consult: 55, mcFee: 15, mc: false, einvoice: false
      },
      {
        id: "a16", q: "A16", name: "Hafiz Rahman", age: 52, sex: "M",
        kind: "walk-in", wait: 3, status: "waiting",
        complaint: "Fasting sugar check. Tired after meals.",
        bp: "136/84", temp: "36.6", note: "", noteSaved: false,
        consult: 70, mcFee: 15, mc: false, einvoice: false
      }
    ]
  };

  var dental = {
    key: "dental",
    tab: "D-MagSys",
    title: "D-MagSys · chair board",
    hint: "SAMPLE DATA · dental chairs · not a live clinic",
    selected: "c1",
    chairs: [
      {
        id: "c1", chair: "Chair 1", name: "Nur Aisyah", age: 29,
        procedure: "Scaling + polish", tooth: "Full mouth", toothN: "FM",
        status: "in-chair", slot: "09:30",
        note: "Light calculus. Oral hygiene fair.",
        next: "19 Nov 2026", nextWhy: "scale / review", booked: false
      },
      {
        id: "c2", chair: "Chair 2", name: "Daniel Ong", age: 34,
        procedure: "Composite filling", tooth: "36 · lower left molar", toothN: "36",
        status: "waiting", slot: "10:15",
        note: "Occlusal caries. No pain on percussion.",
        next: "26 Aug 2026", nextWhy: "polish + review bite", booked: false
      },
      {
        id: "c3", chair: "Chair 3", name: "Priya Nair", age: 41,
        procedure: "Check-up + bitewing", tooth: "Upper right quadrant", toothN: "UR",
        status: "waiting", slot: "11:00",
        note: "Stain on 14–16. No pockets over 3 mm.",
        next: "19 Feb 2027", nextWhy: "6-month check", booked: false
      },
      {
        id: "c4", chair: "Chair 4", name: "Wong Mei Ling", age: 22,
        procedure: "Extraction", tooth: "48 · lower right wisdom", toothN: "48",
        status: "waiting", slot: "11:45",
        note: "Partially erupted. Local anaesthesia planned.",
        next: "2 Sep 2026", nextWhy: "socket review", booked: false
      }
    ]
  };

  var hospital = {
    key: "hospital",
    tab: "H-MagSys",
    title: "H-MagSys · outpatient",
    hint: "SAMPLE DATA · outpatient list · not a live clinic",
    selected: "hn3",
    visits: [
      {
        id: "hn1", mrn: "HN-08421", name: "Ahmad Zaki", age: 58, sex: "M",
        visit: "Follow-up", status: "seen",
        order: "None today", orderState: "—",
        note: "Diabetes follow-up. Continue metformin."
      },
      {
        id: "hn2", mrn: "HN-08422", name: "Aina Roslan", age: 27, sex: "F",
        visit: "Consult", status: "seen",
        order: "None today", orderState: "—",
        note: "New consult. Migraine history, no red flags."
      },
      {
        id: "hn3", mrn: "HN-08423", name: "Rajesh Menon", age: 62, sex: "M",
        visit: "Lab review", status: "lab-pending",
        order: "FBC + HbA1c", orderState: "Pending",
        note: "Here for last week's bloods. Wait for lab."
      },
      {
        id: "hn4", mrn: "HN-08424", name: "Chen Hui Min", age: 39, sex: "F",
        visit: "Consult", status: "seen",
        order: "None today", orderState: "—",
        note: "Skin consult. Topical issued last visit."
      },
      {
        id: "hn5", mrn: "HN-08425", name: "Gopal Krishnan", age: 51, sex: "M",
        visit: "Follow-up", status: "lab-pending",
        order: "LFT", orderState: "Pending",
        note: "On statin. Liver enzymes due."
      }
    ]
  };

  var current = "clinic";

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findById(list, id) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[0];
  }

  function waitingClinic() {
    return clinic.patients.filter(function (p) { return p.status === "waiting"; });
  }

  function waitingDental() {
    return dental.chairs.filter(function (c) { return c.status === "waiting"; });
  }

  function statusChip(status) {
    if (status === "serving" || status === "in-chair") return el("span", "tag ok", status === "serving" ? "in room" : "in chair");
    if (status === "seen" || status === "done") return el("span", "tag ok", "seen");
    if (status === "lab-pending") return el("span", "tag warn", "lab pending");
    if (status === "result") return el("span", "tag ok", "result in");
    if (status === "walk-in") return el("span", "tag", "walk-in");
    if (status === "appointment") return el("span", "tag", "appt");
    return el("span", "tag", status);
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    var title = current === "clinic" ? clinic.title : current === "dental" ? dental.title : hospital.title;
    var hint = current === "clinic" ? clinic.hint : current === "dental" ? dental.hint : hospital.hint;
    left.appendChild(el("div", "shell-title", title));
    bar.appendChild(left);

    var tabs = el("div", "tabs");
    [
      { key: "clinic", tab: clinic.tab },
      { key: "dental", tab: dental.tab },
      { key: "hospital", tab: hospital.tab }
    ].forEach(function (m) {
      var b = el("button", "tab" + (m.key === current ? " on" : ""), m.tab);
      b.type = "button";
      b.addEventListener("click", function () {
        current = m.key;
        render();
      });
      tabs.appendChild(b);
    });
    bar.appendChild(tabs);
    root.appendChild(bar);

    var hintBar = el("div", "shell-bar");
    hintBar.appendChild(el("div", "shell-hint", hint));
    root.appendChild(hintBar);

    if (current === "clinic") renderClinic();
    else if (current === "dental") renderDental();
    else renderHospital();
  }

  function renderClinic() {
    var grid = el("div", "shell-grid his-3");
    var p = findById(clinic.patients, clinic.selected);
    grid.appendChild(clinicQueue());
    grid.appendChild(clinicEncounter(p));
    grid.appendChild(clinicBill(p));
    root.appendChild(grid);
  }

  function clinicQueue() {
    var panel = el("div", "panel");
    var head = el("div", "mg-head");
    var waitN = waitingClinic().length;
    head.appendChild(el("h3", "", "Queue · " + waitN + " waiting"));
    var call = el("button", "btn-sm", "Call next");
    call.type = "button";
    call.disabled = waitN === 0;
    call.addEventListener("click", function () {
      var serving = clinic.patients.filter(function (x) { return x.status === "serving"; });
      serving.forEach(function (x) { x.status = "seen"; });
      var next = waitingClinic()[0];
      if (!next) {
        render();
        return;
      }
      next.status = "serving";
      clinic.selected = next.id;
      render();
    });
    head.appendChild(call);
    panel.appendChild(head);

    var list = el("div", "list");
    clinic.patients.forEach(function (p) {
      var t = el("button", "ticket" + (p.id === clinic.selected ? " on" : "") + (p.status === "seen" ? " mg-seen" : ""));
      t.type = "button";
      var qwrap = el("div", "mg-qwrap");
      qwrap.appendChild(el("div", "mg-qno", p.q));
      var body = el("div", "mg-grow");
      body.appendChild(el("div", "who", p.name));
      var meta = p.status === "serving"
        ? "in room · " + p.kind
        : p.status === "seen"
          ? "seen · " + p.kind
          : p.kind + " · " + p.wait + " min wait";
      body.appendChild(el("div", "meta", meta));
      t.appendChild(qwrap);
      t.appendChild(body);
      t.appendChild(statusChip(p.status === "waiting" ? p.kind : p.status));
      t.addEventListener("click", function () {
        clinic.selected = p.id;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    if (waitN === 0) {
      panel.appendChild(el("p", "empty", "Morning queue clear."));
    }
    return panel;
  }

  function clinicEncounter(p) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Open encounter"));
    if (!p) {
      panel.appendChild(el("p", "empty", "Call next to start the morning."));
      return panel;
    }
    panel.appendChild(el("div", "serving-name", p.name));
    panel.appendChild(el("p", "mg-sub", p.age + " yrs · " + p.sex + " · " + p.q + " · " + p.kind));

    var kv = el("div", "mg-kv");
    kv.appendChild(el("div", "k", "Chief complaint"));
    kv.appendChild(el("div", "", p.complaint));
    panel.appendChild(kv);

    var vitals = el("div", "mg-vitals");
    var bpBox = el("div");
    bpBox.appendChild(el("label", "lbl", "BP"));
    var bp = el("input", "field");
    bp.type = "text";
    bp.value = p.bp;
    bp.setAttribute("aria-label", "Blood pressure");
    bp.addEventListener("input", function () { p.bp = bp.value; });
    bpBox.appendChild(bp);
    var tempBox = el("div");
    tempBox.appendChild(el("label", "lbl", "Temp °C"));
    var temp = el("input", "field");
    temp.type = "text";
    temp.value = p.temp;
    temp.setAttribute("aria-label", "Temperature");
    temp.addEventListener("input", function () { p.temp = temp.value; });
    tempBox.appendChild(temp);
    vitals.appendChild(bpBox);
    vitals.appendChild(tempBox);
    panel.appendChild(vitals);

    panel.appendChild(el("label", "lbl", "Note"));
    var note = el("textarea", "field");
    note.rows = 2;
    note.maxLength = 180;
    note.placeholder = "Two-line clinic note";
    note.value = p.note;
    note.setAttribute("aria-label", "Encounter note");
    note.addEventListener("input", function () {
      p.note = note.value;
      p.noteSaved = false;
    });
    panel.appendChild(note);

    var actions = el("div", "actions");
    var save = el("button", "btn-sm", "Save note");
    save.type = "button";
    save.addEventListener("click", function () {
      p.note = note.value;
      p.noteSaved = true;
      render();
    });
    actions.appendChild(save);
    panel.appendChild(actions);
    if (p.noteSaved) {
      panel.appendChild(el("p", "mg-flash", "Note saved · " + p.q));
    }
    return panel;
  }

  function clinicBill(p) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Bill"));
    if (!p) {
      panel.appendChild(el("p", "empty", "Bill appears with the encounter."));
      return panel;
    }

    var consult = el("div", "tx");
    consult.appendChild(el("div", "", "Consultation"));
    consult.appendChild(el("div", "amt", rm(p.consult)));
    panel.appendChild(consult);

    var mcRow = el("label", "toggle");
    var mcBox = document.createElement("input");
    mcBox.type = "checkbox";
    mcBox.checked = p.mc;
    mcBox.addEventListener("change", function () {
      p.mc = mcBox.checked;
      render();
    });
    mcRow.appendChild(mcBox);
    mcRow.appendChild(document.createTextNode("Medical certificate (MC) · " + rm(p.mcFee)));
    panel.appendChild(mcRow);

    var total = p.consult + (p.mc ? p.mcFee : 0);
    var pl = el("div", "pl");
    var tot = el("div", "pl-row total");
    tot.appendChild(el("div", "", "Total"));
    tot.appendChild(el("div", "money", rm(total)));
    pl.appendChild(tot);
    panel.appendChild(pl);

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = p.einvoice;
    box.addEventListener("change", function () {
      p.einvoice = box.checked;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("e-invoice · MyInvois (LHDN)"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (p.einvoice ? " on" : ""), "");
    if (p.einvoice) {
      stamp.textContent = "MyInvois (sample) · " + ("MYINV-SAMPLE-" + p.q + "-0819");
    } else {
      stamp.textContent = "Paper receipt · e-invoice off";
    }
    panel.appendChild(stamp);
    return panel;
  }

  function renderDental() {
    var grid = el("div", "shell-grid his-2");
    var c = findById(dental.chairs, dental.selected);
    grid.appendChild(dentalQueue());
    grid.appendChild(dentalChart(c));
    root.appendChild(grid);
  }

  function dentalQueue() {
    var panel = el("div", "panel");
    var head = el("div", "mg-head");
    var waitN = waitingDental().length;
    head.appendChild(el("h3", "", "Chairs · " + waitN + " waiting"));
    var seat = el("button", "btn-sm", "Seat next");
    seat.type = "button";
    seat.disabled = waitN === 0;
    seat.addEventListener("click", function () {
      dental.chairs.forEach(function (x) {
        if (x.status === "in-chair") x.status = "done";
      });
      var next = waitingDental()[0];
      if (next) {
        next.status = "in-chair";
        dental.selected = next.id;
      }
      render();
    });
    head.appendChild(seat);
    panel.appendChild(head);

    var list = el("div", "list");
    dental.chairs.forEach(function (c) {
      var t = el("button", "ticket" + (c.id === dental.selected ? " on" : "") + (c.status === "done" ? " mg-seen" : ""));
      t.type = "button";
      var qwrap = el("div", "mg-qwrap");
      qwrap.appendChild(el("div", "mg-qno", c.toothN));
      var body = el("div", "mg-grow");
      body.appendChild(el("div", "who", c.chair + " · " + c.name));
      body.appendChild(el("div", "meta", c.procedure + " · " + c.slot));
      t.appendChild(qwrap);
      t.appendChild(body);
      t.appendChild(statusChip(c.status));
      t.addEventListener("click", function () {
        dental.selected = c.id;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function dentalChart(c) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Dental chart"));
    panel.appendChild(el("div", "serving-name", c.name));
    panel.appendChild(el("p", "mg-sub", c.age + " yrs · " + c.chair + " · " + c.slot));

    var tooth = el("div", "mg-tooth");
    tooth.appendChild(el("div", "n", c.toothN));
    tooth.appendChild(el("div", "p", c.procedure));
    panel.appendChild(tooth);

    var kv = el("div", "mg-kv");
    kv.appendChild(el("div", "k", "Tooth / region"));
    kv.appendChild(el("div", "", c.tooth));
    kv.appendChild(el("div", "k", "Procedure"));
    kv.appendChild(el("div", "", c.procedure));
    kv.appendChild(el("div", "k", "Note"));
    kv.appendChild(el("div", "", c.note));
    kv.appendChild(el("div", "k", "Next visit"));
    kv.appendChild(el("div", "", c.next + " · " + c.nextWhy));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var book = el("button", "btn-sm" + (c.booked ? " ghost" : ""), c.booked ? "Next visit booked" : "Confirm next visit");
    book.type = "button";
    book.disabled = c.booked;
    book.addEventListener("click", function () {
      c.booked = true;
      render();
    });
    actions.appendChild(book);
    panel.appendChild(actions);
    if (c.booked) {
      var stamp = el("div", "stamp on", "Next visit booked · " + c.next + " · " + c.nextWhy);
      panel.appendChild(stamp);
    }
    return panel;
  }

  function renderHospital() {
    var grid = el("div", "shell-grid his-2");
    var v = findById(hospital.visits, hospital.selected);
    grid.appendChild(hospitalList());
    grid.appendChild(hospitalChart(v));
    root.appendChild(grid);
  }

  function hospitalList() {
    var panel = el("div", "panel");
    var pending = hospital.visits.filter(function (v) { return v.status === "lab-pending"; }).length;
    panel.appendChild(el("h3", "", "Outpatient · " + pending + " lab pending"));
    var list = el("div", "list");
    hospital.visits.forEach(function (v) {
      var t = el("button", "ticket" + (v.id === hospital.selected ? " on" : ""));
      t.type = "button";
      var body = el("div", "mg-grow");
      body.appendChild(el("div", "who", v.name));
      body.appendChild(el("div", "meta", v.mrn + " · " + v.visit + " · " + v.age + " yrs"));
      t.appendChild(body);
      t.appendChild(statusChip(v.status));
      t.addEventListener("click", function () {
        hospital.selected = v.id;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function hospitalChart(v) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Visit"));
    panel.appendChild(el("div", "serving-name", v.name));
    panel.appendChild(el("p", "mg-sub", v.mrn + " · " + v.age + " yrs · " + v.sex));

    var kv = el("div", "mg-kv");
    kv.appendChild(el("div", "k", "Visit type"));
    kv.appendChild(el("div", "", v.visit));
    kv.appendChild(el("div", "k", "Order"));
    kv.appendChild(el("div", "", v.order));
    kv.appendChild(el("div", "k", "Order status"));
    kv.appendChild(el("div", "", v.orderState));
    kv.appendChild(el("div", "k", "Note"));
    kv.appendChild(el("div", "", v.note));
    panel.appendChild(kv);

    if (v.status === "lab-pending") {
      var actions = el("div", "actions");
      var mark = el("button", "btn-sm", "Mark result in");
      mark.type = "button";
      mark.addEventListener("click", function () {
        v.status = "result";
        v.orderState = "Result in · ready to review";
        v.note = "Lab back. Review with patient.";
        render();
      });
      actions.appendChild(mark);
      panel.appendChild(actions);
    } else if (v.status === "result") {
      panel.appendChild(el("div", "stamp on", "Lab result in · " + v.order));
    } else {
      panel.appendChild(el("div", "stamp", "Seen · no open order"));
    }
    return panel;
  }

  function injectCss() {
    if (document.getElementById("magsys-demo-css")) return;
    var s = document.createElement("style");
    s.id = "magsys-demo-css";
    s.textContent = [
      "#demo-root .his-3{grid-template-columns:minmax(210px,.92fr) minmax(240px,1.2fr) minmax(200px,.9fr)}",
      "#demo-root .his-2{grid-template-columns:minmax(240px,.95fr) minmax(260px,1.15fr)}",
      "#demo-root .mg-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}",
      "#demo-root .mg-head h3{margin-bottom:0}",
      "#demo-root .mg-qwrap{flex:0 0 auto}",
      "#demo-root .mg-qno{font-family:var(--mono);font-weight:600;font-size:15px;letter-spacing:-.03em;min-width:36px;color:color-mix(in srgb,var(--accent) 40%,var(--shell-ink))}",
      "#demo-root .ticket.on .mg-qno{color:var(--shell-ink)}",
      "#demo-root .mg-grow{flex:1;min-width:0}",
      "#demo-root .ticket.mg-seen{opacity:.55}",
      "#demo-root .mg-sub{font-size:13px;color:var(--shell-muted);margin-bottom:12px}",
      "#demo-root .mg-vitals{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}",
      "#demo-root .mg-vitals .field{width:100%}",
      "#demo-root .mg-vitals .lbl{margin-top:8px}",
      "#demo-root .mg-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root .mg-tooth{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;min-width:84px;min-height:76px;margin:4px 0 14px;padding:8px 12px;border:1px solid var(--shell-line);border-radius:var(--r);background:color-mix(in srgb,var(--accent) 10%,var(--shell-lift))}",
      "#demo-root .mg-tooth .n{font-family:var(--mono);font-size:22px;font-weight:600;letter-spacing:-.04em}",
      "#demo-root .mg-tooth .p{font-size:11px;color:var(--shell-muted);margin-top:4px;text-align:center}",
      "#demo-root .mg-kv{display:grid;grid-template-columns:7.5rem 1fr;gap:8px 14px;font-size:14px;margin:10px 0 8px}","#demo-root .mg-kv .k{color:var(--shell-muted)}","#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .his-3,#demo-root .his-2{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
