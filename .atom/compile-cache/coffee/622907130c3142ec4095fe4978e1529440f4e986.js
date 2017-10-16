(function() {
  var throttle;

  throttle = require("lodash.throttle");

  module.exports = {
    setCanvasRenderer: function(canvasRenderer) {
      return this.canvas = canvasRenderer;
    },
    enable: function() {
      return this.canvas.enable();
    },
    disable: function() {
      return this.canvas.destroy();
    },
    onChangePane: function(editor, editorElement) {
      this.canvas.resetCanvas();
      if (editor) {
        return this.canvas.setupCanvas(editor, editorElement);
      }
    },
    onNewCursor: function(cursor) {
      return cursor.spawn = throttle(this.canvas.spawn.bind(this.canvas), 25, {
        trailing: false
      });
    },
    onInput: function(cursor, screenPosition, input, data) {
      return cursor.spawn(cursor, screenPosition, input, data['size']);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi9wb3dlci1jYW52YXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxpQkFBQSxFQUFtQixTQUFDLGNBQUQ7YUFDakIsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQURPLENBQW5CO0lBR0EsTUFBQSxFQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQTtJQURPLENBSFQ7SUFNQSxPQUFBLEVBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO0lBRE8sQ0FOVDtJQVNBLFlBQUEsRUFBYyxTQUFDLE1BQUQsRUFBUyxhQUFUO01BQ1osSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUE7TUFDQSxJQUE2QyxNQUE3QztlQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixNQUFwQixFQUE0QixhQUE1QixFQUFBOztJQUZZLENBVGQ7SUFhQSxXQUFBLEVBQWEsU0FBQyxNQUFEO2FBQ1gsTUFBTSxDQUFDLEtBQVAsR0FBZSxRQUFBLENBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBZCxDQUFtQixJQUFDLENBQUEsTUFBcEIsQ0FBVCxFQUFzQyxFQUF0QyxFQUEwQztRQUFBLFFBQUEsRUFBVSxLQUFWO09BQTFDO0lBREosQ0FiYjtJQWdCQSxPQUFBLEVBQVMsU0FBQyxNQUFELEVBQVMsY0FBVCxFQUF5QixLQUF6QixFQUFnQyxJQUFoQzthQUNQLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixFQUFxQixjQUFyQixFQUFxQyxLQUFyQyxFQUE0QyxJQUFLLENBQUEsTUFBQSxDQUFqRDtJQURPLENBaEJUOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsidGhyb3R0bGUgPSByZXF1aXJlIFwibG9kYXNoLnRocm90dGxlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZXRDYW52YXNSZW5kZXJlcjogKGNhbnZhc1JlbmRlcmVyKSAtPlxuICAgIEBjYW52YXMgPSBjYW52YXNSZW5kZXJlclxuXG4gIGVuYWJsZTogIC0+XG4gICAgQGNhbnZhcy5lbmFibGUoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGNhbnZhcy5kZXN0cm95KClcblxuICBvbkNoYW5nZVBhbmU6IChlZGl0b3IsIGVkaXRvckVsZW1lbnQpIC0+XG4gICAgQGNhbnZhcy5yZXNldENhbnZhcygpXG4gICAgQGNhbnZhcy5zZXR1cENhbnZhcyBlZGl0b3IsIGVkaXRvckVsZW1lbnQgaWYgZWRpdG9yXG5cbiAgb25OZXdDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgY3Vyc29yLnNwYXduID0gdGhyb3R0bGUgQGNhbnZhcy5zcGF3bi5iaW5kKEBjYW52YXMpLCAyNSwgdHJhaWxpbmc6IGZhbHNlXG5cbiAgb25JbnB1dDogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBkYXRhKSAtPlxuICAgIGN1cnNvci5zcGF3biBjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgZGF0YVsnc2l6ZSddXG4iXX0=
