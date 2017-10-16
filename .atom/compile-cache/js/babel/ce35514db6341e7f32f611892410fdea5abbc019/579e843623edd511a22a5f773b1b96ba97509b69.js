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

var _fileReference = require('./file-reference');

var _fileReference2 = _interopRequireDefault(_fileReference);

var LogMessage = (function () {
  function LogMessage() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogMessage);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(LogMessage, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var message = this.properties.message;

      return _etch2['default'].dom(
        'tr',
        { className: this.getClassNames(message) },
        _etch2['default'].dom(
          'td',
          null,
          _etch2['default'].dom(_messageIcon2['default'], { type: message.type })
        ),
        _etch2['default'].dom(
          'td',
          null,
          message.text
        ),
        _etch2['default'].dom(
          'td',
          null,
          _etch2['default'].dom(_fileReference2['default'], { file: message.filePath, range: message.range })
        ),
        _etch2['default'].dom(
          'td',
          null,
          _etch2['default'].dom(_fileReference2['default'], { file: message.logPath, range: message.logRange })
        )
      );
    }
  }, {
    key: 'getClassNames',
    value: function getClassNames(message) {
      var className = 'latex-' + message.type;

      var matchesFilePath = message.filePath && this.properties.filePath === message.filePath;
      var containsPosition = message.range && this.properties.position && _atom.Range.fromObject(message.range).containsPoint(this.properties.position);
      if (matchesFilePath && containsPosition) {
        return className + ' latex-highlight';
      }

      return className;
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return LogMessage;
})();

exports['default'] = LogMessage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLW1lc3NhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNELE1BQU07OzJCQUNKLGdCQUFnQjs7Ozs2QkFDZCxrQkFBa0I7Ozs7SUFFdkIsVUFBVTtBQUNqQixXQURPLFVBQVUsR0FDQztRQUFqQixVQUFVLHlEQUFHLEVBQUU7OzBCQURULFVBQVU7O0FBRTNCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7ZUFKa0IsVUFBVTs7NkJBTWYsYUFBRztBQUNmLFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTSxrQkFBRztBQUNSLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFBOztBQUV2QyxhQUNFOztVQUFJLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxBQUFDO1FBQ3pDOzs7VUFBSSxrREFBYSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQUFBQyxHQUFHO1NBQUs7UUFDNUM7OztVQUFLLE9BQU8sQ0FBQyxJQUFJO1NBQU07UUFDdkI7OztVQUFJLG9EQUFlLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxBQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEFBQUMsR0FBRztTQUFLO1FBQ3hFOzs7VUFBSSxvREFBZSxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQUFBQyxFQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxBQUFDLEdBQUc7U0FBSztPQUN2RSxDQUNOO0tBQ0Y7OztXQUVhLHVCQUFDLE9BQU8sRUFBRTtBQUN0QixVQUFNLFNBQVMsY0FBWSxPQUFPLENBQUMsSUFBSSxBQUFFLENBQUE7O0FBRXpDLFVBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQTtBQUN6RixVQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksWUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdJLFVBQUksZUFBZSxJQUFJLGdCQUFnQixFQUFFO0FBQ3ZDLGVBQVUsU0FBUyxzQkFBa0I7T0FDdEM7O0FBRUQsYUFBTyxTQUFTLENBQUE7S0FDakI7OztXQUVNLGdCQUFDLFVBQVUsRUFBRTtBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1NBdENrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL2xvZy1tZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBNZXNzYWdlSWNvbiBmcm9tICcuL21lc3NhZ2UtaWNvbidcbmltcG9ydCBGaWxlUmVmZXJlbmNlIGZyb20gJy4vZmlsZS1yZWZlcmVuY2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ01lc3NhZ2Uge1xuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLnByb3BlcnRpZXMubWVzc2FnZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDx0ciBjbGFzc05hbWU9e3RoaXMuZ2V0Q2xhc3NOYW1lcyhtZXNzYWdlKX0+XG4gICAgICAgIDx0ZD48TWVzc2FnZUljb24gdHlwZT17bWVzc2FnZS50eXBlfSAvPjwvdGQ+XG4gICAgICAgIDx0ZD57bWVzc2FnZS50ZXh0fTwvdGQ+XG4gICAgICAgIDx0ZD48RmlsZVJlZmVyZW5jZSBmaWxlPXttZXNzYWdlLmZpbGVQYXRofSByYW5nZT17bWVzc2FnZS5yYW5nZX0gLz48L3RkPlxuICAgICAgICA8dGQ+PEZpbGVSZWZlcmVuY2UgZmlsZT17bWVzc2FnZS5sb2dQYXRofSByYW5nZT17bWVzc2FnZS5sb2dSYW5nZX0gLz48L3RkPlxuICAgICAgPC90cj5cbiAgICApXG4gIH1cblxuICBnZXRDbGFzc05hbWVzIChtZXNzYWdlKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gYGxhdGV4LSR7bWVzc2FnZS50eXBlfWBcblxuICAgIGNvbnN0IG1hdGNoZXNGaWxlUGF0aCA9IG1lc3NhZ2UuZmlsZVBhdGggJiYgdGhpcy5wcm9wZXJ0aWVzLmZpbGVQYXRoID09PSBtZXNzYWdlLmZpbGVQYXRoXG4gICAgY29uc3QgY29udGFpbnNQb3NpdGlvbiA9IG1lc3NhZ2UucmFuZ2UgJiYgdGhpcy5wcm9wZXJ0aWVzLnBvc2l0aW9uICYmIFJhbmdlLmZyb21PYmplY3QobWVzc2FnZS5yYW5nZSkuY29udGFpbnNQb2ludCh0aGlzLnByb3BlcnRpZXMucG9zaXRpb24pXG4gICAgaWYgKG1hdGNoZXNGaWxlUGF0aCAmJiBjb250YWluc1Bvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gYCR7Y2xhc3NOYW1lfSBsYXRleC1oaWdobGlnaHRgXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzTmFtZVxuICB9XG5cbiAgdXBkYXRlIChwcm9wZXJ0aWVzKSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG59XG4iXX0=