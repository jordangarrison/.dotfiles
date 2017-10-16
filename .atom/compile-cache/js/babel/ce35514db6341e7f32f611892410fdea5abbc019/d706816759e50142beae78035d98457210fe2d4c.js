Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

// import _ from 'underscore-plus';

var _solarCalc = require('solar-calc');

var _solarCalc2 = _interopRequireDefault(_solarCalc);

var _timeHelpers = require('./time-helpers');

// Get a human readable title for the given theme name.
// function getThemeTitle(themeName = '') {
//   const title = themeName.replace(/-(ui|syntax)/g, '').replace(/-theme$/g, '')
//   return _.undasherize(_.uncamelcase(title));
// }

'use babel';

function themeToConfigStringEnum(_ref) {
  var name = _ref.metadata.name;

  return name;
  // return {
  //   value: name,
  //   description: getThemeTitle(name),
  // };
}

var loadedThemes = atom.themes.getLoadedThemes();

var uiThemesEnum = loadedThemes.filter(function (theme) {
  return theme.metadata.theme === 'ui';
}).map(themeToConfigStringEnum);

var syntaxThemesEnum = loadedThemes.filter(function (theme) {
  return theme.metadata.theme === 'syntax';
}).map(themeToConfigStringEnum);

exports['default'] = {
  intervalId: null,

  wasDay: null,

  config: {
    day: {
      order: 1,
      type: 'object',
      properties: {
        ui: {
          order: 1,
          title: 'UI Theme',
          type: 'string',
          'default': 'one-light-ui',
          'enum': uiThemesEnum
        },
        syntax: {
          order: 2,
          title: 'Syntax Theme',
          type: 'string',
          'default': 'one-light-syntax',
          'enum': syntaxThemesEnum
        }
      }
    },
    night: {
      order: 2,
      type: 'object',
      properties: {
        ui: {
          order: 1,
          title: 'UI Theme',
          type: 'string',
          'default': 'one-dark-ui',
          'enum': uiThemesEnum
        },
        syntax: {
          order: 2,
          title: 'Syntax Theme',
          type: 'string',
          'default': 'one-dark-syntax',
          'enum': syntaxThemesEnum
        }
      }
    }
  },

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('theme-flux', function () {
      _this.wasDay = null; // force theme update
      _this.changeTheme();
    }));

    var milliseconds = (0, _timeHelpers.minutesToMilliseconds)(this.getCheckIntervalInMinutes());
    this.intervalId = setInterval(this.changeTheme.bind(this), milliseconds);
    this.changeTheme();
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();

    clearInterval(this.intervalId);
    this.intervalId = null;
  },

  changeTheme: function changeTheme() {
    var _this2 = this;

    navigator.geolocation.getCurrentPosition(function (_ref2) {
      var _ref2$coords = _ref2.coords;
      var latitude = _ref2$coords.latitude;
      var longitude = _ref2$coords.longitude;

      var solar = new _solarCalc2['default'](new Date(), latitude, longitude);

      var isDay = _this2.isDay(solar);
      if (isDay === _this2.wasDay) return;

      if (isDay) {
        _this2.scheduleThemeUpdate([atom.config.get('theme-flux.day.ui'), atom.config.get('theme-flux.day.syntax')]);
      } else {
        _this2.scheduleThemeUpdate([atom.config.get('theme-flux.night.ui'), atom.config.get('theme-flux.night.syntax')]);
      }

      _this2.wasDay = isDay;
    });
  },

  scheduleThemeUpdate: function scheduleThemeUpdate(themes) {
    setTimeout(function () {
      return atom.config.set('core.themes', themes);
    }, 100);
  },

  isDay: function isDay(_ref3) {
    var sunrise = _ref3.sunrise;
    var sunset = _ref3.sunset;

    var now = new Date();
    return now >= sunrise && now <= sunset;
  },

  getCheckIntervalInMinutes: function getCheckIntervalInMinutes() {
    return 15;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy90aGVtZS1mbHV4L2xpYi90aGVtZS1mbHV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7Ozt5QkFFcEIsWUFBWTs7OzsyQkFFSSxnQkFBZ0I7Ozs7Ozs7O0FBTnRELFdBQVcsQ0FBQzs7QUFjWixTQUFTLHVCQUF1QixDQUFDLElBQXNCLEVBQUU7TUFBVixJQUFJLEdBQWxCLElBQXNCLENBQXBCLFFBQVEsQ0FBSSxJQUFJOztBQUNqRCxTQUFPLElBQUksQ0FBQzs7Ozs7Q0FLYjs7QUFFRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVuRCxJQUFNLFlBQVksR0FBRyxZQUFZLENBQzlCLE1BQU0sQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxJQUFJO0NBQUEsQ0FBQyxDQUM5QyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFaEMsSUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQ2xDLE1BQU0sQ0FBQyxVQUFBLEtBQUs7U0FBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxRQUFRO0NBQUEsQ0FBQyxDQUNsRCxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7cUJBRWpCO0FBQ2IsWUFBVSxFQUFFLElBQUk7O0FBRWhCLFFBQU0sRUFBRSxJQUFJOztBQUVaLFFBQU0sRUFBRTtBQUNOLE9BQUcsRUFBRTtBQUNILFdBQUssRUFBRSxDQUFDO0FBQ1IsVUFBSSxFQUFFLFFBQVE7QUFDZCxnQkFBVSxFQUFFO0FBQ1YsVUFBRSxFQUFFO0FBQ0YsZUFBSyxFQUFFLENBQUM7QUFDUixlQUFLLEVBQUUsVUFBVTtBQUNqQixjQUFJLEVBQUUsUUFBUTtBQUNkLHFCQUFTLGNBQWM7QUFDdkIsa0JBQU0sWUFBWTtTQUNuQjtBQUNELGNBQU0sRUFBRTtBQUNOLGVBQUssRUFBRSxDQUFDO0FBQ1IsZUFBSyxFQUFFLGNBQWM7QUFDckIsY0FBSSxFQUFFLFFBQVE7QUFDZCxxQkFBUyxrQkFBa0I7QUFDM0Isa0JBQU0sZ0JBQWdCO1NBQ3ZCO09BQ0Y7S0FDRjtBQUNELFNBQUssRUFBRTtBQUNMLFdBQUssRUFBRSxDQUFDO0FBQ1IsVUFBSSxFQUFFLFFBQVE7QUFDZCxnQkFBVSxFQUFFO0FBQ1YsVUFBRSxFQUFFO0FBQ0YsZUFBSyxFQUFFLENBQUM7QUFDUixlQUFLLEVBQUUsVUFBVTtBQUNqQixjQUFJLEVBQUUsUUFBUTtBQUNkLHFCQUFTLGFBQWE7QUFDdEIsa0JBQU0sWUFBWTtTQUNuQjtBQUNELGNBQU0sRUFBRTtBQUNOLGVBQUssRUFBRSxDQUFDO0FBQ1IsZUFBSyxFQUFFLGNBQWM7QUFDckIsY0FBSSxFQUFFLFFBQVE7QUFDZCxxQkFBUyxpQkFBaUI7QUFDMUIsa0JBQU0sZ0JBQWdCO1NBQ3ZCO09BQ0Y7S0FDRjtHQUNGOztBQUVELFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBTTtBQUM3RCxZQUFLLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsWUFBSyxXQUFXLEVBQUUsQ0FBQztLQUNwQixDQUFDLENBQUMsQ0FBQzs7QUFFSixRQUFNLFlBQVksR0FBRyx3Q0FBc0IsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQztBQUM3RSxRQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN6RSxRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFN0IsaUJBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0IsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7R0FDeEI7O0FBRUQsYUFBVyxFQUFBLHVCQUFHOzs7QUFDWixhQUFTLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsS0FBbUMsRUFBSzt5QkFBeEMsS0FBbUMsQ0FBakMsTUFBTTtVQUFJLFFBQVEsZ0JBQVIsUUFBUTtVQUFFLFNBQVMsZ0JBQVQsU0FBUzs7QUFDdkUsVUFBTSxLQUFLLEdBQUcsMkJBQWMsSUFBSSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTdELFVBQU0sS0FBSyxHQUFHLE9BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFVBQUksS0FBSyxLQUFLLE9BQUssTUFBTSxFQUFFLE9BQU87O0FBRWxDLFVBQUksS0FBSyxFQUFFO0FBQ1QsZUFBSyxtQkFBbUIsQ0FBQyxDQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxFQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUN6QyxDQUFDLENBQUM7T0FDSixNQUFNO0FBQ0wsZUFBSyxtQkFBbUIsQ0FBQyxDQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUMzQyxDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFLLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckIsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQscUJBQW1CLEVBQUEsNkJBQUMsTUFBTSxFQUFFO0FBQzFCLGNBQVUsQ0FBQzthQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7S0FBQSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQy9EOztBQUVELE9BQUssRUFBQSxlQUFDLEtBQW1CLEVBQUU7UUFBbkIsT0FBTyxHQUFULEtBQW1CLENBQWpCLE9BQU87UUFBRSxNQUFNLEdBQWpCLEtBQW1CLENBQVIsTUFBTTs7QUFDckIsUUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixXQUFPLEdBQUcsSUFBSSxPQUFPLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQztHQUN4Qzs7QUFFRCwyQkFBeUIsRUFBQSxxQ0FBRztBQUMxQixXQUFPLEVBQUUsQ0FBQztHQUNYO0NBQ0YiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL3RoZW1lLWZsdXgvbGliL3RoZW1lLWZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuLy8gaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBTb2xhckNhbGMgZnJvbSAnc29sYXItY2FsYyc7XG5cbmltcG9ydCB7IG1pbnV0ZXNUb01pbGxpc2Vjb25kcyB9IGZyb20gJy4vdGltZS1oZWxwZXJzJztcblxuLy8gR2V0IGEgaHVtYW4gcmVhZGFibGUgdGl0bGUgZm9yIHRoZSBnaXZlbiB0aGVtZSBuYW1lLlxuLy8gZnVuY3Rpb24gZ2V0VGhlbWVUaXRsZSh0aGVtZU5hbWUgPSAnJykge1xuLy8gICBjb25zdCB0aXRsZSA9IHRoZW1lTmFtZS5yZXBsYWNlKC8tKHVpfHN5bnRheCkvZywgJycpLnJlcGxhY2UoLy10aGVtZSQvZywgJycpXG4vLyAgIHJldHVybiBfLnVuZGFzaGVyaXplKF8udW5jYW1lbGNhc2UodGl0bGUpKTtcbi8vIH1cblxuZnVuY3Rpb24gdGhlbWVUb0NvbmZpZ1N0cmluZ0VudW0oeyBtZXRhZGF0YTogeyBuYW1lIH0gfSkge1xuICByZXR1cm4gbmFtZTtcbiAgLy8gcmV0dXJuIHtcbiAgLy8gICB2YWx1ZTogbmFtZSxcbiAgLy8gICBkZXNjcmlwdGlvbjogZ2V0VGhlbWVUaXRsZShuYW1lKSxcbiAgLy8gfTtcbn1cblxuY29uc3QgbG9hZGVkVGhlbWVzID0gYXRvbS50aGVtZXMuZ2V0TG9hZGVkVGhlbWVzKCk7XG5cbmNvbnN0IHVpVGhlbWVzRW51bSA9IGxvYWRlZFRoZW1lc1xuICAuZmlsdGVyKHRoZW1lID0+IHRoZW1lLm1ldGFkYXRhLnRoZW1lID09PSAndWknKVxuICAubWFwKHRoZW1lVG9Db25maWdTdHJpbmdFbnVtKTtcblxuY29uc3Qgc3ludGF4VGhlbWVzRW51bSA9IGxvYWRlZFRoZW1lc1xuICAuZmlsdGVyKHRoZW1lID0+IHRoZW1lLm1ldGFkYXRhLnRoZW1lID09PSAnc3ludGF4JylcbiAgLm1hcCh0aGVtZVRvQ29uZmlnU3RyaW5nRW51bSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW50ZXJ2YWxJZDogbnVsbCxcblxuICB3YXNEYXk6IG51bGwsXG5cbiAgY29uZmlnOiB7XG4gICAgZGF5OiB7XG4gICAgICBvcmRlcjogMSxcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB1aToge1xuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgIHRpdGxlOiAnVUkgVGhlbWUnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdvbmUtbGlnaHQtdWknLFxuICAgICAgICAgIGVudW06IHVpVGhlbWVzRW51bSxcbiAgICAgICAgfSxcbiAgICAgICAgc3ludGF4OiB7XG4gICAgICAgICAgb3JkZXI6IDIsXG4gICAgICAgICAgdGl0bGU6ICdTeW50YXggVGhlbWUnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdvbmUtbGlnaHQtc3ludGF4JyxcbiAgICAgICAgICBlbnVtOiBzeW50YXhUaGVtZXNFbnVtLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG5pZ2h0OiB7XG4gICAgICBvcmRlcjogMixcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB1aToge1xuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgIHRpdGxlOiAnVUkgVGhlbWUnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdvbmUtZGFyay11aScsXG4gICAgICAgICAgZW51bTogdWlUaGVtZXNFbnVtLFxuICAgICAgICB9LFxuICAgICAgICBzeW50YXg6IHtcbiAgICAgICAgICBvcmRlcjogMixcbiAgICAgICAgICB0aXRsZTogJ1N5bnRheCBUaGVtZScsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ29uZS1kYXJrLXN5bnRheCcsXG4gICAgICAgICAgZW51bTogc3ludGF4VGhlbWVzRW51bSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgndGhlbWUtZmx1eCcsICgpID0+IHtcbiAgICAgIHRoaXMud2FzRGF5ID0gbnVsbDsgLy8gZm9yY2UgdGhlbWUgdXBkYXRlXG4gICAgICB0aGlzLmNoYW5nZVRoZW1lKCk7XG4gICAgfSkpO1xuXG4gICAgY29uc3QgbWlsbGlzZWNvbmRzID0gbWludXRlc1RvTWlsbGlzZWNvbmRzKHRoaXMuZ2V0Q2hlY2tJbnRlcnZhbEluTWludXRlcygpKTtcbiAgICB0aGlzLmludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aGlzLmNoYW5nZVRoZW1lLmJpbmQodGhpcyksIG1pbGxpc2Vjb25kcyk7XG4gICAgdGhpcy5jaGFuZ2VUaGVtZSgpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcblxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbElkKTtcbiAgICB0aGlzLmludGVydmFsSWQgPSBudWxsO1xuICB9LFxuXG4gIGNoYW5nZVRoZW1lKCkge1xuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oKHsgY29vcmRzOiB7IGxhdGl0dWRlLCBsb25naXR1ZGUgfSB9KSA9PiB7XG4gICAgICBjb25zdCBzb2xhciA9IG5ldyBTb2xhckNhbGMobmV3IERhdGUoKSwgbGF0aXR1ZGUsIGxvbmdpdHVkZSk7XG5cbiAgICAgIGNvbnN0IGlzRGF5ID0gdGhpcy5pc0RheShzb2xhcik7XG4gICAgICBpZiAoaXNEYXkgPT09IHRoaXMud2FzRGF5KSByZXR1cm47XG5cbiAgICAgIGlmIChpc0RheSkge1xuICAgICAgICB0aGlzLnNjaGVkdWxlVGhlbWVVcGRhdGUoW1xuICAgICAgICAgIGF0b20uY29uZmlnLmdldCgndGhlbWUtZmx1eC5kYXkudWknKSxcbiAgICAgICAgICBhdG9tLmNvbmZpZy5nZXQoJ3RoZW1lLWZsdXguZGF5LnN5bnRheCcpLFxuICAgICAgICBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVUaGVtZVVwZGF0ZShbXG4gICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCd0aGVtZS1mbHV4Lm5pZ2h0LnVpJyksXG4gICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCd0aGVtZS1mbHV4Lm5pZ2h0LnN5bnRheCcpLFxuICAgICAgICBdKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy53YXNEYXkgPSBpc0RheTtcbiAgICB9KTtcbiAgfSxcblxuICBzY2hlZHVsZVRoZW1lVXBkYXRlKHRoZW1lcykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gYXRvbS5jb25maWcuc2V0KCdjb3JlLnRoZW1lcycsIHRoZW1lcyksIDEwMCk7XG4gIH0sXG5cbiAgaXNEYXkoeyBzdW5yaXNlLCBzdW5zZXQgfSkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIG5vdyA+PSBzdW5yaXNlICYmIG5vdyA8PSBzdW5zZXQ7XG4gIH0sXG5cbiAgZ2V0Q2hlY2tJbnRlcnZhbEluTWludXRlcygpIHtcbiAgICByZXR1cm4gMTU7XG4gIH0sXG59O1xuIl19