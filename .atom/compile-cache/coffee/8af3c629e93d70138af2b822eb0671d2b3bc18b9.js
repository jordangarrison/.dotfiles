(function() {
  var Disposable, Parser, latexBox, latexError, latexFatalPattern, latexFile, latexPattern, latexWarn, latexmkPattern, latexmkPatternNoGM, latexmkUpToDate, path,
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
      if (log.match(latexPattern) || log.match(latexFatalPattern)) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3BhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBKQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxTQUFBLEdBQVk7O0VBQ1osWUFBQSxHQUFlOztFQUNmLGlCQUFBLEdBQW9COztFQUNwQixVQUFBLEdBQWE7O0VBQ2IsUUFBQSxHQUFXOztFQUNYLFNBQUEsR0FBWTs7RUFFWixjQUFBLEdBQWlCOztFQUNqQixrQkFBQSxHQUFxQjs7RUFDckIsZUFBQSxHQUFrQjs7RUFFbEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MsZ0JBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFERTs7cUJBR2IsS0FBQSxHQUFPLFNBQUMsR0FBRDtNQUNMLElBQUMsQ0FBQSxLQUFLLEVBQUMsT0FBRCxFQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUEzQixHQUFvQztNQUNwQyxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFDcEIsSUFBRyxHQUFHLENBQUMsS0FBSixDQUFVLGNBQVYsQ0FBSDtRQUNFLEdBQUEsR0FBTSxJQUFDLENBQUEsV0FBRCxDQUFhLEdBQWIsRUFEUjs7TUFFQSxJQUFHLEdBQUcsQ0FBQyxLQUFKLENBQVUsWUFBVixDQUFBLElBQTJCLEdBQUcsQ0FBQyxLQUFKLENBQVUsaUJBQVYsQ0FBOUI7UUFDRSxJQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosRUFERjtPQUFBLE1BRUssSUFBRyxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixDQUFIO1FBQ0gsSUFBQyxDQUFBLEtBQUssRUFBQyxPQUFELEVBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQTNCLEdBQW9DO1FBQ3BD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QyxjQURqQzs7YUFFTCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFkLEdBQW9CLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFsQixDQUF5QixLQUF6QjtJQTVDVjs7OztLQW5DTztBQWZyQiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5sYXRleEZpbGUgPSAvXi4qP1xcKFxcLlxcLyguKj9cXC5cXHcrKS9cbmxhdGV4UGF0dGVybiA9IC9eT3V0cHV0XFxzd3JpdHRlblxcc29uXFxzKC4qKVxcc1xcKC4qXFwpXFwuJC9nbVxubGF0ZXhGYXRhbFBhdHRlcm4gPSAvRmF0YWwgZXJyb3Igb2NjdXJyZWQsIG5vIG91dHB1dCBQREYgZmlsZSBwcm9kdWNlZCEvZ21cbmxhdGV4RXJyb3IgPSAvXig/OiguKik6KFxcZCspOnwhKSg/OiAoLispIEVycm9yOik/ICguKz8pXFwuPyQvXG5sYXRleEJveCA9IC9eKCg/Ok92ZXJ8VW5kZXIpZnVsbCBcXFxcW3ZoXWJveCBcXChbXildKlxcKSkgaW4gcGFyYWdyYXBoIGF0IGxpbmVzIChcXGQrKS0tKFxcZCspJC9cbmxhdGV4V2FybiA9IC9eKCg/Oig/OkNsYXNzfFBhY2thZ2UpIFxcUyspfExhVGVYKSAoV2FybmluZ3xJbmZvKTpcXHMrKC4qPykoPzogb24gaW5wdXQgbGluZSAoXFxkKykpP1xcLiQvXG5cbmxhdGV4bWtQYXR0ZXJuID0gL15MYXRleG1rOlxcc2FwcGx5aW5nXFxzcnVsZS9nbVxubGF0ZXhta1BhdHRlcm5Ob0dNID0gL15MYXRleG1rOlxcc2FwcGx5aW5nXFxzcnVsZS9cbmxhdGV4bWtVcFRvRGF0ZSA9IC9eTGF0ZXhtazogQWxsIHRhcmdldHMgXFwoLipcXCkgYXJlIHVwLXRvLWRhdGUvXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFBhcnNlciBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuXG4gIHBhcnNlOiAobG9nKSAtPlxuICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnN0YXR1cyA9ICdnb29kJ1xuICAgIEBpc0xhdGV4bWtTa2lwcGVkID0gZmFsc2VcbiAgICBpZiBsb2cubWF0Y2gobGF0ZXhta1BhdHRlcm4pXG4gICAgICBsb2cgPSBAdHJpbUxhdGV4bWsgbG9nXG4gICAgaWYgbG9nLm1hdGNoKGxhdGV4UGF0dGVybikgb3IgbG9nLm1hdGNoKGxhdGV4RmF0YWxQYXR0ZXJuKVxuICAgICAgQHBhcnNlTGF0ZXggbG9nXG4gICAgZWxzZSBpZiBAbGF0ZXhta1NraXBwZWQobG9nKVxuICAgICAgQGxhdGV4LnBhY2thZ2Uuc3RhdHVzLnZpZXcuc3RhdHVzID0gJ3NraXBwZWQnXG4gICAgICBAaXNMYXRleG1rU2tpcHBlZCA9IHRydWVcbiAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy51cGRhdGUoKVxuICAgIEBsYXRleC5wYW5lbC52aWV3LnVwZGF0ZSgpXG4gICAgQGxhc3RGaWxlID0gQGxhdGV4Lm1haW5GaWxlXG5cbiAgdHJpbUxhdGV4bWs6IChsb2cpIC0+XG4gICAgbG9nID0gbG9nLnJlcGxhY2UoLyguezc4fShcXHd8XFxzfFxcZHxcXFxcfFxcLykpKFxcclxcbnxcXG4pL2csICckMScpXG4gICAgbGluZXMgPSBsb2cucmVwbGFjZSgvKFxcclxcbil8XFxyL2csICdcXG4nKS5zcGxpdCgnXFxuJylcbiAgICBmaW5hbExpbmUgPSAtMVxuICAgIGZvciBpbmRleCBvZiBsaW5lc1xuICAgICAgbGluZSA9IGxpbmVzW2luZGV4XVxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCBsYXRleG1rUGF0dGVybk5vR01cbiAgICAgIGlmIHJlc3VsdFxuICAgICAgICBmaW5hbExpbmUgPSBpbmRleFxuICAgIHJldHVybiBsaW5lcy5zbGljZShmaW5hbExpbmUpLmpvaW4oJ1xcbicpXG5cbiAgbGF0ZXhta1NraXBwZWQ6IChsb2cpIC0+XG4gICAgbGluZXMgPSBsb2cucmVwbGFjZSgvKFxcclxcbil8XFxyL2csICdcXG4nKS5zcGxpdCgnXFxuJylcbiAgICBpZiBsaW5lc1swXS5tYXRjaChsYXRleG1rVXBUb0RhdGUpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHBhcnNlTGF0ZXg6IChsb2cpIC0+XG4gICAgbG9nID0gbG9nLnJlcGxhY2UoLyguezc4fShcXHd8XFxzfFxcZHxcXFxcfFxcLykpKFxcclxcbnxcXG4pL2csICckMScpXG4gICAgbGluZXMgPSBsb2cucmVwbGFjZSgvKFxcclxcbil8XFxyL2csICdcXG4nKS5zcGxpdCgnXFxuJylcbiAgICBpdGVtcyA9IFtdXG4gICAgZm9yIGxpbmUgaW4gbGluZXNcbiAgICAgIGZpbGUgPSBsaW5lLm1hdGNoIGxhdGV4RmlsZVxuICAgICAgaWYgZmlsZVxuICAgICAgICBAbGFzdEZpbGUgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKEBsYXRleC5tYWluRmlsZSksIGZpbGVbMV0pXG5cbiAgICAgIHJlc3VsdCA9IGxpbmUubWF0Y2ggbGF0ZXhCb3hcbiAgICAgIGlmIHJlc3VsdFxuICAgICAgICBpdGVtcy5wdXNoXG4gICAgICAgICAgdHlwZTogJ3R5cGVzZXR0aW5nJyxcbiAgICAgICAgICB0ZXh0OiByZXN1bHRbMV1cbiAgICAgICAgICBmaWxlOiBAbGFzdEZpbGVcbiAgICAgICAgICBsaW5lOiBwYXJzZUludChyZXN1bHRbMl0sIDEwKVxuICAgICAgICBjb250aW51ZVxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCBsYXRleFdhcm5cbiAgICAgIGlmIHJlc3VsdFxuICAgICAgICBpdGVtcy5wdXNoXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRleHQ6IHJlc3VsdFszXVxuICAgICAgICAgIGZpbGU6IEBsYXN0RmlsZVxuICAgICAgICAgIGxpbmU6IHBhcnNlSW50IHJlc3VsdFs0XVxuICAgICAgICBjb250aW51ZVxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCBsYXRleEVycm9yXG4gICAgICBpZiByZXN1bHRcbiAgICAgICAgaXRlbXMucHVzaFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGV4dDogaWYgcmVzdWx0WzNdIGFuZCByZXN1bHRbM10gIT0gJ0xhVGVYJyB0aGVuIFxcXG4gICAgICAgICAgICAgICAgXCJcIlwiI3tyZXN1bHRbM119OiAje3Jlc3VsdFs0XX1cIlwiXCIgZWxzZSByZXN1bHRbNF0sXG4gICAgICAgICAgZmlsZTogaWYgcmVzdWx0WzFdIHRoZW4gXFxcbiAgICAgICAgICAgIHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKSwgcmVzdWx0WzFdKSBlbHNlIFxcXG4gICAgICAgICAgICBAbGF0ZXgubWFpbkZpbGVcbiAgICAgICAgICBsaW5lOiBpZiByZXN1bHRbMl0gdGhlbiBwYXJzZUludCByZXN1bHRbMl0sIDEwIGVsc2UgdW5kZWZpbmVkXG4gICAgICAgIGNvbnRpbnVlXG5cbiAgICB0eXBlcyA9IGl0ZW1zLm1hcCgoaXRlbSkgLT4gaXRlbS50eXBlKVxuICAgIGlmIHR5cGVzLmluZGV4T2YoJ2Vycm9yJykgPiAtMVxuICAgICAgQGxhdGV4LnBhY2thZ2Uuc3RhdHVzLnZpZXcuc3RhdHVzID0gJ2Vycm9yJ1xuICAgIGVsc2UgaWYgdHlwZXMuaW5kZXhPZignd2FybmluZycpID4gLTFcbiAgICAgIEBsYXRleC5wYWNrYWdlLnN0YXR1cy52aWV3LnN0YXR1cyA9ICd3YXJuaW5nJ1xuICAgIGVsc2UgaWYgdHlwZXMuaW5kZXhPZigndHlwZXNldHRpbmcnKSA+IC0xXG4gICAgICBAbGF0ZXgucGFja2FnZS5zdGF0dXMudmlldy5zdGF0dXMgPSAndHlwZXNldHRpbmcnXG4gICAgQGxhdGV4LmxvZ2dlci5sb2cgPSBAbGF0ZXgubG9nZ2VyLmxvZy5jb25jYXQgaXRlbXNcbiJdfQ==
