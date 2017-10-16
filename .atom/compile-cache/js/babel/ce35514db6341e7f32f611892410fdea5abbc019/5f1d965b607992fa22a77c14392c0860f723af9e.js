Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _util = require('../util');

var _entryFinder = require('./entry-finder');

'use babel';

var ConstructorEntryFinder = (function (_EntryFinder) {
  _inherits(ConstructorEntryFinder, _EntryFinder);

  function ConstructorEntryFinder() {
    _classCallCheck(this, ConstructorEntryFinder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(ConstructorEntryFinder.prototype), 'constructor', this).apply(this, args);
  }

  _createClass(ConstructorEntryFinder, [{
    key: 'get',
    value: function get(editor, bufferPosition, prefix) {
      return this.registry.filter(function (fullyQualifiedClass) {
        return (0, _util.denamespace)(fullyQualifiedClass).startsWith(prefix);
      }).filter(function (entry) {
        return entry.methods.find(function (method) {
          return method.name === '<init>' && method.modifiers.includes('public');
        });
      }).map(function (entry) {
        return _extends({}, entry, { _type: 'constructor' });
      });
    }
  }]);

  return ConstructorEntryFinder;
})(_entryFinder.EntryFinder);

exports.ConstructorEntryFinder = ConstructorEntryFinder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvZW50cnlmaW5kZXJzL2NvbnN0cnVjdG9yLWVudHJ5LWZpbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFNEIsU0FBUzs7MkJBQ1QsZ0JBQWdCOztBQUg1QyxXQUFXLENBQUM7O0lBS04sc0JBQXNCO1lBQXRCLHNCQUFzQjs7QUFDZixXQURQLHNCQUFzQixHQUNMOzBCQURqQixzQkFBc0I7O3NDQUNYLElBQUk7QUFBSixVQUFJOzs7QUFDakIsK0JBRkUsc0JBQXNCLDhDQUVmLElBQUksRUFBRTtHQUNoQjs7ZUFIRyxzQkFBc0I7O1dBS3ZCLGFBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUU7QUFDbEMsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLG1CQUFtQjtlQUFJLHVCQUFZLG1CQUFtQixDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FDcEcsTUFBTSxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtpQkFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7U0FBQSxDQUFDO09BQUEsQ0FBQyxDQUM5RyxHQUFHLENBQUMsVUFBQSxLQUFLOzRCQUFVLEtBQUssSUFBRSxLQUFLLEVBQUUsYUFBYTtPQUFHLENBQUMsQ0FBQztLQUN2RDs7O1NBVEcsc0JBQXNCOzs7UUFZbkIsc0JBQXNCLEdBQXRCLHNCQUFzQiIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWphdmEtbWludXMvbGliL2VudHJ5ZmluZGVycy9jb25zdHJ1Y3Rvci1lbnRyeS1maW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgZGVuYW1lc3BhY2UgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7IEVudHJ5RmluZGVyIH0gZnJvbSAnLi9lbnRyeS1maW5kZXInO1xuXG5jbGFzcyBDb25zdHJ1Y3RvckVudHJ5RmluZGVyIGV4dGVuZHMgRW50cnlGaW5kZXIge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gIH1cblxuICBnZXQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4KSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZmlsdGVyKGZ1bGx5UXVhbGlmaWVkQ2xhc3MgPT4gZGVuYW1lc3BhY2UoZnVsbHlRdWFsaWZpZWRDbGFzcykuc3RhcnRzV2l0aChwcmVmaXgpKVxuICAgICAgLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5tZXRob2RzLmZpbmQobWV0aG9kID0+IG1ldGhvZC5uYW1lID09PSAnPGluaXQ+JyAmJiBtZXRob2QubW9kaWZpZXJzLmluY2x1ZGVzKCdwdWJsaWMnKSkpXG4gICAgICAubWFwKGVudHJ5ID0+ICh7IC4uLmVudHJ5LCBfdHlwZTogJ2NvbnN0cnVjdG9yJyB9KSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgQ29uc3RydWN0b3JFbnRyeUZpbmRlciB9O1xuIl19