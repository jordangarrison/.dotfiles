Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _atom = require('atom');

var Opener = (function (_Disposable) {
  _inherits(Opener, _Disposable);

  function Opener() {
    _classCallCheck(this, Opener);

    _get(Object.getPrototypeOf(Opener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Opener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {})
  }, {
    key: 'shouldOpenInBackground',
    value: function shouldOpenInBackground() {
      return atom.config.get('latex.openResultInBackground');
    }
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return false;
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return false;
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return false;
    }
  }]);

  return Opener;
})(_atom.Disposable);

exports['default'] = Opener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRTJCLE1BQU07O0lBRVosTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOzsrQkFBTixNQUFNOzs7ZUFBTixNQUFNOzs2QkFDZCxXQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUU7OztXQUV0QixrQ0FBRztBQUN4QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUE7S0FDdkQ7OztXQUVPLGlCQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLEtBQUssQ0FBQTtLQUNiOzs7V0FFVSxzQkFBRztBQUNaLGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztXQUVtQiwrQkFBRztBQUNyQixhQUFPLEtBQUssQ0FBQTtLQUNiOzs7U0FqQmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3BlbmVyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7fVxuXG4gIHNob3VsZE9wZW5JbkJhY2tncm91bmQgKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9wZW5SZXN1bHRJbkJhY2tncm91bmQnKVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGhhc1N5bmN0ZXggKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY2FuT3BlbkluQmFja2dyb3VuZCAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==