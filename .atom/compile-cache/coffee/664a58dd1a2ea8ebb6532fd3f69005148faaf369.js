(function() {
  var AskStackView;

  AskStackView = require('../lib/ask-stack-view');

  describe("AskStackView", function() {
    var askStackView;
    askStackView = null;
    beforeEach(function() {
      return askStackView = new AskStackView();
    });
    return describe("when the panel is presented", function() {
      return it("displays all the components", function() {
        askStackView.presentPanel();
        return runs(function() {
          expect(askStackView.questionField).toExist();
          expect(askStackView.tagsField).toExist();
          expect(askStackView.sortByVote).toExist();
          return expect(askStackView.askButton).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9zcGVjL2Fzay1zdGFjay12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSOztFQUVmLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUE7QUFDdkIsUUFBQTtJQUFBLFlBQUEsR0FBZTtJQUVmLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBQTtJQURWLENBQVg7V0FHQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQTthQUN0QyxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQTtRQUNoQyxZQUFZLENBQUMsWUFBYixDQUFBO2VBRUEsSUFBQSxDQUFLLFNBQUE7VUFDSCxNQUFBLENBQU8sWUFBWSxDQUFDLGFBQXBCLENBQWtDLENBQUMsT0FBbkMsQ0FBQTtVQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsU0FBcEIsQ0FBOEIsQ0FBQyxPQUEvQixDQUFBO1VBQ0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLE9BQWhDLENBQUE7aUJBQ0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxTQUFwQixDQUE4QixDQUFDLE9BQS9CLENBQUE7UUFKRyxDQUFMO01BSGdDLENBQWxDO0lBRHNDLENBQXhDO0VBTnVCLENBQXpCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJBc2tTdGFja1ZpZXcgPSByZXF1aXJlICcuLi9saWIvYXNrLXN0YWNrLXZpZXcnXG5cbmRlc2NyaWJlIFwiQXNrU3RhY2tWaWV3XCIsIC0+XG4gIGFza1N0YWNrVmlldyA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYXNrU3RhY2tWaWV3ID0gbmV3IEFza1N0YWNrVmlldygpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBwYW5lbCBpcyBwcmVzZW50ZWRcIiwgLT5cbiAgICBpdCBcImRpc3BsYXlzIGFsbCB0aGUgY29tcG9uZW50c1wiLCAtPlxuICAgICAgYXNrU3RhY2tWaWV3LnByZXNlbnRQYW5lbCgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGFza1N0YWNrVmlldy5xdWVzdGlvbkZpZWxkKS50b0V4aXN0KClcbiAgICAgICAgZXhwZWN0KGFza1N0YWNrVmlldy50YWdzRmllbGQpLnRvRXhpc3QoKVxuICAgICAgICBleHBlY3QoYXNrU3RhY2tWaWV3LnNvcnRCeVZvdGUpLnRvRXhpc3QoKVxuICAgICAgICBleHBlY3QoYXNrU3RhY2tWaWV3LmFza0J1dHRvbikudG9FeGlzdCgpXG4iXX0=
