Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _composer = require('./composer');

var _composer2 = _interopRequireDefault(_composer);

var _openerRegistry = require('./opener-registry');

var _openerRegistry2 = _interopRequireDefault(_openerRegistry);

var _processManager = require('./process-manager');

var _processManager2 = _interopRequireDefault(_processManager);

var _statusIndicator = require('./status-indicator');

var _statusIndicator2 = _interopRequireDefault(_statusIndicator);

var _builderRegistry = require('./builder-registry');

var _builderRegistry2 = _interopRequireDefault(_builderRegistry);

var _atom = require('atom');

function defineDefaultProperty(target, property) {
  var shadowProperty = '__' + property;
  var defaultGetter = 'getDefault' + _lodash2['default'].capitalize(property);

  Object.defineProperty(target, property, {
    get: function get() {
      if (!target[shadowProperty]) {
        target[shadowProperty] = target[defaultGetter].apply(target);
      }
      return target[shadowProperty];
    },

    set: function set(value) {
      target[shadowProperty] = value;
    }
  });
}

function defineImmutableProperty(obj, name, value) {
  if (_atom.Disposable.isDisposable(value)) {
    obj.disposables.add(value);
  }
  Object.defineProperty(obj, name, { value: value });
}

var Latex = (function (_Disposable) {
  _inherits(Latex, _Disposable);

  function Latex() {
    _classCallCheck(this, Latex);

    _get(Object.getPrototypeOf(Latex.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.disposables = new _atom.CompositeDisposable();

    var _this = this;

    this.createLogProxy();
    defineDefaultProperty(this, 'logger');

    defineImmutableProperty(this, 'builderRegistry', new _builderRegistry2['default']());
    defineImmutableProperty(this, 'composer', new _composer2['default']());
    defineImmutableProperty(this, 'opener', new _openerRegistry2['default']());
    defineImmutableProperty(this, 'process', new _processManager2['default']());
    defineImmutableProperty(this, 'status', new _statusIndicator2['default']());
  }

  _createClass(Latex, [{
    key: 'getLogger',
    value: function getLogger() {
      return this.logger;
    }
  }, {
    key: 'setLogger',
    value: function setLogger(logger) {
      this.logger = logger;
    }
  }, {
    key: 'getDefaultLogger',
    value: function getDefaultLogger() {
      var DefaultLogger = require('./loggers/default-logger');
      return new DefaultLogger();
    }
  }, {
    key: 'createLogProxy',
    value: function createLogProxy() {
      var _this2 = this;

      this.log = {
        error: function error() {
          var _logger;

          (_logger = _this2.logger).error.apply(_logger, arguments);
        },
        warning: function warning() {
          var _logger2;

          (_logger2 = _this2.logger).warning.apply(_logger2, arguments);
        },
        info: function info() {
          var _logger3;

          (_logger3 = _this2.logger).info.apply(_logger3, arguments);
        },
        showMessage: function showMessage(message) {
          _this2.logger.showMessage(message);
        },
        group: function group(label) {
          _this2.logger.group(label);
        },
        groupEnd: function groupEnd() {
          _this2.logger.groupEnd();
        },
        sync: function sync() {
          _this2.logger.sync();
        },
        toggle: function toggle() {
          _this2.logger.toggle();
        },
        show: function show() {
          _this2.logger.show();
        },
        hide: function hide() {
          _this2.logger.hide();
        }
      };
    }
  }]);

  return Latex;
})(_atom.Disposable);

exports['default'] = Latex;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbGF0ZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3dCQUNELFlBQVk7Ozs7OEJBQ04sbUJBQW1COzs7OzhCQUNuQixtQkFBbUI7Ozs7K0JBQ2xCLG9CQUFvQjs7OzsrQkFDcEIsb0JBQW9COzs7O29CQUNBLE1BQU07O0FBRXRELFNBQVMscUJBQXFCLENBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUNoRCxNQUFNLGNBQWMsVUFBUSxRQUFRLEFBQUUsQ0FBQTtBQUN0QyxNQUFNLGFBQWEsa0JBQWdCLG9CQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQUFBRSxDQUFBOztBQUUzRCxRQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDdEMsT0FBRyxFQUFFLGVBQVk7QUFDZixVQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO0FBQzNCLGNBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQzdEO0FBQ0QsYUFBTyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7S0FDOUI7O0FBRUQsT0FBRyxFQUFFLGFBQVUsS0FBSyxFQUFFO0FBQUUsWUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQTtLQUFFO0dBQ3pELENBQUMsQ0FBQTtDQUNIOztBQUVELFNBQVMsdUJBQXVCLENBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbEQsTUFBSSxpQkFBVyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEMsT0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDM0I7QUFDRCxRQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLENBQUMsQ0FBQTtDQUM1Qzs7SUFFb0IsS0FBSztZQUFMLEtBQUs7O0FBR1osV0FITyxLQUFLLEdBR1Q7MEJBSEksS0FBSzs7QUFJdEIsK0JBSmlCLEtBQUssNkNBSWhCO2FBQU0sTUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFO0tBQUEsRUFBQztTQUh6QyxXQUFXLEdBQUcsK0JBQXlCOzs7O0FBSXJDLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNyQix5QkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7O0FBRXJDLDJCQUF1QixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxrQ0FBcUIsQ0FBQyxDQUFBO0FBQ3ZFLDJCQUF1QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsMkJBQWMsQ0FBQyxDQUFBO0FBQ3pELDJCQUF1QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsaUNBQW9CLENBQUMsQ0FBQTtBQUM3RCwyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLGlDQUFvQixDQUFDLENBQUE7QUFDOUQsMkJBQXVCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxrQ0FBcUIsQ0FBQyxDQUFBO0dBQy9EOztlQWJrQixLQUFLOztXQWVkLHFCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQUU7OztXQUV6QixtQkFBQyxNQUFNLEVBQUU7QUFDakIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7S0FDckI7OztXQUVnQiw0QkFBRztBQUNsQixVQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUN6RCxhQUFPLElBQUksYUFBYSxFQUFFLENBQUE7S0FDM0I7OztXQUVjLDBCQUFHOzs7QUFDaEIsVUFBSSxDQUFDLEdBQUcsR0FBRztBQUNULGFBQUssRUFBRSxpQkFBYTs7O0FBQ2xCLHFCQUFBLE9BQUssTUFBTSxFQUFDLEtBQUssTUFBQSxvQkFBUyxDQUFBO1NBQzNCO0FBQ0QsZUFBTyxFQUFFLG1CQUFhOzs7QUFDcEIsc0JBQUEsT0FBSyxNQUFNLEVBQUMsT0FBTyxNQUFBLHFCQUFTLENBQUE7U0FDN0I7QUFDRCxZQUFJLEVBQUUsZ0JBQWE7OztBQUNqQixzQkFBQSxPQUFLLE1BQU0sRUFBQyxJQUFJLE1BQUEscUJBQVMsQ0FBQTtTQUMxQjtBQUNELG1CQUFXLEVBQUUscUJBQUMsT0FBTyxFQUFLO0FBQ3hCLGlCQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDakM7QUFDRCxhQUFLLEVBQUUsZUFBQyxLQUFLLEVBQUs7QUFDaEIsaUJBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUN6QjtBQUNELGdCQUFRLEVBQUUsb0JBQU07QUFDZCxpQkFBSyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7U0FDdkI7QUFDRCxZQUFJLEVBQUUsZ0JBQU07QUFDVixpQkFBSyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDbkI7QUFDRCxjQUFNLEVBQUUsa0JBQU07QUFDWixpQkFBSyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDckI7QUFDRCxZQUFJLEVBQUUsZ0JBQU07QUFDVixpQkFBSyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDbkI7QUFDRCxZQUFJLEVBQUUsZ0JBQU07QUFDVixpQkFBSyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDbkI7T0FDRixDQUFBO0tBQ0Y7OztTQTNEa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9sYXRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbXBvc2VyIGZyb20gJy4vY29tcG9zZXInXG5pbXBvcnQgT3BlbmVyUmVnaXN0cnkgZnJvbSAnLi9vcGVuZXItcmVnaXN0cnknXG5pbXBvcnQgUHJvY2Vzc01hbmFnZXIgZnJvbSAnLi9wcm9jZXNzLW1hbmFnZXInXG5pbXBvcnQgU3RhdHVzSW5kaWNhdG9yIGZyb20gJy4vc3RhdHVzLWluZGljYXRvcidcbmltcG9ydCBCdWlsZGVyUmVnaXN0cnkgZnJvbSAnLi9idWlsZGVyLXJlZ2lzdHJ5J1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmZ1bmN0aW9uIGRlZmluZURlZmF1bHRQcm9wZXJ0eSAodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICBjb25zdCBzaGFkb3dQcm9wZXJ0eSA9IGBfXyR7cHJvcGVydHl9YFxuICBjb25zdCBkZWZhdWx0R2V0dGVyID0gYGdldERlZmF1bHQke18uY2FwaXRhbGl6ZShwcm9wZXJ0eSl9YFxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRhcmdldFtzaGFkb3dQcm9wZXJ0eV0pIHtcbiAgICAgICAgdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XSA9IHRhcmdldFtkZWZhdWx0R2V0dGVyXS5hcHBseSh0YXJnZXQpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XVxuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkgeyB0YXJnZXRbc2hhZG93UHJvcGVydHldID0gdmFsdWUgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSAob2JqLCBuYW1lLCB2YWx1ZSkge1xuICBpZiAoRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUodmFsdWUpKSB7XG4gICAgb2JqLmRpc3Bvc2FibGVzLmFkZCh2YWx1ZSlcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7IHZhbHVlIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhdGV4IGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmNyZWF0ZUxvZ1Byb3h5KClcbiAgICBkZWZpbmVEZWZhdWx0UHJvcGVydHkodGhpcywgJ2xvZ2dlcicpXG5cbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnYnVpbGRlclJlZ2lzdHJ5JywgbmV3IEJ1aWxkZXJSZWdpc3RyeSgpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdjb21wb3NlcicsIG5ldyBDb21wb3NlcigpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdvcGVuZXInLCBuZXcgT3BlbmVyUmVnaXN0cnkoKSlcbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAncHJvY2VzcycsIG5ldyBQcm9jZXNzTWFuYWdlcigpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdzdGF0dXMnLCBuZXcgU3RhdHVzSW5kaWNhdG9yKCkpXG4gIH1cblxuICBnZXRMb2dnZXIgKCkgeyByZXR1cm4gdGhpcy5sb2dnZXIgfVxuXG4gIHNldExvZ2dlciAobG9nZ2VyKSB7XG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcbiAgfVxuXG4gIGdldERlZmF1bHRMb2dnZXIgKCkge1xuICAgIGNvbnN0IERlZmF1bHRMb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcnMvZGVmYXVsdC1sb2dnZXInKVxuICAgIHJldHVybiBuZXcgRGVmYXVsdExvZ2dlcigpXG4gIH1cblxuICBjcmVhdGVMb2dQcm94eSAoKSB7XG4gICAgdGhpcy5sb2cgPSB7XG4gICAgICBlcnJvcjogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoLi4uYXJncylcbiAgICAgIH0sXG4gICAgICB3YXJuaW5nOiAoLi4uYXJncykgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKC4uLmFyZ3MpXG4gICAgICB9LFxuICAgICAgaW5mbzogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyguLi5hcmdzKVxuICAgICAgfSxcbiAgICAgIHNob3dNZXNzYWdlOiAobWVzc2FnZSkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5zaG93TWVzc2FnZShtZXNzYWdlKVxuICAgICAgfSxcbiAgICAgIGdyb3VwOiAobGFiZWwpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZ3JvdXAobGFiZWwpXG4gICAgICB9LFxuICAgICAgZ3JvdXBFbmQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZ3JvdXBFbmQoKVxuICAgICAgfSxcbiAgICAgIHN5bmM6ICgpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuc3luYygpXG4gICAgICB9LFxuICAgICAgdG9nZ2xlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLnRvZ2dsZSgpXG4gICAgICB9LFxuICAgICAgc2hvdzogKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5zaG93KClcbiAgICAgIH0sXG4gICAgICBoaWRlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmhpZGUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19