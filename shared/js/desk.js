window.desk = {
  rm: function (n) {
    return "RM " + Number(n).toFixed(2);
  },
  hms: function () {
    var d = new Date();
    function p(n) { return n < 10 ? "0" + n : String(n); }
    return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  },
  stamp: function (day) {
    return (day ? day + " · " : "") + window.desk.hms();
  },
  find: function (arr, id) {
    var i;
    for (i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return arr[0];
  },
  pad: function (n, width) {
    var s = String(n);
    while (s.length < (width || 3)) s = "0" + s;
    return s;
  }
};
