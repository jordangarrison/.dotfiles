function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libWerkzeug = require('../lib/werkzeug');

var _libWerkzeug2 = _interopRequireDefault(_libWerkzeug);

var _libComposer = require('../lib/composer');

var _libComposer2 = _interopRequireDefault(_libComposer);

var _libBuildState = require('../lib/build-state');

var _libBuildState2 = _interopRequireDefault(_libBuildState);

describe('Composer', function () {
  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });
  });

  describe('build', function () {
    var editor = undefined,
        builder = undefined,
        composer = undefined;

    function initializeSpies(filePath) {
      var jobNames = arguments.length <= 1 || arguments[1] === undefined ? [null] : arguments[1];
      var statusCode = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      editor = jasmine.createSpyObj('MockEditor', ['save', 'isModified']);
      spyOn(composer, 'initializeBuildStateFromMagic').andCallFake(function (state) {
        state.setJobNames(jobNames);
      });
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ editor: editor, filePath: filePath });

      builder = jasmine.createSpyObj('MockBuilder', ['run', 'constructArgs', 'parseLogAndFdbFiles']);
      builder.run.andCallFake(function () {
        switch (statusCode) {
          case 0:
            {
              return Promise.resolve(statusCode);
            }
        }

        return Promise.reject(statusCode);
      });
      spyOn(latex.builderRegistry, 'getBuilder').andReturn(builder);
    }

    beforeEach(function () {
      composer = new _libComposer2['default']();
      spyOn(composer, 'showResult').andReturn();
      spyOn(composer, 'showError').andReturn();
    });

    it('does nothing for new, unsaved files', function () {
      initializeSpies(null);

      var result = 'aaaaaaaaaaaa';
      waitsForPromise(function () {
        return composer.build().then(function (r) {
          result = r;
        });
      });

      runs(function () {
        expect(result).toBe(false);
        expect(composer.showResult).not.toHaveBeenCalled();
        expect(composer.showError).not.toHaveBeenCalled();
      });
    });

    it('does nothing for unsupported file extensions', function () {
      initializeSpies('foo.bar');
      latex.builderRegistry.getBuilder.andReturn(null);

      var result = undefined;
      waitsForPromise(function () {
        return composer.build().then(function (r) {
          result = r;
        });
      });

      runs(function () {
        expect(result).toBe(false);
        expect(composer.showResult).not.toHaveBeenCalled();
        expect(composer.showError).not.toHaveBeenCalled();
      });
    });

    it('saves the file before building, if modified', function () {
      initializeSpies('file.tex');
      editor.isModified.andReturn(true);

      builder.parseLogAndFdbFiles.andReturn({
        outputFilePath: 'file.pdf',
        messages: []
      });

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(editor.isModified).toHaveBeenCalled();
        expect(editor.save).toHaveBeenCalled();
      });
    });

    it('runs the build two times with multiple job names', function () {
      initializeSpies('file.tex', ['foo', 'bar']);

      builder.parseLogAndFdbFiles.andReturn({
        outputFilePath: 'file.pdf',
        messages: []
      });

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(builder.run.callCount).toBe(2);
      });
    });

    it('invokes `showResult` after a successful build, with expected log parsing result', function () {
      initializeSpies('file.tex');
      builder.parseLogAndFdbFiles.andCallFake(function (state) {
        state.setLogMessages([]);
        state.setOutputFilePath('file.pdf');
      });

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(composer.showResult).toHaveBeenCalled();
      });
    });

    it('treats missing output file data in log file as an error', function () {
      initializeSpies('file.tex');
      builder.parseLogAndFdbFiles.andCallFake(function (state) {
        state.setLogMessages([]);
      });

      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it('treats missing result from parser as an error', function () {
      initializeSpies('file.tex');
      builder.parseLogAndFdbFiles.andCallFake(function (state) {});

      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it('handles active item not being a text editor', function () {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn();
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andCallThrough();

      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_libWerkzeug2['default'].getEditorDetails).toHaveBeenCalled();
      });
    });
  });

  describe('clean', function () {
    var fixturesPath = undefined,
        composer = undefined;

    function initializeSpies(filePath) {
      var jobNames = arguments.length <= 1 || arguments[1] === undefined ? [null] : arguments[1];

      spyOn(composer, 'initializeBuildStateFromMagic').andCallFake(function (state) {
        state.setJobNames(jobNames);
      });
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: filePath });
      spyOn(composer, 'getGeneratedFileList').andCallFake(function (builder, state) {
        var _path$parse = _path2['default'].parse(state.getFilePath());

        var dir = _path$parse.dir;
        var name = _path$parse.name;

        if (state.getOutputDirectory()) {
          dir = _path2['default'].resolve(dir, state.getOutputDirectory());
        }
        if (state.getJobName()) name = state.getJobName();
        return new Set([_path2['default'].format({ dir: dir, name: name, ext: '.log' }), _path2['default'].format({ dir: dir, name: name, ext: '.aux' })]);
      });
    }

    beforeEach(function () {
      composer = new _libComposer2['default']();
      fixturesPath = _specHelpers2['default'].cloneFixtures();
      spyOn(_fsPlus2['default'], 'removeSync').andCallThrough();
      atom.config.set('latex.cleanPatterns', ['**/*.aux', '/_minted-{jobname}']);
    });

    it('deletes aux file but leaves log file when log file is not in cleanPatterns', function () {
      initializeSpies(_path2['default'].join(fixturesPath, 'foo.tex'));

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(fixturesPath, 'foo.aux'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, '_minted-foo'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, 'foo.log'));
      });
    });

    it('deletes aux file but leaves log file when log file is not in cleanPatterns with output directory', function () {
      var outdir = 'build';
      atom.config.set('latex.outputDirectory', outdir);
      initializeSpies(_path2['default'].join(fixturesPath, 'foo.tex'));

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(fixturesPath, outdir, 'foo.aux'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, '_minted-foo'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, outdir, 'foo.log'));
      });
    });

    it('deletes aux file but leaves log file when log file is not in cleanPatterns with relative output directory', function () {
      var outdir = _path2['default'].join('..', 'build');
      atom.config.set('latex.outputDirectory', outdir);
      initializeSpies(_path2['default'].join(fixturesPath, 'foo.tex'));

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(fixturesPath, outdir, 'foo.aux'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, '_minted-foo'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, outdir, 'foo.log'));
      });
    });

    it('deletes aux file but leaves log file when log file is not in cleanPatterns with absolute output directory', function () {
      var outdir = process.platform === 'win32' ? 'c:\\build' : '/build';
      atom.config.set('latex.outputDirectory', outdir);
      initializeSpies(_path2['default'].join(fixturesPath, 'foo.tex'));

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(outdir, 'foo.aux'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, '_minted-foo'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(outdir, 'foo.log'));
      });
    });

    it('deletes aux files but leaves log files when log file is not in cleanPatterns with jobnames', function () {
      initializeSpies(_path2['default'].join(fixturesPath, 'foo.tex'), ['bar', 'wibble']);

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(fixturesPath, 'bar.aux'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, 'bar.log'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, '_minted-bar'));
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(fixturesPath, 'wibble.aux'));
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalledWith(_path2['default'].join(fixturesPath, 'wibble.log'));
        expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(_path2['default'].join(fixturesPath, '_minted-wibble'));
      });
    });

    it('stops immediately if the file is not a TeX document', function () {
      var filePath = 'foo.bar';
      initializeSpies(filePath, []);

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalled();
      });
    });
  });

  describe('shouldMoveResult', function () {
    var composer = undefined,
        state = undefined,
        jobState = undefined;
    var rootFilePath = '/wibble/gronk.tex';

    function initializeSpies() {
      var outputDirectory = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      composer = new _libComposer2['default']();
      state = new _libBuildState2['default'](rootFilePath);
      state.setOutputDirectory(outputDirectory);
      jobState = state.getJobStates()[0];
    }

    it('should return false when using neither an output directory, nor the move option', function () {
      initializeSpies();
      state.setMoveResultToSourceDirectory(false);

      expect(composer.shouldMoveResult(jobState)).toBe(false);
    });

    it('should return false when not using an output directory, but using the move option', function () {
      initializeSpies();
      state.setMoveResultToSourceDirectory(true);

      expect(composer.shouldMoveResult(jobState)).toBe(false);
    });

    it('should return false when not using the move option, but using an output directory', function () {
      initializeSpies('baz');
      state.setMoveResultToSourceDirectory(false);

      expect(composer.shouldMoveResult(jobState)).toBe(false);
    });

    it('should return true when using both an output directory and the move option', function () {
      initializeSpies('baz');
      state.setMoveResultToSourceDirectory(true);

      expect(composer.shouldMoveResult(jobState)).toBe(true);
    });
  });

  describe('sync', function () {
    var composer = undefined;

    beforeEach(function () {
      composer = new _libComposer2['default']();
    });

    it('silently does nothing when the current editor is transient', function () {
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: null });
      spyOn(composer, 'resolveOutputFilePath').andCallThrough();
      spyOn(latex.opener, 'open').andReturn(true);

      waitsForPromise(function () {
        return composer.sync();
      });

      runs(function () {
        expect(composer.resolveOutputFilePath).not.toHaveBeenCalled();
        expect(latex.opener.open).not.toHaveBeenCalled();
      });
    });

    it('logs a warning and returns when an output file cannot be resolved', function () {
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: 'file.tex', lineNumber: 1 });
      spyOn(composer, 'resolveOutputFilePath').andReturn();
      spyOn(latex.opener, 'open').andReturn(true);
      spyOn(latex.log, 'warning').andCallThrough();

      waitsForPromise(function () {
        return composer.sync();
      });

      runs(function () {
        expect(latex.log.warning).toHaveBeenCalled();
        expect(latex.opener.open).not.toHaveBeenCalled();
      });
    });

    it('launches the opener using editor metadata and resolved output file', function () {
      var filePath = 'file.tex';
      var lineNumber = 1;
      var outputFilePath = 'file.pdf';
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: filePath, lineNumber: lineNumber });
      spyOn(composer, 'resolveOutputFilePath').andReturn(outputFilePath);

      spyOn(latex.opener, 'open').andReturn(true);

      waitsForPromise(function () {
        return composer.sync();
      });

      runs(function () {
        expect(latex.opener.open).toHaveBeenCalledWith(outputFilePath, filePath, lineNumber);
      });
    });

    it('launches the opener using editor metadata and resolved output file with jobnames', function () {
      var filePath = 'file.tex';
      var lineNumber = 1;
      var jobNames = ['foo', 'bar'];

      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: filePath, lineNumber: lineNumber });
      spyOn(composer, 'resolveOutputFilePath').andCallFake(function (builder, state) {
        return state.getJobName() + '.pdf';
      });
      spyOn(composer, 'initializeBuildStateFromMagic').andCallFake(function (state) {
        state.setJobNames(jobNames);
      });

      spyOn(latex.opener, 'open').andReturn(true);

      waitsForPromise(function () {
        return composer.sync();
      });

      runs(function () {
        expect(latex.opener.open).toHaveBeenCalledWith('foo.pdf', filePath, lineNumber);
        expect(latex.opener.open).toHaveBeenCalledWith('bar.pdf', filePath, lineNumber);
      });
    });
  });

  describe('moveResult', function () {
    var composer = undefined,
        state = undefined,
        jobState = undefined;
    var texFilePath = _path2['default'].normalize('/angle/gronk.tex');
    var outputFilePath = _path2['default'].normalize('/angle/dangle/gronk.pdf');

    beforeEach(function () {
      composer = new _libComposer2['default']();
      state = new _libBuildState2['default'](texFilePath);
      jobState = state.getJobStates()[0];
      jobState.setOutputFilePath(outputFilePath);
      spyOn(_fsPlus2['default'], 'removeSync');
      spyOn(_fsPlus2['default'], 'moveSync');
    });

    it('verifies that the output file and the synctex file are moved when they exist', function () {
      var destOutputFilePath = _path2['default'].normalize('/angle/gronk.pdf');
      var syncTexPath = _path2['default'].normalize('/angle/dangle/gronk.synctex.gz');
      var destSyncTexPath = _path2['default'].normalize('/angle/gronk.synctex.gz');

      spyOn(_fsPlus2['default'], 'existsSync').andReturn(true);

      composer.moveResult(jobState);
      expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(destOutputFilePath);
      expect(_fsPlus2['default'].removeSync).toHaveBeenCalledWith(destSyncTexPath);
      expect(_fsPlus2['default'].moveSync).toHaveBeenCalledWith(outputFilePath, destOutputFilePath);
      expect(_fsPlus2['default'].moveSync).toHaveBeenCalledWith(syncTexPath, destSyncTexPath);
    });

    it('verifies that the output file and the synctex file are not moved when they do not exist', function () {
      spyOn(_fsPlus2['default'], 'existsSync').andReturn(false);

      composer.moveResult(jobState);
      expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalled();
      expect(_fsPlus2['default'].removeSync).not.toHaveBeenCalled();
      expect(_fsPlus2['default'].moveSync).not.toHaveBeenCalled();
      expect(_fsPlus2['default'].moveSync).not.toHaveBeenCalled();
    });
  });

  describe('initializeBuildStateFromProperties', function () {
    var state = undefined,
        composer = undefined;
    var primaryString = 'primary';
    var secondaryString = 'secondary';
    var primaryArray = [primaryString];
    var secondaryArray = [secondaryString];

    beforeEach(function () {
      state = new _libBuildState2['default']('gronk.tex');
      composer = new _libComposer2['default']();
    });

    it('verifies that first level properties override second level properties', function () {
      var properties = {
        cleanPatterns: primaryArray,
        enableExtendedBuildMode: true,
        enableShellEscape: true,
        enableSynctex: true,
        jobNames: primaryArray,
        jobnames: secondaryArray,
        jobname: secondaryString,
        customEngine: primaryString,
        engine: secondaryString,
        program: secondaryString,
        moveResultToSourceDirectory: true,
        outputFormat: primaryString,
        format: secondaryString,
        outputDirectory: primaryString,
        output_directory: secondaryString,
        producer: primaryString
      };

      composer.initializeBuildStateFromProperties(state, properties);

      expect(state.getCleanPatterns()).toEqual(primaryArray, 'cleanPatterns to be set');
      expect(state.getEnableExtendedBuildMode()).toBe(true, 'enableExtendedBuildMode to be set');
      expect(state.getEnableShellEscape()).toBe(true, 'enableShellEscape to be set');
      expect(state.getEnableSynctex()).toBe(true, 'enableSynctex to be set');
      expect(state.getJobNames()).toEqual(primaryArray, 'jobNames to set by jobNames property not by jobnames or jobname property');
      expect(state.getEngine()).toBe(primaryString, 'engine to be set by customEngine property not by engine or program property');
      expect(state.getMoveResultToSourceDirectory()).toBe(true, 'moveResultToSourceDirectory to be set');
      expect(state.getOutputFormat()).toBe(primaryString, 'outputFormat to be set by outputFormat property not by format property');
      expect(state.getOutputDirectory()).toBe(primaryString, 'outputDirectory to be set by outputDirectory property not by output_directory property');
      expect(state.getProducer()).toBe(primaryString, 'producer to be set');
    });

    it('verifies that second level properties override third level properties', function () {
      var properties = {
        jobnames: primaryArray,
        jobname: secondaryString,
        engine: primaryString,
        program: secondaryString,
        format: primaryString,
        output_directory: primaryString
      };

      composer.initializeBuildStateFromProperties(state, properties);

      expect(state.getJobNames()).toEqual(primaryArray, 'jobNames to be set');
      expect(state.getEngine()).toBe(primaryString, 'engine to be set by engine property not by program property');
      expect(state.getOutputFormat()).toBe(primaryString, 'outputFormat to be set');
      expect(state.getOutputDirectory()).toBe(primaryString, 'outputDirectory to be set');
    });

    it('verifies that third level properties are set', function () {
      var properties = {
        jobname: primaryString,
        program: primaryString
      };

      composer.initializeBuildStateFromProperties(state, properties);

      expect(state.getJobNames()).toEqual(primaryArray, 'jobNames to be set');
      expect(state.getEngine()).toBe(primaryString, 'engine to be set');
    });
  });

  describe('initializeBuildStateFromConfig', function () {
    it('verifies that build state loaded from config settings is correct', function () {
      var state = new _libBuildState2['default']('foo.tex');
      var composer = new _libComposer2['default']();
      var outputDirectory = 'build';
      var cleanPatterns = ['**/*.foo'];

      atom.config.set('latex.outputDirectory', outputDirectory);
      atom.config.set('latex.cleanPatterns', cleanPatterns);
      atom.config.set('latex.enableShellEscape', true);

      composer.initializeBuildStateFromConfig(state);

      expect(state.getOutputDirectory()).toEqual(outputDirectory);
      expect(state.getOutputFormat()).toEqual('pdf');
      expect(state.getProducer()).toEqual('dvipdfmx');
      expect(state.getEngine()).toEqual('pdflatex');
      expect(state.getCleanPatterns()).toEqual(cleanPatterns);
      expect(state.getEnableShellEscape()).toBe(true);
      expect(state.getEnableSynctex()).toBe(true);
      expect(state.getEnableExtendedBuildMode()).toBe(true);
      expect(state.getMoveResultToSourceDirectory()).toBe(true);
    });
  });

  describe('initializeBuildStateFromMagic', function () {
    it('detects magic and overrides build state values', function () {
      var filePath = _path2['default'].join(__dirname, 'fixtures', 'magic-comments', 'override-settings.tex');
      var state = new _libBuildState2['default'](filePath);
      var composer = new _libComposer2['default']();

      composer.initializeBuildStateFromMagic(state);

      expect(state.getOutputDirectory()).toEqual('wibble');
      expect(state.getOutputFormat()).toEqual('ps');
      expect(state.getProducer()).toEqual('xdvipdfmx');
      expect(state.getEngine()).toEqual('lualatex');
      expect(state.getJobNames()).toEqual(['foo bar', 'snafu']);
      expect(state.getCleanPatterns()).toEqual(['**/*.quux', 'foo/bar']);
      expect(state.getEnableShellEscape()).toBe(true);
      expect(state.getEnableSynctex()).toBe(true);
      expect(state.getEnableExtendedBuildMode()).toBe(true);
      expect(state.getMoveResultToSourceDirectory()).toBe(true);
    });

    it('detect root magic comment and loads remaining magic comments from root', function () {
      var filePath = _path2['default'].join(__dirname, 'fixtures', 'magic-comments', 'multiple-magic-comments.tex');
      var state = new _libBuildState2['default'](filePath);
      var composer = new _libComposer2['default']();

      composer.initializeBuildStateFromMagic(state);

      expect(state.getEngine()).not.toEqual('lualatex');
    });
  });

  describe('initializeBuild', function () {
    it('verifies that build state is cached and that old cached state is removed', function () {
      var composer = new _libComposer2['default']();
      var fixturesPath = _specHelpers2['default'].cloneFixtures();
      var filePath = _path2['default'].join(fixturesPath, 'file.tex');
      var subFilePath = _path2['default'].join(fixturesPath, 'magic-comments', 'multiple-magic-comments.tex');
      var engine = 'lualatex';

      var build = composer.initializeBuild(subFilePath);
      // Set engine as a flag to indicate the cached state
      build.state.setEngine(engine);
      expect(build.state.getFilePath()).toBe(filePath);
      expect(build.state.hasSubfile(subFilePath)).toBe(true);

      build = composer.initializeBuild(filePath, true);
      expect(build.state.getEngine()).toBe(engine);
      expect(build.state.hasSubfile(subFilePath)).toBe(true);

      build = composer.initializeBuild(filePath);
      expect(build.state.getEngine()).not.toBe(engine);
      expect(build.state.hasSubfile(subFilePath)).toBe(false);
    });

    it('verifies that magic properties override config properties', function () {
      var filePath = _path2['default'].join(__dirname, 'fixtures', 'magic-comments', 'override-settings.tex');
      var composer = new _libComposer2['default']();

      atom.config.set('latex.enableShellEscape', false);
      atom.config.set('latex.enableExtendedBuildMode', false);
      atom.config.set('latex.moveResultToSourceDirectory', false);

      spyOn(composer, 'initializeBuildStateFromSettingsFile').andCallFake(function () {});

      var _composer$initializeBuild = composer.initializeBuild(filePath);

      var state = _composer$initializeBuild.state;

      expect(state.getOutputDirectory()).toEqual('wibble');
      expect(state.getOutputFormat()).toEqual('ps');
      expect(state.getProducer()).toEqual('xdvipdfmx');
      expect(state.getEngine()).toEqual('lualatex');
      expect(state.getJobNames()).toEqual(['foo bar', 'snafu']);
      expect(state.getCleanPatterns()).toEqual(['**/*.quux', 'foo/bar']);
      expect(state.getEnableShellEscape()).toBe(true);
      expect(state.getEnableSynctex()).toBe(true);
      expect(state.getEnableExtendedBuildMode()).toBe(true);
      expect(state.getMoveResultToSourceDirectory()).toBe(true);
    });

    it('verifies that settings file properties override config properties', function () {
      var filePath = _path2['default'].join(__dirname, 'fixtures', 'magic-comments', 'override-settings.tex');
      var composer = new _libComposer2['default']();

      atom.config.set('latex.enableShellEscape', false);
      atom.config.set('latex.enableExtendedBuildMode', false);
      atom.config.set('latex.moveResultToSourceDirectory', false);

      spyOn(composer, 'initializeBuildStateFromMagic').andCallFake(function () {});

      var _composer$initializeBuild2 = composer.initializeBuild(filePath);

      var state = _composer$initializeBuild2.state;

      expect(state.getOutputDirectory()).toEqual('foo');
      expect(state.getOutputFormat()).toEqual('dvi');
      expect(state.getProducer()).toEqual('ps2pdf');
      expect(state.getEngine()).toEqual('xelatex');
      expect(state.getJobNames()).toEqual(['wibble', 'quux']);
      expect(state.getCleanPatterns()).toEqual(['**/*.snafu', 'foo/bar/bax']);
      expect(state.getEnableShellEscape()).toBe(true);
      expect(state.getEnableSynctex()).toBe(true);
      expect(state.getEnableExtendedBuildMode()).toBe(true);
      expect(state.getMoveResultToSourceDirectory()).toBe(true);
    });

    it('verifies that settings file properties override magic properties', function () {
      var filePath = _path2['default'].join(__dirname, 'fixtures', 'magic-comments', 'override-settings.tex');
      var composer = new _libComposer2['default']();

      atom.config.set('latex.enableShellEscape', false);
      atom.config.set('latex.enableExtendedBuildMode', false);
      atom.config.set('latex.moveResultToSourceDirectory', false);

      var _composer$initializeBuild3 = composer.initializeBuild(filePath);

      var state = _composer$initializeBuild3.state;

      expect(state.getOutputDirectory()).toEqual('foo');
      expect(state.getOutputFormat()).toEqual('dvi');
      expect(state.getProducer()).toEqual('ps2pdf');
      expect(state.getEngine()).toEqual('xelatex');
      expect(state.getJobNames()).toEqual(['wibble', 'quux']);
      expect(state.getCleanPatterns()).toEqual(['**/*.snafu', 'foo/bar/bax']);
    });
  });

  describe('resolveOutputFilePath', function () {
    var builder = undefined,
        state = undefined,
        jobState = undefined,
        composer = undefined;

    beforeEach(function () {
      composer = new _libComposer2['default']();
      state = new _libBuildState2['default']('foo.tex');
      jobState = state.getJobStates()[0];
      builder = jasmine.createSpyObj('MockBuilder', ['parseLogAndFdbFiles']);
    });

    it('returns outputFilePath if already set in jobState', function () {
      var outputFilePath = 'foo.pdf';

      jobState.setOutputFilePath(outputFilePath);

      expect(composer.resolveOutputFilePath(builder, jobState)).toEqual(outputFilePath);
    });

    it('returns outputFilePath returned by parseLogAndFdbFiles', function () {
      var outputFilePath = 'foo.pdf';

      builder.parseLogAndFdbFiles.andCallFake(function (state) {
        state.setOutputFilePath(outputFilePath);
      });

      expect(composer.resolveOutputFilePath(builder, jobState)).toEqual(outputFilePath);
    });

    it('returns null returned if parseLogAndFdbFiles fails', function () {
      expect(composer.resolveOutputFilePath(builder, jobState)).toEqual(null);
    });

    it('updates outputFilePath if moveResultToSourceDirectory is set', function () {
      var outputFilePath = 'foo.pdf';
      var outputDirectory = 'bar';

      state.setOutputDirectory(outputDirectory);
      state.setMoveResultToSourceDirectory(true);

      builder.parseLogAndFdbFiles.andCallFake(function (state) {
        state.setOutputFilePath(_path2['default'].join(outputDirectory, outputFilePath));
      });

      expect(composer.resolveOutputFilePath(builder, jobState)).toEqual(outputFilePath);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2NvbXBvc2VyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzsyQkFFb0IsZ0JBQWdCOzs7O3NCQUNyQixTQUFTOzs7O29CQUNQLE1BQU07Ozs7MkJBQ0YsaUJBQWlCOzs7OzJCQUNqQixpQkFBaUI7Ozs7NkJBQ2Ysb0JBQW9COzs7O0FBRTNDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBTTtBQUN6QixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUM7YUFBTSx5QkFBUSxnQkFBZ0IsRUFBRTtLQUFBLENBQUMsQ0FBQTtHQUNsRCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLFFBQUksTUFBTSxZQUFBO1FBQUUsT0FBTyxZQUFBO1FBQUUsUUFBUSxZQUFBLENBQUE7O0FBRTdCLGFBQVMsZUFBZSxDQUFFLFFBQVEsRUFBcUM7VUFBbkMsUUFBUSx5REFBRyxDQUFDLElBQUksQ0FBQztVQUFFLFVBQVUseURBQUcsQ0FBQzs7QUFDbkUsWUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDbkUsV0FBSyxDQUFDLFFBQVEsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNwRSxhQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzVCLENBQUMsQ0FBQTtBQUNGLFdBQUssMkJBQVcsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBOztBQUVuRSxhQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FB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RUYsWUFBTSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7S0FDbEYsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2NvbXBvc2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBoZWxwZXJzIGZyb20gJy4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHdlcmt6ZXVnIGZyb20gJy4uL2xpYi93ZXJremV1ZydcbmltcG9ydCBDb21wb3NlciBmcm9tICcuLi9saWIvY29tcG9zZXInXG5pbXBvcnQgQnVpbGRTdGF0ZSBmcm9tICcuLi9saWIvYnVpbGQtc3RhdGUnXG5cbmRlc2NyaWJlKCdDb21wb3NlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMuYWN0aXZhdGVQYWNrYWdlcygpKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdidWlsZCcsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yLCBidWlsZGVyLCBjb21wb3NlclxuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNwaWVzIChmaWxlUGF0aCwgam9iTmFtZXMgPSBbbnVsbF0sIHN0YXR1c0NvZGUgPSAwKSB7XG4gICAgICBlZGl0b3IgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaignTW9ja0VkaXRvcicsIFsnc2F2ZScsICdpc01vZGlmaWVkJ10pXG4gICAgICBzcHlPbihjb21wb3NlciwgJ2luaXRpYWxpemVCdWlsZFN0YXRlRnJvbU1hZ2ljJykuYW5kQ2FsbEZha2Uoc3RhdGUgPT4ge1xuICAgICAgICBzdGF0ZS5zZXRKb2JOYW1lcyhqb2JOYW1lcylcbiAgICAgIH0pXG4gICAgICBzcHlPbih3ZXJremV1ZywgJ2dldEVkaXRvckRldGFpbHMnKS5hbmRSZXR1cm4oeyBlZGl0b3IsIGZpbGVQYXRoIH0pXG5cbiAgICAgIGJ1aWxkZXIgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaignTW9ja0J1aWxkZXInLCBbJ3J1bicsICdjb25zdHJ1Y3RBcmdzJywgJ3BhcnNlTG9nQW5kRmRiRmlsZXMnXSlcbiAgICAgIGJ1aWxkZXIucnVuLmFuZENhbGxGYWtlKCgpID0+IHtcbiAgICAgICAgc3dpdGNoIChzdGF0dXNDb2RlKSB7XG4gICAgICAgICAgY2FzZSAwOiB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoc3RhdHVzQ29kZSkgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHN0YXR1c0NvZGUpXG4gICAgICB9KVxuICAgICAgc3B5T24obGF0ZXguYnVpbGRlclJlZ2lzdHJ5LCAnZ2V0QnVpbGRlcicpLmFuZFJldHVybihidWlsZGVyKVxuICAgIH1cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKVxuICAgICAgc3B5T24oY29tcG9zZXIsICdzaG93UmVzdWx0JykuYW5kUmV0dXJuKClcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAnc2hvd0Vycm9yJykuYW5kUmV0dXJuKClcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90aGluZyBmb3IgbmV3LCB1bnNhdmVkIGZpbGVzJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKG51bGwpXG5cbiAgICAgIGxldCByZXN1bHQgPSAnYWFhYWFhYWFhYWFhJ1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCkudGhlbihyID0+IHsgcmVzdWx0ID0gciB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93UmVzdWx0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdkb2VzIG5vdGhpbmcgZm9yIHVuc3VwcG9ydGVkIGZpbGUgZXh0ZW5zaW9ucycsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVTcGllcygnZm9vLmJhcicpXG4gICAgICBsYXRleC5idWlsZGVyUmVnaXN0cnkuZ2V0QnVpbGRlci5hbmRSZXR1cm4obnVsbClcblxuICAgICAgbGV0IHJlc3VsdFxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCkudGhlbihyID0+IHsgcmVzdWx0ID0gciB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93UmVzdWx0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzYXZlcyB0aGUgZmlsZSBiZWZvcmUgYnVpbGRpbmcsIGlmIG1vZGlmaWVkJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKCdmaWxlLnRleCcpXG4gICAgICBlZGl0b3IuaXNNb2RpZmllZC5hbmRSZXR1cm4odHJ1ZSlcblxuICAgICAgYnVpbGRlci5wYXJzZUxvZ0FuZEZkYkZpbGVzLmFuZFJldHVybih7XG4gICAgICAgIG91dHB1dEZpbGVQYXRoOiAnZmlsZS5wZGYnLFxuICAgICAgICBtZXNzYWdlczogW11cbiAgICAgIH0pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5pc01vZGlmaWVkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5zYXZlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdydW5zIHRoZSBidWlsZCB0d28gdGltZXMgd2l0aCBtdWx0aXBsZSBqb2IgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2ZpbGUudGV4JywgWydmb28nLCAnYmFyJ10pXG5cbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dBbmRGZGJGaWxlcy5hbmRSZXR1cm4oe1xuICAgICAgICBvdXRwdXRGaWxlUGF0aDogJ2ZpbGUucGRmJyxcbiAgICAgICAgbWVzc2FnZXM6IFtdXG4gICAgICB9KVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChidWlsZGVyLnJ1bi5jYWxsQ291bnQpLnRvQmUoMilcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdpbnZva2VzIGBzaG93UmVzdWx0YCBhZnRlciBhIHN1Y2Nlc3NmdWwgYnVpbGQsIHdpdGggZXhwZWN0ZWQgbG9nIHBhcnNpbmcgcmVzdWx0JywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKCdmaWxlLnRleCcpXG4gICAgICBidWlsZGVyLnBhcnNlTG9nQW5kRmRiRmlsZXMuYW5kQ2FsbEZha2Uoc3RhdGUgPT4ge1xuICAgICAgICBzdGF0ZS5zZXRMb2dNZXNzYWdlcyhbXSlcbiAgICAgICAgc3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgoJ2ZpbGUucGRmJylcbiAgICAgIH0pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dSZXN1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3RyZWF0cyBtaXNzaW5nIG91dHB1dCBmaWxlIGRhdGEgaW4gbG9nIGZpbGUgYXMgYW4gZXJyb3InLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2ZpbGUudGV4JylcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dBbmRGZGJGaWxlcy5hbmRDYWxsRmFrZShzdGF0ZSA9PiB7XG4gICAgICAgIHN0YXRlLnNldExvZ01lc3NhZ2VzKFtdKVxuICAgICAgfSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmJ1aWxkKCkuY2F0Y2gociA9PiByKVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5zaG93RXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3RyZWF0cyBtaXNzaW5nIHJlc3VsdCBmcm9tIHBhcnNlciBhcyBhbiBlcnJvcicsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVTcGllcygnZmlsZS50ZXgnKVxuICAgICAgYnVpbGRlci5wYXJzZUxvZ0FuZEZkYkZpbGVzLmFuZENhbGxGYWtlKHN0YXRlID0+IHt9KVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHIpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dFcnJvcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBhY3RpdmUgaXRlbSBub3QgYmVpbmcgYSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnZ2V0QWN0aXZlVGV4dEVkaXRvcicpLmFuZFJldHVybigpXG4gICAgICBzcHlPbih3ZXJremV1ZywgJ2dldEVkaXRvckRldGFpbHMnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3Qod2Vya3pldWcuZ2V0RWRpdG9yRGV0YWlscykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NsZWFuJywgKCkgPT4ge1xuICAgIGxldCBmaXh0dXJlc1BhdGgsIGNvbXBvc2VyXG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplU3BpZXMgKGZpbGVQYXRoLCBqb2JOYW1lcyA9IFtudWxsXSkge1xuICAgICAgc3B5T24oY29tcG9zZXIsICdpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYycpLmFuZENhbGxGYWtlKHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoam9iTmFtZXMpXG4gICAgICB9KVxuICAgICAgc3B5T24od2Vya3pldWcsICdnZXRFZGl0b3JEZXRhaWxzJykuYW5kUmV0dXJuKHsgZmlsZVBhdGggfSlcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAnZ2V0R2VuZXJhdGVkRmlsZUxpc3QnKS5hbmRDYWxsRmFrZSgoYnVpbGRlciwgc3RhdGUpID0+IHtcbiAgICAgICAgbGV0IHsgZGlyLCBuYW1lIH0gPSBwYXRoLnBhcnNlKHN0YXRlLmdldEZpbGVQYXRoKCkpXG4gICAgICAgIGlmIChzdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGRpciA9IHBhdGgucmVzb2x2ZShkaXIsIHN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0ZS5nZXRKb2JOYW1lKCkpIG5hbWUgPSBzdGF0ZS5nZXRKb2JOYW1lKClcbiAgICAgICAgcmV0dXJuIG5ldyBTZXQoW1xuICAgICAgICAgIHBhdGguZm9ybWF0KHsgZGlyLCBuYW1lLCBleHQ6ICcubG9nJyB9KSxcbiAgICAgICAgICBwYXRoLmZvcm1hdCh7IGRpciwgbmFtZSwgZXh0OiAnLmF1eCcgfSlcbiAgICAgICAgXSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjb21wb3NlciA9IG5ldyBDb21wb3NlcigpXG4gICAgICBmaXh0dXJlc1BhdGggPSBoZWxwZXJzLmNsb25lRml4dHVyZXMoKVxuICAgICAgc3B5T24oZnMsICdyZW1vdmVTeW5jJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5jbGVhblBhdHRlcm5zJywgWycqKi8qLmF1eCcsICcvX21pbnRlZC17am9ibmFtZX0nXSlcbiAgICB9KVxuXG4gICAgaXQoJ2RlbGV0ZXMgYXV4IGZpbGUgYnV0IGxlYXZlcyBsb2cgZmlsZSB3aGVuIGxvZyBmaWxlIGlzIG5vdCBpbiBjbGVhblBhdHRlcm5zJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmb28udGV4JykpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5jbGVhbigpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Zvby5hdXgnKSlcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZVN5bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnX21pbnRlZC1mb28nKSlcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZVN5bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZm9vLmxvZycpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2RlbGV0ZXMgYXV4IGZpbGUgYnV0IGxlYXZlcyBsb2cgZmlsZSB3aGVuIGxvZyBmaWxlIGlzIG5vdCBpbiBjbGVhblBhdHRlcm5zIHdpdGggb3V0cHV0IGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dGRpciA9ICdidWlsZCdcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5Jywgb3V0ZGlyKVxuICAgICAgaW5pdGlhbGl6ZVNwaWVzKHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmb28udGV4JykpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5jbGVhbigpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgb3V0ZGlyLCAnZm9vLmF1eCcpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdfbWludGVkLWZvbycpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihmaXh0dXJlc1BhdGgsIG91dGRpciwgJ2Zvby5sb2cnKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdkZWxldGVzIGF1eCBmaWxlIGJ1dCBsZWF2ZXMgbG9nIGZpbGUgd2hlbiBsb2cgZmlsZSBpcyBub3QgaW4gY2xlYW5QYXR0ZXJucyB3aXRoIHJlbGF0aXZlIG91dHB1dCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRkaXIgPSBwYXRoLmpvaW4oJy4uJywgJ2J1aWxkJylcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5Jywgb3V0ZGlyKVxuICAgICAgaW5pdGlhbGl6ZVNwaWVzKHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmb28udGV4JykpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5jbGVhbigpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgb3V0ZGlyLCAnZm9vLmF1eCcpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdfbWludGVkLWZvbycpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihmaXh0dXJlc1BhdGgsIG91dGRpciwgJ2Zvby5sb2cnKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdkZWxldGVzIGF1eCBmaWxlIGJ1dCBsZWF2ZXMgbG9nIGZpbGUgd2hlbiBsb2cgZmlsZSBpcyBub3QgaW4gY2xlYW5QYXR0ZXJucyB3aXRoIGFic29sdXRlIG91dHB1dCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRkaXIgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJ2M6XFxcXGJ1aWxkJyA6ICcvYnVpbGQnXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScsIG91dGRpcilcbiAgICAgIGluaXRpYWxpemVTcGllcyhwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZm9vLnRleCcpKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuY2xlYW4oKS5jYXRjaChyID0+IHIpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZVN5bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihvdXRkaXIsICdmb28uYXV4JykpXG4gICAgICAgIGV4cGVjdChmcy5yZW1vdmVTeW5jKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ19taW50ZWQtZm9vJykpXG4gICAgICAgIGV4cGVjdChmcy5yZW1vdmVTeW5jKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKG91dGRpciwgJ2Zvby5sb2cnKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdkZWxldGVzIGF1eCBmaWxlcyBidXQgbGVhdmVzIGxvZyBmaWxlcyB3aGVuIGxvZyBmaWxlIGlzIG5vdCBpbiBjbGVhblBhdHRlcm5zIHdpdGggam9ibmFtZXMnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Zvby50ZXgnKSwgWydiYXInLCAnd2liYmxlJ10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5jbGVhbigpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Jhci5hdXgnKSlcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZVN5bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnYmFyLmxvZycpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdfbWludGVkLWJhcicpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ3dpYmJsZS5hdXgnKSlcbiAgICAgICAgZXhwZWN0KGZzLnJlbW92ZVN5bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnd2liYmxlLmxvZycpKVxuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgocGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ19taW50ZWQtd2liYmxlJykpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3RvcHMgaW1tZWRpYXRlbHkgaWYgdGhlIGZpbGUgaXMgbm90IGEgVGVYIGRvY3VtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSAnZm9vLmJhcidcbiAgICAgIGluaXRpYWxpemVTcGllcyhmaWxlUGF0aCwgW10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5jbGVhbigpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdzaG91bGRNb3ZlUmVzdWx0JywgKCkgPT4ge1xuICAgIGxldCBjb21wb3Nlciwgc3RhdGUsIGpvYlN0YXRlXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gJy93aWJibGUvZ3JvbmsudGV4J1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNwaWVzIChvdXRwdXREaXJlY3RvcnkgPSAnJykge1xuICAgICAgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKVxuICAgICAgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZShyb290RmlsZVBhdGgpXG4gICAgICBzdGF0ZS5zZXRPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KVxuICAgICAgam9iU3RhdGUgPSBzdGF0ZS5nZXRKb2JTdGF0ZXMoKVswXVxuICAgIH1cblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gdXNpbmcgbmVpdGhlciBhbiBvdXRwdXQgZGlyZWN0b3J5LCBub3IgdGhlIG1vdmUgb3B0aW9uJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKClcbiAgICAgIHN0YXRlLnNldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeShmYWxzZSlcblxuICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3VsZE1vdmVSZXN1bHQoam9iU3RhdGUpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG5vdCB1c2luZyBhbiBvdXRwdXQgZGlyZWN0b3J5LCBidXQgdXNpbmcgdGhlIG1vdmUgb3B0aW9uJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKClcbiAgICAgIHN0YXRlLnNldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSh0cnVlKVxuXG4gICAgICBleHBlY3QoY29tcG9zZXIuc2hvdWxkTW92ZVJlc3VsdChqb2JTdGF0ZSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm90IHVzaW5nIHRoZSBtb3ZlIG9wdGlvbiwgYnV0IHVzaW5nIGFuIG91dHB1dCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2JheicpXG4gICAgICBzdGF0ZS5zZXRNb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkoZmFsc2UpXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KGpvYlN0YXRlKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIHVzaW5nIGJvdGggYW4gb3V0cHV0IGRpcmVjdG9yeSBhbmQgdGhlIG1vdmUgb3B0aW9uJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKCdiYXonKVxuICAgICAgc3RhdGUuc2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KHRydWUpXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KGpvYlN0YXRlKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3N5bmMnLCAoKSA9PiB7XG4gICAgbGV0IGNvbXBvc2VyXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKClcbiAgICB9KVxuXG4gICAgaXQoJ3NpbGVudGx5IGRvZXMgbm90aGluZyB3aGVuIHRoZSBjdXJyZW50IGVkaXRvciBpcyB0cmFuc2llbnQnLCAoKSA9PiB7XG4gICAgICBzcHlPbih3ZXJremV1ZywgJ2dldEVkaXRvckRldGFpbHMnKS5hbmRSZXR1cm4oeyBmaWxlUGF0aDogbnVsbCB9KVxuICAgICAgc3B5T24oY29tcG9zZXIsICdyZXNvbHZlT3V0cHV0RmlsZVBhdGgnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBzcHlPbihsYXRleC5vcGVuZXIsICdvcGVuJykuYW5kUmV0dXJuKHRydWUpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBjb21wb3Nlci5zeW5jKCkpXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIucmVzb2x2ZU91dHB1dEZpbGVQYXRoKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChsYXRleC5vcGVuZXIub3Blbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2xvZ3MgYSB3YXJuaW5nIGFuZCByZXR1cm5zIHdoZW4gYW4gb3V0cHV0IGZpbGUgY2Fubm90IGJlIHJlc29sdmVkJywgKCkgPT4ge1xuICAgICAgc3B5T24od2Vya3pldWcsICdnZXRFZGl0b3JEZXRhaWxzJykuYW5kUmV0dXJuKHsgZmlsZVBhdGg6ICdmaWxlLnRleCcsIGxpbmVOdW1iZXI6IDEgfSlcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAncmVzb2x2ZU91dHB1dEZpbGVQYXRoJykuYW5kUmV0dXJuKClcbiAgICAgIHNweU9uKGxhdGV4Lm9wZW5lciwgJ29wZW4nKS5hbmRSZXR1cm4odHJ1ZSlcbiAgICAgIHNweU9uKGxhdGV4LmxvZywgJ3dhcm5pbmcnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBjb21wb3Nlci5zeW5jKCkpXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QobGF0ZXgubG9nLndhcm5pbmcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QobGF0ZXgub3BlbmVyLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdsYXVuY2hlcyB0aGUgb3BlbmVyIHVzaW5nIGVkaXRvciBtZXRhZGF0YSBhbmQgcmVzb2x2ZWQgb3V0cHV0IGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9ICdmaWxlLnRleCdcbiAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSAxXG4gICAgICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9ICdmaWxlLnBkZidcbiAgICAgIHNweU9uKHdlcmt6ZXVnLCAnZ2V0RWRpdG9yRGV0YWlscycpLmFuZFJldHVybih7IGZpbGVQYXRoLCBsaW5lTnVtYmVyIH0pXG4gICAgICBzcHlPbihjb21wb3NlciwgJ3Jlc29sdmVPdXRwdXRGaWxlUGF0aCcpLmFuZFJldHVybihvdXRwdXRGaWxlUGF0aClcblxuICAgICAgc3B5T24obGF0ZXgub3BlbmVyLCAnb3BlbicpLmFuZFJldHVybih0cnVlKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gY29tcG9zZXIuc3luYygpKVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGxhdGV4Lm9wZW5lci5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChvdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnbGF1bmNoZXMgdGhlIG9wZW5lciB1c2luZyBlZGl0b3IgbWV0YWRhdGEgYW5kIHJlc29sdmVkIG91dHB1dCBmaWxlIHdpdGggam9ibmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9ICdmaWxlLnRleCdcbiAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSAxXG4gICAgICBjb25zdCBqb2JOYW1lcyA9IFsnZm9vJywgJ2JhciddXG5cbiAgICAgIHNweU9uKHdlcmt6ZXVnLCAnZ2V0RWRpdG9yRGV0YWlscycpLmFuZFJldHVybih7IGZpbGVQYXRoLCBsaW5lTnVtYmVyIH0pXG4gICAgICBzcHlPbihjb21wb3NlciwgJ3Jlc29sdmVPdXRwdXRGaWxlUGF0aCcpLmFuZENhbGxGYWtlKChidWlsZGVyLCBzdGF0ZSkgPT4gc3RhdGUuZ2V0Sm9iTmFtZSgpICsgJy5wZGYnKVxuICAgICAgc3B5T24oY29tcG9zZXIsICdpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYycpLmFuZENhbGxGYWtlKHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoam9iTmFtZXMpXG4gICAgICB9KVxuXG4gICAgICBzcHlPbihsYXRleC5vcGVuZXIsICdvcGVuJykuYW5kUmV0dXJuKHRydWUpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBjb21wb3Nlci5zeW5jKCkpXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QobGF0ZXgub3BlbmVyLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdmb28ucGRmJywgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgICAgIGV4cGVjdChsYXRleC5vcGVuZXIub3BlbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2Jhci5wZGYnLCBmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnbW92ZVJlc3VsdCcsICgpID0+IHtcbiAgICBsZXQgY29tcG9zZXIsIHN0YXRlLCBqb2JTdGF0ZVxuICAgIGNvbnN0IHRleEZpbGVQYXRoID0gcGF0aC5ub3JtYWxpemUoJy9hbmdsZS9ncm9uay50ZXgnKVxuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gcGF0aC5ub3JtYWxpemUoJy9hbmdsZS9kYW5nbGUvZ3JvbmsucGRmJylcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKVxuICAgICAgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSh0ZXhGaWxlUGF0aClcbiAgICAgIGpvYlN0YXRlID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKClbMF1cbiAgICAgIGpvYlN0YXRlLnNldE91dHB1dEZpbGVQYXRoKG91dHB1dEZpbGVQYXRoKVxuICAgICAgc3B5T24oZnMsICdyZW1vdmVTeW5jJylcbiAgICAgIHNweU9uKGZzLCAnbW92ZVN5bmMnKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCB0aGUgb3V0cHV0IGZpbGUgYW5kIHRoZSBzeW5jdGV4IGZpbGUgYXJlIG1vdmVkIHdoZW4gdGhleSBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlc3RPdXRwdXRGaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKCcvYW5nbGUvZ3JvbmsucGRmJylcbiAgICAgIGNvbnN0IHN5bmNUZXhQYXRoID0gcGF0aC5ub3JtYWxpemUoJy9hbmdsZS9kYW5nbGUvZ3Jvbmsuc3luY3RleC5neicpXG4gICAgICBjb25zdCBkZXN0U3luY1RleFBhdGggPSBwYXRoLm5vcm1hbGl6ZSgnL2FuZ2xlL2dyb25rLnN5bmN0ZXguZ3onKVxuXG4gICAgICBzcHlPbihmcywgJ2V4aXN0c1N5bmMnKS5hbmRSZXR1cm4odHJ1ZSlcblxuICAgICAgY29tcG9zZXIubW92ZVJlc3VsdChqb2JTdGF0ZSlcbiAgICAgIGV4cGVjdChmcy5yZW1vdmVTeW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChkZXN0T3V0cHV0RmlsZVBhdGgpXG4gICAgICBleHBlY3QoZnMucmVtb3ZlU3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZGVzdFN5bmNUZXhQYXRoKVxuICAgICAgZXhwZWN0KGZzLm1vdmVTeW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChvdXRwdXRGaWxlUGF0aCwgZGVzdE91dHB1dEZpbGVQYXRoKVxuICAgICAgZXhwZWN0KGZzLm1vdmVTeW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzeW5jVGV4UGF0aCwgZGVzdFN5bmNUZXhQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCB0aGUgb3V0cHV0IGZpbGUgYW5kIHRoZSBzeW5jdGV4IGZpbGUgYXJlIG5vdCBtb3ZlZCB3aGVuIHRoZXkgZG8gbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgc3B5T24oZnMsICdleGlzdHNTeW5jJykuYW5kUmV0dXJuKGZhbHNlKVxuXG4gICAgICBjb21wb3Nlci5tb3ZlUmVzdWx0KGpvYlN0YXRlKVxuICAgICAgZXhwZWN0KGZzLnJlbW92ZVN5bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChmcy5yZW1vdmVTeW5jKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoZnMubW92ZVN5bmMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChmcy5tb3ZlU3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2luaXRpYWxpemVCdWlsZFN0YXRlRnJvbVByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgbGV0IHN0YXRlLCBjb21wb3NlclxuICAgIGNvbnN0IHByaW1hcnlTdHJpbmcgPSAncHJpbWFyeSdcbiAgICBjb25zdCBzZWNvbmRhcnlTdHJpbmcgPSAnc2Vjb25kYXJ5J1xuICAgIGNvbnN0IHByaW1hcnlBcnJheSA9IFtwcmltYXJ5U3RyaW5nXVxuICAgIGNvbnN0IHNlY29uZGFyeUFycmF5ID0gW3NlY29uZGFyeVN0cmluZ11cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgnZ3JvbmsudGV4JylcbiAgICAgIGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKClcbiAgICB9KVxuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoYXQgZmlyc3QgbGV2ZWwgcHJvcGVydGllcyBvdmVycmlkZSBzZWNvbmQgbGV2ZWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7XG4gICAgICAgIGNsZWFuUGF0dGVybnM6IHByaW1hcnlBcnJheSxcbiAgICAgICAgZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGU6IHRydWUsXG4gICAgICAgIGVuYWJsZVNoZWxsRXNjYXBlOiB0cnVlLFxuICAgICAgICBlbmFibGVTeW5jdGV4OiB0cnVlLFxuICAgICAgICBqb2JOYW1lczogcHJpbWFyeUFycmF5LFxuICAgICAgICBqb2JuYW1lczogc2Vjb25kYXJ5QXJyYXksXG4gICAgICAgIGpvYm5hbWU6IHNlY29uZGFyeVN0cmluZyxcbiAgICAgICAgY3VzdG9tRW5naW5lOiBwcmltYXJ5U3RyaW5nLFxuICAgICAgICBlbmdpbmU6IHNlY29uZGFyeVN0cmluZyxcbiAgICAgICAgcHJvZ3JhbTogc2Vjb25kYXJ5U3RyaW5nLFxuICAgICAgICBtb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3Rvcnk6IHRydWUsXG4gICAgICAgIG91dHB1dEZvcm1hdDogcHJpbWFyeVN0cmluZyxcbiAgICAgICAgZm9ybWF0OiBzZWNvbmRhcnlTdHJpbmcsXG4gICAgICAgIG91dHB1dERpcmVjdG9yeTogcHJpbWFyeVN0cmluZyxcbiAgICAgICAgb3V0cHV0X2RpcmVjdG9yeTogc2Vjb25kYXJ5U3RyaW5nLFxuICAgICAgICBwcm9kdWNlcjogcHJpbWFyeVN0cmluZ1xuICAgICAgfVxuXG4gICAgICBjb21wb3Nlci5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21Qcm9wZXJ0aWVzKHN0YXRlLCBwcm9wZXJ0aWVzKVxuXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0Q2xlYW5QYXR0ZXJucygpKS50b0VxdWFsKHByaW1hcnlBcnJheSwgJ2NsZWFuUGF0dGVybnMgdG8gYmUgc2V0JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSgpKS50b0JlKHRydWUsICdlbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSB0byBiZSBzZXQnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuYWJsZVNoZWxsRXNjYXBlKCkpLnRvQmUodHJ1ZSwgJ2VuYWJsZVNoZWxsRXNjYXBlIHRvIGJlIHNldCcpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5hYmxlU3luY3RleCgpKS50b0JlKHRydWUsICdlbmFibGVTeW5jdGV4IHRvIGJlIHNldCcpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0Sm9iTmFtZXMoKSkudG9FcXVhbChwcmltYXJ5QXJyYXksICdqb2JOYW1lcyB0byBzZXQgYnkgam9iTmFtZXMgcHJvcGVydHkgbm90IGJ5IGpvYm5hbWVzIG9yIGpvYm5hbWUgcHJvcGVydHknKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuZ2luZSgpKS50b0JlKHByaW1hcnlTdHJpbmcsICdlbmdpbmUgdG8gYmUgc2V0IGJ5IGN1c3RvbUVuZ2luZSBwcm9wZXJ0eSBub3QgYnkgZW5naW5lIG9yIHByb2dyYW0gcHJvcGVydHknKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSgpKS50b0JlKHRydWUsICdtb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkgdG8gYmUgc2V0JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKSkudG9CZShwcmltYXJ5U3RyaW5nLCAnb3V0cHV0Rm9ybWF0IHRvIGJlIHNldCBieSBvdXRwdXRGb3JtYXQgcHJvcGVydHkgbm90IGJ5IGZvcm1hdCBwcm9wZXJ0eScpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCkpLnRvQmUocHJpbWFyeVN0cmluZywgJ291dHB1dERpcmVjdG9yeSB0byBiZSBzZXQgYnkgb3V0cHV0RGlyZWN0b3J5IHByb3BlcnR5IG5vdCBieSBvdXRwdXRfZGlyZWN0b3J5IHByb3BlcnR5JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRQcm9kdWNlcigpKS50b0JlKHByaW1hcnlTdHJpbmcsICdwcm9kdWNlciB0byBiZSBzZXQnKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCBzZWNvbmQgbGV2ZWwgcHJvcGVydGllcyBvdmVycmlkZSB0aGlyZCBsZXZlbCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcGVydGllcyA9IHtcbiAgICAgICAgam9ibmFtZXM6IHByaW1hcnlBcnJheSxcbiAgICAgICAgam9ibmFtZTogc2Vjb25kYXJ5U3RyaW5nLFxuICAgICAgICBlbmdpbmU6IHByaW1hcnlTdHJpbmcsXG4gICAgICAgIHByb2dyYW06IHNlY29uZGFyeVN0cmluZyxcbiAgICAgICAgZm9ybWF0OiBwcmltYXJ5U3RyaW5nLFxuICAgICAgICBvdXRwdXRfZGlyZWN0b3J5OiBwcmltYXJ5U3RyaW5nXG4gICAgICB9XG5cbiAgICAgIGNvbXBvc2VyLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbVByb3BlcnRpZXMoc3RhdGUsIHByb3BlcnRpZXMpXG5cbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRKb2JOYW1lcygpKS50b0VxdWFsKHByaW1hcnlBcnJheSwgJ2pvYk5hbWVzIHRvIGJlIHNldCcpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5naW5lKCkpLnRvQmUocHJpbWFyeVN0cmluZywgJ2VuZ2luZSB0byBiZSBzZXQgYnkgZW5naW5lIHByb3BlcnR5IG5vdCBieSBwcm9ncmFtIHByb3BlcnR5JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKSkudG9CZShwcmltYXJ5U3RyaW5nLCAnb3V0cHV0Rm9ybWF0IHRvIGJlIHNldCcpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCkpLnRvQmUocHJpbWFyeVN0cmluZywgJ291dHB1dERpcmVjdG9yeSB0byBiZSBzZXQnKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCB0aGlyZCBsZXZlbCBwcm9wZXJ0aWVzIGFyZSBzZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wZXJ0aWVzID0ge1xuICAgICAgICBqb2JuYW1lOiBwcmltYXJ5U3RyaW5nLFxuICAgICAgICBwcm9ncmFtOiBwcmltYXJ5U3RyaW5nXG4gICAgICB9XG5cbiAgICAgIGNvbXBvc2VyLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbVByb3BlcnRpZXMoc3RhdGUsIHByb3BlcnRpZXMpXG5cbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRKb2JOYW1lcygpKS50b0VxdWFsKHByaW1hcnlBcnJheSwgJ2pvYk5hbWVzIHRvIGJlIHNldCcpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5naW5lKCkpLnRvQmUocHJpbWFyeVN0cmluZywgJ2VuZ2luZSB0byBiZSBzZXQnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2luaXRpYWxpemVCdWlsZFN0YXRlRnJvbUNvbmZpZycsICgpID0+IHtcbiAgICBpdCgndmVyaWZpZXMgdGhhdCBidWlsZCBzdGF0ZSBsb2FkZWQgZnJvbSBjb25maWcgc2V0dGluZ3MgaXMgY29ycmVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gbmV3IEJ1aWxkU3RhdGUoJ2Zvby50ZXgnKVxuICAgICAgY29uc3QgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKVxuICAgICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gJ2J1aWxkJ1xuICAgICAgY29uc3QgY2xlYW5QYXR0ZXJucyA9IFsnKiovKi5mb28nXVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScsIG91dHB1dERpcmVjdG9yeSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguY2xlYW5QYXR0ZXJucycsIGNsZWFuUGF0dGVybnMpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xhdGV4LmVuYWJsZVNoZWxsRXNjYXBlJywgdHJ1ZSlcblxuICAgICAgY29tcG9zZXIuaW5pdGlhbGl6ZUJ1aWxkU3RhdGVGcm9tQ29uZmlnKHN0YXRlKVxuXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCkpLnRvRXF1YWwob3V0cHV0RGlyZWN0b3J5KVxuICAgICAgZXhwZWN0KHN0YXRlLmdldE91dHB1dEZvcm1hdCgpKS50b0VxdWFsKCdwZGYnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldFByb2R1Y2VyKCkpLnRvRXF1YWwoJ2R2aXBkZm14JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmdpbmUoKSkudG9FcXVhbCgncGRmbGF0ZXgnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldENsZWFuUGF0dGVybnMoKSkudG9FcXVhbChjbGVhblBhdHRlcm5zKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuYWJsZVNoZWxsRXNjYXBlKCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmFibGVTeW5jdGV4KCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSgpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KCkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYycsICgpID0+IHtcbiAgICBpdCgnZGV0ZWN0cyBtYWdpYyBhbmQgb3ZlcnJpZGVzIGJ1aWxkIHN0YXRlIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ21hZ2ljLWNvbW1lbnRzJywgJ292ZXJyaWRlLXNldHRpbmdzLnRleCcpXG4gICAgICBjb25zdCBzdGF0ZSA9IG5ldyBCdWlsZFN0YXRlKGZpbGVQYXRoKVxuICAgICAgY29uc3QgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKVxuXG4gICAgICBjb21wb3Nlci5pbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYyhzdGF0ZSlcblxuICAgICAgZXhwZWN0KHN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpKS50b0VxdWFsKCd3aWJibGUnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldE91dHB1dEZvcm1hdCgpKS50b0VxdWFsKCdwcycpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0UHJvZHVjZXIoKSkudG9FcXVhbCgneGR2aXBkZm14JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmdpbmUoKSkudG9FcXVhbCgnbHVhbGF0ZXgnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEpvYk5hbWVzKCkpLnRvRXF1YWwoWydmb28gYmFyJywgJ3NuYWZ1J10pXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0Q2xlYW5QYXR0ZXJucygpKS50b0VxdWFsKFsnKiovKi5xdXV4JywgJ2Zvby9iYXInXSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmFibGVTaGVsbEVzY2FwZSgpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5hYmxlU3luY3RleCgpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUoKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSgpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdkZXRlY3Qgcm9vdCBtYWdpYyBjb21tZW50IGFuZCBsb2FkcyByZW1haW5pbmcgbWFnaWMgY29tbWVudHMgZnJvbSByb290JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnbWFnaWMtY29tbWVudHMnLCAnbXVsdGlwbGUtbWFnaWMtY29tbWVudHMudGV4JylcbiAgICAgIGNvbnN0IHN0YXRlID0gbmV3IEJ1aWxkU3RhdGUoZmlsZVBhdGgpXG4gICAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcigpXG5cbiAgICAgIGNvbXBvc2VyLmluaXRpYWxpemVCdWlsZFN0YXRlRnJvbU1hZ2ljKHN0YXRlKVxuXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5naW5lKCkpLm5vdC50b0VxdWFsKCdsdWFsYXRleCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnaW5pdGlhbGl6ZUJ1aWxkJywgKCkgPT4ge1xuICAgIGl0KCd2ZXJpZmllcyB0aGF0IGJ1aWxkIHN0YXRlIGlzIGNhY2hlZCBhbmQgdGhhdCBvbGQgY2FjaGVkIHN0YXRlIGlzIHJlbW92ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcigpXG4gICAgICBjb25zdCBmaXh0dXJlc1BhdGggPSBoZWxwZXJzLmNsb25lRml4dHVyZXMoKVxuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZS50ZXgnKVxuICAgICAgY29uc3Qgc3ViRmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbWFnaWMtY29tbWVudHMnLCAnbXVsdGlwbGUtbWFnaWMtY29tbWVudHMudGV4JylcbiAgICAgIGNvbnN0IGVuZ2luZSA9ICdsdWFsYXRleCdcblxuICAgICAgbGV0IGJ1aWxkID0gY29tcG9zZXIuaW5pdGlhbGl6ZUJ1aWxkKHN1YkZpbGVQYXRoKVxuICAgICAgLy8gU2V0IGVuZ2luZSBhcyBhIGZsYWcgdG8gaW5kaWNhdGUgdGhlIGNhY2hlZCBzdGF0ZVxuICAgICAgYnVpbGQuc3RhdGUuc2V0RW5naW5lKGVuZ2luZSlcbiAgICAgIGV4cGVjdChidWlsZC5zdGF0ZS5nZXRGaWxlUGF0aCgpKS50b0JlKGZpbGVQYXRoKVxuICAgICAgZXhwZWN0KGJ1aWxkLnN0YXRlLmhhc1N1YmZpbGUoc3ViRmlsZVBhdGgpKS50b0JlKHRydWUpXG5cbiAgICAgIGJ1aWxkID0gY29tcG9zZXIuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoLCB0cnVlKVxuICAgICAgZXhwZWN0KGJ1aWxkLnN0YXRlLmdldEVuZ2luZSgpKS50b0JlKGVuZ2luZSlcbiAgICAgIGV4cGVjdChidWlsZC5zdGF0ZS5oYXNTdWJmaWxlKHN1YkZpbGVQYXRoKSkudG9CZSh0cnVlKVxuXG4gICAgICBidWlsZCA9IGNvbXBvc2VyLmluaXRpYWxpemVCdWlsZChmaWxlUGF0aClcbiAgICAgIGV4cGVjdChidWlsZC5zdGF0ZS5nZXRFbmdpbmUoKSkubm90LnRvQmUoZW5naW5lKVxuICAgICAgZXhwZWN0KGJ1aWxkLnN0YXRlLmhhc1N1YmZpbGUoc3ViRmlsZVBhdGgpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCBtYWdpYyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGNvbmZpZyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnbWFnaWMtY29tbWVudHMnLCAnb3ZlcnJpZGUtc2V0dGluZ3MudGV4JylcbiAgICAgIGNvbnN0IGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKClcblxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5lbmFibGVTaGVsbEVzY2FwZScsIGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5lbmFibGVFeHRlbmRlZEJ1aWxkTW9kZScsIGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnknLCBmYWxzZSlcblxuICAgICAgc3B5T24oY29tcG9zZXIsICdpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21TZXR0aW5nc0ZpbGUnKS5hbmRDYWxsRmFrZSgoKSA9PiB7fSlcblxuICAgICAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcG9zZXIuaW5pdGlhbGl6ZUJ1aWxkKGZpbGVQYXRoKVxuXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0T3V0cHV0RGlyZWN0b3J5KCkpLnRvRXF1YWwoJ3dpYmJsZScpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0T3V0cHV0Rm9ybWF0KCkpLnRvRXF1YWwoJ3BzJylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRQcm9kdWNlcigpKS50b0VxdWFsKCd4ZHZpcGRmbXgnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuZ2luZSgpKS50b0VxdWFsKCdsdWFsYXRleCcpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0Sm9iTmFtZXMoKSkudG9FcXVhbChbJ2ZvbyBiYXInLCAnc25hZnUnXSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRDbGVhblBhdHRlcm5zKCkpLnRvRXF1YWwoWycqKi8qLnF1dXgnLCAnZm9vL2JhciddKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuYWJsZVNoZWxsRXNjYXBlKCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmFibGVTeW5jdGV4KCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSgpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KCkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoYXQgc2V0dGluZ3MgZmlsZSBwcm9wZXJ0aWVzIG92ZXJyaWRlIGNvbmZpZyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnbWFnaWMtY29tbWVudHMnLCAnb3ZlcnJpZGUtc2V0dGluZ3MudGV4JylcbiAgICAgIGNvbnN0IGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKClcblxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5lbmFibGVTaGVsbEVzY2FwZScsIGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5lbmFibGVFeHRlbmRlZEJ1aWxkTW9kZScsIGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnknLCBmYWxzZSlcblxuICAgICAgc3B5T24oY29tcG9zZXIsICdpbml0aWFsaXplQnVpbGRTdGF0ZUZyb21NYWdpYycpLmFuZENhbGxGYWtlKCgpID0+IHt9KVxuXG4gICAgICBjb25zdCB7IHN0YXRlIH0gPSBjb21wb3Nlci5pbml0aWFsaXplQnVpbGQoZmlsZVBhdGgpXG5cbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKSkudG9FcXVhbCgnZm9vJylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKSkudG9FcXVhbCgnZHZpJylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRQcm9kdWNlcigpKS50b0VxdWFsKCdwczJwZGYnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuZ2luZSgpKS50b0VxdWFsKCd4ZWxhdGV4JylcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRKb2JOYW1lcygpKS50b0VxdWFsKFsnd2liYmxlJywgJ3F1dXgnXSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRDbGVhblBhdHRlcm5zKCkpLnRvRXF1YWwoWycqKi8qLnNuYWZ1JywgJ2Zvby9iYXIvYmF4J10pXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5hYmxlU2hlbGxFc2NhcGUoKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuYWJsZVN5bmN0ZXgoKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChzdGF0ZS5nZXRNb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnkoKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCBzZXR0aW5ncyBmaWxlIHByb3BlcnRpZXMgb3ZlcnJpZGUgbWFnaWMgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ21hZ2ljLWNvbW1lbnRzJywgJ292ZXJyaWRlLXNldHRpbmdzLnRleCcpXG4gICAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcigpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnLCBmYWxzZSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUnLCBmYWxzZSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5JywgZmFsc2UpXG5cbiAgICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXBvc2VyLmluaXRpYWxpemVCdWlsZChmaWxlUGF0aClcblxuICAgICAgZXhwZWN0KHN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpKS50b0VxdWFsKCdmb28nKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldE91dHB1dEZvcm1hdCgpKS50b0VxdWFsKCdkdmknKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldFByb2R1Y2VyKCkpLnRvRXF1YWwoJ3BzMnBkZicpXG4gICAgICBleHBlY3Qoc3RhdGUuZ2V0RW5naW5lKCkpLnRvRXF1YWwoJ3hlbGF0ZXgnKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldEpvYk5hbWVzKCkpLnRvRXF1YWwoWyd3aWJibGUnLCAncXV1eCddKVxuICAgICAgZXhwZWN0KHN0YXRlLmdldENsZWFuUGF0dGVybnMoKSkudG9FcXVhbChbJyoqLyouc25hZnUnLCAnZm9vL2Jhci9iYXgnXSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdyZXNvbHZlT3V0cHV0RmlsZVBhdGgnLCAoKSA9PiB7XG4gICAgbGV0IGJ1aWxkZXIsIHN0YXRlLCBqb2JTdGF0ZSwgY29tcG9zZXJcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY29tcG9zZXIgPSBuZXcgQ29tcG9zZXIoKVxuICAgICAgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgnZm9vLnRleCcpXG4gICAgICBqb2JTdGF0ZSA9IHN0YXRlLmdldEpvYlN0YXRlcygpWzBdXG4gICAgICBidWlsZGVyID0gamFzbWluZS5jcmVhdGVTcHlPYmooJ01vY2tCdWlsZGVyJywgWydwYXJzZUxvZ0FuZEZkYkZpbGVzJ10pXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIG91dHB1dEZpbGVQYXRoIGlmIGFscmVhZHkgc2V0IGluIGpvYlN0YXRlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSAnZm9vLnBkZidcblxuICAgICAgam9iU3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgob3V0cHV0RmlsZVBhdGgpXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoYnVpbGRlciwgam9iU3RhdGUpKS50b0VxdWFsKG91dHB1dEZpbGVQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBvdXRwdXRGaWxlUGF0aCByZXR1cm5lZCBieSBwYXJzZUxvZ0FuZEZkYkZpbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSAnZm9vLnBkZidcblxuICAgICAgYnVpbGRlci5wYXJzZUxvZ0FuZEZkYkZpbGVzLmFuZENhbGxGYWtlKHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgob3V0cHV0RmlsZVBhdGgpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QoY29tcG9zZXIucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGJ1aWxkZXIsIGpvYlN0YXRlKSkudG9FcXVhbChvdXRwdXRGaWxlUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgbnVsbCByZXR1cm5lZCBpZiBwYXJzZUxvZ0FuZEZkYkZpbGVzIGZhaWxzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGNvbXBvc2VyLnJlc29sdmVPdXRwdXRGaWxlUGF0aChidWlsZGVyLCBqb2JTdGF0ZSkpLnRvRXF1YWwobnVsbClcbiAgICB9KVxuXG4gICAgaXQoJ3VwZGF0ZXMgb3V0cHV0RmlsZVBhdGggaWYgbW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5IGlzIHNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gJ2Zvby5wZGYnXG4gICAgICBjb25zdCBvdXRwdXREaXJlY3RvcnkgPSAnYmFyJ1xuXG4gICAgICBzdGF0ZS5zZXRPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KVxuICAgICAgc3RhdGUuc2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KHRydWUpXG5cbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dBbmRGZGJGaWxlcy5hbmRDYWxsRmFrZShzdGF0ZSA9PiB7XG4gICAgICAgIHN0YXRlLnNldE91dHB1dEZpbGVQYXRoKHBhdGguam9pbihvdXRwdXREaXJlY3RvcnksIG91dHB1dEZpbGVQYXRoKSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoYnVpbGRlciwgam9iU3RhdGUpKS50b0VxdWFsKG91dHB1dEZpbGVQYXRoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19