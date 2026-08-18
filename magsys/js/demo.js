window.mountDemo = function (root) {
  var modules = {
    clinic: {
      key: "clinic",
      tab: "C-MagSys",
      title: "Clinic · chart of the day",
      appointments: [
        { time: "09:00", name: "Farah Ismail", reason: "Fever and cough", bill: 75 },
        { time: "10:30", name: "Lim Wei", reason: "Blood pressure review", bill: 60 },
        { time: "14:00", name: "Kumar S.", reason: "Medical certificate", bill: 45 }
      ]
    },
    dental: {
      key: "dental",
      tab: "D-MagSys",
      title: "Dental · chart of the day",
      appointments: [
        { time: "09:30", name: "Nur Aisyah", reason: "Scaling", bill: 180 },
        { time: "11:00", name: "Daniel Ong", reason: "Filling", bill: 250 },
        { time: "15:30", name: "Priya Nair", reason: "Check-up", bill: 80 }
      ]
    },
    hospital: {
      key: "hospital",
      tab: "H-MagSys",
      title: "Hospital · chart of the day",
      appointments: [
        { time: "08:40", name: "Ahmad Zaki", reason: "Outpatient follow-up", bill: 120 },
        { time: "11:15", name: "Siti Mariam", reason: "Lab review", bill: 90 },
        { time: "16:00", name: "Chen Hui", reason: "Admission consult", bill: 200 }
      ]
    }
  };

  var current = "clinic";
  var selected = 0;

  function render() {
    var mod = modules[current];
    var appt = mod.appointments[selected];
    root.replaceChildren();

    var bar = el("div", "shell-bar");
    var left = el("div");
    left.appendChild(el("div", "shell-title", mod.title));
    bar.appendChild(left);
    var tabs = el("div", "tabs");
    Object.keys(modules).forEach(function (key) {
      var m = modules[key];
      var b = el("button", "tab" + (key === current ? " on" : ""), m.tab);
      b.type = "button";
      b.addEventListener("click", function () {
        current = key;
        selected = 0;
        render();
      });
      tabs.appendChild(b);
    });
    bar.appendChild(tabs);
    root.appendChild(bar);

    var hint = el("div", "shell-bar");
    hint.appendChild(el("div", "shell-hint", "SAMPLE DATA · pick a module, then a name"));
    root.appendChild(hint);

    var grid = el("div", "shell-grid cols-2");
    grid.appendChild(listPanel(mod));
    grid.appendChild(chartPanel(appt, mod.tab));
    root.appendChild(grid);
  }

  function listPanel(mod) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Today's appointments"));
    var list = el("div", "list");
    mod.appointments.forEach(function (a, i) {
      var t = el("button", "ticket" + (i === selected ? " on" : ""));
      t.type = "button";
      var body = el("div");
      body.appendChild(el("div", "who", a.name));
      body.appendChild(el("div", "meta", a.time + " · " + a.reason));
      t.appendChild(body);
      t.appendChild(el("span", "tag", "sample"));
      t.addEventListener("click", function () {
        selected = i;
        render();
      });
      list.appendChild(t);
    });
    panel.appendChild(list);
    return panel;
  }

  function chartPanel(a, product) {
    var panel = el("div", "panel");
    panel.appendChild(el("h3", "", "Patient chart"));
    panel.appendChild(el("div", "serving-name", a.name));
    panel.appendChild(el("p", "empty", product + " · sample chart"));
    var kv = el("div", "kv");
    kv.appendChild(el("div", "k", "Visit reason"));
    kv.appendChild(el("div", "", a.reason));
    kv.appendChild(el("div", "k", "Bill"));
    kv.appendChild(el("div", "money", "RM " + a.bill.toFixed(2)));
    kv.appendChild(el("div", "k", "Record"));
    kv.appendChild(el("div", "", "Sample only · not a real file"));
    panel.appendChild(kv);
    return panel;
  }

  render();
};
