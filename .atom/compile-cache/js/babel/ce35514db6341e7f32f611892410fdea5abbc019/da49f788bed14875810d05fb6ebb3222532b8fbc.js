Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require('./werkzeug');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _atom = require('atom');

var _buildState = require('./build-state');

var _buildState2 = _interopRequireDefault(_buildState);

var _parsersMagicParser = require('./parsers/magic-parser');

var _parsersMagicParser2 = _interopRequireDefault(_parsersMagicParser);

var Composer = (function (_Disposable) {
  _inherits(Composer, _Disposable);

  function Composer() {
    var _this2 = this;

    _classCallCheck(this, Composer);

    _get(Object.getPrototypeOf(Composer.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.disposables = new _atom.CompositeDisposable();
    this.cachedBuildStates = new Map();

    var _this = this;

    this.disposables.add(atom.config.onDidChange('latex', function () {
      _this2.rebuildCompleted = new Set();
    }));
  }

  _createClass(Composer, [{
    key: 'initializeBuild',
    value: function initializeBuild(filePath) {
      var allowCached = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var state = undefined;

      if (allowCached && this.cachedBuildStates.has(filePath)) {
        state = this.cachedBuildStates.get(filePath);
      } else {
        state = new _buildState2['default'](filePath);
        this.initializeBuildStateFromConfig(state);
        this.initializeBuildStateFromMagic(state);
        this.initializeBuildStateFromSettingsFile(state);
        // Check again in case there was a root comment
        var masterFilePath = state.getFilePath();
        if (filePath !== masterFilePath) {
          if (allowCached && this.cachedBuildStates.has(masterFilePath)) {
            state = this.cachedBuildStates.get(masterFilePath);
          }
          state.addSubfile(filePath);
        }
        this.cacheBuildState(state);
      }

      var builder = latex.builderRegistry.getBuilder(state);
      if (!builder) {
        latex.log.warning('No registered LaTeX builder can process ' + state.getFilePath() + '.');
        return state;
      }

      return { state: state, builder: builder };
    }
  }, {
    key: 'cacheBuildState',
    value: function cacheBuildState(state) {
      var filePath = state.getFilePath();
      if (this.cachedBuildStates.has(filePath)) {
        var oldState = this.cachedBuildStates.get(filePath);
        for (var subfile of oldState.getSubfiles()) {
          this.cachedBuildStates['delete'](subfile);
        }
        this.cachedBuildStates['delete'](filePath);
      }

      this.cachedBuildStates.set(filePath, state);
      for (var subfile of state.getSubfiles()) {
        this.cachedBuildStates.set(subfile, state);
      }
    }
  }, {
    key: 'initializeBuildStateFromConfig',
    value: function initializeBuildStateFromConfig(state) {
      this.initializeBuildStateFromProperties(state, atom.config.get('latex'));
    }
  }, {
    key: 'initializeBuildStateFromProperties',
    value: function initializeBuildStateFromProperties(state, properties) {
      if (!properties) return;

      if (properties.cleanPatterns) {
        state.setCleanPatterns(properties.cleanPatterns);
      }

      if ('enableSynctex' in properties) {
        state.setEnableSynctex(properties.enableSynctex);
      }

      if ('enableShellEscape' in properties) {
        state.setEnableShellEscape(properties.enableShellEscape);
      }

      if ('enableExtendedBuildMode' in properties) {
        state.setEnableExtendedBuildMode(properties.enableExtendedBuildMode);
      }

      if (properties.jobNames) {
        state.setJobNames(properties.jobNames);
      } else if (properties.jobnames) {
        // jobnames is for compatibility with magic comments
        state.setJobNames(properties.jobnames);
      } else if (properties.jobname) {
        // jobname is for compatibility with Sublime
        state.setJobNames([properties.jobname]);
      }

      if (properties.customEngine) {
        state.setEngine(properties.customEngine);
      } else if (properties.engine) {
        state.setEngine(properties.engine);
      } else if (properties.program) {
        // program is for compatibility with magic comments
        state.setEngine(properties.program);
      }

      if ('moveResultToSourceDirectory' in properties) {
        state.setMoveResultToSourceDirectory(properties.moveResultToSourceDirectory);
      }

      if (properties.outputFormat) {
        state.setOutputFormat(properties.outputFormat);
      } else if (properties.format) {
        // format is for compatibility with magic comments
        state.setOutputFormat(properties.format);
      }

      if ('outputDirectory' in properties) {
        state.setOutputDirectory(properties.outputDirectory);
      } else if ('output_directory' in properties) {
        // output_directory is for compatibility with Sublime
        state.setOutputDirectory(properties.output_directory);
      }

      if (properties.producer) {
        state.setProducer(properties.producer);
      }
    }
  }, {
    key: 'initializeBuildStateFromMagic',
    value: function initializeBuildStateFromMagic(state) {
      var magic = this.getMagic(state);

      if (magic.root) {
        state.setFilePath(_path2['default'].resolve(state.getProjectPath(), magic.root));
        magic = this.getMagic(state);
      }

      this.initializeBuildStateFromProperties(state, magic);
    }
  }, {
    key: 'getMagic',
    value: function getMagic(state) {
      return new _parsersMagicParser2['default'](state.getFilePath()).parse();
    }
  }, {
    key: 'initializeBuildStateFromSettingsFile',
    value: function initializeBuildStateFromSettingsFile(state) {
      try {
        var _path$parse = _path2['default'].parse(state.getFilePath());

        var dir = _path$parse.dir;
        var _name = _path$parse.name;

        var filePath = _path2['default'].format({ dir: dir, name: _name, ext: '.yaml' });

        if (_fsPlus2['default'].existsSync(filePath)) {
          var config = _jsYaml2['default'].safeLoad(_fsPlus2['default'].readFileSync(filePath));
          this.initializeBuildStateFromProperties(state, config);
        }
      } catch (error) {
        latex.log.error('Parsing of project file failed: ' + error.message);
      }
    }
  }, {
    key: 'build',
    value: _asyncToGenerator(function* (shouldRebuild) {
      var _this3 = this;

      latex.process.killChildProcesses();

      var _getEditorDetails = (0, _werkzeug.getEditorDetails)();

      var editor = _getEditorDetails.editor;
      var filePath = _getEditorDetails.filePath;

      if (!filePath) {
        latex.log.warning('File needs to be saved to disk before it can be TeXified.');
        return false;
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      var _initializeBuild = this.initializeBuild(filePath);

      var builder = _initializeBuild.builder;
      var state = _initializeBuild.state;

      if (!builder) return false;
      state.setShouldRebuild(shouldRebuild);

      if (this.rebuildCompleted && !this.rebuildCompleted.has(state.getFilePath())) {
        state.setShouldRebuild(true);
        this.rebuildCompleted.add(state.getFilePath());
      }

      latex.log.clear();
      latex.status.setBusy();

      var jobs = state.getJobStates().map(function (jobState) {
        return _this3.buildJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.status.setIdle();
    })
  }, {
    key: 'buildJob',
    value: _asyncToGenerator(function* (builder, jobState) {
      try {
        var statusCode = yield builder.run(jobState);
        builder.parseLogAndFdbFiles(jobState);

        var messages = jobState.getLogMessages() || [];
        for (var message of messages) {
          latex.log.showMessage(message);
        }

        if (statusCode > 0 || !jobState.getLogMessages() || !jobState.getOutputFilePath()) {
          this.showError(jobState);
        } else {
          if (this.shouldMoveResult(jobState)) {
            this.moveResult(jobState);
          }
          this.showResult(jobState);
        }
      } catch (error) {
        latex.log.error(error.message);
      }
    })
  }, {
    key: 'sync',
    value: _asyncToGenerator(function* () {
      var _this4 = this;

      var _getEditorDetails2 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!filePath || !this.isTexFile(filePath)) {
        return;
      }

      var _initializeBuild2 = this.initializeBuild(filePath, true);

      var builder = _initializeBuild2.builder;
      var state = _initializeBuild2.state;

      if (!builder) return false;

      var jobs = state.getJobStates().map(function (jobState) {
        return _this4.syncJob(filePath, lineNumber, builder, jobState);
      });

      yield Promise.all(jobs);
    })
  }, {
    key: 'syncJob',
    value: _asyncToGenerator(function* (filePath, lineNumber, builder, jobState) {
      var outputFilePath = this.resolveOutputFilePath(builder, jobState);
      if (!outputFilePath) {
        latex.log.warning('Could not resolve path to output file associated with the current file.');
        return;
      }

      yield latex.opener.open(outputFilePath, filePath, lineNumber);
    })
  }, {
    key: 'clean',
    value: _asyncToGenerator(function* () {
      var _this5 = this;

      var _getEditorDetails3 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails3.filePath;

      if (!filePath || !this.isTexFile(filePath)) {
        return false;
      }

      var _initializeBuild3 = this.initializeBuild(filePath, true);

      var builder = _initializeBuild3.builder;
      var state = _initializeBuild3.state;

      if (!builder) return false;

      latex.status.setBusy();
      latex.log.clear();

      var jobs = state.getJobStates().map(function (jobState) {
        return _this5.cleanJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.status.setIdle();
    })
  }, {
    key: 'cleanJob',
    value: _asyncToGenerator(function* (builder, jobState) {
      var generatedFiles = this.getGeneratedFileList(builder, jobState);
      var files = new Set();

      var patterns = this.getCleanPatterns(builder, jobState);

      for (var pattern of patterns) {
        // If the original pattern is absolute then we use it as a globbing pattern
        // after we join it to the root, otherwise we use it against the list of
        // generated files.
        if (pattern[0] === _path2['default'].sep) {
          var absolutePattern = _path2['default'].join(jobState.getProjectPath(), pattern);
          for (var file of _glob2['default'].sync(absolutePattern)) {
            files.add(_path2['default'].normalize(file));
          }
        } else {
          for (var file of generatedFiles.values()) {
            if ((0, _minimatch2['default'])(file, pattern)) {
              files.add(file);
            }
          }
        }
      }

      var fileNames = Array.from(files.values()).map(function (file) {
        return _path2['default'].basename(file);
      }).join(', ');
      latex.log.info('Cleaned: ' + fileNames);

      for (var file of files.values()) {
        _fsPlus2['default'].removeSync(file);
      }
    })
  }, {
    key: 'getCleanPatterns',
    value: function getCleanPatterns(builder, jobState) {
      var _path$parse2 = _path2['default'].parse(jobState.getFilePath());

      var name = _path$parse2.name;
      var ext = _path$parse2.ext;

      var outputDirectory = jobState.getOutputDirectory();
      var properties = {
        output_dir: outputDirectory ? outputDirectory + _path2['default'].sep : '',
        jobname: jobState.getJobName() || name,
        name: name,
        ext: ext
      };
      var patterns = jobState.getCleanPatterns();

      return patterns.map(function (pattern) {
        return _path2['default'].normalize((0, _werkzeug.replacePropertiesInString)(pattern, properties));
      });
    }
  }, {
    key: 'getGeneratedFileList',
    value: function getGeneratedFileList(builder, jobState) {
      var _path$parse3 = _path2['default'].parse(jobState.getFilePath());

      var dir = _path$parse3.dir;
      var name = _path$parse3.name;

      if (!jobState.getFileDatabase()) {
        builder.parseLogAndFdbFiles(jobState);
      }

      var pattern = _path2['default'].resolve(dir, jobState.getOutputDirectory(), (jobState.getJobName() || name) + '*');
      var files = new Set(_glob2['default'].sync(pattern));
      var fdb = jobState.getFileDatabase();

      if (fdb) {
        var generatedFiles = _lodash2['default'].flatten(_lodash2['default'].map(fdb, function (section) {
          return section.generated || [];
        }));

        for (var file of generatedFiles) {
          files.add(_path2['default'].resolve(dir, file));
        }
      }

      return files;
    }
  }, {
    key: 'moveResult',
    value: function moveResult(jobState) {
      var originalOutputFilePath = jobState.getOutputFilePath();
      var newOutputFilePath = this.alterParentPath(jobState.getFilePath(), originalOutputFilePath);
      jobState.setOutputFilePath(newOutputFilePath);
      if (_fsPlus2['default'].existsSync(originalOutputFilePath)) {
        _fsPlus2['default'].removeSync(newOutputFilePath);
        _fsPlus2['default'].moveSync(originalOutputFilePath, newOutputFilePath);
      }

      var originalSyncFilePath = originalOutputFilePath.replace(/\.pdf$/, '.synctex.gz');
      if (_fsPlus2['default'].existsSync(originalSyncFilePath)) {
        var syncFilePath = this.alterParentPath(jobState.getFilePath(), originalSyncFilePath);
        _fsPlus2['default'].removeSync(syncFilePath);
        _fsPlus2['default'].moveSync(originalSyncFilePath, syncFilePath);
      }
    }
  }, {
    key: 'resolveOutputFilePath',
    value: function resolveOutputFilePath(builder, jobState) {
      var outputFilePath = jobState.getOutputFilePath();
      if (outputFilePath) {
        return outputFilePath;
      }

      builder.parseLogAndFdbFiles(jobState);
      outputFilePath = jobState.getOutputFilePath();
      if (!outputFilePath) {
        latex.log.warning('Log file parsing failed!');
        return null;
      }

      if (this.shouldMoveResult(jobState)) {
        outputFilePath = this.alterParentPath(jobState.getFilePath(), outputFilePath);
        jobState.setOutputFilePath(outputFilePath);
      }

      return outputFilePath;
    }
  }, {
    key: 'showResult',
    value: _asyncToGenerator(function* (jobState) {
      if (!this.shouldOpenResult()) {
        return;
      }

      var _getEditorDetails4 = (0, _werkzeug.getEditorDetails)();

      var filePath = _getEditorDetails4.filePath;
      var lineNumber = _getEditorDetails4.lineNumber;

      yield latex.opener.open(jobState.getOutputFilePath(), filePath, lineNumber);
    })
  }, {
    key: 'showError',
    value: function showError(jobState) {
      if (!jobState.getLogMessages()) {
        latex.log.error('Parsing of log files failed.');
      } else if (!jobState.getOutputFilePath()) {
        latex.log.error('No output file detected.');
      }
    }
  }, {
    key: 'isTexFile',
    value: function isTexFile(filePath) {
      // TODO: Improve will suffice for the time being.
      return !filePath || filePath.search(/\.(tex|lhs|[rs]nw)$/i) > 0;
    }
  }, {
    key: 'alterParentPath',
    value: function alterParentPath(targetPath, originalPath) {
      var targetDir = _path2['default'].dirname(targetPath);
      return _path2['default'].join(targetDir, _path2['default'].basename(originalPath));
    }
  }, {
    key: 'shouldMoveResult',
    value: function shouldMoveResult(jobState) {
      return jobState.getMoveResultToSourceDirectory() && jobState.getOutputDirectory().length > 0;
    }
  }, {
    key: 'shouldOpenResult',
    value: function shouldOpenResult() {
      return atom.config.get('latex.openResultAfterBuild');
    }
  }]);

  return Composer;
})(_atom.Disposable);

exports['default'] = Composer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7c0JBQ1AsU0FBUzs7OztvQkFDUCxNQUFNOzs7O3dCQUNxQyxZQUFZOzt5QkFDbEQsV0FBVzs7OztvQkFDaEIsTUFBTTs7OztzQkFDTixTQUFTOzs7O29CQUNzQixNQUFNOzswQkFDL0IsZUFBZTs7OztrQ0FDZCx3QkFBd0I7Ozs7SUFFM0IsUUFBUTtZQUFSLFFBQVE7O0FBSWYsV0FKTyxRQUFRLEdBSVo7OzswQkFKSSxRQUFROztBQUt6QiwrQkFMaUIsUUFBUSw2Q0FLbkI7YUFBTSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUU7S0FBQSxFQUFDO1NBSnpDLFdBQVcsR0FBRywrQkFBeUI7U0FDdkMsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLEVBQUU7Ozs7QUFJM0IsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDMUQsYUFBSyxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0tBQ2xDLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBVGtCLFFBQVE7O1dBV1gseUJBQUMsUUFBUSxFQUF1QjtVQUFyQixXQUFXLHlEQUFHLEtBQUs7O0FBQzVDLFVBQUksS0FBSyxZQUFBLENBQUE7O0FBRVQsVUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN2RCxhQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QyxNQUFNO0FBQ0wsYUFBSyxHQUFHLDRCQUFlLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLFlBQUksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtB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QyxVQUFNLFNBQVMsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDMUMsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFLLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0tBQ3pEOzs7V0FFZ0IsMEJBQUMsUUFBUSxFQUFFO0FBQzFCLGFBQU8sUUFBUSxDQUFDLDhCQUE4QixFQUFFLElBQUksUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtLQUM3Rjs7O1dBRWdCLDRCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0tBQUU7OztTQWhZekQsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZ2V0RWRpdG9yRGV0YWlscywgcmVwbGFjZVByb3BlcnRpZXNJblN0cmluZyB9IGZyb20gJy4vd2Vya3pldWcnXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCdcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InXG5pbXBvcnQgeWFtbCBmcm9tICdqcy15YW1sJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgQnVpbGRTdGF0ZSBmcm9tICcuL2J1aWxkLXN0YXRlJ1xuaW1wb3J0IE1hZ2ljUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9tYWdpYy1wYXJzZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBjYWNoZWRCdWlsZFN0YXRlcyA9IG5ldyBNYXAoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlYnVpbGRDb21wbGV0ZWQgPSBuZXcgU2V0KClcbiAgICB9KSlcbiAgfVxuXG4gIGluaXRpYWxpemVCdWlsZCAoZmlsZVBhdGgsIGFsbG93Q2FjaGVkID0gZmFsc2UpIHtcbiAgICBsZXQgc3RhdGVcblxuICAgIGlmIChhbGxvd0NhY2hlZCAmJiB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmhhcyhmaWxlUGF0aCkpIHtcbiAgICAgIHN0YXRlID0gdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5nZXQoZmlsZVBhdGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlID0gbmV3IEJ1aWxkU3RhdGUoZmlsZVBhdGgpXG4gICAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbUNvbmZpZyhzdGF0ZSlcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tTWFnaWMoc3RhdGUpXG4gICAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbVNldHRpbmdzRmlsZShzdGF0ZSlcbiAgICAgIC8vIENoZWNrIGFnYWluIGluIGNhc2UgdGhlcmUgd2FzIGEgcm9vdCBjb21tZW50XG4gICAgICBjb25zdCBtYXN0ZXJGaWxlUGF0aCA9IHN0YXRlLmdldEZpbGVQYXRoKClcbiAgICAgIGlmIChmaWxlUGF0aCAhPT0gbWFzdGVyRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKGFsbG93Q2FjaGVkICYmIHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuaGFzKG1hc3RlckZpbGVQYXRoKSkge1xuICAgICAgICAgIHN0YXRlID0gdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5nZXQobWFzdGVyRmlsZVBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUuYWRkU3ViZmlsZShmaWxlUGF0aClcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGVCdWlsZFN0YXRlKHN0YXRlKVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5idWlsZGVyUmVnaXN0cnkuZ2V0QnVpbGRlcihzdGF0ZSlcbiAgICBpZiAoIWJ1aWxkZXIpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBObyByZWdpc3RlcmVkIExhVGVYIGJ1aWxkZXIgY2FuIHByb2Nlc3MgJHtzdGF0ZS5nZXRGaWxlUGF0aCgpfS5gKVxuICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc3RhdGUsIGJ1aWxkZXIgfVxuICB9XG5cbiAgY2FjaGVCdWlsZFN0YXRlIChzdGF0ZSkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gc3RhdGUuZ2V0RmlsZVBhdGgoKVxuICAgIGlmICh0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmhhcyhmaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5nZXQoZmlsZVBhdGgpXG4gICAgICBmb3IgKGNvbnN0IHN1YmZpbGUgb2Ygb2xkU3RhdGUuZ2V0U3ViZmlsZXMoKSkge1xuICAgICAgICB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmRlbGV0ZShzdWJmaWxlKVxuICAgICAgfVxuICAgICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5kZWxldGUoZmlsZVBhdGgpXG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5zZXQoZmlsZVBhdGgsIHN0YXRlKVxuICAgIGZvciAoY29uc3Qgc3ViZmlsZSBvZiBzdGF0ZS5nZXRTdWJmaWxlcygpKSB7XG4gICAgICB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLnNldChzdWJmaWxlLCBzdGF0ZSlcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Db25maWcgKHN0YXRlKSB7XG4gICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4JykpXG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzIChzdGF0ZSwgcHJvcGVydGllcykge1xuICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuXG5cbiAgICBpZiAocHJvcGVydGllcy5jbGVhblBhdHRlcm5zKSB7XG4gICAgICBzdGF0ZS5zZXRDbGVhblBhdHRlcm5zKHByb3BlcnRpZXMuY2xlYW5QYXR0ZXJucylcbiAgICB9XG5cbiAgICBpZiAoJ2VuYWJsZVN5bmN0ZXgnIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZVN5bmN0ZXgocHJvcGVydGllcy5lbmFibGVTeW5jdGV4KVxuICAgIH1cblxuICAgIGlmICgnZW5hYmxlU2hlbGxFc2NhcGUnIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZVNoZWxsRXNjYXBlKHByb3BlcnRpZXMuZW5hYmxlU2hlbGxFc2NhcGUpXG4gICAgfVxuXG4gICAgaWYgKCdlbmFibGVFeHRlbmRlZEJ1aWxkTW9kZScgaW4gcHJvcGVydGllcykge1xuICAgICAgc3RhdGUuc2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUocHJvcGVydGllcy5lbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5qb2JOYW1lcykge1xuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMocHJvcGVydGllcy5qb2JOYW1lcylcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMuam9ibmFtZXMpIHtcbiAgICAgIC8vIGpvYm5hbWVzIGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbWFnaWMgY29tbWVudHNcbiAgICAgIHN0YXRlLnNldEpvYk5hbWVzKHByb3BlcnRpZXMuam9ibmFtZXMpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLmpvYm5hbWUpIHtcbiAgICAgIC8vIGpvYm5hbWUgaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBTdWJsaW1lXG4gICAgICBzdGF0ZS5zZXRKb2JOYW1lcyhbcHJvcGVydGllcy5qb2JuYW1lXSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5jdXN0b21FbmdpbmUpIHtcbiAgICAgIHN0YXRlLnNldEVuZ2luZShwcm9wZXJ0aWVzLmN1c3RvbUVuZ2luZSlcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMuZW5naW5lKSB7XG4gICAgICBzdGF0ZS5zZXRFbmdpbmUocHJvcGVydGllcy5lbmdpbmUpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLnByb2dyYW0pIHtcbiAgICAgIC8vIHByb2dyYW0gaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBtYWdpYyBjb21tZW50c1xuICAgICAgc3RhdGUuc2V0RW5naW5lKHByb3BlcnRpZXMucHJvZ3JhbSlcbiAgICB9XG5cbiAgICBpZiAoJ21vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeScgaW4gcHJvcGVydGllcykge1xuICAgICAgc3RhdGUuc2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KHByb3BlcnRpZXMubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KVxuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzLm91dHB1dEZvcm1hdCkge1xuICAgICAgc3RhdGUuc2V0T3V0cHV0Rm9ybWF0KHByb3BlcnRpZXMub3V0cHV0Rm9ybWF0KVxuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy5mb3JtYXQpIHtcbiAgICAgIC8vIGZvcm1hdCBpcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG1hZ2ljIGNvbW1lbnRzXG4gICAgICBzdGF0ZS5zZXRPdXRwdXRGb3JtYXQocHJvcGVydGllcy5mb3JtYXQpXG4gICAgfVxuXG4gICAgaWYgKCdvdXRwdXREaXJlY3RvcnknIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldE91dHB1dERpcmVjdG9yeShwcm9wZXJ0aWVzLm91dHB1dERpcmVjdG9yeSlcbiAgICB9IGVsc2UgaWYgKCdvdXRwdXRfZGlyZWN0b3J5JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAvLyBvdXRwdXRfZGlyZWN0b3J5IGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggU3VibGltZVxuICAgICAgc3RhdGUuc2V0T3V0cHV0RGlyZWN0b3J5KHByb3BlcnRpZXMub3V0cHV0X2RpcmVjdG9yeSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5wcm9kdWNlcikge1xuICAgICAgc3RhdGUuc2V0UHJvZHVjZXIocHJvcGVydGllcy5wcm9kdWNlcilcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYyAoc3RhdGUpIHtcbiAgICBsZXQgbWFnaWMgPSB0aGlzLmdldE1hZ2ljKHN0YXRlKVxuXG4gICAgaWYgKG1hZ2ljLnJvb3QpIHtcbiAgICAgIHN0YXRlLnNldEZpbGVQYXRoKHBhdGgucmVzb2x2ZShzdGF0ZS5nZXRQcm9qZWN0UGF0aCgpLCBtYWdpYy5yb290KSlcbiAgICAgIG1hZ2ljID0gdGhpcy5nZXRNYWdpYyhzdGF0ZSlcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbVByb3BlcnRpZXMoc3RhdGUsIG1hZ2ljKVxuICB9XG5cbiAgZ2V0TWFnaWMgKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBNYWdpY1BhcnNlcihzdGF0ZS5nZXRGaWxlUGF0aCgpKS5wYXJzZSgpXG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21TZXR0aW5nc0ZpbGUgKHN0YXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGlyLCBuYW1lIH0gPSBwYXRoLnBhcnNlKHN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguZm9ybWF0KHsgZGlyLCBuYW1lLCBleHQ6ICcueWFtbCcgfSlcblxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHlhbWwuc2FmZUxvYWQoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKSlcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBjb25maWcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcihgUGFyc2luZyBvZiBwcm9qZWN0IGZpbGUgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBidWlsZCAoc2hvdWxkUmVidWlsZCkge1xuICAgIGxhdGV4LnByb2Nlc3Mua2lsbENoaWxkUHJvY2Vzc2VzKClcblxuICAgIGNvbnN0IHsgZWRpdG9yLCBmaWxlUGF0aCB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG5cbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnRmlsZSBuZWVkcyB0byBiZSBzYXZlZCB0byBkaXNrIGJlZm9yZSBpdCBjYW4gYmUgVGVYaWZpZWQuJylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpIC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgY29uc3QgeyBidWlsZGVyLCBzdGF0ZSB9ID0gdGhpcy5pbml0aWFsaXplQnVpbGQoZmlsZVBhdGgpXG4gICAgaWYgKCFidWlsZGVyKSByZXR1cm4gZmFsc2VcbiAgICBzdGF0ZS5zZXRTaG91bGRSZWJ1aWxkKHNob3VsZFJlYnVpbGQpXG5cbiAgICBpZiAodGhpcy5yZWJ1aWxkQ29tcGxldGVkICYmICF0aGlzLnJlYnVpbGRDb21wbGV0ZWQuaGFzKHN0YXRlLmdldEZpbGVQYXRoKCkpKSB7XG4gICAgICBzdGF0ZS5zZXRTaG91bGRSZWJ1aWxkKHRydWUpXG4gICAgICB0aGlzLnJlYnVpbGRDb21wbGV0ZWQuYWRkKHN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgfVxuXG4gICAgbGF0ZXgubG9nLmNsZWFyKClcbiAgICBsYXRleC5zdGF0dXMuc2V0QnVzeSgpXG5cbiAgICBjb25zdCBqb2JzID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKCkubWFwKGpvYlN0YXRlID0+IHRoaXMuYnVpbGRKb2IoYnVpbGRlciwgam9iU3RhdGUpKVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoam9icylcblxuICAgIGxhdGV4LnN0YXR1cy5zZXRJZGxlKClcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkSm9iIChidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4oam9iU3RhdGUpXG4gICAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gam9iU3RhdGUuZ2V0TG9nTWVzc2FnZXMoKSB8fCBbXVxuICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgIGxhdGV4LmxvZy5zaG93TWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdHVzQ29kZSA+IDAgfHwgIWpvYlN0YXRlLmdldExvZ01lc3NhZ2VzKCkgfHwgIWpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKCkpIHtcbiAgICAgICAgdGhpcy5zaG93RXJyb3Ioam9iU3RhdGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KGpvYlN0YXRlKSkge1xuICAgICAgICAgIHRoaXMubW92ZVJlc3VsdChqb2JTdGF0ZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dSZXN1bHQoam9iU3RhdGUpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcihlcnJvci5tZXNzYWdlKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN5bmMgKCkge1xuICAgIGNvbnN0IHsgZmlsZVBhdGgsIGxpbmVOdW1iZXIgfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgeyBidWlsZGVyLCBzdGF0ZSB9ID0gdGhpcy5pbml0aWFsaXplQnVpbGQoZmlsZVBhdGgsIHRydWUpXG4gICAgaWYgKCFidWlsZGVyKSByZXR1cm4gZmFsc2VcblxuICAgIGNvbnN0IGpvYnMgPSBzdGF0ZS5nZXRKb2JTdGF0ZXMoKS5tYXAoam9iU3RhdGUgPT4gdGhpcy5zeW5jSm9iKGZpbGVQYXRoLCBsaW5lTnVtYmVyLCBidWlsZGVyLCBqb2JTdGF0ZSkpXG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChqb2JzKVxuICB9XG5cbiAgYXN5bmMgc3luY0pvYiAoZmlsZVBhdGgsIGxpbmVOdW1iZXIsIGJ1aWxkZXIsIGpvYlN0YXRlKSB7XG4gICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSB0aGlzLnJlc29sdmVPdXRwdXRGaWxlUGF0aChidWlsZGVyLCBqb2JTdGF0ZSlcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnQ291bGQgbm90IHJlc29sdmUgcGF0aCB0byBvdXRwdXQgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZmlsZS4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgYXdhaXQgbGF0ZXgub3BlbmVyLm9wZW4ob3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICB9XG5cbiAgYXN5bmMgY2xlYW4gKCkge1xuICAgIGNvbnN0IHsgZmlsZVBhdGggfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgeyBidWlsZGVyLCBzdGF0ZSB9ID0gdGhpcy5pbml0aWFsaXplQnVpbGQoZmlsZVBhdGgsIHRydWUpXG4gICAgaWYgKCFidWlsZGVyKSByZXR1cm4gZmFsc2VcblxuICAgIGxhdGV4LnN0YXR1cy5zZXRCdXN5KClcbiAgICBsYXRleC5sb2cuY2xlYXIoKVxuXG4gICAgY29uc3Qgam9icyA9IHN0YXRlLmdldEpvYlN0YXRlcygpLm1hcChqb2JTdGF0ZSA9PiB0aGlzLmNsZWFuSm9iKGJ1aWxkZXIsIGpvYlN0YXRlKSlcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKGpvYnMpXG5cbiAgICBsYXRleC5zdGF0dXMuc2V0SWRsZSgpXG4gIH1cblxuICBhc3luYyBjbGVhbkpvYiAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRGaWxlcyA9IHRoaXMuZ2V0R2VuZXJhdGVkRmlsZUxpc3QoYnVpbGRlciwgam9iU3RhdGUpXG4gICAgbGV0IGZpbGVzID0gbmV3IFNldCgpXG5cbiAgICBjb25zdCBwYXR0ZXJucyA9IHRoaXMuZ2V0Q2xlYW5QYXR0ZXJucyhidWlsZGVyLCBqb2JTdGF0ZSlcblxuICAgIGZvciAoY29uc3QgcGF0dGVybiBvZiBwYXR0ZXJucykge1xuICAgICAgLy8gSWYgdGhlIG9yaWdpbmFsIHBhdHRlcm4gaXMgYWJzb2x1dGUgdGhlbiB3ZSB1c2UgaXQgYXMgYSBnbG9iYmluZyBwYXR0ZXJuXG4gICAgICAvLyBhZnRlciB3ZSBqb2luIGl0IHRvIHRoZSByb290LCBvdGhlcndpc2Ugd2UgdXNlIGl0IGFnYWluc3QgdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIGdlbmVyYXRlZCBmaWxlcy5cbiAgICAgIGlmIChwYXR0ZXJuWzBdID09PSBwYXRoLnNlcCkge1xuICAgICAgICBjb25zdCBhYnNvbHV0ZVBhdHRlcm4gPSBwYXRoLmpvaW4oam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgcGF0dGVybilcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGdsb2Iuc3luYyhhYnNvbHV0ZVBhdHRlcm4pKSB7XG4gICAgICAgICAgZmlsZXMuYWRkKHBhdGgubm9ybWFsaXplKGZpbGUpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2VuZXJhdGVkRmlsZXMudmFsdWVzKCkpIHtcbiAgICAgICAgICBpZiAobWluaW1hdGNoKGZpbGUsIHBhdHRlcm4pKSB7XG4gICAgICAgICAgICBmaWxlcy5hZGQoZmlsZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmaWxlTmFtZXMgPSBBcnJheS5mcm9tKGZpbGVzLnZhbHVlcygpKS5tYXAoZmlsZSA9PiBwYXRoLmJhc2VuYW1lKGZpbGUpKS5qb2luKCcsICcpXG4gICAgbGF0ZXgubG9nLmluZm8oJ0NsZWFuZWQ6ICcgKyBmaWxlTmFtZXMpXG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMudmFsdWVzKCkpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMoZmlsZSlcbiAgICB9XG4gIH1cblxuICBnZXRDbGVhblBhdHRlcm5zIChidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgZXh0IH0gPSBwYXRoLnBhcnNlKGpvYlN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gam9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KClcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0ge1xuICAgICAgb3V0cHV0X2Rpcjogb3V0cHV0RGlyZWN0b3J5ID8gb3V0cHV0RGlyZWN0b3J5ICsgcGF0aC5zZXAgOiAnJyxcbiAgICAgIGpvYm5hbWU6IGpvYlN0YXRlLmdldEpvYk5hbWUoKSB8fCBuYW1lLFxuICAgICAgbmFtZSxcbiAgICAgIGV4dFxuICAgIH1cbiAgICBjb25zdCBwYXR0ZXJucyA9IGpvYlN0YXRlLmdldENsZWFuUGF0dGVybnMoKVxuXG4gICAgcmV0dXJuIHBhdHRlcm5zLm1hcChwYXR0ZXJuID0+IHBhdGgubm9ybWFsaXplKHJlcGxhY2VQcm9wZXJ0aWVzSW5TdHJpbmcocGF0dGVybiwgcHJvcGVydGllcykpKVxuICB9XG5cbiAgZ2V0R2VuZXJhdGVkRmlsZUxpc3QgKGJ1aWxkZXIsIGpvYlN0YXRlKSB7XG4gICAgY29uc3QgeyBkaXIsIG5hbWUgfSA9IHBhdGgucGFyc2Uoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSlcbiAgICBpZiAoIWpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpKSB7XG4gICAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG4gICAgfVxuXG4gICAgY29uc3QgcGF0dGVybiA9IHBhdGgucmVzb2x2ZShkaXIsIGpvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpLCBgJHtqb2JTdGF0ZS5nZXRKb2JOYW1lKCkgfHwgbmFtZX0qYClcbiAgICBjb25zdCBmaWxlcyA9IG5ldyBTZXQoZ2xvYi5zeW5jKHBhdHRlcm4pKVxuICAgIGNvbnN0IGZkYiA9IGpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpXG5cbiAgICBpZiAoZmRiKSB7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRGaWxlcyA9IF8uZmxhdHRlbihfLm1hcChmZGIsIHNlY3Rpb24gPT4gc2VjdGlvbi5nZW5lcmF0ZWQgfHwgW10pKVxuXG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2VuZXJhdGVkRmlsZXMpIHtcbiAgICAgICAgZmlsZXMuYWRkKHBhdGgucmVzb2x2ZShkaXIsIGZpbGUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWxlc1xuICB9XG5cbiAgbW92ZVJlc3VsdCAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoID0gam9iU3RhdGUuZ2V0T3V0cHV0RmlsZVBhdGgoKVxuICAgIGNvbnN0IG5ld091dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aClcbiAgICBqb2JTdGF0ZS5zZXRPdXRwdXRGaWxlUGF0aChuZXdPdXRwdXRGaWxlUGF0aClcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhuZXdPdXRwdXRGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIG5ld091dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU3luY0ZpbGVQYXRoID0gb3JpZ2luYWxPdXRwdXRGaWxlUGF0aC5yZXBsYWNlKC9cXC5wZGYkLywgJy5zeW5jdGV4Lmd6JylcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHN5bmNGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGpvYlN0YXRlLmdldEZpbGVQYXRoKCksIG9yaWdpbmFsU3luY0ZpbGVQYXRoKVxuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVPdXRwdXRGaWxlUGF0aCAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBsZXQgb3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgaWYgKG91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGhcbiAgICB9XG5cbiAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMoam9iU3RhdGUpXG4gICAgb3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoam9iU3RhdGUpKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGpvYlN0YXRlLmdldEZpbGVQYXRoKCksIG91dHB1dEZpbGVQYXRoKVxuICAgICAgam9iU3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgob3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dEZpbGVQYXRoXG4gIH1cblxuICBhc3luYyBzaG93UmVzdWx0IChqb2JTdGF0ZSkge1xuICAgIGlmICghdGhpcy5zaG91bGRPcGVuUmVzdWx0KCkpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IHsgZmlsZVBhdGgsIGxpbmVOdW1iZXIgfSA9IGdldEVkaXRvckRldGFpbHMoKVxuICAgIGF3YWl0IGxhdGV4Lm9wZW5lci5vcGVuKGpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKCksIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICB9XG5cbiAgc2hvd0Vycm9yIChqb2JTdGF0ZSkge1xuICAgIGlmICgham9iU3RhdGUuZ2V0TG9nTWVzc2FnZXMoKSkge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKCdQYXJzaW5nIG9mIGxvZyBmaWxlcyBmYWlsZWQuJylcbiAgICB9IGVsc2UgaWYgKCFqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoJ05vIG91dHB1dCBmaWxlIGRldGVjdGVkLicpXG4gICAgfVxuICB9XG5cbiAgaXNUZXhGaWxlIChmaWxlUGF0aCkge1xuICAgIC8vIFRPRE86IEltcHJvdmUgd2lsbCBzdWZmaWNlIGZvciB0aGUgdGltZSBiZWluZy5cbiAgICByZXR1cm4gIWZpbGVQYXRoIHx8IGZpbGVQYXRoLnNlYXJjaCgvXFwuKHRleHxsaHN8W3JzXW53KSQvaSkgPiAwXG4gIH1cblxuICBhbHRlclBhcmVudFBhdGggKHRhcmdldFBhdGgsIG9yaWdpbmFsUGF0aCkge1xuICAgIGNvbnN0IHRhcmdldERpciA9IHBhdGguZGlybmFtZSh0YXJnZXRQYXRoKVxuICAgIHJldHVybiBwYXRoLmpvaW4odGFyZ2V0RGlyLCBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCkpXG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0IChqb2JTdGF0ZSkge1xuICAgIHJldHVybiBqb2JTdGF0ZS5nZXRNb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkoKSAmJiBqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKS5sZW5ndGggPiAwXG4gIH1cblxuICBzaG91bGRPcGVuUmVzdWx0ICgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3BlblJlc3VsdEFmdGVyQnVpbGQnKSB9XG59XG4iXX0=