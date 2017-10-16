Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _atom = require('atom');

var MarkerManager = (function (_Disposable) {
  _inherits(MarkerManager, _Disposable);

  function MarkerManager(editor) {
    var _this2 = this;

    _classCallCheck(this, MarkerManager);

    _get(Object.getPrototypeOf(MarkerManager.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });

    this.disposables = new _atom.CompositeDisposable();

    var _this = this;

    this.editor = editor;
    this.markers = [];

    this.disposables.add(latex.log.onMessages(function (messages, reset) {
      return _this2.addMarkers(messages, reset);
    }));
    this.disposables.add(new _atom.Disposable(function () {
      return _this2.clear();
    }));
    this.disposables.add(this.editor.onDidDestroy(function () {
      return _this2.dispose();
    }));
    this.disposables.add(atom.config.onDidChange('latex.loggingLevel', function () {
      return _this2.update();
    }));

    this.addMarkers(latex.log.getMessages());
  }

  _createClass(MarkerManager, [{
    key: 'update',
    value: function update() {
      this.addMarkers(latex.log.getMessages(), true);
    }
  }, {
    key: 'addMarkers',
    value: function addMarkers(messages, reset) {
      if (reset) this.clear();

      var editorPath = this.editor.getPath();
      var isVisible = function isVisible(filePath, range) {
        return filePath && range && editorPath.includes(filePath);
      };

      if (editorPath) {
        for (var message of messages) {
          if (isVisible(message.filePath, message.range)) {
            this.addMarker(message.type, message.filePath, message.range);
          }
          if (isVisible(message.logPath, message.logRange)) {
            this.addMarker(message.type, message.logPath, message.logRange);
          }
        }
      }
    }
  }, {
    key: 'addMarker',
    value: function addMarker(type, filePath, range) {
      var marker = this.editor.markBufferRange(range, { invalidate: 'touch' });
      this.editor.decorateMarker(marker, { type: 'line-number', 'class': 'latex-' + type });
      this.markers.push(marker);
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var marker of this.markers) {
        marker.destroy();
      }
      this.markers = [];
    }
  }]);

  return MarkerManager;
})(_atom.Disposable);

exports['default'] = MarkerManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFya2VyLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRWdELE1BQU07O0lBRWpDLGFBQWE7WUFBYixhQUFhOztBQUdwQixXQUhPLGFBQWEsQ0FHbkIsTUFBTSxFQUFFOzs7MEJBSEYsYUFBYTs7QUFJOUIsK0JBSmlCLGFBQWEsNkNBSXhCO2FBQU0sTUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFO0tBQUEsRUFBQzs7U0FIekMsV0FBVyxHQUFHLCtCQUF5Qjs7OztBQUtyQyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTs7QUFFakIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBQyxRQUFRLEVBQUUsS0FBSzthQUFLLE9BQUssVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUNqRyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxxQkFBZTthQUFNLE9BQUssS0FBSyxFQUFFO0tBQUEsQ0FBQyxDQUFDLENBQUE7QUFDeEQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFBTSxPQUFLLE9BQU8sRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBO0FBQ3BFLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFO2FBQU0sT0FBSyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQTs7QUFFeEYsUUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7R0FDekM7O2VBZmtCLGFBQWE7O1dBaUJ6QixrQkFBRztBQUNSLFVBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUMvQzs7O1dBRVUsb0JBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUMzQixVQUFJLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRXZCLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDeEMsVUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksUUFBUSxFQUFFLEtBQUs7ZUFBSyxRQUFRLElBQUksS0FBSyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO09BQUEsQ0FBQTs7QUFFekYsVUFBSSxVQUFVLEVBQUU7QUFDZCxhQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM5QixjQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM5QyxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1dBQzlEO0FBQ0QsY0FBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDaEQsZ0JBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUNoRTtTQUNGO09BQ0Y7S0FDRjs7O1dBRVMsbUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDaEMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDMUUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxvQkFBZ0IsSUFBSSxBQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ25GLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQzFCOzs7V0FFSyxpQkFBRztBQUNQLFdBQUssSUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQyxjQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDakI7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtLQUNsQjs7O1NBbERrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21hcmtlci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyTWFuYWdlciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3RvciAoZWRpdG9yKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkpXG5cbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMubWFya2VycyA9IFtdXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChsYXRleC5sb2cub25NZXNzYWdlcygobWVzc2FnZXMsIHJlc2V0KSA9PiB0aGlzLmFkZE1hcmtlcnMobWVzc2FnZXMsIHJlc2V0KSkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4gdGhpcy5jbGVhcigpKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4gdGhpcy5kaXNwb3NlKCkpKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsYXRleC5sb2dnaW5nTGV2ZWwnLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKSlcblxuICAgIHRoaXMuYWRkTWFya2VycyhsYXRleC5sb2cuZ2V0TWVzc2FnZXMoKSlcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7XG4gICAgdGhpcy5hZGRNYXJrZXJzKGxhdGV4LmxvZy5nZXRNZXNzYWdlcygpLCB0cnVlKVxuICB9XG5cbiAgYWRkTWFya2VycyAobWVzc2FnZXMsIHJlc2V0KSB7XG4gICAgaWYgKHJlc2V0KSB0aGlzLmNsZWFyKClcblxuICAgIGNvbnN0IGVkaXRvclBhdGggPSB0aGlzLmVkaXRvci5nZXRQYXRoKClcbiAgICBjb25zdCBpc1Zpc2libGUgPSAoZmlsZVBhdGgsIHJhbmdlKSA9PiBmaWxlUGF0aCAmJiByYW5nZSAmJiBlZGl0b3JQYXRoLmluY2x1ZGVzKGZpbGVQYXRoKVxuXG4gICAgaWYgKGVkaXRvclBhdGgpIHtcbiAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgICBpZiAoaXNWaXNpYmxlKG1lc3NhZ2UuZmlsZVBhdGgsIG1lc3NhZ2UucmFuZ2UpKSB7XG4gICAgICAgICAgdGhpcy5hZGRNYXJrZXIobWVzc2FnZS50eXBlLCBtZXNzYWdlLmZpbGVQYXRoLCBtZXNzYWdlLnJhbmdlKVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc1Zpc2libGUobWVzc2FnZS5sb2dQYXRoLCBtZXNzYWdlLmxvZ1JhbmdlKSkge1xuICAgICAgICAgIHRoaXMuYWRkTWFya2VyKG1lc3NhZ2UudHlwZSwgbWVzc2FnZS5sb2dQYXRoLCBtZXNzYWdlLmxvZ1JhbmdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkTWFya2VyICh0eXBlLCBmaWxlUGF0aCwgcmFuZ2UpIHtcbiAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UsIHsgaW52YWxpZGF0ZTogJ3RvdWNoJyB9KVxuICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwgeyB0eXBlOiAnbGluZS1udW1iZXInLCBjbGFzczogYGxhdGV4LSR7dHlwZX1gIH0pXG4gICAgdGhpcy5tYXJrZXJzLnB1c2gobWFya2VyKVxuICB9XG5cbiAgY2xlYXIgKCkge1xuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMubWFya2Vycykge1xuICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgIH1cbiAgICB0aGlzLm1hcmtlcnMgPSBbXVxuICB9XG59XG4iXX0=