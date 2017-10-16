Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var BuilderRegistry = (function () {
  function BuilderRegistry() {
    _classCallCheck(this, BuilderRegistry);
  }

  _createClass(BuilderRegistry, [{
    key: 'getBuilderImplementation',
    value: function getBuilderImplementation(state) {
      var builders = this.getAllBuilders();
      var candidates = builders.filter(function (builder) {
        return builder.canProcess(state);
      });
      switch (candidates.length) {
        case 0:
          return null;
        case 1:
          return candidates[0];
      }

      // This should never happen...
      throw new Error('Ambiguous builder registration.');
    }
  }, {
    key: 'getBuilder',
    value: function getBuilder(state) {
      var BuilderImpl = this.getBuilderImplementation(state);
      return BuilderImpl != null ? new BuilderImpl() : null;
    }
  }, {
    key: 'checkRuntimeDependencies',
    value: _asyncToGenerator(function* () {
      var builders = this.getAllBuilders();
      for (var BuilderImpl of builders) {
        var builder = new BuilderImpl();
        yield builder.checkRuntimeDependencies();
      }
    })
  }, {
    key: 'getAllBuilders',
    value: function getAllBuilders() {
      var moduleDir = this.getModuleDirPath();
      var entries = _fsPlus2['default'].readdirSync(moduleDir);
      var builders = entries.map(function (entry) {
        return require(_path2['default'].join(moduleDir, entry));
      });

      return builders;
    }
  }, {
    key: 'getModuleDirPath',
    value: function getModuleDirPath() {
      return _path2['default'].join(__dirname, 'builders');
    }
  }]);

  return BuilderRegistry;
})();

exports['default'] = BuilderRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7SUFFRixlQUFlO1dBQWYsZUFBZTswQkFBZixlQUFlOzs7ZUFBZixlQUFlOztXQUNULGtDQUFDLEtBQUssRUFBRTtBQUMvQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDdEMsVUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU87ZUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUN4RSxjQUFRLFVBQVUsQ0FBQyxNQUFNO0FBQ3ZCLGFBQUssQ0FBQztBQUFFLGlCQUFPLElBQUksQ0FBQTtBQUFBLEFBQ25CLGFBQUssQ0FBQztBQUFFLGlCQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUFBLE9BQzdCOzs7QUFHRCxZQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7S0FDbkQ7OztXQUVVLG9CQUFDLEtBQUssRUFBRTtBQUNqQixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDeEQsYUFBTyxBQUFDLFdBQVcsSUFBSSxJQUFJLEdBQUksSUFBSSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUE7S0FDeEQ7Ozs2QkFFOEIsYUFBRztBQUNoQyxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDdEMsV0FBSyxJQUFNLFdBQVcsSUFBSSxRQUFRLEVBQUU7QUFDbEMsWUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQTtBQUNqQyxjQUFNLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO09BQ3pDO0tBQ0Y7OztXQUVjLDBCQUFHO0FBQ2hCLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0FBQ3pDLFVBQU0sT0FBTyxHQUFHLG9CQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN6QyxVQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztlQUFJLE9BQU8sQ0FBQyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFBOztBQUUzRSxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBRWdCLDRCQUFHO0FBQ2xCLGFBQU8sa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQTtLQUN4Qzs7O1NBcENrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlclJlZ2lzdHJ5IHtcbiAgZ2V0QnVpbGRlckltcGxlbWVudGF0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gdGhpcy5nZXRBbGxCdWlsZGVycygpXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGJ1aWxkZXJzLmZpbHRlcihidWlsZGVyID0+IGJ1aWxkZXIuY2FuUHJvY2VzcyhzdGF0ZSkpXG4gICAgc3dpdGNoIChjYW5kaWRhdGVzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gbnVsbFxuICAgICAgY2FzZSAxOiByZXR1cm4gY2FuZGlkYXRlc1swXVxuICAgIH1cblxuICAgIC8vIFRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbi4uLlxuICAgIHRocm93IG5ldyBFcnJvcignQW1iaWd1b3VzIGJ1aWxkZXIgcmVnaXN0cmF0aW9uLicpXG4gIH1cblxuICBnZXRCdWlsZGVyIChzdGF0ZSkge1xuICAgIGNvbnN0IEJ1aWxkZXJJbXBsID0gdGhpcy5nZXRCdWlsZGVySW1wbGVtZW50YXRpb24oc3RhdGUpXG4gICAgcmV0dXJuIChCdWlsZGVySW1wbCAhPSBudWxsKSA/IG5ldyBCdWlsZGVySW1wbCgpIDogbnVsbFxuICB9XG5cbiAgYXN5bmMgY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzICgpIHtcbiAgICBjb25zdCBidWlsZGVycyA9IHRoaXMuZ2V0QWxsQnVpbGRlcnMoKVxuICAgIGZvciAoY29uc3QgQnVpbGRlckltcGwgb2YgYnVpbGRlcnMpIHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQnVpbGRlckltcGwoKVxuICAgICAgYXdhaXQgYnVpbGRlci5jaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMoKVxuICAgIH1cbiAgfVxuXG4gIGdldEFsbEJ1aWxkZXJzICgpIHtcbiAgICBjb25zdCBtb2R1bGVEaXIgPSB0aGlzLmdldE1vZHVsZURpclBhdGgoKVxuICAgIGNvbnN0IGVudHJpZXMgPSBmcy5yZWFkZGlyU3luYyhtb2R1bGVEaXIpXG4gICAgY29uc3QgYnVpbGRlcnMgPSBlbnRyaWVzLm1hcChlbnRyeSA9PiByZXF1aXJlKHBhdGguam9pbihtb2R1bGVEaXIsIGVudHJ5KSkpXG5cbiAgICByZXR1cm4gYnVpbGRlcnNcbiAgfVxuXG4gIGdldE1vZHVsZURpclBhdGggKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYnVpbGRlcnMnKVxuICB9XG59XG4iXX0=