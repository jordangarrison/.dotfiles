(function() {
  var $, AskStack, EditorView, WorkspaceView, ref;

  ref = require('atom'), $ = ref.$, EditorView = ref.EditorView, WorkspaceView = ref.WorkspaceView;

  AskStack = require('../lib/ask-stack');

  describe("AskStack", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('ask-stack');
    });
    return describe("when the ask-stack:ask-question event is triggered", function() {
      return it("attaches the view", function() {
        expect(atom.workspaceView.find('.ask-stack')).not.toExist();
        atom.workspaceView.trigger('ask-stack:ask-question');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(atom.workspaceView.find('.ask-stack')).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9zcGVjL2Fzay1zdGFjay1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxTQUFELEVBQUksMkJBQUosRUFBZ0I7O0VBRWhCLFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVI7O0VBT1gsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsaUJBQUEsR0FBb0I7SUFFcEIsVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFJLENBQUMsYUFBTCxHQUFxQixJQUFJO2FBQ3pCLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixXQUE5QjtJQUZYLENBQVg7V0FJQSxRQUFBLENBQVMsb0RBQVQsRUFBK0QsU0FBQTthQUM3RCxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQTtRQUN0QixNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixZQUF4QixDQUFQLENBQTZDLENBQUMsR0FBRyxDQUFDLE9BQWxELENBQUE7UUFJQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHdCQUEzQjtRQUVBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZDtRQURjLENBQWhCO2VBR0EsSUFBQSxDQUFLLFNBQUE7aUJBQ0gsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsWUFBeEIsQ0FBUCxDQUE2QyxDQUFDLE9BQTlDLENBQUE7UUFERyxDQUFMO01BVnNCLENBQXhCO0lBRDZELENBQS9EO0VBUG1CLENBQXJCO0FBVEEiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgRWRpdG9yVmlldywgV29ya3NwYWNlVmlld30gPSByZXF1aXJlICdhdG9tJ1xuXG5Bc2tTdGFjayA9IHJlcXVpcmUgJy4uL2xpYi9hc2stc3RhY2snXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuI1xuIyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbiMgb3IgYGZkZXNjcmliZWApLiBSZW1vdmUgdGhlIGBmYCB0byB1bmZvY3VzIHRoZSBibG9jay5cblxuZGVzY3JpYmUgXCJBc2tTdGFja1wiLCAtPlxuICBhY3RpdmF0aW9uUHJvbWlzZSA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYXRvbS53b3Jrc3BhY2VWaWV3ID0gbmV3IFdvcmtzcGFjZVZpZXdcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhc2stc3RhY2snKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgYXNrLXN0YWNrOmFzay1xdWVzdGlvbiBldmVudCBpcyB0cmlnZ2VyZWRcIiwgLT5cbiAgICBpdCBcImF0dGFjaGVzIHRoZSB2aWV3XCIsIC0+XG4gICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2VWaWV3LmZpbmQoJy5hc2stc3RhY2snKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAjIFRoaXMgaXMgYW4gYWN0aXZhdGlvbiBldmVudCwgdHJpZ2dlcmluZyBpdCB3aWxsIGNhdXNlIHRoZSBwYWNrYWdlIHRvIGJlXG4gICAgICAjIGFjdGl2YXRlZC5cbiAgICAgIGF0b20ud29ya3NwYWNlVmlldy50cmlnZ2VyICdhc2stc3RhY2s6YXNrLXF1ZXN0aW9uJ1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYWN0aXZhdGlvblByb21pc2VcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2VWaWV3LmZpbmQoJy5hc2stc3RhY2snKSkudG9FeGlzdCgpXG4iXX0=
