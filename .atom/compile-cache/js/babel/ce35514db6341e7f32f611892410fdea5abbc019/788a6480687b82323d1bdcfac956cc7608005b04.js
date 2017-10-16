function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libBuildersKnitr = require('../../lib/builders/knitr');

var _libBuildersKnitr2 = _interopRequireDefault(_libBuildersKnitr);

var _libBuildState = require('../../lib/build-state');

var _libBuildState2 = _interopRequireDefault(_libBuildState);

function getRawFile(filePath) {
  return _fsPlus2['default'].readFileSync(filePath, { encoding: 'utf-8' });
}

describe('KnitrBuilder', function () {
  var builder = undefined,
      fixturesPath = undefined,
      filePath = undefined,
      state = undefined,
      jobState = undefined;

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });
    builder = new _libBuildersKnitr2['default']();
    spyOn(builder, 'logStatusCode').andCallThrough();
    fixturesPath = _specHelpers2['default'].cloneFixtures();
    filePath = _path2['default'].join(fixturesPath, 'knitr', 'file.Rnw');
    state = new _libBuildState2['default'](filePath);
    state.setEngine('pdflatex');
    state.setOutputFormat('pdf');
    state.setOutputDirectory('');
    jobState = state.getJobStates()[0];
  });

  describe('constructArgs', function () {
    it('produces default arguments containing expected file path', function () {
      var expectedArgs = ['-e "library(knitr)"', '-e "opts_knit$set(concordance = TRUE)"', '-e "knit(\'' + filePath.replace(/\\/g, '\\\\') + '\')"'];

      var args = builder.constructArgs(jobState);
      expect(args).toEqual(expectedArgs);
    });
  });

  describe('constructPatchSynctexArgs', function () {
    it('produces default arguments containing expected file path', function () {
      var escapedFilePath = filePath.replace(/\\/g, '\\\\');
      var escapedSynctexPath = escapedFilePath.replace(/\.[^.]+$/, '');
      var expectedArgs = ['-e "library(patchSynctex)"', '-e "patchSynctex(\'' + escapedFilePath + '\',syncfile=\'' + escapedSynctexPath + '\')"'];

      var args = builder.constructPatchSynctexArgs(jobState);
      expect(args).toEqual(expectedArgs);
    });
  });

  describe('run', function () {
    var exitCode = undefined;

    it('successfully executes knitr when given a valid R Sweave file', function () {
      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        var outputFilePath = _path2['default'].join(fixturesPath, 'knitr', 'file.tex');

        expect(exitCode).toBe(0);
        expect(builder.logStatusCode).not.toHaveBeenCalled();
        expect(getRawFile(outputFilePath)).toContain('$\\tau \\approx 6.2831853$');
      });
    });

    it('fails to execute knitr when given an invalid file path', function () {
      filePath = _path2['default'].join(fixturesPath, 'foo.Rnw');
      state.setFilePath(filePath);

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(1);
        expect(builder.logStatusCode).toHaveBeenCalled();
      });
    });

    it('detects missing knitr library and logs an error', function () {
      var directoryPath = _path2['default'].dirname(filePath);
      var env = { 'R_LIBS_USER': '/dev/null', 'R_LIBS_SITE': '/dev/null' };
      var options = builder.constructChildProcessOptions(directoryPath);
      Object.assign(options.env, env);
      spyOn(builder, 'constructChildProcessOptions').andReturn(options);
      spyOn(latex.log, 'showMessage').andCallThrough();

      waitsForPromise(function () {
        return builder.run(jobState).then(function (code) {
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(-1);
        expect(builder.logStatusCode).toHaveBeenCalled();
        expect(latex.log.showMessage).toHaveBeenCalledWith({
          type: 'error',
          text: 'The R package "knitr" could not be loaded.'
        });
      });
    });
  });

  describe('resolveOutputPath', function () {
    var sourcePath = undefined,
        resultPath = undefined;

    beforeEach(function () {
      sourcePath = _path2['default'].resolve('/var/foo.Rnw');
      resultPath = _path2['default'].resolve('/var/foo.tex');
    });

    it('detects an absolute path and returns it unchanged', function () {
      var stdout = 'foo\nbar\n\n[1] "' + resultPath + '"';
      var resolvedPath = builder.resolveOutputPath(sourcePath, stdout);

      expect(resolvedPath).toBe(resultPath);
    });

    it('detects a relative path and makes it absolute with respect to the source file', function () {
      var stdout = 'foo\nbar\n\n[1] "' + _path2['default'].basename(resultPath) + '"';
      var resolvedPath = builder.resolveOutputPath(sourcePath, stdout);

      expect(resolvedPath).toBe(resultPath);
    });
  });

  describe('canProcess', function () {
    it('returns true when given a file path with a .Rnw extension', function () {
      var canProcess = _libBuildersKnitr2['default'].canProcess(state);
      expect(canProcess).toBe(true);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkZXJzL2tuaXRyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzsyQkFFb0IsaUJBQWlCOzs7O3NCQUN0QixTQUFTOzs7O29CQUNQLE1BQU07Ozs7Z0NBQ0UsMEJBQTBCOzs7OzZCQUM1Qix1QkFBdUI7Ozs7QUFFOUMsU0FBUyxVQUFVLENBQUUsUUFBUSxFQUFFO0FBQzdCLFNBQU8sb0JBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO0NBQ3REOztBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM3QixNQUFJLE9BQU8sWUFBQTtNQUFFLFlBQVksWUFBQTtNQUFFLFFBQVEsWUFBQTtNQUFFLEtBQUssWUFBQTtNQUFFLFFBQVEsWUFBQSxDQUFBOztBQUVwRCxZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLHlCQUFRLGdCQUFnQixFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFBO0FBQ0YsV0FBTyxHQUFHLG1DQUFrQixDQUFBO0FBQzVCLFNBQUssQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDaEQsZ0JBQVksR0FBRyx5QkFBUSxhQUFhLEVBQUUsQ0FBQTtBQUN0QyxZQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDdkQsU0FBSyxHQUFHLCtCQUFlLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLFNBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDM0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QixTQUFLLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDNUIsWUFBUSxHQUFHLEtBQUssQ0FBQyxZQUFZLEVB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QVUsWUFBQSxDQUFBOztBQUUxQixjQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFVLEdBQUcsa0JBQUssT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3pDLGdCQUFVLEdBQUcsa0JBQUssT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQzFDLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsbURBQW1ELEVBQUUsWUFBTTtBQUM1RCxVQUFNLE1BQU0seUJBQXVCLFVBQVUsTUFBRyxDQUFBO0FBQ2hELFVBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRWxFLFlBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDdEMsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywrRUFBK0UsRUFBRSxZQUFNO0FBQ3hGLFVBQU0sTUFBTSx5QkFBdUIsa0JBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFHLENBQUE7QUFDL0QsVUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTs7QUFFbEUsWUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUN0QyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQzNCLE1BQUUsQ0FBQywyREFBMkQsRUFBRSxZQUFNO0FBQ3BFLFVBQU0sVUFBVSxHQUFHLDhCQUFhLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNqRCxZQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzlCLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9rbml0ci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgS25pdHJCdWlsZGVyIGZyb20gJy4uLy4uL2xpYi9idWlsZGVycy9rbml0cidcbmltcG9ydCBCdWlsZFN0YXRlIGZyb20gJy4uLy4uL2xpYi9idWlsZC1zdGF0ZSdcblxuZnVuY3Rpb24gZ2V0UmF3RmlsZSAoZmlsZVBhdGgpIHtcbiAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwge2VuY29kaW5nOiAndXRmLTgnfSlcbn1cblxuZGVzY3JpYmUoJ0tuaXRyQnVpbGRlcicsICgpID0+IHtcbiAgbGV0IGJ1aWxkZXIsIGZpeHR1cmVzUGF0aCwgZmlsZVBhdGgsIHN0YXRlLCBqb2JTdGF0ZVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gaGVscGVycy5hY3RpdmF0ZVBhY2thZ2VzKClcbiAgICB9KVxuICAgIGJ1aWxkZXIgPSBuZXcgS25pdHJCdWlsZGVyKClcbiAgICBzcHlPbihidWlsZGVyLCAnbG9nU3RhdHVzQ29kZScpLmFuZENhbGxUaHJvdWdoKClcbiAgICBmaXh0dXJlc1BhdGggPSBoZWxwZXJzLmNsb25lRml4dHVyZXMoKVxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2tuaXRyJywgJ2ZpbGUuUm53JylcbiAgICBzdGF0ZSA9IG5ldyBCdWlsZFN0YXRlKGZpbGVQYXRoKVxuICAgIHN0YXRlLnNldEVuZ2luZSgncGRmbGF0ZXgnKVxuICAgIHN0YXRlLnNldE91dHB1dEZvcm1hdCgncGRmJylcbiAgICBzdGF0ZS5zZXRPdXRwdXREaXJlY3RvcnkoJycpXG4gICAgam9iU3RhdGUgPSBzdGF0ZS5nZXRKb2JTdGF0ZXMoKVswXVxuICB9KVxuXG4gIGRlc2NyaWJlKCdjb25zdHJ1Y3RBcmdzJywgKCkgPT4ge1xuICAgIGl0KCdwcm9kdWNlcyBkZWZhdWx0IGFyZ3VtZW50cyBjb250YWluaW5nIGV4cGVjdGVkIGZpbGUgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFtcbiAgICAgICAgJy1lIFwibGlicmFyeShrbml0cilcIicsXG4gICAgICAgICctZSBcIm9wdHNfa25pdCRzZXQoY29uY29yZGFuY2UgPSBUUlVFKVwiJyxcbiAgICAgICAgYC1lIFwia25pdCgnJHtmaWxlUGF0aC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpfScpXCJgXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3Moam9iU3RhdGUpXG4gICAgICBleHBlY3QoYXJncykudG9FcXVhbChleHBlY3RlZEFyZ3MpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnY29uc3RydWN0UGF0Y2hTeW5jdGV4QXJncycsICgpID0+IHtcbiAgICBpdCgncHJvZHVjZXMgZGVmYXVsdCBhcmd1bWVudHMgY29udGFpbmluZyBleHBlY3RlZCBmaWxlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlc2NhcGVkRmlsZVBhdGggPSBmaWxlUGF0aC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICBjb25zdCBlc2NhcGVkU3luY3RleFBhdGggPSBlc2NhcGVkRmlsZVBhdGgucmVwbGFjZSgvXFwuW14uXSskLywgJycpXG4gICAgICBjb25zdCBleHBlY3RlZEFyZ3MgPSBbXG4gICAgICAgICctZSBcImxpYnJhcnkocGF0Y2hTeW5jdGV4KVwiJyxcbiAgICAgICAgYC1lIFwicGF0Y2hTeW5jdGV4KCcke2VzY2FwZWRGaWxlUGF0aH0nLHN5bmNmaWxlPScke2VzY2FwZWRTeW5jdGV4UGF0aH0nKVwiYFxuICAgICAgXVxuXG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RQYXRjaFN5bmN0ZXhBcmdzKGpvYlN0YXRlKVxuICAgICAgZXhwZWN0KGFyZ3MpLnRvRXF1YWwoZXhwZWN0ZWRBcmdzKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3J1bicsICgpID0+IHtcbiAgICBsZXQgZXhpdENvZGVcblxuICAgIGl0KCdzdWNjZXNzZnVsbHkgZXhlY3V0ZXMga25pdHIgd2hlbiBnaXZlbiBhIHZhbGlkIFIgU3dlYXZlIGZpbGUnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oam9iU3RhdGUpLnRoZW4oY29kZSA9PiB7IGV4aXRDb2RlID0gY29kZSB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2tuaXRyJywgJ2ZpbGUudGV4JylcblxuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KGJ1aWxkZXIubG9nU3RhdHVzQ29kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QoZ2V0UmF3RmlsZShvdXRwdXRGaWxlUGF0aCkpLnRvQ29udGFpbignJFxcXFx0YXUgXFxcXGFwcHJveCA2LjI4MzE4NTMkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdmYWlscyB0byBleGVjdXRlIGtuaXRyIHdoZW4gZ2l2ZW4gYW4gaW52YWxpZCBmaWxlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmb28uUm53JylcbiAgICAgIHN0YXRlLnNldEZpbGVQYXRoKGZpbGVQYXRoKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oam9iU3RhdGUpLnRoZW4oY29kZSA9PiB7IGV4aXRDb2RlID0gY29kZSB9KVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgxKVxuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdkZXRlY3RzIG1pc3Npbmcga25pdHIgbGlicmFyeSBhbmQgbG9ncyBhbiBlcnJvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRpcmVjdG9yeVBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gICAgICBjb25zdCBlbnYgPSB7ICdSX0xJQlNfVVNFUic6ICcvZGV2L251bGwnLCAnUl9MSUJTX1NJVEUnOiAnL2Rldi9udWxsJyB9XG4gICAgICBjb25zdCBvcHRpb25zID0gYnVpbGRlci5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKGRpcmVjdG9yeVBhdGgpXG4gICAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMuZW52LCBlbnYpXG4gICAgICBzcHlPbihidWlsZGVyLCAnY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucycpLmFuZFJldHVybihvcHRpb25zKVxuICAgICAgc3B5T24obGF0ZXgubG9nLCAnc2hvd01lc3NhZ2UnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihqb2JTdGF0ZSkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKC0xKVxuICAgICAgICBleHBlY3QoYnVpbGRlci5sb2dTdGF0dXNDb2RlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGxhdGV4LmxvZy5zaG93TWVzc2FnZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGV4dDogJ1RoZSBSIHBhY2thZ2UgXCJrbml0clwiIGNvdWxkIG5vdCBiZSBsb2FkZWQuJ1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdyZXNvbHZlT3V0cHV0UGF0aCcsICgpID0+IHtcbiAgICBsZXQgc291cmNlUGF0aCwgcmVzdWx0UGF0aFxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzb3VyY2VQYXRoID0gcGF0aC5yZXNvbHZlKCcvdmFyL2Zvby5SbncnKVxuICAgICAgcmVzdWx0UGF0aCA9IHBhdGgucmVzb2x2ZSgnL3Zhci9mb28udGV4JylcbiAgICB9KVxuXG4gICAgaXQoJ2RldGVjdHMgYW4gYWJzb2x1dGUgcGF0aCBhbmQgcmV0dXJucyBpdCB1bmNoYW5nZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGRvdXQgPSBgZm9vXFxuYmFyXFxuXFxuWzFdIFwiJHtyZXN1bHRQYXRofVwiYFxuICAgICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gYnVpbGRlci5yZXNvbHZlT3V0cHV0UGF0aChzb3VyY2VQYXRoLCBzdGRvdXQpXG5cbiAgICAgIGV4cGVjdChyZXNvbHZlZFBhdGgpLnRvQmUocmVzdWx0UGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2RldGVjdHMgYSByZWxhdGl2ZSBwYXRoIGFuZCBtYWtlcyBpdCBhYnNvbHV0ZSB3aXRoIHJlc3BlY3QgdG8gdGhlIHNvdXJjZSBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3Rkb3V0ID0gYGZvb1xcbmJhclxcblxcblsxXSBcIiR7cGF0aC5iYXNlbmFtZShyZXN1bHRQYXRoKX1cImBcbiAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IGJ1aWxkZXIucmVzb2x2ZU91dHB1dFBhdGgoc291cmNlUGF0aCwgc3Rkb3V0KVxuXG4gICAgICBleHBlY3QocmVzb2x2ZWRQYXRoKS50b0JlKHJlc3VsdFBhdGgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnY2FuUHJvY2VzcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0cnVlIHdoZW4gZ2l2ZW4gYSBmaWxlIHBhdGggd2l0aCBhIC5SbncgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgY2FuUHJvY2VzcyA9IEtuaXRyQnVpbGRlci5jYW5Qcm9jZXNzKHN0YXRlKVxuICAgICAgZXhwZWN0KGNhblByb2Nlc3MpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==