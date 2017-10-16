Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _fs = require('fs');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

'use babel';

var readFileAsync = (0, _bluebird.promisify)(_fs.readFile);
var writeFileAsync = (0, _bluebird.promisify)(_fs.writeFile);
var mkdirAsync = (0, _bluebird.promisify)(_fs.mkdir);
var globAsync = (0, _bluebird.promisify)(_glob2['default']);
var statAsync = (0, _bluebird.promisify)(_fs.stat);
var unlinkAsync = (0, _bluebird.promisify)(_fs.unlink);
var utimesAsync = (0, _bluebird.promisify)(_fs.utimes);

var Cache = (function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.VERSION = 1;
    this.CACHEFOLDER = process.env.ATOM_HOME + '/classpath-cache';

    this.items = new Map();
    this.cacheCheckInterval = setInterval(this.clearExpiredCache.bind(this), 1000 * 60 * 30); // Every 30 minutes
    atom.commands.add('atom-workspace', 'java-classpath-registry:clear-cache', this.clear.bind(this));
  }

  _createClass(Cache, [{
    key: 'dispose',
    value: function dispose() {
      clearInterval(this.cacheCheckInterval);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;

      return globAsync(this.CACHEFOLDER + '/*.json').then(function (files) {
        return Promise.all(files.map(function (file) {
          return utimesAsync(file, 0, 0);
        }));
      }).then(this.clearExpiredCache.bind(this)).then(function () {
        return _this.items = new Map();
      });
    }
  }, {
    key: '_unlinkAgedCache',
    value: function _unlinkAgedCache(files) {
      var now = new Date();
      return Promise.all(files.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var file = _ref2[0];
        var fstat = _ref2[1];

        var age = (now - fstat.atime) / 1000 / 60 / 60 / 24;
        if (age > atom.config.get('java-classpath-registry.cacheTtl')) {
          return unlinkAsync(file).then(function () {
            return fstat.size;
          });
        }

        return false;
      }));
    }
  }, {
    key: '_reportCacheClear',
    value: function _reportCacheClear(result) {
      var unlinked = result.filter(function (e) {
        return e !== false;
      });
      var size = result.reduce(function (memo, s) {
        return memo + s;
      }, 0);
      if (unlinked.length > 0) {
        console.log('deleted ' + unlinked.length + ' caches, freeing ' + (size / (1024 * 1024)).toFixed(2) + ' MB');
      }
    }
  }, {
    key: 'clearExpiredCache',
    value: function clearExpiredCache() {
      return globAsync(this.CACHEFOLDER + '/*.json').then(function (files) {
        return Promise.all(files.map(function (file) {
          return Promise.all([file, statAsync(file)]);
        }));
      }).then(this._unlinkAgedCache.bind(this)).then(this._reportCacheClear.bind(this));
    }
  }, {
    key: 'get',
    value: function get(hash) {
      var _this2 = this;

      if (this.items.has(hash)) {
        return Promise.resolve(this.items.get(hash));
      }

      return readFileAsync(this.CACHEFOLDER + '/' + hash + '.json').then(JSON.parse).then(function (_ref3) {
        var version = _ref3.version;
        var entries = _ref3.entries;

        if (_this2.VERSION !== version) {
          console.warn('version mismatch, ignoring cache');
          return null;
        }

        _this2.set(hash, entries);
        return entries;
      })['catch'](function () {
        return null;
      });
    }
  }, {
    key: 'set',
    value: function set(hash, entries) {
      this.items.set(hash, entries);
    }
  }, {
    key: 'addEntry',
    value: function addEntry(hash, entry) {
      var entries = this.items.get(hash) || [];
      entries.push(entry);
      this.items.set(hash, entries);
    }
  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      return mkdirAsync(this.CACHEFOLDER)['catch'](function (e) {/* folder already exists */}).then(function () {
        return Promise.all([].concat(_toConsumableArray(_this3.items)).map(function (_ref4) {
          var _ref42 = _slicedToArray(_ref4, 2);

          var hash = _ref42[0];
          var entries = _ref42[1];

          return writeFileAsync(_this3.CACHEFOLDER + '/' + hash + '.json', JSON.stringify({
            version: _this3.VERSION,
            entries: entries
          }));
        }));
      });
    }
  }]);

  return Cache;
})();

exports['default'] = Cache;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS9saWIvY2FjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7d0JBRTBCLFVBQVU7O2tCQUM2QixJQUFJOztvQkFDcEQsTUFBTTs7OztBQUp2QixXQUFXLENBQUM7O0FBTVosSUFBTSxhQUFhLEdBQUcsc0NBQW1CLENBQUM7QUFDMUMsSUFBTSxjQUFjLEdBQUcsdUNBQW9CLENBQUM7QUFDNUMsSUFBTSxVQUFVLEdBQUcsbUNBQWdCLENBQUM7QUFDcEMsSUFBTSxTQUFTLEdBQUcsMkNBQWUsQ0FBQztBQUNsQyxJQUFNLFNBQVMsR0FBRyxrQ0FBZSxDQUFDO0FBQ2xDLElBQU0sV0FBVyxHQUFHLG9DQUFpQixDQUFDO0FBQ3RDLElBQU0sV0FBVyxHQUFHLG9DQUFpQixDQUFDOztJQUVoQyxLQUFLO0FBS0UsV0FMUCxLQUFLLEdBS0s7MEJBTFYsS0FBSzs7U0FFVCxPQUFPLEdBQUcsQ0FBQztTQUNYLFdBQVcsR0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7O0FBR3BDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsa0JBQWtCLEdBQUcsV0FBVyxDQUFHLElBQUksQ0FBQyxpQkFBaUIsTUFBdEIsSUFBSSxHQUFvQixJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2hGLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHFDQUFxQyxFQUFJLElBQUksQ0FBQyxLQUFLLE1BQVYsSUFBSSxFQUFPLENBQUM7R0FDMUY7O2VBVEcsS0FBSzs7V0FXRixtQkFBRztBQUNSLG1CQUFhLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDeEM7OztXQUVJLGlCQUFHOzs7QUFDTixhQUFPLFNBQVMsQ0FBSSxJQUFJLENBQUMsV0FBVyxh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QkFBTyxFQUFFLE9BQU87V0FDakIsQ0FBQyxDQUFDLENBQUM7U0FDTCxDQUFDLENBQUMsQ0FBQztPQUNMLENBQUMsQ0FBQztLQUNOOzs7U0F6RkcsS0FBSzs7O3FCQTRGSSxLQUFLIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS9saWIvY2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgcmVhZEZpbGUsIHdyaXRlRmlsZSwgbWtkaXIsIHN0YXQsIHVubGluaywgdXRpbWVzIH0gZnJvbSAnZnMnO1xuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5cbmNvbnN0IHJlYWRGaWxlQXN5bmMgPSBwcm9taXNpZnkocmVhZEZpbGUpO1xuY29uc3Qgd3JpdGVGaWxlQXN5bmMgPSBwcm9taXNpZnkod3JpdGVGaWxlKTtcbmNvbnN0IG1rZGlyQXN5bmMgPSBwcm9taXNpZnkobWtkaXIpO1xuY29uc3QgZ2xvYkFzeW5jID0gcHJvbWlzaWZ5KGdsb2IpO1xuY29uc3Qgc3RhdEFzeW5jID0gcHJvbWlzaWZ5KHN0YXQpO1xuY29uc3QgdW5saW5rQXN5bmMgPSBwcm9taXNpZnkodW5saW5rKTtcbmNvbnN0IHV0aW1lc0FzeW5jID0gcHJvbWlzaWZ5KHV0aW1lcyk7XG5cbmNsYXNzIENhY2hlIHtcblxuICBWRVJTSU9OID0gMTtcbiAgQ0FDSEVGT0xERVIgPSBgJHtwcm9jZXNzLmVudi5BVE9NX0hPTUV9L2NsYXNzcGF0aC1jYWNoZWA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pdGVtcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmNhY2hlQ2hlY2tJbnRlcnZhbCA9IHNldEludGVydmFsKDo6dGhpcy5jbGVhckV4cGlyZWRDYWNoZSwgMTAwMCAqIDYwICogMzApOyAvLyBFdmVyeSAzMCBtaW51dGVzXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2phdmEtY2xhc3NwYXRoLXJlZ2lzdHJ5OmNsZWFyLWNhY2hlJywgOjp0aGlzLmNsZWFyKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNhY2hlQ2hlY2tJbnRlcnZhbCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICByZXR1cm4gZ2xvYkFzeW5jKGAke3RoaXMuQ0FDSEVGT0xERVJ9LyouanNvbmApXG4gICAgICAudGhlbihmaWxlcyA9PiBQcm9taXNlLmFsbChmaWxlcy5tYXAoZmlsZSA9PiB1dGltZXNBc3luYyhmaWxlLCAwLCAwKSkpKVxuICAgICAgLnRoZW4oOjp0aGlzLmNsZWFyRXhwaXJlZENhY2hlKVxuICAgICAgLnRoZW4oKCkgPT4gKHRoaXMuaXRlbXMgPSBuZXcgTWFwKCkpKTtcbiAgfVxuXG4gIF91bmxpbmtBZ2VkQ2FjaGUoZmlsZXMpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChmaWxlcy5tYXAoKFsgZmlsZSwgZnN0YXQgXSkgPT4ge1xuICAgICAgY29uc3QgYWdlID0gKG5vdyAtIGZzdGF0LmF0aW1lKSAvIDEwMDAgLyA2MCAvIDYwIC8gMjQ7XG4gICAgICBpZiAoYWdlID4gYXRvbS5jb25maWcuZ2V0KCdqYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS5jYWNoZVR0bCcpKSB7XG4gICAgICAgIHJldHVybiB1bmxpbmtBc3luYyhmaWxlKS50aGVuKCgpID0+IGZzdGF0LnNpemUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSkpO1xuICB9XG5cbiAgX3JlcG9ydENhY2hlQ2xlYXIocmVzdWx0KSB7XG4gICAgY29uc3QgdW5saW5rZWQgPSByZXN1bHQuZmlsdGVyKGUgPT4gZSAhPT0gZmFsc2UpO1xuICAgIGNvbnN0IHNpemUgPSByZXN1bHQucmVkdWNlKChtZW1vLCBzKSA9PiBtZW1vICsgcywgMCk7XG4gICAgaWYgKHVubGlua2VkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKGBkZWxldGVkICR7dW5saW5rZWQubGVuZ3RofSBjYWNoZXMsIGZyZWVpbmcgJHsoc2l6ZSAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMil9IE1CYCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJFeHBpcmVkQ2FjaGUoKSB7XG4gICAgcmV0dXJuIGdsb2JBc3luYyhgJHt0aGlzLkNBQ0hFRk9MREVSfS8qLmpzb25gKVxuICAgICAgLnRoZW4oZmlsZXMgPT4gUHJvbWlzZS5hbGwoZmlsZXMubWFwKGZpbGUgPT4gUHJvbWlzZS5hbGwoWyBmaWxlLCBzdGF0QXN5bmMoZmlsZSkgXSkpKSlcbiAgICAgIC50aGVuKDo6dGhpcy5fdW5saW5rQWdlZENhY2hlKVxuICAgICAgLnRoZW4oOjp0aGlzLl9yZXBvcnRDYWNoZUNsZWFyKTtcbiAgfVxuXG4gIGdldChoYXNoKSB7XG4gICAgaWYgKHRoaXMuaXRlbXMuaGFzKGhhc2gpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaXRlbXMuZ2V0KGhhc2gpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZEZpbGVBc3luYyhgJHt0aGlzLkNBQ0hFRk9MREVSfS8ke2hhc2h9Lmpzb25gKVxuICAgICAgLnRoZW4oSlNPTi5wYXJzZSlcbiAgICAgIC50aGVuKCh7IHZlcnNpb24sIGVudHJpZXMgfSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5WRVJTSU9OICE9PSB2ZXJzaW9uKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCd2ZXJzaW9uIG1pc21hdGNoLCBpZ25vcmluZyBjYWNoZScpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXQoaGFzaCwgZW50cmllcyk7XG4gICAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcbiAgfVxuXG4gIHNldChoYXNoLCBlbnRyaWVzKSB7XG4gICAgdGhpcy5pdGVtcy5zZXQoaGFzaCwgZW50cmllcyk7XG4gIH1cblxuICBhZGRFbnRyeShoYXNoLCBlbnRyeSkge1xuICAgIGNvbnN0IGVudHJpZXMgPSB0aGlzLml0ZW1zLmdldChoYXNoKSB8fCBbXTtcbiAgICBlbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIHRoaXMuaXRlbXMuc2V0KGhhc2gsIGVudHJpZXMpO1xuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICByZXR1cm4gbWtkaXJBc3luYyh0aGlzLkNBQ0hFRk9MREVSKVxuICAgICAgLmNhdGNoKGUgPT4geyAvKiBmb2xkZXIgYWxyZWFkeSBleGlzdHMgKi8gfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFsgLi4udGhpcy5pdGVtcyBdLm1hcCgoWyBoYXNoLCBlbnRyaWVzIF0pID0+IHtcbiAgICAgICAgICByZXR1cm4gd3JpdGVGaWxlQXN5bmMoYCR7dGhpcy5DQUNIRUZPTERFUn0vJHtoYXNofS5qc29uYCwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy5WRVJTSU9OLFxuICAgICAgICAgICAgZW50cmllczogZW50cmllc1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FjaGU7XG4iXX0=