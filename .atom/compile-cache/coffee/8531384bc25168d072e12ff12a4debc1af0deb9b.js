(function() {
  var ThemeConfig, fs, ini, isStartup, path,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  ini = require('ini');

  isStartup = true;

  module.exports = ThemeConfig = (function() {
    var isManualFontSize, reloadTheme;

    function ThemeConfig() {
      this.refresh = bind(this.refresh, this);
      this.setTheme = bind(this.setTheme, this);
      this.updateIcons = bind(this.updateIcons, this);
      this.updateFontSize = bind(this.updateFontSize, this);
      this.updateFont = bind(this.updateFont, this);
      this.startup = true;
      this.atomWorkspace = document.querySelector('atom-workspace');
      this.atomWorkspace.style.fontSize = "";
    }

    isManualFontSize = function(fontSize) {
      return (fontSize != null) && fontSize !== -1;
    };

    ThemeConfig.prototype.updateFont = function() {
      var font;
      font = atom.config.get('adwaita-pro-ui.fontFamily');
      if (font === 'gtk-3') {
        return this.loadGtkFont();
      } else {
        return this.atomWorkspace.style.fontFamily = font;
      }
    };

    ThemeConfig.prototype.updateFontSize = function() {
      var size;
      size = atom.config.get('adwaita-pro-ui.fontSize');
      if (isManualFontSize(size)) {
        return this.atomWorkspace.style.fontSize = size + "px";
      } else if (atom.config.get('adwaita-pro-ui.fontFamily') === 'gtk-3') {
        return this.loadGtkFont();
      } else {
        return this.atomWorkspace.style.fontSize = "";
      }
    };

    ThemeConfig.prototype.updateIcons = function() {
      var iconTheme;
      iconTheme = atom.config.get('adwaita-pro-ui.iconTheme') || 'No Icons';
      return this.atomWorkspace.setAttribute('data-adwaita-pro-ui-icon-theme', iconTheme.toLowerCase().replace(/\ /g, '-'));
    };

    ThemeConfig.prototype.loadGtkFont = function() {
      return fs.readFile(path.join(process.env.HOME, '.config/gtk-3.0/settings.ini'), {
        encoding: 'utf-8'
      }, (function(_this) {
        return function(err, raw) {
          var fontFamily, fontSize, gtk_settings, ref, ref1;
          if (err) {
            return console.error(err.stack || err);
          }
          gtk_settings = ini.parse(raw);
          ref1 = ((gtk_settings != null ? (ref = gtk_settings.Settings) != null ? ref['gtk-font-name'] : void 0 : void 0) || '').split('  '), fontFamily = ref1[0], fontSize = ref1[1];
          if (fontFamily) {
            _this.atomWorkspace.style.fontFamily = fontFamily;
          }
          if (fontSize && !isManualFontSize(atom.config.get('adwaita-pro-ui.fontSize'))) {
            _this.atomWorkspace.style.fontSize = fontSize + "px";
            return atom.themes.emitter.emit('did-change-active-themes');
          }
        };
      })(this));
    };

    ThemeConfig.reloadTheme = reloadTheme = function() {
      return new Promise(function(resolve, reject) {
        atom.themes.removeActiveThemeClasses();
        atom.themes.unwatchUserStylesheet();
        atom.themes.packageManager.deactivatePackage("adwaita-pro-ui");
        atom.themes.refreshLessCache();
        return atom.themes.packageManager.activatePackage("adwaita-pro-ui").then(function() {
          atom.themes.addActiveThemeClasses();
          atom.themes.loadUserStylesheet();
          atom.themes.refreshLessCache();
          atom.themes.reloadBaseStylesheets();
          atom.themes.emitter.emit('did-change-active-themes');
          return resolve();
        }, reject);
      });
    };

    ThemeConfig.prototype.setTheme = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var theme, themeFile;
          themeFile = path.join(__dirname, "../styles/gtk_style.less");
          theme = atom.config.get('adwaita-pro-ui.theme') || 'auto';
          return fs.readFile(themeFile, {
            encoding: "utf8"
          }, function(err, data) {
            var currentTheme;
            if (err) {
              return reject(err);
            }
            currentTheme = /^@gtk-style: (auto|dark|light);/.exec(data)[1];
            if (theme !== currentTheme) {
              fs.writeFile(themeFile, "@gtk-style: " + theme + ";\n", function(err) {
                if (err) {
                  return reject(err);
                }
                return reloadTheme().then((function() {
                  return resolve(false);
                }), reject);
              });
            } else if (isStartup && (theme === 'dark' || theme === 'auto')) {
              isStartup = false;
              return resolve(true);
            }
            return resolve(false);
          });
        };
      })(this));
    };

    ThemeConfig.prototype.init = function() {
      this.updateFontDisposable = atom.config.observe('adwaita-pro-ui.fontFamily', this.updateFont);
      this.updateFontSizeDisposable = atom.config.observe('adwaita-pro-ui.fontSize', this.updateFontSize);
      this.updateIconsDisposable = atom.config.observe('adwaita-pro-ui.iconTheme', this.updateIcons);
      this.setThemeDisposable = atom.config.onDidChange('adwaita-pro-ui.theme', this.setTheme);
      this.onDidChangeActiveThemesDisposable = atom.themes.onDidChangeActiveThemes(this.refresh);
      return this.setTheme();
    };

    ThemeConfig.prototype.destroy = function() {
      this.updateFontDisposable.dispose();
      this.updateFontSizeDisposable.dispose();
      this.updateIconsDisposable.dispose();
      this.setThemeDisposable.dispose();
      return this.onDidChangeActiveThemesDisposable.dispose();
    };

    ThemeConfig.prototype.refresh = function() {
      if (this.isRefreshing) {
        return;
      }
      this.isRefreshing = true;
      this.updateFont();
      this.updateFontSize();
      this.updateIcons();
      return this.isRefreshing = false;
    };

    return ThemeConfig;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fkd2FpdGEtcHJvLXVpL2xpYi9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxQ0FBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOztFQUVOLFNBQUEsR0FBWTs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osUUFBQTs7SUFBYSxxQkFBQTs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUVYLElBQUMsQ0FBQSxhQUFELEdBQWlCLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QjtNQUNqQixJQUFDLENBQUEsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFyQixHQUFnQztJQUpyQjs7SUFNYixnQkFBQSxHQUFtQixTQUFDLFFBQUQ7YUFBYyxrQkFBQSxJQUFjLFFBQUEsS0FBYyxDQUFDO0lBQTNDOzswQkFFbkIsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEI7TUFDUCxJQUFHLElBQUEsS0FBUSxPQUFYO2VBQ0UsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQXJCLEdBQWtDLEtBSHBDOztJQUZVOzswQkFPWixjQUFBLEdBQWdCLFNBQUE7QUFDZCxVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEI7TUFDUCxJQUFHLGdCQUFBLENBQWlCLElBQWpCLENBQUg7ZUFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFyQixHQUFt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QUFpRCxJQUFDLENBQUEsVUFBbEQ7TUFDeEIsSUFBQyxDQUFBLHdCQUFELEdBQTRCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix5QkFBcEIsRUFBK0MsSUFBQyxDQUFBLGNBQWhEO01BQzVCLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMEJBQXBCLEVBQWdELElBQUMsQ0FBQSxXQUFqRDtNQUN6QixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHNCQUF4QixFQUFnRCxJQUFDLENBQUEsUUFBakQ7TUFFdEIsSUFBQyxDQUFBLGlDQUFELEdBQXFDLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsSUFBQyxDQUFBLE9BQXJDO0FBQ3JDLGFBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBQTtJQVBIOzswQkFTTixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxPQUF0QixDQUFBO01BQ0EsSUFBQyxDQUFBLHdCQUF3QixDQUFDLE9BQTFCLENBQUE7TUFDQSxJQUFDLENBQUEscUJBQXFCLENBQUMsT0FBdkIsQ0FBQTtNQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBO2FBQ0EsSUFBQyxDQUFBLGlDQUFpQyxDQUFDLE9BQW5DLENBQUE7SUFMTzs7MEJBT1QsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFHLElBQUMsQ0FBQSxZQUFKO0FBQXNCLGVBQXRCOztNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxVQUFELENBQUE7TUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCO0lBTlQ7Ozs7O0FBOUZYIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuaW5pID0gcmVxdWlyZSAnaW5pJ1xuXG5pc1N0YXJ0dXAgPSB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRoZW1lQ29uZmlnXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEBzdGFydHVwID0gdHJ1ZVxuXG4gICAgQGF0b21Xb3Jrc3BhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXdvcmtzcGFjZScpXG4gICAgQGF0b21Xb3Jrc3BhY2Uuc3R5bGUuZm9udFNpemUgPSBcIlwiXG5cbiAgaXNNYW51YWxGb250U2l6ZSA9IChmb250U2l6ZSkgLT4gZm9udFNpemU/IGFuZCBmb250U2l6ZSBpc250IC0xXG5cbiAgdXBkYXRlRm9udDogKCkgPT5cbiAgICBmb250ID0gYXRvbS5jb25maWcuZ2V0KCdhZHdhaXRhLXByby11aS5mb250RmFtaWx5JylcbiAgICBpZiBmb250IGlzICdndGstMydcbiAgICAgIEBsb2FkR3RrRm9udCgpXG4gICAgZWxzZVxuICAgICAgQGF0b21Xb3Jrc3BhY2Uuc3R5bGUuZm9udEZhbWlseSA9IGZvbnRcblxuICB1cGRhdGVGb250U2l6ZTogKCkgPT5cbiAgICBzaXplID0gYXRvbS5jb25maWcuZ2V0KCdhZHdhaXRhLXByby11aS5mb250U2l6ZScpXG4gICAgaWYgaXNNYW51YWxGb250U2l6ZShzaXplKVxuICAgICAgQGF0b21Xb3Jrc3BhY2Uuc3R5bGUuZm9udFNpemUgPSBcIiN7c2l6ZX1weFwiXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2Fkd2FpdGEtcHJvLXVpLmZvbnRGYW1pbHknKSBpcyAnZ3RrLTMnXG4gICAgICBAbG9hZEd0a0ZvbnQoKVxuICAgIGVsc2VcbiAgICAgIEBhdG9tV29ya3NwYWNlLnN0eWxlLmZvbnRTaXplID0gXCJcIlxuXG4gIHVwZGF0ZUljb25zOiAoKSA9PlxuICAgIGljb25UaGVtZSA9IGF0b20uY29uZmlnLmdldCgnYWR3YWl0YS1wcm8tdWkuaWNvblRoZW1lJykgb3IgJ05vIEljb25zJ1xuICAgIEBhdG9tV29ya3NwYWNlLnNldEF0dHJpYnV0ZSgnZGF0YS1hZHdhaXRhLXByby11aS1pY29uLXRoZW1lJywgaWNvblRoZW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFwgL2csICctJykpXG5cbiAgbG9hZEd0a0ZvbnQ6ICgpIC0+XG4gICAgZnMucmVhZEZpbGUgcGF0aC5qb2luKHByb2Nlc3MuZW52LkhPTUUsICcuY29uZmlnL2d0ay0zLjAvc2V0dGluZ3MuaW5pJyksIHtlbmNvZGluZzogJ3V0Zi04J30sIChlcnIsIHJhdykgPT5cbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVyci5zdGFjayBvciBlcnIpIGlmIGVyclxuICAgICAgZ3RrX3NldHRpbmdzID0gaW5pLnBhcnNlKHJhdylcbiAgICAgIFtmb250RmFtaWx5LCBmb250U2l6ZV0gPSAoZ3RrX3NldHRpbmdzPy5TZXR0aW5ncz9bJ2d0ay1mb250LW5hbWUnXSBvciAnJykuc3BsaXQoJyAgJylcbiAgICAgIGlmIGZvbnRGYW1pbHlcbiAgICAgICAgQGF0b21Xb3Jrc3BhY2Uuc3R5bGUuZm9udEZhbWlseSA9IGZvbnRGYW1pbHlcbiAgICAgIGlmIGZvbnRTaXplIGFuZCBub3QgaXNNYW51YWxGb250U2l6ZShhdG9tLmNvbmZpZy5nZXQoJ2Fkd2FpdGEtcHJvLXVpLmZvbnRTaXplJykpXG4gICAgICAgIEBhdG9tV29ya3NwYWNlLnN0eWxlLmZvbnRTaXplID0gXCIje2ZvbnRTaXplfXB4XCJcbiAgICAgICAgYXRvbS50aGVtZXMuZW1pdHRlci5lbWl0ICdkaWQtY2hhbmdlLWFjdGl2ZS10aGVtZXMnXG5cbiAgQHJlbG9hZFRoZW1lID0gcmVsb2FkVGhlbWUgPSAoKSAtPiBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICMgYm9ycm93ZWQgZnJvbSBhdG9tIGNvcmU6IHNyYy90aGVtZS1tYW5hZ2VyLmNvZmZlZVxuICAgIGF0b20udGhlbWVzLnJlbW92ZUFjdGl2ZVRoZW1lQ2xhc3NlcygpXG4gICAgYXRvbS50aGVtZXMudW53YXRjaFVzZXJTdHlsZXNoZWV0KClcbiAgICBhdG9tLnRoZW1lcy5wYWNrYWdlTWFuYWdlci5kZWFjdGl2YXRlUGFja2FnZShcImFkd2FpdGEtcHJvLXVpXCIpXG4gICAgYXRvbS50aGVtZXMucmVmcmVzaExlc3NDYWNoZSgpXG4gICAgYXRvbS50aGVtZXMucGFja2FnZU1hbmFnZXIuYWN0aXZhdGVQYWNrYWdlKFwiYWR3YWl0YS1wcm8tdWlcIikudGhlbiAtPlxuICAgICAgYXRvbS50aGVtZXMuYWRkQWN0aXZlVGhlbWVDbGFzc2VzKClcbiAgICAgIGF0b20udGhlbWVzLmxvYWRVc2VyU3R5bGVzaGVldCgpXG4gICAgICBhdG9tLnRoZW1lcy5yZWZyZXNoTGVzc0NhY2hlKClcbiAgICAgIGF0b20udGhlbWVzLnJlbG9hZEJhc2VTdHlsZXNoZWV0cygpXG4gICAgICBhdG9tLnRoZW1lcy5lbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtYWN0aXZlLXRoZW1lcydcbiAgICAgIHJlc29sdmUoKVxuICAgICwgcmVqZWN0XG5cblxuICBzZXRUaGVtZTogKCkgPT4gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICB0aGVtZUZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL3N0eWxlcy9ndGtfc3R5bGUubGVzc1wiKVxuICAgIHRoZW1lID0gYXRvbS5jb25maWcuZ2V0KCdhZHdhaXRhLXByby11aS50aGVtZScpIG9yICdhdXRvJ1xuICAgIGZzLnJlYWRGaWxlIHRoZW1lRmlsZSwge2VuY29kaW5nOiBcInV0ZjhcIn0sIChlcnIsIGRhdGEpID0+XG4gICAgICBpZiBlcnIgdGhlbiByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIGN1cnJlbnRUaGVtZSA9IC9eQGd0ay1zdHlsZTogKGF1dG98ZGFya3xsaWdodCk7Ly5leGVjKGRhdGEpWzFdXG4gICAgICBpZiB0aGVtZSBpc250IGN1cnJlbnRUaGVtZVxuICAgICAgICBmcy53cml0ZUZpbGUgdGhlbWVGaWxlLCBcIkBndGstc3R5bGU6ICN7dGhlbWV9O1xcblwiLCAoZXJyKSAtPlxuICAgICAgICAgIGlmIGVyciB0aGVuIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgIHJlbG9hZFRoZW1lKCkudGhlbiAoLT4gcmVzb2x2ZShmYWxzZSkpLCByZWplY3RcbiAgICAgIGVsc2UgaWYgaXNTdGFydHVwIGFuZCB0aGVtZSBpbiBbJ2RhcmsnLCAnYXV0byddXG4gICAgICAgIGlzU3RhcnR1cCA9IGZhbHNlXG4gICAgICAgIHJldHVybiByZXNvbHZlKHRydWUpXG4gICAgICByZXR1cm4gcmVzb2x2ZShmYWxzZSlcblxuICBpbml0OiAoKSAtPlxuICAgIEB1cGRhdGVGb250RGlzcG9zYWJsZSA9IGF0b20uY29uZmlnLm9ic2VydmUgJ2Fkd2FpdGEtcHJvLXVpLmZvbnRGYW1pbHknLCBAdXBkYXRlRm9udFxuICAgIEB1cGRhdGVGb250U2l6ZURpc3Bvc2FibGUgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdhZHdhaXRhLXByby11aS5mb250U2l6ZScsIEB1cGRhdGVGb250U2l6ZVxuICAgIEB1cGRhdGVJY29uc0Rpc3Bvc2FibGUgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdhZHdhaXRhLXByby11aS5pY29uVGhlbWUnLCBAdXBkYXRlSWNvbnNcbiAgICBAc2V0VGhlbWVEaXNwb3NhYmxlID0gYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2Fkd2FpdGEtcHJvLXVpLnRoZW1lJywgQHNldFRoZW1lXG5cbiAgICBAb25EaWRDaGFuZ2VBY3RpdmVUaGVtZXNEaXNwb3NhYmxlID0gYXRvbS50aGVtZXMub25EaWRDaGFuZ2VBY3RpdmVUaGVtZXMgQHJlZnJlc2hcbiAgICByZXR1cm4gQHNldFRoZW1lKClcblxuICBkZXN0cm95OiAoKSAtPlxuICAgIEB1cGRhdGVGb250RGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICBAdXBkYXRlRm9udFNpemVEaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgIEB1cGRhdGVJY29uc0Rpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgQHNldFRoZW1lRGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICBAb25EaWRDaGFuZ2VBY3RpdmVUaGVtZXNEaXNwb3NhYmxlLmRpc3Bvc2UoKVxuXG4gIHJlZnJlc2g6ICgpID0+XG4gICAgaWYgQGlzUmVmcmVzaGluZyB0aGVuIHJldHVyblxuICAgIEBpc1JlZnJlc2hpbmcgPSB0cnVlXG4gICAgQHVwZGF0ZUZvbnQoKVxuICAgIEB1cGRhdGVGb250U2l6ZSgpXG4gICAgQHVwZGF0ZUljb25zKClcbiAgICBAaXNSZWZyZXNoaW5nID0gZmFsc2VcbiJdfQ==
