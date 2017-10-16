(function() {
  var Disposable, Parser, araraFailurePattern, araraPattern, latexBox, latexError, latexFatalPattern, latexFile, latexPattern, latexWarn, latexmkPattern, latexmkPatternNoGM, latexmkUpToDate, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  path = require('path');

  latexFile = /^.*?\(\.\/(.*?\.\w+)/;

  latexPattern = /^Output\swritten\son\s(.*)\s\(.*\)\.$/gm;

  latexFatalPattern = /Fatal error occurred, no output PDF file produced!/gm;

  latexError = /^(?:(.*):(\d+):|!)(?: (.+) Error:)? (.+?)\.?$/;

  latexBox = /^((?:Over|Under)full \\[vh]box \([^)]*\)) in paragraph at lines (\d+)--(\d+)$/;

  latexWarn = /^((?:(?:Class|Package) \S+)|LaTeX) (Warning|Info):\s+(.*?)(?: on input line (\d+))?\.$/;

  latexmkPattern = /^Latexmk:\sapplying\srule/gm;

  latexmkPatternNoGM = /^Latexmk:\sapplying\srule/;

  latexmkUpToDate = /^Latexmk: All targets \(.*\) are up-to-date/;

  araraPattern = /Running\s(?:[a-zA-Z]*)\.\.\./g;

  araraFailurePattern = /(FAILURE)/g;

  module.exports = Parser = (function(superClass) {
    extend(Parser, superClass);

    function Parser(latex) {
      this.latex = latex;
    }

    Parser.prototype.parse = function(log) {
      this.latex["package"].status.view.status = 'good';
      this.isLatexmkSkipped = false;
      if (log.match(latexmkPattern)) {
        log = this.trimLatexmk(log);
      }
      if (log.match(araraPattern)) {
        log = this.trimArara(log);
      }
      if (log.match(latexPattern) || log.match(latexFatalPattern) || log.match(araraFailurePattern)) {
        this.parseLatex(log);
      } else if (this.latexmkSkipped(log)) {
        this.latex["package"].status.view.status = 'skipped';
        this.isLatexmkSkipped = true;
      }
      this.latex["package"].status.view.update();
      this.latex.panel.view.update();
      return this.lastFile = this.latex.mainFile;
    };

    Parser.prototype.trimLatexmk = function(log) {
      var finalLine, index, line, lines, result;
      log = log.replace(/(.{78}(\w|\s|\d|\\|\/))(\r\n|\n)/g, '$1');
      lines = log.replace(/(\r\n)|\r/g, '\n').split('\n');
      finalLine = -1;
      for (index in lines) {
        line = lines[index];
        result = line.match(latexmkPatternNoGM);
        if (result) {
          finalLine = index;
        }
      }
      return lines.slice(finalLine).join('\n');
    };

    Parser.prototype.latexmkSkipped = function(log) {
      var lines;
      lines = log.replace(/(\r\n)|\r/g, '\n').split('\n');
      if (lines[0].match(latexmkUpToDate)) {
        return true;
      }
      return false;
    };

    Parser.prototype.trimArara = function(log) {
      var araraRunIdx, index, line, lines, result;
      araraRunIdx = [];
      lines = log.replace(/(\r\n)|\r/g, '\n').split('\n');
      for (index in lines) {
        line = lines[index];
        result = line.match(/Running\s(?:[a-zA-Z]*)\.\.\./);
        if (result) {
          araraRunIdx = araraRunIdx.concat(index);
        }
      }
      return lines.slice(araraRunIdx.slice(-1)[0]).join('\n');
    };

    Parser.prototype.parseLatex = function(log) {
      var file, i, items, len, line, lines, result, types;
      log = log.replace(/(.{78}(\w|\s|\d|\\|\/))(\r\n|\n)/g, '$1');
      lines = log.replace(/(\r\n)|\r/g, '\n').split('\n');
      items = [];
      for (i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        file = line.match(latexFile);
        if (file) {
          this.lastFile = path.resolve(path.dirname(this.latex.mainFile), file[1]);
        }
        result = line.match(latexBox);
        if (result) {
          items.push({
            type: 'typesetting',
            text: result[1],
            file: this.lastFile,
            line: parseInt(result[2], 10)
          });
          continue;
        }
        result = line.match(latexWarn);
        if (result) {
          items.push({
            type: 'warning',
            text: result[3],
            file: this.lastFile,
            line: parseInt(result[4])
          });
          continue;
        }
        result = line.match(latexError);
        if (result) {
          items.push({
            type: 'error',
            text: result[3] && result[3] !== 'LaTeX' ? result[3] + ": " + result[4] : result[4],
            file: result[1] ? path.resolve(path.dirname(this.latex.mainFile), result[1]) : this.latex.mainFile,
            line: result[2] ? parseInt(result[2], 10) : void 0
          });
          continue;
        }
      }
      types = items.map(function(item) {
        return item.type;
      });
      if (types.indexOf('error') > -1) {
        this.latex["package"].status.view.status = 'error';
      } else if (types.indexOf('warning') > -1) {
        this.latex["package"].status.view.status = 'warning';
      } else if (types.indexOf('typesetting') > -1) {
        this.latex["package"].status.view.status = 'typesetting';
      }
      return this.latex.logger.log = this.latex.logger.log.concat(items);
    };

    return Parser;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3BhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZMQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxTQUFBLEdBQVk7O0VBQ1osWUFBQSxHQUFlOztFQUNmLGlCQUFBLEdBQW9COztFQUNwQixVQUFBLEdBQWE7O0VBQ2IsUUFBQSxHQUFXOztFQUNYLFNBQUEsR0FBWTs7RUFFWixjQUFBLEdBQWlCOztFQUNqQixrQkFBQSxHQUFxQjs7RUFDckIsZUFBQSxHQUFrQjs7RUFFbEIsWUFBQSxHQUFlOztFQUNmLG1CQUFBLEdBQXNCOztFQUN0QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDUyxnQkFBQyxLQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURFOztxQkFHYixLQUFBLEdBQU8sU0FBQyxHQUFEO01BQ0wsSUFBQyxDQUFBLEtBQUssRUFBQyxPQUFELEVBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQTNCLEdBQW9DO01BQ3BDLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUNwQixJQUFHLEdBQUcsQ0FBQyxLQUFKLENBQVUsY0FBVixDQUFIO1FBQ0UsR0FBQSxHQUFNLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYixFQURSOztNQUVBLElBQUcsR0FBRyxDQUFDLEtBQUosQ0FBVSxZQUFWLENBQUg7UUFDRSxHQUFBLEdBQU0sSUFBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYLEVBRFI7O01BRUEsSUFBRyxHQUFHLENBQUMsS0FBSixDQUFVLFlBQVYsQ0FBQSxJQUEyQixHQUFHLENBQUMsS0FBSixDQUFVLGlCQUFWLENBQTNCLElBQTJELEdBQUcsQ0FBQyxLQUFKLENBQVUsbUJBQVYsQ0FBOUQ7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QWtCLFFBQUEsQ0FBUyxNQUFPLENBQUEsQ0FBQSxDQUFoQixFQUFvQixFQUFwQixDQUFsQixHQUE4QyxNQU5wRDtXQURGO0FBUUEsbUJBVEY7O0FBdEJGO01BaUNBLEtBQUEsR0FBUSxLQUFLLENBQUMsR0FBTixDQUFVLFNBQUMsSUFBRDtlQUFVLElBQUksQ0FBQztNQUFmLENBQVY7TUFDUixJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsT0FBZCxDQUFBLEdBQXlCLENBQUMsQ0FBN0I7UUFDRSxJQUFDLENBQUEsS0FBSyxFQUFDLE9BQUQsRUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBM0IsR0FBb0MsUUFEdEM7T0FBQSxNQUVLLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxTQUFkLENBQUEsR0FBMkIsQ0FBQyxDQUEvQjtRQUNILElBQUMsQ0FBQSxLQUFLLEVBQUMsT0FBRCxFQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUEzQixHQUFvQyxVQURqQztPQUFBLE1BRUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLGFBQWQsQ0FBQSxHQUErQixDQUFDLENBQW5DO1FBQ0gsSUFBQyxDQUFBLEtBQUssRUFBQyxPQUFELEVBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQTNCLEdBQW9DLGNBRGpDOzthQUVMLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQWQsR0FBb0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQWxCLENBQXlCLEtBQXpCO0lBNUNWOzs7O0tBaERPO0FBakJyQiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5sYXRleEZpbGUgPSAvXi4qP1xcKFxcLlxcLyguKj9cXC5cXHcrKS9cbmxhdGV4UGF0dGVybiA9IC9eT3V0cHV0XFxzd3JpdHRlblxcc29uXFxzKC4qKVxcc1xcKC4qXFwpXFwuJC9nbVxubGF0ZXhGYXRhbFBhdHRlcm4gPSAvRmF0YWwgZXJyb3Igb2NjdXJyZWQsIG5vIG91dHB1dCBQREYgZmlsZSBwcm9kdWNlZCEvZ21cbmxhdGV4RXJyb3IgPSAvXig/OiguKik6KFxcZCspOnwhKSg/OiAoLispIEVycm9yOik/ICguKz8pXFwuPyQvXG5sYXRleEJveCA9IC9eKCg/Ok92ZXJ8VW5kZXIpZnVsbCBcXFxcW3ZoXWJveCBcXChbXildKlxcKSkgaW4gcGFyYWdyYXBoIGF0IGxpbmVzIChcXGQrKS0tKFxcZCspJC9cbmxhdGV4V2FybiA9IC9eKCg/Oig/OkNsYXNzfFBhY2thZ2UpIFxcUyspfExhVGVYKSAoV2FybmluZ3xJbmZvKTpcXHMrKC4qPykoPzogb24gaW5wdXQgbGluZSAoXFxkKykpP1xcLiQvXG5cbmxhdGV4bWtQYXR0ZXJuID0gL15MYXRleG1rOlxcc2FwcGx5aW5nXFxzcnVsZS9nbVxubGF0ZXhta1BhdHRlcm5Ob0dNID0gL15MYXRleG1rOlxcc2FwcGx5aW5nXFxzcnVsZS9cbmxhdGV4bWtVcFRvRGF0ZSA9IC9eTGF0ZXhtazogQWxsIHRhcmdldHMgXFwoLipcXCkgYXJlIHVwLXRvLWRhdGUvXG5cbmFyYXJhUGF0dGVybiA9IC9SdW5uaW5nXFxzKD86W2EtekEtWl0qKVxcLlxcLlxcLi9nXG5hcmFyYUZhaWx1cmVQYXR0ZXJuID0gLyhGQUlMVVJFKS9nXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQYXJzZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcblxuICBwYXJzZTogKGxvZykgLT5cbiAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy5zdGF0dXMgPSAnZ29vZCdcbiAgICBAaXNMYXRleG1rU2tpcHBlZCA9IGZhbHNlXG4gICAgaWYgbG9nLm1hdGNoKGxhdGV4bWtQYXR0ZXJuKVxuICAgICAgbG9nID0gQHRyaW1MYXRleG1rIGxvZ1xuICAgIGlmIGxvZy5tYXRjaChhcmFyYVBhdHRlcm4pXG4gICAgICBsb2cgPSBAdHJpbUFyYXJhIGxvZ1xuICAgIGlmIGxvZy5tYXRjaChsYXRleFBhdHRlcm4pIG9yIGxvZy5tYXRjaChsYXRleEZhdGFsUGF0dGVybikgb3IgbG9nLm1hdGNoKGFyYXJhRmFpbHVyZVBhdHRlcm4pXG4gICAgICBAcGFyc2VMYXRleCBsb2dcbiAgICBlbHNlIGlmIEBsYXRleG1rU2tpcHBlZChsb2cpXG4gICAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy5zdGF0dXMgPSAnc2tpcHBlZCdcbiAgICAgIEBpc0xhdGV4bWtTa2lwcGVkID0gdHJ1ZVxuICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnVwZGF0ZSgpXG4gICAgQGxhdGV4LnBhbmVsLnZpZXcudXBkYXRlKClcbiAgICBAbGFzdEZpbGUgPSBAbGF0ZXgubWFpbkZpbGVcblxuICB0cmltTGF0ZXhtazogKGxvZykgLT5cbiAgICBsb2cgPSBsb2cucmVwbGFjZSgvKC57Nzh9KFxcd3xcXHN8XFxkfFxcXFx8XFwvKSkoXFxyXFxufFxcbikvZywgJyQxJylcbiAgICBsaW5lcyA9IGxvZy5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgJ1xcbicpLnNwbGl0KCdcXG4nKVxuICAgIGZpbmFsTGluZSA9IC0xXG4gICAgZm9yIGluZGV4IG9mIGxpbmVzXG4gICAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgICByZXN1bHQgPSBsaW5lLm1hdGNoIGxhdGV4bWtQYXR0ZXJuTm9HTVxuICAgICAgaWYgcmVzdWx0XG4gICAgICAgIGZpbmFsTGluZSA9IGluZGV4XG4gICAgcmV0dXJuIGxpbmVzLnNsaWNlKGZpbmFsTGluZSkuam9pbignXFxuJylcblxuICBsYXRleG1rU2tpcHBlZDogKGxvZykgLT5cbiAgICBsaW5lcyA9IGxvZy5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgJ1xcbicpLnNwbGl0KCdcXG4nKVxuICAgIGlmIGxpbmVzWzBdLm1hdGNoKGxhdGV4bWtVcFRvRGF0ZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgdHJpbUFyYXJhOiAobG9nKSAtPlxuICAgIGFyYXJhUnVuSWR4ID0gW11cbiAgICBsaW5lcyA9IGxvZy5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgJ1xcbicpLnNwbGl0KCdcXG4nKVxuICAgIGZvciBpbmRleCBvZiBsaW5lc1xuICAgICAgbGluZSA9IGxpbmVzW2luZGV4XVxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCgvUnVubmluZ1xccyg/OlthLXpBLVpdKilcXC5cXC5cXC4vKVxuICAgICAgaWYgcmVzdWx0XG4gICAgICAgIGFyYXJhUnVuSWR4ID0gYXJhcmFSdW5JZHguY29uY2F0IGluZGV4XG4gICAgIyBSZXR1cm4gb25seSBsYXN0IGFyYXJhIHJ1blxuICAgIHJldHVybiBsaW5lcy5zbGljZShhcmFyYVJ1bklkeC5zbGljZSgtMSlbMF0pLmpvaW4oJ1xcbicpXG5cbiAgcGFyc2VMYXRleDogKGxvZykgLT5cbiAgICBsb2cgPSBsb2cucmVwbGFjZSgvKC57Nzh9KFxcd3xcXHN8XFxkfFxcXFx8XFwvKSkoXFxyXFxufFxcbikvZywgJyQxJylcbiAgICBsaW5lcyA9IGxvZy5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgJ1xcbicpLnNwbGl0KCdcXG4nKVxuICAgIGl0ZW1zID0gW11cbiAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgZmlsZSA9IGxpbmUubWF0Y2ggbGF0ZXhGaWxlXG4gICAgICBpZiBmaWxlXG4gICAgICAgIEBsYXN0RmlsZSA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKSwgZmlsZVsxXSlcblxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCBsYXRleEJveFxuICAgICAgaWYgcmVzdWx0XG4gICAgICAgIGl0ZW1zLnB1c2hcbiAgICAgICAgICB0eXBlOiAndHlwZXNldHRpbmcnLFxuICAgICAgICAgIHRleHQ6IHJlc3VsdFsxXVxuICAgICAgICAgIGZpbGU6IEBsYXN0RmlsZVxuICAgICAgICAgIGxpbmU6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTApXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICByZXN1bHQgPSBsaW5lLm1hdGNoIGxhdGV4V2FyblxuICAgICAgaWYgcmVzdWx0XG4gICAgICAgIGl0ZW1zLnB1c2hcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGV4dDogcmVzdWx0WzNdXG4gICAgICAgICAgZmlsZTogQGxhc3RGaWxlXG4gICAgICAgICAgbGluZTogcGFyc2VJbnQgcmVzdWx0WzRdXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICByZXN1bHQgPSBsaW5lLm1hdGNoIGxhdGV4RXJyb3JcbiAgICAgIGlmIHJlc3VsdFxuICAgICAgICBpdGVtcy5wdXNoXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB0ZXh0OiBpZiByZXN1bHRbM10gYW5kIHJlc3VsdFszXSAhPSAnTGFUZVgnIHRoZW4gXFxcbiAgICAgICAgICAgICAgICBcIlwiXCIje3Jlc3VsdFszXX06ICN7cmVzdWx0WzRdfVwiXCJcIiBlbHNlIHJlc3VsdFs0XSxcbiAgICAgICAgICBmaWxlOiBpZiByZXN1bHRbMV0gdGhlbiBcXFxuICAgICAgICAgICAgcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShAbGF0ZXgubWFpbkZpbGUpLCByZXN1bHRbMV0pIGVsc2UgXFxcbiAgICAgICAgICAgIEBsYXRleC5tYWluRmlsZVxuICAgICAgICAgIGxpbmU6IGlmIHJlc3VsdFsyXSB0aGVuIHBhcnNlSW50IHJlc3VsdFsyXSwgMTAgZWxzZSB1bmRlZmluZWRcbiAgICAgICAgY29udGludWVcblxuICAgIHR5cGVzID0gaXRlbXMubWFwKChpdGVtKSAtPiBpdGVtLnR5cGUpXG4gICAgaWYgdHlwZXMuaW5kZXhPZignZXJyb3InKSA+IC0xXG4gICAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy5zdGF0dXMgPSAnZXJyb3InXG4gICAgZWxzZSBpZiB0eXBlcy5pbmRleE9mKCd3YXJuaW5nJykgPiAtMVxuICAgICAgQGxhdGV4LnBhY2thZ2Uuc3RhdHVzLnZpZXcuc3RhdHVzID0gJ3dhcm5pbmcnXG4gICAgZWxzZSBpZiB0eXBlcy5pbmRleE9mKCd0eXBlc2V0dGluZycpID4gLTFcbiAgICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnN0YXR1cyA9ICd0eXBlc2V0dGluZydcbiAgICBAbGF0ZXgubG9nZ2VyLmxvZyA9IEBsYXRleC5sb2dnZXIubG9nLmNvbmNhdCBpdGVtc1xuIl19
