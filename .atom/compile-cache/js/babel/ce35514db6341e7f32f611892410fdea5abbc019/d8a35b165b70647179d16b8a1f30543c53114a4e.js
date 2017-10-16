Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global atom */

var _events = require('events');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _pathsCache = require('./paths-cache');

var _pathsCache2 = _interopRequireDefault(_pathsCache);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _configDefaultScopes = require('./config/default-scopes');

var _configDefaultScopes2 = _interopRequireDefault(_configDefaultScopes);

var _configOptionScopes = require('./config/option-scopes');

var _configOptionScopes2 = _interopRequireDefault(_configOptionScopes);

'use babel';
var PathsProvider = (function (_EventEmitter) {
  _inherits(PathsProvider, _EventEmitter);

  function PathsProvider() {
    _classCallCheck(this, PathsProvider);

    _get(Object.getPrototypeOf(PathsProvider.prototype), 'constructor', this).call(this);
    this.reloadScopes();

    this._pathsCache = new _pathsCache2['default']();
    this._isReady = false;

    this._onRebuildCache = this._onRebuildCache.bind(this);
    this._onRebuildCacheDone = this._onRebuildCacheDone.bind(this);

    this._pathsCache.on('rebuild-cache', this._onRebuildCache);
    this._pathsCache.on('rebuild-cache-done', this._onRebuildCacheDone);
  }

  /**
   * Reloads the scopes
   */

  _createClass(PathsProvider, [{
    key: 'reloadScopes',
    value: function reloadScopes() {
      this._scopes = atom.config.get('autocomplete-paths.scopes') || [];
      this._scopes = this._scopes.slice(0).concat(_configDefaultScopes2['default']);

      for (var key in _configOptionScopes2['default']) {
        if (atom.config.get('autocomplete-paths.' + key)) {
          this._scopes = this._scopes.slice(0).concat(_configOptionScopes2['default'][key]);
        }
      }
    }

    /**
     * Gets called when the PathsCache is starting to rebuild the cache
     * @private
     */
  }, {
    key: '_onRebuildCache',
    value: function _onRebuildCache() {
      this.emit('rebuild-cache');
    }

    /**
     * Gets called when the PathsCache is done rebuilding the cache
     * @private
     */
  }, {
    key: '_onRebuildCacheDone',
    value: function _onRebuildCacheDone() {
      this.emit('rebuild-cache-done');
    }

    /**
     * Checks if the given scope config matches the given request
     * @param  {Object} scope
     * @param  {Object} request
     * @return {Array} The match object
     * @private
     */
  }, {
    key: '_scopeMatchesRequest',
    value: function _scopeMatchesRequest(scope, request) {
      var sourceScopes = Array.isArray(scope.scopes) ? scope.scopes : [scope.scopes];

      // Check if the scope descriptors match
      var scopeMatches = _underscorePlus2['default'].intersection(request.scopeDescriptor.getScopesArray(), sourceScopes).length > 0;
      if (!scopeMatches) return false;

      // Check if the line matches the prefixes
      var line = this._getLineTextForRequest(request);

      var lineMatch = null;
      var scopePrefixes = Array.isArray(scope.prefixes) ? scope.prefixes : [scope.prefixes];
      scopePrefixes.forEach(function (prefix) {
        var regex = new RegExp(prefix, 'i');
        lineMatch = lineMatch || line.match(regex);
      });

      return lineMatch;
    }

    /**
     * Returns the whole line text for the given request
     * @param  {Object} request
     * @return {String}
     * @private
     */
  }, {
    key: '_getLineTextForRequest',
    value: function _getLineTextForRequest(request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;

      return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    }

    /**
     * Returns the suggestions for the given scope and the given request
     * @param  {Object} scope
     * @param  {Object} request
     * @return {Promise}
     * @private
     */
  }, {
    key: '_getSuggestionsForScope',
    value: function _getSuggestionsForScope(scope, request, match) {
      var line = this._getLineTextForRequest(request);
      var pathPrefix = line.substr(match.index + match[0].length);
      var trailingSlashPresent = pathPrefix.match(/[/|\\]$/);
      var directoryGiven = pathPrefix.indexOf('./') === 0 || pathPrefix.indexOf('../') === 0;
      var parsedPathPrefix = _path2['default'].parse(pathPrefix);

      // path.parse ignores trailing slashes, so we handle this manually
      if (trailingSlashPresent) {
        parsedPathPrefix.dir = _path2['default'].join(parsedPathPrefix.dir, parsedPathPrefix.base);
        parsedPathPrefix.base = '';
        parsedPathPrefix.name = '';
      }

      var projectDirectory = this._getProjectDirectory(request.editor);
      if (!projectDirectory) return Promise.resolve([]);
      var currentDirectory = _path2['default'].dirname(request.editor.getPath());

      var requestedDirectoryPath = _path2['default'].resolve(currentDirectory, parsedPathPrefix.dir);

      var files = directoryGiven ? this._pathsCache.getFilePathsForProjectDirectory(projectDirectory, requestedDirectoryPath) : this._pathsCache.getFilePathsForProjectDirectory(projectDirectory);

      var fuzzyMatcher = directoryGiven ? parsedPathPrefix.base : pathPrefix;

      var extensions = scope.extensions;

      if (extensions) {
        (function () {
          var regex = new RegExp('.(' + extensions.join('|') + ')$');
          files = files.filter(function (path) {
            return regex.test(path);
          });
        })();
      }

      if (fuzzyMatcher) {
        files = _fuzzaldrinPlus2['default'].filter(files, fuzzyMatcher, {
          maxResults: 10
        });
      }

      var suggestions = files.map(function (pathName) {
        var normalizeSlashes = atom.config.get('autocomplete-paths.normalizeSlashes');

        var displayText = atom.project.relativizePath(pathName)[1];
        if (directoryGiven) {
          displayText = _path2['default'].relative(requestedDirectoryPath, pathName);
        }
        if (normalizeSlashes) {
          displayText = (0, _slash2['default'])(displayText);
        }

        // Relativize path to current file if necessary
        var relativePath = _path2['default'].relative(_path2['default'].dirname(request.editor.getPath()), pathName);
        if (normalizeSlashes) relativePath = (0, _slash2['default'])(relativePath);
        if (scope.relative !== false) {
          pathName = relativePath;
          if (scope.includeCurrentDirectory !== false) {
            if (pathName[0] !== '.') {
              pathName = './' + pathName;
            }
          }
        }

        // Replace stuff if necessary
        if (scope.replaceOnInsert) {
          (function () {
            var originalPathName = pathName;
            scope.replaceOnInsert.forEach(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2);

              var from = _ref2[0];
              var to = _ref2[1];

              var regex = new RegExp(from);
              if (regex.test(originalPathName)) {
                pathName = originalPathName.replace(regex, to);
              }
            });
          })();
        }

        // Calculate distance to file
        var distanceToFile = relativePath.split(_path2['default'].sep).length;
        return {
          text: pathName,
          replacementPrefix: pathPrefix,
          displayText: displayText,
          type: 'import',
          iconHTML: '<i class="icon-file-code"></i>',
          score: _fuzzaldrinPlus2['default'].score(displayText, request.prefix),
          distanceToFile: distanceToFile
        };
      });

      // Modify score to incorporate distance
      var suggestionsCount = suggestions.length;
      if (suggestions.length) {
        (function () {
          var maxDistance = _underscorePlus2['default'].max(suggestions, function (s) {
            return s.distanceToFile;
          }).distanceToFile;
          suggestions.forEach(function (s, i) {
            s.score = suggestionsCount - i + (maxDistance - s.distanceToFile);
          });

          // Sort again
          suggestions.sort(function (a, b) {
            return b.score - a.score;
          });
        })();
      }

      return Promise.resolve(suggestions);
    }

    /**
     * Returns the suggestions for the given request
     * @param  {Object} request
     * @return {Promise}
     */
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(request) {
      var _this = this;

      var matches = this._scopes.map(function (scope) {
        return [scope, _this._scopeMatchesRequest(scope, request)];
      }).filter(function (result) {
        return result[1];
      }); // Filter scopes that match
      var promises = matches.map(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var scope = _ref32[0];
        var match = _ref32[1];
        return _this._getSuggestionsForScope(scope, request, match);
      });

      return Promise.all(promises).then(function (suggestions) {
        suggestions = _underscorePlus2['default'].flatten(suggestions);
        if (!suggestions.length) return false;
        return suggestions;
      });
    }

    /**
     * Rebuilds the cache
     * @return {Promise}
     */
  }, {
    key: 'rebuildCache',
    value: function rebuildCache() {
      var _this2 = this;

      return this._pathsCache.rebuildCache().then(function (result) {
        _this2._isReady = true;
        return result;
      });
    }

    /**
     * Returns the project directory that contains the file opened in the given editor
     * @param  {TextEditor} editor
     * @return {Directory}
     * @private
     */
  }, {
    key: '_getProjectDirectory',
    value: function _getProjectDirectory(editor) {
      var filePath = editor.getBuffer().getPath();
      var projectDirectory = null;
      atom.project.getDirectories().forEach(function (directory) {
        if (directory.contains(filePath)) {
          projectDirectory = directory;
        }
      });
      return projectDirectory;
    }
  }, {
    key: 'isReady',
    value: function isReady() {
      return this._isReady;
    }
  }, {
    key: 'dispose',

    /**
     * Disposes this provider
     */
    value: function dispose() {
      this._pathsCache.removeListener('rebuild-cache', this._onRebuildCache);
      this._pathsCache.removeListener('rebuild-cache-done', this._onRebuildCacheDone);
      this._pathsCache.dispose();
    }
  }, {
    key: 'suggestionPriority',
    get: function get() {
      return atom.config.get('autocomplete-paths.suggestionPriority');
    }
  }]);

  return PathsProvider;
})(_events.EventEmitter);

exports['default'] = PathsProvider;

PathsProvider.prototype.selector = '*';
PathsProvider.prototype.inclusionPriority = 1;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL3BhdGhzLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFHNkIsUUFBUTs7b0JBQ3BCLE1BQU07Ozs7OEJBQ1QsaUJBQWlCOzs7O3FCQUNiLE9BQU87Ozs7MEJBQ0YsZUFBZTs7Ozs4QkFDZixpQkFBaUI7Ozs7bUNBQ2QseUJBQXlCOzs7O2tDQUMxQix3QkFBd0I7Ozs7QUFWakQsV0FBVyxDQUFBO0lBWVUsYUFBYTtZQUFiLGFBQWE7O0FBQ3BCLFdBRE8sYUFBYSxHQUNqQjswQkFESSxhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFdkI7QUFDUCxRQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7O0FBRW5CLFFBQUksQ0FBQyxXQUFXLEdBQUcsNkJBQWdCLENBQUE7QUFDbkMsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7O0FBRXJCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEQsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRTlELFFBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDMUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUE7R0FDcEU7Ozs7OztlQWJrQixhQUFhOztXQWtCbkIsd0JBQUc7QUFDZCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pFLFVBQUksQ0FBQyxPQUFPLEdBQUcs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QUFHLElBQUksQ0FBQTtBQUNwQixlQUFPLE1BQU0sQ0FBQTtPQUNkLENBQUMsQ0FBQTtLQUNMOzs7Ozs7Ozs7O1dBUW9CLDhCQUFDLE1BQU0sRUFBRTtBQUM1QixVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDN0MsVUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7QUFDM0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTLEVBQUk7QUFDakQsWUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2hDLDBCQUFnQixHQUFHLFNBQVMsQ0FBQTtTQUM3QjtPQUNGLENBQUMsQ0FBQTtBQUNGLGFBQU8sZ0JBQWdCLENBQUE7S0FDeEI7OztXQUVPLG1CQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQUU7Ozs7Ozs7V0FTM0IsbUJBQUc7QUFDVCxVQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3RFLFVBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQy9FLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDM0I7OztTQVhzQixlQUFHO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtLQUNoRTs7O1NBN1BrQixhQUFhOzs7cUJBQWIsYUFBYTs7QUF5UWxDLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQTtBQUN0QyxhQUFhLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9wYXRocy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBnbG9iYWwgYXRvbSAqL1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IHNsYXNoIGZyb20gJ3NsYXNoJ1xuaW1wb3J0IFBhdGhzQ2FjaGUgZnJvbSAnLi9wYXRocy1jYWNoZSdcbmltcG9ydCBmdXp6YWxkcmluIGZyb20gJ2Z1enphbGRyaW4tcGx1cydcbmltcG9ydCBEZWZhdWx0U2NvcGVzIGZyb20gJy4vY29uZmlnL2RlZmF1bHQtc2NvcGVzJ1xuaW1wb3J0IE9wdGlvblNjb3BlcyBmcm9tICcuL2NvbmZpZy9vcHRpb24tc2NvcGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRoc1Byb3ZpZGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnJlbG9hZFNjb3BlcygpXG5cbiAgICB0aGlzLl9wYXRoc0NhY2hlID0gbmV3IFBhdGhzQ2FjaGUoKVxuICAgIHRoaXMuX2lzUmVhZHkgPSBmYWxzZVxuXG4gICAgdGhpcy5fb25SZWJ1aWxkQ2FjaGUgPSB0aGlzLl9vblJlYnVpbGRDYWNoZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5fb25SZWJ1aWxkQ2FjaGVEb25lID0gdGhpcy5fb25SZWJ1aWxkQ2FjaGVEb25lLmJpbmQodGhpcylcblxuICAgIHRoaXMuX3BhdGhzQ2FjaGUub24oJ3JlYnVpbGQtY2FjaGUnLCB0aGlzLl9vblJlYnVpbGRDYWNoZSlcbiAgICB0aGlzLl9wYXRoc0NhY2hlLm9uKCdyZWJ1aWxkLWNhY2hlLWRvbmUnLCB0aGlzLl9vblJlYnVpbGRDYWNoZURvbmUpXG4gIH1cblxuICAvKipcbiAgICogUmVsb2FkcyB0aGUgc2NvcGVzXG4gICAqL1xuICByZWxvYWRTY29wZXMgKCkge1xuICAgIHRoaXMuX3Njb3BlcyA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLnNjb3BlcycpIHx8IFtdXG4gICAgdGhpcy5fc2NvcGVzID0gdGhpcy5fc2NvcGVzLnNsaWNlKDApLmNvbmNhdChEZWZhdWx0U2NvcGVzKVxuXG4gICAgZm9yICh2YXIga2V5IGluIE9wdGlvblNjb3Blcykge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldChgYXV0b2NvbXBsZXRlLXBhdGhzLiR7a2V5fWApKSB7XG4gICAgICAgIHRoaXMuX3Njb3BlcyA9IHRoaXMuX3Njb3Blcy5zbGljZSgwKS5jb25jYXQoT3B0aW9uU2NvcGVzW2tleV0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgY2FsbGVkIHdoZW4gdGhlIFBhdGhzQ2FjaGUgaXMgc3RhcnRpbmcgdG8gcmVidWlsZCB0aGUgY2FjaGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vblJlYnVpbGRDYWNoZSAoKSB7XG4gICAgdGhpcy5lbWl0KCdyZWJ1aWxkLWNhY2hlJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGNhbGxlZCB3aGVuIHRoZSBQYXRoc0NhY2hlIGlzIGRvbmUgcmVidWlsZGluZyB0aGUgY2FjaGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vblJlYnVpbGRDYWNoZURvbmUgKCkge1xuICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZS1kb25lJylcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIHNjb3BlIGNvbmZpZyBtYXRjaGVzIHRoZSBnaXZlbiByZXF1ZXN0XG4gICAqIEBwYXJhbSAge09iamVjdH0gc2NvcGVcbiAgICogQHBhcmFtICB7T2JqZWN0fSByZXF1ZXN0XG4gICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbWF0Y2ggb2JqZWN0XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2NvcGVNYXRjaGVzUmVxdWVzdCAoc2NvcGUsIHJlcXVlc3QpIHtcbiAgICBjb25zdCBzb3VyY2VTY29wZXMgPSBBcnJheS5pc0FycmF5KHNjb3BlLnNjb3BlcylcbiAgICAgID8gc2NvcGUuc2NvcGVzXG4gICAgICA6IFtzY29wZS5zY29wZXNdXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgc2NvcGUgZGVzY3JpcHRvcnMgbWF0Y2hcbiAgICBjb25zdCBzY29wZU1hdGNoZXMgPSBfLmludGVyc2VjdGlvbihcbiAgICAgIHJlcXVlc3Quc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KCksXG4gICAgICBzb3VyY2VTY29wZXNcbiAgICApLmxlbmd0aCA+IDBcbiAgICBpZiAoIXNjb3BlTWF0Y2hlcykgcmV0dXJuIGZhbHNlXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgbGluZSBtYXRjaGVzIHRoZSBwcmVmaXhlc1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLl9nZXRMaW5lVGV4dEZvclJlcXVlc3QocmVxdWVzdClcblxuICAgIGxldCBsaW5lTWF0Y2ggPSBudWxsXG4gICAgY29uc3Qgc2NvcGVQcmVmaXhlcyA9IEFycmF5LmlzQXJyYXkoc2NvcGUucHJlZml4ZXMpXG4gICAgICA/IHNjb3BlLnByZWZpeGVzXG4gICAgICA6IFtzY29wZS5wcmVmaXhlc11cbiAgICBzY29wZVByZWZpeGVzLmZvckVhY2gocHJlZml4ID0+IHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChwcmVmaXgsICdpJylcbiAgICAgIGxpbmVNYXRjaCA9IGxpbmVNYXRjaCB8fCBsaW5lLm1hdGNoKHJlZ2V4KVxuICAgIH0pXG5cbiAgICByZXR1cm4gbGluZU1hdGNoXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2hvbGUgbGluZSB0ZXh0IGZvciB0aGUgZ2l2ZW4gcmVxdWVzdFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcXVlc3RcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldExpbmVUZXh0Rm9yUmVxdWVzdCAocmVxdWVzdCkge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiB9ID0gcmVxdWVzdFxuICAgIHJldHVybiBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3VnZ2VzdGlvbnMgZm9yIHRoZSBnaXZlbiBzY29wZSBhbmQgdGhlIGdpdmVuIHJlcXVlc3RcbiAgICogQHBhcmFtICB7T2JqZWN0fSBzY29wZVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcXVlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRTdWdnZXN0aW9uc0ZvclNjb3BlIChzY29wZSwgcmVxdWVzdCwgbWF0Y2gpIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5fZ2V0TGluZVRleHRGb3JSZXF1ZXN0KHJlcXVlc3QpXG4gICAgY29uc3QgcGF0aFByZWZpeCA9IGxpbmUuc3Vic3RyKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKVxuICAgIGNvbnN0IHRyYWlsaW5nU2xhc2hQcmVzZW50ID0gcGF0aFByZWZpeC5tYXRjaCgvWy98XFxcXF0kLylcbiAgICBjb25zdCBkaXJlY3RvcnlHaXZlbiA9IHBhdGhQcmVmaXguaW5kZXhPZignLi8nKSA9PT0gMCB8fCBwYXRoUHJlZml4LmluZGV4T2YoJy4uLycpID09PSAwXG4gICAgY29uc3QgcGFyc2VkUGF0aFByZWZpeCA9IHBhdGgucGFyc2UocGF0aFByZWZpeClcblxuICAgIC8vIHBhdGgucGFyc2UgaWdub3JlcyB0cmFpbGluZyBzbGFzaGVzLCBzbyB3ZSBoYW5kbGUgdGhpcyBtYW51YWxseVxuICAgIGlmICh0cmFpbGluZ1NsYXNoUHJlc2VudCkge1xuICAgICAgcGFyc2VkUGF0aFByZWZpeC5kaXIgPSBwYXRoLmpvaW4ocGFyc2VkUGF0aFByZWZpeC5kaXIsIHBhcnNlZFBhdGhQcmVmaXguYmFzZSlcbiAgICAgIHBhcnNlZFBhdGhQcmVmaXguYmFzZSA9ICcnXG4gICAgICBwYXJzZWRQYXRoUHJlZml4Lm5hbWUgPSAnJ1xuICAgIH1cblxuICAgIGNvbnN0IHByb2plY3REaXJlY3RvcnkgPSB0aGlzLl9nZXRQcm9qZWN0RGlyZWN0b3J5KHJlcXVlc3QuZWRpdG9yKVxuICAgIGlmICghcHJvamVjdERpcmVjdG9yeSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgICBjb25zdCBjdXJyZW50RGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKHJlcXVlc3QuZWRpdG9yLmdldFBhdGgoKSlcblxuICAgIGNvbnN0IHJlcXVlc3RlZERpcmVjdG9yeVBhdGggPSBwYXRoLnJlc29sdmUoY3VycmVudERpcmVjdG9yeSwgcGFyc2VkUGF0aFByZWZpeC5kaXIpXG5cbiAgICBsZXQgZmlsZXMgPSBkaXJlY3RvcnlHaXZlblxuICAgICAgPyB0aGlzLl9wYXRoc0NhY2hlLmdldEZpbGVQYXRoc0ZvclByb2plY3REaXJlY3RvcnkocHJvamVjdERpcmVjdG9yeSwgcmVxdWVzdGVkRGlyZWN0b3J5UGF0aClcbiAgICAgIDogdGhpcy5fcGF0aHNDYWNoZS5nZXRGaWxlUGF0aHNGb3JQcm9qZWN0RGlyZWN0b3J5KHByb2plY3REaXJlY3RvcnkpXG5cbiAgICBjb25zdCBmdXp6eU1hdGNoZXIgPSBkaXJlY3RvcnlHaXZlblxuICAgICAgPyBwYXJzZWRQYXRoUHJlZml4LmJhc2VcbiAgICAgIDogcGF0aFByZWZpeFxuXG4gICAgY29uc3QgeyBleHRlbnNpb25zIH0gPSBzY29wZVxuICAgIGlmIChleHRlbnNpb25zKSB7XG4gICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYC4oJHtleHRlbnNpb25zLmpvaW4oJ3wnKX0pJGApXG4gICAgICBmaWxlcyA9IGZpbGVzLmZpbHRlcihwYXRoID0+IHJlZ2V4LnRlc3QocGF0aCkpXG4gICAgfVxuXG4gICAgaWYgKGZ1enp5TWF0Y2hlcikge1xuICAgICAgZmlsZXMgPSBmdXp6YWxkcmluLmZpbHRlcihmaWxlcywgZnV6enlNYXRjaGVyLCB7XG4gICAgICAgIG1heFJlc3VsdHM6IDEwXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxldCBzdWdnZXN0aW9ucyA9IGZpbGVzLm1hcChwYXRoTmFtZSA9PiB7XG4gICAgICBjb25zdCBub3JtYWxpemVTbGFzaGVzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMubm9ybWFsaXplU2xhc2hlcycpXG5cbiAgICAgIGxldCBkaXNwbGF5VGV4dCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoTmFtZSlbMV1cbiAgICAgIGlmIChkaXJlY3RvcnlHaXZlbikge1xuICAgICAgICBkaXNwbGF5VGV4dCA9IHBhdGgucmVsYXRpdmUocmVxdWVzdGVkRGlyZWN0b3J5UGF0aCwgcGF0aE5hbWUpXG4gICAgICB9XG4gICAgICBpZiAobm9ybWFsaXplU2xhc2hlcykge1xuICAgICAgICBkaXNwbGF5VGV4dCA9IHNsYXNoKGRpc3BsYXlUZXh0KVxuICAgICAgfVxuXG4gICAgICAvLyBSZWxhdGl2aXplIHBhdGggdG8gY3VycmVudCBmaWxlIGlmIG5lY2Vzc2FyeVxuICAgICAgbGV0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKHJlcXVlc3QuZWRpdG9yLmdldFBhdGgoKSksIHBhdGhOYW1lKVxuICAgICAgaWYgKG5vcm1hbGl6ZVNsYXNoZXMpIHJlbGF0aXZlUGF0aCA9IHNsYXNoKHJlbGF0aXZlUGF0aClcbiAgICAgIGlmIChzY29wZS5yZWxhdGl2ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgcGF0aE5hbWUgPSByZWxhdGl2ZVBhdGhcbiAgICAgICAgaWYgKHNjb3BlLmluY2x1ZGVDdXJyZW50RGlyZWN0b3J5ICE9PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChwYXRoTmFtZVswXSAhPT0gJy4nKSB7XG4gICAgICAgICAgICBwYXRoTmFtZSA9IGAuLyR7cGF0aE5hbWV9YFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZXBsYWNlIHN0dWZmIGlmIG5lY2Vzc2FyeVxuICAgICAgaWYgKHNjb3BlLnJlcGxhY2VPbkluc2VydCkge1xuICAgICAgICBsZXQgb3JpZ2luYWxQYXRoTmFtZSA9IHBhdGhOYW1lXG4gICAgICAgIHNjb3BlLnJlcGxhY2VPbkluc2VydC5mb3JFYWNoKChbZnJvbSwgdG9dKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGZyb20pXG4gICAgICAgICAgaWYgKHJlZ2V4LnRlc3Qob3JpZ2luYWxQYXRoTmFtZSkpIHtcbiAgICAgICAgICAgIHBhdGhOYW1lID0gb3JpZ2luYWxQYXRoTmFtZS5yZXBsYWNlKHJlZ2V4LCB0bylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIENhbGN1bGF0ZSBkaXN0YW5jZSB0byBmaWxlXG4gICAgICBjb25zdCBkaXN0YW5jZVRvRmlsZSA9IHJlbGF0aXZlUGF0aC5zcGxpdChwYXRoLnNlcCkubGVuZ3RoXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiBwYXRoTmFtZSxcbiAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHBhdGhQcmVmaXgsXG4gICAgICAgIGRpc3BsYXlUZXh0LFxuICAgICAgICB0eXBlOiAnaW1wb3J0JyxcbiAgICAgICAgaWNvbkhUTUw6ICc8aSBjbGFzcz1cImljb24tZmlsZS1jb2RlXCI+PC9pPicsXG4gICAgICAgIHNjb3JlOiBmdXp6YWxkcmluLnNjb3JlKGRpc3BsYXlUZXh0LCByZXF1ZXN0LnByZWZpeCksXG4gICAgICAgIGRpc3RhbmNlVG9GaWxlXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIE1vZGlmeSBzY29yZSB0byBpbmNvcnBvcmF0ZSBkaXN0YW5jZVxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zQ291bnQgPSBzdWdnZXN0aW9ucy5sZW5ndGhcbiAgICBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBtYXhEaXN0YW5jZSA9IF8ubWF4KHN1Z2dlc3Rpb25zLCBzID0+IHMuZGlzdGFuY2VUb0ZpbGUpLmRpc3RhbmNlVG9GaWxlXG4gICAgICBzdWdnZXN0aW9ucy5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICAgIHMuc2NvcmUgPSAoc3VnZ2VzdGlvbnNDb3VudCAtIGkpICsgKG1heERpc3RhbmNlIC0gcy5kaXN0YW5jZVRvRmlsZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNvcnQgYWdhaW5cbiAgICAgIHN1Z2dlc3Rpb25zLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc3VnZ2VzdGlvbnMpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3VnZ2VzdGlvbnMgZm9yIHRoZSBnaXZlbiByZXF1ZXN0XG4gICAqIEBwYXJhbSAge09iamVjdH0gcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgZ2V0U3VnZ2VzdGlvbnMgKHJlcXVlc3QpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5fc2NvcGVzXG4gICAgICAubWFwKHNjb3BlID0+IFtzY29wZSwgdGhpcy5fc2NvcGVNYXRjaGVzUmVxdWVzdChzY29wZSwgcmVxdWVzdCldKVxuICAgICAgLmZpbHRlcihyZXN1bHQgPT4gcmVzdWx0WzFdKSAvLyBGaWx0ZXIgc2NvcGVzIHRoYXQgbWF0Y2hcbiAgICBjb25zdCBwcm9taXNlcyA9IG1hdGNoZXMubWFwKChbc2NvcGUsIG1hdGNoXSkgPT5cbiAgICAgIHRoaXMuX2dldFN1Z2dlc3Rpb25zRm9yU2NvcGUoc2NvcGUsIHJlcXVlc3QsIG1hdGNoKVxuICAgIClcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgIC50aGVuKHN1Z2dlc3Rpb25zID0+IHtcbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBfLmZsYXR0ZW4oc3VnZ2VzdGlvbnMpXG4gICAgICAgIGlmICghc3VnZ2VzdGlvbnMubGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYnVpbGRzIHRoZSBjYWNoZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgcmVidWlsZENhY2hlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGF0aHNDYWNoZS5yZWJ1aWxkQ2FjaGUoKVxuICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgdGhpcy5faXNSZWFkeSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwcm9qZWN0IGRpcmVjdG9yeSB0aGF0IGNvbnRhaW5zIHRoZSBmaWxlIG9wZW5lZCBpbiB0aGUgZ2l2ZW4gZWRpdG9yXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IGVkaXRvclxuICAgKiBAcmV0dXJuIHtEaXJlY3Rvcnl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0UHJvamVjdERpcmVjdG9yeSAoZWRpdG9yKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UGF0aCgpXG4gICAgbGV0IHByb2plY3REaXJlY3RvcnkgPSBudWxsXG4gICAgYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuZm9yRWFjaChkaXJlY3RvcnkgPT4ge1xuICAgICAgaWYgKGRpcmVjdG9yeS5jb250YWlucyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcHJvamVjdERpcmVjdG9yeSA9IGRpcmVjdG9yeVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHByb2plY3REaXJlY3RvcnlcbiAgfVxuXG4gIGlzUmVhZHkgKCkgeyByZXR1cm4gdGhpcy5faXNSZWFkeSB9XG5cbiAgZ2V0IHN1Z2dlc3Rpb25Qcmlvcml0eSAoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLnN1Z2dlc3Rpb25Qcmlvcml0eScpXG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgdGhpcyBwcm92aWRlclxuICAgKi9cbiAgZGlzcG9zZSAoKSB7XG4gICAgdGhpcy5fcGF0aHNDYWNoZS5yZW1vdmVMaXN0ZW5lcigncmVidWlsZC1jYWNoZScsIHRoaXMuX29uUmVidWlsZENhY2hlKVxuICAgIHRoaXMuX3BhdGhzQ2FjaGUucmVtb3ZlTGlzdGVuZXIoJ3JlYnVpbGQtY2FjaGUtZG9uZScsIHRoaXMuX29uUmVidWlsZENhY2hlRG9uZSlcbiAgICB0aGlzLl9wYXRoc0NhY2hlLmRpc3Bvc2UoKVxuICB9XG59XG5cblBhdGhzUHJvdmlkZXIucHJvdG90eXBlLnNlbGVjdG9yID0gJyonXG5QYXRoc1Byb3ZpZGVyLnByb3RvdHlwZS5pbmNsdXNpb25Qcmlvcml0eSA9IDFcbiJdfQ==