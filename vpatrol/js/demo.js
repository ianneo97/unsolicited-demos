window.mountDemo = function (root, c) {
  var selected = "g4";
  var payrollHours = 0;
  var flash = "";
  var stamp = "";
  var posts = ["Gate A", "Lobby", "Carpark B", "Perimeter"];
  var guards = [
    { id: "g1", name: "Amir Hakim", post: "Gate A", shift: "2000–0800", inn: true, time: "19:54:12", checkpoint: "Gate A", missed: false, hours: 0, epf: false },
    { id: "g2", name: "Nur Izzati", post: "Lobby", shift: "2000–0800", inn: true, time: "19:58:40", checkpoint: "Lobby", missed: false, hours: 0, epf: false },
    { id: "g3", name: "Kumar Raj", post: "Carpark B", shift: "2000–0800", inn: false, time: "", checkpoint: "", missed: true, hours: 0, epf: false },
    { id: "g4", name: "Siti Nabila", post: "", shift: "", inn: false, time: "", checkpoint: "", missed: false, hours: 0, epf: false },
    { id: "g5", name: "Daniel Lee", post: "", shift: "", inn: false, time: "", checkpoint: "", missed: false, hours: 0, epf: false },
    { id: "g6", name: "Farhan Zaki", post: "", shift: "", inn: false, time: "", checkpoint: "", missed: false, hours: 0, epf: false },
    { id: "g7", name: "Aina Sofea", post: "", shift: "", inn: false, time: "", checkpoint: "", missed: false, hours: 0, epf: false },
    { id: "g8", name: "Harpreet Singh", post: "", shift: "", inn: false, time: "", checkpoint: "", missed: false, hours: 0, epf: false }
  ];

  function find(id) { return desk.find(guards, id); }

  function covered() {
    var seen = {};
    guards.forEach(function (guard) {
      if (guard.post) seen[guard.post] = true;
    });
    return Object.keys(seen).length;
  }

  function nextPost() {
    var used = {};
    guards.forEach(function (guard) {
      if (guard.post) used[guard.post] = true;
    });
    return posts.filter(function (post) { return !used[post]; })[0] || posts[guards.filter(function (guard) { return guard.post; }).length % posts.length];
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · Tonight's guard board"));
    bar.appendChild(el("div", "shell-hint", covered() + " / 4 posts covered · " + payrollHours.toFixed(1) + "h payroll"));
    root.appendChild(bar);
    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · 8 guards · 2000–0800 shifts"));
    root.appendChild(hint);
    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(cardPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Roster · " + covered() + " / 4 posts covered"));
    var list = el("div", "list");
    guards.forEach(function (guard) {
      var ticket = el("button", "ticket" + (guard.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", guard.name));
      body.appendChild(el("div", "meta", guard.post ? guard.post + " · " + guard.shift : "Awaiting assignment"));
      ticket.appendChild(body);
      var chips = el("div", "desk-chips");
      if (!guard.post) chips.appendChild(el("span", "tag warn", "no post"));
      else chips.appendChild(el("span", "tag", guard.inn ? "IN · " + guard.time : guard.post));
      if (guard.missed) chips.appendChild(el("span", "tag warn", "missed round"));
      if (guard.checkpoint) chips.appendChild(el("span", "tag ok", guard.checkpoint));
      if (guard.hours) chips.appendChild(el("span", "tag ok", guard.hours.toFixed(1) + "h · EPF"));
      ticket.appendChild(chips);
      ticket.addEventListener("click", function () {
        selected = guard.id;
        flash = "";
        render();
      });
      list.appendChild(ticket);
    });
    panel.appendChild(list);
    return panel;
  }

  function cardPanel(guard) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Guard detail"));
    panel.appendChild(el("div", "serving-name", guard.name));
    panel.appendChild(el("p", "desk-sub", guard.id.toUpperCase() + " · tonight's roster"));
    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Post"));
    kv.appendChild(el("div", "", guard.post || "No post assigned"));
    kv.appendChild(el("div", "k", "Shift"));
    kv.appendChild(el("div", "", guard.shift || "Not rostered"));
    kv.appendChild(el("div", "k", "Checkpoint"));
    kv.appendChild(el("div", "", guard.inn ? "IN · " + guard.time + " · " + guard.checkpoint : guard.missed ? "Missed round" : "Not scanned"));
    kv.appendChild(el("div", "k", "Payroll"));
    kv.appendChild(el("div", "money", guard.hours ? guard.hours.toFixed(1) + "h · EPF sample" : "Pending"));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var assign = el("button", "btn-sm", "Assign shift");
    assign.type = "button";
    assign.disabled = Boolean(guard.post);
    assign.addEventListener("click", function () {
      guard.post = nextPost();
      guard.shift = "2000–0800";
      flash = "Assigned · " + guard.name + " · " + guard.post + " · " + guard.shift;
      stamp = "ROSTER · " + desk.stamp("Tonight");
      render();
    });
    actions.appendChild(assign);

    var scan = el("button", "btn-sm", "Checkpoint scan");
    scan.type = "button";
    scan.disabled = !guard.post || guard.inn;
    scan.addEventListener("click", function () {
      guard.inn = true;
      guard.time = desk.hms();
      guard.checkpoint = guard.post;
      guard.missed = false;
      flash = "Checkpoint IN · " + guard.name + " · " + guard.post + " · " + guard.time;
      stamp = "PATROL · " + desk.stamp("Tonight");
      render();
    });
    actions.appendChild(scan);

    var payroll = el("button", "btn-sm", "Payroll tick");
    payroll.type = "button";
    payroll.disabled = !guard.post || Boolean(guard.hours);
    payroll.addEventListener("click", function () {
      guard.hours = 12;
      guard.epf = true;
      payrollHours += guard.hours;
      flash = "Payroll ticked · " + guard.name + " · 12.0h · EPF sample · total " + payrollHours.toFixed(1) + "h";
      stamp = "PAYROLL · " + desk.stamp("Tonight");
      render();
    });
    actions.appendChild(payroll);
    panel.appendChild(actions);
    if (flash) panel.appendChild(el("p", "desk-flash", flash));
    if (stamp) panel.appendChild(el("div", "stamp on", stamp));
    panel.appendChild(el("p", "empty", "Sample data only. No live rostering, patrol or payroll records."));
    return panel;
  }

  render();
};
