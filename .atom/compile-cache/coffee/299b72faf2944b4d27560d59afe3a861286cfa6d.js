(function() {
  describe('Issue 11', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, pathsMain, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], completionDelay = ref[1], editor = ref[2], editorView = ref[3], pathsMain = ref[4], autocompleteMain = ref[5], autocompleteManager = ref[6];
    beforeEach(function() {
      runs(function() {
        var autocompletePlusPkg, pathPkg;
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        autocompletePlusPkg = atom.packages.loadPackage('autocomplete-plus');
        autocompletePlusPkg.requireMainModule();
        autocompleteMain = autocompletePlusPkg.mainModule;
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        pathPkg = atom.packages.loadPackage('autocomplete-paths');
        pathPkg.requireMainModule();
        pathsMain = pathPkg.mainModule;
        return spyOn(pathsMain, 'provide').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.workspace.open('').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-plus');
      });
      waitsFor(function() {
        var ref1;
        return (ref1 = autocompleteMain.autocompleteManager) != null ? ref1.ready : void 0;
      });
      runs(function() {
        autocompleteManager = autocompleteMain.autocompleteManager;
        spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
        spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        spyOn(autocompleteManager, 'showSuggestionList').andCallThrough();
        return spyOn(autocompleteManager, 'hideSuggestionList').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-paths');
      });
      waitsFor(function() {
        return pathsMain.provide.calls.length === 1;
      });
      return waitsFor(function() {
        return autocompleteMain.consumeProvider.calls.length === 1;
      });
    });
    afterEach(function() {
      jasmine.unspy(autocompleteMain, 'consumeProvider');
      jasmine.unspy(pathsMain, 'provide');
      jasmine.unspy(autocompleteManager, 'findSuggestions');
      jasmine.unspy(autocompleteManager, 'displaySuggestions');
      jasmine.unspy(autocompleteManager, 'showSuggestionList');
      return jasmine.unspy(autocompleteManager, 'hideSuggestionList');
    });
    return describe('when an editor with no path is opened', function() {
      return it('does not have issues', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9zcGVjL2lzc3Vlcy8xMS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUE7QUFDbkIsUUFBQTtJQUFBLE1BQTRHLEVBQTVHLEVBQUMseUJBQUQsRUFBbUIsd0JBQW5CLEVBQW9DLGVBQXBDLEVBQTRDLG1CQUE1QyxFQUF3RCxrQkFBeEQsRUFBbUUseUJBQW5FLEVBQXFGO0lBRXJGLFVBQUEsQ0FBVyxTQUFBO01BQ1QsSUFBQSxDQUFLLFNBQUE7QUFFSCxZQUFBO1FBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxJQUExRDtRQUVBLGVBQUEsR0FBa0I7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixFQUF5RCxlQUF6RDtRQUNBLGVBQUEsSUFBbUI7UUFDbkIsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtRQUNuQixPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEI7UUFFQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsbUJBQTFCO1FBQ3RCLG1CQUFtQixDQUFDLGlCQUFwQixDQUFBO1FBQ0EsZ0JBQUEsR0FBbUIsbUJBQW1CLENBQUM7UUFFdkMsS0FBQSxDQUFNLGdCQUFOLEVBQXdCLGlCQUF4QixDQUEwQyxDQUFDLGNBQTNDLENBQUE7UUFFQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLG9CQUExQjtRQUNWLE9BQU8sQ0FBQyxpQkFBUixDQUFBO1FBQ0EsU0FBQSxHQUFZLE9BQU8sQ0FBQztlQUVwQixLQUFBLENBQU0sU0FBTixFQUFpQixTQUFqQixD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Y29tcGxldGlvbkRlbGF5LCBlZGl0b3IsIGVkaXRvclZpZXcsIHBhdGhzTWFpbiwgYXV0b2NvbXBsZXRlTWFpbiwgYXV0b2NvbXBsZXRlTWFuYWdlcl0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBydW5zIC0+XG4gICAgICAjIFNldCB0byBsaXZlIGNvbXBsZXRpb25cbiAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nLCB0cnVlKVxuICAgICAgIyBTZXQgdGhlIGNvbXBsZXRpb24gZGVsYXlcbiAgICAgIGNvbXBsZXRpb25EZWxheSA9IDEwMFxuICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcGx1cy5hdXRvQWN0aXZhdGlvbkRlbGF5JywgY29tcGxldGlvbkRlbGF5KVxuICAgICAgY29tcGxldGlvbkRlbGF5ICs9IDEwMCAjIFJlbmRlcmluZyBkZWxheVxuICAgICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgICAgYXV0b2NvbXBsZXRlUGx1c1BrZyA9IGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1wbHVzJylcbiAgICAgIGF1dG9jb21wbGV0ZVBsdXNQa2cucmVxdWlyZU1haW5Nb2R1bGUoKVxuICAgICAgYXV0b2NvbXBsZXRlTWFpbiA9IGF1dG9jb21wbGV0ZVBsdXNQa2cubWFpbk1vZHVsZVxuXG4gICAgICBzcHlPbihhdXRvY29tcGxldGVNYWluLCAnY29uc3VtZVByb3ZpZGVyJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICBwYXRoUGtnID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnYXV0b2NvbXBsZXRlLXBhdGhzJylcbiAgICAgIHBhdGhQa2cucmVxdWlyZU1haW5Nb2R1bGUoKVxuICAgICAgcGF0aHNNYWluID0gcGF0aFBrZy5tYWluTW9kdWxlXG5cbiAgICAgIHNweU9uKHBhdGhzTWFpbiwgJ3Byb3ZpZGUnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJycpLnRoZW4gKGUpIC0+XG4gICAgICAgIGVkaXRvciA9IGVcbiAgICAgICAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1qYXZhc2NyaXB0JylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F1dG9jb21wbGV0ZS1wbHVzJylcblxuICAgIHdhaXRzRm9yIC0+XG4gICAgICBhdXRvY29tcGxldGVNYWluLmF1dG9jb21wbGV0ZU1hbmFnZXI/LnJlYWR5XG5cbiAgICBydW5zIC0+XG4gICAgICBhdXRvY29tcGxldGVNYW5hZ2VyID0gYXV0b2NvbXBsZXRlTWFpbi5hdXRvY29tcGxldGVNYW5hZ2VyXG4gICAgICBzcHlPbihhdXRvY29tcGxldGVNYW5hZ2VyLCAnZmluZFN1Z2dlc3Rpb25zJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24oYXV0b2NvbXBsZXRlTWFuYWdlciwgJ2Rpc3BsYXlTdWdnZXN0aW9ucycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1hbmFnZXIsICdzaG93U3VnZ2VzdGlvbkxpc3QnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBzcHlPbihhdXRvY29tcGxldGVNYW5hZ2VyLCAnaGlkZVN1Z2dlc3Rpb25MaXN0JykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYXV0b2NvbXBsZXRlLXBhdGhzJylcblxuICAgIHdhaXRzRm9yIC0+XG4gICAgICBwYXRoc01haW4ucHJvdmlkZS5jYWxscy5sZW5ndGggaXMgMVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIGF1dG9jb21wbGV0ZU1haW4uY29uc3VtZVByb3ZpZGVyLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgamFzbWluZS51bnNweShhdXRvY29tcGxldGVNYWluLCAnY29uc3VtZVByb3ZpZGVyJylcbiAgICBqYXNtaW5lLnVuc3B5KHBhdGhzTWFpbiwgJ3Byb3ZpZGUnKVxuICAgIGphc21pbmUudW5zcHkoYXV0b2NvbXBsZXRlTWFuYWdlciwgJ2ZpbmRTdWdnZXN0aW9ucycpXG4gICAgamFzbWluZS51bnNweShhdXRvY29tcGxldGVNYW5hZ2VyLCAnZGlzcGxheVN1Z2dlc3Rpb25zJylcbiAgICBqYXNtaW5lLnVuc3B5KGF1dG9jb21wbGV0ZU1hbmFnZXIsICdzaG93U3VnZ2VzdGlvbkxpc3QnKVxuICAgIGphc21pbmUudW5zcHkoYXV0b2NvbXBsZXRlTWFuYWdlciwgJ2hpZGVTdWdnZXN0aW9uTGlzdCcpXG5cbiAgZGVzY3JpYmUgJ3doZW4gYW4gZWRpdG9yIHdpdGggbm8gcGF0aCBpcyBvcGVuZWQnLCAtPlxuICAgIGl0ICdkb2VzIG5vdCBoYXZlIGlzc3VlcycsIC0+XG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCcvJylcblxuICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBhdXRvY29tcGxldGVNYW5hZ2VyLmRpc3BsYXlTdWdnZXN0aW9ucy5jYWxscy5sZW5ndGggaXMgMVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG4iXX0=
