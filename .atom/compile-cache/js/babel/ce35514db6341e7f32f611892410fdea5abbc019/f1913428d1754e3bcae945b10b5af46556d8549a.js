Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _languageHelpers = require('./language-helpers');

var helpers = _interopRequireWildcard(_languageHelpers);

var _jaroWinkler = require('jaro-winkler');

var _jaroWinkler2 = _interopRequireDefault(_jaroWinkler);

var _atom = require('atom');

'use babel';

var DictionaryManager = (function (_Disposable) {
  _inherits(DictionaryManager, _Disposable);

  function DictionaryManager() {
    _classCallCheck(this, DictionaryManager);

    _get(Object.getPrototypeOf(DictionaryManager.prototype), 'constructor', this).call(this, function () {
      _this.disposables.dispose();
      _this.primaries = new Set();
      _this.secondaries = new Set();
    });

    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    this.primaries = new Set();
    this.secondaries = new Set();
  }

  _createClass(DictionaryManager, [{
    key: 'checkRange',
    value: function checkRange(textEditor, languages, range) {
      var scopes = textEditor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
      // Find the first dictionary that has the correct grammar scopes and understands how to do work breaks oesn the primary language
      var primary = undefined;
      for (var dictionary of this.primaries) {
        if ((!dictionary.grammarScopes || dictionary.grammarScopes.includes('*') || _.some(dictionary.grammarScopes, function (scope) {
          return scopes.includes(scope);
        })) && dictionary.languages && _.some(_.map(dictionary.languages, helpers.parseRange), function (range) {
          return helpers.rangeMatches(range, languages[0]);
        })) {
          primary = dictionary;
          break;
        }
      }
      // if we cannot find a primary dictionary then give up
      if (!primary) return new Promise(function (resolve) {
        return resolve([]);
      });

      var secondaries = [];
      // Find all other dictionaries excluding the primary
      for (var dictionary of this.secondaries) {
        if (dictionary !== primary && (!dictionary.grammarScopes || dictionary.grammarScopes.includes('*') || _.some(dictionary.grammarScopes, function (scope) {
          return scopes.includes(scope);
        })) && (!dictionary.languages || dictionary.languages.includes('*') || _.some(_.map(dictionary.languages, helpers.parseRange), function (range) {
          return _.some(languages, function (tag) {
            return helpers.rangeMatches(range, tag);
          });
        }))) {
          secondaries.push(dictionary);
        }
      }

      var checkMisspelling = function checkMisspelling(misspelling) {
        return Promise.all(_.map(secondaries, function (dictionary) {
          return dictionary.checkWord(textEditor, languages, misspelling.range);
        })).then(function (responses) {
          var text = textEditor.getTextInBufferRange(misspelling.range);
          var result = {
            range: misspelling.range,
            suggestions: misspelling.suggestions || [],
            actions: misspelling.actions || []
          };
          for (var resp of responses) {
            if (resp.isWord) return undefined;
            if (resp.suggestions) result.suggestions = _.union(result.suggestions, resp.suggestions);
            if (resp.actions) result.actions = _.concat(result.actions, resp.actions);
          }
          result.suggestions = _.sortBy(result.suggestions, function (suggestion) {
            return 1 - (0, _jaroWinkler2['default'])(text, suggestion);
          });
          return result;
        });
      };

      return primary.checkRange(textEditor, languages, range).then(function (misspellings) {
        return Promise.all(_.map(misspellings, checkMisspelling)).then(function (results) {
          return _.filter(results);
        });
      });
    }
  }, {
    key: 'consumeDictionary',
    value: function consumeDictionary(dictionaries) {
      var _this2 = this;

      dictionaries = _.castArray(dictionaries);
      for (var dictionary of dictionaries) {
        if (dictionary.checkRange) this.primaries.add(dictionary);
        this.secondaries.add(dictionary);
      }
      return new _atom.Disposable(function () {
        for (var dictionary of dictionaries) {
          if (dictionary.checkRange) _this2.primaries['delete'](dictionary);
          _this2.secondaries['delete'](dictionary);
        }
      });
    }
  }, {
    key: 'getAvailableLanguages',
    value: function getAvailableLanguages() {
      var languages = [];
      for (var dictionary of this.secondaries) {
        if (dictionary.languages) languages = _.union(languages, dictionary.languages);
      }
      return _.sortBy(languages);
    }
  }]);

  return DictionaryManager;
})(_atom.Disposable);

exports['default'] = DictionaryManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2RpY3Rpb25hcnktbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixRQUFROztJQUFmLENBQUM7OytCQUNZLG9CQUFvQjs7SUFBakMsT0FBTzs7MkJBQ0ssY0FBYzs7OztvQkFDVSxNQUFNOztBQUx0RCxXQUFXLENBQUE7O0lBT1UsaUJBQWlCO1lBQWpCLGlCQUFpQjs7QUFDeEIsV0FETyxpQkFBaUIsR0FDckI7MEJBREksaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixZQUFNO0FBQ1YsWUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDMUIsWUFBSyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixZQUFLLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0tBQzdCLEVBQUM7Ozs7QUFDRixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDN0I7O2VBVmtCLGlCQUFpQjs7V0FZekIsb0JBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDeEMsVUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTs7QUFFeEYsVUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLFdBQUssSUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QyxZQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJ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LENBQUE7U0FDcEM7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBRXFCLGlDQUFHO0FBQ3ZCLFVBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQTtBQUNsQixXQUFLLElBQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDekMsWUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7T0FDL0U7QUFDRCxhQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7S0FDM0I7OztTQW5Ga0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGludGVyLXNwZWxsL2xpYi9kaWN0aW9uYXJ5LW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9sYW5ndWFnZS1oZWxwZXJzJ1xuaW1wb3J0IGphcm9XaW5rbGVyIGZyb20gJ2phcm8td2lua2xlcidcbmltcG9ydCB7IERpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWN0aW9uYXJ5TWFuYWdlciBleHRlbmRzIERpc3Bvc2FibGUge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgIHRoaXMucHJpbWFyaWVzID0gbmV3IFNldCgpXG4gICAgICB0aGlzLnNlY29uZGFyaWVzID0gbmV3IFNldCgpXG4gICAgfSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMucHJpbWFyaWVzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zZWNvbmRhcmllcyA9IG5ldyBTZXQoKVxuICB9XG5cbiAgY2hlY2tSYW5nZSAodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCByYW5nZSkge1xuICAgIGNvbnN0IHNjb3BlcyA9IHRleHRFZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24ocmFuZ2Uuc3RhcnQpLmdldFNjb3Blc0FycmF5KClcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBkaWN0aW9uYXJ5IHRoYXQgaGFzIHRoZSBjb3JyZWN0IGdyYW1tYXIgc2NvcGVzIGFuZCB1bmRlcnN0YW5kcyBob3cgdG8gZG8gd29yayBicmVha3Mgb2VzbiB0aGUgcHJpbWFyeSBsYW5ndWFnZVxuICAgIGxldCBwcmltYXJ5XG4gICAgZm9yIChjb25zdCBkaWN0aW9uYXJ5IG9mIHRoaXMucHJpbWFyaWVzKSB7XG4gICAgICBpZiAoKCFkaWN0aW9uYXJ5LmdyYW1tYXJTY29wZXMgfHwgZGljdGlvbmFyeS5ncmFtbWFyU2NvcGVzLmluY2x1ZGVzKCcqJykgfHwgXy5zb21lKGRpY3Rpb25hcnkuZ3JhbW1hclNjb3Blcywgc2NvcGUgPT4gc2NvcGVzLmluY2x1ZGVzKHNjb3BlKSkpICYmXG4gICAgICAgIChkaWN0aW9uYXJ5Lmxhbmd1YWdlcyAmJiBfLnNvbWUoXy5tYXAoZGljdGlvbmFyeS5sYW5ndWFnZXMsIGhlbHBlcnMucGFyc2VSYW5nZSksIHJhbmdlID0+IGhlbHBlcnMucmFuZ2VNYXRjaGVzKHJhbmdlLCBsYW5ndWFnZXNbMF0pKSkpIHtcbiAgICAgICAgcHJpbWFyeSA9IGRpY3Rpb25hcnlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgd2UgY2Fubm90IGZpbmQgYSBwcmltYXJ5IGRpY3Rpb25hcnkgdGhlbiBnaXZlIHVwXG4gICAgaWYgKCFwcmltYXJ5KSByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKFtdKSlcblxuICAgIGxldCBzZWNvbmRhcmllcyA9IFtdXG4gICAgLy8gRmluZCBhbGwgb3RoZXIgZGljdGlvbmFyaWVzIGV4Y2x1ZGluZyB0aGUgcHJpbWFyeVxuICAgIGZvciAoY29uc3QgZGljdGlvbmFyeSBvZiB0aGlzLnNlY29uZGFyaWVzKSB7XG4gICAgICBpZiAoZGljdGlvbmFyeSAhPT0gcHJpbWFyeSAmJlxuICAgICAgICAoIWRpY3Rpb25hcnkuZ3JhbW1hclNjb3BlcyB8fCBkaWN0aW9uYXJ5LmdyYW1tYXJTY29wZXMuaW5jbHVkZXMoJyonKSB8fCBfLnNvbWUoZGljdGlvbmFyeS5ncmFtbWFyU2NvcGVzLCBzY29wZSA9PiBzY29wZXMuaW5jbHVkZXMoc2NvcGUpKSkgJiZcbiAgICAgICAgKCFkaWN0aW9uYXJ5Lmxhbmd1YWdlcyB8fCBkaWN0aW9uYXJ5Lmxhbmd1YWdlcy5pbmNsdWRlcygnKicpIHx8IF8uc29tZShfLm1hcChkaWN0aW9uYXJ5Lmxhbmd1YWdlcywgaGVscGVycy5wYXJzZVJhbmdlKSwgcmFuZ2UgPT4gXy5zb21lKGxhbmd1YWdlcywgdGFnID0+IGhlbHBlcnMucmFuZ2VNYXRjaGVzKHJhbmdlLCB0YWcpKSkpKSB7XG4gICAgICAgIHNlY29uZGFyaWVzLnB1c2goZGljdGlvbmFyeSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY2hlY2tNaXNzcGVsbGluZyA9IG1pc3NwZWxsaW5nID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlXG4gICAgICAgIC5hbGwoXy5tYXAoc2Vjb25kYXJpZXMsIGRpY3Rpb25hcnkgPT4gZGljdGlvbmFyeS5jaGVja1dvcmQodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCBtaXNzcGVsbGluZy5yYW5nZSkpKVxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKG1pc3NwZWxsaW5nLnJhbmdlKVxuICAgICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICByYW5nZTogbWlzc3BlbGxpbmcucmFuZ2UsXG4gICAgICAgICAgICBzdWdnZXN0aW9uczogbWlzc3BlbGxpbmcuc3VnZ2VzdGlvbnMgfHwgW10sXG4gICAgICAgICAgICBhY3Rpb25zOiBtaXNzcGVsbGluZy5hY3Rpb25zIHx8IFtdXG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoY29uc3QgcmVzcCBvZiByZXNwb25zZXMpIHtcbiAgICAgICAgICAgIGlmIChyZXNwLmlzV29yZCkgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgaWYgKHJlc3Auc3VnZ2VzdGlvbnMpIHJlc3VsdC5zdWdnZXN0aW9ucyA9IF8udW5pb24ocmVzdWx0LnN1Z2dlc3Rpb25zLCByZXNwLnN1Z2dlc3Rpb25zKVxuICAgICAgICAgICAgaWYgKHJlc3AuYWN0aW9ucykgcmVzdWx0LmFjdGlvbnMgPSBfLmNvbmNhdChyZXN1bHQuYWN0aW9ucywgcmVzcC5hY3Rpb25zKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQuc3VnZ2VzdGlvbnMgPSBfLnNvcnRCeShyZXN1bHQuc3VnZ2VzdGlvbnMsIHN1Z2dlc3Rpb24gPT4gMSAtIGphcm9XaW5rbGVyKHRleHQsIHN1Z2dlc3Rpb24pKVxuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gcHJpbWFyeS5jaGVja1JhbmdlKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgcmFuZ2UpXG4gICAgICAudGhlbihtaXNzcGVsbGluZ3MgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXy5tYXAobWlzc3BlbGxpbmdzLCBjaGVja01pc3NwZWxsaW5nKSkudGhlbihcbiAgICAgICAgICByZXN1bHRzID0+IF8uZmlsdGVyKHJlc3VsdHMpKVxuICAgICAgfSlcbiAgfVxuXG4gIGNvbnN1bWVEaWN0aW9uYXJ5IChkaWN0aW9uYXJpZXMpIHtcbiAgICBkaWN0aW9uYXJpZXMgPSBfLmNhc3RBcnJheShkaWN0aW9uYXJpZXMpXG4gICAgZm9yIChjb25zdCBkaWN0aW9uYXJ5IG9mIGRpY3Rpb25hcmllcykge1xuICAgICAgaWYgKGRpY3Rpb25hcnkuY2hlY2tSYW5nZSkgdGhpcy5wcmltYXJpZXMuYWRkKGRpY3Rpb25hcnkpXG4gICAgICB0aGlzLnNlY29uZGFyaWVzLmFkZChkaWN0aW9uYXJ5KVxuICAgIH1cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBkaWN0aW9uYXJ5IG9mIGRpY3Rpb25hcmllcykge1xuICAgICAgICBpZiAoZGljdGlvbmFyeS5jaGVja1JhbmdlKSB0aGlzLnByaW1hcmllcy5kZWxldGUoZGljdGlvbmFyeSlcbiAgICAgICAgdGhpcy5zZWNvbmRhcmllcy5kZWxldGUoZGljdGlvbmFyeSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0QXZhaWxhYmxlTGFuZ3VhZ2VzICgpIHtcbiAgICBsZXQgbGFuZ3VhZ2VzID0gW11cbiAgICBmb3IgKGNvbnN0IGRpY3Rpb25hcnkgb2YgdGhpcy5zZWNvbmRhcmllcykge1xuICAgICAgaWYgKGRpY3Rpb25hcnkubGFuZ3VhZ2VzKSBsYW5ndWFnZXMgPSBfLnVuaW9uKGxhbmd1YWdlcywgZGljdGlvbmFyeS5sYW5ndWFnZXMpXG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShsYW5ndWFnZXMpXG4gIH1cbn1cbiJdfQ==