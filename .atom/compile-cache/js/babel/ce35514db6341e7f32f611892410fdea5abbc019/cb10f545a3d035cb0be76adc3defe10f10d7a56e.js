Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var ErrorMarker = (function () {
  function ErrorMarker(editor, messages) {
    _classCallCheck(this, ErrorMarker);

    this.editor = editor;
    this.messages = messages;
    this.markers = [];
    this.mark();
  }

  _createClass(ErrorMarker, [{
    key: 'mark',
    value: function mark() {
      var _this = this;

      this.markers = _lodash2['default'].map(_lodash2['default'].groupBy(this.messages, 'range'), function (messages) {
        var type = _logger2['default'].getMostSevereType(messages);
        var marker = _this.editor.markBufferRange(messages[0].range, { invalidate: 'touch' });
        _this.editor.decorateMarker(marker, { type: 'line-number', 'class': 'latex-' + type });
        return marker;
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var marker of this.markers) {
        marker.destroy();
      }
    }
  }]);

  return ErrorMarker;
})();

exports['default'] = ErrorMarker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvZXJyb3ItbWFya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNILFVBQVU7Ozs7SUFFUixXQUFXO0FBQ2xCLFdBRE8sV0FBVyxDQUNqQixNQUFNLEVBQUUsUUFBUSxFQUFFOzBCQURaLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtHQUNaOztlQU5rQixXQUFXOztXQVF6QixnQkFBRzs7O0FBQ04sVUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBRSxHQUFHLENBQUMsb0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBQSxRQUFRLEVBQUk7QUFDbEUsWUFBTSxJQUFJLEdBQUcsb0JBQU8saUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0MsWUFBTSxNQUFNLEdBQUcsTUFBSyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtBQUNwRixjQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxvQkFBZ0IsSUFBSSxBQUFFLEVBQUMsQ0FBQyxDQUFBO0FBQ2pGLGVBQU8sTUFBTSxDQUFBO09BQ2QsQ0FBQyxDQUFBO0tBQ0g7OztXQUVLLGlCQUFHO0FBQ1AsV0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQy9CLGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNqQjtLQUNGOzs7U0FyQmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvZXJyb3ItbWFya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvck1hcmtlciB7XG4gIGNvbnN0cnVjdG9yIChlZGl0b3IsIG1lc3NhZ2VzKSB7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB0aGlzLm1hcmtlcnMgPSBbXVxuICAgIHRoaXMubWFyaygpXG4gIH1cblxuICBtYXJrICgpIHtcbiAgICB0aGlzLm1hcmtlcnMgPSBfLm1hcChfLmdyb3VwQnkodGhpcy5tZXNzYWdlcywgJ3JhbmdlJyksIG1lc3NhZ2VzID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBMb2dnZXIuZ2V0TW9zdFNldmVyZVR5cGUobWVzc2FnZXMpXG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UobWVzc2FnZXNbMF0ucmFuZ2UsIHtpbnZhbGlkYXRlOiAndG91Y2gnfSlcbiAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiBgbGF0ZXgtJHt0eXBlfWB9KVxuICAgICAgcmV0dXJuIG1hcmtlclxuICAgIH0pXG4gIH1cblxuICBjbGVhciAoKSB7XG4gICAgZm9yIChsZXQgbWFya2VyIG9mIHRoaXMubWFya2Vycykge1xuICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxufVxuIl19