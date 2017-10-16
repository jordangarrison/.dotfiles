Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var ImportView = (function (_SelectListView) {
  _inherits(ImportView, _SelectListView);

  function ImportView() {
    _classCallCheck(this, ImportView);

    _get(Object.getPrototypeOf(ImportView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ImportView, [{
    key: 'initialize',
    value: function initialize(items) {
      _get(Object.getPrototypeOf(ImportView.prototype), 'initialize', this).call(this);
      this.setItems(items);
      this.storeFocusedElement();

      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.show();
      this.focusFilterEditor();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(item) {
      return '<li>\n      <span class="icon icon-repo-force-push"> </span>\n      <span class="text-success">' + item + '</span>\n    </li>';
    }
  }, {
    key: 'getSelection',
    value: function getSelection() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.resolvefn = resolve;
        _this.rejectfn = reject;
      });
    }
  }, {
    key: 'confirmed',
    value: function confirmed(item) {
      this.resolvefn && this.resolvefn(item);
      this.rejectfn = this.resolvefn = undefined;
      this.cancel();
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.rejectfn && this.rejectfn();
      this.panel.hide();
    }
  }]);

  return ImportView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ImportView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWltcG9ydC13aXovbGliL2ltcG9ydC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztpQ0FFK0Isc0JBQXNCOztBQUZyRCxXQUFXLENBQUM7O0lBSU4sVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUVKLG9CQUFDLEtBQUssRUFBRTtBQUNoQixpQ0FIRSxVQUFVLDRDQUdPO0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRTNCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0tBQzFCOzs7V0FFVSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsaUhBRStCLElBQUksd0JBQzVCO0tBQ1I7OztXQUVXLHdCQUFHOzs7QUFDYixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxjQUFLLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDekIsY0FBSyxRQUFRLEdBQUcsTUFBTSxDQUFDO09BQ3hCLENBQUMsQ0FBQztLQUNKOzs7V0FFUSxtQkFBQyxJQUFJLEVBQUU7QUFDZCxVQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQyxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRVEscUJBQUc7QUFDVixVQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNqQyxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ25COzs7U0FuQ0csVUFBVTs7O3FCQXNDRCxVQUFVIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWltcG9ydC13aXovbGliL2ltcG9ydC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFNlbGVjdExpc3RWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5jbGFzcyBJbXBvcnRWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXcge1xuXG4gIGluaXRpYWxpemUoaXRlbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zZXRJdGVtcyhpdGVtcyk7XG4gICAgdGhpcy5zdG9yZUZvY3VzZWRFbGVtZW50KCk7XG5cbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMgfSk7XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICB9XG5cbiAgdmlld0Zvckl0ZW0oaXRlbSkge1xuICAgIHJldHVybiBgPGxpPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGljb24tcmVwby1mb3JjZS1wdXNoXCI+IDwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHtpdGVtfTwvc3Bhbj5cbiAgICA8L2xpPmA7XG4gIH1cblxuICBnZXRTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzb2x2ZWZuID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMucmVqZWN0Zm4gPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cblxuICBjb25maXJtZWQoaXRlbSkge1xuICAgIHRoaXMucmVzb2x2ZWZuICYmIHRoaXMucmVzb2x2ZWZuKGl0ZW0pO1xuICAgIHRoaXMucmVqZWN0Zm4gPSB0aGlzLnJlc29sdmVmbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICB9XG5cbiAgY2FuY2VsbGVkKCkge1xuICAgIHRoaXMucmVqZWN0Zm4gJiYgdGhpcy5yZWplY3RmbigpO1xuICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEltcG9ydFZpZXc7XG4iXX0=