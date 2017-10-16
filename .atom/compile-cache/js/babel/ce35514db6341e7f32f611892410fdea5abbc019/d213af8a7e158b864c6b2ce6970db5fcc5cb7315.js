function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

describe('The Ispell provider for Atom Linter', function () {
  var lint = require('../lib/providers').provideLinter().lint;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('linter-spell');
    });
  });

  it('finds a spelling in "foo.txt"', function () {
    waitsForPromise(function () {
      return atom.workspace.open(path.join(__dirname, 'files', 'foo.txt')).then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(_.some(messages, function (message) {
            return message.excerpt.match(/^armour( ->|$)/);
          })).toBe(true);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvc3BlYy9tYWluLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7c0JBRW1CLFFBQVE7O0lBQWYsQ0FBQzs7b0JBQ1MsTUFBTTs7SUFBaEIsSUFBSTs7QUFIaEIsV0FBVyxDQUFBOztBQUtYLFFBQVEsQ0FBQyxxQ0FBcUMsRUFBRSxZQUFNO0FBQ3BELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQTs7QUFFN0QsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtLQUNyRCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDeEMsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2xGLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNuQyxnQkFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsT0FBTyxFQUFLO0FBQUUsbUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtXQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNyRyxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9zcGVjL21haW4tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuXG5kZXNjcmliZSgnVGhlIElzcGVsbCBwcm92aWRlciBmb3IgQXRvbSBMaW50ZXInLCAoKSA9PiB7XG4gIGNvbnN0IGxpbnQgPSByZXF1aXJlKCcuLi9saWIvcHJvdmlkZXJzJykucHJvdmlkZUxpbnRlcigpLmxpbnRcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItc3BlbGwnKVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ2ZpbmRzIGEgc3BlbGxpbmcgaW4gXCJmb28udHh0XCInLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbihfX2Rpcm5hbWUsICdmaWxlcycsICdmb28udHh0JykpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICBleHBlY3QoXy5zb21lKG1lc3NhZ2VzLCAobWVzc2FnZSkgPT4geyByZXR1cm4gbWVzc2FnZS5leGNlcnB0Lm1hdGNoKC9eYXJtb3VyKCAtPnwkKS8pIH0pKS50b0JlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19