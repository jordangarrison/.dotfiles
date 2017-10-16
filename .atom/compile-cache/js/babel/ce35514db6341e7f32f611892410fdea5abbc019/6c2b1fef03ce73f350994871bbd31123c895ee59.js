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

var ZathuraOpener = (function (_Opener) {
  _inherits(ZathuraOpener, _Opener);

  function ZathuraOpener() {
    _classCallCheck(this, ZathuraOpener);

    _get(Object.getPrototypeOf(ZathuraOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ZathuraOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var zathuraPath = atom.config.get('latex.zathuraPath');
      var atomPath = process.argv[0];
      var args = ['--synctex-editor-command="\\"' + atomPath + '\\" \\"%{input}:%{line}\\""', '--synctex-forward="' + lineNumber + ':1:' + texPath + '"', '"' + filePath + '"'];
      var command = '"' + zathuraPath + '" ' + args.join(' ');
      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'linux' && ((0, _werkzeug.isPdfFile)(filePath) || (0, _werkzeug.isPsFile)(filePath)) && _fsPlus2['default'].existsSync(atom.config.get('latex.zathuraPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }]);

  return ZathuraOpener;
})(_opener2['default']);

exports['default'] = ZathuraOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy96YXRodXJhLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztzQkFDTCxXQUFXOzs7O3dCQUNNLGFBQWE7O0lBRTVCLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7NkJBQ3JCLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDekMsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUN4RCxVQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sSUFBSSxHQUFHLG1DQUNxQixRQUFRLDBEQUNsQixVQUFVLFdBQU0sT0FBTyxjQUN6QyxRQUFRLE9BQ2IsQ0FBQTtBQUNELFVBQU0sT0FBTyxTQUFPLFdBQVcsVUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDcEQsWUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3RFOzs7V0FFTyxpQkFBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FDaEMseUJBQVUsUUFBUSxDQUFDLElBQUksd0JBQVMsUUFBUSxDQUFDLENBQUEsQUFBQyxJQUMzQyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBO0tBQ3REOzs7V0FFVSxzQkFBRztBQUNaLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztTQXJCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3phdGh1cmEtb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuaW1wb3J0IHsgaXNQZGZGaWxlLCBpc1BzRmlsZSB9IGZyb20gJy4uL3dlcmt6ZXVnJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBaYXRodXJhT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgYXN5bmMgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgICBjb25zdCB6YXRodXJhUGF0aCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguemF0aHVyYVBhdGgnKVxuICAgIGNvbnN0IGF0b21QYXRoID0gcHJvY2Vzcy5hcmd2WzBdXG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgIGAtLXN5bmN0ZXgtZWRpdG9yLWNvbW1hbmQ9XCJcXFxcXCIke2F0b21QYXRofVxcXFxcIiBcXFxcXCIle2lucHV0fTole2xpbmV9XFxcXFwiXCJgLFxuICAgICAgYC0tc3luY3RleC1mb3J3YXJkPVwiJHtsaW5lTnVtYmVyfToxOiR7dGV4UGF0aH1cImAsXG4gICAgICBgXCIke2ZpbGVQYXRofVwiYFxuICAgIF1cbiAgICBjb25zdCBjb21tYW5kID0gYFwiJHt6YXRodXJhUGF0aH1cIiAke2FyZ3Muam9pbignICcpfWBcbiAgICBhd2FpdCBsYXRleC5wcm9jZXNzLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29tbWFuZCwgeyBzaG93RXJyb3I6IHRydWUgfSlcbiAgfVxuXG4gIGNhbk9wZW4gKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MucGxhdGZvcm0gPT09ICdsaW51eCcgJiZcbiAgICAgIChpc1BkZkZpbGUoZmlsZVBhdGgpIHx8IGlzUHNGaWxlKGZpbGVQYXRoKSkgJiZcbiAgICAgIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KCdsYXRleC56YXRodXJhUGF0aCcpKVxuICB9XG5cbiAgaGFzU3luY3RleCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuIl19