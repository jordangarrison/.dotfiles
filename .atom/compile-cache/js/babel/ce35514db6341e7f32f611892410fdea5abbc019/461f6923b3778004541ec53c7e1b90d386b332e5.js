Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */
/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _atom = require('atom');

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var Panel = (function (_Disposable) {
  _inherits(Panel, _Disposable);

  function Panel(latex) {
    var _this = this;

    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this);
    this.latex = latex;
    this.showPanel = true;
    this.view = new PanelView(latex);
    this.provider = atom.views.addViewProvider(Panel, function (model) {
      return model.view.element;
    });
    this.panel = atom.workspace.addBottomPanel({
      item: this,
      visible: this.shouldDisplay()
    });
    atom.workspace.onDidChangeActivePaneItem(function () {
      if (_this.shouldDisplay()) {
        _this.panel.show();
      } else {
        _this.panel.hide();
      }
    });
  }

  _createClass(Panel, [{
    key: 'togglePanel',
    value: function togglePanel() {
      if (this.panel.visible) {
        this.showPanel = false;
        this.panel.hide();
      } else {
        this.showPanel = true;
        if (this.shouldDisplay()) {
          this.panel.show();
        }
      }
    }
  }, {
    key: 'shouldDisplay',
    value: function shouldDisplay() {
      if (!this.showPanel) {
        return false;
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return false;
      }
      var grammar = editor.getGrammar();
      if (!grammar) {
        return false;
      }
      if (grammar.packageName === 'atom-latex' || grammar.scopeName.indexOf('text.tex.latex') > -1) {
        return true;
      }
      return false;
    }
  }]);

  return Panel;
})(_atom.Disposable);

exports['default'] = Panel;

var PanelView = (function () {
  function PanelView(latex) {
    var _this2 = this;

    _classCallCheck(this, PanelView);

    this.latex = latex;
    this.showLog = true;
    this.mouseMove = function (e) {
      return _this2.resize(e);
    };
    this.mouseRelease = function (e) {
      return _this2.stopResize(e);
    };
    _etch2['default'].initialize(this);
  }

  _createClass(PanelView, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var logs = undefined;
      if (this.latex.logger && this.latex.logger.log.length > 0 && this.showLog) {
        var typesetting = _etch2['default'].dom('div', null);
        if (atom.config.get('atom-latex.combine_typesetting_log')) {
          var types = this.latex.logger.log.map(function (item) {
            return item.type;
          });
          if (types.indexOf('typesetting') > -1) {
            typesetting = _etch2['default'].dom(_message2['default'], { message: {
                type: 'status',
                text: 'There are some hidden typesetting messages.'
              } });
          }
        }
        var items = this.latex.logger.log.map(function (item) {
          return _etch2['default'].dom(_message2['default'], { message: item, latex: _this3.latex });
        });
        logs = _etch2['default'].dom(
          'atom-panel',
          { id: 'atom-latex-logs', className: 'bottom' },
          _etch2['default'].dom('div', { id: 'atom-latex-panel-resizer', onmousedown: function (e) {
              return _this3.startResize(e);
            } }),
          items,
          typesetting
        );
      }
      var root = 'LaTeX root file not set.';
      if (this.latex.mainFile) {
        root = this.latex.mainFile;
      }

      var buttons = _etch2['default'].dom(
        'div',
        { id: 'atom-latex-controls' },
        _etch2['default'].dom(ButtonView, { icon: 'play', tooltip: 'Build LaTeX', click: function () {
            return _this3.latex.builder.build();
          } }),
        _etch2['default'].dom(ButtonView, { icon: 'search', tooltip: 'Preview PDF', click: function () {
            return _this3.latex.viewer.openViewer();
          } }),
        _etch2['default'].dom(ButtonView, { icon: 'list-ul', tooltip: this.showLog ? "Hide build log" : "Show build log", click: function () {
            return _this3.toggleLog();
          }, dim: !this.showLog }),
        _etch2['default'].dom(ButtonView, { icon: 'file-text-o', tooltip: 'Show raw log', click: function () {
            return _this3.latex.logger.showLog();
          } }),
        _etch2['default'].dom(
          'div',
          { className: 'atom-latex-control-separator' },
          '|'
        ),
        _etch2['default'].dom(ButtonView, { icon: 'home', tooltip: 'Set LaTeX root', click: function () {
            return _this3.latex.manager.refindMain();
          } }),
        _etch2['default'].dom('input', { id: 'atom-latex-root-input', type: 'file', style: 'display:none' }),
        _etch2['default'].dom(
          'div',
          { id: 'atom-latex-root-text' },
          root
        )
      );
      return _etch2['default'].dom(
        'div',
        null,
        logs,
        buttons
      );
    }
  }, {
    key: 'toggleLog',
    value: function toggleLog() {
      this.showLog = !this.showLog;
      this.update();
    }
  }, {
    key: 'resize',
    value: function resize(e) {
      height = Math.max(this.startY - e.clientY + this.startHeight, 25);
      document.getElementById('atom-latex-logs').style.height = height + 'px';
      document.getElementById('atom-latex-logs').style.maxHeight = 'none';
    }
  }, {
    key: 'startResize',
    value: function startResize(e) {
      document.addEventListener('mousemove', this.mouseMove, true);
      document.addEventListener('mouseup', this.mouseRelease, true);
      this.startY = e.clientY;
      this.startHeight = document.getElementById('atom-latex-logs').offsetHeight;
    }
  }, {
    key: 'stopResize',
    value: function stopResize(e) {
      document.removeEventListener('mousemove', this.mouseMove, true);
      document.removeEventListener('mouseup', this.mouseRelease, true);
    }
  }]);

  return PanelView;
})();

var ButtonView = (function () {
  function ButtonView() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ButtonView);

    this.properties = properties;
    _etch2['default'].initialize(this);
    this.addTooltip();
  }

  _createClass(ButtonView, [{
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'addTooltip',
    value: function addTooltip() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      this.tooltip = atom.tooltips.add(this.element, { title: this.properties.tooltip });
    }
  }, {
    key: 'update',
    value: function update(properties) {
      this.properties = properties;
      this.addTooltip();
      return _etch2['default'].update(this);
    }
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom('i', { className: 'fa fa-' + this.properties.icon + ' atom-latex-control-icon ' + (this.properties.dim ? ' atom-latex-dimmed' : ''), onclick: this.properties.click });
    }
  }]);

  return ButtonView;
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdG9tLWxhdGV4L2xpYi92aWV3L3BhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7b0JBQ0ksTUFBTTs7dUJBQ2IsV0FBVzs7OztJQUVWLEtBQUs7WUFBTCxLQUFLOztBQUNiLFdBRFEsS0FBSyxDQUNaLEtBQUssRUFBRTs7OzBCQURBLEtBQUs7O0FBRXRCLCtCQUZpQixLQUFLLDZDQUVmO0FBQ1AsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNoQyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssRUFDOUMsVUFBQSxLQUFLO2FBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFDekMsVUFBSSxFQUFFLElBQUk7QUFDVixhQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtLQUM5QixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLFlBQU07QUFDN0MsVUFBSSxNQUFLLGFBQWEsRUFBRSxFQUFFO0FBQ3hCLGNBQUssS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2xCLE1BQU07QUFDTCxjQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjtLQUNGLENBQUMsQ0FBQTtHQUNIOztlQW5Ca0IsS0FBSzs7V0FxQmIsdUJBQUc7QUFDWixVQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxT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TyxFQUFFLENBQUMsQ0FBQTtLQUNuRjs7O1dBRUssZ0JBQUMsVUFBVSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNqQixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRUssa0JBQUc7QUFDUCxhQUNFLDZCQUFHLFNBQVMsYUFBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksa0NBQTRCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFDLG9CQUFvQixHQUFDLEVBQUUsQ0FBQSxBQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxBQUFDLEdBQUUsQ0FDeEo7S0FDRjs7O1NBL0JHLFVBQVUiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3ZpZXcvcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL21lc3NhZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGNvbnN0cnVjdG9yKGxhdGV4KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubGF0ZXggPSBsYXRleFxuICAgIHRoaXMuc2hvd1BhbmVsID0gdHJ1ZVxuICAgIHRoaXMudmlldyA9IG5ldyBQYW5lbFZpZXcobGF0ZXgpXG4gICAgdGhpcy5wcm92aWRlciA9IGF0b20udmlld3MuYWRkVmlld1Byb3ZpZGVyKFBhbmVsLFxuICAgICAgbW9kZWwgPT4gbW9kZWwudmlldy5lbGVtZW50KVxuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgICBpdGVtOiB0aGlzLFxuICAgICAgdmlzaWJsZTogdGhpcy5zaG91bGREaXNwbGF5KClcbiAgICB9KVxuICAgIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkRGlzcGxheSgpKSB7XG4gICAgICAgIHRoaXMucGFuZWwuc2hvdygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0b2dnbGVQYW5lbCgpIHtcbiAgICBpZiAodGhpcy5wYW5lbC52aXNpYmxlKSB7XG4gICAgICB0aGlzLnNob3dQYW5lbCA9IGZhbHNlXG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3dQYW5lbCA9IHRydWVcbiAgICAgIGlmICh0aGlzLnNob3VsZERpc3BsYXkoKSkge1xuICAgICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3VsZERpc3BsYXkoKSB7XG4gICAgaWYgKCF0aGlzLnNob3dQYW5lbCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGxldCBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKVxuICAgIGlmICghZ3JhbW1hcikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmICgoZ3JhbW1hci5wYWNrYWdlTmFtZSA9PT0gJ2F0b20tbGF0ZXgnKSB8fFxuICAgICAgKGdyYW1tYXIuc2NvcGVOYW1lLmluZGV4T2YoJ3RleHQudGV4LmxhdGV4JykgPiAtMSkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmNsYXNzIFBhbmVsVmlldyB7XG4gIGNvbnN0cnVjdG9yKGxhdGV4KSB7XG4gICAgdGhpcy5sYXRleCA9IGxhdGV4XG4gICAgdGhpcy5zaG93TG9nID0gdHJ1ZVxuICAgIHRoaXMubW91c2VNb3ZlID0gZSA9PiB0aGlzLnJlc2l6ZShlKVxuICAgIHRoaXMubW91c2VSZWxlYXNlID0gZSA9PiB0aGlzLnN0b3BSZXNpemUoZSlcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGxvZ3MgPSB1bmRlZmluZWRcbiAgICBpZiAodGhpcy5sYXRleC5sb2dnZXIgJiYgdGhpcy5sYXRleC5sb2dnZXIubG9nLmxlbmd0aCA+IDAgJiYgdGhpcy5zaG93TG9nKSB7XG4gICAgICBsZXQgdHlwZXNldHRpbmcgPSA8ZGl2IC8+XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmNvbWJpbmVfdHlwZXNldHRpbmdfbG9nJykpIHtcbiAgICAgICAgbGV0IHR5cGVzID0gdGhpcy5sYXRleC5sb2dnZXIubG9nLm1hcChpdGVtID0+IGl0ZW0udHlwZSlcbiAgICAgICAgaWYgKHR5cGVzLmluZGV4T2YoJ3R5cGVzZXR0aW5nJykgPiAtMSkge1xuICAgICAgICAgIHR5cGVzZXR0aW5nID0gPE1lc3NhZ2UgbWVzc2FnZT17e1xuICAgICAgICAgICAgdHlwZTogJ3N0YXR1cycsXG4gICAgICAgICAgICB0ZXh0OiAnVGhlcmUgYXJlIHNvbWUgaGlkZGVuIHR5cGVzZXR0aW5nIG1lc3NhZ2VzLidcbiAgICAgICAgICB9fS8+XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBpdGVtcyA9IHRoaXMubGF0ZXgubG9nZ2VyLmxvZy5tYXAoaXRlbSA9PiA8TWVzc2FnZSBtZXNzYWdlPXtpdGVtfSBsYXRleD17dGhpcy5sYXRleH0vPilcbiAgICAgIGxvZ3MgPVxuICAgICAgICA8YXRvbS1wYW5lbCBpZD1cImF0b20tbGF0ZXgtbG9nc1wiIGNsYXNzTmFtZT1cImJvdHRvbVwiPlxuICAgICAgICAgIDxkaXYgaWQ9XCJhdG9tLWxhdGV4LXBhbmVsLXJlc2l6ZXJcIiBvbm1vdXNlZG93bj17ZSA9PiB0aGlzLnN0YXJ0UmVzaXplKGUpfSAvPlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICB7dHlwZXNldHRpbmd9XG4gICAgICAgIDwvYXRvbS1wYW5lbD5cbiAgICB9XG4gICAgbGV0IHJvb3QgPSAnTGFUZVggcm9vdCBmaWxlIG5vdCBzZXQuJ1xuICAgIGlmICh0aGlzLmxhdGV4Lm1haW5GaWxlKSB7XG4gICAgICByb290ID0gdGhpcy5sYXRleC5tYWluRmlsZVxuICAgIH1cblxuICAgIGxldCBidXR0b25zID1cbiAgICAgIDxkaXYgaWQ9XCJhdG9tLWxhdGV4LWNvbnRyb2xzXCI+XG4gICAgICAgIDxCdXR0b25WaWV3IGljb249XCJwbGF5XCIgdG9vbHRpcD1cIkJ1aWxkIExhVGVYXCIgY2xpY2s9eygpPT50aGlzLmxhdGV4LmJ1aWxkZXIuYnVpbGQoKX0vPlxuICAgICAgICA8QnV0dG9uVmlldyBpY29uPVwic2VhcmNoXCIgdG9vbHRpcD1cIlByZXZpZXcgUERGXCIgY2xpY2s9eygpPT50aGlzLmxhdGV4LnZpZXdlci5vcGVuVmlld2VyKCl9Lz5cbiAgICAgICAgPEJ1dHRvblZpZXcgaWNvbj1cImxpc3QtdWxcIiB0b29sdGlwPXt0aGlzLnNob3dMb2c/XCJIaWRlIGJ1aWxkIGxvZ1wiOlwiU2hvdyBidWlsZCBsb2dcIn0gY2xpY2s9eygpID0+IHRoaXMudG9nZ2xlTG9nKCl9IGRpbT17IXRoaXMuc2hvd0xvZ30vPlxuICAgICAgICA8QnV0dG9uVmlldyBpY29uPVwiZmlsZS10ZXh0LW9cIiB0b29sdGlwPVwiU2hvdyByYXcgbG9nXCIgY2xpY2s9eygpPT50aGlzLmxhdGV4LmxvZ2dlci5zaG93TG9nKCl9Lz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdG9tLWxhdGV4LWNvbnRyb2wtc2VwYXJhdG9yXCI+fDwvZGl2PlxuICAgICAgICA8QnV0dG9uVmlldyBpY29uPVwiaG9tZVwiIHRvb2x0aXA9XCJTZXQgTGFUZVggcm9vdFwiIGNsaWNrPXsoKT0+dGhpcy5sYXRleC5tYW5hZ2VyLnJlZmluZE1haW4oKX0vPlxuICAgICAgICA8aW5wdXQgaWQ9XCJhdG9tLWxhdGV4LXJvb3QtaW5wdXRcIiB0eXBlPSdmaWxlJyBzdHlsZT1cImRpc3BsYXk6bm9uZVwiLz5cbiAgICAgICAgPGRpdiBpZD1cImF0b20tbGF0ZXgtcm9vdC10ZXh0XCI+e3Jvb3R9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2xvZ3N9XG4gICAgICAgIHtidXR0b25zfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgdG9nZ2xlTG9nKCkge1xuICAgIHRoaXMuc2hvd0xvZyA9ICF0aGlzLnNob3dMb2dcbiAgICB0aGlzLnVwZGF0ZSgpXG4gIH1cblxuICByZXNpemUoZSkge1xuICAgIGhlaWdodCA9IE1hdGgubWF4KHRoaXMuc3RhcnRZIC0gZS5jbGllbnRZICsgdGhpcy5zdGFydEhlaWdodCwgMjUpXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0b20tbGF0ZXgtbG9ncycpLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXRvbS1sYXRleC1sb2dzJykuc3R5bGUubWF4SGVpZ2h0ID0gJ25vbmUnXG4gIH1cblxuICBzdGFydFJlc2l6ZShlKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZU1vdmUsIHRydWUpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VSZWxlYXNlLCB0cnVlKVxuICAgIHRoaXMuc3RhcnRZID0gZS5jbGllbnRZXG4gICAgdGhpcy5zdGFydEhlaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdG9tLWxhdGV4LWxvZ3MnKS5vZmZzZXRIZWlnaHRcbiAgfVxuXG4gIHN0b3BSZXNpemUoZSkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlLCB0cnVlKVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlUmVsZWFzZSwgdHJ1ZSlcbiAgfVxufVxuXG5jbGFzcyBCdXR0b25WaWV3IHtcbiAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIHRoaXMuYWRkVG9vbHRpcCgpXG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgICB9XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICBhZGRUb29sdGlwKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7IHRpdGxlOiB0aGlzLnByb3BlcnRpZXMudG9vbHRpcCB9KVxuICB9XG5cbiAgdXBkYXRlKHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgdGhpcy5hZGRUb29sdGlwKClcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGkgY2xhc3NOYW1lPXtgZmEgZmEtJHt0aGlzLnByb3BlcnRpZXMuaWNvbn0gYXRvbS1sYXRleC1jb250cm9sLWljb24gJHt0aGlzLnByb3BlcnRpZXMuZGltPycgYXRvbS1sYXRleC1kaW1tZWQnOicnfWB9IG9uY2xpY2s9e3RoaXMucHJvcGVydGllcy5jbGlja30vPlxuICAgIClcbiAgfVxuXG5cbn1cbiJdfQ==