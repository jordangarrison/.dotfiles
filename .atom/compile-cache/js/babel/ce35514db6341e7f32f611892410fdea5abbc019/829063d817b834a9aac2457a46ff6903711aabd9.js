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

function fileReferenceElement(filePath, range, referenceType) {
  if (!filePath) return '';

  var lineReference = range ? _etch2['default'].dom(
    'span',
    { className: 'latex-line-number' },
    range[0][0] + 1
  ) : '';
  var endLineReference = range && range[0][0] !== range[1][0] ? _etch2['default'].dom(
    'span',
    { className: 'latex-end-line-number' },
    range[1][0] + 1
  ) : '';
  var text = _path2['default'].basename(filePath);
  var clickHandler = function clickHandler() {
    atom.workspace.open(filePath, { initialLine: range ? range[0][0] : 0 });
  };
  var className = 'latex-' + referenceType + '-reference';

  return _etch2['default'].dom(
    'span',
    { className: className },
    _etch2['default'].dom(
      'span',
      { className: 'latex-file-link', onclick: clickHandler },
      text,
      lineReference,
      endLineReference
    )
  );
}

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
        'div',
        { className: this.getClassNames(message) },
        _etch2['default'].dom(
          'span',
          null,
          message.text
        ),
        fileReferenceElement(message.filePath, message.range, 'source'),
        fileReferenceElement(message.logPath, message.logRange, 'log')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLW1lc3NhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNOLE1BQU07Ozs7b0JBQ0QsTUFBTTs7QUFFNUIsU0FBUyxvQkFBb0IsQ0FBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRTtBQUM3RCxNQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFBOztBQUV4QixNQUFNLGFBQWEsR0FBRyxLQUFLLEdBQUc7O01BQU0sU0FBUyxFQUFDLG1CQUFtQjtJQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0dBQVEsR0FBRyxFQUFFLENBQUE7QUFDL0YsTUFBTSxnQkFBZ0IsR0FBRyxBQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFJOztNQUFNLFNBQVMsRUFBQyx1QkFBdUI7SUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztHQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ3ZJLE1BQU0sSUFBSSxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxNQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUN6QixRQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0dBQ3hFLENBQUE7QUFDRCxNQUFNLFNBQVMsY0FBWSxhQUFhLGVBQVksQ0FBQTs7QUFFcEQsU0FDRTs7TUFBTSxTQUFTLEVBQUUsU0FBUyxBQUFDO0lBQ3pCOztRQUFNLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxPQUFPLEVBQUUsWUFBWSxBQUFDO01BQ3JELElBQUk7TUFDSixhQUFhO01BQ2IsZ0JBQWdCO0tBQ1o7R0FDRixDQUNSO0NBQ0Y7O0lBRW9CLFVBQVU7QUFDakIsV0FETyxVQUFVLEdBQ0M7UUFBakIsVUFBVSx5REFBRyxFQUFFOzswQkFEVCxVQUFVOztBQUUzQixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSmtCLFVBQVU7OzZCQU1mLGFBQUc7QUFDZixZQUFNLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRU0sa0JBQUc7QUFDUixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQTs7QUFFdkMsYUFDRTs7VUFBSyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQUFBQztRQUMxQzs7O1VBQU8sT0FBTyxDQUFDLElBQUk7U0FBUTtRQUMxQixvQkFBb0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO1FBQy9ELG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7T0FDM0QsQ0FDUDtLQUNGOzs7V0FFYSx1QkFBQyxPQUFPLEVBQUU7QUFDdEIsVUFBTSxTQUFTLGNBQVksT0FBTyxDQUFDLElBQUksQUFBRSxDQUFBOztBQUV6QyxVQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUE7QUFDekYsVUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFlBQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM3SSxVQUFJLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRTtBQUN2QyxlQUFVLFNBQVMsc0JBQWtCO09BQ3RDOztBQUVELGFBQU8sU0FBUyxDQUFBO0tBQ2pCOzs7V0FFTSxnQkFBQyxVQUFVLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztTQXJDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctbWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuXG5mdW5jdGlvbiBmaWxlUmVmZXJlbmNlRWxlbWVudCAoZmlsZVBhdGgsIHJhbmdlLCByZWZlcmVuY2VUeXBlKSB7XG4gIGlmICghZmlsZVBhdGgpIHJldHVybiAnJ1xuXG4gIGNvbnN0IGxpbmVSZWZlcmVuY2UgPSByYW5nZSA/IDxzcGFuIGNsYXNzTmFtZT0nbGF0ZXgtbGluZS1udW1iZXInPntyYW5nZVswXVswXSArIDF9PC9zcGFuPiA6ICcnXG4gIGNvbnN0IGVuZExpbmVSZWZlcmVuY2UgPSAocmFuZ2UgJiYgcmFuZ2VbMF1bMF0gIT09IHJhbmdlWzFdWzBdKSA/IDxzcGFuIGNsYXNzTmFtZT0nbGF0ZXgtZW5kLWxpbmUtbnVtYmVyJz57cmFuZ2VbMV1bMF0gKyAxfTwvc3Bhbj4gOiAnJ1xuICBjb25zdCB0ZXh0ID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aClcbiAgY29uc3QgY2xpY2tIYW5kbGVyID0gKCkgPT4ge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgsIHsgaW5pdGlhbExpbmU6IHJhbmdlID8gcmFuZ2VbMF1bMF0gOiAwIH0pXG4gIH1cbiAgY29uc3QgY2xhc3NOYW1lID0gYGxhdGV4LSR7cmVmZXJlbmNlVHlwZX0tcmVmZXJlbmNlYFxuXG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPSdsYXRleC1maWxlLWxpbmsnIG9uY2xpY2s9e2NsaWNrSGFuZGxlcn0+XG4gICAgICAgIHt0ZXh0fVxuICAgICAgICB7bGluZVJlZmVyZW5jZX1cbiAgICAgICAge2VuZExpbmVSZWZlcmVuY2V9XG4gICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ01lc3NhZ2Uge1xuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgZGVzdHJveSAoKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLnByb3BlcnRpZXMubWVzc2FnZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmdldENsYXNzTmFtZXMobWVzc2FnZSl9PlxuICAgICAgICA8c3Bhbj57bWVzc2FnZS50ZXh0fTwvc3Bhbj5cbiAgICAgICAge2ZpbGVSZWZlcmVuY2VFbGVtZW50KG1lc3NhZ2UuZmlsZVBhdGgsIG1lc3NhZ2UucmFuZ2UsICdzb3VyY2UnKX1cbiAgICAgICAge2ZpbGVSZWZlcmVuY2VFbGVtZW50KG1lc3NhZ2UubG9nUGF0aCwgbWVzc2FnZS5sb2dSYW5nZSwgJ2xvZycpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0Q2xhc3NOYW1lcyAobWVzc2FnZSkge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGBsYXRleC0ke21lc3NhZ2UudHlwZX1gXG5cbiAgICBjb25zdCBtYXRjaGVzRmlsZVBhdGggPSBtZXNzYWdlLmZpbGVQYXRoICYmIHRoaXMucHJvcGVydGllcy5maWxlUGF0aCA9PT0gbWVzc2FnZS5maWxlUGF0aFxuICAgIGNvbnN0IGNvbnRhaW5zUG9zaXRpb24gPSBtZXNzYWdlLnJhbmdlICYmIHRoaXMucHJvcGVydGllcy5wb3NpdGlvbiAmJiBSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpLmNvbnRhaW5zUG9pbnQodGhpcy5wcm9wZXJ0aWVzLnBvc2l0aW9uKVxuICAgIGlmIChtYXRjaGVzRmlsZVBhdGggJiYgY29udGFpbnNQb3NpdGlvbikge1xuICAgICAgcmV0dXJuIGAke2NsYXNzTmFtZX0gbGF0ZXgtaGlnaGxpZ2h0YFxuICAgIH1cblxuICAgIHJldHVybiBjbGFzc05hbWVcbiAgfVxuXG4gIHVwZGF0ZSAocHJvcGVydGllcykge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxufVxuIl19