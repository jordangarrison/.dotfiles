function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

// import { Range } from 'atom'

'use babel';

describe('The linter-spell-latex provider for Atom Linter', function () {
  var grammar = require('../lib/main').provideGrammar()[0];

  // beforeEach(() => {
  //   waitsForPromise(() => {
  //     return Promise.all(_.map(['language-tex'], p => atom.packages.activatePackage(p)))
  //   })
  // })

  // it('finds spelling regions in "foo.tex"', () => {
  //   waitsForPromise(() => {
  //     return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(editor => {
  //       expect(_.isEqual(
  //         [new Range([2, 0], [3, 0]), new Range([4, 0], [0, 24])],
  //         grammar.getRanges(editor, [editor.getBuffer().getRange()]).ignoredRanges)).toBe(true, 'Matching ranges')
  //     })
  //   })
  // })

  it('finds spellcheck TeX magic in "foo.tex"', function () {
    waitsForPromise(function () {
      return atom.workspace.open(path.join(__dirname, 'files', 'foo.tex')).then(function (editor) {
        expect(_.isEqual(grammar.findLanguageTags(editor), ['en-US'])).toBe(true, 'en-US language');
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwtbGF0ZXgvc3BlYy9tYWluLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBRXNCLE1BQU07O0lBQWhCLElBQUk7O3NCQUNHLFFBQVE7O0lBQWYsQ0FBQzs7OztBQUhiLFdBQVcsQ0FBQTs7QUFNWCxRQUFRLENBQUMsaURBQWlELEVBQUUsWUFBTTtBQUNoRSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCMUQsSUFBRSxDQUFDLHlDQUF5QyxFQUFFLFlBQU07QUFDbEQsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2xGLGNBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7T0FDNUYsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwtbGF0ZXgvc3BlYy9tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcbi8vIGltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcblxuZGVzY3JpYmUoJ1RoZSBsaW50ZXItc3BlbGwtbGF0ZXggcHJvdmlkZXIgZm9yIEF0b20gTGludGVyJywgKCkgPT4ge1xuICBjb25zdCBncmFtbWFyID0gcmVxdWlyZSgnLi4vbGliL21haW4nKS5wcm92aWRlR3JhbW1hcigpWzBdXG5cbiAgLy8gYmVmb3JlRWFjaCgoKSA9PiB7XG4gIC8vICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgLy8gICAgIHJldHVybiBQcm9taXNlLmFsbChfLm1hcChbJ2xhbmd1YWdlLXRleCddLCBwID0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKHApKSlcbiAgLy8gICB9KVxuICAvLyB9KVxuXG4gIC8vIGl0KCdmaW5kcyBzcGVsbGluZyByZWdpb25zIGluIFwiZm9vLnRleFwiJywgKCkgPT4ge1xuICAvLyAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gIC8vICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmlsZXMnLCAnZm9vLnRleCcpKS50aGVuKGVkaXRvciA9PiB7XG4gIC8vICAgICAgIGV4cGVjdChfLmlzRXF1YWwoXG4gIC8vICAgICAgICAgW25ldyBSYW5nZShbMiwgMF0sIFszLCAwXSksIG5ldyBSYW5nZShbNCwgMF0sIFswLCAyNF0pXSxcbiAgLy8gICAgICAgICBncmFtbWFyLmdldFJhbmdlcyhlZGl0b3IsIFtlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UmFuZ2UoKV0pLmlnbm9yZWRSYW5nZXMpKS50b0JlKHRydWUsICdNYXRjaGluZyByYW5nZXMnKVxuICAvLyAgICAgfSlcbiAgLy8gICB9KVxuICAvLyB9KVxuXG4gIGl0KCdmaW5kcyBzcGVsbGNoZWNrIFRlWCBtYWdpYyBpbiBcImZvby50ZXhcIicsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGVzJywgJ2Zvby50ZXgnKSkudGhlbihlZGl0b3IgPT4ge1xuICAgICAgICBleHBlY3QoXy5pc0VxdWFsKGdyYW1tYXIuZmluZExhbmd1YWdlVGFncyhlZGl0b3IpLCBbJ2VuLVVTJ10pKS50b0JlKHRydWUsICdlbi1VUyBsYW5ndWFnZScpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19