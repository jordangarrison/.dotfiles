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

var _atom = require('atom');

var _logMessage = require('./log-message');

var _logMessage2 = _interopRequireDefault(_logMessage);

var LogDock = (function () {
  _createClass(LogDock, null, [{
    key: 'LOG_DOCK_URI',
    value: 'atom://latex/log',
    enumerable: true
  }]);

  function LogDock() {
    var _this = this;

    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LogDock);

    this.disposables = new _atom.CompositeDisposable();

    this.properties = properties;
    _etch2['default'].initialize(this);
    this.disposables.add(latex.log.onMessages(function () {
      return _this.update();
    }));
  }

  _createClass(LogDock, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      this.disposables.dispose();
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var content = latex.log.getMessages().map(function (message) {
        return _etch2['default'].dom(_logMessage2['default'], { message: message, filePath: _this2.properties.filePath, position: _this2.properties.position });
      });

      return _etch2['default'].dom(
        'div',
        { className: 'latex-log', ref: 'body' },
        _etch2['default'].dom(
          'div',
          { className: 'log-block expand' },
          _etch2['default'].dom(
            'table',
            null,
            _etch2['default'].dom(
              'thead',
              null,
              _etch2['default'].dom(
                'tr',
                null,
                _etch2['default'].dom('th', null),
                _etch2['default'].dom(
                  'th',
                  null,
                  'Message'
                ),
                _etch2['default'].dom(
                  'th',
                  null,
                  'Source File'
                ),
                _etch2['default'].dom(
                  'th',
                  null,
                  'Log File'
                )
              )
            ),
            _etch2['default'].dom(
              'tbody',
              null,
              content
            )
          )
        )
      );
    }
  }, {
    key: 'update',
    value: function update() {
      var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.properties = properties;
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
    key: 'getTitle',
    value: function getTitle() {
      return 'LaTeX Log';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return LogDock.LOG_DOCK_URI;
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return 'bottom';
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'latex/log'
      };
    }
  }]);

  return LogDock;
})();

exports['default'] = LogDock;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvbG9nLWRvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNhLE1BQU07OzBCQUNuQixlQUFlOzs7O0lBRWpCLE9BQU87ZUFBUCxPQUFPOztXQUNKLGtCQUFrQjs7OztBQUk1QixXQUxPLE9BQU8sR0FLSTs7O1FBQWpCLFVBQVUseURBQUcsRUFBRTs7MEJBTFQsT0FBTzs7U0FHMUIsV0FBVyxHQUFHLCtCQUF5Qjs7QUFHckMsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2FBQU0sTUFBSyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQTtHQUNoRTs7ZUFUa0IsT0FBTzs7NkJBV1osYUFBRztBQUNmLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDMUIsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVNLGtCQUFHOzs7QUFDUixVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87ZUFBSSxpREFBWSxPQUFPLEVBQUUsT0FBTyxBQUFDLEVBQUMsUUFBUSxFQUFFLE9BQUssVUFBVSxDQUFDLFFBQVEsQUFBQyxFQUFDLFFBQVEsRUFBRSxPQUFLLFVBQVUsQ0FBQyxRQUFRLEFBQUMsR0FBRztPQUFBLENBQUMsQ0FBQTs7QUFFOUosYUFDRTs7VUFBSyxTQUFTLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNO1FBQ25DOztZQUFLLFNBQVMsRUFBQyxrQkFBa0I7VUFDL0I7OztZQUNFOzs7Y0FDRTs7O2dCQUNFLGlDQUFNO2dCQUNOOzs7O2lCQUFnQjtnQkFDaEI7Ozs7aUJBQXlCO2dCQUN6Qjs7OztpQkFBc0I7ZUFDbkI7YUFDQztZQUNSOzs7Y0FBUSxPQUFPO2FBQVM7V0FDbEI7U0FDSjtPQUNGLENBQ1A7S0FDRjs7O1dBRU0sa0JBQWtCO1VBQWpCLFVBQVUseURBQUcsRUFBRTs7QUFDckIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVlLDJCQUFHOztBQUVqQixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQzVFLFVBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUN0QixtQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO09BQ2hDO0tBQ0Y7OztXQUVRLG9CQUFHO0FBQ1YsYUFBTyxXQUFXLENBQUE7S0FDbkI7OztXQUVNLGtCQUFHO0FBQ1IsYUFBTyxPQUFPLENBQUMsWUFBWSxDQUFBO0tBQzVCOzs7V0FFa0IsOEJBQUc7QUFDcEIsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztXQUVTLHFCQUFHO0FBQ1gsYUFBTztBQUNMLG9CQUFZLEVBQUUsV0FBVztPQUMxQixDQUFBO0tBQ0Y7OztTQW5Fa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9sb2ctZG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBMb2dNZXNzYWdlIGZyb20gJy4vbG9nLW1lc3NhZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ0RvY2sge1xuICBzdGF0aWMgTE9HX0RPQ0tfVVJJID0gJ2F0b206Ly9sYXRleC9sb2cnXG5cbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgY29uc3RydWN0b3IgKHByb3BlcnRpZXMgPSB7fSkge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChsYXRleC5sb2cub25NZXNzYWdlcygoKSA9PiB0aGlzLnVwZGF0ZSgpKSlcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGxldCBjb250ZW50ID0gbGF0ZXgubG9nLmdldE1lc3NhZ2VzKCkubWFwKG1lc3NhZ2UgPT4gPExvZ01lc3NhZ2UgbWVzc2FnZT17bWVzc2FnZX0gZmlsZVBhdGg9e3RoaXMucHJvcGVydGllcy5maWxlUGF0aH0gcG9zaXRpb249e3RoaXMucHJvcGVydGllcy5wb3NpdGlvbn0gLz4pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xhdGV4LWxvZycgcmVmPSdib2R5Jz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZy1ibG9jayBleHBhbmQnPlxuICAgICAgICAgIDx0YWJsZT5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aCAvPlxuICAgICAgICAgICAgICAgIDx0aD5NZXNzYWdlPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+U291cmNlJm5ic3A7RmlsZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkxvZyZuYnNwO0ZpbGU8L3RoPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT57Y29udGVudH08L3Rib2R5PlxuICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgdXBkYXRlIChwcm9wZXJ0aWVzID0ge30pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZWFkQWZ0ZXJVcGRhdGUgKCkge1xuICAgIC8vIExvb2sgZm9yIGhpZ2hsaWdodGVkIG1lc3NhZ2VzIGFuZCBzY3JvbGwgdG8gdGhlbVxuICAgIGNvbnN0IGhpZ2hsaWdodGVkID0gdGhpcy5yZWZzLmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGF0ZXgtaGlnaGxpZ2h0JylcbiAgICBpZiAoaGlnaGxpZ2h0ZWQubGVuZ3RoKSB7XG4gICAgICBoaWdobGlnaHRlZFswXS5zY3JvbGxJbnRvVmlldygpXG4gICAgfVxuICB9XG5cbiAgZ2V0VGl0bGUgKCkge1xuICAgIHJldHVybiAnTGFUZVggTG9nJ1xuICB9XG5cbiAgZ2V0VVJJICgpIHtcbiAgICByZXR1cm4gTG9nRG9jay5MT0dfRE9DS19VUklcbiAgfVxuXG4gIGdldERlZmF1bHRMb2NhdGlvbiAoKSB7XG4gICAgcmV0dXJuICdib3R0b20nXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdsYXRleC9sb2cnXG4gICAgfVxuICB9XG59XG4iXX0=