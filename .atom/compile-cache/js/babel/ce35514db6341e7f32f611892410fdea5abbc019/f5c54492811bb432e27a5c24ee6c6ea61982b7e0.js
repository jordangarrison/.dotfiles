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

var _natural = require('natural');

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
      if ((0, _natural.JaroWinklerDistance)(w, caseSensitive ? text : text.toLowerCase()) >= this.minimumJaroWinklerDistance) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwtbGF0ZXgvbm9kZV9tb2R1bGVzL2xpbnRlci1zcGVsbC13b3JkLWxpc3QvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsUUFBUTs7SUFBZixDQUFDOzt1QkFDdUIsU0FBUzs7b0JBQ0csTUFBTTs7QUFKdEQsV0FBVyxDQUFBOztJQU1FLFFBQVE7WUFBUixRQUFROztBQUVQLFdBRkQsUUFBUSxDQUVOLE9BQU8sRUFBRTs7OzBCQUZYLFFBQVE7O0FBR2pCLCtCQUhTLFFBQVEsNkNBR1gsWUFBTTtBQUNWLFlBQUssV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzNCLEVBQUM7Ozs7QUFFRixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLEtBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRTVELFFBQUksQ0FBQyxRQUFRLEdBQUc7QUFDZCxVQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixtQkFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO0FBQ2pDLGVBQVMsRUFBRSxtQkFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUs7ZUFBSyxPQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQztPQUFBO0tBQzFGLENBQUE7R0FDRjs7ZUFmVSxRQUFROztXQWlCUCxxQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3ZCLGFBQU8sQUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUN4RCxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQzVDOzs7V0FFVyxxQkFB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QUFkLGNBQWM7O0FBRWIsV0FGRCxjQUFjLENBRVosT0FBTyxFQUFFOzs7MEJBRlgsY0FBYzs7QUFHdkIsK0JBSFMsY0FBYyw2Q0FHakIsT0FBTyxFQUFDOztBQUVkLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzFDLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQ3ZELFVBQUMsSUFBVTtVQUFULFFBQVEsR0FBVCxJQUFVLENBQVQsUUFBUTthQUFNLE9BQUssS0FBSyxHQUFHLFFBQVE7S0FBQSxDQUFDLENBQUMsQ0FBQTtHQUMxQzs7ZUFSVSxjQUFjOztXQVVoQixrQkFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO0FBQy9CLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtLQUNsQjs7O1dBRU8saUJBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDcEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUMxRDs7O1NBaEJVLGNBQWM7R0FBUyxRQUFRIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwtbGF0ZXgvbm9kZV9tb2R1bGVzL2xpbnRlci1zcGVsbC13b3JkLWxpc3QvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHsgSmFyb1dpbmtsZXJEaXN0YW5jZSB9IGZyb20gJ25hdHVyYWwnXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGNsYXNzIFdvcmRMaXN0IGV4dGVuZHMgRGlzcG9zYWJsZSB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICBzdXBlcigoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIH0pXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIF8uYXNzaWduKHRoaXMsIHsgbWluaW11bUphcm9XaW5rbGVyRGlzdGFuY2U6IDAuOSB9LCBvcHRpb25zKVxuXG4gICAgdGhpcy5wcm92aWRlciA9IHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIGdyYW1tYXJTY29wZXM6IHRoaXMuZ3JhbW1hclNjb3BlcyxcbiAgICAgIGNoZWNrV29yZDogKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgcmFuZ2UpID0+IHRoaXMuY2hlY2tXb3JkKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgcmFuZ2UpXG4gICAgfVxuICB9XG5cbiAgaXNXb3JkTWF0Y2ggKHdvcmQsIHRleHQpIHtcbiAgICByZXR1cm4gKHdvcmQuc3RhcnRzV2l0aCgnIScpICYmIHRleHQgPT09IHdvcmQuc3Vic3RyaW5nKDEpKSB8fFxuICAgICAgdGV4dC50b0xvd2VyQ2FzZSgpID09PSB3b3JkLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIHN1Z2dlc3RXb3JkICh3b3JkLCB0ZXh0KSB7XG4gICAgY29uc3QgY2FzZVNlbnNpdGl2ZSA9IHdvcmQuc3RhcnRzV2l0aCgnIScpXG4gICAgY29uc3QgdyA9IGNhc2VTZW5zaXRpdmUgPyB3b3JkLnN1YnN0cmluZygxKSA6IHdvcmQudG9Mb3dlckNhc2UoKVxuICAgIGlmIChKYXJvV2lua2xlckRpc3RhbmNlKHcsIGNhc2VTZW5zaXRpdmUgPyB0ZXh0IDogdGV4dC50b0xvd2VyQ2FzZSgpKSA+PSB0aGlzLm1pbmltdW1KYXJvV2lua2xlckRpc3RhbmNlKSB7XG4gICAgICBpZiAoY2FzZVNlbnNpdGl2ZSkgcmV0dXJuIHdcbiAgICAgIGlmIChfLmV2ZXJ5KHRleHQsIGMgPT4gYyA9PT0gYy50b1VwcGVyQ2FzZSgpKSkgcmV0dXJuIHcudG9VcHBlckNhc2UoKVxuICAgICAgaWYgKHRleHRbMF0gPT09IHRleHRbMF0udG9VcHBlckNhc2UoKSkgcmV0dXJuIHdbMF0udG9VcHBlckNhc2UoKSArIHcuc3Vic3RyaW5nKDEpXG4gICAgICByZXR1cm4gd1xuICAgIH1cbiAgfVxuXG4gIGdldFdvcmRzICh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGNoZWNrV29yZCAodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCByYW5nZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICBjb25zdCB3b3JkcyA9IHRoaXMuZ2V0V29yZHModGV4dEVkaXRvciwgbGFuZ3VhZ2VzKVxuXG4gICAgICBpZiAoXy5zb21lKHdvcmRzLCB3b3JkID0+IHRoaXMuaXNXb3JkTWF0Y2god29yZCwgdGV4dCkpKSB7XG4gICAgICAgIHJlc29sdmUoeyBpc1dvcmQ6IHRydWUgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICBpc1dvcmQ6IGZhbHNlLFxuICAgICAgICAgIHN1Z2dlc3Rpb25zOiBfLmZpbHRlcihfLm1hcCh3b3Jkcywgd29yZCA9PiB0aGlzLnN1Z2dlc3RXb3JkKHdvcmQsIHRleHQpKSksXG4gICAgICAgICAgYWN0aW9uczogW3tcbiAgICAgICAgICAgIHRpdGxlOiBgQWRkIHRvICR7dGhpcy5uYW1lfSBkaWN0aW9uYXJ5YCxcbiAgICAgICAgICAgIGFwcGx5OiAoKSA9PiB0aGlzLmFkZFdvcmQodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCB0ZXh0LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dC50b0xvd2VyQ2FzZSgpICE9PSB0ZXh0KSB7XG4gICAgICAgICAgcmVzdWx0LmFjdGlvbnMucHVzaCh7XG4gICAgICAgICAgICB0aXRsZTogYEFkZCB0byAke3RoaXMubmFtZX0gZGljdGlvbmFyeSAoY2FzZSBzZW5zaXRpdmUpYCxcbiAgICAgICAgICAgIGFwcGx5OiAoKSA9PiB0aGlzLmFkZFdvcmQodGV4dEVkaXRvciwgbGFuZ3VhZ2VzLCAnIScgKyB0ZXh0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFkZFdvcmQgKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgd29yZCkge31cblxuICBwcm92aWRlRGljdGlvbmFyeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uZmlnV29yZExpc3QgZXh0ZW5kcyBXb3JkTGlzdCB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKVxuXG4gICAgdGhpcy53b3JkcyA9IGF0b20uY29uZmlnLmdldCh0aGlzLmtleVBhdGgpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UodGhpcy5rZXlQYXRoLFxuICAgICAgKHtuZXdWYWx1ZX0pID0+IHRoaXMud29yZHMgPSBuZXdWYWx1ZSkpXG4gIH1cblxuICBnZXRXb3JkcyAodGV4dEVkaXRvciwgbGFuZ3VhZ2VzKSB7XG4gICAgcmV0dXJuIHRoaXMud29yZHNcbiAgfVxuXG4gIGFkZFdvcmQgKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgd29yZCkge1xuICAgIGF0b20uY29uZmlnLnNldCh0aGlzLmtleVBhdGgsIF8uY29uY2F0KHRoaXMud29yZHMsIHdvcmQpKVxuICB9XG5cbn1cbiJdfQ==