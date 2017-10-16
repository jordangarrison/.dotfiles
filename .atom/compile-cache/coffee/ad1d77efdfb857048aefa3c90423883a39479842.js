(function() {
  var slice = [].slice;

  module.exports = {
    activatePackages: function() {
      var activationPromise, packages, workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      packages = ['atom-latex'];
      activationPromise = Promise.all(packages.map(function(pkg) {
        return atom.packages.activatePackage(pkg);
      }));
      atom_latex.lazyLoad();
      return activationPromise;
    },
    setConfig: function(keyPath, value) {
      var base;
      if (this.originalConfigs == null) {
        this.originalConfigs = {};
      }
      if ((base = this.originalConfigs)[keyPath] == null) {
        base[keyPath] = atom.config.get(keyPath);
      }
      return atom.config.set(keyPath, value);
    },
    unsetConfig: function(keyPath) {
      var base;
      if (this.originalConfigs == null) {
        this.originalConfigs = {};
      }
      if ((base = this.originalConfigs)[keyPath] == null) {
        base[keyPath] = atom.config.get(keyPath);
      }
      return atom.config.unset(keyPath);
    },
    restoreConfigs: function() {
      var keyPath, ref, results, value;
      if (this.originalConfigs) {
        ref = this.originalConfigs;
        results = [];
        for (keyPath in ref) {
          value = ref[keyPath];
          results.push(atom.config.set(keyPath, value));
        }
        return results;
      }
    },
    callAsync: function(timeout, async, next) {
      var done, nextArgs, ref;
      if (typeof timeout === 'function') {
        ref = [timeout, async], async = ref[0], next = ref[1];
        timeout = 5000;
      }
      done = false;
      nextArgs = null;
      runs(function() {
        return async(function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          done = true;
          return nextArgs = args;
        });
      });
      waitsFor(function() {
        return done;
      }, null, timeout);
      if (next != null) {
        return runs(function() {
          return next.apply(this, nextArgs);
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvc3BlYy9oZWxwZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsZ0JBQUEsRUFBa0IsU0FBQTtBQUNoQixVQUFBO01BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtNQUNuQixRQUFBLEdBQVcsQ0FBQyxZQUFEO01BQ1gsaUJBQUEsR0FBb0IsT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFRLENBQUMsR0FBVCxDQUFhLFNBQUMsR0FBRDtlQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsR0FBOUI7TUFEMkMsQ0FBYixDQUFaO01BRXBCLFVBQVUsQ0FBQyxRQUFYLENBQUE7QUFDQSxhQUFPO0lBTlMsQ0FBbEI7SUFRQSxTQUFBLEVBQVcsU0FBQyxPQUFELEVBQVUsS0FBVjtBQUNULFVBQUE7O1FBQUEsSUFBQyxDQUFBLGtCQUFtQjs7O1lBQ0gsQ0FBQSxPQUFBLElBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLE9BQWhCOzthQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsS0FBekI7SUFIUyxDQVJYO0lBYUEsV0FBQSxFQUFhLFNBQUMsT0FBRDtBQUNYLFVBQUE7O1FBQUEsSUFBQyxDQUFBLGtCQUFtQjs7O1lBQ0gsQ0FBQSxPQUFBLElBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLE9BQWhCOzthQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQVosQ0FBa0IsT0FBbEI7SUFIVyxDQWJiO0lBa0JBLGNBQUEsRUFBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0U7QUFBQTthQUFBLGNBQUE7O3VCQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixPQUFoQixFQUF5QixLQUF6QjtBQURGO3VCQURGOztJQURjLENBbEJoQjtJQXVCQSxTQUFBLEVBQVcsU0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixJQUFqQjtBQUNULFVBQUE7TUFBQSxJQUFHLE9BQU8sT0FBUCxLQUFrQixVQUFyQjtRQUNFLE1BQWdCLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBaEIsRUFBQyxjQUFELEVBQVE7UUFDUixPQUFBLEdBQVUsS0FGWjs7TUFHQSxJQUFBLEdBQU87TUFDUCxRQUFBLEdBQVc7TUFFWCxJQUFBLENBQUssU0FBQTtlQUNILEtBQUEsQ0FBTSxTQUFBO0FBQ0osY0FBQTtVQURLO1VBQ0wsSUFBQSxHQUFPO2lCQUNQLFFBQUEsR0FBVztRQUZQLENBQU47TUFERyxDQUFMO01BTUEsUUFBQSxDQUFTLFNBQUE7ZUFDUDtNQURPLENBQVQsRUFFRSxJQUZGLEVBRVEsT0FGUjtNQUlBLElBQUcsWUFBSDtlQUNFLElBQUEsQ0FBSyxTQUFBO2lCQUNILElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxFQUFpQixRQUFqQjtRQURHLENBQUwsRUFERjs7SUFqQlMsQ0F2Qlg7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlUGFja2FnZXM6IC0+XG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyBhdG9tLndvcmtzcGFjZVxuICAgIHBhY2thZ2VzID0gWydhdG9tLWxhdGV4J11cbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IFByb21pc2UuYWxsIHBhY2thZ2VzLm1hcCAocGtnKSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UgcGtnXG4gICAgYXRvbV9sYXRleC5sYXp5TG9hZCgpXG4gICAgcmV0dXJuIGFjdGl2YXRpb25Qcm9taXNlXG5cbiAgc2V0Q29uZmlnOiAoa2V5UGF0aCwgdmFsdWUpIC0+XG4gICAgQG9yaWdpbmFsQ29uZmlncyA/PSB7fVxuICAgIEBvcmlnaW5hbENvbmZpZ3Nba2V5UGF0aF0gPz0gYXRvbS5jb25maWcuZ2V0IGtleVBhdGhcbiAgICBhdG9tLmNvbmZpZy5zZXQga2V5UGF0aCwgdmFsdWVcblxuICB1bnNldENvbmZpZzogKGtleVBhdGgpIC0+XG4gICAgQG9yaWdpbmFsQ29uZmlncyA/PSB7fVxuICAgIEBvcmlnaW5hbENvbmZpZ3Nba2V5UGF0aF0gPz0gYXRvbS5jb25maWcuZ2V0IGtleVBhdGhcbiAgICBhdG9tLmNvbmZpZy51bnNldCBrZXlQYXRoXG5cbiAgcmVzdG9yZUNvbmZpZ3M6IC0+XG4gICAgaWYgQG9yaWdpbmFsQ29uZmlnc1xuICAgICAgZm9yIGtleVBhdGgsIHZhbHVlIG9mIEBvcmlnaW5hbENvbmZpZ3NcbiAgICAgICAgYXRvbS5jb25maWcuc2V0IGtleVBhdGgsIHZhbHVlXG5cbiAgY2FsbEFzeW5jOiAodGltZW91dCwgYXN5bmMsIG5leHQpIC0+XG4gICAgaWYgdHlwZW9mIHRpbWVvdXQgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgW2FzeW5jLCBuZXh0XSA9IFt0aW1lb3V0LCBhc3luY11cbiAgICAgIHRpbWVvdXQgPSA1MDAwXG4gICAgZG9uZSA9IGZhbHNlXG4gICAgbmV4dEFyZ3MgPSBudWxsXG5cbiAgICBydW5zIC0+XG4gICAgICBhc3luYyAoYXJncy4uLikgLT5cbiAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgbmV4dEFyZ3MgPSBhcmdzXG5cblxuICAgIHdhaXRzRm9yIC0+XG4gICAgICBkb25lXG4gICAgLCBudWxsLCB0aW1lb3V0XG5cbiAgICBpZiBuZXh0P1xuICAgICAgcnVucyAtPlxuICAgICAgICBuZXh0LmFwcGx5KHRoaXMsIG5leHRBcmdzKVxuIl19
