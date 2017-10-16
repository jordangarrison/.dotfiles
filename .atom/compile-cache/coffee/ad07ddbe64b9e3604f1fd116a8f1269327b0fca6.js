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
      if (!this.latex.manager.findMain(here)) {
        return false;
      }
      this.killProcess();
      this.setCmds();
      if (atom.config.get('atom-latex.save_on_build')) {
        this.saveonBuild();
      }
      this.latex.logger.log = [];
      this.latex["package"].status.view.status = 'building';
      this.latex["package"].status.view.update();
      this.buildLogs = [];
      this.execCmds = [];
      this.buildProcess();
      return true;
    };

    Builder.prototype.saveonBuild = function() {
      var editor, i, len, ref, ref1, ref2, results;
      if (!((ref = this.latex) != null ? ref.texFiles : void 0)) {
        this.latex.manager.findAll();
      }
      ref1 = atom.workspace.getTextEditors();
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        editor = ref1[i];
        if (editor.isModified() && (ref2 = editor.getPath(), indexOf.call(this.latex.texFiles, ref2) >= 0)) {
          results.push(editor.save());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Builder.prototype.execCmd = function(cmd, env, cb) {
      env.maxBuffer = 2e308;
      return cp.exec(cmd, env, cb);
    };

    Builder.prototype.buildProcess = function() {
      var cmd;
      cmd = this.cmds.shift();
      if (cmd === void 0) {
        this.postBuild();
        return;
      }
      if (atom.config.get('atom-latex.hide_log_if_success')) {
        this.latex.panel.view.showLog = false;
      }
      this.buildLogs.push('');
      this.execCmds.push(cmd);
      this.latex.logger.log.push({
        type: 'status',
        text: "Step " + this.buildLogs.length + "> " + cmd
      });
      this.process = this.execCmd(cmd, {
        cwd: path.dirname(this.latex.mainFile)
      }, (function(_this) {
        return function(err, stdout, stderr) {
          var ref, ref1;
          _this.process = void 0;
          if (!err || (err.code === null)) {
            return _this.buildProcess();
          } else {
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
            _this.cmds = [];
            _this.latex.logger.log.push({
              type: 'status',
              text: 'Error occurred while building LaTeX.'
            });
            return _this.latex.parser.parse((ref = _this.buildLogs) != null ? ref[((ref1 = _this.buildLogs) != null ? ref1.length : void 0) - 1] : void 0);
          }
        };
      })(this));
      return this.process.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.buildLogs[_this.buildLogs.length - 1] += data;
        };
      })(this));
    };

    Builder.prototype.postBuild = function() {
      var logText, ref, ref1;
      this.latex.logger.clearBuildError();
      this.latex.parser.parse((ref = this.buildLogs) != null ? ref[((ref1 = this.buildLogs) != null ? ref1.length : void 0) - 1] : void 0);
      if (this.latex.parser.isLatexmkSkipped) {
        logText = 'latexmk skipped building process.';
      } else {
        logText = 'Successfully built LaTeX.';
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
      var ref;
      this.cmds = [];
      return (ref = this.process) != null ? ref.kill() : void 0;
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
        cmd = cmd.split('%DOC').join(this.escapeFileName(path.basename(this.latex.mainFile).replace(/\.[^\/.]+$/, "")));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2J1aWxkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsZUFBUjs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLFFBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MsaUJBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFERTs7c0JBR2IsS0FBQSxHQUFPLFNBQUMsSUFBRDtNQUNMLElBQUcsQ0FBQyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFmLENBQXdCLElBQXhCLENBQUo7QUFDRSxlQUFPLE1BRFQ7O01BR0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7TUFDQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBSDtRQUNFLElBQUMsQ0FBQSxXQUFELENBQUEsRUFERjs7TUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFkLEdBQW9CO01BQ3BCLElBQUMsQ0FBQSxLQUFLLEVBQUMsT0FBRCxFQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUEzQixHQUFvQztNQUNwQyxJQUFDLENBQUEsS0FBSyxFQUFDLE9BQUQsRUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBM0IsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLFlBQUQsQ0FBQTtBQUVBLGFBQU87SUFmRjs7c0JBaUJQLFdBQUEsR0FB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Q0FBdUIsV0FBdkI7UUFDTixHQUFBLEdBQU0sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkI7UUFDTixHQUFBLEdBQU0sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQWlCLENBQUMsSUFBbEIsQ0FDSixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBckIsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxZQUF2QyxFQUFtRCxFQUFuRCxDQUFoQixDQURJO3FCQUdOLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEdBQVg7QUFSRjs7SUFUZ0I7O3NCQW1CbEIsY0FBQSxHQUFnQixTQUFDLElBQUQ7TUFDZCxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEdBQW9CLENBQUMsQ0FBeEI7QUFDRSxlQUFPLEdBQUEsR0FBTSxJQUFOLEdBQWEsSUFEdEI7O0FBRUEsYUFBTztJQUhPOzs7O0tBbEpJO0FBTnRCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jcCA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5oYiA9IHJlcXVpcmUgJ2hhc2JpbidcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQnVpbGRlciBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuXG4gIGJ1aWxkOiAoaGVyZSkgLT5cbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZE1haW4oaGVyZSlcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgQGtpbGxQcm9jZXNzKClcbiAgICBAc2V0Q21kcygpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnNhdmVfb25fYnVpbGQnKVxuICAgICAgQHNhdmVvbkJ1aWxkKClcbiAgICBAbGF0ZXgubG9nZ2VyLmxvZyA9IFtdXG4gICAgQGxhdGV4LnBhY2thZ2Uuc3RhdHVzLnZpZXcuc3RhdHVzID0gJ2J1aWxkaW5nJ1xuICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnVwZGF0ZSgpXG4gICAgQGJ1aWxkTG9ncyA9IFtdXG4gICAgQGV4ZWNDbWRzID0gW11cbiAgICBAYnVpbGRQcm9jZXNzKClcblxuICAgIHJldHVybiB0cnVlXG5cbiAgc2F2ZW9uQnVpbGQ6IC0+XG4gICAgaWYgIUBsYXRleD8udGV4RmlsZXNcbiAgICAgIEBsYXRleC5tYW5hZ2VyLmZpbmRBbGwoKVxuICAgIGZvciBlZGl0b3IgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgaWYgZWRpdG9yLmlzTW9kaWZpZWQoKSBhbmQgZWRpdG9yLmdldFBhdGgoKSBpbiBAbGF0ZXgudGV4RmlsZXNcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuXG4gIGV4ZWNDbWQ6IChjbWQsIGVudiwgY2IpIC0+XG4gICAgZW52Lm1heEJ1ZmZlciA9IEluZmluaXR5XG4gICAgcmV0dXJuIGNwLmV4ZWMoY21kLCBlbnYsIGNiKVxuXG4gIGJ1aWxkUHJvY2VzczogLT5cbiAgICBjbWQgPSBAY21kcy5zaGlmdCgpXG4gICAgaWYgY21kID09IHVuZGVmaW5lZFxuICAgICAgQHBvc3RCdWlsZCgpXG4gICAgICByZXR1cm5cblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5oaWRlX2xvZ19pZl9zdWNjZXNzJylcbiAgICAgIEBsYXRleC5wYW5lbC52aWV3LnNob3dMb2cgPSBmYWxzZVxuICAgIEBidWlsZExvZ3MucHVzaCAnJ1xuICAgIEBleGVjQ21kcy5wdXNoIGNtZFxuICAgICMgQGxhdGV4LmxvZ1BhbmVsLnNob3dUZXh0IGljb246ICdzeW5jJywgc3BpbjogdHJ1ZSwgJ0J1aWxkaW5nIExhVGVYLidcbiAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzdGF0dXMnLFxuICAgICAgdGV4dDogXCJcIlwiU3RlcCAje0BidWlsZExvZ3MubGVuZ3RofT4gI3tjbWR9XCJcIlwiXG4gICAgfSlcbiAgICBAcHJvY2VzcyA9IEBleGVjQ21kKFxuICAgICAgY21kLCB7Y3dkOiBwYXRoLmRpcm5hbWUgQGxhdGV4Lm1haW5GaWxlfSwgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICAgIEBwcm9jZXNzID0gdW5kZWZpbmVkXG4gICAgICAgIGlmICFlcnIgb3IgKGVyci5jb2RlIGlzIG51bGwpXG4gICAgICAgICAgQGJ1aWxkUHJvY2VzcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAbGF0ZXgucGFuZWwudmlldy5zaG93TG9nID0gdHJ1ZVxuICAgICAgICAgIEBsYXRleC5sb2dnZXIucHJvY2Vzc0Vycm9yKFxuICAgICAgICAgICAgXCJcIlwiRmFpbGVkIEJ1aWxkaW5nIExhVGVYIChjb2RlICN7ZXJyLmNvZGV9KS5cIlwiXCIsIGVyci5tZXNzYWdlLCB0cnVlLFxuICAgICAgICAgICAgW3tcbiAgICAgICAgICAgICAgdGV4dDogXCJEaXNtaXNzXCJcbiAgICAgICAgICAgICAgb25EaWRDbGljazogPT4gQGxhdGV4LmxvZ2dlci5jbGVhckJ1aWxkRXJyb3IoKVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICB0ZXh0OiBcIlNob3cgYnVpbGQgbG9nXCJcbiAgICAgICAgICAgICAgb25EaWRDbGljazogPT4gQGxhdGV4LmxvZ2dlci5zaG93TG9nKClcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgKVxuICAgICAgICAgIEBjbWRzID0gW11cbiAgICAgICAgICAjIEBsYXRleC5sb2dQYW5lbC5zaG93VGV4dCBpY29uOiBAbGF0ZXgucGFyc2VyLnN0YXR1cywgJ0Vycm9yLicsIDMwMDBcbiAgICAgICAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdzdGF0dXMnLFxuICAgICAgICAgICAgdGV4dDogJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJ1aWxkaW5nIExhVGVYLidcbiAgICAgICAgICB9KVxuICAgICAgICAgIEBsYXRleC5wYXJzZXIucGFyc2UgQGJ1aWxkTG9ncz9bQGJ1aWxkTG9ncz8ubGVuZ3RoIC0gMV1cbiAgICApXG5cbiAgICBAcHJvY2Vzcy5zdGRvdXQub24gJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICAgIEBidWlsZExvZ3NbQGJ1aWxkTG9ncy5sZW5ndGggLSAxXSArPSBkYXRhXG5cbiAgcG9zdEJ1aWxkOiAtPlxuICAgIEBsYXRleC5sb2dnZXIuY2xlYXJCdWlsZEVycm9yKClcbiAgICBAbGF0ZXgucGFyc2VyLnBhcnNlIEBidWlsZExvZ3M/W0BidWlsZExvZ3M/Lmxlbmd0aCAtIDFdXG4gICAgaWYgQGxhdGV4LnBhcnNlci5pc0xhdGV4bWtTa2lwcGVkXG4gICAgICBsb2dUZXh0ID0gJ2xhdGV4bWsgc2tpcHBlZCBidWlsZGluZyBwcm9jZXNzLidcbiAgICBlbHNlXG4gICAgICBsb2dUZXh0ID0gJ1N1Y2Nlc3NmdWxseSBidWlsdCBMYVRlWC4nXG4gICAgQGxhdGV4LmxvZ2dlci5sb2cucHVzaCh7XG4gICAgICB0eXBlOiAnc3RhdHVzJyxcbiAgICAgIHRleHQ6IGxvZ1RleHRcbiAgICB9KVxuICAgIEBsYXRleC5wYW5lbC52aWV3LnVwZGF0ZSgpXG4gICAgaWYgQGxhdGV4LnZpZXdlci5jbGllbnQud3M/XG4gICAgICBAbGF0ZXgudmlld2VyLnJlZnJlc2goKVxuICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnByZXZpZXdfYWZ0ZXJfYnVpbGQnKSBpc250XFxcbiAgICAgICAgJ0RvIG5vdGhpbmcnXG4gICAgICBAbGF0ZXgudmlld2VyLm9wZW5WaWV3ZXIoKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5jbGVhbl9hZnRlcl9idWlsZCcpXG4gICAgICBAbGF0ZXguY2xlYW5lci5jbGVhbigpXG5cbiAga2lsbFByb2Nlc3M6IC0+XG4gICAgQGNtZHMgPSBbXVxuICAgIEBwcm9jZXNzPy5raWxsKClcblxuICBiaW5DaGVjazogKGJpbmFyeSkgLT5cbiAgICBpZiBoYi5zeW5jIGJpbmFyeVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBzZXRDbWRzOiAtPlxuICAgIEBsYXRleC5tYW5hZ2VyLmxvYWRMb2NhbENmZygpXG4gICAgaWYgQGxhdGV4Lm1hbmFnZXIuY29uZmlnPy50b29sY2hhaW5cbiAgICAgIEBjdXN0b21fdG9vbGNoYWluKEBsYXRleC5tYW5hZ2VyLmNvbmZpZy50b29sY2hhaW4pXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgudG9vbGNoYWluJykgPT0gJ2F1dG8nXG4gICAgICBpZiAhQGxhdGV4bWtfdG9vbGNoYWluKClcbiAgICAgICAgQGN1c3RvbV90b29sY2hhaW4oKVxuICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnRvb2xjaGFpbicpID09ICdsYXRleG1rIHRvb2xjaGFpbidcbiAgICAgIEBsYXRleG1rX3Rvb2xjaGFpbigpXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgudG9vbGNoYWluJykgPT0gJ2N1c3RvbSB0b29sY2hhaW4nXG4gICAgICBAY3VzdG9tX3Rvb2xjaGFpbigpXG5cbiAgbGF0ZXhta190b29sY2hhaW46IC0+XG4gICAgQGNtZHMgPSBbXG4gICAgICBcIlwiXCJsYXRleG1rIFxcXG4gICAgICAje2F0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5sYXRleG1rX3BhcmFtJyl9IFxcXG4gICAgICAje0Blc2NhcGVGaWxlTmFtZShwYXRoLmJhc2VuYW1lKEBsYXRleC5tYWluRmlsZSwgJy50ZXgnKSl9XCJcIlwiXG4gICAgXVxuICAgIGlmICFAYmluQ2hlY2soJ2xhdGV4bWsnKSBvciAhQGJpbkNoZWNrKCdwZXJsJylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgY3VzdG9tX3Rvb2xjaGFpbjogKHRvb2xjaGFpbikgLT5cbiAgICB0ZXhDb21waWxlciA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5jb21waWxlcicpXG4gICAgYmliQ29tcGlsZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguYmlidGV4JylcbiAgICBhcmdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmNvbXBpbGVyX3BhcmFtJylcbiAgICBpZiAhdG9vbGNoYWluP1xuICAgICAgdG9vbGNoYWluID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmN1c3RvbV90b29sY2hhaW4nKVxuICAgIHRvb2xjaGFpbiA9IHRvb2xjaGFpbi5zcGxpdCgnJiYnKS5tYXAoKGNtZCkgLT4gY21kLnRyaW0oKSlcbiAgICBAY21kcyA9IFtdXG4gICAgcmVzdWx0ID0gW11cbiAgICBmb3IgdG9vbFByb3RvdHlwZSBpbiB0b29sY2hhaW5cbiAgICAgIGNtZCA9IHRvb2xQcm90b3R5cGVcbiAgICAgIGNtZCA9IGNtZC5zcGxpdCgnJVRFWCcpLmpvaW4odGV4Q29tcGlsZXIpXG4gICAgICBjbWQgPSBjbWQuc3BsaXQoJyVCSUInKS5qb2luKGJpYkNvbXBpbGVyKVxuICAgICAgY21kID0gY21kLnNwbGl0KCclQVJHJykuam9pbihhcmdzKVxuICAgICAgY21kID0gY21kLnNwbGl0KCclRE9DJykuam9pbihcbiAgICAgICAgQGVzY2FwZUZpbGVOYW1lKHBhdGguYmFzZW5hbWUoQGxhdGV4Lm1haW5GaWxlKS5yZXBsYWNlKC9cXC5bXi8uXSskLyxcIlwiKSlcbiAgICAgIClcbiAgICAgIEBjbWRzLnB1c2ggY21kXG5cbiAgZXNjYXBlRmlsZU5hbWU6IChmaWxlKSAtPlxuICAgIGlmIGZpbGUuaW5kZXhPZignICcpID4gLTFcbiAgICAgIHJldHVybiAnXCInICsgZmlsZSArICdcIidcbiAgICByZXR1cm4gZmlsZVxuIl19
