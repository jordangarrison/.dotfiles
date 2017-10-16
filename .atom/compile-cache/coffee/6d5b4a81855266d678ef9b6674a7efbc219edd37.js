(function() {
  var Disposable, Provider,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  module.exports = Provider = (function(superClass) {
    extend(Provider, superClass);

    function Provider() {}

    Provider.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    Provider.prototype.lazyLoad = function(latex) {
      var Citation, Command, Environment, Reference, SubFiles, Syntax;
      this.latex = latex;
      Citation = require('./autocomplete/citation');
      Reference = require('./autocomplete/reference');
      Environment = require('./autocomplete/environment');
      Command = require('./autocomplete/command');
      Syntax = require('./autocomplete/syntax');
      SubFiles = require('./autocomplete/subFiles');
      this.citation = new Citation(this.latex);
      this.reference = new Reference(this.latex);
      this.environment = new Environment(this.latex);
      this.command = new Command(this.latex);
      this.syntax = new Syntax(this.latex);
      return this.subFiles = new SubFiles(this.latex);
    };

    Provider.prototype.provider = {
      selector: '.text.tex.latex',
      inclusionPriority: 1,
      suggestionPriority: 2,
      getSuggestions: function(arg) {
        var bufferPosition, editor;
        editor = arg.editor, bufferPosition = arg.bufferPosition;
        return new Promise(function(resolve) {
          var command, i, len, line, ref, suggestions;
          line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
          if (line[line.length - 1] === '{') {
            atom.packages.getActivePackage('autocomplete-plus').mainModule.autocompleteManager.shouldDisplaySuggestions = true;
          }
          ref = ['citation', 'reference', 'environment', 'command', 'subFiles'];
          for (i = 0, len = ref.length; i < len; i++) {
            command = ref[i];
            suggestions = atom_latex.latex.provider.completeCommand(line, command);
            if (suggestions != null) {
              resolve(suggestions);
            }
          }
          return resolve([]);
        });
      },
      onDidInsertSuggestion: function(arg) {
        var editor, lines, rowContent, suggestion, triggerPosition;
        editor = arg.editor, triggerPosition = arg.triggerPosition, suggestion = arg.suggestion;
        if (suggestion.chainComplete) {
          setTimeout((function() {
            return atom.packages.getActivePackage('autocomplete-plus').mainModule.autocompleteManager.findSuggestions();
          }), 100);
        }
        if (suggestion.latexType === 'environment') {
          lines = editor.getBuffer().getLines();
          rowContent = lines[triggerPosition.row].slice(0, triggerPosition.column);
          if (rowContent.indexOf('\\end') > rowContent.indexOf('\\begin')) {
            editor.setCursorBufferPosition({
              row: triggerPosition.row - 1,
              column: lines[triggerPosition.row - 1].length
            });
            if (suggestion.additionalInsert != null) {
              return editor.insertText(suggestion.additionalInsert);
            }
          }
        }
      }
    };

    Provider.prototype.completeCommand = function(line, type) {
      var allKeys, currentPrefix, prefix, provider, reg, result, suggestions;
      switch (type) {
        case 'citation':
          reg = /(?:\\[a-zA-Z]*cite[a-zA-Z]*(?:\[[^\[\]]*\])?){([^}]*)$/;
          provider = this.citation;
          break;
        case 'reference':
          reg = /(?:\\[a-zA-Z]*ref[a-zA-Z]*(?:\[[^\[\]]*\])?){([^}]*)$/;
          provider = this.reference;
          break;
        case 'environment':
          reg = /(?:\\(?:begin|end)(?:\[[^\[\]]*\])?){([^}]*)$/;
          provider = this.environment;
          break;
        case 'command':
          reg = /\\([a-zA-Z]*)$/;
          provider = this.command;
          break;
        case 'subFiles':
          reg = /(?:\\(?:input|include|subfile|includegraphics|addbibresource)(?:\[[^\[\]]*\])?){([^}]*)$/;
          provider = this.subFiles;
      }
      result = line.match(reg);
      if (result) {
        prefix = result[1];
        if (['environment', 'command'].indexOf(type) > -1) {
          currentPrefix = prefix;
        } else {
          allKeys = prefix.split(',');
          currentPrefix = allKeys[allKeys.length - 1].trim();
        }
        suggestions = provider.provide(currentPrefix);
        if (type === 'subFiles') {
          if (line.match(/(?:\\(?:includegraphics)(?:\[[^\[\]]*\])?){([^}]*)$/)) {
            suggestions = provider.provide(currentPrefix, 'files-img');
          } else if (line.match(/(?:\\(?:addbibresource)(?:\[[^\[\]]*\])?){([^}]*)$/)) {
            suggestions = provider.provide(currentPrefix, 'files-bib');
          }
        }
      }
      return suggestions;
    };

    return Provider;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3Byb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQTs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1Msa0JBQUEsR0FBQTs7dUJBRWIsVUFBQSxHQUFZLFNBQUE7QUFDVixhQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBREc7O3VCQUdaLFFBQUEsR0FBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUVULFFBQUEsR0FBVyxPQUFBLENBQVEseUJBQVI7TUFDWCxTQUFBLEdBQVksT0FBQSxDQUFRLDBCQUFSO01BQ1osV0FBQSxHQUFjLE9BQUEsQ0FBUSw0QkFBUjtNQUNkLE9BQUEsR0FBVSxPQUFBLENBQVEsd0JBQVI7TUFDVixNQUFBLEdBQVMsT0FBQSxDQUFRLHVCQUFSO01BQ1QsUUFBQSxHQUFXLE9BQUEsQ0FBUSx5QkFBUjtNQUNYLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFTLElBQUMsQ0FBQSxLQUFWO01BQ2hCLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQUMsQ0FBQSxLQUFYO01BQ2pCLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxLQUFiO01BQ25CLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxPQUFBLENBQVEsSUFBQyxDQUFBLEtBQVQ7TUFDZixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxLQUFSO2FBQ2QsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxRQUFBLENBQVMsSUFBQyxDQUFBLEtBQVY7SUFkUjs7dUJBZ0JW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QUcsQ0FBQyxhQUFELEVBQWdCLFNBQWhCLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsSUFBbkMsQ0FBQSxHQUEyQyxDQUFDLENBQS9DO1VBQ0UsYUFBQSxHQUFnQixPQURsQjtTQUFBLE1BQUE7VUFHRSxPQUFBLEdBQVUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxHQUFiO1VBQ1YsYUFBQSxHQUFnQixPQUFRLENBQUEsT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FBakIsQ0FBbUIsQ0FBQyxJQUE1QixDQUFBLEVBSmxCOztRQUtBLFdBQUEsR0FBYyxRQUFRLENBQUMsT0FBVCxDQUFpQixhQUFqQjtRQUNkLElBQUcsSUFBQSxLQUFRLFVBQVg7VUFDRSxJQUFHLElBQUksQ0FBQyxLQUFMLENBQVcscURBQVgsQ0FBSDtZQUNFLFdBQUEsR0FBYyxRQUFRLENBQUMsT0FBVCxDQUFpQixhQUFqQixFQUErQixXQUEvQixFQURoQjtXQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsS0FBTCxDQUFXLG9EQUFYLENBQUg7WUFDSCxXQUFBLEdBQWMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsYUFBakIsRUFBK0IsV0FBL0IsRUFEWDtXQUhQO1NBUkY7O0FBYUEsYUFBTztJQWhDUTs7OztLQXRESTtBQUh2QiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAtPlxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgcmV0dXJuIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICBsYXp5TG9hZDogKGxhdGV4KSAtPlxuICAgIEBsYXRleCA9IGxhdGV4XG5cbiAgICBDaXRhdGlvbiA9IHJlcXVpcmUgJy4vYXV0b2NvbXBsZXRlL2NpdGF0aW9uJ1xuICAgIFJlZmVyZW5jZSA9IHJlcXVpcmUgJy4vYXV0b2NvbXBsZXRlL3JlZmVyZW5jZSdcbiAgICBFbnZpcm9ubWVudCA9IHJlcXVpcmUgJy4vYXV0b2NvbXBsZXRlL2Vudmlyb25tZW50J1xuICAgIENvbW1hbmQgPSByZXF1aXJlICcuL2F1dG9jb21wbGV0ZS9jb21tYW5kJ1xuICAgIFN5bnRheCA9IHJlcXVpcmUgJy4vYXV0b2NvbXBsZXRlL3N5bnRheCdcbiAgICBTdWJGaWxlcyA9IHJlcXVpcmUgJy4vYXV0b2NvbXBsZXRlL3N1YkZpbGVzJ1xuICAgIEBjaXRhdGlvbiA9IG5ldyBDaXRhdGlvbihAbGF0ZXgpXG4gICAgQHJlZmVyZW5jZSA9IG5ldyBSZWZlcmVuY2UoQGxhdGV4KVxuICAgIEBlbnZpcm9ubWVudCA9IG5ldyBFbnZpcm9ubWVudChAbGF0ZXgpXG4gICAgQGNvbW1hbmQgPSBuZXcgQ29tbWFuZChAbGF0ZXgpXG4gICAgQHN5bnRheCA9IG5ldyBTeW50YXgoQGxhdGV4KVxuICAgIEBzdWJGaWxlcyA9IG5ldyBTdWJGaWxlcyhAbGF0ZXgpXG5cbiAgcHJvdmlkZXI6XG4gICAgc2VsZWN0b3I6ICcudGV4dC50ZXgubGF0ZXgnXG4gICAgaW5jbHVzaW9uUHJpb3JpdHk6IDFcbiAgICBzdWdnZXN0aW9uUHJpb3JpdHk6IDJcbiAgICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9ufSkgLT5cbiAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgICAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuICAgICAgICBpZiBsaW5lW2xpbmUubGVuZ3RoIC0gMV0gaXMgJ3snXG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdhdXRvY29tcGxldGUtcGx1cycpXFxcbiAgICAgICAgICAgIC5tYWluTW9kdWxlLmF1dG9jb21wbGV0ZU1hbmFnZXIuc2hvdWxkRGlzcGxheVN1Z2dlc3Rpb25zID0gdHJ1ZVxuXG4gICAgICAgIGZvciBjb21tYW5kIGluIFsnY2l0YXRpb24nLCAncmVmZXJlbmNlJywgJ2Vudmlyb25tZW50JywgJ2NvbW1hbmQnLCAnc3ViRmlsZXMnXVxuICAgICAgICAgIHN1Z2dlc3Rpb25zID0gYXRvbV9sYXRleC5sYXRleC5wcm92aWRlci5jb21wbGV0ZUNvbW1hbmQobGluZSwgY29tbWFuZClcbiAgICAgICAgICByZXNvbHZlKHN1Z2dlc3Rpb25zKSBpZiBzdWdnZXN0aW9ucz9cblxuICAgICAgICByZXNvbHZlKFtdKVxuXG4gICAgb25EaWRJbnNlcnRTdWdnZXN0aW9uOiAoe2VkaXRvciwgdHJpZ2dlclBvc2l0aW9uLCBzdWdnZXN0aW9ufSkgLT5cbiAgICAgIGlmIHN1Z2dlc3Rpb24uY2hhaW5Db21wbGV0ZVxuICAgICAgICBzZXRUaW1lb3V0KCggLT4gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdhdXRvY29tcGxldGUtcGx1cycpXFxcbiAgICAgICAgICAubWFpbk1vZHVsZS5hdXRvY29tcGxldGVNYW5hZ2VyLmZpbmRTdWdnZXN0aW9ucygpKSwgMTAwKVxuICAgICAgaWYgc3VnZ2VzdGlvbi5sYXRleFR5cGUgaXMgJ2Vudmlyb25tZW50J1xuICAgICAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgICAgIHJvd0NvbnRlbnQgPSBsaW5lc1t0cmlnZ2VyUG9zaXRpb24ucm93XS5zbGljZSgwLCB0cmlnZ2VyUG9zaXRpb24uY29sdW1uKVxuICAgICAgICBpZiByb3dDb250ZW50LmluZGV4T2YoJ1xcXFxlbmQnKSA+IHJvd0NvbnRlbnQuaW5kZXhPZignXFxcXGJlZ2luJylcbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oXG4gICAgICAgICAgICByb3c6IHRyaWdnZXJQb3NpdGlvbi5yb3cgLSAxXG4gICAgICAgICAgICBjb2x1bW46IGxpbmVzW3RyaWdnZXJQb3NpdGlvbi5yb3cgLSAxXS5sZW5ndGhcbiAgICAgICAgICApXG4gICAgICAgICAgaWYgc3VnZ2VzdGlvbi5hZGRpdGlvbmFsSW5zZXJ0P1xuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoc3VnZ2VzdGlvbi5hZGRpdGlvbmFsSW5zZXJ0KVxuXG4gIGNvbXBsZXRlQ29tbWFuZDogKGxpbmUsIHR5cGUpIC0+XG4gICAgc3dpdGNoIHR5cGVcbiAgICAgIHdoZW4gJ2NpdGF0aW9uJ1xuICAgICAgICByZWcgPSAvKD86XFxcXFthLXpBLVpdKmNpdGVbYS16QS1aXSooPzpcXFtbXlxcW1xcXV0qXFxdKT8peyhbXn1dKikkL1xuICAgICAgICBwcm92aWRlciA9IEBjaXRhdGlvblxuICAgICAgd2hlbiAncmVmZXJlbmNlJ1xuICAgICAgICByZWcgPSAvKD86XFxcXFthLXpBLVpdKnJlZlthLXpBLVpdKig/OlxcW1teXFxbXFxdXSpcXF0pPyl7KFtefV0qKSQvXG4gICAgICAgIHByb3ZpZGVyID0gQHJlZmVyZW5jZVxuICAgICAgd2hlbiAnZW52aXJvbm1lbnQnXG4gICAgICAgIHJlZyA9IC8oPzpcXFxcKD86YmVnaW58ZW5kKSg/OlxcW1teXFxbXFxdXSpcXF0pPyl7KFtefV0qKSQvXG4gICAgICAgIHByb3ZpZGVyID0gQGVudmlyb25tZW50XG4gICAgICB3aGVuICdjb21tYW5kJ1xuICAgICAgICByZWcgPSAvXFxcXChbYS16QS1aXSopJC9cbiAgICAgICAgcHJvdmlkZXIgPSBAY29tbWFuZFxuICAgICAgd2hlbiAnc3ViRmlsZXMnXG4gICAgICAgIHJlZyA9IC8oPzpcXFxcKD86aW5wdXR8aW5jbHVkZXxzdWJmaWxlfGluY2x1ZGVncmFwaGljc3xhZGRiaWJyZXNvdXJjZSkoPzpcXFtbXlxcW1xcXV0qXFxdKT8peyhbXn1dKikkL1xuICAgICAgICBwcm92aWRlciA9IEBzdWJGaWxlc1xuXG4gICAgcmVzdWx0ID0gbGluZS5tYXRjaChyZWcpXG4gICAgaWYgcmVzdWx0XG4gICAgICBwcmVmaXggPSByZXN1bHRbMV1cbiAgICAgIGlmIFsnZW52aXJvbm1lbnQnLCAnY29tbWFuZCddLmluZGV4T2YodHlwZSkgPiAtMVxuICAgICAgICBjdXJyZW50UHJlZml4ID0gcHJlZml4XG4gICAgICBlbHNlXG4gICAgICAgIGFsbEtleXMgPSBwcmVmaXguc3BsaXQoJywnKVxuICAgICAgICBjdXJyZW50UHJlZml4ID0gYWxsS2V5c1thbGxLZXlzLmxlbmd0aCAtIDFdLnRyaW0oKVxuICAgICAgc3VnZ2VzdGlvbnMgPSBwcm92aWRlci5wcm92aWRlKGN1cnJlbnRQcmVmaXgpXG4gICAgICBpZiB0eXBlID09ICdzdWJGaWxlcydcbiAgICAgICAgaWYgbGluZS5tYXRjaCgvKD86XFxcXCg/OmluY2x1ZGVncmFwaGljcykoPzpcXFtbXlxcW1xcXV0qXFxdKT8peyhbXn1dKikkLylcbiAgICAgICAgICBzdWdnZXN0aW9ucyA9IHByb3ZpZGVyLnByb3ZpZGUoY3VycmVudFByZWZpeCwnZmlsZXMtaW1nJylcbiAgICAgICAgZWxzZSBpZiBsaW5lLm1hdGNoKC8oPzpcXFxcKD86YWRkYmlicmVzb3VyY2UpKD86XFxbW15cXFtcXF1dKlxcXSk/KXsoW159XSopJC8pXG4gICAgICAgICAgc3VnZ2VzdGlvbnMgPSBwcm92aWRlci5wcm92aWRlKGN1cnJlbnRQcmVmaXgsJ2ZpbGVzLWJpYicpXG4gICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4iXX0=
