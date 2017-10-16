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

var FileReference = (function () {
  function FileReference() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? { type: 'error' } : arguments[0];

    _classCallCheck(this, FileReference);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(FileReference, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var _properties = this.properties;
      var file = _properties.file;
      var range = _properties.range;

      if (!file) return _etch2['default'].dom('span', null);

      var endLineReference = range && range[0][0] !== range[1][0] ? '–' + (range[1][0] + 1) : '';
      var lineReference = range ? ' (' + (range[0][0] + 1) + endLineReference + ')' : '';
      var text = _path2['default'].basename(file);
      var clickHandler = function clickHandler() {
        atom.workspace.open(file, { initialLine: range ? range[0][0] : 0 });
      };

      return _etch2['default'].dom(
        'a',
        { className: 'latex-file-reference', href: '#', onclick: clickHandler },
        text,
        lineReference
      );
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }]);

  return FileReference;
})();

exports['default'] = FileReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvZmlsZS1yZWZlcmVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNOLE1BQU07Ozs7SUFFRixhQUFhO0FBQ3BCLFdBRE8sYUFBYSxHQUNhO1FBQWhDLFVBQVUseURBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOzswQkFEeEIsYUFBYTs7QUFFOUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3RCOztlQUprQixhQUFhOzs2QkFNbEIsYUFBRztBQUNmLFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTSxrQkFBRzt3QkFDZ0IsSUFBSSxDQUFDLFVBQVU7VUFBL0IsSUFBSSxlQUFKLElBQUk7VUFBRSxLQUFLLGVBQUwsS0FBSzs7QUFFbkIsVUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLG1DQUFRLENBQUE7O0FBRTFCLFVBQU0sZ0JBQWdCLEdBQUcsQUFBQyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBYSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUssRUFBRSxDQUFBO0FBQ2pHLFVBQU0sYUFBYSxHQUFHLEtBQUssV0FBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUcsZ0JBQWdCLFNBQU0sRUFBRSxDQUFBO0FBQzdFLFVBQU0sSUFBSSxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNoQyxVQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUN6QixZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ3BFLENBQUE7O0FBRUQsYUFDRTs7VUFBRyxTQUFTLEVBQUMsc0JBQXNCLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsWUFBWSxBQUFDO1FBQ2hFLElBQUk7UUFDSixhQUFhO09BQ1osQ0FDTDtLQUNGOzs7V0FFTSxnQkFBQyxVQUFVLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztTQWpDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9maWxlLXJlZmVyZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlUmVmZXJlbmNlIHtcbiAgY29uc3RydWN0b3IgKHByb3BlcnRpZXMgPSB7IHR5cGU6ICdlcnJvcicgfSkge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3kgKCkge1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IGZpbGUsIHJhbmdlIH0gPSB0aGlzLnByb3BlcnRpZXNcblxuICAgIGlmICghZmlsZSkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICBjb25zdCBlbmRMaW5lUmVmZXJlbmNlID0gKHJhbmdlICYmIHJhbmdlWzBdWzBdICE9PSByYW5nZVsxXVswXSkgPyBgXFx1MjAxMyR7cmFuZ2VbMV1bMF0gKyAxfWAgOiAnJ1xuICAgIGNvbnN0IGxpbmVSZWZlcmVuY2UgPSByYW5nZSA/IGAgKCR7cmFuZ2VbMF1bMF0gKyAxfSR7ZW5kTGluZVJlZmVyZW5jZX0pYCA6ICcnXG4gICAgY29uc3QgdGV4dCA9IHBhdGguYmFzZW5hbWUoZmlsZSlcbiAgICBjb25zdCBjbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUsIHsgaW5pdGlhbExpbmU6IHJhbmdlID8gcmFuZ2VbMF1bMF0gOiAwIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT0nbGF0ZXgtZmlsZS1yZWZlcmVuY2UnIGhyZWY9JyMnIG9uY2xpY2s9e2NsaWNrSGFuZGxlcn0+XG4gICAgICAgIHt0ZXh0fVxuICAgICAgICB7bGluZVJlZmVyZW5jZX1cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cblxuICB1cGRhdGUgKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cbn1cbiJdfQ==