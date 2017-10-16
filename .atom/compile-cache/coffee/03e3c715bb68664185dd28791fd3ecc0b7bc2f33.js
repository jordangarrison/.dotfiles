(function() {
  var CiteView, CompositeDisposable, LabelView, LatexerHook;

  CompositeDisposable = require('atom').CompositeDisposable;

  LabelView = require('./label-view');

  CiteView = require('./cite-view');

  module.exports = LatexerHook = (function() {
    LatexerHook.prototype.beginRex = /\\begin{([^}]+)}/;

    LatexerHook.prototype.mathRex = /(\\+)\[/;

    LatexerHook.prototype.refRex = /\\\w*ref({|{[^}]+,)$/;

    LatexerHook.prototype.citeRex = /\\(cite|textcite|onlinecite|citet|citep|citet\*|citep\*)(\[[^\]]+\])?({|{[^}]+,)$/;

    function LatexerHook(editor1) {
      this.editor = editor1;
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.editor.onDidChangeTitle((function(_this) {
        return function() {
          return _this.subscribeBuffer();
        };
      })(this)));
      this.disposables.add(this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.subscribeBuffer();
        };
      })(this)));
      this.disposables.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.subscribeBuffer();
        };
      })(this)));
      this.disposables.add(this.editor.onDidDestroy(this.destroy.bind(this)));
      this.subscribeBuffer();
      this.lv = new LabelView;
      this.cv = new CiteView;
    }

    LatexerHook.prototype.destroy = function() {
      var ref, ref1;
      this.unsubscribeBuffer();
      this.disposables.dispose();
      if ((ref = this.lv) != null) {
        ref.hide();
      }
      return (ref1 = this.cv) != null ? ref1.hide() : void 0;
    };

    LatexerHook.prototype.subscribeBuffer = function() {
      var ref, title;
      this.unsubscribeBuffer();
      if (this.editor == null) {
        return;
      }
      title = (ref = this.editor) != null ? ref.getTitle() : void 0;
      if (!((title != null) && title.match(/\.tex$/))) {
        return;
      }
      this.buffer = this.editor.getBuffer();
      return this.disposableBuffer = this.buffer.onDidStopChanging((function(_this) {
        return function() {
          return _this.editorHook();
        };
      })(this));
    };

    LatexerHook.prototype.unsubscribeBuffer = function() {
      var ref;
      if ((ref = this.disposableBuffer) != null) {
        ref.dispose();
      }
      return this.buffer = null;
    };

    LatexerHook.prototype.refCiteCheck = function(editor, refOpt, citeOpt) {
      var line, match, pos;
      pos = editor.getCursorBufferPosition().toArray();
      line = editor.getTextInBufferRange([[pos[0], 0], pos]);
      if (refOpt && (match = line.match(this.refRex))) {
        this.lv.show(editor);
      }
      if (citeOpt && (match = line.match(this.citeRex))) {
        return this.cv.show(editor);
      }
    };

    LatexerHook.prototype.environmentCheck = function(editor) {
      var balanceAfter, balanceBefore, beginText, beginTextRex, endText, endTextRex, lineCount, match, pos, posBefore, preText, previousLine, remainingText;
      pos = editor.getCursorBufferPosition().toArray();
      if (pos[0] <= 0) {
        return;
      }
      previousLine = editor.lineTextForBufferRow(pos[0] - 1);
      if ((match = this.beginRex.exec(previousLine))) {
        beginText = "\\begin{" + match[1] + "}";
        endText = "\\end{" + match[1] + "}";
        beginTextRex = new RegExp(beginText.replace(/([()[{*+.$^\\|?])/g, "\\$1"), "gm");
        endTextRex = new RegExp(endText.replace(/([()[{*+.$^\\|?])/g, "\\$1"), "gm");
      } else if ((match = this.mathRex.exec(previousLine)) && match[1].length % 2) {
        beginText = "\\[";
        endText = "\\]";
        beginTextRex = new RegExp("\\\\\\[", "gm");
        endTextRex = new RegExp("\\\\\\]", "gm");
      } else {
        return;
      }
      lineCount = editor.getLineCount();
      preText = editor.getTextInBufferRange([[0, 0], [pos[0], 0]]).replace(/%.+$/gm, "");
      remainingText = editor.getTextInBufferRange([[pos[0], 0], [lineCount + 1, 0]]).replace(/%.+$/gm, "");
      balanceBefore = (preText.match(beginTextRex) || []).length - (preText.match(endTextRex) || []).length;
      balanceAfter = (remainingText.match(beginTextRex) || []).length - (remainingText.match(endTextRex) || []).length;
      if (balanceBefore + balanceAfter < 1) {
        return;
      }
      posBefore = editor.getCursorBufferPosition();
      editor.insertText(endText);
      editor.moveUp(1);
      editor.moveToEndOfLine();
      return editor.insertText("\n");
    };

    LatexerHook.prototype.editorHook = function(editor) {
      var citeOpt, envOpt, refOpt;
      if (editor == null) {
        editor = this.editor;
      }
      envOpt = atom.config.get("latexer.autocomplete_environments");
      refOpt = atom.config.get("latexer.autocomplete_references");
      citeOpt = atom.config.get("latexer.autocomplete_citations");
      if (refOpt || citeOpt) {
        this.refCiteCheck(editor, refOpt, citeOpt);
      }
      if (envOpt) {
        return this.environmentCheck(editor);
      }
    };

    return LatexerHook;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4ZXIvbGliL2xhdGV4ZXItaG9vay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNROzBCQUNKLFFBQUEsR0FBVTs7MEJBQ1YsT0FBQSxHQUFTOzswQkFDVCxNQUFBLEdBQVE7OzBCQUNSLE9BQUEsR0FBUzs7SUFDSSxxQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFDWixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxlQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQixDQUFqQjtNQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBZCxDQUFyQixDQUFqQjtNQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7TUFDQSxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUk7TUFDVixJQUFDLENBQUEsRUFBRCxHQUFNLElBQUk7SUFUQzs7MEJBV2IsT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLGlCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTs7V0FDRyxDQUFFLElBQUwsQ0FBQTs7NENBQ0csQ0FBRSxJQUFMLENBQUE7SUFKTzs7MEJBT1QsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO01BQ0EsSUFBYyxtQkFBZDtBQUFBLGVBQUE7O01BQ0EsS0FBQSxvQ0FBZSxDQUFFLFFBQVQsQ0FBQTtNQUNSLElBQUEsQ0FBQSxDQUFjLGVBQUEsSUFBVyxLQUFLLENBQUMsS0FBTixDQUFZLFFBQVosQ0FBekIsQ0FBQTtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQTthQUNWLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO0lBTkw7OzBCQVFqQixpQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFVBQUE7O1dBQWlCLENBQUUsT0FBbkIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO0lBRk87OzBCQUluQixZQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixPQUFqQjtBQUNaLFVBQUE7TUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxPQUFqQyxDQUFBO01BQ04sSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUFDLENBQUMsR0FBSSxDQUFBLENBQUEsQ0FBTCxFQUFTLENBQVQsQ0FBRCxFQUFjLEdBQWQsQ0FBNUI7TUFDUCxJQUFHLE1BQUEsSUFBVyxDQUFDLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFaLENBQVQsQ0FBZDtRQUNFLElBQUMsQ0FBQSxFQUFFLENBQUMsSUFBSixDQUFTLE1BQVQsRUFERjs7TUFFQSxJQUFHLE9BQUEsSUFBWSxDQUFDLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxPQUFaLENBQVQsQ0FBZjtlQUNFLElBQUMsQ0FBQSxFQUFFLENBQUMsSUFBSixDQUFTLE1BQVQsRUFERjs7SUFMWTs7MEJBUWQsZ0JBQUEsR0FBa0IsU0FBQyxNQUFEO0FBQ2hCLFVBQUE7TUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxPQUFqQyxDQUFBO01BQ04sSUFBVSxHQUFJLENBQUEsQ0FBQSxDQUFKLElBQVUsQ0FBcEI7QUFBQSxlQUFBOztNQUNBLFlBQUEsR0FBZSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsR0FBSSxDQUFBLENBQUEsQ0FBSixHQUFPLENBQW5DO01BQ2YsSUFBRyxDQUFDLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxZQUFmLENBQVQsQ0FBSDtRQUNFLFNBQUEsR0FBWSxVQUFBLEdBQVcsS0FBTSxDQUFBLENBQUEsQ0FBakIsR0FBb0I7UUFDaEMsT0FBQSxHQUFVLFFBQUEsR0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLEdBQWtCO1FBQzVCLFlBQUEsR0FBbUIsSUFBQSxNQUFBLENBQU8sU0FBUyxDQUFDLE9BQVYsQ0FBa0Isb0JBQWxCLEVBQXdDLE1BQXhDLENBQVAsRUFBd0QsSUFBeEQ7UUFDbkIsVUFBQSxHQUFpQixJQUFBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBUixDQUFnQixvQkFBaEIsRUFBc0MsTUFBdEMsQ0FBUCxFQUFzRCxJQUF0RCxFQUpuQjtPQUFBLE1BS0ssSUFBRyxDQUFDLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxZQUFkLENBQVQsQ0FBQSxJQUEwQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBVCxHQUFrQixDQUEvRDtRQUNILFNBQUEsR0FBWTtRQUNaLE9BQUEsR0FBVTtRQUNWLFlBQUEsR0FBbUIsSUFBQSxNQUFBLENBQU8sU0FBUCxFQUFrQixJQUFsQjtRQUNuQixVQUFBLEdBQWlCLElBQUEsTUFBQSxDQUFPLFNBQVAsRUFBa0IsSUFBbEIsRUFKZDtPQUFBLE1BQUE7QUFNSCxlQU5HOztNQU9MLFNBQUEsR0FBWSxNQUFNLENBQUMsWUFBUCxDQUFBO01BQ1osT0FBQSxHQUFTLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFRLENBQUMsR0FBSSxDQUFBLENBQUEsQ0FBTCxFQUFRLENBQVIsQ0FBUixDQUE1QixDQUFnRCxDQUFDLE9BQWpELENBQXlELFFBQXpELEVBQWtFLEVBQWxFO01BQ1QsYUFBQSxHQUFnQixNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBQyxDQUFDLEdBQUksQ0FBQSxDQUFBLENBQUwsRUFBUSxDQUFSLENBQUQsRUFBWSxDQUFDLFNBQUEsR0FBVSxDQUFYLEVBQWEsQ0FBYixDQUFaLENBQTVCLENBQXlELENBQUMsT0FBMUQsQ0FBa0UsUUFBbEUsRUFBMkUsRUFBM0U7TUFDaEIsYUFBQSxHQUFnQixDQUFDLE9BQU8sQ0FBQyxLQUFSLENBQWMsWUFBZCxDQUFBLElBQTZCLEVBQTlCLENBQWlDLENBQUMsTUFBbEMsR0FBMkMsQ0FBQyxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsQ0FBQSxJQUEyQixFQUE1QixDQUErQixDQUFDO01BQzNGLFlBQUEsR0FBZSxDQUFDLGFBQWEsQ0FBQyxLQUFkLENBQW9CLFlBQXBCLENBQUEsSUFBbUMsRUFBcEMsQ0FBdUMsQ0FBQyxNQUF4QyxHQUFpRCxDQUFDLGFBQWEsQ0FBQyxLQUFkLENBQW9CLFVBQXBCLENBQUEsSUFBaUMsRUFBbEMsQ0FBcUMsQ0FBQztNQUN0RyxJQUFVLGFBQUEsR0FBZ0IsWUFBaEIsR0FBK0IsQ0FBekM7QUFBQSxlQUFBOztNQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMsdUJBQVAsQ0FBQTtNQUNaLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCO01BQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkO01BQ0EsTUFBTSxDQUFDLGVBQVAsQ0FBQTthQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO0lBMUJnQjs7MEJBNEJsQixVQUFBLEdBQVksU0FBQyxNQUFEO0FBQ1YsVUFBQTs7UUFEVyxTQUFTLElBQUMsQ0FBQTs7TUFDckIsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEI7TUFDVCxNQUFBLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtNQUNULE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCO01BQ1YsSUFBMEMsTUFBQSxJQUFVLE9BQXBEO1FBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBQXNCLE1BQXRCLEVBQThCLE9BQTlCLEVBQUE7O01BQ0EsSUFBNkIsTUFBN0I7ZUFBQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsTUFBbEIsRUFBQTs7SUFMVTs7Ozs7QUE1RWhCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkxhYmVsVmlldyA9IHJlcXVpcmUgJy4vbGFiZWwtdmlldydcbkNpdGVWaWV3ID0gcmVxdWlyZSAnLi9jaXRlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgTGF0ZXhlckhvb2tcbiAgICBiZWdpblJleDogL1xcXFxiZWdpbnsoW159XSspfS9cbiAgICBtYXRoUmV4OiAvKFxcXFwrKVxcWy9cbiAgICByZWZSZXg6IC9cXFxcXFx3KnJlZih7fHtbXn1dKywpJC9cbiAgICBjaXRlUmV4OiAvXFxcXChjaXRlfHRleHRjaXRlfG9ubGluZWNpdGV8Y2l0ZXR8Y2l0ZXB8Y2l0ZXRcXCp8Y2l0ZXBcXCopKFxcW1teXFxdXStcXF0pPyh7fHtbXn1dKywpJC9cbiAgICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlVGl0bGUgPT4gQHN1YnNjcmliZUJ1ZmZlcigpXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2VQYXRoID0+IEBzdWJzY3JpYmVCdWZmZXIoKVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBAZWRpdG9yLm9uRGlkU2F2ZSA9PiBAc3Vic2NyaWJlQnVmZmVyKClcblxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBAZWRpdG9yLm9uRGlkRGVzdHJveShAZGVzdHJveS5iaW5kKHRoaXMpKVxuICAgICAgQHN1YnNjcmliZUJ1ZmZlcigpXG4gICAgICBAbHYgPSBuZXcgTGFiZWxWaWV3XG4gICAgICBAY3YgPSBuZXcgQ2l0ZVZpZXdcblxuICAgIGRlc3Ryb3k6IC0+XG4gICAgICBAdW5zdWJzY3JpYmVCdWZmZXIoKVxuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgQGx2Py5oaWRlKClcbiAgICAgIEBjdj8uaGlkZSgpXG5cblxuICAgIHN1YnNjcmliZUJ1ZmZlcjogLT5cbiAgICAgIEB1bnN1YnNjcmliZUJ1ZmZlcigpXG4gICAgICByZXR1cm4gdW5sZXNzIEBlZGl0b3I/XG4gICAgICB0aXRsZSA9IEBlZGl0b3I/LmdldFRpdGxlKClcbiAgICAgIHJldHVybiB1bmxlc3MgdGl0bGU/IGFuZCB0aXRsZS5tYXRjaCgvXFwudGV4JC8pXG4gICAgICBAYnVmZmVyID0gQGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgQGRpc3Bvc2FibGVCdWZmZXIgPSBAYnVmZmVyLm9uRGlkU3RvcENoYW5naW5nID0+IEBlZGl0b3JIb29rKClcblxuICAgIHVuc3Vic2NyaWJlQnVmZmVyOiAtPlxuICAgICAgQGRpc3Bvc2FibGVCdWZmZXI/LmRpc3Bvc2UoKVxuICAgICAgQGJ1ZmZlciA9IG51bGxcblxuICAgIHJlZkNpdGVDaGVjazogKGVkaXRvciwgcmVmT3B0LCBjaXRlT3B0KS0+XG4gICAgICBwb3MgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS50b0FycmF5KClcbiAgICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1twb3NbMF0sIDBdLCBwb3NdKVxuICAgICAgaWYgcmVmT3B0IGFuZCAobWF0Y2ggPSBsaW5lLm1hdGNoKEByZWZSZXgpKVxuICAgICAgICBAbHYuc2hvdyhlZGl0b3IpXG4gICAgICBpZiBjaXRlT3B0IGFuZCAobWF0Y2ggPSBsaW5lLm1hdGNoKEBjaXRlUmV4KSlcbiAgICAgICAgQGN2LnNob3coZWRpdG9yKVxuXG4gICAgZW52aXJvbm1lbnRDaGVjazogKGVkaXRvciktPlxuICAgICAgcG9zID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkudG9BcnJheSgpXG4gICAgICByZXR1cm4gaWYgcG9zWzBdIDw9IDBcbiAgICAgIHByZXZpb3VzTGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhwb3NbMF0tMSlcbiAgICAgIGlmIChtYXRjaCA9IEBiZWdpblJleC5leGVjKHByZXZpb3VzTGluZSkpXG4gICAgICAgIGJlZ2luVGV4dCA9IFwiXFxcXGJlZ2lueyN7bWF0Y2hbMV19fVwiXG4gICAgICAgIGVuZFRleHQgPSBcIlxcXFxlbmR7I3ttYXRjaFsxXX19XCJcbiAgICAgICAgYmVnaW5UZXh0UmV4ID0gbmV3IFJlZ0V4cCBiZWdpblRleHQucmVwbGFjZSgvKFsoKVt7KisuJF5cXFxcfD9dKS9nLCBcIlxcXFwkMVwiKSwgXCJnbVwiXG4gICAgICAgIGVuZFRleHRSZXggPSBuZXcgUmVnRXhwIGVuZFRleHQucmVwbGFjZSgvKFsoKVt7KisuJF5cXFxcfD9dKS9nLCBcIlxcXFwkMVwiKSwgXCJnbVwiXG4gICAgICBlbHNlIGlmIChtYXRjaCA9IEBtYXRoUmV4LmV4ZWMocHJldmlvdXNMaW5lKSkgYW5kIG1hdGNoWzFdLmxlbmd0aCAlIDJcbiAgICAgICAgYmVnaW5UZXh0ID0gXCJcXFxcW1wiXG4gICAgICAgIGVuZFRleHQgPSBcIlxcXFxdXCJcbiAgICAgICAgYmVnaW5UZXh0UmV4ID0gbmV3IFJlZ0V4cCBcIlxcXFxcXFxcXFxcXFtcIiwgXCJnbVwiXG4gICAgICAgIGVuZFRleHRSZXggPSBuZXcgUmVnRXhwIFwiXFxcXFxcXFxcXFxcXVwiLCBcImdtXCJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICBsaW5lQ291bnQgPSBlZGl0b3IuZ2V0TGluZUNvdW50KClcbiAgICAgIHByZVRleHQ9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbWzAsMF0sIFtwb3NbMF0sMF1dKS5yZXBsYWNlIC8lLiskL2dtLFwiXCJcbiAgICAgIHJlbWFpbmluZ1RleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1twb3NbMF0sMF0sW2xpbmVDb3VudCsxLDBdXSkucmVwbGFjZSAvJS4rJC9nbSxcIlwiXG4gICAgICBiYWxhbmNlQmVmb3JlID0gKHByZVRleHQubWF0Y2goYmVnaW5UZXh0UmV4KXx8W10pLmxlbmd0aCAtIChwcmVUZXh0Lm1hdGNoKGVuZFRleHRSZXgpfHxbXSkubGVuZ3RoXG4gICAgICBiYWxhbmNlQWZ0ZXIgPSAocmVtYWluaW5nVGV4dC5tYXRjaChiZWdpblRleHRSZXgpfHxbXSkubGVuZ3RoIC0gKHJlbWFpbmluZ1RleHQubWF0Y2goZW5kVGV4dFJleCl8fFtdKS5sZW5ndGhcbiAgICAgIHJldHVybiBpZiBiYWxhbmNlQmVmb3JlICsgYmFsYW5jZUFmdGVyIDwgMVxuICAgICAgcG9zQmVmb3JlID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IGVuZFRleHRcbiAgICAgIGVkaXRvci5tb3ZlVXAgMVxuICAgICAgZWRpdG9yLm1vdmVUb0VuZE9mTGluZSgpXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcIlxcblwiXG5cbiAgICBlZGl0b3JIb29rOiAoZWRpdG9yID0gQGVkaXRvciktPlxuICAgICAgZW52T3B0ID0gYXRvbS5jb25maWcuZ2V0IFwibGF0ZXhlci5hdXRvY29tcGxldGVfZW52aXJvbm1lbnRzXCJcbiAgICAgIHJlZk9wdCA9IGF0b20uY29uZmlnLmdldCBcImxhdGV4ZXIuYXV0b2NvbXBsZXRlX3JlZmVyZW5jZXNcIlxuICAgICAgY2l0ZU9wdCA9IGF0b20uY29uZmlnLmdldCBcImxhdGV4ZXIuYXV0b2NvbXBsZXRlX2NpdGF0aW9uc1wiXG4gICAgICBAcmVmQ2l0ZUNoZWNrKGVkaXRvciwgcmVmT3B0LCBjaXRlT3B0KSBpZiByZWZPcHQgb3IgY2l0ZU9wdFxuICAgICAgQGVudmlyb25tZW50Q2hlY2soZWRpdG9yKSBpZiBlbnZPcHRcbiJdfQ==
