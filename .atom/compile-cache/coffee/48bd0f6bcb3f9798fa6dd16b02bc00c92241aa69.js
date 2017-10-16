(function() {
  var ParticlesEffect, Service;

  ParticlesEffect = require("./effect/particles");

  module.exports = Service = (function() {
    function Service(pluginRegistry, flowRegistry, effectRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.flowRegistry = flowRegistry;
      this.effectRegistry = effectRegistry;
    }

    Service.prototype.registerPlugin = function(code, plugin) {
      return this.pluginRegistry.addPlugin(code, plugin);
    };

    Service.prototype.registerFlow = function(code, flow) {
      return this.flowRegistry.addFlow(code, flow);
    };

    Service.prototype.registerEffect = function(code, effect) {
      return this.effectRegistry.addEffect(code, effect);
    };

    Service.prototype.createParticlesEffect = function(particleManager) {
      return new ParticlesEffect(particleManager);
    };

    return Service;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFFbEIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7SUFDUixpQkFBQyxjQUFELEVBQWlCLFlBQWpCLEVBQStCLGNBQS9CO01BQ1gsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFIUDs7c0JBS2IsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxNQUFQO2FBQ2QsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQyxNQUFoQztJQURjOztzQkFHaEIsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLElBQVA7YUFDWixJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUI7SUFEWTs7c0JBR2QsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxNQUFQO2FBQ2QsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQyxNQUFoQztJQURjOztzQkFHaEIscUJBQUEsR0FBdUIsU0FBQyxlQUFEO2FBQ2pCLElBQUEsZUFBQSxDQUFnQixlQUFoQjtJQURpQjs7Ozs7QUFqQnpCIiwic291cmNlc0NvbnRlbnQiOlsiUGFydGljbGVzRWZmZWN0ID0gcmVxdWlyZSBcIi4vZWZmZWN0L3BhcnRpY2xlc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VydmljZVxuICBjb25zdHJ1Y3RvcjogKHBsdWdpblJlZ2lzdHJ5LCBmbG93UmVnaXN0cnksIGVmZmVjdFJlZ2lzdHJ5KSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeSA9IHBsdWdpblJlZ2lzdHJ5XG4gICAgQGZsb3dSZWdpc3RyeSA9IGZsb3dSZWdpc3RyeVxuICAgIEBlZmZlY3RSZWdpc3RyeSA9IGVmZmVjdFJlZ2lzdHJ5XG5cbiAgcmVnaXN0ZXJQbHVnaW46IChjb2RlLCBwbHVnaW4pIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5LmFkZFBsdWdpbiBjb2RlLCBwbHVnaW5cblxuICByZWdpc3RlckZsb3c6IChjb2RlLCBmbG93KSAtPlxuICAgIEBmbG93UmVnaXN0cnkuYWRkRmxvdyBjb2RlLCBmbG93XG5cbiAgcmVnaXN0ZXJFZmZlY3Q6IChjb2RlLCBlZmZlY3QpIC0+XG4gICAgQGVmZmVjdFJlZ2lzdHJ5LmFkZEVmZmVjdCBjb2RlLCBlZmZlY3RcblxuICBjcmVhdGVQYXJ0aWNsZXNFZmZlY3Q6IChwYXJ0aWNsZU1hbmFnZXIpIC0+XG4gICAgbmV3IFBhcnRpY2xlc0VmZmVjdChwYXJ0aWNsZU1hbmFnZXIpXG4iXX0=
