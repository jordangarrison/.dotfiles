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
              initialColumn: column,
              searchAllPanes: true
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2xvY2F0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBOzs7RUFBRSxhQUFlLE9BQUEsQ0FBUSxNQUFSOztFQUNqQixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxlQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGlCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBREU7O3NCQUdiLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUE7TUFDVCxXQUFBLDREQUFpQyxDQUFFO01BQ25DLGVBQUEsb0JBQWtCLE1BQU0sQ0FBRSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsaUJBQW5CLENBQUE7TUFFbEIsSUFBVyxxQkFBRCxJQUFpQixDQUFDLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQWYsQ0FBeUIsV0FBekIsQ0FBNUI7QUFBQSxlQUFBOztNQUVBLEdBQUEsR0FBTSxvQkFBQSxHQUFzQixDQUFDLGVBQWUsQ0FBQyxHQUFoQixHQUFzQixDQUF2QixDQUF0QixHQUErQyxHQUEvQyxHQUNJLENBQUMsZUFBZSxDQUFDLE1BQWhCLEdBQXlCLENBQTFCLENBREosR0FDZ0MsR0FEaEMsR0FFSyxXQUZMLEdBRWlCLFVBRmpCLEdBR0ksQ0FBQyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFmLENBQUEsQ0FBRCxDQUhKLEdBRzhCO2FBQ3BDLEVBQUUsQ0FBQyxJQUFILENBQVEsR0FBUixFQUFhO1FBQUMsR0FBQSxFQUFLLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFw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LENBQVEsQ0FBQyxPQUFoQixDQUF3QixnQkFBeEIsRUFBMEMsRUFBMUMsQ0FBYjtZQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQixFQUNFO2NBQUEsV0FBQSxFQUFhLEdBQWI7Y0FDQSxhQUFBLEVBQWUsTUFEZjtjQUVBLGNBQUEsRUFBZ0IsSUFGaEI7YUFERjttQkFLQSxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFkLENBQUEsRUFQRjtXQUFBLE1BQUE7bUJBU0UsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBZCxDQUNFLHdDQURGLEVBQ2dELE1BRGhELEVBVEY7O1FBWmdEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsRDtJQUhNOzs7O0tBekNZO0FBTHRCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jcCA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExvY2F0b3IgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcblxuICBzeW5jdGV4OiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBjdXJyZW50UGF0aCA9IGVkaXRvcj8uYnVmZmVyLmZpbGU/LnBhdGhcbiAgICBjdXJyZW50UG9zaXRpb24gPSBlZGl0b3I/LmN1cnNvcnNbMF0uZ2V0QnVmZmVyUG9zaXRpb24oKVxuXG4gICAgcmV0dXJuIGlmICFjdXJyZW50UGF0aD8gb3IgIUBsYXRleC5tYW5hZ2VyLmlzVGV4RmlsZShjdXJyZW50UGF0aClcblxuICAgIGNtZCA9IFwiXCJcInN5bmN0ZXggdmlldyAtaSBcXFwiI3tjdXJyZW50UG9zaXRpb24ucm93ICsgMX06XFxcbiAgICAgICAgICAgICAje2N1cnJlbnRQb3NpdGlvbi5jb2x1bW4gKyAxfTpcXFxuICAgICAgICAgICAgICN7Y3VycmVudFBhdGh9XFxcIiAtbyBcXFwiXFxcbiAgICAgICAgICAgICAje0BsYXRleC5tYW5hZ2VyLmZpbmRQREYoKX1cXFwiXCJcIlwiXG4gICAgY3AuZXhlYyhjbWQsIHtjd2Q6IHBhdGguZGlybmFtZSBAbGF0ZXgubWFpbkZpbGV9LCAoZXJyLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgIGlmIChlcnIpXG4gICAgICAgIEBsYXRleC5sb2dnZXIucHJvY2Vzc0Vycm9yKFxuICAgICAgICAgIFwiXCJcIkZhaWxlZCBTeW5jVGVYIChjb2RlICN7ZXJyLmNvZGV9KS5cIlwiXCIsIGVyci5tZXNzYWdlXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuXG4gICAgICByZWNvcmQgPSBAcGFyc2VSZXN1bHQoc3Rkb3V0KVxuICAgICAgQGxhdGV4LnZpZXdlci5zeW5jdGV4KHJlY29yZClcbiAgICApXG5cbiAgcGFyc2VSZXN1bHQ6IChvdXQpIC0+XG4gICAgcmVjb3JkID0ge31cbiAgICBzdGFydGVkID0gZmFsc2VcbiAgICBmb3IgbGluZSBpbiBvdXQuc3BsaXQoJ1xcbicpXG4gICAgICBpZiBsaW5lLmluZGV4T2YoJ1N5bmNUZVggcmVzdWx0IGJlZ2luJykgPiAtMVxuICAgICAgICBzdGFydGVkID0gdHJ1ZVxuICAgICAgICBjb250aW51ZVxuICAgICAgYnJlYWsgaWYgbGluZS5pbmRleE9mKCdTeW5jVGVYIHJlc3VsdCBlbmQnKSA+IC0xXG4gICAgICBjb250aW51ZSBpZiBub3Qgc3RhcnRlZFxuICAgICAgcG9zID0gbGluZS5pbmRleE9mKCc6JylcbiAgICAgIGNvbnRpbnVlIGlmIHBvcyA8IDBcbiAgICAgIGtleSA9IGxpbmUuc3Vic3RyKDAsIHBvcykudG9Mb3dlckNhc2UoKVxuICAgICAgY29udGludWUgaWYga2V5IG9mIHJlY29yZFxuICAgICAgcmVjb3JkW2xpbmUuc3Vic3RyKDAsIHBvcykudG9Mb3dlckNhc2UoKV0gPSBsaW5lLnN1YnN0cihwb3MgKyAxKVxuICAgIHJldHVybiByZWNvcmRcblxuICBsb2NhdGU6IChkYXRhKSAtPlxuICAgIGNtZCA9IFwiXCJcInN5bmN0ZXggZWRpdCAtbyBcXFwiI3tkYXRhLnBhZ2V9OiN7ZGF0YS5wb3NbMF19OiN7ZGF0YS5wb3NbMV19OlxcXG4gICAgICAgICAgICAgI3tAbGF0ZXgubWFuYWdlci5maW5kUERGKCl9XFxcIlwiXCJcIlxuICAgIGNwLmV4ZWMoY21kLCB7Y3dkOiBwYXRoLmRpcm5hbWUgQGxhdGV4Lm1haW5GaWxlfSwgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICBpZiAoZXJyKVxuICAgICAgICBAbGF0ZXgubG9nZ2VyLnByb2Nlc3NFcnJvcihcbiAgICAgICAgICBcIlwiXCJGYWlsZWQgU3luY1RlWCAoY29kZSAje2Vyci5jb2RlfSkuXCJcIlwiLCBlcnIubWVzc2FnZVxuICAgICAgICApXG4gICAgICAgIHJldHVyblxuICAgICAgcmVjb3JkID0gQHBhcnNlUmVzdWx0KHN0ZG91dClcbiAgICAgIGlmIHJlY29yZFsnY29sdW1uJ10gPCAwXG4gICAgICAgIGNvbHVtbiA9IDBcbiAgICAgIGVsc2VcbiAgICAgICAgY29sdW1uID0gcmVjb3JkWydjb2x1bW4nXSAtIDFcbiAgICAgIHJvdyA9IHJlY29yZFsnbGluZSddIC0gMVxuICAgICAgaWYgJ2lucHV0JyBvZiByZWNvcmRcbiAgICAgICAgZmlsZSA9IHBhdGgucmVzb2x2ZShyZWNvcmRbJ2lucHV0J10ucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSwgJycpKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUsXG4gICAgICAgICAgaW5pdGlhbExpbmU6IHJvd1xuICAgICAgICAgIGluaXRpYWxDb2x1bW46IGNvbHVtblxuICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG4gICAgICAgIClcbiAgICAgICAgQGxhdGV4LnZpZXdlci5mb2N1c01haW4oKVxuICAgICAgZWxzZVxuICAgICAgICBAbGF0ZXgubG9nZ2VyLnByb2Nlc3NFcnJvcihcbiAgICAgICAgICBcIlwiXCJGYWlsZWQgU3luY1RlWC4gTm8gZmlsZSBwYXRoIGlzIGdpdmVuLlwiXCJcIiwgcmVjb3JkXG4gICAgICAgIClcbiAgICApXG4iXX0=
