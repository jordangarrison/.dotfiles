Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _electron = require('electron');

'use babel';

var EditorTokens = (function () {
  function EditorTokens() {
    _classCallCheck(this, EditorTokens);

    this.WORKER_PATH = 'file://' + (0, _path.join)(__dirname, 'editor-tokens-worker.html');

    this.awaitingTokens = false;
    this.tokens = new Map();

    this.worker = new _electron.remote.BrowserWindow({ width: 50, height: 50, show: false });
    this.worker.loadURL(this.WORKER_PATH);

    this._initializeIpc();
  }

  _createClass(EditorTokens, [{
    key: '_initializeIpc',
    value: function _initializeIpc() {
      var _this = this;

      _electron.ipcRenderer.on('tokens', function (event, editorId, tokens) {
        var editor = [].concat(_toConsumableArray(atom.textEditors.editors)).find(function (e) {
          return e.id === editorId;
        });
        if (!editor) {
          return;
        }

        _this.tokens.set(editor, tokens);
        _this.awaitingTokens = false;
      });

      this.worker.webContents.once('did-finish-load', function () {
        var grammar = atom.grammars.grammarForScopeName('source.java');
        if (!grammar) {
          // Oops. Not loaded yet. It will be sent before tokenizing
          return;
        }

        _this.worker.webContents.send('grammar-path', grammar.path);
      });
    }
  }, {
    key: 'get',
    value: function get(editor) {
      if (!this.tokens.has(editor)) {
        this.initializeForEditor(editor);
        return [];
      }

      return this.tokens.get(editor);
    }
  }, {
    key: 'refreshTokens',
    value: function refreshTokens(editor) {
      if (this.awaitingTokens) {
        // Quite CPU intensive, so don't have more than 1 running
        return;
      }

      var grammar = atom.grammars.grammarForScopeName('source.java');
      if (!grammar) {
        // Not loaded. Java grammar possibly not installed. Skip refreshing.
        return;
      }
      var focusedWindow = _electron.remote.BrowserWindow.getFocusedWindow();
      if (!focusedWindow) {
        // Lost focus. Skip refreshing.
        return;
      }

      this.awaitingTokens = true;
      this.worker.webContents.send('grammar-path', grammar.path);
      this.worker.webContents.send('tokenize', editor.id, editor.getText(), focusedWindow.id);
    }
  }, {
    key: 'initializeForEditor',
    value: function initializeForEditor(editor) {
      var _this2 = this;

      this.refreshTokens(editor);

      editor.onDidStopChanging(function () {
        _this2.refreshTokens(editor);
      });

      editor.onDidDestroy(function () {
        _this2.tokens['delete'](editor);
      });
    }
  }]);

  return EditorTokens;
})();

exports.EditorTokens = EditorTokens;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvZWRpdG9yLXRva2Vucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVxQixNQUFNOzt3QkFDZ0IsVUFBVTs7QUFIckQsV0FBVyxDQUFDOztJQUtOLFlBQVk7QUFHTCxXQUhQLFlBQVksR0FHRjswQkFIVixZQUFZOztTQUNoQixXQUFXLGVBQWEsZ0JBQUssU0FBUyxFQUFFLDJCQUEyQixDQUFDOztBQUdsRSxRQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUM1QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxpQkFBTyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDL0UsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV0QyxRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7O2VBWEcsWUFBWTs7V0FhRiwwQkFBRzs7O0FBQ2YsNEJBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFLO0FBQzVDLFlBQU0sTUFBTSxHQUFHLDZCQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFBLENBQUM7aUJBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxRQUFRO1NBQUEsQ0FBQyxDQUFDO0FBQzVFLFlBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxpQkFBTztTQUNSOztBQUVELGNBQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEMsY0FBSyxjQUFjLEdBQUcsS0FBSyxDQUFDO09BQzdCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsWUFBTTtBQUNwRCxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRVosaUJBQU87U0FDUjs7QUFFRCxjQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDNUQsQ0FBQyxDQUFDO0tBQ0o7OztXQUVFLGFBQUMsTUFBTSxFQUFFO0FBQ1YsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzVCLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUVELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEM7OztXQUVZLHVCQUFDLE1BQU0sRUFBRTtBQUNwQixVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7O0FBRXZCLGVBQU87T0FDUjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRVosZUFBTztPQUNSO0FBQ0QsVUFBTSxhQUFhLEdBQUcsaUJBQU8sYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDOUQsVUFBSSxDQUFDLGFBQWEsRUFBRTs7QUFFbEIsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ3JDLE1BQU0sQ0FBQyxFQUFFLEVBQ1QsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUNoQixhQUFhLENBQUMsRUFBRSxDQUNqQixDQUFDO0tBQ0g7OztXQUVrQiw2QkFBQyxNQUFNLEVBQUU7OztBQUMxQixVQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQixZQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBTTtBQUM3QixlQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUM1QixDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQ3hCLGVBQUssTUFBTSxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDNUIsQ0FBQyxDQUFDO0tBQ0o7OztTQWhGRyxZQUFZOzs7UUFtRlQsWUFBWSxHQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhLW1pbnVzL2xpYi9lZGl0b3ItdG9rZW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGlwY1JlbmRlcmVyIGFzIGlwYywgcmVtb3RlIH0gZnJvbSAnZWxlY3Ryb24nO1xuXG5jbGFzcyBFZGl0b3JUb2tlbnMge1xuICBXT1JLRVJfUEFUSCA9IGBmaWxlOi8vJHtqb2luKF9fZGlybmFtZSwgJ2VkaXRvci10b2tlbnMtd29ya2VyLmh0bWwnKX1gO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXdhaXRpbmdUb2tlbnMgPSBmYWxzZTtcbiAgICB0aGlzLnRva2VucyA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMud29ya2VyID0gbmV3IHJlbW90ZS5Ccm93c2VyV2luZG93KHsgd2lkdGg6IDUwLCBoZWlnaHQ6IDUwLCBzaG93OiBmYWxzZSB9KTtcbiAgICB0aGlzLndvcmtlci5sb2FkVVJMKHRoaXMuV09SS0VSX1BBVEgpO1xuXG4gICAgdGhpcy5faW5pdGlhbGl6ZUlwYygpO1xuICB9XG5cbiAgX2luaXRpYWxpemVJcGMoKSB7XG4gICAgaXBjLm9uKCd0b2tlbnMnLCAoZXZlbnQsIGVkaXRvcklkLCB0b2tlbnMpID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IFsgLi4uYXRvbS50ZXh0RWRpdG9ycy5lZGl0b3JzIF0uZmluZChlID0+IGUuaWQgPT09IGVkaXRvcklkKTtcbiAgICAgIGlmICghZWRpdG9yKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy50b2tlbnMuc2V0KGVkaXRvciwgdG9rZW5zKTtcbiAgICAgIHRoaXMuYXdhaXRpbmdUb2tlbnMgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHRoaXMud29ya2VyLndlYkNvbnRlbnRzLm9uY2UoJ2RpZC1maW5pc2gtbG9hZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3NvdXJjZS5qYXZhJyk7XG4gICAgICBpZiAoIWdyYW1tYXIpIHtcbiAgICAgICAgLy8gT29wcy4gTm90IGxvYWRlZCB5ZXQuIEl0IHdpbGwgYmUgc2VudCBiZWZvcmUgdG9rZW5pemluZ1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMud29ya2VyLndlYkNvbnRlbnRzLnNlbmQoJ2dyYW1tYXItcGF0aCcsIGdyYW1tYXIucGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQoZWRpdG9yKSB7XG4gICAgaWYgKCF0aGlzLnRva2Vucy5oYXMoZWRpdG9yKSkge1xuICAgICAgdGhpcy5pbml0aWFsaXplRm9yRWRpdG9yKGVkaXRvcik7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudG9rZW5zLmdldChlZGl0b3IpO1xuICB9XG5cbiAgcmVmcmVzaFRva2VucyhlZGl0b3IpIHtcbiAgICBpZiAodGhpcy5hd2FpdGluZ1Rva2Vucykge1xuICAgICAgLy8gUXVpdGUgQ1BVIGludGVuc2l2ZSwgc28gZG9uJ3QgaGF2ZSBtb3JlIHRoYW4gMSBydW5uaW5nXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgnc291cmNlLmphdmEnKTtcbiAgICBpZiAoIWdyYW1tYXIpIHtcbiAgICAgIC8vIE5vdCBsb2FkZWQuIEphdmEgZ3JhbW1hciBwb3NzaWJseSBub3QgaW5zdGFsbGVkLiBTa2lwIHJlZnJlc2hpbmcuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZvY3VzZWRXaW5kb3cgPSByZW1vdGUuQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG4gICAgaWYgKCFmb2N1c2VkV2luZG93KSB7XG4gICAgICAvLyBMb3N0IGZvY3VzLiBTa2lwIHJlZnJlc2hpbmcuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hd2FpdGluZ1Rva2VucyA9IHRydWU7XG4gICAgdGhpcy53b3JrZXIud2ViQ29udGVudHMuc2VuZCgnZ3JhbW1hci1wYXRoJywgZ3JhbW1hci5wYXRoKTtcbiAgICB0aGlzLndvcmtlci53ZWJDb250ZW50cy5zZW5kKCd0b2tlbml6ZScsXG4gICAgICBlZGl0b3IuaWQsXG4gICAgICBlZGl0b3IuZ2V0VGV4dCgpLFxuICAgICAgZm9jdXNlZFdpbmRvdy5pZFxuICAgICk7XG4gIH1cblxuICBpbml0aWFsaXplRm9yRWRpdG9yKGVkaXRvcikge1xuICAgIHRoaXMucmVmcmVzaFRva2VucyhlZGl0b3IpO1xuXG4gICAgZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFRva2VucyhlZGl0b3IpO1xuICAgIH0pO1xuXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLnRva2Vucy5kZWxldGUoZWRpdG9yKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgeyBFZGl0b3JUb2tlbnMgfTtcbiJdfQ==