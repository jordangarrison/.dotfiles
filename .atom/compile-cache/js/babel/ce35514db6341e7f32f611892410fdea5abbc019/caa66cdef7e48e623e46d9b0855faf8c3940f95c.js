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

var _jaroWinkler = require('jaro-winkler');

var _jaroWinkler2 = _interopRequireDefault(_jaroWinkler);

var _atom = require('atom');

'use babel';

var WordList = (function (_Disposable) {
  _inherits(WordList, _Disposable);

  function WordList(options) {
    var _this2 = this;

    _classCallCheck(this, WordList);

    _get(Object.getPrototypeOf(WordList.prototype), 'constructor', this).call(this, function () {
      _this.disposables.dispose();
    });

    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    _.assign(this, { minimumJaroWinklerDistance: 0.9 }, options);

    this.provider = {
      name: this.name,
      grammarScopes: this.grammarScopes,
      checkWord: function checkWord(textEditor, languages, range) {
        return _this2.checkWord(textEditor, languages, range);
      }
    };
  }

  _createClass(WordList, [{
    key: 'isWordMatch',
    value: function isWordMatch(word, text) {
      return word.startsWith('!') && text === word.substring(1) || text.toLowerCase() === word.toLowerCase();
    }
  }, {
    key: 'suggestWord',
    value: function suggestWord(word, text) {
      var caseSensitive = word.startsWith('!');
      var w = caseSensitive ? word.substring(1) : word.toLowerCase();
      if ((0, _jaroWinkler2['default'])(w, caseSensitive ? text : text.toLowerCase()) >= this.minimumJaroWinklerDistance) {
        if (caseSensitive) return w;
        if (_.every(text, function (c) {
          return c === c.toUpperCase();
        })) return w.toUpperCase();
        if (text[0] === text[0].toUpperCase()) return w[0].toUpperCase() + w.substring(1);
        return w;
      }
    }
  }, {
    key: 'getWords',
    value: function getWords(textEditor, languages) {
      return [];
    }
  }, {
    key: 'checkWord',
    value: function checkWord(textEditor, languages, range) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var text = textEditor.getTextInBufferRange(range);
        var words = _this3.getWords(textEditor, languages);

        if (_.some(words, function (word) {
          return _this3.isWordMatch(word, text);
        })) {
          resolve({ isWord: true });
        } else {
          var result = {
            isWord: false,
            suggestions: _.filter(_.map(words, function (word) {
              return _this3.suggestWord(word, text);
            })),
            actions: [{
              title: 'Add to ' + _this3.name + ' dictionary',
              apply: function apply() {
                return _this3.addWord(textEditor, languages, text.toLowerCase());
              }
            }]
          };
          if (text.toLowerCase() !== text) {
            result.actions.push({
              title: 'Add to ' + _this3.name + ' dictionary (case sensitive)',
              apply: function apply() {
                return _this3.addWord(textEditor, languages, '!' + text);
              }
            });
          }
          resolve(result);
        }
      });
    }
  }, {
    key: 'addWord',
    value: function addWord(textEditor, languages, word) {}
  }, {
    key: 'provideDictionary',
    value: function provideDictionary() {
      return this.provider;
    }
  }]);

  return WordList;
})(_atom.Disposable);

exports.WordList = WordList;

var ConfigWordList = (function (_WordList) {
  _inherits(ConfigWordList, _WordList);

  function ConfigWordList(options) {
    var _this4 = this;

    _classCallCheck(this, ConfigWordList);

    _get(Object.getPrototypeOf(ConfigWordList.prototype), 'constructor', this).call(this, options);

    this.words = atom.config.get(this.keyPath);
    this.disposables.add(atom.config.onDidChange(this.keyPath, function (_ref) {
      var newValue = _ref.newValue;
      return _this4.words = newValue;
    }));
  }

  _createClass(ConfigWordList, [{
    key: 'getWords',
    value: function getWords(textEditor, languages) {
      return this.words;
    }
  }, {
    key: 'addWord',
    value: function addWord(textEditor, languages, word) {
      atom.config.set(this.keyPath, _.concat(this.words, word));
    }
  }]);

  return ConfigWordList;
})(WordList);

exports.ConfigWordList = ConfigWordList;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbm9kZV9tb2R1bGVzL2xpbnRlci1zcGVsbC13b3JkLWxpc3QvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixRQUFROztJQUFmLENBQUM7OzJCQUNXLGNBQWM7Ozs7b0JBQ1UsTUFBTTs7QUFKdEQsV0FBVyxDQUFBOztJQU1FLFFBQVE7WUFBUixRQUFROztBQUVQLFdBRkQsUUFBUSxDQUVOLE9BQU8sRUFBRTs7OzBCQUZYLFFBQVE7O0FBR2pCLCtCQUhTLFFBQVEsNkNBR1gsWUFBTTtBQUNWLFlBQUssV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzNCLEVBQUM7Ozs7QUFFRixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLEtBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRTVELFFBQUksQ0FBQyxRQUFRLEdBQUc7QUFDZCxVQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixtQkFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO0FBQ2pDLGVBQVMsRUFBRSxtQkFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUs7ZUFBSyxPQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQztPQUFBO0tBQzFGLENBQUE7R0FDRjs7ZUFmVSxRQUFROztXQWlCUCxxQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3ZCLGFBQU8sQUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUN4RCxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQzVDOzs7V0FFVyxxQkFBQyxJ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Y0FBYzs7QUFFYixXQUZELGNBQWMsQ0FFWixPQUFPLEVBQUU7OzswQkFGWCxjQUFjOztBQUd2QiwrQkFIUyxjQUFjLDZDQUdqQixPQUFPLEVBQUM7O0FBRWQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDMUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFDdkQsVUFBQyxJQUFVO1VBQVQsUUFBUSxHQUFULElBQVUsQ0FBVCxRQUFRO2FBQU0sT0FBSyxLQUFLLEdBQUcsUUFBUTtLQUFBLENBQUMsQ0FBQyxDQUFBO0dBQzFDOztlQVJVLGNBQWM7O1dBVWhCLGtCQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUU7QUFDL0IsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFBO0tBQ2xCOzs7V0FFTyxpQkFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtBQUNwQyxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO0tBQzFEOzs7U0FoQlUsY0FBYztHQUFTLFFBQVEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9ub2RlX21vZHVsZXMvbGludGVyLXNwZWxsLXdvcmQtbGlzdC9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgamFyb1dpbmtsZXIgZnJvbSAnamFyby13aW5rbGVyJ1xuaW1wb3J0IHsgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBjbGFzcyBXb3JkTGlzdCBleHRlbmRzIERpc3Bvc2FibGUge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgc3VwZXIoKCkgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICB9KVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBfLmFzc2lnbih0aGlzLCB7IG1pbmltdW1KYXJvV2lua2xlckRpc3RhbmNlOiAwLjkgfSwgb3B0aW9ucylcblxuICAgIHRoaXMucHJvdmlkZXIgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBncmFtbWFyU2NvcGVzOiB0aGlzLmdyYW1tYXJTY29wZXMsXG4gICAgICBjaGVja1dvcmQ6ICh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIHJhbmdlKSA9PiB0aGlzLmNoZWNrV29yZCh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIHJhbmdlKVxuICAgIH1cbiAgfVxuXG4gIGlzV29yZE1hdGNoICh3b3JkLCB0ZXh0KSB7XG4gICAgcmV0dXJuICh3b3JkLnN0YXJ0c1dpdGgoJyEnKSAmJiB0ZXh0ID09PSB3b3JkLnN1YnN0cmluZygxKSkgfHxcbiAgICAgIHRleHQudG9Mb3dlckNhc2UoKSA9PT0gd29yZC50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBzdWdnZXN0V29yZCAod29yZCwgdGV4dCkge1xuICAgIGNvbnN0IGNhc2VTZW5zaXRpdmUgPSB3b3JkLnN0YXJ0c1dpdGgoJyEnKVxuICAgIGNvbnN0IHcgPSBjYXNlU2Vuc2l0aXZlID8gd29yZC5zdWJzdHJpbmcoMSkgOiB3b3JkLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoamFyb1dpbmtsZXIodywgY2FzZVNlbnNpdGl2ZSA/IHRleHQgOiB0ZXh0LnRvTG93ZXJDYXNlKCkpID49IHRoaXMubWluaW11bUphcm9XaW5rbGVyRGlzdGFuY2UpIHtcbiAgICAgIGlmIChjYXNlU2Vuc2l0aXZlKSByZXR1cm4gd1xuICAgICAgaWYgKF8uZXZlcnkodGV4dCwgYyA9PiBjID09PSBjLnRvVXBwZXJDYXNlKCkpKSByZXR1cm4gdy50b1VwcGVyQ2FzZSgpXG4gICAgICBpZiAodGV4dFswXSA9PT0gdGV4dFswXS50b1VwcGVyQ2FzZSgpKSByZXR1cm4gd1swXS50b1VwcGVyQ2FzZSgpICsgdy5zdWJzdHJpbmcoMSlcbiAgICAgIHJldHVybiB3XG4gICAgfVxuICB9XG5cbiAgZ2V0V29yZHMgKHRleHRFZGl0b3IsIGxhbmd1YWdlcykge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgY2hlY2tXb3JkICh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIHJhbmdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIGNvbnN0IHdvcmRzID0gdGhpcy5nZXRXb3Jkcyh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMpXG5cbiAgICAgIGlmIChfLnNvbWUod29yZHMsIHdvcmQgPT4gdGhpcy5pc1dvcmRNYXRjaCh3b3JkLCB0ZXh0KSkpIHtcbiAgICAgICAgcmVzb2x2ZSh7IGlzV29yZDogdHJ1ZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICAgIGlzV29yZDogZmFsc2UsXG4gICAgICAgICAgc3VnZ2VzdGlvbnM6IF8uZmlsdGVyKF8ubWFwKHdvcmRzLCB3b3JkID0+IHRoaXMuc3VnZ2VzdFdvcmQod29yZCwgdGV4dCkpKSxcbiAgICAgICAgICBhY3Rpb25zOiBbe1xuICAgICAgICAgICAgdGl0bGU6IGBBZGQgdG8gJHt0aGlzLm5hbWV9IGRpY3Rpb25hcnlgLFxuICAgICAgICAgICAgYXBwbHk6ICgpID0+IHRoaXMuYWRkV29yZCh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIHRleHQudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0LnRvTG93ZXJDYXNlKCkgIT09IHRleHQpIHtcbiAgICAgICAgICByZXN1bHQuYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHRpdGxlOiBgQWRkIHRvICR7dGhpcy5uYW1lfSBkaWN0aW9uYXJ5IChjYXNlIHNlbnNpdGl2ZSlgLFxuICAgICAgICAgICAgYXBwbHk6ICgpID0+IHRoaXMuYWRkV29yZCh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsICchJyArIHRleHQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYWRkV29yZCAodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCB3b3JkKSB7fVxuXG4gIHByb3ZpZGVEaWN0aW9uYXJ5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25maWdXb3JkTGlzdCBleHRlbmRzIFdvcmRMaXN0IHtcblxuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpXG5cbiAgICB0aGlzLndvcmRzID0gYXRvbS5jb25maWcuZ2V0KHRoaXMua2V5UGF0aClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSh0aGlzLmtleVBhdGgsXG4gICAgICAoe25ld1ZhbHVlfSkgPT4gdGhpcy53b3JkcyA9IG5ld1ZhbHVlKSlcbiAgfVxuXG4gIGdldFdvcmRzICh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMpIHtcbiAgICByZXR1cm4gdGhpcy53b3Jkc1xuICB9XG5cbiAgYWRkV29yZCAodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCB3b3JkKSB7XG4gICAgYXRvbS5jb25maWcuc2V0KHRoaXMua2V5UGF0aCwgXy5jb25jYXQodGhpcy53b3Jkcywgd29yZCkpXG4gIH1cblxufVxuIl19