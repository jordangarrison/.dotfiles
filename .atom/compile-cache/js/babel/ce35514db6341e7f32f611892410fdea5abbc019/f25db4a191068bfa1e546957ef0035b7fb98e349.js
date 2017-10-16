Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _languageHelpers = require('./language-helpers');

var helpers = _interopRequireWildcard(_languageHelpers);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _likelySubtags = require('./likely-subtags');

var likelySubtags = _interopRequireWildcard(_likelySubtags);

var _atom = require('atom');

var _spell = require('./spell');

'use babel';

var DictionaryProvider = (function (_Disposable) {
  _inherits(DictionaryProvider, _Disposable);

  function DictionaryProvider() {
    var _this2 = this;

    _classCallCheck(this, DictionaryProvider);

    _get(Object.getPrototypeOf(DictionaryProvider.prototype), 'constructor', this).call(this, function () {
      _this.disposables.dispose();
      _this.checkers = new Map();
    });

    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    this.checkers = new Map();
    this.dictionaries = new Map();
    atom.config.onDidChange('linter-spell.spellPath', function () {
      _this2.checkers = new Map();
      _this2.updateDictionaries();
    });
    this.provider = {
      name: 'Ispell dictionary',
      languages: this.getAvailableLanguages(),
      checkRange: function checkRange(textEditor, languages, range) {
        var checker = _this2.getChecker(languages);
        if (!checker) return [];
        return checker.getMisspellings(textEditor, range).then(function (misspellings) {
          return _.map(misspellings, function (misspelling) {
            var word = textEditor.getTextInBufferRange(misspelling.range);
            var upperCase = word.toLowerCase() !== word;

            var result = {
              range: misspelling.range,
              suggestions: misspelling.suggestions,
              actions: [{
                title: 'Ignore',
                apply: function apply() {
                  return checker.ignoreWord(word, false);
                }
              }]
            };

            if (upperCase) {
              result.actions.push({
                title: 'Ignore (case sensitive)',
                apply: function apply() {
                  return checker.ignoreWord(word, true);
                }
              });
            }

            result.actions.push({
              title: 'Add to personal dictionary',
              apply: function apply() {
                return checker.addWord(word, false);
              }
            });

            if (upperCase) {
              result.actions.push({
                title: 'Add to personal dictionary (case sensitive)',
                apply: function apply() {
                  return checker.addWord(word, true);
                }
              });
            }

            return result;
          });
        });
      },
      checkWord: function checkWord(textEditor, languages, range) {
        var checker = _this2.getChecker(languages);
        if (!checker) return { isWord: false };
        var word = textEditor.getTextInBufferRange(range);
        return checker.getMisspellings(textEditor, range).then(function (misspellings) {
          return misspellings.length === 0 ? { isWord: true } : {
            isWord: false,
            suggestions: misspellings[0].suggestions,
            actions: [{
              title: 'Add to personal dictionary',
              apply: function apply() {
                return checker.addWord(word, false);
              }
            }, {
              title: 'Add to personal dictionary (case sensitive)',
              apply: function apply() {
                return checker.addWord(word, true);
              }
            }, {
              title: 'Ignore',
              apply: function apply() {
                return checker.ignoreWord(word, false);
              }
            }, {
              title: 'Ignore (case sensitive)',
              apply: function apply() {
                return checker.ignoreWord(word, true);
              }
            }]
          };
        });
      }
    };
    this.updateDictionaries();
  }

  _createClass(DictionaryProvider, [{
    key: 'provideDictionary',
    value: function provideDictionary() {
      return this.provider;
    }
  }, {
    key: 'getAvailableLanguages',
    value: function getAvailableLanguages() {
      var l = [];
      for (var lang of this.dictionaries.keys()) {
        l.push(lang.replace(/-\*/g, ''));
      }
      l.sort();
      return l;
    }
  }, {
    key: 'getChecker',
    value: function getChecker(languages) {
      var _this3 = this;

      var id = languages.join();
      if (this.checkers.has(id)) return this.checkers.get(id);

      var checker = new _spell.Spell(languages);
      this.disposables.add(checker);
      this.checkers.set(id, checker);
      checker.onError(function (err) {
        console.error(err);
        if (_this3.checkers.has(id)) {
          _this3.checkers['delete'](id);
          atom.notifications.addError('Spell Checker Communication Error', { detail: 'Unable to communicate with spell checker. Please verify your settings of linter-spell.\n' + err });
        }
      });
      return checker;
    }
  }, {
    key: 'maximizeRank',
    value: function maximizeRank(tag) {
      var rank = 0;
      var value = undefined;
      for (var entry of this.dictionaries.entries()) {
        var newRank = helpers.rankRange(entry[0], tag);
        if (newRank > rank) {
          rank = newRank;
          value = entry;
        }
      }
      return value;
    }
  }, {
    key: 'resolve',
    value: function resolve(languages, notify) {
      var d = [];
      for (var language of languages) {
        var fallback = likelySubtags[language];
        var dict = this.maximizeRank(language);
        if (fallback) dict = dict || this.maximizeRank(fallback);
        if (dict) {
          d.push(dict);
        } else if (notify) {
          atom.notifications.addWarning('Missing Dictionary', {
            detail: 'Unable to find a dictionary for language ' + language + (fallback ? ' with fallback ' + fallback : '') + '.'
          });
        }
      }
      return d;
    }
  }, {
    key: 'resolveDictionaries',
    value: function resolveDictionaries(languages) {
      return _.map(this.resolve(languages, true), function (entry) {
        return entry[1];
      });
    }
  }, {
    key: 'resolveLanguages',
    value: function resolveLanguages(languages) {
      return _.map(this.resolve(languages, false), function (entry) {
        return entry[0].replace(/-\*/g, '');
      });
    }
  }, {
    key: 'addDictionary',
    value: function addDictionary(name) {
      var lang = helpers.parseRange(name);
      if (lang !== '*' && (!this.dictionaries.has(lang) || name < this.dictionaries.get(lang))) {
        this.dictionaries.set(lang, name);
      }
    }
  }, {
    key: 'updateDictionaries',
    value: _asyncToGenerator(function* () {
      var spellPath = atom.config.get('linter-spell.spellPath');
      var ispell = path.parse(spellPath).name.toLowerCase();
      var output = '';
      var processOptions = undefined;
      this.dictionaries.clear();
      switch (ispell) {
        case 'aspell':
          processOptions = (0, _spell.constructProcessOptions)();
          output = _child_process2['default'].spawnSync(spellPath, ['dicts'], processOptions);
          if (output.status !== 0) {
            atom.notifications.addError('linter-spell: Dictionary request failed', { description: 'Call to aspell failed with a code of ' + output.status + '.' });
          }
          if (output.stdout) {
            for (var line of output.stdout.split(/[\r\n]+/g)) {
              this.addDictionary(line);
            }
          }
          break;
        case 'hunspell':
          processOptions = (0, _spell.constructProcessOptions)({ input: '' });
          output = _child_process2['default'].spawnSync(spellPath, ['-D'], processOptions);
          if (output.status !== 0) {
            atom.notifications.addError('linter-spell: Dictionary request failed', { description: 'Call to hunspell failed with a code of ' + output.status + '.' });
          }
          if (output.stderr) {
            var save = false;
            for (var line of output.stderr.split(/[\r\n]+/g)) {
              if (line.match(/\s-d.*:$/)) {
                save = true;
              } else if (line.match(/:$/)) {
                save = false;
              } else if (save) {
                this.addDictionary(path.basename(line));
              }
            }
          }
          break;
      }
      this.provider.languages = this.getAvailableLanguages();
      //    this.emitter.emit('change-languages', null)
    })
  }]);

  return DictionaryProvider;
})(_atom.Disposable);

exports['default'] = DictionaryProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2RpY3Rpb25hcnktcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixRQUFROztJQUFmLENBQUM7OytCQUNZLG9CQUFvQjs7SUFBakMsT0FBTzs7b0JBQ0csTUFBTTs7SUFBaEIsSUFBSTs7NkJBQ1MsZUFBZTs7Ozs2QkFDVCxrQkFBa0I7O0lBQXJDLGFBQWE7O29CQUN1QixNQUFNOztxQkFDUCxTQUFTOztBQVJ4RCxXQUFXLENBQUE7O0lBVVUsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFFekIsV0FGTyxrQkFBa0IsR0FFdEI7OzswQkFGSSxrQkFBa0I7O0FBR25DLCtCQUhpQixrQkFBa0IsNkNBRzdCLFlBQU07QUFDVixZQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixZQUFLLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0tBQzFCLEVBQUM7Ozs7QUFDRixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDN0IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEVBQUUsWUFBTTtBQUN0RCxhQUFLLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLGFBQUssa0JBQWtCLEVBQUUsQ0FBQTtLQUMxQixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsUUFBUSxHQUFHO0FBQ2QsVUFBSSxFQUFFLG1CQUFtQjtBQUN6QixlQUFTLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFO0FBQ3ZDLGdCQUFVLEVBQUUsb0JBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUs7QUFDNUMsWUFBTSxP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SyxDQUFDLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHlDQUF5QyxFQUFFLEVBQUUsV0FBVyw4Q0FBNEMsTUFBTSxDQUFDLE1BQU0sTUFBRyxFQUFFLENBQUMsQ0FBQTtXQUNwSjtBQUNELGNBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNqQixnQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFBO0FBQ2hCLGlCQUFLLElBQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ2xELGtCQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDMUIsb0JBQUksR0FBRyxJQUFJLENBQUE7ZUFDWixNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQixvQkFBSSxHQUFHLEtBQUssQ0FBQTtlQUNiLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDZixvQkFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7ZUFDeEM7YUFDRjtXQUNGO0FBQ0QsZ0JBQUs7QUFBQSxPQUNSO0FBQ0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0tBRXZEOzs7U0E3TWtCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvZGljdGlvbmFyeS1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2xhbmd1YWdlLWhlbHBlcnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgKiBhcyBsaWtlbHlTdWJ0YWdzIGZyb20gJy4vbGlrZWx5LXN1YnRhZ3MnXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFNwZWxsLCBjb25zdHJ1Y3RQcm9jZXNzT3B0aW9ucyB9IGZyb20gJy4vc3BlbGwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpY3Rpb25hcnlQcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGUge1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5jaGVja2VycyA9IG5ldyBNYXAoKVxuICAgIH0pXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmNoZWNrZXJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5kaWN0aW9uYXJpZXMgPSBuZXcgTWFwKClcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLXNwZWxsLnNwZWxsUGF0aCcsICgpID0+IHtcbiAgICAgIHRoaXMuY2hlY2tlcnMgPSBuZXcgTWFwKClcbiAgICAgIHRoaXMudXBkYXRlRGljdGlvbmFyaWVzKClcbiAgICB9KVxuICAgIHRoaXMucHJvdmlkZXIgPSB7XG4gICAgICBuYW1lOiAnSXNwZWxsIGRpY3Rpb25hcnknLFxuICAgICAgbGFuZ3VhZ2VzOiB0aGlzLmdldEF2YWlsYWJsZUxhbmd1YWdlcygpLFxuICAgICAgY2hlY2tSYW5nZTogKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgcmFuZ2UpID0+IHtcbiAgICAgICAgY29uc3QgY2hlY2tlciA9IHRoaXMuZ2V0Q2hlY2tlcihsYW5ndWFnZXMpXG4gICAgICAgIGlmICghY2hlY2tlcikgcmV0dXJuIFtdXG4gICAgICAgIHJldHVybiBjaGVja2VyLmdldE1pc3NwZWxsaW5ncyh0ZXh0RWRpdG9yLCByYW5nZSlcbiAgICAgICAgICAudGhlbihtaXNzcGVsbGluZ3MgPT4gXy5tYXAobWlzc3BlbGxpbmdzLFxuICAgICAgICAgICAgbWlzc3BlbGxpbmcgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB3b3JkID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShtaXNzcGVsbGluZy5yYW5nZSlcbiAgICAgICAgICAgICAgY29uc3QgdXBwZXJDYXNlID0gd29yZC50b0xvd2VyQ2FzZSgpICE9PSB3b3JkXG5cbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIHJhbmdlOiBtaXNzcGVsbGluZy5yYW5nZSxcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uczogbWlzc3BlbGxpbmcuc3VnZ2VzdGlvbnMsXG4gICAgICAgICAgICAgICAgYWN0aW9uczogW3tcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSWdub3JlJyxcbiAgICAgICAgICAgICAgICAgIGFwcGx5OiAoKSA9PiBjaGVja2VyLmlnbm9yZVdvcmQod29yZCwgZmFsc2UpXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh1cHBlckNhc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSWdub3JlIChjYXNlIHNlbnNpdGl2ZSknLFxuICAgICAgICAgICAgICAgICAgYXBwbHk6ICgpID0+IGNoZWNrZXIuaWdub3JlV29yZCh3b3JkLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXN1bHQuYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0FkZCB0byBwZXJzb25hbCBkaWN0aW9uYXJ5JyxcbiAgICAgICAgICAgICAgICBhcHBseTogKCkgPT4gY2hlY2tlci5hZGRXb3JkKHdvcmQsIGZhbHNlKVxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIGlmICh1cHBlckNhc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQWRkIHRvIHBlcnNvbmFsIGRpY3Rpb25hcnkgKGNhc2Ugc2Vuc2l0aXZlKScsXG4gICAgICAgICAgICAgICAgICBhcHBseTogKCkgPT4gY2hlY2tlci5hZGRXb3JkKHdvcmQsIHRydWUpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgIH0pKVxuICAgICAgfSxcbiAgICAgIGNoZWNrV29yZDogKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgcmFuZ2UpID0+IHtcbiAgICAgICAgY29uc3QgY2hlY2tlciA9IHRoaXMuZ2V0Q2hlY2tlcihsYW5ndWFnZXMpXG4gICAgICAgIGlmICghY2hlY2tlcikgcmV0dXJuIHsgaXNXb3JkOiBmYWxzZSB9XG4gICAgICAgIGNvbnN0IHdvcmQgPSB0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICByZXR1cm4gY2hlY2tlci5nZXRNaXNzcGVsbGluZ3ModGV4dEVkaXRvciwgcmFuZ2UpXG4gICAgICAgICAgLnRoZW4obWlzc3BlbGxpbmdzID0+IChtaXNzcGVsbGluZ3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgPyB7IGlzV29yZDogdHJ1ZSB9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgaXNXb3JkOiBmYWxzZSxcbiAgICAgICAgICAgICAgc3VnZ2VzdGlvbnM6IG1pc3NwZWxsaW5nc1swXS5zdWdnZXN0aW9ucyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW3tcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0FkZCB0byBwZXJzb25hbCBkaWN0aW9uYXJ5JyxcbiAgICAgICAgICAgICAgICBhcHBseTogKCkgPT4gY2hlY2tlci5hZGRXb3JkKHdvcmQsIGZhbHNlKVxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdBZGQgdG8gcGVyc29uYWwgZGljdGlvbmFyeSAoY2FzZSBzZW5zaXRpdmUpJyxcbiAgICAgICAgICAgICAgICBhcHBseTogKCkgPT4gY2hlY2tlci5hZGRXb3JkKHdvcmQsIHRydWUpXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0lnbm9yZScsXG4gICAgICAgICAgICAgICAgYXBwbHk6ICgpID0+IGNoZWNrZXIuaWdub3JlV29yZCh3b3JkLCBmYWxzZSlcbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnSWdub3JlIChjYXNlIHNlbnNpdGl2ZSknLFxuICAgICAgICAgICAgICAgIGFwcGx5OiAoKSA9PiBjaGVja2VyLmlnbm9yZVdvcmQod29yZCwgdHJ1ZSlcbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudXBkYXRlRGljdGlvbmFyaWVzKClcbiAgfVxuXG4gIHByb3ZpZGVEaWN0aW9uYXJ5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxuICB9XG5cbiAgZ2V0QXZhaWxhYmxlTGFuZ3VhZ2VzICgpIHtcbiAgICBsZXQgbCA9IFtdXG4gICAgZm9yIChjb25zdCBsYW5nIG9mIHRoaXMuZGljdGlvbmFyaWVzLmtleXMoKSkge1xuICAgICAgbC5wdXNoKGxhbmcucmVwbGFjZSgvLVxcKi9nLCAnJykpXG4gICAgfVxuICAgIGwuc29ydCgpXG4gICAgcmV0dXJuIGxcbiAgfVxuXG4gIGdldENoZWNrZXIgKGxhbmd1YWdlcykge1xuICAgIGxldCBpZCA9IGxhbmd1YWdlcy5qb2luKClcbiAgICBpZiAodGhpcy5jaGVja2Vycy5oYXMoaWQpKSByZXR1cm4gdGhpcy5jaGVja2Vycy5nZXQoaWQpXG5cbiAgICBsZXQgY2hlY2tlciA9IG5ldyBTcGVsbChsYW5ndWFnZXMpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoY2hlY2tlcilcbiAgICB0aGlzLmNoZWNrZXJzLnNldChpZCwgY2hlY2tlcilcbiAgICBjaGVja2VyLm9uRXJyb3IoZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgaWYgKHRoaXMuY2hlY2tlcnMuaGFzKGlkKSkge1xuICAgICAgICB0aGlzLmNoZWNrZXJzLmRlbGV0ZShpZClcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAgICdTcGVsbCBDaGVja2VyIENvbW11bmljYXRpb24gRXJyb3InLFxuICAgICAgICAgIHsgZGV0YWlsOiBgVW5hYmxlIHRvIGNvbW11bmljYXRlIHdpdGggc3BlbGwgY2hlY2tlci4gUGxlYXNlIHZlcmlmeSB5b3VyIHNldHRpbmdzIG9mIGxpbnRlci1zcGVsbC5cXG4ke2Vycn1gIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gY2hlY2tlclxuICB9XG5cbiAgbWF4aW1pemVSYW5rICh0YWcpIHtcbiAgICBsZXQgcmFuayA9IDBcbiAgICBsZXQgdmFsdWVcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZGljdGlvbmFyaWVzLmVudHJpZXMoKSkge1xuICAgICAgY29uc3QgbmV3UmFuayA9IGhlbHBlcnMucmFua1JhbmdlKGVudHJ5WzBdLCB0YWcpXG4gICAgICBpZiAobmV3UmFuayA+IHJhbmspIHtcbiAgICAgICAgcmFuayA9IG5ld1JhbmtcbiAgICAgICAgdmFsdWUgPSBlbnRyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHJlc29sdmUgKGxhbmd1YWdlcywgbm90aWZ5KSB7XG4gICAgbGV0IGQgPSBbXVxuICAgIGZvciAoY29uc3QgbGFuZ3VhZ2Ugb2YgbGFuZ3VhZ2VzKSB7XG4gICAgICBjb25zdCBmYWxsYmFjayA9IGxpa2VseVN1YnRhZ3NbbGFuZ3VhZ2VdXG4gICAgICBsZXQgZGljdCA9IHRoaXMubWF4aW1pemVSYW5rKGxhbmd1YWdlKVxuICAgICAgaWYgKGZhbGxiYWNrKSBkaWN0ID0gZGljdCB8fCB0aGlzLm1heGltaXplUmFuayhmYWxsYmFjaylcbiAgICAgIGlmIChkaWN0KSB7XG4gICAgICAgIGQucHVzaChkaWN0KVxuICAgICAgfSBlbHNlIGlmIChub3RpZnkpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgJ01pc3NpbmcgRGljdGlvbmFyeScsIHtcbiAgICAgICAgICAgIGRldGFpbDogYFVuYWJsZSB0byBmaW5kIGEgZGljdGlvbmFyeSBmb3IgbGFuZ3VhZ2UgJHtsYW5ndWFnZX0ke2ZhbGxiYWNrID8gJyB3aXRoIGZhbGxiYWNrICcgKyBmYWxsYmFjayA6ICcnfS5gXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRcbiAgfVxuXG4gIHJlc29sdmVEaWN0aW9uYXJpZXMgKGxhbmd1YWdlcykge1xuICAgIHJldHVybiBfLm1hcCh0aGlzLnJlc29sdmUobGFuZ3VhZ2VzLCB0cnVlKSwgZW50cnkgPT4gZW50cnlbMV0pXG4gIH1cblxuICByZXNvbHZlTGFuZ3VhZ2VzIChsYW5ndWFnZXMpIHtcbiAgICByZXR1cm4gXy5tYXAodGhpcy5yZXNvbHZlKGxhbmd1YWdlcywgZmFsc2UpLCBlbnRyeSA9PiBlbnRyeVswXS5yZXBsYWNlKC8tXFwqL2csICcnKSlcbiAgfVxuXG4gIGFkZERpY3Rpb25hcnkgKG5hbWUpIHtcbiAgICBjb25zdCBsYW5nID0gaGVscGVycy5wYXJzZVJhbmdlKG5hbWUpXG4gICAgaWYgKGxhbmcgIT09ICcqJyAmJiAoIXRoaXMuZGljdGlvbmFyaWVzLmhhcyhsYW5nKSB8fCBuYW1lIDwgdGhpcy5kaWN0aW9uYXJpZXMuZ2V0KGxhbmcpKSkge1xuICAgICAgdGhpcy5kaWN0aW9uYXJpZXMuc2V0KGxhbmcsIG5hbWUpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdXBkYXRlRGljdGlvbmFyaWVzICgpIHtcbiAgICBjb25zdCBzcGVsbFBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1zcGVsbC5zcGVsbFBhdGgnKVxuICAgIGNvbnN0IGlzcGVsbCA9IHBhdGgucGFyc2Uoc3BlbGxQYXRoKS5uYW1lLnRvTG93ZXJDYXNlKClcbiAgICBsZXQgb3V0cHV0ID0gJydcbiAgICBsZXQgcHJvY2Vzc09wdGlvbnNcbiAgICB0aGlzLmRpY3Rpb25hcmllcy5jbGVhcigpXG4gICAgc3dpdGNoIChpc3BlbGwpIHtcbiAgICAgIGNhc2UgJ2FzcGVsbCc6XG4gICAgICAgIHByb2Nlc3NPcHRpb25zID0gY29uc3RydWN0UHJvY2Vzc09wdGlvbnMoKVxuICAgICAgICBvdXRwdXQgPSBjaGlsZFByb2Nlc3Muc3Bhd25TeW5jKHNwZWxsUGF0aCwgWydkaWN0cyddLCBwcm9jZXNzT3B0aW9ucylcbiAgICAgICAgaWYgKG91dHB1dC5zdGF0dXMgIT09IDApIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2xpbnRlci1zcGVsbDogRGljdGlvbmFyeSByZXF1ZXN0IGZhaWxlZCcsIHsgZGVzY3JpcHRpb246IGBDYWxsIHRvIGFzcGVsbCBmYWlsZWQgd2l0aCBhIGNvZGUgb2YgJHtvdXRwdXQuc3RhdHVzfS5gIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dHB1dC5zdGRvdXQpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2Ygb3V0cHV0LnN0ZG91dC5zcGxpdCgvW1xcclxcbl0rL2cpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZERpY3Rpb25hcnkobGluZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2h1bnNwZWxsJzpcbiAgICAgICAgcHJvY2Vzc09wdGlvbnMgPSBjb25zdHJ1Y3RQcm9jZXNzT3B0aW9ucyh7IGlucHV0OiAnJyB9KVxuICAgICAgICBvdXRwdXQgPSBjaGlsZFByb2Nlc3Muc3Bhd25TeW5jKHNwZWxsUGF0aCwgWyctRCddLCBwcm9jZXNzT3B0aW9ucylcbiAgICAgICAgaWYgKG91dHB1dC5zdGF0dXMgIT09IDApIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2xpbnRlci1zcGVsbDogRGljdGlvbmFyeSByZXF1ZXN0IGZhaWxlZCcsIHsgZGVzY3JpcHRpb246IGBDYWxsIHRvIGh1bnNwZWxsIGZhaWxlZCB3aXRoIGEgY29kZSBvZiAke291dHB1dC5zdGF0dXN9LmAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0cHV0LnN0ZGVycikge1xuICAgICAgICAgIGxldCBzYXZlID0gZmFsc2VcbiAgICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2Ygb3V0cHV0LnN0ZGVyci5zcGxpdCgvW1xcclxcbl0rL2cpKSB7XG4gICAgICAgICAgICBpZiAobGluZS5tYXRjaCgvXFxzLWQuKjokLykpIHtcbiAgICAgICAgICAgICAgc2F2ZSA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGluZS5tYXRjaCgvOiQvKSkge1xuICAgICAgICAgICAgICBzYXZlID0gZmFsc2VcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2F2ZSkge1xuICAgICAgICAgICAgICB0aGlzLmFkZERpY3Rpb25hcnkocGF0aC5iYXNlbmFtZShsaW5lKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5wcm92aWRlci5sYW5ndWFnZXMgPSB0aGlzLmdldEF2YWlsYWJsZUxhbmd1YWdlcygpXG4vLyAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlLWxhbmd1YWdlcycsIG51bGwpXG4gIH1cblxufVxuIl19