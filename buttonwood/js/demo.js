window.mountDemo = function (root, c) {
  var el = window.el;
  var desk = window.desk;
  var selected = "j1";
  var flash = "Select a job, then open its forwarding file.";

  var rows = [
    { id: "j1", seq: 41, shipper: "Awan Ceramics Sdn Bhd", pol: "Port Klang", pod: "Jebel Ali", container: "MSKU 4810001", charge: 4280, file: "", opened: "", bl: "", invoice: 0 },
    { id: "j2", seq: 42, shipper: "Pine & Palm Trading", pol: "Penang", pod: "Ho Chi Minh", container: "TCLU 5820002", charge: 2650, file: "", opened: "", bl: "", invoice: 0 },
    { id: "j3", seq: 43, shipper: "Meridian Parts MY", pol: "Port Klang", pod: "Rotterdam", container: "FSCU 6830003", charge: 7950, file: "", opened: "", bl: "", invoice: 0 },
    { id: "j4", seq: 44, shipper: "Biru Homeware Supply", pol: "Penang", pod: "Busan", container: "GESU 7840004", charge: 3180, file: "", opened: "", bl: "", invoice: 0 },
    { id: "j5", seq: 45, shipper: "Kencana Food Works", pol: "Port Klang", pod: "Singapore", container: "TEMU 8850005", charge: 1920, file: "", opened: "", bl: "", invoice: 0 },
    { id: "j6", seq: 46, shipper: "Rimba Office Products", pol: "Port Klang", pod: "Laem Chabang", container: "HLXU 9860006", charge: 2440, file: "", opened: "", bl: "", invoice: 0 }
  ];

  function find(id) { return desk.find(rows, id); }
  function stage(r) { return r.invoice ? 3 : r.bl ? 2 : r.file ? 1 : 0; }
  function total() {
    return rows.reduce(function (sum, r) { return sum + r.invoice; }, 0);
  }

  function render() {
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    bar.appendChild(el("div", "shell-title", (c && c.name ? c.name : "Buttonwood") + " · forwarder file board"));
    bar.appendChild(el("div", "shell-hint", "6 jobs · billed " + desk.rm(total())));
    root.appendChild(bar);

    var sample = el("div", "shell-bar");
    sample.appendChild(el("div", "shell-hint", "SAMPLE DATA · fake shippers, references and containers · in-memory only"));
    root.appendChild(sample);

    var grid = el("div", "shell-grid desk-2");
    grid.appendChild(listPanel());
    grid.appendChild(detailPanel(find(selected)));
    root.appendChild(grid);
  }

  function listPanel() {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Forwarding jobs · 6"));
    var list = el("div", "list");
    var labels = ["draft", "file opened", "BL issued", "invoiced"];

    rows.forEach(function (r) {
      var ticket = el("button", "ticket" + (r.id === selected ? " on" : ""));
      ticket.type = "button";
      var body = el("div", "desk-grow");
      body.appendChild(el("div", "who", r.shipper));
      body.appendChild(el("div", "meta", "POL " + r.pol + " → POD " + r.pod));
      body.appendChild(el("div", "meta", r.container + " · FAKE"));
      ticket.appendChild(body);
      ticket.appendChild(el("span", "tag" + (stage(r) ? " ok" : " warn"), labels[stage(r)]));
      ticket.addEventListener("click", function () {
        selected = r.id;
        flash = "Selected " + r.shipper + ".";
        render();
      });
      list.appendChild(ticket);
    });

    panel.appendChild(list);
    return panel;
  }

  function detailPanel(r) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Job file · " + (r.file || "not opened")));
    panel.appendChild(el("div", "serving-name", r.shipper));
    panel.appendChild(el("p", "desk-sub", "POL " + r.pol + " → POD " + r.pod + " · sample shipment"));

    var milestones = el("div", "actions");
    ["draft", "file opened", "BL issued", "invoiced"].forEach(function (label, i) {
      milestones.appendChild(el("span", "tag" + (i <= stage(r) ? " ok" : ""), label));
    });
    panel.appendChild(milestones);

    var kv = el("div", "desk-kv");
    kv.appendChild(el("div", "k", "Container"));
    kv.appendChild(el("div", "", r.container + " · fake"));
    kv.appendChild(el("div", "k", "File no."));
    kv.appendChild(el("div", "", r.file || "not opened"));
    kv.appendChild(el("div", "k", "Opened"));
    kv.appendChild(el("div", "", r.opened || "—"));
    kv.appendChild(el("div", "k", "BL"));
    kv.appendChild(r.bl ? el("span", "tag ok", r.bl + " · FAKE") : el("div", "", "not issued"));
    kv.appendChild(el("div", "k", "Invoice"));
    kv.appendChild(el("div", "", r.invoice ? desk.rm(r.invoice) : "not invoiced"));
    kv.appendChild(el("div", "k", "Job charge"));
    kv.appendChild(el("div", "", desk.rm(r.charge)));
    kv.appendChild(el("div", "k", "Board billed"));
    kv.appendChild(el("div", "", desk.rm(total())));
    panel.appendChild(kv);

    var actions = el("div", "actions");
    var open = el("button", "btn-sm", "Open job");
    open.type = "button";
    open.disabled = !!r.file;
    open.addEventListener("click", function () {
      r.file = "BW-2026-" + desk.pad(r.seq, 3);
      r.opened = desk.stamp("20 Aug 2026");
      flash = "Opened " + r.file + ".";
      render();
    });
    actions.appendChild(open);

    var bl = el("button", "btn-sm ghost", "Issue BL");
    bl.type = "button";
    bl.disabled = !!r.bl;
    bl.addEventListener("click", function () {
      if (!r.file) {
        flash = "Blocked: Open job before issuing a BL.";
      } else {
        r.bl = "BWBL-2608-" + desk.pad(r.seq, 3);
        flash = "Issued fake BL " + r.bl + ".";
      }
      render();
    });
    actions.appendChild(bl);

    var invoice = el("button", "btn-sm ghost", "Invoice");
    invoice.type = "button";
    invoice.disabled = !!r.invoice;
    invoice.addEventListener("click", function () {
      if (!r.bl) {
        flash = "Blocked: Issue BL before invoicing.";
      } else {
        r.invoice = r.charge;
        flash = "Invoiced " + r.file + " · " + desk.rm(r.invoice) + " added.";
      }
      render();
    });
    actions.appendChild(invoice);
    panel.appendChild(actions);
    panel.appendChild(el("p", "desk-flash", flash));

    if (r.file) panel.appendChild(el("div", "stamp on", "FILE OPENED · " + r.file + " · " + r.opened));
    if (r.bl) panel.appendChild(el("div", "stamp on", "BL ISSUED · " + r.bl + " · SAMPLE"));
    if (r.invoice) panel.appendChild(el("div", "stamp on", "INVOICED · " + r.file + " · " + desk.rm(r.invoice)));
    return panel;
  }

  render();
};
