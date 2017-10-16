Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _evinceOpener = require('./evince-opener');

var _evinceOpener2 = _interopRequireDefault(_evinceOpener);

var DBUS_NAMES = {
  applicationObject: '/org/x/reader/Xreader',
  applicationInterface: 'org.x.reader.Application',

  daemonService: 'org.x.reader.Daemon',
  daemonObject: '/org/x/reader/Daemon',
  daemonInterface: 'org.x.reader.Daemon',

  windowInterface: 'org.x.reader.Window'
};

var XReaderOpener = (function (_EvinceOpener) {
  _inherits(XReaderOpener, _EvinceOpener);

  function XReaderOpener() {
    _classCallCheck(this, XReaderOpener);

    _get(Object.getPrototypeOf(XReaderOpener.prototype), 'constructor', this).call(this, 'Xreader', DBUS_NAMES);
  }

  _createClass(XReaderOpener, [{
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return false;
    }
  }]);

  return XReaderOpener;
})(_evinceOpener2['default']);

exports['default'] = XReaderOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy94LXJlYWRlci1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFFeUIsaUJBQWlCOzs7O0FBRTFDLElBQU0sVUFBVSxHQUFHO0FBQ2pCLG1CQUFpQixFQUFFLHVCQUF1QjtBQUMxQyxzQkFBb0IsRUFBRSwwQkFBMEI7O0FBRWhELGVBQWEsRUFBRSxxQkFBcUI7QUFDcEMsY0FBWSxFQUFFLHNCQUFzQjtBQUNwQyxpQkFBZSxFQUFFLHFCQUFxQjs7QUFFdEMsaUJBQWUsRUFBRSxxQkFBcUI7Q0FDdkMsQ0FBQTs7SUFFb0IsYUFBYTtZQUFiLGFBQWE7O0FBQ3BCLFdBRE8sYUFBYSxHQUNqQjswQkFESSxhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFeEIsU0FBUyxFQUFFLFVBQVUsRUFBQztHQUM3Qjs7ZUFIa0IsYUFBYTs7V0FLWiwrQkFBRztBQUNyQixhQUFPLEtBQUssQ0FBQTtLQUNiOzs7U0FQa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3gtcmVhZGVyLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IEV2aW5jZU9wZW5lciBmcm9tICcuL2V2aW5jZS1vcGVuZXInXG5cbmNvbnN0IERCVVNfTkFNRVMgPSB7XG4gIGFwcGxpY2F0aW9uT2JqZWN0OiAnL29yZy94L3JlYWRlci9YcmVhZGVyJyxcbiAgYXBwbGljYXRpb25JbnRlcmZhY2U6ICdvcmcueC5yZWFkZXIuQXBwbGljYXRpb24nLFxuXG4gIGRhZW1vblNlcnZpY2U6ICdvcmcueC5yZWFkZXIuRGFlbW9uJyxcbiAgZGFlbW9uT2JqZWN0OiAnL29yZy94L3JlYWRlci9EYWVtb24nLFxuICBkYWVtb25JbnRlcmZhY2U6ICdvcmcueC5yZWFkZXIuRGFlbW9uJyxcblxuICB3aW5kb3dJbnRlcmZhY2U6ICdvcmcueC5yZWFkZXIuV2luZG93J1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYUmVhZGVyT3BlbmVyIGV4dGVuZHMgRXZpbmNlT3BlbmVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCdYcmVhZGVyJywgREJVU19OQU1FUylcbiAgfVxuXG4gIGNhbk9wZW5JbkJhY2tncm91bmQgKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=