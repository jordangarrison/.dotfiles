(function() {
  var path;

  path = require('path');

  describe('Autocomplete Snippets', function() {
    var autocompleteMain, autocompleteManager, completionDelay, editor, editorView, pathsMain, ref, testConfig, workspaceElement;
    ref = [], workspaceElement = ref[0], completionDelay = ref[1], editor = ref[2], editorView = ref[3], pathsMain = ref[4], autocompleteMain = ref[5], autocompleteManager = ref[6];
    testConfig = {
      'autocomplete-plus.enableAutoActivation': true,
      'autocomplete-plus.minimumWordLength': -1,
      'autocomplete-plus.autoActivationDelay': 100
    };
    beforeEach(function() {
      runs(function() {
        var autocompletePlusPkg, pathPkg;
        Object.keys(testConfig).forEach(function(key) {
          return atom.config.set(key, testConfig[key]);
        });
        completionDelay = 100;
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
        return atom.workspace.open('sample.js').then(function(e) {
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
    return describe('when autocomplete-plus is enabled', function() {
      it('shows autocompletions when typing ./', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('.');
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus .word')).toHaveText('linkeddir');
          return expect(editorView.querySelector('.autocomplete-plus .right-label')).toHaveText('Dir');
        });
      });
      it('does not crash when typing an invalid folder', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('./sample.js');
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        return waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
      });
      it('does not crash when autocompleting symlinked paths', function() {
        runs(function() {
          var c, i, len, ref1;
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          ref1 = './linkeddir';
          for (i = 0, len = ref1.length; i < len; i++) {
            c = ref1[i];
            editor.insertText(c);
          }
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          advanceClock(completionDelay);
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 2;
        });
        return runs(function() {
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return advanceClock(completionDelay + 1000);
        });
      });
      return it('allows relative path completion without ./', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('linkeddir');
          editor.insertText('/');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus .word')).toHaveText('.gitkeep');
          return expect(editorView.querySelector('.autocomplete-plus .right-label')).toHaveText('File');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9zcGVjL2F1dG9jb21wbGV0ZS1wYXRocy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO0FBQ2hDLFFBQUE7SUFBQSxNQUE0RyxFQUE1RyxFQUFDLHlCQUFELEVBQW1CLHdCQUFuQixFQUFvQyxlQUFwQyxFQUE0QyxtQkFBNUMsRUFBd0Qsa0JBQXhELEVBQW1FLHlCQUFuRSxFQUFxRjtJQUVyRixVQUFBLEdBQWE7TUFDWCx3Q0FBQSxFQUEwQyxJQUQvQjtNQUVYLHFDQUFBLEVBQXVDLENBQUMsQ0FGN0I7TUFHWCx1Q0FBQSxFQUF5QyxHQUg5Qjs7SUFNYixVQUFBLENBQVcsU0FBQTtNQUNULElBQUEsQ0FBSyxTQUFBO0FBQ0gsWUFBQTtRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksVUFBWixDQUF1QixDQUFDLE9BQXhCLENBQWdDLFNBQUMsR0FBRDtpQkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLFVBQVcsQ0FBQSxHQUFBLENBQWhDO1FBRDhCLENBQWhDO1FBR0EsZUFBQSxHQUFrQjtRQUNsQixlQUFBLElBQW1CO1FBQ25CLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7UUFDbkIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCO1FBRUEsbUJBQUEsR0FBc0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLG1CQUExQjtRQUN0QixtQkFBbUIsQ0FBQyxpQkFBcEIsQ0FBQTtRQUNBLGdCQUFBLEdBQW1CLG1CQUFtQixDQUFDO1FBRXZDLEtBQUEsQ0FBTSxn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RCxDQUFDLFVBQTdELENBQXdFLFVBQXhFO2lCQUNBLE1BQUEsQ0FBTyxVQUFVLENBQUMsYUFBWCxDQUF5QixpQ0FBekIsQ0FBUCxDQUFtRSxDQUFDLFVBQXBFLENBQStFLE1BQS9FO1FBSEcsQ0FBTDtNQWIrQyxDQUFqRDtJQTVENEMsQ0FBOUM7RUFyRWdDLENBQWxDO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbmRlc2NyaWJlICdBdXRvY29tcGxldGUgU25pcHBldHMnLCAtPlxuICBbd29ya3NwYWNlRWxlbWVudCwgY29tcGxldGlvbkRlbGF5LCBlZGl0b3IsIGVkaXRvclZpZXcsIHBhdGhzTWFpbiwgYXV0b2NvbXBsZXRlTWFpbiwgYXV0b2NvbXBsZXRlTWFuYWdlcl0gPSBbXVxuXG4gIHRlc3RDb25maWcgPSB7XG4gICAgJ2F1dG9jb21wbGV0ZS1wbHVzLmVuYWJsZUF1dG9BY3RpdmF0aW9uJzogdHJ1ZVxuICAgICdhdXRvY29tcGxldGUtcGx1cy5taW5pbXVtV29yZExlbmd0aCc6IC0xXG4gICAgJ2F1dG9jb21wbGV0ZS1wbHVzLmF1dG9BY3RpdmF0aW9uRGVsYXknOiAxMDBcbiAgfVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBydW5zIC0+XG4gICAgICBPYmplY3Qua2V5cyh0ZXN0Q29uZmlnKS5mb3JFYWNoIChrZXkpIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChrZXksIHRlc3RDb25maWdba2V5XSlcblxuICAgICAgY29tcGxldGlvbkRlbGF5ID0gMTAwXG4gICAgICBjb21wbGV0aW9uRGVsYXkgKz0gMTAwICMgUmVuZGVyaW5nIGRlbGF5XG4gICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgICBhdXRvY29tcGxldGVQbHVzUGtnID0gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnYXV0b2NvbXBsZXRlLXBsdXMnKVxuICAgICAgYXV0b2NvbXBsZXRlUGx1c1BrZy5yZXF1aXJlTWFpbk1vZHVsZSgpXG4gICAgICBhdXRvY29tcGxldGVNYWluID0gYXV0b2NvbXBsZXRlUGx1c1BrZy5tYWluTW9kdWxlXG5cbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1haW4sICdjb25zdW1lUHJvdmlkZXInKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHBhdGhQa2cgPSBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdhdXRvY29tcGxldGUtcGF0aHMnKVxuICAgICAgcGF0aFBrZy5yZXF1aXJlTWFpbk1vZHVsZSgpXG4gICAgICBwYXRoc01haW4gPSBwYXRoUGtnLm1haW5Nb2R1bGVcblxuICAgICAgc3B5T24ocGF0aHNNYWluLCAncHJvdmlkZScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJykudGhlbiAoZSkgLT5cbiAgICAgICAgZWRpdG9yID0gZVxuICAgICAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYXV0b2NvbXBsZXRlLXBsdXMnKVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIGF1dG9jb21wbGV0ZU1haW4uYXV0b2NvbXBsZXRlTWFuYWdlcj8ucmVhZHlcblxuICAgIHJ1bnMgLT5cbiAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIgPSBhdXRvY29tcGxldGVNYWluLmF1dG9jb21wbGV0ZU1hbmFnZXJcbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1hbmFnZXIsICdmaW5kU3VnZ2VzdGlvbnMnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBzcHlPbihhdXRvY29tcGxldGVNYW5hZ2VyLCAnZGlzcGxheVN1Z2dlc3Rpb25zJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24oYXV0b2NvbXBsZXRlTWFuYWdlciwgJ3Nob3dTdWdnZXN0aW9uTGlzdCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIHNweU9uKGF1dG9jb21wbGV0ZU1hbmFnZXIsICdoaWRlU3VnZ2VzdGlvbkxpc3QnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdXRvY29tcGxldGUtcGF0aHMnKVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIHBhdGhzTWFpbi5wcm92aWRlLmNhbGxzLmxlbmd0aCBpcyAxXG5cbiAgICB3YWl0c0ZvciAtPlxuICAgICAgYXV0b2NvbXBsZXRlTWFpbi5jb25zdW1lUHJvdmlkZXIuY2FsbHMubGVuZ3RoIGlzIDFcblxuICBhZnRlckVhY2ggLT5cbiAgICBqYXNtaW5lLnVuc3B5KGF1dG9jb21wbGV0ZU1haW4sICdjb25zdW1lUHJvdmlkZXInKVxuICAgIGphc21pbmUudW5zcHkocGF0aHNNYWluLCAncHJvdmlkZScpXG4gICAgamFzbWluZS51bnNweShhdXRvY29tcGxldGVNYW5hZ2VyLCAnZmluZFN1Z2dlc3Rpb25zJylcbiAgICBqYXNtaW5lLnVuc3B5KGF1dG9jb21wbGV0ZU1hbmFnZXIsICdkaXNwbGF5U3VnZ2VzdGlvbnMnKVxuICAgIGphc21pbmUudW5zcHkoYXV0b2NvbXBsZXRlTWFuYWdlciwgJ3Nob3dTdWdnZXN0aW9uTGlzdCcpXG4gICAgamFzbWluZS51bnNweShhdXRvY29tcGxldGVNYW5hZ2VyLCAnaGlkZVN1Z2dlc3Rpb25MaXN0JylcblxuICBkZXNjcmliZSAnd2hlbiBhdXRvY29tcGxldGUtcGx1cyBpcyBlbmFibGVkJywgLT5cbiAgICBpdCAnc2hvd3MgYXV0b2NvbXBsZXRpb25zIHdoZW4gdHlwaW5nIC4vJywgLT5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZS1wbHVzJykpLm5vdC50b0V4aXN0KClcblxuICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJy4nKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnLycpXG5cbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyAud29yZCcpKS50b0hhdmVUZXh0KCdsaW5rZWRkaXInKVxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMgLnJpZ2h0LWxhYmVsJykpLnRvSGF2ZVRleHQoJ0RpcicpXG5cbiAgICBpdCAnZG9lcyBub3QgY3Jhc2ggd2hlbiB0eXBpbmcgYW4gaW52YWxpZCBmb2xkZXInLCAtPlxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnLi9zYW1wbGUuanMnKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnLycpXG5cbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgIGl0ICdkb2VzIG5vdCBjcmFzaCB3aGVuIGF1dG9jb21wbGV0aW5nIHN5bWxpbmtlZCBwYXRocycsIC0+XG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KGMpIGZvciBjIGluICcuL2xpbmtlZGRpcidcblxuICAgICAgICBhZHZhbmNlQ2xvY2soY29tcGxldGlvbkRlbGF5KVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBhdXRvY29tcGxldGVNYW5hZ2VyLmRpc3BsYXlTdWdnZXN0aW9ucy5jYWxscy5sZW5ndGggaXMgMVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgICMgU2VsZWN0IGxpbmtlZGRpclxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvclZpZXcsICdhdXRvY29tcGxldGUtcGx1czpjb25maXJtJylcbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnLycpXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF1dG9jb21wbGV0ZU1hbmFnZXIuZGlzcGxheVN1Z2dlc3Rpb25zLmNhbGxzLmxlbmd0aCBpcyAyXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgIyBTZWxlY3QgLmdpdGtlZXBcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnYXV0b2NvbXBsZXRlLXBsdXM6Y29uZmlybScpXG4gICAgICAgIGFkdmFuY2VDbG9jayhjb21wbGV0aW9uRGVsYXkgKyAxMDAwKVxuXG4gICAgaXQgJ2FsbG93cyByZWxhdGl2ZSBwYXRoIGNvbXBsZXRpb24gd2l0aG91dCAuLycsIC0+XG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cycpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCdsaW5rZWRkaXInKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnLycpXG5cbiAgICAgICAgYWR2YW5jZUNsb2NrKGNvbXBsZXRpb25EZWxheSlcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXV0b2NvbXBsZXRlTWFuYWdlci5kaXNwbGF5U3VnZ2VzdGlvbnMuY2FsbHMubGVuZ3RoIGlzIDFcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlLXBsdXMnKSkudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyAud29yZCcpKS50b0hhdmVUZXh0KCcuZ2l0a2VlcCcpXG4gICAgICAgIGV4cGVjdChlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtcGx1cyAucmlnaHQtbGFiZWwnKSkudG9IYXZlVGV4dCgnRmlsZScpXG4iXX0=
