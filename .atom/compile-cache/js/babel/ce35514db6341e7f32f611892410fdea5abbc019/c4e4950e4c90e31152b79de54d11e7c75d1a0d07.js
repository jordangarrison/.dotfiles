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

var MessageIcon = (function () {
  _createClass(MessageIcon, null, [{
    key: 'icons',
    value: {
      error: 'stop',
      warning: 'alert',
      info: 'info'
    },
    enumerable: true
  }]);

  function MessageIcon() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? { type: 'error' } : arguments[0];

    _classCallCheck(this, MessageIcon);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(MessageIcon, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom('span', { className: 'icon icon-' + MessageIcon.icons[this.properties.type] });
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return MessageIcon;
})();

exports['default'] = MessageIcon;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbWVzc2FnZS1pY29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztJQUVGLFdBQVc7ZUFBWCxXQUFXOztXQUNmO0FBQ2IsV0FBSyxFQUFFLE1BQU07QUFDYixhQUFPLEVBQUUsT0FBTztBQUNoQixVQUFJLEVBQUUsTUFBTTtLQUNiOzs7O0FBRVcsV0FQTyxXQUFXLEdBT2U7UUFBaEMsVUFBVSx5REFBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7OzBCQVB4QixXQUFXOztBQVE1QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBVmtCLFdBQVc7OzZCQVloQixhQUFHO0FBQ2YsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVNLGtCQUFHO0FBQ1IsYUFDRSxnQ0FBTSxTQUFTLGlCQUFlLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQUFBRyxHQUFHLENBQzVFO0tBQ0Y7OztXQUVNLGdCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1NBekJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL21lc3NhZ2UtaWNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2VJY29uIHtcbiAgc3RhdGljIGljb25zID0ge1xuICAgIGVycm9yOiAnc3RvcCcsXG4gICAgd2FybmluZzogJ2FsZXJ0JyxcbiAgICBpbmZvOiAnaW5mbydcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwcm9wZXJ0aWVzID0geyB0eXBlOiAnZXJyb3InIH0pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gaWNvbi0ke01lc3NhZ2VJY29uLmljb25zW3RoaXMucHJvcGVydGllcy50eXBlXX1gfSAvPlxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAocHJvcGVydGllcykge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxufVxuIl19