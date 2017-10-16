Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.constructProcessOptions = constructProcessOptions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _osLocale = require('os-locale');

var _osLocale2 = _interopRequireDefault(_osLocale);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _atom = require('atom');

'use babel';

var separatorPattern = /(?:\s|[,:])+/;
var commandPattern = /^[-*&@+#!%`^~]/;
// ~ is in the list even though is harmless. It should be a command, but it is
// treated as regular word as per https://github.com/hunspell/hunspell/issues/100

function constructProcessOptions() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  options.env = Object.assign({ LANG: _osLocale2['default'].sync() }, process.env);
  options.encoding = 'utf8';
  options.cwd = _os2['default'].homedir();
  return options;
}

var Spell = (function (_Disposable) {
  _inherits(Spell, _Disposable);

  function Spell(languages) {
    var _this2 = this;

    _classCallCheck(this, Spell);

    _get(Object.getPrototypeOf(Spell.prototype), 'constructor', this).call(this, function () {
      _this.process.stdin.end();
    });

    var _this = this;

    this.emitter = new _atom.Emitter();
    this.last = Promise.resolve([]);

    var spellPath = atom.config.get('linter-spell.spellPath');
    this.ispell = _path2['default'].parse(spellPath).name.toLowerCase();

    var options = ['-a'];

    if (languages && languages.length > 0) {
      var d = global.dictionaryProvider.resolveDictionaries(languages);
      if (d.length > 0) {
        switch (this.ispell) {
          case 'aspell':
            // Aspell needs extra dictionaries listed separately
            options.push('--encoding=utf-8');
            options.push('-d');
            options.push(d[0]);
            if (d.length > 1) {
              options.push('--extra-dicts=' + d.slice(1).join(';'));
            }
            break;
          case 'hunspell':
            options.push('-i');
            options.push('utf-8');
            options.push('-d');
            options.push(d.join());
            break;
          default:
            // Ispell only likes one dictionary
            options.push('-d');
            options.push(d[0]);
            break;
        }
      }
    }

    var personalDictionaryPath = atom.config.get('linter-spell.personalDictionaryPath');
    if (personalDictionaryPath) {
      options.push('-p');
      options.push(personalDictionaryPath);
    }

    var processOptions = constructProcessOptions();

    this.process = _child_process2['default'].spawn(spellPath, options, processOptions);

    this.process.on('exit', function (code) {
      console.log('Child exited with code ' + code);
    });

    this.process.on('error', function (err) {
      return _this2.emitter.emit('error', err);
    });
    this.process.stdin.on('error', function (err) {
      return _this2.emitter.emit('error', err);
    });
    this.process.stdout.on('error', function (err) {
      return _this2.emitter.emit('error', err);
    });

    this.readline = _readline2['default'].createInterface({
      input: this.process.stdout
    });

    this.process.stdin.write('!\n'); // Put into terse mode
  }

  _createClass(Spell, [{
    key: 'onError',
    value: function onError(callback) {
      return this.emitter.on('error', callback);
    }
  }, {
    key: 'addWord',
    value: function addWord(word, respectCase) {
      this.process.stdin.write('*' + (respectCase ? word : word.toLowerCase()) + '\n#\n');
    }
  }, {
    key: 'ignoreWord',
    value: function ignoreWord(word, respectCase) {
      this.process.stdin.write('@' + (respectCase ? word : word.toLowerCase()) + '\n');
    }
  }, {
    key: 'getMisspellings',
    value: _asyncToGenerator(function* (textEditor, range) {
      var misspellings = [];
      for (var i = range.start.row; i <= range.end.row; i++) {
        var subRange = new _atom.Range([i, i === range.start.row ? range.start.column : 0], [i, i === range.end.row ? range.end.column : textEditor.getBuffer().lineLengthForRow(i)]);
        misspellings = _lodash2['default'].concat(misspellings, (yield this.checkLine(subRange.start, textEditor.getTextInBufferRange(subRange))));
      }
      return misspellings;
    })
  }, {
    key: 'checkLine',
    value: function checkLine(start, text) {
      var _this3 = this;

      var padding = commandPattern.test(text) ? 1 : 0;
      var ex = function ex(resolve, reject) {
        var words = [];
        var onError = function onError() {
          _this3.readline.removeListener('line', onLine);
          _this3.process.stdin.removeListener('error', onError);
          resolve(words);
        };
        var onLine = function onLine(line) {
          function addMisspelling(word, offset, suggestions) {
            words.push({
              text: word,
              range: new _atom.Range([start.row, start.column + offset - padding], [start.row, start.column + offset - padding + word.length]),
              suggestions: suggestions
            });
          }
          if (line) {
            var parts = line.split(separatorPattern);
            switch (parts[0]) {
              case '&':
                addMisspelling(parts[1], parseInt(parts[3], 10), parts.slice(4));
                break;
              case '#':
                addMisspelling(parts[1], parseInt(parts[2], 10), []);
            }
          } else {
            _this3.readline.removeListener('line', onLine);
            _this3.process.stdin.removeListener('error', onError);
            resolve(words);
          }
        };
        _this3.readline.on('line', onLine);
        _this3.process.stdin.on('error', onError);
        _this3.process.stdin.write(text.replace("''", '" ' /* hack */).replace(commandPattern, '^$&') + '\n');
      };
      if (text) {
        this.last = this.last.then(function () {
          return new Promise(ex);
        });
        return this.last;
      } else {
        return [];
      }
    }
  }]);

  return Spell;
})(_atom.Disposable);

exports.Spell = Spell;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL3NwZWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7a0JBQ1IsSUFBSTs7Ozt3QkFDRSxXQUFXOzs7OzZCQUNQLGVBQWU7Ozs7d0JBQ25CLFVBQVU7Ozs7b0JBQ1ksTUFBTTs7QUFSakQsV0FBVyxDQUFBOztBQVVYLElBQU0sZ0JBQWdCLEdBQUcsY0FBYyxDQUFBO0FBQ3ZDLElBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFBOzs7O0FBSWhDLFNBQVMsdUJBQXVCLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNuRCxTQUFPLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsc0JBQVMsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDbkUsU0FBTyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUE7QUFDekIsU0FBTyxDQUFDLEdBQUcsR0FBRyxnQkFBRyxPQUFPLEVBQUUsQ0FBQTtBQUMxQixTQUFPLE9BQU8sQ0FBQTtDQUNmOztJQUVZLEtBQUs7WUFBTCxLQUFLOztBQUNKLFdBREQsS0FBSyxDQUNILFNBQVMsRUFBRTs7OzBCQURiLEtBQUs7O0FBRWQsK0JBRlMsS0FBSyw2Q0FFUixZQUFNO0FBQ1YsWUFBSyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO0tBQ3pCLEVBQUM7Ozs7QUFDRixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBOztBQUUvQixRQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzNELFFB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SUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtPQUNwRyxDQUFBO0FBQ0QsVUFBSSxJQUFJLEVBQUU7QUFDUixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQU07QUFBRSxpQkFBTyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUFFLENBQUMsQ0FBQTtBQUM1RCxlQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7T0FDakIsTUFBTTtBQUNMLGVBQU8sRUFBRSxDQUFBO09BQ1Y7S0FDRjs7O1NBL0hVLEtBQUsiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvc3BlbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IG9zTG9jYWxlIGZyb20gJ29zLWxvY2FsZSdcbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCByZWFkbGluZSBmcm9tICdyZWFkbGluZSdcbmltcG9ydCB7IFJhbmdlLCBEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcblxuY29uc3Qgc2VwYXJhdG9yUGF0dGVybiA9IC8oPzpcXHN8Wyw6XSkrL1xuY29uc3QgY29tbWFuZFBhdHRlcm4gPSAvXlstKiZAKyMhJWBefl0vXG4vLyB+IGlzIGluIHRoZSBsaXN0IGV2ZW4gdGhvdWdoIGlzIGhhcm1sZXNzLiBJdCBzaG91bGQgYmUgYSBjb21tYW5kLCBidXQgaXQgaXNcbi8vIHRyZWF0ZWQgYXMgcmVndWxhciB3b3JkIGFzIHBlciBodHRwczovL2dpdGh1Yi5jb20vaHVuc3BlbGwvaHVuc3BlbGwvaXNzdWVzLzEwMFxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3RydWN0UHJvY2Vzc09wdGlvbnMgKG9wdGlvbnMgPSB7fSkge1xuICBvcHRpb25zLmVudiA9IE9iamVjdC5hc3NpZ24oeyBMQU5HOiBvc0xvY2FsZS5zeW5jKCkgfSwgcHJvY2Vzcy5lbnYpXG4gIG9wdGlvbnMuZW5jb2RpbmcgPSAndXRmOCdcbiAgb3B0aW9ucy5jd2QgPSBvcy5ob21lZGlyKClcbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuZXhwb3J0IGNsYXNzIFNwZWxsIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGNvbnN0cnVjdG9yIChsYW5ndWFnZXMpIHtcbiAgICBzdXBlcigoKSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3Muc3RkaW4uZW5kKClcbiAgICB9KVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxhc3QgPSBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICBjb25zdCBzcGVsbFBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1zcGVsbC5zcGVsbFBhdGgnKVxuICAgIHRoaXMuaXNwZWxsID0gcGF0aC5wYXJzZShzcGVsbFBhdGgpLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgbGV0IG9wdGlvbnMgPSBbJy1hJ11cblxuICAgIGlmIChsYW5ndWFnZXMgJiYgbGFuZ3VhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBkID0gZ2xvYmFsLmRpY3Rpb25hcnlQcm92aWRlci5yZXNvbHZlRGljdGlvbmFyaWVzKGxhbmd1YWdlcylcbiAgICAgIGlmIChkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmlzcGVsbCkge1xuICAgICAgICAgIGNhc2UgJ2FzcGVsbCc6IC8vIEFzcGVsbCBuZWVkcyBleHRyYSBkaWN0aW9uYXJpZXMgbGlzdGVkIHNlcGFyYXRlbHlcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCgnLS1lbmNvZGluZz11dGYtOCcpXG4gICAgICAgICAgICBvcHRpb25zLnB1c2goJy1kJylcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChkWzBdKVxuICAgICAgICAgICAgaWYgKGQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBvcHRpb25zLnB1c2goYC0tZXh0cmEtZGljdHM9JHtkLnNsaWNlKDEpLmpvaW4oJzsnKX1gKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdodW5zcGVsbCc6XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goJy1pJylcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCgndXRmLTgnKVxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKCctZCcpXG4gICAgICAgICAgICBvcHRpb25zLnB1c2goZC5qb2luKCkpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6IC8vIElzcGVsbCBvbmx5IGxpa2VzIG9uZSBkaWN0aW9uYXJ5XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goJy1kJylcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChkWzBdKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBlcnNvbmFsRGljdGlvbmFyeVBhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1zcGVsbC5wZXJzb25hbERpY3Rpb25hcnlQYXRoJylcbiAgICBpZiAocGVyc29uYWxEaWN0aW9uYXJ5UGF0aCkge1xuICAgICAgb3B0aW9ucy5wdXNoKCctcCcpXG4gICAgICBvcHRpb25zLnB1c2gocGVyc29uYWxEaWN0aW9uYXJ5UGF0aClcbiAgICB9XG5cbiAgICBjb25zdCBwcm9jZXNzT3B0aW9ucyA9IGNvbnN0cnVjdFByb2Nlc3NPcHRpb25zKClcblxuICAgIHRoaXMucHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5zcGF3bihzcGVsbFBhdGgsIG9wdGlvbnMsIHByb2Nlc3NPcHRpb25zKVxuXG4gICAgdGhpcy5wcm9jZXNzLm9uKCdleGl0JywgKGNvZGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBDaGlsZCBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb2Nlc3Mub24oJ2Vycm9yJywgZXJyID0+IHRoaXMuZW1pdHRlci5lbWl0KCdlcnJvcicsIGVycikpXG4gICAgdGhpcy5wcm9jZXNzLnN0ZGluLm9uKCdlcnJvcicsIGVyciA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZXJyb3InLCBlcnIpKVxuICAgIHRoaXMucHJvY2Vzcy5zdGRvdXQub24oJ2Vycm9yJywgZXJyID0+IHRoaXMuZW1pdHRlci5lbWl0KCdlcnJvcicsIGVycikpXG5cbiAgICB0aGlzLnJlYWRsaW5lID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcbiAgICAgIGlucHV0OiB0aGlzLnByb2Nlc3Muc3Rkb3V0XG4gICAgfSlcblxuICAgIHRoaXMucHJvY2Vzcy5zdGRpbi53cml0ZSgnIVxcbicpIC8vIFB1dCBpbnRvIHRlcnNlIG1vZGVcbiAgfVxuXG4gIG9uRXJyb3IgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZXJyb3InLCBjYWxsYmFjaylcbiAgfVxuXG4gIGFkZFdvcmQgKHdvcmQsIHJlc3BlY3RDYXNlKSB7XG4gICAgdGhpcy5wcm9jZXNzLnN0ZGluLndyaXRlKGAqJHtyZXNwZWN0Q2FzZSA/IHdvcmQgOiB3b3JkLnRvTG93ZXJDYXNlKCl9XFxuI1xcbmApXG4gIH1cblxuICBpZ25vcmVXb3JkICh3b3JkLCByZXNwZWN0Q2FzZSkge1xuICAgIHRoaXMucHJvY2Vzcy5zdGRpbi53cml0ZShgQCR7cmVzcGVjdENhc2UgPyB3b3JkIDogd29yZC50b0xvd2VyQ2FzZSgpfVxcbmApXG4gIH1cblxuICBhc3luYyBnZXRNaXNzcGVsbGluZ3MgKHRleHRFZGl0b3IsIHJhbmdlKSB7XG4gICAgbGV0IG1pc3NwZWxsaW5ncyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IHJhbmdlLnN0YXJ0LnJvdzsgaSA8PSByYW5nZS5lbmQucm93OyBpKyspIHtcbiAgICAgIGNvbnN0IHN1YlJhbmdlID0gbmV3IFJhbmdlKFtpLCBpID09PSByYW5nZS5zdGFydC5yb3cgPyByYW5nZS5zdGFydC5jb2x1bW4gOiAwXSwgW2ksIGkgPT09IHJhbmdlLmVuZC5yb3cgPyByYW5nZS5lbmQuY29sdW1uIDogdGV4dEVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KGkpXSlcbiAgICAgIG1pc3NwZWxsaW5ncyA9IF8uY29uY2F0KG1pc3NwZWxsaW5ncywgYXdhaXQgdGhpcy5jaGVja0xpbmUoc3ViUmFuZ2Uuc3RhcnQsIHRleHRFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2Uoc3ViUmFuZ2UpKSlcbiAgICB9XG4gICAgcmV0dXJuIG1pc3NwZWxsaW5nc1xuICB9XG5cbiAgY2hlY2tMaW5lIChzdGFydCwgdGV4dCkge1xuICAgIGNvbnN0IHBhZGRpbmcgPSBjb21tYW5kUGF0dGVybi50ZXN0KHRleHQpID8gMSA6IDBcbiAgICBsZXQgZXggPSAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgd29yZHMgPSBbXVxuICAgICAgbGV0IG9uRXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVhZGxpbmUucmVtb3ZlTGlzdGVuZXIoJ2xpbmUnLCBvbkxpbmUpXG4gICAgICAgIHRoaXMucHJvY2Vzcy5zdGRpbi5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKVxuICAgICAgICByZXNvbHZlKHdvcmRzKVxuICAgICAgfVxuICAgICAgbGV0IG9uTGluZSA9IChsaW5lKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIGFkZE1pc3NwZWxsaW5nICh3b3JkLCBvZmZzZXQsIHN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgd29yZHMucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiB3b3JkLFxuICAgICAgICAgICAgcmFuZ2U6IG5ldyBSYW5nZShbc3RhcnQucm93LCBzdGFydC5jb2x1bW4gKyBvZmZzZXQgLSBwYWRkaW5nXSwgW3N0YXJ0LnJvdywgc3RhcnQuY29sdW1uICsgb2Zmc2V0IC0gcGFkZGluZyArIHdvcmQubGVuZ3RoXSksXG4gICAgICAgICAgICBzdWdnZXN0aW9uczogc3VnZ2VzdGlvbnNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lKSB7XG4gICAgICAgICAgY29uc3QgcGFydHMgPSBsaW5lLnNwbGl0KHNlcGFyYXRvclBhdHRlcm4pXG4gICAgICAgICAgc3dpdGNoIChwYXJ0c1swXSkge1xuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgIGFkZE1pc3NwZWxsaW5nKHBhcnRzWzFdLCBwYXJzZUludChwYXJ0c1szXSwgMTApLCBwYXJ0cy5zbGljZSg0KSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICBhZGRNaXNzcGVsbGluZyhwYXJ0c1sxXSwgcGFyc2VJbnQocGFydHNbMl0sIDEwKSwgW10pXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVhZGxpbmUucmVtb3ZlTGlzdGVuZXIoJ2xpbmUnLCBvbkxpbmUpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzLnN0ZGluLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpXG4gICAgICAgICAgcmVzb2x2ZSh3b3JkcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5yZWFkbGluZS5vbignbGluZScsIG9uTGluZSlcbiAgICAgIHRoaXMucHJvY2Vzcy5zdGRpbi5vbignZXJyb3InLCBvbkVycm9yKVxuICAgICAgdGhpcy5wcm9jZXNzLnN0ZGluLndyaXRlKHRleHQucmVwbGFjZShcIicnXCIsICdcIiAnIC8qIGhhY2sgKi8pLnJlcGxhY2UoY29tbWFuZFBhdHRlcm4sICdeJCYnKSArICdcXG4nKVxuICAgIH1cbiAgICBpZiAodGV4dCkge1xuICAgICAgdGhpcy5sYXN0ID0gdGhpcy5sYXN0LnRoZW4oKCkgPT4geyByZXR1cm4gbmV3IFByb21pc2UoZXgpIH0pXG4gICAgICByZXR1cm4gdGhpcy5sYXN0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfVxuXG59XG4iXX0=