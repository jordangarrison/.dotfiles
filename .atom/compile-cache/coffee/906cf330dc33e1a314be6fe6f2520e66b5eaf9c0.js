(function() {
  var Command, Disposable, fs, latexSymbols, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  path = require('path');

  fs = require('fs');

  latexSymbols = require('latex-symbols-list');

  module.exports = Command = (function(superClass) {
    extend(Command, superClass);

    function Command(latex) {
      this.latex = latex;
      this.additionalSuggestions = [];
      this.items = {};
    }

    Command.prototype.provide = function(prefix) {
      var currentContent, currentPath, editor, i, item, key, len, pkg, ref, ref1, suggestions, texItems;
      suggestions = this.predefinedCommands(prefix);
      if (prefix.length > 0) {
        ref = this.additionalSuggestions;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.displayText.indexOf(prefix) > -1) {
            item.replacementPrefix = prefix;
            suggestions.push(item);
          }
        }
        suggestions.sort(function(a, b) {
          if (a.displayText.indexOf(prefix) !== b.displayText.indexOf(prefix)) {
            return a.displayText.indexOf(prefix) - b.displayText.indexOf(prefix);
          } else {
            return b.counts - a.counts;
          }
        });
        return suggestions;
      }
      if (!this.latex.manager.findAll()) {
        return suggestions;
      }
      this.additionalSuggestions = [];
      editor = atom.workspace.getActivePaneItem();
      currentPath = editor != null ? (ref1 = editor.buffer.file) != null ? ref1.path : void 0 : void 0;
      currentContent = editor != null ? editor.getText() : void 0;
      if (currentPath && currentContent) {
        if (this.latex.manager.isTexFile(currentPath)) {
          texItems = this.getCommandsFromContent(currentContent);
          for (key in texItems) {
            if (!(key in this.items)) {
              this.items[key] = texItems[key];
            }
          }
        }
      }
      for (key in this.items) {
        for (pkg in this.suggestions) {
          if (!(key in this.suggestions[pkg])) {
            this.additionalSuggestions.push(this.items[key]);
          }
        }
      }
      suggestions = suggestions.concat(this.additionalSuggestions);
      suggestions.sort(function(a, b) {
        if (a.counts > b.counts) {
          return -1;
        }
        return 1;
      });
      suggestions.unshift({
        text: '\n',
        displayText: 'Press ENTER for new line.',
        chainComplete: false,
        replacementPrefix: '',
        latexType: 'command'
      });
      return suggestions;
    };

    Command.prototype.predefinedCommands = function(prefix) {
      var env, i, item, len, suggestions, symbol;
      suggestions = [];
      for (env in this.suggestions.latex) {
        item = this.suggestions.latex[env];
        if (prefix.length === 0 || env.indexOf(prefix) > -1) {
          item.replacementPrefix = prefix;
          item.type = 'function';
          item.latexType = 'command';
          suggestions.push(item);
        }
      }
      for (i = 0, len = latexSymbols.length; i < len; i++) {
        symbol = latexSymbols[i];
        if (prefix.length === 0 || symbol.indexOf(prefix) > -1) {
          if (symbol[0] !== '\\') {
            continue;
          }
          suggestions.push({
            displayText: symbol.slice(1),
            snippet: symbol.slice(1),
            chainComplete: false,
            replacementPrefix: prefix,
            type: 'function',
            latexType: 'command',
            counts: 0
          });
        }
      }
      return suggestions;
    };

    Command.prototype.getCommands = function(tex) {
      var content, key, results, texItems;
      if (!fs.existsSync(tex)) {
        return {};
      }
      content = fs.readFileSync(tex, 'utf-8');
      texItems = this.getCommandsFromContent(content);
      results = [];
      for (key in texItems) {
        if (!(key in this.items)) {
          results.push(this.items[key] = texItems[key]);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Command.prototype.getCommandsFromContent = function(content) {
      var chainComplete, itemReg, items, result, snippet;
      items = {};
      itemReg = /\\([a-zA-Z]+)({[^{}]*})?({[^{}]*})?({[^{}]*})?/g;
      while (true) {
        result = itemReg.exec(content);
        if (result == null) {
          break;
        }
        if (!(result[1] in items)) {
          if (result[2]) {
            chainComplete = true;
            snippet = result[1] + '{$1}';
            if (result[3]) {
              snippet += '{$2}';
              if (result[4]) {
                snippet += '{$3}';
              }
            }
          } else {
            chainComplete = false;
            snippet = result[1];
          }
          items[result[1]] = {
            displayText: result[1],
            snippet: snippet,
            type: 'function',
            latexType: 'command',
            chainComplete: chainComplete,
            counts: 1
          };
        } else {
          items[result[1]].counts += 1;
        }
      }
      return items;
    };

    Command.prototype.resetCommands = function() {
      return this.items = {};
    };

    Command.prototype.suggestions = {
      latex: {
        begin: {
          displayText: 'begin',
          snippet: 'begin{$1}\n\t$2\n\\\\end{$1}',
          chainComplete: true
        },
        cite: {
          displayText: 'cite',
          snippet: 'cite{$1}$2',
          chainComplete: true
        },
        ref: {
          displayText: 'ref',
          snippet: 'ref{$1}$2',
          chainComplete: true
        },
        input: {
          displayText: 'input',
          snippet: 'input{$1}$2',
          chainComplete: true
        },
        include: {
          displayText: 'include',
          snippet: 'include{$1}$2',
          chainComplete: true
        },
        subfile: {
          displayText: 'subfile',
          snippet: 'subfile{$1}$2',
          chainComplete: true
        },
        includegraphics: {
          displayText: 'includegraphics',
          snippet: 'includegraphics{$1}$2',
          chainComplete: true
        }
      }
    };

    return Command;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9jb21tYW5kLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxZQUFBLEdBQWUsT0FBQSxDQUFRLG9CQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGlCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLHFCQUFELEdBQXlCO01BQ3pCLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFIRTs7c0JBSWIsT0FBQSxHQUFTLFNBQUMsTUFBRDtBQUNQLFVBQUE7TUFBQSxXQUFBLEdBQWMsSUFBQyxDQUFBLGtCQUFELENBQW9CLE1BQXBCO01BQ2QsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtBQUNFO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxJQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBakIsQ0FBeUIsTUFBekIsQ0FBQSxHQUFtQyxDQUFDLENBQXZDO1lBQ0UsSUFBSSxDQUFDLGlCQUFMLEdBQXlCO1lBQ3pCLFdBQVcsQ0FBQyxJQUFaLENBQWlCLElBQWpCLEVBRkY7O0FBREY7UUFJQSxXQUFXLENBQUMsSUFBWixDQUFpQixTQUFDLENBQUQsRUFBSSxDQUFKO1VBQ2YsSUFBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQWQsQ0FBc0IsTUFBdEIsQ0FBQSxLQUFtQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQWQsQ0FBc0IsTUFBdEIsQ0FBdEM7QUFDRSxtQkFBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQWQsQ0FBc0IsTUFBdEIs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aUJBQWI7VUFDQSxPQUFBLEVBQVMsdUJBRFQ7VUFFQSxhQUFBLEVBQWUsSUFGZjtTQXpCRjtPQURGOzs7OztLQS9Ha0I7QUFOdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMnXG5sYXRleFN5bWJvbHMgPSByZXF1aXJlKCdsYXRleC1zeW1ib2xzLWxpc3QnKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb21tYW5kIGV4dGVuZHMgRGlzcG9zYWJsZVxuICBjb25zdHJ1Y3RvcjogKGxhdGV4KSAtPlxuICAgIEBsYXRleCA9IGxhdGV4XG4gICAgQGFkZGl0aW9uYWxTdWdnZXN0aW9ucyA9IFtdXG4gICAgQGl0ZW1zID0ge31cbiAgcHJvdmlkZTogKHByZWZpeCkgLT5cbiAgICBzdWdnZXN0aW9ucyA9IEBwcmVkZWZpbmVkQ29tbWFuZHMocHJlZml4KVxuICAgIGlmIHByZWZpeC5sZW5ndGggPiAwXG4gICAgICBmb3IgaXRlbSBpbiBAYWRkaXRpb25hbFN1Z2dlc3Rpb25zXG4gICAgICAgIGlmIGl0ZW0uZGlzcGxheVRleHQuaW5kZXhPZihwcmVmaXgpID4gLTFcbiAgICAgICAgICBpdGVtLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG4gICAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgICBpZiBhLmRpc3BsYXlUZXh0LmluZGV4T2YocHJlZml4KSBpc250IGIuZGlzcGxheVRleHQuaW5kZXhPZihwcmVmaXgpXG4gICAgICAgICAgcmV0dXJuIGEuZGlzcGxheVRleHQuaW5kZXhPZihwcmVmaXgpIC0gYi5kaXNwbGF5VGV4dC5pbmRleE9mKHByZWZpeClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBiLmNvdW50cyAtIGEuY291bnRzXG4gICAgICApXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZEFsbCgpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcbiAgICBAYWRkaXRpb25hbFN1Z2dlc3Rpb25zID0gW11cblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBjdXJyZW50UGF0aCA9IGVkaXRvcj8uYnVmZmVyLmZpbGU/LnBhdGhcbiAgICBjdXJyZW50Q29udGVudCA9IGVkaXRvcj8uZ2V0VGV4dCgpXG4gICAgaWYgY3VycmVudFBhdGggYW5kIGN1cnJlbnRDb250ZW50XG4gICAgICBpZiBAbGF0ZXgubWFuYWdlci5pc1RleEZpbGUoY3VycmVudFBhdGgpXG4gICAgICAgIHRleEl0ZW1zID0gQGdldENvbW1hbmRzRnJvbUNvbnRlbnQgY3VycmVudENvbnRlbnRcbiAgICAgICAgZm9yIGtleSBvZiB0ZXhJdGVtc1xuICAgICAgICAgIEBpdGVtc1trZXldID0gdGV4SXRlbXNba2V5XSBpZiBub3QgKGtleSBvZiBAaXRlbXMpXG4gICAgZm9yIGtleSBvZiBAaXRlbXNcbiAgICAgIGZvciBwa2cgb2YgQHN1Z2dlc3Rpb25zXG4gICAgICAgIGlmICEoa2V5IG9mIEBzdWdnZXN0aW9uc1twa2ddKVxuICAgICAgICAgIEBhZGRpdGlvbmFsU3VnZ2VzdGlvbnMucHVzaCBAaXRlbXNba2V5XVxuXG4gICAgc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucy5jb25jYXQgQGFkZGl0aW9uYWxTdWdnZXN0aW9uc1xuICAgIHN1Z2dlc3Rpb25zLnNvcnQoKGEsIGIpIC0+XG4gICAgICByZXR1cm4gLTEgaWYgYS5jb3VudHMgPiBiLmNvdW50c1xuICAgICAgcmV0dXJuIDEpXG4gICAgc3VnZ2VzdGlvbnMudW5zaGlmdChcbiAgICAgIHRleHQ6ICdcXG4nXG4gICAgICBkaXNwbGF5VGV4dDogJ1ByZXNzIEVOVEVSIGZvciBuZXcgbGluZS4nXG4gICAgICBjaGFpbkNvbXBsZXRlOiBmYWxzZVxuICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6ICcnXG4gICAgICBsYXRleFR5cGU6ICdjb21tYW5kJylcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICBwcmVkZWZpbmVkQ29tbWFuZHM6IChwcmVmaXgpIC0+XG4gICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIGZvciBlbnYgb2YgQHN1Z2dlc3Rpb25zLmxhdGV4XG4gICAgICBpdGVtID0gQHN1Z2dlc3Rpb25zLmxhdGV4W2Vudl1cbiAgICAgIGlmIHByZWZpeC5sZW5ndGggaXMgMCBvciBlbnYuaW5kZXhPZihwcmVmaXgpID4gLTFcbiAgICAgICAgaXRlbS5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgICAgICBpdGVtLnR5cGUgPSAnZnVuY3Rpb24nXG4gICAgICAgIGl0ZW0ubGF0ZXhUeXBlID0gJ2NvbW1hbmQnXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2ggaXRlbVxuICAgIGZvciBzeW1ib2wgaW4gbGF0ZXhTeW1ib2xzXG4gICAgICBpZiBwcmVmaXgubGVuZ3RoIGlzIDAgb3Igc3ltYm9sLmluZGV4T2YocHJlZml4KSA+IC0xXG4gICAgICAgIGlmIHN5bWJvbFswXSBpc250ICdcXFxcJ1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2hcbiAgICAgICAgICBkaXNwbGF5VGV4dDogc3ltYm9sLnNsaWNlKDEpXG4gICAgICAgICAgc25pcHBldDogc3ltYm9sLnNsaWNlKDEpXG4gICAgICAgICAgY2hhaW5Db21wbGV0ZTogZmFsc2VcbiAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4XG4gICAgICAgICAgdHlwZTogJ2Z1bmN0aW9uJ1xuICAgICAgICAgIGxhdGV4VHlwZTogJ2NvbW1hbmQnXG4gICAgICAgICAgY291bnRzOiAwXG4gICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG5cbiAgZ2V0Q29tbWFuZHM6ICh0ZXgpIC0+XG4gICAgaWYgIWZzLmV4aXN0c1N5bmModGV4KVxuICAgICAgcmV0dXJuIHt9XG4gICAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyB0ZXgsICd1dGYtOCdcbiAgICB0ZXhJdGVtcyA9IEBnZXRDb21tYW5kc0Zyb21Db250ZW50KGNvbnRlbnQpXG4gICAgZm9yIGtleSBvZiB0ZXhJdGVtc1xuICAgICAgQGl0ZW1zW2tleV0gPSB0ZXhJdGVtc1trZXldIGlmIG5vdCAoa2V5IG9mIEBpdGVtcylcblxuICBnZXRDb21tYW5kc0Zyb21Db250ZW50OiAoY29udGVudCkgLT5cbiAgICBpdGVtcyA9IHt9XG4gICAgaXRlbVJlZyA9IC9cXFxcKFthLXpBLVpdKykoe1tee31dKn0pPyh7W157fV0qfSk/KHtbXnt9XSp9KT8vZ1xuICAgIGxvb3BcbiAgICAgIHJlc3VsdCA9IGl0ZW1SZWcuZXhlYyBjb250ZW50XG4gICAgICBicmVhayBpZiAhcmVzdWx0P1xuICAgICAgaWYgbm90IChyZXN1bHRbMV0gb2YgaXRlbXMpXG4gICAgICAgIGlmIHJlc3VsdFsyXVxuICAgICAgICAgIGNoYWluQ29tcGxldGUgPSB0cnVlXG4gICAgICAgICAgc25pcHBldCA9IHJlc3VsdFsxXSArICd7JDF9J1xuICAgICAgICAgIGlmIHJlc3VsdFszXVxuICAgICAgICAgICAgc25pcHBldCArPSAneyQyfSdcbiAgICAgICAgICAgIGlmIHJlc3VsdFs0XVxuICAgICAgICAgICAgICBzbmlwcGV0ICs9ICd7JDN9J1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2hhaW5Db21wbGV0ZSA9IGZhbHNlXG4gICAgICAgICAgc25pcHBldCA9IHJlc3VsdFsxXVxuICAgICAgICBpdGVtc1tyZXN1bHRbMV1dID1cbiAgICAgICAgICBkaXNwbGF5VGV4dDogcmVzdWx0WzFdXG4gICAgICAgICAgc25pcHBldDogc25pcHBldFxuICAgICAgICAgIHR5cGU6ICdmdW5jdGlvbidcbiAgICAgICAgICBsYXRleFR5cGU6ICdjb21tYW5kJ1xuICAgICAgICAgIGNoYWluQ29tcGxldGU6IGNoYWluQ29tcGxldGVcbiAgICAgICAgICBjb3VudHM6IDFcbiAgICAgIGVsc2VcbiAgICAgICAgaXRlbXNbcmVzdWx0WzFdXS5jb3VudHMgKz0gMVxuICAgIHJldHVybiBpdGVtc1xuXG4gIHJlc2V0Q29tbWFuZHM6IC0+XG4gICAgQGl0ZW1zID0ge31cbiAgICBcbiAgc3VnZ2VzdGlvbnM6XG4gICAgbGF0ZXg6XG4gICAgICBiZWdpbjpcbiAgICAgICAgZGlzcGxheVRleHQ6ICdiZWdpbidcbiAgICAgICAgc25pcHBldDogJ2JlZ2lueyQxfVxcblxcdCQyXFxuXFxcXFxcXFxlbmR7JDF9J1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4gICAgICBjaXRlOlxuICAgICAgICBkaXNwbGF5VGV4dDogJ2NpdGUnXG4gICAgICAgIHNuaXBwZXQ6ICdjaXRleyQxfSQyJ1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4gICAgICByZWY6XG4gICAgICAgIGRpc3BsYXlUZXh0OiAncmVmJ1xuICAgICAgICBzbmlwcGV0OiAncmVmeyQxfSQyJ1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4gICAgICBpbnB1dDpcbiAgICAgICAgZGlzcGxheVRleHQ6ICdpbnB1dCdcbiAgICAgICAgc25pcHBldDogJ2lucHV0eyQxfSQyJ1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4gICAgICBpbmNsdWRlOlxuICAgICAgICBkaXNwbGF5VGV4dDogJ2luY2x1ZGUnXG4gICAgICAgIHNuaXBwZXQ6ICdpbmNsdWRleyQxfSQyJ1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4gICAgICBzdWJmaWxlOlxuICAgICAgICBkaXNwbGF5VGV4dDogJ3N1YmZpbGUnXG4gICAgICAgIHNuaXBwZXQ6ICdzdWJmaWxleyQxfSQyJ1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4gICAgICBpbmNsdWRlZ3JhcGhpY3M6XG4gICAgICAgIGRpc3BsYXlUZXh0OiAnaW5jbHVkZWdyYXBoaWNzJ1xuICAgICAgICBzbmlwcGV0OiAnaW5jbHVkZWdyYXBoaWNzeyQxfSQyJ1xuICAgICAgICBjaGFpbkNvbXBsZXRlOiB0cnVlXG4iXX0=
