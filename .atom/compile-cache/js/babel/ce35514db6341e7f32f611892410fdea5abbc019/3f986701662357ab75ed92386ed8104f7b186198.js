Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

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

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _atom = require('atom');

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

    defineImmutableProperty(this, 'builderRegistry', new _builderRegistry2['default']());
    defineImmutableProperty(this, 'composer', new _composer2['default']());
    defineImmutableProperty(this, 'log', new _logger2['default']());
    defineImmutableProperty(this, 'opener', new _openerRegistry2['default']());
    defineImmutableProperty(this, 'process', new _processManager2['default']());
    defineImmutableProperty(this, 'status', new _statusIndicator2['default']());
  }

  return Latex;
})(_atom.Disposable);

exports['default'] = Latex;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbGF0ZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7d0JBRXFCLFlBQVk7Ozs7OEJBQ04sbUJBQW1COzs7OzhCQUNuQixtQkFBbUI7Ozs7K0JBQ2xCLG9CQUFvQjs7OzsrQkFDcEIsb0JBQW9COzs7O3NCQUM3QixVQUFVOzs7O29CQUNtQixNQUFNOztBQUV0RCxTQUFTLHVCQUF1QixDQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xELE1BQUksaUJBQVcsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2xDLE9BQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQzNCO0FBQ0QsUUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDLENBQUE7Q0FDNUM7O0lBRW9CLEtBQUs7WUFBTCxLQUFLOztBQUdaLFdBSE8sS0FBSyxHQUdUOzBCQUhJLEtBQUs7O0FBSXRCLCtCQUppQixLQUFLLDZDQUloQjthQUFNLE1BQUssV0FBVyxDQUFDLE9BQU8sRUFBRTtLQUFBLEVBQUM7O1NBSHpDLFdBQVcsR0FBRywrQkFBeUI7Ozs7QUFLckMsMkJBQXVCLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGtDQUFxQixDQUFDLENBQUE7QUFDdkUsMkJBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSwyQkFBYyxDQUFDLENBQUE7QUFDekQsMkJBQXVCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSx5QkFBWSxDQUFDLENBQUE7QUFDbEQsMkJBQXVCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxpQ0FBb0IsQ0FBQyxDQUFBO0FBQzdELDJCQUF1QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsaUNBQW9CLENBQUMsQ0FBQTtBQUM5RCwyQkFBdUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGtDQUFxQixDQUFDLENBQUE7R0FDL0Q7O1NBWmtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbGF0ZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBDb21wb3NlciBmcm9tICcuL2NvbXBvc2VyJ1xuaW1wb3J0IE9wZW5lclJlZ2lzdHJ5IGZyb20gJy4vb3BlbmVyLXJlZ2lzdHJ5J1xuaW1wb3J0IFByb2Nlc3NNYW5hZ2VyIGZyb20gJy4vcHJvY2Vzcy1tYW5hZ2VyJ1xuaW1wb3J0IFN0YXR1c0luZGljYXRvciBmcm9tICcuL3N0YXR1cy1pbmRpY2F0b3InXG5pbXBvcnQgQnVpbGRlclJlZ2lzdHJ5IGZyb20gJy4vYnVpbGRlci1yZWdpc3RyeSdcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZnVuY3Rpb24gZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkgKG9iaiwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKERpc3Bvc2FibGUuaXNEaXNwb3NhYmxlKHZhbHVlKSkge1xuICAgIG9iai5kaXNwb3NhYmxlcy5hZGQodmFsdWUpXG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwgeyB2YWx1ZSB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleCBleHRlbmRzIERpc3Bvc2FibGUge1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkpXG5cbiAgICBkZWZpbmVJbW11dGFibGVQcm9wZXJ0eSh0aGlzLCAnYnVpbGRlclJlZ2lzdHJ5JywgbmV3IEJ1aWxkZXJSZWdpc3RyeSgpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdjb21wb3NlcicsIG5ldyBDb21wb3NlcigpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdsb2cnLCBuZXcgTG9nZ2VyKCkpXG4gICAgZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkodGhpcywgJ29wZW5lcicsIG5ldyBPcGVuZXJSZWdpc3RyeSgpKVxuICAgIGRlZmluZUltbXV0YWJsZVByb3BlcnR5KHRoaXMsICdwcm9jZXNzJywgbmV3IFByb2Nlc3NNYW5hZ2VyKCkpXG4gICAgZGVmaW5lSW1tdXRhYmxlUHJvcGVydHkodGhpcywgJ3N0YXR1cycsIG5ldyBTdGF0dXNJbmRpY2F0b3IoKSlcbiAgfVxufVxuIl19