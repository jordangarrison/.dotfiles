(function() {
  var Disposable, Syntax,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  module.exports = Syntax = (function(superClass) {
    extend(Syntax, superClass);

    function Syntax(latex) {
      this.latex = latex;
    }

    Syntax.prototype.dollarsign = function() {
      var allowedNextChar, cursor, editor, range, ref, ref1, ref2, ref3, selected;
      editor = atom.workspace.getActiveTextEditor();
      selected = editor.getSelectedText();
      if (selected) {
        range = editor.getSelectedBufferRange();
        range.start.column += 1;
        range.end.column += 1;
        editor.insertText("$" + selected + "$");
        editor.setSelectedBufferRange(range);
        return;
      }
      cursor = editor.getCursorBufferPosition();
      allowedNextChar = [' ', '.'];
      if ((editor != null ? (ref = editor.buffer) != null ? ref.lines[cursor.row][cursor.column - 1] : void 0 : void 0) === ' ' || (editor != null ? (ref1 = editor.buffer) != null ? ref1.lines[cursor.row].length : void 0 : void 0) === 0) {
        if ((editor != null ? (ref2 = editor.buffer) != null ? ref2.lines[cursor.row].length : void 0 : void 0) === cursor.column || allowedNextChar.indexOf(editor != null ? (ref3 = editor.buffer) != null ? ref3.lines[cursor.row][cursor.column] : void 0 : void 0) > -1) {
          editor.insertText('$$');
          editor.moveLeft();
          return;
        }
      }
      return editor.insertText('$');
    };

    Syntax.prototype.backquote = function() {
      var editor, range, selected;
      editor = atom.workspace.getActiveTextEditor();
      selected = editor.getSelectedText();
      if (selected) {
        range = editor.getSelectedBufferRange();
        range.start.column += 1;
        range.end.column += 1;
        editor.insertText("`" + selected + "'");
        editor.setSelectedBufferRange(range);
        return;
      }
      return editor.insertText('`');
    };

    Syntax.prototype.doublequote = function() {
      var editor, range, selected;
      editor = atom.workspace.getActiveTextEditor();
      selected = editor.getSelectedText();
      if (selected) {
        range = editor.getSelectedBufferRange();
        range.start.column += 1;
        range.end.column += 1;
        editor.insertText("``" + selected + "\'\'");
        editor.setSelectedBufferRange(range);
        return;
      }
      return editor.insertText('\"');
    };

    return Syntax;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9zeW50YXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrQkFBQTtJQUFBOzs7RUFBRSxhQUFlLE9BQUEsQ0FBUSxNQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDUyxnQkFBQyxLQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURFOztxQkFHYixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsUUFBQSxHQUFXLE1BQU0sQ0FBQyxlQUFQLENBQUE7TUFDWCxJQUFHLFFBQUg7UUFDRSxLQUFBLEdBQVEsTUFBTSxDQUFDLHNCQUFQLENBQUE7UUFDUixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosSUFBc0I7UUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFWLElBQW9CO1FBQ3BCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQUEsR0FBTSxRQUFOLEdBQWUsR0FBakM7UUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUI7QUFDQSxlQU5GOztNQVFBLE1BQUEsR0FBUyxNQUFNLENBQUMsdUJBQVAsQ0FBQTtNQUNULGVBQUEsR0FBa0IsQ0FBQyxHQUFELEVBQU0sR0FBTjtNQUNsQix5REFBaUIsQ0FBRSxLQUFNLENBQUEsTUFBTSxDQUFDLEdBQVAsQ0FBWSxDQUFBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQWhCLG9CQUFsQyxLQUF3RCxHQUF4RCwyREFDZSxDQUFFLEtBQU0sQ0FBQSxNQUFNLENBQUMsR0FBUCxDQUFXLENBQUMseUJBQWxDLEtBQTRDLENBRGhEO1FBRUUsMkRBQWlCLENBQUUsS0FBTSxDQUFBLE1BQU0sQ0FBQyxHQUFQLENBQVcsQ0FBQyx5QkFBbEMsS0FBNEMsTUFBTSxDQUFDLE1BQW5ELElBQ0MsZUFBZSxDQUFDLE9BQWhCLHVEQUNnQixDQUFFLEtBQU0sQ0FBQSxNQUFNLENBQUMsR0FBUCxDQUFZLENBQUEsTUFBTSxDQUFDLE1BQVAsbUJBRHBDLENBQUEsR0FDc0QsQ0FBQyxDQUYzRDtVQUdFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO1VBQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBQTtBQUNBLGlCQUxGO1NBRkY7O2FBUUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7SUFyQlU7O3FCQXVCWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsUUFBQSxHQUFXLE1BQU0sQ0FBQyxlQUFQLENBQUE7TUFDWCxJQUFHLFFBQUg7UUFDRSxLQUFBLEdBQVEsTUFBTSxDQUFDLHNCQUFQLENBQUE7UUFDUixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosSUFBc0I7UUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFWLElBQW9CO1FBQ3BCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQUEsR0FBTSxRQUFOLEdBQWUsR0FBakM7UUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUI7QUFDQSxlQU5GOzthQVFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO0lBWFM7O3FCQWFYLFdBQUEsR0FBYSxTQUFBO0FBQ1gsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxRQUFBLEdBQVcsTUFBTSxDQUFDLGVBQVAsQ0FBQTtNQUNYLElBQUcsUUFBSDtRQUNFLEtBQUEsR0FBUSxNQUFNLENBQUMsc0JBQVAsQ0FBQTtRQUNSLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixJQUFzQjtRQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVYsSUFBb0I7UUFDcEIsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBQSxHQUFPLFFBQVAsR0FBZ0IsTUFBbEM7UUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUI7QUFDQSxlQU5GOzthQVFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCO0lBWFc7Ozs7S0F4Q007QUFIckIiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN5bnRheCBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuXG4gIGRvbGxhcnNpZ246IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgc2VsZWN0ZWQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBpZiBzZWxlY3RlZFxuICAgICAgcmFuZ2UgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgICByYW5nZS5zdGFydC5jb2x1bW4gKz0gMVxuICAgICAgcmFuZ2UuZW5kLmNvbHVtbiArPSAxXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcIlwiXCIkI3tzZWxlY3RlZH0kXCJcIlwiKVxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICByZXR1cm5cblxuICAgIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgYWxsb3dlZE5leHRDaGFyID0gWycgJywgJy4nXVxuICAgIGlmIGVkaXRvcj8uYnVmZmVyPy5saW5lc1tjdXJzb3Iucm93XVtjdXJzb3IuY29sdW1uIC0gMV0gaXMgJyAnIG9yIFxcXG4gICAgICAgIGVkaXRvcj8uYnVmZmVyPy5saW5lc1tjdXJzb3Iucm93XS5sZW5ndGggaXMgMFxuICAgICAgaWYgZWRpdG9yPy5idWZmZXI/LmxpbmVzW2N1cnNvci5yb3ddLmxlbmd0aCBpcyBjdXJzb3IuY29sdW1uIG9yIFxcXG4gICAgICAgICAgYWxsb3dlZE5leHRDaGFyLmluZGV4T2YoXG4gICAgICAgICAgICBlZGl0b3I/LmJ1ZmZlcj8ubGluZXNbY3Vyc29yLnJvd11bY3Vyc29yLmNvbHVtbl0pID4gLTFcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJyQkJylcbiAgICAgICAgZWRpdG9yLm1vdmVMZWZ0KClcbiAgICAgICAgcmV0dXJuXG4gICAgZWRpdG9yLmluc2VydFRleHQoJyQnKVxuXG4gIGJhY2txdW90ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBzZWxlY3RlZCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgIGlmIHNlbGVjdGVkXG4gICAgICByYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICAgIHJhbmdlLnN0YXJ0LmNvbHVtbiArPSAxXG4gICAgICByYW5nZS5lbmQuY29sdW1uICs9IDFcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiXCJcImAje3NlbGVjdGVkfSdcIlwiXCIpXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIHJldHVyblxuXG4gICAgZWRpdG9yLmluc2VydFRleHQoJ2AnKVxuXG4gIGRvdWJsZXF1b3RlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHNlbGVjdGVkID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgaWYgc2VsZWN0ZWRcbiAgICAgIHJhbmdlID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgICAgcmFuZ2Uuc3RhcnQuY29sdW1uICs9IDFcbiAgICAgIHJhbmdlLmVuZC5jb2x1bW4gKz0gMVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJcIlwiYGAje3NlbGVjdGVkfVxcJ1xcJ1wiXCJcIilcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgcmV0dXJuXG5cbiAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnXFxcIicpXG4iXX0=
