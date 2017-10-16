(function() {
  var Citation, Disposable, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  fs = require('fs');

  path = require('path');

  module.exports = Citation = (function(superClass) {
    extend(Citation, superClass);

    function Citation(latex) {
      this.latex = latex;
      this.suggestions = [];
      this.items = {};
    }

    Citation.prototype.provide = function(prefix) {
      var bib, description, item, j, k, len, len1, ref, ref1, suggestions;
      suggestions = [];
      if (prefix.length > 0) {
        ref = this.suggestions;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
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
      for (bib in this.items) {
        ref1 = this.items[bib];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          item = ref1[k];
          description = item.title;
          if (item.author != null) {
            description += " - " + (item.author.split(' and ').join('; '));
          }
          suggestions.push({
            text: item.key,
            type: 'tag',
            latexType: 'citation',
            description: description
          });
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

    Citation.prototype.getBibItems = function(bib) {
      var content, item, itemReg, items, prev_result, result;
      items = [];
      if (!fs.existsSync(bib)) {
        return this.items;
      }
      content = fs.readFileSync(bib, 'utf-8');
      content = content.replace(/[\r\n]/g, ' ');
      itemReg = /@(\w+){/g;
      result = itemReg.exec(content);
      prev_result = void 0;
      while ((result != null) || (prev_result != null)) {
        if ((prev_result != null) && prev_result[1].toLowerCase() !== 'comment') {
          item = content.substring(prev_result.index, result != null ? result.index : void 0).trim();
          items.push(this.splitBibItem(item));
        }
        prev_result = result;
        if (result != null) {
          result = itemReg.exec(content);
        }
      }
      return this.items[bib] = items;
    };

    Citation.prototype.splitBibItem = function(item) {
      var bibItem, char, eqSign, i, j, k, key, last, lastSplit, len, len1, segment, segments, unclosed, value;
      unclosed = 0;
      lastSplit = -1;
      segments = [];
      for (i = j = 0, len = item.length; j < len; i = ++j) {
        char = item[i];
        if (char === '{' && item[i - 1] !== '\\') {
          unclosed++;
        } else if (char === '}' && item[i - 1] !== '\\') {
          unclosed--;
        } else if (char === ',' && unclosed === 1) {
          segments.push(item.substring(lastSplit + 1, i).trim());
          lastSplit = i;
        }
      }
      segments.push(item.substring(lastSplit + 1).trim());
      bibItem = {};
      bibItem.key = segments.shift();
      bibItem.key = bibItem.key.substring(bibItem.key.indexOf('{') + 1);
      last = segments[segments.length - 1];
      last = last.substring(0, last.lastIndexOf('}'));
      segments[segments.length - 1] = last;
      for (k = 0, len1 = segments.length; k < len1; k++) {
        segment = segments[k];
        eqSign = segment.indexOf('=');
        key = segment.substring(0, eqSign).trim();
        value = segment.substring(eqSign + 1).trim();
        if (value[0] === '{' && value[value.length - 1] === '}') {
          value = value.substring(1, value.length - 1);
        }
        value = value.replace(/(\\.)|({)/g, '$1').replace(/(\\.)|(})/g, '$1');
        bibItem[key] = value;
      }
      return bibItem;
    };

    Citation.prototype.resetBibItems = function(bib) {
      if (bib != null) {
        return delete this.items[bib];
      } else {
        return this.items = [];
      }
    };

    return Citation;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9jaXRhdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1Msa0JBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUhFOzt1QkFJYixPQUFBLEdBQVMsU0FBQyxNQUFEO0FBQ1AsVUFBQTtNQUFBLFdBQUEsR0FBYztNQUNkLElBQUcsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBbkI7QUFDRTtBQUFBLGFBQUEscUNBQUE7O1VBQ0UsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBQSxHQUE0QixDQUFDLENBQWhDO1lBQ0UsSUFBSSxDQUFDLGlCQUFMLEdBQXlCO1lBQ3pCLFdBQVcsQ0FBQyxJQUFaLENBQWlCLElBQWpCLEVBRkY7O0FBREY7UUFJQSxXQUFXLENBQUMsSUFBWixDQUFpQixTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ2YsaUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZixDQUFBLEdBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLE1BQWY7UUFEakIsQ0FBakI7QUFFQSxlQUFPLFlBUFQ7O01BUUEsSUFBRyxDQUFDLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQWYsQ0FBQSxDQUFKO0FBQ0UsZUFBTyxZQURUOztBQUVBLFdBQUEsaUJBQUE7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O2VBR0UsSUFBQyxDQUFBLEtBQUQsR0FBUyxHQUhYOztJQUZhOzs7O0tBaEZNO0FBTHZCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDaXRhdGlvbiBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuICAgIEBzdWdnZXN0aW9ucyA9IFtdXG4gICAgQGl0ZW1zID0ge31cbiAgcHJvdmlkZTogKHByZWZpeCkgLT5cbiAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgaWYgcHJlZml4Lmxlbmd0aCA+IDBcbiAgICAgIGZvciBpdGVtIGluIEBzdWdnZXN0aW9uc1xuICAgICAgICBpZiBpdGVtLnRleHQuaW5kZXhPZihwcmVmaXgpID4gLTFcbiAgICAgICAgICBpdGVtLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG4gICAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgICByZXR1cm4gYS50ZXh0LmluZGV4T2YocHJlZml4KSAtIGIudGV4dC5pbmRleE9mKHByZWZpeCkpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZEFsbCgpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcbiAgICBmb3IgYmliIG9mIEBpdGVtc1xuICAgICAgZm9yIGl0ZW0gaW4gQGl0ZW1zW2JpYl1cbiAgICAgICAgZGVzY3JpcHRpb24gPSBpdGVtLnRpdGxlXG4gICAgICAgIGlmIGl0ZW0uYXV0aG9yP1xuICAgICAgICAgIGRlc2NyaXB0aW9uICs9IFwiXCJcIiAtICN7aXRlbS5hdXRob3Iuc3BsaXQoJyBhbmQgJykuam9pbignOyAnKX1cIlwiXCJcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaFxuICAgICAgICAgIHRleHQ6IGl0ZW0ua2V5XG4gICAgICAgICAgdHlwZTogJ3RhZydcbiAgICAgICAgICBsYXRleFR5cGU6ICdjaXRhdGlvbidcbiAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25cbiAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgcmV0dXJuIC0xIGlmIGEudGV4dCA8IGIudGV4dFxuICAgICAgcmV0dXJuIDEpXG4gICAgQHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnNcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICBnZXRCaWJJdGVtczogKGJpYikgLT5cbiAgICBpdGVtcyA9IFtdXG4gICAgaWYgIWZzLmV4aXN0c1N5bmMoYmliKVxuICAgICAgcmV0dXJuIEBpdGVtc1xuICAgIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMgYmliLCAndXRmLTgnXG4gICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvW1xcclxcbl0vZywgJyAnKVxuICAgIGl0ZW1SZWcgPSAvQChcXHcrKXsvZ1xuICAgIHJlc3VsdCA9IGl0ZW1SZWcuZXhlYyBjb250ZW50XG4gICAgcHJldl9yZXN1bHQgPSB1bmRlZmluZWRcbiAgICB3aGlsZSByZXN1bHQ/IG9yIHByZXZfcmVzdWx0P1xuICAgICAgaWYgcHJldl9yZXN1bHQ/IGFuZCBwcmV2X3Jlc3VsdFsxXS50b0xvd2VyQ2FzZSgpICE9ICdjb21tZW50J1xuICAgICAgICBpdGVtID0gY29udGVudC5zdWJzdHJpbmcocHJldl9yZXN1bHQuaW5kZXgsIHJlc3VsdD8uaW5kZXgpLnRyaW0oKVxuICAgICAgICBpdGVtcy5wdXNoIEBzcGxpdEJpYkl0ZW0gaXRlbVxuICAgICAgcHJldl9yZXN1bHQgPSByZXN1bHRcbiAgICAgIGlmIHJlc3VsdD9cbiAgICAgICAgcmVzdWx0ID0gaXRlbVJlZy5leGVjIGNvbnRlbnRcbiAgICBAaXRlbXNbYmliXSA9IGl0ZW1zXG5cbiAgc3BsaXRCaWJJdGVtOiAoaXRlbSkgLT5cbiAgICB1bmNsb3NlZCA9IDBcbiAgICBsYXN0U3BsaXQgPSAtMVxuICAgIHNlZ21lbnRzID0gW11cbiAgICBmb3IgY2hhciwgaSBpbiBpdGVtXG4gICAgICBpZiBjaGFyIGlzICd7JyBhbmQgaXRlbVtpIC0gMV0gaXNudCAnXFxcXCdcbiAgICAgICAgdW5jbG9zZWQrK1xuICAgICAgZWxzZSBpZiBjaGFyIGlzICd9JyBhbmQgaXRlbVtpIC0gMV0gaXNudCAnXFxcXCdcbiAgICAgICAgdW5jbG9zZWQtLVxuICAgICAgZWxzZSBpZiBjaGFyIGlzICcsJyBhbmQgdW5jbG9zZWQgaXMgMVxuICAgICAgICBzZWdtZW50cy5wdXNoIGl0ZW0uc3Vic3RyaW5nKGxhc3RTcGxpdCArIDEsIGkpLnRyaW0oKVxuICAgICAgICBsYXN0U3BsaXQgPSBpXG4gICAgc2VnbWVudHMucHVzaCBpdGVtLnN1YnN0cmluZyhsYXN0U3BsaXQgKyAxKS50cmltKClcbiAgICBiaWJJdGVtID0ge31cbiAgICBiaWJJdGVtLmtleSA9IHNlZ21lbnRzLnNoaWZ0KClcbiAgICBiaWJJdGVtLmtleSA9IGJpYkl0ZW0ua2V5LnN1YnN0cmluZyhiaWJJdGVtLmtleS5pbmRleE9mKCd7JykgKyAxKVxuICAgIGxhc3QgPSBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXVxuICAgIGxhc3QgPSBsYXN0LnN1YnN0cmluZygwLCBsYXN0Lmxhc3RJbmRleE9mKCd9JykpXG4gICAgc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV0gPSBsYXN0XG4gICAgZm9yIHNlZ21lbnQgaW4gc2VnbWVudHNcbiAgICAgIGVxU2lnbiA9IHNlZ21lbnQuaW5kZXhPZignPScpXG4gICAgICBrZXkgPSBzZWdtZW50LnN1YnN0cmluZygwLCBlcVNpZ24pLnRyaW0oKVxuICAgICAgdmFsdWUgPSBzZWdtZW50LnN1YnN0cmluZyhlcVNpZ24gKyAxKS50cmltKClcbiAgICAgIGlmIHZhbHVlWzBdIGlzICd7JyBhbmQgdmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0gaXMgJ30nXG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCAtIDEpXG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLyhcXFxcLil8KHspL2csICckMScpLnJlcGxhY2UoLyhcXFxcLil8KH0pL2csICckMScpXG4gICAgICBiaWJJdGVtW2tleV0gPSB2YWx1ZVxuICAgIHJldHVybiBiaWJJdGVtXG5cbiAgcmVzZXRCaWJJdGVtczogKGJpYikgLT5cbiAgICAjIFJlbW92ZSBzcGVjaWZpYyBvciBhbGwgY2l0YXRpb24gc3VnZ2VzdGlvbnNcbiAgICBpZiBiaWI/XG4gICAgICBkZWxldGUgQGl0ZW1zW2JpYl1cbiAgICBlbHNlXG4gICAgICBAaXRlbXMgPSBbXVxuIl19
