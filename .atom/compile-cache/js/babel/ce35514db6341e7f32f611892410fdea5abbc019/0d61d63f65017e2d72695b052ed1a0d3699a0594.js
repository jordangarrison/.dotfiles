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

      return yield latex.process.executeChildProcess(command, options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMvbGF0ZXhtay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUVoQyxJQUFNLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQTtBQUN4QyxJQUFNLHVCQUF1QixHQUFHLGtCQUFrQixDQUFBO0FBQ2xELElBQU0sdUJBQXVCLEdBQUcsTUFBTSxDQUFBO0FBQ3RDLElBQU0sa0JBQWtCLEdBQUcsc0JBQXNCLENBQUE7O0lBRTVCLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FDakMsVUFBVSxHQUFHLFNBQVM7OztlQURILGNBQWM7OzZCQU92QixXQUFDLFFBQVEsRUFBRTtBQUNuQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztpQkFFVixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7O1VBQXZGLFVBQVUsUUFBVixVQUFVO1VBQUUsTUFBTSxRQUFOLE1BQU07O0FBQzFCLFVBQUksVUFBVSxLQUFLLENBQUMsRUFBRTtBQUNwQixZQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUN2Qzs7QUFFRCxhQUFPLFVBQVUsQ0FBQTtLQUNsQjs7OzZCQUVpQixXQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQzVDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxhQUFhLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFF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O0FBQ2xDLFVBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTs7QUFFdkMsY0FBUSxRQUFRO0FBQ2QsYUFBSyxRQUFRO0FBQ1gsaUJBQU8sUUFBUSxDQUFBO0FBQUEsQUFDakIsYUFBSyxRQUFRO0FBQ1gsaUJBQU8sNkNBQTZDLENBQUE7QUFBQSxBQUN0RDtBQUNFLDhDQUFpQyxRQUFRLHNCQUFpQjtBQUFBLE9BQzdEO0tBQ0Y7OztXQXBJaUIsb0JBQUMsS0FBSyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUNoQzs7O1NBTGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMvbGF0ZXhtay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2J1aWxkZXInXG5cbmNvbnN0IExBVEVYX1BBVFRFUk4gPSAvXmxhdGV4fHU/cGxhdGV4JC9cbmNvbnN0IExBVEVYTUtfVkVSU0lPTl9QQVRURVJOID0gL1ZlcnNpb25cXHMrKFxcUyspL2lcbmNvbnN0IExBVEVYTUtfTUlOSU1VTV9WRVJTSU9OID0gJzQuMzcnXG5jb25zdCBQREZfRU5HSU5FX1BBVFRFUk4gPSAvXih4ZWxhdGV4fGx1YWxhdGV4KSQvXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhdGV4bWtCdWlsZGVyIGV4dGVuZHMgQnVpbGRlciB7XG4gIGV4ZWN1dGFibGUgPSAnbGF0ZXhtaydcblxuICBzdGF0aWMgY2FuUHJvY2VzcyAoc3RhdGUpIHtcbiAgICByZXR1cm4gISFzdGF0ZS5nZXRUZXhGaWxlUGF0aCgpXG4gIH1cblxuICBhc3luYyBydW4gKGpvYlN0YXRlKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhqb2JTdGF0ZSlcblxuICAgIGNvbnN0IHsgc3RhdHVzQ29kZSwgc3RkZXJyIH0gPSBhd2FpdCB0aGlzLmV4ZWNMYXRleG1rKGpvYlN0YXRlLmdldFByb2plY3RQYXRoKCksIGFyZ3MsICdlcnJvcicpXG4gICAgaWYgKHN0YXR1c0NvZGUgIT09IDApIHtcbiAgICAgIHRoaXMubG9nU3RhdHVzQ29kZShzdGF0dXNDb2RlLCBzdGRlcnIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1c0NvZGVcbiAgfVxuXG4gIGFzeW5jIGV4ZWNMYXRleG1rIChkaXJlY3RvcnlQYXRoLCBhcmdzLCB0eXBlKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGAke3RoaXMuZXhlY3V0YWJsZX0gJHthcmdzLmpvaW4oJyAnKX1gXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucyhkaXJlY3RvcnlQYXRoLCB7IG1heF9wcmludF9saW5lOiAxMDAwIH0pXG5cbiAgICByZXR1cm4gYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIG9wdGlvbnMpXG4gIH1cblxuICBhc3luYyBjaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMgKCkge1xuICAgIGNvbnN0IHsgc3RhdHVzQ29kZSwgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IHRoaXMuZXhlY0xhdGV4bWsoJy4nLCBbJy12J10sICdlcnJvcicpXG5cbiAgICBpZiAoc3RhdHVzQ29kZSAhPT0gMCkge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKGBsYXRleG1rIGNoZWNrIGZhaWxlZCB3aXRoIGNvZGUgJHtzdGF0dXNDb2RlfSBhbmQgcmVzcG9uc2Ugb2YgXCIke3N0ZGVycn1cIi5gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2ggPSBzdGRvdXQubWF0Y2goTEFURVhNS19WRVJTSU9OX1BBVFRFUk4pXG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgbGF0ZXhtayBjaGVjayBzdWNjZWVkZWQgYnV0IHdpdGggYW4gdW5rbm93biB2ZXJzaW9uIHJlc3BvbnNlIG9mIFwiJHtzdGRvdXR9XCIuYClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHZlcnNpb24gPSBtYXRjaFsxXVxuXG4gICAgaWYgKHZlcnNpb24gPCBMQVRFWE1LX01JTklNVU1fVkVSU0lPTikge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYGxhdGV4bWsgY2hlY2sgc3VjY2VlZGVkIGJ1dCB3aXRoIGEgdmVyc2lvbiBvZiAke3ZlcnNpb259XCIuIE1pbmltdW0gdmVyc2lvbiByZXF1aXJlZCBpcyAke0xBVEVYTUtfTUlOSU1VTV9WRVJTSU9OfS5gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGF0ZXgubG9nLmluZm8oYGxhdGV4bWsgY2hlY2sgc3VjY2VlZGVkLiBGb3VuZCB2ZXJzaW9uICR7dmVyc2lvbn0uYClcbiAgfVxuXG4gIGxvZ1N0YXR1c0NvZGUgKHN0YXR1c0NvZGUsIHN0ZGVycikge1xuICAgIHN3aXRjaCAoc3RhdHVzQ29kZSkge1xuICAgICAgY2FzZSAxMDpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBCYWQgY29tbWFuZCBsaW5lIGFyZ3VtZW50cy4nKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxMTpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBGaWxlIHNwZWNpZmllZCBvbiBjb21tYW5kIGxpbmUgbm90IGZvdW5kIG9yIG90aGVyIGZpbGUgbm90IGZvdW5kLicpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDEyOlxuICAgICAgICBsYXRleC5sb2cuZXJyb3IoJ2xhdGV4bWs6IEZhaWx1cmUgaW4gc29tZSBwYXJ0IG9mIG1ha2luZyBmaWxlcy4nKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxMzpcbiAgICAgICAgbGF0ZXgubG9nLmVycm9yKCdsYXRleG1rOiBlcnJvciBpbiBpbml0aWFsaXphdGlvbiBmaWxlLicpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDIwOlxuICAgICAgICBsYXRleC5sb2cuZXJyb3IoJ2xhdGV4bWs6IHByb2JhYmxlIGJ1ZyBvciByZXRjb2RlIGZyb20gY2FsbGVkIHByb2dyYW0uJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN1cGVyLmxvZ1N0YXR1c0NvZGUoc3RhdHVzQ29kZSwgc3RkZXJyKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdEFyZ3MgKGpvYlN0YXRlKSB7XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICctaW50ZXJhY3Rpb249bm9uc3RvcG1vZGUnLFxuICAgICAgJy1mJyxcbiAgICAgICctY2QnLFxuICAgICAgJy1maWxlLWxpbmUtZXJyb3InXG4gICAgXVxuXG4gICAgaWYgKGpvYlN0YXRlLmdldFNob3VsZFJlYnVpbGQoKSkge1xuICAgICAgYXJncy5wdXNoKCctZycpXG4gICAgfVxuICAgIGlmIChqb2JTdGF0ZS5nZXRKb2JOYW1lKCkpIHtcbiAgICAgIGFyZ3MucHVzaChgLWpvYm5hbWU9XCIke2pvYlN0YXRlLmdldEpvYk5hbWUoKX1cImApXG4gICAgfVxuICAgIGlmIChqb2JTdGF0ZS5nZXRFbmFibGVTaGVsbEVzY2FwZSgpKSB7XG4gICAgICBhcmdzLnB1c2goJy1zaGVsbC1lc2NhcGUnKVxuICAgIH1cbiAgICBpZiAoam9iU3RhdGUuZ2V0RW5hYmxlU3luY3RleCgpKSB7XG4gICAgICBhcmdzLnB1c2goJy1zeW5jdGV4PTEnKVxuICAgIH1cbiAgICBpZiAoam9iU3RhdGUuZ2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUoKSkge1xuICAgICAgY29uc3QgbGF0ZXhta3JjUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnbGF0ZXhta3JjJylcbiAgICAgIGFyZ3MucHVzaChgLXIgXCIke2xhdGV4bWtyY1BhdGh9XCJgKVxuICAgIH1cblxuICAgIGlmIChqb2JTdGF0ZS5nZXRFbmdpbmUoKS5tYXRjaChMQVRFWF9QQVRURVJOKSkge1xuICAgICAgYXJncy5wdXNoKGAtbGF0ZXg9XCIke2pvYlN0YXRlLmdldEVuZ2luZSgpfVwiYClcbiAgICAgIGFyZ3MucHVzaChqb2JTdGF0ZS5nZXRPdXRwdXRGb3JtYXQoKSA9PT0gJ3BkZidcbiAgICAgICAgPyB0aGlzLmNvbnN0cnVjdFBkZlByb2R1Y2VyQXJncyhqb2JTdGF0ZSlcbiAgICAgICAgOiBgLSR7am9iU3RhdGUuZ2V0T3V0cHV0Rm9ybWF0KCl9YClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTG9vayBmb3Igb3RoZXIgUERGIGVuZ2luZXMgdGhhdCBjYW4gYmUgc3BlY2lmaWVkIHVzaW5nIHNob3J0IGNvbW1hbmRcbiAgICAgIC8vIG9wdGlvbnMsIGkuZS4gLWx1YWxhdGV4IGFuZCAteGVsYXRleFxuICAgICAgaWYgKGpvYlN0YXRlLmdldE91dHB1dEZvcm1hdCgpID09PSAncGRmJyAmJiBqb2JTdGF0ZS5nZXRFbmdpbmUoKS5tYXRjaChQREZfRU5HSU5FX1BBVFRFUk4pKSB7XG4gICAgICAgIGFyZ3MucHVzaChgLSR7am9iU3RhdGUuZ2V0RW5naW5lKCl9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEtlZXAgdGhlIG9wdGlvbiBub2lzZSB0byBhIG1pbmltdW0gYnkgbm90IHBhc3NpbmcgZGVmYXVsdCBlbmdpbmVcbiAgICAgICAgaWYgKGpvYlN0YXRlLmdldEVuZ2luZSgpICE9PSAncGRmbGF0ZXgnKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGAtcGRmbGF0ZXg9XCIke2pvYlN0YXRlLmdldEVuZ2luZSgpfVwiYClcbiAgICAgICAgfVxuICAgICAgICBhcmdzLnB1c2goYC0ke2pvYlN0YXRlLmdldE91dHB1dEZvcm1hdCgpfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGpvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpKSB7XG4gICAgICBhcmdzLnB1c2goYC1vdXRkaXI9XCIke2pvYlN0YXRlLmdldE91dHB1dERpcmVjdG9yeSgpfVwiYClcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFwiJHtqb2JTdGF0ZS5nZXRUZXhGaWxlUGF0aCgpfVwiYClcbiAgICByZXR1cm4gYXJnc1xuICB9XG5cbiAgY29uc3RydWN0UGRmUHJvZHVjZXJBcmdzIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IHByb2R1Y2VyID0gam9iU3RhdGUuZ2V0UHJvZHVjZXIoKVxuXG4gICAgc3dpdGNoIChwcm9kdWNlcikge1xuICAgICAgY2FzZSAncHMycGRmJzpcbiAgICAgICAgcmV0dXJuICctcGRmcHMnXG4gICAgICBjYXNlICdkdmlwZGYnOlxuICAgICAgICByZXR1cm4gJy1wZGZkdmkgLWUgXCIkZHZpcGRmID0gXFwnZHZpcGRmICVPICVTICVEXFwnO1wiJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGAtcGRmZHZpIC1lIFwiJGR2aXBkZiA9ICcke3Byb2R1Y2VyfSAlTyAtbyAlRCAlUyc7XCJgXG4gICAgfVxuICB9XG59XG4iXX0=