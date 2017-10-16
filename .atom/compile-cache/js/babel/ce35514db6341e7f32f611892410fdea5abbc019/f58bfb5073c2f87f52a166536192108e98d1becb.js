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

var MISSING_PACKAGE_PATTERN = /there is no package called [‘']([^’']+)[’']/g;
var OUTPUT_PATH_PATTERN = /\[\d+]\s+"(.*)"/;
var RSCRIPT_VERSION_PATTERN = /version\s+(\S+)/i;
var PACKAGE_VERSION_PATTERN = /^\[1] "([^"]*)"/;

function escapePath(filePath) {
  return filePath.replace(/\\/g, '\\\\');
}

var KnitrBuilder = (function (_Builder) {
  _inherits(KnitrBuilder, _Builder);

  function KnitrBuilder() {
    _classCallCheck(this, KnitrBuilder);

    _get(Object.getPrototypeOf(KnitrBuilder.prototype), 'constructor', this).apply(this, arguments);

    this.executable = 'Rscript';
  }

  _createClass(KnitrBuilder, [{
    key: 'run',
    value: _asyncToGenerator(function* (jobState) {
      var args = this.constructArgs(jobState);

      var _ref = yield this.execRscript(jobState.getProjectPath(), args, 'error');

      var statusCode = _ref.statusCode;
      var stdout = _ref.stdout;
      var stderr = _ref.stderr;

      if (statusCode !== 0) {
        this.logStatusCode(statusCode, stderr);
        return statusCode;
      }

      jobState.setTexFilePath(this.resolveOutputPath(jobState.getKnitrFilePath(), stdout));

      var builder = latex.builderRegistry.getBuilder(jobState);
      var code = yield builder.run(jobState);

      if (code === 0 && jobState.getEnableSynctex()) {
        var _args = this.constructPatchSynctexArgs(jobState);
        yield this.execRscript(jobState.getProjectPath(), _args, 'warning');
      }

      return code;
    })
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {
      var _ref2 = yield this.execRscript('.', ['--version'], 'warning');

      var statusCode = _ref2.statusCode;
      var stderr = _ref2.stderr;

      if (statusCode !== 0) {
        latex.log.warning('Rscript check failed with code ' + statusCode + ' and response of "' + stderr + '".');
        return;
      }

      var match = stderr.match(RSCRIPT_VERSION_PATTERN);

      if (!match) {
        latex.log.warning('Rscript check succeeded but with an unknown version response of "' + stderr + '".');
        return;
      }

      var version = match[1];

      latex.log.info('Rscript check succeeded. Found version ' + version + '.');

      yield this.checkRscriptPackageVersion('knitr');
      yield this.checkRscriptPackageVersion('patchSynctex', '0.1-4');
    })
  }, {
    key: 'checkRscriptPackageVersion',
    value: _asyncToGenerator(function* (packageName, minimumVersion) {
      var result = yield this.execRscript('.', ['-e "installed.packages()[\'' + packageName + '\',\'Version\']"'], 'warning');

      if (result.statusCode === 0) {
        var match = result.stdout.match(PACKAGE_VERSION_PATTERN);
        if (match) {
          var version = match[1];
          var message = 'Rscript ' + packageName + ' package check succeeded. Found version ' + version + '.';
          if (minimumVersion && minimumVersion > version) {
            latex.log.warning(message + ' Minimum version ' + minimumVersion + ' needed.');
          } else {
            latex.log.info(message);
          }
          return;
        }
      }

      latex.log.warning('Rscript package ' + packageName + ' was not found.');
    })
  }, {
    key: 'execRscript',
    value: _asyncToGenerator(function* (directoryPath, args, type) {
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions(directoryPath);

      var _ref3 = yield latex.process.executeChildProcess(command, options);

      var statusCode = _ref3.statusCode;
      var stdout = _ref3.stdout;
      var stderr = _ref3.stderr;

      if (statusCode !== 0) {
        // Parse error message to detect missing libraries.
        var match = undefined;
        while ((match = MISSING_PACKAGE_PATTERN.exec(stderr)) !== null) {
          var text = 'The R package "' + match[1] + '" could not be loaded.';
          latex.log.showMessage({ type: type, text: text });
          statusCode = -1;
        }
      }

      return { statusCode: statusCode, stdout: stdout, stderr: stderr };
    })
  }, {
    key: 'constructArgs',
    value: function constructArgs(jobState) {
      var args = ['-e "library(knitr)"', '-e "opts_knit$set(concordance = TRUE)"', '-e "knit(\'' + escapePath(jobState.getKnitrFilePath()) + '\')"'];

      return args;
    }
  }, {
    key: 'constructPatchSynctexArgs',
    value: function constructPatchSynctexArgs(jobState) {
      var synctexPath = this.resolveOutputFilePath(jobState, '');

      var args = ['-e "library(patchSynctex)"', '-e "patchSynctex(\'' + escapePath(jobState.getKnitrFilePath()) + '\',syncfile=\'' + escapePath(synctexPath) + '\')"'];

      return args;
    }
  }, {
    key: 'resolveOutputPath',
    value: function resolveOutputPath(sourcePath, stdout) {
      var candidatePath = OUTPUT_PATH_PATTERN.exec(stdout)[1];
      if (_path2['default'].isAbsolute(candidatePath)) {
        return candidatePath;
      }

      var sourceDir = _path2['default'].dirname(sourcePath);
      return _path2['default'].join(sourceDir, candidatePath);
    }
  }], [{
    key: 'canProcess',
    value: function canProcess(state) {
      return !state.getTexFilePath() && !!state.getKnitrFilePath();
    }
  }]);

  return KnitrBuilder;
})(_builder2['default']);

exports['default'] = KnitrBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMva25pdHIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3VCQUNILFlBQVk7Ozs7QUFFaEMsSUFBTSx1QkFBdUIsR0FBRyw4Q0FBOEMsQ0FBQTtBQUM5RSxJQUFNLG1CQUFtQixHQUFHLGlCQUFpQixDQUFBO0FBQzdDLElBQU0sdUJBQXVCLEdBQUcsa0JBQWtCLENBQUE7QUFDbEQsSUFBTSx1QkFBdUIsR0FBRyxpQkFBaUIsQ0FBQTs7QUFFakQsU0FBUyxVQUFVLENBQUUsUUFBUSxFQUFFO0FBQzdCLFNBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7Q0FDdkM7O0lBRW9CLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7U0FDL0IsVUFBVSxHQUFHLFNBQVM7OztlQURILFlBQVk7OzZCQU9yQixXQUFDLFFBQVEsRUFBRTtBQUNuQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztpQkFDRixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7O1VBQS9GLFVBQVUsUUFBVixVQUFVO1VBQUUsTUFBTSxRQUFOLE1BQU07VUFBRSxNQUFNLFFBQU4sTUFBTTs7QUFDbEMsVUFBSSxVQUFVLEtBQUssQ0FBQyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3RDLGVBQU8sVUFBVSxDQUFBO09BQ2xCOztBQUVELGNBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENB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QUFFLE1BQU0sRUFBRTtBQUNyQyxVQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekQsVUFBSSxrQkFBSyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDbEMsZUFBTyxhQUFhLENBQUE7T0FDckI7O0FBRUQsVUFBTSxTQUFTLEdBQUcsa0JBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzFDLGFBQU8sa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQTtLQUMzQzs7O1dBcEhpQixvQkFBQyxLQUFLLEVBQUU7QUFDeEIsYUFBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDN0Q7OztTQUxrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2tuaXRyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSAnLi4vYnVpbGRlcidcblxuY29uc3QgTUlTU0lOR19QQUNLQUdFX1BBVFRFUk4gPSAvdGhlcmUgaXMgbm8gcGFja2FnZSBjYWxsZWQgW+KAmCddKFte4oCZJ10rKVvigJknXS9nXG5jb25zdCBPVVRQVVRfUEFUSF9QQVRURVJOID0gL1xcW1xcZCtdXFxzK1wiKC4qKVwiL1xuY29uc3QgUlNDUklQVF9WRVJTSU9OX1BBVFRFUk4gPSAvdmVyc2lvblxccysoXFxTKykvaVxuY29uc3QgUEFDS0FHRV9WRVJTSU9OX1BBVFRFUk4gPSAvXlxcWzFdIFwiKFteXCJdKilcIi9cblxuZnVuY3Rpb24gZXNjYXBlUGF0aCAoZmlsZVBhdGgpIHtcbiAgcmV0dXJuIGZpbGVQYXRoLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS25pdHJCdWlsZGVyIGV4dGVuZHMgQnVpbGRlciB7XG4gIGV4ZWN1dGFibGUgPSAnUnNjcmlwdCdcblxuICBzdGF0aWMgY2FuUHJvY2VzcyAoc3RhdGUpIHtcbiAgICByZXR1cm4gIXN0YXRlLmdldFRleEZpbGVQYXRoKCkgJiYgISFzdGF0ZS5nZXRLbml0ckZpbGVQYXRoKClcbiAgfVxuXG4gIGFzeW5jIHJ1biAoam9iU3RhdGUpIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5jb25zdHJ1Y3RBcmdzKGpvYlN0YXRlKVxuICAgIGNvbnN0IHsgc3RhdHVzQ29kZSwgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IHRoaXMuZXhlY1JzY3JpcHQoam9iU3RhdGUuZ2V0UHJvamVjdFBhdGgoKSwgYXJncywgJ2Vycm9yJylcbiAgICBpZiAoc3RhdHVzQ29kZSAhPT0gMCkge1xuICAgICAgdGhpcy5sb2dTdGF0dXNDb2RlKHN0YXR1c0NvZGUsIHN0ZGVycilcbiAgICAgIHJldHVybiBzdGF0dXNDb2RlXG4gICAgfVxuXG4gICAgam9iU3RhdGUuc2V0VGV4RmlsZVBhdGgodGhpcy5yZXNvbHZlT3V0cHV0UGF0aChqb2JTdGF0ZS5nZXRLbml0ckZpbGVQYXRoKCksIHN0ZG91dCkpXG5cbiAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXIoam9iU3RhdGUpXG4gICAgY29uc3QgY29kZSA9IGF3YWl0IGJ1aWxkZXIucnVuKGpvYlN0YXRlKVxuXG4gICAgaWYgKGNvZGUgPT09IDAgJiYgam9iU3RhdGUuZ2V0RW5hYmxlU3luY3RleCgpKSB7XG4gICAgICBjb25zdCBhcmdzID0gdGhpcy5jb25zdHJ1Y3RQYXRjaFN5bmN0ZXhBcmdzKGpvYlN0YXRlKVxuICAgICAgYXdhaXQgdGhpcy5leGVjUnNjcmlwdChqb2JTdGF0ZS5nZXRQcm9qZWN0UGF0aCgpLCBhcmdzLCAnd2FybmluZycpXG4gICAgfVxuXG4gICAgcmV0dXJuIGNvZGVcbiAgfVxuXG4gIGFzeW5jIGNoZWNrUnVudGltZURlcGVuZGVuY2llcyAoKSB7XG4gICAgY29uc3QgeyBzdGF0dXNDb2RlLCBzdGRlcnIgfSA9IGF3YWl0IHRoaXMuZXhlY1JzY3JpcHQoJy4nLCBbJy0tdmVyc2lvbiddLCAnd2FybmluZycpXG5cbiAgICBpZiAoc3RhdHVzQ29kZSAhPT0gMCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYFJzY3JpcHQgY2hlY2sgZmFpbGVkIHdpdGggY29kZSAke3N0YXR1c0NvZGV9IGFuZCByZXNwb25zZSBvZiBcIiR7c3RkZXJyfVwiLmApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaCA9IHN0ZGVyci5tYXRjaChSU0NSSVBUX1ZFUlNJT05fUEFUVEVSTilcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBSc2NyaXB0IGNoZWNrIHN1Y2NlZWRlZCBidXQgd2l0aCBhbiB1bmtub3duIHZlcnNpb24gcmVzcG9uc2Ugb2YgXCIke3N0ZGVycn1cIi5gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgdmVyc2lvbiA9IG1hdGNoWzFdXG5cbiAgICBsYXRleC5sb2cuaW5mbyhgUnNjcmlwdCBjaGVjayBzdWNjZWVkZWQuIEZvdW5kIHZlcnNpb24gJHt2ZXJzaW9ufS5gKVxuXG4gICAgYXdhaXQgdGhpcy5jaGVja1JzY3JpcHRQYWNrYWdlVmVyc2lvbigna25pdHInKVxuICAgIGF3YWl0IHRoaXMuY2hlY2tSc2NyaXB0UGFja2FnZVZlcnNpb24oJ3BhdGNoU3luY3RleCcsICcwLjEtNCcpXG4gIH1cblxuICBhc3luYyBjaGVja1JzY3JpcHRQYWNrYWdlVmVyc2lvbiAocGFja2FnZU5hbWUsIG1pbmltdW1WZXJzaW9uKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5leGVjUnNjcmlwdCgnLicsIFtgLWUgXCJpbnN0YWxsZWQucGFja2FnZXMoKVsnJHtwYWNrYWdlTmFtZX0nLCdWZXJzaW9uJ11cImBdLCAnd2FybmluZycpXG5cbiAgICBpZiAocmVzdWx0LnN0YXR1c0NvZGUgPT09IDApIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gcmVzdWx0LnN0ZG91dC5tYXRjaChQQUNLQUdFX1ZFUlNJT05fUEFUVEVSTilcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCB2ZXJzaW9uID0gbWF0Y2hbMV1cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBSc2NyaXB0ICR7cGFja2FnZU5hbWV9IHBhY2thZ2UgY2hlY2sgc3VjY2VlZGVkLiBGb3VuZCB2ZXJzaW9uICR7dmVyc2lvbn0uYFxuICAgICAgICBpZiAobWluaW11bVZlcnNpb24gJiYgbWluaW11bVZlcnNpb24gPiB2ZXJzaW9uKSB7XG4gICAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYCR7bWVzc2FnZX0gTWluaW11bSB2ZXJzaW9uICR7bWluaW11bVZlcnNpb259IG5lZWRlZC5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhdGV4LmxvZy5pbmZvKG1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGF0ZXgubG9nLndhcm5pbmcoYFJzY3JpcHQgcGFja2FnZSAke3BhY2thZ2VOYW1lfSB3YXMgbm90IGZvdW5kLmApXG4gIH1cblxuICBhc3luYyBleGVjUnNjcmlwdCAoZGlyZWN0b3J5UGF0aCwgYXJncywgdHlwZSkge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgJHt0aGlzLmV4ZWN1dGFibGV9ICR7YXJncy5qb2luKCcgJyl9YFxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoZGlyZWN0b3J5UGF0aClcblxuICAgIGxldCB7IHN0YXR1c0NvZGUsIHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBsYXRleC5wcm9jZXNzLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29tbWFuZCwgb3B0aW9ucylcblxuICAgIGlmIChzdGF0dXNDb2RlICE9PSAwKSB7XG4gICAgICAvLyBQYXJzZSBlcnJvciBtZXNzYWdlIHRvIGRldGVjdCBtaXNzaW5nIGxpYnJhcmllcy5cbiAgICAgIGxldCBtYXRjaFxuICAgICAgd2hpbGUgKChtYXRjaCA9IE1JU1NJTkdfUEFDS0FHRV9QQVRURVJOLmV4ZWMoc3RkZXJyKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGBUaGUgUiBwYWNrYWdlIFwiJHttYXRjaFsxXX1cIiBjb3VsZCBub3QgYmUgbG9hZGVkLmBcbiAgICAgICAgbGF0ZXgubG9nLnNob3dNZXNzYWdlKHsgdHlwZSwgdGV4dCB9KVxuICAgICAgICBzdGF0dXNDb2RlID0gLTFcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBzdGF0dXNDb2RlLCBzdGRvdXQsIHN0ZGVyciB9XG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChqb2JTdGF0ZSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLWUgXCJsaWJyYXJ5KGtuaXRyKVwiJyxcbiAgICAgICctZSBcIm9wdHNfa25pdCRzZXQoY29uY29yZGFuY2UgPSBUUlVFKVwiJyxcbiAgICAgIGAtZSBcImtuaXQoJyR7ZXNjYXBlUGF0aChqb2JTdGF0ZS5nZXRLbml0ckZpbGVQYXRoKCkpfScpXCJgXG4gICAgXVxuXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxuXG4gIGNvbnN0cnVjdFBhdGNoU3luY3RleEFyZ3MgKGpvYlN0YXRlKSB7XG4gICAgbGV0IHN5bmN0ZXhQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoam9iU3RhdGUsICcnKVxuXG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICctZSBcImxpYnJhcnkocGF0Y2hTeW5jdGV4KVwiJyxcbiAgICAgIGAtZSBcInBhdGNoU3luY3RleCgnJHtlc2NhcGVQYXRoKGpvYlN0YXRlLmdldEtuaXRyRmlsZVBhdGgoKSl9JyxzeW5jZmlsZT0nJHtlc2NhcGVQYXRoKHN5bmN0ZXhQYXRoKX0nKVwiYFxuICAgIF1cblxuICAgIHJldHVybiBhcmdzXG4gIH1cblxuICByZXNvbHZlT3V0cHV0UGF0aCAoc291cmNlUGF0aCwgc3Rkb3V0KSB7XG4gICAgY29uc3QgY2FuZGlkYXRlUGF0aCA9IE9VVFBVVF9QQVRIX1BBVFRFUk4uZXhlYyhzdGRvdXQpWzFdXG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZShjYW5kaWRhdGVQYXRoKSkge1xuICAgICAgcmV0dXJuIGNhbmRpZGF0ZVBhdGhcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VEaXIgPSBwYXRoLmRpcm5hbWUoc291cmNlUGF0aClcbiAgICByZXR1cm4gcGF0aC5qb2luKHNvdXJjZURpciwgY2FuZGlkYXRlUGF0aClcbiAgfVxufVxuIl19