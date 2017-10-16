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

var _languageHelpers = require('./language-helpers');

var helpers = _interopRequireWildcard(_languageHelpers);

var _natural = require('natural');

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
            return 1 - (0, _natural.JaroWinklerDistance)(text, suggestion);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2RpY3Rpb25hcnktbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsUUFBUTs7SUFBZixDQUFDOzsrQkFDWSxvQkFBb0I7O0lBQWpDLE9BQU87O3VCQUNpQixTQUFTOztvQkFDRyxNQUFNOztBQUx0RCxXQUFXLENBQUE7O0lBT1UsaUJBQWlCO1lBQWpCLGlCQUFpQjs7QUFDeEIsV0FETyxpQkFBaUIsR0FDckI7MEJBREksaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixZQUFNO0FBQ1YsWUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDMUIsWUFBSyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixZQUFLLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0tBQzdCLEVBQUM7Ozs7QUFDRixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDN0I7O2VBVmtCLGlCQUFpQjs7V0FZekIsb0JBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDeEMsVUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTs7QUFFeEYsVUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLFdBQUssSUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QyxZQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJ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QUFBO1NBQ3BDO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztXQUVxQixpQ0FBRztBQUN2QixVQUFJLFNBQVMsR0FBRyxFQUFFLENBQUE7QUFDbEIsV0FBSyxJQUFNLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3pDLFlBQUksVUFBVSxDQUFDLFNBQVMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BQy9FO0FBQ0QsYUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzNCOzs7U0FuRmtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvZGljdGlvbmFyeS1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vbGFuZ3VhZ2UtaGVscGVycydcbmltcG9ydCB7IEphcm9XaW5rbGVyRGlzdGFuY2UgfSBmcm9tICduYXR1cmFsJ1xuaW1wb3J0IHsgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpY3Rpb25hcnlNYW5hZ2VyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5wcmltYXJpZXMgPSBuZXcgU2V0KClcbiAgICAgIHRoaXMuc2Vjb25kYXJpZXMgPSBuZXcgU2V0KClcbiAgICB9KVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5wcmltYXJpZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNlY29uZGFyaWVzID0gbmV3IFNldCgpXG4gIH1cblxuICBjaGVja1JhbmdlICh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIHJhbmdlKSB7XG4gICAgY29uc3Qgc2NvcGVzID0gdGV4dEVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydCkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIC8vIEZpbmQgdGhlIGZpcnN0IGRpY3Rpb25hcnkgdGhhdCBoYXMgdGhlIGNvcnJlY3QgZ3JhbW1hciBzY29wZXMgYW5kIHVuZGVyc3RhbmRzIGhvdyB0byBkbyB3b3JrIGJyZWFrcyBvZXNuIHRoZSBwcmltYXJ5IGxhbmd1YWdlXG4gICAgbGV0IHByaW1hcnlcbiAgICBmb3IgKGNvbnN0IGRpY3Rpb25hcnkgb2YgdGhpcy5wcmltYXJpZXMpIHtcbiAgICAgIGlmICgoIWRpY3Rpb25hcnkuZ3JhbW1hclNjb3BlcyB8fCBkaWN0aW9uYXJ5LmdyYW1tYXJTY29wZXMuaW5jbHVkZXMoJyonKSB8fCBfLnNvbWUoZGljdGlvbmFyeS5ncmFtbWFyU2NvcGVzLCBzY29wZSA9PiBzY29wZXMuaW5jbHVkZXMoc2NvcGUpKSkgJiZcbiAgICAgICAgKGRpY3Rpb25hcnkubGFuZ3VhZ2VzICYmIF8uc29tZShfLm1hcChkaWN0aW9uYXJ5Lmxhbmd1YWdlcywgaGVscGVycy5wYXJzZVJhbmdlKSwgcmFuZ2UgPT4gaGVscGVycy5yYW5nZU1hdGNoZXMocmFuZ2UsIGxhbmd1YWdlc1swXSkpKSkge1xuICAgICAgICBwcmltYXJ5ID0gZGljdGlvbmFyeVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiB3ZSBjYW5ub3QgZmluZCBhIHByaW1hcnkgZGljdGlvbmFyeSB0aGVuIGdpdmUgdXBcbiAgICBpZiAoIXByaW1hcnkpIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUoW10pKVxuXG4gICAgbGV0IHNlY29uZGFyaWVzID0gW11cbiAgICAvLyBGaW5kIGFsbCBvdGhlciBkaWN0aW9uYXJpZXMgZXhjbHVkaW5nIHRoZSBwcmltYXJ5XG4gICAgZm9yIChjb25zdCBkaWN0aW9uYXJ5IG9mIHRoaXMuc2Vjb25kYXJpZXMpIHtcbiAgICAgIGlmIChkaWN0aW9uYXJ5ICE9PSBwcmltYXJ5ICYmXG4gICAgICAgICghZGljdGlvbmFyeS5ncmFtbWFyU2NvcGVzIHx8IGRpY3Rpb25hcnkuZ3JhbW1hclNjb3Blcy5pbmNsdWRlcygnKicpIHx8IF8uc29tZShkaWN0aW9uYXJ5LmdyYW1tYXJTY29wZXMsIHNjb3BlID0+IHNjb3Blcy5pbmNsdWRlcyhzY29wZSkpKSAmJlxuICAgICAgICAoIWRpY3Rpb25hcnkubGFuZ3VhZ2VzIHx8IGRpY3Rpb25hcnkubGFuZ3VhZ2VzLmluY2x1ZGVzKCcqJykgfHwgXy5zb21lKF8ubWFwKGRpY3Rpb25hcnkubGFuZ3VhZ2VzLCBoZWxwZXJzLnBhcnNlUmFuZ2UpLCByYW5nZSA9PiBfLnNvbWUobGFuZ3VhZ2VzLCB0YWcgPT4gaGVscGVycy5yYW5nZU1hdGNoZXMocmFuZ2UsIHRhZykpKSkpIHtcbiAgICAgICAgc2Vjb25kYXJpZXMucHVzaChkaWN0aW9uYXJ5KVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjaGVja01pc3NwZWxsaW5nID0gbWlzc3BlbGxpbmcgPT4ge1xuICAgICAgcmV0dXJuIFByb21pc2VcbiAgICAgICAgLmFsbChfLm1hcChzZWNvbmRhcmllcywgZGljdGlvbmFyeSA9PiBkaWN0aW9uYXJ5LmNoZWNrV29yZCh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIG1pc3NwZWxsaW5nLnJhbmdlKSkpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UobWlzc3BlbGxpbmcucmFuZ2UpXG4gICAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHJhbmdlOiBtaXNzcGVsbGluZy5yYW5nZSxcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiBtaXNzcGVsbGluZy5zdWdnZXN0aW9ucyB8fCBbXSxcbiAgICAgICAgICAgIGFjdGlvbnM6IG1pc3NwZWxsaW5nLmFjdGlvbnMgfHwgW11cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChjb25zdCByZXNwIG9mIHJlc3BvbnNlcykge1xuICAgICAgICAgICAgaWYgKHJlc3AuaXNXb3JkKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAocmVzcC5zdWdnZXN0aW9ucykgcmVzdWx0LnN1Z2dlc3Rpb25zID0gXy51bmlvbihyZXN1bHQuc3VnZ2VzdGlvbnMsIHJlc3Auc3VnZ2VzdGlvbnMpXG4gICAgICAgICAgICBpZiAocmVzcC5hY3Rpb25zKSByZXN1bHQuYWN0aW9ucyA9IF8uY29uY2F0KHJlc3VsdC5hY3Rpb25zLCByZXNwLmFjdGlvbnMpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5zdWdnZXN0aW9ucyA9IF8uc29ydEJ5KHJlc3VsdC5zdWdnZXN0aW9ucywgc3VnZ2VzdGlvbiA9PiAxIC0gSmFyb1dpbmtsZXJEaXN0YW5jZSh0ZXh0LCBzdWdnZXN0aW9uKSlcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHByaW1hcnkuY2hlY2tSYW5nZSh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIHJhbmdlKVxuICAgICAgLnRoZW4obWlzc3BlbGxpbmdzID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKF8ubWFwKG1pc3NwZWxsaW5ncywgY2hlY2tNaXNzcGVsbGluZykpLnRoZW4oXG4gICAgICAgICAgcmVzdWx0cyA9PiBfLmZpbHRlcihyZXN1bHRzKSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdW1lRGljdGlvbmFyeSAoZGljdGlvbmFyaWVzKSB7XG4gICAgZGljdGlvbmFyaWVzID0gXy5jYXN0QXJyYXkoZGljdGlvbmFyaWVzKVxuICAgIGZvciAoY29uc3QgZGljdGlvbmFyeSBvZiBkaWN0aW9uYXJpZXMpIHtcbiAgICAgIGlmIChkaWN0aW9uYXJ5LmNoZWNrUmFuZ2UpIHRoaXMucHJpbWFyaWVzLmFkZChkaWN0aW9uYXJ5KVxuICAgICAgdGhpcy5zZWNvbmRhcmllcy5hZGQoZGljdGlvbmFyeSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZGljdGlvbmFyeSBvZiBkaWN0aW9uYXJpZXMpIHtcbiAgICAgICAgaWYgKGRpY3Rpb25hcnkuY2hlY2tSYW5nZSkgdGhpcy5wcmltYXJpZXMuZGVsZXRlKGRpY3Rpb25hcnkpXG4gICAgICAgIHRoaXMuc2Vjb25kYXJpZXMuZGVsZXRlKGRpY3Rpb25hcnkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldEF2YWlsYWJsZUxhbmd1YWdlcyAoKSB7XG4gICAgbGV0IGxhbmd1YWdlcyA9IFtdXG4gICAgZm9yIChjb25zdCBkaWN0aW9uYXJ5IG9mIHRoaXMuc2Vjb25kYXJpZXMpIHtcbiAgICAgIGlmIChkaWN0aW9uYXJ5Lmxhbmd1YWdlcykgbGFuZ3VhZ2VzID0gXy51bmlvbihsYW5ndWFnZXMsIGRpY3Rpb25hcnkubGFuZ3VhZ2VzKVxuICAgIH1cbiAgICByZXR1cm4gXy5zb3J0QnkobGFuZ3VhZ2VzKVxuICB9XG59XG4iXX0=