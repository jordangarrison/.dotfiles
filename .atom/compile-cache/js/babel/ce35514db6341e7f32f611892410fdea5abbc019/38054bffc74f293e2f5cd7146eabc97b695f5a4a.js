function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

require('../spec-helpers');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libParsersFdbParser = require('../../lib/parsers/fdb-parser');

var _libParsersFdbParser2 = _interopRequireDefault(_libParsersFdbParser);

describe('FdbParser', function () {
  var fixturesPath = undefined,
      fdbFile = undefined,
      texFile = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
    fdbFile = _path2['default'].join(fixturesPath, 'log-parse', 'file-pdfps.fdb_latexmk');
    texFile = _path2['default'].join(fixturesPath, 'file.tex');
  });

  describe('parse', function () {
    it('returns the expected parsed fdb', function () {
      var parser = new _libParsersFdbParser2['default'](fdbFile, texFile);
      var result = parser.parse();
      var expectedResult = {
        dvips: {
          source: ['log-parse/file-pdfps.dvi'],
          generated: ['log-parse/file-pdfps.ps']
        },
        latex: {
          source: ['file-pdfps.aux', 'file.tex'],
          generated: ['log-parse/file-pdfps.aux', 'log-parse/file-pdfps.log', 'log-parse/file-pdfps.dvi']
        },
        ps2pdf: {
          source: ['log-parse/file-pdfps.ps'],
          generated: ['log-parse/file-pdfps.pdf']
        }
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getLines', function () {
    it('returns the expected number of lines', function () {
      var parser = new _libParsersFdbParser2['default'](fdbFile, texFile);
      var lines = parser.getLines();

      expect(lines.length).toBe(17);
    });

    it('throws an error when passed a filepath that does not exist', function () {
      var fdbFile = _path2['default'].join(fixturesPath, 'nope.fdb_latexmk');
      var texFile = _path2['default'].join(fixturesPath, 'nope.tex');
      var parser = new _libParsersFdbParser2['default'](fdbFile, texFile);

      expect(parser.getLines).toThrow();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3BhcnNlcnMvZmRiLXBhcnNlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7UUFFTyxpQkFBaUI7O29CQUVQLE1BQU07Ozs7bUNBQ0QsOEJBQThCOzs7O0FBRXBELFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLFlBQVksWUFBQTtNQUFFLE9BQU8sWUFBQTtNQUFFLE9BQU8sWUFBQSxDQUFBOztBQUVsQyxZQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QyxXQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsd0JBQXdCLENBQUMsQ0FBQTtBQUN4RSxXQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtHQUM5QyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLE1BQUUsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNO0FBQzFDLFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM5QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDN0IsVUFBTSxjQUFjLEdBQUc7QUFDckIsYUFBSyxFQUFFO0FBQ0wsZ0JBQU0sRUFBRSxDQUFDLDBCQUEwQixDQUFDO0FBQ3BDLG1CQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QztBQUNELGFBQUssRUFBRTtBQUNMLGdCQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUM7QUFDdEMsbUJBQVMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixDQUFDO1NBQ2hHO0FBQ0QsY0FBTSxFQUFFO0FBQ04sZ0JBQU0sRUFBRSxDQUFDLHlCQUF5QixDQUFDO0FBQ25DLG1CQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztTQUN4QztPQUNGLENBQUE7O0FBRUQsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtLQUN2QyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQ3pCLE1BQUUsQ0FBQyxzQ0FBc0MsRUFBRSxZQUFNO0FBQy9DLFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM5QyxVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7O0FBRS9CLFlBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQzlCLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsNERBQTRELEVBQUUsWUFBTTtBQUNyRSxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDM0QsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNuRCxVQUFNLE1BQU0sR0FBRyxxQ0FBYyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRTlDLFlBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3BhcnNlcnMvZmRiLXBhcnNlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgJy4uL3NwZWMtaGVscGVycydcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBGZGJQYXJzZXIgZnJvbSAnLi4vLi4vbGliL3BhcnNlcnMvZmRiLXBhcnNlcidcblxuZGVzY3JpYmUoJ0ZkYlBhcnNlcicsICgpID0+IHtcbiAgbGV0IGZpeHR1cmVzUGF0aCwgZmRiRmlsZSwgdGV4RmlsZVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGZpeHR1cmVzUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgZmRiRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdsb2ctcGFyc2UnLCAnZmlsZS1wZGZwcy5mZGJfbGF0ZXhtaycpXG4gICAgdGV4RmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLnRleCcpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3BhcnNlJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHRoZSBleHBlY3RlZCBwYXJzZWQgZmRiJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IEZkYlBhcnNlcihmZGJGaWxlLCB0ZXhGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcbiAgICAgIGNvbnN0IGV4cGVjdGVkUmVzdWx0ID0ge1xuICAgICAgICBkdmlwczoge1xuICAgICAgICAgIHNvdXJjZTogWydsb2ctcGFyc2UvZmlsZS1wZGZwcy5kdmknXSxcbiAgICAgICAgICBnZW5lcmF0ZWQ6IFsnbG9nLXBhcnNlL2ZpbGUtcGRmcHMucHMnXVxuICAgICAgICB9LFxuICAgICAgICBsYXRleDoge1xuICAgICAgICAgIHNvdXJjZTogWydmaWxlLXBkZnBzLmF1eCcsICdmaWxlLnRleCddLFxuICAgICAgICAgIGdlbmVyYXRlZDogWydsb2ctcGFyc2UvZmlsZS1wZGZwcy5hdXgnLCAnbG9nLXBhcnNlL2ZpbGUtcGRmcHMubG9nJywgJ2xvZy1wYXJzZS9maWxlLXBkZnBzLmR2aSddXG4gICAgICAgIH0sXG4gICAgICAgIHBzMnBkZjoge1xuICAgICAgICAgIHNvdXJjZTogWydsb2ctcGFyc2UvZmlsZS1wZGZwcy5wcyddLFxuICAgICAgICAgIGdlbmVyYXRlZDogWydsb2ctcGFyc2UvZmlsZS1wZGZwcy5wZGYnXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoZXhwZWN0ZWRSZXN1bHQpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0TGluZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBsaW5lcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBGZGJQYXJzZXIoZmRiRmlsZSwgdGV4RmlsZSlcbiAgICAgIGNvbnN0IGxpbmVzID0gcGFyc2VyLmdldExpbmVzKClcblxuICAgICAgZXhwZWN0KGxpbmVzLmxlbmd0aCkudG9CZSgxNylcbiAgICB9KVxuXG4gICAgaXQoJ3Rocm93cyBhbiBlcnJvciB3aGVuIHBhc3NlZCBhIGZpbGVwYXRoIHRoYXQgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmZGJGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ25vcGUuZmRiX2xhdGV4bWsnKVxuICAgICAgY29uc3QgdGV4RmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdub3BlLnRleCcpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRmRiUGFyc2VyKGZkYkZpbGUsIHRleEZpbGUpXG5cbiAgICAgIGV4cGVjdChwYXJzZXIuZ2V0TGluZXMpLnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG59KVxuIl19