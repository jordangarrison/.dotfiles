function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _stubs = require('./stubs');

var _libBuilderRegistry = require('../lib/builder-registry');

var _libBuilderRegistry2 = _interopRequireDefault(_libBuilderRegistry);

var _libBuildState = require('../lib/build-state');

var _libBuildState2 = _interopRequireDefault(_libBuildState);

describe('BuilderRegistry', function () {
  var builderRegistry = undefined;

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].activatePackages();
    });

    atom.config.set('latex.builder', 'latexmk');
    builderRegistry = new _libBuilderRegistry2['default']();
  });

  describe('getBuilderImplementation', function () {
    it('returns null when no builders are associated with the given file', function () {
      var state = new _libBuildState2['default']('quux.txt');
      expect(builderRegistry.getBuilderImplementation(state)).toBeNull();
    });

    it('returns the configured builder when given a regular .tex file', function () {
      var state = new _libBuildState2['default']('foo.tex');
      expect(builderRegistry.getBuilderImplementation(state).name).toEqual('LatexmkBuilder');
    });

    it('throws an error when unable to resolve ambiguous builder registration', function () {
      var allBuilders = builderRegistry.getAllBuilders().push(_stubs.NullBuilder);
      var state = new _libBuildState2['default']('foo.tex');
      spyOn(builderRegistry, 'getAllBuilders').andReturn(allBuilders);
      expect(function () {
        builderRegistry.getBuilderImplementation(state);
      }).toThrow();
    });

    it('returns the Knitr builder when presented with an .Rnw file', function () {
      var state = new _libBuildState2['default']('bar.Rnw');
      expect(builderRegistry.getBuilderImplementation(state).name).toEqual('KnitrBuilder');
    });
  });

  describe('getBuilder', function () {
    beforeEach(function () {
      atom.config.set('latex.builder', 'latexmk');
    });

    it('returns null when passed an unhandled file type', function () {
      var state = new _libBuildState2['default']('quux.txt');
      expect(builderRegistry.getBuilder(state)).toBeNull();
    });

    it('returns a builder instance as configured for regular .tex files', function () {
      var state = new _libBuildState2['default']('foo.tex');
      expect(builderRegistry.getBuilder(state).constructor.name).toEqual('LatexmkBuilder');
    });

    it('returns a builder instance as configured for knitr files', function () {
      var state = new _libBuildState2['default']('bar.Rnw');
      expect(builderRegistry.getBuilder(state).constructor.name).toEqual('KnitrBuilder');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkLXJlZ2lzdHJ5LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzsyQkFFb0IsZ0JBQWdCOzs7O3FCQUNSLFNBQVM7O2tDQUNULHlCQUF5Qjs7Ozs2QkFDOUIsb0JBQW9COzs7O0FBRTNDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ2hDLE1BQUksZUFBZSxZQUFBLENBQUE7O0FBRW5CLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQzthQUFNLHlCQUFRLGdCQUFnQixFQUFFO0tBQUEsQ0FBQyxDQUFBOztBQUVqRCxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDM0MsbUJBQWUsR0FBRyxxQ0FBcUIsQ0FBQTtHQUN4QyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLDBCQUEwQixFQUFFLFlBQU07QUFDekMsTUFBRSxDQUFDLGtFQUFrRSxFQUFFLFlBQU07QUFDM0UsVUFBTSxLQUFLLEdBQUcsK0JBQWUsVUFBVSxDQUFDLENBQUE7QUFDeEMsWUFBTSxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO0tBQ25FLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsK0RBQStELEVBQUUsWUFBTTtBQUN4RSxVQUFNLEtBQUssR0FBRywrQkFBZSxTQUFTLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsZUFBZSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0tBQ3ZGLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsdUVBQXVFLEVBQUUsWUFBTTtBQUNoRixVQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxvQkFBYSxDQUFBO0FBQ3RFLFVBQU0sS0FBSyxHQUFHLCtCQUFlLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZDLFdBQUssQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDL0QsWUFBTSxDQUFDLFlBQU07QUFBRSx1QkFBZSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFBO09BQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzVFLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsNERBQTRELEVBQUUsWUFBTTtBQUNyRSxVQUFNLEtBQUssR0FBRywrQkFBZSxTQUFTLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsZUFBZSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtLQUNyRixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQzNCLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQzVDLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsaURBQWlELEVBQUUsWUFBTTtBQUMxRCxVQUFNLEtBQUssR0FBRywrQkFBZSxVQUFVLENBQUMsQ0FBQTtBQUN4QyxZQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO0tBQ3JELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxVQUFNLEtBQUssR0FBRywrQkFBZSxTQUFTLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7S0FDckYsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywwREFBMEQsRUFBRSxZQUFNO0FBQ25FLFVBQU0sS0FBSyxHQUFHLCtCQUFlLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZDLFlBQU0sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7S0FDbkYsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkLXJlZ2lzdHJ5LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBoZWxwZXJzIGZyb20gJy4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IHsgTnVsbEJ1aWxkZXIgfSBmcm9tICcuL3N0dWJzJ1xuaW1wb3J0IEJ1aWxkZXJSZWdpc3RyeSBmcm9tICcuLi9saWIvYnVpbGRlci1yZWdpc3RyeSdcbmltcG9ydCBCdWlsZFN0YXRlIGZyb20gJy4uL2xpYi9idWlsZC1zdGF0ZSdcblxuZGVzY3JpYmUoJ0J1aWxkZXJSZWdpc3RyeScsICgpID0+IHtcbiAgbGV0IGJ1aWxkZXJSZWdpc3RyeVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLmFjdGl2YXRlUGFja2FnZXMoKSlcblxuICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguYnVpbGRlcicsICdsYXRleG1rJylcbiAgICBidWlsZGVyUmVnaXN0cnkgPSBuZXcgQnVpbGRlclJlZ2lzdHJ5KClcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0QnVpbGRlckltcGxlbWVudGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIG51bGwgd2hlbiBubyBidWlsZGVycyBhcmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgncXV1eC50eHQnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXJSZWdpc3RyeS5nZXRCdWlsZGVySW1wbGVtZW50YXRpb24oc3RhdGUpKS50b0JlTnVsbCgpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRoZSBjb25maWd1cmVkIGJ1aWxkZXIgd2hlbiBnaXZlbiBhIHJlZ3VsYXIgLnRleCBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgnZm9vLnRleCcpXG4gICAgICBleHBlY3QoYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXJJbXBsZW1lbnRhdGlvbihzdGF0ZSkubmFtZSkudG9FcXVhbCgnTGF0ZXhta0J1aWxkZXInKVxuICAgIH0pXG5cbiAgICBpdCgndGhyb3dzIGFuIGVycm9yIHdoZW4gdW5hYmxlIHRvIHJlc29sdmUgYW1iaWd1b3VzIGJ1aWxkZXIgcmVnaXN0cmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWxsQnVpbGRlcnMgPSBidWlsZGVyUmVnaXN0cnkuZ2V0QWxsQnVpbGRlcnMoKS5wdXNoKE51bGxCdWlsZGVyKVxuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgnZm9vLnRleCcpXG4gICAgICBzcHlPbihidWlsZGVyUmVnaXN0cnksICdnZXRBbGxCdWlsZGVycycpLmFuZFJldHVybihhbGxCdWlsZGVycylcbiAgICAgIGV4cGVjdCgoKSA9PiB7IGJ1aWxkZXJSZWdpc3RyeS5nZXRCdWlsZGVySW1wbGVtZW50YXRpb24oc3RhdGUpIH0pLnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0aGUgS25pdHIgYnVpbGRlciB3aGVuIHByZXNlbnRlZCB3aXRoIGFuIC5SbncgZmlsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gbmV3IEJ1aWxkU3RhdGUoJ2Jhci5SbncnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXJSZWdpc3RyeS5nZXRCdWlsZGVySW1wbGVtZW50YXRpb24oc3RhdGUpLm5hbWUpLnRvRXF1YWwoJ0tuaXRyQnVpbGRlcicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0QnVpbGRlcicsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguYnVpbGRlcicsICdsYXRleG1rJylcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgbnVsbCB3aGVuIHBhc3NlZCBhbiB1bmhhbmRsZWQgZmlsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgncXV1eC50eHQnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXJSZWdpc3RyeS5nZXRCdWlsZGVyKHN0YXRlKSkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBhIGJ1aWxkZXIgaW5zdGFuY2UgYXMgY29uZmlndXJlZCBmb3IgcmVndWxhciAudGV4IGZpbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgnZm9vLnRleCcpXG4gICAgICBleHBlY3QoYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXIoc3RhdGUpLmNvbnN0cnVjdG9yLm5hbWUpLnRvRXF1YWwoJ0xhdGV4bWtCdWlsZGVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgYSBidWlsZGVyIGluc3RhbmNlIGFzIGNvbmZpZ3VyZWQgZm9yIGtuaXRyIGZpbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgQnVpbGRTdGF0ZSgnYmFyLlJudycpXG4gICAgICBleHBlY3QoYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXIoc3RhdGUpLmNvbnN0cnVjdG9yLm5hbWUpLnRvRXF1YWwoJ0tuaXRyQnVpbGRlcicpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=