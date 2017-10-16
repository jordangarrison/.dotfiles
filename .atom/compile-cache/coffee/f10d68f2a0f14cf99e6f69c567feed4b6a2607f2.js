(function() {
  var Disposable, Manager, chokidar, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Disposable = require('atom').Disposable;

  fs = require('fs');

  path = require('path');

  chokidar = require('chokidar');

  module.exports = Manager = (function(superClass) {
    extend(Manager, superClass);

    function Manager(latex) {
      this.latex = latex;
      this.disable_watcher = atom.config.get("atom-latex.disable_watcher");
      this.watched = [];
    }

    Manager.prototype.rootDir = function() {
      var editor, ref, texEditors;
      texEditors = (function() {
        var i, len, ref, results;
        ref = atom.workspace.getTextEditors();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          editor = ref[i];
          if (editor.getGrammar().scopeName.match(/text.tex.latex/)) {
            results.push(editor);
          }
        }
        return results;
      })();
      if (ref = atom.workspace.getActiveTextEditor(), indexOf.call(texEditors, ref) >= 0) {
        return atom.project.relativizePath(atom.workspace.getActiveTextEditor().getPath())[0];
      } else if (texEditors.length > 0) {
        return atom.project.relativizePath(texEditors[0].getPath())[0];
      } else {
        this.latex.logger.log.push({
          type: status,
          text: "No active TeX editors were open - Setting Project: " + (atom.project.getPaths()[0])
        });
      }
      return atom.project.getPaths()[0];
    };

    Manager.prototype.loadLocalCfg = function() {
      var err, file, fileContent, filePath, i, len, ref, rootDir;
      if ((this.lastCfgTime != null) && Date.now() - this.lastCfgTime < 200 || (atom.workspace.getActiveTextEditor() == null)) {
        return this.config != null;
      }
      this.lastCfgTime = Date.now();
      rootDir = this.rootDir();
      ref = fs.readdirSync(rootDir);
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        if (file === '.latexcfg') {
          try {
            filePath = path.join(rootDir, file);
            fileContent = fs.readFileSync(filePath, 'utf-8');
            this.config = JSON.parse(fileContent);
            if (this.config.root != null) {
              this.config.root = path.resolve(rootDir, this.config.root);
            }
            return true;
          } catch (error) {
            err = error;
          }
        }
      }
      return false;
    };

    Manager.prototype.isTexFile = function(name) {
      var ref, ref1, ref2;
      this.latex.manager.loadLocalCfg();
      if (((ref = path.extname(name)) === '.tex' || ref === '.tikz') || ((ref1 = this.latex.manager.config) != null ? (ref2 = ref1.latex_ext) != null ? ref2.indexOf(path.extname(name)) : void 0 : void 0) > -1) {
        return true;
      }
      return false;
    };

    Manager.prototype.findMain = function(here) {
      var result;
      result = this.findMainSequence(here);
      if (!fs.existsSync(this.latex.mainFile)) {
        this.latex.logger.processError("Invalid LaTeX root file `" + (path.basename(this.latex.mainFile)) + "`", "The path " + this.latex.mainFile + " does not exist!", true, [
          {
            text: "Set LaTeX root",
            onDidClick: (function(_this) {
              return function() {
                _this.latex.manager.refindMain();
                return _this.latex.logger.clearBuildError();
              };
            })(this)
          }
        ]);
        return false;
      }
      this.latex.panel.view.update();
      return result;
    };

    Manager.prototype.refindMain = function() {
      var input;
      input = document.getElementById('atom-latex-root-input');
      input.onchange = ((function(_this) {
        return function() {
          if (input.files.length > 0) {
            _this.latex.mainFile = input.files[0].path;
          }
          return _this.latex.panel.view.update();
        };
      })(this));
      return input.click();
    };

    Manager.prototype.findMainSequence = function(here) {
      if (here) {
        if (this.findMainSelfMagic()) {
          return true;
        }
        if (this.findMainSelf()) {
          return true;
        }
      }
      if ((this.latex.mainFile != null) && atom.project.relativizePath(this.latex.mainFile)[0] === this.rootDir()) {
        return true;
      }
      if (this.findMainConfig()) {
        return true;
      }
      if (this.findMainSelfMagic()) {
        return true;
      }
      if (this.findMainSelf()) {
        return true;
      }
      if (this.findMainAllRoot()) {
        return true;
      }
      this.latex.logger.missingMain();
      return false;
    };

    Manager.prototype.findMainSelf = function() {
      var currentContent, currentPath, docRegex, editor, ref;
      docRegex = /\\begin{document}/;
      editor = atom.workspace.getActivePaneItem();
      currentPath = editor != null ? (ref = editor.buffer.file) != null ? ref.path : void 0 : void 0;
      currentContent = editor != null ? editor.getText() : void 0;
      if (currentPath && currentContent) {
        if (this.isTexFile(currentPath) && currentContent.match(docRegex)) {
          this.latex.mainFile = currentPath;
          this.latex.logger.setMain('self');
          return true;
        }
      }
      return false;
    };

    Manager.prototype.findMainSelfMagic = function() {
      var currentContent, currentPath, editor, magicRegex, ref, result;
      magicRegex = /(?:%\s*!TEX\sroot\s*=\s*([^\s]*\.tex)$)/m;
      editor = atom.workspace.getActivePaneItem();
      currentPath = editor != null ? (ref = editor.buffer.file) != null ? ref.path : void 0 : void 0;
      currentContent = editor != null ? editor.getText() : void 0;
      if (currentPath && currentContent) {
        if (this.isTexFile(currentPath)) {
          result = currentContent.match(magicRegex);
          if (result) {
            this.latex.mainFile = path.resolve(path.dirname(currentPath), result[1]);
            this.latex.logger.setMain('magic');
            return true;
          }
        }
      }
      return false;
    };

    Manager.prototype.findMainConfig = function() {
      var ref;
      this.loadLocalCfg();
      if ((ref = this.config) != null ? ref.root : void 0) {
        this.latex.mainFile = this.config.root;
        this.latex.logger.setMain('config');
        return true;
      }
      return false;
    };

    Manager.prototype.findMainAllRoot = function() {
      var docRegex, file, fileContent, filePath, i, j, len, len1, ref, ref1, rootDir;
      docRegex = /\\begin{document}/;
      ref = atom.project.getPaths();
      for (i = 0, len = ref.length; i < len; i++) {
        rootDir = ref[i];
        ref1 = fs.readdirSync(rootDir);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          file = ref1[j];
          if (!this.isTexFile(file)) {
            continue;
          }
          filePath = path.join(rootDir, file);
          fileContent = fs.readFileSync(filePath, 'utf-8');
          if (fileContent.match(docRegex)) {
            this.latex.mainFile = filePath;
            this.latex.logger.setMain('all');
            return true;
          }
        }
      }
      return false;
    };

    Manager.prototype.findPDF = function() {
      if (!this.findMain()) {
        return false;
      }
      return path.join(path.dirname(this.latex.mainFile), path.basename(this.latex.mainFile, '.tex') + '.pdf');
    };

    Manager.prototype.prevWatcherClosed = function(watcher, watchPath) {
      var watchedPaths;
      watchedPaths = watcher.getWatched();
      if (!(watchPath in watchedPaths)) {
        this.latex.provider.command.resetCommands();
        this.latex.provider.reference.resetRefItems();
        this.latex.provider.subFiles.resetFileItems();
        this.latex.provider.citation.resetBibItems();
        watcher.close();
        return true;
      } else {
        return false;
      }
    };

    Manager.prototype.watchRoot = function() {
      var ref, root, watchFileExts;
      root = this.rootDir();
      if ((this.rootWatcher == null) || this.prevWatcherClosed(this.rootWatcher, root)) {
        this.latex.logger.log.push({
          type: status,
          text: "Watching project " + root + " for changes"
        });
        watchFileExts = ['png', 'eps', 'jpeg', 'jpg', 'pdf', 'tex', 'bib'];
        if (((ref = this.latex.manager.config) != null ? ref.latex_ext : void 0) != null) {
          watchFileExts.push.apply(watchFileExts, this.latex.manager.config.latex_ext);
        }
        this.rootWatcher = chokidar.watch(root, {
          ignored: RegExp("(|[\\/\\\\])\\.(?!" + (watchFileExts.join("|").replace(/\./g, '')) + ")", "g")
        });
        this.watched.push(root);
        console.time('RootWatcher Init');
        this.rootWatcher.on('add', (function(_this) {
          return function(fpath) {
            _this.watchActions(fpath, 'add');
          };
        })(this));
        this.rootWatcher.on('ready', (function(_this) {
          return function() {
            _this.rootWatcher.on('change', function(fpath, stats) {
              if (_this.isTexFile(fpath)) {
                if (fpath === _this.latex.mainFile) {
                  _this.latex.texFiles = [_this.latex.mainFile];
                  _this.latex.bibFiles = [];
                  _this.findDependentFiles(_this.latex.mainFile);
                }
                _this.watchActions(fpath);
              }
            });
            return _this.rootWatcher.on('unlink', function(fpath) {
              _this.watchActions(fpath, 'unlink');
            });
          };
        })(this));
        console.timeEnd('RootWatcher Init');
        return true;
      }
      return false;
    };

    Manager.prototype.watchActions = function(fpath, event) {
      if (event === 'add') {
        this.latex.provider.subFiles.getFileItems(fpath);
      } else if (event === 'unlink') {
        this.latex.provider.subFiles.resetFileItems(fpath);
        this.latex.provider.reference.resetRefItems(fpath);
      }
      if (this.isTexFile(fpath)) {
        this.latex.provider.command.getCommands(fpath);
        return this.latex.provider.reference.getRefItems(fpath);
      }
    };

    Manager.prototype.findAll = function() {
      var file, i, len, ref;
      if (!this.findMain()) {
        return false;
      }
      if (this.disable_watcher || this.watchRoot()) {
        this.latex.texFiles = [this.latex.mainFile];
        this.latex.bibFiles = [];
        this.findDependentFiles(this.latex.mainFile);
        if (this.disable_watcher) {
          ref = this.latex.texFiles;
          for (i = 0, len = ref.length; i < len; i++) {
            file = ref[i];
            this.watchActions(file, 'add');
          }
        }
      }
      return true;
    };

    Manager.prototype.findDependentFiles = function(file) {
      var baseDir, bib, bibReg, bibs, content, filePath, fpath, i, inputFile, inputReg, j, len, len1, ref, result;
      content = fs.readFileSync(file, 'utf-8');
      baseDir = path.dirname(this.latex.mainFile);
      inputReg = /(?:\\(?:input|include|subfile)(?:\[[^\[\]\{\}]*\])?){([^}]*)}/g;
      while (true) {
        result = inputReg.exec(content);
        if (result == null) {
          break;
        }
        inputFile = result[1];
        if (path.extname(inputFile) === '') {
          inputFile += '.tex';
        }
        filePath = path.resolve(path.join(baseDir, inputFile));
        if (this.latex.texFiles.indexOf(filePath) < 0 && fs.existsSync(filePath)) {
          this.latex.texFiles.push(filePath);
          this.findDependentFiles(filePath);
        }
      }
      bibReg = /(?:\\(?:bibliography|addbibresource)(?:\[[^\[\]\{\}]*\])?){(.+?)}/g;
      while (true) {
        result = bibReg.exec(content);
        if (result == null) {
          break;
        }
        bibs = result[1].split(',').map(function(bib) {
          return bib.trim();
        });
        for (i = 0, len = bibs.length; i < len; i++) {
          bib = bibs[i];
          this.addBibToWatcher(bib);
        }
      }
      ref = this.watched;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        fpath = ref[j];
        if ((fpath != null) && indexOf.call(this.latex.bibFiles, fpath) < 0 && !(fpath.indexOf('.bib') < 0)) {
          this.latex.provider.citation.resetBibItems(fpath);
          this.bibWatcher.unwatch(fpath);
          this.watched.splice(this.watched.indexOf(fpath), 1);
        }
      }
      return true;
    };

    Manager.prototype.addBibToWatcher = function(bib) {
      if (path.extname(bib) === '') {
        bib += '.bib';
      }
      bib = path.resolve(path.join(path.dirname(this.latex.mainFile), bib));
      if (this.latex.bibFiles.indexOf(bib) < 0) {
        this.latex.bibFiles.push(bib);
      }
      if (this.disable_watcher) {
        this.latex.provider.citation.getBibItems(bib);
        return;
      }
      if ((this.bibWatcher == null) || this.bibWatcher.closed) {
        this.bibWatcher = chokidar.watch(bib);
        this.watched.push(bib);
        this.bibWatcher.on('add', (function(_this) {
          return function(fpath) {
            _this.latex.provider.citation.getBibItems(fpath);
          };
        })(this));
        this.bibWatcher.on('change', (function(_this) {
          return function(fpath) {
            _this.latex.provider.citation.getBibItems(fpath);
          };
        })(this));
        return this.bibWatcher.on('unlink', (function(_this) {
          return function(fpath) {
            _this.latex.provider.citation.resetBibItems(fpath);
            _this.bibWatcher.unwatch(fpath);
            _this.watched.splice(_this.watched.indexOf(fpath), 1);
          };
        })(this));
      } else if (indexOf.call(this.watched, bib) < 0) {
        this.bibWatcher.add(bib);
        return this.watched.push(bib);
      }
    };

    return Manager;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL21hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MsaUJBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCO01BQ25CLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFIQTs7c0JBSWIsT0FBQSxHQUFTLFNBQUE7QUFFUCxVQUFBO01BQUEsVUFBQTs7QUFBYztBQUFBO2FBQUEscUNBQUE7O2NBQ08sTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUE5QixDQUFvQyxnQkFBcEM7eUJBRFA7O0FBQUE7OztNQUVkLFVBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQUEsRUFBQSxhQUF3QyxVQUF4QyxFQUFBLEdBQUEsTUFBSDtBQUNFLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUEsQ0FBNUIsQ0FBNEUsQ0FBQSxDQUFBLEVBRHJGO09BQUEsTUFFSyxJQUFHLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQXZCO0FBQ0gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsVUFBVyxDQUFBLENBQUEsQ0FBRSxDQUFD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QU8sQ0FBQyxPQUFULENBQWlCLEtBQWpCLENBQWhCLEVBQXdDLENBQXhDO1VBSnVCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixFQXBCRjtPQUFBLE1BMEJLLElBQUcsYUFBVyxJQUFDLENBQUEsT0FBWixFQUFBLEdBQUEsS0FBSDtRQUVILElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixHQUFoQjtlQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLEdBQWQsRUFIRzs7SUFwQ1U7Ozs7S0EzUEc7QUFOdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jaG9raWRhciA9IHJlcXVpcmUgJ2Nob2tpZGFyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNYW5hZ2VyIGV4dGVuZHMgRGlzcG9zYWJsZVxuICBjb25zdHJ1Y3RvcjogKGxhdGV4KSAtPlxuICAgIEBsYXRleCA9IGxhdGV4XG4gICAgQGRpc2FibGVfd2F0Y2hlciA9IGF0b20uY29uZmlnLmdldCBcImF0b20tbGF0ZXguZGlzYWJsZV93YXRjaGVyXCJcbiAgICBAd2F0Y2hlZCA9IFtdXG4gIHJvb3REaXI6IC0+XG4gICAgIyBDb2xsZWN0IGFsbCBvcGVuIFRleHRFZGl0b3JzIHdpdGggTGFUZVggZ3JhbW1hclxuICAgIHRleEVkaXRvcnMgPSAoZWRpdG9yIGZvciBlZGl0b3IgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxcXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2goL3RleHQudGV4LmxhdGV4LykpXG4gICAgaWYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpIGluIHRleEVkaXRvcnMgIyBBbiBhY3RpdmUgVGVYZWRpdG9yIGlzIG9wZW5cbiAgICAgIHJldHVybiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSlbMF1cbiAgICBlbHNlIGlmIHRleEVkaXRvcnMubGVuZ3RoID4gMCAgICMgRmlyc3Qgb3BlbiBlZGl0b3Igd2l0aCBMYVRlWCBncmFtbWFyXG4gICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHRleEVkaXRvcnNbMF0uZ2V0UGF0aCgpKVswXVxuICAgIGVsc2UgIyBiYWNrdXAsIHJldHVybiBmaXJzdCBhY3RpdmUgcHJvamVjdFxuICAgICAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoIHtcbiAgICAgICAgICB0eXBlOiBzdGF0dXNcbiAgICAgICAgICB0ZXh0OiBcIk5vIGFjdGl2ZSBUZVggZWRpdG9ycyB3ZXJlIG9wZW4gLSBTZXR0aW5nIFByb2plY3Q6ICN7YXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF19XCJcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgbG9hZExvY2FsQ2ZnOiAtPlxuICAgIGlmIEBsYXN0Q2ZnVGltZT8gYW5kIERhdGUubm93KCkgLSBAbGFzdENmZ1RpbWUgPCAyMDAgb3JcXFxuICAgICAgICFhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/XG4gICAgICByZXR1cm4gQGNvbmZpZz9cbiAgICBAbGFzdENmZ1RpbWUgPSBEYXRlLm5vdygpXG4gICAgcm9vdERpciA9IEByb290RGlyKClcbiAgICBmb3IgZmlsZSBpbiBmcy5yZWFkZGlyU3luYyByb290RGlyXG4gICAgICBpZiBmaWxlIGlzICcubGF0ZXhjZmcnXG4gICAgICAgIHRyeVxuICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luIHJvb3REaXIsIGZpbGVcbiAgICAgICAgICBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyBmaWxlUGF0aCwgJ3V0Zi04J1xuICAgICAgICAgIEBjb25maWcgPSBKU09OLnBhcnNlIGZpbGVDb250ZW50XG4gICAgICAgICAgaWYgQGNvbmZpZy5yb290P1xuICAgICAgICAgICAgQGNvbmZpZy5yb290ID0gcGF0aC5yZXNvbHZlIHJvb3REaXIsIEBjb25maWcucm9vdFxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGNhdGNoIGVyclxuICAgIHJldHVybiBmYWxzZVxuXG4gIGlzVGV4RmlsZTogKG5hbWUpIC0+XG4gICAgQGxhdGV4Lm1hbmFnZXIubG9hZExvY2FsQ2ZnKClcbiAgICBpZiBwYXRoLmV4dG5hbWUobmFtZSkgaW4gWycudGV4JywnLnRpa3onXSBvciBcXFxuICAgICAgICBAbGF0ZXgubWFuYWdlci5jb25maWc/LmxhdGV4X2V4dD8uaW5kZXhPZihwYXRoLmV4dG5hbWUobmFtZSkpID4gLTFcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZE1haW46IChoZXJlKSAtPlxuICAgIHJlc3VsdCA9IEBmaW5kTWFpblNlcXVlbmNlKGhlcmUpXG4gICAgaWYgIWZzLmV4aXN0c1N5bmMoQGxhdGV4Lm1haW5GaWxlKVxuICAgICAgQGxhdGV4LmxvZ2dlci5wcm9jZXNzRXJyb3IoXG4gICAgICAgIFwiSW52YWxpZCBMYVRlWCByb290IGZpbGUgYCN7cGF0aC5iYXNlbmFtZShAbGF0ZXgubWFpbkZpbGUpfWBcIixcbiAgICAgICAgXCJUaGUgcGF0aCAje0BsYXRleC5tYWluRmlsZX0gZG9lcyBub3QgZXhpc3QhXCIsIHRydWUsXG4gICAgICAgIFt7XG4gICAgICAgICAgdGV4dDogXCJTZXQgTGFUZVggcm9vdFwiXG4gICAgICAgICAgb25EaWRDbGljazogPT5cbiAgICAgICAgICAgIEBsYXRleC5tYW5hZ2VyLnJlZmluZE1haW4oKVxuICAgICAgICAgICAgQGxhdGV4LmxvZ2dlci5jbGVhckJ1aWxkRXJyb3IoKVxuICAgICAgICB9XSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIEBsYXRleC5wYW5lbC52aWV3LnVwZGF0ZSgpXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIHJlZmluZE1haW46ICgpIC0+XG4gICAgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXRvbS1sYXRleC1yb290LWlucHV0JylcbiAgICBpbnB1dC5vbmNoYW5nZSA9ICg9PlxuICAgICAgaWYgaW5wdXQuZmlsZXMubGVuZ3RoID4gMFxuICAgICAgICBAbGF0ZXgubWFpbkZpbGUgPSBpbnB1dC5maWxlc1swXS5wYXRoXG4gICAgICBAbGF0ZXgucGFuZWwudmlldy51cGRhdGUoKVxuICAgIClcbiAgICBpbnB1dC5jbGljaygpXG5cbiAgZmluZE1haW5TZXF1ZW5jZTogKGhlcmUpIC0+XG4gICAgaWYgaGVyZVxuICAgICAgcmV0dXJuIHRydWUgaWYgQGZpbmRNYWluU2VsZk1hZ2ljKClcbiAgICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpblNlbGYoKVxuXG4gICAgIyBDaGVjayBpZiB0aGUgbWFpbkZpbGUgaXMgcGFydCBvZiB0aGUgY3VyZW50IHByb2plY3QgcGF0aFxuICAgIGlmIEBsYXRleC5tYWluRmlsZT8gYW5kIGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChAbGF0ZXgubWFpbkZpbGUpWzBdID09IEByb290RGlyKClcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gdHJ1ZSBpZiBAZmluZE1haW5Db25maWcoKVxuICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpblNlbGZNYWdpYygpXG4gICAgcmV0dXJuIHRydWUgaWYgQGZpbmRNYWluU2VsZigpXG4gICAgcmV0dXJuIHRydWUgaWYgQGZpbmRNYWluQWxsUm9vdCgpXG5cbiAgICBAbGF0ZXgubG9nZ2VyLm1pc3NpbmdNYWluKClcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kTWFpblNlbGY6IC0+XG4gICAgZG9jUmVnZXggPSAvXFxcXGJlZ2lue2RvY3VtZW50fS9cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY3VycmVudFBhdGggPSBlZGl0b3I/LmJ1ZmZlci5maWxlPy5wYXRoXG4gICAgY3VycmVudENvbnRlbnQgPSBlZGl0b3I/LmdldFRleHQoKVxuXG4gICAgaWYgY3VycmVudFBhdGggYW5kIGN1cnJlbnRDb250ZW50XG4gICAgICBpZiBAaXNUZXhGaWxlKGN1cnJlbnRQYXRoKSBhbmQgY3VycmVudENvbnRlbnQubWF0Y2goZG9jUmVnZXgpXG4gICAgICAgIEBsYXRleC5tYWluRmlsZSA9IGN1cnJlbnRQYXRoXG4gICAgICAgIEBsYXRleC5sb2dnZXIuc2V0TWFpbignc2VsZicpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZE1haW5TZWxmTWFnaWM6IC0+XG4gICAgbWFnaWNSZWdleCA9IC8oPzolXFxzKiFURVhcXHNyb290XFxzKj1cXHMqKFteXFxzXSpcXC50ZXgpJCkvbVxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBjdXJyZW50UGF0aCA9IGVkaXRvcj8uYnVmZmVyLmZpbGU/LnBhdGhcbiAgICBjdXJyZW50Q29udGVudCA9IGVkaXRvcj8uZ2V0VGV4dCgpXG5cbiAgICBpZiBjdXJyZW50UGF0aCBhbmQgY3VycmVudENvbnRlbnRcbiAgICAgIGlmIEBpc1RleEZpbGUoY3VycmVudFBhdGgpXG4gICAgICAgIHJlc3VsdCA9IGN1cnJlbnRDb250ZW50Lm1hdGNoIG1hZ2ljUmVnZXhcbiAgICAgICAgaWYgcmVzdWx0XG4gICAgICAgICAgQGxhdGV4Lm1haW5GaWxlID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShjdXJyZW50UGF0aCksIHJlc3VsdFsxXSlcbiAgICAgICAgICBAbGF0ZXgubG9nZ2VyLnNldE1haW4oJ21hZ2ljJylcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGZpbmRNYWluQ29uZmlnOiAtPlxuICAgIEBsb2FkTG9jYWxDZmcoKVxuICAgIGlmIEBjb25maWc/LnJvb3RcbiAgICAgIEBsYXRleC5tYWluRmlsZSA9IEBjb25maWcucm9vdFxuICAgICAgQGxhdGV4LmxvZ2dlci5zZXRNYWluKCdjb25maWcnKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kTWFpbkFsbFJvb3Q6IC0+XG4gICAgZG9jUmVnZXggPSAvXFxcXGJlZ2lue2RvY3VtZW50fS9cbiAgICBmb3Igcm9vdERpciBpbiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgZm9yIGZpbGUgaW4gZnMucmVhZGRpclN5bmMgcm9vdERpclxuICAgICAgICBjb250aW51ZSBpZiAhQGlzVGV4RmlsZShmaWxlKVxuICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbiByb290RGlyLCBmaWxlXG4gICAgICAgIGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jIGZpbGVQYXRoLCAndXRmLTgnXG4gICAgICAgIGlmIGZpbGVDb250ZW50Lm1hdGNoIGRvY1JlZ2V4XG4gICAgICAgICAgQGxhdGV4Lm1haW5GaWxlID0gZmlsZVBhdGhcbiAgICAgICAgICBAbGF0ZXgubG9nZ2VyLnNldE1haW4oJ2FsbCcpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kUERGOiAtPlxuICAgIGlmICFAZmluZE1haW4oKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHBhdGguam9pbihcbiAgICAgIHBhdGguZGlybmFtZShAbGF0ZXgubWFpbkZpbGUpLFxuICAgICAgcGF0aC5iYXNlbmFtZShAbGF0ZXgubWFpbkZpbGUsICcudGV4JykgKyAnLnBkZicpXG5cbiAgcHJldldhdGNoZXJDbG9zZWQ6ICh3YXRjaGVyLCB3YXRjaFBhdGgpIC0+XG4gICAgd2F0Y2hlZFBhdGhzID0gd2F0Y2hlci5nZXRXYXRjaGVkKClcbiAgICBpZiAhKCB3YXRjaFBhdGggb2Ygd2F0Y2hlZFBhdGhzKVxuICAgICAgIyByb290V2F0Y2hlciBleGlzdHMsIGJ1dCBwcm9qZWN0IGRpciBoYXMgYmVlbiBjaGFuZ2VkXG4gICAgICAjIGFuZCByZXNldCBhbGwgc3VnZ2VzdGlvbnMgYW5kIGNsb3NlIHdhdGNoZXJcbiAgICAgIEBsYXRleC5wcm92aWRlci5jb21tYW5kLnJlc2V0Q29tbWFuZHMoKVxuICAgICAgQGxhdGV4LnByb3ZpZGVyLnJlZmVyZW5jZS5yZXNldFJlZkl0ZW1zKClcbiAgICAgIEBsYXRleC5wcm92aWRlci5zdWJGaWxlcy5yZXNldEZpbGVJdGVtcygpXG4gICAgICBAbGF0ZXgucHJvdmlkZXIuY2l0YXRpb24ucmVzZXRCaWJJdGVtcygpXG4gICAgICB3YXRjaGVyLmNsb3NlKClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgd2F0Y2hSb290OiAtPlxuICAgIHJvb3QgPSBAcm9vdERpcigpXG4gICAgaWYgIUByb290V2F0Y2hlcj8gb3IgQHByZXZXYXRjaGVyQ2xvc2VkKEByb290V2F0Y2hlcixyb290KVxuICAgICAgQGxhdGV4LmxvZ2dlci5sb2cucHVzaCB7XG4gICAgICAgIHR5cGU6IHN0YXR1c1xuICAgICAgICB0ZXh0OiBcIldhdGNoaW5nIHByb2plY3QgI3tyb290fSBmb3IgY2hhbmdlc1wiXG4gICAgICB9XG4gICAgICB3YXRjaEZpbGVFeHRzID0gWydwbmcnLCdlcHMnLCdqcGVnJywnanBnJywncGRmJywndGV4JywnYmliJ11cbiAgICAgIGlmIEBsYXRleC5tYW5hZ2VyLmNvbmZpZz8ubGF0ZXhfZXh0P1xuICAgICAgICB3YXRjaEZpbGVFeHRzLnB1c2ggQGxhdGV4Lm1hbmFnZXIuY29uZmlnLmxhdGV4X2V4dC4uLlxuICAgICAgQHJvb3RXYXRjaGVyID0gY2hva2lkYXIud2F0Y2gocm9vdCx7XG4gICAgICAgIGlnbm9yZWQ6IC8vLyh8W1xcL1xcXFxdKVxcLig/ISN7d2F0Y2hGaWxlRXh0cy5qb2luKFwifFwiKS5yZXBsYWNlKC9cXC4vZywnJyl9KS8vL2dcbiAgICAgICAgfSlcbiAgICAgIEB3YXRjaGVkLnB1c2gocm9vdClcbiAgICAgIGNvbnNvbGUudGltZSgnUm9vdFdhdGNoZXIgSW5pdCcpXG4gICAgICBAcm9vdFdhdGNoZXIub24oJ2FkZCcsKGZwYXRoKT0+XG4gICAgICAgIEB3YXRjaEFjdGlvbnMoZnBhdGgsJ2FkZCcpXG4gICAgICAgIHJldHVybilcbiAgICAgIEByb290V2F0Y2hlci5vbigncmVhZHknLFxuICAgICAgKCkgPT5cbiAgICAgICAgQHJvb3RXYXRjaGVyLm9uKCdjaGFuZ2UnLCAoZnBhdGgsc3RhdHMpID0+XG4gICAgICAgICAgaWYgQGlzVGV4RmlsZShmcGF0aClcbiAgICAgICAgICAgIGlmIGZwYXRoID09IEBsYXRleC5tYWluRmlsZVxuICAgICAgICAgICAgICAjIFVwZGF0ZSBkZXBlbmRlbnQgZmlsZXNcbiAgICAgICAgICAgICAgQGxhdGV4LnRleEZpbGVzID0gWyBAbGF0ZXgubWFpbkZpbGUgXVxuICAgICAgICAgICAgICBAbGF0ZXguYmliRmlsZXMgPSBbXVxuICAgICAgICAgICAgICBAZmluZERlcGVuZGVudEZpbGVzKEBsYXRleC5tYWluRmlsZSlcbiAgICAgICAgICAgIEB3YXRjaEFjdGlvbnMoZnBhdGgpXG4gICAgICAgICAgcmV0dXJuKVxuICAgICAgICBAcm9vdFdhdGNoZXIub24oJ3VubGluaycsKGZwYXRoKSA9PlxuICAgICAgICAgIEB3YXRjaEFjdGlvbnMoZnBhdGgsJ3VubGluaycpXG4gICAgICAgICAgcmV0dXJuKVxuICAgICAgKVxuICAgICAgY29uc29sZS50aW1lRW5kKCdSb290V2F0Y2hlciBJbml0JylcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICB3YXRjaEFjdGlvbnM6IChmcGF0aCxldmVudCkgLT5cbiAgICAjIFB1c2gvU3BsaWNlIGZpbGUgc3VnZ2VzdGlvbnMgb24gbmV3IGZpbGUgYWRkaXRpb25zIG9yIHJlbW92YWxzXG4gICAgaWYgZXZlbnQgaXMgJ2FkZCdcbiAgICAgIEBsYXRleC5wcm92aWRlci5zdWJGaWxlcy5nZXRGaWxlSXRlbXMoZnBhdGgpXG4gICAgZWxzZSBpZiBldmVudCBpcyAndW5saW5rJ1xuICAgICAgQGxhdGV4LnByb3ZpZGVyLnN1YkZpbGVzLiByZXNldEZpbGVJdGVtcyhmcGF0aCkgXG4gICAgICBAbGF0ZXgucHJvdmlkZXIucmVmZXJlbmNlLnJlc2V0UmVmSXRlbXMoZnBhdGgpXG4gICAgaWYgQGlzVGV4RmlsZShmcGF0aClcbiAgICAgICMgUHVzaCBjb21tYW5kIGFuZCByZWZlcmVuY2VzIHN1Z2dlc3Rpb25zXG4gICAgICBAbGF0ZXgucHJvdmlkZXIuY29tbWFuZC5nZXRDb21tYW5kcyhmcGF0aClcbiAgICAgIEBsYXRleC5wcm92aWRlci5yZWZlcmVuY2UuZ2V0UmVmSXRlbXMoZnBhdGgpXG5cbiAgZmluZEFsbDogLT5cbiAgICBpZiAhQGZpbmRNYWluKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIEBkaXNhYmxlX3dhdGNoZXIgb3IgQHdhdGNoUm9vdCgpXG4gICAgICBAbGF0ZXgudGV4RmlsZXMgPSBbIEBsYXRleC5tYWluRmlsZSBdXG4gICAgICBAbGF0ZXguYmliRmlsZXMgPSBbXVxuICAgICAgQGZpbmREZXBlbmRlbnRGaWxlcyhAbGF0ZXgubWFpbkZpbGUpXG4gICAgICBpZiBAZGlzYWJsZV93YXRjaGVyXG4gICAgICAgIEB3YXRjaEFjdGlvbnMoZmlsZSwnYWRkJykgZm9yIGZpbGUgaW4gQGxhdGV4LnRleEZpbGVzXG4gICAgcmV0dXJuIHRydWVcblxuICBmaW5kRGVwZW5kZW50RmlsZXM6IChmaWxlKSAtPlxuICAgIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMgZmlsZSwgJ3V0Zi04J1xuICAgIGJhc2VEaXIgPSBwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKVxuXG4gICAgaW5wdXRSZWcgPSAvKD86XFxcXCg/OmlucHV0fGluY2x1ZGV8c3ViZmlsZSkoPzpcXFtbXlxcW1xcXVxce1xcfV0qXFxdKT8peyhbXn1dKil9L2dcbiAgICBsb29wXG4gICAgICByZXN1bHQgPSBpbnB1dFJlZy5leGVjIGNvbnRlbnRcbiAgICAgIGJyZWFrIGlmICFyZXN1bHQ/XG4gICAgICBpbnB1dEZpbGUgPSByZXN1bHRbMV1cbiAgICAgIGlmIHBhdGguZXh0bmFtZShpbnB1dEZpbGUpIGlzICcnXG4gICAgICAgIGlucHV0RmlsZSArPSAnLnRleCdcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihiYXNlRGlyLCBpbnB1dEZpbGUpKVxuICAgICAgaWYgQGxhdGV4LnRleEZpbGVzLmluZGV4T2YoZmlsZVBhdGgpIDwgMCBhbmQgZnMuZXhpc3RzU3luYyhmaWxlUGF0aClcbiAgICAgICAgQGxhdGV4LnRleEZpbGVzLnB1c2goZmlsZVBhdGgpXG4gICAgICAgIEBmaW5kRGVwZW5kZW50RmlsZXMoZmlsZVBhdGgpXG5cbiAgICBiaWJSZWcgPSAvKD86XFxcXCg/OmJpYmxpb2dyYXBoeXxhZGRiaWJyZXNvdXJjZSkoPzpcXFtbXlxcW1xcXVxce1xcfV0qXFxdKT8peyguKz8pfS9nXG4gICAgbG9vcFxuICAgICAgcmVzdWx0ID0gYmliUmVnLmV4ZWMgY29udGVudFxuICAgICAgYnJlYWsgaWYgIXJlc3VsdD9cbiAgICAgIGJpYnMgPSByZXN1bHRbMV0uc3BsaXQoJywnKS5tYXAoKGJpYikgLT4gYmliLnRyaW0oKSlcbiAgICAgIEBhZGRCaWJUb1dhdGNoZXIoYmliKSBmb3IgYmliIGluIGJpYnNcblxuICAgICMgUmVzZXQgQ2l0YXRpb25zXG4gICAgZm9yIGZwYXRoIGluIEB3YXRjaGVkXG4gICAgICAjIFRoZSByYWNlIGlzIG9uIGIvdyB0aGlzIHRlc3QgYW5kIHNldHRpbmcgdXAgYmliV2F0Y2hlciwgaGVuY2UgdGhlIGZpcnN0IGNoZWNrXG4gICAgICBpZiBmcGF0aD8gYW5kIGZwYXRoIG5vdCBpbiBAbGF0ZXguYmliRmlsZXMgYW5kICEoZnBhdGguaW5kZXhPZignLmJpYicpIDwgMClcbiAgICAgICAgIyBiaWIgZmlsZSByZW1vdmVkLCByZW1vdmUgY2l0YXRpb24gc3VnZ2VzdGlvbnMgYW5kIHVud2F0Y2hcbiAgICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLnJlc2V0QmliSXRlbXMoZnBhdGgpXG4gICAgICAgIEBiaWJXYXRjaGVyLnVud2F0Y2goZnBhdGgpXG4gICAgICAgIEB3YXRjaGVkLnNwbGljZShAd2F0Y2hlZC5pbmRleE9mKGZwYXRoKSwxKVxuICAgIHJldHVybiB0cnVlXG5cbiAgYWRkQmliVG9XYXRjaGVyOiAoYmliKSAtPlxuICAgIGlmIHBhdGguZXh0bmFtZShiaWIpIGlzICcnXG4gICAgICBiaWIgKz0gJy5iaWInXG4gICAgYmliID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKSxiaWIpKVxuICAgIGlmIEBsYXRleC5iaWJGaWxlcy5pbmRleE9mKGJpYikgPCAwXG4gICAgICBAbGF0ZXguYmliRmlsZXMucHVzaChiaWIpXG4gICAgaWYgQGRpc2FibGVfd2F0Y2hlclxuICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLmdldEJpYkl0ZW1zKGJpYilcbiAgICAgIHJldHVyblxuICAgICMgSW5pdCBiaWJXYXRjaGVyIGxpc3RlbmVyc1xuICAgIGlmICFAYmliV2F0Y2hlcj8gb3IgQGJpYldhdGNoZXIuY2xvc2VkXG4gICAgICBAYmliV2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGJpYilcbiAgICAgIEB3YXRjaGVkLnB1c2goYmliKVxuICAgICAgIyBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoIHtcbiAgICAgICMgICB0eXBlOiBzdGF0dXNcbiAgICAgICMgICB0ZXh0OiBcIldhdGNoaW5nIGJpYiBmaWxlICN7YmlifSBmb3IgY2hhbmdlc1wiXG4gICAgICAjIH1cbiAgICAgICMgUmVnaXN0ZXIgd2F0Y2hlciBjYWxsYmFja3NcbiAgICAgIEBiaWJXYXRjaGVyLm9uKCdhZGQnLCAoZnBhdGgpID0+XG4gICAgICAgICMgYmliIGZpbGUgYWRkZWQsIHBhcnNlXG4gICAgICAgIEBsYXRleC5wcm92aWRlci5jaXRhdGlvbi5nZXRCaWJJdGVtcyhmcGF0aClcbiAgICAgICAgIyBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoIHtcbiAgICAgICAgIyAgIHR5cGU6IHN0YXR1c1xuICAgICAgICAjICAgdGV4dDogXCJBZGRlZCBiaWIgZmlsZSAje2ZwYXRofSB0byBXYXRjaGVyXCJcbiAgICAgICAgIyB9XG4gICAgICAgIHJldHVybilcbiAgICAgIEBiaWJXYXRjaGVyLm9uKCdjaGFuZ2UnLCAoZnBhdGgpID0+XG4gICAgICAgICMgYmliIGZpbGUgY2hhbmdlZCwgcmVwYXJzZVxuICAgICAgICBAbGF0ZXgucHJvdmlkZXIuY2l0YXRpb24uZ2V0QmliSXRlbXMoZnBhdGgpXG4gICAgICAgIHJldHVybilcbiAgICAgIEBiaWJXYXRjaGVyLm9uKCd1bmxpbmsnLCAoZnBhdGgpID0+XG4gICAgICAgICMgYmliIGZpbGUgZGVsZXRlZCwgcmVtb3ZlIGNpdGF0aW9uIHN1Z2dlc3Rpb25zIGFuZCB1bndhdGNoXG4gICAgICAgIEBsYXRleC5wcm92aWRlci5jaXRhdGlvbi5yZXNldEJpYkl0ZW1zKGZwYXRoKVxuICAgICAgICBAYmliV2F0Y2hlci51bndhdGNoKGZwYXRoKVxuICAgICAgICBAd2F0Y2hlZC5zcGxpY2UoQHdhdGNoZWQuaW5kZXhPZihmcGF0aCksMSlcbiAgICAgICAgcmV0dXJuKVxuICAgIGVsc2UgaWYgYmliIG5vdCBpbiBAd2F0Y2hlZFxuICAgICAgIyBQcm9jZXNzIG5ldyB1bndhdGNoZWQgYmliIGZpbGVcbiAgICAgIEBiaWJXYXRjaGVyLmFkZChiaWIpXG4gICAgICBAd2F0Y2hlZC5wdXNoKGJpYilcbiJdfQ==
