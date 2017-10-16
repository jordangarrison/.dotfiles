Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _atom = require('atom');

'use babel';

var GrammarManager = (function (_Disposable) {
  _inherits(GrammarManager, _Disposable);

  function GrammarManager() {
    _classCallCheck(this, GrammarManager);

    _get(Object.getPrototypeOf(GrammarManager.prototype), 'constructor', this).call(this, function () {
      _this.disposables.dispose();
      _this.grammars = new Set();
      _this.grammarMap = new Map();
      _this.checkedScopes = new Map();
    });

    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    this.grammars = new Set();
    this.grammarMap = new Map();
    this.checkedScopes = new Map();
  }

  _createClass(GrammarManager, [{
    key: 'getGrammar',
    value: function getGrammar(textEditor) {
      return this.grammarMap.get(textEditor.getGrammar().scopeName);
    }
  }, {
    key: 'getEmbeddedGrammar',
    value: function getEmbeddedGrammar(scopeDescriptor) {
      var path = scopeDescriptor.getScopesArray().slice(1);
      var i = path.length;
      while (i--) {
        var grammar = this.grammarMap.get(path[i]);
        if (grammar) return grammar;
      }
    }
  }, {
    key: 'updateLanguage',
    value: function updateLanguage(textEditor) {
      var grammar = this.getGrammar(textEditor);
      if (grammar && grammar.findLanguageTags) {
        var l = grammar.findLanguageTags(textEditor);
        global.languageManager.setLanguages(textEditor, l && l.length > 0 ? l : null, 'auto');
      }
    }
  }, {
    key: 'isIgnored',
    value: function isIgnored(scopeDescriptor) {
      var path = scopeDescriptor.getScopesArray();
      var i = path.length;
      while (i--) {
        if (this.checkedScopes.has(path[i])) {
          var v = this.checkedScopes.get(path[i]);
          return !(_.isFunction(v) ? v() : v);
        }
      }
      return true;
    }
  }, {
    key: 'consumeGrammar',
    value: function consumeGrammar(grammars) {
      var _this2 = this;

      grammars = _.castArray(grammars);
      for (var grammar of grammars) {
        this.grammars.add(grammar);
        for (var scope of grammar.grammarScopes) {
          this.grammarMap.set(scope, grammar);
        }
        if (grammar.checkedScopes) {
          _.forEach(grammar.checkedScopes, function (value, key) {
            return _this2.checkedScopes.set(key, value);
          });
        } else {
          _.forEach(grammar.grammarScopes, function (key) {
            return _this2.checkedScopes.set(key, true);
          });
        }
      }
      var textEditor = atom.workspace.getActiveTextEditor();
      if (textEditor) global.languageManager.getLanguages(textEditor);
      // global.languageManager.updateDictionaries
      return new _atom.Disposable(function () {
        for (var grammar of grammars) {
          _this2.grammars['delete'](grammar);
          for (var scope of grammar.grammarScopes) {
            _this2.grammarMap['delete'](scope);
          }
          if (grammar.checkedScopes) {
            _.forEach(grammar.checkedScopes, function (value, key) {
              return _this2.checkedScopes['delete'](key);
            });
          } else {
            _.forEach(grammar.grammarScopes, function (key) {
              return _this2.checkedScopes['delete'](key);
            });
          }
        }
      });
    }
  }]);

  return GrammarManager;
})(_atom.Disposable);

exports['default'] = GrammarManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2dyYW1tYXItbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsUUFBUTs7SUFBZixDQUFDOztvQkFDbUMsTUFBTTs7QUFIdEQsV0FBVyxDQUFBOztJQUtVLGNBQWM7WUFBZCxjQUFjOztBQUNyQixXQURPLGNBQWMsR0FDbEI7MEJBREksY0FBYzs7QUFFL0IsK0JBRmlCLGNBQWMsNkNBRXpCLFlBQU07QUFDVixZQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixZQUFLLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFlBQUssVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDM0IsWUFBSyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtLQUMvQixFQUFDOzs7O0FBQ0YsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQTtBQUM1QyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDekIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzNCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtHQUMvQjs7ZUFaa0IsY0FBYzs7V0FjdEIsb0JBQUMsVUFBVSxFQUFFO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzlEOzs7V0FFa0IsNEJBQUMsZUFBZSxFQUFFO0FBQ25DLFVBQUksSUFBSSxHQUFHLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEQsVUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUNuQixhQUFPLENBQUMsRUFB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LENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBQyxLQUFLLEVBQUUsR0FBRztxQkFBSyxPQUFLLGFBQWEsVUFBTyxDQUFDLEdBQUcsQ0FBQzthQUFBLENBQUMsQ0FBQTtXQUNqRixNQUFNO0FBQ0wsYUFBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQUEsR0FBRztxQkFBSSxPQUFLLGFBQWEsVUFBTyxDQUFDLEdBQUcsQ0FBQzthQUFBLENBQUMsQ0FBQTtXQUN4RTtTQUNGO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztTQTVFa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvZ3JhbW1hci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhbW1hck1hbmFnZXIgZXh0ZW5kcyBEaXNwb3NhYmxlIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCgpID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICB0aGlzLmdyYW1tYXJzID0gbmV3IFNldCgpXG4gICAgICB0aGlzLmdyYW1tYXJNYXAgPSBuZXcgTWFwKClcbiAgICAgIHRoaXMuY2hlY2tlZFNjb3BlcyA9IG5ldyBNYXAoKVxuICAgIH0pXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmdyYW1tYXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5ncmFtbWFyTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5jaGVja2VkU2NvcGVzID0gbmV3IE1hcCgpXG4gIH1cblxuICBnZXRHcmFtbWFyICh0ZXh0RWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hck1hcC5nZXQodGV4dEVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKVxuICB9XG5cbiAgZ2V0RW1iZWRkZWRHcmFtbWFyIChzY29wZURlc2NyaXB0b3IpIHtcbiAgICBsZXQgcGF0aCA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpLnNsaWNlKDEpXG4gICAgbGV0IGkgPSBwYXRoLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGNvbnN0IGdyYW1tYXIgPSB0aGlzLmdyYW1tYXJNYXAuZ2V0KHBhdGhbaV0pXG4gICAgICBpZiAoZ3JhbW1hcikgcmV0dXJuIGdyYW1tYXJcbiAgICB9XG4gIH1cblxuICB1cGRhdGVMYW5ndWFnZSAodGV4dEVkaXRvcikge1xuICAgIGNvbnN0IGdyYW1tYXIgPSB0aGlzLmdldEdyYW1tYXIodGV4dEVkaXRvcilcbiAgICBpZiAoZ3JhbW1hciAmJiBncmFtbWFyLmZpbmRMYW5ndWFnZVRhZ3MpIHtcbiAgICAgIGNvbnN0IGwgPSBncmFtbWFyLmZpbmRMYW5ndWFnZVRhZ3ModGV4dEVkaXRvcilcbiAgICAgIGdsb2JhbC5sYW5ndWFnZU1hbmFnZXIuc2V0TGFuZ3VhZ2VzKHRleHRFZGl0b3IsIChsICYmIGwubGVuZ3RoID4gMCkgPyBsIDogbnVsbCwgJ2F1dG8nKVxuICAgIH1cbiAgfVxuXG4gIGlzSWdub3JlZCAoc2NvcGVEZXNjcmlwdG9yKSB7XG4gICAgbGV0IHBhdGggPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIGxldCBpID0gcGF0aC5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAodGhpcy5jaGVja2VkU2NvcGVzLmhhcyhwYXRoW2ldKSkge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy5jaGVja2VkU2NvcGVzLmdldChwYXRoW2ldKVxuICAgICAgICByZXR1cm4gIShfLmlzRnVuY3Rpb24odikgPyB2KCkgOiB2KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY29uc3VtZUdyYW1tYXIgKGdyYW1tYXJzKSB7XG4gICAgZ3JhbW1hcnMgPSBfLmNhc3RBcnJheShncmFtbWFycylcbiAgICBmb3IgKGNvbnN0IGdyYW1tYXIgb2YgZ3JhbW1hcnMpIHtcbiAgICAgIHRoaXMuZ3JhbW1hcnMuYWRkKGdyYW1tYXIpXG4gICAgICBmb3IgKGNvbnN0IHNjb3BlIG9mIGdyYW1tYXIuZ3JhbW1hclNjb3Blcykge1xuICAgICAgICB0aGlzLmdyYW1tYXJNYXAuc2V0KHNjb3BlLCBncmFtbWFyKVxuICAgICAgfVxuICAgICAgaWYgKGdyYW1tYXIuY2hlY2tlZFNjb3Blcykge1xuICAgICAgICBfLmZvckVhY2goZ3JhbW1hci5jaGVja2VkU2NvcGVzLCAodmFsdWUsIGtleSkgPT4gdGhpcy5jaGVja2VkU2NvcGVzLnNldChrZXksIHZhbHVlKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZm9yRWFjaChncmFtbWFyLmdyYW1tYXJTY29wZXMsIGtleSA9PiB0aGlzLmNoZWNrZWRTY29wZXMuc2V0KGtleSwgdHJ1ZSkpXG4gICAgICB9XG4gICAgfVxuICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKHRleHRFZGl0b3IpIGdsb2JhbC5sYW5ndWFnZU1hbmFnZXIuZ2V0TGFuZ3VhZ2VzKHRleHRFZGl0b3IpXG4gICAgLy8gZ2xvYmFsLmxhbmd1YWdlTWFuYWdlci51cGRhdGVEaWN0aW9uYXJpZXNcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBncmFtbWFyIG9mIGdyYW1tYXJzKSB7XG4gICAgICAgIHRoaXMuZ3JhbW1hcnMuZGVsZXRlKGdyYW1tYXIpXG4gICAgICAgIGZvciAoY29uc3Qgc2NvcGUgb2YgZ3JhbW1hci5ncmFtbWFyU2NvcGVzKSB7XG4gICAgICAgICAgdGhpcy5ncmFtbWFyTWFwLmRlbGV0ZShzY29wZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ3JhbW1hci5jaGVja2VkU2NvcGVzKSB7XG4gICAgICAgICAgXy5mb3JFYWNoKGdyYW1tYXIuY2hlY2tlZFNjb3BlcywgKHZhbHVlLCBrZXkpID0+IHRoaXMuY2hlY2tlZFNjb3Blcy5kZWxldGUoa2V5KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLmZvckVhY2goZ3JhbW1hci5ncmFtbWFyU2NvcGVzLCBrZXkgPT4gdGhpcy5jaGVja2VkU2NvcGVzLmRlbGV0ZShrZXkpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19