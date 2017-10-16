'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Registry = (function () {
  function Registry() {
    var serialized = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Registry);

    this.items = new Map(serialized);
  }

  _createClass(Registry, [{
    key: 'set',
    value: function set() {
      var items = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.items = new Map(items);
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.items.get(key);
    }
  }, {
    key: 'add',
    value: function add(key, value) {
      this.items.set(key, value);
    }
  }, {
    key: 'filter',
    value: function filter(callback, thisArg) {
      if (typeof callback === 'string') {
        (function () {
          var prefix = callback;
          callback = function (key) {
            return key.startsWith(prefix);
          };
        })();
      }

      var matches = [];
      for (var _ref3 of this.items) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var key = _ref2[0];
        var value = _ref2[1];

        if (callback.apply(thisArg, [key])) {
          matches.push(value);
        }
      }
      return matches;
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return [].concat(_toConsumableArray(this.items));
    }
  }, {
    key: '_clear',
    value: function _clear() {
      this.items.clear();
    }
  }]);

  return Registry;
})();

exports['default'] = Registry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS9saWIvcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7OztJQUVOLFFBQVE7QUFDRCxXQURQLFFBQVEsR0FDaUI7UUFBakIsVUFBVSx5REFBRyxFQUFFOzswQkFEdkIsUUFBUTs7QUFFVixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQ2xDOztlQUhHLFFBQVE7O1dBS1QsZUFBYTtVQUFaLEtBQUsseURBQUcsRUFBRTs7QUFDWixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCOzs7V0FFRSxhQUFDLEdBQUcsRUFBRTtBQUNQLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDNUI7OztXQUVFLGFBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1Qjs7O1dBRUssZ0JBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUN4QixVQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTs7QUFDaEMsY0FBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ3hCLGtCQUFRLEdBQUcsVUFBQSxHQUFHO21CQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1dBQUEsQ0FBQzs7T0FDMUM7O0FBRUQsVUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25CLHdCQUE2QixJQUFJLENBQUMsS0FBSyxFQUFFOzs7WUFBNUIsR0FBRztZQUFFLEtBQUs7O0FBQ3JCLFlBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBRSxHQUFHLENBQUUsQ0FBQyxFQUFFO0FBQ3BDLGlCQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JCO09BQ0Y7QUFDRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRVEscUJBQUc7QUFDViwwQ0FBWSxJQUFJLENBQUMsS0FBSyxHQUFHO0tBQzFCOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEI7OztTQXRDRyxRQUFROzs7cUJBeUNDLFFBQVEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2phdmEtY2xhc3NwYXRoLXJlZ2lzdHJ5L2xpYi9yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jbGFzcyBSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKHNlcmlhbGl6ZWQgPSBbXSkge1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgTWFwKHNlcmlhbGl6ZWQpO1xuICB9XG5cbiAgc2V0KGl0ZW1zID0ge30pIHtcbiAgICB0aGlzLml0ZW1zID0gbmV3IE1hcChpdGVtcyk7XG4gIH1cblxuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZ2V0KGtleSk7XG4gIH1cblxuICBhZGQoa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMuaXRlbXMuc2V0KGtleSwgdmFsdWUpO1xuICB9XG5cbiAgZmlsdGVyKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHByZWZpeCA9IGNhbGxiYWNrO1xuICAgICAgY2FsbGJhY2sgPSBrZXkgPT4ga2V5LnN0YXJ0c1dpdGgocHJlZml4KTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaGVzID0gW107XG4gICAgZm9yIChjb25zdCBbIGtleSwgdmFsdWUgXSBvZiB0aGlzLml0ZW1zKSB7XG4gICAgICBpZiAoY2FsbGJhY2suYXBwbHkodGhpc0FyZywgWyBrZXkgXSkpIHtcbiAgICAgICAgbWF0Y2hlcy5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXM7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIFsgLi4udGhpcy5pdGVtcyBdO1xuICB9XG5cbiAgX2NsZWFyKCkge1xuICAgIHRoaXMuaXRlbXMuY2xlYXIoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeTtcbiJdfQ==