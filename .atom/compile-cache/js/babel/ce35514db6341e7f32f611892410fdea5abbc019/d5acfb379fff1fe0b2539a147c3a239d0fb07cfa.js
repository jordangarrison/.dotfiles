Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);

    this.messages = [];
    this._group = null;
  }

  _createClass(Logger, [{
    key: 'error',
    value: function error(text, filePath, range, logPath, logRange) {
      this.showMessage({ type: 'error', text: text, filePath: filePath, range: range, logPath: logPath, logRange: logRange });
    }
  }, {
    key: 'warning',
    value: function warning(text, filePath, range, logPath, logRange) {
      this.showMessage({ type: 'warning', text: text, filePath: filePath, range: range, logPath: logPath, logRange: logRange });
    }
  }, {
    key: 'info',
    value: function info(text, filePath, range, logPath, logRange) {
      this.showMessage({ type: 'info', text: text, filePath: filePath, range: range, logPath: logPath, logRange: logRange });
    }
  }, {
    key: 'showMessage',
    value: function showMessage(message) {
      message = Object.assign({ timestamp: Date.now() }, _lodash2['default'].pickBy(message));
      if (this._group) {
        this._group.push(message);
      } else {
        this._label = 'LaTeX Message';
        this._group = [message];
        this.groupEnd();
      }
    }
  }, {
    key: 'group',
    value: function group(label) {
      this._label = label;
      this._group = [];
    }
  }, {
    key: 'groupEnd',
    value: function groupEnd() {
      this.messages = _lodash2['default'].sortBy(this._group, 'filePath', function (message) {
        return message.range || [[-1, -1], [-1, -1]];
      }, 'type', 'timestamp');
      this._group = null;
      this.showFilteredMessages();
    }
  }, {
    key: 'showFilteredMessages',
    value: function showFilteredMessages() {
      var loggingLevel = atom.config.get('latex.loggingLevel');
      var showBuildWarning = loggingLevel !== 'error';
      var showBuildInfo = loggingLevel === 'info';
      var filteredMessages = this.messages.filter(function (message) {
        return message.type === 'error' || showBuildWarning && message.type === 'warning' || showBuildInfo && message.type === 'info';
      });

      this.showMessages(this._label, filteredMessages);
    }
  }, {
    key: 'showMessages',
    value: function showMessages() /* label, messages */{}
  }, {
    key: 'sync',
    value: function sync() {}
  }, {
    key: 'toggle',
    value: function toggle() {}
  }, {
    key: 'show',
    value: function show() {}
  }, {
    key: 'hide',
    value: function hide() {}
  }], [{
    key: 'getMostSevereType',
    value: function getMostSevereType(messages) {
      return messages.reduce(function (type, message) {
        if (type === 'error' || message.type === 'error') return 'error';
        if (type === 'warning' || message.type === 'warning') return 'warning';
        return 'info';
      }, undefined);
    }
  }]);

  return Logger;
})();

exports['default'] = Logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O0lBRUQsTUFBTTtBQUNiLFdBRE8sTUFBTSxHQUNWOzBCQURJLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0dBQ25COztlQUprQixNQUFNOztXQU1uQixlQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDL0MsVUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtLQUM5RTs7O1dBRU8saUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqRCxVQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQ2hGOzs7V0FFSSxjQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDOUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtLQUM3RTs7O1dBRVcscUJBQUMsT0FBTyxFQUFFO0FBQ3BCLGFBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLG9CQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO09BQzFCLE1BQU07QUFDTCxZQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQTtBQUM3QixZQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDdkIsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO09BQ2hCO0tBQ0Y7OztXQUVLLGVBQUMsS0FBSyxFQUFFO0FBQ1osVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7S0FDakI7OztXQUVRLG9CQUFHO0FBQ1YsVUFBSSxDQUFDLFFBQVEsR0FBRyxvQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBQSxPQUFPLEVBQUk7QUFBRSxlQUFPLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNuSSxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixVQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtLQUM1Qjs7O1dBRW9CLGdDQUFHO0FBQ3RCLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDMUQsVUFBTSxnQkFBZ0IsR0FBRyxZQUFZLEtBQUssT0FBTyxDQUFBO0FBQ2pELFVBQU0sYUFBYSxHQUFHLFlBQVksS0FBSyxNQUFNLENBQUE7QUFDN0MsVUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU87ZUFDbkQsT0FBTyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUssZ0JBQWdCLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLEFBQUMsSUFBSyxhQUFhLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEFBQUM7T0FBQSxDQUFDLENBQUE7O0FBRTdILFVBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0tBQ2pEOzs7V0FVWSw2Q0FBd0IsRUFBRTs7O1dBQ2xDLGdCQUFHLEVBQUU7OztXQUNILGtCQUFHLEVBQUU7OztXQUNQLGdCQUFHLEVBQUU7OztXQUNMLGdCQUFHLEVBQUU7OztXQVplLDJCQUFDLFFBQVEsRUFBRTtBQUNsQyxhQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFLO0FBQ3hDLFlBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxPQUFPLE9BQU8sQ0FBQTtBQUNoRSxZQUFJLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsT0FBTyxTQUFTLENBQUE7QUFDdEUsZUFBTyxNQUFNLENBQUE7T0FDZCxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQ2Q7OztTQXhEa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuX2dyb3VwID0gbnVsbFxuICB9XG5cbiAgZXJyb3IgKHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UpIHtcbiAgICB0aGlzLnNob3dNZXNzYWdlKHsgdHlwZTogJ2Vycm9yJywgdGV4dCwgZmlsZVBhdGgsIHJhbmdlLCBsb2dQYXRoLCBsb2dSYW5nZSB9KVxuICB9XG5cbiAgd2FybmluZyAodGV4dCwgZmlsZVBhdGgsIHJhbmdlLCBsb2dQYXRoLCBsb2dSYW5nZSkge1xuICAgIHRoaXMuc2hvd01lc3NhZ2UoeyB0eXBlOiAnd2FybmluZycsIHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UgfSlcbiAgfVxuXG4gIGluZm8gKHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UpIHtcbiAgICB0aGlzLnNob3dNZXNzYWdlKHsgdHlwZTogJ2luZm8nLCB0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlIH0pXG4gIH1cblxuICBzaG93TWVzc2FnZSAobWVzc2FnZSkge1xuICAgIG1lc3NhZ2UgPSBPYmplY3QuYXNzaWduKHsgdGltZXN0YW1wOiBEYXRlLm5vdygpIH0sIF8ucGlja0J5KG1lc3NhZ2UpKVxuICAgIGlmICh0aGlzLl9ncm91cCkge1xuICAgICAgdGhpcy5fZ3JvdXAucHVzaChtZXNzYWdlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sYWJlbCA9ICdMYVRlWCBNZXNzYWdlJ1xuICAgICAgdGhpcy5fZ3JvdXAgPSBbbWVzc2FnZV1cbiAgICAgIHRoaXMuZ3JvdXBFbmQoKVxuICAgIH1cbiAgfVxuXG4gIGdyb3VwIChsYWJlbCkge1xuICAgIHRoaXMuX2xhYmVsID0gbGFiZWxcbiAgICB0aGlzLl9ncm91cCA9IFtdXG4gIH1cblxuICBncm91cEVuZCAoKSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IF8uc29ydEJ5KHRoaXMuX2dyb3VwLCAnZmlsZVBhdGgnLCBtZXNzYWdlID0+IHsgcmV0dXJuIG1lc3NhZ2UucmFuZ2UgfHwgW1stMSwgLTFdLCBbLTEsIC0xXV0gfSwgJ3R5cGUnLCAndGltZXN0YW1wJylcbiAgICB0aGlzLl9ncm91cCA9IG51bGxcbiAgICB0aGlzLnNob3dGaWx0ZXJlZE1lc3NhZ2VzKClcbiAgfVxuXG4gIHNob3dGaWx0ZXJlZE1lc3NhZ2VzICgpIHtcbiAgICBjb25zdCBsb2dnaW5nTGV2ZWwgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmxvZ2dpbmdMZXZlbCcpXG4gICAgY29uc3Qgc2hvd0J1aWxkV2FybmluZyA9IGxvZ2dpbmdMZXZlbCAhPT0gJ2Vycm9yJ1xuICAgIGNvbnN0IHNob3dCdWlsZEluZm8gPSBsb2dnaW5nTGV2ZWwgPT09ICdpbmZvJ1xuICAgIGNvbnN0IGZpbHRlcmVkTWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzLmZpbHRlcihtZXNzYWdlID0+XG4gICAgICBtZXNzYWdlLnR5cGUgPT09ICdlcnJvcicgfHwgKHNob3dCdWlsZFdhcm5pbmcgJiYgbWVzc2FnZS50eXBlID09PSAnd2FybmluZycpIHx8IChzaG93QnVpbGRJbmZvICYmIG1lc3NhZ2UudHlwZSA9PT0gJ2luZm8nKSlcblxuICAgIHRoaXMuc2hvd01lc3NhZ2VzKHRoaXMuX2xhYmVsLCBmaWx0ZXJlZE1lc3NhZ2VzKVxuICB9XG5cbiAgc3RhdGljIGdldE1vc3RTZXZlcmVUeXBlIChtZXNzYWdlcykge1xuICAgIHJldHVybiBtZXNzYWdlcy5yZWR1Y2UoKHR5cGUsIG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmICh0eXBlID09PSAnZXJyb3InIHx8IG1lc3NhZ2UudHlwZSA9PT0gJ2Vycm9yJykgcmV0dXJuICdlcnJvcidcbiAgICAgIGlmICh0eXBlID09PSAnd2FybmluZycgfHwgbWVzc2FnZS50eXBlID09PSAnd2FybmluZycpIHJldHVybiAnd2FybmluZydcbiAgICAgIHJldHVybiAnaW5mbydcbiAgICB9LCB1bmRlZmluZWQpXG4gIH1cblxuICBzaG93TWVzc2FnZXMgKC8qIGxhYmVsLCBtZXNzYWdlcyAqLykge31cbiAgc3luYyAoKSB7fVxuICB0b2dnbGUgKCkge31cbiAgc2hvdyAoKSB7fVxuICBoaWRlICgpIHt9XG59XG4iXX0=