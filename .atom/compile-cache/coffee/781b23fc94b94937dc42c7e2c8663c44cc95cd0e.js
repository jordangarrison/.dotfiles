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
        case 'link':
          return require('electron').shell.openExternal(data.href);
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
      if ((this.self != null) && !this.self.focused) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3ZpZXdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsTUFBTSxDQUFDOztFQUM5QyxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsTUFBTSxDQUFDOztFQUMzQyxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGdCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUZDOztxQkFJYixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUcscUJBQUEsSUFBYSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFBLENBQWpCO2VBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsRUFERjs7SUFETzs7cUJBSVQsU0FBQSxHQUFXLFNBQUMsRUFBRCxFQUFLLEdBQUw7QUFDVCxVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWDtBQUNQLGNBQU8sSUFBSSxDQUFDLElBQVo7QUFBQSxhQUNPLE1BRFA7O2VBRWMsQ0FBRSxLQUFaLENBQUE7O2lCQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixHQUFhO0FBSGpCLGFBSU8sUUFKUDtVQUtJLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLElBQXFCLHdCQUF4QjttQkFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFYLENBQWdCLElBQUksQ0FBQyxTQUFM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QUFBO0FBQ1QsYUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsS0FBdEI7SUFERTs7c0JBR1gsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQURPOztzQkFHVCxVQUFBLEdBQVksU0FBQTtBQUNWLGFBQU8sSUFBQyxDQUFBO0lBREU7Ozs7O0FBdEpkIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xuZ2V0Q3VycmVudFdpbmRvdyA9IHJlcXVpcmUoJ2VsZWN0cm9uJykucmVtb3RlLmdldEN1cnJlbnRXaW5kb3dcbkJyb3dzZXJXaW5kb3cgPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZS5Ccm93c2VyV2luZG93XG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFZpZXdlciBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuICAgIEBjbGllbnQgPSB7fVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgaWYgQHdpbmRvdz8gYW5kICFAd2luZG93LmlzRGVzdHJveWVkKClcbiAgICAgIEB3aW5kb3cuZGVzdHJveSgpXG5cbiAgd3NIYW5kbGVyOiAod3MsIG1zZykgLT5cbiAgICBkYXRhID0gSlNPTi5wYXJzZSBtc2dcbiAgICBzd2l0Y2ggZGF0YS50eXBlXG4gICAgICB3aGVuICdvcGVuJ1xuICAgICAgICBAY2xpZW50LndzPy5jbG9zZSgpXG4gICAgICAgIEBjbGllbnQud3MgPSB3c1xuICAgICAgd2hlbiAnbG9hZGVkJ1xuICAgICAgICBpZiBAY2xpZW50LnBvc2l0aW9uIGFuZCBAY2xpZW50LndzP1xuICAgICAgICAgIEBjbGllbnQud3Muc2VuZCBKU09OLnN0cmluZ2lmeSBAY2xpZW50LnBvc2l0aW9uXG4gICAgICB3aGVuICdwb3NpdGlvbidcbiAgICAgICAgQGNsaWVudC5wb3NpdGlvbiA9IGRhdGFcbiAgICAgIHdoZW4gJ2NsaWNrJ1xuICAgICAgICBAbGF0ZXgubG9jYXRvci5sb2NhdGUoZGF0YSlcbiAgICAgIHdoZW4gJ2Nsb3NlJ1xuICAgICAgICBAY2xpZW50LndzID0gdW5kZWZpbmVkXG4gICAgICB3aGVuICdsaW5rJyAjIE9wZW4gbGluayBleHRlcm5hbGx5XG4gICAgICAgIHJlcXVpcmUoJ2VsZWN0cm9uJykuc2hlbGwub3BlbkV4dGVybmFsKGRhdGEuaHJlZilcblxuICByZWZyZXNoOiAtPlxuICAgIG5ld1RpdGxlID0gcGF0aC5iYXNlbmFtZShcIlwiXCIje0BsYXRleC5tYWluRmlsZS5zdWJzdHIoXG4gICAgICAwLCBAbGF0ZXgubWFpbkZpbGUubGFzdEluZGV4T2YoJy4nKSl9LnBkZlwiXCJcIilcblxuICAgIGlmIEB0YWJWaWV3PyBhbmQgQHRhYlZpZXcudGl0bGUgaXNudCBuZXdUaXRsZSBhbmRcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpP1xuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpLmRlc3Ryb3lJdGVtKEB0YWJWaWV3KVxuICAgICAgQG9wZW5WaWV3ZXJOZXdUYWIoKVxuICAgICAgcmV0dXJuXG4gICAgZWxzZSBpZiBAd2luZG93PyBhbmQgIUB3aW5kb3cuaXNEZXN0cm95ZWQoKSBhbmQgQHdpbmRvdy5nZXRUaXRsZSgpIGlzbnQgbmV3VGl0bGVcbiAgICAgIEB3aW5kb3cuc2V0VGl0bGUoXCJcIlwiQXRvbS1MYVRlWCBQREYgVmlld2VyIC0gWyN7QGxhdGV4Lm1haW5GaWxlfV1cIlwiXCIpXG4gICAgQGNsaWVudC53cz8uc2VuZCBKU09OLnN0cmluZ2lmeSB0eXBlOiBcInJlZnJlc2hcIlxuXG4gICAgQGxhdGV4LnZpZXdlci5mb2N1c1ZpZXdlcigpXG4gICAgaWYgIWF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5mb2N1c192aWV3ZXInKVxuICAgICAgQGxhdGV4LnZpZXdlci5mb2N1c01haW4oKVxuXG4gIGZvY3VzVmlld2VyOiAtPlxuICAgIEB3aW5kb3cuZm9jdXMoKSBpZiBAd2luZG93PyBhbmQgIUB3aW5kb3cuaXNEZXN0cm95ZWQoKVxuXG4gIGZvY3VzTWFpbjogLT5cbiAgICBAc2VsZi5mb2N1cygpIGlmIEBzZWxmPyBhbmQgIUBzZWxmLmZvY3VzZWRcblxuICBzeW5jdGV4OiAocmVjb3JkKSAtPlxuICAgIEBjbGllbnQud3M/LnNlbmQgSlNPTi5zdHJpbmdpZnlcbiAgICAgIHR5cGU6IFwic3luY3RleFwiXG4gICAgICBkYXRhOiByZWNvcmRcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguZm9jdXNfdmlld2VyJylcbiAgICAgIEBmb2N1c1ZpZXdlcigpXG5cbiAgb3BlblZpZXdlcjogLT5cbiAgICBpZiBAY2xpZW50LndzP1xuICAgICAgQHJlZnJlc2goKVxuICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnByZXZpZXdfYWZ0ZXJfYnVpbGQnKSBpc1xcXG4gICAgICAgICdWaWV3IGluIFBERiB2aWV3ZXIgd2luZG93J1xuICAgICAgQG9wZW5WaWV3ZXJOZXdXaW5kb3coKVxuICAgICAgaWYgIWF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5mb2N1c192aWV3ZXInKVxuICAgICAgICBAbGF0ZXgudmlld2VyLmZvY3VzTWFpbigpXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgucHJldmlld19hZnRlcl9idWlsZCcpIGlzXFxcbiAgICAgICAgJ1ZpZXcgaW4gUERGIHZpZXdlciB0YWInXG4gICAgICBAb3BlblZpZXdlck5ld1RhYigpXG4gICAgICBpZiAhYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmZvY3VzX3ZpZXdlcicpXG4gICAgICAgIEBsYXRleC52aWV3ZXIuZm9jdXNNYWluKClcblxuICBvcGVuVmlld2VyTmV3V2luZG93OiAtPlxuICAgIGlmICFAbGF0ZXgubWFuYWdlci5maW5kTWFpbigpXG4gICAgICByZXR1cm5cblxuICAgIHBkZlBhdGggPSBcIlwiXCIje0BsYXRleC5tYWluRmlsZS5zdWJzdHIoXG4gICAgICAwLCBAbGF0ZXgubWFpbkZpbGUubGFzdEluZGV4T2YoJy4nKSl9LnBkZlwiXCJcIlxuICAgIGlmICFmcy5leGlzdHNTeW5jIHBkZlBhdGhcbiAgICAgIHJldHVyblxuXG4gICAgaWYgIUBnZXRVcmwoKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiBAdGFiVmlldz8gYW5kIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEB0YWJWaWV3KT9cbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEB0YWJWaWV3KS5kZXN0cm95SXRlbShAdGFiVmlldylcbiAgICAgIEB0YWJWaWV3ID0gdW5kZWZpbmVkXG4gICAgaWYgIUB3aW5kb3c/IG9yIEB3aW5kb3cuaXNEZXN0cm95ZWQoKVxuICAgICAgQHNlbGYgPSBnZXRDdXJyZW50V2luZG93KClcbiAgICAgIEB3aW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdygpXG4gICAgZWxzZVxuICAgICAgQHdpbmRvdy5zaG93KClcbiAgICAgIEB3aW5kb3cuZm9jdXMoKVxuXG4gICAgQHdpbmRvdy5sb2FkVVJMKEB1cmwpXG4gICAgQHdpbmRvdy5zZXRNZW51QmFyVmlzaWJpbGl0eShmYWxzZSlcbiAgICBAd2luZG93LnNldFRpdGxlKFwiXCJcIkF0b20tTGFUZVggUERGIFZpZXdlciAtIFsje0BsYXRleC5tYWluRmlsZX1dXCJcIlwiKVxuXG4gIG9wZW5WaWV3ZXJOZXdUYWI6IC0+XG4gICAgaWYgIUBsYXRleC5tYW5hZ2VyLmZpbmRNYWluKClcbiAgICAgIHJldHVyblxuXG4gICAgcGRmUGF0aCA9IFwiXCJcIiN7QGxhdGV4Lm1haW5GaWxlLnN1YnN0cihcbiAgICAgIDAsIEBsYXRleC5tYWluRmlsZS5sYXN0SW5kZXhPZignLicpKX0ucGRmXCJcIlwiXG4gICAgaWYgIWZzLmV4aXN0c1N5bmMgcGRmUGF0aFxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAhQGdldFVybCgpXG4gICAgICByZXR1cm5cblxuICAgIEBzZWxmID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgaWYgQHRhYlZpZXc/IGFuZCBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAdGFiVmlldyk/XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAdGFiVmlldykuYWN0aXZhdGVJdGVtKEB0YWJWaWV3KVxuICAgIGVsc2VcbiAgICAgIEB0YWJWaWV3ID0gbmV3IFBERlZpZXcoQHVybCxwYXRoLmJhc2VuYW1lKHBkZlBhdGgpKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLnNwbGl0UmlnaHQoKS5hZGRJdGVtKEB0YWJWaWV3KVxuXG4gIGdldFVybDogLT5cbiAgICB0cnlcbiAgICAgIHsgYWRkcmVzcywgcG9ydCB9ID0gQGxhdGV4LnNlcnZlci5odHRwLmFkZHJlc3MoKVxuICAgICAgQHVybCA9IFwiXCJcImh0dHA6Ly8je2FkZHJlc3N9OiN7cG9ydH0vdmlld2VyLmh0bWw/ZmlsZT1wcmV2aWV3LnBkZlwiXCJcIlxuICAgIGNhdGNoIGVyclxuICAgICAgQGxhdGV4LnNlcnZlci5vcGVuVGFiID0gdHJ1ZVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuY2xhc3MgUERGVmlld1xuICBjb25zdHJ1Y3RvcjogKHVybCx0aXRsZSkgLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2lmcmFtZSdcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ3NyYycsIHVybFxuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSAnd2lkdGgnLCAnMTAwJSdcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ2hlaWdodCcsICcxMDAlJ1xuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSAnZnJhbWVib3JkZXInLCAwLFxuICAgIEB0aXRsZSA9IHRpdGxlXG5cbiAgZ2V0VGl0bGU6IC0+XG4gICAgcmV0dXJuIFwiXCJcIkF0b20tTGFUZVggLSAje0B0aXRsZX1cIlwiXCJcblxuICBzZXJpYWxpemU6IC0+XG4gICAgcmV0dXJuIEBlbGVtZW50LmdldEF0dHJpYnV0ZSAnc3JjJ1xuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICBnZXRFbGVtZW50OiAtPlxuICAgIHJldHVybiBAZWxlbWVudFxuIl19
