Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _viewsLogPanel = require('../views/log-panel');

var _viewsLogPanel2 = _interopRequireDefault(_viewsLogPanel);

var _errorMarker = require('../error-marker');

var _errorMarker2 = _interopRequireDefault(_errorMarker);

var _werkzeug = require('../werkzeug');

var DefaultLogger = (function (_Logger) {
  _inherits(DefaultLogger, _Logger);

  function DefaultLogger() {
    _classCallCheck(this, DefaultLogger);

    _get(Object.getPrototypeOf(DefaultLogger.prototype), 'constructor', this).call(this);
    this.logPanel = new _viewsLogPanel2['default']();
    this.viewProvider = atom.views.addViewProvider(DefaultLogger, function (model) {
      return model.logPanel.element;
    });
    this.view = atom.workspace.addBottomPanel({
      item: this,
      visible: false
    });
  }

  _createClass(DefaultLogger, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyErrorMarkers();
      this.viewProvider.dispose();
      this.view.destroy();
    }
  }, {
    key: 'showMessages',
    value: function showMessages(label, messages) {
      this.logPanel.update({ messages: messages });
      this.showErrorMarkers(messages);
      this.initializeStatus(messages);
    }
  }, {
    key: 'initializeStatus',
    value: function initializeStatus(messages) {
      this.type = _logger2['default'].getMostSevereType(messages);
      this.updateStatus();
    }
  }, {
    key: 'updateStatus',
    value: function updateStatus() {
      var _this = this;

      var icon = this.view.isVisible() ? 'chevron-down' : 'chevron-up';
      latex.status.show('LaTeX Log', this.type, icon, false, 'Click to toggle LaTeX log.', function () {
        return _this.toggle();
      });
    }
  }, {
    key: 'showErrorMarkers',
    value: function showErrorMarkers(messages) {
      var editors = atom.workspace.getTextEditors();

      this.destroyErrorMarkers();

      for (var editor of editors) {
        this.showErrorMarkersInEditor(editor, messages);
      }
    }
  }, {
    key: 'showErrorMarkersInEditor',
    value: function showErrorMarkersInEditor(editor, messages) {
      var filePath = editor.getPath();
      if (filePath) {
        var marker = messages.filter(function (message) {
          return message.filePath && message.range && filePath.includes(message.filePath);
        });
        if (marker.length) this.addErrorMarker(editor, marker);
      }
    }
  }, {
    key: 'addErrorMarker',
    value: function addErrorMarker(editor, messages) {
      this.errorMarkers.push(new _errorMarker2['default'](editor, messages));
    }
  }, {
    key: 'show',
    value: function show() {
      if (!this.view.isVisible()) {
        this.view.show();
        this.updateStatus();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.view.isVisible()) {
        this.view.hide();
        this.updateStatus();
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.view.isVisible()) {
        this.view.hide();
      } else {
        this.view.show();
      }
      this.updateStatus();
    }
  }, {
    key: 'sync',
    value: function sync() {
      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails.filePath;
      var position = _getEditorDetails.position;

      if (filePath) {
        this.show();
        this.logPanel.update({ filePath: filePath, position: position });
      }
    }
  }, {
    key: 'destroyErrorMarkers',
    value: function destroyErrorMarkers() {
      if (this.errorMarkers) {
        for (var errorMarker of this.errorMarkers) {
          errorMarker.clear();
        }
      }
      this.errorMarkers = [];
    }
  }]);

  return DefaultLogger;
})(_logger2['default']);

exports['default'] = DefaultLogger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2Vycy9kZWZhdWx0LWxvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixXQUFXOzs7OzZCQUNULG9CQUFvQjs7OzsyQkFDakIsaUJBQWlCOzs7O3dCQUNSLGFBQWE7O0lBRXpCLGFBQWE7WUFBYixhQUFhOztBQUNwQixXQURPLGFBQWEsR0FDakI7MEJBREksYUFBYTs7QUFFOUIsK0JBRmlCLGFBQWEsNkNBRXZCO0FBQ1AsUUFBSSxDQUFDLFFBQVEsR0FBRyxnQ0FBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUMxRCxVQUFBLEtBQUs7YUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU87S0FBQSxDQUFDLENBQUE7QUFDbEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUN4QyxVQUFJLEVBQUUsSUFBSTtBQUNWLGFBQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFBO0dBQ0g7O2VBVmtCLGFBQWE7O1dBWXhCLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDMUIsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3BCOzs7V0FFWSxzQkFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDNUMsVUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQy9CLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNoQzs7O1dBRWdCLDBCQUFDLFFBQVEsRUFBRTtBQUMxQixVQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFPLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzlDLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtLQUNwQjs7O1dBRVksd0JBQUc7OztBQUNkLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsY0FBYyxHQUFHLFlBQVksQ0FBQTtBQUNsRSxXQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLDRCQUE0QixFQUFFO2VBQU0sTUFBSyxNQUFNLEVBQUU7T0FBQSxDQUFDLENBQUE7S0FDMUc7OztXQUVnQiwwQkFBQyxRQUFRLEVBQUU7QUFDMUIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTs7QUFFL0MsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7O0FBRTFCLFdBQUssSUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQzVCLFlBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDaEQ7S0FDRjs7O1dBRXdCLGtDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDMUMsVUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2pDLFVBQUksUUFBUSxFQUFFO0FBQ1osWUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU87aUJBQ3BDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FBQSxDQUFDLENBQUE7QUFDM0UsWUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ3ZEO0tBQ0Y7OztXQUVjLHdCQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDaEMsVUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsNkJBQWdCLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0tBQzFEOzs7V0FFSSxnQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQzFCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDaEIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO09BQ3BCO0tBQ0Y7OztXQUVJLGdCQUFHO0FBQ04sVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDaEIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO09BQ3BCO0tBQ0Y7OztXQUVNLGtCQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDakIsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDakI7QUFDRCxVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDcEI7OztXQUVJLGdCQUFHOzhCQUN5QixpQ0FBa0I7O1VBQXpDLFFBQVEscUJBQVIsUUFBUTtVQUFFLFFBQVEscUJBQVIsUUFBUTs7QUFDMUIsVUFBSSxRQUFRLEVBQUU7QUFDWixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDWCxZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7T0FDN0M7S0FDRjs7O1dBRW1CLCtCQUFHO0FBQ3JCLFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixhQUFLLElBQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDM0MscUJBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtTQUNwQjtPQUNGO0FBQ0QsVUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUE7S0FDdkI7OztTQS9Ga0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sb2dnZXJzL2RlZmF1bHQtbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2xvZ2dlcidcbmltcG9ydCBMb2dQYW5lbCBmcm9tICcuLi92aWV3cy9sb2ctcGFuZWwnXG5pbXBvcnQgRXJyb3JNYXJrZXIgZnJvbSAnLi4vZXJyb3ItbWFya2VyJ1xuaW1wb3J0IHsgZ2V0RWRpdG9yRGV0YWlscyB9IGZyb20gJy4uL3dlcmt6ZXVnJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZhdWx0TG9nZ2VyIGV4dGVuZHMgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmxvZ1BhbmVsID0gbmV3IExvZ1BhbmVsKClcbiAgICB0aGlzLnZpZXdQcm92aWRlciA9IGF0b20udmlld3MuYWRkVmlld1Byb3ZpZGVyKERlZmF1bHRMb2dnZXIsXG4gICAgICBtb2RlbCA9PiBtb2RlbC5sb2dQYW5lbC5lbGVtZW50KVxuICAgIHRoaXMudmlldyA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXMsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRlc3Ryb3lFcnJvck1hcmtlcnMoKVxuICAgIHRoaXMudmlld1Byb3ZpZGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMudmlldy5kZXN0cm95KClcbiAgfVxuXG4gIHNob3dNZXNzYWdlcyAobGFiZWwsIG1lc3NhZ2VzKSB7XG4gICAgdGhpcy5sb2dQYW5lbC51cGRhdGUoeyBtZXNzYWdlczogbWVzc2FnZXMgfSlcbiAgICB0aGlzLnNob3dFcnJvck1hcmtlcnMobWVzc2FnZXMpXG4gICAgdGhpcy5pbml0aWFsaXplU3RhdHVzKG1lc3NhZ2VzKVxuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXR1cyAobWVzc2FnZXMpIHtcbiAgICB0aGlzLnR5cGUgPSBMb2dnZXIuZ2V0TW9zdFNldmVyZVR5cGUobWVzc2FnZXMpXG4gICAgdGhpcy51cGRhdGVTdGF0dXMoKVxuICB9XG5cbiAgdXBkYXRlU3RhdHVzICgpIHtcbiAgICBjb25zdCBpY29uID0gdGhpcy52aWV3LmlzVmlzaWJsZSgpID8gJ2NoZXZyb24tZG93bicgOiAnY2hldnJvbi11cCdcbiAgICBsYXRleC5zdGF0dXMuc2hvdygnTGFUZVggTG9nJywgdGhpcy50eXBlLCBpY29uLCBmYWxzZSwgJ0NsaWNrIHRvIHRvZ2dsZSBMYVRlWCBsb2cuJywgKCkgPT4gdGhpcy50b2dnbGUoKSlcbiAgfVxuXG4gIHNob3dFcnJvck1hcmtlcnMgKG1lc3NhZ2VzKSB7XG4gICAgY29uc3QgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgIHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpXG5cbiAgICBmb3IgKGNvbnN0IGVkaXRvciBvZiBlZGl0b3JzKSB7XG4gICAgICB0aGlzLnNob3dFcnJvck1hcmtlcnNJbkVkaXRvcihlZGl0b3IsIG1lc3NhZ2VzKVxuICAgIH1cbiAgfVxuXG4gIHNob3dFcnJvck1hcmtlcnNJbkVkaXRvciAoZWRpdG9yLCBtZXNzYWdlcykge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgY29uc3QgbWFya2VyID0gbWVzc2FnZXMuZmlsdGVyKG1lc3NhZ2UgPT5cbiAgICAgICAgbWVzc2FnZS5maWxlUGF0aCAmJiBtZXNzYWdlLnJhbmdlICYmIGZpbGVQYXRoLmluY2x1ZGVzKG1lc3NhZ2UuZmlsZVBhdGgpKVxuICAgICAgaWYgKG1hcmtlci5sZW5ndGgpIHRoaXMuYWRkRXJyb3JNYXJrZXIoZWRpdG9yLCBtYXJrZXIpXG4gICAgfVxuICB9XG5cbiAgYWRkRXJyb3JNYXJrZXIgKGVkaXRvciwgbWVzc2FnZXMpIHtcbiAgICB0aGlzLmVycm9yTWFya2Vycy5wdXNoKG5ldyBFcnJvck1hcmtlcihlZGl0b3IsIG1lc3NhZ2VzKSlcbiAgfVxuXG4gIHNob3cgKCkge1xuICAgIGlmICghdGhpcy52aWV3LmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLnZpZXcuc2hvdygpXG4gICAgICB0aGlzLnVwZGF0ZVN0YXR1cygpXG4gICAgfVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgaWYgKHRoaXMudmlldy5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy52aWV3LmhpZGUoKVxuICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZSAoKSB7XG4gICAgaWYgKHRoaXMudmlldy5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy52aWV3LmhpZGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcuc2hvdygpXG4gICAgfVxuICAgIHRoaXMudXBkYXRlU3RhdHVzKClcbiAgfVxuXG4gIHN5bmMgKCkge1xuICAgIGNvbnN0IHsgZmlsZVBhdGgsIHBvc2l0aW9uIH0gPSBnZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIHRoaXMuc2hvdygpXG4gICAgICB0aGlzLmxvZ1BhbmVsLnVwZGF0ZSh7IGZpbGVQYXRoLCBwb3NpdGlvbiB9KVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lFcnJvck1hcmtlcnMgKCkge1xuICAgIGlmICh0aGlzLmVycm9yTWFya2Vycykge1xuICAgICAgZm9yIChjb25zdCBlcnJvck1hcmtlciBvZiB0aGlzLmVycm9yTWFya2Vycykge1xuICAgICAgICBlcnJvck1hcmtlci5jbGVhcigpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZXJyb3JNYXJrZXJzID0gW11cbiAgfVxufVxuIl19