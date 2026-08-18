window.mountDemo = function (root) {
  var visits = [
    {
      id: 12,
      name: "Siti Aminah",
      reason: "Sore throat, two days",
      complaint: "Sore throat, two days. No fever this morning.",
      plan: "Symptomatic. Review if worse.",
      bill: 70,
      tpa: "pending"
    },
    {
      id: 13,
      name: "Wong Jia Hao",
      reason: "Follow-up, hypertension",
      complaint: "Follow-up. Home readings 138/86.",
      plan: "Continue current meds. Recheck in 4 weeks.",
      bill: 80,
      tpa: "approved"
    },
    {
      id: 14,
      name: "Fatimah Binti Ali",
      reason: "Ankle sprain",
      complaint: "Twisted left ankle yesterday after a fall.",
      plan: "RICE. Off work 2 days. Return if swelling grows.",
      bill: 90,
      tpa: "pending"
    }
  ];
  var selected = 0;
  var draft = {
    complaint: visits[0].complaint,
    plan: visits[0].plan
  };

  function current() {
    return visits[selected];
  }

  function render() {
    var v = current();
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "Clinic OS"));
    bar.appendChild(el("div", "shell-hint", "SAMPLE DATA \u00b7 3 visits \u00b7 no placeholder names"));
    root.appendChild(bar);

    var grid = el("div", "shell-grid cols-3");
    grid.appendChild(queuePanel());
    grid.appendChild(emrPanel(v));
    grid.appendChild(billPanel(v));
    root.appendChild(grid);
  }

  function queuePanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Queue"));
    var list = el("div", "list");
    visits.forEach(function (v, i) {
      var t = el("button", "ticket" + (i === selected ? " on" : ""));
      t.type = "button";
      var body = el("div");
      body.appendChild(el("div", "who", "#" + v.id + "  " + v.name));
      body.appendChild(el("div", "meta", v.reason));
      t.appendChild(body);
      t.appendChild(el("span", "tag", "sample"));
      t.addEventListener("click", function () {
        selected = i;
        draft.complaint = visits[i].complaint;
        draft.plan = visits[i].plan;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function emrPanel(v) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "EMR note"));
    panel.appendChild(el("div", "serving-name", v.name));
    panel.appendChild(el("p", "empty", "Sample visit #" + v.id));

    panel.appendChild(el("label", "lbl", "Chief complaint"));
    var cc = el("textarea", "field");
    cc.value = draft.complaint;
    cc.setAttribute("aria-label", "Chief complaint");
    cc.addEventListener("input", function () {
      draft.complaint = cc.value;
    });
    panel.appendChild(cc);

    panel.appendChild(el("label", "lbl", "Plan"));
    var plan = el("textarea", "field");
    plan.value = draft.plan;
    plan.setAttribute("aria-label", "Plan");
    plan.addEventListener("input", function () {
      draft.plan = plan.value;
    });
    panel.appendChild(plan);

    var save = el("button", "btn-sm", "Save note");
    save.type = "button";
    var status = el("p", "empty", "");
    save.addEventListener("click", function () {
      v.complaint = draft.complaint.trim() || v.complaint;
      v.plan = draft.plan.trim() || v.plan;
      draft.complaint = v.complaint;
      draft.plan = v.plan;
      status.textContent = "Saved on this page only.";
    });
    panel.appendChild(save);
    panel.appendChild(status);
    return panel;
  }

  function billPanel(v) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Bill \u00b7 TPA"));
    var kv = el("div", "kv");
    kv.appendChild(el("div", "k", "Consultation"));
    kv.appendChild(el("div", "money", "RM " + v.bill.toFixed(2)));
    kv.appendChild(el("div", "k", "Patient"));
    kv.appendChild(el("div", "", v.name));
    panel.appendChild(kv);

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = v.tpa === "approved";
    box.addEventListener("change", function () {
      v.tpa = box.checked ? "approved" : "pending";
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("TPA claim approved"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (v.tpa === "approved" ? " on" : ""));
    stamp.textContent = v.tpa === "approved"
      ? "TPA approved (sample) \u00b7 claim #" + v.id
      : "TPA pending (sample) \u00b7 toggle to approve";
    panel.appendChild(stamp);
    panel.appendChild(el("p", "empty", "e-invoice not sent. This is a local demo."));
    return panel;
  }

  render();
};
