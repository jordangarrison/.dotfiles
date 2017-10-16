Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _viewsStatusLabel = require('./views/status-label');

var _viewsStatusLabel2 = _interopRequireDefault(_viewsStatusLabel);

var _atom = require('atom');

var StatusIndicator = (function (_Disposable) {
  _inherits(StatusIndicator, _Disposable);

  function StatusIndicator() {
    _classCallCheck(this, StatusIndicator);

    _get(Object.getPrototypeOf(StatusIndicator.prototype), 'constructor', this).call(this, function () {
      return _this.detachStatusBar();
    });

    var _this = this;
  }

  _createClass(StatusIndicator, [{
    key: 'attachStatusBar',
    value: function attachStatusBar(statusBar) {
      this.statusLabel = new _viewsStatusLabel2['default']();
      this.statusTile = statusBar.addRightTile({
        item: this.statusLabel,
        priority: 9001
      });
    }
  }, {
    key: 'detachStatusBar',
    value: function detachStatusBar() {
      if (this.statusTile) {
        this.statusTile.destroy();
        this.statusTile = null;
      }
      if (this.statusLabel) {
        this.statusLabel.destroy();
        this.statusLabel = null;
      }
    }
  }, {
    key: 'show',
    value: function show(text, type, icon, spin, title, onClick) {
      if (this.statusLabel) {
        this.statusLabel.update({ text: text, type: type, icon: icon, spin: spin, title: title, onClick: onClick });
      }
    }
  }]);

  return StatusIndicator;
})(_atom.Disposable);

exports['default'] = StatusIndicator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvc3RhdHVzLWluZGljYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2dDQUV3QixzQkFBc0I7Ozs7b0JBQ25CLE1BQU07O0lBRVosZUFBZTtZQUFmLGVBQWU7O0FBQ3RCLFdBRE8sZUFBZSxHQUNuQjswQkFESSxlQUFlOztBQUVoQywrQkFGaUIsZUFBZSw2Q0FFMUI7YUFBTSxNQUFLLGVBQWUsRUFBRTtLQUFBLEVBQUM7OztHQUNwQzs7ZUFIa0IsZUFBZTs7V0FLbEIseUJBQUMsU0FBUyxFQUFFO0FBQzFCLFVBQUksQ0FBQyxXQUFXLEdBQUcsbUNBQWlCLENBQUE7QUFDcEMsVUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQ3ZDLFlBQUksRUFBRSxJQUFJLENBQUMsV0FBVztBQUN0QixnQkFBUSxFQUFFLElBQUk7T0FDZixDQUFDLENBQUE7S0FDSDs7O1dBRWUsMkJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDekIsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7T0FDdkI7QUFDRCxVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixZQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtPQUN4QjtLQUNGOzs7V0FFSSxjQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzVDLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUMsQ0FBQTtPQUNwRTtLQUNGOzs7U0E1QmtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvc3RhdHVzLWluZGljYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFN0YXR1c0xhYmVsIGZyb20gJy4vdmlld3Mvc3RhdHVzLWxhYmVsJ1xuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0luZGljYXRvciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kZXRhY2hTdGF0dXNCYXIoKSlcbiAgfVxuXG4gIGF0dGFjaFN0YXR1c0JhciAoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNMYWJlbCA9IG5ldyBTdGF0dXNMYWJlbCgpXG4gICAgdGhpcy5zdGF0dXNUaWxlID0gc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLnN0YXR1c0xhYmVsLFxuICAgICAgcHJpb3JpdHk6IDkwMDFcbiAgICB9KVxuICB9XG5cbiAgZGV0YWNoU3RhdHVzQmFyICgpIHtcbiAgICBpZiAodGhpcy5zdGF0dXNUaWxlKSB7XG4gICAgICB0aGlzLnN0YXR1c1RpbGUuZGVzdHJveSgpXG4gICAgICB0aGlzLnN0YXR1c1RpbGUgPSBudWxsXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXR1c0xhYmVsKSB7XG4gICAgICB0aGlzLnN0YXR1c0xhYmVsLmRlc3Ryb3koKVxuICAgICAgdGhpcy5zdGF0dXNMYWJlbCA9IG51bGxcbiAgICB9XG4gIH1cblxuICBzaG93ICh0ZXh0LCB0eXBlLCBpY29uLCBzcGluLCB0aXRsZSwgb25DbGljaykge1xuICAgIGlmICh0aGlzLnN0YXR1c0xhYmVsKSB7XG4gICAgICB0aGlzLnN0YXR1c0xhYmVsLnVwZGF0ZSh7IHRleHQsIHR5cGUsIGljb24sIHNwaW4sIHRpdGxlLCBvbkNsaWNrIH0pXG4gICAgfVxuICB9XG59XG4iXX0=