(function() {
  var ActivatePowerMode, CompositeDisposable, configSchema;

  CompositeDisposable = require("atom").CompositeDisposable;

  configSchema = require("./config-schema");

  module.exports = ActivatePowerMode = {
    config: configSchema,
    subscriptions: null,
    active: false,
    activate: function(state) {
      this.pluginRegistry = require("./plugin-registry");
      this.flowRegistry = require("./flow-registry");
      this.effectRegistry = require("./effect-registry");
      return requestIdleCallback((function(_this) {
        return function() {
          _this.subscriptions = new CompositeDisposable;
          _this.powerEditor = require("./power-editor");
          _this.pluginManager = require("./plugin-manager");
          _this.powerEditor.setPluginManager(_this.pluginManager);
          _this.pluginManager.init(_this.config, _this.pluginRegistry, _this.flowRegistry, _this.effectRegistry);
          _this.subscriptions.add(atom.commands.add("atom-workspace", {
            "activate-power-mode:toggle": function() {
              return _this.toggle();
            },
            "activate-power-mode:enable": function() {
              return _this.enable();
            },
            "activate-power-mode:disable": function() {
              return _this.disable();
            }
          }));
          if (_this.getConfig("autoToggle")) {
            return _this.toggle();
          }
        };
      })(this));
    },
    deactivate: function() {
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.active = false;
      return this.powerEditor.disable();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    },
    toggle: function() {
      if (this.active) {
        return this.disable();
      } else {
        return this.enable();
      }
    },
    enable: function() {
      this.active = true;
      return this.powerEditor.enable();
    },
    disable: function() {
      this.active = false;
      return this.powerEditor.disable();
    },
    provideServiceV1: function() {
      var Service;
      if (!this.service) {
        Service = require("./service");
        this.service = new Service(this.pluginRegistry, this.flowRegistry, this.effectRegistry);
      }
      return this.service;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2FjdGl2YXRlLXBvd2VyLW1vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsaUJBQUEsR0FDZjtJQUFBLE1BQUEsRUFBUSxZQUFSO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxNQUFBLEVBQVEsS0FGUjtJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsY0FBRCxHQUFrQixPQUFBLENBQVEsbUJBQVI7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSO01BQ2hCLElBQUMsQ0FBQSxjQUFELEdBQWtCLE9BQUEsQ0FBUSxtQkFBUjthQUVsQixtQkFBQSxDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDbEIsS0FBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtVQUVyQixLQUFDLENBQUEsV0FBRCxHQUFlLE9BQUEsQ0FBUSxnQkFBUjtVQUNmLEtBQUMsQ0FBQSxhQUFELEdBQWlCLE9BQUEsQ0FBUSxrQkFBUjtVQUNqQixLQUFDLENBQUEsV0FBVyxDQUFDLGdCQUFiLENBQThCLEtBQUMsQ0FBQSxhQUEvQjtVQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixLQUFDLENBQUEsTUFBckIsRUFBNkIsS0FBQyxDQUFBLGNBQTlCLEVBQThDLEtBQUMsQ0FBQSxZQUEvQyxFQUE2RCxLQUFDLENBQUEsY0FBOUQ7VUFFQSxLQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtZQUFBLDRCQUFBLEVBQThCLFNBQUE7cUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtZQUFILENBQTlCO1lBQ0EsNEJBQUEsRUFBOEIsU0FBQTtxQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1lBQUgsQ0FEOUI7WUFFQSw2QkFBQSxFQUErQixTQUFBO3FCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUE7WUFBSCxDQUYvQjtXQURpQixDQUFuQjtVQUtBLElBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBVyxZQUFYLENBQUg7bUJBQ0UsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURGOztRQWJrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7SUFMUSxDQUpWO0lBeUJBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTs7V0FBYyxDQUFFLE9BQWhCLENBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBSFUsQ0F6Qlo7SUE4QkEsU0FBQSxFQUFXLFNBQUMsTUFBRDthQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBQSxHQUF1QixNQUF2QztJQURTLENBOUJYO0lBaUNBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsTUFBSjtlQUFnQixJQUFDLENBQUEsT0FBRCxDQUFBLEVBQWhCO09BQUEsTUFBQTtlQUFnQyxJQUFDLENBQUEsTUFBRCxDQUFBLEVBQWhDOztJQURNLENBakNSO0lBb0NBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLE1BQUQsR0FBVTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFBO0lBRk0sQ0FwQ1I7SUF3Q0EsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFGTyxDQXhDVDtJQTRDQSxnQkFBQSxFQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQVI7UUFDRSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7UUFDVixJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFRLElBQUMsQ0FBQSxjQUFULEVBQXlCLElBQUMsQ0FBQSxZQUExQixFQUF3QyxJQUFDLENBQUEsY0FBekMsRUFGakI7O2FBR0EsSUFBQyxDQUFBO0lBSmUsQ0E1Q2xCOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuY29uZmlnU2NoZW1hID0gcmVxdWlyZSBcIi4vY29uZmlnLXNjaGVtYVwiXG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aXZhdGVQb3dlck1vZGUgPVxuICBjb25maWc6IGNvbmZpZ1NjaGVtYVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGFjdGl2ZTogZmFsc2VcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeSA9IHJlcXVpcmUgXCIuL3BsdWdpbi1yZWdpc3RyeVwiXG4gICAgQGZsb3dSZWdpc3RyeSA9IHJlcXVpcmUgXCIuL2Zsb3ctcmVnaXN0cnlcIlxuICAgIEBlZmZlY3RSZWdpc3RyeSA9IHJlcXVpcmUgXCIuL2VmZmVjdC1yZWdpc3RyeVwiXG5cbiAgICByZXF1ZXN0SWRsZUNhbGxiYWNrID0+XG4gICAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAgIEBwb3dlckVkaXRvciA9IHJlcXVpcmUgXCIuL3Bvd2VyLWVkaXRvclwiXG4gICAgICBAcGx1Z2luTWFuYWdlciA9IHJlcXVpcmUgXCIuL3BsdWdpbi1tYW5hZ2VyXCJcbiAgICAgIEBwb3dlckVkaXRvci5zZXRQbHVnaW5NYW5hZ2VyIEBwbHVnaW5NYW5hZ2VyXG4gICAgICBAcGx1Z2luTWFuYWdlci5pbml0IEBjb25maWcsIEBwbHVnaW5SZWdpc3RyeSwgQGZsb3dSZWdpc3RyeSwgQGVmZmVjdFJlZ2lzdHJ5XG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTp0b2dnbGVcIjogPT4gQHRvZ2dsZSgpXG4gICAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTplbmFibGVcIjogPT4gQGVuYWJsZSgpXG4gICAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTpkaXNhYmxlXCI6ID0+IEBkaXNhYmxlKClcblxuICAgICAgaWYgQGdldENvbmZpZyBcImF1dG9Ub2dnbGVcIlxuICAgICAgICBAdG9nZ2xlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAYWN0aXZlID0gZmFsc2VcbiAgICBAcG93ZXJFZGl0b3IuZGlzYWJsZSgpXG5cbiAgZ2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgIGF0b20uY29uZmlnLmdldCBcImFjdGl2YXRlLXBvd2VyLW1vZGUuI3tjb25maWd9XCJcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQGFjdGl2ZSB0aGVuIEBkaXNhYmxlKCkgZWxzZSBAZW5hYmxlKClcblxuICBlbmFibGU6IC0+XG4gICAgQGFjdGl2ZSA9IHRydWVcbiAgICBAcG93ZXJFZGl0b3IuZW5hYmxlKClcblxuICBkaXNhYmxlOiAtPlxuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEBwb3dlckVkaXRvci5kaXNhYmxlKClcblxuICBwcm92aWRlU2VydmljZVYxOiAtPlxuICAgIGlmIG5vdCBAc2VydmljZVxuICAgICAgU2VydmljZSA9IHJlcXVpcmUgXCIuL3NlcnZpY2VcIlxuICAgICAgQHNlcnZpY2UgPSBuZXcgU2VydmljZShAcGx1Z2luUmVnaXN0cnksIEBmbG93UmVnaXN0cnksIEBlZmZlY3RSZWdpc3RyeSlcbiAgICBAc2VydmljZVxuIl19
