(function() {
  var Api;

  module.exports = Api = (function() {
    function Api(editorRegistry, comboApi, screenShaker, audioPlayer) {
      this.editorRegistry = editorRegistry;
      this.screenShaker = screenShaker;
      this.audioPlayer = audioPlayer;
      this.combo = comboApi;
    }

    Api.prototype.shakeScreen = function(intensity) {
      if (intensity == null) {
        intensity = null;
      }
      return this.screenShaker.shake(this.editorRegistry.getEditorElement(), intensity);
    };

    Api.prototype.playAudio = function(audio) {
      return this.audioPlayer.play(audio);
    };

    Api.prototype.getEditor = function() {
      return this.editorRegistry.getEditor();
    };

    Api.prototype.getEditorElement = function() {
      return this.editorRegistry.getEditorElement();
    };

    Api.prototype.getCombo = function() {
      return this.combo;
    };

    return Api;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2FwaS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBQ1IsYUFBQyxjQUFELEVBQWlCLFFBQWpCLEVBQTJCLFlBQTNCLEVBQXlDLFdBQXpDO01BQ1gsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFKRTs7a0JBTWIsV0FBQSxHQUFhLFNBQUMsU0FBRDs7UUFBQyxZQUFZOzthQUN4QixJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBb0IsSUFBQyxDQUFBLGNBQWMsQ0FBQyxnQkFBaEIsQ0FBQSxDQUFwQixFQUF3RCxTQUF4RDtJQURXOztrQkFHYixTQUFBLEdBQVcsU0FBQyxLQUFEO2FBQ1QsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLEtBQWxCO0lBRFM7O2tCQUdYLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUFBO0lBRFM7O2tCQUdYLGdCQUFBLEdBQWtCLFNBQUE7YUFDaEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxnQkFBaEIsQ0FBQTtJQURnQjs7a0JBR2xCLFFBQUEsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBO0lBRE87Ozs7O0FBbkJaIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBcGlcbiAgY29uc3RydWN0b3I6IChlZGl0b3JSZWdpc3RyeSwgY29tYm9BcGksIHNjcmVlblNoYWtlciwgYXVkaW9QbGF5ZXIpIC0+XG4gICAgQGVkaXRvclJlZ2lzdHJ5ID0gZWRpdG9yUmVnaXN0cnlcbiAgICBAc2NyZWVuU2hha2VyID0gc2NyZWVuU2hha2VyXG4gICAgQGF1ZGlvUGxheWVyID0gYXVkaW9QbGF5ZXJcbiAgICBAY29tYm8gPSBjb21ib0FwaVxuXG4gIHNoYWtlU2NyZWVuOiAoaW50ZW5zaXR5ID0gbnVsbCkgLT5cbiAgICBAc2NyZWVuU2hha2VyLnNoYWtlIEBlZGl0b3JSZWdpc3RyeS5nZXRFZGl0b3JFbGVtZW50KCksIGludGVuc2l0eVxuXG4gIHBsYXlBdWRpbzogKGF1ZGlvKSAtPlxuICAgIEBhdWRpb1BsYXllci5wbGF5KGF1ZGlvKVxuXG4gIGdldEVkaXRvcjogLT5cbiAgICBAZWRpdG9yUmVnaXN0cnkuZ2V0RWRpdG9yKClcblxuICBnZXRFZGl0b3JFbGVtZW50OiAtPlxuICAgIEBlZGl0b3JSZWdpc3RyeS5nZXRFZGl0b3JFbGVtZW50KClcblxuICBnZXRDb21ibzogLT5cbiAgICBAY29tYm9cbiJdfQ==
