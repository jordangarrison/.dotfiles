Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var DBUS_NAMES = {
  applicationObject: '/org/gnome/evince/Evince',
  applicationInterface: 'org.gnome.evince.Application',

  daemonService: 'org.gnome.evince.Daemon',
  daemonObject: '/org/gnome/evince/Daemon',
  daemonInterface: 'org.gnome.evince.Daemon',

  windowInterface: 'org.gnome.evince.Window',

  fdApplicationObject: '/org/gtk/Application/anonymous',
  fdApplicationInterface: 'org.freedesktop.Application'
};

function syncSource(uri, point) {
  var filePath = decodeURI(_url2['default'].parse(uri).pathname);
  atom.focus();
  atom.workspace.open(filePath).then(function (editor) {
    return editor.setCursorBufferPosition(point);
  });
}

var EvinceOpener = (function (_Opener) {
  _inherits(EvinceOpener, _Opener);

  function EvinceOpener() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Evince' : arguments[0];
    var dbusNames = arguments.length <= 1 || arguments[1] === undefined ? DBUS_NAMES : arguments[1];

    _classCallCheck(this, EvinceOpener);

    _get(Object.getPrototypeOf(EvinceOpener.prototype), 'constructor', this).call(this, function () {
      for (var filePath of Array.from(_this.windows.keys())) {
        _this.disposeWindow(filePath);
      }
    });
    this.windows = new Map();

    var _this = this;

    this.name = name;
    this.dbusNames = dbusNames;
    this.initialize();
  }

  _createClass(EvinceOpener, [{
    key: 'initialize',
    value: _asyncToGenerator(function* () {
      try {
        if (process.platform === 'linux') {
          var dbus = require('dbus-native');
          this.bus = dbus.sessionBus();
          this.daemon = yield this.getInterface(this.dbusNames.daemonService, this.dbusNames.daemonObject, this.dbusNames.daemonInterface);
        }
      } catch (e) {}
    })
  }, {
    key: 'getWindow',
    value: _asyncToGenerator(function* (filePath, texPath) {
      var _this2 = this;

      if (this.windows.has(filePath)) {
        return this.windows.get(filePath);
      }

      // First find the internal document name
      var documentName = yield this.findDocument(filePath);

      // Get the application interface and get the window list of the application
      var evinceApplication = yield this.getInterface(documentName, this.dbusNames.applicationObject, this.dbusNames.applicationInterface);
      var windowNames = yield this.getWindowList(evinceApplication);

      // Get the window interface of the of the first (only) window
      var onClosed = function onClosed() {
        return _this2.disposeWindow(filePath);
      };
      var windowInstance = {
        evinceWindow: yield this.getInterface(documentName, windowNames[0], this.dbusNames.windowInterface),
        onClosed: onClosed
      };

      if (this.dbusNames.fdApplicationObject) {
        // Get the GTK/FreeDesktop application interface so we can activate the window
        windowInstance.fdApplication = yield this.getInterface(documentName, this.dbusNames.fdApplicationObject, this.dbusNames.fdApplicationInterface);
      }

      windowInstance.evinceWindow.on('SyncSource', syncSource);
      windowInstance.evinceWindow.on('Closed', windowInstance.onClosed);
      this.windows.set(filePath, windowInstance);

      // This seems to help with future syncs
      yield this.syncView(windowInstance.evinceWindow, texPath, [0, 0], 0);

      return windowInstance;
    })
  }, {
    key: 'disposeWindow',
    value: function disposeWindow(filePath) {
      var windowInstance = this.windows.get(filePath);
      if (windowInstance) {
        windowInstance.evinceWindow.removeListener('SyncSource', syncSource);
        windowInstance.evinceWindow.removeListener('Closed', windowInstance.onClosed);
        this.windows['delete'](filePath);
      }
    }
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (filePath, texPath, lineNumber) {
      try {
        var windowInstance = yield this.getWindow(filePath, texPath);
        if (!this.shouldOpenInBackground() && windowInstance.fdApplication) {
          windowInstance.fdApplication.Activate({});
        }

        // SyncView seems to want to activate the window sometimes
        yield this.syncView(windowInstance.evinceWindow, texPath, [lineNumber, 0], 0);

        return true;
      } catch (error) {
        latex.log.error('An error occured while trying to run ' + this.name + ' opener');
        return false;
      }
    })
  }, {
    key: 'canOpen',
    value: function canOpen(filePath) {
      return !!this.daemon;
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
  }, {
    key: 'getInterface',
    value: function getInterface(serviceName, objectPath, interfaceName) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.bus.getInterface(serviceName, objectPath, interfaceName, function (error, interfaceInstance) {
          if (error) {
            reject(error);
          } else {
            resolve(interfaceInstance);
          }
        });
      });
    }
  }, {
    key: 'getWindowList',
    value: function getWindowList(evinceApplication) {
      return new Promise(function (resolve, reject) {
        evinceApplication.GetWindowList(function (error, windowNames) {
          if (error) {
            reject(error);
          } else {
            resolve(windowNames);
          }
        });
      });
    }
  }, {
    key: 'syncView',
    value: function syncView(evinceWindow, source, point, timestamp) {
      return new Promise(function (resolve, reject) {
        evinceWindow.SyncView(source, point, timestamp, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'findDocument',
    value: function findDocument(filePath) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var uri = _url2['default'].format({
          protocol: 'file:',
          slashes: true,
          pathname: encodeURI(filePath)
        });

        _this4.daemon.FindDocument(uri, true, function (error, documentName) {
          if (error) {
            reject(error);
          } else {
            resolve(documentName);
          }
        });
      });
    }
  }]);

  return EvinceOpener;
})(_opener2['default']);

exports['default'] = EvinceOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9ldmluY2Utb3BlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFFbUIsV0FBVzs7OzttQkFDZCxLQUFLOzs7O0FBRXJCLElBQU0sVUFBVSxHQUFHO0FBQ2pCLG1CQUFpQixFQUFFLDBCQUEwQjtBQUM3QyxzQkFBb0IsRUFBRSw4QkFBOEI7O0FBRXBELGVBQWEsRUFBRSx5QkFBeUI7QUFDeEMsY0FBWSxFQUFFLDBCQUEwQjtBQUN4QyxpQkFBZSxFQUFFLHlCQUF5Qjs7QUFFMUMsaUJBQWUsRUFBRSx5QkFBeUI7O0FBRTFDLHFCQUFtQixFQUFFLGdDQUFnQztBQUNyRCx3QkFBc0IsRUFBRSw2QkFBNkI7Q0FDdEQsQ0FBQTs7QUFFRCxTQUFTLFVBQVUsQ0FBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQy9CLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDbkQsTUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ1osTUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtXQUFJLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUM7R0FBQSxDQUFDLENBQUE7Q0FDcEY7O0lBRW9CLFlBQVk7WUFBWixZQUFZOztBQUduQixXQUhPLFlBQVksR0FHdUI7UUFBekMsSUFBSSx5REFBRyxRQUFRO1FBQUUsU0FBUyx5REFBRyxVQUFVOzswQkFIakMsWUFBWTs7QUFJN0IsK0JBSmlCLFlBQVksNkNBSXZCLFlBQU07QUFDVixXQUFLLElBQU0sUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBSyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUN0RCxjQUFLLGFBQWEsQ0FB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LEdBQUcsaUJBQUksTUFBTSxDQUFDO0FBQ3JCLGtCQUFRLEVBQUUsT0FBTztBQUNqQixpQkFBTyxFQUFFLElBQUk7QUFDYixrQkFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUM7U0FDOUIsQ0FBQyxDQUFBOztBQUVGLGVBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLFlBQVksRUFBSztBQUMzRCxjQUFJLEtBQUssRUFBRTtBQUNULGtCQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7V0FDZCxNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtXQUN0QjtTQUNGLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7U0FwSmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9ldmluY2Utb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcbmltcG9ydCB1cmwgZnJvbSAndXJsJ1xuXG5jb25zdCBEQlVTX05BTUVTID0ge1xuICBhcHBsaWNhdGlvbk9iamVjdDogJy9vcmcvZ25vbWUvZXZpbmNlL0V2aW5jZScsXG4gIGFwcGxpY2F0aW9uSW50ZXJmYWNlOiAnb3JnLmdub21lLmV2aW5jZS5BcHBsaWNhdGlvbicsXG5cbiAgZGFlbW9uU2VydmljZTogJ29yZy5nbm9tZS5ldmluY2UuRGFlbW9uJyxcbiAgZGFlbW9uT2JqZWN0OiAnL29yZy9nbm9tZS9ldmluY2UvRGFlbW9uJyxcbiAgZGFlbW9uSW50ZXJmYWNlOiAnb3JnLmdub21lLmV2aW5jZS5EYWVtb24nLFxuXG4gIHdpbmRvd0ludGVyZmFjZTogJ29yZy5nbm9tZS5ldmluY2UuV2luZG93JyxcblxuICBmZEFwcGxpY2F0aW9uT2JqZWN0OiAnL29yZy9ndGsvQXBwbGljYXRpb24vYW5vbnltb3VzJyxcbiAgZmRBcHBsaWNhdGlvbkludGVyZmFjZTogJ29yZy5mcmVlZGVza3RvcC5BcHBsaWNhdGlvbidcbn1cblxuZnVuY3Rpb24gc3luY1NvdXJjZSAodXJpLCBwb2ludCkge1xuICBjb25zdCBmaWxlUGF0aCA9IGRlY29kZVVSSSh1cmwucGFyc2UodXJpKS5wYXRobmFtZSlcbiAgYXRvbS5mb2N1cygpXG4gIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLnRoZW4oZWRpdG9yID0+IGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb2ludCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2aW5jZU9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIHdpbmRvd3MgPSBuZXcgTWFwKClcblxuICBjb25zdHJ1Y3RvciAobmFtZSA9ICdFdmluY2UnLCBkYnVzTmFtZXMgPSBEQlVTX05BTUVTKSB7XG4gICAgc3VwZXIoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBBcnJheS5mcm9tKHRoaXMud2luZG93cy5rZXlzKCkpKSB7XG4gICAgICAgIHRoaXMuZGlzcG9zZVdpbmRvdyhmaWxlUGF0aClcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmRidXNOYW1lcyA9IGRidXNOYW1lc1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpXG4gIH1cblxuICBhc3luYyBpbml0aWFsaXplICgpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdsaW51eCcpIHtcbiAgICAgICAgY29uc3QgZGJ1cyA9IHJlcXVpcmUoJ2RidXMtbmF0aXZlJylcbiAgICAgICAgdGhpcy5idXMgPSBkYnVzLnNlc3Npb25CdXMoKVxuICAgICAgICB0aGlzLmRhZW1vbiA9IGF3YWl0IHRoaXMuZ2V0SW50ZXJmYWNlKHRoaXMuZGJ1c05hbWVzLmRhZW1vblNlcnZpY2UsIHRoaXMuZGJ1c05hbWVzLmRhZW1vbk9iamVjdCwgdGhpcy5kYnVzTmFtZXMuZGFlbW9uSW50ZXJmYWNlKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cblxuICBhc3luYyBnZXRXaW5kb3cgKGZpbGVQYXRoLCB0ZXhQYXRoKSB7XG4gICAgaWYgKHRoaXMud2luZG93cy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gdGhpcy53aW5kb3dzLmdldChmaWxlUGF0aClcbiAgICB9XG5cbiAgICAvLyBGaXJzdCBmaW5kIHRoZSBpbnRlcm5hbCBkb2N1bWVudCBuYW1lXG4gICAgY29uc3QgZG9jdW1lbnROYW1lID0gYXdhaXQgdGhpcy5maW5kRG9jdW1lbnQoZmlsZVBhdGgpXG5cbiAgICAvLyBHZXQgdGhlIGFwcGxpY2F0aW9uIGludGVyZmFjZSBhbmQgZ2V0IHRoZSB3aW5kb3cgbGlzdCBvZiB0aGUgYXBwbGljYXRpb25cbiAgICBjb25zdCBldmluY2VBcHBsaWNhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0SW50ZXJmYWNlKGRvY3VtZW50TmFtZSwgdGhpcy5kYnVzTmFtZXMuYXBwbGljYXRpb25PYmplY3QsIHRoaXMuZGJ1c05hbWVzLmFwcGxpY2F0aW9uSW50ZXJmYWNlKVxuICAgIGNvbnN0IHdpbmRvd05hbWVzID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dMaXN0KGV2aW5jZUFwcGxpY2F0aW9uKVxuXG4gICAgLy8gR2V0IHRoZSB3aW5kb3cgaW50ZXJmYWNlIG9mIHRoZSBvZiB0aGUgZmlyc3QgKG9ubHkpIHdpbmRvd1xuICAgIGNvbnN0IG9uQ2xvc2VkID0gKCkgPT4gdGhpcy5kaXNwb3NlV2luZG93KGZpbGVQYXRoKVxuICAgIGNvbnN0IHdpbmRvd0luc3RhbmNlID0ge1xuICAgICAgZXZpbmNlV2luZG93OiBhd2FpdCB0aGlzLmdldEludGVyZmFjZShkb2N1bWVudE5hbWUsIHdpbmRvd05hbWVzWzBdLCB0aGlzLmRidXNOYW1lcy53aW5kb3dJbnRlcmZhY2UpLFxuICAgICAgb25DbG9zZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYnVzTmFtZXMuZmRBcHBsaWNhdGlvbk9iamVjdCkge1xuICAgICAgLy8gR2V0IHRoZSBHVEsvRnJlZURlc2t0b3AgYXBwbGljYXRpb24gaW50ZXJmYWNlIHNvIHdlIGNhbiBhY3RpdmF0ZSB0aGUgd2luZG93XG4gICAgICB3aW5kb3dJbnN0YW5jZS5mZEFwcGxpY2F0aW9uID0gYXdhaXQgdGhpcy5nZXRJbnRlcmZhY2UoZG9jdW1lbnROYW1lLCB0aGlzLmRidXNOYW1lcy5mZEFwcGxpY2F0aW9uT2JqZWN0LCB0aGlzLmRidXNOYW1lcy5mZEFwcGxpY2F0aW9uSW50ZXJmYWNlKVxuICAgIH1cblxuICAgIHdpbmRvd0luc3RhbmNlLmV2aW5jZVdpbmRvdy5vbignU3luY1NvdXJjZScsIHN5bmNTb3VyY2UpXG4gICAgd2luZG93SW5zdGFuY2UuZXZpbmNlV2luZG93Lm9uKCdDbG9zZWQnLCB3aW5kb3dJbnN0YW5jZS5vbkNsb3NlZClcbiAgICB0aGlzLndpbmRvd3Muc2V0KGZpbGVQYXRoLCB3aW5kb3dJbnN0YW5jZSlcblxuICAgIC8vIFRoaXMgc2VlbXMgdG8gaGVscCB3aXRoIGZ1dHVyZSBzeW5jc1xuICAgIGF3YWl0IHRoaXMuc3luY1ZpZXcod2luZG93SW5zdGFuY2UuZXZpbmNlV2luZG93LCB0ZXhQYXRoLCBbMCwgMF0sIDApXG5cbiAgICByZXR1cm4gd2luZG93SW5zdGFuY2VcbiAgfVxuXG4gIGRpc3Bvc2VXaW5kb3cgKGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgd2luZG93SW5zdGFuY2UgPSB0aGlzLndpbmRvd3MuZ2V0KGZpbGVQYXRoKVxuICAgIGlmICh3aW5kb3dJbnN0YW5jZSkge1xuICAgICAgd2luZG93SW5zdGFuY2UuZXZpbmNlV2luZG93LnJlbW92ZUxpc3RlbmVyKCdTeW5jU291cmNlJywgc3luY1NvdXJjZSlcbiAgICAgIHdpbmRvd0luc3RhbmNlLmV2aW5jZVdpbmRvdy5yZW1vdmVMaXN0ZW5lcignQ2xvc2VkJywgd2luZG93SW5zdGFuY2Uub25DbG9zZWQpXG4gICAgICB0aGlzLndpbmRvd3MuZGVsZXRlKGZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHdpbmRvd0luc3RhbmNlID0gYXdhaXQgdGhpcy5nZXRXaW5kb3coZmlsZVBhdGgsIHRleFBhdGgpXG4gICAgICBpZiAoIXRoaXMuc2hvdWxkT3BlbkluQmFja2dyb3VuZCgpICYmIHdpbmRvd0luc3RhbmNlLmZkQXBwbGljYXRpb24pIHtcbiAgICAgICAgd2luZG93SW5zdGFuY2UuZmRBcHBsaWNhdGlvbi5BY3RpdmF0ZSh7fSlcbiAgICAgIH1cblxuICAgICAgLy8gU3luY1ZpZXcgc2VlbXMgdG8gd2FudCB0byBhY3RpdmF0ZSB0aGUgd2luZG93IHNvbWV0aW1lc1xuICAgICAgYXdhaXQgdGhpcy5zeW5jVmlldyh3aW5kb3dJbnN0YW5jZS5ldmluY2VXaW5kb3csIHRleFBhdGgsIFtsaW5lTnVtYmVyLCAwXSwgMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbGF0ZXgubG9nLmVycm9yKGBBbiBlcnJvciBvY2N1cmVkIHdoaWxlIHRyeWluZyB0byBydW4gJHt0aGlzLm5hbWV9IG9wZW5lcmApXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBjYW5PcGVuIChmaWxlUGF0aCkge1xuICAgIHJldHVybiAhIXRoaXMuZGFlbW9uXG4gIH1cblxuICBoYXNTeW5jdGV4ICgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2FuT3BlbkluQmFja2dyb3VuZCAoKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGdldEludGVyZmFjZSAoc2VydmljZU5hbWUsIG9iamVjdFBhdGgsIGludGVyZmFjZU5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5idXMuZ2V0SW50ZXJmYWNlKHNlcnZpY2VOYW1lLCBvYmplY3RQYXRoLCBpbnRlcmZhY2VOYW1lLCAoZXJyb3IsIGludGVyZmFjZUluc3RhbmNlKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGludGVyZmFjZUluc3RhbmNlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBnZXRXaW5kb3dMaXN0IChldmluY2VBcHBsaWNhdGlvbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBldmluY2VBcHBsaWNhdGlvbi5HZXRXaW5kb3dMaXN0KChlcnJvciwgd2luZG93TmFtZXMpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUod2luZG93TmFtZXMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHN5bmNWaWV3IChldmluY2VXaW5kb3csIHNvdXJjZSwgcG9pbnQsIHRpbWVzdGFtcCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBldmluY2VXaW5kb3cuU3luY1ZpZXcoc291cmNlLCBwb2ludCwgdGltZXN0YW1wLCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBmaW5kRG9jdW1lbnQgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHVyaSA9IHVybC5mb3JtYXQoe1xuICAgICAgICBwcm90b2NvbDogJ2ZpbGU6JyxcbiAgICAgICAgc2xhc2hlczogdHJ1ZSxcbiAgICAgICAgcGF0aG5hbWU6IGVuY29kZVVSSShmaWxlUGF0aClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZGFlbW9uLkZpbmREb2N1bWVudCh1cmksIHRydWUsIChlcnJvciwgZG9jdW1lbnROYW1lKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGRvY3VtZW50TmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG4iXX0=