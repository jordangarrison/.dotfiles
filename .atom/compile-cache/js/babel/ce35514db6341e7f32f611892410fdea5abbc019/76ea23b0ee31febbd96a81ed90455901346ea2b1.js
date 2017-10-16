Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */
/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _atom = require('atom');

var Status = (function (_Disposable) {
  _inherits(Status, _Disposable);

  function Status() {
    _classCallCheck(this, Status);

    _get(Object.getPrototypeOf(Status.prototype), 'constructor', this).call(this);
  }

  _createClass(Status, [{
    key: 'attach',
    value: function attach(statusBar) {
      this.view = new StatusView();
      this.tile = statusBar.addLeftTile({
        item: this.view,
        priority: -10
      });
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (this.tile) {
        this.tile.destroy();
        this.tile = undefined;
      }
      if (this.view) {
        this.view.destroy();
        this.view = undefined;
      }
    }
  }]);

  return Status;
})(_atom.Disposable);

exports['default'] = Status;

var StatusView = (function () {
  function StatusView() {
    var _this = this;

    _classCallCheck(this, StatusView);

    _etch2['default'].initialize(this);
    this.addTooltip();
    atom.workspace.onDidChangeActivePaneItem(function () {
      return _etch2['default'].update(_this);
    });
    this.status = 'ready';
  }

  _createClass(StatusView, [{
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
      this.tooltip = atom.tooltips.add(this.element, { title: 'Atom-LaTeX Panel' });
    }
  }, {
    key: 'update',
    value: function update() {
      this.addTooltip();
      return _etch2['default'].update(this);
    }
  }, {
    key: 'shouldDisplay',
    value: function shouldDisplay() {
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
  }, {
    key: 'render',
    value: function render() {
      if (!this.shouldDisplay()) {
        return _etch2['default'].dom('div', { id: 'atom-latex-status-bar', style: 'display: none' });
      }
      var handleClick = function handleClick() {
        if (atom_latex.latex) atom_latex.latex.panel.togglePanel();
      };
      return _etch2['default'].dom(
        'div',
        { id: 'atom-latex-status-bar', style: 'display: inline-block', onclick: handleClick },
        _etch2['default'].dom('i', { id: 'atom-latex-status-bar-icon', className: 'fa ' + this.getIcon() }),
        _etch2['default'].dom(
          'span',
          { style: 'margin-left: 5px' },
          'LaTeX'
        )
      );
    }
  }, {
    key: 'getIcon',
    value: function getIcon() {
      switch (this.status) {
        case 'error':
          return 'fa-times-circle';
        case 'warning':
          return 'fa-exclamation-circle';
        case 'typesetting':
          return 'fa-question-circle';
        case 'good':
          return 'fa-check-circle';
        case 'building':
          return 'fa-cog fa-spin';
        case 'skipped':
          return 'fa-question-circle atom-latex-latexmk-skipped';
        default:
          return 'fa-file-text-o';
      }
    }
  }]);

  return StatusView;
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdG9tLWxhdGV4L2xpYi92aWV3L3N0YXR1cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdpQixNQUFNOzs7O29CQUNJLE1BQU07O0lBRVosTUFBTTtZQUFOLE1BQU07O0FBQ2QsV0FEUSxNQUFNLEdBQ1g7MEJBREssTUFBTTs7QUFFdkIsK0JBRmlCLE1BQU0sNkNBRWhCO0dBQ1I7O2VBSGtCLE1BQU07O1dBS25CLGdCQUFDLFNBQVMsRUFBRTtBQUNoQixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO0FBQ2hDLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLGdCQUFRLEVBQUUsQ0FBQyxFQUFFO09BQ2QsQ0FBQyxDQUFBO0tBQ0g7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNuQixZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQTtPQUN0QjtBQUNELFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbkIsWUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUE7T0FDdEI7S0FDRjs7O1NBdEJrQixNQUFNOzs7cUJBQU4sTUFBTTs7SUF5QnJCLFVBQVU7QUFDSCxXQURQLFVBQVUsR0FDQTs7OzBCQURWLFVBQVU7O0FBRVosc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNqQixRQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDO2FBQU0sa0JBQUssTUFBTSxPQUFNO0tBQUEsQ0FBQyxDQUFBO0FBQ2pFLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFBO0dBQ3RCOztlQU5HLFVBQVU7OzZCQVFELGFBQUc7QUFDZCxVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN2QjtBQUNELFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3ZCO0FBQ0QsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtLQUM5RTs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDakIsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVZLHlCQUFHO0FBQ2QsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ2pELFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxlQUFPLEtBQUssQ0FBQTtPQUNiO0FBQ0QsVUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ2pDLFVBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixlQUFPLEtBQUssQ0FBQTtPQUNiO0FBQ0QsVUFBSSxBQUFDLE9BQU8sQ0FBQyxXQUFXLEtBQUssWUFBWSxJQUN0QyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDLEVBQUU7QUFDcEQsZUFBTyxJQUFJLENBQUE7T0FDWjtBQUNELGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtBQUN6QixlQUFPLCtCQUFLLEVBQUUsRUFBQyx1QkFBdUIsRUFBQyxLQUFLLEVBQUMsZUFBZSxHQUFFLENBQUE7T0FDL0Q7QUFDRCxVQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsR0FBUztBQUN0QixZQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQ2xCLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFBO09BQ3ZDLENBQUE7QUFDRCxhQUNFOztVQUFLLEVBQUUsRUFBQyx1QkFBdUIsRUFBQyxLQUFLLEVBQUMsdUJBQXVCLEVBQUMsT0FBTyxFQUFFLFdBQVcsQUFBQztRQUNqRiw2QkFBRyxFQUFFLEVBQUMsNEJBQTRCLEVBQUMsU0FBUyxVQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsQUFBRyxHQUFFO1FBQ3ZFOztZQUFNLEtBQUssRUFBQyxrQkFBa0I7O1NBQWE7T0FDdkMsQ0FDUDtLQUNGOzs7V0FFTSxtQkFBRztBQUNSLGNBQVEsSUFBSSxDQUFDLE1BQU07QUFDakIsYUFBSyxPQUFPO0FBQ1YsaUJBQU8saUJBQWlCLENBQUE7QUFBQSxBQUMxQixhQUFLLFNBQVM7QUFDWixpQkFBTyx1QkFBdUIsQ0FBQTtBQUFBLEFBQ2hDLGFBQUssYUFBYTtBQUNoQixpQkFBTyxvQkFBb0IsQ0FBQTtBQUFBLEFBQzdCLGFBQUssTUFBTTtBQUNULGlCQUFPLGlCQUFpQixDQUFBO0FBQUEsQUFDMUIsYUFBSyxVQUFVO0FBQ2IsaUJBQU8sZ0JBQWdCLENBQUE7QUFBQSxBQUN6QixhQUFLLFNBQVM7QUFDWixpQkFBTywrQ0FBK0MsQ0FBQTtBQUFBLEFBQ3hEO0FBQ0UsaUJBQU8sZ0JBQWdCLENBQUE7QUFBQSxPQUMxQjtLQUNGOzs7U0E1RUcsVUFBVSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXRvbS1sYXRleC9saWIvdmlldy9zdGF0dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1cyBleHRlbmRzIERpc3Bvc2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBhdHRhY2goc3RhdHVzQmFyKSB7XG4gICAgdGhpcy52aWV3ID0gbmV3IFN0YXR1c1ZpZXcoKVxuICAgIHRoaXMudGlsZSA9IHN0YXR1c0Jhci5hZGRMZWZ0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICBwcmlvcml0eTogLTEwXG4gICAgfSlcbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICBpZiAodGhpcy50aWxlKSB7XG4gICAgICB0aGlzLnRpbGUuZGVzdHJveSgpXG4gICAgICB0aGlzLnRpbGUgPSB1bmRlZmluZWRcbiAgICB9XG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgdGhpcy52aWV3LmRlc3Ryb3koKVxuICAgICAgdGhpcy52aWV3ID0gdW5kZWZpbmVkXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFN0YXR1c1ZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLmFkZFRvb2x0aXAoKVxuICAgIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oKCkgPT4gZXRjaC51cGRhdGUodGhpcykpXG4gICAgdGhpcy5zdGF0dXMgPSAncmVhZHknXG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgICB9XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICBhZGRUb29sdGlwKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7IHRpdGxlOiAnQXRvbS1MYVRlWCBQYW5lbCcgfSlcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmFkZFRvb2x0aXAoKVxuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgc2hvdWxkRGlzcGxheSgpIHtcbiAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKClcbiAgICBpZiAoIWdyYW1tYXIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAoKGdyYW1tYXIucGFja2FnZU5hbWUgPT09ICdhdG9tLWxhdGV4JykgfHxcbiAgICAgIChncmFtbWFyLnNjb3BlTmFtZS5pbmRleE9mKCd0ZXh0LnRleC5sYXRleCcpID4gLTEpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkRGlzcGxheSgpKSB7XG4gICAgICByZXR1cm4gPGRpdiBpZD1cImF0b20tbGF0ZXgtc3RhdHVzLWJhclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiLz5cbiAgICB9XG4gICAgbGV0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xuICAgICAgaWYgKGF0b21fbGF0ZXgubGF0ZXgpXG4gICAgICAgIGF0b21fbGF0ZXgubGF0ZXgucGFuZWwudG9nZ2xlUGFuZWwoKVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImF0b20tbGF0ZXgtc3RhdHVzLWJhclwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrXCIgb25jbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgICAgICA8aSBpZD1cImF0b20tbGF0ZXgtc3RhdHVzLWJhci1pY29uXCIgY2xhc3NOYW1lPXtgZmEgJHt0aGlzLmdldEljb24oKX1gfS8+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDVweFwiPkxhVGVYPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0SWNvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdHVzKSB7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIHJldHVybiAnZmEtdGltZXMtY2lyY2xlJ1xuICAgICAgY2FzZSAnd2FybmluZyc6XG4gICAgICAgIHJldHVybiAnZmEtZXhjbGFtYXRpb24tY2lyY2xlJ1xuICAgICAgY2FzZSAndHlwZXNldHRpbmcnOlxuICAgICAgICByZXR1cm4gJ2ZhLXF1ZXN0aW9uLWNpcmNsZSdcbiAgICAgIGNhc2UgJ2dvb2QnOlxuICAgICAgICByZXR1cm4gJ2ZhLWNoZWNrLWNpcmNsZSdcbiAgICAgIGNhc2UgJ2J1aWxkaW5nJzpcbiAgICAgICAgcmV0dXJuICdmYS1jb2cgZmEtc3BpbidcbiAgICAgIGNhc2UgJ3NraXBwZWQnOlxuICAgICAgICByZXR1cm4gJ2ZhLXF1ZXN0aW9uLWNpcmNsZSBhdG9tLWxhdGV4LWxhdGV4bWstc2tpcHBlZCdcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnZmEtZmlsZS10ZXh0LW8nXG4gICAgfVxuICB9XG59XG4iXX0=