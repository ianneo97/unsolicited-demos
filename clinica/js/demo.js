window.mountDemo = function (root) {
  injectCss();

  var nextQ = 17;
  var selected = "a12";
  var patients = [
    {
      id: "a12", q: "A12", name: "Amira Hassan", age: 29, sex: "F",
      kind: "walk-in", wait: 19, status: "serving",
      reason: "Sore throat and fever since last night. Teaching at 11.",
      note: "", noteSaved: false,
      consult: 55, mcFee: 15, mc: false, einvoice: false
    },
    {
      id: "a13", q: "A13", name: "Chen Wei Hao", age: 41, sex: "M",
      kind: "appointment", wait: 14, status: "waiting",
      reason: "Blood pressure review. Home cuff 148/90 this week.",
      note: "", noteSaved: false,
      consult: 60, mcFee: 15, mc: false, einvoice: false
    },
    {
      id: "a14", q: "A14", name: "Kavitha Menon", age: 34, sex: "F",
      kind: "walk-in", wait: 9, status: "waiting",
      reason: "Flu since Monday. Needs MC for the office in USJ.",
      note: "", noteSaved: false,
      consult: 50, mcFee: 15, mc: false, einvoice: false
    },
    {
      id: "a15", q: "A15", name: "Hafiz Iskandar", age: 52, sex: "M",
      kind: "appointment", wait: 6, status: "waiting",
      reason: "Fasting sugar check. Tired after lunch.",
      note: "", noteSaved: false,
      consult: 70, mcFee: 15, mc: false, einvoice: false
    },
    {
      id: "a16", q: "A16", name: "Liew Mei Ling", age: 26, sex: "F",
      kind: "walk-in", wait: 3, status: "waiting",
      reason: "Skin rash on both arms after a new detergent.",
      note: "", noteSaved: false,
      consult: 55, mcFee: 15, mc: false, einvoice: false
    }
  ];

  var staff = [
    { id: "s1", name: "Dr Nadia Rahman", role: "Locum GP", hours: 4.5, pay: 450, paid: false },
    { id: "s2", name: "Siti Zubaidah", role: "Staff nurse", hours: 8.0, pay: 180, paid: false },
    { id: "s3", name: "Jason Lee", role: "Clinic assistant", hours: 8.0, pay: 120, paid: false }
  ];

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function findById(list, id) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[0] || null;
  }

  function waiting() {
    return patients.filter(function (p) { return p.status === "waiting"; });
  }

  function serving() {
    return patients.filter(function (p) { return p.status === "serving"; });
  }

  function statusChip(p) {
    if (p.status === "serving") return el("span", "tag ok", "in room");
    if (p.status === "seen") return el("span", "tag ok", "seen");
    if (p.kind === "appointment") return el("span", "tag", "appt");
    return el("span", "tag", "walk-in");
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "Clinica ERP · USJ morning"));
    bar.appendChild(left);
    root.appendChild(bar);

    var hintBar = el("div", "shell-bar");
    hintBar.appendChild(el("div", "shell-hint", "SAMPLE DATA · single clinic · not a live clinic"));
    root.appendChild(hintBar);

    var p = findById(patients, selected);
    var grid = el("div", "shell-grid cl-3");
    grid.appendChild(queuePanel());
    grid.appendChild(visitPanel(p));
    grid.appendChild(billPanel(p));
    root.appendChild(grid);
    root.appendChild(payrollStrip());
  }

  function queuePanel() {
    var panel = el("div", "panel");
    var head = el("div", "cl-head");
    var waitN = waiting().length;
    head.appendChild(el("h3", "", "Queue · " + waitN + " waiting"));
    var btns = el("div", "cl-head-btns");

    var call = el("button", "btn-sm", "Call next");
    call.type = "button";
    call.disabled = waitN === 0;
    call.addEventListener("click", function () {
      serving().forEach(function (x) { x.status = "seen"; });
      var next = waiting()[0];
      if (!next) {
        render();
        return;
      }
      next.status = "serving";
      selected = next.id;
      render();
    });

    var done = el("button", "btn-sm ghost", "Mark done");
    done.type = "button";
    done.disabled = serving().length === 0;
    done.addEventListener("click", function () {
      serving().forEach(function (x) { x.status = "seen"; });
      render();
    });

    btns.appendChild(call);
    btns.appendChild(done);
    head.appendChild(btns);
    panel.appendChild(head);

    var list = el("div", "list");
    patients.forEach(function (p) {
      var t = el("button", "ticket" + (p.id === selected ? " on" : "") + (p.status === "seen" ? " cl-seen" : ""));
      t.type = "button";
      var qwrap = el("div", "cl-qwrap");
      qwrap.appendChild(el("div", "cl-qno", p.q));
      var body = el("div", "cl-grow");
      body.appendChild(el("div", "who", p.name));
      var meta = p.status === "serving"
        ? "in room · " + p.kind
        : p.status === "seen"
          ? "seen · " + p.kind
          : p.kind + " · " + p.wait + " min wait";
      body.appendChild(el("div", "meta", meta));
      t.appendChild(qwrap);
      t.appendChild(body);
      t.appendChild(statusChip(p));
      t.addEventListener("click", function () {
        selected = p.id;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);

    var row = el("div", "row");
    var input = el("input", "field");
    input.type = "text";
    input.placeholder = "Walk-in name";
    input.maxLength = 40;
    input.setAttribute("aria-label", "Walk-in patient name");
    var add = el("button", "btn-sm", "Add walk-in");
    add.type = "button";
    add.addEventListener("click", function () {
      var name = input.value.replace(/\s+/g, " ").trim();
      if (!name) {
        input.focus();
        return;
      }
      var qn = nextQ++;
      var id = "a" + qn;
      patients.push({
        id: id,
        q: "A" + qn,
        name: name,
        age: "—",
        sex: "—",
        kind: "walk-in",
        wait: 0,
        status: "waiting",
        reason: "Walk-in at the counter this morning.",
        note: "",
        noteSaved: false,
        consult: 55,
        mcFee: 15,
        mc: false,
        einvoice: false
      });
      selected = id;
      render();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") add.click();
    });
    row.appendChild(input);
    row.appendChild(add);
    panel.appendChild(row);

    if (waitN === 0 && serving().length === 0) {
      panel.appendChild(el("p", "empty", "Morning queue clear."));
    }
    return panel;
  }

  function visitPanel(p) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Open visit"));
    if (!p) {
      panel.appendChild(el("p", "empty", "Call next to start the morning."));
      return panel;
    }

    panel.appendChild(el("div", "serving-name", p.name));
    panel.appendChild(el("p", "cl-sub", p.age + " yrs · " + p.sex + " · " + p.q + " · " + p.kind));

    var kv = el("div", "cl-kv");
    kv.appendChild(el("div", "k", "Reason"));
    kv.appendChild(el("div", "", p.reason));
    kv.appendChild(el("div", "k", "Status"));
    kv.appendChild(el("div", "", p.status === "serving" ? "in room" : p.status === "seen" ? "seen" : p.wait + " min wait"));
    panel.appendChild(kv);

    panel.appendChild(el("label", "lbl", "Note"));
    var note = el("textarea", "field");
    note.rows = 2;
    note.maxLength = 180;
    note.placeholder = "Two-line clinic note";
    note.value = p.note;
    note.setAttribute("aria-label", "Visit note");
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
    var mc = el("button", "btn-sm" + (p.mc ? " ghost" : ""), p.mc ? "MC issued" : "Issue MC");
    mc.type = "button";
    mc.addEventListener("click", function () {
      p.mc = !p.mc;
      render();
    });
    actions.appendChild(save);
    actions.appendChild(mc);
    panel.appendChild(actions);

    if (p.noteSaved) {
      panel.appendChild(el("p", "cl-flash", "Note saved · " + p.q));
    }
    if (p.mc) {
      panel.appendChild(el("p", "cl-flash", "MC on the bill · " + rm(p.mcFee)));
    }
    return panel;
  }

  function billPanel(p) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Bill"));
    if (!p) {
      panel.appendChild(el("p", "empty", "Bill appears with the visit."));
      return panel;
    }

    panel.appendChild(el("p", "cl-sub", p.name + " · " + p.q));

    var consult = el("div", "tx");
    consult.appendChild(el("div", "", "Consultation"));
    consult.appendChild(el("div", "amt", rm(p.consult)));
    panel.appendChild(consult);

    if (p.mc) {
      var mcRow = el("div", "tx");
      mcRow.appendChild(el("div", "", "Medical certificate (MC)"));
      mcRow.appendChild(el("div", "amt", rm(p.mcFee)));
      panel.appendChild(mcRow);
    } else {
      panel.appendChild(el("p", "empty", "No MC on this visit."));
    }

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
      stamp.textContent = "MyInvois (sample) · MYINV-SAMPLE-" + p.q + "-0819";
    } else {
      stamp.textContent = "Paper receipt · e-invoice off";
    }
    panel.appendChild(stamp);
    return panel;
  }

  function payrollStrip() {
    var wrap = el("div", "cl-pay");
    var head = el("div", "cl-head");
    var unpaid = staff.filter(function (s) { return !s.paid; }).length;
    head.appendChild(el("h3", "", "Today payroll · " + unpaid + " unpaid"));
    head.appendChild(el("div", "cl-hint", "SAMPLE DATA · hours only · not a live run"));
    wrap.appendChild(head);

    var grid = el("div", "cl-staffs");
    staff.forEach(function (s) {
      var card = el("div", "cl-staff" + (s.paid ? " paid" : ""));
      var top = el("div", "cl-staff-top");
      var who = el("div");
      who.appendChild(el("div", "who", s.name));
      who.appendChild(el("div", "meta", s.role + " · " + s.hours.toFixed(1) + " h"));
      top.appendChild(who);
      top.appendChild(el("span", "tag" + (s.paid ? " ok" : ""), s.paid ? "paid" : "unpaid"));
      card.appendChild(top);

      var foot = el("div", "cl-staff-foot");
      foot.appendChild(el("div", "money", rm(s.pay)));
      var pay = el("button", "btn-sm" + (s.paid ? " ghost" : ""), s.paid ? "Paid (sample)" : "Mark paid");
      pay.type = "button";
      pay.disabled = s.paid;
      pay.addEventListener("click", function () {
        s.paid = true;
        render();
      });
      foot.appendChild(pay);
      card.appendChild(foot);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function injectCss() {
    if (document.getElementById("clinica-demo-css")) return;
    var s = document.createElement("style");
    s.id = "clinica-demo-css";
    s.textContent = [
      "#demo-root .cl-3{grid-template-columns:minmax(210px,.92fr) minmax(240px,1.2fr) minmax(200px,.9fr)}",
      "#demo-root .cl-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}",
      "#demo-root .cl-head h3{margin-bottom:0}",
      "#demo-root .cl-head-btns{display:flex;flex-wrap:wrap;gap:6px}",
      "#demo-root .cl-qwrap{flex:0 0 auto}",
      "#demo-root .cl-qno{font-family:var(--mono);font-weight:600;font-size:15px;letter-spacing:-.03em;min-width:36px;color:color-mix(in srgb,var(--accent) 40%,var(--shell-ink))}",
      "#demo-root .ticket.on .cl-qno{color:var(--shell-ink)}",
      "#demo-root .cl-grow{flex:1;min-width:0}",
      "#demo-root .ticket.cl-seen{opacity:.55}",
      "#demo-root .cl-sub{font-size:13px;color:var(--shell-muted);margin-bottom:12px}",
      "#demo-root .cl-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root .cl-kv{display:grid;grid-template-columns:6.5rem 1fr;gap:8px 14px;font-size:14px;margin:10px 0 8px}",
      "#demo-root .cl-kv .k{color:var(--shell-muted)}",
      "#demo-root .ticket{align-items:center}",
      "#demo-root .cl-hint{font-family:var(--mono);font-size:11px;color:var(--shell-muted)}",
      "#demo-root .cl-pay{padding:14px 16px 16px;border-top:1px solid var(--shell-line);background:var(--shell-lift)}",
      "#demo-root .cl-pay .cl-head{margin-bottom:10px}",
      "#demo-root .cl-staffs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}",
      "#demo-root .cl-staff{padding:10px 12px;border:1px solid var(--shell-line);border-radius:var(--r);background:var(--shell)}",
      "#demo-root .cl-staff.paid{border-color:color-mix(in srgb,var(--ok) 45%,var(--shell-line))}",
      "#demo-root .cl-staff-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}",
      "#demo-root .cl-staff .who{font-weight:550;letter-spacing:-.02em;font-size:14px}",
      "#demo-root .cl-staff .meta{font-family:var(--mono);font-size:11px;color:var(--shell-muted);margin-top:3px}",
      "#demo-root .cl-staff-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px}",
      "@media (max-width:860px){#demo-root .cl-3,#demo-root .cl-staffs{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
