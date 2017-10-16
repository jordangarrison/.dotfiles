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
        return opener.open(filePath, texPath, lineNumber);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVyLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7b0JBQ0wsTUFBTTs7OztvQkFDeUIsTUFBTTs7SUFFakMsY0FBYztZQUFkLGNBQWM7O0FBSXJCLFdBSk8sY0FBYyxHQUlsQjswQkFKSSxjQUFjOztBQUsvQiwrQkFMaUIsY0FBYyw2Q0FLekI7YUFBTSxNQUFLLFdBQVcsQ0FBQyxPQUFPLEVBQUU7S0FBQSxFQUFDO1NBSnpDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRTtTQUNuQixXQUFXLEdBQUcsK0JBQXlCOzs7O0FBSXJDLFFBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0dBQ3pCOztlQVBrQixjQUFjOztXQVNmLDZCQUFHO0FBQ25CLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3BELFVBQU0sR0FBRyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDM0MsVUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFBO0FBQ2pCLFdBQUssSUFBTSxVQUFVLElBQUksTUFBTSxRQUFLLEVBQUU7QUFDcEMsWUFBSSxVQUFVLEtBQUssV0FBVyxFQUFFO0FBQzlCLGNBQU0sS0FBSSxHQUFNLFVBQVUsWUFBUyxDQUFBO0FBQ25DLGNBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBSyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLElBQUksRUFBSixLQUFJLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzRCxjQUFNLE9BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFBO0FBQy9CLGNBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU0sQ0FBQyxDQUFBO0FB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QTtBQUM1RCxVQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBOztBQUUxRSxVQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFNOztBQUU5QixVQUFNLGdCQUFnQixHQUFHLG9CQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQzNDLENBQUMsVUFBQSxNQUFNO2VBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtPQUFBLEVBQUUsVUFBQSxNQUFNO2VBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO09BQUEsQ0FBQyxFQUN2RSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBOztBQUVuQixVQUFJLGFBQWEsRUFBRTs7OztBQUlqQixZQUFNLFFBQU0sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2lCQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7U0FBQSxDQUFDLENBQUE7QUFDbkUsWUFBSSxRQUFNLEVBQUUsT0FBTyxRQUFNLENBQUE7T0FDMUI7O0FBRUQsVUFBSSxzQkFBc0IsRUFBRTtBQUMxQixZQUFNLFFBQU0sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2lCQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtTQUFBLENBQUMsQ0FBQTtBQUM1RSxZQUFJLFFBQU0sRUFBRSxPQUFPLFFBQU0sQ0FBQTtPQUMxQjs7QUFFRCxhQUFPLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzNCOzs7U0EvRmtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVyLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZW5lclJlZ2lzdHJ5IGV4dGVuZHMgRGlzcG9zYWJsZSB7XG4gIG9wZW5lcnMgPSBuZXcgTWFwKClcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCgpID0+IHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpKVxuICAgIHRoaXMuaW5pdGlhbGl6ZU9wZW5lcnMoKVxuICB9XG5cbiAgaW5pdGlhbGl6ZU9wZW5lcnMgKCkge1xuICAgIGNvbnN0IHNjaGVtYSA9IGF0b20uY29uZmlnLmdldFNjaGVtYSgnbGF0ZXgub3BlbmVyJylcbiAgICBjb25zdCBkaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnb3BlbmVycycpXG4gICAgY29uc3QgZXh0ID0gJy5qcydcbiAgICBmb3IgKGNvbnN0IG9wZW5lck5hbWUgb2Ygc2NoZW1hLmVudW0pIHtcbiAgICAgIGlmIChvcGVuZXJOYW1lICE9PSAnYXV0b21hdGljJykge1xuICAgICAgICBjb25zdCBuYW1lID0gYCR7b3BlbmVyTmFtZX0tb3BlbmVyYFxuICAgICAgICBjb25zdCBPcGVuZXJJbXBsID0gcmVxdWlyZShwYXRoLmZvcm1hdCh7IGRpciwgbmFtZSwgZXh0IH0pKVxuICAgICAgICBjb25zdCBvcGVuZXIgPSBuZXcgT3BlbmVySW1wbCgpXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG9wZW5lcilcbiAgICAgICAgdGhpcy5vcGVuZXJzLnNldChvcGVuZXJOYW1lLCBvcGVuZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzICgpIHtcbiAgICBjb25zdCBwZGZPcGVuZXJzID0gQXJyYXkuZnJvbSh0aGlzLmdldENhbmRpZGF0ZU9wZW5lcnMoJ2Zvby5wZGYnKS5rZXlzKCkpXG4gICAgaWYgKHBkZk9wZW5lcnMubGVuZ3RoKSB7XG4gICAgICBsYXRleC5sb2cuaW5mbyhgVGhlIGZvbGxvd2luZyBQREYgY2FwYWJsZSBvcGVuZXJzIHdlcmUgZm91bmQ6ICR7cGRmT3BlbmVycy5qb2luKCcsICcpfS5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBsYXRleC5sb2cuZXJyb3IoJ05vIFBERiBjYXBhYmxlIG9wZW5lcnMgd2VyZSBmb3VuZC4nKVxuICAgIH1cblxuICAgIGNvbnN0IHBzT3BlbmVycyA9IEFycmF5LmZyb20odGhpcy5nZXRDYW5kaWRhdGVPcGVuZXJzKCdmb28ucHMnKS5rZXlzKCkpXG4gICAgaWYgKHBzT3BlbmVycy5sZW5ndGgpIHtcbiAgICAgIGxhdGV4LmxvZy5pbmZvKGBUaGUgZm9sbG93aW5nIFBTIGNhcGFibGUgb3BlbmVycyB3ZXJlIGZvdW5kOiAke3BzT3BlbmVycy5qb2luKCcsICcpfS5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnTm8gUFMgY2FwYWJsZSBvcGVuZXJzIHdlcmUgZm91bmQuJylcbiAgICB9XG5cbiAgICBjb25zdCBkdmlPcGVuZXJzID0gQXJyYXkuZnJvbSh0aGlzLmdldENhbmRpZGF0ZU9wZW5lcnMoJ2Zvby5kdmknKS5rZXlzKCkpXG4gICAgaWYgKGR2aU9wZW5lcnMubGVuZ3RoKSB7XG4gICAgICBsYXRleC5sb2cuaW5mbyhgVGhlIGZvbGxvd2luZyBEVkkgY2FwYWJsZSBvcGVuZXJzIHdlcmUgZm91bmQ6ICR7ZHZpT3BlbmVycy5qb2luKCcsICcpfS5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnTm8gRFZJIGNhcGFibGUgb3BlbmVycyB3ZXJlIGZvdW5kLicpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIpIHtcbiAgICBjb25zdCBuYW1lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuZXInKVxuICAgIGxldCBvcGVuZXIgPSB0aGlzLm9wZW5lcnMuZ2V0KG5hbWUpXG5cbiAgICBpZiAoIW9wZW5lciB8fCAhb3BlbmVyLmNhbk9wZW4oZmlsZVBhdGgpKSB7XG4gICAgICBvcGVuZXIgPSB0aGlzLmZpbmRPcGVuZXIoZmlsZVBhdGgpXG4gICAgfVxuXG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgcmV0dXJuIG9wZW5lci5vcGVuKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgTm8gb3BlbmVyIGZvdW5kIHRoYXQgY2FuIG9wZW4gJHtmaWxlUGF0aH0uYClcbiAgICB9XG4gIH1cblxuICBnZXRDYW5kaWRhdGVPcGVuZXJzIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBuZXcgTWFwKClcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBvcGVuZXJdIG9mIHRoaXMub3BlbmVycy5lbnRyaWVzKCkpIHtcbiAgICAgIGlmIChvcGVuZXIuY2FuT3BlbihmaWxlUGF0aCkpIGNhbmRpZGF0ZXMuc2V0KG5hbWUsIG9wZW5lcilcbiAgICB9XG4gICAgcmV0dXJuIGNhbmRpZGF0ZXNcbiAgfVxuXG4gIGZpbmRPcGVuZXIgKGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3BlblJlc3VsdEluQmFja2dyb3VuZCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3BlblJlc3VsdEluQmFja2dyb3VuZCcpXG4gICAgY29uc3QgZW5hYmxlU3luY3RleCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU3luY3RleCcpXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IEFycmF5LmZyb20odGhpcy5nZXRDYW5kaWRhdGVPcGVuZXJzKGZpbGVQYXRoKS52YWx1ZXMoKSlcblxuICAgIGlmICghY2FuZGlkYXRlcy5sZW5ndGgpIHJldHVyblxuXG4gICAgY29uc3QgcmFua2VkQ2FuZGlkYXRlcyA9IF8ub3JkZXJCeShjYW5kaWRhdGVzLFxuICAgICAgW29wZW5lciA9PiBvcGVuZXIuaGFzU3luY3RleCgpLCBvcGVuZXIgPT4gb3BlbmVyLmNhbk9wZW5JbkJhY2tncm91bmQoKV0sXG4gICAgICBbJ2Rlc2MnLCAnZGVzYyddKVxuXG4gICAgaWYgKGVuYWJsZVN5bmN0ZXgpIHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHdhbnRzIG9wZW5SZXN1bHRJbkJhY2tncm91bmQgYWxzbyBhbmQgdGhlcmUgaXMgYW4gb3BlbmVyXG4gICAgICAvLyB0aGF0IHN1cHBvcnRzIHRoYXQgYW5kIFN5bmNUZVggaXQgd2lsbCBiZSB0aGUgZmlyc3Qgb25lIGJlY2F1c2Ugb2ZcbiAgICAgIC8vIHRoZSBwcmlvcml0eSBzb3J0LlxuICAgICAgY29uc3Qgb3BlbmVyID0gcmFua2VkQ2FuZGlkYXRlcy5maW5kKG9wZW5lciA9PiBvcGVuZXIuaGFzU3luY3RleCgpKVxuICAgICAgaWYgKG9wZW5lcikgcmV0dXJuIG9wZW5lclxuICAgIH1cblxuICAgIGlmIChvcGVuUmVzdWx0SW5CYWNrZ3JvdW5kKSB7XG4gICAgICBjb25zdCBvcGVuZXIgPSByYW5rZWRDYW5kaWRhdGVzLmZpbmQob3BlbmVyID0+IG9wZW5lci5jYW5PcGVuSW5CYWNrZ3JvdW5kKCkpXG4gICAgICBpZiAob3BlbmVyKSByZXR1cm4gb3BlbmVyXG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmtlZENhbmRpZGF0ZXNbMF1cbiAgfVxufVxuIl19