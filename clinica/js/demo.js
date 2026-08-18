window.mountDemo = function (root) {
  var seq = 4;
  var patients = [
    { id: 1, name: "Aisha Rahman", source: "sample", status: "waiting", eInvoice: false, stamped: false },
    { id: 2, name: "Raj Kumar", source: "sample", status: "waiting", eInvoice: false, stamped: false },
    { id: 3, name: "Mei Tan", source: "sample", status: "waiting", eInvoice: false, stamped: false }
  ];
  var lastDone = null;
  var fee = 80;

  function serving() {
    return patients.find(function (p) { return p.status === "serving"; }) || null;
  }

  function waiting() {
    return patients.filter(function (p) { return p.status === "waiting"; });
  }

  function render() {
    root.replaceChildren();
    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", "Front desk"));
    bar.appendChild(el("div", "shell-hint", "SAMPLE DATA · not a live clinic"));
    root.appendChild(bar);

    var grid = el("div", "shell-grid cols-3");
    grid.appendChild(queuePanel());
    grid.appendChild(servePanel());
    grid.appendChild(invoicePanel());
    root.appendChild(grid);
  }

  function queuePanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Queue · " + waiting().length + " waiting"));
    var list = el("div", "list");
    var q = waiting();
    if (!q.length) list.appendChild(el("p", "empty", "Queue is empty."));
    q.forEach(function (p, i) {
      var t = el("div", "ticket");
      var left = el("div");
      left.appendChild(el("div", "who", (i + 1) + ". " + p.name));
      left.appendChild(el("div", "meta", p.source === "sample" ? "Sample walk-in" : "Walk-in added here"));
      t.appendChild(left);
      t.appendChild(el("span", "tag", p.source));
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
      patients.push({
        id: seq++,
        name: name,
        source: "walk-in",
        status: "waiting",
        eInvoice: false,
        stamped: false
      });
      render();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") add.click();
    });
    row.appendChild(input);
    row.appendChild(add);
    panel.appendChild(row);
    return panel;
  }

  function servePanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Now serving"));
    var cur = serving();
    if (cur) {
      panel.appendChild(el("div", "serving-name", cur.name));
      panel.appendChild(el("p", "empty", cur.source === "sample" ? "Sample patient" : "Walk-in added on this page"));
    } else {
      panel.appendChild(el("p", "empty", "No one at the counter. Call next."));
    }
    var actions = el("div", "actions");
    var call = el("button", "btn-sm", "Call next");
    call.type = "button";
    call.disabled = !!cur || !waiting().length;
    call.addEventListener("click", function () {
      var next = waiting()[0];
      if (!next || serving()) return;
      next.status = "serving";
      render();
    });
    var done = el("button", "btn-sm ghost", "Mark done");
    done.type = "button";
    done.disabled = !cur;
    done.addEventListener("click", function () {
      var s = serving();
      if (!s) return;
      s.status = "done";
      lastDone = s;
      render();
    });
    actions.appendChild(call);
    actions.appendChild(done);
    panel.appendChild(actions);
    var finished = patients.filter(function (p) { return p.status === "done"; }).length;
    panel.appendChild(el("p", "empty", finished + " done this session"));
    return panel;
  }

  function invoicePanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Invoice"));
    var person = serving() || lastDone;
    if (!person) {
      panel.appendChild(el("p", "empty", "Invoice appears when you call a patient."));
      return panel;
    }
    panel.appendChild(el("div", "who", person.name));
    panel.appendChild(el("p", "empty", "Consultation · sample line"));
    var kv = el("div", "kv");
    kv.appendChild(el("div", "k", "Consultation"));
    kv.appendChild(el("div", "money", "RM " + fee.toFixed(2)));
    kv.appendChild(el("div", "k", "Total"));
    kv.appendChild(el("div", "money", "RM " + fee.toFixed(2)));
    panel.appendChild(kv);

    var tog = el("label", "toggle");
    var box = document.createElement("input");
    box.type = "checkbox";
    box.checked = person.eInvoice;
    box.addEventListener("change", function () {
      person.eInvoice = box.checked;
      if (!box.checked) person.stamped = false;
      render();
    });
    tog.appendChild(box);
    tog.appendChild(document.createTextNode("e-invoice (sample)"));
    panel.appendChild(tog);

    var stamp = el("div", "stamp" + (person.stamped ? " on" : ""), "");
    if (!person.eInvoice) {
      stamp.textContent = "e-invoice off · paper / receipt only";
    } else if (!person.stamped) {
      stamp.textContent = "e-invoice ready · not submitted";
      var send = el("button", "btn-sm", "Stamp e-invoice");
      send.type = "button";
      send.style.marginTop = "10px";
      send.addEventListener("click", function () {
        person.stamped = true;
        render();
      });
      panel.appendChild(stamp);
      panel.appendChild(send);
      return panel;
    } else {
      stamp.textContent = "Submitted (sample) · LHDN e-invoice · " + person.name;
    }
    panel.appendChild(stamp);
    return panel;
  }

  render();
};
