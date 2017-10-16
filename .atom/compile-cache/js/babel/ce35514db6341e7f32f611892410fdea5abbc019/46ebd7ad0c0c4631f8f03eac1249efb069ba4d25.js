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

      var label = state.getShouldRebuild() ? 'LaTeX Rebuild' : 'LaTeX Build';

      latex.status.show(label, 'highlight', 'sync', true, 'Click to kill LaTeX build.', function () {
        return latex.process.killChildProcesses();
      });
      latex.log.group(label);

      var jobs = state.getJobStates().map(function (jobState) {
        return _this3.buildJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.log.groupEnd();
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

      latex.log.group('LaTeX Clean');

      var jobs = state.getJobStates().map(function (jobState) {
        return _this5.cleanJob(builder, jobState);
      });

      yield Promise.all(jobs);

      latex.log.groupEnd();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7c0JBQ1AsU0FBUzs7OztvQkFDUCxNQUFNOzs7O3dCQUNxQyxZQUFZOzt5QkFDbEQsV0FBVzs7OztvQkFDaEIsTUFBTTs7OztzQkFDTixTQUFTOzs7O29CQUNzQixNQUFNOzswQkFDL0IsZUFBZTs7OztrQ0FDZCx3QkFBd0I7Ozs7SUFFM0IsUUFBUTtZQUFSLFFBQVE7O0FBSWYsV0FKTyxRQUFRLEdBSVo7OzswQkFKSSxRQUFROztBQUt6QiwrQkFMaUIsUUFBUSw2Q0FLbkI7YUFBTSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUU7S0FBQSxFQUFDO1NBSnpDLFdBQVcsR0FBRywrQkFBeUI7U0FDdkMsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLEVBQUU7Ozs7QUFJM0IsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDMUQsYUFBSyxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0tBQ2xDLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBVGtCLFFBQVE7O1dBV1gseUJBQUMsUUFBUSxFQUF1QjtVQUFyQixXQUFXLHlEQUFHLEtBQUs7O0FBQzVDLFVBQUksS0FBSyxZQUFBLENBQUE7O0FBRVQsVUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN2RCxhQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QyxNQUFNO0FBQ0wsYUFBSyxHQUFHLDRCQUFlLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLFlBQUksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtB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QztLQUNGOzs7V0FFUyxtQkFBQyxRQUFRLEVBQUU7O0FBRW5CLGFBQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNoRTs7O1dBRWUseUJBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtBQUN6QyxVQUFNLFNBQVMsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDMUMsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFLLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0tBQ3pEOzs7V0FFZ0IsMEJBQUMsUUFBUSxFQUFFO0FBQzFCLGFBQU8sUUFBUSxDQUFDLDhCQUE4QixFQUFFLElBQUksUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtLQUM3Rjs7O1dBRWdCLDRCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0tBQUU7OztTQWpZekQsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZ2V0RWRpdG9yRGV0YWlscywgcmVwbGFjZVByb3BlcnRpZXNJblN0cmluZyB9IGZyb20gJy4vd2Vya3pldWcnXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCdcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InXG5pbXBvcnQgeWFtbCBmcm9tICdqcy15YW1sJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgQnVpbGRTdGF0ZSBmcm9tICcuL2J1aWxkLXN0YXRlJ1xuaW1wb3J0IE1hZ2ljUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9tYWdpYy1wYXJzZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBjYWNoZWRCdWlsZFN0YXRlcyA9IG5ldyBNYXAoKVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigoKSA9PiB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGF0ZXgnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlYnVpbGRDb21wbGV0ZWQgPSBuZXcgU2V0KClcbiAgICB9KSlcbiAgfVxuXG4gIGluaXRpYWxpemVCdWlsZCAoZmlsZVBhdGgsIGFsbG93Q2FjaGVkID0gZmFsc2UpIHtcbiAgICBsZXQgc3RhdGVcblxuICAgIGlmIChhbGxvd0NhY2hlZCAmJiB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmhhcyhmaWxlUGF0aCkpIHtcbiAgICAgIHN0YXRlID0gdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5nZXQoZmlsZVBhdGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlID0gbmV3IEJ1aWxkU3RhdGUoZmlsZVBhdGgpXG4gICAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbUNvbmZpZyhzdGF0ZSlcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tTWFnaWMoc3RhdGUpXG4gICAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbVNldHRpbmdzRmlsZShzdGF0ZSlcbiAgICAgIC8vIENoZWNrIGFnYWluIGluIGNhc2UgdGhlcmUgd2FzIGEgcm9vdCBjb21tZW50XG4gICAgICBjb25zdCBtYXN0ZXJGaWxlUGF0aCA9IHN0YXRlLmdldEZpbGVQYXRoKClcbiAgICAgIGlmIChmaWxlUGF0aCAhPT0gbWFzdGVyRmlsZVBhdGgpIHtcbiAgICAgICAgaWYgKGFsbG93Q2FjaGVkICYmIHRoaXMuY2FjaGVkQnVpbGRTdGF0ZXMuaGFzKG1hc3RlckZpbGVQYXRoKSkge1xuICAgICAgICAgIHN0YXRlID0gdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5nZXQobWFzdGVyRmlsZVBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUuYWRkU3ViZmlsZShmaWxlUGF0aClcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGVCdWlsZFN0YXRlKHN0YXRlKVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5idWlsZGVyUmVnaXN0cnkuZ2V0QnVpbGRlcihzdGF0ZSlcbiAgICBpZiAoIWJ1aWxkZXIpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBObyByZWdpc3RlcmVkIExhVGVYIGJ1aWxkZXIgY2FuIHByb2Nlc3MgJHtzdGF0ZS5nZXRGaWxlUGF0aCgpfS5gKVxuICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc3RhdGUsIGJ1aWxkZXIgfVxuICB9XG5cbiAgY2FjaGVCdWlsZFN0YXRlIChzdGF0ZSkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gc3RhdGUuZ2V0RmlsZVBhdGgoKVxuICAgIGlmICh0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmhhcyhmaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5nZXQoZmlsZVBhdGgpXG4gICAgICBmb3IgKGNvbnN0IHN1YmZpbGUgb2Ygb2xkU3RhdGUuZ2V0U3ViZmlsZXMoKSkge1xuICAgICAgICB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLmRlbGV0ZShzdWJmaWxlKVxuICAgICAgfVxuICAgICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5kZWxldGUoZmlsZVBhdGgpXG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZWRCdWlsZFN0YXRlcy5zZXQoZmlsZVBhdGgsIHN0YXRlKVxuICAgIGZvciAoY29uc3Qgc3ViZmlsZSBvZiBzdGF0ZS5nZXRTdWJmaWxlcygpKSB7XG4gICAgICB0aGlzLmNhY2hlZEJ1aWxkU3RhdGVzLnNldChzdWJmaWxlLCBzdGF0ZSlcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Db25maWcgKHN0YXRlKSB7XG4gICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4JykpXG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzIChzdGF0ZSwgcHJvcGVydGllcykge1xuICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuXG5cbiAgICBpZiAocHJvcGVydGllcy5jbGVhblBhdHRlcm5zKSB7XG4gICAgICBzdGF0ZS5zZXRDbGVhblBhdHRlcm5zKHByb3BlcnRpZXMuY2xlYW5QYXR0ZXJucylcbiAgICB9XG5cbiAgICBpZiAoJ2VuYWJsZVN5bmN0ZXgnIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZVN5bmN0ZXgocHJvcGVydGllcy5lbmFibGVTeW5jdGV4KVxuICAgIH1cblxuICAgIGlmICgnZW5hYmxlU2hlbGxFc2NhcGUnIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZVNoZWxsRXNjYXBlKHByb3BlcnRpZXMuZW5hYmxlU2hlbGxFc2NhcGUpXG4gICAgfVxuXG4gICAgaWYgKCdlbmFibGVFeHRlbmRlZEJ1aWxkTW9kZScgaW4gcHJvcGVydGllcykge1xuICAgICAgc3RhdGUuc2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUocHJvcGVydGllcy5lbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5qb2JOYW1lcykge1xuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMocHJvcGVydGllcy5qb2JOYW1lcylcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMuam9ibmFtZXMpIHtcbiAgICAgIC8vIGpvYm5hbWVzIGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbWFnaWMgY29tbWVudHNcbiAgICAgIHN0YXRlLnNldEpvYk5hbWVzKHByb3BlcnRpZXMuam9ibmFtZXMpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLmpvYm5hbWUpIHtcbiAgICAgIC8vIGpvYm5hbWUgaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBTdWJsaW1lXG4gICAgICBzdGF0ZS5zZXRKb2JOYW1lcyhbcHJvcGVydGllcy5qb2JuYW1lXSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5jdXN0b21FbmdpbmUpIHtcbiAgICAgIHN0YXRlLnNldEVuZ2luZShwcm9wZXJ0aWVzLmN1c3RvbUVuZ2luZSlcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMuZW5naW5lKSB7XG4gICAgICBzdGF0ZS5zZXRFbmdpbmUocHJvcGVydGllcy5lbmdpbmUpXG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0aWVzLnByb2dyYW0pIHtcbiAgICAgIC8vIHByb2dyYW0gaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBtYWdpYyBjb21tZW50c1xuICAgICAgc3RhdGUuc2V0RW5naW5lKHByb3BlcnRpZXMucHJvZ3JhbSlcbiAgICB9XG5cbiAgICBpZiAoJ21vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeScgaW4gcHJvcGVydGllcykge1xuICAgICAgc3RhdGUuc2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KHByb3BlcnRpZXMubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KVxuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzLm91dHB1dEZvcm1hdCkge1xuICAgICAgc3RhdGUuc2V0T3V0cHV0Rm9ybWF0KHByb3BlcnRpZXMub3V0cHV0Rm9ybWF0KVxuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy5mb3JtYXQpIHtcbiAgICAgIC8vIGZvcm1hdCBpcyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG1hZ2ljIGNvbW1lbnRzXG4gICAgICBzdGF0ZS5zZXRPdXRwdXRGb3JtYXQocHJvcGVydGllcy5mb3JtYXQpXG4gICAgfVxuXG4gICAgaWYgKCdvdXRwdXREaXJlY3RvcnknIGluIHByb3BlcnRpZXMpIHtcbiAgICAgIHN0YXRlLnNldE91dHB1dERpcmVjdG9yeShwcm9wZXJ0aWVzLm91dHB1dERpcmVjdG9yeSlcbiAgICB9IGVsc2UgaWYgKCdvdXRwdXRfZGlyZWN0b3J5JyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAvLyBvdXRwdXRfZGlyZWN0b3J5IGlzIGZvciBjb21wYXRpYmlsaXR5IHdpdGggU3VibGltZVxuICAgICAgc3RhdGUuc2V0T3V0cHV0RGlyZWN0b3J5KHByb3BlcnRpZXMub3V0cHV0X2RpcmVjdG9yeSlcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcy5wcm9kdWNlcikge1xuICAgICAgc3RhdGUuc2V0UHJvZHVjZXIocHJvcGVydGllcy5wcm9kdWNlcilcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYyAoc3RhdGUpIHtcbiAgICBsZXQgbWFnaWMgPSB0aGlzLmdldE1hZ2ljKHN0YXRlKVxuXG4gICAgaWYgKG1hZ2ljLnJvb3QpIHtcbiAgICAgIHN0YXRlLnNldEZpbGVQYXRoKHBhdGgucmVzb2x2ZShzdGF0ZS5nZXRQcm9qZWN0UGF0aCgpLCBtYWdpYy5yb290KSlcbiAgICAgIG1hZ2ljID0gdGhpcy5nZXRNYWdpYyhzdGF0ZSlcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbVByb3BlcnRpZXMoc3RhdGUsIG1hZ2ljKVxuICB9XG5cbiAgZ2V0TWFnaWMgKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBNYWdpY1BhcnNlcihzdGF0ZS5nZXRGaWxlUGF0aCgpKS5wYXJzZSgpXG4gIH1cblxuICBpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21TZXR0aW5nc0ZpbGUgKHN0YXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZGlyLCBuYW1lIH0gPSBwYXRoLnBhcnNlKHN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguZm9ybWF0KHsgZGlyLCBuYW1lLCBleHQ6ICcueWFtbCcgfSlcblxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHlhbWwuc2FmZUxvYWQoZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKSlcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBjb25maWcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcihgUGFyc2luZyBvZiBwcm9qZWN0IGZpbGUgZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBidWlsZCAoc2hvdWxkUmVidWlsZCkge1xuICAgIGxhdGV4LnByb2Nlc3Mua2lsbENoaWxkUHJvY2Vzc2VzKClcblxuICAgIGNvbnN0IHsgZWRpdG9yLCBmaWxlUGF0aCB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG5cbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnRmlsZSBuZWVkcyB0byBiZSBzYXZlZCB0byBkaXNrIGJlZm9yZSBpdCBjYW4gYmUgVGVYaWZpZWQuJylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpIC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgY29uc3QgeyBidWlsZGVyLCBzdGF0ZSB9ID0gdGhpcy5pbml0aWFsaXplQnVpbGQoZmlsZVBhdGgpXG4gICAgaWYgKCFidWlsZGVyKSByZXR1cm4gZmFsc2VcbiAgICBzdGF0ZS5zZXRTaG91bGRSZWJ1aWxkKHNob3VsZFJlYnVpbGQpXG5cbiAgICBpZiAodGhpcy5yZWJ1aWxkQ29tcGxldGVkICYmICF0aGlzLnJlYnVpbGRDb21wbGV0ZWQuaGFzKHN0YXRlLmdldEZpbGVQYXRoKCkpKSB7XG4gICAgICBzdGF0ZS5zZXRTaG91bGRSZWJ1aWxkKHRydWUpXG4gICAgICB0aGlzLnJlYnVpbGRDb21wbGV0ZWQuYWRkKHN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWwgPSBzdGF0ZS5nZXRTaG91bGRSZWJ1aWxkKCkgPyAnTGFUZVggUmVidWlsZCcgOiAnTGFUZVggQnVpbGQnXG5cbiAgICBsYXRleC5zdGF0dXMuc2hvdyhsYWJlbCwgJ2hpZ2hsaWdodCcsICdzeW5jJywgdHJ1ZSwgJ0NsaWNrIHRvIGtpbGwgTGFUZVggYnVpbGQuJywgKCkgPT4gbGF0ZXgucHJvY2Vzcy5raWxsQ2hpbGRQcm9jZXNzZXMoKSlcbiAgICBsYXRleC5sb2cuZ3JvdXAobGFiZWwpXG5cbiAgICBjb25zdCBqb2JzID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKCkubWFwKGpvYlN0YXRlID0+IHRoaXMuYnVpbGRKb2IoYnVpbGRlciwgam9iU3RhdGUpKVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoam9icylcblxuICAgIGxhdGV4LmxvZy5ncm91cEVuZCgpXG4gIH1cblxuICBhc3luYyBidWlsZEpvYiAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdHVzQ29kZSA9IGF3YWl0IGJ1aWxkZXIucnVuKGpvYlN0YXRlKVxuICAgICAgYnVpbGRlci5wYXJzZUxvZ0FuZEZkYkZpbGVzKGpvYlN0YXRlKVxuXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGpvYlN0YXRlLmdldExvZ01lc3NhZ2VzKCkgfHwgW11cbiAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgICBsYXRleC5sb2cuc2hvd01lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXR1c0NvZGUgPiAwIHx8ICFqb2JTdGF0ZS5nZXRMb2dNZXNzYWdlcygpIHx8ICFqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpKSB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKGpvYlN0YXRlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkTW92ZVJlc3VsdChqb2JTdGF0ZSkpIHtcbiAgICAgICAgICB0aGlzLm1vdmVSZXN1bHQoam9iU3RhdGUpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93UmVzdWx0KGpvYlN0YXRlKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoZXJyb3IubWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICBhc3luYyBzeW5jICgpIHtcbiAgICBjb25zdCB7IGZpbGVQYXRoLCBsaW5lTnVtYmVyIH0gPSBnZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgYnVpbGRlciwgc3RhdGUgfSA9IHRoaXMuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoLCB0cnVlKVxuICAgIGlmICghYnVpbGRlcikgcmV0dXJuIGZhbHNlXG5cbiAgICBjb25zdCBqb2JzID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKCkubWFwKGpvYlN0YXRlID0+IHRoaXMuc3luY0pvYihmaWxlUGF0aCwgbGluZU51bWJlciwgYnVpbGRlciwgam9iU3RhdGUpKVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoam9icylcbiAgfVxuXG4gIGFzeW5jIHN5bmNKb2IgKGZpbGVQYXRoLCBsaW5lTnVtYmVyLCBidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoYnVpbGRlciwgam9iU3RhdGUpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0NvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF3YWl0IGxhdGV4Lm9wZW5lci5vcGVuKG91dHB1dEZpbGVQYXRoLCBmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgfVxuXG4gIGFzeW5jIGNsZWFuICgpIHtcbiAgICBjb25zdCB7IGZpbGVQYXRoIH0gPSBnZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHsgYnVpbGRlciwgc3RhdGUgfSA9IHRoaXMuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoLCB0cnVlKVxuICAgIGlmICghYnVpbGRlcikgcmV0dXJuIGZhbHNlXG5cbiAgICBsYXRleC5sb2cuZ3JvdXAoJ0xhVGVYIENsZWFuJylcblxuICAgIGNvbnN0IGpvYnMgPSBzdGF0ZS5nZXRKb2JTdGF0ZXMoKS5tYXAoam9iU3RhdGUgPT4gdGhpcy5jbGVhbkpvYihidWlsZGVyLCBqb2JTdGF0ZSkpXG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChqb2JzKVxuXG4gICAgbGF0ZXgubG9nLmdyb3VwRW5kKClcbiAgfVxuXG4gIGFzeW5jIGNsZWFuSm9iIChidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGdlbmVyYXRlZEZpbGVzID0gdGhpcy5nZXRHZW5lcmF0ZWRGaWxlTGlzdChidWlsZGVyLCBqb2JTdGF0ZSlcbiAgICBsZXQgZmlsZXMgPSBuZXcgU2V0KClcblxuICAgIGNvbnN0IHBhdHRlcm5zID0gdGhpcy5nZXRDbGVhblBhdHRlcm5zKGJ1aWxkZXIsIGpvYlN0YXRlKVxuXG4gICAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIHBhdHRlcm5zKSB7XG4gICAgICAvLyBJZiB0aGUgb3JpZ2luYWwgcGF0dGVybiBpcyBhYnNvbHV0ZSB0aGVuIHdlIHVzZSBpdCBhcyBhIGdsb2JiaW5nIHBhdHRlcm5cbiAgICAgIC8vIGFmdGVyIHdlIGpvaW4gaXQgdG8gdGhlIHJvb3QsIG90aGVyd2lzZSB3ZSB1c2UgaXQgYWdhaW5zdCB0aGUgbGlzdCBvZlxuICAgICAgLy8gZ2VuZXJhdGVkIGZpbGVzLlxuICAgICAgaWYgKHBhdHRlcm5bMF0gPT09IHBhdGguc2VwKSB7XG4gICAgICAgIGNvbnN0IGFic29sdXRlUGF0dGVybiA9IHBhdGguam9pbihqb2JTdGF0ZS5nZXRQcm9qZWN0UGF0aCgpLCBwYXR0ZXJuKVxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZ2xvYi5zeW5jKGFic29sdXRlUGF0dGVybikpIHtcbiAgICAgICAgICBmaWxlcy5hZGQocGF0aC5ub3JtYWxpemUoZmlsZSkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBnZW5lcmF0ZWRGaWxlcy52YWx1ZXMoKSkge1xuICAgICAgICAgIGlmIChtaW5pbWF0Y2goZmlsZSwgcGF0dGVybikpIHtcbiAgICAgICAgICAgIGZpbGVzLmFkZChmaWxlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZpbGVOYW1lcyA9IEFycmF5LmZyb20oZmlsZXMudmFsdWVzKCkpLm1hcChmaWxlID0+IHBhdGguYmFzZW5hbWUoZmlsZSkpLmpvaW4oJywgJylcbiAgICBsYXRleC5sb2cuaW5mbygnQ2xlYW5lZDogJyArIGZpbGVOYW1lcylcblxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcy52YWx1ZXMoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhmaWxlKVxuICAgIH1cbiAgfVxuXG4gIGdldENsZWFuUGF0dGVybnMgKGJ1aWxkZXIsIGpvYlN0YXRlKSB7XG4gICAgY29uc3QgeyBuYW1lLCBleHQgfSA9IHBhdGgucGFyc2Uoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSlcbiAgICBjb25zdCBvdXRwdXREaXJlY3RvcnkgPSBqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKVxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7XG4gICAgICBvdXRwdXRfZGlyOiBvdXRwdXREaXJlY3RvcnkgPyBvdXRwdXREaXJlY3RvcnkgKyBwYXRoLnNlcCA6ICcnLFxuICAgICAgam9ibmFtZTogam9iU3RhdGUuZ2V0Sm9iTmFtZSgpIHx8IG5hbWUsXG4gICAgICBuYW1lLFxuICAgICAgZXh0XG4gICAgfVxuICAgIGNvbnN0IHBhdHRlcm5zID0gam9iU3RhdGUuZ2V0Q2xlYW5QYXR0ZXJucygpXG5cbiAgICByZXR1cm4gcGF0dGVybnMubWFwKHBhdHRlcm4gPT4gcGF0aC5ub3JtYWxpemUocmVwbGFjZVByb3BlcnRpZXNJblN0cmluZyhwYXR0ZXJuLCBwcm9wZXJ0aWVzKSkpXG4gIH1cblxuICBnZXRHZW5lcmF0ZWRGaWxlTGlzdCAoYnVpbGRlciwgam9iU3RhdGUpIHtcbiAgICBjb25zdCB7IGRpciwgbmFtZSB9ID0gcGF0aC5wYXJzZShqb2JTdGF0ZS5nZXRGaWxlUGF0aCgpKVxuICAgIGlmICgham9iU3RhdGUuZ2V0RmlsZURhdGFiYXNlKCkpIHtcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dBbmRGZGJGaWxlcyhqb2JTdGF0ZSlcbiAgICB9XG5cbiAgICBjb25zdCBwYXR0ZXJuID0gcGF0aC5yZXNvbHZlKGRpciwgam9iU3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCksIGAke2pvYlN0YXRlLmdldEpvYk5hbWUoKSB8fCBuYW1lfSpgKVxuICAgIGNvbnN0IGZpbGVzID0gbmV3IFNldChnbG9iLnN5bmMocGF0dGVybikpXG4gICAgY29uc3QgZmRiID0gam9iU3RhdGUuZ2V0RmlsZURhdGFiYXNlKClcblxuICAgIGlmIChmZGIpIHtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEZpbGVzID0gXy5mbGF0dGVuKF8ubWFwKGZkYiwgc2VjdGlvbiA9PiBzZWN0aW9uLmdlbmVyYXRlZCB8fCBbXSkpXG5cbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBnZW5lcmF0ZWRGaWxlcykge1xuICAgICAgICBmaWxlcy5hZGQocGF0aC5yZXNvbHZlKGRpciwgZmlsZSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVzXG4gIH1cblxuICBtb3ZlUmVzdWx0IChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGggPSBqb2JTdGF0ZS5nZXRPdXRwdXRGaWxlUGF0aCgpXG4gICAgY29uc3QgbmV3T3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChqb2JTdGF0ZS5nZXRGaWxlUGF0aCgpLCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoKVxuICAgIGpvYlN0YXRlLnNldE91dHB1dEZpbGVQYXRoKG5ld091dHB1dEZpbGVQYXRoKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKG5ld091dHB1dEZpbGVQYXRoKVxuICAgICAgZnMubW92ZVN5bmMob3JpZ2luYWxPdXRwdXRGaWxlUGF0aCwgbmV3T3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTeW5jRmlsZVBhdGggPSBvcmlnaW5hbE91dHB1dEZpbGVQYXRoLnJlcGxhY2UoL1xcLnBkZiQvLCAnLnN5bmN0ZXguZ3onKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoKSkge1xuICAgICAgY29uc3Qgc3luY0ZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSwgb3JpZ2luYWxTeW5jRmlsZVBhdGgpXG4gICAgICBmcy5yZW1vdmVTeW5jKHN5bmNGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoLCBzeW5jRmlsZVBhdGgpXG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZU91dHB1dEZpbGVQYXRoIChidWlsZGVyLCBqb2JTdGF0ZSkge1xuICAgIGxldCBvdXRwdXRGaWxlUGF0aCA9IGpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKClcbiAgICBpZiAob3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBvdXRwdXRGaWxlUGF0aFxuICAgIH1cblxuICAgIGJ1aWxkZXIucGFyc2VMb2dBbmRGZGJGaWxlcyhqb2JTdGF0ZSlcbiAgICBvdXRwdXRGaWxlUGF0aCA9IGpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKClcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnTG9nIGZpbGUgcGFyc2luZyBmYWlsZWQhJylcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkTW92ZVJlc3VsdChqb2JTdGF0ZSkpIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSwgb3V0cHV0RmlsZVBhdGgpXG4gICAgICBqb2JTdGF0ZS5zZXRPdXRwdXRGaWxlUGF0aChvdXRwdXRGaWxlUGF0aClcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGhcbiAgfVxuXG4gIGFzeW5jIHNob3dSZXN1bHQgKGpvYlN0YXRlKSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZE9wZW5SZXN1bHQoKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgeyBmaWxlUGF0aCwgbGluZU51bWJlciB9ID0gZ2V0RWRpdG9yRGV0YWlscygpXG4gICAgYXdhaXQgbGF0ZXgub3BlbmVyLm9wZW4oam9iU3RhdGUuZ2V0T3V0cHV0RmlsZVBhdGgoKSwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gIH1cblxuICBzaG93RXJyb3IgKGpvYlN0YXRlKSB7XG4gICAgaWYgKCFqb2JTdGF0ZS5nZXRMb2dNZXNzYWdlcygpKSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoJ1BhcnNpbmcgb2YgbG9nIGZpbGVzIGZhaWxlZC4nKVxuICAgIH0gZWxzZSBpZiAoIWpvYlN0YXRlLmdldE91dHB1dEZpbGVQYXRoKCkpIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcignTm8gb3V0cHV0IGZpbGUgZGV0ZWN0ZWQuJylcbiAgICB9XG4gIH1cblxuICBpc1RleEZpbGUgKGZpbGVQYXRoKSB7XG4gICAgLy8gVE9ETzogSW1wcm92ZSB3aWxsIHN1ZmZpY2UgZm9yIHRoZSB0aW1lIGJlaW5nLlxuICAgIHJldHVybiAhZmlsZVBhdGggfHwgZmlsZVBhdGguc2VhcmNoKC9cXC4odGV4fGxoc3xbcnNdbncpJC9pKSA+IDBcbiAgfVxuXG4gIGFsdGVyUGFyZW50UGF0aCAodGFyZ2V0UGF0aCwgb3JpZ2luYWxQYXRoKSB7XG4gICAgY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5kaXJuYW1lKHRhcmdldFBhdGgpXG4gICAgcmV0dXJuIHBhdGguam9pbih0YXJnZXREaXIsIHBhdGguYmFzZW5hbWUob3JpZ2luYWxQYXRoKSlcbiAgfVxuXG4gIHNob3VsZE1vdmVSZXN1bHQgKGpvYlN0YXRlKSB7XG4gICAgcmV0dXJuIGpvYlN0YXRlLmdldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSgpICYmIGpvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpLmxlbmd0aCA+IDBcbiAgfVxuXG4gIHNob3VsZE9wZW5SZXN1bHQgKCkgeyByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0QWZ0ZXJCdWlsZCcpIH1cbn1cbiJdfQ==