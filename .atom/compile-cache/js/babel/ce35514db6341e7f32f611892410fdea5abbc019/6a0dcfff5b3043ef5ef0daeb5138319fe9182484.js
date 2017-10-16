function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

describe('Latex', function () {
  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });
  });

  describe('initialize', function () {
    it('initializes all properties', function () {
      expect(latex.log).toBeDefined();
      expect(latex.opener).toBeDefined();
      expect(latex.process).toBeDefined();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2xhdGV4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzsyQkFFb0IsZ0JBQWdCOzs7O0FBRXBDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUN0QixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLHlCQUFRLGdCQUFnQixFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTtBQUMzQixNQUFFLENBQUMsNEJBQTRCLEVBQUUsWUFBTTtBQUNyQyxZQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQy9CLFlBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEMsWUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUNwQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvbGF0ZXgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcGVjLWhlbHBlcnMnXG5cbmRlc2NyaWJlKCdMYXRleCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBoZWxwZXJzLmFjdGl2YXRlUGFja2FnZXMoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2luaXRpYWxpemUnLCAoKSA9PiB7XG4gICAgaXQoJ2luaXRpYWxpemVzIGFsbCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxhdGV4LmxvZykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGxhdGV4Lm9wZW5lcikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGxhdGV4LnByb2Nlc3MpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==