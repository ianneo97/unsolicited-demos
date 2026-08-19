function text(id, value) {
  var n = document.getElementById(id);
  if (n) n.textContent = value || "";
}

window.el = function (tag, cls, txt) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
};

(function () {
  var c = window.SITE;
  if (!c) return;

  document.documentElement.style.setProperty("--accent", c.accent);
  if (c.accentInk) {
    document.documentElement.style.setProperty("--accent-ink", c.accentInk);
  }

  document.title = c.name + " — unsolicited demo";
  text("brand", c.name);
  text("eyebrow", c.city + " · unsolicited demo");
  text("name", c.name);
  text("oneliner", c.oneliner);
  text("sells", c.sells);
  text("problem", c.worst_problem);
  text("demoLead", c.demo_lead);
  text("noteBody", c.note);

  var orig = document.getElementById("original");
  if (orig) {
    orig.href = c.original_url;
    try {
      orig.textContent = new URL(c.original_url).host.replace(/^www\./, "");
    } catch (e) {
      orig.textContent = "Public site";
    }
  }

  var root = document.getElementById("demo-root");
  if (root && typeof window.mountDemo === "function") {
    window.mountDemo(root, c);
  }
})();
