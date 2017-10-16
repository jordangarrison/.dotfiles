var sleep, timeout;

import {
  exec
} from 'child_process';

timeout = (function(_this) {
  return function(s) {
    return new Promise(function(resolve) {
      return setTimeout(resolve, s * 1000);
    });
  };
})(this);

sleep = (function(_this) {
  return function(s, message) {
    console.log("Awaiting Promise…");
    await(timeout(s));
    return console.log(message);
  };
})(this);

sleep(1, "Done.");

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9leGFtcGxlcy92Mi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVEsSUFBUjtDQUFBLE1BQUE7O0FBRUEsT0FBQSxHQUFVLENBQUEsU0FBQSxLQUFBO1NBQUEsU0FBQyxDQUFEO1dBQ0osSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFEO2FBQ1YsVUFBQSxDQUFXLE9BQVgsRUFBb0IsQ0FBQSxHQUFJLElBQXhCO0lBRFUsQ0FBUjtFQURJO0FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTs7QUFJVixLQUFBLEdBQVEsQ0FBQSxTQUFBLEtBQUE7U0FBQSxTQUFDLENBQUQsRUFBSSxPQUFKO0lBQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWjtJQUNBLEtBQUEsQ0FBTSxPQUFBLENBQVEsQ0FBUixDQUFOO1dBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaO0VBSE07QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBOztBQUtSLEtBQUEsQ0FBTSxDQUFOLEVBQVMsT0FBVCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY30gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxudGltZW91dCA9IChzKSA9PlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICBzZXRUaW1lb3V0IHJlc29sdmUsIHMgKiAxMDAwICMgbXNcblxuc2xlZXAgPSAocywgbWVzc2FnZSkgPT5cbiAgY29uc29sZS5sb2cgXCJBd2FpdGluZyBQcm9taXNl4oCmXCIgIyBUaGlzIHNlbGVjdGVkIGxpbmUgc2hvdWxkIHJ1bi5cbiAgYXdhaXQgdGltZW91dCBzXG4gIGNvbnNvbGUubG9nIG1lc3NhZ2Vcblxuc2xlZXAgMSwgXCJEb25lLlwiXG4iXX0=
