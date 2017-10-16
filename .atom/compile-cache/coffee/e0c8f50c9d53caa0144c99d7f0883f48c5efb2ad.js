(function() {
  var inputHandler,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  inputHandler = require("./input-handler");

  module.exports = {
    inputHandler: inputHandler,
    enable: function() {
      this.pluginManager.enable();
      this.changePaneSubscription = atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function() {
          return _this.setupPane();
        };
      })(this));
      return this.setupPane();
    },
    disable: function() {
      var ref, ref1, ref2;
      if ((ref = this.changePaneSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.inputSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.cursorSubscription) != null) {
        ref2.dispose();
      }
      return this.pluginManager.disable();
    },
    setPluginManager: function(pluginManager) {
      return this.pluginManager = pluginManager;
    },
    isExcludedFile: function() {
      var excluded, ref, ref1;
      excluded = this.getConfig("excludedFileTypes.excluded");
      return ref = (ref1 = this.editor.getPath()) != null ? ref1.split('.').pop() : void 0, indexOf.call(excluded, ref) >= 0;
    },
    setupPane: function() {
      var ref, ref1;
      if ((ref = this.inputSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.cursorSubscription) != null) {
        ref1.dispose();
      }
      this.editor = atom.workspace.getActiveTextEditor();
      if (!this.editor || this.isExcludedFile()) {
        this.pluginManager.runOnChangePane();
        return;
      }
      this.editorElement = this.editor.getElement();
      this.inputSubscription = this.editor.getBuffer().onDidChange(this.handleInput.bind(this));
      this.cursorSubscription = this.editor.observeCursors(this.handleCursor.bind(this));
      return this.pluginManager.runOnChangePane(this.editor, this.editorElement);
    },
    handleCursor: function(cursor) {
      return this.pluginManager.runOnNewCursor(cursor);
    },
    handleInput: function(e) {
      return requestIdleCallback((function(_this) {
        return function() {
          var cursor, screenPos;
          _this.inputHandler.handle(e);
          if (_this.inputHandler.isGhost()) {
            return;
          }
          screenPos = _this.editor.screenPositionForBufferPosition(_this.inputHandler.getPosition());
          cursor = _this.editor.getCursorAtScreenPosition(screenPos);
          if (!cursor) {
            return;
          }
          return _this.pluginManager.runOnInput(cursor, screenPos, _this.inputHandler);
        };
      })(this));
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3Bvd2VyLWVkaXRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFlBQUE7SUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxZQUFBLEVBQWMsWUFBZDtJQUVBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQUE7TUFDQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBZixDQUErQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3ZFLEtBQUMsQ0FBQSxTQUFELENBQUE7UUFEdUU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DO2FBRzFCLElBQUMsQ0FBQSxTQUFELENBQUE7SUFMTSxDQUZSO0lBU0EsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBOztXQUF1QixDQUFFLE9BQXpCLENBQUE7OztZQUNrQixDQUFFLE9BQXBCLENBQUE7OztZQUNtQixDQUFFLE9BQXJCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFKTyxDQVRUO0lBZUEsZ0JBQUEsRUFBa0IsU0FBQyxhQUFEO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBREQsQ0FmbEI7SUFrQkEsY0FBQSxFQUFnQixTQUFBO0FBQ2QsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsU0FBRCxDQUFXLDRCQUFYO2dFQUNNLENBQUUsS0FBbkIsQ0FBeUIsR0FBekIsQ0FBNkIsQ0FBQyxHQUE5QixDQUFBLFVBQUEsRUFBQSxhQUF1QyxRQUF2QyxFQUFBLEdBQUE7SUFGYyxDQWxCaEI7SUFzQkEsU0FBQSxFQUFXLFNBQUE7QUFDVCxVQUFBOztXQUFrQixDQUFFLE9BQXBCLENBQUE7OztZQUNtQixDQUFFLE9BQXJCLENBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFFVixJQUFHLENBQUksSUFBQyxDQUFBLE1BQUwsSUFBZSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWxCO1FBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxlQUFmLENBQUE7QUFDQSxlQUZGOztNQUlBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBO01BRWpCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFdBQXBCLENBQWdDLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQixDQUFoQztNQUNyQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixJQUFuQixDQUF2QjthQUV0QixJQUFDLENBQUEsYUFBYSxDQUFDLGVBQWYsQ0FBK0IsSUFBQyxDQUFBLE1BQWhDLEVBQXdDLElBQUMsQ0FBQSxhQUF6QztJQWRTLENBdEJYO0lBc0NBLFlBQUEsRUFBYyxTQUFDLE1BQUQ7YUFDWixJQUFDLENBQUEsYUFBYSxDQUFDLGNBQWYsQ0FBOEIsTUFBOUI7SUFEWSxDQXRDZDtJQXlDQSxXQUFBLEVBQWEsU0FBQyxDQUFEO2FBQ1gsbUJBQUEsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2xCLGNBQUE7VUFBQSxLQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsQ0FBckI7VUFDQSxJQUFVLEtBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBQVY7QUFBQSxtQkFBQTs7VUFFQSxTQUFBLEdBQVksS0FBQyxDQUFBLE1BQU0sQ0FBQywrQkFBUixDQUF3QyxLQUFDLENBQUEsWUFBWSxDQUFDLFdBQWQsQ0FBQSxDQUF4QztVQUNaLE1BQUEsR0FBUyxLQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLFNBQWxDO1VBQ1QsSUFBQSxDQUFjLE1BQWQ7QUFBQSxtQkFBQTs7aUJBRUEsS0FBQyxDQUFBLGFBQWEsQ0FBQyxVQUFmLENBQTBCLE1BQTFCLEVBQWtDLFNBQWxDLEVBQTZDLEtBQUMsQ0FBQSxZQUE5QztRQVJrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7SUFEVyxDQXpDYjtJQW9EQSxTQUFBLEVBQVcsU0FBQyxNQUFEO2FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFBLEdBQXVCLE1BQXZDO0lBRFMsQ0FwRFg7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJpbnB1dEhhbmRsZXIgPSByZXF1aXJlIFwiLi9pbnB1dC1oYW5kbGVyXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBpbnB1dEhhbmRsZXI6IGlucHV0SGFuZGxlclxuXG4gIGVuYWJsZTogLT5cbiAgICBAcGx1Z2luTWFuYWdlci5lbmFibGUoKVxuICAgIEBjaGFuZ2VQYW5lU3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2Uub25EaWRTdG9wQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbSA9PlxuICAgICAgQHNldHVwUGFuZSgpXG5cbiAgICBAc2V0dXBQYW5lKClcblxuICBkaXNhYmxlOiAtPlxuICAgIEBjaGFuZ2VQYW5lU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAaW5wdXRTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBjdXJzb3JTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBwbHVnaW5NYW5hZ2VyLmRpc2FibGUoKVxuXG4gIHNldFBsdWdpbk1hbmFnZXI6IChwbHVnaW5NYW5hZ2VyKSAtPlxuICAgIEBwbHVnaW5NYW5hZ2VyID0gcGx1Z2luTWFuYWdlclxuXG4gIGlzRXhjbHVkZWRGaWxlOiAtPlxuICAgIGV4Y2x1ZGVkID0gQGdldENvbmZpZyBcImV4Y2x1ZGVkRmlsZVR5cGVzLmV4Y2x1ZGVkXCJcbiAgICBAZWRpdG9yLmdldFBhdGgoKT8uc3BsaXQoJy4nKS5wb3AoKSBpbiBleGNsdWRlZFxuXG4gIHNldHVwUGFuZTogLT5cbiAgICBAaW5wdXRTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBjdXJzb3JTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGlmIG5vdCBAZWRpdG9yIG9yIEBpc0V4Y2x1ZGVkRmlsZSgpXG4gICAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNoYW5nZVBhbmUoKVxuICAgICAgcmV0dXJuXG5cbiAgICBAZWRpdG9yRWxlbWVudCA9IEBlZGl0b3IuZ2V0RWxlbWVudCgpXG5cbiAgICBAaW5wdXRTdWJzY3JpcHRpb24gPSBAZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlIEBoYW5kbGVJbnB1dC5iaW5kKHRoaXMpXG4gICAgQGN1cnNvclN1YnNjcmlwdGlvbiA9IEBlZGl0b3Iub2JzZXJ2ZUN1cnNvcnMgQGhhbmRsZUN1cnNvci5iaW5kKHRoaXMpXG5cbiAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNoYW5nZVBhbmUgQGVkaXRvciwgQGVkaXRvckVsZW1lbnRcblxuICBoYW5kbGVDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgQHBsdWdpbk1hbmFnZXIucnVuT25OZXdDdXJzb3IgY3Vyc29yXG5cbiAgaGFuZGxlSW5wdXQ6IChlKSAtPlxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2sgPT5cbiAgICAgIEBpbnB1dEhhbmRsZXIuaGFuZGxlIGVcbiAgICAgIHJldHVybiBpZiBAaW5wdXRIYW5kbGVyLmlzR2hvc3QoKVxuXG4gICAgICBzY3JlZW5Qb3MgPSBAZWRpdG9yLnNjcmVlblBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24gQGlucHV0SGFuZGxlci5nZXRQb3NpdGlvbigpXG4gICAgICBjdXJzb3IgPSBAZWRpdG9yLmdldEN1cnNvckF0U2NyZWVuUG9zaXRpb24gc2NyZWVuUG9zXG4gICAgICByZXR1cm4gdW5sZXNzIGN1cnNvclxuXG4gICAgICBAcGx1Z2luTWFuYWdlci5ydW5PbklucHV0IGN1cnNvciwgc2NyZWVuUG9zLCBAaW5wdXRIYW5kbGVyXG5cbiAgZ2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgIGF0b20uY29uZmlnLmdldCBcImFjdGl2YXRlLXBvd2VyLW1vZGUuI3tjb25maWd9XCJcbiJdfQ==
