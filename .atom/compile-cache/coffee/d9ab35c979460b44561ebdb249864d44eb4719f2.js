(function() {
  describe('Autocomplete Snippets', function() {
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
    return describe('when opening a large file', function() {
      return it('provides suggestions in a timely way', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('h');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 2;
        });
        runs(function() {
          editor.insertText('t');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 3;
        });
        runs(function() {
          editor.insertText('p');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 4;
        });
        runs(function() {
          editor.insertText('s');
          return advanceClock(completionDelay);
        });
        return waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 5;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9zcGVjL2xhcmdlLWZpbGUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtBQUNoQyxRQUFBO0lBQUEsTUFBNEcsRUFBNUcsRUFBQyx5QkFBRCxFQUFtQix3QkFBbkIsRUFBb0MsZUFBcEMsRUFBNEMsbUJBQTVDLEVBQXdELGtCQUF4RCxFQUFtRSx5QkFBbkUsRUFBcUY7SUFFckYsVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFBLENBQUssU0FBQTtBQUVILFlBQUE7UUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFEO1FBRUEsZUFBQSxHQUFrQjtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLEVBQXlELGVBQXpEO1FBQ0EsZUFBQSxJQUFtQjtRQUNuQixnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO1FBQ25CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQjtRQUVBLG1CQUFBLEdBQXNCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixtQkFBMUI7UUFDdEIsbUJBQW1CLENBQUMsaUJBQXBCLENBQUE7UUFDQSxnQkFBQSxHQUFtQixtQkFBbUIsQ0FBQztRQUV2QyxLQUFBLENBQU0sZ0JBQU4sRUFBd0IsaUJBQXhCLENBQTBDLENBQUMsY0FBM0MsQ0FBQTtRQUVBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsb0JBQTFCO1FBQ1YsT0FBTyxDQUFDLGlCQUFSLENBQUE7UUFDQSxTQUFBLEdBQVksT0FBTyxDQUFDO2VBRXBCLEtBQUEsQ0FBTSxTQUFOLEVBQWlCLFNBQWpC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O2lCQUNBLFlBQUEsQ0FBYSxlQUFiO1FBRkcsQ0FBTDtRQUlBLFFBQUEsQ0FBUyxTQUFBO2lCQUNQLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxNQUE3QyxLQUF1RDtRQURoRCxDQUFUO1FBR0EsSUFBQSxDQUFLLFNBQUE7VUFDSCxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtpQkFDQSxZQUFBLENBQWEsZUFBYjtRQUZHLENBQUw7UUFJQSxRQUFBLENBQVMsU0FBQTtpQkFDUCxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBN0MsS0FBdUQ7UUFEaEQsQ0FBVDtRQUdBLElBQUEsQ0FBSyxTQUFBO1VBQ0gsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEI7aUJBQ0EsWUFBQSxDQUFhLGVBQWI7UUFGRyxDQUFMO2VBSUEsUUFBQSxDQUFTLFNBQUE7aUJBQ1AsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE1BQTdDLEtBQXVEO1FBRGhELENBQVQ7TUFwQ3lDLENBQTNDO0lBRG9DLENBQXRDO0VBaEVnQyxDQUFsQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ0F1dG9jb21wbGV0ZSBTbmlwcGV0cycsIC0+XG4gIFt3b3Jrc3BhY2VFbGVtZW50LCBjb21wbGV0aW9uRGVsYXksIGVkaXRvciwgZWRpdG9yVmlldywgcGF0aHNNYWluLCBhdXRvY29tcGxldGVNYWluLCBhdXRvY29tcGxldGVNYW5hZ2VyXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHJ1bnMgLT5cbiAgICAgICMgU2V0IHRvIGxpdmUgY29tcGxldGlvblxuICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcGx1cy5lbmFibGVBdXRvQWN0aXZhdGlvbicsIHRydWUpXG4gICAgICAjIFNldCB0aGUgY29tcGxldGlvbiBkZWxheVxuICAgICAgY29tcGxldGlvbkRlbGF5ID0gMTAwXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9jb21wbGV0ZS1wbHVzLmF1dG9BY3RpdmF0aW9uRGVsYXknLCBjb21wbGV0aW9uRGVsYXkpXG4gICAgICBjb21wbGV0aW9uRGVsYXkgKz0gMTAwICMgUmVuZGVyaW5nIGRlbGF5XG4gICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgICBhdXRvY29tcGxldGVQbHVzUGtnID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnYXV0b2NvbXBsZXRlLXBsdXMnKVxuICAgICAgYXV0b2NvbXBsZXRlUGx1c1BrZy5yZXF1aXJlTWFpbk1vZHVsZSgpXG4gICAgICBhdXRvY29tcGxldGVNYWluID0gYXV0b2NvbXBsZXRlUGx1c1BrZy5tYWluTW9kdWxlXG5cbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1haW4sICdjb25zdW1lUHJvdmlkZXInKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHBhdGhQa2cgPSBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdhdXRvY29tcGxldGUtcGF0aHMnKVxuICAgICAgcGF0aFBrZy5yZXF1aXJlTWFpbk1vZHVsZSgpXG4gICAgICBwYXRoc01haW4gPSBwYXRoUGtnLm1haW5Nb2R1bGVcblxuICAgICAgc3B5T24ocGF0aHNNYWluLCAncHJvdmlkZScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignJykudGhlbiAoZSkgLT5cbiAgICAgICAgZWRpdG9yID0gZVxuICAgICAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYXV0b2NvbXBsZXRlLXBsdXMnKVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIGF1dG9jb21wbGV0ZU1haW4uYXV0b2NvbXBsZXRlTWFuYWdlcj8ucmVhZHlcblxuICAgIHJ1bnMgLT5cbiAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIgPSBhdXRvY29tcGxldGVNYWluLmF1dG9jb21wbGV0ZU1hbmFnZXJcbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1hbmFnZXIsICdmaW5kU3VnZ2VzdGlvbnMnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBzcHlPbihhdXRvY29tcGxldGVNYW5hZ2VyLCAnZGlzcGxheVN1Z2dlc3Rpb25zJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24oYXV0b2NvbXBsZXRlTWFuYWdlciwgJ3Nob3dTdWdnZXN0aW9uTGlzdCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1hbmFnZXIsICdoaWRlU3VnZ2VzdGlvbkxpc3QnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdXRvY29tcGxldGUtcGF0aHMnKVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIHBhdGhzTWFpbi5wcm92aWRlLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICB3YWl0c0ZvciAtPlxuICAgICAgYXV0b2NvbXBsZXRlTWFpbi5jb25zdW1lUHJvdmlkZXIuY2FsbHMubGVuZ3RoIGlzIDFcblxuICBhZnRlckVhY2ggLT5cbiAgICBqYXNtaW5lLnVuc3B5KGF1dG9jb21wbGV0ZU1haW4sICdjb25zdW1lUHJvdmlkZXInKVxuICAgIGphc21pbmUudW5zcHkocGF0aHNNYWluLCAncHJvdmlkZScpXG4gICAgamFzbWluZS51bnNweShhdXRvY29tcGxldGVNYW5hZ2VyLCAnZmluZFN1Z2dlc3Rpb25zJylcbiAgICBqYXNtaW5lLnVuc3B5KGF1dG9jb21wbGV0ZU1hbmFnZXIsICdkaXNwbGF5U3VnZ2VzdGlvbnMnKVxuICAgIGphc21pbmUudW5zcHkoYXV0b2NvbXBsZXRlTWFuYWdlciwgJ3Nob3dTdWdnZXN0aW9uTGlzdCcpXG4gICAgamFzbWluZS51bnNweShhdXRvY29tcGxldGVNYW5hZ2VyLCAnaGlkZVN1Z2dlc3Rpb25MaXN0JylcblxuICBkZXNjcmliZSAnd2hlbiBvcGVuaW5nIGEgbGFyZ2UgZmlsZScsIC0+XG4gICAgaXQgJ3Byb3ZpZGVzIHN1Z2dlc3Rpb25zIGluIGEgdGltZWx5IHdheScsIC0+XG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdoJylcbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgndCcpXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAyXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ3QnKVxuICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBhdXRvY29tcGxldGVNYW5hZ2VyLmRpc3BsYXlTdWdnZXN0aW9ucy5jYWxscy5sZW5ndGggaXMgM1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdwJylcbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDRcblxuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgncycpXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyA1XG4iXX0=
