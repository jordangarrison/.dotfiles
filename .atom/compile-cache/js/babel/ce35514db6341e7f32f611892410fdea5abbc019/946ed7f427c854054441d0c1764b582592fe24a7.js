Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpers = require('./helpers');

/**
 * Checks if the fullyQualifiedClass exists in the array of imports.
 * Supports wildcard imports (such as `java.util.*;`).
 */
'use babel';

function importsIncludes(imports, fullyQualifiedClass) {
  for (var imp of imports) {
    if (imp === fullyQualifiedClass) {
      return true;
    }
    if ((0, _helpers.denamespace)(imp) === '*') {
      // This is a wildcard import. Check if package is the same.
      if ((0, _helpers.packagify)(fullyQualifiedClass) === (0, _helpers.packagify)(imp)) {
        return true;
      }
    }
  }
  return false;
}

function getImportInsertPoint(editor) {
  var point = (0, _helpers.getLastImportEndPoint)(editor);
  if (!point) {
    point = (0, _helpers.getPackageDefinitionEndPoint)(editor);
  }
  if (!point) {
    point = [0, 0];
  }
  return point;
}

function addImport(editor, fullyQualifiedClass) {
  var rootClass = fullyQualifiedClass;
  var subClassIndex = fullyQualifiedClass.indexOf('$'); // A nested class, e.g. javax.ws.rs.core.Response$Status
  if (subClassIndex !== -1) {
    rootClass = fullyQualifiedClass.substr(0, subClassIndex);
  }

  if (importsIncludes((0, _helpers.getImports)(editor), rootClass)) {
    return;
  }

  var pkg = (0, _helpers.getPackage)(editor);
  var importPkg = (0, _helpers.packagify)(rootClass);
  if (importPkg === pkg || 'java.lang' === importPkg) {
    return;
  }

  var point = getImportInsertPoint(editor);
  editor.getBuffer().insert(point, 'import ' + rootClass + ';\n');
}

exports['default'] = addImport;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWltcG9ydC13aXovbGliL2ltcG9ydC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3VCQUVvSCxXQUFXOzs7Ozs7QUFGL0gsV0FBVyxDQUFDOztBQVFaLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtBQUNyRCxPQUFLLElBQU0sR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUN6QixRQUFJLEdBQUcsS0FBSyxtQkFBbUIsRUFBRTtBQUMvQixhQUFPLElBQUksQ0FBQztLQUNiO0FBQ0QsUUFBSSwwQkFBWSxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUU7O0FBRTVCLFVBQUksd0JBQVUsbUJBQW1CLENBQUMsS0FBSyx3QkFBVSxHQUFHLENBQUMsRUFBRTtBQUNyRCxlQUFPLElBQUksQ0FBQztPQUNiO0tBQ0Y7R0FDRjtBQUNELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7QUFDcEMsTUFBSSxLQUFLLEdBQUcsb0NBQXNCLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLE1BQUksQ0FBQyxLQUFLLEVBQUU7QUFDVixTQUFLLEdBQUcsMkNBQTZCLE1BQU0sQ0FBQyxDQUFDO0dBQzlDO0FBQ0QsTUFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLFNBQUssR0FBRyxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQztHQUNsQjtBQUNELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRUQsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLG1CQUFtQixFQUFFO0FBQzlDLE1BQUksU0FBUyxHQUFHLG1CQUFtQixDQUFDO0FBQ3BDLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RCxNQUFJLGFBQWEsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN4QixhQUFTLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztHQUMxRDs7QUFFRCxNQUFJLGVBQWUsQ0FBQyx5QkFBVyxNQUFNLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRTtBQUNsRCxXQUFPO0dBQ1I7O0FBRUQsTUFBTSxHQUFHLEdBQUcseUJBQVcsTUFBTSxDQUFDLENBQUM7QUFDL0IsTUFBTSxTQUFTLEdBQUcsd0JBQVUsU0FBUyxDQUFDLENBQUM7QUFDdkMsTUFBSSxTQUFTLEtBQUssR0FBRyxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7QUFDbEQsV0FBTztHQUNSOztBQUVELE1BQU0sS0FBSyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFFBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxjQUFZLFNBQVMsU0FBTSxDQUFDO0NBQzVEOztxQkFFYyxTQUFTIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWltcG9ydC13aXovbGliL2ltcG9ydC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBnZXRQYWNrYWdlLCBnZXRJbXBvcnRzLCBnZXRMYXN0SW1wb3J0RW5kUG9pbnQsIGdldFBhY2thZ2VEZWZpbml0aW9uRW5kUG9pbnQsIHBhY2thZ2lmeSwgZGVuYW1lc3BhY2UgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZnVsbHlRdWFsaWZpZWRDbGFzcyBleGlzdHMgaW4gdGhlIGFycmF5IG9mIGltcG9ydHMuXG4gKiBTdXBwb3J0cyB3aWxkY2FyZCBpbXBvcnRzIChzdWNoIGFzIGBqYXZhLnV0aWwuKjtgKS5cbiAqL1xuZnVuY3Rpb24gaW1wb3J0c0luY2x1ZGVzKGltcG9ydHMsIGZ1bGx5UXVhbGlmaWVkQ2xhc3MpIHtcbiAgZm9yIChjb25zdCBpbXAgb2YgaW1wb3J0cykge1xuICAgIGlmIChpbXAgPT09IGZ1bGx5UXVhbGlmaWVkQ2xhc3MpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoZGVuYW1lc3BhY2UoaW1wKSA9PT0gJyonKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgd2lsZGNhcmQgaW1wb3J0LiBDaGVjayBpZiBwYWNrYWdlIGlzIHRoZSBzYW1lLlxuICAgICAgaWYgKHBhY2thZ2lmeShmdWxseVF1YWxpZmllZENsYXNzKSA9PT0gcGFja2FnaWZ5KGltcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0SW1wb3J0SW5zZXJ0UG9pbnQoZWRpdG9yKSB7XG4gIGxldCBwb2ludCA9IGdldExhc3RJbXBvcnRFbmRQb2ludChlZGl0b3IpO1xuICBpZiAoIXBvaW50KSB7XG4gICAgcG9pbnQgPSBnZXRQYWNrYWdlRGVmaW5pdGlvbkVuZFBvaW50KGVkaXRvcik7XG4gIH1cbiAgaWYgKCFwb2ludCkge1xuICAgIHBvaW50ID0gWyAwLCAwIF07XG4gIH1cbiAgcmV0dXJuIHBvaW50O1xufVxuXG5mdW5jdGlvbiBhZGRJbXBvcnQoZWRpdG9yLCBmdWxseVF1YWxpZmllZENsYXNzKSB7XG4gIGxldCByb290Q2xhc3MgPSBmdWxseVF1YWxpZmllZENsYXNzO1xuICBjb25zdCBzdWJDbGFzc0luZGV4ID0gZnVsbHlRdWFsaWZpZWRDbGFzcy5pbmRleE9mKCckJyk7IC8vIEEgbmVzdGVkIGNsYXNzLCBlLmcuIGphdmF4LndzLnJzLmNvcmUuUmVzcG9uc2UkU3RhdHVzXG4gIGlmIChzdWJDbGFzc0luZGV4ICE9PSAtMSkge1xuICAgIHJvb3RDbGFzcyA9IGZ1bGx5UXVhbGlmaWVkQ2xhc3Muc3Vic3RyKDAsIHN1YkNsYXNzSW5kZXgpO1xuICB9XG5cbiAgaWYgKGltcG9ydHNJbmNsdWRlcyhnZXRJbXBvcnRzKGVkaXRvciksIHJvb3RDbGFzcykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwa2cgPSBnZXRQYWNrYWdlKGVkaXRvcik7XG4gIGNvbnN0IGltcG9ydFBrZyA9IHBhY2thZ2lmeShyb290Q2xhc3MpO1xuICBpZiAoaW1wb3J0UGtnID09PSBwa2cgfHwgJ2phdmEubGFuZycgPT09IGltcG9ydFBrZykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBvaW50ID0gZ2V0SW1wb3J0SW5zZXJ0UG9pbnQoZWRpdG9yKTtcbiAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChwb2ludCwgYGltcG9ydCAke3Jvb3RDbGFzc307XFxuYCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEltcG9ydDtcbiJdfQ==