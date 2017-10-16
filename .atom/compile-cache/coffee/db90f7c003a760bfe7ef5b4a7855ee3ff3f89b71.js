(function() {
  var ComboApi;

  module.exports = ComboApi = (function() {
    function ComboApi(comboRenderer) {
      this.combo = comboRenderer;
    }

    ComboApi.prototype.increase = function(n) {
      if (n == null) {
        n = 1;
      }
      if (this.combo.isEnable) {
        return this.combo.modifyStreak(n);
      }
    };

    ComboApi.prototype.decrease = function(n) {
      if (n == null) {
        n = 1;
      }
      if (this.combo.isEnable) {
        return this.combo.modifyStreak(-n);
      }
    };

    ComboApi.prototype.exclame = function(word, type) {
      if (word == null) {
        word = null;
      }
      if (type == null) {
        type = null;
      }
      if (this.combo.isEnable) {
        return this.combo.showExclamation(word, type);
      }
    };

    ComboApi.prototype.resetCounter = function() {
      if (this.combo.isEnable) {
        return this.combo.resetCounter();
      }
    };

    ComboApi.prototype.getLevel = function() {
      if (this.combo.isEnable) {
        return this.combo.getLevel();
      } else {
        return null;
      }
    };

    ComboApi.prototype.isEnable = function() {
      return this.combo.isEnable;
    };

    return ComboApi;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2UvY29tYm8tYXBpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7SUFDUixrQkFBQyxhQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURFOzt1QkFHYixRQUFBLEdBQVUsU0FBQyxDQUFEOztRQUFDLElBQUk7O01BQ2IsSUFBeUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFoQztlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixDQUFwQixFQUFBOztJQURROzt1QkFHVixRQUFBLEdBQVUsU0FBQyxDQUFEOztRQUFDLElBQUk7O01BQ2IsSUFBMkIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFsQztlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixDQUFDLENBQXJCLEVBQUE7O0lBRFE7O3VCQUdWLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBYyxJQUFkOztRQUFDLE9BQU87OztRQUFNLE9BQU87O01BQzVCLElBQXFDLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBNUM7ZUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLGVBQVAsQ0FBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBQTs7SUFETzs7dUJBR1QsWUFBQSxHQUFjLFNBQUE7TUFDWixJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQWhDO2VBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQUEsRUFBQTs7SUFEWTs7dUJBR2QsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBVjtlQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsS0FIRjs7SUFEUTs7dUJBTVYsUUFBQSxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDO0lBREM7Ozs7O0FBdEJaIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDb21ib0FwaVxuICBjb25zdHJ1Y3RvcjogKGNvbWJvUmVuZGVyZXIpIC0+XG4gICAgQGNvbWJvID0gY29tYm9SZW5kZXJlclxuXG4gIGluY3JlYXNlOiAobiA9IDEpIC0+XG4gICAgQGNvbWJvLm1vZGlmeVN0cmVhayBuIGlmIEBjb21iby5pc0VuYWJsZVxuXG4gIGRlY3JlYXNlOiAobiA9IDEpIC0+XG4gICAgQGNvbWJvLm1vZGlmeVN0cmVhaygtbikgaWYgQGNvbWJvLmlzRW5hYmxlXG5cbiAgZXhjbGFtZTogKHdvcmQgPSBudWxsLCB0eXBlID0gbnVsbCkgLT5cbiAgICBAY29tYm8uc2hvd0V4Y2xhbWF0aW9uIHdvcmQsIHR5cGUgaWYgQGNvbWJvLmlzRW5hYmxlXG5cbiAgcmVzZXRDb3VudGVyOiAtPlxuICAgIEBjb21iby5yZXNldENvdW50ZXIoKSBpZiBAY29tYm8uaXNFbmFibGVcblxuICBnZXRMZXZlbDogLT5cbiAgICBpZiBAY29tYm8uaXNFbmFibGVcbiAgICAgIEBjb21iby5nZXRMZXZlbCgpXG4gICAgZWxzZVxuICAgICAgbnVsbFxuXG4gIGlzRW5hYmxlOiAtPlxuICAgIEBjb21iby5pc0VuYWJsZVxuIl19
