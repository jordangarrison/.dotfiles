(function() {
  var Expose;

  Expose = require('../lib/expose');

  describe("Expose", function() {
    var activationPromise, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], activationPromise = ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('expose');
    });
    return describe("when the expose:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.expose-view')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'expose:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var exposeModule;
          expect(workspaceElement.querySelector('.expose-view')).toExist();
          exposeModule = atom.packages.loadedPackages['expose'].mainModule;
          expect(exposeModule.modalPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          return expect(exposeModule.modalPanel.isVisible()).toBe(false);
        });
      });
      it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.expose-view')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'expose:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var exposeElement;
          exposeElement = workspaceElement.querySelector('.expose-view');
          expect(exposeElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          return expect(exposeElement).not.toBeVisible();
        });
      });
      return it("disables animations with config", function() {
        atom.commands.dispatch(workspaceElement, 'expose:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var exposeElement;
          exposeElement = workspaceElement.querySelector('.expose-view');
          expect(exposeElement.classList.toString()).toContain('animate');
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          atom.config.set('expose.useAnimations', false);
          atom.commands.dispatch(workspaceElement, 'expose:toggle');
          return expect(exposeElement.classList.toString()).not.toContain('animate');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2V4cG9zZS9zcGVjL2V4cG9zZS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSOztFQUVULFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUE7QUFDakIsUUFBQTtJQUFBLE1BQXdDLEVBQXhDLEVBQUMseUJBQUQsRUFBbUI7SUFFbkIsVUFBQSxDQUFXLFNBQUE7TUFDVCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO2FBQ25CLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QjtJQUZYLENBQVg7V0FJQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQTtNQUNwRCxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtRQUNwQyxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsY0FBL0IsQ0FBUCxDQUFzRCxDQUFDLEdBQUcsQ0FBQyxPQUEzRCxDQUFBO1FBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxlQUF6QztRQUVBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZDtRQURjLENBQWhCO2VBR0EsSUFBQSxDQUFLLFNBQUE7QUFDSCxjQUFBO1VBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGNBQS9CLENBQVAsQ0FBc0QsQ0FBQyxPQUF2RCxDQUFBO1VBRUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBZSxDQUFBLFFBQUEsQ0FBUyxDQUFDO1VBQ3RELE1BQUEsQ0FBTyxZQUFZLENBQUMsVUFBVSxDQUFDLFNBQXhCLENBQUEsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELElBQWpEO1VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxlQUF6QztpQkFDQSxNQUFBLENBQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQyxTQUF4QixDQUFBLENBQVAsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxLQUFqRDtRQU5HLENBQUw7TUFSb0MsQ0FBdEM7TUFnQkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7UUFPN0IsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCO1FBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGNBQS9CLENBQVAsQ0FBc0QsQ0FBQyxHQUFHLENBQUMsT0FBM0QsQ0FBQTtRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsZUFBekM7UUFFQSxlQUFBLENBQWdCLFNBQUE7aUJBQ2Q7UUFEYyxDQUFoQjtlQUdBLElBQUEsQ0FBSyxTQUFBO0FBQ0gsY0FBQTtVQUFBLGFBQUEsR0FBZ0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsY0FBL0I7VUFDaEIsTUFBQSxDQUFPLGFBQVAsQ0FBcUIsQ0FBQyxXQUF0QixDQUFBO1VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxlQUF6QztpQkFDQSxNQUFBLENBQU8sYUFBUCxDQUFxQixDQUFDLEdBQUcsQ0FBQyxXQUExQixDQUFBO1FBSkcsQ0FBTDtNQWhCNkIsQ0FBL0I7YUFzQkEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUE7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxlQUF6QztRQUVBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZDtRQURjLENBQWhCO2VBR0EsSUFBQSxDQUFLLFNBQUE7QUFDSCxjQUFBO1VBQUEsYUFBQSxHQUFnQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixjQUEvQjtVQUNoQixNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxTQUEzQyxDQUFxRCxTQUFyRDtVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsZUFBekM7VUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLEtBQXhDO1VBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxlQUF6QztpQkFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxHQUFHLENBQUMsU0FBL0MsQ0FBeUQsU0FBekQ7UUFSRyxDQUFMO01BTm9DLENBQXRDO0lBdkNvRCxDQUF0RDtFQVBpQixDQUFuQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiRXhwb3NlID0gcmVxdWlyZSAnLi4vbGliL2V4cG9zZSdcblxuZGVzY3JpYmUgXCJFeHBvc2VcIiwgLT5cbiAgW3dvcmtzcGFjZUVsZW1lbnQsIGFjdGl2YXRpb25Qcm9taXNlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgYWN0aXZhdGlvblByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZXhwb3NlJylcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGV4cG9zZTp0b2dnbGUgZXZlbnQgaXMgdHJpZ2dlcmVkXCIsIC0+XG4gICAgaXQgXCJoaWRlcyBhbmQgc2hvd3MgdGhlIG1vZGFsIHBhbmVsXCIsIC0+XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZXhwb3NlLXZpZXcnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdleHBvc2U6dG9nZ2xlJ1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYWN0aXZhdGlvblByb21pc2VcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZXhwb3NlLXZpZXcnKSkudG9FeGlzdCgpXG5cbiAgICAgICAgZXhwb3NlTW9kdWxlID0gYXRvbS5wYWNrYWdlcy5sb2FkZWRQYWNrYWdlc1snZXhwb3NlJ10ubWFpbk1vZHVsZVxuICAgICAgICBleHBlY3QoZXhwb3NlTW9kdWxlLm1vZGFsUGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUgdHJ1ZVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdleHBvc2U6dG9nZ2xlJ1xuICAgICAgICBleHBlY3QoZXhwb3NlTW9kdWxlLm1vZGFsUGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcblxuICAgIGl0IFwiaGlkZXMgYW5kIHNob3dzIHRoZSB2aWV3XCIsIC0+XG4gICAgICAjIFRoaXMgdGVzdCBzaG93cyB5b3UgYW4gaW50ZWdyYXRpb24gdGVzdCB0ZXN0aW5nIGF0IHRoZSB2aWV3IGxldmVsLlxuXG4gICAgICAjIEF0dGFjaGluZyB0aGUgd29ya3NwYWNlRWxlbWVudCB0byB0aGUgRE9NIGlzIHJlcXVpcmVkIHRvIGFsbG93IHRoZVxuICAgICAgIyBgdG9CZVZpc2libGUoKWAgbWF0Y2hlcnMgdG8gd29yay4gQW55dGhpbmcgdGVzdGluZyB2aXNpYmlsaXR5IG9yIGZvY3VzXG4gICAgICAjIHJlcXVpcmVzIHRoYXQgdGhlIHdvcmtzcGFjZUVsZW1lbnQgaXMgb24gdGhlIERPTS4gVGVzdHMgdGhhdCBhdHRhY2ggdGhlXG4gICAgICAjIHdvcmtzcGFjZUVsZW1lbnQgdG8gdGhlIERPTSBhcmUgZ2VuZXJhbGx5IHNsb3dlciB0aGFuIHRob3NlIG9mZiBET00uXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5leHBvc2UtdmlldycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ2V4cG9zZTp0b2dnbGUnXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cG9zZUVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5leHBvc2UtdmlldycpXG4gICAgICAgIGV4cGVjdChleHBvc2VFbGVtZW50KS50b0JlVmlzaWJsZSgpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ2V4cG9zZTp0b2dnbGUnXG4gICAgICAgIGV4cGVjdChleHBvc2VFbGVtZW50KS5ub3QudG9CZVZpc2libGUoKVxuXG4gICAgaXQgXCJkaXNhYmxlcyBhbmltYXRpb25zIHdpdGggY29uZmlnXCIsIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdleHBvc2U6dG9nZ2xlJ1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYWN0aXZhdGlvblByb21pc2VcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBvc2VFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZXhwb3NlLXZpZXcnKVxuICAgICAgICBleHBlY3QoZXhwb3NlRWxlbWVudC5jbGFzc0xpc3QudG9TdHJpbmcoKSkudG9Db250YWluICdhbmltYXRlJ1xuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ2V4cG9zZTp0b2dnbGUnXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZXhwb3NlLnVzZUFuaW1hdGlvbnMnLCBmYWxzZSlcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdleHBvc2U6dG9nZ2xlJ1xuICAgICAgICBleHBlY3QoZXhwb3NlRWxlbWVudC5jbGFzc0xpc3QudG9TdHJpbmcoKSkubm90LnRvQ29udGFpbiAnYW5pbWF0ZSdcbiJdfQ==
