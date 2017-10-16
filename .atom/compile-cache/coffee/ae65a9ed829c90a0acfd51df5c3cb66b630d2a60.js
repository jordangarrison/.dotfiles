(function() {
  var Command;

  module.exports = Command = (function() {
    function Command() {}

    Command.prototype.insertAtEndOfFile = function(text) {
      var content, editor, last;
      content = this.getEditorText();
      last = content.lastIndexOf('}');
      editor = atom.workspace.getActiveTextEditor();
      return editor.setText([content.slice(0, last), text, content.slice(last)].join(''));
    };

    Command.prototype.getEditorText = function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      return editor.getText();
    };

    return Command;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2phdmEtZ2VuZXJhdG9yLXBsdXMvbGliL2NvbW1hbmQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzs7c0JBRUYsaUJBQUEsR0FBbUIsU0FBQyxJQUFEO0FBRWYsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsYUFBRCxDQUFBO01BQ1YsSUFBQSxHQUFPLE9BQU8sQ0FBQyxXQUFSLENBQW9CLEdBQXBCO01BQ1AsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTthQUVULE1BQU0sQ0FBQyxPQUFQLENBQWdCLENBQUMsT0FBTyxDQUFDLEtBQVIsQ0FBYyxDQUFkLEVBQWlCLElBQWpCLENBQUQsRUFBeUIsSUFBekIsRUFBK0IsT0FBTyxDQUFDLEtBQVIsQ0FBYyxJQUFkLENBQS9CLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsRUFBekQsQ0FBaEI7SUFOZTs7c0JBUW5CLGFBQUEsR0FBZSxTQUFBO0FBRVgsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7QUFDVCxhQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7SUFISTs7Ozs7QUFYbkIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb21tYW5kXG5cbiAgICBpbnNlcnRBdEVuZE9mRmlsZTogKHRleHQpIC0+XG4gICAgICAgICMgRmluZCBsYXN0ICd9JyBhbmQgaW5zZXJ0IHRleHQganVzdCBiZWZvcmUgaXRcbiAgICAgICAgY29udGVudCA9IEBnZXRFZGl0b3JUZXh0KClcbiAgICAgICAgbGFzdCA9IGNvbnRlbnQubGFzdEluZGV4T2YoJ30nKVxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCAoW2NvbnRlbnQuc2xpY2UoMCwgbGFzdCksIHRleHQsIGNvbnRlbnQuc2xpY2UobGFzdCldLmpvaW4oJycpKVxuXG4gICAgZ2V0RWRpdG9yVGV4dDogLT5cbiAgICAgICAgIyBHZXQgZWRpdG9yIHRleHQgYW5kIHJldHVybiBpdFxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgcmV0dXJuIGVkaXRvci5nZXRUZXh0KClcbiJdfQ==
