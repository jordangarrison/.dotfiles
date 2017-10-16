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
      this.buildTimer = Date.now();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2J1aWxkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsZUFBUjs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLFFBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MsaUJBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFERTs7c0JBR2IsS0FBQSxHQUFPLFNBQUMsSUFBRDtNQUNMLElBQUcsQ0FBQyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFmLENBQXdCLElBQXhCLENBQUo7QUFDRSxlQUFPLE1BRFQ7O01BR0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7TUFDQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBSDtRQUNFLElBQUMsQ0FBQSxXQUFELENBQUEsRUFERjs7TUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxHQUFMLENBQUE7TUFDZCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFkLEdBQW9CO01BQ3BCLElBQUMsQ0FBQSxLQUFLLEVBQUMsT0FBRCxFQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUEzQixHQUFvQztNQUNwQyxJQUFDLENBQUEsS0FBSyxFQUFDLE9BQUQsRUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBM0IsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxD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QUFBLEdBQU0sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsV0FBdkI7UUFDTixHQUFBLEdBQU0sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsV0FBdkI7UUFDTixHQUFBLEdBQU0sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkI7UUFDTixHQUFBLEdBQU0sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQWlCLENBQUMsSUFBbEIsQ0FDSixJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBckIsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxZQUF2QyxFQUFtRCxFQUFuRCxDQUFoQixDQURJO3FCQUdOLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEdBQVg7QUFSRjs7SUFUZ0I7O3NCQW1CbEIsY0FBQSxHQUFnQixTQUFDLElBQUQ7TUFDZCxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEdBQW9CLENBQUMsQ0FBeEI7QUFDRSxlQUFPLEdBQUEsR0FBTSxJQUFOLEdBQWEsSUFEdEI7O0FBRUEsYUFBTztJQUhPOzs7O0tBbkpJO0FBTnRCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jcCA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5oYiA9IHJlcXVpcmUgJ2hhc2JpbidcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQnVpbGRlciBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuXG4gIGJ1aWxkOiAoaGVyZSkgLT5cbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZE1haW4oaGVyZSlcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgQGtpbGxQcm9jZXNzKClcbiAgICBAc2V0Q21kcygpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LnNhdmVfb25fYnVpbGQnKVxuICAgICAgQHNhdmVvbkJ1aWxkKClcbiAgICBAYnVpbGRUaW1lciA9IERhdGUubm93KClcbiAgICBAbGF0ZXgubG9nZ2VyLmxvZyA9IFtdXG4gICAgQGxhdGV4LnBhY2thZ2Uuc3RhdHVzLnZpZXcuc3RhdHVzID0gJ2J1aWxkaW5nJ1xuICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnVwZGF0ZSgpXG4gICAgQGJ1aWxkTG9ncyA9IFtdXG4gICAgQGV4ZWNDbWRzID0gW11cbiAgICBAYnVpbGRQcm9jZXNzKClcblxuICAgIHJldHVybiB0cnVlXG5cbiAgc2F2ZW9uQnVpbGQ6IC0+XG4gICAgaWYgIUBsYXRleD8udGV4RmlsZXNcbiAgICAgIEBsYXRleC5tYW5hZ2VyLmZpbmRBbGwoKVxuICAgIGZvciBlZGl0b3IgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgaWYgZWRpdG9yLmlzTW9kaWZpZWQoKSBhbmQgZWRpdG9yLmdldFBhdGgoKSBpbiBAbGF0ZXgudGV4RmlsZXNcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuXG4gIGV4ZWNDbWQ6IChjbWQsIGVudiwgY2IpIC0+XG4gICAgZW52Lm1heEJ1ZmZlciA9IEluZmluaXR5XG4gICAgcmV0dXJuIGNwLmV4ZWMoY21kLCBlbnYsIGNiKVxuXG4gIGJ1aWxkUHJvY2VzczogLT5cbiAgICBjbWQgPSBAY21kcy5zaGlmdCgpXG4gICAgaWYgY21kID09IHVuZGVmaW5lZFxuICAgICAgQHBvc3RCdWlsZCgpXG4gICAgICByZXR1cm5cblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5oaWRlX2xvZ19pZl9zdWNjZXNzJylcbiAgICAgIEBsYXRleC5wYW5lbC52aWV3LnNob3dMb2cgPSBmYWxzZVxuICAgIEBidWlsZExvZ3MucHVzaCAnJ1xuICAgIEBleGVjQ21kcy5wdXNoIGNtZFxuICAgICMgQGxhdGV4LmxvZ1BhbmVsLnNob3dUZXh0IGljb246ICdzeW5jJywgc3BpbjogdHJ1ZSwgJ0J1aWxkaW5nIExhVGVYLidcbiAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzdGF0dXMnLFxuICAgICAgdGV4dDogXCJcIlwiU3RlcCAje0BidWlsZExvZ3MubGVuZ3RofT4gI3tjbWR9XCJcIlwiXG4gICAgfSlcbiAgICBAcHJvY2VzcyA9IEBleGVjQ21kKFxuICAgICAgY21kLCB7Y3dkOiBwYXRoLmRpcm5hbWUgQGxhdGV4Lm1haW5GaWxlfSwgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICAgIEBwcm9jZXNzID0gdW5kZWZpbmVkXG4gICAgICAgIGlmICFlcnIgb3IgKGVyci5jb2RlIGlzIG51bGwpXG4gICAgICAgICAgQGJ1aWxkUHJvY2VzcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAbGF0ZXgucGFuZWwudmlldy5zaG93TG9nID0gdHJ1ZVxuICAgICAgICAgIEBsYXRleC5sb2dnZXIucHJvY2Vzc0Vycm9yKFxuICAgICAgICAgICAgXCJcIlwiRmFpbGVkIEJ1aWxkaW5nIExhVGVYIChjb2RlICN7ZXJyLmNvZGV9KS5cIlwiXCIsIGVyci5tZXNzYWdlLCB0cnVlLFxuICAgICAgICAgICAgW3tcbiAgICAgICAgICAgICAgdGV4dDogXCJEaXNtaXNzXCJcbiAgICAgICAgICAgICAgb25EaWRDbGljazogPT4gQGxhdGV4LmxvZ2dlci5jbGVhckJ1aWxkRXJyb3IoKVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICB0ZXh0OiBcIlNob3cgYnVpbGQgbG9nXCJcbiAgICAgICAgICAgICAgb25EaWRDbGljazogPT4gQGxhdGV4LmxvZ2dlci5zaG93TG9nKClcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgKVxuICAgICAgICAgIEBjbWRzID0gW11cbiAgICAgICAgICAjIEBsYXRleC5sb2dQYW5lbC5zaG93VGV4dCBpY29uOiBAbGF0ZXgucGFyc2VyLnN0YXR1cywgJ0Vycm9yLicsIDMwMDBcbiAgICAgICAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdzdGF0dXMnLFxuICAgICAgICAgICAgdGV4dDogJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJ1aWxkaW5nIExhVGVYLidcbiAgICAgICAgICB9KVxuICAgICAgICAgIEBsYXRleC5wYXJzZXIucGFyc2UgQGJ1aWxkTG9ncz9bQGJ1aWxkTG9ncz8ubGVuZ3RoIC0gMV1cbiAgICApXG5cbiAgICBAcHJvY2Vzcy5zdGRvdXQub24gJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICAgIEBidWlsZExvZ3NbQGJ1aWxkTG9ncy5sZW5ndGggLSAxXSArPSBkYXRhXG5cbiAgcG9zdEJ1aWxkOiAtPlxuICAgIEBsYXRleC5sb2dnZXIuY2xlYXJCdWlsZEVycm9yKClcbiAgICBAbGF0ZXgucGFyc2VyLnBhcnNlIEBidWlsZExvZ3M/W0BidWlsZExvZ3M/Lmxlbmd0aCAtIDFdXG4gICAgaWYgQGxhdGV4LnBhcnNlci5pc0xhdGV4bWtTa2lwcGVkXG4gICAgICBsb2dUZXh0ID0gJ2xhdGV4bWsgc2tpcHBlZCBidWlsZGluZyBwcm9jZXNzLidcbiAgICBlbHNlXG4gICAgICBsb2dUZXh0ID0gXCJTdWNjZXNzZnVsbHkgYnVpbHQgTGFUZVggaW4gI3tEYXRlLm5vdygpIC0gQGJ1aWxkVGltZXJ9IG1zXCJcbiAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzdGF0dXMnLFxuICAgICAgdGV4dDogbG9nVGV4dFxuICAgIH0pXG4gICAgQGxhdGV4LnBhbmVsLnZpZXcudXBkYXRlKClcbiAgICBpZiBAbGF0ZXgudmlld2VyLmNsaWVudC53cz9cbiAgICAgIEBsYXRleC52aWV3ZXIucmVmcmVzaCgpXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgucHJldmlld19hZnRlcl9idWlsZCcpIGlzbnRcXFxuICAgICAgICAnRG8gbm90aGluZydcbiAgICAgIEBsYXRleC52aWV3ZXIub3BlblZpZXdlcigpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmNsZWFuX2FmdGVyX2J1aWxkJylcbiAgICAgIEBsYXRleC5jbGVhbmVyLmNsZWFuKClcblxuICBraWxsUHJvY2VzczogLT5cbiAgICBAY21kcyA9IFtdXG4gICAgQHByb2Nlc3M/LmtpbGwoKVxuXG4gIGJpbkNoZWNrOiAoYmluYXJ5KSAtPlxuICAgIGlmIGhiLnN5bmMgYmluYXJ5XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHNldENtZHM6IC0+XG4gICAgQGxhdGV4Lm1hbmFnZXIubG9hZExvY2FsQ2ZnKClcbiAgICBpZiBAbGF0ZXgubWFuYWdlci5jb25maWc/LnRvb2xjaGFpblxuICAgICAgQGN1c3RvbV90b29sY2hhaW4oQGxhdGV4Lm1hbmFnZXIuY29uZmlnLnRvb2xjaGFpbilcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC50b29sY2hhaW4nKSA9PSAnYXV0bydcbiAgICAgIGlmICFAbGF0ZXhta190b29sY2hhaW4oKVxuICAgICAgICBAY3VzdG9tX3Rvb2xjaGFpbigpXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXgudG9vbGNoYWluJykgPT0gJ2xhdGV4bWsgdG9vbGNoYWluJ1xuICAgICAgQGxhdGV4bWtfdG9vbGNoYWluKClcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC50b29sY2hhaW4nKSA9PSAnY3VzdG9tIHRvb2xjaGFpbidcbiAgICAgIEBjdXN0b21fdG9vbGNoYWluKClcblxuICBsYXRleG1rX3Rvb2xjaGFpbjogLT5cbiAgICBAY21kcyA9IFtcbiAgICAgIFwiXCJcImxhdGV4bWsgXFxcbiAgICAgICN7YXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmxhdGV4bWtfcGFyYW0nKX0gXFxcbiAgICAgICN7QGVzY2FwZUZpbGVOYW1lKHBhdGguYmFzZW5hbWUoQGxhdGV4Lm1haW5GaWxlLCAnLnRleCcpKX1cIlwiXCJcbiAgICBdXG4gICAgaWYgIUBiaW5DaGVjaygnbGF0ZXhtaycpIG9yICFAYmluQ2hlY2soJ3BlcmwnKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICBjdXN0b21fdG9vbGNoYWluOiAodG9vbGNoYWluKSAtPlxuICAgIHRleENvbXBpbGVyID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWxhdGV4LmNvbXBpbGVyJylcbiAgICBiaWJDb21waWxlciA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5iaWJ0ZXgnKVxuICAgIGFyZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguY29tcGlsZXJfcGFyYW0nKVxuICAgIGlmICF0b29sY2hhaW4/XG4gICAgICB0b29sY2hhaW4gPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguY3VzdG9tX3Rvb2xjaGFpbicpXG4gICAgdG9vbGNoYWluID0gdG9vbGNoYWluLnNwbGl0KCcmJicpLm1hcCgoY21kKSAtPiBjbWQudHJpbSgpKVxuICAgIEBjbWRzID0gW11cbiAgICByZXN1bHQgPSBbXVxuICAgIGZvciB0b29sUHJvdG90eXBlIGluIHRvb2xjaGFpblxuICAgICAgY21kID0gdG9vbFByb3RvdHlwZVxuICAgICAgY21kID0gY21kLnNwbGl0KCclVEVYJykuam9pbih0ZXhDb21waWxlcilcbiAgICAgIGNtZCA9IGNtZC5zcGxpdCgnJUJJQicpLmpvaW4oYmliQ29tcGlsZXIpXG4gICAgICBjbWQgPSBjbWQuc3BsaXQoJyVBUkcnKS5qb2luKGFyZ3MpXG4gICAgICBjbWQgPSBjbWQuc3BsaXQoJyVET0MnKS5qb2luKFxuICAgICAgICBAZXNjYXBlRmlsZU5hbWUocGF0aC5iYXNlbmFtZShAbGF0ZXgubWFpbkZpbGUpLnJlcGxhY2UoL1xcLlteLy5dKyQvLFwiXCIpKVxuICAgICAgKVxuICAgICAgQGNtZHMucHVzaCBjbWRcblxuICBlc2NhcGVGaWxlTmFtZTogKGZpbGUpIC0+XG4gICAgaWYgZmlsZS5pbmRleE9mKCcgJykgPiAtMVxuICAgICAgcmV0dXJuICdcIicgKyBmaWxlICsgJ1wiJ1xuICAgIHJldHVybiBmaWxlXG4iXX0=
