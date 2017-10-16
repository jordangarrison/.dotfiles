Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _builder = require('../builder');

var _builder2 = _interopRequireDefault(_builder);

var LATEX_PATTERN = /^latex|u?platex$/;
var LATEXMK_VERSION_PATTERN = /Version\s+(\S+)/i;
var LATEXMK_MINIMUM_VERSION = '4.37';
var PDF_ENGINE_PATTERN = /^(xelatex|lualatex)$/;

var LatexmkBuilder = (function (_Builder) {
  _inherits(LatexmkBuilder, _Builder);

  function LatexmkBuilder() {
    _classCallCheck(this, LatexmkBuilder);

    _get(Object.getPrototypeOf(LatexmkBuilder.prototype), 'constructor', this).apply(this, arguments);

    this.executable = 'latexmk';
  }

  _createClass(LatexmkBuilder, [{
    key: 'run',
    value: _asyncToGenerator(function* (jobState) {
      var args = this.constructArgs(jobState);

      var _ref = yield this.execLatexmk(jobState.getProjectPath(), args, 'error');

      var statusCode = _ref.statusCode;
      var stderr = _ref.stderr;

      if (statusCode !== 0) {
        this.logStatusCode(statusCode, stderr);
      }

      return statusCode;
    })
  }, {
    key: 'execLatexmk',
    value: _asyncToGenerator(function* (directoryPath, args, type) {
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions(directoryPath, { max_print_line: 1000 });

      return latex.process.executeChildProcess(command, options);
    })
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {
      var _ref2 = yield this.execLatexmk('.', ['-v'], 'error');

      var statusCode = _ref2.statusCode;
      var stdout = _ref2.stdout;
      var stderr = _ref2.stderr;

      if (statusCode !== 0) {
        latex.log.error('latexmk check failed with code ' + statusCode + ' and response of "' + stderr + '".');
        return;
      }

      var match = stdout.match(LATEXMK_VERSION_PATTERN);

      if (!match) {
        latex.log.warning('latexmk check succeeded but with an unknown version response of "' + stdout + '".');
        return;
      }

      var version = match[1];

      if (version < LATEXMK_MINIMUM_VERSION) {
        latex.log.warning('latexmk check succeeded but with a version of ' + version + '". Minimum version required is ' + LATEXMK_MINIMUM_VERSION + '.');
        return;
      }

      latex.log.info('latexmk check succeeded. Found version ' + version + '.');
    })
  }, {
    key: 'logStatusCode',
    value: function logStatusCode(statusCode, stderr) {
      switch (statusCode) {
        case 10:
          latex.log.error('latexmk: Bad command line arguments.');
          break;
        case 11:
          latex.log.error('latexmk: File specified on command line not found or other file not found.');
          break;
        case 12:
          latex.log.error('latexmk: Failure in some part of making files.');
          break;
        case 13:
          latex.log.error('latexmk: error in initialization file.');
          break;
        case 20:
          latex.log.error('latexmk: probable bug or retcode from called program.');
          break;
        default:
          _get(Object.getPrototypeOf(LatexmkBuilder.prototype), 'logStatusCode', this).call(this, statusCode, stderr);
      }
    }
  }, {
    key: 'constructArgs',
    value: function constructArgs(jobState) {
      var args = ['-interaction=nonstopmode', '-f', '-cd', '-file-line-error'];

      if (jobState.getShouldRebuild()) {
        args.push('-g');
      }
      if (jobState.getJobName()) {
        args.push('-jobname="' + jobState.getJobName() + '"');
      }
      if (jobState.getEnableShellEscape()) {
        args.push('-shell-escape');
      }
      if (jobState.getEnableSynctex()) {
        args.push('-synctex=1');
      }
      if (jobState.getEnableExtendedBuildMode()) {
        var latexmkrcPath = _path2['default'].resolve(__dirname, '..', '..', 'resources', 'latexmkrc');
        args.push('-r "' + latexmkrcPath + '"');
      }

      if (jobState.getEngine().match(LATEX_PATTERN)) {
        args.push('-latex="' + jobState.getEngine() + '"');
        args.push(jobState.getOutputFormat() === 'pdf' ? this.constructPdfProducerArgs(jobState) : '-' + jobState.getOutputFormat());
      } else {
        // Look for other PDF engines that can be specified using short command
        // options, i.e. -lualatex and -xelatex
        if (jobState.getOutputFormat() === 'pdf' && jobState.getEngine().match(PDF_ENGINE_PATTERN)) {
          args.push('-' + jobState.getEngine());
        } else {
          // Keep the option noise to a minimum by not passing default engine
          if (jobState.getEngine() !== 'pdflatex') {
            args.push('-pdflatex="' + jobState.getEngine() + '"');
          }
          args.push('-' + jobState.getOutputFormat());
        }
      }

      if (jobState.getOutputDirectory()) {
        args.push('-outdir="' + jobState.getOutputDirectory() + '"');
      }

      args.push('"' + jobState.getTexFilePath() + '"');
      return args;
    }
  }, {
    key: 'constructPdfProducerArgs',
    value: function constructPdfProducerArgs(jobState) {
      var producer = jobState.getProducer();

      switch (producer) {
        case 'ps2pdf':
          return '-pdfps';
        case 'dvipdf':
          return '-pdfdvi -e "$dvipdf = \'dvipdf %O %S %D\';"';
        default:
          return '-pdfdvi -e "$dvipdf = \'' + producer + ' %O -o %D %S\';"';
      }
    }
  }], [{
    key: 'canProcess',
    value: function canProcess(state) {
      return !!state.getTexFilePath();
    }
  }]);

  return LatexmkBuilder;
})(_builder2['default']);

exports['default'] = LatexmkBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMvbGF0ZXhtay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUVoQyxJQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQTtBQUN4QyxJQUFNLHVCQUF1QixHQUFHLGtCQUFrQixDQUFBO0FBQ2xELElBQU0sdUJBQXVCLEdBQUcsTUFBTSxDQUFBO0FBQ3RDLElBQU0sa0JBQWtCLEdBQUcsc0JBQXNCLENBQUE7O0lBRTVCLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FDakMsVUFBVSxHQUFHLFNBQVM7OztlQURILGNBQWM7OzZCQU92QixXQUFDLFFBQVEsRUFBRTtBQUNuQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztpQkFFVixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7O1VBQXZGLFVBQVUsUUFBVixVQUFVO1VBQUUsTUFBTSxRQUFOLE1BQU07O0FBQzFCLFVBQUksVUFBVSxLQUFLLENBQUMsRUFBRTtBQUNwQixZQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUN2Qzs7QUFFRCxhQUFPLFVBQVUsQ0FBQTtLQUNsQjs7OzZCQUVpQixXQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQzVDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxhQUFhLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFF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QyxVQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7O0FBRXZDLGNBQVEsUUFBUTtBQUNkLGFBQUssUUFBUTtBQUNYLGlCQUFPLFFBQVEsQ0FBQTtBQUFBLEFBQ2pCLGFBQUssUUFBUTtBQUNYLGlCQUFPLDZDQUE2QyxDQUFBO0FBQUEsQUFDdEQ7QUFDRSw4Q0FBaUMsUUFBUSxzQkFBaUI7QUFBQSxPQUM3RDtLQUNGOzs7V0FwSWlCLG9CQUFDLEtBQUssRUFBRTtBQUN4QixhQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7S0FDaEM7OztTQUxrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQnVpbGRlciBmcm9tICcuLi9idWlsZGVyJ1xuXG5jb25zdCBMQVRFWF9QQVRURVJOID0gL15sYXRleHx1P3BsYXRleCQvXG5jb25zdCBMQVRFWE1LX1ZFUlNJT05fUEFUVEVSTiA9IC9WZXJzaW9uXFxzKyhcXFMrKS9pXG5jb25zdCBMQVRFWE1LX01JTklNVU1fVkVSU0lPTiA9ICc0LjM3J1xuY29uc3QgUERGX0VOR0lORV9QQVRURVJOID0gL14oeGVsYXRleHxsdWFsYXRleCkkL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleG1rQnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBleGVjdXRhYmxlID0gJ2xhdGV4bWsnXG5cbiAgc3RhdGljIGNhblByb2Nlc3MgKHN0YXRlKSB7XG4gICAgcmV0dXJuICEhc3RhdGUuZ2V0VGV4RmlsZVBhdGgoKVxuICB9XG5cbiAgYXN5bmMgcnVuIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpXG5cbiAgICBjb25zdCB7IHN0YXR1c0NvZGUsIHN0ZGVyciB9ID0gYXdhaXQgdGhpcy5leGVjTGF0ZXhtayhqb2JTdGF0ZS5nZXRQcm9qZWN0UGF0aCgpLCBhcmdzLCAnZXJyb3InKVxuICAgIGlmIChzdGF0dXNDb2RlICE9PSAwKSB7XG4gICAgICB0aGlzLmxvZ1N0YXR1c0NvZGUoc3RhdHVzQ29kZSwgc3RkZXJyKVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXNDb2RlXG4gIH1cblxuICBhc3luYyBleGVjTGF0ZXhtayAoZGlyZWN0b3J5UGF0aCwgYXJncywgdHlwZSkge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgJHt0aGlzLmV4ZWN1dGFibGV9ICR7YXJncy5qb2luKCcgJyl9YFxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoZGlyZWN0b3J5UGF0aCwgeyBtYXhfcHJpbnRfbGluZTogMTAwMCB9KVxuXG4gICAgcmV0dXJuIGxhdGV4LnByb2Nlc3MuZXhlY3V0ZUNoaWxkUHJvY2Vzcyhjb21tYW5kLCBvcHRpb25zKVxuICB9XG5cbiAgYXN5bmMgY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzICgpIHtcbiAgICBjb25zdCB7IHN0YXR1c0NvZGUsIHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCB0aGlzLmV4ZWNMYXRleG1rKCcuJywgWyctdiddLCAnZXJyb3InKVxuXG4gICAgaWYgKHN0YXR1c0NvZGUgIT09IDApIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcihgbGF0ZXhtayBjaGVjayBmYWlsZWQgd2l0aCBjb2RlICR7c3RhdHVzQ29kZX0gYW5kIHJlc3BvbnNlIG9mIFwiJHtzdGRlcnJ9XCIuYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoID0gc3Rkb3V0Lm1hdGNoKExBVEVYTUtfVkVSU0lPTl9QQVRURVJOKVxuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYGxhdGV4bWsgY2hlY2sgc3VjY2VlZGVkIGJ1dCB3aXRoIGFuIHVua25vd24gdmVyc2lvbiByZXNwb25zZSBvZiBcIiR7c3Rkb3V0fVwiLmApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCB2ZXJzaW9uID0gbWF0Y2hbMV1cblxuICAgIGlmICh2ZXJzaW9uIDwgTEFURVhNS19NSU5JTVVNX1ZFUlNJT04pIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBsYXRleG1rIGNoZWNrIHN1Y2NlZWRlZCBidXQgd2l0aCBhIHZlcnNpb24gb2YgJHt2ZXJzaW9ufVwiLiBNaW5pbXVtIHZlcnNpb24gcmVxdWlyZWQgaXMgJHtMQVRFWE1LX01JTklNVU1fVkVSU0lPTn0uYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxhdGV4LmxvZy5pbmZvKGBsYXRleG1rIGNoZWNrIHN1Y2NlZWRlZC4gRm91bmQgdmVyc2lvbiAke3ZlcnNpb259LmApXG4gIH1cblxuICBsb2dTdGF0dXNDb2RlIChzdGF0dXNDb2RlLCBzdGRlcnIpIHtcbiAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcbiAgICAgIGNhc2UgMTA6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogQmFkIGNvbW1hbmQgbGluZSBhcmd1bWVudHMuJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTE6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogRmlsZSBzcGVjaWZpZWQgb24gY29tbWFuZCBsaW5lIG5vdCBmb3VuZCBvciBvdGhlciBmaWxlIG5vdCBmb3VuZC4nKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxMjpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBGYWlsdXJlIGluIHNvbWUgcGFydCBvZiBtYWtpbmcgZmlsZXMuJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTM6XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcignbGF0ZXhtazogZXJyb3IgaW4gaW5pdGlhbGl6YXRpb24gZmlsZS4nKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyMDpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBwcm9iYWJsZSBidWcgb3IgcmV0Y29kZSBmcm9tIGNhbGxlZCBwcm9ncmFtLicpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzdXBlci5sb2dTdGF0dXNDb2RlKHN0YXR1c0NvZGUsIHN0ZGVycilcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlJyxcbiAgICAgICctZicsXG4gICAgICAnLWNkJyxcbiAgICAgICctZmlsZS1saW5lLWVycm9yJ1xuICAgIF1cblxuICAgIGlmIChqb2JTdGF0ZS5nZXRTaG91bGRSZWJ1aWxkKCkpIHtcbiAgICAgIGFyZ3MucHVzaCgnLWcnKVxuICAgIH1cbiAgICBpZiAoam9iU3RhdGUuZ2V0Sm9iTmFtZSgpKSB7XG4gICAgICBhcmdzLnB1c2goYC1qb2JuYW1lPVwiJHtqb2JTdGF0ZS5nZXRKb2JOYW1lKCl9XCJgKVxuICAgIH1cbiAgICBpZiAoam9iU3RhdGUuZ2V0RW5hYmxlU2hlbGxFc2NhcGUoKSkge1xuICAgICAgYXJncy5wdXNoKCctc2hlbGwtZXNjYXBlJylcbiAgICB9XG4gICAgaWYgKGpvYlN0YXRlLmdldEVuYWJsZVN5bmN0ZXgoKSkge1xuICAgICAgYXJncy5wdXNoKCctc3luY3RleD0xJylcbiAgICB9XG4gICAgaWYgKGpvYlN0YXRlLmdldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKCkpIHtcbiAgICAgIGNvbnN0IGxhdGV4bWtyY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncmVzb3VyY2VzJywgJ2xhdGV4bWtyYycpXG4gICAgICBhcmdzLnB1c2goYC1yIFwiJHtsYXRleG1rcmNQYXRofVwiYClcbiAgICB9XG5cbiAgICBpZiAoam9iU3RhdGUuZ2V0RW5naW5lKCkubWF0Y2goTEFURVhfUEFUVEVSTikpIHtcbiAgICAgIGFyZ3MucHVzaChgLWxhdGV4PVwiJHtqb2JTdGF0ZS5nZXRFbmdpbmUoKX1cImApXG4gICAgICBhcmdzLnB1c2goam9iU3RhdGUuZ2V0T3V0cHV0Rm9ybWF0KCkgPT09ICdwZGYnXG4gICAgICAgID8gdGhpcy5jb25zdHJ1Y3RQZGZQcm9kdWNlckFyZ3Moam9iU3RhdGUpXG4gICAgICAgIDogYC0ke2pvYlN0YXRlLmdldE91dHB1dEZvcm1hdCgpfWApXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExvb2sgZm9yIG90aGVyIFBERiBlbmdpbmVzIHRoYXQgY2FuIGJlIHNwZWNpZmllZCB1c2luZyBzaG9ydCBjb21tYW5kXG4gICAgICAvLyBvcHRpb25zLCBpLmUuIC1sdWFsYXRleCBhbmQgLXhlbGF0ZXhcbiAgICAgIGlmIChqb2JTdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKSA9PT0gJ3BkZicgJiYgam9iU3RhdGUuZ2V0RW5naW5lKCkubWF0Y2goUERGX0VOR0lORV9QQVRURVJOKSkge1xuICAgICAgICBhcmdzLnB1c2goYC0ke2pvYlN0YXRlLmdldEVuZ2luZSgpfWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBLZWVwIHRoZSBvcHRpb24gbm9pc2UgdG8gYSBtaW5pbXVtIGJ5IG5vdCBwYXNzaW5nIGRlZmF1bHQgZW5naW5lXG4gICAgICAgIGlmIChqb2JTdGF0ZS5nZXRFbmdpbmUoKSAhPT0gJ3BkZmxhdGV4Jykge1xuICAgICAgICAgIGFyZ3MucHVzaChgLXBkZmxhdGV4PVwiJHtqb2JTdGF0ZS5nZXRFbmdpbmUoKX1cImApXG4gICAgICAgIH1cbiAgICAgICAgYXJncy5wdXNoKGAtJHtqb2JTdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKX1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKSkge1xuICAgICAgYXJncy5wdXNoKGAtb3V0ZGlyPVwiJHtqb2JTdGF0ZS5nZXRPdXRwdXREaXJlY3RvcnkoKX1cImApXG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGBcIiR7am9iU3RhdGUuZ2V0VGV4RmlsZVBhdGgoKX1cImApXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxuXG4gIGNvbnN0cnVjdFBkZlByb2R1Y2VyQXJncyAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBwcm9kdWNlciA9IGpvYlN0YXRlLmdldFByb2R1Y2VyKClcblxuICAgIHN3aXRjaCAocHJvZHVjZXIpIHtcbiAgICAgIGNhc2UgJ3BzMnBkZic6XG4gICAgICAgIHJldHVybiAnLXBkZnBzJ1xuICAgICAgY2FzZSAnZHZpcGRmJzpcbiAgICAgICAgcmV0dXJuICctcGRmZHZpIC1lIFwiJGR2aXBkZiA9IFxcJ2R2aXBkZiAlTyAlUyAlRFxcJztcIidcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBgLXBkZmR2aSAtZSBcIiRkdmlwZGYgPSAnJHtwcm9kdWNlcn0gJU8gLW8gJUQgJVMnO1wiYFxuICAgIH1cbiAgfVxufVxuIl19