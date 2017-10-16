(function() {
  var Cleaner, Disposable, fs, glob, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  path = require('path');

  fs = require('fs');

  glob = require('glob');

  module.exports = Cleaner = (function(superClass) {
    extend(Cleaner, superClass);

    function Cleaner(latex) {
      this.latex = latex;
    }

    Cleaner.prototype.clean = function() {
      var i, len, removeGlob, removeGlobs, rootDir;
      if (!this.latex.manager.findMain()) {
        return false;
      }
      rootDir = path.dirname(this.latex.mainFile);
      removeGlobs = atom.config.get('atom-latex.file_ext_to_clean').replace(/\s/, '').split(',');
      for (i = 0, len = removeGlobs.length; i < len; i++) {
        removeGlob = removeGlobs[i];
        glob(removeGlob, {
          cwd: rootDir
        }, function(err, files) {
          var file, fullPath, j, len1, results;
          if (err) {
            return;
          }
          results = [];
          for (j = 0, len1 = files.length; j < len1; j++) {
            file = files[j];
            fullPath = path.resolve(rootDir, file);
            results.push(fs.unlink(fullPath));
          }
          return results;
        });
      }
      return true;
    };

    return Cleaner;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2NsZWFuZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBOzs7RUFBRSxhQUFlLE9BQUEsQ0FBUSxNQUFSOztFQUNqQixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDUyxpQkFBQyxLQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURFOztzQkFHYixLQUFBLEdBQU8sU0FBQTtBQUNMLFVBQUE7TUFBQSxJQUFHLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBZixDQUFBLENBQUo7QUFDRSxlQUFPLE1BRFQ7O01BRUEsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFwQjtNQUNWLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQ1osQ0FBQyxPQURXLENBQ0gsSUFERyxFQUNFLEVBREYsQ0FDSyxDQUFDLEtBRE4sQ0FDWSxHQURaO0FBRWQsV0FBQSw2Q0FBQTs7UUFDRSxJQUFBLENBQUssVUFBTCxFQUFpQjtVQUFBLEdBQUEsRUFBSyxPQUFMO1NBQWpCLEVBQStCLFNBQUMsR0FBRCxFQUFNLEtBQU47QUFDN0IsY0FBQTtVQUFBLElBQUcsR0FBSDtBQUNFLG1CQURGOztBQUVBO2VBQUEseUNBQUE7O1lBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixFQUFzQixJQUF0Qjt5QkFDWCxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVY7QUFGRjs7UUFINkIsQ0FBL0I7QUFERjtBQVFBLGFBQU87SUFkRjs7OztLQUphO0FBTnRCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuZ2xvYiA9IHJlcXVpcmUgJ2dsb2InXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENsZWFuZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcblxuICBjbGVhbjogLT5cbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZE1haW4oKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcm9vdERpciA9IHBhdGguZGlybmFtZShAbGF0ZXgubWFpbkZpbGUpXG4gICAgcmVtb3ZlR2xvYnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguZmlsZV9leHRfdG9fY2xlYW4nKVxcXG4gICAgICAucmVwbGFjZSgvXFxzLywnJykuc3BsaXQoJywnKVxuICAgIGZvciByZW1vdmVHbG9iIGluIHJlbW92ZUdsb2JzXG4gICAgICBnbG9iKHJlbW92ZUdsb2IsIGN3ZDogcm9vdERpciwgKGVyciwgZmlsZXMpIC0+XG4gICAgICAgIGlmIGVyclxuICAgICAgICAgIHJldHVyblxuICAgICAgICBmb3IgZmlsZSBpbiBmaWxlc1xuICAgICAgICAgIGZ1bGxQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3REaXIsIGZpbGUpXG4gICAgICAgICAgZnMudW5saW5rKGZ1bGxQYXRoKVxuICAgICAgKVxuICAgIHJldHVybiB0cnVlXG4iXX0=
