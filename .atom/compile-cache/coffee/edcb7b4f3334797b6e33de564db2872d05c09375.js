(function() {
  var fs, log, os, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  os = require('os');

  path = require('path');

  log = require('./log');

  module.exports = {
    pythonExecutableRe: function() {
      if (/^win/.test(process.platform)) {
        return /^python(\d+(.\d+)?)?\.exe$/;
      } else {
        return /^python(\d+(.\d+)?)?$/;
      }
    },
    possibleGlobalPythonPaths: function() {
      if (/^win/.test(process.platform)) {
        return ['C:\\Python2.7', 'C:\\Python3.4', 'C:\\Python3.5', 'C:\\Program Files (x86)\\Python 2.7', 'C:\\Program Files (x86)\\Python 3.4', 'C:\\Program Files (x86)\\Python 3.5', 'C:\\Program Files (x64)\\Python 2.7', 'C:\\Program Files (x64)\\Python 3.4', 'C:\\Program Files (x64)\\Python 3.5', 'C:\\Program Files\\Python 2.7', 'C:\\Program Files\\Python 3.4', 'C:\\Program Files\\Python 3.5', (os.homedir()) + "\\AppData\\Local\\Programs\\Python\\Python35-32"];
      } else {
        return ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
      }
    },
    readDir: function(dirPath) {
      try {
        return fs.readdirSync(dirPath);
      } catch (error) {
        return [];
      }
    },
    isBinary: function(filePath) {
      try {
        fs.accessSync(filePath, fs.X_OK);
        return true;
      } catch (error) {
        return false;
      }
    },
    lookupInterpreters: function(dirPath) {
      var f, fileName, files, interpreters, j, len, matches, potentialInterpreter;
      interpreters = new Set();
      files = this.readDir(dirPath);
      matches = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = files.length; j < len; j++) {
          f = files[j];
          if (this.pythonExecutableRe().test(f)) {
            results.push(f);
          }
        }
        return results;
      }).call(this);
      for (j = 0, len = matches.length; j < len; j++) {
        fileName = matches[j];
        potentialInterpreter = path.join(dirPath, fileName);
        if (this.isBinary(potentialInterpreter)) {
          interpreters.add(potentialInterpreter);
        }
      }
      return interpreters;
    },
    applySubstitutions: function(paths) {
      var j, k, len, len1, modPaths, p, project, projectName, ref, ref1;
      modPaths = [];
      for (j = 0, len = paths.length; j < len; j++) {
        p = paths[j];
        ref = atom.project.getPaths();
        for (k = 0, len1 = ref.length; k < len1; k++) {
          project = ref[k];
          ref1 = project.split(path.sep), projectName = ref1[ref1.length - 1];
          p = p.replace(/\$PROJECT_NAME/i, projectName);
          p = p.replace(/\$PROJECT/i, project);
          if (indexOf.call(modPaths, p) < 0) {
            modPaths.push(p);
          }
        }
      }
      return modPaths;
    },
    getInterpreter: function() {
      var envPath, f, interpreters, j, k, len, len1, p, project, ref, ref1, userDefinedPythonPaths;
      userDefinedPythonPaths = this.applySubstitutions(atom.config.get('autocomplete-python.pythonPaths').split(';'));
      interpreters = new Set((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = userDefinedPythonPaths.length; j < len; j++) {
          p = userDefinedPythonPaths[j];
          if (this.isBinary(p)) {
            results.push(p);
          }
        }
        return results;
      }).call(this));
      if (interpreters.size > 0) {
        log.debug('User defined interpreters found', interpreters);
        return interpreters.keys().next().value;
      }
      log.debug('No user defined interpreter found, trying automatic lookup');
      interpreters = new Set();
      ref = atom.project.getPaths();
      for (j = 0, len = ref.length; j < len; j++) {
        project = ref[j];
        ref1 = this.readDir(project);
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          f = ref1[k];
          this.lookupInterpreters(path.join(project, f, 'bin')).forEach(function(i) {
            return interpreters.add(i);
          });
        }
      }
      log.debug('Project level interpreters found', interpreters);
      envPath = (process.env.PATH || '').split(path.delimiter);
      envPath = new Set(envPath.concat(this.possibleGlobalPythonPaths()));
      envPath.forEach((function(_this) {
        return function(potentialPath) {
          return _this.lookupInterpreters(potentialPath).forEach(function(i) {
            return interpreters.add(i);
          });
        };
      })(this));
      log.debug('Total automatically found interpreters', interpreters);
      if (interpreters.size > 0) {
        return interpreters.keys().next().value;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1weXRob24vbGliL2ludGVycHJldGVycy1sb29rdXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpQkFBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsa0JBQUEsRUFBb0IsU0FBQTtNQUNsQixJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBTyxDQUFDLFFBQXBCLENBQUg7QUFDRSxlQUFPLDZCQURUO09BQUEsTUFBQTtBQUdFLGVBQU8sd0JBSFQ7O0lBRGtCLENBQXBCO0lBTUEseUJBQUEsRUFBMkIsU0FBQTtNQUN6QixJQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBTyxDQUFDLFFBQXBCLENBQUg7QUFDRSxlQUFPLENBQ0wsZUFESyxFQUVMLGVBRkssRUFHTCxlQUhLLEVBSUwscUNBSkssRUFLTCxxQ0FMSyxFQU1MLHFDQU5LLEVBT0wscUNBUEssRUFRTCxxQ0FSSyxFQVNMLHFDQVRLLEVBVUwsK0JBVkssRUFXTCwrQkFYSyxFQVlMLCtCQVpLLEVBYUgsQ0FBQyxFQUFFLENBQUMsT0FBSCxDQUFBLENBQUQsQ0FBQSxHQUFjLGlEQWJYLEVBRFQ7T0FBQSxNQUFBO0FBaUJFLGVBQU8sQ0FBQyxnQkFBRCxFQUFtQixVQUFuQixFQUErQixNQUEvQixFQUF1QyxXQUF2QyxFQUFvRCxPQUFwRCxFQWpCVDs7SUFEeUIsQ0FOM0I7SUEwQkEsT0FBQSxFQUFTLFNBQUMsT0FBRDtBQUNQO0FBQ0UsZUFBTyxFQUFFLENBQUMsV0FBSCxDQUFlLE9BQWYsRUFE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LENBQWYsQ0FBSjtNQUNkLE9BQU8sQ0FBQyxPQUFSLENBQWdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxhQUFEO2lCQUNkLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixhQUFwQixDQUFrQyxDQUFDLE9BQW5DLENBQTJDLFNBQUMsQ0FBRDttQkFDekMsWUFBWSxDQUFDLEdBQWIsQ0FBaUIsQ0FBakI7VUFEeUMsQ0FBM0M7UUFEYztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7TUFHQSxHQUFHLENBQUMsS0FBSixDQUFVLHdDQUFWLEVBQW9ELFlBQXBEO01BRUEsSUFBRyxZQUFZLENBQUMsSUFBYixHQUFvQixDQUF2QjtBQUNFLGVBQU8sWUFBWSxDQUFDLElBQWIsQ0FBQSxDQUFtQixDQUFDLElBQXBCLENBQUEsQ0FBMEIsQ0FBQyxNQURwQzs7SUF2QmMsQ0E1RGhCOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcbm9zID0gcmVxdWlyZSAnb3MnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmxvZyA9IHJlcXVpcmUgJy4vbG9nJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHB5dGhvbkV4ZWN1dGFibGVSZTogLT5cbiAgICBpZiAvXndpbi8udGVzdCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICByZXR1cm4gL15weXRob24oXFxkKyguXFxkKyk/KT9cXC5leGUkL1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAvXnB5dGhvbihcXGQrKC5cXGQrKT8pPyQvXG5cbiAgcG9zc2libGVHbG9iYWxQeXRob25QYXRoczogLT5cbiAgICBpZiAvXndpbi8udGVzdCBwcm9jZXNzLnBsYXRmb3JtXG4gICAgICByZXR1cm4gW1xuICAgICAgICAnQzpcXFxcUHl0aG9uMi43J1xuICAgICAgICAnQzpcXFxcUHl0aG9uMy40J1xuICAgICAgICAnQzpcXFxcUHl0aG9uMy41J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxQeXRob24gMi43J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxQeXRob24gMy40J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxQeXRob24gMy41J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDY0KVxcXFxQeXRob24gMi43J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDY0KVxcXFxQeXRob24gMy40J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDY0KVxcXFxQeXRob24gMy41J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxQeXRob24gMi43J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxQeXRob24gMy40J1xuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxQeXRob24gMy41J1xuICAgICAgICBcIiN7b3MuaG9tZWRpcigpfVxcXFxBcHBEYXRhXFxcXExvY2FsXFxcXFByb2dyYW1zXFxcXFB5dGhvblxcXFxQeXRob24zNS0zMlwiXG4gICAgICBdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFsnL3Vzci9sb2NhbC9iaW4nLCAnL3Vzci9iaW4nLCAnL2JpbicsICcvdXNyL3NiaW4nLCAnL3NiaW4nXVxuXG4gIHJlYWREaXI6IChkaXJQYXRoKSAtPlxuICAgIHRyeVxuICAgICAgcmV0dXJuIGZzLnJlYWRkaXJTeW5jIGRpclBhdGhcbiAgICBjYXRjaFxuICAgICAgcmV0dXJuIFtdXG5cbiAgaXNCaW5hcnk6IChmaWxlUGF0aCkgLT5cbiAgICB0cnlcbiAgICAgIGZzLmFjY2Vzc1N5bmMgZmlsZVBhdGgsIGZzLlhfT0tcbiAgICAgIHJldHVybiB0cnVlXG4gICAgY2F0Y2hcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gIGxvb2t1cEludGVycHJldGVyczogKGRpclBhdGgpIC0+XG4gICAgaW50ZXJwcmV0ZXJzID0gbmV3IFNldCgpXG4gICAgZmlsZXMgPSBAcmVhZERpcihkaXJQYXRoKVxuICAgIG1hdGNoZXMgPSAoZiBmb3IgZiBpbiBmaWxlcyB3aGVuIEBweXRob25FeGVjdXRhYmxlUmUoKS50ZXN0KGYpKVxuICAgIGZvciBmaWxlTmFtZSBpbiBtYXRjaGVzXG4gICAgICBwb3RlbnRpYWxJbnRlcnByZXRlciA9IHBhdGguam9pbihkaXJQYXRoLCBmaWxlTmFtZSlcbiAgICAgIGlmIEBpc0JpbmFyeShwb3RlbnRpYWxJbnRlcnByZXRlcilcbiAgICAgICAgaW50ZXJwcmV0ZXJzLmFkZChwb3RlbnRpYWxJbnRlcnByZXRlcilcbiAgICByZXR1cm4gaW50ZXJwcmV0ZXJzXG5cbiAgYXBwbHlTdWJzdGl0dXRpb25zOiAocGF0aHMpIC0+XG4gICAgbW9kUGF0aHMgPSBbXVxuICAgIGZvciBwIGluIHBhdGhzXG4gICAgICBmb3IgcHJvamVjdCBpbiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgICBbLi4uLCBwcm9qZWN0TmFtZV0gPSBwcm9qZWN0LnNwbGl0KHBhdGguc2VwKVxuICAgICAgICBwID0gcC5yZXBsYWNlKC9cXCRQUk9KRUNUX05BTUUvaSwgcHJvamVjdE5hbWUpXG4gICAgICAgIHAgPSBwLnJlcGxhY2UoL1xcJFBST0pFQ1QvaSwgcHJvamVjdClcbiAgICAgICAgaWYgcCBub3QgaW4gbW9kUGF0aHNcbiAgICAgICAgICBtb2RQYXRocy5wdXNoIHBcbiAgICByZXR1cm4gbW9kUGF0aHNcblxuICBnZXRJbnRlcnByZXRlcjogLT5cbiAgICB1c2VyRGVmaW5lZFB5dGhvblBhdGhzID0gQGFwcGx5U3Vic3RpdHV0aW9ucyhcbiAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5weXRob25QYXRocycpLnNwbGl0KCc7JykpXG4gICAgaW50ZXJwcmV0ZXJzID0gbmV3IFNldChwIGZvciBwIGluIHVzZXJEZWZpbmVkUHl0aG9uUGF0aHMgd2hlbiBAaXNCaW5hcnkocCkpXG4gICAgaWYgaW50ZXJwcmV0ZXJzLnNpemUgPiAwXG4gICAgICBsb2cuZGVidWcgJ1VzZXIgZGVmaW5lZCBpbnRlcnByZXRlcnMgZm91bmQnLCBpbnRlcnByZXRlcnNcbiAgICAgIHJldHVybiBpbnRlcnByZXRlcnMua2V5cygpLm5leHQoKS52YWx1ZVxuXG4gICAgbG9nLmRlYnVnICdObyB1c2VyIGRlZmluZWQgaW50ZXJwcmV0ZXIgZm91bmQsIHRyeWluZyBhdXRvbWF0aWMgbG9va3VwJ1xuICAgIGludGVycHJldGVycyA9IG5ldyBTZXQoKVxuXG4gICAgZm9yIHByb2plY3QgaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICAgIGZvciBmIGluIEByZWFkRGlyKHByb2plY3QpXG4gICAgICAgIEBsb29rdXBJbnRlcnByZXRlcnMocGF0aC5qb2luKHByb2plY3QsIGYsICdiaW4nKSkuZm9yRWFjaCAoaSkgLT5cbiAgICAgICAgICBpbnRlcnByZXRlcnMuYWRkKGkpXG4gICAgbG9nLmRlYnVnICdQcm9qZWN0IGxldmVsIGludGVycHJldGVycyBmb3VuZCcsIGludGVycHJldGVyc1xuICAgIGVudlBhdGggPSAocHJvY2Vzcy5lbnYuUEFUSCBvciAnJykuc3BsaXQgcGF0aC5kZWxpbWl0ZXJcbiAgICBlbnZQYXRoID0gbmV3IFNldChlbnZQYXRoLmNvbmNhdChAcG9zc2libGVHbG9iYWxQeXRob25QYXRocygpKSlcbiAgICBlbnZQYXRoLmZvckVhY2ggKHBvdGVudGlhbFBhdGgpID0+XG4gICAgICBAbG9va3VwSW50ZXJwcmV0ZXJzKHBvdGVudGlhbFBhdGgpLmZvckVhY2ggKGkpIC0+XG4gICAgICAgIGludGVycHJldGVycy5hZGQoaSlcbiAgICBsb2cuZGVidWcgJ1RvdGFsIGF1dG9tYXRpY2FsbHkgZm91bmQgaW50ZXJwcmV0ZXJzJywgaW50ZXJwcmV0ZXJzXG5cbiAgICBpZiBpbnRlcnByZXRlcnMuc2l6ZSA+IDBcbiAgICAgIHJldHVybiBpbnRlcnByZXRlcnMua2V5cygpLm5leHQoKS52YWx1ZVxuIl19
