function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('./spec-helpers');

var _libLogger = require('../lib/logger');

var _libLogger2 = _interopRequireDefault(_libLogger);

describe('Logger', function () {
  var logger = undefined,
      counts = undefined;

  beforeEach(function () {
    logger = new _libLogger2['default']();
  });

  describe('showMessage', function () {
    it('verifies that calling directly without preceding call to group automatically calls groupEnd', function () {
      spyOn(logger, 'groupEnd').andReturn();
      logger.showMessage({ type: 'error' });

      expect(logger.groupEnd).toHaveBeenCalled();
    });
  });

  describe('showFilteredMessages', function () {
    beforeEach(function () {
      spyOn(logger, 'showMessages').andCallFake(function (label, messages) {
        counts = _lodash2['default'].countBy(messages, 'type');
      });
      logger.group('foo');
      logger.info();
      logger.warning();
      logger.error();
    });

    it('verifies no messages filtered when logging level set to info', function () {
      atom.config.set('latex.loggingLevel', 'info');
      logger.groupEnd();

      expect(counts.error).toBeDefined();
      expect(counts.warning).toBeDefined();
      expect(counts.info).toBe(1);
    });

    it('verifies info messages filtered when logging level set to warning', function () {
      atom.config.set('latex.loggingLevel', 'warning');
      logger.groupEnd();

      expect(counts.error).toBeDefined();
      expect(counts.warning).toBeDefined();
      expect(counts.info).toBeUndefined();
    });

    it('verifies warning and info messages filtered when logging level set to error', function () {
      atom.config.set('latex.loggingLevel', 'error');
      logger.groupEnd();

      expect(counts.error).toBeDefined();
      expect(counts.warning).toBeUndefined();
      expect(counts.info).toBeUndefined();
    });
  });

  describe('getMostSevereType', function () {
    it('allows errors to override warnings and info messages', function () {
      var mostSevereType = _libLogger2['default'].getMostSevereType([{ type: 'info' }, { type: 'warning' }, { type: 'error' }]);
      expect(mostSevereType).toBe('error');
    });

    it('allows warnings to override info messages', function () {
      var mostSevereType = _libLogger2['default'].getMostSevereType([{ type: 'info' }, { type: 'warning' }]);
      expect(mostSevereType).toBe('warning');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2xvZ2dlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7c0JBRWMsUUFBUTs7OztRQUNmLGdCQUFnQjs7eUJBQ0osZUFBZTs7OztBQUVsQyxRQUFRLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdkIsTUFBSSxNQUFNLFlBQUE7TUFBRSxNQUFNLFlBQUEsQ0FBQTs7QUFFbEIsWUFBVSxDQUFDLFlBQU07QUFDZixVQUFNLEdBQUcsNEJBQVksQ0FBQTtHQUN0QixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFNO0FBQzVCLE1BQUUsQ0FBQyw2RkFBNkYsRUFBRSxZQUFNO0FBQ3RHLFdBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDckMsWUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBOztBQUVyQyxZQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDM0MsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxzQkFBc0IsRUFBRSxZQUFNO0FBQ3JDLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsV0FBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFLO0FBQzdELGNBQU0sR0FBRyxvQkFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ3JDLENBQUMsQ0FBQTtBQUNGLFlBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbkIsWUFBTSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2IsWUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2hCLFlBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsOERBQThELEVBQUUsWUFBTTtBQUN2RSxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUM3QyxZQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7O0FBRWpCLFlBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNwQyxZQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUM1QixDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLG1FQUFtRSxFQUFFLFlBQU07QUFDNUUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDaEQsWUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBOztBQUVqQixZQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDcEMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUNwQyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDZFQUE2RSxFQUFFLFlBQU07QUFDdEYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDOUMsWUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBOztBQUVqQixZQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDdEMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUNwQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQU07QUFDbEMsTUFBRSxDQUFDLHNEQUFzRCxFQUFFLFlBQU07QUFDL0QsVUFBTSxjQUFjLEdBQUcsdUJBQU8saUJBQWlCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0csWUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNyQyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDJDQUEyQyxFQUFFLFlBQU07QUFDcEQsVUFBTSxjQUFjLEdBQUcsdUJBQU8saUJBQWlCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEYsWUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUN2QyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvbG9nZ2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCAnLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2xpYi9sb2dnZXInXG5cbmRlc2NyaWJlKCdMb2dnZXInLCAoKSA9PiB7XG4gIGxldCBsb2dnZXIsIGNvdW50c1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdzaG93TWVzc2FnZScsICgpID0+IHtcbiAgICBpdCgndmVyaWZpZXMgdGhhdCBjYWxsaW5nIGRpcmVjdGx5IHdpdGhvdXQgcHJlY2VkaW5nIGNhbGwgdG8gZ3JvdXAgYXV0b21hdGljYWxseSBjYWxscyBncm91cEVuZCcsICgpID0+IHtcbiAgICAgIHNweU9uKGxvZ2dlciwgJ2dyb3VwRW5kJykuYW5kUmV0dXJuKClcbiAgICAgIGxvZ2dlci5zaG93TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicgfSlcblxuICAgICAgZXhwZWN0KGxvZ2dlci5ncm91cEVuZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2hvd0ZpbHRlcmVkTWVzc2FnZXMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzcHlPbihsb2dnZXIsICdzaG93TWVzc2FnZXMnKS5hbmRDYWxsRmFrZSgobGFiZWwsIG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgIGNvdW50cyA9IF8uY291bnRCeShtZXNzYWdlcywgJ3R5cGUnKVxuICAgICAgfSlcbiAgICAgIGxvZ2dlci5ncm91cCgnZm9vJylcbiAgICAgIGxvZ2dlci5pbmZvKClcbiAgICAgIGxvZ2dlci53YXJuaW5nKClcbiAgICAgIGxvZ2dlci5lcnJvcigpXG4gICAgfSlcblxuICAgIGl0KCd2ZXJpZmllcyBubyBtZXNzYWdlcyBmaWx0ZXJlZCB3aGVuIGxvZ2dpbmcgbGV2ZWwgc2V0IHRvIGluZm8nLCAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xhdGV4LmxvZ2dpbmdMZXZlbCcsICdpbmZvJylcbiAgICAgIGxvZ2dlci5ncm91cEVuZCgpXG5cbiAgICAgIGV4cGVjdChjb3VudHMuZXJyb3IpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChjb3VudHMud2FybmluZykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGNvdW50cy5pbmZvKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCd2ZXJpZmllcyBpbmZvIG1lc3NhZ2VzIGZpbHRlcmVkIHdoZW4gbG9nZ2luZyBsZXZlbCBzZXQgdG8gd2FybmluZycsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgubG9nZ2luZ0xldmVsJywgJ3dhcm5pbmcnKVxuICAgICAgbG9nZ2VyLmdyb3VwRW5kKClcblxuICAgICAgZXhwZWN0KGNvdW50cy5lcnJvcikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGNvdW50cy53YXJuaW5nKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoY291bnRzLmluZm8pLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgd2FybmluZyBhbmQgaW5mbyBtZXNzYWdlcyBmaWx0ZXJlZCB3aGVuIGxvZ2dpbmcgbGV2ZWwgc2V0IHRvIGVycm9yJywgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5sb2dnaW5nTGV2ZWwnLCAnZXJyb3InKVxuICAgICAgbG9nZ2VyLmdyb3VwRW5kKClcblxuICAgICAgZXhwZWN0KGNvdW50cy5lcnJvcikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGNvdW50cy53YXJuaW5nKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChjb3VudHMuaW5mbykudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0TW9zdFNldmVyZVR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ2FsbG93cyBlcnJvcnMgdG8gb3ZlcnJpZGUgd2FybmluZ3MgYW5kIGluZm8gbWVzc2FnZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb3N0U2V2ZXJlVHlwZSA9IExvZ2dlci5nZXRNb3N0U2V2ZXJlVHlwZShbeyB0eXBlOiAnaW5mbycgfSwgeyB0eXBlOiAnd2FybmluZycgfSwgeyB0eXBlOiAnZXJyb3InIH1dKVxuICAgICAgZXhwZWN0KG1vc3RTZXZlcmVUeXBlKS50b0JlKCdlcnJvcicpXG4gICAgfSlcblxuICAgIGl0KCdhbGxvd3Mgd2FybmluZ3MgdG8gb3ZlcnJpZGUgaW5mbyBtZXNzYWdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vc3RTZXZlcmVUeXBlID0gTG9nZ2VyLmdldE1vc3RTZXZlcmVUeXBlKFt7IHR5cGU6ICdpbmZvJyB9LCB7IHR5cGU6ICd3YXJuaW5nJyB9XSlcbiAgICAgIGV4cGVjdChtb3N0U2V2ZXJlVHlwZSkudG9CZSgnd2FybmluZycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=