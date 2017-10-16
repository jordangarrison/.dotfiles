(function() {
  var CompositeDisposable, random, throttle;

  CompositeDisposable = require("atom").CompositeDisposable;

  throttle = require("lodash.throttle");

  random = require("lodash.random");

  module.exports = {
    enabled: false,
    subscriptions: null,
    conf: [],
    init: function() {
      return this.enableSubscription = atom.config.observe('activate-power-mode.screenShake.enabled', (function(_this) {
        return function(value) {
          _this.enabled = value;
          if (_this.enabled) {
            return _this.enable();
          } else {
            return _this.disable();
          }
        };
      })(this));
    },
    destroy: function() {
      this.enableSubscription.dispose();
      return this.disable();
    },
    enable: function() {
      this.initConfigSubscribers();
      return this.throttledShake = throttle(this.shakeElement.bind(this), 100, {
        trailing: false
      });
    },
    disable: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.screenShake." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('minIntensity');
      return this.observe('maxIntensity');
    },
    shake: function(element, intensity) {
      if (this.enabled) {
        return this.throttledShake(element, intensity);
      }
    },
    shakeElement: function(element, intensity) {
      var max, min, x, y;
      min = this.conf['minIntensity'];
      max = this.conf['maxIntensity'];
      if (intensity === 'max') {
        min = max - min;
        max = max + 2;
      } else if (intensity === 'min') {
        max = max - min;
      }
      x = this.shakeIntensity(min, max);
      y = this.shakeIntensity(min, max);
      element.style.top = y + "px";
      element.style.left = x + "px";
      return setTimeout(function() {
        element.style.top = "";
        return element.style.left = "";
      }, 75);
    },
    shakeIntensity: function(min, max) {
      var direction;
      direction = Math.random() > 0.5 ? -1 : 1;
      return random(min, max, true) * direction;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2Uvc2NyZWVuLXNoYWtlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjs7RUFDWCxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxLQUFUO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxJQUFBLEVBQU0sRUFGTjtJQUlBLElBQUEsRUFBTSxTQUFBO2FBQ0osSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNwQix5Q0FEb0IsRUFDdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDekMsS0FBQyxDQUFBLE9BQUQsR0FBVztVQUNYLElBQUcsS0FBQyxDQUFBLE9BQUo7bUJBQ0UsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsT0FBRCxDQUFBLEVBSEY7O1FBRnlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR2QjtJQURsQixDQUpOO0lBY0EsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBcEIsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7SUFGTyxDQWRUO0lBa0JBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLHFCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixRQUFBLENBQVMsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLElBQW5CLENBQVQsRUFBbUMsR0FBbkMsRUFBd0M7UUFBQSxRQUFBLEVBQVUsS0FBVjtPQUF4QztJQUZaLENBbEJSO0lBc0JBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTtxREFBYyxDQUFFLE9BQWhCLENBQUE7SUFETyxDQXRCVDtJQXlCQSxPQUFBLEVBQVMsU0FBQyxHQUFEO2FBQ1AsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixrQ0FBQSxHQUFtQyxHQURsQixFQUN5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFDeEMsS0FBQyxDQUFBLElBQUssQ0FBQSxHQUFBLENBQU4sR0FBYTtRQUQyQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekIsQ0FBbkI7SUFETyxDQXpCVDtJQStCQSxxQkFBQSxFQUF1QixTQUFBO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxjQUFUO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxjQUFUO0lBSHFCLENBL0J2QjtJQW9DQSxLQUFBLEVBQU8sU0FBQyxPQUFELEVBQVUsU0FBVjtNQUNMLElBQXVDLElBQUMsQ0FBQSxPQUF4QztlQUFBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFNBQXpCLEVBQUE7O0lBREssQ0FwQ1A7SUF1Q0EsWUFBQSxFQUFjLFNBQUMsT0FBRCxFQUFVLFNBQVY7QUFDWixVQUFBO01BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFLLENBQUEsY0FBQTtNQUNaLEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSyxDQUFBLGNBQUE7TUFDWixJQUFHLFNBQUEsS0FBYSxLQUFoQjtRQUNFLEdBQUEsR0FBTSxHQUFBLEdBQU07UUFDWixHQUFBLEdBQU0sR0FBQSxHQUFNLEVBRmQ7T0FBQSxNQUdLLElBQUcsU0FBQSxLQUFhLEtBQWhCO1FBQ0gsR0FBQSxHQUFNLEdBQUEsR0FBTSxJQURUOztNQUdMLENBQUEsR0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixHQUFyQjtNQUNKLENBQUEsR0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixHQUFyQjtNQUVKLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZCxHQUF1QixDQUFELEdBQUc7TUFDekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFkLEdBQXdCLENBQUQsR0FBRzthQUUxQixVQUFBLENBQVcsU0FBQTtRQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZCxHQUFvQjtlQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQWQsR0FBcUI7TUFGWixDQUFYLEVBR0UsRUFIRjtJQWZZLENBdkNkO0lBMkRBLGNBQUEsRUFBZ0IsU0FBQyxHQUFELEVBQU0sR0FBTjtBQUNkLFVBQUE7TUFBQSxTQUFBLEdBQWUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEdBQW5CLEdBQTRCLENBQUMsQ0FBN0IsR0FBb0M7YUFDaEQsTUFBQSxDQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLElBQWpCLENBQUEsR0FBeUI7SUFGWCxDQTNEaEI7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG50aHJvdHRsZSA9IHJlcXVpcmUgXCJsb2Rhc2gudGhyb3R0bGVcIlxucmFuZG9tID0gcmVxdWlyZSBcImxvZGFzaC5yYW5kb21cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGVuYWJsZWQ6IGZhbHNlXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgY29uZjogW11cblxuICBpbml0OiAtPlxuICAgIEBlbmFibGVTdWJzY3JpcHRpb24gPSBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2FjdGl2YXRlLXBvd2VyLW1vZGUuc2NyZWVuU2hha2UuZW5hYmxlZCcsICh2YWx1ZSkgPT5cbiAgICAgICAgQGVuYWJsZWQgPSB2YWx1ZVxuICAgICAgICBpZiBAZW5hYmxlZFxuICAgICAgICAgIEBlbmFibGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGRpc2FibGUoKVxuICAgIClcblxuICBkZXN0cm95OiAtPlxuICAgIEBlbmFibGVTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQGRpc2FibGUoKVxuXG4gIGVuYWJsZTogLT5cbiAgICBAaW5pdENvbmZpZ1N1YnNjcmliZXJzKClcbiAgICBAdGhyb3R0bGVkU2hha2UgPSB0aHJvdHRsZSBAc2hha2VFbGVtZW50LmJpbmQodGhpcyksIDEwMCwgdHJhaWxpbmc6IGZhbHNlXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG5cbiAgb2JzZXJ2ZTogKGtleSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZS5zY3JlZW5TaGFrZS4je2tleX1cIiwgKHZhbHVlKSA9PlxuICAgICAgICBAY29uZltrZXldID0gdmFsdWVcbiAgICApXG5cbiAgaW5pdENvbmZpZ1N1YnNjcmliZXJzOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb2JzZXJ2ZSAnbWluSW50ZW5zaXR5J1xuICAgIEBvYnNlcnZlICdtYXhJbnRlbnNpdHknXG5cbiAgc2hha2U6IChlbGVtZW50LCBpbnRlbnNpdHkpIC0+XG4gICAgQHRocm90dGxlZFNoYWtlKGVsZW1lbnQsIGludGVuc2l0eSkgaWYgQGVuYWJsZWRcblxuICBzaGFrZUVsZW1lbnQ6IChlbGVtZW50LCBpbnRlbnNpdHkpIC0+XG4gICAgbWluID0gQGNvbmZbJ21pbkludGVuc2l0eSddXG4gICAgbWF4ID0gQGNvbmZbJ21heEludGVuc2l0eSddXG4gICAgaWYgaW50ZW5zaXR5IGlzICdtYXgnXG4gICAgICBtaW4gPSBtYXggLSBtaW5cbiAgICAgIG1heCA9IG1heCArIDJcbiAgICBlbHNlIGlmIGludGVuc2l0eSBpcyAnbWluJ1xuICAgICAgbWF4ID0gbWF4IC0gbWluXG5cbiAgICB4ID0gQHNoYWtlSW50ZW5zaXR5IG1pbiwgbWF4XG4gICAgeSA9IEBzaGFrZUludGVuc2l0eSBtaW4sIG1heFxuXG4gICAgZWxlbWVudC5zdHlsZS50b3AgPSBcIiN7eX1weFwiXG4gICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIje3h9cHhcIlxuXG4gICAgc2V0VGltZW91dCAtPlxuICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiXG4gICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBcIlwiXG4gICAgLCA3NVxuXG4gIHNoYWtlSW50ZW5zaXR5OiAobWluLCBtYXgpIC0+XG4gICAgZGlyZWN0aW9uID0gaWYgTWF0aC5yYW5kb20oKSA+IDAuNSB0aGVuIC0xIGVsc2UgMVxuICAgIHJhbmRvbShtaW4sIG1heCwgdHJ1ZSkgKiBkaXJlY3Rpb25cbiJdfQ==
