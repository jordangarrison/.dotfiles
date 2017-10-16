function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libParsersMagicParser = require('../../lib/parsers/magic-parser');

var _libParsersMagicParser2 = _interopRequireDefault(_libParsersMagicParser);

describe('MagicParser', function () {
  var fixturesPath = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
  });

  describe('parse', function () {
    it('returns an empty object when file contains no magic comments', function () {
      var filePath = _path2['default'].join(fixturesPath, 'file.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({});
    });

    it('returns path to root file when file contains magic root comment', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'root-comment.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        'root': '../file.tex'
      });
    });

    it('returns path to root file when file contains magic root comment when magic comment is not on the first line', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'not-first-line.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        'root': '../file.tex'
      });
    });

    it('handles magic comments without optional whitespace', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'no-whitespace.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).not.toEqual({});
    });
    it('detects multiple object information when multiple magice comments are defined', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'multiple-magic-comments.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        'root': '../file.tex',
        'program': 'lualatex'
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3BhcnNlcnMvbWFnaWMtcGFyc2VyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFaUIsTUFBTTs7OztxQ0FDQyxnQ0FBZ0M7Ozs7QUFFeEQsUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFNO0FBQzVCLE1BQUksWUFBWSxZQUFBLENBQUE7O0FBRWhCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsZ0JBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQzFDLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdEIsTUFBRSxDQUFDLDhEQUE4RCxFQUFFLFlBQU07QUFDdkUsVUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNwRCxVQUFNLE1BQU0sR0FBRyx1Q0FBZ0IsUUFBUSxDQUFDLENBQUE7QUFDeEMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQzNCLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxVQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDOUUsVUFBTSxNQUFNLEdBQUcsdUNBQWdCLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFN0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNyQixjQUFNLEVBQUUsYUFBYTtPQUN0QixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDZHQUE2RyxFQUFFLFlBQU07QUFDdEgsVUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hGLFVBQU0sTUFBTSxHQUFHLHVDQUFnQixRQUFRLENBQUMsQ0FBQTtBQUN4QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRTdCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDckIsY0FBTSxFQUFFLGFBQWE7T0FDdEIsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxvREFBb0QsRUFBRSxZQUFNO0FBQzdELFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtBQUMvRSxVQUFNLE1BQU0sR0FBRyx1Q0FBZ0IsUUFBUSxDQUFDLENBQUE7QUFDeEMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUMvQixDQUFDLENBQUE7QUFDRixNQUFFLENBQUMsK0VBQStFLEVBQUUsWUFBTTtBQUN4RixVQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLDZCQUE2QixDQUFDLENBQUE7QUFDekYsVUFBTSxNQUFNLEdBQUcsdUNBQWdCLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFN0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNyQixjQUFNLEVBQUUsYUFBYTtBQUNyQixpQkFBUyxFQUFFLFVBQVU7T0FDdEIsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3BhcnNlcnMvbWFnaWMtcGFyc2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTWFnaWNQYXJzZXIgZnJvbSAnLi4vLi4vbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyJ1xuXG5kZXNjcmliZSgnTWFnaWNQYXJzZXInLCAoKSA9PiB7XG4gIGxldCBmaXh0dXJlc1BhdGhcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBmaXh0dXJlc1BhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICB9KVxuXG4gIGRlc2NyaWJlKCdwYXJzZScsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBhbiBlbXB0eSBvYmplY3Qgd2hlbiBmaWxlIGNvbnRhaW5zIG5vIG1hZ2ljIGNvbW1lbnRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZS50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7fSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgcGF0aCB0byByb290IGZpbGUgd2hlbiBmaWxlIGNvbnRhaW5zIG1hZ2ljIHJvb3QgY29tbWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ21hZ2ljLWNvbW1lbnRzJywgJ3Jvb3QtY29tbWVudC50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgICdyb290JzogJy4uL2ZpbGUudGV4J1xuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgcGF0aCB0byByb290IGZpbGUgd2hlbiBmaWxlIGNvbnRhaW5zIG1hZ2ljIHJvb3QgY29tbWVudCB3aGVuIG1hZ2ljIGNvbW1lbnQgaXMgbm90IG9uIHRoZSBmaXJzdCBsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbWFnaWMtY29tbWVudHMnLCAnbm90LWZpcnN0LWxpbmUudGV4JylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBNYWdpY1BhcnNlcihmaWxlUGF0aClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICAncm9vdCc6ICcuLi9maWxlLnRleCdcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIG1hZ2ljIGNvbW1lbnRzIHdpdGhvdXQgb3B0aW9uYWwgd2hpdGVzcGFjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ21hZ2ljLWNvbW1lbnRzJywgJ25vLXdoaXRlc3BhY2UudGV4JylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBNYWdpY1BhcnNlcihmaWxlUGF0aClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0VxdWFsKHt9KVxuICAgIH0pXG4gICAgaXQoJ2RldGVjdHMgbXVsdGlwbGUgb2JqZWN0IGluZm9ybWF0aW9uIHdoZW4gbXVsdGlwbGUgbWFnaWNlIGNvbW1lbnRzIGFyZSBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbWFnaWMtY29tbWVudHMnLCAnbXVsdGlwbGUtbWFnaWMtY29tbWVudHMudGV4JylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBNYWdpY1BhcnNlcihmaWxlUGF0aClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICAncm9vdCc6ICcuLi9maWxlLnRleCcsXG4gICAgICAgICdwcm9ncmFtJzogJ2x1YWxhdGV4J1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==