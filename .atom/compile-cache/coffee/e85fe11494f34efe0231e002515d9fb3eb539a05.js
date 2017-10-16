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
      } else if ((this.window != null) && this.window.getTitle() !== newTitle) {
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
      if (this.self != null) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3ZpZXdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsTUFBTSxDQUFDOztFQUM5QyxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsTUFBTSxDQUFDOztFQUMzQyxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGdCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUZDOztxQkFJYixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUcscUJBQUEsSUFBYSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFBLENBQWpCO2VBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsRUFERjs7SUFETzs7cUJBSVQsU0FBQSxHQUFXLFNBQUMsRUFBRCxFQUFLLEdBQUw7QUFDVCxVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWDtBQUNQLGNBQU8sSUFBSSxDQUFDLElBQVo7QUFBQSxhQUNPLE1BRFA7O2VBRWMsQ0FBRSxLQUFaLENBQUE7O2lCQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixHQUFhO0FBSGpCLGFBSU8sUUFKUDtVQUtJLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLElBQXFCLHdCQUF4QjttQkFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFYLENBQWdCLElBQUksQ0FBQyxTQUFM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Ozs7QUFwSmQiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5nZXRDdXJyZW50V2luZG93ID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGUuZ2V0Q3VycmVudFdpbmRvd1xuQnJvd3NlcldpbmRvdyA9IHJlcXVpcmUoJ2VsZWN0cm9uJykucmVtb3RlLkJyb3dzZXJXaW5kb3dcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVmlld2VyIGV4dGVuZHMgRGlzcG9zYWJsZVxuICBjb25zdHJ1Y3RvcjogKGxhdGV4KSAtPlxuICAgIEBsYXRleCA9IGxhdGV4XG4gICAgQGNsaWVudCA9IHt9XG5cbiAgZGlzcG9zZTogLT5cbiAgICBpZiBAd2luZG93PyBhbmQgIUB3aW5kb3cuaXNEZXN0cm95ZWQoKVxuICAgICAgQHdpbmRvdy5kZXN0cm95KClcblxuICB3c0hhbmRsZXI6ICh3cywgbXNnKSAtPlxuICAgIGRhdGEgPSBKU09OLnBhcnNlIG1zZ1xuICAgIHN3aXRjaCBkYXRhLnR5cGVcbiAgICAgIHdoZW4gJ29wZW4nXG4gICAgICAgIEBjbGllbnQud3M/LmNsb3NlKClcbiAgICAgICAgQGNsaWVudC53cyA9IHdzXG4gICAgICB3aGVuICdsb2FkZWQnXG4gICAgICAgIGlmIEBjbGllbnQucG9zaXRpb24gYW5kIEBjbGllbnQud3M/XG4gICAgICAgICAgQGNsaWVudC53cy5zZW5kIEpTT04uc3RyaW5naWZ5IEBjbGllbnQucG9zaXRpb25cbiAgICAgIHdoZW4gJ3Bvc2l0aW9uJ1xuICAgICAgICBAY2xpZW50LnBvc2l0aW9uID0gZGF0YVxuICAgICAgd2hlbiAnY2xpY2snXG4gICAgICAgIEBsYXRleC5sb2NhdG9yLmxvY2F0ZShkYXRhKVxuICAgICAgd2hlbiAnY2xvc2UnXG4gICAgICAgIEBjbGllbnQud3MgPSB1bmRlZmluZWRcblxuICByZWZyZXNoOiAtPlxuICAgIG5ld1RpdGxlID0gcGF0aC5iYXNlbmFtZShcIlwiXCIje0BsYXRleC5tYWluRmlsZS5zdWJzdHIoXG4gICAgICAwLCBAbGF0ZXgubWFpbkZpbGUubGFzdEluZGV4T2YoJy4nKSl9LnBkZlwiXCJcIilcblxuICAgIGlmIEB0YWJWaWV3PyBhbmQgQHRhYlZpZXcudGl0bGUgaXNudCBuZXdUaXRsZSBhbmRcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpP1xuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpLmRlc3Ryb3lJdGVtKEB0YWJWaWV3KVxuICAgICAgQG9wZW5WaWV3ZXJOZXdUYWIoKVxuICAgICAgcmV0dXJuXG4gICAgZWxzZSBpZiBAd2luZG93PyBhbmQgQHdpbmRvdy5nZXRUaXRsZSgpIGlzbnQgbmV3VGl0bGVcbiAgICAgIEB3aW5kb3cuc2V0VGl0bGUoXCJcIlwiQXRvbS1MYVRlWCBQREYgVmlld2VyIC0gWyN7QGxhdGV4Lm1haW5GaWxlfV1cIlwiXCIpXG4gICAgQGNsaWVudC53cz8uc2VuZCBKU09OLnN0cmluZ2lmeSB0eXBlOiBcInJlZnJlc2hcIlxuXG4gICAgQGxhdGV4LnZpZXdlci5mb2N1c1ZpZXdlcigpXG4gICAgaWYgIWF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5mb2N1c192aWV3ZXInKVxuICAgICAgQGxhdGV4LnZpZXdlci5mb2N1c01haW4oKVxuXG4gIGZvY3VzVmlld2VyOiAtPlxuICAgIEB3aW5kb3cuZm9jdXMoKSBpZiBAd2luZG93PyBhbmQgIUB3aW5kb3cuaXNEZXN0cm95ZWQoKVxuXG4gIGZvY3VzTWFpbjogLT5cbiAgICBAc2VsZi5mb2N1cygpIGlmIEBzZWxmP1xuXG4gIHN5bmN0ZXg6IChyZWNvcmQpIC0+XG4gICAgQGNsaWVudC53cz8uc2VuZCBKU09OLnN0cmluZ2lmeVxuICAgICAgdHlwZTogXCJzeW5jdGV4XCJcbiAgICAgIGRhdGE6IHJlY29yZFxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5mb2N1c192aWV3ZXInKVxuICAgICAgQGZvY3VzVmlld2VyKClcblxuICBvcGVuVmlld2VyOiAtPlxuICAgIGlmIEBjbGllbnQud3M/XG4gICAgICBAcmVmcmVzaCgpXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgucHJldmlld19hZnRlcl9idWlsZCcpIGlzXFxcbiAgICAgICAgJ1ZpZXcgaW4gUERGIHZpZXdlciB3aW5kb3cnXG4gICAgICBAb3BlblZpZXdlck5ld1dpbmRvdygpXG4gICAgICBpZiAhYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmZvY3VzX3ZpZXdlcicpXG4gICAgICAgIEBsYXRleC52aWV3ZXIuZm9jdXNNYWluKClcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5wcmV2aWV3X2FmdGVyX2J1aWxkJykgaXNcXFxuICAgICAgICAnVmlldyBpbiBQREYgdmlld2VyIHRhYidcbiAgICAgIEBvcGVuVmlld2VyTmV3VGFiKClcbiAgICAgIGlmICFhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguZm9jdXNfdmlld2VyJylcbiAgICAgICAgQGxhdGV4LnZpZXdlci5mb2N1c01haW4oKVxuXG4gIG9wZW5WaWV3ZXJOZXdXaW5kb3c6IC0+XG4gICAgaWYgIUBsYXRleC5tYW5hZ2VyLmZpbmRNYWluKClcbiAgICAgIHJldHVyblxuXG4gICAgcGRmUGF0aCA9IFwiXCJcIiN7QGxhdGV4Lm1haW5GaWxlLnN1YnN0cihcbiAgICAgIDAsIEBsYXRleC5tYWluRmlsZS5sYXN0SW5kZXhPZignLicpKX0ucGRmXCJcIlwiXG4gICAgaWYgIWZzLmV4aXN0c1N5bmMgcGRmUGF0aFxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAhQGdldFVybCgpXG4gICAgICByZXR1cm5cblxuICAgIGlmIEB0YWJWaWV3PyBhbmQgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpP1xuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHRhYlZpZXcpLmRlc3Ryb3lJdGVtKEB0YWJWaWV3KVxuICAgICAgQHRhYlZpZXcgPSB1bmRlZmluZWRcbiAgICBpZiAhQHdpbmRvdz8gb3IgQHdpbmRvdy5pc0Rlc3Ryb3llZCgpXG4gICAgICBAc2VsZiA9IGdldEN1cnJlbnRXaW5kb3coKVxuICAgICAgQHdpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KClcbiAgICBlbHNlXG4gICAgICBAd2luZG93LnNob3coKVxuICAgICAgQHdpbmRvdy5mb2N1cygpXG5cbiAgICBAd2luZG93LmxvYWRVUkwoQHVybClcbiAgICBAd2luZG93LnNldE1lbnVCYXJWaXNpYmlsaXR5KGZhbHNlKVxuICAgIEB3aW5kb3cuc2V0VGl0bGUoXCJcIlwiQXRvbS1MYVRlWCBQREYgVmlld2VyIC0gWyN7QGxhdGV4Lm1haW5GaWxlfV1cIlwiXCIpXG5cbiAgb3BlblZpZXdlck5ld1RhYjogLT5cbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZE1haW4oKVxuICAgICAgcmV0dXJuXG5cbiAgICBwZGZQYXRoID0gXCJcIlwiI3tAbGF0ZXgubWFpbkZpbGUuc3Vic3RyKFxuICAgICAgMCwgQGxhdGV4Lm1haW5GaWxlLmxhc3RJbmRleE9mKCcuJykpfS5wZGZcIlwiXCJcbiAgICBpZiAhZnMuZXhpc3RzU3luYyBwZGZQYXRoXG4gICAgICByZXR1cm5cblxuICAgIGlmICFAZ2V0VXJsKClcbiAgICAgIHJldHVyblxuXG4gICAgQHNlbGYgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICBpZiBAdGFiVmlldz8gYW5kIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEB0YWJWaWV3KT9cbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEB0YWJWaWV3KS5hY3RpdmF0ZUl0ZW0oQHRhYlZpZXcpXG4gICAgZWxzZVxuICAgICAgQHRhYlZpZXcgPSBuZXcgUERGVmlldyhAdXJsLHBhdGguYmFzZW5hbWUocGRmUGF0aCkpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuc3BsaXRSaWdodCgpLmFkZEl0ZW0oQHRhYlZpZXcpXG5cbiAgZ2V0VXJsOiAtPlxuICAgIHRyeVxuICAgICAgeyBhZGRyZXNzLCBwb3J0IH0gPSBAbGF0ZXguc2VydmVyLmh0dHAuYWRkcmVzcygpXG4gICAgICBAdXJsID0gXCJcIlwiaHR0cDovLyN7YWRkcmVzc306I3twb3J0fS92aWV3ZXIuaHRtbD9maWxlPXByZXZpZXcucGRmXCJcIlwiXG4gICAgY2F0Y2ggZXJyXG4gICAgICBAbGF0ZXguc2VydmVyLm9wZW5UYWIgPSB0cnVlXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG5jbGFzcyBQREZWaWV3XG4gIGNvbnN0cnVjdG9yOiAodXJsLHRpdGxlKSAtPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnaWZyYW1lJ1xuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSAnc3JjJywgdXJsXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlICd3aWR0aCcsICcxMDAlJ1xuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSAnaGVpZ2h0JywgJzEwMCUnXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlICdmcmFtZWJvcmRlcicsIDAsXG4gICAgQHRpdGxlID0gdGl0bGVcblxuICBnZXRUaXRsZTogLT5cbiAgICByZXR1cm4gXCJcIlwiQXRvbS1MYVRlWCAtICN7QHRpdGxlfVwiXCJcIlxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICByZXR1cm4gQGVsZW1lbnQuZ2V0QXR0cmlidXRlICdzcmMnXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIGdldEVsZW1lbnQ6IC0+XG4gICAgcmV0dXJuIEBlbGVtZW50XG4iXX0=
