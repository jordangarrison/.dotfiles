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

    Manager.prototype.rootDir = function() {
      if (atom.workspace.getActiveTextEditor() != null) {
        return atom.project.relativizePath(atom.workspace.getActiveTextEditor().getPath())[0];
      } else {
        return atom.project.getPaths()[0];
      }
    };

    function Manager(latex) {
      this.latex = latex;
    }

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
        this.rootWatcher = chokidar.watch(this.rootDir() + ("/**/*.+(" + (watchFileExts.join("|").replace(/\./g, '')) + ")"));
        this.rootWatcher.on('add', (function(_this) {
          return function(path) {
            _this.watchActions(path, 'add');
          };
        })(this));
        this.rootWatcher.on('change', (function(_this) {
          return function(path, stats) {
            if (_this.isTexFile(path)) {
              if (path === _this.latex.mainFile) {
                _this.latex.texFiles = [_this.latex.mainFile];
                _this.latex.bibFiles = [];
                _this.findDependentFiles(_this.latex.mainFile);
              }
              _this.watchActions(path);
            }
          };
        })(this));
        this.rootWatcher.on('unlink', (function(_this) {
          return function(path) {
            _this.watchActions(path, 'unlink');
          };
        })(this));
        return true;
      }
      return false;
    };

    Manager.prototype.watchActions = function(path, event) {
      if (event === 'add') {
        this.latex.provider.subFiles.getFileItems(path, !this.isTexFile(path));
      } else if (event === 'unlink') {
        this.latex.provider.subFiles.getFileItems(path, false, true);
        this.latex.provider.reference.resetRefItems(path);
      }
      if (this.isTexFile(path)) {
        this.latex.provider.command.getCommands(path);
        return this.latex.provider.reference.getRefItems(path);
      }
    };

    Manager.prototype.findAll = function() {
      if (!this.findMain()) {
        return false;
      }
      if (this.watchRoot()) {
        this.latex.texFiles = [this.latex.mainFile];
        this.latex.bibFiles = [];
        this.findDependentFiles(this.latex.mainFile);
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
            if ((_this.bibWatcher == null) || _this.prevBibWatcherClosed(_this.bibWatcher, bib)) {
              _this.bibWatcher = chokidar.watch(bib);
              _this.bibWatcher.on('add', function(path) {
                _this.latex.provider.citation.getBibItems(path);
              });
              _this.bibWatcher.on('change', function(path) {
                _this.latex.provider.citation.getBibItems(path);
              });
              return _this.bibWatcher.on('unlink', function(path) {
                _this.latex.provider.citation.resetBibItems(path);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL21hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O3NCQUNKLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBRyw0Q0FBSDtBQUNFLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUEsQ0FBNUIsQ0FBNEUsQ0FBQSxDQUFBLEVBRHJGO09BQUEsTUFBQTtBQUdFLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLEVBSGpDOztJQURPOztJQUtJLGlCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBREU7O3NCQUdiLFlBQUEsR0FBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLElBQUcsMEJBQUEsSUFBa0IsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUFBLEdBQWEsSUFBQyxDQUFBLFdBQWQsR0FBNEIsR0FBOUMsSUFDQyw4Q0FESjtBQUVFLGVBQU8sb0JBRlQ7O01BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsR0FBTCxDQUFBO01BQ2YsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFELENBQUE7QUFDVjtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBRyxJQUFBLEtBQVEsV0FBWDtBQUNFO1lBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixJQUFuQjtZQUNYLFdBQUEsR0FBYyxFQUFFLENBQUMsWUFBSCxDQUFnQixRQUFoQixFQUEwQixPQUExQjtZQUNkLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYO1lBQ1YsSUFBRyx3QkFBSDtjQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixFQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQTlCLEVBRGpCOztBQUVBLG1CQUFPLEtBTlQ7V0FBQSxhQUFBO1lBT00sWUFQTjtXQURGOztBQURGO0FBVUEsYUFBTztJQWhCSzs7c0JBa0JkLFNBQUEsR0FBVyxTQUFDLElBQUQ7QUFDVCxVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBZixDQUFBO01BQ0EsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBQSxLQUFzQixNQUF0QixzRkFDaUMsQ0FBRSxPQUFsQyxDQUEwQyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBMUMsb0JBQUEsR0FBZ0UsQ0FBQyxDQURyRTtBQUVFLGVBQU8sS0FGVDs7QUFHQSxhQUFPO0lBTEU7O3NCQU9YLFFBQUEsR0FBVSxTQUFDLElBQUQ7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFsQjtNQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFsQixDQUFBO0FBQ0EsYUFBTztJQUhDOztzQkFLVixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsdUJBQXhCO01BQ1IsS0FBSyxDQUFDLFFBQU4sR0FBaUIsQ0FBQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDaEIsSUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosR0FBcUIsQ0FBeEI7WUFDRSxLQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0IsS0FBSyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQURuQzs7aUJBRUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQWxCLENBQUE7UUFIZ0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUQ7YUFLakIsS0FBSyxDQUFDLEtBQU4sQ0FBQTtJQVBVOztzQkFTWixnQkFBQSxHQUFrQixTQUFDLElBQUQ7TUFDaEIsSUFBRyxJQUFIO1FBQ0UsSUFBZSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFmO0FBQUEsaUJBQU8sS0FBUDs7UUFDQSxJQUFlLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBZjtBQUFBLGlCQUFPLEtBQVA7U0FGRjs7TUFLQSxJQUFHLDZCQUFBLElBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQW5DLENBQTZDLENBQUEsQ0FBQSxDQUE3QyxLQUFtRCxJQUFDLENBQUEsT0FBRCxDQUFBLENBQTNFO0FBQ0UsZUFBTyxLQURUOztNQUdBLElBQWUsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFmO0FBQUEsZUFBTyxLQUFQOztNQUNBLElBQWUsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBZjtBQUFBLGVBQU8sS0FBUDs7TUFDQSxJQUFlLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBZjtBQUFBLGVBQU8sS0FBUDs7TUFDQSxJQUFlLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBZjtBQUFBLGVBQU8sS0FBUDs7TUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFkLENBQUE7QUFDQSxhQUFPO0lBZlM7O3NCQWlCbEIsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO01BQUEsUUFBQSxHQUFXO01BQ1gsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQTtNQUNULFdBQUEsNERBQWlDLENBQUU7TUFDbkMsY0FBQSxvQkFBaUIsTUFBTSxDQUFFLE9BQVIsQ0FBQTtNQUVqQixJQUFHLFdBQUEsSUFBZ0IsY0FBbkI7UUFDRSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQVcsV0FBWCxDQUFBLElBQTRCLGNBQWMsQ0FBQyxLQUFmLENBQXFCLFFBQXJCLENBQS9CO1VBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLEdBQWtCO1VBQ2xCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQWQsQ0FBc0IsTUFBdEI7QUFDQSxpQkFBTyxLQUhUO1NBREY7O0FBS0EsYUFBTztJQVhLOztzQkFhZCxpQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxVQUFBLEdBQWE7TUFDYixNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBO01BQ1QsV0FBQSw0REFBaUMsQ0FBRTtNQUNuQyxjQUFBLG9CQUFpQixNQUFNLENBQUUsT0FBUixDQUFBO01BRWpCLElBQUcsV0FBQSxJQUFnQixjQUFuQjtRQUNFLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBVyxXQUFYLENBQUg7VUFDRSxNQUFBLEdBQVMsY0FBYyxDQUFDLEtBQWYsQ0FBcUIsVUFBckI7VUFDVCxJQUFHLE1BQUg7WUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsQ0FBYixFQUF3QyxNQUFPLENBQUEsQ0FBQSxDQUEvQztZQUNsQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFkLENBQXNCLE9BQXRCO0FBQ0EsbUJBQU8sS0FIVDtXQUZGO1NBREY7O0FBT0EsYUFBTztJQWJVOztzQkFlbkIsY0FBQSxHQUFnQixTQUFBO0FBQ2QsVUFBQTtNQUFBLElBQUMsQ0FBQSxZQUFELENBQUE7TUFDQSxxQ0FBVSxDQUFFLGFBQVo7UUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQztRQUMxQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFkLENBQXNCLFFBQXRCO0FBQ0EsZUFBTyxLQUhUOztBQUlBLGFBQU87SUFOTzs7c0JBUWhCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxRQUFBLEdBQVc7QUFDWDtBQUFBLFdBQUEscUNBQUE7O0FBQ0U7QUFBQSxhQUFBLHdDQUFBOztVQUNFLElBQVksQ0FBQyxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsQ0FBYjtBQUFBLHFCQUFBOztVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsSUFBbkI7VUFDWCxXQUFBLEdBQWMsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUI7VUFDZCxJQUFHLFdBQVcsQ0FBQyxLQUFaLENBQWtCLFFBQWxCLENBQUg7WUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0I7WUFDbEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBZCxDQUFzQixLQUF0QjtBQUNBLG1CQUFPLEtBSFQ7O0FBSkY7QUFERjtBQVNBLGFBQU87SUFYUTs7c0JBYWpCLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBRyxDQUFDLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBSjtBQUNFLGVBQU8sTUFEVDs7QUFFQSxhQUFPLElBQUksQ0FBQyxJQUFMLENBQ0wsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQXBCLENBREssRUFFTCxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBckIsRUFBK0IsTUFBL0IsQ0FBQSxHQUF5QyxNQUZwQztJQUhBOztzQkFPVCxpQkFBQSxHQUFtQixTQUFDLE9BQUQsRUFBVSxTQUFWO0FBQ2pCLFVBQUE7TUFBQSxZQUFBLEdBQWUsT0FBTyxDQUFDLFVBQVIsQ0FBQTtNQUNmLElBQUcsaUJBQUEsSUFBYSxDQUFDLENBQUUsU0FBQSxJQUFhLFlBQWYsQ0FBakI7UUFHRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBeEIsQ0FBQTtRQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUExQixDQUFBO1FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQXpCLENBQUE7UUFDQSxPQUFPLENBQUMsS0FBUixDQUFBO0FBQ0EsZUFBTyxLQVBUO09BQUEsTUFBQTtBQVNFLGVBQU8sTUFUVDs7SUFGaUI7O3NCQWFuQixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxJQUFJLDBCQUFELElBQWtCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFDLENBQUEsV0FBcEIsRUFBZ0MsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFoQyxDQUFyQjtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFsQixDQUF1QjtVQUNyQixJQUFBLEVBQU0sTUFEZTtVQUVyQixJQUFBLEVBQU0sbUJBQUEsR0FBbUIsQ0FBQyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQUQsQ0FBbkIsR0FBK0IsY0FGaEI7U0FBdkI7UUFJQSxhQUFBLEdBQWdCLENBQUMsS0FBRCxFQUFPLEtBQVAsRUFBYSxNQUFiLEVBQW9CLEtBQXBCLEVBQTBCLEtBQTFCLEVBQWdDLEtBQWhDO1FBQ2hCLElBQUcsNEVBQUg7VUFDRSxhQUFhLENBQUMsSUFBZCxzQkFBbUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQXpDLEVBREY7O1FBRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBQSxHQUFhLENBQUEsVUFBQSxHQUFVLENBQUMsYUFBYSxDQUFDLElBQWQsQ0FBbUIsR0FBbkIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxLQUFoQyxFQUFzQyxFQUF0QyxDQUFELENBQVYsR0FBcUQsR0FBckQsQ0FBNUI7UUFFZixJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsS0FBaEIsRUFBc0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFEO1lBQ3BCLEtBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxFQUFtQixLQUFuQjtVQURvQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEI7UUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFELEVBQU0sS0FBTjtZQUN4QixJQUFHLEtBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxDQUFIO2NBQ0UsSUFBRyxJQUFBLEtBQVEsS0FBQyxDQUFBLEtBQUssQ0FBQyxRQUFsQjtnQkFFRSxLQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0IsQ0FBRSxLQUFDLENBQUEsS0FBSyxDQUFDLFFBQVQ7Z0JBQ2xCLEtBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxHQUFrQjtnQkFDbEIsS0FBQyxDQUFBLGtCQUFELENBQW9CLEtBQUMsQ0FBQSxLQUFLLENBQUMsUUFBM0IsRUFKRjs7Y0FLQSxLQUFDLENBQUEsWUFBRCxDQUFjLElBQWQsRUFORjs7VUFEd0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO1FBU0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLENBQWdCLFFBQWhCLEVBQXlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDtZQUN2QixLQUFDLENBQUEsWUFBRCxDQUFjLElBQWQsRUFBbUIsUUFBbkI7VUFEdUI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO0FBR0EsZUFBTyxLQTFCVDs7QUE0QkEsYUFBTztJQTdCRTs7c0JBK0JYLFlBQUEsR0FBYyxTQUFDLElBQUQsRUFBTSxLQUFOO01BRVosSUFBRyxLQUFBLEtBQVMsS0FBWjtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUF6QixDQUFzQyxJQUF0QyxFQUE0QyxDQUFDLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxDQUE3QyxFQURGO09BQUEsTUFFSyxJQUFHLEtBQUEsS0FBUyxRQUFaO1FBQ0gsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQXpCLENBQXNDLElBQXRDLEVBQTJDLEtBQTNDLEVBQWlELElBQWpEO1FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQTFCLENBQXdDLElBQXhDLEVBRkc7O01BR0wsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsQ0FBSDtRQUVFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUF4QixDQUFvQyxJQUFwQztlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxXQUExQixDQUFzQyxJQUF0QyxFQUhGOztJQVBZOztzQkFZZCxPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUcsQ0FBQyxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUo7QUFDRSxlQUFPLE1BRFQ7O01BRUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7UUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0IsQ0FBRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVQ7UUFDbEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLEdBQWtCO1FBQ2xCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQTNCLEVBSEY7O0FBSUEsYUFBTztJQVBBOztzQkFTVCxrQkFBQSxHQUFvQixTQUFDLElBQUQ7QUFDbEIsVUFBQTtNQUFBLE9BQUEsR0FBVSxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFoQixFQUFzQixPQUF0QjtNQUNWLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBcEI7TUFFVixRQUFBLEdBQVc7QUFDWCxhQUFBLElBQUE7UUFDRSxNQUFBLEdBQVMsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkO1FBQ1QsSUFBVSxjQUFWO0FBQUEsZ0JBQUE7O1FBQ0EsU0FBQSxHQUFZLE1BQU8sQ0FBQSxDQUFBO1FBQ25CLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBQUEsS0FBMkIsRUFBOUI7VUFDRSxTQUFBLElBQWEsT0FEZjs7UUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsU0FBbkIsQ0FBYjtRQUNYLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBaEIsQ0FBd0IsUUFBeEIsQ0FBQSxHQUFvQyxDQUFwQyxJQUEwQyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBN0M7VUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixRQUFyQjtVQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixRQUFwQixFQUZGOztNQVBGO01BV0EsTUFBQSxHQUFTO0FBQ1QsYUFBQSxJQUFBO1FBQ0UsTUFBQSxHQUFTLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWjtRQUNULElBQVUsY0FBVjtBQUFBLGdCQUFBOztRQUNBLElBQUEsR0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVixDQUFnQixHQUFoQixDQUFvQixDQUFDLEdBQXJCLENBQXlCLFNBQUMsR0FBRDtpQkFBUyxHQUFHLENBQUMsSUFBSixDQUFBO1FBQVQsQ0FBekI7UUFDUCxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQ7WUFDZixJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEtBQXFCLEVBQXhCO2NBQ0UsR0FBQSxJQUFPLE9BRFQ7O1lBRUEsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEdBQW5CLENBQWI7WUFDTixJQUFHLEtBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQWhCLENBQXdCLEdBQXhCLENBQUEsR0FBK0IsQ0FBbEM7Y0FDRSxLQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixHQUFyQixFQURGOztZQUVBLElBQUksMEJBQUQsSUFBaUIsS0FBQyxDQUFBLG9CQUFELENBQXNCLEtBQUMsQ0FBQSxVQUF2QixFQUFrQyxHQUFsQyxDQUFwQjtjQUNFLEtBQUMsQ0FBQSxVQUFELEdBQWMsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmO2NBRWQsS0FBQyxDQUFBLFVBQVUsQ0FBQyxFQUFaLENBQWUsS0FBZixFQUFzQixTQUFDLElBQUQ7Z0JBRXBCLEtBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUF6QixDQUFxQyxJQUFyQztjQUZvQixDQUF0QjtjQUlBLEtBQUMsQ0FBQSxVQUFVLENBQUMsRUFBWixDQUFlLFFBQWYsRUFBeUIsU0FBQyxJQUFEO2dCQUV2QixLQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBekIsQ0FBcUMsSUFBckM7Y0FGdUIsQ0FBekI7cUJBSUEsS0FBQyxDQUFBLFVBQVUsQ0FBQyxFQUFaLENBQWUsUUFBZixFQUF5QixTQUFDLElBQUQ7Z0JBRXZCLEtBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUF6QixDQUF1QyxJQUF2QztjQUZ1QixDQUF6QixFQVhGOztVQU5lO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO01BSlY7QUEwQkEsYUFBTztJQTNDVzs7c0JBNkNwQixvQkFBQSxHQUFxQixTQUFDLE9BQUQsRUFBUyxTQUFUO0FBQ25CLFVBQUE7TUFBQSxZQUFBLEdBQWUsT0FBTyxDQUFDLFVBQVIsQ0FBQTtNQUNmLElBQUcsaUJBQUEsSUFBYSxDQUFFLCtDQUFELElBQTJDLE9BQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxTQUFkLENBQUEsRUFBQSxhQUFnQyxZQUFhLENBQUEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBQUEsQ0FBN0MsRUFBQSxHQUFBLEtBQUEsQ0FBNUMsQ0FBaEI7UUFDRSxPQUFPLENBQUMsS0FBUixDQUFBO0FBQ0EsZUFBTyxLQUZUO09BQUEsTUFBQTtBQUlFLGVBQU8sTUFKVDs7SUFGbUI7Ozs7S0F2T0Q7QUFOdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5jaG9raWRhciA9IHJlcXVpcmUgJ2Nob2tpZGFyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNYW5hZ2VyIGV4dGVuZHMgRGlzcG9zYWJsZVxuICByb290RGlyOiAtPlxuICAgIGlmIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT9cbiAgICAgIHJldHVybiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSlbMF1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0gIyBiYWNrdXAsIHJldHVybiBmaXJzdCBhY3RpdmUgcHJvamVjdFxuICBjb25zdHJ1Y3RvcjogKGxhdGV4KSAtPlxuICAgIEBsYXRleCA9IGxhdGV4XG5cbiAgbG9hZExvY2FsQ2ZnOiAtPlxuICAgIGlmIEBsYXN0Q2ZnVGltZT8gYW5kIERhdGUubm93KCkgLSBAbGFzdENmZ1RpbWUgPCAyMDAgb3JcXFxuICAgICAgICFhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/XG4gICAgICByZXR1cm4gQGNvbmZpZz9cbiAgICBAbGFzdENmZ1RpbWUgPSBEYXRlLm5vdygpXG4gICAgcm9vdERpciA9IEByb290RGlyKClcbiAgICBmb3IgZmlsZSBpbiBmcy5yZWFkZGlyU3luYyByb290RGlyXG4gICAgICBpZiBmaWxlIGlzICcubGF0ZXhjZmcnXG4gICAgICAgIHRyeVxuICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luIHJvb3REaXIsIGZpbGVcbiAgICAgICAgICBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyBmaWxlUGF0aCwgJ3V0Zi04J1xuICAgICAgICAgIEBjb25maWcgPSBKU09OLnBhcnNlIGZpbGVDb250ZW50XG4gICAgICAgICAgaWYgQGNvbmZpZy5yb290P1xuICAgICAgICAgICAgQGNvbmZpZy5yb290ID0gcGF0aC5yZXNvbHZlIHJvb3REaXIsIEBjb25maWcucm9vdFxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGNhdGNoIGVyclxuICAgIHJldHVybiBmYWxzZVxuXG4gIGlzVGV4RmlsZTogKG5hbWUpIC0+XG4gICAgQGxhdGV4Lm1hbmFnZXIubG9hZExvY2FsQ2ZnKClcbiAgICBpZiBwYXRoLmV4dG5hbWUobmFtZSkgPT0gJy50ZXgnIG9yIFxcXG4gICAgICAgIEBsYXRleC5tYW5hZ2VyLmNvbmZpZz8ubGF0ZXhfZXh0Py5pbmRleE9mKHBhdGguZXh0bmFtZShuYW1lKSkgPiAtMVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kTWFpbjogKGhlcmUpIC0+XG4gICAgcmVzdWx0ID0gQGZpbmRNYWluU2VxdWVuY2UoaGVyZSlcbiAgICBAbGF0ZXgucGFuZWwudmlldy51cGRhdGUoKVxuICAgIHJldHVybiByZXN1bHRcblxuICByZWZpbmRNYWluOiAoKSAtPlxuICAgIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0b20tbGF0ZXgtcm9vdC1pbnB1dCcpXG4gICAgaW5wdXQub25jaGFuZ2UgPSAoPT5cbiAgICAgIGlmIGlucHV0LmZpbGVzLmxlbmd0aCA+IDBcbiAgICAgICAgQGxhdGV4Lm1haW5GaWxlID0gaW5wdXQuZmlsZXNbMF0ucGF0aFxuICAgICAgQGxhdGV4LnBhbmVsLnZpZXcudXBkYXRlKClcbiAgICApXG4gICAgaW5wdXQuY2xpY2soKVxuXG4gIGZpbmRNYWluU2VxdWVuY2U6IChoZXJlKSAtPlxuICAgIGlmIGhlcmVcbiAgICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpblNlbGZNYWdpYygpXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBAZmluZE1haW5TZWxmKClcblxuICAgICMgQ2hlY2sgaWYgdGhlIG1haW5GaWxlIGlzIHBhcnQgb2YgdGhlIGN1cmVudCBwcm9qZWN0IHBhdGhcbiAgICBpZiBAbGF0ZXgubWFpbkZpbGU/IGFuZCBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoQGxhdGV4Lm1haW5GaWxlKVswXSA9PSBAcm9vdERpcigpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIHRydWUgaWYgQGZpbmRNYWluQ29uZmlnKClcbiAgICByZXR1cm4gdHJ1ZSBpZiBAZmluZE1haW5TZWxmTWFnaWMoKVxuICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpblNlbGYoKVxuICAgIHJldHVybiB0cnVlIGlmIEBmaW5kTWFpbkFsbFJvb3QoKVxuXG4gICAgQGxhdGV4LmxvZ2dlci5taXNzaW5nTWFpbigpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZE1haW5TZWxmOiAtPlxuICAgIGRvY1JlZ2V4ID0gL1xcXFxiZWdpbntkb2N1bWVudH0vXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGN1cnJlbnRQYXRoID0gZWRpdG9yPy5idWZmZXIuZmlsZT8ucGF0aFxuICAgIGN1cnJlbnRDb250ZW50ID0gZWRpdG9yPy5nZXRUZXh0KClcblxuICAgIGlmIGN1cnJlbnRQYXRoIGFuZCBjdXJyZW50Q29udGVudFxuICAgICAgaWYgQGlzVGV4RmlsZShjdXJyZW50UGF0aCkgYW5kIGN1cnJlbnRDb250ZW50Lm1hdGNoKGRvY1JlZ2V4KVxuICAgICAgICBAbGF0ZXgubWFpbkZpbGUgPSBjdXJyZW50UGF0aFxuICAgICAgICBAbGF0ZXgubG9nZ2VyLnNldE1haW4oJ3NlbGYnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGZpbmRNYWluU2VsZk1hZ2ljOiAtPlxuICAgIG1hZ2ljUmVnZXggPSAvKD86JVxccyohVEVYXFxzcm9vdFxccyo9XFxzKihbXlxcc10qXFwudGV4KSQpL21cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY3VycmVudFBhdGggPSBlZGl0b3I/LmJ1ZmZlci5maWxlPy5wYXRoXG4gICAgY3VycmVudENvbnRlbnQgPSBlZGl0b3I/LmdldFRleHQoKVxuXG4gICAgaWYgY3VycmVudFBhdGggYW5kIGN1cnJlbnRDb250ZW50XG4gICAgICBpZiBAaXNUZXhGaWxlKGN1cnJlbnRQYXRoKVxuICAgICAgICByZXN1bHQgPSBjdXJyZW50Q29udGVudC5tYXRjaCBtYWdpY1JlZ2V4XG4gICAgICAgIGlmIHJlc3VsdFxuICAgICAgICAgIEBsYXRleC5tYWluRmlsZSA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoY3VycmVudFBhdGgpLCByZXN1bHRbMV0pXG4gICAgICAgICAgQGxhdGV4LmxvZ2dlci5zZXRNYWluKCdtYWdpYycpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcblxuICBmaW5kTWFpbkNvbmZpZzogLT5cbiAgICBAbG9hZExvY2FsQ2ZnKClcbiAgICBpZiBAY29uZmlnPy5yb290XG4gICAgICBAbGF0ZXgubWFpbkZpbGUgPSBAY29uZmlnLnJvb3RcbiAgICAgIEBsYXRleC5sb2dnZXIuc2V0TWFpbignY29uZmlnJylcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZE1haW5BbGxSb290OiAtPlxuICAgIGRvY1JlZ2V4ID0gL1xcXFxiZWdpbntkb2N1bWVudH0vXG4gICAgZm9yIHJvb3REaXIgaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICAgIGZvciBmaWxlIGluIGZzLnJlYWRkaXJTeW5jIHJvb3REaXJcbiAgICAgICAgY29udGludWUgaWYgIUBpc1RleEZpbGUoZmlsZSlcbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4gcm9vdERpciwgZmlsZVxuICAgICAgICBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyBmaWxlUGF0aCwgJ3V0Zi04J1xuICAgICAgICBpZiBmaWxlQ29udGVudC5tYXRjaCBkb2NSZWdleFxuICAgICAgICAgIEBsYXRleC5tYWluRmlsZSA9IGZpbGVQYXRoXG4gICAgICAgICAgQGxhdGV4LmxvZ2dlci5zZXRNYWluKCdhbGwnKVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgZmluZFBERjogLT5cbiAgICBpZiAhQGZpbmRNYWluKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBwYXRoLmpvaW4oXG4gICAgICBwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKSxcbiAgICAgIHBhdGguYmFzZW5hbWUoQGxhdGV4Lm1haW5GaWxlLCAnLnRleCcpICsgJy5wZGYnKVxuXG4gIHByZXZXYXRjaGVyQ2xvc2VkOiAod2F0Y2hlciwgd2F0Y2hQYXRoKSAtPlxuICAgIHdhdGNoZWRQYXRocyA9IHdhdGNoZXIuZ2V0V2F0Y2hlZCgpXG4gICAgaWYgd2F0Y2hlcj8gYW5kICEoIHdhdGNoUGF0aCBvZiB3YXRjaGVkUGF0aHMpXG4gICAgICAjIHJvb3RXYXRjaGVyIGV4aXN0cywgYnV0IHByb2plY3QgZGlyIGhhcyBiZWVuIGNoYW5nZWRcbiAgICAgICMgYW5kIHJlc2V0IGFsbCBzdWdnZXN0aW9ucyBhbmQgY2xvc2Ugd2F0Y2hlclxuICAgICAgQGxhdGV4LnByb3ZpZGVyLmNvbW1hbmQucmVzZXRDb21tYW5kcygpXG4gICAgICBAbGF0ZXgucHJvdmlkZXIucmVmZXJlbmNlLnJlc2V0UmVmSXRlbXMoKVxuICAgICAgQGxhdGV4LnByb3ZpZGVyLnN1YkZpbGVzLnJlc2V0RmlsZUl0ZW1zKClcbiAgICAgIHdhdGNoZXIuY2xvc2UoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2VcblxuICB3YXRjaFJvb3Q6IC0+XG4gICAgaWYgIUByb290V2F0Y2hlcj8gb3IgQHByZXZXYXRjaGVyQ2xvc2VkKEByb290V2F0Y2hlcixAcm9vdERpcigpKVxuICAgICAgQGxhdGV4LmxvZ2dlci5sb2cucHVzaCB7XG4gICAgICAgIHR5cGU6IHN0YXR1c1xuICAgICAgICB0ZXh0OiBcIldhdGNoaW5nIHByb2plY3QgI3tAcm9vdERpcigpfSBmb3IgY2hhbmdlc1wiXG4gICAgICB9XG4gICAgICB3YXRjaEZpbGVFeHRzID0gWydwbmcnLCdlcHMnLCdqcGVnJywnanBnJywncGRmJywndGV4J11cbiAgICAgIGlmIEBsYXRleC5tYW5hZ2VyLmNvbmZpZz8ubGF0ZXhfZXh0P1xuICAgICAgICB3YXRjaEZpbGVFeHRzLnB1c2ggQGxhdGV4Lm1hbmFnZXIuY29uZmlnLmxhdGV4X2V4dC4uLlxuICAgICAgQHJvb3RXYXRjaGVyID0gY2hva2lkYXIud2F0Y2goQHJvb3REaXIoKSArIFwiLyoqLyouKygje3dhdGNoRmlsZUV4dHMuam9pbihcInxcIikucmVwbGFjZSgvXFwuL2csJycpfSlcIilcblxuICAgICAgQHJvb3RXYXRjaGVyLm9uKCdhZGQnLChwYXRoKT0+XG4gICAgICAgIEB3YXRjaEFjdGlvbnMocGF0aCwnYWRkJylcbiAgICAgICAgcmV0dXJuKVxuXG4gICAgICBAcm9vdFdhdGNoZXIub24oJ2NoYW5nZScsIChwYXRoLHN0YXRzKSA9PlxuICAgICAgICBpZiBAaXNUZXhGaWxlKHBhdGgpXG4gICAgICAgICAgaWYgcGF0aCA9PSBAbGF0ZXgubWFpbkZpbGVcbiAgICAgICAgICAgICMgVXBkYXRlIGRlcGVuZGVudCBmaWxlc1xuICAgICAgICAgICAgQGxhdGV4LnRleEZpbGVzID0gWyBAbGF0ZXgubWFpbkZpbGUgXVxuICAgICAgICAgICAgQGxhdGV4LmJpYkZpbGVzID0gW11cbiAgICAgICAgICAgIEBmaW5kRGVwZW5kZW50RmlsZXMoQGxhdGV4Lm1haW5GaWxlKVxuICAgICAgICAgIEB3YXRjaEFjdGlvbnMocGF0aClcbiAgICAgICAgcmV0dXJuKVxuICAgICAgQHJvb3RXYXRjaGVyLm9uKCd1bmxpbmsnLChwYXRoKSA9PlxuICAgICAgICBAd2F0Y2hBY3Rpb25zKHBhdGgsJ3VubGluaycpXG4gICAgICAgIHJldHVybilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICB3YXRjaEFjdGlvbnM6IChwYXRoLGV2ZW50KSAtPlxuICAgICMgUHVzaC9TcGxpY2UgZmlsZSBzdWdnZXN0aW9ucyBvbiBuZXcgZmlsZSBhZGRpdGlvbnMgb3IgcmVtb3ZhbHNcbiAgICBpZiBldmVudCBpcyAnYWRkJ1xuICAgICAgQGxhdGV4LnByb3ZpZGVyLnN1YkZpbGVzLmdldEZpbGVJdGVtcyhwYXRoLCAhQGlzVGV4RmlsZShwYXRoKSlcbiAgICBlbHNlIGlmIGV2ZW50IGlzICd1bmxpbmsnXG4gICAgICBAbGF0ZXgucHJvdmlkZXIuc3ViRmlsZXMuZ2V0RmlsZUl0ZW1zKHBhdGgsZmFsc2UsdHJ1ZSkgIyBkb24ndCBib3RoZXIgY2hlY2tpbmcgZmlsZSB0eXBlXG4gICAgICBAbGF0ZXgucHJvdmlkZXIucmVmZXJlbmNlLnJlc2V0UmVmSXRlbXMocGF0aClcbiAgICBpZiBAaXNUZXhGaWxlKHBhdGgpXG4gICAgICAjIFB1c2ggY29tbWFuZCBhbmQgcmVmZXJlbmNlcyBzdWdnZXN0aW9uc1xuICAgICAgQGxhdGV4LnByb3ZpZGVyLmNvbW1hbmQuZ2V0Q29tbWFuZHMocGF0aClcbiAgICAgIEBsYXRleC5wcm92aWRlci5yZWZlcmVuY2UuZ2V0UmVmSXRlbXMocGF0aClcblxuICBmaW5kQWxsOiAtPlxuICAgIGlmICFAZmluZE1haW4oKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgaWYgQHdhdGNoUm9vdCgpXG4gICAgICBAbGF0ZXgudGV4RmlsZXMgPSBbIEBsYXRleC5tYWluRmlsZSBdXG4gICAgICBAbGF0ZXguYmliRmlsZXMgPSBbXVxuICAgICAgQGZpbmREZXBlbmRlbnRGaWxlcyhAbGF0ZXgubWFpbkZpbGUpXG4gICAgcmV0dXJuIHRydWVcblxuICBmaW5kRGVwZW5kZW50RmlsZXM6IChmaWxlKSAtPlxuICAgIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMgZmlsZSwgJ3V0Zi04J1xuICAgIGJhc2VEaXIgPSBwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKVxuXG4gICAgaW5wdXRSZWcgPSAvKD86XFxcXCg/OmlucHV0fGluY2x1ZGV8c3ViZmlsZSkoPzpcXFtbXlxcW1xcXVxce1xcfV0qXFxdKT8peyhbXn1dKil9L2dcbiAgICBsb29wXG4gICAgICByZXN1bHQgPSBpbnB1dFJlZy5leGVjIGNvbnRlbnRcbiAgICAgIGJyZWFrIGlmICFyZXN1bHQ/XG4gICAgICBpbnB1dEZpbGUgPSByZXN1bHRbMV1cbiAgICAgIGlmIHBhdGguZXh0bmFtZShpbnB1dEZpbGUpIGlzICcnXG4gICAgICAgIGlucHV0RmlsZSArPSAnLnRleCdcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihiYXNlRGlyLCBpbnB1dEZpbGUpKVxuICAgICAgaWYgQGxhdGV4LnRleEZpbGVzLmluZGV4T2YoZmlsZVBhdGgpIDwgMCBhbmQgZnMuZXhpc3RzU3luYyhmaWxlUGF0aClcbiAgICAgICAgQGxhdGV4LnRleEZpbGVzLnB1c2goZmlsZVBhdGgpXG4gICAgICAgIEBmaW5kRGVwZW5kZW50RmlsZXMoZmlsZVBhdGgpXG5cbiAgICBiaWJSZWcgPSAvKD86XFxcXCg/OmJpYmxpb2dyYXBoeXxhZGRiaWJyZXNvdXJjZSkoPzpcXFtbXlxcW1xcXVxce1xcfV0qXFxdKT8peyguKz8pfS9nXG4gICAgbG9vcFxuICAgICAgcmVzdWx0ID0gYmliUmVnLmV4ZWMgY29udGVudFxuICAgICAgYnJlYWsgaWYgIXJlc3VsdD9cbiAgICAgIGJpYnMgPSByZXN1bHRbMV0uc3BsaXQoJywnKS5tYXAoKGJpYikgLT4gYmliLnRyaW0oKSlcbiAgICAgIHBhdGhzID0gYmlicy5tYXAoKGJpYikgPT5cbiAgICAgICAgaWYgcGF0aC5leHRuYW1lKGJpYikgaXMgJydcbiAgICAgICAgICBiaWIgKz0gJy5iaWInXG4gICAgICAgIGJpYiA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oYmFzZURpciwgYmliKSlcbiAgICAgICAgaWYgQGxhdGV4LmJpYkZpbGVzLmluZGV4T2YoYmliKSA8IDBcbiAgICAgICAgICBAbGF0ZXguYmliRmlsZXMucHVzaChiaWIpXG4gICAgICAgIGlmICFAYmliV2F0Y2hlcj8gb3IgQHByZXZCaWJXYXRjaGVyQ2xvc2VkKEBiaWJXYXRjaGVyLGJpYilcbiAgICAgICAgICBAYmliV2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGJpYilcbiAgICAgICAgICAjIFJlZ2lzdGVyIHdhdGNoZXIgY2FsbGJhY2tzXG4gICAgICAgICAgQGJpYldhdGNoZXIub24oJ2FkZCcsIChwYXRoKSA9PlxuICAgICAgICAgICAgIyBiaWIgZmlsZSBhZGRlZCwgcmVwYXJzZVxuICAgICAgICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLmdldEJpYkl0ZW1zKHBhdGgpXG4gICAgICAgICAgICByZXR1cm4pXG4gICAgICAgICAgQGJpYldhdGNoZXIub24oJ2NoYW5nZScsIChwYXRoKSA9PlxuICAgICAgICAgICAgIyBiaWIgZmlsZSBjaGFuZ2VkLCByZXBhcnNlXG4gICAgICAgICAgICBAbGF0ZXgucHJvdmlkZXIuY2l0YXRpb24uZ2V0QmliSXRlbXMocGF0aClcbiAgICAgICAgICAgIHJldHVybilcbiAgICAgICAgICBAYmliV2F0Y2hlci5vbigndW5saW5rJywgKHBhdGgpID0+XG4gICAgICAgICAgICAjIGJpYiBmaWxlIHJlbW92ZWQsIGNsb3NlIGFuZCByZXNldCBjaXRhdGlvbiBzdWdnZXN0aW9uc1xuICAgICAgICAgICAgQGxhdGV4LnByb3ZpZGVyLmNpdGF0aW9uLnJlc2V0QmliSXRlbXMocGF0aClcbiAgICAgICAgICAgIHJldHVybilcbiAgICAgIClcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHByZXZCaWJXYXRjaGVyQ2xvc2VkOih3YXRjaGVyLHdhdGNoUGF0aCkgLT5cbiAgICB3YXRjaGVkUGF0aHMgPSB3YXRjaGVyLmdldFdhdGNoZWQoKVxuICAgIGlmIHdhdGNoZXI/IGFuZCAoIXdhdGNoZWRQYXRoc1twYXRoLmRpcm5hbWUod2F0Y2hQYXRoKV0/IG9yIHBhdGguYmFzZW5hbWUod2F0Y2hQYXRoKSBub3QgaW4gd2F0Y2hlZFBhdGhzW3BhdGguZGlybmFtZSh3YXRjaFBhdGgpXSlcbiAgICAgIHdhdGNoZXIuY2xvc2UoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2VcbiJdfQ==
