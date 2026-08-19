window.mountDemo = function (root) {
  injectCss();

  var visits = [
    {
      id: "k01",
      q: "K01",
      name: "Nurul Huda",
      age: 32,
      sex: "F",
      pay: "tpa",
      panel: "AIA",
      member: "****4412",
      claimNo: "KD-AIA-0819-0142",
      status: "serving",
      claim: "pending",
      einvoice: false,
      saved: false,
      time: "09:12",
      complaint: "Right ear pain since last night. Worse lying on that side. No fever this morning. No discharge.",
      exam: "Alert. T 36.8, BP 112/74. Right TM red, landmarks blurred, no perforation. Canal clear. Left ear normal. Throat not injected. No mastoid tenderness.",
      plan: "Acute otitis media. Amoxicillin 500 mg TDS × 5 days. Paracetamol 1 g PRN. Review if fever, discharge, or pain worse at 48 h.",
      lines: [
        { label: "Consultation", amt: 55 },
        { label: "Amoxicillin 5 days", amt: 18 }
      ]
    },
    {
      id: "k02",
      q: "K02",
      name: "Ong Kah Wai",
      age: 47,
      sex: "M",
      pay: "tpa",
      panel: "Great Eastern",
      member: "****7703",
      claimNo: "KD-GE-0819-0088",
      status: "waiting",
      claim: "submitted",
      einvoice: false,
      saved: false,
      time: "09:28",
      complaint: "Diabetes review. Home fasting 8.2 this morning. Tired after lunch. Still on metformin.",
      exam: "BP 136/84, T 36.6. BMI 28. Heart regular, no oedema. Feet: pulses present, no ulcers. Last HbA1c 7.4 (June).",
      plan: "Continue metformin 500 mg BD. Recheck HbA1c in 3 months. Written diet advice. Return earlier if fasting stays above 9.",
      lines: [
        { label: "Consultation", amt: 70 },
        { label: "Glucometer check", amt: 15 }
      ]
    },
    {
      id: "k03",
      q: "K03",
      name: "Priya Menon",
      age: 29,
      sex: "F",
      pay: "cash",
      panel: "cash",
      member: "",
      claimNo: "",
      status: "waiting",
      claim: "none",
      einvoice: false,
      saved: false,
      time: "09:41",
      complaint: "Sore throat two days, pain on swallowing. No cough. Needs MC for a shift tomorrow.",
      exam: "T 37.6, BP 110/70. Tonsils enlarged, no exudate. Cervical nodes not tender. Chest clear. No rash.",
      plan: "Viral pharyngitis. Lozenges, fluids. MC 2 days. Return if fever over 38.5 or cannot swallow fluids.",
      lines: [
        { label: "Consultation", amt: 50 },
        { label: "Medical certificate · 2 days", amt: 15 }
      ]
    },
    {
      id: "k04",
      q: "K04",
      name: "Azman Hashim",
      age: 54,
      sex: "M",
      pay: "tpa",
      panel: "AIA",
      member: "****1908",
      claimNo: "KD-AIA-0819-0110",
      status: "waiting",
      claim: "approved",
      einvoice: false,
      saved: false,
      time: "10:05",
      complaint: "Blood pressure review. Home readings 148/92 this week. No chest pain, no headache.",
      exam: "BP 142/88 sitting, 138/86 standing. Heart regular. No ankle oedema. Lungs clear.",
      plan: "Increase amlodipine 5 → 10 mg daily. Recheck in 2 weeks. Written home BP log.",
      lines: [
        { label: "Consultation", amt: 60 },
        { label: "Amlodipine 10 mg (14 tabs)", amt: 22 }
      ]
    }
  ];

  var selected = "k01";
  var filter = "all";

  function findById(id) {
    var i;
    for (i = 0; i < visits.length; i++) {
      if (visits[i].id === id) return visits[i];
    }
    return visits[0];
  }

  function waiting() {
    return visits.filter(function (v) { return v.status === "waiting"; });
  }

  function visible() {
    if (filter === "tpa") return visits.filter(function (v) { return v.pay === "tpa"; });
    if (filter === "cash") return visits.filter(function (v) { return v.pay === "cash"; });
    return visits;
  }

  function rm(n) {
    return "RM " + Number(n).toFixed(2);
  }

  function totalOf(v) {
    return v.lines.reduce(function (s, line) { return s + line.amt; }, 0);
  }

  function panelLabel(v) {
    return v.pay === "tpa" ? v.panel : "cash";
  }

  function statusChip(status) {
    if (status === "serving") return el("span", "tag ok", "in room");
    if (status === "seen") return el("span", "tag ok", "seen");
    return el("span", "tag", "waiting");
  }

  function payChip(v) {
    if (v.pay === "tpa") return el("span", "tag warn", v.panel);
    return el("span", "tag", "cash");
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", "kumoDoc · today"));
    bar.appendChild(left);
    var open = visits.filter(function (v) {
      return v.pay === "tpa" && v.claim !== "approved";
    }).length;
    bar.appendChild(el("div", "shell-hint", "SAMPLE DATA · 4 visits · " + open + " TPA open · not a live clinic"));
    root.appendChild(bar);

    var grid = el("div", "shell-grid kd-3");
    var v = findById(selected);
    grid.appendChild(todayPanel());
    grid.appendChild(emrPanel(v));
    grid.appendChild(billPanel(v));
    root.appendChild(grid);
  }

  function todayPanel() {
    var panel = el("div", "panel");
    var head = el("div", "kd-head");
    var waitN = waiting().length;
    head.appendChild(el("h3", "", "Today · " + waitN + " waiting"));
    var call = el("button", "btn-sm", "Call next");
    call.type = "button";
    call.disabled = waitN === 0;
    call.addEventListener("click", function () {
      visits.forEach(function (x) {
        if (x.status === "serving") x.status = "seen";
      });
      var next = waiting()[0];
      if (next) {
        next.status = "serving";
        selected = next.id;
      }
      render();
    });
    head.appendChild(call);
    panel.appendChild(head);

    var filters = el("div", "kd-filters");
    [
      { key: "all", label: "All" },
      { key: "tpa", label: "TPA" },
      { key: "cash", label: "Cash" }
    ].forEach(function (f) {
      var b = el("button", "tab" + (filter === f.key ? " on" : ""), f.label);
      b.type = "button";
      b.addEventListener("click", function () {
        filter = f.key;
        var list = visible();
        if (list.length && !list.some(function (x) { return x.id === selected; })) {
          selected = list[0].id;
        }
        render();
      });
      filters.appendChild(b);
    });
    panel.appendChild(filters);

    var list = el("div", "list");
    var rows = visible();
    rows.forEach(function (v) {
      var t = el("button", "ticket" + (v.id === selected ? " on" : "") + (v.status === "seen" ? " kd-seen" : ""));
      t.type = "button";
      var qwrap = el("div", "kd-qwrap");
      qwrap.appendChild(el("div", "kd-qno", v.q));
      var body = el("div", "kd-grow");
      body.appendChild(el("div", "who", v.name));
      var pay = v.pay === "tpa" ? v.panel + " · sample" : "cash · sample";
      body.appendChild(el("div", "meta", pay + " · " + v.time));
      t.appendChild(qwrap);
      t.appendChild(body);
      var chips = el("div", "kd-chips");
      chips.appendChild(payChip(v));
      chips.appendChild(statusChip(v.status));
      t.appendChild(chips);
      t.addEventListener("click", function () {
        selected = v.id;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    if (!rows.length) {
      panel.appendChild(el("p", "empty", "No visits in this filter."));
    }
    return panel;
  }

  function emrPanel(v) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "EMR · visit"));
    panel.appendChild(el("div", "serving-name", v.name));
    panel.appendChild(el(
      "p",
      "kd-sub",
      v.age + " yrs · " + v.sex + " · " + v.q + " · " + panelLabel(v) + (v.pay === "tpa" ? " (sample)" : "")
    ));

    panel.appendChild(el("label", "lbl", "Chief complaint"));
    var cc = el("textarea", "field kd-cc");
    cc.rows = 3;
    cc.value = v.complaint;
    cc.setAttribute("aria-label", "Chief complaint");
    cc.addEventListener("input", function () {
      v.complaint = cc.value;
      v.saved = false;
    });
    panel.appendChild(cc);

    panel.appendChild(el("label", "lbl", "Exam"));
    var exam = el("textarea", "field kd-exam");
    exam.rows = 4;
    exam.value = v.exam;
    exam.setAttribute("aria-label", "Exam");
    exam.addEventListener("input", function () {
      v.exam = exam.value;
      v.saved = false;
    });
    panel.appendChild(exam);

    panel.appendChild(el("label", "lbl", "Plan"));
    var plan = el("textarea", "field kd-plan");
    plan.rows = 3;
    plan.value = v.plan;
    plan.setAttribute("aria-label", "Plan");
    plan.addEventListener("input", function () {
      v.plan = plan.value;
      v.saved = false;
    });
    panel.appendChild(plan);

    var actions = el("div", "actions");
    var save = el("button", "btn-sm", "Save note");
    save.type = "button";
    save.addEventListener("click", function () {
      v.complaint = cc.value;
      v.exam = exam.value;
      v.plan = plan.value;
      v.saved = true;
      render();
    });
    actions.appendChild(save);
    panel.appendChild(actions);
    if (v.saved) {
      panel.appendChild(el("p", "kd-flash", "Note saved · " + v.q + " · this page only"));
    }
    return panel;
  }

  function billPanel(v) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", v.pay === "tpa" ? "Bill · TPA claim" : "Bill · cash"));

    v.lines.forEach(function (line) {
      var row = el("div", "tx");
      row.appendChild(el("div", "", line.label));
      row.appendChild(el("div", "amt", rm(line.amt)));
      panel.appendChild(row);
    });

    var tot = totalOf(v);
    var pl = el("div", "pl");
    var totRow = el("div", "pl-row total");
    totRow.appendChild(el("div", "", "Total"));
    totRow.appendChild(el("div", "money", rm(tot)));
    pl.appendChild(totRow);
    var due = el("div", "pl-row");
    if (v.pay === "tpa") {
      due.appendChild(el("div", "k", "Patient payable"));
      due.appendChild(el("div", "money", rm(0)));
    } else {
      due.appendChild(el("div", "k", "Due now"));
      due.appendChild(el("div", "money", rm(tot)));
    }
    pl.appendChild(due);
    panel.appendChild(pl);

    if (v.pay === "tpa") {
      panel.appendChild(claimCard(v));
    } else {
      panel.appendChild(cashInvoice(v));
    }
    return panel;
  }

  function claimCard(v) {
    var card = el("div", "kd-claim");
    card.appendChild(el("div", "kd-claim-h", "TPA claim · sample"));

    var steps = el("div", "kd-steps");
    ["pending", "submitted", "approved"].forEach(function (s) {
      var on = v.claim === s;
      var past = (s === "pending" && v.claim !== "pending") ||
        (s === "submitted" && v.claim === "approved");
      steps.appendChild(el("span", "kd-step" + (on ? " on" : "") + (past ? " past" : ""), s));
    });
    card.appendChild(steps);

    var kv = el("div", "kd-kv");
    kv.appendChild(el("div", "k", "Insurer"));
    kv.appendChild(el("div", "", v.panel + " (sample)"));
    kv.appendChild(el("div", "k", "Member"));
    kv.appendChild(el("div", "", v.member));
    kv.appendChild(el("div", "k", "Claim #"));
    kv.appendChild(el("div", "", v.claimNo));
    kv.appendChild(el("div", "k", "State"));
    kv.appendChild(el("div", "", v.claim));
    card.appendChild(kv);

    var actions = el("div", "actions");
    if (v.claim === "pending") {
      var submit = el("button", "btn-sm", "Submit claim");
      submit.type = "button";
      submit.addEventListener("click", function () {
        v.claim = "submitted";
        render();
      });
      actions.appendChild(submit);
    } else if (v.claim === "submitted") {
      var approve = el("button", "btn-sm", "Mark approved");
      approve.type = "button";
      approve.addEventListener("click", function () {
        v.claim = "approved";
        render();
      });
      actions.appendChild(approve);
    }
    if (actions.childNodes.length) card.appendChild(actions);

    var stamp = el("div", "stamp" + (v.claim === "approved" ? " on" : ""));
    if (v.claim === "pending") {
      stamp.textContent = "Claim not sent · " + v.claimNo;
    } else if (v.claim === "submitted") {
      stamp.textContent = "Submitted to " + v.panel + " · " + v.claimNo;
    } else {
      stamp.textContent = "Approved · " + v.panel + " · " + v.claimNo;
    }
    card.appendChild(stamp);
    return card;
  }

  function cashInvoice(v) {
    var card = el("div", "kd-claim");
    card.appendChild(el("div", "kd-claim-h", "e-invoice · cash"));

    var actions = el("div", "actions");
    var issue = el("button", "btn-sm" + (v.einvoice ? " ghost" : ""), v.einvoice ? "e-invoice issued" : "Issue e-invoice");
    issue.type = "button";
    issue.disabled = v.einvoice;
    issue.addEventListener("click", function () {
      v.einvoice = true;
      render();
    });
    actions.appendChild(issue);
    card.appendChild(actions);

    var stamp = el("div", "stamp" + (v.einvoice ? " on" : ""));
    stamp.textContent = v.einvoice
      ? "MyInvois (sample) · MYINV-SAMPLE-" + v.q + "-0819"
      : "Paper receipt · e-invoice off";
    card.appendChild(stamp);
    return card;
  }

  function injectCss() {
    if (document.getElementById("kumodoc-demo-css")) return;
    var s = document.createElement("style");
    s.id = "kumodoc-demo-css";
    s.textContent = [
      "#demo-root .kd-3{grid-template-columns:minmax(220px,.95fr) minmax(250px,1.2fr) minmax(220px,.95fr)}",
      "#demo-root .kd-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}",
      "#demo-root .kd-head h3{margin-bottom:0}",
      "#demo-root .kd-filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}",
      "#demo-root .kd-qwrap{flex:0 0 auto}",
      "#demo-root .kd-qno{font-family:var(--mono);font-weight:600;font-size:15px;letter-spacing:-.03em;min-width:36px;color:color-mix(in srgb,var(--accent) 40%,var(--shell-ink))}",
      "#demo-root .ticket.on .kd-qno{color:var(--shell-ink)}",
      "#demo-root .kd-grow{flex:1;min-width:0}",
      "#demo-root .kd-chips{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:0 0 auto}",
      "#demo-root .ticket.kd-seen{opacity:.55}",
      "#demo-root .kd-sub{font-size:13px;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .kd-flash{margin-top:8px;font-family:var(--mono);font-size:11px;color:#b7e0cc}",
      "#demo-root textarea.kd-cc{min-height:64px}",
      "#demo-root textarea.kd-exam{min-height:92px}",
      "#demo-root textarea.kd-plan{min-height:72px}",
      "#demo-root .kd-claim{margin-top:14px;padding:12px;border:1px solid var(--shell-line);border-radius:var(--r);background:color-mix(in srgb,var(--accent) 6%,var(--shell-lift))}",
      "#demo-root .kd-claim-h{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--shell-muted);margin-bottom:10px}",
      "#demo-root .kd-steps{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}",
      "#demo-root .kd-step{font-family:var(--mono);font-size:10px;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:999px;border:1px solid var(--shell-line);color:var(--shell-muted)}",
      "#demo-root .kd-step.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--shell-ink)}",
      "#demo-root .kd-step.past{border-color:color-mix(in srgb,var(--ok) 40%,var(--shell-line));color:#b7e0cc}",
      "#demo-root .kd-kv{display:grid;grid-template-columns:6.2rem 1fr;gap:6px 12px;font-size:13px;margin-bottom:4px}",
      "#demo-root .kd-kv .k{color:var(--shell-muted)}",
      "#demo-root .ticket{align-items:center}",
      "@media (max-width:860px){#demo-root .kd-3{grid-template-columns:1fr}}"
    ].join("");
    document.head.appendChild(s);
  }

  render();
};
