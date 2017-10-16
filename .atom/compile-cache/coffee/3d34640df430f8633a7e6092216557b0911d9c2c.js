(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    enabled: false,
    subscriptions: null,
    plugins: [],
    corePlugins: [],
    enabledPlugins: [],
    init: function(configSchema, api) {
      this.config = configSchema;
      return this.api = api;
    },
    enable: function() {
      var code, key, plugin, ref, ref1, results;
      this.subscriptions = new CompositeDisposable;
      this.enabled = true;
      ref = this.corePlugins;
      for (code in ref) {
        plugin = ref[code];
        this.observePlugin(code, plugin, "activate-power-mode." + code + ".enabled");
      }
      ref1 = this.plugins;
      results = [];
      for (code in ref1) {
        plugin = ref1[code];
        key = "activate-power-mode.plugins." + code;
        this.addConfigForPlugin(code, plugin, key);
        results.push(this.observePlugin(code, plugin, key));
      }
      return results;
    },
    disable: function() {
      var ref;
      this.enabled = false;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    addCorePlugin: function(code, plugin) {
      return this.corePlugins[code] = plugin;
    },
    addPlugin: function(code, plugin) {
      var key;
      key = "activate-power-mode.plugins." + code;
      this.plugins[code] = plugin;
      if (this.enabled) {
        this.addConfigForPlugin(code, plugin, key);
        return this.observePlugin(code, plugin, key);
      }
    },
    addConfigForPlugin: function(code, plugin, key) {
      this.config.plugins.properties[code] = {
        type: 'boolean',
        title: plugin.title,
        description: plugin.description,
        "default": true
      };
      if (atom.config.get(key) === void 0) {
        return atom.config.set(key, this.config.plugins.properties[code]["default"]);
      }
    },
    observePlugin: function(code, plugin, key) {
      return this.subscriptions.add(atom.config.observe(key, (function(_this) {
        return function(isEnabled) {
          if (isEnabled) {
            if (typeof plugin.enable === "function") {
              plugin.enable(_this.api);
            }
            return _this.enabledPlugins[code] = plugin;
          } else {
            if (typeof plugin.disable === "function") {
              plugin.disable();
            }
            return delete _this.enabledPlugins[code];
          }
        };
      })(this)));
    },
    onEnabled: function(callback) {
      var code, plugin, ref, results;
      ref = this.enabledPlugins;
      results = [];
      for (code in ref) {
        plugin = ref[code];
        if (callback(code, plugin)) {
          continue;
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi1yZWdpc3RyeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxLQUFUO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxPQUFBLEVBQVMsRUFGVDtJQUdBLFdBQUEsRUFBYSxFQUhiO0lBSUEsY0FBQSxFQUFnQixFQUpoQjtJQU1BLElBQUEsRUFBTSxTQUFDLFlBQUQsRUFBZSxHQUFmO01BQ0osSUFBQyxDQUFBLE1BQUQsR0FBVTthQUNWLElBQUMsQ0FBQSxHQUFELEdBQU87SUFGSCxDQU5OO0lBVUEsTUFBQSxFQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsT0FBRCxHQUFXO0FBRVg7QUFBQSxXQUFBLFdBQUE7O1FBQ0UsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLHNCQUFBLEdBQXVCLElBQXZCLEdBQTRCLFVBQXpEO0FBREY7QUFHQTtBQUFBO1dBQUEsWUFBQTs7UUFDRSxHQUFBLEdBQU0sOEJBQUEsR0FBK0I7UUFDckMsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLEVBQTBCLE1BQTFCLEVBQWtDLEdBQWxDO3FCQUNBLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixHQUE3QjtBQUhGOztJQVBNLENBVlI7SUFzQkEsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVztxREFDRyxDQUFFLE9BQWhCLENBQUE7SUFGTyxDQXRCVDtJQTBCQSxhQUFBLEVBQWUsU0FBQyxJQUFELEVBQU8sTUFBUDthQUNiLElBQUMsQ0FBQSxXQUFZLENBQUEsSUFBQSxDQUFiLEdBQXFCO0lBRFIsQ0ExQmY7SUE2QkEsU0FBQSxFQUFXLFNBQUMsSUFBRCxFQUFPLE1BQVA7QUFDVCxVQUFBO01BQUEsR0FBQSxHQUFNLDhCQUFBLEdBQStCO01BQ3JDLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCO01BRWpCLElBQUcsSUFBQyxDQUFBLE9BQUo7UUFDRSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBcEIsRUFBMEIsTUFBMUIsRUFBa0MsR0FBbEM7ZUFDQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsR0FBN0IsRUFGRjs7SUFKUyxDQTdCWDtJQXFDQSxrQkFBQSxFQUFvQixTQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsR0FBZjtNQUNsQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFXLENBQUEsSUFBQSxDQUEzQixHQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBRGQ7UUFFQSxXQUFBLEVBQWEsTUFBTSxDQUFDLFdBRnBCO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUOztNQUtGLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLEdBQWhCLENBQUEsS0FBd0IsTUFBM0I7ZUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVyxDQUFBLElBQUEsQ0FBSyxFQUFDLE9BQUQsRUFBckQsRUFERjs7SUFQa0IsQ0FyQ3BCO0lBK0NBLGFBQUEsRUFBZSxTQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsR0FBZjthQUNiLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FDakIsR0FEaUIsRUFDWixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsU0FBRDtVQUNILElBQUcsU0FBSDs7Y0FDRSxNQUFNLENBQUMsT0FBUSxLQUFDLENBQUE7O21CQUNoQixLQUFDLENBQUEsY0FBZSxDQUFBLElBQUEsQ0FBaEIsR0FBd0IsT0FGMUI7V0FBQSxNQUFBOztjQUlFLE1BQU0sQ0FBQzs7bUJBQ1AsT0FBTyxLQUFDLENBQUEsY0FBZSxDQUFBLElBQUEsRUFMekI7O1FBREc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFksQ0FBbkI7SUFEYSxDQS9DZjtJQTBEQSxTQUFBLEVBQVcsU0FBQyxRQUFEO0FBQ1QsVUFBQTtBQUFBO0FBQUE7V0FBQSxXQUFBOztRQUNFLElBQVksUUFBQSxDQUFTLElBQVQsRUFBZSxNQUFmLENBQVo7QUFBQSxtQkFBQTtTQUFBLE1BQUE7K0JBQUE7O0FBREY7O0lBRFMsQ0ExRFg7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZW5hYmxlZDogZmFsc2VcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBwbHVnaW5zOiBbXVxuICBjb3JlUGx1Z2luczogW11cbiAgZW5hYmxlZFBsdWdpbnM6IFtdXG5cbiAgaW5pdDogKGNvbmZpZ1NjaGVtYSwgYXBpKSAtPlxuICAgIEBjb25maWcgPSBjb25maWdTY2hlbWFcbiAgICBAYXBpID0gYXBpXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZW5hYmxlZCA9IHRydWVcblxuICAgIGZvciBjb2RlLCBwbHVnaW4gb2YgQGNvcmVQbHVnaW5zXG4gICAgICBAb2JzZXJ2ZVBsdWdpbiBjb2RlLCBwbHVnaW4sIFwiYWN0aXZhdGUtcG93ZXItbW9kZS4je2NvZGV9LmVuYWJsZWRcIlxuXG4gICAgZm9yIGNvZGUsIHBsdWdpbiBvZiBAcGx1Z2luc1xuICAgICAga2V5ID0gXCJhY3RpdmF0ZS1wb3dlci1tb2RlLnBsdWdpbnMuI3tjb2RlfVwiXG4gICAgICBAYWRkQ29uZmlnRm9yUGx1Z2luIGNvZGUsIHBsdWdpbiwga2V5XG4gICAgICBAb2JzZXJ2ZVBsdWdpbiBjb2RlLCBwbHVnaW4sIGtleVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGVuYWJsZWQgPSBmYWxzZVxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBhZGRDb3JlUGx1Z2luOiAoY29kZSwgcGx1Z2luKSAtPlxuICAgIEBjb3JlUGx1Z2luc1tjb2RlXSA9IHBsdWdpblxuXG4gIGFkZFBsdWdpbjogKGNvZGUsIHBsdWdpbikgLT5cbiAgICBrZXkgPSBcImFjdGl2YXRlLXBvd2VyLW1vZGUucGx1Z2lucy4je2NvZGV9XCJcbiAgICBAcGx1Z2luc1tjb2RlXSA9IHBsdWdpblxuXG4gICAgaWYgQGVuYWJsZWRcbiAgICAgIEBhZGRDb25maWdGb3JQbHVnaW4gY29kZSwgcGx1Z2luLCBrZXlcbiAgICAgIEBvYnNlcnZlUGx1Z2luIGNvZGUsIHBsdWdpbiwga2V5XG5cbiAgYWRkQ29uZmlnRm9yUGx1Z2luOiAoY29kZSwgcGx1Z2luLCBrZXkpIC0+XG4gICAgQGNvbmZpZy5wbHVnaW5zLnByb3BlcnRpZXNbY29kZV0gPVxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgdGl0bGU6IHBsdWdpbi50aXRsZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBwbHVnaW4uZGVzY3JpcHRpb24sXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoa2V5KSA9PSB1bmRlZmluZWRcbiAgICAgIGF0b20uY29uZmlnLnNldCBrZXksIEBjb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzW2NvZGVdLmRlZmF1bHRcblxuICBvYnNlcnZlUGx1Z2luOiAoY29kZSwgcGx1Z2luLCBrZXkpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICBrZXksIChpc0VuYWJsZWQpID0+XG4gICAgICAgIGlmIGlzRW5hYmxlZFxuICAgICAgICAgIHBsdWdpbi5lbmFibGU/KEBhcGkpXG4gICAgICAgICAgQGVuYWJsZWRQbHVnaW5zW2NvZGVdID0gcGx1Z2luXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwbHVnaW4uZGlzYWJsZT8oKVxuICAgICAgICAgIGRlbGV0ZSBAZW5hYmxlZFBsdWdpbnNbY29kZV1cbiAgICApXG5cbiAgb25FbmFibGVkOiAoY2FsbGJhY2spIC0+XG4gICAgZm9yIGNvZGUsIHBsdWdpbiBvZiBAZW5hYmxlZFBsdWdpbnNcbiAgICAgIGNvbnRpbnVlIGlmIGNhbGxiYWNrIGNvZGUsIHBsdWdpblxuIl19
