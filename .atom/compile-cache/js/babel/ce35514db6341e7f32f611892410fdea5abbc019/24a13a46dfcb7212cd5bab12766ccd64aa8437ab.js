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

var StatusLabel = (function () {
  function StatusLabel() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, StatusLabel);

    this.properties = properties;
    _etch2['default'].initialize(this);
  }

  _createClass(StatusLabel, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'render',
    value: function render() {
      if (!this.properties.text) return _etch2['default'].dom('div', null);

      var classNames = ['latex-status', 'inline-block'];

      if (this.properties.type) classNames.push('latex-' + this.properties.type);
      if (this.properties.onClick) classNames.push('latex-status-link');

      var iconClassNames = ['icon', 'icon-' + this.properties.icon];

      if (this.properties.spin) iconClassNames.push('latex-spin');

      return _etch2['default'].dom(
        'div',
        { className: classNames.join(' '), onclick: this.properties.onClick },
        this.properties.icon ? _etch2['default'].dom('div', { className: iconClassNames.join(' ') }) : '',
        _etch2['default'].dom(
          'span',
          null,
          this.properties.text
        )
      );
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      return _etch2['default'].update(this);
    }
  }, {
    key: 'readAfterUpdate',
    value: function readAfterUpdate() {
      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltop = null;
      }
      if (this.properties.title) {
        this.tooltip = atom.tooltips.add(this.element, { title: this.properties.title });
      }
    }
  }]);

  return StatusLabel;
})();

exports['default'] = StatusLabel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3Mvc3RhdHVzLWxhYmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztJQUVGLFdBQVc7QUFDbEIsV0FETyxXQUFXLEdBQ0E7UUFBakIsVUFBVSx5REFBRyxFQUFFOzswQkFEVCxXQUFXOztBQUU1QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSmtCLFdBQVc7OzZCQU1oQixhQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdkI7QUFDRCxZQUFNLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRU0sa0JBQUc7QUFDUixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxrQ0FBTyxDQUFBOztBQUV6QyxVQUFJLFVBQVUsR0FBRyxDQUNmLGNBQWMsRUFDZCxjQUFjLENBQ2YsQ0FBQTs7QUFFRCxVQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLFlBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUcsQ0FBQTtBQUMxRSxVQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQTs7QUFFakUsVUFBSSxjQUFjLEdBQUcsQ0FDbkIsTUFBTSxZQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUM3QixDQUFBOztBQUVELFVBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFM0QsYUFDRTs7VUFBSyxTQUFTLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQUFBQztRQUNwRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRywrQkFBSyxTQUFTLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBQyxHQUFHLEdBQUcsRUFBRTtRQUN6RTs7O1VBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1NBQVE7T0FDL0IsQ0FDUDtLQUNGOzs7V0FFTSxnQkFBQyxVQUFVLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVlLDJCQUFHO0FBQ2pCLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO09BQ3BCO0FBQ0QsVUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUN6QixZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO09BQ2pGO0tBQ0Y7OztTQXBEa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9zdGF0dXMtbGFiZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNMYWJlbCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wZXJ0aWVzID0ge30pIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAuZGlzcG9zZSgpXG4gICAgfVxuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAoIXRoaXMucHJvcGVydGllcy50ZXh0KSByZXR1cm4gPGRpdiAvPlxuXG4gICAgbGV0IGNsYXNzTmFtZXMgPSBbXG4gICAgICAnbGF0ZXgtc3RhdHVzJyxcbiAgICAgICdpbmxpbmUtYmxvY2snXG4gICAgXVxuXG4gICAgaWYgKHRoaXMucHJvcGVydGllcy50eXBlKSBjbGFzc05hbWVzLnB1c2goYGxhdGV4LSR7dGhpcy5wcm9wZXJ0aWVzLnR5cGV9YClcbiAgICBpZiAodGhpcy5wcm9wZXJ0aWVzLm9uQ2xpY2spIGNsYXNzTmFtZXMucHVzaCgnbGF0ZXgtc3RhdHVzLWxpbmsnKVxuXG4gICAgbGV0IGljb25DbGFzc05hbWVzID0gW1xuICAgICAgJ2ljb24nLFxuICAgICAgYGljb24tJHt0aGlzLnByb3BlcnRpZXMuaWNvbn1gXG4gICAgXVxuXG4gICAgaWYgKHRoaXMucHJvcGVydGllcy5zcGluKSBpY29uQ2xhc3NOYW1lcy5wdXNoKCdsYXRleC1zcGluJylcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcy5qb2luKCcgJyl9IG9uY2xpY2s9e3RoaXMucHJvcGVydGllcy5vbkNsaWNrfT5cbiAgICAgICAge3RoaXMucHJvcGVydGllcy5pY29uID8gPGRpdiBjbGFzc05hbWU9e2ljb25DbGFzc05hbWVzLmpvaW4oJyAnKX0gLz4gOiAnJ31cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcGVydGllcy50ZXh0fTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAocHJvcGVydGllcykge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHJlYWRBZnRlclVwZGF0ZSAoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgICAgdGhpcy50b29sdG9wID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wZXJ0aWVzLnRpdGxlKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHsgdGl0bGU6IHRoaXMucHJvcGVydGllcy50aXRsZSB9KVxuICAgIH1cbiAgfVxufVxuIl19