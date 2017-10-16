(function() {
  var BrowserWindow, Disposable, PDFView, Viewer, fs, getCurrentWindow, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  getCurrentWindow = require('electron').remote.getCurrentWindow;

  BrowserWindow = require('electron').remote.BrowserWindow;

  fs = require('fs');

  path = require('path');

  module.exports = Viewer = (function(superClass) {
    extend(Viewer, superClass);

    function Viewer(latex) {
      this.latex = latex;
      this.client = {};
    }

    Viewer.prototype.dispose = function() {
      if ((this.window != null) && !this.window.isDestroyed()) {
        return this.window.destroy();
      }
    };

    Viewer.prototype.wsHandler = function(ws, msg) {
      var data, ref;
      data = JSON.parse(msg);
      switch (data.type) {
        case 'open':
          if ((ref = this.client.ws) != null) {
            ref.close();
          }
          return this.client.ws = ws;
        case 'loaded':
          if (this.client.position && (this.client.ws != null)) {
            return this.client.ws.send(JSON.stringify(this.client.position));
          }
          break;
        case 'position':
          return this.client.position = data;
        case 'click':
          return this.latex.locator.locate(data);
        case 'close':
          return this.client.ws = void 0;
      }
    };

    Viewer.prototype.refresh = function() {
      var newTitle, ref;
      newTitle = path.basename((this.latex.mainFile.substr(0, this.latex.mainFile.lastIndexOf('.'))) + ".pdf");
      if ((this.tabView != null) && this.tabView.title !== newTitle && (atom.workspace.paneForItem(this.tabView) != null)) {
        atom.workspace.paneForItem(this.tabView).destroyItem(this.tabView);
        this.openViewerNewTab();
        return;
      } else if ((this.window != null) && !this.window.isDestroyed() && this.window.getTitle() !== newTitle) {
        this.window.setTitle("Atom-LaTeX PDF Viewer - [" + this.latex.mainFile + "]");
      }
      if ((ref = this.client.ws) != null) {
        ref.send(JSON.stringify({
          type: "refresh"
        }));
      }
      this.latex.viewer.focusViewer();
      if (!atom.config.get('atom-latex.focus_viewer')) {
        return this.latex.viewer.focusMain();
      }
    };

    Viewer.prototype.focusViewer = function() {
      if ((this.window != null) && !this.window.isDestroyed()) {
        return this.window.focus();
      }
    };

    Viewer.prototype.focusMain = function() {
      var ref;
      if (((ref = this.self) != null ? ref.activeItem : void 0) != null) {
        return this.self.focus();
      }
    };

    Viewer.prototype.synctex = function(record) {
      var ref;
      if ((ref = this.client.ws) != null) {
        ref.send(JSON.stringify({
          type: "synctex",
          data: record
        }));
      }
      if (atom.config.get('atom-latex.focus_viewer')) {
        return this.focusViewer();
      }
    };

    Viewer.prototype.openViewer = function() {
      if (this.client.ws != null) {
        return this.refresh();
      } else if (atom.config.get('atom-latex.preview_after_build') === 'View in PDF viewer window') {
        this.openViewerNewWindow();
        if (!atom.config.get('atom-latex.focus_viewer')) {
          return this.latex.viewer.focusMain();
        }
      } else if (atom.config.get('atom-latex.preview_after_build') === 'View in PDF viewer tab') {
        this.openViewerNewTab();
        if (!atom.config.get('atom-latex.focus_viewer')) {
          return this.latex.viewer.focusMain();
        }
      }
    };

    Viewer.prototype.openViewerNewWindow = function() {
      var pdfPath;
      if (!this.latex.manager.findMain()) {
        return;
      }
      pdfPath = (this.latex.mainFile.substr(0, this.latex.mainFile.lastIndexOf('.'))) + ".pdf";
      if (!fs.existsSync(pdfPath)) {
        return;
      }
      if (!this.getUrl()) {
        return;
      }
      if ((this.tabView != null) && (atom.workspace.paneForItem(this.tabView) != null)) {
        atom.workspace.paneForItem(this.tabView).destroyItem(this.tabView);
        this.tabView = void 0;
      }
      if ((this.window == null) || this.window.isDestroyed()) {
        this.self = getCurrentWindow();
        this.window = new BrowserWindow();
      } else {
        this.window.show();
        this.window.focus();
      }
      this.window.loadURL(this.url);
      this.window.setMenuBarVisibility(false);
      return this.window.setTitle("Atom-LaTeX PDF Viewer - [" + this.latex.mainFile + "]");
    };

    Viewer.prototype.openViewerNewTab = function() {
      var pdfPath;
      if (!this.latex.manager.findMain()) {
        return;
      }
      pdfPath = (this.latex.mainFile.substr(0, this.latex.mainFile.lastIndexOf('.'))) + ".pdf";
      if (!fs.existsSync(pdfPath)) {
        return;
      }
      if (!this.getUrl()) {
        return;
      }
      this.self = atom.workspace.getActivePane();
      if ((this.tabView != null) && (atom.workspace.paneForItem(this.tabView) != null)) {
        return atom.workspace.paneForItem(this.tabView).activateItem(this.tabView);
      } else {
        this.tabView = new PDFView(this.url, path.basename(pdfPath));
        return atom.workspace.getActivePane().splitRight().addItem(this.tabView);
      }
    };

    Viewer.prototype.getUrl = function() {
      var address, err, port, ref;
      try {
        ref = this.latex.server.http.address(), address = ref.address, port = ref.port;
        this.url = "http://" + address + ":" + port + "/viewer.html?file=preview.pdf";
      } catch (error) {
        err = error;
        this.latex.server.openTab = true;
        return false;
      }
      return true;
    };

    return Viewer;

  })(Disposable);

  PDFView = (function() {
    function PDFView(url, title) {
      this.element = document.createElement('iframe');
      this.element.setAttribute('src', url);
      this.element.setAttribute('width', '100%');
      this.element.setAttribute('height', '100%');
      this.element.setAttribute('frameborder', 0, this.title = title);
    }

    PDFView.prototype.getTitle = function() {
      return "Atom-LaTeX - " + this.title;
    };

    PDFView.prototype.serialize = function() {
      return this.element.getAttribute('src');
    };

    PDFView.prototype.destroy = function() {
      return this.element.remove();
    };

    PDFView.prototype.getElement = function() {
      return this.element;
    };

    return PDFView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3ZpZXdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsTUFBTSxDQUFDOztFQUM5QyxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsTUFBTSxDQUFDOztFQUMzQyxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGdCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUZDOztxQkFJYixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUcscUJBQUEsSUFBYSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFBLENBQWpCO2VBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsRUFERjs7SUFETzs7cUJBSVQsU0FBQSxHQUFXLFNBQUMsRUFBRCxFQUFLLEdBQUw7QUFDVCxVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWDtBQUNQLGNBQU8sSUFBSSxDQUFDLElBQVo7QUFBQSxhQUNPLE1BRFA7O2VBRWMsQ0FBRSxLQUFaLENBQUE7O2lCQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixHQUFhO0FBSGpCLGFBSU8sUUFKUDtVQUtJLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLElBQXFCLHdCQUF4QjttQkFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFYLENBQWdCLElBQUksQ0FBQyxTQUFM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QUE7SUFETzs7c0JBR1QsVUFBQSxHQUFZLFNBQUE7QUFDVixhQUFPLElBQUMsQ0FBQTtJQURFOzs7OztBQXBKZCIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbmdldEN1cnJlbnRXaW5kb3cgPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZS5nZXRDdXJyZW50V2luZG93XG5Ccm93c2VyV2luZG93ID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGUuQnJvd3NlcldpbmRvd1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBWaWV3ZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcbiAgICBAY2xpZW50ID0ge31cblxuICBkaXNwb3NlOiAtPlxuICAgIGlmIEB3aW5kb3c/IGFuZCAhQHdpbmRvdy5pc0Rlc3Ryb3llZCgpXG4gICAgICBAd2luZG93LmRlc3Ryb3koKVxuXG4gIHdzSGFuZGxlcjogKHdzLCBtc2cpIC0+XG4gICAgZGF0YSA9IEpTT04ucGFyc2UgbXNnXG4gICAgc3dpdGNoIGRhdGEudHlwZVxuICAgICAgd2hlbiAnb3BlbidcbiAgICAgICAgQGNsaWVudC53cz8uY2xvc2UoKVxuICAgICAgICBAY2xpZW50LndzID0gd3NcbiAgICAgIHdoZW4gJ2xvYWRlZCdcbiAgICAgICAgaWYgQGNsaWVudC5wb3NpdGlvbiBhbmQgQGNsaWVudC53cz9cbiAgICAgICAgICBAY2xpZW50LndzLnNlbmQgSlNPTi5zdHJpbmdpZnkgQGNsaWVudC5wb3NpdGlvblxuICAgICAgd2hlbiAncG9zaXRpb24nXG4gICAgICAgIEBjbGllbnQucG9zaXRpb24gPSBkYXRhXG4gICAgICB3aGVuICdjbGljaydcbiAgICAgICAgQGxhdGV4LmxvY2F0b3IubG9jYXRlKGRhdGEpXG4gICAgICB3aGVuICdjbG9zZSdcbiAgICAgICAgQGNsaWVudC53cyA9IHVuZGVmaW5lZFxuXG4gIHJlZnJlc2g6IC0+XG4gICAgbmV3VGl0bGUgPSBwYXRoLmJhc2VuYW1lKFwiXCJcIiN7QGxhdGV4Lm1haW5GaWxlLnN1YnN0cihcbiAgICAgIDAsIEBsYXRleC5tYWluRmlsZS5sYXN0SW5kZXhPZignLicpKX0ucGRmXCJcIlwiKVxuXG4gICAgaWYgQHRhYlZpZXc/IGFuZCBAdGFiVmlldy50aXRsZSBpc250IG5ld1RpdGxlIGFuZFxuICAgICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAdGFiVmlldyk/XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAdGFiVmlldykuZGVzdHJveUl0ZW0oQHRhYlZpZXcpXG4gICAgICBAb3BlblZpZXdlck5ld1RhYigpXG4gICAgICByZXR1cm5cbiAgICBlbHNlIGlmIEB3aW5kb3c/IGFuZCAhQHdpbmRvdy5pc0Rlc3Ryb3llZCgpIGFuZCBAd2luZG93LmdldFRpdGxlKCkgaXNudCBuZXdUaXRsZVxuICAgICAgQHdpbmRvdy5zZXRUaXRsZShcIlwiXCJBdG9tLUxhVGVYIFBERiBWaWV3ZXIgLSBbI3tAbGF0ZXgubWFpbkZpbGV9XVwiXCJcIilcbiAgICBAY2xpZW50LndzPy5zZW5kIEpTT04uc3RyaW5naWZ5IHR5cGU6IFwicmVmcmVzaFwiXG5cbiAgICBAbGF0ZXgudmlld2VyLmZvY3VzVmlld2VyKClcbiAgICBpZiAhYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmZvY3VzX3ZpZXdlcicpXG4gICAgICBAbGF0ZXgudmlld2VyLmZvY3VzTWFpbigpXG5cbiAgZm9jdXNWaWV3ZXI6IC0+XG4gICAgQHdpbmRvdy5mb2N1cygpIGlmIEB3aW5kb3c/IGFuZCAhQHdpbmRvdy5pc0Rlc3Ryb3llZCgpXG5cbiAgZm9jdXNNYWluOiAtPlxuICAgIEBzZWxmLmZvY3VzKCkgaWYgQHNlbGY/LmFjdGl2ZUl0ZW0/XG5cbiAgc3luY3RleDogKHJlY29yZCkgLT5cbiAgICBAY2xpZW50LndzPy5zZW5kIEpTT04uc3RyaW5naWZ5XG4gICAgICB0eXBlOiBcInN5bmN0ZXhcIlxuICAgICAgZGF0YTogcmVjb3JkXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmZvY3VzX3ZpZXdlcicpXG4gICAgICBAZm9jdXNWaWV3ZXIoKVxuXG4gIG9wZW5WaWV3ZXI6IC0+XG4gICAgaWYgQGNsaWVudC53cz9cbiAgICAgIEByZWZyZXNoKClcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5wcmV2aWV3X2FmdGVyX2J1aWxkJykgaXNcXFxuICAgICAgICAnVmlldyBpbiBQREYgdmlld2VyIHdpbmRvdydcbiAgICAgIEBvcGVuVmlld2VyTmV3V2luZG93KClcbiAgICAgIGlmICFhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguZm9jdXNfdmlld2VyJylcbiAgICAgICAgQGxhdGV4LnZpZXdlci5mb2N1c01haW4oKVxuICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnByZXZpZXdfYWZ0ZXJfYnVpbGQnKSBpc1xcXG4gICAgICAgICdWaWV3IGluIFBERiB2aWV3ZXIgdGFiJ1xuICAgICAgQG9wZW5WaWV3ZXJOZXdUYWIoKVxuICAgICAgaWYgIWF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5mb2N1c192aWV3ZXInKVxuICAgICAgICBAbGF0ZXgudmlld2VyLmZvY3VzTWFpbigpXG5cbiAgb3BlblZpZXdlck5ld1dpbmRvdzogLT5cbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZE1haW4oKVxuICAgICAgcmV0dXJuXG5cbiAgICBwZGZQYXRoID0gXCJcIlwiI3tAbGF0ZXgubWFpbkZpbGUuc3Vic3RyKFxuICAgICAgMCwgQGxhdGV4Lm1haW5GaWxlLmxhc3RJbmRleE9mKCcuJykpfS5wZGZcIlwiXCJcbiAgICBpZiAhZnMuZXhpc3RzU3luYyBwZGZQYXRoXG4gICAgICByZXR1cm5cblxuICAgIGlmICFAZ2V0VXJsKClcbiAgICAgIHJldHVyblxuXG4gICAgaWYgQHRhYlZpZXc/IGFuZCBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAdGFiVmlldyk/XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAdGFiVmlldykuZGVzdHJveUl0ZW0oQHRhYlZpZXcpXG4gICAgICBAdGFiVmlldyA9IHVuZGVmaW5lZFxuICAgIGlmICFAd2luZG93PyBvciBAd2luZG93LmlzRGVzdHJveWVkKClcbiAgICAgIEBzZWxmID0gZ2V0Q3VycmVudFdpbmRvdygpXG4gICAgICBAd2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coKVxuICAgIGVsc2VcbiAgICAgIEB3aW5kb3cuc2hvdygpXG4gICAgICBAd2luZG93LmZvY3VzKClcblxuICAgIEB3aW5kb3cubG9hZFVSTChAdXJsKVxuICAgIEB3aW5kb3cuc2V0TWVudUJhclZpc2liaWxpdHkoZmFsc2UpXG4gICAgQHdpbmRvdy5zZXRUaXRsZShcIlwiXCJBdG9tLUxhVGVYIFBERiBWaWV3ZXIgLSBbI3tAbGF0ZXgubWFpbkZpbGV9XVwiXCJcIilcblxuICBvcGVuVmlld2VyTmV3VGFiOiAtPlxuICAgIGlmICFAbGF0ZXgubWFuYWdlci5maW5kTWFpbigpXG4gICAgICByZXR1cm5cblxuICAgIHBkZlBhdGggPSBcIlwiXCIje0BsYXRleC5tYWluRmlsZS5zdWJzdHIoXG4gICAgICAwLCBAbGF0ZXgubWFpbkZpbGUubGFzdEluZGV4T2YoJy4nKSl9LnBkZlwiXCJcIlxuICAgIGlmICFmcy5leGlzdHNTeW5jIHBkZlBhdGhcbiAgICAgIHJldHVyblxuXG4gICAgaWYgIUBnZXRVcmwoKVxuICAgICAgcmV0dXJuXG5cbiAgICBAc2VsZiA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGlmIEB0YWJWaWV3PyBhbmQgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpP1xuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpLmFjdGl2YXRlSXRlbShAdGFiVmlldylcbiAgICBlbHNlXG4gICAgICBAdGFiVmlldyA9IG5ldyBQREZWaWV3KEB1cmwscGF0aC5iYXNlbmFtZShwZGZQYXRoKSlcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5zcGxpdFJpZ2h0KCkuYWRkSXRlbShAdGFiVmlldylcblxuICBnZXRVcmw6IC0+XG4gICAgdHJ5XG4gICAgICB7IGFkZHJlc3MsIHBvcnQgfSA9IEBsYXRleC5zZXJ2ZXIuaHR0cC5hZGRyZXNzKClcbiAgICAgIEB1cmwgPSBcIlwiXCJodHRwOi8vI3thZGRyZXNzfToje3BvcnR9L3ZpZXdlci5odG1sP2ZpbGU9cHJldmlldy5wZGZcIlwiXCJcbiAgICBjYXRjaCBlcnJcbiAgICAgIEBsYXRleC5zZXJ2ZXIub3BlblRhYiA9IHRydWVcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbmNsYXNzIFBERlZpZXdcbiAgY29uc3RydWN0b3I6ICh1cmwsdGl0bGUpIC0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdpZnJhbWUnXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlICdzcmMnLCB1cmxcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ3dpZHRoJywgJzEwMCUnXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlICdoZWlnaHQnLCAnMTAwJSdcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ2ZyYW1lYm9yZGVyJywgMCxcbiAgICBAdGl0bGUgPSB0aXRsZVxuXG4gIGdldFRpdGxlOiAtPlxuICAgIHJldHVybiBcIlwiXCJBdG9tLUxhVGVYIC0gI3tAdGl0bGV9XCJcIlwiXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHJldHVybiBAZWxlbWVudC5nZXRBdHRyaWJ1dGUgJ3NyYydcblxuICBkZXN0cm95OiAtPlxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICByZXR1cm4gQGVsZW1lbnRcbiJdfQ==
