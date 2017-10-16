(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    subscriptions: null,
    flows: [],
    flow: null,
    key: "activate-power-mode.flow",
    enable: function() {
      this.subscriptions = new CompositeDisposable;
      this.observeFlow();
      return this.initList();
    },
    disable: function() {
      var ref, ref1;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      if ((ref1 = this.flowList) != null) {
        ref1.dispose();
      }
      return this.flowList = null;
    },
    setDefaultFlow: function(flow) {
      this.flow = flow;
      return this.flows['default'] = flow;
    },
    addFlow: function(code, flow) {
      this.flows[code] = flow;
      if (atom.config.get(this.key) === code) {
        return this.flow = flow;
      }
    },
    observeFlow: function() {
      return this.subscriptions.add(atom.config.observe(this.key, (function(_this) {
        return function(code) {
          if (_this.flows[code] != null) {
            return _this.flow = _this.flows[code];
          } else {
            return _this.flow = _this.flows['default'];
          }
        };
      })(this)));
    },
    selectFlow: function(code) {
      return atom.config.set(this.key, code);
    },
    initList: function() {
      if (this.flowList != null) {
        return;
      }
      this.flowList = require("./flow-list");
      this.flowList.init(this);
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:select-flow": (function(_this) {
          return function() {
            return _this.flowList.toggle();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2Zsb3ctcmVnaXN0cnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLEtBQUEsRUFBTyxFQURQO0lBRUEsSUFBQSxFQUFNLElBRk47SUFHQSxHQUFBLEVBQUssMEJBSEw7SUFLQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLFdBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQUE7SUFITSxDQUxSO0lBVUEsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBOztXQUFjLENBQUUsT0FBaEIsQ0FBQTs7O1lBQ1MsQ0FBRSxPQUFYLENBQUE7O2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUhMLENBVlQ7SUFlQSxjQUFBLEVBQWdCLFNBQUMsSUFBRDtNQUNkLElBQUMsQ0FBQSxJQUFELEdBQVE7YUFDUixJQUFDLENBQUEsS0FBTSxDQUFBLFNBQUEsQ0FBUCxHQUFvQjtJQUZOLENBZmhCO0lBbUJBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxJQUFQO01BQ1AsSUFBQyxDQUFBLEtBQU0sQ0FBQSxJQUFBLENBQVAsR0FBZTtNQUVmLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxHQUFqQixDQUFBLEtBQXlCLElBQTVCO2VBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUSxLQURWOztJQUhPLENBbkJUO0lBeUJBLFdBQUEsRUFBYSxTQUFBO2FBQ1gsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixJQUFDLENBQUEsR0FEZ0IsRUFDWCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtVQUNKLElBQUcseUJBQUg7bUJBQ0UsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUFDLENBQUEsS0FBTSxDQUFBLElBQUEsRUFEakI7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxJQUFELEdBQVEsS0FBQyxDQUFBLEtBQU0sQ0FBQSxTQUFBLEVBSGpCOztRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURXLENBQW5CO0lBRFcsQ0F6QmI7SUFrQ0EsVUFBQSxFQUFZLFNBQUMsSUFBRDthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixJQUFDLENBQUEsR0FBakIsRUFBc0IsSUFBdEI7SUFEVSxDQWxDWjtJQXFDQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQVUscUJBQVY7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksT0FBQSxDQUFRLGFBQVI7TUFDWixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFmO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7UUFBQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNqQyxLQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBQTtVQURpQztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7T0FEaUIsQ0FBbkI7SUFOUSxDQXJDVjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGZsb3dzOiBbXVxuICBmbG93OiBudWxsXG4gIGtleTogXCJhY3RpdmF0ZS1wb3dlci1tb2RlLmZsb3dcIlxuXG4gIGVuYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9ic2VydmVGbG93KClcbiAgICBAaW5pdExpc3QoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBmbG93TGlzdD8uZGlzcG9zZSgpXG4gICAgQGZsb3dMaXN0ID0gbnVsbFxuXG4gIHNldERlZmF1bHRGbG93OiAoZmxvdykgLT5cbiAgICBAZmxvdyA9IGZsb3dcbiAgICBAZmxvd3NbJ2RlZmF1bHQnXSA9IGZsb3dcblxuICBhZGRGbG93OiAoY29kZSwgZmxvdykgLT5cbiAgICBAZmxvd3NbY29kZV0gPSBmbG93XG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoQGtleSkgaXMgY29kZVxuICAgICAgQGZsb3cgPSBmbG93XG5cbiAgb2JzZXJ2ZUZsb3c6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICBAa2V5LCAoY29kZSkgPT5cbiAgICAgICAgaWYgQGZsb3dzW2NvZGVdP1xuICAgICAgICAgIEBmbG93ID0gQGZsb3dzW2NvZGVdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZmxvdyA9IEBmbG93c1snZGVmYXVsdCddXG4gICAgKVxuXG4gIHNlbGVjdEZsb3c6IChjb2RlKSAtPlxuICAgIGF0b20uY29uZmlnLnNldChAa2V5LCBjb2RlKVxuXG4gIGluaXRMaXN0OiAtPlxuICAgIHJldHVybiBpZiBAZmxvd0xpc3Q/XG5cbiAgICBAZmxvd0xpc3QgPSByZXF1aXJlIFwiLi9mbG93LWxpc3RcIlxuICAgIEBmbG93TGlzdC5pbml0IHRoaXNcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGU6c2VsZWN0LWZsb3dcIjogPT5cbiAgICAgICAgQGZsb3dMaXN0LnRvZ2dsZSgpXG4iXX0=
