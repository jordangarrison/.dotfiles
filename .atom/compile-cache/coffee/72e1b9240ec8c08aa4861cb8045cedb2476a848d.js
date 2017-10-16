(function() {
  var helper, path, pkg;

  path = require('path');

  pkg = require('../lib/main');

  helper = require('./helper');

  describe('Atom-LaTeX', function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return helper.activatePackages();
      });
    });
    describe('Package', function() {
      return describe('when package initialized', function() {
        return it('has Atom-LaTeX main object', function() {
          expect(pkg.latex).toBeDefined();
          expect(pkg.latex.builder).toBeDefined();
          expect(pkg.latex.manager).toBeDefined();
          expect(pkg.latex.viewer).toBeDefined();
          expect(pkg.latex.server).toBeDefined();
          expect(pkg.latex.panel).toBeDefined();
          return expect(pkg.latex.parser).toBeDefined();
        });
      });
    });
    describe('Builder', function() {
      beforeEach(function() {
        var project;
        project = "" + (path.dirname(__filename)) + path.sep + "latex_project";
        atom.project.setPaths([project]);
        return pkg.latex.mainFile = "" + project + path.sep + "main.tex";
      });
      describe('build-after-save feature', function() {
        var builder, builder_;
        builder = builder_ = void 0;
        beforeEach(function() {
          builder = jasmine.createSpyObj('Builder', ['build']);
          builder_ = pkg.latex.builder;
          return pkg.latex.builder = builder;
        });
        afterEach(function() {
          pkg.latex.builder = builder_;
          return helper.restoreConfigs();
        });
        it('compile if current file is a .tex file', function() {
          var project;
          helper.setConfig('atom-latex.build_after_save', true);
          project = "" + (path.dirname(__filename)) + path.sep + "latex_project";
          return waitsForPromise(function() {
            return atom.workspace.open("" + project + path.sep + "input.tex").then(function(editor) {
              editor.save();
              return expect(builder.build).toHaveBeenCalled();
            });
          });
        });
        it('does nothing if config disabled', function() {
          var project;
          helper.setConfig('atom-latex.build_after_save', false);
          project = "" + (path.dirname(__filename)) + path.sep + "latex_project";
          return waitsForPromise(function() {
            return atom.workspace.open("" + project + path.sep + "input.tex").then(function(editor) {
              editor.save();
              return expect(builder.build).not.toHaveBeenCalled();
            });
          });
        });
        return it('does nothing if current file is not a .tex file', function() {
          var project;
          helper.setConfig('atom-latex.build_after_save', true);
          project = "" + (path.dirname(__filename)) + path.sep + "latex_project";
          return waitsForPromise(function() {
            return atom.workspace.open("" + project + path.sep + "dummy.file").then(function(editor) {
              editor.save();
              return expect(builder.build).not.toHaveBeenCalled();
            });
          });
        });
      });
      describe('toolchain feature', function() {
        var binCheck, binCheck_;
        binCheck = binCheck_ = void 0;
        beforeEach(function() {
          binCheck_ = pkg.latex.builder.binCheck;
          return spyOn(pkg.latex.builder, 'binCheck');
        });
        afterEach(function() {
          pkg.latex.builder.binCheck = binCheck_;
          return helper.restoreConfigs();
        });
        it('generates latexmk command when enabled auto', function() {
          helper.setConfig('atom-latex.toolchain', 'auto');
          helper.unsetConfig('atom-latex.latexmk_param');
          pkg.latex.builder.binCheck.andReturn(true);
          pkg.latex.builder.setCmds();
          return expect(pkg.latex.builder.cmds[0]).toBe('latexmk -synctex=1 -interaction=nonstopmode -file-line-error -pdf main');
        });
        it('generates custom command when enabled auto but without binary', function() {
          helper.setConfig('atom-latex.toolchain', 'auto');
          helper.unsetConfig('atom-latex.compiler');
          helper.unsetConfig('atom-latex.bibtex');
          helper.unsetConfig('atom-latex.compiler_param');
          helper.unsetConfig('atom-latex.custom_toolchain');
          pkg.latex.builder.binCheck.andReturn(false);
          pkg.latex.builder.setCmds();
          expect(pkg.latex.builder.cmds[0]).toBe('pdflatex -synctex=1 -interaction=nonstopmode -file-line-error main');
          return expect(pkg.latex.builder.cmds[1]).toBe('bibtex main');
        });
        it('generates latexmk command when enabled latexmk toolchain', function() {
          helper.setConfig('atom-latex.toolchain', 'latexmk toolchain');
          helper.unsetConfig('atom-latex.latexmk_param');
          pkg.latex.builder.binCheck.andReturn(true);
          pkg.latex.builder.setCmds();
          return expect(pkg.latex.builder.cmds[0]).toBe('latexmk -synctex=1 -interaction=nonstopmode -file-line-error -pdf main');
        });
        return it('generates custom command when enabled custom toolchain', function() {
          helper.setConfig('atom-latex.toolchain', 'custom toolchain');
          helper.unsetConfig('atom-latex.compiler');
          helper.unsetConfig('atom-latex.bibtex');
          helper.unsetConfig('atom-latex.compiler_param');
          helper.unsetConfig('atom-latex.custom_toolchain');
          pkg.latex.builder.binCheck.andReturn(false);
          pkg.latex.builder.setCmds();
          expect(pkg.latex.builder.cmds[0]).toBe('pdflatex -synctex=1 -interaction=nonstopmode -file-line-error main');
          return expect(pkg.latex.builder.cmds[1]).toBe('bibtex main');
        });
      });
      return describe('::build', function() {
        var execCmd, execCmd_, open, open_;
        execCmd = execCmd_ = open = open_ = void 0;
        beforeEach(function() {
          var stdout;
          open = jasmine.createSpy('open');
          stdout = jasmine.createSpy('stdout');
          execCmd = jasmine.createSpy('execCmd').andCallFake(function(cmd, cwd, fn) {
            fn();
            return {
              stdout: {
                on: function(data, fn) {
                  return stdout(data, fn);
                }
              }
            };
          });
          open_ = pkg.latex.viewer.openViewerNewWindow;
          pkg.latex.viewer.openViewerNewWindow = open;
          execCmd_ = pkg.latex.builder.execCmd;
          return pkg.latex.builder.execCmd = execCmd;
        });
        afterEach(function() {
          pkg.latex.viewer.openViewerNewWindow = open_;
          pkg.latex.builder.execCmd = execCmd_;
          return helper.restoreConfigs();
        });
        it('should execute all commands sequentially', function() {
          helper.setConfig('atom-latex.toolchain', 'custom toolchain');
          helper.unsetConfig('atom-latex.compiler');
          helper.unsetConfig('atom-latex.bibtex');
          helper.unsetConfig('atom-latex.compiler_param');
          helper.unsetConfig('atom-latex.custom_toolchain');
          helper.setConfig('atom-latex.preview_after_build', false);
          pkg.latex.builder.build();
          expect(execCmd.callCount).toBe(4);
          return expect(open).not.toHaveBeenCalled();
        });
        return it('should open preview when ready if enabled', function() {
          helper.setConfig('atom-latex.toolchain', 'custom toolchain');
          helper.unsetConfig('atom-latex.compiler');
          helper.unsetConfig('atom-latex.bibtex');
          helper.unsetConfig('atom-latex.compiler_param');
          helper.unsetConfig('atom-latex.custom_toolchain');
          helper.setConfig('atom-latex.preview_after_build', true);
          pkg.latex.builder.build();
          return expect(open).toHaveBeenCalled();
        });
      });
    });
    return describe('Manager', function() {
      describe('::fileMain', function() {
        it('should return false when no main file exists in project root', function() {
          var project, result;
          pkg.latex.mainFile = void 0;
          project = "" + (path.dirname(__filename));
          atom.project.setPaths([project]);
          result = pkg.latex.manager.findMain();
          expect(result).toBe(false);
          return expect(pkg.latex.mainFile).toBe(void 0);
        });
        return it('should set main file full path when it exists in project root', function() {
          var project, relative, result;
          pkg.latex.mainFile = void 0;
          project = "" + (path.dirname(__filename)) + path.sep + "latex_project";
          atom.project.setPaths([project]);
          result = pkg.latex.manager.findMain();
          relative = path.relative(project, pkg.latex.mainFile);
          expect(result).toBe(true);
          return expect(pkg.latex.mainFile).toBe("" + project + path.sep + "main.tex");
        });
      });
      return describe('::findAll', function() {
        return it('should return all input files recursively', function() {
          var project, result;
          project = "" + (path.dirname(__filename)) + path.sep + "latex_project";
          atom.project.setPaths([project]);
          pkg.latex.mainFile = "" + project + path.sep + "main.tex";
          result = pkg.latex.manager.findAll();
          expect(pkg.latex.texFiles.length).toBe(2);
          return expect(pkg.latex.bibFiles.length).toBe(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvc3BlYy9tYWluLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsR0FBQSxHQUFNLE9BQUEsQ0FBUSxhQUFSOztFQUNOLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFHVCxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBO0lBQ3JCLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBO0FBQ2QsZUFBTyxNQUFNLENBQUMsZ0JBQVAsQ0FBQTtNQURPLENBQWhCO0lBRFMsQ0FBWDtJQUlBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUE7YUFDbEIsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUE7ZUFDbkMsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUE7VUFDL0IsTUFBQSxDQUFPLEdBQUcsQ0FBQyxLQUFYLENBQWlCLENBQUMsV0FBbEIsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQWpCLENBQXlCLENBQUMsV0FBMUIsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQWpCLENBQXlCLENBQUMsV0FBMUIsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWpCLENBQXdCLENBQUMsV0FBekIsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWpCLENBQXdCLENBQUMsV0FBekIsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQWpCLENBQXVCLENBQUMsV0FBeEIsQ0FBQTtpQkFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFqQixDQUF3QixDQUFDLFdBQXpCLENB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cGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5wa2cgPSByZXF1aXJlICcuLi9saWIvbWFpbidcbmhlbHBlciA9IHJlcXVpcmUgJy4vaGVscGVyJ1xuXG5cbmRlc2NyaWJlICdBdG9tLUxhVGVYJywgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgcmV0dXJuIGhlbHBlci5hY3RpdmF0ZVBhY2thZ2VzKClcblxuICBkZXNjcmliZSAnUGFja2FnZScsIC0+XG4gICAgZGVzY3JpYmUgJ3doZW4gcGFja2FnZSBpbml0aWFsaXplZCcsIC0+XG4gICAgICBpdCAnaGFzIEF0b20tTGFUZVggbWFpbiBvYmplY3QnLCAtPlxuICAgICAgICBleHBlY3QocGtnLmxhdGV4KS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChwa2cubGF0ZXguYnVpbGRlcikudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocGtnLmxhdGV4Lm1hbmFnZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHBrZy5sYXRleC52aWV3ZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHBrZy5sYXRleC5zZXJ2ZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHBrZy5sYXRleC5wYW5lbCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocGtnLmxhdGV4LnBhcnNlcikudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlICdCdWlsZGVyJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBwcm9qZWN0ID0gXCJcIlwiI3twYXRoLmRpcm5hbWUoX19maWxlbmFtZSl9I3twYXRoLnNlcH1sYXRleF9wcm9qZWN0XCJcIlwiXG4gICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMgW3Byb2plY3RdXG4gICAgICBwa2cubGF0ZXgubWFpbkZpbGUgPSBcIlwiXCIje3Byb2plY3R9I3twYXRoLnNlcH1tYWluLnRleFwiXCJcIlxuXG4gICAgZGVzY3JpYmUgJ2J1aWxkLWFmdGVyLXNhdmUgZmVhdHVyZScsIC0+XG4gICAgICBidWlsZGVyID0gYnVpbGRlcl8gPSB1bmRlZmluZWRcblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBidWlsZGVyID0gamFzbWluZS5jcmVhdGVTcHlPYmogJ0J1aWxkZXInLCBbJ2J1aWxkJ11cbiAgICAgICAgYnVpbGRlcl8gPSBwa2cubGF0ZXguYnVpbGRlclxuICAgICAgICBwa2cubGF0ZXguYnVpbGRlciA9IGJ1aWxkZXJcblxuICAgICAgYWZ0ZXJFYWNoIC0+XG4gICAgICAgIHBrZy5sYXRleC5idWlsZGVyID0gYnVpbGRlcl9cbiAgICAgICAgaGVscGVyLnJlc3RvcmVDb25maWdzKClcblxuICAgICAgaXQgJ2NvbXBpbGUgaWYgY3VycmVudCBmaWxlIGlzIGEgLnRleCBmaWxlJywgLT5cbiAgICAgICAgaGVscGVyLnNldENvbmZpZyAnYXRvbS1sYXRleC5idWlsZF9hZnRlcl9zYXZlJywgdHJ1ZVxuICAgICAgICBwcm9qZWN0ID0gXCJcIlwiI3twYXRoLmRpcm5hbWUoX19maWxlbmFtZSl9I3twYXRoLnNlcH1sYXRleF9wcm9qZWN0XCJcIlwiXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFxuICAgICAgICAgIFwiXCJcIiN7cHJvamVjdH0je3BhdGguc2VwfWlucHV0LnRleFwiXCJcIikudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkZXIuYnVpbGQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCAnZG9lcyBub3RoaW5nIGlmIGNvbmZpZyBkaXNhYmxlZCcsIC0+XG4gICAgICAgIGhlbHBlci5zZXRDb25maWcgJ2F0b20tbGF0ZXguYnVpbGRfYWZ0ZXJfc2F2ZScsIGZhbHNlXG4gICAgICAgIHByb2plY3QgPSBcIlwiXCIje3BhdGguZGlybmFtZShfX2ZpbGVuYW1lKX0je3BhdGguc2VwfWxhdGV4X3Byb2plY3RcIlwiXCJcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXG4gICAgICAgICAgXCJcIlwiI3twcm9qZWN0fSN7cGF0aC5zZXB9aW5wdXQudGV4XCJcIlwiKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgICAgICBleHBlY3QoYnVpbGRlci5idWlsZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBpdCAnZG9lcyBub3RoaW5nIGlmIGN1cnJlbnQgZmlsZSBpcyBub3QgYSAudGV4IGZpbGUnLCAtPlxuICAgICAgICBoZWxwZXIuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmJ1aWxkX2FmdGVyX3NhdmUnLCB0cnVlXG4gICAgICAgIHByb2plY3QgPSBcIlwiXCIje3BhdGguZGlybmFtZShfX2ZpbGVuYW1lKX0je3BhdGguc2VwfWxhdGV4X3Byb2plY3RcIlwiXCJcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXG4gICAgICAgICAgXCJcIlwiI3twcm9qZWN0fSN7cGF0aC5zZXB9ZHVtbXkuZmlsZVwiXCJcIikudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgZXhwZWN0KGJ1aWxkZXIuYnVpbGQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGRlc2NyaWJlICd0b29sY2hhaW4gZmVhdHVyZScsIC0+XG4gICAgICBiaW5DaGVjayA9IGJpbkNoZWNrXyA9IHVuZGVmaW5lZFxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGJpbkNoZWNrXyA9IHBrZy5sYXRleC5idWlsZGVyLmJpbkNoZWNrXG4gICAgICAgIHNweU9uKHBrZy5sYXRleC5idWlsZGVyLCAnYmluQ2hlY2snKVxuXG4gICAgICBhZnRlckVhY2ggLT5cbiAgICAgICAgcGtnLmxhdGV4LmJ1aWxkZXIuYmluQ2hlY2sgPSBiaW5DaGVja19cbiAgICAgICAgaGVscGVyLnJlc3RvcmVDb25maWdzKClcblxuICAgICAgaXQgJ2dlbmVyYXRlcyBsYXRleG1rIGNvbW1hbmQgd2hlbiBlbmFibGVkIGF1dG8nLCAtPlxuICAgICAgICBoZWxwZXIuc2V0Q29uZmlnICdhdG9tLWxhdGV4LnRvb2xjaGFpbicsICdhdXRvJ1xuICAgICAgICBoZWxwZXIudW5zZXRDb25maWcgJ2F0b20tbGF0ZXgubGF0ZXhta19wYXJhbSdcbiAgICAgICAgcGtnLmxhdGV4LmJ1aWxkZXIuYmluQ2hlY2suYW5kUmV0dXJuKHRydWUpXG4gICAgICAgIHBrZy5sYXRleC5idWlsZGVyLnNldENtZHMoKVxuICAgICAgICBleHBlY3QocGtnLmxhdGV4LmJ1aWxkZXIuY21kc1swXSkudG9CZSgnbGF0ZXhtayAtc3luY3RleD0xIFxcXG4gICAgICAgICAgLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlIC1maWxlLWxpbmUtZXJyb3IgLXBkZiBtYWluJylcblxuICAgICAgaXQgJ2dlbmVyYXRlcyBjdXN0b20gY29tbWFuZCB3aGVuIGVuYWJsZWQgYXV0byBidXQgd2l0aG91dCBiaW5hcnknLCAtPlxuICAgICAgICBoZWxwZXIuc2V0Q29uZmlnICdhdG9tLWxhdGV4LnRvb2xjaGFpbicsICdhdXRvJ1xuICAgICAgICBoZWxwZXIudW5zZXRDb25maWcgJ2F0b20tbGF0ZXguY29tcGlsZXInXG4gICAgICAgIGhlbHBlci51bnNldENvbmZpZyAnYXRvbS1sYXRleC5iaWJ0ZXgnXG4gICAgICAgIGhlbHBlci51bnNldENvbmZpZyAnYXRvbS1sYXRleC5jb21waWxlcl9wYXJhbSdcbiAgICAgICAgaGVscGVyLnVuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmN1c3RvbV90b29sY2hhaW4nXG4gICAgICAgIHBrZy5sYXRleC5idWlsZGVyLmJpbkNoZWNrLmFuZFJldHVybihmYWxzZSlcbiAgICAgICAgcGtnLmxhdGV4LmJ1aWxkZXIuc2V0Q21kcygpXG4gICAgICAgIGV4cGVjdChwa2cubGF0ZXguYnVpbGRlci5jbWRzWzBdKS50b0JlKCdwZGZsYXRleCAtc3luY3RleD0xIFxcXG4gICAgICAgICAgLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlIC1maWxlLWxpbmUtZXJyb3IgbWFpbicpXG4gICAgICAgIGV4cGVjdChwa2cubGF0ZXguYnVpbGRlci5jbWRzWzFdKS50b0JlKCdiaWJ0ZXggbWFpbicpXG5cbiAgICAgIGl0ICdnZW5lcmF0ZXMgbGF0ZXhtayBjb21tYW5kIHdoZW4gZW5hYmxlZCBsYXRleG1rIHRvb2xjaGFpbicsIC0+XG4gICAgICAgIGhlbHBlci5zZXRDb25maWcgJ2F0b20tbGF0ZXgudG9vbGNoYWluJywgJ2xhdGV4bWsgdG9vbGNoYWluJ1xuICAgICAgICBoZWxwZXIudW5zZXRDb25maWcgJ2F0b20tbGF0ZXgubGF0ZXhta19wYXJhbSdcbiAgICAgICAgcGtnLmxhdGV4LmJ1aWxkZXIuYmluQ2hlY2suYW5kUmV0dXJuKHRydWUpXG4gICAgICAgIHBrZy5sYXRleC5idWlsZGVyLnNldENtZHMoKVxuICAgICAgICBleHBlY3QocGtnLmxhdGV4LmJ1aWxkZXIuY21kc1swXSkudG9CZSgnbGF0ZXhtayAtc3luY3RleD0xIFxcXG4gICAgICAgICAgLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlIC1maWxlLWxpbmUtZXJyb3IgLXBkZiBtYWluJylcblxuICAgICAgaXQgJ2dlbmVyYXRlcyBjdXN0b20gY29tbWFuZCB3aGVuIGVuYWJsZWQgY3VzdG9tIHRvb2xjaGFpbicsIC0+XG4gICAgICAgIGhlbHBlci5zZXRDb25maWcgJ2F0b20tbGF0ZXgudG9vbGNoYWluJywgJ2N1c3RvbSB0b29sY2hhaW4nXG4gICAgICAgIGhlbHBlci51bnNldENvbmZpZyAnYXRvbS1sYXRleC5jb21waWxlcidcbiAgICAgICAgaGVscGVyLnVuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmJpYnRleCdcbiAgICAgICAgaGVscGVyLnVuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmNvbXBpbGVyX3BhcmFtJ1xuICAgICAgICBoZWxwZXIudW5zZXRDb25maWcgJ2F0b20tbGF0ZXguY3VzdG9tX3Rvb2xjaGFpbidcbiAgICAgICAgcGtnLmxhdGV4LmJ1aWxkZXIuYmluQ2hlY2suYW5kUmV0dXJuKGZhbHNlKVxuICAgICAgICBwa2cubGF0ZXguYnVpbGRlci5zZXRDbWRzKClcbiAgICAgICAgZXhwZWN0KHBrZy5sYXRleC5idWlsZGVyLmNtZHNbMF0pLnRvQmUoJ3BkZmxhdGV4IC1zeW5jdGV4PTEgXFxcbiAgICAgICAgICAtaW50ZXJhY3Rpb249bm9uc3RvcG1vZGUgLWZpbGUtbGluZS1lcnJvciBtYWluJylcbiAgICAgICAgZXhwZWN0KHBrZy5sYXRleC5idWlsZGVyLmNtZHNbMV0pLnRvQmUoJ2JpYnRleCBtYWluJylcblxuICAgIGRlc2NyaWJlICc6OmJ1aWxkJywgLT5cbiAgICAgIGV4ZWNDbWQgPSBleGVjQ21kXyA9IG9wZW4gPSBvcGVuXyA9IHVuZGVmaW5lZFxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIG9wZW4gPSBqYXNtaW5lLmNyZWF0ZVNweSgnb3BlbicpXG4gICAgICAgIHN0ZG91dCA9IGphc21pbmUuY3JlYXRlU3B5KCdzdGRvdXQnKVxuICAgICAgICBleGVjQ21kID0gamFzbWluZS5jcmVhdGVTcHkoJ2V4ZWNDbWQnKS5hbmRDYWxsRmFrZSgoY21kLCBjd2QsIGZuKSAtPlxuICAgICAgICAgIGZuKClcbiAgICAgICAgICByZXR1cm4gc3Rkb3V0OlxuICAgICAgICAgICAgb246IChkYXRhLCBmbikgLT5cbiAgICAgICAgICAgICAgc3Rkb3V0KGRhdGEsIGZuKVxuICAgICAgICApXG4gICAgICAgIG9wZW5fID0gcGtnLmxhdGV4LnZpZXdlci5vcGVuVmlld2VyTmV3V2luZG93XG4gICAgICAgIHBrZy5sYXRleC52aWV3ZXIub3BlblZpZXdlck5ld1dpbmRvdyA9IG9wZW5cbiAgICAgICAgZXhlY0NtZF8gPSBwa2cubGF0ZXguYnVpbGRlci5leGVjQ21kXG4gICAgICAgIHBrZy5sYXRleC5idWlsZGVyLmV4ZWNDbWQgPSBleGVjQ21kXG5cbiAgICAgIGFmdGVyRWFjaCAtPlxuICAgICAgICBwa2cubGF0ZXgudmlld2VyLm9wZW5WaWV3ZXJOZXdXaW5kb3cgPSBvcGVuX1xuICAgICAgICBwa2cubGF0ZXguYnVpbGRlci5leGVjQ21kID0gZXhlY0NtZF9cbiAgICAgICAgaGVscGVyLnJlc3RvcmVDb25maWdzKClcblxuICAgICAgaXQgJ3Nob3VsZCBleGVjdXRlIGFsbCBjb21tYW5kcyBzZXF1ZW50aWFsbHknLCAtPlxuICAgICAgICBoZWxwZXIuc2V0Q29uZmlnICdhdG9tLWxhdGV4LnRvb2xjaGFpbicsICdjdXN0b20gdG9vbGNoYWluJ1xuICAgICAgICBoZWxwZXIudW5zZXRDb25maWcgJ2F0b20tbGF0ZXguY29tcGlsZXInXG4gICAgICAgIGhlbHBlci51bnNldENvbmZpZyAnYXRvbS1sYXRleC5iaWJ0ZXgnXG4gICAgICAgIGhlbHBlci51bnNldENvbmZpZyAnYXRvbS1sYXRleC5jb21waWxlcl9wYXJhbSdcbiAgICAgICAgaGVscGVyLnVuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmN1c3RvbV90b29sY2hhaW4nXG4gICAgICAgIGhlbHBlci5zZXRDb25maWcgJ2F0b20tbGF0ZXgucHJldmlld19hZnRlcl9idWlsZCcsIGZhbHNlXG4gICAgICAgIHBrZy5sYXRleC5idWlsZGVyLmJ1aWxkKClcbiAgICAgICAgZXhwZWN0KGV4ZWNDbWQuY2FsbENvdW50KS50b0JlKDQpXG4gICAgICAgIGV4cGVjdChvcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0ICdzaG91bGQgb3BlbiBwcmV2aWV3IHdoZW4gcmVhZHkgaWYgZW5hYmxlZCcsIC0+XG4gICAgICAgIGhlbHBlci5zZXRDb25maWcgJ2F0b20tbGF0ZXgudG9vbGNoYWluJywgJ2N1c3RvbSB0b29sY2hhaW4nXG4gICAgICAgIGhlbHBlci51bnNldENvbmZpZyAnYXRvbS1sYXRleC5jb21waWxlcidcbiAgICAgICAgaGVscGVyLnVuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmJpYnRleCdcbiAgICAgICAgaGVscGVyLnVuc2V0Q29uZmlnICdhdG9tLWxhdGV4LmNvbXBpbGVyX3BhcmFtJ1xuICAgICAgICBoZWxwZXIudW5zZXRDb25maWcgJ2F0b20tbGF0ZXguY3VzdG9tX3Rvb2xjaGFpbidcbiAgICAgICAgaGVscGVyLnNldENvbmZpZyAnYXRvbS1sYXRleC5wcmV2aWV3X2FmdGVyX2J1aWxkJywgdHJ1ZVxuICAgICAgICBwa2cubGF0ZXguYnVpbGRlci5idWlsZCgpXG4gICAgICAgIGV4cGVjdChvcGVuKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSAnTWFuYWdlcicsIC0+XG4gICAgZGVzY3JpYmUgJzo6ZmlsZU1haW4nLCAtPlxuICAgICAgaXQgJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBubyBtYWluIGZpbGUgZXhpc3RzIGluIHByb2plY3Qgcm9vdCcsIC0+XG4gICAgICAgIHBrZy5sYXRleC5tYWluRmlsZSA9IHVuZGVmaW5lZFxuICAgICAgICBwcm9qZWN0ID0gXCJcIlwiI3twYXRoLmRpcm5hbWUoX19maWxlbmFtZSl9XCJcIlwiXG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbcHJvamVjdF1cbiAgICAgICAgcmVzdWx0ID0gcGtnLmxhdGV4Lm1hbmFnZXIuZmluZE1haW4oKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlKGZhbHNlKVxuICAgICAgICBleHBlY3QocGtnLmxhdGV4Lm1haW5GaWxlKS50b0JlKHVuZGVmaW5lZClcblxuICAgICAgaXQgJ3Nob3VsZCBzZXQgbWFpbiBmaWxlIGZ1bGwgcGF0aCB3aGVuIGl0IGV4aXN0cyBpbiBwcm9qZWN0IHJvb3QnLCAtPlxuICAgICAgICBwa2cubGF0ZXgubWFpbkZpbGUgPSB1bmRlZmluZWRcbiAgICAgICAgcHJvamVjdCA9IFwiXCJcIiN7cGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpfSN7cGF0aC5zZXB9bGF0ZXhfcHJvamVjdFwiXCJcIlxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMgW3Byb2plY3RdXG4gICAgICAgIHJlc3VsdCA9IHBrZy5sYXRleC5tYW5hZ2VyLmZpbmRNYWluKClcbiAgICAgICAgcmVsYXRpdmUgPSBwYXRoLnJlbGF0aXZlKHByb2plY3QsIHBrZy5sYXRleC5tYWluRmlsZSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QocGtnLmxhdGV4Lm1haW5GaWxlKS50b0JlKFwiXCJcIiN7cHJvamVjdH0je3BhdGguc2VwfW1haW4udGV4XCJcIlwiKVxuXG4gICAgZGVzY3JpYmUgJzo6ZmluZEFsbCcsIC0+XG4gICAgICBpdCAnc2hvdWxkIHJldHVybiBhbGwgaW5wdXQgZmlsZXMgcmVjdXJzaXZlbHknLCAtPlxuICAgICAgICBwcm9qZWN0ID0gXCJcIlwiI3twYXRoLmRpcm5hbWUoX19maWxlbmFtZSl9I3twYXRoLnNlcH1sYXRleF9wcm9qZWN0XCJcIlwiXG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbcHJvamVjdF1cbiAgICAgICAgcGtnLmxhdGV4Lm1haW5GaWxlID0gXCJcIlwiI3twcm9qZWN0fSN7cGF0aC5zZXB9bWFpbi50ZXhcIlwiXCJcbiAgICAgICAgcmVzdWx0ID0gcGtnLmxhdGV4Lm1hbmFnZXIuZmluZEFsbCgpXG4gICAgICAgIGV4cGVjdChwa2cubGF0ZXgudGV4RmlsZXMubGVuZ3RoKS50b0JlKDIpXG4gICAgICAgIGV4cGVjdChwa2cubGF0ZXguYmliRmlsZXMubGVuZ3RoKS50b0JlKDApXG4iXX0=
