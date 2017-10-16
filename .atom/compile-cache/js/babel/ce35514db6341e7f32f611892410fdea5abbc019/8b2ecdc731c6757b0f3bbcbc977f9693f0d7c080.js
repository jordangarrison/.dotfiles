function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libBuildersLatexmk = require('../../lib/builders/latexmk');

var _libBuildersLatexmk2 = _interopRequireDefault(_libBuildersLatexmk);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _libBuildState = require('../../lib/build-state');

var _libBuildState2 = _interopRequireDefault(_libBuildState);

describe('LatexmkBuilder', function () {
  var builder = undefined,
      fixturesPath = undefined,
      filePath = undefined,
      extendedOutputPaths = undefined,
      state = undefined,
      jobState = undefined;

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });
    builder = new _libBuildersLatexmk2['default']();
    fixturesPath = _specHelpers2['default'].cloneFixtures();
    filePath = _path2['default'].join(fixturesPath, 'file.tex');
    state = new _libBuildState2['default'](filePath);
    state.setEngine('pdflatex');
    state.setOutputFormat('pdf');
    state.setOutputDirectory('');
    state.setEnableSynctex(true);
    state.setEnableExtendedBuildMode(true);
    jobState = state.getJobStates()[0];
  });

  function initializeExtendedBuild(name, extensions) {
    var outputDirectory = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

    var dir = _path2['default'].join(fixturesPath, 'latexmk');
    filePath = _path2['default'].format({ dir: dir, name: name, ext: '.tex' });
    state.setFilePath(filePath);
    dir = _path2['default'].join(dir, outputDirectory);
    state.setOutputDirectory(outputDirectory);
    extendedOutputPaths = extensions.map(function (ext) {
      return _path2['default'].format({ dir: dir, name: name, ext: ext });
    });
  }

  function expectExistenceOfExtendedOutputs() {
    for (var output of extendedOutputPaths) {
      expect(_fsPlus2['default'].existsSync(output)).toBe(true, 'Check the existence of ' + output + ' file.');
    }
  }

  describe('constructArgs', function () {
    it('produces default arguments when package has default config values', function () {
      var latexmkrcPath = _path2['default'].resolve(__dirname, '..', '..', 'resources', 'latexmkrc');
      var expectedArgs = ['-interaction=nonstopmode', '-f', '-cd', '-file-line-error', '-synctex=1', '-r "' + latexmkrcPath + '"', '-pdf', '"' + filePath + '"'];
      var args = builder.constructArgs(jobState);

      expect(args).toEqual(expectedArgs);
    });

    it('adds -g flag when rebuild is passed', function () {
      state.setShouldRebuild(true);
      expect(builder.constructArgs(jobState)).toContain('-g');
    });

    it('adds -shell-escape flag when package config value is set', function () {
      state.setEnableShellEscape(true);
      expect(builder.constructArgs(jobState)).toContain('-shell-escape');
    });

    it('disables synctex according to package config', function () {
      state.setEnableSynctex(false);
      expect(builder.constructArgs(jobState)).not.toContain('-synctex=1');
    });

    it('adds -outdir=<path> argument according to package config', function () {
      var outdir = 'bar';
      var expectedArg = '-outdir="' + outdir + '"';
      state.setOutputDirectory(outdir);

      expect(builder.constructArgs(jobState)).toContain(expectedArg);
    });

    it('adds lualatex argument according to package config', function () {
      state.setEngine('lualatex');
      expect(builder.constructArgs(jobState)).toContain('-lualatex');
    });

    it('adds xelatex argument according to package config', function () {
      state.setEngine('xelatex');
      expect(builder.constructArgs(jobState)).toContain('-xelatex');
    });

    it('adds a custom engine string according to package config', function () {
      state.setEngine('pdflatex %O %S');
      expect(builder.constructArgs(jobState)).toContain('-pdflatex="pdflatex %O %S"');
    });

    it('adds -ps and removes -pdf arguments according to package config', function () {
      state.setOutputFormat('ps');
      var args = builder.constructArgs(jobState);
      expect(args).toContain('-ps');
      expect(args).not.toContain('-pdf');
    });

    it('adds -dvi and removes -pdf arguments according to package config', function () {
      state.setOutputFormat('dvi');
      var args = builder.constructArgs(jobState);
      expect(args).toContain('-dvi');
      expect(args).not.toContain('-pdf');
    });

    it('adds latex dvipdfmx arguments according to package config', function () {
      state.setEngine('uplatex');
      state.setProducer('dvipdfmx');
      var args = builder.constructArgs(jobState);
      expect(args).toContain('-latex="uplatex"');
      expect(args).toContain('-pdfdvi -e "$dvipdf = \'dvipdfmx %O -o %D %S\';"');
      expect(args).not.toContain('-pdf');
    });

    it('adds latex dvipdf arguments according to package config', function () {
      state.setEngine('uplatex');
      state.setProducer('dvipdf');
      var args = builder.constructArgs(jobState);
      expect(args).toContain('-latex="uplatex"');
      expect(args).toContain('-pdfdvi -e "$dvipdf = \'dvipdf %O %S %D\';"');
      expect(args).not.toContain('-pdf');
    });

    it('adds latex ps arguments according to package config', function () {
      state.setEngine('uplatex');
      state.setProducer('ps2pdf');
      var args = builder.constructArgs(jobState);
      expect(args).toContain('-latex="uplatex"');
      expect(args).toContain('-pdfps');
      expect(args).not.toContain('-pdf');
    });

    it('removes latexmkrc argument according to package config', function () {
      state.setEnableExtendedBuildMode(false);
      var args = builder.constructArgs(jobState);
      var latexmkrcPath = _path2['default'].resolve(__dirname, '..', '..', 'resources', 'latexmkrc');
      expect(args).not.toContain('-r "' + latexmkrcPath + '"');
    });

    it('adds a jobname argument when passed a non-null jobname', function () {
      state.setJobNames(['foo']);
      jobState = state.getJobStates()[0];
      expect(builder.constructArgs(jobState)).toContain('-jobname="foo"');
    });
  });

  describe('run', function () {
    var exitCode = undefined;

    beforeEach(function () {
      spyOn(builder, 'logStatusCode').andCallThrough();
    });

    it('successfully executes latexmk when given a valid TeX file', function () {
      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
      });
    });

    it('successfully executes latexmk when given a file path containing spaces', function () {
      filePath = _path2['default'].join(fixturesPath, 'filename with spaces.tex');
      state.setFilePath(filePath);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
      });
    });

    it('successfully executes latexmk when given a jobname', function () {
      state.setJobNames(['foo']);
      jobState = state.getJobStates()[0];

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
      });
    });

    it('successfully executes latexmk when given a jobname with spaces', function () {
      state.setJobNames(['foo bar']);
      jobState = state.getJobStates()[0];

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
      });
    });

    it('fails with code 12 and various errors, warnings and info messages are produced in log file', function () {
      filePath = _path2['default'].join(fixturesPath, 'error-warning.tex');
      state.setFilePath(filePath);
      var subFilePath = _path2['default'].join(fixturesPath, 'sub', 'wibble.tex');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
          builder.parseLogFile(jobState);
        });
      });

      runs(function () {
        var logMessages = jobState.getLogMessages();
        var messages = [{ type: 'error', text: 'There\'s no line here to end' }, { type: 'error', text: 'Argument of \\@sect has an extra }' }, { type: 'error', text: 'Paragraph ended before \\@sect was complete' }, { type: 'error', text: 'Extra alignment tab has been changed to \\cr' }, { type: 'warning', text: 'Reference `tab:snafu\' on page 1 undefined' }, { type: 'error', text: 'Class foo: Significant class issue' }, { type: 'warning', text: 'Class foo: Class issue' }, { type: 'warning', text: 'Class foo: Nebulous class issue' }, { type: 'info', text: 'Class foo: Insignificant class issue' }, { type: 'error', text: 'Package bar: Significant package issue' }, { type: 'warning', text: 'Package bar: Package issue' }, { type: 'warning', text: 'Package bar: Nebulous package issue' }, { type: 'info', text: 'Package bar: Insignificant package issue' }, { type: 'warning', text: 'There were undefined references' }];

        // Loop through the required messages and make sure that each one appears
        // in the parsed log output. We do not do a direct one-to-one comparison
        // since there will likely be font messages which may be dependent on
        // which TeX distribution is being used or which fonts are currently
        // installed.

        var _loop = function (message) {
          expect(logMessages.some(function (logMessage) {
            return message.type === logMessage.type && message.text === logMessage.text;
          })).toBe(true, 'Message = ' + message.text);
        };

        for (var message of messages) {
          _loop(message);
        }

        expect(logMessages.every(function (logMessage) {
          return !logMessage.filePath || logMessage.filePath === filePath || logMessage.filePath === subFilePath;
        })).toBe(true, 'Incorrect file path resolution in log.');

        expect(builder.logStatusCode).toHaveBeenCalled();
        expect(exitCode).toBe(12);
      });
    });

    it('fails to execute latexmk when given invalid arguments', function () {
      spyOn(builder, 'constructArgs').andReturn(['-invalid-argument']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(10);
        expect(builder.logStatusCode).toHaveBeenCalled();
      });
    });

    it('fails to execute latexmk when given invalid file path', function () {
      state.setFilePath(_path2['default'].join(fixturesPath, 'foo.tex'));
      var args = builder.constructArgs(jobState);

      // Need to remove the 'force' flag to trigger the desired failure.
      var removed = args.splice(1, 1);
      expect(removed).toEqual(['-f']);

      spyOn(builder, 'constructArgs').andReturn(args);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(11);
        expect(builder.logStatusCode).toHaveBeenCalled();
      });
    });

    it('successfully creates asymptote files when using the asymptote package', function () {
      initializeExtendedBuild('asymptote-test', ['-1.tex', '.pdf']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates asymptote files when using the asymptote package with an output directory', function () {
      initializeExtendedBuild('asymptote-test', ['-1.tex', '.pdf'], 'build');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates glossary files when using the glossaries package', function () {
      initializeExtendedBuild('glossaries-test', ['.acn', '.acr', '.glo', '.gls', '.pdf']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates glossary files when using the glossaries package with an output directory', function () {
      initializeExtendedBuild('glossaries-test', ['.acn', '.acr', '.glo', '.gls', '.pdf'], 'build');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates metapost files when using the feynmp package', function () {
      initializeExtendedBuild('mpost-test', ['-feynmp.1', '.pdf']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates metapost files when using the feynmp package with an output directory', function () {
      initializeExtendedBuild('mpost-test', ['-feynmp.1', '.pdf'], 'build');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates nomenclature files when using the nomencl package', function () {
      initializeExtendedBuild('nomencl-test', ['.nlo', '.nls', '.pdf']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates nomenclature files when using the nomencl package with an output directory', function () {
      initializeExtendedBuild('nomencl-test', ['.nlo', '.nls', '.pdf'], 'build');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates index files when using the index package', function () {
      initializeExtendedBuild('index-test', ['.idx', '.ind', '.ldx', '.lnd', '.pdf']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates index files when using the index package with an output directory', function () {
      initializeExtendedBuild('index-test', ['.idx', '.ind', '.ldx', '.lnd', '.pdf'], 'build');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    // Sage only runs in a VM on Windows and installing Sage at 1GB for two tests
    // is excessive.
    if (process.platform === 'win32' || process.env.CI) return;

    it('successfully creates SageTeX files when using the sagetex package', function () {
      initializeExtendedBuild('sagetex-test', ['.sagetex.sage', '.sagetex.sout', '.pdf']);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });

    it('successfully creates SageTeX files when using the sagetex package with an output directory', function () {
      initializeExtendedBuild('sagetex-test', ['.sagetex.sage', '.sagetex.sout', '.pdf'], 'build');

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expectExistenceOfExtendedOutputs();
      });
    });
  });

  describe('canProcess', function () {
    it('returns true when given a file path with a .tex extension', function () {
      var canProcess = _libBuildersLatexmk2['default'].canProcess(state);
      expect(canProcess).toBe(true);
    });
  });

  describe('logStatusCode', function () {
    it('handles latexmk specific status codes', function () {
      var messages = [];
      spyOn(latex.log, 'error').andCallFake(function (message) {
        return messages.push(message);
      });

      var statusCodes = [10, 11, 12, 13, 20];
      statusCodes.forEach(function (statusCode) {
        return builder.logStatusCode(statusCode);
      });

      var startsWithPrefix = function startsWithPrefix(str) {
        return str.startsWith('latexmk:');
      };

      expect(messages.length).toBe(statusCodes.length);
      expect(messages.filter(startsWithPrefix).length).toBe(statusCodes.length);
    });

    it('passes through to superclass when given non-latexmk status codes', function () {
      var stderr = 'wibble';
      var superclass = Object.getPrototypeOf(builder);
      spyOn(superclass, 'logStatusCode').andCallThrough();

      var statusCode = 1;
      builder.logStatusCode(statusCode, stderr);

      expect(superclass.logStatusCode).toHaveBeenCalledWith(statusCode, stderr);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkZXJzL2xhdGV4bWstc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzJCQUVvQixpQkFBaUI7Ozs7b0JBQ3BCLE1BQU07Ozs7a0NBQ0ksNEJBQTRCOzs7O3NCQUN4QyxTQUFTOzs7OzZCQUNELHVCQUF1Qjs7OztBQUU5QyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBTTtBQUMvQixNQUFJLE9BQU8sWUFBQTtNQUFFLFlBQVksWUFBQTtNQUFFLFFBQVEsWUFBQTtNQUFFLG1CQUFtQixZQUFBO01BQUUsS0FBSyxZQUFBO01BQUUsUUFBUSxZQUFBLENBQUE7O0FBRXpFLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8seUJBQVEsZ0JBQWdCLEVBQUUsQ0FBQTtLQUNsQyxDQUFDLENBQUE7QUFDRixXQUFPLEdBQUcscUNBQW9CLENBQUE7QUFDOUIsZ0JBQVksR0FBRyx5QkFBUSxhQUFhLEVBQUUsQ0FBQTtBQUN0QyxZQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUM5QyxTQUFLLEdBQUcsK0JBQWUsUUFBUSxDQUFDLENBQUE7QUFDaEMsU0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUMzQixTQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVCLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM1QixTQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDNUIsU0FBSyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3RDLFlBQVEsR0FBRyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDbkMsQ0FBQyxDQUFBOztBQUVGLFdBQVMsdUJBQXVCLENBQUUsSUFBSSxF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LE1BQU0sQ0FBQyxDQUFBOztBQUV6QyxZQUFNLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtLQUMxRSxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvYnVpbGRlcnMvbGF0ZXhtay1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IExhdGV4bWtCdWlsZGVyIGZyb20gJy4uLy4uL2xpYi9idWlsZGVycy9sYXRleG1rJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgQnVpbGRTdGF0ZSBmcm9tICcuLi8uLi9saWIvYnVpbGQtc3RhdGUnXG5cbmRlc2NyaWJlKCdMYXRleG1rQnVpbGRlcicsICgpID0+IHtcbiAgbGV0IGJ1aWxkZXIsIGZpeHR1cmVzUGF0aCwgZmlsZVBhdGgsIGV4dGVuZGVkT3V0cHV0UGF0aHMsIHN0YXRlLCBqb2JTdGF0ZVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gaGVscGVycy5hY3RpdmF0ZVBhY2thZ2VzKClcbiAgICB9KVxuICAgIGJ1aWxkZXIgPSBuZXcgTGF0ZXhta0J1aWxkZXIoKVxuICAgIGZpeHR1cmVzUGF0aCA9IGhlbHBlcnMuY2xvbmVGaXh0dXJlcygpXG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZS50ZXgnKVxuICAgIHN0YXRlID0gbmV3IEJ1aWxkU3RhdGUoZmlsZVBhdGgpXG4gICAgc3RhdGUuc2V0RW5naW5lKCdwZGZsYXRleCcpXG4gICAgc3RhdGUuc2V0T3V0cHV0Rm9ybWF0KCdwZGYnKVxuICAgIHN0YXRlLnNldE91dHB1dERpcmVjdG9yeSgnJylcbiAgICBzdGF0ZS5zZXRFbmFibGVTeW5jdGV4KHRydWUpXG4gICAgc3RhdGUuc2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUodHJ1ZSlcbiAgICBqb2JTdGF0ZSA9IHN0YXRlLmdldEpvYlN0YXRlcygpWzBdXG4gIH0pXG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUV4dGVuZGVkQnVpbGQgKG5hbWUsIGV4dGVuc2lvbnMsIG91dHB1dERpcmVjdG9yeSA9ICcnKSB7XG4gICAgbGV0IGRpciA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdsYXRleG1rJylcbiAgICBmaWxlUGF0aCA9IHBhdGguZm9ybWF0KHsgZGlyLCBuYW1lLCBleHQ6ICcudGV4JyB9KVxuICAgIHN0YXRlLnNldEZpbGVQYXRoKGZpbGVQYXRoKVxuICAgIGRpciA9IHBhdGguam9pbihkaXIsIG91dHB1dERpcmVjdG9yeSlcbiAgICBzdGF0ZS5zZXRPdXRwdXREaXJlY3Rvcnkob3V0cHV0RGlyZWN0b3J5KVxuICAgIGV4dGVuZGVkT3V0cHV0UGF0aHMgPSBleHRlbnNpb25zLm1hcChleHQgPT4gcGF0aC5mb3JtYXQoeyBkaXIsIG5hbWUsIGV4dCB9KSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cGVjdEV4aXN0ZW5jZU9mRXh0ZW5kZWRPdXRwdXRzICgpIHtcbiAgICBmb3IgKGNvbnN0IG91dHB1dCBvZiBleHRlbmRlZE91dHB1dFBhdGhzKSB7XG4gICAgICBleHBlY3QoZnMuZXhpc3RzU3luYyhvdXRwdXQpKS50b0JlKHRydWUsIGBDaGVjayB0aGUgZXhpc3RlbmNlIG9mICR7b3V0cHV0fSBmaWxlLmApXG4gICAgfVxuICB9XG5cbiAgZGVzY3JpYmUoJ2NvbnN0cnVjdEFyZ3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Byb2R1Y2VzIGRlZmF1bHQgYXJndW1lbnRzIHdoZW4gcGFja2FnZSBoYXMgZGVmYXVsdCBjb25maWcgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbGF0ZXhta3JjUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnbGF0ZXhta3JjJylcbiAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFtcbiAgICAgICAgJy1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZScsXG4gICAgICAgICctZicsXG4gICAgICAgICctY2QnLFxuICAgICAgICAnLWZpbGUtbGluZS1lcnJvcicsXG4gICAgICAgICctc3luY3RleD0xJyxcbiAgICAgICAgYC1yIFwiJHtsYXRleG1rcmNQYXRofVwiYCxcbiAgICAgICAgJy1wZGYnLFxuICAgICAgICBgXCIke2ZpbGVQYXRofVwiYFxuICAgICAgXVxuICAgICAgY29uc3QgYXJncyA9IGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSlcblxuICAgICAgZXhwZWN0KGFyZ3MpLnRvRXF1YWwoZXhwZWN0ZWRBcmdzKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyAtZyBmbGFnIHdoZW4gcmVidWlsZCBpcyBwYXNzZWQnLCAoKSA9PiB7XG4gICAgICBzdGF0ZS5zZXRTaG91bGRSZWJ1aWxkKHRydWUpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGpvYlN0YXRlKSkudG9Db250YWluKCctZycpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIC1zaGVsbC1lc2NhcGUgZmxhZyB3aGVuIHBhY2thZ2UgY29uZmlnIHZhbHVlIGlzIHNldCcsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZVNoZWxsRXNjYXBlKHRydWUpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGpvYlN0YXRlKSkudG9Db250YWluKCctc2hlbGwtZXNjYXBlJylcbiAgICB9KVxuXG4gICAgaXQoJ2Rpc2FibGVzIHN5bmN0ZXggYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnJywgKCkgPT4ge1xuICAgICAgc3RhdGUuc2V0RW5hYmxlU3luY3RleChmYWxzZSlcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpKS5ub3QudG9Db250YWluKCctc3luY3RleD0xJylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgLW91dGRpcj08cGF0aD4gYXJndW1lbnQgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0ZGlyID0gJ2JhcidcbiAgICAgIGNvbnN0IGV4cGVjdGVkQXJnID0gYC1vdXRkaXI9XCIke291dGRpcn1cImBcbiAgICAgIHN0YXRlLnNldE91dHB1dERpcmVjdG9yeShvdXRkaXIpXG5cbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpKS50b0NvbnRhaW4oZXhwZWN0ZWRBcmcpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIGx1YWxhdGV4IGFyZ3VtZW50IGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldEVuZ2luZSgnbHVhbGF0ZXgnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSkpLnRvQ29udGFpbignLWx1YWxhdGV4JylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgeGVsYXRleCBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBzdGF0ZS5zZXRFbmdpbmUoJ3hlbGF0ZXgnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSkpLnRvQ29udGFpbignLXhlbGF0ZXgnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyBhIGN1c3RvbSBlbmdpbmUgc3RyaW5nIGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldEVuZ2luZSgncGRmbGF0ZXggJU8gJVMnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSkpLnRvQ29udGFpbignLXBkZmxhdGV4PVwicGRmbGF0ZXggJU8gJVNcIicpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIC1wcyBhbmQgcmVtb3ZlcyAtcGRmIGFyZ3VtZW50cyBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBzdGF0ZS5zZXRPdXRwdXRGb3JtYXQoJ3BzJylcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpXG4gICAgICBleHBlY3QoYXJncykudG9Db250YWluKCctcHMnKVxuICAgICAgZXhwZWN0KGFyZ3MpLm5vdC50b0NvbnRhaW4oJy1wZGYnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyAtZHZpIGFuZCByZW1vdmVzIC1wZGYgYXJndW1lbnRzIGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldE91dHB1dEZvcm1hdCgnZHZpJylcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpXG4gICAgICBleHBlY3QoYXJncykudG9Db250YWluKCctZHZpJylcbiAgICAgIGV4cGVjdChhcmdzKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgbGF0ZXggZHZpcGRmbXggYXJndW1lbnRzIGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldEVuZ2luZSgndXBsYXRleCcpXG4gICAgICBzdGF0ZS5zZXRQcm9kdWNlcignZHZpcGRmbXgnKVxuICAgICAgY29uc3QgYXJncyA9IGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSlcbiAgICAgIGV4cGVjdChhcmdzKS50b0NvbnRhaW4oJy1sYXRleD1cInVwbGF0ZXhcIicpXG4gICAgICBleHBlY3QoYXJncykudG9Db250YWluKCctcGRmZHZpIC1lIFwiJGR2aXBkZiA9IFxcJ2R2aXBkZm14ICVPIC1vICVEICVTXFwnO1wiJylcbiAgICAgIGV4cGVjdChhcmdzKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgbGF0ZXggZHZpcGRmIGFyZ3VtZW50cyBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBzdGF0ZS5zZXRFbmdpbmUoJ3VwbGF0ZXgnKVxuICAgICAgc3RhdGUuc2V0UHJvZHVjZXIoJ2R2aXBkZicpXG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGpvYlN0YXRlKVxuICAgICAgZXhwZWN0KGFyZ3MpLnRvQ29udGFpbignLWxhdGV4PVwidXBsYXRleFwiJylcbiAgICAgIGV4cGVjdChhcmdzKS50b0NvbnRhaW4oJy1wZGZkdmkgLWUgXCIkZHZpcGRmID0gXFwnZHZpcGRmICVPICVTICVEXFwnO1wiJylcbiAgICAgIGV4cGVjdChhcmdzKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgbGF0ZXggcHMgYXJndW1lbnRzIGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldEVuZ2luZSgndXBsYXRleCcpXG4gICAgICBzdGF0ZS5zZXRQcm9kdWNlcigncHMycGRmJylcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpXG4gICAgICBleHBlY3QoYXJncykudG9Db250YWluKCctbGF0ZXg9XCJ1cGxhdGV4XCInKVxuICAgICAgZXhwZWN0KGFyZ3MpLnRvQ29udGFpbignLXBkZnBzJylcbiAgICAgIGV4cGVjdChhcmdzKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICB9KVxuXG4gICAgaXQoJ3JlbW92ZXMgbGF0ZXhta3JjIGFyZ3VtZW50IGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIHN0YXRlLnNldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKGZhbHNlKVxuICAgICAgY29uc3QgYXJncyA9IGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSlcbiAgICAgIGNvbnN0IGxhdGV4bWtyY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncmVzb3VyY2VzJywgJ2xhdGV4bWtyYycpXG4gICAgICBleHBlY3QoYXJncykubm90LnRvQ29udGFpbihgLXIgXCIke2xhdGV4bWtyY1BhdGh9XCJgKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyBhIGpvYm5hbWUgYXJndW1lbnQgd2hlbiBwYXNzZWQgYSBub24tbnVsbCBqb2JuYW1lJywgKCkgPT4ge1xuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoWydmb28nXSlcbiAgICAgIGpvYlN0YXRlID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKClbMF1cbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpKS50b0NvbnRhaW4oJy1qb2JuYW1lPVwiZm9vXCInKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3J1bicsICgpID0+IHtcbiAgICBsZXQgZXhpdENvZGVcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgc3B5T24oYnVpbGRlciwgJ2xvZ1N0YXR1c0NvZGUnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgfSlcblxuICAgIGl0KCdzdWNjZXNzZnVsbHkgZXhlY3V0ZXMgbGF0ZXhtayB3aGVuIGdpdmVuIGEgdmFsaWQgVGVYIGZpbGUnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oam9iU3RhdGUpLnRoZW4oY29kZSA9PiB7IGV4aXRDb2RlID0gY29kZSB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGV4ZWN1dGVzIGxhdGV4bWsgd2hlbiBnaXZlbiBhIGZpbGUgcGF0aCBjb250YWluaW5nIHNwYWNlcycsICgpID0+IHtcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2ZpbGVuYW1lIHdpdGggc3BhY2VzLnRleCcpXG4gICAgICBzdGF0ZS5zZXRGaWxlUGF0aChmaWxlUGF0aClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBleGVjdXRlcyBsYXRleG1rIHdoZW4gZ2l2ZW4gYSBqb2JuYW1lJywgKCkgPT4ge1xuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoWydmb28nXSlcbiAgICAgIGpvYlN0YXRlID0gc3RhdGUuZ2V0Sm9iU3RhdGVzKClbMF1cblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBleGVjdXRlcyBsYXRleG1rIHdoZW4gZ2l2ZW4gYSBqb2JuYW1lIHdpdGggc3BhY2VzJywgKCkgPT4ge1xuICAgICAgc3RhdGUuc2V0Sm9iTmFtZXMoWydmb28gYmFyJ10pXG4gICAgICBqb2JTdGF0ZSA9IHN0YXRlLmdldEpvYlN0YXRlcygpWzBdXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdmYWlscyB3aXRoIGNvZGUgMTIgYW5kIHZhcmlvdXMgZXJyb3JzLCB3YXJuaW5ncyBhbmQgaW5mbyBtZXNzYWdlcyBhcmUgcHJvZHVjZWQgaW4gbG9nIGZpbGUnLCAoKSA9PiB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdlcnJvci13YXJuaW5nLnRleCcpXG4gICAgICBzdGF0ZS5zZXRGaWxlUGF0aChmaWxlUGF0aClcbiAgICAgIGNvbnN0IHN1YkZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ3N1YicsICd3aWJibGUudGV4JylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4ge1xuICAgICAgICAgIGV4aXRDb2RlID0gY29kZVxuICAgICAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlKGpvYlN0YXRlKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvZ01lc3NhZ2VzID0gam9iU3RhdGUuZ2V0TG9nTWVzc2FnZXMoKVxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtcbiAgICAgICAgICB7IHR5cGU6ICdlcnJvcicsIHRleHQ6ICdUaGVyZVxcJ3Mgbm8gbGluZSBoZXJlIHRvIGVuZCcgfSxcbiAgICAgICAgICB7IHR5cGU6ICdlcnJvcicsIHRleHQ6ICdBcmd1bWVudCBvZiBcXFxcQHNlY3QgaGFzIGFuIGV4dHJhIH0nIH0sXG4gICAgICAgICAgeyB0eXBlOiAnZXJyb3InLCB0ZXh0OiAnUGFyYWdyYXBoIGVuZGVkIGJlZm9yZSBcXFxcQHNlY3Qgd2FzIGNvbXBsZXRlJyB9LFxuICAgICAgICAgIHsgdHlwZTogJ2Vycm9yJywgdGV4dDogJ0V4dHJhIGFsaWdubWVudCB0YWIgaGFzIGJlZW4gY2hhbmdlZCB0byBcXFxcY3InIH0sXG4gICAgICAgICAgeyB0eXBlOiAnd2FybmluZycsIHRleHQ6ICdSZWZlcmVuY2UgYHRhYjpzbmFmdVxcJyBvbiBwYWdlIDEgdW5kZWZpbmVkJyB9LFxuICAgICAgICAgIHsgdHlwZTogJ2Vycm9yJywgdGV4dDogJ0NsYXNzIGZvbzogU2lnbmlmaWNhbnQgY2xhc3MgaXNzdWUnIH0sXG4gICAgICAgICAgeyB0eXBlOiAnd2FybmluZycsIHRleHQ6ICdDbGFzcyBmb286IENsYXNzIGlzc3VlJyB9LFxuICAgICAgICAgIHsgdHlwZTogJ3dhcm5pbmcnLCB0ZXh0OiAnQ2xhc3MgZm9vOiBOZWJ1bG91cyBjbGFzcyBpc3N1ZScgfSxcbiAgICAgICAgICB7IHR5cGU6ICdpbmZvJywgdGV4dDogJ0NsYXNzIGZvbzogSW5zaWduaWZpY2FudCBjbGFzcyBpc3N1ZScgfSxcbiAgICAgICAgICB7IHR5cGU6ICdlcnJvcicsIHRleHQ6ICdQYWNrYWdlIGJhcjogU2lnbmlmaWNhbnQgcGFja2FnZSBpc3N1ZScgfSxcbiAgICAgICAgICB7IHR5cGU6ICd3YXJuaW5nJywgdGV4dDogJ1BhY2thZ2UgYmFyOiBQYWNrYWdlIGlzc3VlJyB9LFxuICAgICAgICAgIHsgdHlwZTogJ3dhcm5pbmcnLCB0ZXh0OiAnUGFja2FnZSBiYXI6IE5lYnVsb3VzIHBhY2thZ2UgaXNzdWUnIH0sXG4gICAgICAgICAgeyB0eXBlOiAnaW5mbycsIHRleHQ6ICdQYWNrYWdlIGJhcjogSW5zaWduaWZpY2FudCBwYWNrYWdlIGlzc3VlJyB9LFxuICAgICAgICAgIHsgdHlwZTogJ3dhcm5pbmcnLCB0ZXh0OiAnVGhlcmUgd2VyZSB1bmRlZmluZWQgcmVmZXJlbmNlcycgfVxuICAgICAgICBdXG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSByZXF1aXJlZCBtZXNzYWdlcyBhbmQgbWFrZSBzdXJlIHRoYXQgZWFjaCBvbmUgYXBwZWFyc1xuICAgICAgICAvLyBpbiB0aGUgcGFyc2VkIGxvZyBvdXRwdXQuIFdlIGRvIG5vdCBkbyBhIGRpcmVjdCBvbmUtdG8tb25lIGNvbXBhcmlzb25cbiAgICAgICAgLy8gc2luY2UgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZm9udCBtZXNzYWdlcyB3aGljaCBtYXkgYmUgZGVwZW5kZW50IG9uXG4gICAgICAgIC8vIHdoaWNoIFRlWCBkaXN0cmlidXRpb24gaXMgYmVpbmcgdXNlZCBvciB3aGljaCBmb250cyBhcmUgY3VycmVudGx5XG4gICAgICAgIC8vIGluc3RhbGxlZC5cbiAgICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgZXhwZWN0KGxvZ01lc3NhZ2VzLnNvbWUoXG4gICAgICAgICAgICBsb2dNZXNzYWdlID0+IG1lc3NhZ2UudHlwZSA9PT0gbG9nTWVzc2FnZS50eXBlICYmIG1lc3NhZ2UudGV4dCA9PT0gbG9nTWVzc2FnZS50ZXh0KSkudG9CZSh0cnVlLCBgTWVzc2FnZSA9ICR7bWVzc2FnZS50ZXh0fWApXG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QobG9nTWVzc2FnZXMuZXZlcnkoXG4gICAgICAgICAgbG9nTWVzc2FnZSA9PiAhbG9nTWVzc2FnZS5maWxlUGF0aCB8fCBsb2dNZXNzYWdlLmZpbGVQYXRoID09PSBmaWxlUGF0aCB8fCBsb2dNZXNzYWdlLmZpbGVQYXRoID09PSBzdWJGaWxlUGF0aCkpXG4gICAgICAgICAgLnRvQmUodHJ1ZSwgJ0luY29ycmVjdCBmaWxlIHBhdGggcmVzb2x1dGlvbiBpbiBsb2cuJylcblxuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDEyKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2ZhaWxzIHRvIGV4ZWN1dGUgbGF0ZXhtayB3aGVuIGdpdmVuIGludmFsaWQgYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgc3B5T24oYnVpbGRlciwgJ2NvbnN0cnVjdEFyZ3MnKS5hbmRSZXR1cm4oWyctaW52YWxpZC1hcmd1bWVudCddKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oam9iU3RhdGUpLnRoZW4oY29kZSA9PiB7IGV4aXRDb2RlID0gY29kZSB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgxMClcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmFpbHMgdG8gZXhlY3V0ZSBsYXRleG1rIHdoZW4gZ2l2ZW4gaW52YWxpZCBmaWxlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBzdGF0ZS5zZXRGaWxlUGF0aChwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZm9vLnRleCcpKVxuICAgICAgY29uc3QgYXJncyA9IGJ1aWxkZXIuY29uc3RydWN0QXJncyhqb2JTdGF0ZSlcblxuICAgICAgLy8gTmVlZCB0byByZW1vdmUgdGhlICdmb3JjZScgZmxhZyB0byB0cmlnZ2VyIHRoZSBkZXNpcmVkIGZhaWx1cmUuXG4gICAgICBjb25zdCByZW1vdmVkID0gYXJncy5zcGxpY2UoMSwgMSlcbiAgICAgIGV4cGVjdChyZW1vdmVkKS50b0VxdWFsKFsnLWYnXSlcblxuICAgICAgc3B5T24oYnVpbGRlciwgJ2NvbnN0cnVjdEFyZ3MnKS5hbmRSZXR1cm4oYXJncylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMTEpXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBjcmVhdGVzIGFzeW1wdG90ZSBmaWxlcyB3aGVuIHVzaW5nIHRoZSBhc3ltcHRvdGUgcGFja2FnZScsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVFeHRlbmRlZEJ1aWxkKCdhc3ltcHRvdGUtdGVzdCcsXG4gICAgICAgIFsnLTEudGV4JywgJy5wZGYnXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3RFeGlzdGVuY2VPZkV4dGVuZGVkT3V0cHV0cygpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGNyZWF0ZXMgYXN5bXB0b3RlIGZpbGVzIHdoZW4gdXNpbmcgdGhlIGFzeW1wdG90ZSBwYWNrYWdlIHdpdGggYW4gb3V0cHV0IGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVFeHRlbmRlZEJ1aWxkKCdhc3ltcHRvdGUtdGVzdCcsXG4gICAgICAgIFsnLTEudGV4JywgJy5wZGYnXSxcbiAgICAgICAgJ2J1aWxkJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3RFeGlzdGVuY2VPZkV4dGVuZGVkT3V0cHV0cygpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGNyZWF0ZXMgZ2xvc3NhcnkgZmlsZXMgd2hlbiB1c2luZyB0aGUgZ2xvc3NhcmllcyBwYWNrYWdlJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZUV4dGVuZGVkQnVpbGQoJ2dsb3NzYXJpZXMtdGVzdCcsXG4gICAgICAgIFsnLmFjbicsICcuYWNyJywgJy5nbG8nLCAnLmdscycsICcucGRmJ10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0RXhpc3RlbmNlT2ZFeHRlbmRlZE91dHB1dHMoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBjcmVhdGVzIGdsb3NzYXJ5IGZpbGVzIHdoZW4gdXNpbmcgdGhlIGdsb3NzYXJpZXMgcGFja2FnZSB3aXRoIGFuIG91dHB1dCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplRXh0ZW5kZWRCdWlsZCgnZ2xvc3Nhcmllcy10ZXN0JyxcbiAgICAgICAgWycuYWNuJywgJy5hY3InLCAnLmdsbycsICcuZ2xzJywgJy5wZGYnXSxcbiAgICAgICAgJ2J1aWxkJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3RFeGlzdGVuY2VPZkV4dGVuZGVkT3V0cHV0cygpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGNyZWF0ZXMgbWV0YXBvc3QgZmlsZXMgd2hlbiB1c2luZyB0aGUgZmV5bm1wIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplRXh0ZW5kZWRCdWlsZCgnbXBvc3QtdGVzdCcsXG4gICAgICAgIFsnLWZleW5tcC4xJywgJy5wZGYnXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGpvYlN0YXRlKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3RFeGlzdGVuY2VPZkV4dGVuZGVkT3V0cHV0cygpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGNyZWF0ZXMgbWV0YXBvc3QgZmlsZXMgd2hlbiB1c2luZyB0aGUgZmV5bm1wIHBhY2thZ2Ugd2l0aCBhbiBvdXRwdXQgZGlyZWN0b3J5JywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZUV4dGVuZGVkQnVpbGQoJ21wb3N0LXRlc3QnLFxuICAgICAgICBbJy1mZXlubXAuMScsICcucGRmJ10sXG4gICAgICAgICdidWlsZCcpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0RXhpc3RlbmNlT2ZFeHRlbmRlZE91dHB1dHMoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBjcmVhdGVzIG5vbWVuY2xhdHVyZSBmaWxlcyB3aGVuIHVzaW5nIHRoZSBub21lbmNsIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplRXh0ZW5kZWRCdWlsZCgnbm9tZW5jbC10ZXN0JyxcbiAgICAgICAgWycubmxvJywgJy5ubHMnLCAnLnBkZiddKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oam9iU3RhdGUpLnRoZW4oY29kZSA9PiB7IGV4aXRDb2RlID0gY29kZSB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgwKVxuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdEV4aXN0ZW5jZU9mRXh0ZW5kZWRPdXRwdXRzKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzdWNjZXNzZnVsbHkgY3JlYXRlcyBub21lbmNsYXR1cmUgZmlsZXMgd2hlbiB1c2luZyB0aGUgbm9tZW5jbCBwYWNrYWdlIHdpdGggYW4gb3V0cHV0IGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVFeHRlbmRlZEJ1aWxkKCdub21lbmNsLXRlc3QnLFxuICAgICAgICBbJy5ubG8nLCAnLm5scycsICcucGRmJ10sXG4gICAgICAgICdidWlsZCcpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0RXhpc3RlbmNlT2ZFeHRlbmRlZE91dHB1dHMoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBjcmVhdGVzIGluZGV4IGZpbGVzIHdoZW4gdXNpbmcgdGhlIGluZGV4IHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplRXh0ZW5kZWRCdWlsZCgnaW5kZXgtdGVzdCcsXG4gICAgICAgIFsnLmlkeCcsICcuaW5kJywgJy5sZHgnLCAnLmxuZCcsICcucGRmJ10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0RXhpc3RlbmNlT2ZFeHRlbmRlZE91dHB1dHMoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBjcmVhdGVzIGluZGV4IGZpbGVzIHdoZW4gdXNpbmcgdGhlIGluZGV4IHBhY2thZ2Ugd2l0aCBhbiBvdXRwdXQgZGlyZWN0b3J5JywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZUV4dGVuZGVkQnVpbGQoJ2luZGV4LXRlc3QnLFxuICAgICAgICBbJy5pZHgnLCAnLmluZCcsICcubGR4JywgJy5sbmQnLCAnLnBkZiddLFxuICAgICAgICAnYnVpbGQnKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oam9iU3RhdGUpLnRoZW4oY29kZSA9PiB7IGV4aXRDb2RlID0gY29kZSB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgwKVxuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdEV4aXN0ZW5jZU9mRXh0ZW5kZWRPdXRwdXRzKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIFNhZ2Ugb25seSBydW5zIGluIGEgVk0gb24gV2luZG93cyBhbmQgaW5zdGFsbGluZyBTYWdlIGF0IDFHQiBmb3IgdHdvIHRlc3RzXG4gICAgLy8gaXMgZXhjZXNzaXZlLlxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInIHx8IHByb2Nlc3MuZW52LkNJKSByZXR1cm5cblxuICAgIGl0KCdzdWNjZXNzZnVsbHkgY3JlYXRlcyBTYWdlVGVYIGZpbGVzIHdoZW4gdXNpbmcgdGhlIHNhZ2V0ZXggcGFja2FnZScsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVFeHRlbmRlZEJ1aWxkKCdzYWdldGV4LXRlc3QnLFxuICAgICAgICBbJy5zYWdldGV4LnNhZ2UnLCAnLnNhZ2V0ZXguc291dCcsICcucGRmJ10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0RXhpc3RlbmNlT2ZFeHRlbmRlZE91dHB1dHMoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBjcmVhdGVzIFNhZ2VUZVggZmlsZXMgd2hlbiB1c2luZyB0aGUgc2FnZXRleCBwYWNrYWdlIHdpdGggYW4gb3V0cHV0IGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVFeHRlbmRlZEJ1aWxkKCdzYWdldGV4LXRlc3QnLFxuICAgICAgICBbJy5zYWdldGV4LnNhZ2UnLCAnLnNhZ2V0ZXguc291dCcsICcucGRmJ10sXG4gICAgICAgICdidWlsZCcpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChidWlsZGVyLmxvZ1N0YXR1c0NvZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0RXhpc3RlbmNlT2ZFeHRlbmRlZE91dHB1dHMoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdjYW5Qcm9jZXNzJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBnaXZlbiBhIGZpbGUgcGF0aCB3aXRoIGEgLnRleCBleHRlbnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBjYW5Qcm9jZXNzID0gTGF0ZXhta0J1aWxkZXIuY2FuUHJvY2VzcyhzdGF0ZSlcbiAgICAgIGV4cGVjdChjYW5Qcm9jZXNzKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnbG9nU3RhdHVzQ29kZScsICgpID0+IHtcbiAgICBpdCgnaGFuZGxlcyBsYXRleG1rIHNwZWNpZmljIHN0YXR1cyBjb2RlcycsICgpID0+IHtcbiAgICAgIGxldCBtZXNzYWdlcyA9IFtdXG4gICAgICBzcHlPbihsYXRleC5sb2csICdlcnJvcicpLmFuZENhbGxGYWtlKG1lc3NhZ2UgPT4gbWVzc2FnZXMucHVzaChtZXNzYWdlKSlcblxuICAgICAgY29uc3Qgc3RhdHVzQ29kZXMgPSBbMTAsIDExLCAxMiwgMTMsIDIwXVxuICAgICAgc3RhdHVzQ29kZXMuZm9yRWFjaChzdGF0dXNDb2RlID0+IGJ1aWxkZXIubG9nU3RhdHVzQ29kZShzdGF0dXNDb2RlKSlcblxuICAgICAgY29uc3Qgc3RhcnRzV2l0aFByZWZpeCA9IHN0ciA9PiBzdHIuc3RhcnRzV2l0aCgnbGF0ZXhtazonKVxuXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKHN0YXR1c0NvZGVzLmxlbmd0aClcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5maWx0ZXIoc3RhcnRzV2l0aFByZWZpeCkubGVuZ3RoKS50b0JlKHN0YXR1c0NvZGVzLmxlbmd0aClcbiAgICB9KVxuXG4gICAgaXQoJ3Bhc3NlcyB0aHJvdWdoIHRvIHN1cGVyY2xhc3Mgd2hlbiBnaXZlbiBub24tbGF0ZXhtayBzdGF0dXMgY29kZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGRlcnIgPSAnd2liYmxlJ1xuICAgICAgY29uc3Qgc3VwZXJjbGFzcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihidWlsZGVyKVxuICAgICAgc3B5T24oc3VwZXJjbGFzcywgJ2xvZ1N0YXR1c0NvZGUnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSAxXG4gICAgICBidWlsZGVyLmxvZ1N0YXR1c0NvZGUoc3RhdHVzQ29kZSwgc3RkZXJyKVxuXG4gICAgICBleHBlY3Qoc3VwZXJjbGFzcy5sb2dTdGF0dXNDb2RlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzdGF0dXNDb2RlLCBzdGRlcnIpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=