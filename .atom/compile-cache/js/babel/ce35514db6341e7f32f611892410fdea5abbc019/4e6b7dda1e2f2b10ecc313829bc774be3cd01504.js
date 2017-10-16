Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _osLocale = require('os-locale');

var _osLocale2 = _interopRequireDefault(_osLocale);

'use babel';

var tags = require('language-tags');

var LanguageManager = (function (_Disposable) {
  _inherits(LanguageManager, _Disposable);

  function LanguageManager() {
    var _this2 = this;

    _classCallCheck(this, LanguageManager);

    _get(Object.getPrototypeOf(LanguageManager.prototype), 'constructor', this).call(this, function () {
      _this.disposables.dispose();
    });

    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    var locale = _osLocale2['default'].sync();
    this.systemLanguages = [tags(locale.replace(/_/g, '-')).format()];
    this.emitter = new _atom.Emitter();
    this.disposables.add(this.emitter);
    this.languages = new Map();
    atom.config.onDidChange('linter-spell.defaultLanguages', function () {
      _this2.updateConfigLanguages();
    });
    this.updateConfigLanguages();
  }

  _createClass(LanguageManager, [{
    key: 'updateConfigLanguages',
    value: function updateConfigLanguages() {
      this.configLanguages = atom.config.get('linter-spell.defaultLanguages');
      if (this.configLanguages.length === 0) {
        this.configLanguages = null;
      }
    }
  }, {
    key: 'onDidChangeLanguages',
    value: function onDidChangeLanguages(callback) {
      return this.emitter.on('change-languages', callback);
    }
  }, {
    key: 'getLanguages',
    value: function getLanguages(textEditor, type) {
      var l = this.languages.get(textEditor);
      if (!l) {
        global.grammarManager.updateLanguage(textEditor);
        l = this.languages.get(textEditor);
        if (!l) {
          if (global.grammarManager.getGrammar(textEditor)) {
            this.languages.set(textEditor, l = {});
          } else {
            return;
          }
        }
      }
      return type ? l[type] : l.manual || l.auto || this.configLanguages || this.systemLanguages;
    }
  }, {
    key: 'setLanguages',
    value: function setLanguages(textEditor, languages, type) {
      var l = this.languages.get(textEditor) || {};
      l[type] = languages;
      this.languages.set(textEditor, l);
      this.emitter.emit('change-languages', null);
    }
  }]);

  return LanguageManager;
})(_atom.Disposable);

exports['default'] = LanguageManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2xhbmd1YWdlLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBR3lELE1BQU07O3dCQUMxQyxXQUFXOzs7O0FBSmhDLFdBQVcsQ0FBQTs7QUFFWCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7O0lBSWQsZUFBZTtZQUFmLGVBQWU7O0FBRXRCLFdBRk8sZUFBZSxHQUVuQjs7OzBCQUZJLGVBQWU7O0FBR2hDLCtCQUhpQixlQUFlLDZDQUcxQixZQUFNO0FBQ1YsWUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDM0IsRUFBQzs7OztBQUNGLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUE7QUFDNUMsUUFBTSxNQUFNLEdBQUcsc0JBQVMsSUFBSSxFQUFFLENBQUE7QUFDOUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDakUsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNsQyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDMUIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsK0JBQStCLEVBQUUsWUFBTTtBQUM3RCxhQUFLLHFCQUFxQixFQUFFLENBQUE7S0FDN0IsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7R0FDN0I7O2VBaEJrQixlQUFlOztXQWtCWixpQ0FBRztBQUN2QixVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDdkUsVUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsWUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7T0FDNUI7S0FDRjs7O1dBRW9CLDhCQUFDLFFBQVEsRUFBRTtBQUM5QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3JEOzs7V0FFWSxzQkFBQyxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQzlCLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3RDLFVBQUksQ0FBQyxDQUFDLEVBQUU7QUFDTixjQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNoRCxTQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDbEMsWUFBSSxDQUFDLENBQUMsRUFBRTtBQUNOLGNBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDaEQsZ0JBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7V0FDdkMsTUFBTTtBQUNMLG1CQUFNO1dBQ1A7U0FDRjtPQUNGO0FBQ0QsYUFBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLEFBQUMsQ0FBQTtLQUM3Rjs7O1dBRVksc0JBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDekMsVUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQzVDLE9BQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUE7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFBO0tBQzVDOzs7U0FsRGtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2xhbmd1YWdlLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG52YXIgdGFncyA9IHJlcXVpcmUoJ2xhbmd1YWdlLXRhZ3MnKVxuaW1wb3J0IHsgRGlzcG9zYWJsZSwgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgb3NMb2NhbGUgZnJvbSAnb3MtbG9jYWxlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYW5ndWFnZU1hbmFnZXIgZXh0ZW5kcyBEaXNwb3NhYmxlIHtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICB9KVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgY29uc3QgbG9jYWxlID0gb3NMb2NhbGUuc3luYygpXG4gICAgdGhpcy5zeXN0ZW1MYW5ndWFnZXMgPSBbdGFncyhsb2NhbGUucmVwbGFjZSgvXy9nLCAnLScpKS5mb3JtYXQoKV1cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMubGFuZ3VhZ2VzID0gbmV3IE1hcCgpXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci1zcGVsbC5kZWZhdWx0TGFuZ3VhZ2VzJywgKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVDb25maWdMYW5ndWFnZXMoKVxuICAgIH0pXG4gICAgdGhpcy51cGRhdGVDb25maWdMYW5ndWFnZXMoKVxuICB9XG5cbiAgdXBkYXRlQ29uZmlnTGFuZ3VhZ2VzICgpIHtcbiAgICB0aGlzLmNvbmZpZ0xhbmd1YWdlcyA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLXNwZWxsLmRlZmF1bHRMYW5ndWFnZXMnKVxuICAgIGlmICh0aGlzLmNvbmZpZ0xhbmd1YWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuY29uZmlnTGFuZ3VhZ2VzID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIG9uRGlkQ2hhbmdlTGFuZ3VhZ2VzIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2NoYW5nZS1sYW5ndWFnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIGdldExhbmd1YWdlcyAodGV4dEVkaXRvciwgdHlwZSkge1xuICAgIGxldCBsID0gdGhpcy5sYW5ndWFnZXMuZ2V0KHRleHRFZGl0b3IpXG4gICAgaWYgKCFsKSB7XG4gICAgICBnbG9iYWwuZ3JhbW1hck1hbmFnZXIudXBkYXRlTGFuZ3VhZ2UodGV4dEVkaXRvcilcbiAgICAgIGwgPSB0aGlzLmxhbmd1YWdlcy5nZXQodGV4dEVkaXRvcilcbiAgICAgIGlmICghbCkge1xuICAgICAgICBpZiAoZ2xvYmFsLmdyYW1tYXJNYW5hZ2VyLmdldEdyYW1tYXIodGV4dEVkaXRvcikpIHtcbiAgICAgICAgICB0aGlzLmxhbmd1YWdlcy5zZXQodGV4dEVkaXRvciwgbCA9IHt9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0eXBlID8gbFt0eXBlXSA6IChsLm1hbnVhbCB8fCBsLmF1dG8gfHwgdGhpcy5jb25maWdMYW5ndWFnZXMgfHwgdGhpcy5zeXN0ZW1MYW5ndWFnZXMpXG4gIH1cblxuICBzZXRMYW5ndWFnZXMgKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgdHlwZSkge1xuICAgIGxldCBsID0gdGhpcy5sYW5ndWFnZXMuZ2V0KHRleHRFZGl0b3IpIHx8IHt9XG4gICAgbFt0eXBlXSA9IGxhbmd1YWdlc1xuICAgIHRoaXMubGFuZ3VhZ2VzLnNldCh0ZXh0RWRpdG9yLCBsKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2UtbGFuZ3VhZ2VzJywgbnVsbClcbiAgfVxuXG59XG4iXX0=