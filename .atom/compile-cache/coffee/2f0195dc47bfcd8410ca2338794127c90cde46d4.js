(function() {
  var Disposable, Reference, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Disposable = require('atom').Disposable;

  fs = require('fs');

  path = require('path');

  module.exports = Reference = (function(superClass) {
    extend(Reference, superClass);

    function Reference(latex) {
      this.latex = latex;
      this.suggestions = [];
      this.items = {};
    }

    Reference.prototype.provide = function(prefix) {
      var currentContent, currentPath, editor, i, item, j, len, len1, ref, ref1, ref2, suggestions, tex;
      suggestions = [];
      if (prefix.length > 0) {
        ref = this.suggestions;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.text.indexOf(prefix) > -1) {
            item.replacementPrefix = prefix;
            suggestions.push(item);
          }
        }
        suggestions.sort(function(a, b) {
          return a.text.indexOf(prefix) - b.text.indexOf(prefix);
        });
        return suggestions;
      }
      if (!this.latex.manager.findAll()) {
        return suggestions;
      }
      editor = atom.workspace.getActivePaneItem();
      currentPath = editor != null ? (ref1 = editor.buffer.file) != null ? ref1.path : void 0 : void 0;
      currentContent = editor != null ? editor.getText() : void 0;
      if (currentPath && currentContent) {
        if (this.latex.manager.isTexFile(currentPath)) {
          this.getRefItems(currentPath);
        }
      }
      for (tex in this.items) {
        if (indexOf.call(this.latex.texFiles, tex) >= 0) {
          ref2 = this.items[tex];
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            item = ref2[j];
            suggestions.push({
              text: item,
              type: 'tag',
              latexType: 'reference'
            });
          }
        }
      }
      suggestions.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        return 1;
      });
      this.suggestions = suggestions;
      return suggestions;
    };

    Reference.prototype.getItems = function(content) {
      var itemReg, items, result;
      items = [];
      itemReg = /(?:\\label(?:\[[^\[\]\{\}]*\])?){([^}]*)}/g;
      while (true) {
        result = itemReg.exec(content);
        if (result == null) {
          break;
        }
        if (items.indexOf(result[1] < 0)) {
          items.push(result[1]);
        }
      }
      return items;
    };

    Reference.prototype.getRefItems = function(tex) {
      var content;
      if (!fs.existsSync(tex)) {
        return [];
      }
      content = fs.readFileSync(tex, 'utf-8');
      return this.items[tex] = this.getItems(content);
    };

    Reference.prototype.resetRefItems = function(tex) {
      if (tex != null) {
        return delete this.items[tex];
      } else {
        return this.items = {};
      }
    };

    return Reference;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9yZWZlcmVuY2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBOzs7O0VBQUUsYUFBZSxPQUFBLENBQVEsTUFBUjs7RUFDakIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDUyxtQkFBQyxLQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsS0FBRCxHQUFTO0lBSEU7O3dCQUtiLE9BQUEsR0FBUyxTQUFDLE1BQUQ7QUFDUCxVQUFBO01BQUEsV0FBQSxHQUFjO01BQ2QsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtBQUNFO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFBLEdBQTRCLENBQUMsQ0FBaEM7WUFDRSxJQUFJLENBQUMsaUJBQUwsR0FBeUI7WUFDekIsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBakIsRUFGRjs7QUFERjtRQUlBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDZixpQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxNQUFmLENBQUEsR0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZjtRQURqQixDQUFqQjtBQUVBLGVBQU8sWUFQVDs7TUFTQSxJQUFHLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBZixDQUFBLENBQUo7QUFDRSxlQUFPLFlBRFQ7O01BR0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQTtNQUNULFdBQUEsOERBQWlDLENBQUU7TUFDbkMsY0FBQSxvQkFBaUIsTUFBTSxDQUFFLE9BQVIsQ0FBQTtNQUVqQixJQUFHLFdBQUEsSUFBZ0IsY0FBbkI7UUFDRSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQWYsQ0FBeUIsV0FBekIsQ0FBSDtVQUNFLElBQUMsQ0FBQSxXQUFELENBQWEsV0FBYixFQURGO1NBREY7O0FBSUEsV0FBQSxpQkFBQTtRQUNFLElBQUcsYUFBUSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQWYsRUFBQSxHQUFBLE1BQUg7QUFDRTtBQUFBLGVBQUEsd0NBQUE7O1lBQ0UsV0FBVyxDQUFDLElBQVosQ0FDRTtjQUFBLElBQUEsRUFBTSxJQUFOO2NBQ0EsSUFBQSxFQUFNLEtBRE47Y0FFQSxTQUFBLEVBQVcsV0FGWDthQURGO0FBREYsV0FERjs7QUFERjtNQVFBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7UUFDZixJQUFhLENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQXhCO0FBQUEsaUJBQU8sQ0FBQyxFQUFSOztBQUNBLGVBQU87TUFGUSxDQUFqQjtNQUdBLElBQUMsQ0FBQSxXQUFELEdBQWU7QUFDZixhQUFPO0lBbENBOzt3QkFvQ1QsUUFBQSxHQUFVLFNBQUMsT0FBRDtBQUNSLFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixPQUFBLEdBQVU7QUFDVixhQUFBLElBQUE7UUFDRSxNQUFBLEdBQVMsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiO1FBQ1QsSUFBVSxjQUFWO0FBQUEsZ0JBQUE7O1FBQ0EsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBWSxDQUExQixDQUFIO1VBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFPLENBQUEsQ0FBQSxDQUFsQixFQURGOztNQUhGO0FBS0EsYUFBTztJQVJDOzt3QkFVVixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQUFBLElBQUcsQ0FBQyxFQUFFLENBQUMsVUFBSCxDQUFjLEdBQWQsQ0FBSjtBQUNFLGVBQU8sR0FEVDs7TUFFQSxPQUFBLEdBQVUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsR0FBaEIsRUFBcUIsT0FBckI7YUFDVixJQUFDLENBQUEsS0FBTSxDQUFBLEdBQUEsQ0FBUCxHQUFjLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVjtJQUpIOzt3QkFNYixhQUFBLEdBQWUsU0FBQyxHQUFEO01BQ2IsSUFBRyxXQUFIO2VBQ0UsT0FBTyxJQUFDLENBQUEsS0FBTSxDQUFBLEdBQUEsRUFEaEI7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLEtBQUQsR0FBUyxHQUhYOztJQURhOzs7O0tBMURPO0FBTHhCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZWZlcmVuY2UgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcbiAgICBAc3VnZ2VzdGlvbnMgPSBbXVxuICAgIEBpdGVtcyA9IHt9XG5cbiAgcHJvdmlkZTogKHByZWZpeCkgLT5cbiAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgaWYgcHJlZml4Lmxlbmd0aCA+IDBcbiAgICAgIGZvciBpdGVtIGluIEBzdWdnZXN0aW9uc1xuICAgICAgICBpZiBpdGVtLnRleHQuaW5kZXhPZihwcmVmaXgpID4gLTFcbiAgICAgICAgICBpdGVtLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG4gICAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgICByZXR1cm4gYS50ZXh0LmluZGV4T2YocHJlZml4KSAtIGIudGV4dC5pbmRleE9mKHByZWZpeCkpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgIGlmICFAbGF0ZXgubWFuYWdlci5maW5kQWxsKClcbiAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGN1cnJlbnRQYXRoID0gZWRpdG9yPy5idWZmZXIuZmlsZT8ucGF0aFxuICAgIGN1cnJlbnRDb250ZW50ID0gZWRpdG9yPy5nZXRUZXh0KClcblxuICAgIGlmIGN1cnJlbnRQYXRoIGFuZCBjdXJyZW50Q29udGVudFxuICAgICAgaWYgQGxhdGV4Lm1hbmFnZXIuaXNUZXhGaWxlKGN1cnJlbnRQYXRoKVxuICAgICAgICBAZ2V0UmVmSXRlbXMgY3VycmVudFBhdGhcblxuICAgIGZvciB0ZXggb2YgQGl0ZW1zXG4gICAgICBpZiB0ZXggaW4gIEBsYXRleC50ZXhGaWxlc1xuICAgICAgICBmb3IgaXRlbSBpbiBAaXRlbXNbdGV4XVxuICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2hcbiAgICAgICAgICAgIHRleHQ6IGl0ZW1cbiAgICAgICAgICAgIHR5cGU6ICd0YWcnXG4gICAgICAgICAgICBsYXRleFR5cGU6ICdyZWZlcmVuY2UnXG5cbiAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgcmV0dXJuIC0xIGlmIGEudGV4dCA8IGIudGV4dFxuICAgICAgcmV0dXJuIDEpXG4gICAgQHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnNcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICBnZXRJdGVtczogKGNvbnRlbnQpIC0+XG4gICAgaXRlbXMgPSBbXVxuICAgIGl0ZW1SZWcgPSAvKD86XFxcXGxhYmVsKD86XFxbW15cXFtcXF1cXHtcXH1dKlxcXSk/KXsoW159XSopfS9nXG4gICAgbG9vcFxuICAgICAgcmVzdWx0ID0gaXRlbVJlZy5leGVjIGNvbnRlbnRcbiAgICAgIGJyZWFrIGlmICFyZXN1bHQ/XG4gICAgICBpZiBpdGVtcy5pbmRleE9mIHJlc3VsdFsxXSA8IDBcbiAgICAgICAgaXRlbXMucHVzaCByZXN1bHRbMV1cbiAgICByZXR1cm4gaXRlbXNcblxuICBnZXRSZWZJdGVtczogKHRleCkgLT5cbiAgICBpZiAhZnMuZXhpc3RzU3luYyh0ZXgpXG4gICAgICByZXR1cm4gW11cbiAgICBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jIHRleCwgJ3V0Zi04J1xuICAgIEBpdGVtc1t0ZXhdID0gQGdldEl0ZW1zKGNvbnRlbnQpXG5cbiAgcmVzZXRSZWZJdGVtczogKHRleCkgLT5cbiAgICBpZiB0ZXg/XG4gICAgICBkZWxldGUgQGl0ZW1zW3RleF1cbiAgICBlbHNlXG4gICAgICBAaXRlbXMgPSB7fVxuIl19
