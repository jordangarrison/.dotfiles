Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

var magicSpellCheckPattern = /^%\s*!TEX\s+spellcheck\s*=\s*(.*)$/im;
var ignorePattern = /[0-9]+(pt|mm|cm|in|ex|em|bp|pc|dd|cc|sp)/;
var grammarScopes = ['text.tex', 'text.tex.latex', 'text.tex.latex.memoir', 'text.tex.latex.beamer'];

exports['default'] = {
  disposables: null,

  provideGrammar: function provideGrammar() {
    function checkComments() {
      return atom.config.get('linter-spell-latex.checkComments');
    }

    return [{
      grammarScopes: grammarScopes,
      findLanguageTags: function findLanguageTags(textEditor) {
        var languages = [];
        textEditor.scan(magicSpellCheckPattern, function (_ref) {
          var match = _ref.match;
          var stop = _ref.stop;

          languages = match[1].split(/\s*,\s*/);
          stop();
        });
        return languages;
      },
      checkedScopes: {
        'comment.line.at-sign.bibtex': checkComments,
        'comment.line.percentage.tex': checkComments,
        'comment.line.percentage.latex': checkComments,
        'comment.line.percentage.directive.texshop.tex': false,
        'comment.line.percentage.magic.tex': false,
        'constant.character.latex': false,
        'constant.other.reference.citation.latex': false,
        'constant.other.reference.latex': false,
        'keyword.control.cite.latex': false,
        'keyword.control.tex': false,
        'markup.raw.verb.latex': false,
        'markup.underline.link.latex': false,
        'meta.catcode.tex': false,
        'meta.definition.latex': false,
        'meta.embedded.block.generic': false,
        'meta.embedded.block.lua': false,
        'meta.embedded.block.python': false,
        'meta.embedded.block.source': false,
        'meta.embedded.line.r': false,
        'meta.function.begin-document.latex': false,
        'meta.function.end-document.latex': false,
        'meta.function.environment.latex.tikz': false,
        'meta.function.environment.math.latex': false,
        'meta.function.link.url.latex': false,
        'meta.function.memoir-alltt.latex': false,
        'meta.function.verb.latex': false,
        'meta.function.verbatim.latex': false,
        'meta.include.latex': false,
        'meta.preamble.latex': false,
        'meta.reference.latex': false,
        'meta.scope.item.latex': false,
        'storage.type.function.latex': false,
        'storage.type.function.tex': false,
        'string.other.math.block.tex': false,
        'string.other.math.latex': false,
        'string.other.math.tex': false,
        'support.function.be.latex': false,
        'support.function.emph.latex': false,
        'support.function.ExplSyntax.tex': false,
        'support.function.footnote.latex': false,
        'support.function.general.tex': false,
        'support.function.marginpar.latex': false,
        'support.function.marginpar.latex': false,
        'support.type.function.other.latex': false,
        'support.function.section.latex': false,
        'support.function.textbf.latex': false,
        'support.function.textit.latex': false,
        'support.function.texttt.latex': false,
        'support.function.url.latex': false,
        'support.function.verb.latex': false,
        'text.tex.latex.beamer': true,
        'text.tex.latex.memoir': true,
        'text.tex.latex': true,
        'text.tex': true,
        'variable.parameter.function.latex': false
      },
      getRanges: function getRanges(textEditor, ranges) {
        var ignoredRanges = [];
        for (var searchRange of ranges) {
          textEditor.scanInBufferRange(ignorePattern, searchRange, function (_ref2) {
            var range = _ref2.range;

            ignoredRanges.push(range);
          });
        }
        return { ranges: ranges, ignoredRanges: ignoredRanges };
      }
    }, {
      grammarScopes: ['text.bibtex'],
      checkedScopes: {
        'markup.underline.link.http.hyperlink': false,
        'string.quoted.double.bibtex': true,
        'string.quoted.other.braces.bibtex': true
      }
    }];
  },

  provideDictionary: function provideDictionary() {
    var wordList = require('linter-spell-word-list');
    var a = new wordList.ConfigWordList({
      name: 'LaTeX',
      keyPath: 'linter-spell-latex.words',
      grammarScopes: grammarScopes
    });
    this.disposables.add(a);
    return a.provideDictionary();
  },

  activate: function activate() {
    this.disposables = new _atom.CompositeDisposable();
    require('atom-package-deps').install('linter-spell-latex').then(function () {
      console.log('All dependencies installed, good to go');
    });
  },

  deactivate: function deactivate() {
    this.disposables.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwtbGF0ZXgvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFb0MsTUFBTTs7QUFGMUMsV0FBVyxDQUFBOztBQUlYLElBQU0sc0JBQXNCLEdBQUcsc0NBQXNDLENBQUE7QUFDckUsSUFBTSxhQUFhLEdBQUcsMENBQTBDLENBQUE7QUFDaEUsSUFBTSxhQUFhLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQTs7cUJBRXZGO0FBQ2IsYUFBVyxFQUFFLElBQUk7O0FBRWpCLGdCQUFjLEVBQUMsMEJBQUc7QUFDaEIsYUFBUyxhQUFhLEdBQUk7QUFDeEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0tBQzNEOztBQUVELFdBQU8sQ0FBQztBQUNOLG1CQUFhLEVBQUUsYUFBYTtBQUM1QixzQkFBZ0IsRUFBRSwwQkFBQSxVQUFVLEVBQUk7QUFDOUIsWUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLGtCQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLFVBQUMsSUFBYSxFQUFLO2NBQWpCLEtBQUssR0FBTixJQUFhLENBQVosS0FBSztjQUFFLElBQUksR0FBWixJQUFhLENBQUwsSUFBSTs7QUFDbkQsbUJBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3JDLGNBQUksRUFBRSxDQUFBO1NBQ1AsQ0FBQyxDQUFBO0FBQ0YsZUFBTyxTQUFTLENBQUE7T0FDakI7QUFDRCxtQkFBYSxFQUFFO0FBQ2IscUNBQTZCLEVBQUUsYUFBYTtBQUM1QyxxQ0FBNkIsRUFBRSxhQUFhO0FBQzVDLHVDQUErQixFQUFFLGFBQWE7QUFDOUMsdURBQStDLEVBQUUsS0FBSztBQUN0RCwyQ0FBbUMsRUFBRSxL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QUEwQjtBQUNuQyxtQkFBYSxFQUFFLGFBQWE7S0FDN0IsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkIsV0FBTyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtHQUM3Qjs7QUFFRCxVQUFRLEVBQUMsb0JBQUc7QUFDVixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUN2RCxJQUFJLENBQUMsWUFBTTtBQUNWLGFBQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtLQUN0RCxDQUFDLENBQUE7R0FDTDs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQzNCO0NBQ0YiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC1sYXRleC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5jb25zdCBtYWdpY1NwZWxsQ2hlY2tQYXR0ZXJuID0gL14lXFxzKiFURVhcXHMrc3BlbGxjaGVja1xccyo9XFxzKiguKikkL2ltXG5jb25zdCBpZ25vcmVQYXR0ZXJuID0gL1swLTldKyhwdHxtbXxjbXxpbnxleHxlbXxicHxwY3xkZHxjY3xzcCkvXG5jb25zdCBncmFtbWFyU2NvcGVzID0gWyd0ZXh0LnRleCcsICd0ZXh0LnRleC5sYXRleCcsICd0ZXh0LnRleC5sYXRleC5tZW1vaXInLCAndGV4dC50ZXgubGF0ZXguYmVhbWVyJ11cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkaXNwb3NhYmxlczogbnVsbCxcblxuICBwcm92aWRlR3JhbW1hciAoKSB7XG4gICAgZnVuY3Rpb24gY2hlY2tDb21tZW50cyAoKSB7XG4gICAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItc3BlbGwtbGF0ZXguY2hlY2tDb21tZW50cycpXG4gICAgfVxuXG4gICAgcmV0dXJuIFt7XG4gICAgICBncmFtbWFyU2NvcGVzOiBncmFtbWFyU2NvcGVzLFxuICAgICAgZmluZExhbmd1YWdlVGFnczogdGV4dEVkaXRvciA9PiB7XG4gICAgICAgIGxldCBsYW5ndWFnZXMgPSBbXVxuICAgICAgICB0ZXh0RWRpdG9yLnNjYW4obWFnaWNTcGVsbENoZWNrUGF0dGVybiwgKHttYXRjaCwgc3RvcH0pID0+IHtcbiAgICAgICAgICBsYW5ndWFnZXMgPSBtYXRjaFsxXS5zcGxpdCgvXFxzKixcXHMqLylcbiAgICAgICAgICBzdG9wKClcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1xuICAgICAgfSxcbiAgICAgIGNoZWNrZWRTY29wZXM6IHtcbiAgICAgICAgJ2NvbW1lbnQubGluZS5hdC1zaWduLmJpYnRleCc6IGNoZWNrQ29tbWVudHMsXG4gICAgICAgICdjb21tZW50LmxpbmUucGVyY2VudGFnZS50ZXgnOiBjaGVja0NvbW1lbnRzLFxuICAgICAgICAnY29tbWVudC5saW5lLnBlcmNlbnRhZ2UubGF0ZXgnOiBjaGVja0NvbW1lbnRzLFxuICAgICAgICAnY29tbWVudC5saW5lLnBlcmNlbnRhZ2UuZGlyZWN0aXZlLnRleHNob3AudGV4JzogZmFsc2UsXG4gICAgICAgICdjb21tZW50LmxpbmUucGVyY2VudGFnZS5tYWdpYy50ZXgnOiBmYWxzZSxcbiAgICAgICAgJ2NvbnN0YW50LmNoYXJhY3Rlci5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnY29uc3RhbnQub3RoZXIucmVmZXJlbmNlLmNpdGF0aW9uLmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdjb25zdGFudC5vdGhlci5yZWZlcmVuY2UubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ2tleXdvcmQuY29udHJvbC5jaXRlLmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdrZXl3b3JkLmNvbnRyb2wudGV4JzogZmFsc2UsXG4gICAgICAgICdtYXJrdXAucmF3LnZlcmIubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnbWV0YS5jYXRjb2RlLnRleCc6IGZhbHNlLFxuICAgICAgICAnbWV0YS5kZWZpbml0aW9uLmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdtZXRhLmVtYmVkZGVkLmJsb2NrLmdlbmVyaWMnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuZW1iZWRkZWQuYmxvY2subHVhJzogZmFsc2UsXG4gICAgICAgICdtZXRhLmVtYmVkZGVkLmJsb2NrLnB5dGhvbic6IGZhbHNlLFxuICAgICAgICAnbWV0YS5lbWJlZGRlZC5ibG9jay5zb3VyY2UnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuZW1iZWRkZWQubGluZS5yJzogZmFsc2UsXG4gICAgICAgICdtZXRhLmZ1bmN0aW9uLmJlZ2luLWRvY3VtZW50LmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdtZXRhLmZ1bmN0aW9uLmVuZC1kb2N1bWVudC5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnbWV0YS5mdW5jdGlvbi5lbnZpcm9ubWVudC5sYXRleC50aWt6JzogZmFsc2UsXG4gICAgICAgICdtZXRhLmZ1bmN0aW9uLmVudmlyb25tZW50Lm1hdGgubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuZnVuY3Rpb24ubGluay51cmwubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuZnVuY3Rpb24ubWVtb2lyLWFsbHR0LmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdtZXRhLmZ1bmN0aW9uLnZlcmIubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuZnVuY3Rpb24udmVyYmF0aW0ubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuaW5jbHVkZS5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnbWV0YS5wcmVhbWJsZS5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnbWV0YS5yZWZlcmVuY2UubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ21ldGEuc2NvcGUuaXRlbS5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnc3RvcmFnZS50eXBlLmZ1bmN0aW9uLmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdzdG9yYWdlLnR5cGUuZnVuY3Rpb24udGV4JzogZmFsc2UsXG4gICAgICAgICdzdHJpbmcub3RoZXIubWF0aC5ibG9jay50ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N0cmluZy5vdGhlci5tYXRoLmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdzdHJpbmcub3RoZXIubWF0aC50ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N1cHBvcnQuZnVuY3Rpb24uYmUubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N1cHBvcnQuZnVuY3Rpb24uZW1waC5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnc3VwcG9ydC5mdW5jdGlvbi5FeHBsU3ludGF4LnRleCc6IGZhbHNlLFxuICAgICAgICAnc3VwcG9ydC5mdW5jdGlvbi5mb290bm90ZS5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnc3VwcG9ydC5mdW5jdGlvbi5nZW5lcmFsLnRleCc6IGZhbHNlLFxuICAgICAgICAnc3VwcG9ydC5mdW5jdGlvbi5tYXJnaW5wYXIubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N1cHBvcnQuZnVuY3Rpb24ubWFyZ2lucGFyLmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdzdXBwb3J0LnR5cGUuZnVuY3Rpb24ub3RoZXIubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N1cHBvcnQuZnVuY3Rpb24uc2VjdGlvbi5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnc3VwcG9ydC5mdW5jdGlvbi50ZXh0YmYubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N1cHBvcnQuZnVuY3Rpb24udGV4dGl0LmxhdGV4JzogZmFsc2UsXG4gICAgICAgICdzdXBwb3J0LmZ1bmN0aW9uLnRleHR0dC5sYXRleCc6IGZhbHNlLFxuICAgICAgICAnc3VwcG9ydC5mdW5jdGlvbi51cmwubGF0ZXgnOiBmYWxzZSxcbiAgICAgICAgJ3N1cHBvcnQuZnVuY3Rpb24udmVyYi5sYXRleCc6IGZhbHNlLFxuICAgICAgICAndGV4dC50ZXgubGF0ZXguYmVhbWVyJzogdHJ1ZSxcbiAgICAgICAgJ3RleHQudGV4LmxhdGV4Lm1lbW9pcic6IHRydWUsXG4gICAgICAgICd0ZXh0LnRleC5sYXRleCc6IHRydWUsXG4gICAgICAgICd0ZXh0LnRleCc6IHRydWUsXG4gICAgICAgICd2YXJpYWJsZS5wYXJhbWV0ZXIuZnVuY3Rpb24ubGF0ZXgnOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGdldFJhbmdlczogKHRleHRFZGl0b3IsIHJhbmdlcykgPT4ge1xuICAgICAgICBsZXQgaWdub3JlZFJhbmdlcyA9IFtdXG4gICAgICAgIGZvciAoY29uc3Qgc2VhcmNoUmFuZ2Ugb2YgcmFuZ2VzKSB7XG4gICAgICAgICAgdGV4dEVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShpZ25vcmVQYXR0ZXJuLCBzZWFyY2hSYW5nZSwgKHtyYW5nZX0pID0+IHtcbiAgICAgICAgICAgIGlnbm9yZWRSYW5nZXMucHVzaChyYW5nZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHJhbmdlczogcmFuZ2VzLCBpZ25vcmVkUmFuZ2VzOiBpZ25vcmVkUmFuZ2VzIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3RleHQuYmlidGV4J10sXG4gICAgICBjaGVja2VkU2NvcGVzOiB7XG4gICAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuaHR0cC5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICAgJ3N0cmluZy5xdW90ZWQuZG91YmxlLmJpYnRleCc6IHRydWUsXG4gICAgICAgICdzdHJpbmcucXVvdGVkLm90aGVyLmJyYWNlcy5iaWJ0ZXgnOiB0cnVlXG4gICAgICB9XG4gICAgfV1cbiAgfSxcblxuICBwcm92aWRlRGljdGlvbmFyeSAoKSB7XG4gICAgbGV0IHdvcmRMaXN0ID0gcmVxdWlyZSgnbGludGVyLXNwZWxsLXdvcmQtbGlzdCcpXG4gICAgbGV0IGEgPSBuZXcgd29yZExpc3QuQ29uZmlnV29yZExpc3Qoe1xuICAgICAgbmFtZTogJ0xhVGVYJyxcbiAgICAgIGtleVBhdGg6ICdsaW50ZXItc3BlbGwtbGF0ZXgud29yZHMnLFxuICAgICAgZ3JhbW1hclNjb3BlczogZ3JhbW1hclNjb3Blc1xuICAgIH0pXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYSlcbiAgICByZXR1cm4gYS5wcm92aWRlRGljdGlvbmFyeSgpXG4gIH0sXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItc3BlbGwtbGF0ZXgnKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnQWxsIGRlcGVuZGVuY2llcyBpbnN0YWxsZWQsIGdvb2QgdG8gZ28nKVxuICAgICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=