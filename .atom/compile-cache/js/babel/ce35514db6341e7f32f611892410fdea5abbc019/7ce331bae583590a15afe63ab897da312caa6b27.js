Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global atom */

var _events = require('events');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _atom = require('atom');

'use babel';
var PathsCache = (function (_EventEmitter) {
  _inherits(PathsCache, _EventEmitter);

  function PathsCache() {
    _classCallCheck(this, PathsCache);

    _get(Object.getPrototypeOf(PathsCache.prototype), 'constructor', this).call(this);

    this._repositories = [];
    this._filePathsByProjectDirectory = new Map();
    this._filePathsByDirectory = new Map();
    this._fileWatchersByDirectory = new Map();
  }

  /**
   * Checks if the given path is ignored
   * @param  {String}  path
   * @return {Boolean}
   * @private
   */

  _createClass(PathsCache, [{
    key: '_isPathIgnored',
    value: function _isPathIgnored(path) {
      var ignored = false;
      if (atom.config.get('core.excludeVcsIgnoredPaths')) {
        this._repositories.forEach(function (repository) {
          if (ignored) return;
          var ignoreSubmodules = atom.config.get('autocomplete-paths.ignoreSubmodules');
          var isIgnoredSubmodule = ignoreSubmodules && repository.isSubmodule(path);
          if (repository.isPathIgnored(path) || isIgnoredSubmodule) {
            ignored = true;
          }
        });
      }

      if (atom.config.get('autocomplete-paths.ignoredNames')) {
        var ignoredNames = atom.config.get('core.ignoredNames');
        ignoredNames.forEach(function (ignoredName) {
          if (ignored) return;
          ignored = ignored || (0, _minimatch2['default'])(path, ignoredName, { matchBase: true, dot: true });
        });
      }
      return ignored;
    }

    /**
     * Caches the project paths and repositories
     * @return {Promise}
     * @private
     */
  }, {
    key: '_cacheProjectPathsAndRepositories',
    value: function _cacheProjectPathsAndRepositories() {
      var _this = this;

      this._projectDirectories = atom.project.getDirectories();

      return Promise.all(this._projectDirectories.map(atom.project.repositoryForDirectory.bind(atom.project))).then(function (repositories) {
        _this._repositories = repositories.filter(function (r) {
          return r;
        });
      });
    }

    /**
     * Invoked when the content of the given `directory` has changed
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_onDirectoryChanged',
    value: function _onDirectoryChanged(projectDirectory, directory) {
      this._removeFilePathsForDirectory(projectDirectory, directory);
      this._cleanWatchersForDirectory(directory);
      this._cacheDirectoryFilePaths(projectDirectory, directory);
    }

    /**
     * Removes all watchers inside the given directory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_cleanWatchersForDirectory',
    value: function _cleanWatchersForDirectory(directory) {
      var _this2 = this;

      this._fileWatchersByDirectory.forEach(function (watcher, otherDirectory) {
        if (directory.contains(otherDirectory.path)) {
          watcher.dispose();
          _this2._fileWatchersByDirectory['delete'](otherDirectory);
        }
      });
    }

    /**
     * Removes all cached file paths in the given directory
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_removeFilePathsForDirectory',
    value: function _removeFilePathsForDirectory(projectDirectory, directory) {
      var filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path);
      if (!filePaths) return;

      filePaths = filePaths.filter(function (path) {
        return !directory.contains(path);
      });
      this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths);

      this._filePathsByDirectory['delete'](directory.path);
    }

    /**
     * Caches file paths for the given directory
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_cacheDirectoryFilePaths',
    value: function _cacheDirectoryFilePaths(projectDirectory, directory) {
      var _this3 = this;

      if (this._cancelled) return Promise.resolve([]);

      if (process.platform !== 'win32') {
        var watcher = this._fileWatchersByDirectory.get(directory);
        if (!watcher) {
          watcher = directory.onDidChange(function () {
            return _this3._onDirectoryChanged(projectDirectory, directory);
          });
          this._fileWatchersByDirectory.set(directory, watcher);
        }
      }

      return this._getDirectoryEntries(directory).then(function (entries) {
        if (_this3._cancelled) return Promise.resolve([]);

        // Filter: Files that are not ignored
        var filePaths = entries.filter(function (entry) {
          return entry instanceof _atom.File;
        }).map(function (entry) {
          return entry.path;
        }).filter(function (path) {
          return !_this3._isPathIgnored(path);
        });

        // Merge file paths into existing array (which contains *all* file paths)
        var filePathsArray = _this3._filePathsByProjectDirectory.get(projectDirectory.path) || [];
        var newPathsCount = filePathsArray.length + filePaths.length;

        var maxFileCount = atom.config.get('autocomplete-paths.maxFileCount');
        if (newPathsCount > maxFileCount && !_this3._cancelled) {
          atom.notifications.addError('autocomplete-paths', {
            description: 'Maximum file count of ' + maxFileCount + ' has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>',
            dismissable: true
          });

          _this3._filePathsByProjectDirectory.clear();
          _this3._filePathsByDirectory.clear();
          _this3._cancelled = true;
          _this3.emit('rebuild-cache-done');
          return;
        }

        _this3._filePathsByProjectDirectory.set(projectDirectory.path, _underscorePlus2['default'].union(filePathsArray, filePaths));

        // Merge file paths into existing array (which contains file paths for a specific directory)
        filePathsArray = _this3._filePathsByDirectory.get(directory.path) || [];
        _this3._filePathsByDirectory.set(directory.path, _underscorePlus2['default'].union(filePathsArray, filePaths));

        var directories = entries.filter(function (entry) {
          return entry instanceof _atom.Directory;
        }).filter(function (entry) {
          return !_this3._isPathIgnored(entry.path);
        });

        return Promise.all(directories.map(function (directory) {
          return _this3._cacheDirectoryFilePaths(projectDirectory, directory);
        }));
      });
    }

    /**
     * Promisified version of Directory#getEntries
     * @param  {Directory} directory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_getDirectoryEntries',
    value: function _getDirectoryEntries(directory) {
      return new Promise(function (resolve, reject) {
        directory.getEntries(function (err, entries) {
          if (err) return reject(err);
          resolve(entries);
        });
      });
    }

    /**
     * Rebuilds the paths cache
     */
  }, {
    key: 'rebuildCache',
    value: function rebuildCache() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.dispose();

      this._cancelled = false;
      this.emit('rebuild-cache');
      if (!path) {
        return this._buildInitialCache();
      } else {
        return this._rebuildCacheForPath(path);
      }
    }

    /**
     * Builds the initial file cache
     * @return {Promise}
     * @private
     */
  }, {
    key: '_buildInitialCache',
    value: function _buildInitialCache() {
      var _this4 = this;

      return this._cacheProjectPathsAndRepositories().then(function () {
        return Promise.all(_this4._projectDirectories.map(function (projectDirectory) {
          return _this4._cacheDirectoryFilePaths(projectDirectory, projectDirectory);
        }));
      }).then(function (result) {
        _this4.emit('rebuild-cache-done');
        return result;
      });
    }

    /**
     * Rebuilds the cache for the given path
     * @param  {String} directoryPath
     * @return {Promise}
     * @private
     */
  }, {
    key: '_rebuildCacheForPath',
    value: function _rebuildCacheForPath(directoryPath) {
      var projectPath = this._getProjectPathForPath(directoryPath);
      var subPath = _path2['default'].relative(projectPath, directoryPath);
      return this._cacheProjectFiles(projectPath, subPath, true);
    }

    /**
     * Returns the project path for the given file / directory pathName
     * @param  {String} pathName
     * @return {String}
     * @private
     */
  }, {
    key: '_getProjectPathForPath',
    value: function _getProjectPathForPath(pathName) {
      var projects = this._projectPaths;
      for (var i = 0; i < projects.length; i++) {
        var projectPath = projects[i];
        if (pathName.indexOf(projectPath) === 0) {
          return projectPath;
        }
      }
      return false;
    }

    /**
     * Returns the file paths for the given project directory with the given (optional) relative path
     * @param  {Directory} projectDirectory
     * @param  {String} [relativeToPath=null]
     * @return {String[]}
     */
  }, {
    key: 'getFilePathsForProjectDirectory',
    value: function getFilePathsForProjectDirectory(projectDirectory) {
      var relativeToPath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path) || [];
      if (relativeToPath) {
        return filePaths.filter(function (filePath) {
          return filePath.indexOf(relativeToPath) === 0;
        });
      }
      return filePaths;
    }
  }, {
    key: 'getFilePathsForDirectory',
    value: function getFilePathsForDirectory(directory) {
      return this._filePathsByDirectory.get(directory.path) || [];
    }

    /**
     * Disposes this PathsCache
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      this._fileWatchersByDirectory.forEach(function (watcher, directory) {
        watcher.dispose();
      });
      this._fileWatchersByDirectory = new Map();
      this._filePathsByProjectDirectory = new Map();
      this._filePathsByDirectory = new Map();
      this._repositories = [];
    }
  }]);

  return PathsCache;
})(_events.EventEmitter);

exports['default'] = PathsCache;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL3BhdGhzLWNhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRzZCLFFBQVE7O29CQUNwQixNQUFNOzs7OzhCQUNULGlCQUFpQjs7Ozt5QkFDVCxXQUFXOzs7O29CQUNELE1BQU07O0FBUHRDLFdBQVcsQ0FBQTtJQVNVLFVBQVU7WUFBVixVQUFVOztBQUNqQixXQURPLFVBQVUsR0FDZDswQkFESSxVQUFVOztBQUUzQiwrQkFGaUIsVUFBVSw2Q0FFcEI7O0FBRVAsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUE7QUFDdkIsUUFBSSxDQUFDLDRCQUE0QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDN0MsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDdEMsUUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDMUM7Ozs7Ozs7OztlQVJrQixVQUFVOztXQWdCZCx3QkFBQyxJQUFJLEVBQUU7QUFDcEIsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsRUFBRTtBQUNsRCxZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN2QyxjQUFJLE9BQU8sRUFBRSxPQUFNO0FBQ25CLGNBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQTtBQUMvRSxjQUFNLGtCQUFrQixHQUFHLGdCQUFnQixJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0UsY0FBSSxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFrQixFQUFFO0FBQ3hELG1C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LENBQUMsVUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFLO0FBQzVELGVBQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNsQixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QyxVQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM3QyxVQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQTtLQUN4Qjs7O1NBaFJrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9wYXRocy1jYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBnbG9iYWwgYXRvbSAqL1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgeyBEaXJlY3RvcnksIEZpbGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRoc0NhY2hlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuX3JlcG9zaXRvcmllcyA9IFtdXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlEaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeSA9IG5ldyBNYXAoKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gcGF0aCBpcyBpZ25vcmVkXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIHBhdGhcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pc1BhdGhJZ25vcmVkIChwYXRoKSB7XG4gICAgbGV0IGlnbm9yZWQgPSBmYWxzZVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRocycpKSB7XG4gICAgICB0aGlzLl9yZXBvc2l0b3JpZXMuZm9yRWFjaChyZXBvc2l0b3J5ID0+IHtcbiAgICAgICAgaWYgKGlnbm9yZWQpIHJldHVyblxuICAgICAgICBjb25zdCBpZ25vcmVTdWJtb2R1bGVzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlU3VibW9kdWxlcycpXG4gICAgICAgIGNvbnN0IGlzSWdub3JlZFN1Ym1vZHVsZSA9IGlnbm9yZVN1Ym1vZHVsZXMgJiYgcmVwb3NpdG9yeS5pc1N1Ym1vZHVsZShwYXRoKVxuICAgICAgICBpZiAocmVwb3NpdG9yeS5pc1BhdGhJZ25vcmVkKHBhdGgpIHx8IGlzSWdub3JlZFN1Ym1vZHVsZSkge1xuICAgICAgICAgIGlnbm9yZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZWROYW1lcycpKSB7XG4gICAgICBjb25zdCBpZ25vcmVkTmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJylcbiAgICAgIGlnbm9yZWROYW1lcy5mb3JFYWNoKGlnbm9yZWROYW1lID0+IHtcbiAgICAgICAgaWYgKGlnbm9yZWQpIHJldHVyblxuICAgICAgICBpZ25vcmVkID0gaWdub3JlZCB8fCBtaW5pbWF0Y2gocGF0aCwgaWdub3JlZE5hbWUsIHsgbWF0Y2hCYXNlOiB0cnVlLCBkb3Q6IHRydWUgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBpZ25vcmVkXG4gIH1cblxuICAvKipcbiAgICogQ2FjaGVzIHRoZSBwcm9qZWN0IHBhdGhzIGFuZCByZXBvc2l0b3JpZXNcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jYWNoZVByb2plY3RQYXRoc0FuZFJlcG9zaXRvcmllcyAoKSB7XG4gICAgdGhpcy5fcHJvamVjdERpcmVjdG9yaWVzID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcblxuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLl9wcm9qZWN0RGlyZWN0b3JpZXNcbiAgICAgIC5tYXAoYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkuYmluZChhdG9tLnByb2plY3QpKVxuICAgICkudGhlbihyZXBvc2l0b3JpZXMgPT4ge1xuICAgICAgdGhpcy5fcmVwb3NpdG9yaWVzID0gcmVwb3NpdG9yaWVzLmZpbHRlcihyID0+IHIpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGdpdmVuIGBkaXJlY3RvcnlgIGhhcyBjaGFuZ2VkXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gcHJvamVjdERpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IGRpcmVjdG9yeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uRGlyZWN0b3J5Q2hhbmdlZCAocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KSB7XG4gICAgdGhpcy5fcmVtb3ZlRmlsZVBhdGhzRm9yRGlyZWN0b3J5KHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSlcbiAgICB0aGlzLl9jbGVhbldhdGNoZXJzRm9yRGlyZWN0b3J5KGRpcmVjdG9yeSlcbiAgICB0aGlzLl9jYWNoZURpcmVjdG9yeUZpbGVQYXRocyhwcm9qZWN0RGlyZWN0b3J5LCBkaXJlY3RvcnkpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgd2F0Y2hlcnMgaW5zaWRlIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBkaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGVhbldhdGNoZXJzRm9yRGlyZWN0b3J5IChkaXJlY3RvcnkpIHtcbiAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5mb3JFYWNoKCh3YXRjaGVyLCBvdGhlckRpcmVjdG9yeSkgPT4ge1xuICAgICAgaWYgKGRpcmVjdG9yeS5jb250YWlucyhvdGhlckRpcmVjdG9yeS5wYXRoKSkge1xuICAgICAgICB3YXRjaGVyLmRpc3Bvc2UoKVxuICAgICAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5kZWxldGUob3RoZXJEaXJlY3RvcnkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBjYWNoZWQgZmlsZSBwYXRocyBpbiB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gcHJvamVjdERpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IGRpcmVjdG9yeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbW92ZUZpbGVQYXRoc0ZvckRpcmVjdG9yeSAocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KSB7XG4gICAgbGV0IGZpbGVQYXRocyA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQocHJvamVjdERpcmVjdG9yeS5wYXRoKVxuICAgIGlmICghZmlsZVBhdGhzKSByZXR1cm5cblxuICAgIGZpbGVQYXRocyA9IGZpbGVQYXRocy5maWx0ZXIocGF0aCA9PiAhZGlyZWN0b3J5LmNvbnRhaW5zKHBhdGgpKVxuICAgIHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5zZXQocHJvamVjdERpcmVjdG9yeS5wYXRoLCBmaWxlUGF0aHMpXG5cbiAgICB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeS5kZWxldGUoZGlyZWN0b3J5LnBhdGgpXG4gIH1cblxuICAvKipcbiAgICogQ2FjaGVzIGZpbGUgcGF0aHMgZm9yIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBwcm9qZWN0RGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gZGlyZWN0b3J5XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2FjaGVEaXJlY3RvcnlGaWxlUGF0aHMgKHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSkge1xuICAgIGlmICh0aGlzLl9jYW5jZWxsZWQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgICAgbGV0IHdhdGNoZXIgPSB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5nZXQoZGlyZWN0b3J5KVxuICAgICAgaWYgKCF3YXRjaGVyKSB7XG4gICAgICAgIHdhdGNoZXIgPSBkaXJlY3Rvcnkub25EaWRDaGFuZ2UoKCkgPT5cbiAgICAgICAgICB0aGlzLl9vbkRpcmVjdG9yeUNoYW5nZWQocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KVxuICAgICAgICApXG4gICAgICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5LnNldChkaXJlY3RvcnksIHdhdGNoZXIpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2dldERpcmVjdG9yeUVudHJpZXMoZGlyZWN0b3J5KVxuICAgICAgLnRoZW4oZW50cmllcyA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9jYW5jZWxsZWQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICAgICAgLy8gRmlsdGVyOiBGaWxlcyB0aGF0IGFyZSBub3QgaWdub3JlZFxuICAgICAgICBjb25zdCBmaWxlUGF0aHMgPSBlbnRyaWVzXG4gICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBlbnRyeSBpbnN0YW5jZW9mIEZpbGUpXG4gICAgICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5wYXRoKVxuICAgICAgICAgIC5maWx0ZXIocGF0aCA9PiAhdGhpcy5faXNQYXRoSWdub3JlZChwYXRoKSlcblxuICAgICAgICAvLyBNZXJnZSBmaWxlIHBhdGhzIGludG8gZXhpc3RpbmcgYXJyYXkgKHdoaWNoIGNvbnRhaW5zICphbGwqIGZpbGUgcGF0aHMpXG4gICAgICAgIGxldCBmaWxlUGF0aHNBcnJheSA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQocHJvamVjdERpcmVjdG9yeS5wYXRoKSB8fCBbXVxuICAgICAgICBjb25zdCBuZXdQYXRoc0NvdW50ID0gZmlsZVBhdGhzQXJyYXkubGVuZ3RoICsgZmlsZVBhdGhzLmxlbmd0aFxuXG4gICAgICAgIGNvbnN0IG1heEZpbGVDb3VudCA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLm1heEZpbGVDb3VudCcpXG4gICAgICAgIGlmIChuZXdQYXRoc0NvdW50ID4gbWF4RmlsZUNvdW50ICYmICF0aGlzLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2F1dG9jb21wbGV0ZS1wYXRocycsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTWF4aW11bSBmaWxlIGNvdW50IG9mICR7bWF4RmlsZUNvdW50fSBoYXMgYmVlbiBleGNlZWRlZC4gUGF0aCBhdXRvY29tcGxldGlvbiB3aWxsIG5vdCB3b3JrIGluIHRoaXMgcHJvamVjdC48YnIgLz48YnIgLz48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2F0b20tY29tbXVuaXR5L2F1dG9jb21wbGV0ZS1wYXRocy93aWtpL1Ryb3VibGVzaG9vdGluZyNtYXhpbXVtLWZpbGUtbGltaXQtZXhjZWVkZWRcIj5DbGljayBoZXJlIHRvIGxlYXJuIG1vcmUuPC9hPmAsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkuY2xlYXIoKVxuICAgICAgICAgIHRoaXMuX2ZpbGVQYXRoc0J5RGlyZWN0b3J5LmNsZWFyKClcbiAgICAgICAgICB0aGlzLl9jYW5jZWxsZWQgPSB0cnVlXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZWJ1aWxkLWNhY2hlLWRvbmUnKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5LnNldChwcm9qZWN0RGlyZWN0b3J5LnBhdGgsXG4gICAgICAgICAgXy51bmlvbihmaWxlUGF0aHNBcnJheSwgZmlsZVBhdGhzKVxuICAgICAgICApXG5cbiAgICAgICAgLy8gTWVyZ2UgZmlsZSBwYXRocyBpbnRvIGV4aXN0aW5nIGFycmF5ICh3aGljaCBjb250YWlucyBmaWxlIHBhdGhzIGZvciBhIHNwZWNpZmljIGRpcmVjdG9yeSlcbiAgICAgICAgZmlsZVBhdGhzQXJyYXkgPSB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeS5nZXQoZGlyZWN0b3J5LnBhdGgpIHx8IFtdXG4gICAgICAgIHRoaXMuX2ZpbGVQYXRoc0J5RGlyZWN0b3J5LnNldChkaXJlY3RvcnkucGF0aCxcbiAgICAgICAgICBfLnVuaW9uKGZpbGVQYXRoc0FycmF5LCBmaWxlUGF0aHMpXG4gICAgICAgIClcblxuICAgICAgICBjb25zdCBkaXJlY3RvcmllcyA9IGVudHJpZXNcbiAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5IGluc3RhbmNlb2YgRGlyZWN0b3J5KVxuICAgICAgICAgIC5maWx0ZXIoZW50cnkgPT4gIXRoaXMuX2lzUGF0aElnbm9yZWQoZW50cnkucGF0aCkpXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGRpcmVjdG9yaWVzLm1hcChkaXJlY3RvcnkgPT5cbiAgICAgICAgICB0aGlzLl9jYWNoZURpcmVjdG9yeUZpbGVQYXRocyhwcm9qZWN0RGlyZWN0b3J5LCBkaXJlY3RvcnkpXG4gICAgICAgICkpXG4gICAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFByb21pc2lmaWVkIHZlcnNpb24gb2YgRGlyZWN0b3J5I2dldEVudHJpZXNcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBkaXJlY3RvcnlcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXREaXJlY3RvcnlFbnRyaWVzIChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZGlyZWN0b3J5LmdldEVudHJpZXMoKGVyciwgZW50cmllcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZShlbnRyaWVzKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYnVpbGRzIHRoZSBwYXRocyBjYWNoZVxuICAgKi9cbiAgcmVidWlsZENhY2hlIChwYXRoID0gbnVsbCkge1xuICAgIHRoaXMuZGlzcG9zZSgpXG5cbiAgICB0aGlzLl9jYW5jZWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZScpXG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYnVpbGRJbml0aWFsQ2FjaGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVidWlsZENhY2hlRm9yUGF0aChwYXRoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgdGhlIGluaXRpYWwgZmlsZSBjYWNoZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2J1aWxkSW5pdGlhbENhY2hlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVQcm9qZWN0UGF0aHNBbmRSZXBvc2l0b3JpZXMoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgICAgdGhpcy5fcHJvamVjdERpcmVjdG9yaWVzLm1hcChwcm9qZWN0RGlyZWN0b3J5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWNoZURpcmVjdG9yeUZpbGVQYXRocyhwcm9qZWN0RGlyZWN0b3J5LCBwcm9qZWN0RGlyZWN0b3J5KVxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3JlYnVpbGQtY2FjaGUtZG9uZScpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVidWlsZHMgdGhlIGNhY2hlIGZvciB0aGUgZ2l2ZW4gcGF0aFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGRpcmVjdG9yeVBhdGhcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZWJ1aWxkQ2FjaGVGb3JQYXRoIChkaXJlY3RvcnlQYXRoKSB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSB0aGlzLl9nZXRQcm9qZWN0UGF0aEZvclBhdGgoZGlyZWN0b3J5UGF0aClcbiAgICBjb25zdCBzdWJQYXRoID0gcGF0aC5yZWxhdGl2ZShwcm9qZWN0UGF0aCwgZGlyZWN0b3J5UGF0aClcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVQcm9qZWN0RmlsZXMocHJvamVjdFBhdGgsIHN1YlBhdGgsIHRydWUpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcHJvamVjdCBwYXRoIGZvciB0aGUgZ2l2ZW4gZmlsZSAvIGRpcmVjdG9yeSBwYXRoTmFtZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGhOYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRQcm9qZWN0UGF0aEZvclBhdGggKHBhdGhOYW1lKSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSB0aGlzLl9wcm9qZWN0UGF0aHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHByb2plY3RzW2ldXG4gICAgICBpZiAocGF0aE5hbWUuaW5kZXhPZihwcm9qZWN0UGF0aCkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RQYXRoXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpbGUgcGF0aHMgZm9yIHRoZSBnaXZlbiBwcm9qZWN0IGRpcmVjdG9yeSB3aXRoIHRoZSBnaXZlbiAob3B0aW9uYWwpIHJlbGF0aXZlIHBhdGhcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBwcm9qZWN0RGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge1N0cmluZ30gW3JlbGF0aXZlVG9QYXRoPW51bGxdXG4gICAqIEByZXR1cm4ge1N0cmluZ1tdfVxuICAgKi9cbiAgZ2V0RmlsZVBhdGhzRm9yUHJvamVjdERpcmVjdG9yeSAocHJvamVjdERpcmVjdG9yeSwgcmVsYXRpdmVUb1BhdGggPSBudWxsKSB7XG4gICAgbGV0IGZpbGVQYXRocyA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQocHJvamVjdERpcmVjdG9yeS5wYXRoKSB8fCBbXVxuICAgIGlmIChyZWxhdGl2ZVRvUGF0aCkge1xuICAgICAgcmV0dXJuIGZpbGVQYXRocy5maWx0ZXIoZmlsZVBhdGggPT4gZmlsZVBhdGguaW5kZXhPZihyZWxhdGl2ZVRvUGF0aCkgPT09IDApXG4gICAgfVxuICAgIHJldHVybiBmaWxlUGF0aHNcbiAgfVxuXG4gIGdldEZpbGVQYXRoc0ZvckRpcmVjdG9yeSAoZGlyZWN0b3J5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbGVQYXRoc0J5RGlyZWN0b3J5LmdldChkaXJlY3RvcnkucGF0aCkgfHwgW11cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyB0aGlzIFBhdGhzQ2FjaGVcbiAgICovXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5LmZvckVhY2goKHdhdGNoZXIsIGRpcmVjdG9yeSkgPT4ge1xuICAgICAgd2F0Y2hlci5kaXNwb3NlKClcbiAgICB9KVxuICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlEaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9yZXBvc2l0b3JpZXMgPSBbXVxuICB9XG59XG4iXX0=