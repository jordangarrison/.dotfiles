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
    }

    Manager.prototype.rootDir = function() {
      var editor, texEditors;
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
      if (atom.workspace.getActiveTextEditor() != null) {
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
      var ref, ref1;
      this.latex.manager.loadLocalCfg();
      if (path.extname(name) === '.tex' || ((ref = this.latex.manager.config) != null ? (ref1 = ref.latex_ext) != null ? ref1.indexOf(path.extname(name)) : void 0 : void 0) > -1) {
        return true;
      }
      return false;
    };

    Manager.prototype.findMain = function(here) {
      var result;
      result = this.findMainSequence(here);
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
      if ((watcher != null) && !(watchPath in watchedPaths)) {
        this.latex.provider.command.resetCommands();
        this.latex.provider.reference.resetRefItems();
        this.latex.provider.subFiles.resetFileItems();
        watcher.close();
        return true;
      } else {
        return false;
      }
    };

    Manager.prototype.watchRoot = function() {
      var ref, watchFileExts;
      if ((this.rootWatcher == null) || this.prevWatcherClosed(this.rootWatcher, this.rootDir())) {
        this.latex.logger.log.push({
          type: status,
          text: "Watching project " + (this.rootDir()) + " for changes"
        });
        watchFileExts = ['png', 'eps', 'jpeg', 'jpg', 'pdf', 'tex'];
        if (((ref = this.latex.manager.config) != null ? ref.latex_ext : void 0) != null) {
          watchFileExts.push.apply(watchFileExts, this.latex.manager.config.latex_ext);
        }
        this.rootWatcher = chokidar.watch(this.rootDir(), {
          ignored: RegExp("(|[\\/\\\\])\\.(?!" + (watchFileExts.join("|").replace(/\./g, '')) + ")", "g")
        });
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
        this.latex.provider.subFiles.getFileItems(fpath, !this.isTexFile(fpath));
      } else if (event === 'unlink') {
        this.latex.provider.subFiles.getFileItems(fpath, false, true);
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
      var baseDir, bibReg, bibs, content, filePath, inputFile, inputReg, paths, result;
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
        paths = bibs.map((function(_this) {
          return function(bib) {
            if (path.extname(bib) === '') {
              bib += '.bib';
            }
            bib = path.resolve(path.join(baseDir, bib));
            if (_this.latex.bibFiles.indexOf(bib) < 0) {
              _this.latex.bibFiles.push(bib);
            }
            if (_this.disable_watcher) {
              return _this.latex.provider.citation.getBibItems(bib);
            } else if ((_this.bibWatcher == null) || _this.prevBibWatcherClosed(_this.bibWatcher, bib)) {
              _this.bibWatcher = chokidar.watch(bib);
              _this.bibWatcher.on('add', function(fpath) {
                _this.latex.provider.citation.getBibItems(fpath);
              });
              _this.bibWatcher.on('change', function(fpath) {
                _this.latex.provider.citation.getBibItems(fpath);
              });
              return _this.bibWatcher.on('unlink', function(fpath) {
                _this.latex.provider.citation.resetBibItems(fpath);
              });
            }
          };
        })(this));
      }
      return true;
    };

    Manager.prototype.prevBibWatcherClosed = function(watcher, watchPath) {
      var ref, watchedPaths;
      watchedPaths = watcher.getWatched();
      if ((watcher != null) && ((watchedPaths[path.dirname(watchPath)] == null) || (ref = path.basename(watchPath), indexOf.call(watchedPaths[path.dirname(watchPath)], ref) < 0))) {
        watcher.close();
        return true;
      } else {
        return false;
      }
    };

    return Manager;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL21hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MsaUJBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCO0lBRlI7O3NCQUliLE9BQUEsR0FBUyxTQUFBO0FBRVAsVUFBQTtNQUFBLFVBQUE7O0FBQWM7QUFBQTthQUFBLHFDQUFBOztjQUNPLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFTLENBQUMsS0FBOUIsQ0FBb0MsZ0JBQXBDO3lCQURQOztBQUFBOzs7TUFFZCxJQUFHLDRDQUFIO0FBQ0UsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsT0FBckMsQ0FBQSxDQUE1QixDQUE0RSxDQUFBLENBQUEsRUFEckY7T0FBQSxNQUVLLElBQUcsVUFBVSxDQUFDLE1BQVgsR0FBb0IsQ0FBdkI7QUFDSCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBZCxDQUFBLENBQTVCLENBQXFELENBQUEsQ0FBQSxFQUR6RDtPQUFBLE1BQUE7UUFHRCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFH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RlQ7T0FBQSxNQUFBO0FBSUUsZUFBTyxNQUpUOztJQUZtQjs7OztLQTNQRDtBQU50QiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmNob2tpZGFyID0gcmVxdWlyZSAnY2hva2lkYXInXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1hbmFnZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcbiAgICBAZGlzYWJsZV93YXRjaGVyID0gYXRvbS5jb25maWcuZ2V0IFwiYXRvbS1sYXRleC5kaXNhYmxlX3dhdGNoZXJcIlxuXG4gIHJvb3REaXI6IC0+XG4gICAgIyBDb2xsZWN0IGFsbCBvcGVuIFRleHRFZGl0b3JzIHdpdGggIExhVGVYIGdyYW1tYXJcbiAgICB0ZXhFZGl0b3JzID0gKGVkaXRvciBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcXFxuICAgICAgICAgICAgICAgICAgICB3aGVuIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLm1hdGNoKC90ZXh0LnRleC5sYXRleC8pKVxuICAgIGlmIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8gIyBBbiBhY3RpdmUgZWRpdG9yIGlzIG9wZW5cbiAgICAgIHJldHVybiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSlbMF1cbiAgICBlbHNlIGlmIHRleEVkaXRvcnMubGVuZ3RoID4gMCAgICMgRmlyc3Qgb3BlbiBlZGl0b3Igd2l0aCBMYVRlWCBncmFtbWFyXG4gICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHRleEVkaXRvcnNbMF0uZ2V0UGF0aCgpKVswXVxuICAgIGVsc2UgIyBiYWNrdXAsIHJldHVybiBmaXJzdCBhY3RpdmUgcHJvamVjdFxuICAgICAgICBAbGF0ZXgubG9nZ2VyLmxvZy5wdXNoIHtcbiAgICAgICAgICB0eXBlOiBzdGF0dXNcbiAgICAgICAgICB0ZXh0OiBcIk5vIGFjdGl2ZSBUZVggZWRpdG9ycyB3ZXJlIG9wZW4gLSBTZXR0aW5nIFByb2plY3Q6ICN7YXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF19XCJcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgbG9hZExvY2FsQ2ZnOiAtPlxuICAgIGlmIEBsYXN0Q2ZnVGltZT8gYW5kIERhdGUubm93KCkgLSBAbGFzdENmZ1RpbWUgPCAyMDAgb3JcXFxuICAgICAgICFhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/XG4gICAgICByZXR1cm4gQGNvbmZpZz9cbiAgICBAbGFzdENmZ1RpbWUgPSBEYXRlLm5vdygpXG4gICAgcm9vdERpciA9IEByb290RGlyKClcbiAgICBmb3IgZmlsZSBpbiBmcy5yZWFkZGlyU3luYyByb290RGlyXG4gICAgICBpZiBmaWxlIGlzICcubGF0ZXhjZmcnXG4gICAgICAgIHRyeVxuICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luIHJvb3REaXIsIGZpbGVcbiAgICAgICAgICBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyBmaWxlUGF0aCwgJ3V0Zi04J1xuICAgICAgICAgIEBjb25maWcgPSBKU09OLnBhcnNlIGZpbGVDb250ZW50XG4gICAgICAgICAgaWYgQGNvbmZpZy5yb290P1xuICAgICAgICAgICAgQGNvbmZpZy5yb290ID0gcGF0aC5yZXNvbHZlIHJvb3REaXIsIEBjb25maWcucm9vdFxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGNhdGNoIGVyclxuICAgIHJldHVybiBmYWxzZVxuXG4gIGlzVGV4RmlsZTogKG5hbWUpIC0+XG4gICAgQGxhdGV4Lm1hbmFnZXIubG9hZExvY2FsQ2ZnKClcbiAgICBpZiBwYXRoLmV4dG5hbWUobmFtZSkgPT0gJy50ZXgnIG9yIFxcXG4gICAgICAgIEBsYXRleC5tYW5hZ2VyLmNvbmZpZz8ubGF0ZXhfZXh0Py5pbmRleE9mKHBhdGguZXh0bmFtZShuYW1lKSkgPiAtMVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kTWFpbjogKGhlcmUpIC0+XG4gICAgcmVzdWx0ID0gQGZpbmRNYWluU2VxdWVuY2UoaGVyZSlcbiAgICBAbGF0ZXgucGFuZWwudmlldy51cGRhdGUoKVxuICAgIHJldHVybiByZXN1bHRcblxuICByZWZpbmRNYWluOiAoKSAtPlxuICAgIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0b20tbGF0ZXgtcm9vdC1pbnB1dCcpXG4gICAgaW5wdXQub25jaGFuZ2UgPSAoPT5cbiAgICAgIGlmIGlucHV0LmZpbGVzLmxlbmd0aCA+IDBcbiAgICAgICAgQGxhdGV4Lm1haW5GaWxlID0gaW5wdXQuZmlsZXNbMF0ucGF0aFxuICAgICAgQGxhdGV4LnBhbmVsLnZpZXcudXBkYXRlKClcbiAgICApXG4gICAgaW5wdXQuY2xpY2soKVxuXG4gIGZpbmRNYWluU2VxdWVuY2U6IChoZXJlKSAtPlxuICAgIGlmIGhlcmVcbiAgICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpblNlbGZNYWdpYygpXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBAZmluZE1haW5TZWxmKClcblxuICAgICMgQ2hlY2sgaWYgdGhlIG1haW5GaWxlIGlzIHBhcnQgb2YgdGhlIGN1cmVudCBwcm9qZWN0IHBhdGhcbiAgICBpZiBAbGF0ZXgubWFpbkZpbGU/IGFuZCBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoQGxhdGV4Lm1haW5GaWxlKVswXSA9PSBAcm9vdERpcigpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIHRydWUgaWYgQGZpbmRNYWluQ29uZmlnKClcbiAgICByZXR1cm4gdHJ1ZSBpZiBAZmluZE1haW5TZWxmTWFnaWMoKVxuICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpblNlbGYoKVxuICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpbkFsbFJvb3QoKVxuXG4gICAgQGxhdGV4LmxvZ2dlci5taXNzaW5nTWFpbigpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZE1haW5TZWxmOiAtPlxuICAgIGRvY1JlZ2V4ID0gL1xcXFxiZWdpbntkb2N1bWVudH0vXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGN1cnJlbnRQYXRoID0gZWRpdG9yPy5idWZmZXIuZmlsZT8ucGF0aFxuICAgIGN1cnJlbnRDb250ZW50ID0gZWRpdG9yPy5nZXRUZXh0KClcblxuICAgIGlmIGN1cnJlbnRQYXRoIGFuZCBjdXJyZW50Q29udGVudFxuICAgICAgaWYgQGlzVGV4RmlsZShjdXJyZW50UGF0aCkgYW5kIGN1cnJlbnRDb250ZW50Lm1hdGNoKGRvY1JlZ2V4KVxuICAgICAgICBAbGF0ZXgubWFpbkZpbGUgPSBjdXJyZW50UGF0aFxuICAgICAgICBAbGF0ZXgubG9nZ2VyLnNldE1haW4oJ3NlbGYnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGZpbmRNYWluU2VsZk1hZ2ljOiAtPlxuICAgIG1hZ2ljUmVnZXggPSAvKD86JVxccyohVEVYXFxzcm9vdFxccyo9XFxzKihbXlxcc10qXFwudGV4KSQpL21cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY3VycmVudFBhdGggPSBlZGl0b3I/LmJ1ZmZlci5maWxlPy5wYXRoXG4gICAgY3VycmVudENvbnRlbnQgPSBlZGl0b3I/LmdldFRleHQoKVxuXG4gICAgaWYgY3VycmVudFBhdGggYW5kIGN1cnJlbnRDb250ZW50XG4gICAgICBpZiBAaXNUZXhGaWxlKGN1cnJlbnRQYXRoKVxuICAgICAgICByZXN1bHQgPSBjdXJyZW50Q29udGVudC5tYXRjaCBtYWdpY1JlZ2V4XG4gICAgICAgIGlmIHJlc3VsdFxuICAgICAgICAgIEBsYXRleC5tYWluRmlsZSA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoY3VycmVudFBhdGgpLCByZXN1bHRbMV0pXG4gICAgICAgICAgQGxhdGV4LmxvZ2dlci5zZXRNYWluKCdtYWdpYycpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kTWFpbkNvbmZpZzogLT5cbiAgICBAbG9hZExvY2FsQ2ZnKClcbiAgICBpZiBAY29uZmlnPy5yb290XG4gICAgICBAbGF0ZXgubWFpbkZpbGUgPSBAY29uZmlnLnJvb3RcbiAgICAgIEBsYXRleC5sb2dnZXIuc2V0TWFpbignY29uZmlnJylcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZE1haW5BbGxSb290OiAtPlxuICAgIGRvY1JlZ2V4ID0gL1xcXFxiZWdpbntkb2N1bWVudH0vXG4gICAgZm9yIHJvb3REaXIgaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICAgIGZvciBmaWxlIGluIGZzLnJlYWRkaXJTeW5jIHJvb3REaXJcbiAgICAgICAgY29udGludWUgaWYgIUBpc1RleEZpbGUoZmlsZSlcbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4gcm9vdERpciwgZmlsZVxuICAgICAgICBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyBmaWxlUGF0aCwgJ3V0Zi04J1xuICAgICAgICBpZiBmaWxlQ29udGVudC5tYXRjaCBkb2NSZWdleFxuICAgICAgICAgIEBsYXRleC5tYWluRmlsZSA9IGZpbGVQYXRoXG4gICAgICAgICAgQGxhdGV4LmxvZ2dlci5zZXRNYWluKCdhbGwnKVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZFBERjogLT5cbiAgICBpZiAhQGZpbmRNYWluKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBwYXRoLmpvaW4oXG4gICAgICBwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKSxcbiAgICAgIHBhdGguYmFzZW5hbWUoQGxhdGV4Lm1haW5GaWxlLCAnLnRleCcpICsgJy5wZGYnKVxuXG4gIHByZXZXYXRjaGVyQ2xvc2VkOiAod2F0Y2hlciwgd2F0Y2hQYXRoKSAtPlxuICAgIHdhdGNoZWRQYXRocyA9IHdhdGNoZXIuZ2V0V2F0Y2hlZCgpXG4gICAgaWYgd2F0Y2hlcj8gYW5kICEoIHdhdGNoUGF0aCBvZiB3YXRjaGVkUGF0aHMpXG4gICAgICAjIHJvb3RXYXRjaGVyIGV4aXN0cywgYnV0IHByb2plY3QgZGlyIGhhcyBiZWVuIGNoYW5nZWRcbiAgICAgICMgYW5kIHJlc2V0IGFsbCBzdWdnZXN0aW9ucyBhbmQgY2xvc2Ugd2F0Y2hlclxuICAgICAgQGxhdGV4LnByb3ZpZGVyLmNvbW1hbmQucmVzZXRDb21tYW5kcygpXG4gICAgICBAbGF0ZXgucHJvdmlkZXIucmVmZXJlbmNlLnJlc2V0UmVmSXRlbXMoKVxuICAgICAgQGxhdGV4LnByb3ZpZGVyLnN1YkZpbGVzLnJlc2V0RmlsZUl0ZW1zKClcbiAgICAgIHdhdGNoZXIuY2xvc2UoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2VcblxuICB3YXRjaFJvb3Q6IC0+XG4gICAgaWYgIUByb290V2F0Y2hlcj8gb3IgQHByZXZXYXRjaGVyQ2xvc2VkKEByb290V2F0Y2hlcixAcm9vdERpcigpKVxuICAgICAgQGxhdGV4LmxvZ2dlci5sb2cucHVzaCB7XG4gICAgICAgIHR5cGU6IHN0YXR1c1xuICAgICAgICB0ZXh0OiBcIldhdGNoaW5nIHByb2plY3QgI3tAcm9vdERpcigpfSBmb3IgY2hhbmdlc1wiXG4gICAgICB9XG4gICAgICB3YXRjaEZpbGVFeHRzID0gWydwbmcnLCdlcHMnLCdqcGVnJywnanBnJywncGRmJywndGV4J11cbiAgICAgIGlmIEBsYXRleC5tYW5hZ2VyLmNvbmZpZz8ubGF0ZXhfZXh0P1xuICAgICAgICB3YXRjaEZpbGVFeHRzLnB1c2ggQGxhdGV4Lm1hbmFnZXIuY29uZmlnLmxhdGV4X2V4dC4uLlxuICAgICAgQHJvb3RXYXRjaGVyID0gY2hva2lkYXIud2F0Y2goQHJvb3REaXIoKSx7XG4gICAgICAgIGlnbm9yZWQ6IC8vLyh8W1xcL1xcXFxdKVxcLig/ISN7d2F0Y2hGaWxlRXh0cy5qb2luKFwifFwiKS5yZXBsYWNlKC9cXC4vZywnJyl9KS8vL2dcbiAgICAgICAgfSlcbiAgICAgIGNvbnNvbGUudGltZSgnUm9vdFdhdGNoZXIgSW5pdCcpXG4gICAgICBAcm9vdFdhdGNoZXIub24oJ2FkZCcsKGZwYXRoKT0+XG4gICAgICAgIEB3YXRjaEFjdGlvbnMoZnBhdGgsJ2FkZCcpXG4gICAgICAgIHJldHVybilcbiAgICAgIEByb290V2F0Y2hlci5vbigncmVhZHknLFxuICAgICAgKCkgPT5cbiAgICAgICAgQHJvb3RXYXRjaGVyLm9uKCdjaGFuZ2UnLCAoZnBhdGgsc3RhdHMpID0+XG4gICAgICAgICAgaWYgQGlzVGV4RmlsZShmcGF0aClcbiAgICAgICAgICAgIGlmIGZwYXRoID09IEBsYXRleC5tYWluRmlsZVxuICAgICAgICAgICAgICAjIFVwZGF0ZSBkZXBlbmRlbnQgZmlsZXNcbiAgICAgICAgICAgICAgQGxhdGV4LnRleEZpbGVzID0gWyBAbGF0ZXgubWFpbkZpbGUgXVxuICAgICAgICAgICAgICBAbGF0ZXguYmliRmlsZXMgPSBbXVxuICAgICAgICAgICAgICBAZmluZERlcGVuZGVudEZpbGVzKEBsYXRleC5tYWluRmlsZSlcbiAgICAgICAgICAgIEB3YXRjaEFjdGlvbnMoZnBhdGgpXG4gICAgICAgICAgcmV0dXJuKVxuICAgICAgICBAcm9vdFdhdGNoZXIub24oJ3VubGluaycsKGZwYXRoKSA9PlxuICAgICAgICAgIEB3YXRjaEFjdGlvbnMoZnBhdGgsJ3VubGluaycpXG4gICAgICAgICAgcmV0dXJuKVxuICAgICAgKVxuICAgICAgY29uc29sZS50aW1lRW5kKCdSb290V2F0Y2hlciBJbml0JylcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICB3YXRjaEFjdGlvbnM6IChmcGF0aCxldmVudCkgLT5cbiAgICAjIFB1c2gvU3BsaWNlIGZpbGUgc3VnZ2VzdGlvbnMgb24gbmV3IGZpbGUgYWRkaXRpb25zIG9yIHJlbW92YWxzXG4gICAgaWYgZXZlbnQgaXMgJ2FkZCdcbiAgICAgIEBsYXRleC5wcm92aWRlci5zdWJGaWxlcy5nZXRGaWxlSXRlbXMoZnBhdGgsICFAaXNUZXhGaWxlKGZwYXRoKSlcbiAgICBlbHNlIGlmIGV2ZW50IGlzICd1bmxpbmsnXG4gICAgICBAbGF0ZXgucHJvdmlkZXIuc3ViRmlsZXMuZ2V0RmlsZUl0ZW1zKGZwYXRoLGZhbHNlLHRydWUpICMgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGZpbGUgdHlwZVxuICAgICAgQGxhdGV4LnByb3ZpZGVyLnJlZmVyZW5jZS5yZXNldFJlZkl0ZW1zKGZwYXRoKVxuICAgIGlmIEBpc1RleEZpbGUoZnBhdGgpXG4gICAgICAjIFB1c2ggY29tbWFuZCBhbmQgcmVmZXJlbmNlcyBzdWdnZXN0aW9uc1xuICAgICAgQGxhdGV4LnByb3ZpZGVyLmNvbW1hbmQuZ2V0Q29tbWFuZHMoZnBhdGgpXG4gICAgICBAbGF0ZXgucHJvdmlkZXIucmVmZXJlbmNlLmdldFJlZkl0ZW1zKGZwYXRoKVxuXG4gIGZpbmRBbGw6IC0+XG4gICAgaWYgIUBmaW5kTWFpbigpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBpZiBAZGlzYWJsZV93YXRjaGVyIG9yIEB3YXRjaFJvb3QoKVxuICAgICAgQGxhdGV4LnRleEZpbGVzID0gWyBAbGF0ZXgubWFpbkZpbGUgXVxuICAgICAgQGxhdGV4LmJpYkZpbGVzID0gW11cbiAgICAgIEBmaW5kRGVwZW5kZW50RmlsZXMoQGxhdGV4Lm1haW5GaWxlKVxuICAgICAgaWYgQGRpc2FibGVfd2F0Y2hlclxuICAgICAgICBAd2F0Y2hBY3Rpb25zKGZpbGUsJ2FkZCcpIGZvciBmaWxlIGluIEBsYXRleC50ZXhGaWxlc1xuICAgIHJldHVybiB0cnVlXG5cbiAgZmluZERlcGVuZGVudEZpbGVzOiAoZmlsZSkgLT5cbiAgICBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jIGZpbGUsICd1dGYtOCdcbiAgICBiYXNlRGlyID0gcGF0aC5kaXJuYW1lKEBsYXRleC5tYWluRmlsZSlcblxuICAgIGlucHV0UmVnID0gLyg/OlxcXFwoPzppbnB1dHxpbmNsdWRlfHN1YmZpbGUpKD86XFxbW15cXFtcXF1cXHtcXH1dKlxcXSk/KXsoW159XSopfS9nXG4gICAgbG9vcFxuICAgICAgcmVzdWx0ID0gaW5wdXRSZWcuZXhlYyBjb250ZW50XG4gICAgICBicmVhayBpZiAhcmVzdWx0P1xuICAgICAgaW5wdXRGaWxlID0gcmVzdWx0WzFdXG4gICAgICBpZiBwYXRoLmV4dG5hbWUoaW5wdXRGaWxlKSBpcyAnJ1xuICAgICAgICBpbnB1dEZpbGUgKz0gJy50ZXgnXG4gICAgICBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oYmFzZURpciwgaW5wdXRGaWxlKSlcbiAgICAgIGlmIEBsYXRleC50ZXhGaWxlcy5pbmRleE9mKGZpbGVQYXRoKSA8IDAgYW5kIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpXG4gICAgICAgIEBsYXRleC50ZXhGaWxlcy5wdXNoKGZpbGVQYXRoKVxuICAgICAgICBAZmluZERlcGVuZGVudEZpbGVzKGZpbGVQYXRoKVxuXG4gICAgYmliUmVnID0gLyg/OlxcXFwoPzpiaWJsaW9ncmFwaHl8YWRkYmlicmVzb3VyY2UpKD86XFxbW15cXFtcXF1cXHtcXH1dKlxcXSk/KXsoLis/KX0vZ1xuICAgIGxvb3BcbiAgICAgIHJlc3VsdCA9IGJpYlJlZy5leGVjIGNvbnRlbnRcbiAgICAgIGJyZWFrIGlmICFyZXN1bHQ/XG4gICAgICBiaWJzID0gcmVzdWx0WzFdLnNwbGl0KCcsJykubWFwKChiaWIpIC0+IGJpYi50cmltKCkpXG4gICAgICBwYXRocyA9IGJpYnMubWFwKChiaWIpID0+XG4gICAgICAgIGlmIHBhdGguZXh0bmFtZShiaWIpIGlzICcnXG4gICAgICAgICAgYmliICs9ICcuYmliJ1xuICAgICAgICBiaWIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKGJhc2VEaXIsIGJpYikpXG4gICAgICAgIGlmIEBsYXRleC5iaWJGaWxlcy5pbmRleE9mKGJpYikgPCAwXG4gICAgICAgICAgQGxhdGV4LmJpYkZpbGVzLnB1c2goYmliKVxuICAgICAgICBpZiBAZGlzYWJsZV93YXRjaGVyXG4gICAgICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLmdldEJpYkl0ZW1zKGJpYilcbiAgICAgICAgZWxzZSBpZiAhQGJpYldhdGNoZXI/IG9yIEBwcmV2QmliV2F0Y2hlckNsb3NlZChAYmliV2F0Y2hlcixiaWIpXG4gICAgICAgICAgQGJpYldhdGNoZXIgPSBjaG9raWRhci53YXRjaChiaWIpXG4gICAgICAgICAgIyBSZWdpc3RlciB3YXRjaGVyIGNhbGxiYWNrc1xuICAgICAgICAgIEBiaWJXYXRjaGVyLm9uKCdhZGQnLCAoZnBhdGgpID0+XG4gICAgICAgICAgICAjIGJpYiBmaWxlIGFkZGVkLCByZXBhcnNlXG4gICAgICAgICAgICBAbGF0ZXgucHJvdmlkZXIuY2l0YXRpb24uZ2V0QmliSXRlbXMoZnBhdGgpXG4gICAgICAgICAgICByZXR1cm4pXG4gICAgICAgICAgQGJpYldhdGNoZXIub24oJ2NoYW5nZScsIChmcGF0aCkgPT5cbiAgICAgICAgICAgICMgYmliIGZpbGUgY2hhbmdlZCwgcmVwYXJzZVxuICAgICAgICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLmdldEJpYkl0ZW1zKGZwYXRoKVxuICAgICAgICAgICAgcmV0dXJuKVxuICAgICAgICAgIEBiaWJXYXRjaGVyLm9uKCd1bmxpbmsnLCAoZnBhdGgpID0+XG4gICAgICAgICAgICAjIGJpYiBmaWxlIHJlbW92ZWQsIGNsb3NlIGFuZCByZXNldCBjaXRhdGlvbiBzdWdnZXN0aW9uc1xuICAgICAgICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLnJlc2V0QmliSXRlbXMoZnBhdGgpXG4gICAgICAgICAgICByZXR1cm4pXG4gICAgICApXG4gICAgcmV0dXJuIHRydWVcblxuICBwcmV2QmliV2F0Y2hlckNsb3NlZDood2F0Y2hlcix3YXRjaFBhdGgpIC0+XG4gICAgd2F0Y2hlZFBhdGhzID0gd2F0Y2hlci5nZXRXYXRjaGVkKClcbiAgICBpZiB3YXRjaGVyPyBhbmQgKCF3YXRjaGVkUGF0aHNbcGF0aC5kaXJuYW1lKHdhdGNoUGF0aCldPyBvciBwYXRoLmJhc2VuYW1lKHdhdGNoUGF0aCkgbm90IGluIHdhdGNoZWRQYXRoc1twYXRoLmRpcm5hbWUod2F0Y2hQYXRoKV0pXG4gICAgICB3YXRjaGVyLmNsb3NlKClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGZhbHNlXG4iXX0=
