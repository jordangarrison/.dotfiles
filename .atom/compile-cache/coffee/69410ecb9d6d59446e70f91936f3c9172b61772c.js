(function() {
  var Builder, Disposable, cp, hb, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Disposable = require('atom').Disposable;

  path = require('path');

  cp = require('child_process');

  hb = require('hasbin');

  module.exports = Builder = (function(superClass) {
    extend(Builder, superClass);

    function Builder(latex) {
      this.latex = latex;
    }

    Builder.prototype.build = function(here) {
      var promise;
      if (!this.latex.manager.findMain(here)) {
        return false;
      }
      this.killProcess();
      this.setCmds();
      promise = Promise.resolve();
      if (atom.config.get('atom-latex.save_on_build')) {
        promise = this.saveonBuild();
      }
      promise.then((function(_this) {
        return function() {
          _this.buildTimer = Date.now();
          _this.latex.logger.log = [];
          _this.latex["package"].status.view.status = 'building';
          _this.latex["package"].status.view.update();
          _this.buildLogs = [];
          _this.buildErrs = [];
          _this.execCmds = [];
          return _this.buildProcess();
        };
      })(this));
      return true;
    };

    Builder.prototype.saveonBuild = function() {
      var editor, i, len, promises, ref, ref1, ref2;
      if (!((ref = this.latex) != null ? ref.texFiles : void 0)) {
        this.latex.manager.findAll();
      }
      promises = [];
      ref1 = atom.workspace.getTextEditors();
      for (i = 0, len = ref1.length; i < len; i++) {
        editor = ref1[i];
        if (editor.isModified() && (ref2 = editor.getPath(), indexOf.call(this.latex.texFiles, ref2) >= 0)) {
          promises.push(editor.save());
        }
      }
      return Promise.all(promises);
    };

    Builder.prototype.buildProcess = function() {
      var cmd, throwErrors, toolchain;
      cmd = this.cmds.shift();
      if (cmd === void 0) {
        this.postBuild();
        return;
      }
      if (atom.config.get('atom-latex.hide_log_if_success')) {
        this.latex.panel.view.showLog = false;
      }
      this.buildLogs.push('');
      this.buildErrs.push('');
      this.execCmds.push(cmd);
      this.latex.logger.log.push({
        type: 'status',
        text: "Step " + this.buildLogs.length + "> " + cmd
      });
      toolchain = cmd.split(' ');
      this.currentProcess = cp.spawn(toolchain.shift(), toolchain, {
        cwd: path.dirname(this.latex.mainFile)
      });
      this.currentProcess.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.buildLogs[_this.buildLogs.length - 1] += data;
        };
      })(this));
      this.currentProcess.stderr.on('data', (function(_this) {
        return function(data) {
          return _this.buildErrs += data;
        };
      })(this));
      this.currentProcess.on('error', (function(_this) {
        return function(err) {
          var ref, ref1;
          throwErrors(err);
          _this.latex.parser.parse((ref = _this.buildLogs) != null ? ref[((ref1 = _this.buildLogs) != null ? ref1.length : void 0) - 1] : void 0);
          return _this.currentProcess = void 0;
        };
      })(this));
      this.currentProcess.on('exit', (function(_this) {
        return function(exitCode, signal) {
          var err, ref, ref1;
          if (!exitCode && (signal == null)) {
            _this.buildProcess();
          } else {
            err = {
              code: exitCode,
              message: _this.buildErrs.length > 1 ? _this.buildErrs : "Command Failed: " + cmd
            };
            throwErrors(err);
            _this.latex.parser.parse((ref = _this.buildLogs) != null ? ref[((ref1 = _this.buildLogs) != null ? ref1.length : void 0) - 1] : void 0);
            _this.cmds = [];
          }
          return _this.currentProcess = void 0;
        };
      })(this));
      return throwErrors = (function(_this) {
        return function(err) {
          _this.latex["package"].status.view.status = 'error';
          _this.latex.panel.view.showLog = true;
          _this.latex.logger.processError("Failed Building LaTeX (code " + err.code + ").", err.message, true, [
            {
              text: "Dismiss",
              onDidClick: function() {
                return _this.latex.logger.clearBuildError();
              }
            }, {
              text: "Show build log",
              onDidClick: function() {
                return _this.latex.logger.showLog();
              }
            }
          ]);
          return _this.latex.logger.log.push({
            type: 'error',
            text: 'Error occurred while building LaTeX.'
          });
        };
      })(this);
    };

    Builder.prototype.postBuild = function() {
      var logText, ref, ref1;
      this.latex.logger.clearBuildError();
      this.latex.parser.parse((ref = this.buildLogs) != null ? ref[((ref1 = this.buildLogs) != null ? ref1.length : void 0) - 1] : void 0);
      if (this.latex.parser.isLatexmkSkipped) {
        logText = 'latexmk skipped building process.';
      } else {
        logText = "Successfully built LaTeX in " + (Date.now() - this.buildTimer) + " ms";
      }
      this.latex.logger.log.push({
        type: 'status',
        text: logText
      });
      this.latex.panel.view.update();
      if (this.latex.viewer.client.ws != null) {
        this.latex.viewer.refresh();
      } else if (atom.config.get('atom-latex.preview_after_build') !== 'Do nothing') {
        this.latex.viewer.openViewer();
      }
      if (atom.config.get('atom-latex.clean_after_build')) {
        return this.latex.cleaner.clean();
      }
    };

    Builder.prototype.killProcess = function() {
      this.cmds = [];
      if (this.currentProcess != null) {
        this.latex.logger.log.push({
          type: 'warning',
          text: "Killing running LaTeX command (PID: " + this.currentProcess.pid + ")"
        });
        return this.currentProcess.kill();
      }
    };

    Builder.prototype.binCheck = function(binary) {
      if (hb.sync(binary)) {
        return true;
      }
      return false;
    };

    Builder.prototype.setCmds = function() {
      var ref;
      this.latex.manager.loadLocalCfg();
      if ((ref = this.latex.manager.config) != null ? ref.toolchain : void 0) {
        return this.custom_toolchain(this.latex.manager.config.toolchain);
      } else if (atom.config.get('atom-latex.toolchain') === 'auto') {
        if (!this.latexmk_toolchain()) {
          return this.custom_toolchain();
        }
      } else if (atom.config.get('atom-latex.toolchain') === 'latexmk toolchain') {
        return this.latexmk_toolchain();
      } else if (atom.config.get('atom-latex.toolchain') === 'custom toolchain') {
        return this.custom_toolchain();
      }
    };

    Builder.prototype.latexmk_toolchain = function() {
      this.cmds = ["latexmk " + (atom.config.get('atom-latex.latexmk_param')) + " " + (this.escapeFileName(path.basename(this.latex.mainFile, '.tex')))];
      if (!this.binCheck('latexmk') || !this.binCheck('perl')) {
        return false;
      }
      return true;
    };

    Builder.prototype.custom_toolchain = function(toolchain) {
      var args, bibCompiler, cmd, i, len, result, results, texCompiler, toolPrototype;
      texCompiler = atom.config.get('atom-latex.compiler');
      bibCompiler = atom.config.get('atom-latex.bibtex');
      args = atom.config.get('atom-latex.compiler_param');
      if (toolchain == null) {
        toolchain = atom.config.get('atom-latex.custom_toolchain');
      }
      toolchain = toolchain.split('&&').map(function(cmd) {
        return cmd.trim();
      });
      this.cmds = [];
      result = [];
      results = [];
      for (i = 0, len = toolchain.length; i < len; i++) {
        toolPrototype = toolchain[i];
        cmd = toolPrototype;
        cmd = cmd.split('%TEX').join(texCompiler);
        cmd = cmd.split('%BIB').join(bibCompiler);
        cmd = cmd.split('%ARG').join(args);
        cmd = cmd.split('%DOC').join(this.escapeFileName(path.basename(this.latex.mainFile).replace(/\.([^\/]*)$/, '')));
        cmd = cmd.split('%EXT').join(path.basename(this.latex.mainFile).match(/\.([^\/]*)$/)[1]);
        results.push(this.cmds.push(cmd));
      }
      return results;
    };

    Builder.prototype.escapeFileName = function(file) {
      if (file.indexOf(' ') > -1) {
        return '"' + file + '"';
      }
      return file;
    };

    return Builder;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2J1aWxkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsZUFBUjs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLFFBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MsaUJBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFERTs7c0JBR2IsS0FBQSxHQUFPLFNBQUMsSUFBRDtBQUNMLFVBQUE7TUFBQSxJQUFHLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBZixDQUF3QixJQUF4QixDQUFKO0FBQ0UsZUFBTyxNQURUOztNQUdBLElBQUMsQ0FBQSxXQUFELENBQUE7TUFDQSxJQUFDLENBQUEsT0FBRCxDQUFBO01BQ0EsT0FBQSxHQUFVLE9BQU8sQ0FBQyxPQUFSLENBQUE7TUFDVixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBSDtRQUNFLE9BQUEsR0FBVSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBRFo7O01BRUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDWCxLQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxHQUFMLENBQUE7VUFDZCxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFkLEdBQW9CO1VBQ3BCLEtBQUMsQ0FBQSxLQUFLLEVBQUMsT0FBRCxFQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUEzQixHQUFvQztVQUNwQyxLQUFDLENBQUEsS0FBSyxFQUFDLE9B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LElBRHRCOztBQUVBLGFBQU87SUFITzs7OztLQWpMSTtBQU50QiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuY3AgPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuaGIgPSByZXF1aXJlICdoYXNiaW4nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEJ1aWxkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcblxuICBidWlsZDogKGhlcmUpIC0+XG4gICAgaWYgIUBsYXRleC5tYW5hZ2VyLmZpbmRNYWluKGhlcmUpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIEBraWxsUHJvY2VzcygpXG4gICAgQHNldENtZHMoKVxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5zYXZlX29uX2J1aWxkJylcbiAgICAgIHByb21pc2UgPSBAc2F2ZW9uQnVpbGQoKVxuICAgIHByb21pc2UudGhlbiAoKSA9PlxuICAgICAgQGJ1aWxkVGltZXIgPSBEYXRlLm5vdygpXG4gICAgICBAbGF0ZXgubG9nZ2VyLmxvZyA9IFtdXG4gICAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy5zdGF0dXMgPSAnYnVpbGRpbmcnXG4gICAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy51cGRhdGUoKVxuICAgICAgQGJ1aWxkTG9ncyA9IFtdXG4gICAgICBAYnVpbGRFcnJzID0gW11cbiAgICAgIEBleGVjQ21kcyA9IFtdXG4gICAgICBAYnVpbGRQcm9jZXNzKClcblxuICAgIHJldHVybiB0cnVlXG5cbiAgc2F2ZW9uQnVpbGQ6IC0+XG4gICAgaWYgIUBsYXRleD8udGV4RmlsZXNcbiAgICAgIEBsYXRleC5tYW5hZ2VyLmZpbmRBbGwoKVxuICAgIHByb21pc2VzID0gW11cbiAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgIGlmIGVkaXRvci5pc01vZGlmaWVkKCkgYW5kIGVkaXRvci5nZXRQYXRoKCkgaW4gQGxhdGV4LnRleEZpbGVzXG4gICAgICAgIHByb21pc2VzLnB1c2ggZWRpdG9yLnNhdmUoKVxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcblxuXG4gIGJ1aWxkUHJvY2VzczogLT5cbiAgICBjbWQgPSBAY21kcy5zaGlmdCgpXG4gICAgaWYgY21kID09IHVuZGVmaW5lZFxuICAgICAgQHBvc3RCdWlsZCgpXG4gICAgICByZXR1cm5cblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5oaWRlX2xvZ19pZl9zdWNjZXNzJylcbiAgICAgIEBsYXRleC5wYW5lbC52aWV3LnNob3dMb2cgPSBmYWxzZVxuICAgIEBidWlsZExvZ3MucHVzaCAnJ1xuICAgIEBidWlsZEVycnMucHVzaCAnJ1xuICAgIEBleGVjQ21kcy5wdXNoIGNtZFxuXG4gICAgQGxhdGV4LmxvZ2dlci5sb2cucHVzaCh7XG4gICAgICB0eXBlOiAnc3RhdHVzJyxcbiAgICAgIHRleHQ6IFwiXCJcIlN0ZXAgI3tAYnVpbGRMb2dzLmxlbmd0aH0+ICN7Y21kfVwiXCJcIlxuICAgIH0pXG4gICAgdG9vbGNoYWluID0gY21kLnNwbGl0KCcgJykgIyBTcGxpdCBpbnRvIGFycmF5IG9mIGNtZCArIGFyZ3VtZW50c1xuICAgIEBjdXJyZW50UHJvY2VzcyA9IGNwLnNwYXduKHRvb2xjaGFpbi5zaGlmdCgpLCB0b29sY2hhaW4sIHtjd2Q6cGF0aC5kaXJuYW1lIEBsYXRleC5tYWluRmlsZX0pXG5cbiAgICAjIFJlZ2lzdGVyIGNhbGxiYWNrcyBmb3IgdGhlIHNwYXducHJvY2Vzc1xuICAgIEBjdXJyZW50UHJvY2Vzcy5zdGRvdXQub24gJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICAgIEBidWlsZExvZ3NbQGJ1aWxkTG9ncy5sZW5ndGggLSAxXSArPSBkYXRhXG5cbiAgICBAY3VycmVudFByb2Nlc3Muc3RkZXJyLm9uICdkYXRhJywgKGRhdGEpID0+XG4gICAgICBAYnVpbGRFcnJzICs9IGRhdGFcblxuICAgIEBjdXJyZW50UHJvY2Vzcy5vbiAnZXJyb3InLCAoZXJyKSA9PlxuICAgICAgIyBGYXRhbCBleGVjdXRhYmxlIGVycm9yXG4gICAgICB0aHJvd0Vycm9ycyhlcnIpXG4gICAgICBAbGF0ZXgucGFyc2VyLnBhcnNlIEBidWlsZExvZ3M/W0BidWlsZExvZ3M/Lmxlbmd0aCAtIDFdXG4gICAgICBAY3VycmVudFByb2Nlc3MgPSB1bmRlZmluZWRcblxuICAgIEBjdXJyZW50UHJvY2Vzcy5vbiAnZXhpdCcgLCAoZXhpdENvZGUsIHNpZ25hbCkgPT5cbiAgICAgIGlmICFleGl0Q29kZSBhbmQgIXNpZ25hbD8gICAgICMgUHJvY2VlZCBpZiBubyBlcnJvciBvciBraWxsIHNpZ25hbFxuICAgICAgICBAYnVpbGRQcm9jZXNzKClcbiAgICAgIGVsc2VcbiAgICAgICAgIyBCdWlsZCB1cCBlcnIgb2JqZWN0IHdpdGggYSBkZWZhdWx0IG1zZ1xuICAgICAgICBlcnIgPVxuICAgICAgICAgIGNvZGU6IGV4aXRDb2RlXG4gICAgICAgICAgbWVzc2FnZTogaWYgQGJ1aWxkRXJycy5sZW5ndGggPiAxIHRoZW4gQGJ1aWxkRXJycyBlbHNlICBcIkNvbW1hbmQgRmFpbGVkOiBcIiArIGNtZFxuICAgICAgICB0aHJvd0Vycm9ycyhlcnIpXG4gICAgICAgICMgUGFyc2UgbGFzdCBjb21tYW5kJ3MgbG9nXG4gICAgICAgIEBsYXRleC5wYXJzZXIucGFyc2UgQGJ1aWxkTG9ncz9bQGJ1aWxkTG9ncz8ubGVuZ3RoIC0gMV1cbiAgICAgICAgIyBDbGVhciBwZW5kaW5nIGNvbW1hbmRzIGFuZCBjdXJyZW50UHJvY2Vzc1xuICAgICAgICBAY21kcyA9IFtdXG4gICAgICBAY3VycmVudFByb2Nlc3MgPSB1bmRlZmluZWRcblxuICAgIHRocm93RXJyb3JzID0gKGVycikgPT5cbiAgICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnN0YXR1cyA9ICdlcnJvcidcbiAgICAgIEBsYXRleC5wYW5lbC52aWV3LnNob3dMb2cgPSB0cnVlXG4gICAgICBAbGF0ZXgubG9nZ2VyLnByb2Nlc3NFcnJvcihcbiAgICAgICAgXCJcIlwiRmFpbGVkIEJ1aWxkaW5nIExhVGVYIChjb2RlICN7ZXJyLmNvZGV9KS5cIlwiXCIsIGVyci5tZXNzYWdlLCB0cnVlLFxuICAgICAgICBbe1xuICAgICAgICAgIHRleHQ6IFwiRGlzbWlzc1wiXG4gICAgICAgICAgb25EaWRDbGljazogPT4gQGxhdGV4LmxvZ2dlci5jbGVhckJ1aWxkRXJyb3IoKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGV4dDogXCJTaG93IGJ1aWxkIGxvZ1wiXG4gICAgICAgICAgb25EaWRDbGljazogPT4gQGxhdGV4LmxvZ2dlci5zaG93TG9nKClcbiAgICAgICAgfV1cbiAgICAgIClcbiAgICAgIEBsYXRleC5sb2dnZXIubG9nLnB1c2goe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICB0ZXh0OiAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnVpbGRpbmcgTGFUZVguJ1xuICAgICAgfSlcblxuICBwb3N0QnVpbGQ6IC0+XG4gICAgQGxhdGV4LmxvZ2dlci5jbGVhckJ1aWxkRXJyb3IoKVxuICAgIEBsYXRleC5wYXJzZXIucGFyc2UgQGJ1aWxkTG9ncz9bQGJ1aWxkTG9ncz8ubGVuZ3RoIC0gMV1cbiAgICBpZiBAbGF0ZXgucGFyc2VyLmlzTGF0ZXhta1NraXBwZWRcbiAgICAgIGxvZ1RleHQgPSAnbGF0ZXhtayBza2lwcGVkIGJ1aWxkaW5nIHByb2Nlc3MuJ1xuICAgIGVsc2VcbiAgICAgIGxvZ1RleHQgPSBcIlN1Y2Nlc3NmdWxseSBidWlsdCBMYVRlWCBpbiAje0RhdGUubm93KCkgLSBAYnVpbGRUaW1lcn0gbXNcIlxuICAgIEBsYXRleC5sb2dnZXIubG9nLnB1c2goe1xuICAgICAgdHlwZTogJ3N0YXR1cycsXG4gICAgICB0ZXh0OiBsb2dUZXh0XG4gICAgfSlcbiAgICBAbGF0ZXgucGFuZWwudmlldy51cGRhdGUoKVxuICAgIGlmIEBsYXRleC52aWV3ZXIuY2xpZW50LndzP1xuICAgICAgQGxhdGV4LnZpZXdlci5yZWZyZXNoKClcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5wcmV2aWV3X2FmdGVyX2J1aWxkJykgaXNudFxcXG4gICAgICAgICdEbyBub3RoaW5nJ1xuICAgICAgQGxhdGV4LnZpZXdlci5vcGVuVmlld2VyKClcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguY2xlYW5fYWZ0ZXJfYnVpbGQnKVxuICAgICAgQGxhdGV4LmNsZWFuZXIuY2xlYW4oKVxuXG4gIGtpbGxQcm9jZXNzOiAtPlxuICAgIEBjbWRzID0gW11cbiAgICBpZiBAY3VycmVudFByb2Nlc3M/XG4gICAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICB0ZXh0OiBcIktpbGxpbmcgcnVubmluZyBMYVRlWCBjb21tYW5kIChQSUQ6ICN7QGN1cnJlbnRQcm9jZXNzLnBpZH0pXCJcbiAgICAgIH0pXG4gICAgICBAY3VycmVudFByb2Nlc3Mua2lsbCgpXG5cbiAgYmluQ2hlY2s6IChiaW5hcnkpIC0+XG4gICAgaWYgaGIuc3luYyBiaW5hcnlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgc2V0Q21kczogLT5cbiAgICBAbGF0ZXgubWFuYWdlci5sb2FkTG9jYWxDZmcoKVxuICAgIGlmIEBsYXRleC5tYW5hZ2VyLmNvbmZpZz8udG9vbGNoYWluXG4gICAgICBAY3VzdG9tX3Rvb2xjaGFpbihAbGF0ZXgubWFuYWdlci5jb25maWcudG9vbGNoYWluKVxuICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnRvb2xjaGFpbicpID09ICdhdXRvJ1xuICAgICAgaWYgIUBsYXRleG1rX3Rvb2xjaGFpbigpXG4gICAgICAgIEBjdXN0b21fdG9vbGNoYWluKClcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC50b29sY2hhaW4nKSA9PSAnbGF0ZXhtayB0b29sY2hhaW4nXG4gICAgICBAbGF0ZXhta190b29sY2hhaW4oKVxuICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnRvb2xjaGFpbicpID09ICdjdXN0b20gdG9vbGNoYWluJ1xuICAgICAgQGN1c3RvbV90b29sY2hhaW4oKVxuXG4gIGxhdGV4bWtfdG9vbGNoYWluOiAtPlxuICAgIEBjbWRzID0gW1xuICAgICAgXCJcIlwibGF0ZXhtayBcXFxuICAgICAgI3thdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgubGF0ZXhta19wYXJhbScpfSBcXFxuICAgICAgI3tAZXNjYXBlRmlsZU5hbWUocGF0aC5iYXNlbmFtZShAbGF0ZXgubWFpbkZpbGUsICcudGV4JykpfVwiXCJcIlxuICAgIF1cbiAgICBpZiAhQGJpbkNoZWNrKCdsYXRleG1rJykgb3IgIUBiaW5DaGVjaygncGVybCcpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGN1c3RvbV90b29sY2hhaW46ICh0b29sY2hhaW4pIC0+XG4gICAgdGV4Q29tcGlsZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguY29tcGlsZXInKVxuICAgIGJpYkNvbXBpbGVyID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmJpYnRleCcpXG4gICAgYXJncyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5jb21waWxlcl9wYXJhbScpXG4gICAgaWYgIXRvb2xjaGFpbj9cbiAgICAgIHRvb2xjaGFpbiA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5jdXN0b21fdG9vbGNoYWluJylcbiAgICB0b29sY2hhaW4gPSB0b29sY2hhaW4uc3BsaXQoJyYmJykubWFwKChjbWQpIC0+IGNtZC50cmltKCkpXG4gICAgQGNtZHMgPSBbXVxuICAgIHJlc3VsdCA9IFtdXG4gICAgZm9yIHRvb2xQcm90b3R5cGUgaW4gdG9vbGNoYWluXG4gICAgICBjbWQgPSB0b29sUHJvdG90eXBlXG4gICAgICBjbWQgPSBjbWQuc3BsaXQoJyVURVgnKS5qb2luKHRleENvbXBpbGVyKVxuICAgICAgY21kID0gY21kLnNwbGl0KCclQklCJykuam9pbihiaWJDb21waWxlcilcbiAgICAgIGNtZCA9IGNtZC5zcGxpdCgnJUFSRycpLmpvaW4oYXJncylcbiAgICAgIGNtZCA9IGNtZC5zcGxpdCgnJURPQycpLmpvaW4oXG4gICAgICAgICMgZ2V0IGJhc2VuYW1lIGFuZCBzdHJpcCBmaWxlIGV4dGVuc2lvbnNcbiAgICAgICAgQGVzY2FwZUZpbGVOYW1lKHBhdGguYmFzZW5hbWUoQGxhdGV4Lm1haW5GaWxlKS5yZXBsYWNlKC9cXC4oW15cXC9dKikkLywgJycpKVxuICAgICAgKVxuICAgICAgY21kID0gY21kLnNwbGl0KCclRVhUJykuam9pbihwYXRoLmJhc2VuYW1lKEBsYXRleC5tYWluRmlsZSkubWF0Y2goL1xcLihbXlxcL10qKSQvKVsxXSlcbiAgICAgIEBjbWRzLnB1c2ggY21kXG5cbiAgZXNjYXBlRmlsZU5hbWU6IChmaWxlKSAtPlxuICAgIGlmIGZpbGUuaW5kZXhPZignICcpID4gLTFcbiAgICAgIHJldHVybiAnXCInICsgZmlsZSArICdcIidcbiAgICByZXR1cm4gZmlsZVxuIl19
