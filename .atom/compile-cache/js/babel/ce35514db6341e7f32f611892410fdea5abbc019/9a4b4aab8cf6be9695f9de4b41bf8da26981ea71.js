Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

var _atom = require('atom');

var ProcessManager = (function (_Disposable) {
  _inherits(ProcessManager, _Disposable);

  function ProcessManager() {
    _classCallCheck(this, ProcessManager);

    _get(Object.getPrototypeOf(ProcessManager.prototype), 'constructor', this).call(this, function () {
      return _this.killChildProcesses();
    });
    this.processes = new Set();

    var _this = this;
  }

  _createClass(ProcessManager, [{
    key: 'executeChildProcess',
    value: function executeChildProcess(command) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var allowKill = options.allowKill;
      var showError = options.showError;

      var execOptions = _objectWithoutProperties(options, ['allowKill', 'showError']);

      return new Promise(function (resolve) {
        // Windows does not like \$ appearing in command lines so only escape
        // if we need to.
        if (process.platform !== 'win32') command = command.replace('$', '\\$');

        var _childProcess$exec = _child_process2['default'].exec(command, execOptions, function (error, stdout, stderr) {
          if (allowKill) {
            _this2.processes['delete'](pid);
          }
          if (error && showError && latex && latex.log) {
            latex.log.error('An error occurred while trying to run "' + command + '" (' + error.code + ').');
          }
          resolve({
            statusCode: error ? error.code : 0,
            stdout: stdout,
            stderr: stderr
          });
        });

        var pid = _childProcess$exec.pid;

        if (allowKill) {
          _this2.processes.add(pid);
        }
      });
    }
  }, {
    key: 'killChildProcesses',
    value: function killChildProcesses() {
      for (var pid of this.processes.values()) {
        (0, _treeKill2['default'])(pid);
      }
      this.processes.clear();
    }
  }]);

  return ProcessManager;
})(_atom.Disposable);

exports['default'] = ProcessManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcHJvY2Vzcy1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFFeUIsZUFBZTs7Ozt3QkFDdkIsV0FBVzs7OztvQkFDRCxNQUFNOztJQUVaLGNBQWM7WUFBZCxjQUFjOztBQUdyQixXQUhPLGNBQWMsR0FHbEI7MEJBSEksY0FBYzs7QUFJL0IsK0JBSmlCLGNBQWMsNkNBSXpCO2FBQU0sTUFBSyxrQkFBa0IsRUFBRTtLQUFBLEVBQUM7U0FIeEMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFOzs7R0FJcEI7O2VBTGtCLGNBQWM7O1dBT2IsNkJBQUMsT0FBTyxFQUFnQjs7O1VBQWQsT0FBTyx5REFBRyxFQUFFO1VBQ2hDLFNBQVMsR0FBZ0MsT0FBTyxDQUFoRCxTQUFTO1VBQUUsU0FBUyxHQUFxQixPQUFPLENBQXJDLFNBQVM7O1VBQUssV0FBVyw0QkFBSyxPQUFPOztBQUN4RCxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJOzs7QUFHNUIsWUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUE7O2lDQUN2RCwyQkFBYSxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQ2pGLGNBQUksU0FBUyxFQUFFO0FBQ2IsbUJBQUssU0FBUyxVQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7V0FDM0I7QUFDRCxjQUFJLEtBQUssSUFBSSxTQUFTLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDNUMsaUJBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyw2Q0FBMkMsT0FBTyxXQUFNLEtBQUssQ0FBQyxJQUFJLFFBQUssQ0FBQTtXQUN2RjtBQUNELGlCQUFPLENBQUM7QUFDTixzQkFBVSxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUM7QUFDbEMsa0JBQU0sRUFBTixNQUFNO0FBQ04sa0JBQU0sRUFBTixNQUFNO1dBQ1AsQ0FBQyxDQUFBO1NBQ0gsQ0FBQzs7WUFaTSxHQUFHLHNCQUFILEdBQUc7O0FBYVgsWUFBSSxTQUFTLEVBQUU7QUFDYixpQkFBSyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ3hCO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztXQUVrQiw4QkFBRztBQUNwQixXQUFLLElBQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDekMsbUNBQUssR0FBRyxDQUFDLENBQUE7T0FDVjtBQUNELFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDdkI7OztTQXJDa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wcm9jZXNzLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBraWxsIGZyb20gJ3RyZWUta2lsbCdcbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9jZXNzTWFuYWdlciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBwcm9jZXNzZXMgPSBuZXcgU2V0KClcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5raWxsQ2hpbGRQcm9jZXNzZXMoKSlcbiAgfVxuXG4gIGV4ZWN1dGVDaGlsZFByb2Nlc3MgKGNvbW1hbmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgYWxsb3dLaWxsLCBzaG93RXJyb3IsIC4uLmV4ZWNPcHRpb25zIH0gPSBvcHRpb25zXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgLy8gV2luZG93cyBkb2VzIG5vdCBsaWtlIFxcJCBhcHBlYXJpbmcgaW4gY29tbWFuZCBsaW5lcyBzbyBvbmx5IGVzY2FwZVxuICAgICAgLy8gaWYgd2UgbmVlZCB0by5cbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSBjb21tYW5kID0gY29tbWFuZC5yZXBsYWNlKCckJywgJ1xcXFwkJylcbiAgICAgIGNvbnN0IHsgcGlkIH0gPSBjaGlsZFByb2Nlc3MuZXhlYyhjb21tYW5kLCBleGVjT3B0aW9ucywgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICBpZiAoYWxsb3dLaWxsKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzZXMuZGVsZXRlKHBpZClcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgc2hvd0Vycm9yICYmIGxhdGV4ICYmIGxhdGV4LmxvZykge1xuICAgICAgICAgIGxhdGV4LmxvZy5lcnJvcihgQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgdHJ5aW5nIHRvIHJ1biBcIiR7Y29tbWFuZH1cIiAoJHtlcnJvci5jb2RlfSkuYClcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiBlcnJvciA/IGVycm9yLmNvZGUgOiAwLFxuICAgICAgICAgIHN0ZG91dCxcbiAgICAgICAgICBzdGRlcnJcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpZiAoYWxsb3dLaWxsKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc2VzLmFkZChwaWQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGtpbGxDaGlsZFByb2Nlc3NlcyAoKSB7XG4gICAgZm9yIChjb25zdCBwaWQgb2YgdGhpcy5wcm9jZXNzZXMudmFsdWVzKCkpIHtcbiAgICAgIGtpbGwocGlkKVxuICAgIH1cbiAgICB0aGlzLnByb2Nlc3Nlcy5jbGVhcigpXG4gIH1cbn1cbiJdfQ==