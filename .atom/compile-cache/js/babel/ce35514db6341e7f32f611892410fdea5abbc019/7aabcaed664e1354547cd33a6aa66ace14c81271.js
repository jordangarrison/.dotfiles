function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

require('../spec-helpers');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libParsersLogParser = require('../../lib/parsers/log-parser');

var _libParsersLogParser2 = _interopRequireDefault(_libParsersLogParser);

describe('LogParser', function () {
  var fixturesPath = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
  });

  describe('parse', function () {
    it('returns the expected output path', function () {
      var expectedPath = _path2['default'].resolve('/foo/output/file.pdf');
      var logFile = _path2['default'].join(fixturesPath, 'file.log');
      var texFile = _path2['default'].join(fixturesPath, 'file.tex');
      var parser = new _libParsersLogParser2['default'](logFile, texFile);
      var result = parser.parse();

      expect(result.outputFilePath).toBe(expectedPath);
    });

    it('returns the expected output path when the compiled file contained spaces', function () {
      var expectedPath = _path2['default'].resolve('/foo/output/filename with spaces.pdf');
      var logFile = _path2['default'].join(fixturesPath, 'filename with spaces.log');
      var texFile = _path2['default'].join(fixturesPath, 'filename with spaces.tex');
      var parser = new _libParsersLogParser2['default'](logFile, texFile);
      var result = parser.parse();

      expect(result.outputFilePath).toBe(expectedPath);
    });

    it('parses and returns all errors', function () {
      var logFile = _path2['default'].join(fixturesPath, 'errors.log');
      var texFile = _path2['default'].join(fixturesPath, 'errors.tex');
      var parser = new _libParsersLogParser2['default'](logFile, texFile);
      var result = parser.parse();

      expect(_lodash2['default'].countBy(result.messages, 'type').error).toBe(3);
    });

    it('associates an error with a file path, line number, and message', function () {
      var logFile = _path2['default'].join(fixturesPath, 'errors.log');
      var texFile = _path2['default'].join(fixturesPath, 'errors.tex');
      var parser = new _libParsersLogParser2['default'](logFile, texFile);
      var result = parser.parse();
      var error = result.messages.find(function (message) {
        return message.type === 'error';
      });

      expect(error).toEqual({
        type: 'error',
        logRange: [[196, 0], [196, 84]],
        filePath: texFile,
        range: [[9, 0], [9, 65536]],
        logPath: logFile,
        text: '\\begin{gather*} on input line 8 ended by \\end{gather}'
      });
    });
  });

  describe('getLines', function () {
    it('returns the expected number of lines', function () {
      var logFile = _path2['default'].join(fixturesPath, 'file.log');
      var texFile = _path2['default'].join(fixturesPath, 'file.tex');
      var parser = new _libParsersLogParser2['default'](logFile, texFile);
      var lines = parser.getLines();

      expect(lines.length).toBe(63);
    });

    it('throws an error when passed a filepath that does not exist', function () {
      var logFile = _path2['default'].join(fixturesPath, 'nope.log');
      var texFile = _path2['default'].join(fixturesPath, 'nope.tex');
      var parser = new _libParsersLogParser2['default'](logFile, texFile);

      expect(parser.getLines).toThrow();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3BhcnNlcnMvbG9nLXBhcnNlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7UUFFTyxpQkFBaUI7O3NCQUVWLFFBQVE7Ozs7b0JBQ0wsTUFBTTs7OzttQ0FDRCw4QkFBOEI7Ozs7QUFFcEQsUUFBUSxDQUFDLFdBQVcsRUFBRSxZQUFNO0FBQzFCLE1BQUksWUFBWSxZQUFBLENBQUE7O0FBRWhCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsZ0JBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQzFDLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdEIsTUFBRSxDQUFDLGtDQUFrQyxFQUFFLFlBQU07QUFDM0MsVUFBTSxZQUFZLEdBQUcsa0JBQUssT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDekQsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNuRCxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ25ELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM5QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRTdCLFlBQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQ2pELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsMEVBQTBFLEVBQUUsWUFBTTtBQUNuRixVQUFNLFlBQVksR0FBRyxrQkFBSyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtBQUN6RSxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLDBC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LFVBQVUsQ0FBQyxDQUFBO0FBQ25ELFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUU5QyxZQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2xDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0ICcuLi9zcGVjLWhlbHBlcnMnXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTG9nUGFyc2VyIGZyb20gJy4uLy4uL2xpYi9wYXJzZXJzL2xvZy1wYXJzZXInXG5cbmRlc2NyaWJlKCdMb2dQYXJzZXInLCAoKSA9PiB7XG4gIGxldCBmaXh0dXJlc1BhdGhcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBmaXh0dXJlc1BhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICB9KVxuXG4gIGRlc2NyaWJlKCdwYXJzZScsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgb3V0cHV0IHBhdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBwYXRoLnJlc29sdmUoJy9mb28vb3V0cHV0L2ZpbGUucGRmJylcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZS5sb2cnKVxuICAgICAgY29uc3QgdGV4RmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLnRleCcpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUsIHRleEZpbGUpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuXG4gICAgICBleHBlY3QocmVzdWx0Lm91dHB1dEZpbGVQYXRoKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdGhlIGV4cGVjdGVkIG91dHB1dCBwYXRoIHdoZW4gdGhlIGNvbXBpbGVkIGZpbGUgY29udGFpbmVkIHNwYWNlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IHBhdGgucmVzb2x2ZSgnL2Zvby9vdXRwdXQvZmlsZW5hbWUgd2l0aCBzcGFjZXMucGRmJylcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZW5hbWUgd2l0aCBzcGFjZXMubG9nJylcbiAgICAgIGNvbnN0IHRleEZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZW5hbWUgd2l0aCBzcGFjZXMudGV4JylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSwgdGV4RmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQub3V0cHV0RmlsZVBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgncGFyc2VzIGFuZCByZXR1cm5zIGFsbCBlcnJvcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Vycm9ycy5sb2cnKVxuICAgICAgY29uc3QgdGV4RmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdlcnJvcnMudGV4JylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSwgdGV4RmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChfLmNvdW50QnkocmVzdWx0Lm1lc3NhZ2VzLCAndHlwZScpLmVycm9yKS50b0JlKDMpXG4gICAgfSlcblxuICAgIGl0KCdhc3NvY2lhdGVzIGFuIGVycm9yIHdpdGggYSBmaWxlIHBhdGgsIGxpbmUgbnVtYmVyLCBhbmQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZXJyb3JzLmxvZycpXG4gICAgICBjb25zdCB0ZXhGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Vycm9ycy50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlLCB0ZXhGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcbiAgICAgIGNvbnN0IGVycm9yID0gcmVzdWx0Lm1lc3NhZ2VzLmZpbmQobWVzc2FnZSA9PiB7IHJldHVybiBtZXNzYWdlLnR5cGUgPT09ICdlcnJvcicgfSlcblxuICAgICAgZXhwZWN0KGVycm9yKS50b0VxdWFsKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbG9nUmFuZ2U6IFtbMTk2LCAwXSwgWzE5NiwgODRdXSxcbiAgICAgICAgZmlsZVBhdGg6IHRleEZpbGUsXG4gICAgICAgIHJhbmdlOiBbWzksIDBdLCBbOSwgNjU1MzZdXSxcbiAgICAgICAgbG9nUGF0aDogbG9nRmlsZSxcbiAgICAgICAgdGV4dDogJ1xcXFxiZWdpbntnYXRoZXIqfSBvbiBpbnB1dCBsaW5lIDggZW5kZWQgYnkgXFxcXGVuZHtnYXRoZXJ9J1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRMaW5lcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIGxpbmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLmxvZycpXG4gICAgICBjb25zdCB0ZXhGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2ZpbGUudGV4JylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSwgdGV4RmlsZSlcbiAgICAgIGNvbnN0IGxpbmVzID0gcGFyc2VyLmdldExpbmVzKClcblxuICAgICAgZXhwZWN0KGxpbmVzLmxlbmd0aCkudG9CZSg2MylcbiAgICB9KVxuXG4gICAgaXQoJ3Rocm93cyBhbiBlcnJvciB3aGVuIHBhc3NlZCBhIGZpbGVwYXRoIHRoYXQgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ25vcGUubG9nJylcbiAgICAgIGNvbnN0IHRleEZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbm9wZS50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlLCB0ZXhGaWxlKVxuXG4gICAgICBleHBlY3QocGFyc2VyLmdldExpbmVzKS50b1Rocm93KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==