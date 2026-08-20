window.mountDemo = function (root, c) {
  document.head.appendChild(Object.assign(document.createElement("link"), { rel: "icon", href: "data:," }));
  var el = window.el;
  var desk = window.desk;
  var selected = "b1";
  var flash = "Select a title to check out or return.";
  var finesCollected = 0;
  var nextLoan = 31;
  var nextReceipt = 81;
  var borrowers = ["Nur Aisyah Rahman", "Harith Iskandar", "Mei Xuan Lim", "Kavin Raj"];

  function date(offset) {
    var now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + offset))
      .toISOString().slice(0, 10);
  }

  var rows = [
    { id: "b1", title: "Jejak Kota Lama", code: "978-967-2410-18-X", borrower: "Siti Hajar Omar", loan: "LF-SEED-014", loanAt: date(-19) + " · 10:12:04", due: date(-5), receipt: null },
    { id: "b2", title: "The Rain at Jalan Tengah", code: "978-629-7654-02-X", borrower: "Daniel Tan Wei Ming", loan: "LF-SEED-019", loanAt: date(-11) + " · 14:31:26", due: date(3), receipt: null },
    { id: "b3", title: "Burung-Burung Senja", code: "978-967-8801-77-X", borrower: "", loan: "", loanAt: "", due: "", receipt: null },
    { id: "b4", title: "Small Gardens, Big Cities", code: "978-629-3102-44-X", borrower: "", loan: "", loanAt: "", due: "", receipt: null },
    { id: "b5", title: "Rahsia di Hujung Lorong", code: "978-967-5508-09-X", borrower: "Amirul Hakim Musa", loan: "LF-SEED-022", loanAt: date(-26) + " · 09:06:48", due: date(-12), receipt: null },
    { id: "b6", title: "Letters from the Monsoon", code: "978-629-4120-63-X", borrower: "", loan: "", loanAt: "", due: "", receipt: null }
  ];

  function dayNumber(value) {
    var parts = value.split("-").map(Number);
    return Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000;
  }

  function overdueDays(row) {
    return row.due ? Math.max(0, dayNumber(date(0)) - dayNumber(row.due)) : 0;
  }

  function onLoanCount() {
    return rows.filter(function (row) { return !!row.loan; }).length;
  }

  function overdueCount() {
    return rows.filter(function (row) { return overdueDays(row) > 0; }).length;
  }

  function find(id) {
    return desk.find(rows, id);
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", c.name + " · circulation desk"));
    bar.appendChild(el("div", "shell-hint", "On loan " + onLoanCount() + "/6 · overdue " + overdueCount() + " · fines " + desk.rm(finesCollected)));
    root.appendChild(bar);

    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · fake titles, members and codes · in-memory only"));
    root.appendChild(sample);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Catalogue · 6 titles"));
    var list = el("div", "list");

    rows.forEach(function (row) {
      var late = overdueDays(row);
      var ticket = el("button", "ticket" + (row.id === selected ? " on" : ""));
      ticket.type = "button";

      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", row.title));
      body.appendChild(el("div", "meta", row.code + " · FAKE"));
      body.appendChild(el("div", "meta", row.loan ? row.borrower + " · due " + row.due : "available for checkout"));
      ticket.appendChild(body);

      var chips = el("div", "desk-chips");
      chips.appendChild(el("span", "tag" + (row.loan ? "" : " ok"), row.loan ? "on loan" : "on shelf"));
      if (late) chips.appendChild(el("span", "tag warn", late + " days overdue"));
      ticket.appendChild(chips);

      ticket.addEventListener("click", function () {
        selected = row.id;
        flash = "Selected “" + row.title + "”.";
        render();
      });
      list.appendChild(ticket);
    });

    panel.appendChild(list);
    return panel;
  }

  function detailPanel(row) {
    var late = overdueDays(row);
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Title record · " + row.id.toUpperCase()));
    panel.appendChild(el("div", "serving-name", row.title));
    panel.appendChild(el("p", "desk-sub", row.code + " · fake catalogue record"));

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Status"));
    kv.appendChild(el("div", "", row.loan ? "on loan" : "on shelf"));
    kv.appendChild(el("div", "k", "Borrower"));
    kv.appendChild(el("div", "", row.borrower || "—"));
    kv.appendChild(el("div", "k", "Loan ID"));
    kv.appendChild(el("div", "", row.loan || "—"));
    kv.appendChild(el("div", "k", "Checked out"));
    kv.appendChild(el("div", "", row.loanAt || "—"));
    kv.appendChild(el("div", "k", "Due date"));
    kv.appendChild(el("div", "", row.due || "—"));
    kv.appendChild(el("div", "k", "Overdue"));
    kv.appendChild(el("div", "", late ? late + " days · " + desk.rm(late * 0.2) + " due" : "0 days · " + desk.rm(0)));
    kv.appendChild(el("div", "k", "Last receipt"));
    kv.appendChild(el("div", "", row.receipt ? row.receipt.id + " · " + desk.rm(row.receipt.fine) : "—"));
    kv.appendChild(el("div", "k", "Fines collected"));
    kv.appendChild(el("div", "", desk.rm(finesCollected)));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var checkout = el("button", "btn-sm", "Checkout");
    checkout.type = "button";
    checkout.disabled = !!row.loan;
    checkout.addEventListener("click", function () {
      row.borrower = borrowers[(nextLoan - 31) % borrowers.length];
      row.loan = "LF-" + date(0).replace(/-/g, "") + "-" + desk.pad(nextLoan++, 3);
      row.loanAt = date(0) + " · " + desk.hms();
      row.due = date(14);
      row.receipt = null;
      flash = "Checked out to " + row.borrower + " · due " + row.due + ".";
      render();
    });
    actions.appendChild(checkout);

    var returnButton = el("button", "btn-sm ghost", "Return + receipt");
    returnButton.type = "button";
    returnButton.disabled = !row.loan;
    returnButton.addEventListener("click", function () {
      var days = overdueDays(row);
      var fine = Math.round(days * 20) / 100;
      var receipt = {
        id: "LFR-" + date(0).replace(/-/g, "") + "-" + desk.pad(nextReceipt++, 3),
        at: date(0) + " · " + desk.hms(),
        fine: fine,
        loan: row.loan
      };
      finesCollected = Math.round((finesCollected + fine) * 100) / 100;
      row.borrower = "";
      row.loan = "";
      row.loanAt = "";
      row.due = "";
      row.receipt = receipt;
      flash = "Returned · " + receipt.id + " · fine " + desk.rm(fine) + " · collected " + desk.rm(finesCollected) + ".";
      render();
    });
    actions.appendChild(returnButton);
    panel.appendChild(actions);
    panel.appendChild(el("p", "desk-flash", flash));

    if (row.receipt) {
      panel.appendChild(el("div", "stamp on", "RETURN RECEIPT · " + row.receipt.id + " · " + row.receipt.loan + " · FINE " + desk.rm(row.receipt.fine) + " · " + row.receipt.at));
    } else if (row.loan) {
      panel.appendChild(el("div", "stamp on", "ON LOAN · " + row.loan + " · " + row.loanAt + " · DUE " + row.due));
    } else {
      panel.appendChild(el("div", "stamp on", "ON SHELF · READY FOR CHECKOUT"));
    }
    return panel;
  }

  render();
};
