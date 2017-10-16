(function() {
  var AskStackResultView;

  AskStackResultView = require('../lib/ask-stack-result-view');

  describe("AskStackResultView", function() {
    var resultView;
    resultView = null;
    beforeEach(function() {
      return resultView = new AskStackResultView();
    });
    describe("when search returns no result", function() {
      return it("displays a proper messaged is displayed", function() {
        var json;
        json = require('./data/no_matches.json');
        resultView.renderAnswers(json, false);
        return runs(function() {
          var text;
          text = resultView.text();
          return expect(text).toBe("Your search returned no matches.");
        });
      });
    });
    return describe("when search returns a list of results", function() {
      return it("only shows a maximum of 5 results", function() {
        var json;
        json = require('./data/data.json');
        resultView.renderAnswers(json, false);
        return runs(function() {
          var results;
          results = resultView.find("#results-view").children().length;
          return expect(results).toBe(5);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9zcGVjL2Fzay1zdGFjay1yZXN1bHQtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDhCQUFSOztFQUVyQixRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtBQUM3QixRQUFBO0lBQUEsVUFBQSxHQUFhO0lBRWIsVUFBQSxDQUFXLFNBQUE7YUFDVCxVQUFBLEdBQWlCLElBQUEsa0JBQUEsQ0FBQTtJQURSLENBQVg7SUFHQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTthQUN4QyxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQTtBQUM1QyxZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSx3QkFBUjtRQUVQLFVBQVUsQ0FBQyxhQUFYLENBQXlCLElBQXpCLEVBQStCLEtBQS9CO2VBRUEsSUFBQSxDQUFLLFNBQUE7QUFDSCxjQUFBO1VBQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxJQUFYLENBQUE7aUJBQ1AsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLElBQWIsQ0FBa0Isa0NBQWxCO1FBRkcsQ0FBTDtNQUw0QyxDQUE5QztJQUR3QyxDQUExQztXQVVBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBO2FBQ2hELEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBO0FBQ3RDLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGtCQUFSO1FBRVAsVUFBVSxDQUFDLGFBQVgsQ0FBeUIsSUFBekIsRUFBK0IsS0FBL0I7ZUFFQSxJQUFBLENBQUssU0FBQTtBQUNILGNBQUE7VUFBQSxPQUFBLEdBQVUsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsZUFBaEIsQ0FBZ0MsQ0FBQyxRQUFqQyxDQUFBLENBQTJDLENBQUM7aUJBQ3RELE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxJQUFoQixDQUFxQixDQUFyQjtRQUZHLENBQUw7TUFMc0MsQ0FBeEM7SUFEZ0QsQ0FBbEQ7RUFoQjZCLENBQS9CO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJBc2tTdGFja1Jlc3VsdFZpZXcgPSByZXF1aXJlICcuLi9saWIvYXNrLXN0YWNrLXJlc3VsdC12aWV3J1xuXG5kZXNjcmliZSBcIkFza1N0YWNrUmVzdWx0Vmlld1wiLCAtPlxuICByZXN1bHRWaWV3ID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICByZXN1bHRWaWV3ID0gbmV3IEFza1N0YWNrUmVzdWx0VmlldygpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHNlYXJjaCByZXR1cm5zIG5vIHJlc3VsdFwiLCAtPlxuICAgIGl0IFwiZGlzcGxheXMgYSBwcm9wZXIgbWVzc2FnZWQgaXMgZGlzcGxheWVkXCIsIC0+XG4gICAgICBqc29uID0gcmVxdWlyZSgnLi9kYXRhL25vX21hdGNoZXMuanNvbicpXG5cbiAgICAgIHJlc3VsdFZpZXcucmVuZGVyQW5zd2Vycyhqc29uLCBmYWxzZSlcblxuICAgICAgcnVucyAtPlxuICAgICAgICB0ZXh0ID0gcmVzdWx0Vmlldy50ZXh0KClcbiAgICAgICAgZXhwZWN0KHRleHQpLnRvQmUoXCJZb3VyIHNlYXJjaCByZXR1cm5lZCBubyBtYXRjaGVzLlwiKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBzZWFyY2ggcmV0dXJucyBhIGxpc3Qgb2YgcmVzdWx0c1wiLCAtPlxuICAgIGl0IFwib25seSBzaG93cyBhIG1heGltdW0gb2YgNSByZXN1bHRzXCIsIC0+XG4gICAgICBqc29uID0gcmVxdWlyZSgnLi9kYXRhL2RhdGEuanNvbicpXG5cbiAgICAgIHJlc3VsdFZpZXcucmVuZGVyQW5zd2Vycyhqc29uLCBmYWxzZSlcblxuICAgICAgcnVucyAtPlxuICAgICAgICByZXN1bHRzID0gcmVzdWx0Vmlldy5maW5kKFwiI3Jlc3VsdHMtdmlld1wiKS5jaGlsZHJlbigpLmxlbmd0aFxuICAgICAgICBleHBlY3QocmVzdWx0cykudG9CZSg1KVxuIl19
