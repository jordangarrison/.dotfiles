Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

'use babel';

var tags = require('language-tags');

var LanguageListView = (function (_SelectListView) {
  _inherits(LanguageListView, _SelectListView);

  function LanguageListView() {
    _classCallCheck(this, LanguageListView);

    _get(Object.getPrototypeOf(LanguageListView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(LanguageListView, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(LanguageListView.prototype), 'initialize', this).call(this);

      this.panel = atom.workspace.addModalPanel({ item: this, visible: false });
      this.addClass('language-selector');
      return this.list.addClass('mark-active');
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      return 'value';
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(language) {
      var element = document.createElement('li');
      if (language.id === this.currentLanguage || !language.id && !this.currentLanguage) {
        element.classList.add('active');
      }
      element.textContent = language.value;
      element.dataset.language = language.id;
      return element;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.panel.isVisible()) {
        return this.cancel();
      } else {
        this.editor = atom.workspace.getActiveTextEditor();
        if (this.editor) {
          return this.attach();
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this.panel.destroy();
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      return this.panel.hide();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(language) {
      this.cancel();
      global.languageManager.setLanguages(this.editor, language.id ? [language.id] : null, 'manual');
    }
  }, {
    key: 'addLanguages',
    value: function addLanguages() {
      this.currentLanguage = global.languageManager.getLanguages(this.editor, 'manual');
      if (this.currentLanguage) this.currentLanguage = this.currentLanguage[0];
      this.setItems(_.concat([{ id: null, value: 'Auto-Select' }], _.map(global.dictionaryManager.getAvailableLanguages(), function (lang) {
        return {
          id: lang,
          value: lang + ' / ' + _.map(tags(lang).subtags(), function (subtag) {
            return subtag.descriptions()[0];
          }).join(', ')
        };
      })));
    }
  }, {
    key: 'attach',
    value: function attach() {
      this.storeFocusedElement();
      this.addLanguages();
      this.panel.show();
      this.focusFilterEditor();
    }
  }]);

  return LanguageListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = LanguageListView;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2xhbmd1YWdlLWxpc3Qtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztpQ0FFK0Isc0JBQXNCOztzQkFFbEMsUUFBUTs7SUFBZixDQUFDOztBQUpiLFdBQVcsQ0FBQTs7QUFHWCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7O0lBR2QsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7O1dBQ3hCLHNCQUFHO0FBQ1osaUNBRmlCLGdCQUFnQiw0Q0FFZjs7QUFFbEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7QUFDdkUsVUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ2xDLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDekM7OztXQUVZLHdCQUFHO0FBQ2QsYUFBTyxPQUFPLENBQUE7S0FDZjs7O1dBRVcscUJBQUMsUUFBUSxFQUFFO0FBQ3JCLFVBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDMUMsVUFBSSxRQUFRLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxlQUFlLElBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQUFBQyxFQUFFO0FBQUUsZUFBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7T0FBRTtBQUN4SCxhQUFPLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUE7QUFDcEMsYUFBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQTtBQUN0QyxhQUFPLE9BQU8sQ0FBQTtLQUNmOzs7V0FFTSxrQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUMxQixlQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUNyQixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbEQsWUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsaUJBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1NBQ3JCO09BQ0Y7S0FDRjs7O1dBRU8sbUJBQUc7QUFDVCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDNUI7OztXQUVTLHFCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ3pCOzs7V0FFUyxtQkFBQyxRQUFRLEVBQUU7QUFDbkIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2IsWUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMvRjs7O1dBRVksd0JBQUc7QUFDZCxVQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDakYsVUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4RSxVQUFJLENBQUMsUUFBUSxDQUNYLENBQUMsQ0FBQyxNQUFNLENBQ04sQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQ3BDLENBQUMsQ0FBQyxHQUFHLENBQ0gsTUFBTSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLEVBQ2hELFVBQUEsSUFBSTtlQUFLO0FBQ1AsWUFBRSxFQUFFLElBQUk7QUFDUixlQUFLLEVBQUUsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxVQUFBLE1BQU07bUJBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2pHO09BQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNaOzs7V0FFTSxrQkFBRztBQUNSLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQzFCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0tBQ3pCOzs7U0FoRWtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0I7QUFpRXBDLENBQUMiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvbGFuZ3VhZ2UtbGlzdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgU2VsZWN0TGlzdFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnZhciB0YWdzID0gcmVxdWlyZSgnbGFuZ3VhZ2UtdGFncycpXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFuZ3VhZ2VMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3IHtcbiAgaW5pdGlhbGl6ZSAoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpXG5cbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7aXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2V9KVxuICAgIHRoaXMuYWRkQ2xhc3MoJ2xhbmd1YWdlLXNlbGVjdG9yJylcbiAgICByZXR1cm4gdGhpcy5saXN0LmFkZENsYXNzKCdtYXJrLWFjdGl2ZScpXG4gIH1cblxuICBnZXRGaWx0ZXJLZXkgKCkge1xuICAgIHJldHVybiAndmFsdWUnXG4gIH1cblxuICB2aWV3Rm9ySXRlbSAobGFuZ3VhZ2UpIHtcbiAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICBpZiAobGFuZ3VhZ2UuaWQgPT09IHRoaXMuY3VycmVudExhbmd1YWdlIHx8ICghbGFuZ3VhZ2UuaWQgJiYgIXRoaXMuY3VycmVudExhbmd1YWdlKSkgeyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpIH1cbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gbGFuZ3VhZ2UudmFsdWVcbiAgICBlbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UgPSBsYW5ndWFnZS5pZFxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICB0b2dnbGUgKCkge1xuICAgIGlmICh0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW5jZWwoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dGFjaCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gIH1cblxuICBjYW5jZWxsZWQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmhpZGUoKVxuICB9XG5cbiAgY29uZmlybWVkIChsYW5ndWFnZSkge1xuICAgIHRoaXMuY2FuY2VsKClcbiAgICBnbG9iYWwubGFuZ3VhZ2VNYW5hZ2VyLnNldExhbmd1YWdlcyh0aGlzLmVkaXRvciwgbGFuZ3VhZ2UuaWQgPyBbbGFuZ3VhZ2UuaWRdIDogbnVsbCwgJ21hbnVhbCcpXG4gIH1cblxuICBhZGRMYW5ndWFnZXMgKCkge1xuICAgIHRoaXMuY3VycmVudExhbmd1YWdlID0gZ2xvYmFsLmxhbmd1YWdlTWFuYWdlci5nZXRMYW5ndWFnZXModGhpcy5lZGl0b3IsICdtYW51YWwnKVxuICAgIGlmICh0aGlzLmN1cnJlbnRMYW5ndWFnZSkgdGhpcy5jdXJyZW50TGFuZ3VhZ2UgPSB0aGlzLmN1cnJlbnRMYW5ndWFnZVswXVxuICAgIHRoaXMuc2V0SXRlbXMoXG4gICAgICBfLmNvbmNhdChcbiAgICAgICAgW3sgaWQ6IG51bGwsIHZhbHVlOiAnQXV0by1TZWxlY3QnIH1dLFxuICAgICAgICBfLm1hcChcbiAgICAgICAgICBnbG9iYWwuZGljdGlvbmFyeU1hbmFnZXIuZ2V0QXZhaWxhYmxlTGFuZ3VhZ2VzKCksXG4gICAgICAgICAgbGFuZyA9PiAoe1xuICAgICAgICAgICAgaWQ6IGxhbmcsXG4gICAgICAgICAgICB2YWx1ZTogbGFuZyArICcgLyAnICsgXy5tYXAodGFncyhsYW5nKS5zdWJ0YWdzKCksIHN1YnRhZyA9PiBzdWJ0YWcuZGVzY3JpcHRpb25zKClbMF0pLmpvaW4oJywgJylcbiAgICAgICAgICB9KSkpKVxuICB9XG5cbiAgYXR0YWNoICgpIHtcbiAgICB0aGlzLnN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIHRoaXMuYWRkTGFuZ3VhZ2VzKClcbiAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgIHRoaXMuZm9jdXNGaWx0ZXJFZGl0b3IoKVxuICB9XG59O1xuIl19