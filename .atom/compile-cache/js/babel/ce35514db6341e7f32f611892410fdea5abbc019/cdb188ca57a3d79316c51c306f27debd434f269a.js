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

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var _werkzeug = require('../werkzeug');

var PreviewOpener = (function (_Opener) {
  _inherits(PreviewOpener, _Opener);

  function PreviewOpener() {
    _classCallCheck(this, PreviewOpener);

    _get(Object.getPrototypeOf(PreviewOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PreviewOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var command = 'open -g -a Preview.app "' + filePath + '"';
      if (!this.shouldOpenInBackground()) {
        command = command.replace(/-g\s/, '');
      }

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'darwin' && ((0, _werkzeug.isPdfFile)(filePath) || (0, _werkzeug.isPsFile)(filePath));
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return true;
    }
  }]);

  return PreviewOpener;
})(_opener2['default']);

exports['default'] = PreviewOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9wcmV2aWV3LW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7d0JBQ00sYUFBYTs7SUFFNUIsYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOzs2QkFDckIsV0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxVQUFJLE9BQU8sZ0NBQThCLFFBQVEsTUFBRyxDQUFBO0FBQ3BELFVBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRTtBQUNsQyxlQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUE7T0FDdEM7O0FBRUQsWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3RFOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsS0FBSyx5QkFBVSxRQUFRLENBQUMsSUFBSSx3QkFBUyxRQUFRLENBQUMsQ0FBQSxBQUFDLENBQUE7S0FDcEY7OztXQUVtQiwrQkFBRztBQUNyQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0FoQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9wcmV2aWV3LW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5pbXBvcnQgeyBpc1BkZkZpbGUsIGlzUHNGaWxlIH0gZnJvbSAnLi4vd2Vya3pldWcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIGxldCBjb21tYW5kID0gYG9wZW4gLWcgLWEgUHJldmlldy5hcHAgXCIke2ZpbGVQYXRofVwiYFxuICAgIGlmICghdGhpcy5zaG91bGRPcGVuSW5CYWNrZ3JvdW5kKCkpIHtcbiAgICAgIGNvbW1hbmQgPSBjb21tYW5kLnJlcGxhY2UoLy1nXFxzLywgJycpXG4gICAgfVxuXG4gICAgYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIHsgc2hvd0Vycm9yOiB0cnVlIH0pXG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyAmJiAoaXNQZGZGaWxlKGZpbGVQYXRoKSB8fCBpc1BzRmlsZShmaWxlUGF0aCkpXG4gIH1cblxuICBjYW5PcGVuSW5CYWNrZ3JvdW5kICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG4iXX0=