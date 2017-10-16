Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var _werkzeug = require('../werkzeug');

var CustomOpener = (function (_Opener) {
  _inherits(CustomOpener, _Opener);

  function CustomOpener() {
    _classCallCheck(this, CustomOpener);

    _get(Object.getPrototypeOf(CustomOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CustomOpener, [{
    key: 'open',

    // Custom PDF viewer does not support texPath and lineNumber.
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var command = '"' + atom.config.get('latex.viewerPath') + '" "' + filePath + '"';

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return (0, _werkzeug.isPdfFile)(filePath) && _fsPlus2['default'].existsSync(atom.config.get('latex.viewerPath'));
    }
  }]);

  return CustomOpener;
})(_opener2['default']);

exports['default'] = CustomOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9jdXN0b20tb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O3NCQUNMLFdBQVc7Ozs7d0JBQ0osYUFBYTs7SUFFbEIsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOzs7ZUFBWixZQUFZOzs7OzZCQUVwQixXQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQ3pDLFVBQU0sT0FBTyxTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFdBQU0sUUFBUSxNQUFHLENBQUE7O0FBRXhFLFlBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUN0RTs7O1dBRU8saUJBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8seUJBQVUsUUFBUSxDQUFDLElBQUksb0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtLQUNqRjs7O1NBVmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9jdXN0b20tb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuaW1wb3J0IHsgaXNQZGZGaWxlIH0gZnJvbSAnLi4vd2Vya3pldWcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbU9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIC8vIEN1c3RvbSBQREYgdmlld2VyIGRvZXMgbm90IHN1cHBvcnQgdGV4UGF0aCBhbmQgbGluZU51bWJlci5cbiAgYXN5bmMgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgICBjb25zdCBjb21tYW5kID0gYFwiJHthdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnZpZXdlclBhdGgnKX1cIiBcIiR7ZmlsZVBhdGh9XCJgXG5cbiAgICBhd2FpdCBsYXRleC5wcm9jZXNzLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29tbWFuZCwgeyBzaG93RXJyb3I6IHRydWUgfSlcbiAgfVxuXG4gIGNhbk9wZW4gKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGlzUGRmRmlsZShmaWxlUGF0aCkgJiYgZnMuZXhpc3RzU3luYyhhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnZpZXdlclBhdGgnKSlcbiAgfVxufVxuIl19