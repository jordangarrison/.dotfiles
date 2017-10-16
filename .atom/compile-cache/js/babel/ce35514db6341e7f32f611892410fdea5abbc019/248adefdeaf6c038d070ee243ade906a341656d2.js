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

var SumatraOpener = (function (_Opener) {
  _inherits(SumatraOpener, _Opener);

  function SumatraOpener() {
    _classCallCheck(this, SumatraOpener);

    _get(Object.getPrototypeOf(SumatraOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SumatraOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var sumatraPath = '"' + atom.config.get('latex.sumatraPath') + '"';
      var atomPath = process.argv[0];
      var args = ['-reuse-instance', '-forward-search', '"' + texPath + '"', lineNumber, '-inverse-search', '"\\"' + atomPath + '\\" \\"%f:%l\\""', '"' + filePath + '"'];

      var command = sumatraPath + ' ' + args.join(' ');

      yield latex.process.executeChildProcess(command);
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'win32' && (0, _werkzeug.isPdfFile)(filePath) && _fsPlus2['default'].existsSync(atom.config.get('latex.sumatraPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }]);

  return SumatraOpener;
})(_opener2['default']);

exports['default'] = SumatraOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9zdW1hdHJhLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztzQkFDTCxXQUFXOzs7O3dCQUNKLGFBQWE7O0lBRWxCLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7NkJBQ3JCLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDekMsVUFBTSxXQUFXLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBRyxDQUFBO0FBQy9ELFVBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDaEMsVUFBTSxJQUFJLEdBQUcsQ0FDWCxpQkFBaUIsRUFDakIsaUJBQWlCLFFBQ2IsT0FBTyxRQUNYLFVBQVUsRUFDVixpQkFBaUIsV0FDVixRQUFRLDZCQUNYLFFBQVEsT0FDYixDQUFBOztBQUVELFVBQU0sT0FBTyxHQUFNLFdBQVcsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7O0FBRWxELFlBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNqRDs7O1dBRU8saUJBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUkseUJBQVUsUUFBUSxDQUFDLElBQ3hELG9CQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7S0FDdEQ7OztXQUVVLHNCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBMUJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc3VtYXRyYS1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5pbXBvcnQgeyBpc1BkZkZpbGUgfSBmcm9tICcuLi93ZXJremV1ZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VtYXRyYU9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3Qgc3VtYXRyYVBhdGggPSBgXCIke2F0b20uY29uZmlnLmdldCgnbGF0ZXguc3VtYXRyYVBhdGgnKX1cImBcbiAgICBjb25zdCBhdG9tUGF0aCA9IHByb2Nlc3MuYXJndlswXVxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLXJldXNlLWluc3RhbmNlJyxcbiAgICAgICctZm9yd2FyZC1zZWFyY2gnLFxuICAgICAgYFwiJHt0ZXhQYXRofVwiYCxcbiAgICAgIGxpbmVOdW1iZXIsXG4gICAgICAnLWludmVyc2Utc2VhcmNoJyxcbiAgICAgIGBcIlxcXFxcIiR7YXRvbVBhdGh9XFxcXFwiIFxcXFxcIiVmOiVsXFxcXFwiXCJgLFxuICAgICAgYFwiJHtmaWxlUGF0aH1cImBcbiAgICBdXG5cbiAgICBjb25zdCBjb21tYW5kID0gYCR7c3VtYXRyYVBhdGh9ICR7YXJncy5qb2luKCcgJyl9YFxuXG4gICAgYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQpXG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInICYmIGlzUGRmRmlsZShmaWxlUGF0aCkgJiZcbiAgICAgIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KCdsYXRleC5zdW1hdHJhUGF0aCcpKVxuICB9XG5cbiAgaGFzU3luY3RleCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuIl19