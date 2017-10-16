Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* global atom */

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _pathsProvider = require('./paths-provider');

var _pathsProvider2 = _interopRequireDefault(_pathsProvider);

var _atom = require('atom');

var _configOptionScopes = require('./config/option-scopes');

var _configOptionScopes2 = _interopRequireDefault(_configOptionScopes);

'use babel';exports['default'] = {
  config: _config2['default'],
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'autocomplete-paths:rebuild-cache': function autocompletePathsRebuildCache() {
        _this._provider.rebuildCache();
      }
    }));

    var cacheOptions = ['core.ignoredNames', 'core.excludeVcsIgnoredPaths', 'autocomplete-paths.ignoreSubmodules', 'autocomplete-paths.ignoredNames'];
    cacheOptions.forEach(function (cacheOption) {
      _this.subscriptions.add(atom.config.observe(cacheOption, function (value) {
        if (!_this._provider) return;
        _this._provider.rebuildCache();
      }));
    });

    var scopeOptions = ['autocomplete-paths.scopes'];
    for (var key in _configOptionScopes2['default']) {
      scopeOptions.push('autocomplete-paths.' + key);
    }
    scopeOptions.forEach(function (scopeOption) {
      _this.subscriptions.add(atom.config.observe(scopeOption, function (value) {
        if (!_this._provider) return;
        _this._provider.reloadScopes();
      }));
    });
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    if (this._provider) {
      this._provider.dispose();
      this._provider = null;
    }
    if (this._statusBarTile) {
      this._statusBarTile.destroy();
      this._statusBarTile = null;
    }
  },

  /**
   * Invoked when the status bar becomes available
   * @param  {StatusBar} statusBar
   */
  consumeStatusBar: function consumeStatusBar(statusBar) {
    this._statusBar = statusBar;
    if (this._displayStatusBarItemOnConsumption) {
      this._displayStatusBarTile();
    }
  },

  /**
   * Displays the status bar tile
   */
  _displayStatusBarTile: function _displayStatusBarTile() {
    if (!this._statusBar) {
      this._displayStatusBarItemOnConsumption = true;
      return;
    }
    if (this._statusBarTile) return;

    var statusBarElement = document.createElement('autocomplete-paths-status-bar');
    statusBarElement.innerHTML = 'Rebuilding paths cache...';
    this._statusBarTile = this._statusBar.addRightTile({ item: statusBarElement, priority: 100 });
  },

  /**
   * Hides the status bar tile
   */
  _hideStatusBarTile: function _hideStatusBarTile() {
    this._statusBarTile && this._statusBarTile.destroy();
    this._statusBarTile = null;
  },

  getProvider: function getProvider() {
    var _this2 = this;

    if (!this._provider) {
      this._provider = new _pathsProvider2['default']();
      this._provider.on('rebuild-cache', function () {
        _this2._displayStatusBarTile();
      });
      this._provider.on('rebuild-cache-done', function () {
        _this2._hideStatusBarTile();
      });
      this._provider.rebuildCache();
    }
    return this._provider;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL2F1dG9jb21wbGV0ZS1wYXRocy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFHbUIsVUFBVTs7Ozs2QkFDSCxrQkFBa0I7Ozs7b0JBQ1IsTUFBTTs7a0NBQ2pCLHdCQUF3Qjs7OztBQU5qRCxXQUFXLENBQUEscUJBUUk7QUFDYixRQUFNLHFCQUFRO0FBQ2QsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBRSxvQkFBWTs7O0FBQ3BCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQsd0NBQWtDLEVBQUUseUNBQU07QUFDeEMsY0FBSyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7T0FDOUI7S0FDRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFNLFlBQVksR0FBRyxDQUNuQixtQkFBbUIsRUFDbkIsNkJBQTZCLEVBQzdCLHFDQUFxQyxFQUNyQyxpQ0FBaUMsQ0FDbEMsQ0FBQTtBQUNELGdCQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsV0FBVyxFQUFJO0FBQ2xDLFlBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDL0QsWUFBSSxDQUFDLE1BQUssU0FBUyxFQUFFLE9BQU07QUFDM0IsY0FBSyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7T0FDOUIsQ0FBQyxDQUFDLENBQUE7S0FDSixDQUFDLENBQUE7O0FBRUYsUUFBTSxZQUFZLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0FBQ2xELFNBQUssSUFBSSxHQUFHLHFDQUFrQjtBQUM1QixrQkFBWSxDQUFDLElBQUkseUJBQXVCLEdBQUcsQ0FBRyxDQUFBO0tBQy9DO0FBQ0QsZ0JBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxXQUFXLEVBQUk7QUFDbEMsWUFBSyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFBLEtBQUssRUFBSTtBQUMvRCxZQUFJLENBQUMsTUFBSyxTQUFTLEVBQUUsT0FBTTtBQUMzQixjQUFLLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUM5QixDQUFDLENBQUMsQ0FBQTtLQUNKLENBQUMsQ0FBQTtHQUNIOztBQUVELFlBQVUsRUFBRSxzQkFBWTtBQUN0QixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFFBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0tBQ3RCO0FBQ0QsUUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDN0IsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7S0FDM0I7R0FDRjs7Ozs7O0FBTUQsa0JBQWdCLEVBQUUsMEJBQVUsU0FBUyxFQUFFO0FBQ3JDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO0FBQzNCLFFBQUksSUFBSSxDQUFDLGtDQUFrQyxFQUFFO0FBQzNDLFVBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0tBQzdCO0dBQ0Y7Ozs7O0FBS0QsdUJBQXFCLEVBQUMsaUNBQUc7QUFDdkIsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsVUFBSSxDQUFDLGtDQUFrQyxHQUFHLElBQUksQ0FBQTtBQUM5QyxhQUFNO0tBQ1A7QUFDRCxRQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTTs7QUFFL0IsUUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDaEYsb0JBQWdCLENBQUMsU0FBUyxHQUFHLDJCQUEyQixDQUFBO0FBQ3hELFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7R0FDOUY7Ozs7O0FBS0Qsb0JBQWtCLEVBQUMsOEJBQUc7QUFDcEIsUUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3BELFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBO0dBQzNCOztBQUVELGFBQVcsRUFBRSx1QkFBWTs7O0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLFVBQUksQ0FBQyxTQUFTLEdBQUcsZ0NBQW1CLENBQUE7QUFDcEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQU07QUFDdkMsZUFBSyxxQkFBcUIsRUFBRSxDQUFBO09BQzdCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLFlBQU07QUFDNUMsZUFBSyxrQkFBa0IsRUFBRSxDQUFBO09BQzFCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDOUI7QUFDRCxXQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7R0FDdEI7Q0FDRiIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9hdXRvY29tcGxldGUtcGF0aHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZ2xvYmFsIGF0b20gKi9cblxuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZydcbmltcG9ydCBQYXRoc1Byb3ZpZGVyIGZyb20gJy4vcGF0aHMtcHJvdmlkZXInXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBPcHRpb25TY29wZXMgZnJvbSAnLi9jb25maWcvb3B0aW9uLXNjb3BlcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IENvbmZpZyxcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdhdXRvY29tcGxldGUtcGF0aHM6cmVidWlsZC1jYWNoZSc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fcHJvdmlkZXIucmVidWlsZENhY2hlKClcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIGNvbnN0IGNhY2hlT3B0aW9ucyA9IFtcbiAgICAgICdjb3JlLmlnbm9yZWROYW1lcycsXG4gICAgICAnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJyxcbiAgICAgICdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlU3VibW9kdWxlcycsXG4gICAgICAnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZWROYW1lcydcbiAgICBdXG4gICAgY2FjaGVPcHRpb25zLmZvckVhY2goY2FjaGVPcHRpb24gPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGNhY2hlT3B0aW9uLCB2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5fcHJvdmlkZXIpIHJldHVyblxuICAgICAgICB0aGlzLl9wcm92aWRlci5yZWJ1aWxkQ2FjaGUoKVxuICAgICAgfSkpXG4gICAgfSlcblxuICAgIGNvbnN0IHNjb3BlT3B0aW9ucyA9IFsnYXV0b2NvbXBsZXRlLXBhdGhzLnNjb3BlcyddXG4gICAgZm9yIChsZXQga2V5IGluIE9wdGlvblNjb3Blcykge1xuICAgICAgc2NvcGVPcHRpb25zLnB1c2goYGF1dG9jb21wbGV0ZS1wYXRocy4ke2tleX1gKVxuICAgIH1cbiAgICBzY29wZU9wdGlvbnMuZm9yRWFjaChzY29wZU9wdGlvbiA9PiB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoc2NvcGVPcHRpb24sIHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9wcm92aWRlcikgcmV0dXJuXG4gICAgICAgIHRoaXMuX3Byb3ZpZGVyLnJlbG9hZFNjb3BlcygpXG4gICAgICB9KSlcbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuX3Byb3ZpZGVyKSB7XG4gICAgICB0aGlzLl9wcm92aWRlci5kaXNwb3NlKClcbiAgICAgIHRoaXMuX3Byb3ZpZGVyID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy5fc3RhdHVzQmFyVGlsZSkge1xuICAgICAgdGhpcy5fc3RhdHVzQmFyVGlsZS5kZXN0cm95KClcbiAgICAgIHRoaXMuX3N0YXR1c0JhclRpbGUgPSBudWxsXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIHN0YXR1cyBiYXIgYmVjb21lcyBhdmFpbGFibGVcbiAgICogQHBhcmFtICB7U3RhdHVzQmFyfSBzdGF0dXNCYXJcbiAgICovXG4gIGNvbnN1bWVTdGF0dXNCYXI6IGZ1bmN0aW9uIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLl9zdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgICBpZiAodGhpcy5fZGlzcGxheVN0YXR1c0Jhckl0ZW1PbkNvbnN1bXB0aW9uKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5U3RhdHVzQmFyVGlsZSgpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgc3RhdHVzIGJhciB0aWxlXG4gICAqL1xuICBfZGlzcGxheVN0YXR1c0JhclRpbGUgKCkge1xuICAgIGlmICghdGhpcy5fc3RhdHVzQmFyKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5U3RhdHVzQmFySXRlbU9uQ29uc3VtcHRpb24gPSB0cnVlXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuX3N0YXR1c0JhclRpbGUpIHJldHVyblxuXG4gICAgY29uc3Qgc3RhdHVzQmFyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1dG9jb21wbGV0ZS1wYXRocy1zdGF0dXMtYmFyJylcbiAgICBzdGF0dXNCYXJFbGVtZW50LmlubmVySFRNTCA9ICdSZWJ1aWxkaW5nIHBhdGhzIGNhY2hlLi4uJ1xuICAgIHRoaXMuX3N0YXR1c0JhclRpbGUgPSB0aGlzLl9zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHsgaXRlbTogc3RhdHVzQmFyRWxlbWVudCwgcHJpb3JpdHk6IDEwMCB9KVxuICB9LFxuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgc3RhdHVzIGJhciB0aWxlXG4gICAqL1xuICBfaGlkZVN0YXR1c0JhclRpbGUgKCkge1xuICAgIHRoaXMuX3N0YXR1c0JhclRpbGUgJiYgdGhpcy5fc3RhdHVzQmFyVGlsZS5kZXN0cm95KClcbiAgICB0aGlzLl9zdGF0dXNCYXJUaWxlID0gbnVsbFxuICB9LFxuXG4gIGdldFByb3ZpZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9wcm92aWRlcikge1xuICAgICAgdGhpcy5fcHJvdmlkZXIgPSBuZXcgUGF0aHNQcm92aWRlcigpXG4gICAgICB0aGlzLl9wcm92aWRlci5vbigncmVidWlsZC1jYWNoZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5fZGlzcGxheVN0YXR1c0JhclRpbGUoKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Byb3ZpZGVyLm9uKCdyZWJ1aWxkLWNhY2hlLWRvbmUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2hpZGVTdGF0dXNCYXJUaWxlKClcbiAgICAgIH0pXG4gICAgICB0aGlzLl9wcm92aWRlci5yZWJ1aWxkQ2FjaGUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXJcbiAgfVxufVxuIl19