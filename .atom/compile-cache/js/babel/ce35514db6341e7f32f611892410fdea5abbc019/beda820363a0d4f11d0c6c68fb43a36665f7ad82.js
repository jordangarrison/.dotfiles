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

var _atom = require('atom');

var _messageIcon = require('./message-icon');

var _messageIcon2 = _interopRequireDefault(_messageIcon);

var MessageCount = (function () {
  function MessageCount() {
    var _this = this;

    var properties = arguments.length <= 0 || arguments[0] === undefined ? { type: 'error' } : arguments[0];

    _classCallCheck(this, MessageCount);

    this.disposables = new _atom.CompositeDisposable();

    this.properties = properties;
    _etch2['default'].initialize(this);
    this.disposables.add(latex.log.onMessages(function () {
      return _this.update();
    }));
  }

  _createClass(MessageCount, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
      this.disposables.dispose();
    })
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (latex.log.messageTypeIsVisible(this.properties.type)) {
        var counts = latex.log.getMessages().reduce(function (total, message) {
          return message.type === _this2.properties.type ? total + 1 : total;
        }, 0);

        return _etch2['default'].dom(
          'span',
          { className: 'latex-' + this.properties.type + ' latex-message-count' },
          _etch2['default'].dom(_messageIcon2['default'], { type: this.properties.type }),
          counts
        );
      }

      return _etch2['default'].dom('span', null);
    }
  }, {
    key: 'update',
    value: function update() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      Object.assign(this.properties, properties);
      return _etch2['default'].update(this);
    }
  }]);

  return MessageCount;
})();

exports['default'] = MessageCount;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbWVzc2FnZS1jb3VudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7b0JBQ2EsTUFBTTs7MkJBQ2xCLGdCQUFnQjs7OztJQUVuQixZQUFZO0FBR25CLFdBSE8sWUFBWSxHQUdjOzs7UUFBaEMsVUFBVSx5REFBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7OzBCQUh4QixZQUFZOztTQUMvQixXQUFXLEdBQUcsK0JBQXlCOztBQUdyQyxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7YUFBTSxNQUFLLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBO0dBQ2hFOztlQVBrQixZQUFZOzs2QkFTakIsYUFBRztBQUNmLFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDM0I7OztXQUVNLGtCQUFHOzs7QUFDUixVQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4RCxZQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxPQUFPO2lCQUFLLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBSyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSztTQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRS9ILGVBQ0U7O1lBQU0sU0FBUyxhQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSx5QkFBdUI7VUFDbkUsa0RBQWEsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxBQUFDLEdBQUc7VUFDMUMsTUFBTTtTQUNGLENBQ1I7T0FDRjs7QUFFRCxhQUFPLG1DQUFRLENBQUE7S0FDaEI7OztXQUVNLGtCQUFrQjtVQUFqQixVQUFVLHlEQUFHLEVBQUU7O0FBQ3JCLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUMxQyxhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1NBaENrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL21lc3NhZ2UtY291bnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgTWVzc2FnZUljb24gZnJvbSAnLi9tZXNzYWdlLWljb24nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2VDb3VudCB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGNvbnN0cnVjdG9yIChwcm9wZXJ0aWVzID0geyB0eXBlOiAnZXJyb3InIH0pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobGF0ZXgubG9nLm9uTWVzc2FnZXMoKCkgPT4gdGhpcy51cGRhdGUoKSkpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAobGF0ZXgubG9nLm1lc3NhZ2VUeXBlSXNWaXNpYmxlKHRoaXMucHJvcGVydGllcy50eXBlKSkge1xuICAgICAgY29uc3QgY291bnRzID0gbGF0ZXgubG9nLmdldE1lc3NhZ2VzKCkucmVkdWNlKCh0b3RhbCwgbWVzc2FnZSkgPT4gbWVzc2FnZS50eXBlID09PSB0aGlzLnByb3BlcnRpZXMudHlwZSA/IHRvdGFsICsgMSA6IHRvdGFsLCAwKVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BsYXRleC0ke3RoaXMucHJvcGVydGllcy50eXBlfSBsYXRleC1tZXNzYWdlLWNvdW50YH0+XG4gICAgICAgICAgPE1lc3NhZ2VJY29uIHR5cGU9e3RoaXMucHJvcGVydGllcy50eXBlfSAvPlxuICAgICAgICAgIHtjb3VudHN9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4gLz5cbiAgfVxuXG4gIHVwZGF0ZSAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnByb3BlcnRpZXMsIHByb3BlcnRpZXMpXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cbn1cbiJdfQ==