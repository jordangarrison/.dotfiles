(function() {
  var AskStackView;

  AskStackView = require('./ask-stack-view');

  module.exports = {
    config: {
      autoDetectLanguage: true
    },
    askStackView: null,
    activate: function(state) {
      return this.askStackView = new AskStackView(state.askStackViewState);
    },
    deactivate: function() {
      return this.askStackView.destroy();
    },
    serialize: function() {
      return {
        askStackViewState: this.askStackView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9saWIvYXNrLXN0YWNrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsa0JBQUEsRUFBb0IsSUFBcEI7S0FERjtJQUVBLFlBQUEsRUFBYyxJQUZkO0lBSUEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFhLEtBQUssQ0FBQyxpQkFBbkI7SUFEWixDQUpWO0lBT0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQTtJQURVLENBUFo7SUFVQSxTQUFBLEVBQVcsU0FBQTthQUNUO1FBQUEsaUJBQUEsRUFBbUIsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFkLENBQUEsQ0FBbkI7O0lBRFMsQ0FWWDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIkFza1N0YWNrVmlldyA9IHJlcXVpcmUgJy4vYXNrLXN0YWNrLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGF1dG9EZXRlY3RMYW5ndWFnZTogdHJ1ZVxuICBhc2tTdGFja1ZpZXc6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBhc2tTdGFja1ZpZXcgPSBuZXcgQXNrU3RhY2tWaWV3KHN0YXRlLmFza1N0YWNrVmlld1N0YXRlKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGFza1N0YWNrVmlldy5kZXN0cm95KClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgYXNrU3RhY2tWaWV3U3RhdGU6IEBhc2tTdGFja1ZpZXcuc2VyaWFsaXplKClcbiJdfQ==
