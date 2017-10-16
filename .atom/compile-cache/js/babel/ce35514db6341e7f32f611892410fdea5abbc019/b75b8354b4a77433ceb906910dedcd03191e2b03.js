Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _parsersLogParser = require('./parsers/log-parser');

var _parsersLogParser2 = _interopRequireDefault(_parsersLogParser);

var _parsersFdbParser = require('./parsers/fdb-parser');

var _parsersFdbParser2 = _interopRequireDefault(_parsersFdbParser);

var _werkzeugJs = require('./werkzeug.js');

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.envPathKey = this.getEnvironmentPathKey(process.platform);
  }

  _createClass(Builder, [{
    key: 'run',
    value: _asyncToGenerator(function* (jobState) {})
  }, {
    key: 'constructArgs',
    value: function constructArgs(jobState) {}
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {})
  }, {
    key: 'logStatusCode',
    value: function logStatusCode(statusCode, stderr) {
      switch (statusCode) {
        case 127:
          latex.log.error((0, _werkzeugJs.heredoc)('\n          TeXification failed! Builder executable \'' + this.executable + '\' not found.\n            latex.texPath\n              as configured: ' + atom.config.get('latex.texPath') + '\n              when resolved: ' + this.constructPath() + '\n          Make sure latex.texPath is configured correctly either adjust it           via the settings view, or directly in your config.cson file.\n          '));
          break;
        case 0:
          break;
        default:
          var errorOutput = stderr ? ' and output of "' + stderr + '"' : '';
          latex.log.error('TeXification failed with status code ' + statusCode + errorOutput);
      }
    }
  }, {
    key: 'parseLogFile',
    value: function parseLogFile(jobState) {
      var logFilePath = this.resolveLogFilePath(jobState);
      if (_fsPlus2['default'].existsSync(logFilePath)) {
        var parser = this.getLogParser(logFilePath, jobState.getTexFilePath());
        var result = parser.parse();
        if (result) {
          if (result.messages) {
            jobState.setLogMessages(result.messages);
          }
          if (result.outputFilePath) {
            jobState.setOutputFilePath(result.outputFilePath);
          }
        }
      }
    }
  }, {
    key: 'getLogParser',
    value: function getLogParser(logFilePath, texFilePath) {
      return new _parsersLogParser2['default'](logFilePath, texFilePath);
    }
  }, {
    key: 'constructChildProcessOptions',
    value: function constructChildProcessOptions(directoryPath, defaultEnv) {
      var env = Object.assign(defaultEnv || {}, process.env);
      var childPath = this.constructPath();
      if (childPath) {
        env[this.envPathKey] = childPath;
      }

      return {
        allowKill: true,
        encoding: 'utf8',
        maxBuffer: 52428800, // Set process' max buffer size to 50 MB.
        cwd: directoryPath, // Run process with sensible CWD.
        env: env
      };
    }
  }, {
    key: 'constructPath',
    value: function constructPath() {
      var texPath = (atom.config.get('latex.texPath') || '').trim();
      if (texPath.length === 0) {
        texPath = this.defaultTexPath(process.platform);
      }

      var processPath = process.env[this.envPathKey];
      var match = texPath.match(/^(.*)(\$PATH)(.*)$/);
      if (match) {
        return '' + match[1] + processPath + match[3];
      }

      return [texPath, processPath].filter(function (str) {
        return str && str.length > 0;
      }).join(_path2['default'].delimiter);
    }
  }, {
    key: 'defaultTexPath',
    value: function defaultTexPath(platform) {
      if (platform === 'win32') {
        return ['%SystemDrive%\\texlive\\2017\\bin\\win32', '%SystemDrive%\\texlive\\2016\\bin\\win32', '%SystemDrive%\\texlive\\2015\\bin\\win32', '%ProgramFiles%\\MiKTeX 2.9\\miktex\\bin\\x64', '%ProgramFiles(x86)%\\MiKTeX 2.9\\miktex\\bin'].join(';');
      }

      return ['/usr/texbin', '/Library/TeX/texbin'].join(':');
    }
  }, {
    key: 'resolveOutputFilePath',
    value: function resolveOutputFilePath(jobState, ext) {
      var _path$parse = _path2['default'].parse(jobState.getFilePath());

      var dir = _path$parse.dir;
      var name = _path$parse.name;

      if (jobState.getJobName()) {
        name = jobState.getJobName();
      }
      dir = _path2['default'].resolve(dir, jobState.getOutputDirectory());
      return _path2['default'].format({ dir: dir, name: name, ext: ext });
    }
  }, {
    key: 'resolveLogFilePath',
    value: function resolveLogFilePath(jobState) {
      return this.resolveOutputFilePath(jobState, '.log');
    }
  }, {
    key: 'getEnvironmentPathKey',
    value: function getEnvironmentPathKey(platform) {
      if (platform === 'win32') {
        return 'Path';
      }
      return 'PATH';
    }
  }, {
    key: 'resolveFdbFilePath',
    value: function resolveFdbFilePath(jobState) {
      return this.resolveOutputFilePath(jobState, '.fdb_latexmk');
    }
  }, {
    key: 'parseFdbFile',
    value: function parseFdbFile(jobState) {
      var fdbFilePath = this.resolveFdbFilePath(jobState);
      if (_fsPlus2['default'].existsSync(fdbFilePath)) {
        var parser = this.getFdbParser(fdbFilePath);
        var result = parser.parse();
        if (result) {
          jobState.setFileDatabase(result);
        }
      }
    }
  }, {
    key: 'getFdbParser',
    value: function getFdbParser(fdbFilePath) {
      return new _parsersFdbParser2['default'](fdbFilePath);
    }
  }, {
    key: 'parseLogAndFdbFiles',
    value: function parseLogAndFdbFiles(jobState) {
      this.parseLogFile(jobState);
      this.parseFdbFile(jobState);

      var fdb = jobState.getFileDatabase();
      if (fdb) {
        var sections = ['ps2pdf', 'xdvipdfmx', 'dvipdf', 'dvips', 'latex', 'pdflatex', 'lualatex', 'xelatex'];
        var output = undefined;

        for (var section of sections) {
          if (fdb[section] && fdb[section].generated) {
            var generated = fdb[section].generated;

            output = generated.find(function (output) {
              return (0, _werkzeugJs.isPdfFile)(output);
            });
            if (output) break;

            output = generated.find(function (output) {
              return (0, _werkzeugJs.isPsFile)(output);
            });
            if (output) break;

            output = generated.find(function (output) {
              return (0, _werkzeugJs.isDviFile)(output);
            });
            if (output) break;
          }
        }

        if (output) {
          jobState.setOutputFilePath(_path2['default'].resolve(jobState.getProjectPath(), _path2['default'].normalize(output)));
        }
      }
    }
  }], [{
    key: 'canProcess',
    value: function canProcess(state) {}
  }]);

  return Builder;
})();

exports['default'] = Builder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7Z0NBQ0Qsc0JBQXNCOzs7O2dDQUN0QixzQkFBc0I7Ozs7MEJBQ1ksZUFBZTs7SUFFbEQsT0FBTztXQUFQLE9BQU87MEJBQVAsT0FBTzs7U0FDMUIsVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7ZUFEdEMsT0FBTzs7NkJBSWhCLFdBQUMsUUFBUSxFQUFFLEVBQUU7OztXQUNULHVCQUFDLFFBQVEsRUFBRSxFQUFFOzs7NkJBQ0ksYUFBRyxFQUFFOzs7V0FFdEIsdUJBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtBQUNqQyxjQUFRLFVBQVU7QUFDaEIsYUFBSyxHQUFHO0FBQ04sZUFBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsb0ZBQzZCLElBQUksQ0FBQyxVQUFVLCtFQUVyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsdUNBQ2hDLElBQUksQ0FBQyxhQUFhLEVBQUUscUtBR3ZDLENBQUMsQ0FBQTtBQUNMLGdCQUFLO0FBQUEsQUFDUCxhQUFLLENBQUM7QUFDSixnQkFBSztBQUFBLEFBQ1A7QUFDRSxjQUFNLFdBQVcsR0FBRyxNQUFNLHdCQUFzQixNQUFNLFNBQU0sRUFBRSxDQUFBO0FBQzlELGVBQUssQ0FBQyxHQUFHLENBQUMsS0FBSywyQ0FBeUMsVUFBVSxHQUFHLFdBQVcsQ0FBRyxDQUFBO0FBQUEsT0FDdEY7S0FDRjs7O1dBRVksc0JBQUMsUUFBUSxFQUFFO0FBQ3RCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyRCxVQUFJLG9CQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUM5QixZQUFNLE1B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QyxDQUFDLENBQUE7U0FDNUY7T0FDRjtLQUNGOzs7V0FoS2lCLG9CQUFDLEtBQUssRUFBRSxFQUFFOzs7U0FIVCxPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBMb2dQYXJzZXIgZnJvbSAnLi9wYXJzZXJzL2xvZy1wYXJzZXInXG5pbXBvcnQgRmRiUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9mZGItcGFyc2VyJ1xuaW1wb3J0IHsgaGVyZWRvYywgaXNQZGZGaWxlLCBpc1BzRmlsZSwgaXNEdmlGaWxlIH0gZnJvbSAnLi93ZXJremV1Zy5qcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlciB7XG4gIGVudlBhdGhLZXkgPSB0aGlzLmdldEVudmlyb25tZW50UGF0aEtleShwcm9jZXNzLnBsYXRmb3JtKVxuXG4gIHN0YXRpYyBjYW5Qcm9jZXNzIChzdGF0ZSkge31cbiAgYXN5bmMgcnVuIChqb2JTdGF0ZSkge31cbiAgY29uc3RydWN0QXJncyAoam9iU3RhdGUpIHt9XG4gIGFzeW5jIGNoZWNrUnVudGltZURlcGVuZGVuY2llcyAoKSB7fVxuXG4gIGxvZ1N0YXR1c0NvZGUgKHN0YXR1c0NvZGUsIHN0ZGVycikge1xuICAgIHN3aXRjaCAoc3RhdHVzQ29kZSkge1xuICAgICAgY2FzZSAxMjc6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcihoZXJlZG9jKGBcbiAgICAgICAgICBUZVhpZmljYXRpb24gZmFpbGVkISBCdWlsZGVyIGV4ZWN1dGFibGUgJyR7dGhpcy5leGVjdXRhYmxlfScgbm90IGZvdW5kLlxuICAgICAgICAgICAgbGF0ZXgudGV4UGF0aFxuICAgICAgICAgICAgICBhcyBjb25maWd1cmVkOiAke2F0b20uY29uZmlnLmdldCgnbGF0ZXgudGV4UGF0aCcpfVxuICAgICAgICAgICAgICB3aGVuIHJlc29sdmVkOiAke3RoaXMuY29uc3RydWN0UGF0aCgpfVxuICAgICAgICAgIE1ha2Ugc3VyZSBsYXRleC50ZXhQYXRoIGlzIGNvbmZpZ3VyZWQgY29ycmVjdGx5IGVpdGhlciBhZGp1c3QgaXQgXFxcbiAgICAgICAgICB2aWEgdGhlIHNldHRpbmdzIHZpZXcsIG9yIGRpcmVjdGx5IGluIHlvdXIgY29uZmlnLmNzb24gZmlsZS5cbiAgICAgICAgICBgKSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnN0IGVycm9yT3V0cHV0ID0gc3RkZXJyID8gYCBhbmQgb3V0cHV0IG9mIFwiJHtzdGRlcnJ9XCJgIDogJydcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKGBUZVhpZmljYXRpb24gZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtzdGF0dXNDb2RlfSR7ZXJyb3JPdXRwdXR9YClcbiAgICB9XG4gIH1cblxuICBwYXJzZUxvZ0ZpbGUgKGpvYlN0YXRlKSB7XG4gICAgY29uc3QgbG9nRmlsZVBhdGggPSB0aGlzLnJlc29sdmVMb2dGaWxlUGF0aChqb2JTdGF0ZSlcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhsb2dGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IHRoaXMuZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoLCBqb2JTdGF0ZS5nZXRUZXhGaWxlUGF0aCgpKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5tZXNzYWdlcykge1xuICAgICAgICAgIGpvYlN0YXRlLnNldExvZ01lc3NhZ2VzKHJlc3VsdC5tZXNzYWdlcylcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgICAgam9iU3RhdGUuc2V0T3V0cHV0RmlsZVBhdGgocmVzdWx0Lm91dHB1dEZpbGVQYXRoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TG9nUGFyc2VyIChsb2dGaWxlUGF0aCwgdGV4RmlsZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IExvZ1BhcnNlcihsb2dGaWxlUGF0aCwgdGV4RmlsZVBhdGgpXG4gIH1cblxuICBjb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zIChkaXJlY3RvcnlQYXRoLCBkZWZhdWx0RW52KSB7XG4gICAgY29uc3QgZW52ID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0RW52IHx8IHt9LCBwcm9jZXNzLmVudilcbiAgICBjb25zdCBjaGlsZFBhdGggPSB0aGlzLmNvbnN0cnVjdFBhdGgoKVxuICAgIGlmIChjaGlsZFBhdGgpIHtcbiAgICAgIGVudlt0aGlzLmVudlBhdGhLZXldID0gY2hpbGRQYXRoXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFsbG93S2lsbDogdHJ1ZSxcbiAgICAgIGVuY29kaW5nOiAndXRmOCcsXG4gICAgICBtYXhCdWZmZXI6IDUyNDI4ODAwLCAvLyBTZXQgcHJvY2VzcycgbWF4IGJ1ZmZlciBzaXplIHRvIDUwIE1CLlxuICAgICAgY3dkOiBkaXJlY3RvcnlQYXRoLCAgLy8gUnVuIHByb2Nlc3Mgd2l0aCBzZW5zaWJsZSBDV0QuXG4gICAgICBlbnZcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RQYXRoICgpIHtcbiAgICBsZXQgdGV4UGF0aCA9IChhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnRleFBhdGgnKSB8fCAnJykudHJpbSgpXG4gICAgaWYgKHRleFBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICB0ZXhQYXRoID0gdGhpcy5kZWZhdWx0VGV4UGF0aChwcm9jZXNzLnBsYXRmb3JtKVxuICAgIH1cblxuICAgIGNvbnN0IHByb2Nlc3NQYXRoID0gcHJvY2Vzcy5lbnZbdGhpcy5lbnZQYXRoS2V5XVxuICAgIGNvbnN0IG1hdGNoID0gdGV4UGF0aC5tYXRjaCgvXiguKikoXFwkUEFUSCkoLiopJC8pXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXR1cm4gYCR7bWF0Y2hbMV19JHtwcm9jZXNzUGF0aH0ke21hdGNoWzNdfWBcbiAgICB9XG5cbiAgICByZXR1cm4gW3RleFBhdGgsIHByb2Nlc3NQYXRoXVxuICAgICAgLmZpbHRlcihzdHIgPT4gc3RyICYmIHN0ci5sZW5ndGggPiAwKVxuICAgICAgLmpvaW4ocGF0aC5kZWxpbWl0ZXIpXG4gIH1cblxuICBkZWZhdWx0VGV4UGF0aCAocGxhdGZvcm0pIHtcbiAgICBpZiAocGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxN1xcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAnJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTZcXFxcYmluXFxcXHdpbjMyJyxcbiAgICAgICAgJyVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE1XFxcXGJpblxcXFx3aW4zMicsXG4gICAgICAgICclUHJvZ3JhbUZpbGVzJVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW5cXFxceDY0JyxcbiAgICAgICAgJyVQcm9ncmFtRmlsZXMoeDg2KSVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluJ1xuICAgICAgXS5qb2luKCc7JylcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgJy91c3IvdGV4YmluJyxcbiAgICAgICcvTGlicmFyeS9UZVgvdGV4YmluJ1xuICAgIF0uam9pbignOicpXG4gIH1cblxuICByZXNvbHZlT3V0cHV0RmlsZVBhdGggKGpvYlN0YXRlLCBleHQpIHtcbiAgICBsZXQgeyBkaXIsIG5hbWUgfSA9IHBhdGgucGFyc2Uoam9iU3RhdGUuZ2V0RmlsZVBhdGgoKSlcbiAgICBpZiAoam9iU3RhdGUuZ2V0Sm9iTmFtZSgpKSB7XG4gICAgICBuYW1lID0gam9iU3RhdGUuZ2V0Sm9iTmFtZSgpXG4gICAgfVxuICAgIGRpciA9IHBhdGgucmVzb2x2ZShkaXIsIGpvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpKVxuICAgIHJldHVybiBwYXRoLmZvcm1hdCh7IGRpciwgbmFtZSwgZXh0IH0pXG4gIH1cblxuICByZXNvbHZlTG9nRmlsZVBhdGggKGpvYlN0YXRlKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGpvYlN0YXRlLCAnLmxvZycpXG4gIH1cblxuICBnZXRFbnZpcm9ubWVudFBhdGhLZXkgKHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSAnd2luMzInKSB7IHJldHVybiAnUGF0aCcgfVxuICAgIHJldHVybiAnUEFUSCdcbiAgfVxuXG4gIHJlc29sdmVGZGJGaWxlUGF0aCAoam9iU3RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoam9iU3RhdGUsICcuZmRiX2xhdGV4bWsnKVxuICB9XG5cbiAgcGFyc2VGZGJGaWxlIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGZkYkZpbGVQYXRoID0gdGhpcy5yZXNvbHZlRmRiRmlsZVBhdGgoam9iU3RhdGUpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZmRiRmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBwYXJzZXIgPSB0aGlzLmdldEZkYlBhcnNlcihmZGJGaWxlUGF0aClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGpvYlN0YXRlLnNldEZpbGVEYXRhYmFzZShyZXN1bHQpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RmRiUGFyc2VyIChmZGJGaWxlUGF0aCkge1xuICAgIHJldHVybiBuZXcgRmRiUGFyc2VyKGZkYkZpbGVQYXRoKVxuICB9XG5cbiAgcGFyc2VMb2dBbmRGZGJGaWxlcyAoam9iU3RhdGUpIHtcbiAgICB0aGlzLnBhcnNlTG9nRmlsZShqb2JTdGF0ZSlcbiAgICB0aGlzLnBhcnNlRmRiRmlsZShqb2JTdGF0ZSlcblxuICAgIGNvbnN0IGZkYiA9IGpvYlN0YXRlLmdldEZpbGVEYXRhYmFzZSgpXG4gICAgaWYgKGZkYikge1xuICAgICAgY29uc3Qgc2VjdGlvbnMgPSBbJ3BzMnBkZicsICd4ZHZpcGRmbXgnLCAnZHZpcGRmJywgJ2R2aXBzJywgJ2xhdGV4JywgJ3BkZmxhdGV4JywgJ2x1YWxhdGV4JywgJ3hlbGF0ZXgnXVxuICAgICAgbGV0IG91dHB1dFxuXG4gICAgICBmb3IgKGNvbnN0IHNlY3Rpb24gb2Ygc2VjdGlvbnMpIHtcbiAgICAgICAgaWYgKGZkYltzZWN0aW9uXSAmJiBmZGJbc2VjdGlvbl0uZ2VuZXJhdGVkKSB7XG4gICAgICAgICAgY29uc3QgZ2VuZXJhdGVkID0gZmRiW3NlY3Rpb25dLmdlbmVyYXRlZFxuXG4gICAgICAgICAgb3V0cHV0ID0gZ2VuZXJhdGVkLmZpbmQob3V0cHV0ID0+IGlzUGRmRmlsZShvdXRwdXQpKVxuICAgICAgICAgIGlmIChvdXRwdXQpIGJyZWFrXG5cbiAgICAgICAgICBvdXRwdXQgPSBnZW5lcmF0ZWQuZmluZChvdXRwdXQgPT4gaXNQc0ZpbGUob3V0cHV0KSlcbiAgICAgICAgICBpZiAob3V0cHV0KSBicmVha1xuXG4gICAgICAgICAgb3V0cHV0ID0gZ2VuZXJhdGVkLmZpbmQob3V0cHV0ID0+IGlzRHZpRmlsZShvdXRwdXQpKVxuICAgICAgICAgIGlmIChvdXRwdXQpIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG91dHB1dCkge1xuICAgICAgICBqb2JTdGF0ZS5zZXRPdXRwdXRGaWxlUGF0aChwYXRoLnJlc29sdmUoam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgcGF0aC5ub3JtYWxpemUob3V0cHV0KSkpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=