(function() {
  var Disposable, Environment,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  module.exports = Environment = (function(superClass) {
    extend(Environment, superClass);

    function Environment(latex) {
      this.latex = latex;
    }

    Environment.prototype.provide = function(prefix) {
      var env, item, suggestions;
      suggestions = [];
      for (env in this.suggestions.latex) {
        item = this.suggestions.latex[env];
        if (prefix.length === 0 || item.text.indexOf(prefix) > -1) {
          item.replacementPrefix = prefix;
          item.type = 'tag';
          item.latexType = 'environment';
          suggestions.push(item);
        }
      }
      suggestions.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        return 1;
      });
      return suggestions;
    };

    Environment.prototype.suggestions = {
      latex: {
        figure: {
          text: 'figure',
          additionalInsert: '\\caption{title}'
        },
        table: {
          text: 'table',
          additionalInsert: '\\caption{title}'
        },
        description: {
          text: 'description',
          additionalInsert: '\\item [label] '
        },
        enumerate: {
          text: 'enumerate',
          additionalInsert: '\\item '
        },
        itemize: {
          text: 'itemize',
          additionalInsert: '\\item '
        },
        math: {
          text: 'math'
        },
        displaymath: {
          text: 'displaymath'
        },
        split: {
          text: 'split'
        },
        array: {
          text: 'array'
        },
        eqnarray: {
          text: 'eqnarray'
        },
        equation: {
          text: 'equation'
        },
        equationAst: {
          text: 'equation*'
        },
        subequations: {
          text: 'subequations'
        },
        subequationsAst: {
          text: 'subequations*'
        },
        multiline: {
          text: 'multiline'
        },
        multilineAst: {
          text: 'multiline*'
        },
        gather: {
          text: 'gather'
        },
        gatherAst: {
          text: 'gather*'
        },
        align: {
          text: 'align'
        },
        alignAst: {
          text: 'align*'
        },
        alignat: {
          text: 'alignat'
        },
        alignatAst: {
          text: 'alignat*'
        },
        flalign: {
          text: 'flalign'
        },
        flalignAst: {
          text: 'flalign*'
        },
        theorem: {
          text: 'theorem'
        },
        cases: {
          text: 'cases'
        },
        center: {
          text: 'center'
        },
        flushleft: {
          text: 'flushleft'
        },
        flushright: {
          text: 'flushright'
        },
        minipage: {
          text: 'minipage'
        },
        quotation: {
          text: 'quotation'
        },
        quote: {
          text: 'quote'
        },
        verbatim: {
          text: 'verbatim'
        },
        verse: {
          text: 'verse'
        },
        picture: {
          text: 'picture'
        },
        tabbing: {
          text: 'tabbing'
        },
        tabular: {
          text: 'tabular'
        },
        thebibliography: {
          text: 'thebibliography'
        },
        titlepage: {
          text: 'titlepage'
        }
      }
    };

    return Environment;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9lbnZpcm9ubWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLHFCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBREU7OzBCQUdiLE9BQUEsR0FBUyxTQUFDLE1BQUQ7QUFDUCxVQUFBO01BQUEsV0FBQSxHQUFjO0FBQ2QsV0FBQSw2QkFBQTtRQUNFLElBQUEsR0FBTyxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQU0sQ0FBQSxHQUFBO1FBQzFCLElBQUcsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBakIsSUFBc0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFWLENBQWtCLE1BQWxCLENBQUEsR0FBNEIsQ0FBQyxDQUF0RDtVQUNFLElBQUksQ0FBQyxpQkFBTCxHQUF5QjtVQUN6QixJQUFJLENBQUMsSUFBTCxHQUFZO1VBQ1osSUFBSSxDQUFDLFNBQUwsR0FBaUI7VUFDakIsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBakIsRUFKRjs7QUFGRjtNQU9BLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7UUFDZixJQUFhLENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQXhCO0FBQUEsaUJBQU8sQ0FBQyxFQUFSOztBQUNBLGVBQU87TUFGUSxDQUFqQjtBQUdBLGFBQU87SUFaQTs7MEJBY1QsV0FBQSxHQUNFO01BQUEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47VUFDQSxnQkFBQSxFQUFrQixrQkFEbEI7U0FERjtRQUdBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxPQUFOO1VBQ0EsZ0JBQUEsRUFBa0Isa0JBRGxCO1NBSkY7UUFNQSxXQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sYUFBTjtVQUNBLGdCQUFBLEVBQWtCLGlCQURsQjtTQVBGO1FBU0EsU0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFdBQU47VUFDQSxnQkFBQSxFQUFrQixTQURsQjtTQVZGO1FBWUEsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47VUFDQSxnQkFBQSxFQUFrQixTQURsQjtTQWJGO1FBZUEsSUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE1BQU47U0FoQkY7UUFpQkEsV0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLGFBQU47U0FsQkY7UUFtQkEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0FwQkY7UUFxQkEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0F0QkY7UUF1QkEsUUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFVBQU47U0F4QkY7UUF5QkEsUUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFVBQU47U0ExQkY7UUEyQkEsV0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFdBQU47U0E1QkY7UUE2QkEsWUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLGNBQU47U0E5QkY7UUErQkEsZUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLGVBQU47U0FoQ0Y7UUFpQ0EsU0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFdBQU47U0FsQ0Y7UUFtQ0EsWUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFlBQU47U0FwQ0Y7UUFxQ0EsTUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0F0Q0Y7UUF1Q0EsU0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0F4Q0Y7UUF5Q0EsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0ExQ0Y7UUEyQ0EsUUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0E1Q0Y7UUE2Q0EsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0E5Q0Y7UUErQ0EsVUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFVBQU47U0FoREY7UUFpREEsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0FsREY7UUFtREEsVUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFVBQU47U0FwREY7UUFxREEsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0F0REY7UUF1REEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0F4REY7UUF5REEsTUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0ExREY7UUEyREEsU0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFdBQU47U0E1REY7UUE2REEsVUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFlBQU47U0E5REY7UUErREEsUUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFVBQU47U0FoRUY7UUFpRUEsU0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFdBQU47U0FsRUY7UUFtRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0FwRUY7UUFxRUEsUUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFVBQU47U0F0RUY7UUF1RUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0F4RUY7UUF5RUEsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0ExRUY7UUEyRUEsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0E1RUY7UUE2RUEsT0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0E5RUY7UUErRUEsZUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLGlCQUFOO1NBaEZGO1FBaUZBLFNBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxXQUFOO1NBbEZGO09BREY7Ozs7O0tBbkJzQjtBQUgxQiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRW52aXJvbm1lbnQgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcblxuICBwcm92aWRlOiAocHJlZml4KSAtPlxuICAgIHN1Z2dlc3Rpb25zID0gW11cbiAgICBmb3IgZW52IG9mIEBzdWdnZXN0aW9ucy5sYXRleFxuICAgICAgaXRlbSA9IEBzdWdnZXN0aW9ucy5sYXRleFtlbnZdXG4gICAgICBpZiBwcmVmaXgubGVuZ3RoIGlzIDAgb3IgaXRlbS50ZXh0LmluZGV4T2YocHJlZml4KSA+IC0xXG4gICAgICAgIGl0ZW0ucmVwbGFjZW1lbnRQcmVmaXggPSBwcmVmaXhcbiAgICAgICAgaXRlbS50eXBlID0gJ3RhZydcbiAgICAgICAgaXRlbS5sYXRleFR5cGUgPSAnZW52aXJvbm1lbnQnXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2ggaXRlbVxuICAgIHN1Z2dlc3Rpb25zLnNvcnQoKGEsIGIpIC0+XG4gICAgICByZXR1cm4gLTEgaWYgYS50ZXh0IDwgYi50ZXh0XG4gICAgICByZXR1cm4gMSlcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICBzdWdnZXN0aW9uczpcbiAgICBsYXRleDpcbiAgICAgIGZpZ3VyZTpcbiAgICAgICAgdGV4dDogJ2ZpZ3VyZSdcbiAgICAgICAgYWRkaXRpb25hbEluc2VydDogJ1xcXFxjYXB0aW9ue3RpdGxlfSdcbiAgICAgIHRhYmxlOlxuICAgICAgICB0ZXh0OiAndGFibGUnXG4gICAgICAgIGFkZGl0aW9uYWxJbnNlcnQ6ICdcXFxcY2FwdGlvbnt0aXRsZX0nXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgdGV4dDogJ2Rlc2NyaXB0aW9uJ1xuICAgICAgICBhZGRpdGlvbmFsSW5zZXJ0OiAnXFxcXGl0ZW0gW2xhYmVsXSAnXG4gICAgICBlbnVtZXJhdGU6XG4gICAgICAgIHRleHQ6ICdlbnVtZXJhdGUnXG4gICAgICAgIGFkZGl0aW9uYWxJbnNlcnQ6ICdcXFxcaXRlbSAnXG4gICAgICBpdGVtaXplOlxuICAgICAgICB0ZXh0OiAnaXRlbWl6ZSdcbiAgICAgICAgYWRkaXRpb25hbEluc2VydDogJ1xcXFxpdGVtICdcbiAgICAgIG1hdGg6XG4gICAgICAgIHRleHQ6ICdtYXRoJ1xuICAgICAgZGlzcGxheW1hdGg6XG4gICAgICAgIHRleHQ6ICdkaXNwbGF5bWF0aCdcbiAgICAgIHNwbGl0OlxuICAgICAgICB0ZXh0OiAnc3BsaXQnXG4gICAgICBhcnJheTpcbiAgICAgICAgdGV4dDogJ2FycmF5J1xuICAgICAgZXFuYXJyYXk6XG4gICAgICAgIHRleHQ6ICdlcW5hcnJheSdcbiAgICAgIGVxdWF0aW9uOlxuICAgICAgICB0ZXh0OiAnZXF1YXRpb24nXG4gICAgICBlcXVhdGlvbkFzdDpcbiAgICAgICAgdGV4dDogJ2VxdWF0aW9uKidcbiAgICAgIHN1YmVxdWF0aW9uczpcbiAgICAgICAgdGV4dDogJ3N1YmVxdWF0aW9ucydcbiAgICAgIHN1YmVxdWF0aW9uc0FzdDpcbiAgICAgICAgdGV4dDogJ3N1YmVxdWF0aW9ucyonXG4gICAgICBtdWx0aWxpbmU6XG4gICAgICAgIHRleHQ6ICdtdWx0aWxpbmUnXG4gICAgICBtdWx0aWxpbmVBc3Q6XG4gICAgICAgIHRleHQ6ICdtdWx0aWxpbmUqJ1xuICAgICAgZ2F0aGVyOlxuICAgICAgICB0ZXh0OiAnZ2F0aGVyJ1xuICAgICAgZ2F0aGVyQXN0OlxuICAgICAgICB0ZXh0OiAnZ2F0aGVyKidcbiAgICAgIGFsaWduOlxuICAgICAgICB0ZXh0OiAnYWxpZ24nXG4gICAgICBhbGlnbkFzdDpcbiAgICAgICAgdGV4dDogJ2FsaWduKidcbiAgICAgIGFsaWduYXQ6XG4gICAgICAgIHRleHQ6ICdhbGlnbmF0J1xuICAgICAgYWxpZ25hdEFzdDpcbiAgICAgICAgdGV4dDogJ2FsaWduYXQqJ1xuICAgICAgZmxhbGlnbjpcbiAgICAgICAgdGV4dDogJ2ZsYWxpZ24nXG4gICAgICBmbGFsaWduQXN0OlxuICAgICAgICB0ZXh0OiAnZmxhbGlnbionXG4gICAgICB0aGVvcmVtOlxuICAgICAgICB0ZXh0OiAndGhlb3JlbSdcbiAgICAgIGNhc2VzOlxuICAgICAgICB0ZXh0OiAnY2FzZXMnXG4gICAgICBjZW50ZXI6XG4gICAgICAgIHRleHQ6ICdjZW50ZXInXG4gICAgICBmbHVzaGxlZnQ6XG4gICAgICAgIHRleHQ6ICdmbHVzaGxlZnQnXG4gICAgICBmbHVzaHJpZ2h0OlxuICAgICAgICB0ZXh0OiAnZmx1c2hyaWdodCdcbiAgICAgIG1pbmlwYWdlOlxuICAgICAgICB0ZXh0OiAnbWluaXBhZ2UnXG4gICAgICBxdW90YXRpb246XG4gICAgICAgIHRleHQ6ICdxdW90YXRpb24nXG4gICAgICBxdW90ZTpcbiAgICAgICAgdGV4dDogJ3F1b3RlJ1xuICAgICAgdmVyYmF0aW06XG4gICAgICAgIHRleHQ6ICd2ZXJiYXRpbSdcbiAgICAgIHZlcnNlOlxuICAgICAgICB0ZXh0OiAndmVyc2UnXG4gICAgICBwaWN0dXJlOlxuICAgICAgICB0ZXh0OiAncGljdHVyZSdcbiAgICAgIHRhYmJpbmc6XG4gICAgICAgIHRleHQ6ICd0YWJiaW5nJ1xuICAgICAgdGFidWxhcjpcbiAgICAgICAgdGV4dDogJ3RhYnVsYXInXG4gICAgICB0aGViaWJsaW9ncmFwaHk6XG4gICAgICAgIHRleHQ6ICd0aGViaWJsaW9ncmFwaHknXG4gICAgICB0aXRsZXBhZ2U6XG4gICAgICAgIHRleHQ6ICd0aXRsZXBhZ2UnXG4iXX0=
