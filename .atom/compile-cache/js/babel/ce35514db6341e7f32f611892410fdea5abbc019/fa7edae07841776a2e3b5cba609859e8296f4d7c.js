function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _libLoggersDefaultLogger = require('../../lib/loggers/default-logger');

var _libLoggersDefaultLogger2 = _interopRequireDefault(_libLoggersDefaultLogger);

var _libWerkzeug = require('../../lib/werkzeug');

var _libWerkzeug2 = _interopRequireDefault(_libWerkzeug);

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

describe('DefaultLogger', function () {
  var logger = undefined;

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });
    logger = new _libLoggersDefaultLogger2['default']();
  });

  describe('showErrorMarkersInEditor', function () {
    it('verifies that only messages that have a range and a matching file path are marked', function () {
      var editor = { getPath: function getPath() {
          return 'foo.tex';
        } };
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
      spyOn(logger, 'addErrorMarker');

      logger.showErrorMarkersInEditor(editor, messages);

      expect(logger.addErrorMarker).toHaveBeenCalled();
    });
  });

  describe('sync', function () {
    it('silently does nothing when the current editor is transient', function () {
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: null });
      spyOn(logger, 'show');
      spyOn(logger.logPanel, 'update');

      logger.sync();

      expect(logger.show).not.toHaveBeenCalled();
      expect(logger.logPanel.update).not.toHaveBeenCalled();
    });

    it('shows and updates the log panel with the file path and position', function () {
      var filePath = 'file.tex';
      var position = [[0, 0], [0, 10]];
      spyOn(_libWerkzeug2['default'], 'getEditorDetails').andReturn({ filePath: filePath, position: position });
      spyOn(logger, 'show');
      spyOn(logger.logPanel, 'update');

      logger.sync();

      expect(logger.show).toHaveBeenCalled();
      expect(logger.logPanel.update).toHaveBeenCalledWith({ filePath: filePath, position: position });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2xvZ2dlcnMvZGVmYXVsdC1sb2dnZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3VDQUUwQixrQ0FBa0M7Ozs7MkJBQ3ZDLG9CQUFvQjs7OzsyQkFDckIsaUJBQWlCOzs7O0FBRXJDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFJLE1BQU0sWUFBQSxDQUFBOztBQUVWLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8seUJBQVEsZ0JBQWdCLEVBQUUsQ0FBQTtLQUNsQyxDQUFDLENBQUE7QUFDRixVQUFNLEdBQUcsMENBQW1CLENBQUE7R0FDN0IsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQywwQkFBMEIsRUFBRSxZQUFNO0FBQ3pDLE1BQUUsQ0FBQyxtRkFBbUYsRUFBRSxZQUFNO0FBQzVGLFVBQU0sTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFO2lCQUFNLFNBQVM7U0FBQSxFQUFFLENBQUE7QUFDM0MsVUFBTSxRQUFRLEdBQUcsQ0FBQztBQUNoQixZQUFJLEVBQUUsT0FBTztBQUNiLGFBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLGdCQUFRLEVBQUUsU0FBUztPQUNwQixFQUFFO0FBQ0QsWUFBSSxFQUFFLFNBQVM7QUFDZixhQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QixnQkFBUSxFQUFFLFNBQVM7T0FDcEIsRUFBRTtBQUNELFlBQUksRUFBRSxNQUFNO0FBQ1osZ0JBQVEsRUFBRSxTQUFTO09BQ3BCLENBQUMsQ0FBQTtBQUNGLFdBQUssQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFL0IsWUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFakQsWUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0tBQ2pELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDckIsTUFBRSxDQUFDLDREQUE0RCxFQUFFLFlBQU07QUFDckUsV0FBSywyQkFBVyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2pFLFdBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDckIsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7O0FBRWhDLFlBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTs7QUFFYixZQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0FBQzFDLFlBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0tBQ3RELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxVQUFNLFFBQVEsR0FBRyxVQUFVLENBQUE7QUFDM0IsVUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2xDLFdBQUssMkJBQVcsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0FBQ3JFLFdBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDckIsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7O0FBRWhDLFlBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTs7QUFFYixZQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7QUFDdEMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQzVFLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9sb2dnZXJzL2RlZmF1bHQtbG9nZ2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBEZWZhdWx0TG9nZ2VyIGZyb20gJy4uLy4uL2xpYi9sb2dnZXJzL2RlZmF1bHQtbG9nZ2VyJ1xuaW1wb3J0IHdlcmt6ZXVnIGZyb20gJy4uLy4uL2xpYi93ZXJremV1ZydcbmltcG9ydCBoZWxwZXJzIGZyb20gJy4uL3NwZWMtaGVscGVycydcblxuZGVzY3JpYmUoJ0RlZmF1bHRMb2dnZXInLCAoKSA9PiB7XG4gIGxldCBsb2dnZXJcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGhlbHBlcnMuYWN0aXZhdGVQYWNrYWdlcygpXG4gICAgfSlcbiAgICBsb2dnZXIgPSBuZXcgRGVmYXVsdExvZ2dlcigpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3Nob3dFcnJvck1hcmtlcnNJbkVkaXRvcicsICgpID0+IHtcbiAgICBpdCgndmVyaWZpZXMgdGhhdCBvbmx5IG1lc3NhZ2VzIHRoYXQgaGF2ZSBhIHJhbmdlIGFuZCBhIG1hdGNoaW5nIGZpbGUgcGF0aCBhcmUgbWFya2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yID0geyBnZXRQYXRoOiAoKSA9PiAnZm9vLnRleCcgfVxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBbe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICByYW5nZTogW1swLCAwXSwgWzAsIDFdXSxcbiAgICAgICAgZmlsZVBhdGg6ICdmb28udGV4J1xuICAgICAgfSwge1xuICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgIHJhbmdlOiBbWzAsIDBdLCBbMCwgMV1dLFxuICAgICAgICBmaWxlUGF0aDogJ2Jhci50ZXgnXG4gICAgICB9LCB7XG4gICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgZmlsZVBhdGg6ICdmb28udGV4J1xuICAgICAgfV1cbiAgICAgIHNweU9uKGxvZ2dlciwgJ2FkZEVycm9yTWFya2VyJylcblxuICAgICAgbG9nZ2VyLnNob3dFcnJvck1hcmtlcnNJbkVkaXRvcihlZGl0b3IsIG1lc3NhZ2VzKVxuXG4gICAgICBleHBlY3QobG9nZ2VyLmFkZEVycm9yTWFya2VyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdzeW5jJywgKCkgPT4ge1xuICAgIGl0KCdzaWxlbnRseSBkb2VzIG5vdGhpbmcgd2hlbiB0aGUgY3VycmVudCBlZGl0b3IgaXMgdHJhbnNpZW50JywgKCkgPT4ge1xuICAgICAgc3B5T24od2Vya3pldWcsICdnZXRFZGl0b3JEZXRhaWxzJykuYW5kUmV0dXJuKHsgZmlsZVBhdGg6IG51bGwgfSlcbiAgICAgIHNweU9uKGxvZ2dlciwgJ3Nob3cnKVxuICAgICAgc3B5T24obG9nZ2VyLmxvZ1BhbmVsLCAndXBkYXRlJylcblxuICAgICAgbG9nZ2VyLnN5bmMoKVxuXG4gICAgICBleHBlY3QobG9nZ2VyLnNob3cpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChsb2dnZXIubG9nUGFuZWwudXBkYXRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG93cyBhbmQgdXBkYXRlcyB0aGUgbG9nIHBhbmVsIHdpdGggdGhlIGZpbGUgcGF0aCBhbmQgcG9zaXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9ICdmaWxlLnRleCdcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gW1swLCAwXSwgWzAsIDEwXV1cbiAgICAgIHNweU9uKHdlcmt6ZXVnLCAnZ2V0RWRpdG9yRGV0YWlscycpLmFuZFJldHVybih7IGZpbGVQYXRoLCBwb3NpdGlvbiB9KVxuICAgICAgc3B5T24obG9nZ2VyLCAnc2hvdycpXG4gICAgICBzcHlPbihsb2dnZXIubG9nUGFuZWwsICd1cGRhdGUnKVxuXG4gICAgICBsb2dnZXIuc3luYygpXG5cbiAgICAgIGV4cGVjdChsb2dnZXIuc2hvdykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobG9nZ2VyLmxvZ1BhbmVsLnVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBmaWxlUGF0aCwgcG9zaXRpb24gfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==