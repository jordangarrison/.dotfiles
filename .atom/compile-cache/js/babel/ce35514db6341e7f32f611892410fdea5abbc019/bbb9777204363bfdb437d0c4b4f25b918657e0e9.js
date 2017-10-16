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

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var OkularOpener = (function (_Opener) {
  _inherits(OkularOpener, _Opener);

  function OkularOpener() {
    _classCallCheck(this, OkularOpener);

    _get(Object.getPrototypeOf(OkularOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(OkularOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var okularPath = atom.config.get('latex.okularPath');
      var uri = _url2['default'].format({
        protocol: 'file:',
        slashes: true,
        pathname: encodeURI(filePath),
        hash: encodeURI('src:' + lineNumber + ' ' + texPath)
      });
      var args = ['--unique', '"' + uri + '"'];
      if (this.shouldOpenInBackground()) args.unshift('--noraise');

      var command = '"' + okularPath + '" ' + args.join(' ');

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'linux' && _fsPlus2['default'].existsSync(atom.config.get('latex.okularPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return true;
    }
  }]);

  return OkularOpener;
})(_opener2['default']);

exports['default'] = OkularOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9va3VsYXItb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O21CQUNSLEtBQUs7Ozs7c0JBQ0YsV0FBVzs7OztJQUVULFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O2VBQVosWUFBWTs7NkJBQ3BCLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDekMsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUN0RCxVQUFNLEdBQUcsR0FBRyxpQkFBSSxNQUFNLENBQUM7QUFDckIsZ0JBQVEsRUFBRSxPQUFPO0FBQ2pCLGVBQU8sRUFBRSxJQUFJO0FBQ2IsZ0JBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQzdCLFlBQUksRUFBRSxTQUFTLFVBQVEsVUFBVSxTQUFJLE9BQU8sQ0FBRztPQUNoRCxDQUFDLENBQUE7QUFDRixVQUFNLElBQUksR0FBRyxDQUNYLFVBQVUsUUFDTixHQUFHLE9BQ1IsQ0FBQTtBQUNELFVBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFNUQsVUFBTSxPQUFPLFNBQU8sVUFBVSxVQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUUsQ0FBQTs7QUFFbkQsWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3RFOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO0tBQzFGOzs7V0FFVSxzQkFBRztBQUNaLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUVtQiwrQkFBRztBQUNyQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0E5QmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9va3VsYXItb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCB1cmwgZnJvbSAndXJsJ1xuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9rdWxhck9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3Qgb2t1bGFyUGF0aCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub2t1bGFyUGF0aCcpXG4gICAgY29uc3QgdXJpID0gdXJsLmZvcm1hdCh7XG4gICAgICBwcm90b2NvbDogJ2ZpbGU6JyxcbiAgICAgIHNsYXNoZXM6IHRydWUsXG4gICAgICBwYXRobmFtZTogZW5jb2RlVVJJKGZpbGVQYXRoKSxcbiAgICAgIGhhc2g6IGVuY29kZVVSSShgc3JjOiR7bGluZU51bWJlcn0gJHt0ZXhQYXRofWApXG4gICAgfSlcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy0tdW5pcXVlJyxcbiAgICAgIGBcIiR7dXJpfVwiYFxuICAgIF1cbiAgICBpZiAodGhpcy5zaG91bGRPcGVuSW5CYWNrZ3JvdW5kKCkpIGFyZ3MudW5zaGlmdCgnLS1ub3JhaXNlJylcblxuICAgIGNvbnN0IGNvbW1hbmQgPSBgXCIke29rdWxhclBhdGh9XCIgJHthcmdzLmpvaW4oJyAnKX1gXG5cbiAgICBhd2FpdCBsYXRleC5wcm9jZXNzLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29tbWFuZCwgeyBzaG93RXJyb3I6IHRydWUgfSlcbiAgfVxuXG4gIGNhbk9wZW4gKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MucGxhdGZvcm0gPT09ICdsaW51eCcgJiYgZnMuZXhpc3RzU3luYyhhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9rdWxhclBhdGgnKSlcbiAgfVxuXG4gIGhhc1N5bmN0ZXggKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBjYW5PcGVuSW5CYWNrZ3JvdW5kICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG4iXX0=