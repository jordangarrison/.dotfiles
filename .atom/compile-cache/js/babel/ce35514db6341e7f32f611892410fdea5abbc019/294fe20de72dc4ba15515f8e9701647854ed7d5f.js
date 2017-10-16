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

function forwardSync(pdfView, texPath, lineNumber) {
  if (pdfView != null && pdfView.forwardSync != null) {
    pdfView.forwardSync(texPath, lineNumber);
  }
}

var PdfViewOpener = (function (_Opener) {
  _inherits(PdfViewOpener, _Opener);

  function PdfViewOpener() {
    _classCallCheck(this, PdfViewOpener);

    _get(Object.getPrototypeOf(PdfViewOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PdfViewOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var openPaneItems = atom.workspace.getPaneItems();
      for (var openPaneItem of openPaneItems) {
        if (openPaneItem.filePath === filePath) {
          forwardSync(openPaneItem, texPath, lineNumber);
          return true;
        }
      }

      // TODO: Make this configurable?
      atom.workspace.open(filePath, { 'split': 'right' }).then(function (pane) {
        return forwardSync(pane, texPath, lineNumber);
      });

      return true;
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return (0, _werkzeug.isPdfFile)(filePath) && atom.packages.isPackageActive('pdf-view');
    }
  }]);

  return PdfViewOpener;
})(_opener2['default']);

exports['default'] = PdfViewOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9wZGYtdmlldy1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixXQUFXOzs7O3dCQUNKLGFBQWE7O0FBRXZDLFNBQVMsV0FBVyxDQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQ2xELE1BQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtBQUNsRCxXQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQTtHQUN6QztDQUNGOztJQUVvQixhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7OzZCQUNyQixXQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO0FBQ3pDLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkQsV0FBSyxJQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7QUFDeEMsWUFBSSxZQUFZLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUN0QyxxQkFBVyxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDOUMsaUJBQU8sSUFBSSxDQUFBO1NBQ1o7T0FDRjs7O0FBR0QsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtlQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQztPQUFBLENBQUMsQ0FBQTs7QUFFdEcsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBRU8saUJBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8seUJBQVUsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDeEU7OztTQWxCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3BkZi12aWV3LW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5pbXBvcnQgeyBpc1BkZkZpbGUgfSBmcm9tICcuLi93ZXJremV1ZydcblxuZnVuY3Rpb24gZm9yd2FyZFN5bmMgKHBkZlZpZXcsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgaWYgKHBkZlZpZXcgIT0gbnVsbCAmJiBwZGZWaWV3LmZvcndhcmRTeW5jICE9IG51bGwpIHtcbiAgICBwZGZWaWV3LmZvcndhcmRTeW5jKHRleFBhdGgsIGxpbmVOdW1iZXIpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGRmVmlld09wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgY29uc3Qgb3BlblBhbmVJdGVtcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpXG4gICAgZm9yIChjb25zdCBvcGVuUGFuZUl0ZW0gb2Ygb3BlblBhbmVJdGVtcykge1xuICAgICAgaWYgKG9wZW5QYW5lSXRlbS5maWxlUGF0aCA9PT0gZmlsZVBhdGgpIHtcbiAgICAgICAgZm9yd2FyZFN5bmMob3BlblBhbmVJdGVtLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCwgeydzcGxpdCc6ICdyaWdodCd9KS50aGVuKHBhbmUgPT4gZm9yd2FyZFN5bmMocGFuZSwgdGV4UGF0aCwgbGluZU51bWJlcikpXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2FuT3BlbiAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gaXNQZGZGaWxlKGZpbGVQYXRoKSAmJiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgncGRmLXZpZXcnKVxuICB9XG59XG4iXX0=