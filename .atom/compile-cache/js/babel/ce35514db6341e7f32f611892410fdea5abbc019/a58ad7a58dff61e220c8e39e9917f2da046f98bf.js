Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _werkzeug = require('../werkzeug');

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var SkimOpener = (function (_Opener) {
  _inherits(SkimOpener, _Opener);

  function SkimOpener() {
    _classCallCheck(this, SkimOpener);

    _get(Object.getPrototypeOf(SkimOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SkimOpener, [{
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var skimPath = atom.config.get('latex.skimPath');
      var shouldActivate = !this.shouldOpenInBackground();
      var command = (0, _werkzeug.heredoc)('\n      osascript -e       "\n      set theLine to \\"' + lineNumber + '\\" as integer\n      set theFile to POSIX file \\"' + filePath + '\\"\n      set theSource to POSIX file \\"' + texPath + '\\"\n      set thePath to POSIX path of (theFile as alias)\n      tell application \\"' + skimPath + '\\"\n        if ' + shouldActivate + ' then activate\n        try\n          set theDocs to get documents whose path is thePath\n          if (count of theDocs) > 0 then revert theDocs\n        end try\n        open theFile\n        tell front document to go to TeX line theLine from theSource\n      end tell\n      "\n      ');

      yield latex.process.executeChildProcess(command, { showError: true });
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return process.platform === 'darwin' && _fsPlus2['default'].existsSync(atom.config.get('latex.skimPath'));
    }
  }, {
    key: 'hasSynctex',
    value: function hasSynctex() {
      return true;
    }
  }, {
    key: 'canOpenInBackground',
    value: function canOpenInBackground() {
      return true;
    }
  }]);

  return SkimOpener;
})(_opener2['default']);

exports['default'] = SkimOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9za2ltLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7Ozt3QkFDQSxhQUFhOztzQkFDbEIsV0FBVzs7OztJQUVULFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7NkJBQ2xCLFdBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDekMsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUNsRCxVQUFNLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO0FBQ3JELFVBQU0sT0FBTyxHQUFHLGtGQUdNLFVBQVUsMkRBQ0MsUUFBUSxrREFDTixPQUFPLDhGQUVsQixRQUFRLHdCQUN2QixjQUFjLHNTQVNuQixDQUFBOztBQUVKLFlBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUN0RTs7O1dBRU8saUJBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksb0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtLQUN6Rjs7O1dBRVUsc0JBQUc7QUFDWixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FFbUIsK0JBQUc7QUFDckIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBcENrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc2tpbS1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHsgaGVyZWRvYyB9IGZyb20gJy4uL3dlcmt6ZXVnJ1xuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNraW1PcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIGNvbnN0IHNraW1QYXRoID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5za2ltUGF0aCcpXG4gICAgY29uc3Qgc2hvdWxkQWN0aXZhdGUgPSAhdGhpcy5zaG91bGRPcGVuSW5CYWNrZ3JvdW5kKClcbiAgICBjb25zdCBjb21tYW5kID0gaGVyZWRvYyhgXG4gICAgICBvc2FzY3JpcHQgLWUgXFxcbiAgICAgIFwiXG4gICAgICBzZXQgdGhlTGluZSB0byBcXFxcXCIke2xpbmVOdW1iZXJ9XFxcXFwiIGFzIGludGVnZXJcbiAgICAgIHNldCB0aGVGaWxlIHRvIFBPU0lYIGZpbGUgXFxcXFwiJHtmaWxlUGF0aH1cXFxcXCJcbiAgICAgIHNldCB0aGVTb3VyY2UgdG8gUE9TSVggZmlsZSBcXFxcXCIke3RleFBhdGh9XFxcXFwiXG4gICAgICBzZXQgdGhlUGF0aCB0byBQT1NJWCBwYXRoIG9mICh0aGVGaWxlIGFzIGFsaWFzKVxuICAgICAgdGVsbCBhcHBsaWNhdGlvbiBcXFxcXCIke3NraW1QYXRofVxcXFxcIlxuICAgICAgICBpZiAke3Nob3VsZEFjdGl2YXRlfSB0aGVuIGFjdGl2YXRlXG4gICAgICAgIHRyeVxuICAgICAgICAgIHNldCB0aGVEb2NzIHRvIGdldCBkb2N1bWVudHMgd2hvc2UgcGF0aCBpcyB0aGVQYXRoXG4gICAgICAgICAgaWYgKGNvdW50IG9mIHRoZURvY3MpID4gMCB0aGVuIHJldmVydCB0aGVEb2NzXG4gICAgICAgIGVuZCB0cnlcbiAgICAgICAgb3BlbiB0aGVGaWxlXG4gICAgICAgIHRlbGwgZnJvbnQgZG9jdW1lbnQgdG8gZ28gdG8gVGVYIGxpbmUgdGhlTGluZSBmcm9tIHRoZVNvdXJjZVxuICAgICAgZW5kIHRlbGxcbiAgICAgIFwiXG4gICAgICBgKVxuXG4gICAgYXdhaXQgbGF0ZXgucHJvY2Vzcy5leGVjdXRlQ2hpbGRQcm9jZXNzKGNvbW1hbmQsIHsgc2hvd0Vycm9yOiB0cnVlIH0pXG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyAmJiBmcy5leGlzdHNTeW5jKGF0b20uY29uZmlnLmdldCgnbGF0ZXguc2tpbVBhdGgnKSlcbiAgfVxuXG4gIGhhc1N5bmN0ZXggKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBjYW5PcGVuSW5CYWNrZ3JvdW5kICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG4iXX0=