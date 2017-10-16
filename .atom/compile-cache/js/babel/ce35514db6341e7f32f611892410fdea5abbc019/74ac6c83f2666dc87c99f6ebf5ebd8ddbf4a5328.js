Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _crypto = require('crypto');

var _os = require('os');

var _path = require('path');

var _child_process = require('child_process');

var _atom = require('atom');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

'use babel';

var readFileAsync = _bluebird2['default'].promisify(_fs.readFile);
var globAsync = _bluebird2['default'].promisify(_glob2['default']);

function hashFileContent(filename) {
  var hash = (0, _crypto.createHash)('md5');
  var fileStream = (0, _fs.createReadStream)(filename);

  hash.setEncoding('hex');
  fileStream.pipe(hash);

  return new Promise(function (resolve, reject) {
    fileStream.on('end', function () {
      return resolve(hash.read());
    });
    fileStream.on('error', reject);
    hash.on('error', reject);
  });
}

function implicitLibs() {
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('java -verbose -help', function (err, stdout, stderr) {
      // Cannot promisify due to multiple args in callback
      // Output sample: `[Loaded java.lang.Shutdown from /Library/Java/JavaVirtualMachines/jdk1.8.0_92.jdk/Contents/Home/jre/lib/rt.jar]`
      var match = stdout.match(/\[Loaded (?:[^\s]+) from (.*)\/.*\.jar\]/);
      return err || !match ? reject(err || 'Failed to find implicit libs') : resolve(match[1]);
    });
  });
}

function trimFilenames(filenames) {
  return filenames.map(function (filename) {
    return filename.trim();
  });
}

function handleMissingClasspath(err) {
  if (err.code === 'ENOENT') {
    return [];
  }
  throw err;
}

function resolveFilenames(filenames) {
  return Promise.all(filenames.map(function (filename) {
    if (filename.endsWith('.jar') || filename.endsWith('.class')) {
      return Promise.resolve([filename]);
    }

    return globAsync(filename + '/**/*.*(class|jar)');
  }));
}

function flattenFilenames(filenames) {
  return [].concat.apply([], filenames);
}

function filterFalsyArray(entries) {
  return entries.filter(Boolean);
}

function hashFilenamesContent(filenames) {
  return Promise.all(filenames.map(function (filename) {
    return Promise.all([filename, hashFileContent(filename)]);
  }));
}

function readClassPath() {
  var paths = atom.project.getPaths();
  if (paths.length > 1) {
    return Promise.reject(new Error('Only one open project supported.'));
  } else if (paths.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all([readFileAsync(paths[0] + '/' + atom.config.get('java-classpath-registry.classpathFile')), implicitLibs()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var classpath = _ref2[0];
    var libs = _ref2[1];
    return classpath.toString('utf8').split(_path.delimiter).concat(libs);
  })['catch'](handleMissingClasspath).then(filterFalsyArray).then(trimFilenames).then(resolveFilenames).then(flattenFilenames).then(hashFilenamesContent);
}

function getClasspathEntriesFromCache(cache) {
  return function (classpathEntries) {
    return Promise.all(classpathEntries.map(function (_ref3) {
      var _ref32 = _slicedToArray(_ref3, 2);

      var filename = _ref32[0];
      var hash = _ref32[1];

      return Promise.all([filename, hash, cache.get(hash)]);
    }));
  };
}

function registerAndFilterCachedClasspathEntries(registry) {
  return function (classpathEntries) {
    return classpathEntries.filter(function (_ref4) {
      var _ref42 = _slicedToArray(_ref4, 3);

      var filename = _ref42[0];
      var hash = _ref42[1];
      var cachedEntries = _ref42[2];

      if (cachedEntries) {
        cachedEntries.forEach(function (entry) {
          return registry.add(entry.name, entry);
        });
        return false;
      }

      return true;
    });
  };
}

function parseClasspathEntries(registry, cache) {
  return function (classpathEntries) {
    return new Promise(function (resolve, reject) {
      console.log('will parse ' + classpathEntries.length + ' classpath entries');
      var tasks = (0, _os.cpus)().length - 1; // leave one cpu free for other tasks, such as rendering

      var chunk = Math.ceil(classpathEntries.length / tasks);

      var done = 0;
      var donefn = function donefn() {
        return ++done === tasks && resolve();
      };

      var _loop = function (i) {
        var taskEntries = classpathEntries.slice(i * chunk, (i + 1) * chunk);
        taskEntries.forEach(function (_ref5) {
          var _ref52 = _slicedToArray(_ref5, 2);

          var hash = _ref52[1];
          return cache.set(hash, []);
        });

        var entries = taskEntries.map(function (_ref6) {
          var _ref62 = _slicedToArray(_ref6, 1);

          var filename = _ref62[0];
          return filename;
        });
        var task = _atom.Task.once(require.resolve('./collector-task'), entries, donefn);
        task.on('entry', function (filename, entry) {
          var _taskEntries$find = taskEntries.find(function (_ref7) {
            var _ref72 = _slicedToArray(_ref7, 1);

            var fname = _ref72[0];
            return fname === filename;
          });

          var _taskEntries$find2 = _slicedToArray(_taskEntries$find, 2);

          var hash = _taskEntries$find2[1];

          cache.addEntry(hash, entry);
          registry.add(entry.name, entry);
        });
      };

      for (var i = 0; i < tasks; ++i) {
        _loop(i);
      }
    });
  };
}

function saveCache(cache) {
  return function () {
    return cache.save();
  };
}

var collect = function collect(registry, cache) {
  return readClassPath().then(getClasspathEntriesFromCache(cache)).then(registerAndFilterCachedClasspathEntries(registry)).then(parseClasspathEntries(registry, cache)).then(saveCache(cache));
};
exports.collect = collect;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS9saWIvY29sbGVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUUyQyxJQUFJOztzQkFDcEIsUUFBUTs7a0JBQ2QsSUFBSTs7b0JBQ0MsTUFBTTs7NkJBQ1gsZUFBZTs7b0JBQ2YsTUFBTTs7d0JBQ04sVUFBVTs7OztvQkFDZCxNQUFNOzs7O0FBVHZCLFdBQVcsQ0FBQzs7QUFXWixJQUFNLGFBQWEsR0FBRyxzQkFBUyxTQUFTLGNBQVUsQ0FBQztBQUNuRCxJQUFNLFNBQVMsR0FBRyxzQkFBUyxTQUFTLG1CQUFNLENBQUM7O0FBRTNDLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRTtBQUNqQyxNQUFNLElBQUksR0FBRyx3QkFBVyxLQUFLLENBQUMsQ0FBQztBQUMvQixNQUFNLFVBQVUsR0FBRywwQkFBaUIsUUFBUSxDQUFDLENBQUM7O0FBRTlDLE1BQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsWUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdEIsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsY0FBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7YUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQUEsQ0FBQyxDQUFDO0FBQ2pELGNBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQzFCLENBQUMsQ0FBQztDQUNKOztBQUVELFNBQVMsWUFBWSxHQUFHO0FBQ3RCLFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLDZCQUFLLHFCQUFxQixFQUFFLFVBQUMs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RCxJQUFJOztBQUNkLGVBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVCLGtCQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDOzs7QUFWTCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2NBQXZCLENBQUM7T0FXVDtLQUNGLENBQUM7R0FBQSxDQUFDO0NBQ0o7O0FBRUQsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3hCLFNBQU87V0FBTSxLQUFLLENBQUMsSUFBSSxFQUFFO0dBQUEsQ0FBQztDQUMzQjs7QUFFTSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxRQUFRLEVBQUUsS0FBSyxFQUFLO0FBQzFDLFNBQU8sYUFBYSxFQUFFLENBQ25CLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUN6QyxJQUFJLENBQUMsdUNBQXVDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FDdkQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Q0FDM0IsQ0FBQyIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvamF2YS1jbGFzc3BhdGgtcmVnaXN0cnkvbGliL2NvbGxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBjcmVhdGVSZWFkU3RyZWFtLCByZWFkRmlsZSB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNyZWF0ZUhhc2ggfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgY3B1cyB9IGZyb20gJ29zJztcbmltcG9ydCB7IGRlbGltaXRlciB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgVGFzayB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuXG5jb25zdCByZWFkRmlsZUFzeW5jID0gYmx1ZWJpcmQucHJvbWlzaWZ5KHJlYWRGaWxlKTtcbmNvbnN0IGdsb2JBc3luYyA9IGJsdWViaXJkLnByb21pc2lmeShnbG9iKTtcblxuZnVuY3Rpb24gaGFzaEZpbGVDb250ZW50KGZpbGVuYW1lKSB7XG4gIGNvbnN0IGhhc2ggPSBjcmVhdGVIYXNoKCdtZDUnKTtcbiAgY29uc3QgZmlsZVN0cmVhbSA9IGNyZWF0ZVJlYWRTdHJlYW0oZmlsZW5hbWUpO1xuXG4gIGhhc2guc2V0RW5jb2RpbmcoJ2hleCcpO1xuICBmaWxlU3RyZWFtLnBpcGUoaGFzaCk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmaWxlU3RyZWFtLm9uKCdlbmQnLCAoKSA9PiByZXNvbHZlKGhhc2gucmVhZCgpKSk7XG4gICAgZmlsZVN0cmVhbS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIGhhc2gub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGltcGxpY2l0TGlicygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBleGVjKCdqYXZhIC12ZXJib3NlIC1oZWxwJywgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+IHsgLy8gQ2Fubm90IHByb21pc2lmeSBkdWUgdG8gbXVsdGlwbGUgYXJncyBpbiBjYWxsYmFja1xuICAgICAgLy8gT3V0cHV0IHNhbXBsZTogYFtMb2FkZWQgamF2YS5sYW5nLlNodXRkb3duIGZyb20gL0xpYnJhcnkvSmF2YS9KYXZhVmlydHVhbE1hY2hpbmVzL2pkazEuOC4wXzkyLmpkay9Db250ZW50cy9Ib21lL2pyZS9saWIvcnQuamFyXWBcbiAgICAgIGNvbnN0IG1hdGNoID0gc3Rkb3V0Lm1hdGNoKC9cXFtMb2FkZWQgKD86W15cXHNdKykgZnJvbSAoLiopXFwvLipcXC5qYXJcXF0vKTtcbiAgICAgIHJldHVybiAoZXJyIHx8ICFtYXRjaCkgP1xuICAgICAgICByZWplY3QoZXJyIHx8ICdGYWlsZWQgdG8gZmluZCBpbXBsaWNpdCBsaWJzJykgOlxuICAgICAgICByZXNvbHZlKG1hdGNoWzFdKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyaW1GaWxlbmFtZXMoZmlsZW5hbWVzKSB7XG4gIHJldHVybiBmaWxlbmFtZXMubWFwKGZpbGVuYW1lID0+IGZpbGVuYW1lLnRyaW0oKSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1pc3NpbmdDbGFzc3BhdGgoZXJyKSB7XG4gIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgdGhyb3cgZXJyO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRmlsZW5hbWVzKGZpbGVuYW1lcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwoZmlsZW5hbWVzLm1hcChmaWxlbmFtZSA9PiB7XG4gICAgaWYgKGZpbGVuYW1lLmVuZHNXaXRoKCcuamFyJykgfHwgZmlsZW5hbWUuZW5kc1dpdGgoJy5jbGFzcycpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFsgZmlsZW5hbWUgXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdsb2JBc3luYyhgJHtmaWxlbmFtZX0vKiovKi4qKGNsYXNzfGphcilgKTtcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuRmlsZW5hbWVzKGZpbGVuYW1lcykge1xuICByZXR1cm4gW10uY29uY2F0LmFwcGx5KFtdLCBmaWxlbmFtZXMpO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJGYWxzeUFycmF5KGVudHJpZXMpIHtcbiAgcmV0dXJuIGVudHJpZXMuZmlsdGVyKEJvb2xlYW4pO1xufVxuXG5mdW5jdGlvbiBoYXNoRmlsZW5hbWVzQ29udGVudChmaWxlbmFtZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKGZpbGVuYW1lcy5tYXAoZmlsZW5hbWUgPT5cbiAgICBQcm9taXNlLmFsbChbIGZpbGVuYW1lLCBoYXNoRmlsZUNvbnRlbnQoZmlsZW5hbWUpIF0pXG4gICkpO1xufVxuXG5mdW5jdGlvbiByZWFkQ2xhc3NQYXRoKCkge1xuICBjb25zdCBwYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICBpZiAocGF0aHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ09ubHkgb25lIG9wZW4gcHJvamVjdCBzdXBwb3J0ZWQuJykpO1xuICB9IGVsc2UgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKFsgcmVhZEZpbGVBc3luYyhgJHtwYXRoc1swXX0vJHthdG9tLmNvbmZpZy5nZXQoJ2phdmEtY2xhc3NwYXRoLXJlZ2lzdHJ5LmNsYXNzcGF0aEZpbGUnKX1gKSxcbiAgICAgIGltcGxpY2l0TGlicygpIF0pXG4gICAgLnRoZW4oKFsgY2xhc3NwYXRoLCBsaWJzIF0pID0+IGNsYXNzcGF0aC50b1N0cmluZygndXRmOCcpLnNwbGl0KGRlbGltaXRlcikuY29uY2F0KGxpYnMpKVxuICAgIC5jYXRjaChoYW5kbGVNaXNzaW5nQ2xhc3NwYXRoKVxuICAgIC50aGVuKGZpbHRlckZhbHN5QXJyYXkpXG4gICAgLnRoZW4odHJpbUZpbGVuYW1lcylcbiAgICAudGhlbihyZXNvbHZlRmlsZW5hbWVzKVxuICAgIC50aGVuKGZsYXR0ZW5GaWxlbmFtZXMpXG4gICAgLnRoZW4oaGFzaEZpbGVuYW1lc0NvbnRlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRDbGFzc3BhdGhFbnRyaWVzRnJvbUNhY2hlKGNhY2hlKSB7XG4gIHJldHVybiBjbGFzc3BhdGhFbnRyaWVzID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2xhc3NwYXRoRW50cmllcy5tYXAoKFsgZmlsZW5hbWUsIGhhc2ggXSkgPT4ge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFsgZmlsZW5hbWUsIGhhc2gsIGNhY2hlLmdldChoYXNoKSBdKTtcbiAgICB9KSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQW5kRmlsdGVyQ2FjaGVkQ2xhc3NwYXRoRW50cmllcyhyZWdpc3RyeSkge1xuICByZXR1cm4gY2xhc3NwYXRoRW50cmllcyA9PiB7XG4gICAgcmV0dXJuIGNsYXNzcGF0aEVudHJpZXMuZmlsdGVyKChbIGZpbGVuYW1lLCBoYXNoLCBjYWNoZWRFbnRyaWVzIF0pID0+IHtcbiAgICAgIGlmIChjYWNoZWRFbnRyaWVzKSB7XG4gICAgICAgIGNhY2hlZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiByZWdpc3RyeS5hZGQoZW50cnkubmFtZSwgZW50cnkpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDbGFzc3BhdGhFbnRyaWVzKHJlZ2lzdHJ5LCBjYWNoZSkge1xuICByZXR1cm4gY2xhc3NwYXRoRW50cmllcyA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc29sZS5sb2coYHdpbGwgcGFyc2UgJHtjbGFzc3BhdGhFbnRyaWVzLmxlbmd0aH0gY2xhc3NwYXRoIGVudHJpZXNgKTtcbiAgICBjb25zdCB0YXNrcyA9IGNwdXMoKS5sZW5ndGggLSAxOyAvLyBsZWF2ZSBvbmUgY3B1IGZyZWUgZm9yIG90aGVyIHRhc2tzLCBzdWNoIGFzIHJlbmRlcmluZ1xuXG4gICAgY29uc3QgY2h1bmsgPSBNYXRoLmNlaWwoY2xhc3NwYXRoRW50cmllcy5sZW5ndGggLyB0YXNrcyk7XG5cbiAgICBsZXQgZG9uZSA9IDA7XG4gICAgY29uc3QgZG9uZWZuID0gKCkgPT4gKCsrZG9uZSA9PT0gdGFza3MpICYmIHJlc29sdmUoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3M7ICsraSkge1xuICAgICAgY29uc3QgdGFza0VudHJpZXMgPSBjbGFzc3BhdGhFbnRyaWVzLnNsaWNlKGkgKiBjaHVuaywgKGkgKyAxKSAqIGNodW5rKTtcbiAgICAgIHRhc2tFbnRyaWVzLmZvckVhY2goKFsgLCBoYXNoIF0pID0+IGNhY2hlLnNldChoYXNoLCBbXSkpO1xuXG4gICAgICBjb25zdCBlbnRyaWVzID0gdGFza0VudHJpZXMubWFwKChbIGZpbGVuYW1lIF0pID0+IGZpbGVuYW1lKTtcbiAgICAgIGNvbnN0IHRhc2sgPSBUYXNrLm9uY2UocmVxdWlyZS5yZXNvbHZlKCcuL2NvbGxlY3Rvci10YXNrJyksIGVudHJpZXMsIGRvbmVmbik7XG4gICAgICB0YXNrLm9uKCdlbnRyeScsIChmaWxlbmFtZSwgZW50cnkpID0+IHtcbiAgICAgICAgY29uc3QgWyAsIGhhc2ggXSA9IHRhc2tFbnRyaWVzLmZpbmQoKFsgZm5hbWUgXSkgPT4gZm5hbWUgPT09IGZpbGVuYW1lKTtcbiAgICAgICAgY2FjaGUuYWRkRW50cnkoaGFzaCwgZW50cnkpO1xuICAgICAgICByZWdpc3RyeS5hZGQoZW50cnkubmFtZSwgZW50cnkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2F2ZUNhY2hlKGNhY2hlKSB7XG4gIHJldHVybiAoKSA9PiBjYWNoZS5zYXZlKCk7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0ID0gKHJlZ2lzdHJ5LCBjYWNoZSkgPT4ge1xuICByZXR1cm4gcmVhZENsYXNzUGF0aCgpXG4gICAgLnRoZW4oZ2V0Q2xhc3NwYXRoRW50cmllc0Zyb21DYWNoZShjYWNoZSkpXG4gICAgLnRoZW4ocmVnaXN0ZXJBbmRGaWx0ZXJDYWNoZWRDbGFzc3BhdGhFbnRyaWVzKHJlZ2lzdHJ5KSlcbiAgICAudGhlbihwYXJzZUNsYXNzcGF0aEVudHJpZXMocmVnaXN0cnksIGNhY2hlKSlcbiAgICAudGhlbihzYXZlQ2FjaGUoY2FjaGUpKTtcbn07XG4iXX0=