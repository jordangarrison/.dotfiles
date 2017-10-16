Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _logMessage = require('./log-message');

var _logMessage2 = _interopRequireDefault(_logMessage);

var LogPanel = (function () {
  function LogPanel() {
    var _this = this;

    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogPanel);

    this.messages = [];
    this.resizeZero = 0;
    this.height = 100;
    this.mouseMoveListener = function (e) {
      return _this.resize(e);
    };
    this.mouseUpListener = function (e) {
      return _this.stopResize(e);
    };

    this.setProperties(properties);
    _etch2['default'].initialize(this);
  }

  _createClass(LogPanel, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // max-height is used so the panel will collapse if possible.
      var style = 'max-height:' + this.height + 'px;';
      var content = this.messages.map(function (message) {
        return _etch2['default'].dom(_logMessage2['default'], { message: message, filePath: _this2.filePath, position: _this2.position });
      });
      if (!content.length) {
        content = _etch2['default'].dom(
          'div',
          null,
          'No LaTeX messages'
        );
      }

      return _etch2['default'].dom(
        'div',
        { className: 'tool-panel panel-bottom latex-log', tabindex: '-1' },
        _etch2['default'].dom('div', { className: 'panel-resize-handle', onmousedown: function (e) {
            return _this2.startResize(e);
          } }),
        _etch2['default'].dom(
          'div',
          { className: 'panel-body', ref: 'body', style: style },
          content
        )
      );
    }
  }, {
    key: 'setProperties',
    value: function setProperties(properties) {
      if (properties.messages) {
        this.messages = _lodash2['default'].sortBy(properties.messages, [function (message) {
          return message.range ? message.range[0][0] : -1;
        }, function (message) {
          return message.logRange ? message.logRange[0][0] : -1;
        }]);
      }
      this.filePath = properties.filePath;
      this.position = properties.position;
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.setProperties(properties);
      return _etch2['default'].update(this);
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      // Look for highlighted messages and scroll to them
      var highlighted = this.refs.body.getElementsByClassName('latex-highlight');
      if (highlighted.length) {
        highlighted[0].scrollIntoView();
      }
    }
  }, {
    key: 'startResize',
    value: function startResize(e) {
      this.resizeZero = e.clientY + this.refs.body.offsetHeight;
      this.refs.body.style.height = this.height + 'px';
      this.refs.body.style.maxHeight = '';
      document.addEventListener('mousemove', this.mouseMoveListener, true);
      document.addEventListener('mouseup', this.mouseUpListener, true);
    }
  }, {
    key: 'stopResize',
    value: function stopResize() {
      this.resizing = false;
      document.removeEventListener('mousemove', this.mouseMoveListener, true);
      document.removeEventListener('mouseup', this.mouseMoveUp, true);
    }
  }, {
    key: 'resize',
    value: function resize(e) {
      this.height = Math.max(this.resizeZero - e.clientY, 25);
      this.refs.body.style.height = this.height + 'px';
    }
  }]);

  return LogPanel;
})();

exports['default'] = LogPanel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztzQkFHYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7MEJBQ0EsZUFBZTs7OztJQUVqQixRQUFRO0FBQ2YsV0FETyxRQUFRLEdBQ0c7OztRQUFqQixVQUFVLHlEQUFHLEVBQUU7OzBCQURULFFBQVE7O0FBRXpCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBO0FBQ25CLFFBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFBLENBQUM7YUFBSSxNQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FBQSxDQUFBO0FBQzVDLFFBQUksQ0FBQyxlQUFlLEdBQUcsVUFBQSxDQUFDO2FBQUksTUFBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO0tBQUEsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUM5QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBVmtCLFFBQVE7OzZCQVliLGFBQUc7QUFDZixZQUFNLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRU0sa0JBQUc7Ozs7QUFFUixVQUFNLEtBQUssbUJBQWlCLElBQUksQ0FBQyxNQUFNLFFBQUssQ0FBQTtBQUM1QyxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87ZUFBSSxpREFBWSxPQUFPLEVBQUUsT0FBTyxBQUFDLEVBQUMsUUFBUSxFQUFFLE9BQUssUUFBUSxBQUFDLEVBQUMsUUFBUSxFQUFFLE9BQUssUUFBUSxBQUFDLEdBQUc7T0FBQSxDQUFDLENBQUE7QUFDOUgsVUFBSSxD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VUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxJQUFJLENBQUMsTUFBTSxPQUFJLENBQUE7S0FDakQ7OztTQXpFa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IExvZ01lc3NhZ2UgZnJvbSAnLi9sb2ctbWVzc2FnZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nUGFuZWwge1xuICBjb25zdHJ1Y3RvciAocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5yZXNpemVaZXJvID0gMFxuICAgIHRoaXMuaGVpZ2h0ID0gMTAwXG4gICAgdGhpcy5tb3VzZU1vdmVMaXN0ZW5lciA9IGUgPT4gdGhpcy5yZXNpemUoZSlcbiAgICB0aGlzLm1vdXNlVXBMaXN0ZW5lciA9IGUgPT4gdGhpcy5zdG9wUmVzaXplKGUpXG5cbiAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcGVydGllcylcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3kgKCkge1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICAvLyBtYXgtaGVpZ2h0IGlzIHVzZWQgc28gdGhlIHBhbmVsIHdpbGwgY29sbGFwc2UgaWYgcG9zc2libGUuXG4gICAgY29uc3Qgc3R5bGUgPSBgbWF4LWhlaWdodDoke3RoaXMuaGVpZ2h0fXB4O2BcbiAgICBsZXQgY29udGVudCA9IHRoaXMubWVzc2FnZXMubWFwKG1lc3NhZ2UgPT4gPExvZ01lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gZmlsZVBhdGg9e3RoaXMuZmlsZVBhdGh9IHBvc2l0aW9uPXt0aGlzLnBvc2l0aW9ufSAvPilcbiAgICBpZiAoIWNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBjb250ZW50ID0gPGRpdj5ObyBMYVRlWCBtZXNzYWdlczwvZGl2PlxuICAgIH1cblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0ndG9vbC1wYW5lbCBwYW5lbC1ib3R0b20gbGF0ZXgtbG9nJyB0YWJpbmRleD0nLTEnPlxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsLXJlc2l6ZS1oYW5kbGUnIG9ubW91c2Vkb3duPXtlID0+IHRoaXMuc3RhcnRSZXNpemUoZSl9IC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwtYm9keScgcmVmPSdib2R5JyBzdHlsZT17c3R5bGV9PlxuICAgICAgICB7Y29udGVudH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICB9XG5cbiAgc2V0UHJvcGVydGllcyAocHJvcGVydGllcykge1xuICAgIGlmIChwcm9wZXJ0aWVzLm1lc3NhZ2VzKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gXy5zb3J0QnkocHJvcGVydGllcy5tZXNzYWdlcywgW1xuICAgICAgICBtZXNzYWdlID0+IG1lc3NhZ2UucmFuZ2UgPyBtZXNzYWdlLnJhbmdlWzBdWzBdIDogLTEsXG4gICAgICAgIG1lc3NhZ2UgPT4gbWVzc2FnZS5sb2dSYW5nZSA/IG1lc3NhZ2UubG9nUmFuZ2VbMF1bMF0gOiAtMVxuICAgICAgXSlcbiAgICB9XG4gICAgdGhpcy5maWxlUGF0aCA9IHByb3BlcnRpZXMuZmlsZVBhdGhcbiAgICB0aGlzLnBvc2l0aW9uID0gcHJvcGVydGllcy5wb3NpdGlvblxuICB9XG5cbiAgdXBkYXRlIChwcm9wZXJ0aWVzKSB7XG4gICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZWFkQWZ0ZXJVcGRhdGUgKCkge1xuICAgIC8vIExvb2sgZm9yIGhpZ2hsaWdodGVkIG1lc3NhZ2VzIGFuZCBzY3JvbGwgdG8gdGhlbVxuICAgIGNvbnN0IGhpZ2hsaWdodGVkID0gdGhpcy5yZWZzLmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGF0ZXgtaGlnaGxpZ2h0JylcbiAgICBpZiAoaGlnaGxpZ2h0ZWQubGVuZ3RoKSB7XG4gICAgICBoaWdobGlnaHRlZFswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgfVxuICB9XG5cbiAgc3RhcnRSZXNpemUgKGUpIHtcbiAgICB0aGlzLnJlc2l6ZVplcm8gPSBlLmNsaWVudFkgKyB0aGlzLnJlZnMuYm9keS5vZmZzZXRIZWlnaHRcbiAgICB0aGlzLnJlZnMuYm9keS5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmhlaWdodH1weGBcbiAgICB0aGlzLnJlZnMuYm9keS5zdHlsZS5tYXhIZWlnaHQgPSAnJ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIsIHRydWUpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VVcExpc3RlbmVyLCB0cnVlKVxuICB9XG5cbiAgc3RvcFJlc2l6ZSAoKSB7XG4gICAgdGhpcy5yZXNpemluZyA9IGZhbHNlXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZU1vdmVMaXN0ZW5lciwgdHJ1ZSlcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZU1vdmVVcCwgdHJ1ZSlcbiAgfVxuXG4gIHJlc2l6ZSAoZSkge1xuICAgIHRoaXMuaGVpZ2h0ID0gTWF0aC5tYXgodGhpcy5yZXNpemVaZXJvIC0gZS5jbGllbnRZLCAyNSlcbiAgICB0aGlzLnJlZnMuYm9keS5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmhlaWdodH1weGBcbiAgfVxufVxuIl19