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
      return delete this.items[bib];
    };

    return Citation;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9jaXRhdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1Msa0JBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUhFOzt1QkFJYixPQUFBLEdBQVMsU0FBQyxNQUFEO0FBQ1AsVUFBQTtNQUFBLFdBQUEsR0FBYztNQUNkLElBQUcsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBbkI7QUFDRTtBQUFBLGFBQUEscUNBQUE7O1VBQ0UsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBQSxHQUE0QixDQUFDLENBQWhDO1lBQ0UsSUFBSSxDQUFDLGlCQUFMLEdBQXlCO1lBQ3pCLFdBQVcsQ0FBQyxJQUFaLENBQWlCLElBQWpCLEVBRkY7O0FBREY7UUFJQSxXQUFXLENBQUMsSUFBWixDQUFpQixTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ2YsaUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZixDQUFBLEdBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLE1BQWY7UUFEakIsQ0FBakI7QUFFQSxlQUFPLFlBUFQ7O01BUUEsSUFBRyxDQUFDLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQWYsQ0FBQSxDQUFKO0FBQ0UsZUFBTyxZQURUOztBQUVBLFdBQUEsaUJBQUE7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b250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2l0YXRpb24gZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcbiAgICBAc3VnZ2VzdGlvbnMgPSBbXVxuICAgIEBpdGVtcyA9IHt9XG4gIHByb3ZpZGU6IChwcmVmaXgpIC0+XG4gICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIGlmIHByZWZpeC5sZW5ndGggPiAwXG4gICAgICBmb3IgaXRlbSBpbiBAc3VnZ2VzdGlvbnNcbiAgICAgICAgaWYgaXRlbS50ZXh0LmluZGV4T2YocHJlZml4KSA+IC0xXG4gICAgICAgICAgaXRlbS5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2ggaXRlbVxuICAgICAgc3VnZ2VzdGlvbnMuc29ydCgoYSwgYikgLT5cbiAgICAgICAgcmV0dXJuIGEudGV4dC5pbmRleE9mKHByZWZpeCkgLSBiLnRleHQuaW5kZXhPZihwcmVmaXgpKVxuICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgaWYgIUBsYXRleC5tYW5hZ2VyLmZpbmRBbGwoKVxuICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgZm9yIGJpYiBvZiBAaXRlbXNcbiAgICAgIGZvciBpdGVtIGluIEBpdGVtc1tiaWJdXG4gICAgICAgIGRlc2NyaXB0aW9uID0gaXRlbS50aXRsZVxuICAgICAgICBpZiBpdGVtLmF1dGhvcj9cbiAgICAgICAgICBkZXNjcmlwdGlvbiArPSBcIlwiXCIgLSAje2l0ZW0uYXV0aG9yLnNwbGl0KCcgYW5kICcpLmpvaW4oJzsgJyl9XCJcIlwiXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2hcbiAgICAgICAgICB0ZXh0OiBpdGVtLmtleVxuICAgICAgICAgIHR5cGU6ICd0YWcnXG4gICAgICAgICAgbGF0ZXhUeXBlOiAnY2l0YXRpb24nXG4gICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG4gICAgc3VnZ2VzdGlvbnMuc29ydCgoYSwgYikgLT5cbiAgICAgIHJldHVybiAtMSBpZiBhLnRleHQgPCBiLnRleHRcbiAgICAgIHJldHVybiAxKVxuICAgIEBzdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zXG4gICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG5cbiAgZ2V0QmliSXRlbXM6IChiaWIpIC0+XG4gICAgaXRlbXMgPSBbXVxuICAgIGlmICFmcy5leGlzdHNTeW5jKGJpYilcbiAgICAgIHJldHVybiBAaXRlbXNcbiAgICBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jIGJpYiwgJ3V0Zi04J1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoL1tcXHJcXG5dL2csICcgJylcbiAgICBpdGVtUmVnID0gL0AoXFx3Kyl7L2dcbiAgICByZXN1bHQgPSBpdGVtUmVnLmV4ZWMgY29udGVudFxuICAgIHByZXZfcmVzdWx0ID0gdW5kZWZpbmVkXG4gICAgd2hpbGUgcmVzdWx0PyBvciBwcmV2X3Jlc3VsdD9cbiAgICAgIGlmIHByZXZfcmVzdWx0PyBhbmQgcHJldl9yZXN1bHRbMV0udG9Mb3dlckNhc2UoKSAhPSAnY29tbWVudCdcbiAgICAgICAgaXRlbSA9IGNvbnRlbnQuc3Vic3RyaW5nKHByZXZfcmVzdWx0LmluZGV4LCByZXN1bHQ/LmluZGV4KS50cmltKClcbiAgICAgICAgaXRlbXMucHVzaCBAc3BsaXRCaWJJdGVtIGl0ZW1cbiAgICAgIHByZXZfcmVzdWx0ID0gcmVzdWx0XG4gICAgICBpZiByZXN1bHQ/XG4gICAgICAgIHJlc3VsdCA9IGl0ZW1SZWcuZXhlYyBjb250ZW50XG4gICAgQGl0ZW1zW2JpYl0gPSBpdGVtc1xuXG4gIHNwbGl0QmliSXRlbTogKGl0ZW0pIC0+XG4gICAgdW5jbG9zZWQgPSAwXG4gICAgbGFzdFNwbGl0ID0gLTFcbiAgICBzZWdtZW50cyA9IFtdXG4gICAgZm9yIGNoYXIsIGkgaW4gaXRlbVxuICAgICAgaWYgY2hhciBpcyAneycgYW5kIGl0ZW1baSAtIDFdIGlzbnQgJ1xcXFwnXG4gICAgICAgIHVuY2xvc2VkKytcbiAgICAgIGVsc2UgaWYgY2hhciBpcyAnfScgYW5kIGl0ZW1baSAtIDFdIGlzbnQgJ1xcXFwnXG4gICAgICAgIHVuY2xvc2VkLS1cbiAgICAgIGVsc2UgaWYgY2hhciBpcyAnLCcgYW5kIHVuY2xvc2VkIGlzIDFcbiAgICAgICAgc2VnbWVudHMucHVzaCBpdGVtLnN1YnN0cmluZyhsYXN0U3BsaXQgKyAxLCBpKS50cmltKClcbiAgICAgICAgbGFzdFNwbGl0ID0gaVxuICAgIHNlZ21lbnRzLnB1c2ggaXRlbS5zdWJzdHJpbmcobGFzdFNwbGl0ICsgMSkudHJpbSgpXG4gICAgYmliSXRlbSA9IHt9XG4gICAgYmliSXRlbS5rZXkgPSBzZWdtZW50cy5zaGlmdCgpXG4gICAgYmliSXRlbS5rZXkgPSBiaWJJdGVtLmtleS5zdWJzdHJpbmcoYmliSXRlbS5rZXkuaW5kZXhPZigneycpICsgMSlcbiAgICBsYXN0ID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV1cbiAgICBsYXN0ID0gbGFzdC5zdWJzdHJpbmcoMCwgbGFzdC5sYXN0SW5kZXhPZignfScpKVxuICAgIHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtIDFdID0gbGFzdFxuICAgIGZvciBzZWdtZW50IGluIHNlZ21lbnRzXG4gICAgICBlcVNpZ24gPSBzZWdtZW50LmluZGV4T2YoJz0nKVxuICAgICAga2V5ID0gc2VnbWVudC5zdWJzdHJpbmcoMCwgZXFTaWduKS50cmltKClcbiAgICAgIHZhbHVlID0gc2VnbWVudC5zdWJzdHJpbmcoZXFTaWduICsgMSkudHJpbSgpXG4gICAgICBpZiB2YWx1ZVswXSBpcyAneycgYW5kIHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdIGlzICd9J1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygxLCB2YWx1ZS5sZW5ndGggLSAxKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oXFxcXC4pfCh7KS9nLCAnJDEnKS5yZXBsYWNlKC8oXFxcXC4pfCh9KS9nLCAnJDEnKVxuICAgICAgYmliSXRlbVtrZXldID0gdmFsdWVcbiAgICByZXR1cm4gYmliSXRlbVxuXG4gIHJlc2V0QmliSXRlbXM6IChiaWIpIC0+XG4gICAgZGVsZXRlIEBpdGVtc1tiaWJdXG4iXX0=
