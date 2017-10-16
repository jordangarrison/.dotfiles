Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var OpenerRegistry = (function (_Disposable) {
  _inherits(OpenerRegistry, _Disposable);

  function OpenerRegistry() {
    _classCallCheck(this, OpenerRegistry);

    _get(Object.getPrototypeOf(OpenerRegistry.prototype), 'constructor', this).call(this, function () {
      return _this.disposables.dispose();
    });
    this.openers = new Map();
    this.disposables = new _atom.CompositeDisposable();

    var _this = this;

    this.initializeOpeners();
  }

  _createClass(OpenerRegistry, [{
    key: 'initializeOpeners',
    value: function initializeOpeners() {
      var schema = atom.config.getSchema('latex.opener');
      var dir = _path2['default'].join(__dirname, 'openers');
      var ext = '.js';
      for (var openerName of schema['enum']) {
        if (openerName !== 'automatic') {
          var _name = openerName + '-opener';
          var OpenerImpl = require(_path2['default'].format({ dir: dir, name: _name, ext: ext }));
          var _opener = new OpenerImpl();
          this.disposables.add(_opener);
          this.openers.set(openerName, _opener);
        }
      }
    }
  }, {
    key: 'checkRuntimeDependencies',
    value: function checkRuntimeDependencies() {
      var pdfOpeners = Array.from(this.getCandidateOpeners('foo.pdf').keys());
      if (pdfOpeners.length) {
        latex.log.info('The following PDF capable openers were found: ' + pdfOpeners.join(', ') + '.');
      } else {
        latex.log.error('No PDF capable openers were found.');
      }

      var psOpeners = Array.from(this.getCandidateOpeners('foo.ps').keys());
      if (psOpeners.length) {
        latex.log.info('The following PS capable openers were found: ' + psOpeners.join(', ') + '.');
      } else {
        latex.log.warning('No PS capable openers were found.');
      }

      var dviOpeners = Array.from(this.getCandidateOpeners('foo.dvi').keys());
      if (dviOpeners.length) {
        latex.log.info('The following DVI capable openers were found: ' + dviOpeners.join(', ') + '.');
      } else {
        latex.log.warning('No DVI capable openers were found.');
      }
    }
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      var name = atom.config.get('latex.opener');
      var opener = this.openers.get(name);

      if (!opener || !opener.canOpen(filePath)) {
        opener = this.findOpener(filePath);
      }

      if (opener) {
        return yield opener.open(filePath, texPath, lineNumber);
      } else {
        latex.log.warning('No opener found that can open ' + filePath + '.');
      }
    })
  }, {
    key: 'getCandidateOpeners',
    value: function getCandidateOpeners(filePath) {
      var candidates = new Map();
      for (var _ref3 of this.openers.entries()) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var _name2 = _ref2[0];
        var _opener2 = _ref2[1];

        if (_opener2.canOpen(filePath)) candidates.set(_name2, _opener2);
      }
      return candidates;
    }
  }, {
    key: 'findOpener',
    value: function findOpener(filePath) {
      var openResultInBackground = atom.config.get('latex.openResultInBackground');
      var enableSynctex = atom.config.get('latex.enableSynctex');
      var candidates = Array.from(this.getCandidateOpeners(filePath).values());

      if (!candidates.length) return;

      var rankedCandidates = _lodash2['default'].orderBy(candidates, [function (opener) {
        return opener.hasSynctex();
      }, function (opener) {
        return opener.canOpenInBackground();
      }], ['desc', 'desc']);

      if (enableSynctex) {
        // If the user wants openResultInBackground also and there is an opener
        // that supports that and SyncTeX it will be the first one because of
        // the priority sort.
        var _opener3 = rankedCandidates.find(function (opener) {
          return opener.hasSynctex();
        });
        if (_opener3) return _opener3;
      }

      if (openResultInBackground) {
        var _opener4 = rankedCandidates.find(function (opener) {
          return opener.canOpenInBackground();
        });
        if (_opener4) return _opener4;
      }

      return rankedCandidates[0];
    }
  }]);

  return OpenerRegistry;
})(_atom.Disposable);

exports['default'] = OpenerRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVyLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7b0JBQ0wsTUFBTTs7OztvQkFDeUIsTUFBTTs7SUFFakMsY0FBYztZQUFkLGNBQWM7O0FBSXJCLFdBSk8sY0FBYyxHQUlsQjswQkFKSSxjQUFjOztBQUsvQiwrQkFMaUIsY0FBYyw2Q0FLekI7YUFBTSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUU7S0FBQSxFQUFDO1NBSnpDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRTtTQUNuQixXQUFXLEdBQUcsK0JBQXlCOzs7O0FBSXJDLFFBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0dBQ3pCOztlQVBrQixjQUFjOztXQVNmLDZCQUFHO0FBQ25CLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3BELFVBQU0sR0FBRyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDM0MsVUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFBO0FBQ2pCLFdBQUssSUFBTSxVQUFVLElBQUksTUFBTSxRQUFLLEVBQUU7QUFDcEMsWUFBSSxVQUFVLEtBQUssV0FBVyxFQUFFO0FBQzlCLGNBQU0sS0FBSSxHQUFNLFVBQVUsWUFBUyxDQUFBO0FBQ25DLGNBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBSyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLElBQUksRUFBSixLQUFJLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzRCxjQUFNLE9BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFBO0FBQy9CLGNBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU0sQ0FBQyxDQUFBO0FB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QyxDQUFBO0FBQzVELFVBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7O0FBRTFFLFVBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU07O0FBRTlCLFVBQU0sZ0JBQWdCLEdBQUcsb0JBQUUsT0FBTyxDQUFDLFVBQVUsRUFDM0MsQ0FBQyxVQUFBLE1BQU07ZUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO09BQUEsRUFBRSxVQUFBLE1BQU07ZUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUU7T0FBQSxDQUFDLEVBQ3ZFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7O0FBRW5CLFVBQUksYUFBYSxFQUFFOzs7O0FBSWpCLFlBQU0sUUFBTSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07aUJBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtTQUFBLENBQUMsQ0FBQTtBQUNuRSxZQUFJLFFBQU0sRUFBRSxPQUFPLFFBQU0sQ0FBQTtPQUMxQjs7QUFFRCxVQUFJLHNCQUFzQixFQUFFO0FBQzFCLFlBQU0sUUFBTSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07aUJBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO1NBQUEsQ0FBQyxDQUFBO0FBQzVFLFlBQUksUUFBTSxFQUFFLE9BQU8sUUFBTSxDQUFBO09BQzFCOztBQUVELGFBQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDM0I7OztTQS9Ga0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3BlbmVyUmVnaXN0cnkgZXh0ZW5kcyBEaXNwb3NhYmxlIHtcbiAgb3BlbmVycyA9IG5ldyBNYXAoKVxuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKCkgPT4gdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCkpXG4gICAgdGhpcy5pbml0aWFsaXplT3BlbmVycygpXG4gIH1cblxuICBpbml0aWFsaXplT3BlbmVycyAoKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gYXRvbS5jb25maWcuZ2V0U2NoZW1hKCdsYXRleC5vcGVuZXInKVxuICAgIGNvbnN0IGRpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdvcGVuZXJzJylcbiAgICBjb25zdCBleHQgPSAnLmpzJ1xuICAgIGZvciAoY29uc3Qgb3BlbmVyTmFtZSBvZiBzY2hlbWEuZW51bSkge1xuICAgICAgaWYgKG9wZW5lck5hbWUgIT09ICdhdXRvbWF0aWMnKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHtvcGVuZXJOYW1lfS1vcGVuZXJgXG4gICAgICAgIGNvbnN0IE9wZW5lckltcGwgPSByZXF1aXJlKHBhdGguZm9ybWF0KHsgZGlyLCBuYW1lLCBleHQgfSkpXG4gICAgICAgIGNvbnN0IG9wZW5lciA9IG5ldyBPcGVuZXJJbXBsKClcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQob3BlbmVyKVxuICAgICAgICB0aGlzLm9wZW5lcnMuc2V0KG9wZW5lck5hbWUsIG9wZW5lcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMgKCkge1xuICAgIGNvbnN0IHBkZk9wZW5lcnMgPSBBcnJheS5mcm9tKHRoaXMuZ2V0Q2FuZGlkYXRlT3BlbmVycygnZm9vLnBkZicpLmtleXMoKSlcbiAgICBpZiAocGRmT3BlbmVycy5sZW5ndGgpIHtcbiAgICAgIGxhdGV4LmxvZy5pbmZvKGBUaGUgZm9sbG93aW5nIFBERiBjYXBhYmxlIG9wZW5lcnMgd2VyZSBmb3VuZDogJHtwZGZPcGVuZXJzLmpvaW4oJywgJyl9LmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdGV4LmxvZy5lcnJvcignTm8gUERGIGNhcGFibGUgb3BlbmVycyB3ZXJlIGZvdW5kLicpXG4gICAgfVxuXG4gICAgY29uc3QgcHNPcGVuZXJzID0gQXJyYXkuZnJvbSh0aGlzLmdldENhbmRpZGF0ZU9wZW5lcnMoJ2Zvby5wcycpLmtleXMoKSlcbiAgICBpZiAocHNPcGVuZXJzLmxlbmd0aCkge1xuICAgICAgbGF0ZXgubG9nLmluZm8oYFRoZSBmb2xsb3dpbmcgUFMgY2FwYWJsZSBvcGVuZXJzIHdlcmUgZm91bmQ6ICR7cHNPcGVuZXJzLmpvaW4oJywgJyl9LmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdObyBQUyBjYXBhYmxlIG9wZW5lcnMgd2VyZSBmb3VuZC4nKVxuICAgIH1cblxuICAgIGNvbnN0IGR2aU9wZW5lcnMgPSBBcnJheS5mcm9tKHRoaXMuZ2V0Q2FuZGlkYXRlT3BlbmVycygnZm9vLmR2aScpLmtleXMoKSlcbiAgICBpZiAoZHZpT3BlbmVycy5sZW5ndGgpIHtcbiAgICAgIGxhdGV4LmxvZy5pbmZvKGBUaGUgZm9sbG93aW5nIERWSSBjYXBhYmxlIG9wZW5lcnMgd2VyZSBmb3VuZDogJHtkdmlPcGVuZXJzLmpvaW4oJywgJyl9LmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdObyBEVkkgY2FwYWJsZSBvcGVuZXJzIHdlcmUgZm91bmQuJylcbiAgICB9XG4gIH1cblxuICBhc3luYyBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgIGNvbnN0IG5hbWUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm9wZW5lcicpXG4gICAgbGV0IG9wZW5lciA9IHRoaXMub3BlbmVycy5nZXQobmFtZSlcblxuICAgIGlmICghb3BlbmVyIHx8ICFvcGVuZXIuY2FuT3BlbihmaWxlUGF0aCkpIHtcbiAgICAgIG9wZW5lciA9IHRoaXMuZmluZE9wZW5lcihmaWxlUGF0aClcbiAgICB9XG5cbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICByZXR1cm4gYXdhaXQgb3BlbmVyLm9wZW4oZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGBObyBvcGVuZXIgZm91bmQgdGhhdCBjYW4gb3BlbiAke2ZpbGVQYXRofS5gKVxuICAgIH1cbiAgfVxuXG4gIGdldENhbmRpZGF0ZU9wZW5lcnMgKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IG5ldyBNYXAoKVxuICAgIGZvciAoY29uc3QgW25hbWUsIG9wZW5lcl0gb2YgdGhpcy5vcGVuZXJzLmVudHJpZXMoKSkge1xuICAgICAgaWYgKG9wZW5lci5jYW5PcGVuKGZpbGVQYXRoKSkgY2FuZGlkYXRlcy5zZXQobmFtZSwgb3BlbmVyKVxuICAgIH1cbiAgICByZXR1cm4gY2FuZGlkYXRlc1xuICB9XG5cbiAgZmluZE9wZW5lciAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBvcGVuUmVzdWx0SW5CYWNrZ3JvdW5kID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0SW5CYWNrZ3JvdW5kJylcbiAgICBjb25zdCBlbmFibGVTeW5jdGV4ID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmFibGVTeW5jdGV4JylcbiAgICBjb25zdCBjYW5kaWRhdGVzID0gQXJyYXkuZnJvbSh0aGlzLmdldENhbmRpZGF0ZU9wZW5lcnMoZmlsZVBhdGgpLnZhbHVlcygpKVxuXG4gICAgaWYgKCFjYW5kaWRhdGVzLmxlbmd0aCkgcmV0dXJuXG5cbiAgICBjb25zdCByYW5rZWRDYW5kaWRhdGVzID0gXy5vcmRlckJ5KGNhbmRpZGF0ZXMsXG4gICAgICBbb3BlbmVyID0+IG9wZW5lci5oYXNTeW5jdGV4KCksIG9wZW5lciA9PiBvcGVuZXIuY2FuT3BlbkluQmFja2dyb3VuZCgpXSxcbiAgICAgIFsnZGVzYycsICdkZXNjJ10pXG5cbiAgICBpZiAoZW5hYmxlU3luY3RleCkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgd2FudHMgb3BlblJlc3VsdEluQmFja2dyb3VuZCBhbHNvIGFuZCB0aGVyZSBpcyBhbiBvcGVuZXJcbiAgICAgIC8vIHRoYXQgc3VwcG9ydHMgdGhhdCBhbmQgU3luY1RlWCBpdCB3aWxsIGJlIHRoZSBmaXJzdCBvbmUgYmVjYXVzZSBvZlxuICAgICAgLy8gdGhlIHByaW9yaXR5IHNvcnQuXG4gICAgICBjb25zdCBvcGVuZXIgPSByYW5rZWRDYW5kaWRhdGVzLmZpbmQob3BlbmVyID0+IG9wZW5lci5oYXNTeW5jdGV4KCkpXG4gICAgICBpZiAob3BlbmVyKSByZXR1cm4gb3BlbmVyXG4gICAgfVxuXG4gICAgaWYgKG9wZW5SZXN1bHRJbkJhY2tncm91bmQpIHtcbiAgICAgIGNvbnN0IG9wZW5lciA9IHJhbmtlZENhbmRpZGF0ZXMuZmluZChvcGVuZXIgPT4gb3BlbmVyLmNhbk9wZW5JbkJhY2tncm91bmQoKSlcbiAgICAgIGlmIChvcGVuZXIpIHJldHVybiBvcGVuZXJcbiAgICB9XG5cbiAgICByZXR1cm4gcmFua2VkQ2FuZGlkYXRlc1swXVxuICB9XG59XG4iXX0=