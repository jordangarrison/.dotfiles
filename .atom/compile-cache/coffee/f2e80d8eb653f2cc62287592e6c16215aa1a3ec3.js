(function() {
  var Disposable, Locator, cp, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  path = require('path');

  cp = require('child_process');

  module.exports = Locator = (function(superClass) {
    extend(Locator, superClass);

    function Locator(latex) {
      this.latex = latex;
    }

    Locator.prototype.synctex = function() {
      var cmd, currentPath, currentPosition, editor, ref;
      editor = atom.workspace.getActivePaneItem();
      currentPath = editor != null ? (ref = editor.buffer.file) != null ? ref.path : void 0 : void 0;
      currentPosition = editor != null ? editor.cursors[0].getBufferPosition() : void 0;
      if ((currentPath == null) || !this.latex.manager.isTexFile(currentPath)) {
        return;
      }
      cmd = "synctex view -i \"" + (currentPosition.row + 1) + ":" + (currentPosition.column + 1) + ":" + currentPath + "\" -o \"" + (this.latex.manager.findPDF()) + "\"";
      return cp.exec(cmd, {
        cwd: path.dirname(this.latex.mainFile)
      }, (function(_this) {
        return function(err, stdout, stderr) {
          var record;
          if (err) {
            _this.latex.logger.processError("Failed SyncTeX (code " + err.code + ").", err.message);
            return;
          }
          record = _this.parseResult(stdout);
          return _this.latex.viewer.synctex(record);
        };
      })(this));
    };

    Locator.prototype.parseResult = function(out) {
      var i, key, len, line, pos, record, ref, started;
      record = {};
      started = false;
      ref = out.split('\n');
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        if (line.indexOf('SyncTeX result begin') > -1) {
          started = true;
          continue;
        }
        if (line.indexOf('SyncTeX result end') > -1) {
          break;
        }
        if (!started) {
          continue;
        }
        pos = line.indexOf(':');
        if (pos < 0) {
          continue;
        }
        key = line.substr(0, pos).toLowerCase();
        if (key in record) {
          continue;
        }
        record[line.substr(0, pos).toLowerCase()] = line.substr(pos + 1);
      }
      return record;
    };

    Locator.prototype.locate = function(data) {
      var cmd;
      cmd = "synctex edit -o \"" + data.page + ":" + data.pos[0] + ":" + data.pos[1] + ":" + (this.latex.manager.findPDF()) + "\"";
      return cp.exec(cmd, {
        cwd: path.dirname(this.latex.mainFile)
      }, (function(_this) {
        return function(err, stdout, stderr) {
          var column, file, record, row;
          if (err) {
            _this.latex.logger.processError("Failed SyncTeX (code " + err.code + ").", err.message);
            return;
          }
          record = _this.parseResult(stdout);
          if (record['column'] < 0) {
            column = 0;
          } else {
            column = record['column'] - 1;
          }
          row = record['line'] - 1;
          if ('input' in record) {
            file = path.resolve(record['input'].replace(/(\r\n|\n|\r)/gm, ''));
            atom.workspace.open(file, {
              initialLine: row,
              initialColumn: column
            });
            return _this.latex.viewer.focusMain();
          } else {
            return _this.latex.logger.processError("Failed SyncTeX. No file path is given.", record);
          }
        };
      })(this));
    };

    return Locator;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2xvY2F0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBOzs7RUFBRSxhQUFlLE9BQUEsQ0FBUSxNQUFSOztFQUNqQixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxlQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGlCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBREU7O3NCQUdiLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUE7TUFDVCxXQUFBLDREQUFpQyxDQUFFO01BQ25DLGVBQUEsb0JBQWtCLE1BQU0sQ0FBRSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsaUJBQW5CLENBQUE7TUFFbEIsSUFBVyxxQkFBRCxJQUFpQixDQUFDLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQWYsQ0FBeUIsV0FBekIsQ0FBNUI7QUFBQSxlQUFBOztNQUVBLEdBQUEsR0FBTSxvQkFBQSxHQUFzQixDQUFDLGVBQWUsQ0FBQyxHQUFoQixHQUFzQixDQUF2QixDQUF0QixHQUErQyxHQUEvQyxHQUNJLENBQUMsZUFBZSxDQUFDLE1BQWhCLEdBQXlCLENBQTFCLENBREosR0FDZ0MsR0FEaEMsR0FFSyxXQUZMLEdBRWlCLFVBRmpCLEdBR0ksQ0FBQyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFmLENBQUEsQ0FBRCxDQUhKLEdBRzhCO2FBQ3BDLEVBQUUsQ0FBQyxJQUFILENBQVEsR0FBUixFQUFhO1FBQUMsR0FBQSxFQUFLLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFw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LENBQVEsQ0FBQyxPQUFoQixDQUF3QixnQkFBeEIsRUFBMEMsRUFBMUMsQ0FBYjtZQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQixFQUNFO2NBQUEsV0FBQSxFQUFhLEdBQWI7Y0FDQSxhQUFBLEVBQWUsTUFEZjthQURGO21CQUlBLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQWQsQ0FBQSxFQU5GO1dBQUEsTUFBQTttQkFRRSxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFkLENBQ0Usd0NBREYsRUFDZ0QsTUFEaEQsRUFSRjs7UUFaZ0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxEO0lBSE07Ozs7S0F6Q1k7QUFMdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmNwID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTG9jYXRvciBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuXG4gIHN5bmN0ZXg6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGN1cnJlbnRQYXRoID0gZWRpdG9yPy5idWZmZXIuZmlsZT8ucGF0aFxuICAgIGN1cnJlbnRQb3NpdGlvbiA9IGVkaXRvcj8uY3Vyc29yc1swXS5nZXRCdWZmZXJQb3NpdGlvbigpXG5cbiAgICByZXR1cm4gaWYgIWN1cnJlbnRQYXRoPyBvciAhQGxhdGV4Lm1hbmFnZXIuaXNUZXhGaWxlKGN1cnJlbnRQYXRoKVxuXG4gICAgY21kID0gXCJcIlwic3luY3RleCB2aWV3IC1pIFxcXCIje2N1cnJlbnRQb3NpdGlvbi5yb3cgKyAxfTpcXFxuICAgICAgICAgICAgICN7Y3VycmVudFBvc2l0aW9uLmNvbHVtbiArIDF9OlxcXG4gICAgICAgICAgICAgI3tjdXJyZW50UGF0aH1cXFwiIC1vIFxcXCJcXFxuICAgICAgICAgICAgICN7QGxhdGV4Lm1hbmFnZXIuZmluZFBERigpfVxcXCJcIlwiXCJcbiAgICBjcC5leGVjKGNtZCwge2N3ZDogcGF0aC5kaXJuYW1lIEBsYXRleC5tYWluRmlsZX0sIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PlxuICAgICAgaWYgKGVycilcbiAgICAgICAgQGxhdGV4LmxvZ2dlci5wcm9jZXNzRXJyb3IoXG4gICAgICAgICAgXCJcIlwiRmFpbGVkIFN5bmNUZVggKGNvZGUgI3tlcnIuY29kZX0pLlwiXCJcIiwgZXJyLm1lc3NhZ2VcbiAgICAgICAgKVxuICAgICAgICByZXR1cm5cbiAgICAgIHJlY29yZCA9IEBwYXJzZVJlc3VsdChzdGRvdXQpXG4gICAgICBAbGF0ZXgudmlld2VyLnN5bmN0ZXgocmVjb3JkKVxuICAgIClcblxuICBwYXJzZVJlc3VsdDogKG91dCkgLT5cbiAgICByZWNvcmQgPSB7fVxuICAgIHN0YXJ0ZWQgPSBmYWxzZVxuICAgIGZvciBsaW5lIGluIG91dC5zcGxpdCgnXFxuJylcbiAgICAgIGlmIGxpbmUuaW5kZXhPZignU3luY1RlWCByZXN1bHQgYmVnaW4nKSA+IC0xXG4gICAgICAgIHN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBicmVhayBpZiBsaW5lLmluZGV4T2YoJ1N5bmNUZVggcmVzdWx0IGVuZCcpID4gLTFcbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBzdGFydGVkXG4gICAgICBwb3MgPSBsaW5lLmluZGV4T2YoJzonKVxuICAgICAgY29udGludWUgaWYgcG9zIDwgMFxuICAgICAga2V5ID0gbGluZS5zdWJzdHIoMCwgcG9zKS50b0xvd2VyQ2FzZSgpXG4gICAgICBjb250aW51ZSBpZiBrZXkgb2YgcmVjb3JkXG4gICAgICByZWNvcmRbbGluZS5zdWJzdHIoMCwgcG9zKS50b0xvd2VyQ2FzZSgpXSA9IGxpbmUuc3Vic3RyKHBvcyArIDEpXG4gICAgcmV0dXJuIHJlY29yZFxuXG4gIGxvY2F0ZTogKGRhdGEpIC0+XG4gICAgY21kID0gXCJcIlwic3luY3RleCBlZGl0IC1vIFxcXCIje2RhdGEucGFnZX06I3tkYXRhLnBvc1swXX06I3tkYXRhLnBvc1sxXX06XFxcbiAgICAgICAgICAgICAje0BsYXRleC5tYW5hZ2VyLmZpbmRQREYoKX1cXFwiXCJcIlwiXG4gICAgY3AuZXhlYyhjbWQsIHtjd2Q6IHBhdGguZGlybmFtZSBAbGF0ZXgubWFpbkZpbGV9LCAoZXJyLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgIGlmIChlcnIpXG4gICAgICAgIEBsYXRleC5sb2dnZXIucHJvY2Vzc0Vycm9yKFxuICAgICAgICAgIFwiXCJcIkZhaWxlZCBTeW5jVGVYIChjb2RlICN7ZXJyLmNvZGV9KS5cIlwiXCIsIGVyci5tZXNzYWdlXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuXG4gICAgICByZWNvcmQgPSBAcGFyc2VSZXN1bHQoc3Rkb3V0KVxuICAgICAgaWYgcmVjb3JkWydjb2x1bW4nXSA8IDBcbiAgICAgICAgY29sdW1uID0gMFxuICAgICAgZWxzZVxuICAgICAgICBjb2x1bW4gPSByZWNvcmRbJ2NvbHVtbiddIC0gMVxuICAgICAgcm93ID0gcmVjb3JkWydsaW5lJ10gLSAxXG4gICAgICBpZiAnaW5wdXQnIG9mIHJlY29yZFxuICAgICAgICBmaWxlID0gcGF0aC5yZXNvbHZlKHJlY29yZFsnaW5wdXQnXS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCAnJykpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZSxcbiAgICAgICAgICBpbml0aWFsTGluZTogcm93XG4gICAgICAgICAgaW5pdGlhbENvbHVtbjogY29sdW1uXG4gICAgICAgIClcbiAgICAgICAgQGxhdGV4LnZpZXdlci5mb2N1c01haW4oKVxuICAgICAgZWxzZVxuICAgICAgICBAbGF0ZXgubG9nZ2VyLnByb2Nlc3NFcnJvcihcbiAgICAgICAgICBcIlwiXCJGYWlsZWQgU3luY1RlWC4gTm8gZmlsZSBwYXRoIGlzIGdpdmVuLlwiXCJcIiwgcmVjb3JkXG4gICAgICAgIClcbiAgICApXG4iXX0=
