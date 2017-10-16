function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libProcessManager = require('../lib/process-manager');

var _libProcessManager2 = _interopRequireDefault(_libProcessManager);

describe('ProcessManager', function () {
  var processManager = undefined;

  function constructCommand(fileName) {
    var tempPath = _fsPlus2['default'].realpathSync(_temp2['default'].mkdirSync('latex'));
    var filePath = _path2['default'].join(tempPath, fileName);
    return 'latexmk -cd -f -pdf "' + filePath + '"';
  }

  beforeEach(function () {
    processManager = new _libProcessManager2['default']();
  });

  describe('ProcessManager', function () {
    it('kills latexmk when given non-existant file', function () {
      var killed = false;

      processManager.executeChildProcess(constructCommand('foo.tex'), { allowKill: true }).then(function (result) {
        killed = true;
      });
      processManager.killChildProcesses();

      waitsFor(function () {
        return killed;
      }, 5000);
    });

    it('kills old latexmk instances, but not ones created after the kill command', function () {
      var oldKilled = false;
      var newKilled = false;

      processManager.executeChildProcess(constructCommand('old.tex'), { allowKill: true }).then(function (result) {
        oldKilled = true;
      });
      processManager.killChildProcesses();
      processManager.executeChildProcess(constructCommand('new.tex'), { allowKill: true }).then(function (result) {
        newKilled = true;
      });

      waitsFor(function () {
        return oldKilled;
      }, 5000);

      runs(function () {
        expect(newKilled).toBe(false);
        processManager.killChildProcesses();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3Byb2Nlc3MtbWFuYWdlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O29CQUNOLE1BQU07Ozs7aUNBQ0ksd0JBQXdCOzs7O0FBRW5ELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUksY0FBYyxZQUFBLENBQUE7O0FBRWxCLFdBQVMsZ0JBQWdCLENBQUUsUUFBUSxFQUFFO0FBQ25DLFFBQU0sUUFBUSxHQUFHLG9CQUFHLFlBQVksQ0FBQyxrQkFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUN6RCxRQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzlDLHFDQUErQixRQUFRLE9BQUc7R0FDM0M7O0FBRUQsWUFBVSxDQUFDLFlBQU07QUFDZixrQkFBYyxHQUFHLG9DQUFvQixDQUFBO0dBQ3RDLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBTTtBQUMvQixNQUFFLENBQUMsNENBQTRDLEVBQUUsWUFBTTtBQUNyRCxVQUFJLE1BQU0sR0FBRyxLQUFLLENBQUE7O0FBRWxCLG9CQUFjLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFBRSxjQUFNLEdBQUcsSUFBSSxDQUFBO09BQUUsQ0FBQyxDQUFBO0FBQ3RILG9CQUFjLENBQUMsa0JBQWtCLEVBQUUsQ0FBQTs7QUFFbkMsY0FBUSxDQUFDO2VBQU0sTUFBTTtPQUFBLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDN0IsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywwRUFBMEUsRUFBRSxZQUFNO0FBQ25GLFVBQUksU0FBUyxHQUFHLEtBQUssQ0FBQTtBQUNyQixVQUFJLFNBQVMsR0FBRyxLQUFLLENBQUE7O0FBRXJCLG9CQUFjLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFBRSxpQkFBUyxHQUFHLElBQUksQ0FBQTtPQUFFLENBQUMsQ0FBQTtBQUN6SCxvQkFBYyxDQUFDLGtCQUFrQixFQUFFLENBQUE7QUFDbkMsb0JBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUFFLGlCQUFTLEdBQUcsSUFBSSxDQUFBO09BQUUsQ0FBQyxDQUFBOztBQUV6SCxjQUFRLENBQUM7ZUFBTSxTQUFTO09BQUEsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFL0IsVUFBSSxDQUFDLFlBQU07QUFDVCxjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzdCLHNCQUFjLENBQUMsa0JBQWtCLEVBQUUsQ0FBQTtPQUNwQyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvcHJvY2Vzcy1tYW5hZ2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHRlbXAgZnJvbSAndGVtcCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUHJvY2Vzc01hbmFnZXIgZnJvbSAnLi4vbGliL3Byb2Nlc3MtbWFuYWdlcidcblxuZGVzY3JpYmUoJ1Byb2Nlc3NNYW5hZ2VyJywgKCkgPT4ge1xuICBsZXQgcHJvY2Vzc01hbmFnZXJcblxuICBmdW5jdGlvbiBjb25zdHJ1Y3RDb21tYW5kIChmaWxlTmFtZSkge1xuICAgIGNvbnN0IHRlbXBQYXRoID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKCdsYXRleCcpKVxuICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHRlbXBQYXRoLCBmaWxlTmFtZSlcbiAgICByZXR1cm4gYGxhdGV4bWsgLWNkIC1mIC1wZGYgXCIke2ZpbGVQYXRofVwiYFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgcHJvY2Vzc01hbmFnZXIgPSBuZXcgUHJvY2Vzc01hbmFnZXIoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9jZXNzTWFuYWdlcicsICgpID0+IHtcbiAgICBpdCgna2lsbHMgbGF0ZXhtayB3aGVuIGdpdmVuIG5vbi1leGlzdGFudCBmaWxlJywgKCkgPT4ge1xuICAgICAgbGV0IGtpbGxlZCA9IGZhbHNlXG5cbiAgICAgIHByb2Nlc3NNYW5hZ2VyLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29uc3RydWN0Q29tbWFuZCgnZm9vLnRleCcpLCB7IGFsbG93S2lsbDogdHJ1ZSB9KS50aGVuKHJlc3VsdCA9PiB7IGtpbGxlZCA9IHRydWUgfSlcbiAgICAgIHByb2Nlc3NNYW5hZ2VyLmtpbGxDaGlsZFByb2Nlc3NlcygpXG5cbiAgICAgIHdhaXRzRm9yKCgpID0+IGtpbGxlZCwgNTAwMClcbiAgICB9KVxuXG4gICAgaXQoJ2tpbGxzIG9sZCBsYXRleG1rIGluc3RhbmNlcywgYnV0IG5vdCBvbmVzIGNyZWF0ZWQgYWZ0ZXIgdGhlIGtpbGwgY29tbWFuZCcsICgpID0+IHtcbiAgICAgIGxldCBvbGRLaWxsZWQgPSBmYWxzZVxuICAgICAgbGV0IG5ld0tpbGxlZCA9IGZhbHNlXG5cbiAgICAgIHByb2Nlc3NNYW5hZ2VyLmV4ZWN1dGVDaGlsZFByb2Nlc3MoY29uc3RydWN0Q29tbWFuZCgnb2xkLnRleCcpLCB7IGFsbG93S2lsbDogdHJ1ZSB9KS50aGVuKHJlc3VsdCA9PiB7IG9sZEtpbGxlZCA9IHRydWUgfSlcbiAgICAgIHByb2Nlc3NNYW5hZ2VyLmtpbGxDaGlsZFByb2Nlc3NlcygpXG4gICAgICBwcm9jZXNzTWFuYWdlci5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbnN0cnVjdENvbW1hbmQoJ25ldy50ZXgnKSwgeyBhbGxvd0tpbGw6IHRydWUgfSkudGhlbihyZXN1bHQgPT4geyBuZXdLaWxsZWQgPSB0cnVlIH0pXG5cbiAgICAgIHdhaXRzRm9yKCgpID0+IG9sZEtpbGxlZCwgNTAwMClcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChuZXdLaWxsZWQpLnRvQmUoZmFsc2UpXG4gICAgICAgIHByb2Nlc3NNYW5hZ2VyLmtpbGxDaGlsZFByb2Nlc3NlcygpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19