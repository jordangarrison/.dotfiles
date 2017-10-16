Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _messageCount = require('./message-count');

var _messageCount2 = _interopRequireDefault(_messageCount);

var StatusLabel = (function () {
  function StatusLabel() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, StatusLabel);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(StatusLabel, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: this.getClassNames(), onclick: function () {
            return latex.log.show();
          } },
        _etch2['default'].dom('span', { className: 'icon icon-sync busy' }),
        _etch2['default'].dom(
          'a',
          { href: '#' },
          'LaTeX'
        ),
        _etch2['default'].dom(_messageCount2['default'], { type: 'error' }),
        _etch2['default'].dom(_messageCount2['default'], { type: 'warning' }),
        _etch2['default'].dom(_messageCount2['default'], { type: 'info' })
      );
    }
  }, {
    key: 'getClassNames',
    value: function getClassNames() {
      var className = 'latex-status inline-block';

      if (this.properties.busy) {
        return className + ' is-busy';
      }

      return className;
    }
  }, {
    key: 'update',
    value: function update() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      Object.assign(this.properties, properties);
      return _etch2['default'].update(this);
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltop = null;
      }
      this.tooltip = atom.tooltips.add(this.element, { title: 'Click to show LaTeX log' });
    }
  }]);

  return StatusLabel;
})();

exports['default'] = StatusLabel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3Mvc3RhdHVzLWxhYmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7Ozs0QkFDRSxpQkFBaUI7Ozs7SUFFckIsV0FBVztBQUNsQixXQURPLFdBQVcsR0FDQTtRQUFqQixVQUFVLHlEQUFHLEVBQUU7OzBCQURULFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFKa0IsV0FBVzs7NkJBTWhCLGFBQUc7QUFDZixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN2QjtBQUNELFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTSxrQkFBRztBQUNSLGFBQ0U7O1VBQUssU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQUFBQyxFQUFDLE9BQU8sRUFBRTttQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtXQUFBLEFBQUM7UUFDcEUsZ0NBQU0sU0FBUyxFQUFDLHFCQUFxQixHQUFHO1FBQ3hDOztZQUFHLElBQUksRUFBQyxHQUFHOztTQUFVO1FBQ3JCLG1EQUFjLElBQUksRUFBQyxPQUFPLEdBQUc7UUFDN0IsbURBQWMsSUFBSSxFQUFDLFNBQVMsR0FBRztRQUMvQixtREFBYyxJQUFJLEVBQUMsTUFBTSxHQUFHO09BQ3hCLENBQ1A7S0FDRjs7O1dBRWEseUJBQUc7QUFDZixVQUFNLFNBQVMsOEJBQThCLENBQUE7O0FBRTdDLFVBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDeEIsZUFBVSxTQUFTLGNBQVU7T0FDOUI7O0FBRUQsYUFBTyxTQUFTLENBQUE7S0FDakI7OztXQUVNLGtCQUFrQjtVQUFqQixVQUFVLHlEQUFHLEVBQUU7O0FBQ3JCLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUMxQyxhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRWUsMkJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7T0FDcEI7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxDQUFBO0tBQ3JGOzs7U0E5Q2tCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3Mvc3RhdHVzLWxhYmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBNZXNzYWdlQ291bnQgZnJvbSAnLi9tZXNzYWdlLWNvdW50J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNMYWJlbCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wZXJ0aWVzID0ge30pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuZGlzcG9zZSgpXG4gICAgfVxuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuZ2V0Q2xhc3NOYW1lcygpfSBvbmNsaWNrPXsoKSA9PiBsYXRleC5sb2cuc2hvdygpfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpY29uIGljb24tc3luYyBidXN5JyAvPlxuICAgICAgICA8YSBocmVmPScjJz5MYVRlWDwvYT5cbiAgICAgICAgPE1lc3NhZ2VDb3VudCB0eXBlPSdlcnJvcicgLz5cbiAgICAgICAgPE1lc3NhZ2VDb3VudCB0eXBlPSd3YXJuaW5nJyAvPlxuICAgICAgICA8TWVzc2FnZUNvdW50IHR5cGU9J2luZm8nIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRDbGFzc05hbWVzICgpIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBgbGF0ZXgtc3RhdHVzIGlubGluZS1ibG9ja2BcblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMuYnVzeSkge1xuICAgICAgcmV0dXJuIGAke2NsYXNzTmFtZX0gaXMtYnVzeWBcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3NOYW1lXG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMgPSB7fSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzKVxuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcmVhZEFmdGVyVXBkYXRlICgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuZGlzcG9zZSgpXG4gICAgICB0aGlzLnRvb2x0b3AgPSBudWxsXG4gICAgfVxuICAgIHRoaXMudG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkKHRoaXMuZWxlbWVudCwgeyB0aXRsZTogJ0NsaWNrIHRvIHNob3cgTGFUZVggbG9nJyB9KVxuICB9XG59XG4iXX0=