Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _atom = require('atom');

var _werkzeug = require('./werkzeug');

var _viewsLogDock = require('./views/log-dock');

var _viewsLogDock2 = _interopRequireDefault(_viewsLogDock);

var Logger = (function (_Disposable) {
  _inherits(Logger, _Disposable);

  function Logger() {
    var _this2 = this;

    _classCallCheck(this, Logger);

    _get(Object.getPrototypeOf(Logger.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.disposables = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    var _this = this;

    this.loggingLevel = atom.config.get('latex.loggingLevel');
    this.disposables.add(atom.config.onDidChange('latex.loggingLevel', function () {
      _this2.loggingLevel = atom.config.get('latex.loggingLevel');
      _this2.refresh();
    }));
    this.disposables.add(this.emitter);
    this.disposables.add(atom.workspace.addOpener(function (uri) {
      if (uri === _viewsLogDock2['default'].LOG_DOCK_URI) {
        return new _viewsLogDock2['default']();
      }
    }));

    this.messages = [];
  }

  _createClass(Logger, [{
    key: 'onMessages',
    value: function onMessages(callback) {
      return this.emitter.on('messages', callback);
    }
  }, {
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
      this.messages.push(message);
      if (this.messageTypeIsVisible(message.type)) {
        this.emitter.emit('messages', [message], false);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.messages = [];
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.emitter.emit('messages', this.getMessages(), true);
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      var _this3 = this;

      var useFilters = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      return useFilters ? this.messages.filter(function (message) {
        return _this3.messageTypeIsVisible(message.type);
      }) : this.messages;
    }
  }, {
    key: 'setMessages',
    value: function setMessages(messages) {
      this.messages = messages;
      this.emitter.emit('messages', messages, true);
    }
  }, {
    key: 'messageTypeIsVisible',
    value: function messageTypeIsVisible(type) {
      return type === 'error' || this.loggingLevel !== 'error' && type === 'warning' || this.loggingLevel === 'info' && type === 'info';
    }
  }, {
    key: 'sync',
    value: _asyncToGenerator(function* () {
      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails.filePath;
      var position = _getEditorDetails.position;

      if (filePath) {
        var logDock = yield this.show();
        if (logDock) {
          logDock.update({ filePath: filePath, position: position });
        }
      }
    })
  }, {
    key: 'toggle',
    value: _asyncToGenerator(function* () {
      return atom.workspace.toggle(_viewsLogDock2['default'].LOG_DOCK_URI);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      return atom.workspace.open(_viewsLogDock2['default'].LOG_DOCK_URI);
    })
  }, {
    key: 'hide',
    value: _asyncToGenerator(function* () {
      return atom.workspace.hide(_viewsLogDock2['default'].LOG_DOCK_URI);
    })
  }]);

  return Logger;
})(_atom.Disposable);

exports['default'] = Logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O29CQUNtQyxNQUFNOzt3QkFDOUIsWUFBWTs7NEJBQ3pCLGtCQUFrQjs7OztJQUVqQixNQUFNO1lBQU4sTUFBTTs7QUFJYixXQUpPLE1BQU0sR0FJVjs7OzBCQUpJLE1BQU07O0FBS3ZCLCtCQUxpQixNQUFNLDZDQUtqQjthQUFNLE1BQUssV0FBVyxDQUFDLE9BQU8sRUFBRTtLQUFBLEVBQUM7U0FKekMsV0FBVyxHQUFHLCtCQUF5QjtTQUN2QyxPQUFPLEdBQUcsbUJBQWE7Ozs7QUFJckIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQ3pELFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLFlBQU07QUFDdkUsYUFBSyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUN6RCxhQUFLLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDbEMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDbkQsVUFBSSxHQUFHLEtBQUssMEJBQVEsWUFBWSxFQUFFO0FBQ2hDLGVBQU8sK0JBQWEsQ0FBQTtPQUNyQjtLQUNGLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0dBQ25COztlQW5Ca0IsTUFBTTs7V0FxQmQsb0JBQUMsUUFBUSxFQUFFO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzdDOzs7V0FFSyxlQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDL0MsVUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtLQUM5RTs7O1dBRU8saUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqRCxVQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQ2hGOzs7V0FFSSxjQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDOUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtLQUM3RTs7O1dBRVcscUJBQUMsT0FBTyxFQUFFO0FBQ3BCLGFBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLG9CQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzNCLFVBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQyxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtPQUNoRDtLQUNGOzs7V0FFSyxpQkFBRztBQUNQLFVBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDeEQ7OztXQUVXLHVCQUFvQjs7O1VBQW5CLFVBQVUseURBQUcsSUFBSTs7QUFDNUIsYUFBTyxVQUFVLEdBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQSxPQUFPO2VBQUksT0FBSyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO09BQUEsQ0FBQyxHQUN4RSxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ2xCOzs7V0FFVyxxQkFBQyxRQUFRLEVBQUU7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUM5Qzs7O1dBRW9CLDhCQUFDLElBQUksRUFBRTtBQUMxQixhQUFPLElBQUksS0FBSyxPQUFPLElBQ3BCLElBQUksQ0FBQyxZQUFZLEtBQUssT0FBTyxJQUFJLElBQUksS0FBSyxTQUFTLEFBQUMsSUFDcEQsSUFBSSxDQUFDLFlBQVksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLE1BQU0sQUFBQyxDQUFBO0tBQ3BEOzs7NkJBRVUsYUFBRzs4QkFDbUIsaUNBQWtCOztVQUF6QyxRQUFRLHFCQUFSLFFBQVE7VUFBRSxRQUFRLHFCQUFSLFFBQVE7O0FBQzFCLFVBQUksUUFBUSxFQUFFO0FBQ1osWUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakMsWUFBSSxPQUFPLEVBQUU7QUFDWCxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDdkM7T0FDRjtLQUNGOzs7NkJBRVksYUFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsMEJBQVEsWUFBWSxDQUFDLENBQUE7S0FDbkQ7Ozs2QkFFVSxhQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQywwQkFBUSxZQUFZLENBQUMsQ0FBQTtLQUNqRDs7OzZCQUVVLGFBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDBCQUFRLFlBQVksQ0FBQyxDQUFBO0tBQ2pEOzs7U0EzRmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGdldEVkaXRvckRldGFpbHMgfSBmcm9tICcuL3dlcmt6ZXVnJ1xuaW1wb3J0IExvZ0RvY2sgZnJvbSAnLi92aWV3cy9sb2ctZG9jaydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmxvZ2dpbmdMZXZlbCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgubG9nZ2luZ0xldmVsJylcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgubG9nZ2luZ0xldmVsJywgKCkgPT4ge1xuICAgICAgdGhpcy5sb2dnaW5nTGV2ZWwgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmxvZ2dpbmdMZXZlbCcpXG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIodXJpID0+IHtcbiAgICAgIGlmICh1cmkgPT09IExvZ0RvY2suTE9HX0RPQ0tfVVJJKSB7XG4gICAgICAgIHJldHVybiBuZXcgTG9nRG9jaygpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgfVxuXG4gIG9uTWVzc2FnZXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIGVycm9yICh0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlKSB7XG4gICAgdGhpcy5zaG93TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UgfSlcbiAgfVxuXG4gIHdhcm5pbmcgKHRleHQsIGZpbGVQYXRoLCByYW5nZSwgbG9nUGF0aCwgbG9nUmFuZ2UpIHtcbiAgICB0aGlzLnNob3dNZXNzYWdlKHsgdHlwZTogJ3dhcm5pbmcnLCB0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlIH0pXG4gIH1cblxuICBpbmZvICh0ZXh0LCBmaWxlUGF0aCwgcmFuZ2UsIGxvZ1BhdGgsIGxvZ1JhbmdlKSB7XG4gICAgdGhpcy5zaG93TWVzc2FnZSh7IHR5cGU6ICdpbmZvJywgdGV4dCwgZmlsZVBhdGgsIHJhbmdlLCBsb2dQYXRoLCBsb2dSYW5nZSB9KVxuICB9XG5cbiAgc2hvd01lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlID0gT2JqZWN0LmFzc2lnbih7IHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9LCBfLnBpY2tCeShtZXNzYWdlKSlcbiAgICB0aGlzLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICBpZiAodGhpcy5tZXNzYWdlVHlwZUlzVmlzaWJsZShtZXNzYWdlLnR5cGUpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbWVzc2FnZXMnLCBbbWVzc2FnZV0sIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyICgpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG5cbiAgcmVmcmVzaCAoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ21lc3NhZ2VzJywgdGhpcy5nZXRNZXNzYWdlcygpLCB0cnVlKVxuICB9XG5cbiAgZ2V0TWVzc2FnZXMgKHVzZUZpbHRlcnMgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHVzZUZpbHRlcnNcbiAgICAgID8gdGhpcy5tZXNzYWdlcy5maWx0ZXIobWVzc2FnZSA9PiB0aGlzLm1lc3NhZ2VUeXBlSXNWaXNpYmxlKG1lc3NhZ2UudHlwZSkpXG4gICAgICA6IHRoaXMubWVzc2FnZXNcbiAgfVxuXG4gIHNldE1lc3NhZ2VzIChtZXNzYWdlcykge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdtZXNzYWdlcycsIG1lc3NhZ2VzLCB0cnVlKVxuICB9XG5cbiAgbWVzc2FnZVR5cGVJc1Zpc2libGUgKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Vycm9yJyB8fFxuICAgICAgKHRoaXMubG9nZ2luZ0xldmVsICE9PSAnZXJyb3InICYmIHR5cGUgPT09ICd3YXJuaW5nJykgfHxcbiAgICAgICh0aGlzLmxvZ2dpbmdMZXZlbCA9PT0gJ2luZm8nICYmIHR5cGUgPT09ICdpbmZvJylcbiAgfVxuXG4gIGFzeW5jIHN5bmMgKCkge1xuICAgIGNvbnN0IHsgZmlsZVBhdGgsIHBvc2l0aW9uIH0gPSBnZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGxvZ0RvY2sgPSBhd2FpdCB0aGlzLnNob3coKVxuICAgICAgaWYgKGxvZ0RvY2spIHtcbiAgICAgICAgbG9nRG9jay51cGRhdGUoeyBmaWxlUGF0aCwgcG9zaXRpb24gfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyB0b2dnbGUgKCkge1xuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS50b2dnbGUoTG9nRG9jay5MT0dfRE9DS19VUkkpXG4gIH1cblxuICBhc3luYyBzaG93ICgpIHtcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihMb2dEb2NrLkxPR19ET0NLX1VSSSlcbiAgfVxuXG4gIGFzeW5jIGhpZGUgKCkge1xuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5oaWRlKExvZ0RvY2suTE9HX0RPQ0tfVVJJKVxuICB9XG59XG4iXX0=