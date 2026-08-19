window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var selected = "f1";
  var flash = "";
  var day = 86400000;
  var now = new Date();
  var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  function expiryIn(days) {
    return new Date(today + days * day).toISOString().slice(0, 10);
  }

  var files = [
    { id: "f1", employer: "Puan Salmah", maid: "Ayu", country: "Indonesia", expiry: expiryIn(12), phone: "+60 12-*** 0142", docs: [1, 1, 1, 1], reminder: "", status: "active", officeAt: "" },
    { id: "f2", employer: "Mr Tan Wei", maid: "Liza", country: "Philippines", expiry: expiryIn(74), phone: "+60 17-*** 2088", docs: [1, 1, 0, 0], reminder: "", status: "active", officeAt: "" },
    { id: "f3", employer: "Encik Farid", maid: "Sreyneang", country: "Cambodia", expiry: expiryIn(132), phone: "+60 11-*** 3351", docs: [1, 1, 1, 1], reminder: "", status: "runaway", officeAt: "" },
    { id: "f4", employer: "Puan Kavitha", maid: "Maya", country: "Indonesia", expiry: expiryIn(27), phone: "+60 16-*** 4920", docs: [1, 1, 1, 1], reminder: "", status: "active", officeAt: "" },
    { id: "f5", employer: "Mr Lim Jun", maid: "Rina", country: "Philippines", expiry: expiryIn(201), phone: "+60 19-*** 5814", docs: [1, 1, 1, 1], reminder: "", status: "active", officeAt: "" },
    { id: "f6", employer: "Puan Nadia", maid: "Dara", country: "Cambodia", expiry: expiryIn(46), phone: "+60 13-*** 6673", docs: [1, 1, 1, 1], reminder: "", status: "active", officeAt: "" }
  ];

  function find(id) { return desk.find(files, id); }
  function daysLeft(file) {
    return Math.round((Date.parse(file.expiry + "T00:00:00Z") - today) / day);
  }
  function permitDue(file) { return daysLeft(file) <= 30; }
  function docsComplete(file) {
    return file.docs.every(function (done) { return done; });
  }
  function needsAction(file) {
    return !docsComplete(file) || file.status === "runaway" || (permitDue(file) && !file.reminder);
  }
  function actionCount() {
    return files.filter(needsAction).length;
  }
  function actionLabel() {
    var count = actionCount();
    return count + " open action" + (count === 1 ? "" : "s");
  }
  function statusLabel(file) {
    if (file.status === "runaway") return "Runaway";
    if (file.status === "office") return "At office";
    return "Active";
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · agency file board"));
    bar.appendChild(el("div", "shell-hint", actionLabel()));
    root.appendChild(bar);
    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · 6 files · no messages sent"));
    root.appendChild(sample);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Agency files · " + actionLabel()));
    var list = el("div", "list");
    files.forEach(function (file, index) {
      var ticket = el("button", "ticket" + (file.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", file.employer + " · " + file.maid));
      body.appendChild(el("div", "meta", file.country + " · permit " + daysLeft(file) + " days left · #" + desk.pad(index + 1)));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      if (permitDue(file)) {
        chips.appendChild(el("span", "tag " + (file.reminder ? "ok" : "warn"), file.reminder ? "reminder queued" : "permit due"));
      }
      if (!docsComplete(file)) chips.appendChild(el("span", "tag warn", "incomplete docs"));
      if (file.status === "runaway") chips.appendChild(el("span", "tag warn", "runaway"));
      if (file.status === "office") chips.appendChild(el("span", "tag ok", "at office"));
      if (file.status === "active" && !permitDue(file) && docsComplete(file)) chips.appendChild(el("span", "tag ok", "clear"));
      ticket.appendChild(chips);
      ticket.addEventListener("click", function () {
        selected = file.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function detailPanel(file) {
    var labels = ["Passport", "Permit", "FOMEMA", "Contract"];
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Agency file"));
    panel.appendChild(el("div", "serving-name", file.employer + " · " + file.maid));
    panel.appendChild(el("p", "desk-sub", file.country + " · sample file"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Permit expiry"));
    kv.appendChild(el("div", "", file.expiry + " · " + daysLeft(file) + " days left"));
    kv.appendChild(el("div", "k", "Case status"));
    kv.appendChild(el("div", "", statusLabel(file)));
    kv.appendChild(el("div", "k", "Permit reminder"));
    kv.appendChild(el("div", "", file.reminder ? "queued · " + file.reminder : (permitDue(file) ? "due now" : "not due")));
    labels.forEach(function (label, index) {
      kv.appendChild(el("div", "k", index ? "" : "Documents"));
      kv.appendChild(el("div", "", (file.docs[index] ? "✓ " : "☐ ") + label));
    });
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var complete = docsComplete(file);
    var docs = el("button", "btn-sm" + (complete ? " ghost" : ""), complete ? "Documents complete" : "Mark docs complete");
    docs.type = "button";
    docs.disabled = complete;
    docs.addEventListener("click", function () {
      file.docs = [1, 1, 1, 1];
      flash = "Documents complete · " + file.maid + " · checklist updated";
      render();
    });
    actions.appendChild(docs);

    var canRemind = permitDue(file) && !file.reminder;
    var reminder = el("button", "btn-sm" + (complete && canRemind ? "" : " ghost"), file.reminder ? "Reminder queued" : "Queue permit reminder");
    reminder.type = "button";
    reminder.disabled = !canRemind;
    reminder.addEventListener("click", function () {
      file.reminder = desk.hms();
      flash = "queued to " + file.phone + " · permit " + file.expiry + " · " + file.reminder + " · not sent";
      render();
    });
    actions.appendChild(reminder);

    if (file.status === "runaway") {
      var office = el("button", "btn-sm", "Mark at office");
      office.type = "button";
      office.addEventListener("click", function () {
        file.status = "office";
        file.officeAt = desk.hms();
        flash = file.maid + " returned to office · " + file.officeAt;
        render();
      });
      actions.appendChild(office);
    }
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (file.officeAt) panel.appendChild(el("div", "stamp on", "AT OFFICE · " + file.officeAt));
    panel.appendChild(el("p", "empty", "One agency file board. Not a generic ATS. Not ClassFlow."));
    return panel;
  }

  render();
};
