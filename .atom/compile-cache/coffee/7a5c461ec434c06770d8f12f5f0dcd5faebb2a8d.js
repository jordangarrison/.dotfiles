(function() {
  var Citation, CiteView, FindLabels, LabelView, Latexer, fs;

  Latexer = require('../lib/latexer');

  LabelView = require('../lib/label-view');

  CiteView = require('../lib/cite-view');

  Citation = require('../lib/citation');

  FindLabels = require('../lib/find-labels');

  fs = require('fs-plus');

  describe("Latexer", function() {
    describe("finding labels", function() {
      return it("gets the correct labels", function() {
        var i, j, label, labels, len, results, text;
        text = "\\label{value0} some text \\label{value1} \\other{things} \\label{value2}";
        labels = FindLabels.getLabelsByText(text);
        results = [];
        for (i = j = 0, len = labels.length; j < len; i = ++j) {
          label = labels[i];
          results.push(expect(label.label).toBe("value" + i));
        }
        return results;
      });
    });
    describe("new citation is created", function() {
      return it("extracts the correct values", function() {
        var cite, i, j, len, ref, results, testCite;
        testCite = "@test {key,\nfield0 = {vfield0},\nfield1 = {vfield1},\nfield2 = \"vfield2\",\nfield3 = \"vfield3\"\n}";
        cite = new Citation;
        cite.parse(testCite);
        expect(cite.get("key")).toBe("key");
        ref = [0, 1, 2, 3];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          results.push(expect(cite.get("field" + i)).toBe("vfield" + i));
        }
        return results;
      });
    });
    describe("the views", function() {
      var bibText, citeText, editor, labelText, ref, workspaceElement;
      ref = [], workspaceElement = ref[0], editor = ref[1];
      citeText = "\\bibliography{bibfile.bib}\\cite{";
      labelText = "\\label{value}\\ref{";
      bibText = "@{key0, title = {title0}, author = {author0} } comments here @{key1, title = {title1}, author = {author1} }";
      beforeEach(function() {
        runs(function() {
          return workspaceElement = atom.views.getView(atom.workspace);
        });
        waitsFor(function() {
          return workspaceElement;
        });
        runs(function() {
          return jasmine.attachToDOM(workspaceElement);
        });
        waitsForPromise(function() {
          return atom.workspace.open("sample.tex");
        });
        waitsFor(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage("latexer");
        });
        return runs(function() {
          spyOn(FindLabels, "getAbsolutePath").andReturn("bibfile.bib");
          return spyOn(fs, "readFileSync").andReturn(bibText);
        });
      });
      describe("typing \\ref{", function() {
        return it("shows the labels to select from", function() {
          var displayedLabels, labelElement;
          editor.setText(labelText);
          advanceClock(editor.getBuffer().getStoppedChangingDelay());
          labelElement = workspaceElement.querySelector('.label-view');
          expect(labelElement).toExist();
          displayedLabels = labelElement.querySelectorAll('li');
          expect(displayedLabels.length).toBe(1);
          return expect(displayedLabels[0].textContent).toBe("value");
        });
      });
      return describe("typing \\cite{", function() {
        return it("show the bibliography", function() {
          var cite, citeElement, displayedCites, i, info, j, len, results;
          editor.setText(citeText);
          advanceClock(editor.getBuffer().getStoppedChangingDelay());
          expect(fs.readFileSync).toHaveBeenCalledWith("bibfile.bib");
          citeElement = workspaceElement.querySelector('.cite-view');
          expect(citeElement).toExist();
          displayedCites = citeElement.querySelectorAll('li');
          expect(displayedCites.length).toBe(2);
          results = [];
          for (i = j = 0, len = displayedCites.length; j < len; i = ++j) {
            cite = displayedCites[i];
            info = cite.querySelectorAll("span");
            expect(info.length).toBe(2);
            expect(info[0].textContent).toBe("title" + i);
            results.push(expect(info[1].textContent).toBe("author" + i));
          }
          return results;
        });
      });
    });
    return describe("typing \\begin{evironment} or \\[", function() {
      var editor, ref, workspaceElement;
      ref = [], workspaceElement = ref[0], editor = ref[1];
      beforeEach(function() {
        runs(function() {
          return workspaceElement = atom.views.getView(atom.workspace);
        });
        waitsFor(function() {
          return workspaceElement;
        });
        runs(function() {
          return jasmine.attachToDOM(workspaceElement);
        });
        waitsForPromise(function() {
          return atom.workspace.open("sample.tex");
        });
        waitsFor(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
        return waitsForPromise(function() {
          return atom.packages.activatePackage("latexer");
        });
      });
      it("autocompletes the environment", function() {
        editor.setText("\\begin{env}\n");
        advanceClock(editor.getBuffer().getStoppedChangingDelay());
        expect(editor.getText()).toBe("\\begin{env}\n\n\\end{env}");
        editor.setText("\\[\n");
        advanceClock(editor.getBuffer().getStoppedChangingDelay());
        return expect(editor.getText()).toBe("\\[\n\n\\]");
      });
      it("ignores comments", function() {
        editor.setText("%\\begin{env}\n");
        advanceClock(editor.getBuffer().getStoppedChangingDelay());
        expect(editor.getText()).toBe("%\\begin{env}\n");
        editor.setText("%\\[\n");
        advanceClock(editor.getBuffer().getStoppedChangingDelay());
        return expect(editor.getText()).toBe("%\\[\n");
      });
      return it("ignores extra backslashes for \\[", function() {
        editor.setText("\\\\[\n");
        advanceClock(editor.getBuffer().getStoppedChangingDelay());
        return expect(editor.getText()).toBe("\\\\[\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4ZXIvc3BlYy9sYXRleGVyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGdCQUFSOztFQUNWLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBQ1osUUFBQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUjs7RUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsb0JBQVI7O0VBQ2IsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUE7SUFFbEIsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7YUFDekIsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUE7QUFDNUIsWUFBQTtRQUFBLElBQUEsR0FBTztRQUNQLE1BQUEsR0FBUyxVQUFVLENBQUMsZUFBWCxDQUEyQixJQUEzQjtBQUNUO2FBQUEsZ0RBQUE7O3VCQUNFLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBYixDQUFtQixDQUFDLElBQXBCLENBQXlCLE9BQUEsR0FBUSxDQUFqQztBQURGOztNQUg0QixDQUE5QjtJQUR5QixDQUEzQjtJQU9BLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBO2FBQ2xDLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBO0FBQ2hDLFlBQUE7UUFBQSxRQUFBLEdBQVc7UUFRWCxJQUFBLEdBQU8sSUFBSTtRQUNYLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBWDtRQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBUCxDQUF1QixDQUFDLElBQXhCLENBQTZCLEtBQTdCO0FBQ0E7QUFBQTthQUFBLHFDQUFBOzt1QkFDRSxNQUFBLENBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFBLEdBQVEsQ0FBakIsQ0FBUCxDQUE2QixDQUFDLElBQTlCLENBQW1DLFFBQUEsR0FBUyxDQUE1QztBQURGOztNQVpnQyxDQUFsQztJQURrQyxDQUFwQztJQWdCQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBO0FBQ3BCLFVBQUE7TUFBQSxNQUE2QixFQUE3QixFQUFDLHlCQUFELEVBQW1CO01BQ25CLFFBQUEsR0FBVztNQUNYLFNBQUEsR0FBWTtNQUNaLE9BQUEsR0FBVTtNQWFWLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsSUFBQSxDQUFLLFNBQUE7aUJBQ0gsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtRQURoQixDQUFMO1FBRUEsUUFBQSxDQUFTLFNBQUE7aUJBQ1A7UUFETyxDQUFUO1FBRUEsSUFBQSxDQUFLLFNBQUE7aUJBQ0gsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCO1FBREcsQ0FBTDtRQUVBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEI7UUFEYyxDQUFoQjtRQUVBLFFBQUEsQ0FBUyxTQUFBO2lCQUNQLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7UUFERixDQUFUO1FBRUEsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixTQUE5QjtRQURjLENBQWhCO2VBRUEsSUFBQSxDQUFLLFNBQUE7VUFDSCxLQUFBLENBQU0sVUFBTixFQUFrQixpQkFBbEIsQ0FBb0MsQ0FBQyxTQUFyQyxDQUErQyxhQUEvQztpQkFDQSxLQUFBLENBQU0sRUFBTixFQUFVLGNBQVYsQ0FBeUIsQ0FBQyxTQUExQixDQUFvQyxPQUFwQztRQUZHLENBQUw7TUFiUyxDQUFYO01BaUJBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7ZUFDeEIsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUE7QUFDcEMsY0FBQTtVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZjtVQUNBLFlBQUEsQ0FBYSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsdUJBQW5CLENBQUEsQ0FBYjtVQUNBLFlBQUEsR0FBZSxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixhQUEvQjtVQUNmLE1BQUEsQ0FBTyxZQUFQLENBQW9CLENBQUMsT0FBckIsQ0FBQTtVQUNBLGVBQUEsR0FBa0IsWUFBWSxDQUFDLGdCQUFiLENBQThCLElBQTlCO1VBQ2xCLE1BQUEsQ0FBTyxlQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztpQkFDQSxNQUFBLENBQU8sZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUExQixDQUFzQyxDQUFDLElBQXZDLENBQTRDLE9BQTVDO1FBUG9DLENBQXRDO01BRHdCLENBQTFCO2FBVUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7ZUFDekIsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUE7QUFDMUIsY0FBQTtVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBZjtVQUNBLFlBQUEsQ0FBYSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsdUJBQW5CLENBQUEsQ0FBYjtVQUNBLE1BQUEsQ0FBTyxFQUFFLENBQUMsWUFBVixDQUF1QixDQUFDLG9CQUF4QixDQUE2QyxhQUE3QztVQUNBLFdBQUEsR0FBYyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixZQUEvQjtVQUNkLE1BQUEsQ0FBTyxXQUFQLENBQW1CLENBQUMsT0FBcEIsQ0FBQTtVQUNBLGNBQUEsR0FBaUIsV0FBVyxDQUFDLGdCQUFaLENBQTZCLElBQTdCO1VBQ2pCLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBdEIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxDQUFuQztBQUNBO2VBQUEsd0RBQUE7O1lBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxnQkFBTCxDQUFzQixNQUF0QjtZQUNQLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBWixDQUFtQixDQUFDLElBQXBCLENBQXlCLENBQXpCO1lBQ0EsTUFBQSxDQUFPLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFmLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsT0FBQSxHQUFRLENBQXpDO3lCQUNBLE1BQUEsQ0FBTyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBZixDQUEyQixDQUFDLElBQTVCLENBQWlDLFFBQUEsR0FBUyxDQUExQztBQUpGOztRQVIwQixDQUE1QjtNQUR5QixDQUEzQjtJQTVDb0IsQ0FBdEI7V0EyREEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7QUFDNUMsVUFBQTtNQUFBLE1BQTZCLEVBQTdCLEVBQUMseUJBQUQsRUFBbUI7TUFDbkIsVUFBQSxDQUFXLFNBQUE7UUFDVCxJQUFBLENBQUssU0FBQTtpQkFDSCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO1FBRGhCLENBQUw7UUFFQSxRQUFBLENBQVMsU0FBQTtpQkFDUDtRQURPLENBQVQ7UUFFQSxJQUFBLENBQUssU0FBQTtpQkFDSCxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEI7UUFERyxDQUFMO1FBRUEsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQjtRQURjLENBQWhCO1FBRUEsUUFBQSxDQUFTLFNBQUE7aUJBQ1AsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtRQURGLENBQVQ7ZUFFQSxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFNBQTlCO1FBRGMsQ0FBaEI7TUFYUyxDQUFYO01BYUEsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7UUFDbEMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnQkFBZjtRQUNBLFlBQUEsQ0FBYSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsdUJBQW5CLENBQUEsQ0FBYjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0QkFBOUI7UUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLE9BQWY7UUFDQSxZQUFBLENBQWEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLHVCQUFuQixDQUFBLENBQWI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsWUFBOUI7TUFOa0MsQ0FBcEM7TUFPQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQTtRQUNyQixNQUFNLENBQUMsT0FBUCxDQUFlLGlCQUFmO1FBQ0EsWUFBQSxDQUFhLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyx1QkFBbkIsQ0FBQSxDQUFiO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QjtRQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBZjtRQUNBLFlBQUEsQ0FBYSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsdUJBQW5CLENBQUEsQ0FBYjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QjtNQU5xQixDQUF2QjthQU9BLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBO1FBQ3RDLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZjtRQUNBLFlBQUEsQ0FBYSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsdUJBQW5CLENBQUEsQ0FBYjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QjtNQUhzQyxDQUF4QztJQTdCNEMsQ0FBOUM7RUFwRmtCLENBQXBCO0FBUEEiLCJzb3VyY2VzQ29udGVudCI6WyJMYXRleGVyID0gcmVxdWlyZSAnLi4vbGliL2xhdGV4ZXInXG5MYWJlbFZpZXcgPSByZXF1aXJlICcuLi9saWIvbGFiZWwtdmlldydcbkNpdGVWaWV3ID0gcmVxdWlyZSAnLi4vbGliL2NpdGUtdmlldydcbkNpdGF0aW9uID0gcmVxdWlyZSAnLi4vbGliL2NpdGF0aW9uJ1xuRmluZExhYmVscyA9IHJlcXVpcmUgJy4uL2xpYi9maW5kLWxhYmVscydcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxuZGVzY3JpYmUgXCJMYXRleGVyXCIsIC0+XG5cbiAgZGVzY3JpYmUgXCJmaW5kaW5nIGxhYmVsc1wiLCAtPlxuICAgIGl0IFwiZ2V0cyB0aGUgY29ycmVjdCBsYWJlbHNcIiwgLT5cbiAgICAgIHRleHQgPSBcIlxcXFxsYWJlbHt2YWx1ZTB9IHNvbWUgdGV4dCBcXFxcbGFiZWx7dmFsdWUxfSBcXFxcb3RoZXJ7dGhpbmdzfSBcXFxcbGFiZWx7dmFsdWUyfVwiXG4gICAgICBsYWJlbHMgPSBGaW5kTGFiZWxzLmdldExhYmVsc0J5VGV4dCh0ZXh0KVxuICAgICAgZm9yIGxhYmVsLCBpIGluIGxhYmVsc1xuICAgICAgICBleHBlY3QobGFiZWwubGFiZWwpLnRvQmUgXCJ2YWx1ZSN7aX1cIlxuXG4gIGRlc2NyaWJlIFwibmV3IGNpdGF0aW9uIGlzIGNyZWF0ZWRcIiwgLT5cbiAgICBpdCBcImV4dHJhY3RzIHRoZSBjb3JyZWN0IHZhbHVlc1wiLCAtPlxuICAgICAgdGVzdENpdGUgPSBcIlwiXCJcbiAgICAgICAgICAgICAgICAgQHRlc3Qge2tleSxcbiAgICAgICAgICAgICAgICAgZmllbGQwID0ge3ZmaWVsZDB9LFxuICAgICAgICAgICAgICAgICBmaWVsZDEgPSB7dmZpZWxkMX0sXG4gICAgICAgICAgICAgICAgIGZpZWxkMiA9IFwidmZpZWxkMlwiLFxuICAgICAgICAgICAgICAgICBmaWVsZDMgPSBcInZmaWVsZDNcIlxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgY2l0ZSA9IG5ldyBDaXRhdGlvblxuICAgICAgY2l0ZS5wYXJzZSh0ZXN0Q2l0ZSlcbiAgICAgIGV4cGVjdChjaXRlLmdldChcImtleVwiKSkudG9CZSBcImtleVwiXG4gICAgICBmb3IgaSBpbiBbMCwxLDIsM11cbiAgICAgICAgZXhwZWN0KGNpdGUuZ2V0KFwiZmllbGQje2l9XCIpKS50b0JlIFwidmZpZWxkI3tpfVwiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgdmlld3NcIiwgLT5cbiAgICBbd29ya3NwYWNlRWxlbWVudCwgZWRpdG9yXSA9IFtdXG4gICAgY2l0ZVRleHQgPSBcIlxcXFxiaWJsaW9ncmFwaHl7YmliZmlsZS5iaWJ9XFxcXGNpdGV7XCJcbiAgICBsYWJlbFRleHQgPSBcIlxcXFxsYWJlbHt2YWx1ZX1cXFxccmVme1wiXG4gICAgYmliVGV4dCA9IFwiXG4gICAgQHtrZXkwLFxuICAgIHRpdGxlID0ge3RpdGxlMH0sXG4gICAgYXV0aG9yID0ge2F1dGhvcjB9XG4gICAgfVxuXG4gICAgY29tbWVudHMgaGVyZVxuXG4gICAgQHtrZXkxLFxuICAgIHRpdGxlID0ge3RpdGxlMX0sXG4gICAgYXV0aG9yID0ge2F1dGhvcjF9XG4gICAgfVxuICAgIFwiXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcnVucyAtPlxuICAgICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgd29ya3NwYWNlRWxlbWVudFxuICAgICAgcnVucyAtPlxuICAgICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihcInNhbXBsZS50ZXhcIilcbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwibGF0ZXhlclwiKVxuICAgICAgcnVucyAtPlxuICAgICAgICBzcHlPbihGaW5kTGFiZWxzLCBcImdldEFic29sdXRlUGF0aFwiKS5hbmRSZXR1cm4oXCJiaWJmaWxlLmJpYlwiKVxuICAgICAgICBzcHlPbihmcywgXCJyZWFkRmlsZVN5bmNcIikuYW5kUmV0dXJuKGJpYlRleHQpXG5cbiAgICBkZXNjcmliZSBcInR5cGluZyBcXFxccmVme1wiLCAtPlxuICAgICAgaXQgXCJzaG93cyB0aGUgbGFiZWxzIHRvIHNlbGVjdCBmcm9tXCIsIC0+XG4gICAgICAgIGVkaXRvci5zZXRUZXh0IGxhYmVsVGV4dFxuICAgICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yLmdldEJ1ZmZlcigpLmdldFN0b3BwZWRDaGFuZ2luZ0RlbGF5KCkpXG4gICAgICAgIGxhYmVsRWxlbWVudCA9IHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxhYmVsLXZpZXcnKVxuICAgICAgICBleHBlY3QobGFiZWxFbGVtZW50KS50b0V4aXN0KClcbiAgICAgICAgZGlzcGxheWVkTGFiZWxzID0gbGFiZWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylcbiAgICAgICAgZXhwZWN0KGRpc3BsYXllZExhYmVscy5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QoZGlzcGxheWVkTGFiZWxzWzBdLnRleHRDb250ZW50KS50b0JlIFwidmFsdWVcIlxuXG4gICAgZGVzY3JpYmUgXCJ0eXBpbmcgXFxcXGNpdGV7XCIsIC0+XG4gICAgICBpdCBcInNob3cgdGhlIGJpYmxpb2dyYXBoeVwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCBjaXRlVGV4dFxuICAgICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yLmdldEJ1ZmZlcigpLmdldFN0b3BwZWRDaGFuZ2luZ0RlbGF5KCkpXG4gICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFwiYmliZmlsZS5iaWJcIilcbiAgICAgICAgY2l0ZUVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaXRlLXZpZXcnKVxuICAgICAgICBleHBlY3QoY2l0ZUVsZW1lbnQpLnRvRXhpc3QoKVxuICAgICAgICBkaXNwbGF5ZWRDaXRlcyA9IGNpdGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylcbiAgICAgICAgZXhwZWN0KGRpc3BsYXllZENpdGVzLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGZvciBjaXRlLCBpIGluIGRpc3BsYXllZENpdGVzXG4gICAgICAgICAgaW5mbyA9IGNpdGUucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIilcbiAgICAgICAgICBleHBlY3QoaW5mby5sZW5ndGgpLnRvQmUgMlxuICAgICAgICAgIGV4cGVjdChpbmZvWzBdLnRleHRDb250ZW50KS50b0JlIFwidGl0bGUje2l9XCJcbiAgICAgICAgICBleHBlY3QoaW5mb1sxXS50ZXh0Q29udGVudCkudG9CZSBcImF1dGhvciN7aX1cIlxuXG4gIGRlc2NyaWJlIFwidHlwaW5nIFxcXFxiZWdpbntldmlyb25tZW50fSBvciBcXFxcW1wiLCAtPlxuICAgIFt3b3Jrc3BhY2VFbGVtZW50LCBlZGl0b3JdID0gW11cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBydW5zIC0+XG4gICAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICB3b3Jrc3BhY2VFbGVtZW50XG4gICAgICBydW5zIC0+XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFwic2FtcGxlLnRleFwiKVxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJsYXRleGVyXCIpXG4gICAgaXQgXCJhdXRvY29tcGxldGVzIHRoZSBlbnZpcm9ubWVudFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcXFxcYmVnaW57ZW52fVxcblwiXG4gICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yLmdldEJ1ZmZlcigpLmdldFN0b3BwZWRDaGFuZ2luZ0RlbGF5KCkpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlxcXFxiZWdpbntlbnZ9XFxuXFxuXFxcXGVuZHtlbnZ9XCJcbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXFxcXFtcXG5cIlxuICAgICAgYWR2YW5jZUNsb2NrKGVkaXRvci5nZXRCdWZmZXIoKS5nZXRTdG9wcGVkQ2hhbmdpbmdEZWxheSgpKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcXFxcW1xcblxcblxcXFxdXCJcbiAgICBpdCBcImlnbm9yZXMgY29tbWVudHNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiJVxcXFxiZWdpbntlbnZ9XFxuXCJcbiAgICAgIGFkdmFuY2VDbG9jayhlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0U3RvcHBlZENoYW5naW5nRGVsYXkoKSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiJVxcXFxiZWdpbntlbnZ9XFxuXCJcbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiJVxcXFxbXFxuXCJcbiAgICAgIGFkdmFuY2VDbG9jayhlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0U3RvcHBlZENoYW5naW5nRGVsYXkoKSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiJVxcXFxbXFxuXCJcbiAgICBpdCBcImlnbm9yZXMgZXh0cmEgYmFja3NsYXNoZXMgZm9yIFxcXFxbXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlxcXFxcXFxcW1xcblwiXG4gICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yLmdldEJ1ZmZlcigpLmdldFN0b3BwZWRDaGFuZ2luZ0RlbGF5KCkpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlxcXFxcXFxcW1xcblwiXG4iXX0=
