'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

exports['default'] = {

  activate: function activate() {
    var ImportOrganizer = require('./import-organizer');
    this.importOrganizer = new ImportOrganizer();
  },

  provideImport: function provideImport() {
    return require('./import-provider');
  },

  consumeJavaClasspathRegistry: function consumeJavaClasspathRegistry(registry) {
    this.classpathRegistry = registry;

    // Cannot do imports until we have a registry to work with
    atom.commands.add('atom-text-editor', 'java-import-wiz:do-import', this.doImport.bind(this));
  },

  doImport: _asyncToGenerator(function* () {
    var textEditor = atom.workspace.getActiveTextEditor();
    var className = textEditor.getWordUnderCursor();
    var klasses = this.classpathRegistry.filter(function (fullyQualifiedClass) {
      return fullyQualifiedClass.substr(fullyQualifiedClass.lastIndexOf('.') + 1) === className;
    });

    if (klasses.length === 0) {
      return;
    }

    var item = klasses[0].name;
    if (klasses.length > 1) {
      try {
        var ImportView = require('./import-view');
        item = yield new ImportView(klasses.map(function (k) {
          return k.name;
        })).getSelection();
      } catch (err) {
        return;
      }
    }

    require('./import-provider')(textEditor, item);
  })

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWltcG9ydC13aXovbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7cUJBRUc7O0FBRWIsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDdEQsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0dBQzlDOztBQUVELGVBQWEsRUFBQSx5QkFBRztBQUNkLFdBQU8sT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7R0FDckM7O0FBRUQsOEJBQTRCLEVBQUEsc0NBQUMsUUFBUSxFQUFFO0FBQ3JDLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7OztBQUdsQyxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSwyQkFBMkIsRUFBSSxJQUFJLENBQUMsUUFBUSxNQUFiLElBQUksRUFBVSxDQUFDO0dBQ3JGOztBQUVELEFBQU0sVUFBUSxvQkFBQSxhQUFHO0FBQ2YsUUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3hELFFBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ2xELFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsVUFBQSxtQkFBbUI7YUFDL0QsbUJBQW1CLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxTQUFTO0tBQUEsQ0FBQyxDQUFDOztBQUV0RixRQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3hCLGFBQU87S0FDUjs7QUFFRCxRQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzNCLFFBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEIsVUFBSTtBQUNGLFlBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM1QyxZQUFJLEdBQUcsTUFBTSxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztpQkFBSSxDQUFDLENBQUMsSUFBSTtTQUFBLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO09BQ3RFLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDWixlQUFPO09BQ1I7S0FDRjs7QUFFRCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDaEQsQ0FBQTs7Q0FFRiIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvamF2YS1pbXBvcnQtd2l6L2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgY29uc3QgSW1wb3J0T3JnYW5pemVyID0gcmVxdWlyZSgnLi9pbXBvcnQtb3JnYW5pemVyJyk7XG4gICAgdGhpcy5pbXBvcnRPcmdhbml6ZXIgPSBuZXcgSW1wb3J0T3JnYW5pemVyKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUltcG9ydCgpIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9pbXBvcnQtcHJvdmlkZXInKTtcbiAgfSxcblxuICBjb25zdW1lSmF2YUNsYXNzcGF0aFJlZ2lzdHJ5KHJlZ2lzdHJ5KSB7XG4gICAgdGhpcy5jbGFzc3BhdGhSZWdpc3RyeSA9IHJlZ2lzdHJ5O1xuXG4gICAgLy8gQ2Fubm90IGRvIGltcG9ydHMgdW50aWwgd2UgaGF2ZSBhIHJlZ2lzdHJ5IHRvIHdvcmsgd2l0aFxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2phdmEtaW1wb3J0LXdpejpkby1pbXBvcnQnLCA6OnRoaXMuZG9JbXBvcnQpO1xuICB9LFxuXG4gIGFzeW5jIGRvSW1wb3J0KCkge1xuICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gdGV4dEVkaXRvci5nZXRXb3JkVW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBrbGFzc2VzID0gdGhpcy5jbGFzc3BhdGhSZWdpc3RyeS5maWx0ZXIoZnVsbHlRdWFsaWZpZWRDbGFzcyA9PlxuICAgICAgZnVsbHlRdWFsaWZpZWRDbGFzcy5zdWJzdHIoZnVsbHlRdWFsaWZpZWRDbGFzcy5sYXN0SW5kZXhPZignLicpICsgMSkgPT09IGNsYXNzTmFtZSk7XG5cbiAgICBpZiAoa2xhc3Nlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaXRlbSA9IGtsYXNzZXNbMF0ubmFtZTtcbiAgICBpZiAoa2xhc3Nlcy5sZW5ndGggPiAxKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBJbXBvcnRWaWV3ID0gcmVxdWlyZSgnLi9pbXBvcnQtdmlldycpO1xuICAgICAgICBpdGVtID0gYXdhaXQgbmV3IEltcG9ydFZpZXcoa2xhc3Nlcy5tYXAoayA9PiBrLm5hbWUpKS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVxdWlyZSgnLi9pbXBvcnQtcHJvdmlkZXInKSh0ZXh0RWRpdG9yLCBpdGVtKTtcbiAgfVxuXG59O1xuIl19