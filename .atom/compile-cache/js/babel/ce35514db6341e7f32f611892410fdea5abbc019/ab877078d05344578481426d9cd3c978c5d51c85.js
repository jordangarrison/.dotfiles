Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = {
  heredoc: function heredoc(input) {
    if (input === null) {
      return null;
    }

    var lines = _lodash2['default'].dropWhile(input.split(/\r\n|\n|\r/), function (line) {
      return line.length === 0;
    });
    var indentLength = _lodash2['default'].takeWhile(lines[0], function (char) {
      return char === ' ';
    }).length;
    var truncatedLines = lines.map(function (line) {
      return line.slice(indentLength);
    });

    return truncatedLines.join('\n');
  },

  promisify: function promisify(target) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        target.apply(undefined, args.concat([function (error, data) {
          error ? reject(error) : resolve(data);
        }]));
      });
    };
  },

  getEditorDetails: function getEditorDetails() {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) return {};

    var filePath = editor.getPath();
    var position = editor.getCursorBufferPosition();
    var lineNumber = position.row + 1;

    return { editor: editor, filePath: filePath, position: position, lineNumber: lineNumber };
  },

  replacePropertiesInString: function replacePropertiesInString(text, properties) {
    return _lodash2['default'].reduce(properties, function (current, value, name) {
      return current.replace('{' + name + '}', value);
    }, text);
  },

  isTexFile: function isTexFile(filePath) {
    return filePath && !!filePath.match(/\.(?:tex|lhs)$/i);
  },

  isKnitrFile: function isKnitrFile(filePath) {
    return filePath && !!filePath.match(/\.[rs]nw$/i);
  },

  isPdfFile: function isPdfFile(filePath) {
    return filePath && !!filePath.match(/\.pdf$/i);
  },

  isPsFile: function isPsFile(filePath) {
    return filePath && !!filePath.match(/\.ps$/i);
  },

  isDviFile: function isDviFile(filePath) {
    return filePath && !!filePath.match(/\.(?:dvi|xdv)$/i);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvd2Vya3pldWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBRWMsUUFBUTs7OztxQkFFUDtBQUNiLFNBQU8sRUFBQyxpQkFBQyxLQUFLLEVBQUU7QUFDZCxRQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFBRSxhQUFPLElBQUksQ0FBQTtLQUFFOztBQUVuQyxRQUFNLEtBQUssR0FBRyxvQkFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFBLElBQUk7YUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDL0UsUUFBTSxZQUFZLEdBQUcsb0JBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFBLElBQUk7YUFBSSxJQUFJLEtBQUssR0FBRztLQUFBLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDdkUsUUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7YUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFbEUsV0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ2pDOztBQUVELFdBQVMsRUFBQyxtQkFBQyxNQUFNLEVBQUU7QUFDakIsV0FBTyxZQUFhO3dDQUFULElBQUk7QUFBSixZQUFJOzs7QUFDYixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxjQUFNLGtCQUFJLElBQUksU0FBRSxVQUFDLEtBQUssRUFBRSxJQUFJLEVBQUs7QUFBRSxlQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUFFLEdBQUMsQ0FBQTtPQUM1RSxDQUFDLENBQUE7S0FDSCxDQUFBO0dBQ0Y7O0FBRUQsa0JBQWdCLEVBQUMsNEJBQUc7QUFDbEIsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELFFBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUE7O0FBRXRCLFFBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNqQyxRQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtBQUNqRCxRQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTs7QUFFbkMsV0FBTyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQTtHQUNsRDs7QUFFRCwyQkFBeUIsRUFBQyxtQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQzNDLFdBQU8sb0JBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSTthQUFLLE9BQU8sQ0FBQyxPQUFPLE9BQUssSUFBSSxRQUFLLEtBQUssQ0FBQztLQUFBLEVBQUUsSUFBSSxDQUFDLENBQUE7R0FDakc7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLFFBQVEsRUFBRTtBQUNuQixXQUFPLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0dBQ3ZEOztBQUVELGFBQVcsRUFBQyxxQkFBQyxRQUFRLEVBQUU7QUFDckIsV0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7R0FDbEQ7O0FBRUQsV0FBUyxFQUFDLG1CQUFDLFFBQVEsRUFBRTtBQUNuQixXQUFPLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtHQUMvQzs7QUFFRCxVQUFRLEVBQUMsa0JBQUMsUUFBUSxFQUFFO0FBQ2xCLFdBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQzlDOztBQUVELFdBQVMsRUFBQyxtQkFBQyxRQUFRLEVBQUU7QUFDbkIsV0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtHQUN2RDtDQUNGIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvd2Vya3pldWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBoZXJlZG9jIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICBjb25zdCBsaW5lcyA9IF8uZHJvcFdoaWxlKGlucHV0LnNwbGl0KC9cXHJcXG58XFxufFxcci8pLCBsaW5lID0+IGxpbmUubGVuZ3RoID09PSAwKVxuICAgIGNvbnN0IGluZGVudExlbmd0aCA9IF8udGFrZVdoaWxlKGxpbmVzWzBdLCBjaGFyID0+IGNoYXIgPT09ICcgJykubGVuZ3RoXG4gICAgY29uc3QgdHJ1bmNhdGVkTGluZXMgPSBsaW5lcy5tYXAobGluZSA9PiBsaW5lLnNsaWNlKGluZGVudExlbmd0aCkpXG5cbiAgICByZXR1cm4gdHJ1bmNhdGVkTGluZXMuam9pbignXFxuJylcbiAgfSxcblxuICBwcm9taXNpZnkgKHRhcmdldCkge1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGFyZ2V0KC4uLmFyZ3MsIChlcnJvciwgZGF0YSkgPT4geyBlcnJvciA/IHJlamVjdChlcnJvcikgOiByZXNvbHZlKGRhdGEpIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBnZXRFZGl0b3JEZXRhaWxzICgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuIHt9XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBjb25zdCBwb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgY29uc3QgbGluZU51bWJlciA9IHBvc2l0aW9uLnJvdyArIDFcblxuICAgIHJldHVybiB7IGVkaXRvciwgZmlsZVBhdGgsIHBvc2l0aW9uLCBsaW5lTnVtYmVyIH1cbiAgfSxcblxuICByZXBsYWNlUHJvcGVydGllc0luU3RyaW5nICh0ZXh0LCBwcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlKHByb3BlcnRpZXMsIChjdXJyZW50LCB2YWx1ZSwgbmFtZSkgPT4gY3VycmVudC5yZXBsYWNlKGB7JHtuYW1lfX1gLCB2YWx1ZSksIHRleHQpXG4gIH0sXG5cbiAgaXNUZXhGaWxlIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aCAmJiAhIWZpbGVQYXRoLm1hdGNoKC9cXC4oPzp0ZXh8bGhzKSQvaSlcbiAgfSxcblxuICBpc0tuaXRyRmlsZSAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmlsZVBhdGggJiYgISFmaWxlUGF0aC5tYXRjaCgvXFwuW3JzXW53JC9pKVxuICB9LFxuXG4gIGlzUGRmRmlsZSAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gZmlsZVBhdGggJiYgISFmaWxlUGF0aC5tYXRjaCgvXFwucGRmJC9pKVxuICB9LFxuXG4gIGlzUHNGaWxlIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aCAmJiAhIWZpbGVQYXRoLm1hdGNoKC9cXC5wcyQvaSlcbiAgfSxcblxuICBpc0R2aUZpbGUgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIGZpbGVQYXRoICYmICEhZmlsZVBhdGgubWF0Y2goL1xcLig/OmR2aXx4ZHYpJC9pKVxuICB9XG59XG4iXX0=