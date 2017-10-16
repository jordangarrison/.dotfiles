function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _libMarkerManager = require('../lib/marker-manager');

var _libMarkerManager2 = _interopRequireDefault(_libMarkerManager);

describe('MarkerManager', function () {
  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });
  });

  describe('addMarkers', function () {
    it('verifies that only messages that have a range and a matching file path are marked', function () {
      var editor = {
        getPath: function getPath() {
          return 'foo.tex';
        },
        onDidDestroy: function onDidDestroy() {
          return { dispose: function dispose() {
              return null;
            } };
        }
      };
      var manager = new _libMarkerManager2['default'](editor);
      var messages = [{
        type: 'error',
        range: [[0, 0], [0, 1]],
        filePath: 'foo.tex'
      }, {
        type: 'warning',
        range: [[0, 0], [0, 1]],
        filePath: 'bar.tex'
      }, {
        type: 'info',
        filePath: 'foo.tex'
      }];
      spyOn(manager, 'addMarker');

      manager.addMarkers(messages, false);

      expect(manager.addMarker).toHaveBeenCalledWith('error', 'foo.tex', [[0, 0], [0, 1]]);
      expect(manager.addMarker.calls.length).toEqual(1);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL21hcmtlci1tYW5hZ2VyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzsyQkFFb0IsZ0JBQWdCOzs7O2dDQUNWLHVCQUF1Qjs7OztBQUVqRCxRQUFRLENBQUMsZUFBZSxFQUFFLFlBQU07QUFDOUIsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyx5QkFBUSxnQkFBZ0IsRUFBRSxDQUFBO0tBQ2xDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsWUFBWSxFQUFFLFlBQU07QUFDM0IsTUFBRSxDQUFDLG1GQUFtRixFQUFFLFlBQU07QUFDNUYsVUFBTSxNQUFNLEdBQUc7QUFDYixlQUFPLEVBQUU7aUJBQU0sU0FBUztTQUFBO0FBQ3hCLG9CQUFZLEVBQUUsd0JBQU07QUFBRSxpQkFBTyxFQUFFLE9BQU8sRUFBRTtxQkFBTSxJQUFJO2FBQUEsRUFBRSxDQUFBO1NBQUU7T0FDdkQsQ0FBQTtBQUNELFVBQU0sT0FBTyxHQUFHLGtDQUFrQixNQUFNLENBQUMsQ0FBQTtBQUN6QyxVQUFNLFFBQVEsR0FBRyxDQUFDO0FBQ2hCLFlBQUksRUFBRSxPQUFPO0FBQ2IsYUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkIsZ0JBQVEsRUFBRSxTQUFTO09BQ3BCLEVBQUU7QUFDRCxZQUFJLEVBQUUsU0FBUztBQUNmLGFBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLGdCQUFRLEVBQUUsU0FBUztPQUNwQixFQUFFO0FBQ0QsWUFBSSxFQUFFLE1BQU07QUFDWixnQkFBUSxFQUFFLFNBQVM7T0FDcEIsQ0FBQyxDQUFBO0FBQ0YsV0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTs7QUFFM0IsYUFBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRW5DLFlBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwRixZQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2xELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9tYXJrZXItbWFuYWdlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgaGVscGVycyBmcm9tICcuL3NwZWMtaGVscGVycydcbmltcG9ydCBNYXJrZXJNYW5hZ2VyIGZyb20gJy4uL2xpYi9tYXJrZXItbWFuYWdlcidcblxuZGVzY3JpYmUoJ01hcmtlck1hbmFnZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gaGVscGVycy5hY3RpdmF0ZVBhY2thZ2VzKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdhZGRNYXJrZXJzJywgKCkgPT4ge1xuICAgIGl0KCd2ZXJpZmllcyB0aGF0IG9ubHkgbWVzc2FnZXMgdGhhdCBoYXZlIGEgcmFuZ2UgYW5kIGEgbWF0Y2hpbmcgZmlsZSBwYXRoIGFyZSBtYXJrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlZGl0b3IgPSB7XG4gICAgICAgIGdldFBhdGg6ICgpID0+ICdmb28udGV4JyxcbiAgICAgICAgb25EaWREZXN0cm95OiAoKSA9PiB7IHJldHVybiB7IGRpc3Bvc2U6ICgpID0+IG51bGwgfSB9XG4gICAgICB9XG4gICAgICBjb25zdCBtYW5hZ2VyID0gbmV3IE1hcmtlck1hbmFnZXIoZWRpdG9yKVxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBbe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICByYW5nZTogW1swLCAwXSwgWzAsIDFdXSxcbiAgICAgICAgZmlsZVBhdGg6ICdmb28udGV4J1xuICAgICAgfSwge1xuICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgIHJhbmdlOiBbWzAsIDBdLCBbMCwgMV1dLFxuICAgICAgICBmaWxlUGF0aDogJ2Jhci50ZXgnXG4gICAgICB9LCB7XG4gICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgZmlsZVBhdGg6ICdmb28udGV4J1xuICAgICAgfV1cbiAgICAgIHNweU9uKG1hbmFnZXIsICdhZGRNYXJrZXInKVxuXG4gICAgICBtYW5hZ2VyLmFkZE1hcmtlcnMobWVzc2FnZXMsIGZhbHNlKVxuXG4gICAgICBleHBlY3QobWFuYWdlci5hZGRNYXJrZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdlcnJvcicsICdmb28udGV4JywgW1swLCAwXSwgWzAsIDFdXSlcbiAgICAgIGV4cGVjdChtYW5hZ2VyLmFkZE1hcmtlci5jYWxscy5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==