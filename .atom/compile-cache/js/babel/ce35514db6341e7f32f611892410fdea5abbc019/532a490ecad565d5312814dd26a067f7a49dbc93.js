Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

'use babel';

function buildGroups(importGrouping, imports) {
  return imports.reduce(function (memo, imp) {
    var namespaceGroup = (0, _helpers.getNamespaceGroup)(imp);
    var grouping = importGrouping.find(function (group) {
      return group.includes(namespaceGroup);
    });
    var topLevel = grouping ? grouping[0] : namespaceGroup;
    memo[topLevel] = memo[topLevel] || [];
    memo[topLevel].push(imp);
    return memo;
  }, {});
}

function sortGroups(groups) {
  for (var topLevel in groups) {
    if (groups.hasOwnProperty(topLevel)) {
      groups[topLevel] = groups[topLevel].sort();
    }
  }
}

function createImportString(groups) {
  var groupOrder = Object.keys(groups).sort();
  return groupOrder.map(function (group) {
    return groups[group].map(function (imp) {
      return 'import ' + imp + ';';
    }).join('\n');
  }).join(atom.config.get('java-import-wiz.separateGroups') ? '\n\n' : '\n');
}

var ImportOrganizer = (function () {
  function ImportOrganizer() {
    _classCallCheck(this, ImportOrganizer);

    atom.commands.add('atom-text-editor', 'java-import-wiz:organize-imports', this.organize.bind(this));
  }

  _createClass(ImportOrganizer, [{
    key: 'getImportGrouping',
    value: function getImportGrouping() {
      try {
        return JSON.parse(atom.config.get('java-import-wiz.importGrouping'));
      } catch (e) {
        return [];
      }
    }
  }, {
    key: 'organize',
    value: function organize() {
      var editor = atom.workspace.getActiveTextEditor();

      var imports = (0, _helpers.getImports)(editor);
      var groups = buildGroups(this.getImportGrouping(), imports);
      sortGroups(groups);

      this.replaceImports(editor, groups);
    }
  }, {
    key: 'replaceImports',
    value: function replaceImports(editor, groups) {
      var importString = createImportString(groups);
      var rangeBegin = (0, _helpers.getPackageDefinitionEndPoint)(editor);
      var rangeEnd = (0, _helpers.getLastImportEndPoint)(editor);
      var prefix = rangeBegin ? '\n' : ''; // If there is no package, do not start with a newline
      var postfix = '\n';
      editor.setTextInBufferRange([rangeBegin, rangeEnd], '' + prefix + importString + postfix);
    }
  }]);

  return ImportOrganizer;
})();

exports['default'] = ImportOrganizer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWltcG9ydC13aXovbGliL2ltcG9ydC1vcmdhbml6ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7dUJBRW1HLFdBQVc7O0FBRjlHLFdBQVcsQ0FBQzs7QUFJWixTQUFTLFdBQVcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFO0FBQzVDLFNBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUs7QUFDbkMsUUFBTSxjQUFjLEdBQUcsZ0NBQWtCLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLFFBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLO2FBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7S0FBQSxDQUFDLENBQUM7QUFDOUUsUUFBTSxRQUFRLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUM7QUFDekQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixXQUFPLElBQUksQ0FBQztHQUNiLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDUjs7QUFFRCxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDMUIsT0FBSyxJQUFNLFFBQVEsSUFBSSxNQUFNLEVBQUU7QUFDN0IsUUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ25DLFlBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDNUM7R0FDRjtDQUNGOztBQUVELFNBQVMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO0FBQ2xDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUMsU0FBTyxVQUFVLENBQ2QsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO3lCQUFjLEdBQUc7S0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztHQUFBLENBQUMsQ0FDbkUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO0NBQzVFOztJQUVLLGVBQWU7QUFDUixXQURQLGVBQWUsR0FDTDswQkFEVixlQUFlOztBQUVqQixRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxrQ0FBa0MsRUFBSSxJQUFJLENBQUMsUUFBUSxNQUFiLElBQUksRUFBVSxDQUFDO0dBQzVGOztlQUhHLGVBQWU7O1dBS0YsNkJBQUc7QUFDbEIsVUFBSTtBQUNGLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7T0FDdEUsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGVBQU8sRUFBRSxDQUFDO09BQ1g7S0FDRjs7O1dBRU8sb0JBQUc7QUFDVCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRXBELFVBQU0sT0FBTyxHQUFHLHlCQUFXLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFVBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM5RCxnQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVuQixVQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNyQzs7O1dBRWEsd0JBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUM3QixVQUFNLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxVQUFNLFVBQVUsR0FBRywyQ0FBNkIsTUFBTSxDQUFDLENBQUM7QUFDeEQsVUFBTSxRQUFRLEdBQUcsb0NBQXNCLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLFVBQU0sTUFBTSxHQUFHLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQztBQUNyQixZQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBRSxVQUFVLEVBQUUsUUFBUSxDQUFFLE9BQUssTUFBTSxHQUFHLFlBQVksR0FBRyxPQUFPLENBQUcsQ0FBQztLQUM3Rjs7O1NBOUJHLGVBQWU7OztxQkFpQ04sZUFBZSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvamF2YS1pbXBvcnQtd2l6L2xpYi9pbXBvcnQtb3JnYW5pemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGdldEltcG9ydHMsIGdldE5hbWVzcGFjZUdyb3VwLCBnZXRQYWNrYWdlRGVmaW5pdGlvbkVuZFBvaW50LCBnZXRMYXN0SW1wb3J0RW5kUG9pbnQgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5mdW5jdGlvbiBidWlsZEdyb3VwcyhpbXBvcnRHcm91cGluZywgaW1wb3J0cykge1xuICByZXR1cm4gaW1wb3J0cy5yZWR1Y2UoKG1lbW8sIGltcCkgPT4ge1xuICAgIGNvbnN0IG5hbWVzcGFjZUdyb3VwID0gZ2V0TmFtZXNwYWNlR3JvdXAoaW1wKTtcbiAgICBjb25zdCBncm91cGluZyA9IGltcG9ydEdyb3VwaW5nLmZpbmQoZ3JvdXAgPT4gZ3JvdXAuaW5jbHVkZXMobmFtZXNwYWNlR3JvdXApKTtcbiAgICBjb25zdCB0b3BMZXZlbCA9IGdyb3VwaW5nID8gZ3JvdXBpbmdbMF0gOiBuYW1lc3BhY2VHcm91cDtcbiAgICBtZW1vW3RvcExldmVsXSA9IG1lbW9bdG9wTGV2ZWxdIHx8IFtdO1xuICAgIG1lbW9bdG9wTGV2ZWxdLnB1c2goaW1wKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBzb3J0R3JvdXBzKGdyb3Vwcykge1xuICBmb3IgKGNvbnN0IHRvcExldmVsIGluIGdyb3Vwcykge1xuICAgIGlmIChncm91cHMuaGFzT3duUHJvcGVydHkodG9wTGV2ZWwpKSB7XG4gICAgICBncm91cHNbdG9wTGV2ZWxdID0gZ3JvdXBzW3RvcExldmVsXS5zb3J0KCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUltcG9ydFN0cmluZyhncm91cHMpIHtcbiAgY29uc3QgZ3JvdXBPcmRlciA9IE9iamVjdC5rZXlzKGdyb3Vwcykuc29ydCgpO1xuICByZXR1cm4gZ3JvdXBPcmRlclxuICAgIC5tYXAoZ3JvdXAgPT4gZ3JvdXBzW2dyb3VwXS5tYXAoaW1wID0+IGBpbXBvcnQgJHtpbXB9O2ApLmpvaW4oJ1xcbicpKVxuICAgIC5qb2luKGF0b20uY29uZmlnLmdldCgnamF2YS1pbXBvcnQtd2l6LnNlcGFyYXRlR3JvdXBzJykgPyAnXFxuXFxuJyA6ICdcXG4nKTtcbn1cblxuY2xhc3MgSW1wb3J0T3JnYW5pemVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnamF2YS1pbXBvcnQtd2l6Om9yZ2FuaXplLWltcG9ydHMnLCA6OnRoaXMub3JnYW5pemUpO1xuICB9XG5cbiAgZ2V0SW1wb3J0R3JvdXBpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGF0b20uY29uZmlnLmdldCgnamF2YS1pbXBvcnQtd2l6LmltcG9ydEdyb3VwaW5nJykpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH1cblxuICBvcmdhbml6ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBjb25zdCBpbXBvcnRzID0gZ2V0SW1wb3J0cyhlZGl0b3IpO1xuICAgIGNvbnN0IGdyb3VwcyA9IGJ1aWxkR3JvdXBzKHRoaXMuZ2V0SW1wb3J0R3JvdXBpbmcoKSwgaW1wb3J0cyk7XG4gICAgc29ydEdyb3Vwcyhncm91cHMpO1xuXG4gICAgdGhpcy5yZXBsYWNlSW1wb3J0cyhlZGl0b3IsIGdyb3Vwcyk7XG4gIH1cblxuICByZXBsYWNlSW1wb3J0cyhlZGl0b3IsIGdyb3Vwcykge1xuICAgIGNvbnN0IGltcG9ydFN0cmluZyA9IGNyZWF0ZUltcG9ydFN0cmluZyhncm91cHMpO1xuICAgIGNvbnN0IHJhbmdlQmVnaW4gPSBnZXRQYWNrYWdlRGVmaW5pdGlvbkVuZFBvaW50KGVkaXRvcik7XG4gICAgY29uc3QgcmFuZ2VFbmQgPSBnZXRMYXN0SW1wb3J0RW5kUG9pbnQoZWRpdG9yKTtcbiAgICBjb25zdCBwcmVmaXggPSByYW5nZUJlZ2luID8gJ1xcbicgOiAnJzsgLy8gSWYgdGhlcmUgaXMgbm8gcGFja2FnZSwgZG8gbm90IHN0YXJ0IHdpdGggYSBuZXdsaW5lXG4gICAgY29uc3QgcG9zdGZpeCA9ICdcXG4nO1xuICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbIHJhbmdlQmVnaW4sIHJhbmdlRW5kIF0sIGAke3ByZWZpeH0ke2ltcG9ydFN0cmluZ30ke3Bvc3RmaXh9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW1wb3J0T3JnYW5pemVyO1xuIl19