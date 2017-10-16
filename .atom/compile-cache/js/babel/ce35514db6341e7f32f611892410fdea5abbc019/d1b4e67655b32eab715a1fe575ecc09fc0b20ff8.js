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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var Message = (function () {
  function Message() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Message);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(Message, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }, {
    key: 'getIconClass',
    value: function getIconClass() {
      var iconName = undefined;
      switch (this.properties.message.type) {
        case 'error':
          iconName = 'fa-times-circle';
          break;
        case 'warning':
          iconName = 'fa-exclamation-circle';
          break;
        case 'typesetting':
          iconName = 'fa-question-circle';
          break;
        default:
          iconName = 'fa-info-circle';
      }
      return 'fa ' + iconName + ' atom-latex-log-icon';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      if (atom.config.get('atom-latex.combine_typesetting_log') && this.properties.message.type === 'typesetting') {
        return _etch2['default'].dom('div', null);
      }
      var clickable = false;
      var file = _etch2['default'].dom('span', null);
      var line = _etch2['default'].dom('span', null);
      if (this.properties.message.file) {
        clickable = true;
        file = _etch2['default'].dom(
          'span',
          null,
          _path2['default'].relative(_path2['default'].dirname(this.properties.latex.mainFile), this.properties.message.file)
        );
        if (this.properties.message.line > 0) {
          line = _etch2['default'].dom(
            'span',
            null,
            ':',
            this.properties.message.line,
            ' '
          );
        } else {
          line = _etch2['default'].dom(
            'span',
            null,
            ' '
          );
        }
      }
      var handleClick = function handleClick() {
        return _this.handleClick(_this.properties.message.file, _this.properties.message.line);
      };
      return _etch2['default'].dom(
        'div',
        { className: 'atom-latex-log-message' + (clickable ? ' atom-latex-log-clickable' : ''), onclick: handleClick },
        _etch2['default'].dom('i', { className: this.getIconClass() }),
        file,
        line,
        this.properties.message.text
      );
    }
  }, {
    key: 'handleClick',
    value: function handleClick(file, line) {
      if (file) {
        atom.workspace.open(file, { initialLine: line > 0 ? line - 1 : 0 });
      }
    }
  }]);

  return Message;
})();

exports['default'] = Message;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdG9tLWxhdGV4L2xpYi92aWV3L21lc3NhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNOLE1BQU07Ozs7b0JBQ0ksTUFBTTs7SUFFWixPQUFPO0FBQ2YsV0FEUSxPQUFPLEdBQ0c7UUFBakIsVUFBVSx5REFBRyxFQUFFOzswQkFEUixPQUFPOztBQUV4QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSmtCLE9BQU87OzZCQU1iLGFBQUc7QUFDZCxZQUFNLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRUssZ0JBQUMsVUFBVSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFVyx3QkFBRztBQUNiLFVBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQTtBQUN4QixjQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDbEMsYUFBSyxPQUFPO0FBQ1Ysa0JBQVEsR0FBRyxpQkFBaUIsQ0FBQTtBQUM1QixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osa0JBQVEsR0FBRyx1QkFBdUIsQ0FBQTtBQUNsQyxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxhQUFhO0FBQ2hCLGtCQUFRLEdBQUcsb0JBQW9CLENBQUE7QUFDL0IsZ0JBQU07QUFBQSxBQUNSO0FBQ0Usa0JBQVEsR0FBRyxnQkFBZ0IsQ0FBQTtBQUFBLE9BQzlCO0FBQ0QscUJBQWEsUUFBUSwwQkFBc0I7S0FDNUM7OztXQUVLLGtCQUFHOzs7QUFDUCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLElBQ3JELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7QUFDbEQsZUFBTyxrQ0FBTyxDQUFBO09BQ2Y7QUFDRCxVQUFJLFNBQVMsR0FBRyxLQUFLLENBQUE7QUFDckIsVUFBSSxJQUFJLEdBQUcsbUNBQVEsQ0FBQTtBQUNuQixVQUFJLElBQUksR0FBRyxtQ0FBUSxDQUFBO0FBQ25CLFVBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ2hDLGlCQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFlBQUksR0FBRzs7O1VBQU8sa0JBQUssUUFBUSxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FBUSxDQUFBO0FBQy9HLFlBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtBQUNwQyxjQUFJLEdBQUc7Ozs7WUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJOztXQUFTLENBQUE7U0FDckQsTUFBTTtBQUNMLGNBQUksR0FBRzs7OztXQUFjLENBQUE7U0FDdEI7T0FDRjtBQUNELFVBQUksV0FBVyxHQUFHLFNBQWQsV0FBVztlQUFTLE1BQUssV0FBVyxDQUFDLE1BQUssVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBSyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztPQUFBLENBQUE7QUFDcEcsYUFDRTs7VUFBSyxTQUFTLDhCQUEyQixTQUFTLEdBQUMsMkJBQTJCLEdBQUMsRUFBRSxDQUFBLEFBQUcsRUFBQyxPQUFPLEVBQUUsV0FBVyxBQUFDO1FBQ3hHLDZCQUFHLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEFBQUMsR0FBRTtRQUNuQyxJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUk7T0FDekIsQ0FDUDtLQUNGOzs7V0FFVSxxQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3RCLFVBQUksSUFBSSxFQUFFO0FBQ1IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ3BFO0tBQ0Y7OztTQWpFa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3ZpZXcvbWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2Uge1xuICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzID0ge30pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgdXBkYXRlKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBnZXRJY29uQ2xhc3MoKSB7XG4gICAgbGV0IGljb25OYW1lID0gdW5kZWZpbmVkXG4gICAgc3dpdGNoICh0aGlzLnByb3BlcnRpZXMubWVzc2FnZS50eXBlKSB7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGljb25OYW1lID0gJ2ZhLXRpbWVzLWNpcmNsZSdcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgICAgaWNvbk5hbWUgPSAnZmEtZXhjbGFtYXRpb24tY2lyY2xlJ1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3R5cGVzZXR0aW5nJzpcbiAgICAgICAgaWNvbk5hbWUgPSAnZmEtcXVlc3Rpb24tY2lyY2xlJ1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGljb25OYW1lID0gJ2ZhLWluZm8tY2lyY2xlJ1xuICAgIH1cbiAgICByZXR1cm4gYGZhICR7aWNvbk5hbWV9IGF0b20tbGF0ZXgtbG9nLWljb25gXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5jb21iaW5lX3R5cGVzZXR0aW5nX2xvZycpICYmXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5tZXNzYWdlLnR5cGUgPT09ICd0eXBlc2V0dGluZycpIHtcbiAgICAgIHJldHVybiA8ZGl2IC8+XG4gICAgfVxuICAgIGxldCBjbGlja2FibGUgPSBmYWxzZVxuICAgIGxldCBmaWxlID0gPHNwYW4gLz5cbiAgICBsZXQgbGluZSA9IDxzcGFuIC8+XG4gICAgaWYgKHRoaXMucHJvcGVydGllcy5tZXNzYWdlLmZpbGUpIHtcbiAgICAgIGNsaWNrYWJsZSA9IHRydWVcbiAgICAgIGZpbGUgPSA8c3Bhbj57cGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUodGhpcy5wcm9wZXJ0aWVzLmxhdGV4Lm1haW5GaWxlKSwgdGhpcy5wcm9wZXJ0aWVzLm1lc3NhZ2UuZmlsZSl9PC9zcGFuPlxuICAgICAgaWYgKHRoaXMucHJvcGVydGllcy5tZXNzYWdlLmxpbmUgPiAwKSB7XG4gICAgICAgIGxpbmUgPSA8c3Bhbj46e3RoaXMucHJvcGVydGllcy5tZXNzYWdlLmxpbmV9IDwvc3Bhbj5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgPSA8c3Bhbj4gPC9zcGFuPlxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgaGFuZGxlQ2xpY2sgPSAoKSA9PiB0aGlzLmhhbmRsZUNsaWNrKHRoaXMucHJvcGVydGllcy5tZXNzYWdlLmZpbGUsIHRoaXMucHJvcGVydGllcy5tZXNzYWdlLmxpbmUpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYXRvbS1sYXRleC1sb2ctbWVzc2FnZSR7Y2xpY2thYmxlPycgYXRvbS1sYXRleC1sb2ctY2xpY2thYmxlJzonJ31gfSBvbmNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgICAgIDxpIGNsYXNzTmFtZT17dGhpcy5nZXRJY29uQ2xhc3MoKX0vPlxuICAgICAgICB7ZmlsZX1cbiAgICAgICAge2xpbmV9XG4gICAgICAgIHt0aGlzLnByb3BlcnRpZXMubWVzc2FnZS50ZXh0fVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaGFuZGxlQ2xpY2soZmlsZSwgbGluZSkge1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUsIHsgaW5pdGlhbExpbmU6IGxpbmUgPiAwID8gbGluZSAtIDEgOiAwIH0pXG4gICAgfVxuICB9XG59XG4iXX0=