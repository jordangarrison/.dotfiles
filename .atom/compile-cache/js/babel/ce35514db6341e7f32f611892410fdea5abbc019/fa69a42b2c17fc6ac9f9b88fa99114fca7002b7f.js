Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

'use babel';

var tags = require('language-tags');

var LanguageStatusView = (function (_HTMLDivElement) {
  _inherits(LanguageStatusView, _HTMLDivElement);

  function LanguageStatusView() {
    _classCallCheck(this, LanguageStatusView);

    _get(Object.getPrototypeOf(LanguageStatusView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(LanguageStatusView, [{
    key: 'initialize',
    value: function initialize(statusBar) {
      this.disposables = new _atom.CompositeDisposable();
      this.statusBar = statusBar;
      this.classList.add('language-status', 'inline-block');
      this.languageLink = document.createElement('a');
      this.languageLink.classList.add('inline-block');
      this.languageLink.href = '#';
      this.disposables.add(atom.tooltips.add(this.languageLink, { title: function title() {
          var textEditor = atom.workspace.getActiveTextEditor();
          if (textEditor != null) {
            return _.map(global.languageManager.getLanguages(textEditor), function (lang) {
              return lang + ' / ' + _.map(tags(lang).subtags(), function (subtag) {
                return subtag.descriptions()[0];
              }).join(', ');
            }).join('\n');
          }
          return '';
        } }));
      this.appendChild(this.languageLink);
      this.handleEvents();
      var tile = this.statusBar.addRightTile({ priority: 21, item: this });
      this.disposables.add(new _atom.Disposable(function () {
        return tile.destroy();
      }));
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var _this = this;

      this.disposables.add(global.languageManager.onDidChangeLanguages(function () {
        _this.updateLanguageText();
      }));

      this.disposables.add(this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem(function () {
        _this.updateLanguageText();
      }));

      var clickHandler = function clickHandler() {
        atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'linter-spell:show-language-selector');
        return false;
      };
      this.addEventListener('click', clickHandler);
      this.disposables.add({ dispose: function dispose() {
          return _this.removeEventListener('click', clickHandler);
        } });

      this.updateLanguageText();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.disposables.dispose();
    }
  }, {
    key: 'updateLanguageText',
    value: function updateLanguageText() {
      var textEditor = atom.workspace.getActiveTextEditor();
      var languages = undefined;
      if (textEditor != null) {
        languages = global.languageManager.getLanguages(textEditor);
        // if (languages) languages = global.languageManager.resolveLanguages(languages)
      }
      if (languages) {
        this.languageLink.textContent = languages.join();
        this.style.display = '';
      } else {
        this.style.display = 'none';
      }
    }
  }]);

  return LanguageStatusView;
})(HTMLDivElement);

exports['default'] = document.registerElement('language-selector-status', { prototype: LanguageStatusView.prototype });
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2xhbmd1YWdlLXN0YXR1cy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVnRCxNQUFNOztzQkFFbkMsUUFBUTs7SUFBZixDQUFDOztBQUpiLFdBQVcsQ0FBQTs7QUFHWCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7O0lBRzdCLGtCQUFrQjtZQUFsQixrQkFBa0I7O1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzsrQkFBbEIsa0JBQWtCOzs7ZUFBbEIsa0JBQWtCOztXQUNYLG9CQUFDLFNBQVMsRUFBRTtBQUNyQixVQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzFCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3JELFVBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFBO0FBQzVCLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBQyxLQUFLLEVBQUUsaUJBQU07QUFDdEUsY0FBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3JELGNBQUksVUFBVSxJQUFJLElBQUksRUFBRTtBQUN0QixtQkFBTyxDQUFDLENBQUMsR0FBRyxDQUNWLE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBWSxD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QUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvbGFuZ3VhZ2Utc3RhdHVzLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbnZhciB0YWdzID0gcmVxdWlyZSgnbGFuZ3VhZ2UtdGFncycpXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcblxuY2xhc3MgTGFuZ3VhZ2VTdGF0dXNWaWV3IGV4dGVuZHMgSFRNTERpdkVsZW1lbnQge1xuICBpbml0aWFsaXplIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsYW5ndWFnZS1zdGF0dXMnLCAnaW5saW5lLWJsb2NrJylcbiAgICB0aGlzLmxhbmd1YWdlTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIHRoaXMubGFuZ3VhZ2VMaW5rLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpXG4gICAgdGhpcy5sYW5ndWFnZUxpbmsuaHJlZiA9ICcjJ1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMubGFuZ3VhZ2VMaW5rLCB7dGl0bGU6ICgpID0+IHtcbiAgICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAodGV4dEVkaXRvciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChcbiAgICAgICAgICBnbG9iYWwubGFuZ3VhZ2VNYW5hZ2VyLmdldExhbmd1YWdlcyh0ZXh0RWRpdG9yKSxcbiAgICAgICAgICBsYW5nID0+IGxhbmcgKyAnIC8gJyArIF8ubWFwKHRhZ3MobGFuZykuc3VidGFncygpLCBzdWJ0YWcgPT4gc3VidGFnLmRlc2NyaXB0aW9ucygpWzBdKS5qb2luKCcsICcpKS5qb2luKCdcXG4nKVxuICAgICAgfVxuICAgICAgcmV0dXJuICcnXG4gICAgfX0pKVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5sYW5ndWFnZUxpbmspXG4gICAgdGhpcy5oYW5kbGVFdmVudHMoKVxuICAgIGxldCB0aWxlID0gdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtwcmlvcml0eTogMjEsIGl0ZW06IHRoaXN9KVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHRpbGUuZGVzdHJveSgpKSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50cyAoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZ2xvYmFsLmxhbmd1YWdlTWFuYWdlci5vbkRpZENoYW5nZUxhbmd1YWdlcygoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUxhbmd1YWdlVGV4dCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlTGFuZ3VhZ2VUZXh0KClcbiAgICB9KSlcblxuICAgIGxldCBjbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLCAnbGludGVyLXNwZWxsOnNob3ctbGFuZ3VhZ2Utc2VsZWN0b3InKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoe2Rpc3Bvc2U6ICgpID0+IHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpfSlcblxuICAgIHRoaXMudXBkYXRlTGFuZ3VhZ2VUZXh0KClcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIH1cblxuICB1cGRhdGVMYW5ndWFnZVRleHQgKCkge1xuICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgbGV0IGxhbmd1YWdlc1xuICAgIGlmICh0ZXh0RWRpdG9yICE9IG51bGwpIHtcbiAgICAgIGxhbmd1YWdlcyA9IGdsb2JhbC5sYW5ndWFnZU1hbmFnZXIuZ2V0TGFuZ3VhZ2VzKHRleHRFZGl0b3IpXG4gICAgICAvLyBpZiAobGFuZ3VhZ2VzKSBsYW5ndWFnZXMgPSBnbG9iYWwubGFuZ3VhZ2VNYW5hZ2VyLnJlc29sdmVMYW5ndWFnZXMobGFuZ3VhZ2VzKVxuICAgIH1cbiAgICBpZiAobGFuZ3VhZ2VzKSB7XG4gICAgICB0aGlzLmxhbmd1YWdlTGluay50ZXh0Q29udGVudCA9IGxhbmd1YWdlcy5qb2luKClcbiAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xhbmd1YWdlLXNlbGVjdG9yLXN0YXR1cycsIHtwcm90b3R5cGU6IExhbmd1YWdlU3RhdHVzVmlldy5wcm90b3R5cGV9KVxuIl19