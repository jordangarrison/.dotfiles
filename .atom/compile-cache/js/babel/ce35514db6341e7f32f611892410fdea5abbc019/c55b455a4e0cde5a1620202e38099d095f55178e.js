'use babel';

var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _get = function get(_x6, _x7, _x8) {
  var _again = true;_function: while (_again) {
    var object = _x6,
        property = _x7,
        receiver = _x8;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x6 = parent;_x7 = property;_x8 = receiver;_again = true;desc = parent = undefined;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      var callNext = step.bind(null, 'next');var callThrow = step.bind(null, 'throw');function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(callNext, callThrow);
        }
      }callNext();
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var _ = require('underscore-plus');
var url = require('url');
var path = require('path');

var _require = require('event-kit');

var Emitter = _require.Emitter;
var Disposable = _require.Disposable;
var CompositeDisposable = _require.CompositeDisposable;

var fs = require('fs-plus');

var _require2 = require('pathwatcher');

var Directory = _require2.Directory;

var Grim = require('grim');
var DefaultDirectorySearcher = require('./default-directory-searcher');
var Dock = require('./dock');
var Model = require('./model');
var StateStore = require('./state-store');
var TextEditor = require('./text-editor');
var Panel = require('./panel');
var PanelContainer = require('./panel-container');
var Task = require('./task');
var WorkspaceCenter = require('./workspace-center');
var WorkspaceElement = require('./workspace-element');

var STOPPED_CHANGING_ACTIVE_PANE_ITEM_DELAY = 100;
var ALL_LOCATIONS = ['center', 'left', 'right', 'bottom'];

// Essential: Represents the state of the user interface for the entire window.
// An instance of this class is available via the `atom.workspace` global.
//
// Interact with this object to open files, be notified of current and future
// editors, and manipulate panes. To add panels, use {Workspace::addTopPanel}
// and friends.
//
// ## Workspace Items
//
// The term "item" refers to anything that can be displayed
// in a pane within the workspace, either in the {WorkspaceCenter} or in one
// of the three {Dock}s. The workspace expects items to conform to the
// following interface:
//
// ### Required Methods
//
// #### `getTitle()`
//
// Returns a {String} containing the title of the item to display on its
// associated tab.
//
// ### Optional Methods
//
// #### `getElement()`
//
// If your item already *is* a DOM element, you do not need to implement this
// method. Otherwise it should return the element you want to display to
// represent this item.
//
// #### `destroy()`
//
// Destroys the item. This will be called when the item is removed from its
// parent pane.
//
// #### `onDidDestroy(callback)`
//
// Called by the workspace so it can be notified when the item is destroyed.
// Must return a {Disposable}.
//
// #### `serialize()`
//
// Serialize the state of the item. Must return an object that can be passed to
// `JSON.stringify`. The state should include a field called `deserializer`,
// which names a deserializer declared in your `package.json`. This method is
// invoked on items when serializing the workspace so they can be restored to
// the same location later.
//
// #### `getURI()`
//
// Returns the URI associated with the item.
//
// #### `getLongTitle()`
//
// Returns a {String} containing a longer version of the title to display in
// places like the window title or on tabs their short titles are ambiguous.
//
// #### `onDidChangeTitle`
//
// Called by the workspace so it can be notified when the item's title changes.
// Must return a {Disposable}.
//
// #### `getIconName()`
//
// Return a {String} with the name of an icon. If this method is defined and
// returns a string, the item's tab element will be rendered with the `icon` and
// `icon-${iconName}` CSS classes.
//
// ### `onDidChangeIcon(callback)`
//
// Called by the workspace so it can be notified when the item's icon changes.
// Must return a {Disposable}.
//
// #### `getDefaultLocation()`
//
// Tells the workspace where your item should be opened in absence of a user
// override. Items can appear in the center or in a dock on the left, right, or
// bottom of the workspace.
//
// Returns a {String} with one of the following values: `'center'`, `'left'`,
// `'right'`, `'bottom'`. If this method is not defined, `'center'` is the
// default.
//
// #### `getAllowedLocations()`
//
// Tells the workspace where this item can be moved. Returns an {Array} of one
// or more of the following values: `'center'`, `'left'`, `'right'`, or
// `'bottom'`.
//
// #### `isPermanentDockItem()`
//
// Tells the workspace whether or not this item can be closed by the user by
// clicking an `x` on its tab. Use of this feature is discouraged unless there's
// a very good reason not to allow users to close your item. Items can be made
// permanent *only* when they are contained in docks. Center pane items can
// always be removed. Note that it is currently still possible to close dock
// items via the `Close Pane` option in the context menu and via Atom APIs, so
// you should still be prepared to handle your dock items being destroyed by the
// user even if you implement this method.
//
// #### `save()`
//
// Saves the item.
//
// #### `saveAs(path)`
//
// Saves the item to the specified path.
//
// #### `getPath()`
//
// Returns the local path associated with this item. This is only used to set
// the initial location of the "save as" dialog.
//
// #### `isModified()`
//
// Returns whether or not the item is modified to reflect modification in the
// UI.
//
// #### `onDidChangeModified()`
//
// Called by the workspace so it can be notified when item's modified status
// changes. Must return a {Disposable}.
//
// #### `copy()`
//
// Create a copy of the item. If defined, the workspace will call this method to
// duplicate the item when splitting panes via certain split commands.
//
// #### `getPreferredHeight()`
//
// If this item is displayed in the bottom {Dock}, called by the workspace when
// initially displaying the dock to set its height. Once the dock has been
// resized by the user, their height will override this value.
//
// Returns a {Number}.
//
// #### `getPreferredWidth()`
//
// If this item is displayed in the left or right {Dock}, called by the
// workspace when initially displaying the dock to set its width. Once the dock
// has been resized by the user, their width will override this value.
//
// Returns a {Number}.
//
// #### `onDidTerminatePendingState(callback)`
//
// If the workspace is configured to use *pending pane items*, the workspace
// will subscribe to this method to terminate the pending state of the item.
// Must return a {Disposable}.
//
// #### `shouldPromptToSave()`
//
// This method indicates whether Atom should prompt the user to save this item
// when the user closes or reloads the window. Returns a boolean.
module.exports = (function (_Model) {
  _inherits(Workspace, _Model);

  function Workspace(params) {
    _classCallCheck(this, Workspace);

    _get(Object.getPrototypeOf(Workspace.prototype), 'constructor', this).apply(this, arguments);

    this.updateWindowTitle = this.updateWindowTitle.bind(this);
    this.updateDocumentEdited = this.updateDocumentEdited.bind(this);
    this.didDestroyPaneItem = this.didDestroyPaneItem.bind(this);
    this.didChangeActivePaneOnPaneContainer = this.didChangeActivePaneOnPaneContainer.bind(this);
    this.didChangeActivePaneItemOnPaneContainer = this.didChangeActivePaneItemOnPaneContainer.bind(this);
    this.didActivatePaneContainer = this.didActivatePaneContainer.bind(this);
    this.didHideDock = this.didHideDock.bind(this);

    this.enablePersistence = params.enablePersistence;
    this.packageManager = params.packageManager;
    this.config = params.config;
    this.project = params.project;
    this.notificationManager = params.notificationManager;
    this.viewRegistry = params.viewRegistry;
    this.grammarRegistry = params.grammarRegistry;
    this.applicationDelegate = params.applicationDelegate;
    this.assert = params.assert;
    this.deserializerManager = params.deserializerManager;
    this.textEditorRegistry = params.textEditorRegistry;
    this.styleManager = params.styleManager;
    this.draggingItem = false;
    this.itemLocationStore = new StateStore('AtomPreviousItemLocations', 1);

    this.emitter = new Emitter();
    this.openers = [];
    this.destroyedItemURIs = [];
    this.stoppedChangingActivePaneItemTimeout = null;

    this.defaultDirectorySearcher = new DefaultDirectorySearcher();
    this.consumeServices(this.packageManager);

    this.paneContainers = {
      center: this.createCenter(),
      left: this.createDock('left'),
      right: this.createDock('right'),
      bottom: this.createDock('bottom')
    };
    this.activePaneContainer = this.paneContainers.center;

    this.panelContainers = {
      top: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'top' }),
      left: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'left', dock: this.paneContainers.left }),
      right: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'right', dock: this.paneContainers.right }),
      bottom: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'bottom', dock: this.paneContainers.bottom }),
      header: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'header' }),
      footer: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'footer' }),
      modal: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'modal' })
    };

    this.subscribeToEvents();
  }

  _createClass(Workspace, [{
    key: 'getElement',
    value: function getElement() {
      if (!this.element) {
        this.element = new WorkspaceElement().initialize(this, {
          config: this.config,
          project: this.project,
          viewRegistry: this.viewRegistry,
          styleManager: this.styleManager
        });
      }
      return this.element;
    }
  }, {
    key: 'createCenter',
    value: function createCenter() {
      return new WorkspaceCenter({
        config: this.config,
        applicationDelegate: this.applicationDelegate,
        notificationManager: this.notificationManager,
        deserializerManager: this.deserializerManager,
        viewRegistry: this.viewRegistry,
        didActivate: this.didActivatePaneContainer,
        didChangeActivePane: this.didChangeActivePaneOnPaneContainer,
        didChangeActivePaneItem: this.didChangeActivePaneItemOnPaneContainer,
        didDestroyPaneItem: this.didDestroyPaneItem
      });
    }
  }, {
    key: 'createDock',
    value: function createDock(location) {
      return new Dock({
        location: location,
        config: this.config,
        applicationDelegate: this.applicationDelegate,
        deserializerManager: this.deserializerManager,
        notificationManager: this.notificationManager,
        viewRegistry: this.viewRegistry,
        didHide: this.didHideDock,
        didActivate: this.didActivatePaneContainer,
        didChangeActivePane: this.didChangeActivePaneOnPaneContainer,
        didChangeActivePaneItem: this.didChangeActivePaneItemOnPaneContainer,
        didDestroyPaneItem: this.didDestroyPaneItem
      });
    }
  }, {
    key: 'reset',
    value: function reset(packageManager) {
      this.packageManager = packageManager;
      this.emitter.dispose();
      this.emitter = new Emitter();

      this.paneContainers.center.destroy();
      this.paneContainers.left.destroy();
      this.paneContainers.right.destroy();
      this.paneContainers.bottom.destroy();

      _.values(this.panelContainers).forEach(function (panelContainer) {
        panelContainer.destroy();
      });

      this.paneContainers = {
        center: this.createCenter(),
        left: this.createDock('left'),
        right: this.createDock('right'),
        bottom: this.createDock('bottom')
      };
      this.activePaneContainer = this.paneContainers.center;

      this.panelContainers = {
        top: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'top' }),
        left: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'left', dock: this.paneContainers.left }),
        right: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'right', dock: this.paneContainers.right }),
        bottom: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'bottom', dock: this.paneContainers.bottom }),
        header: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'header' }),
        footer: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'footer' }),
        modal: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'modal' })
      };

      this.originalFontSize = null;
      this.openers = [];
      this.destroyedItemURIs = [];
      this.element = null;
      this.consumeServices(this.packageManager);
    }
  }, {
    key: 'subscribeToEvents',
    value: function subscribeToEvents() {
      this.project.onDidChangePaths(this.updateWindowTitle);
      this.subscribeToFontSize();
      this.subscribeToAddedItems();
      this.subscribeToMovedItems();
    }
  }, {
    key: 'consumeServices',
    value: function consumeServices(_ref) {
      var _this = this;

      var serviceHub = _ref.serviceHub;

      this.directorySearchers = [];
      serviceHub.consume('atom.directory-searcher', '^0.1.0', function (provider) {
        return _this.directorySearchers.unshift(provider);
      });
    }

    // Called by the Serializable mixin during serialization.
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'Workspace',
        packagesWithActiveGrammars: this.getPackageNamesWithActiveGrammars(),
        destroyedItemURIs: this.destroyedItemURIs.slice(),
        // Ensure deserializing 1.17 state with pre 1.17 Atom does not error
        // TODO: Remove after 1.17 has been on stable for a while
        paneContainer: { version: 2 },
        paneContainers: {
          center: this.paneContainers.center.serialize(),
          left: this.paneContainers.left.serialize(),
          right: this.paneContainers.right.serialize(),
          bottom: this.paneContainers.bottom.serialize()
        }
      };
    }
  }, {
    key: 'deserialize',
    value: function deserialize(state, deserializerManager) {
      var packagesWithActiveGrammars = state.packagesWithActiveGrammars != null ? state.packagesWithActiveGrammars : [];
      for (var packageName of packagesWithActiveGrammars) {
        var pkg = this.packageManager.getLoadedPackage(packageName);
        if (pkg != null) {
          pkg.loadGrammarsSync();
        }
      }
      if (state.destroyedItemURIs != null) {
        this.destroyedItemURIs = state.destroyedItemURIs;
      }

      if (state.paneContainers) {
        this.paneContainers.center.deserialize(state.paneContainers.center, deserializerManager);
        this.paneContainers.left.deserialize(state.paneContainers.left, deserializerManager);
        this.paneContainers.right.deserialize(state.paneContainers.right, deserializerManager);
        this.paneContainers.bottom.deserialize(state.paneContainers.bottom, deserializerManager);
      } else if (state.paneContainer) {
        // TODO: Remove this fallback once a lot of time has passed since 1.17 was released
        this.paneContainers.center.deserialize(state.paneContainer, deserializerManager);
      }

      this.updateWindowTitle();
    }
  }, {
    key: 'getPackageNamesWithActiveGrammars',
    value: function getPackageNamesWithActiveGrammars() {
      var _this2 = this;

      var packageNames = [];
      var addGrammar = function addGrammar() {
        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var includedGrammarScopes = _ref2.includedGrammarScopes;
        var packageName = _ref2.packageName;

        if (!packageName) {
          return;
        }
        // Prevent cycles
        if (packageNames.indexOf(packageName) !== -1) {
          return;
        }

        packageNames.push(packageName);
        for (var scopeName of includedGrammarScopes != null ? includedGrammarScopes : []) {
          addGrammar(_this2.grammarRegistry.grammarForScopeName(scopeName));
        }
      };

      var editors = this.getTextEditors();
      for (var editor of editors) {
        addGrammar(editor.getGrammar());
      }

      if (editors.length > 0) {
        for (var grammar of this.grammarRegistry.getGrammars()) {
          if (grammar.injectionSelector) {
            addGrammar(grammar);
          }
        }
      }

      return _.uniq(packageNames);
    }
  }, {
    key: 'didActivatePaneContainer',
    value: function didActivatePaneContainer(paneContainer) {
      if (paneContainer !== this.getActivePaneContainer()) {
        this.activePaneContainer = paneContainer;
        this.didChangeActivePaneItem(this.activePaneContainer.getActivePaneItem());
        this.emitter.emit('did-change-active-pane-container', this.activePaneContainer);
        this.emitter.emit('did-change-active-pane', this.activePaneContainer.getActivePane());
        this.emitter.emit('did-change-active-pane-item', this.activePaneContainer.getActivePaneItem());
      }
    }
  }, {
    key: 'didChangeActivePaneOnPaneContainer',
    value: function didChangeActivePaneOnPaneContainer(paneContainer, pane) {
      if (paneContainer === this.getActivePaneContainer()) {
        this.emitter.emit('did-change-active-pane', pane);
      }
    }
  }, {
    key: 'didChangeActivePaneItemOnPaneContainer',
    value: function didChangeActivePaneItemOnPaneContainer(paneContainer, item) {
      if (paneContainer === this.getActivePaneContainer()) {
        this.didChangeActivePaneItem(item);
        this.emitter.emit('did-change-active-pane-item', item);
      }
    }
  }, {
    key: 'didChangeActivePaneItem',
    value: function didChangeActivePaneItem(item) {
      var _this3 = this;

      this.updateWindowTitle();
      this.updateDocumentEdited();
      if (this.activeItemSubscriptions) this.activeItemSubscriptions.dispose();
      this.activeItemSubscriptions = new CompositeDisposable();

      var modifiedSubscription = undefined,
          titleSubscription = undefined;

      if (item != null && typeof item.onDidChangeTitle === 'function') {
        titleSubscription = item.onDidChangeTitle(this.updateWindowTitle);
      } else if (item != null && typeof item.on === 'function') {
        titleSubscription = item.on('title-changed', this.updateWindowTitle);
        if (titleSubscription == null || typeof titleSubscription.dispose !== 'function') {
          titleSubscription = new Disposable(function () {
            item.off('title-changed', _this3.updateWindowTitle);
          });
        }
      }

      if (item != null && typeof item.onDidChangeModified === 'function') {
        modifiedSubscription = item.onDidChangeModified(this.updateDocumentEdited);
      } else if (item != null && typeof item.on === 'function') {
        modifiedSubscription = item.on('modified-status-changed', this.updateDocumentEdited);
        if (modifiedSubscription == null || typeof modifiedSubscription.dispose !== 'function') {
          modifiedSubscription = new Disposable(function () {
            item.off('modified-status-changed', _this3.updateDocumentEdited);
          });
        }
      }

      if (titleSubscription != null) {
        this.activeItemSubscriptions.add(titleSubscription);
      }
      if (modifiedSubscription != null) {
        this.activeItemSubscriptions.add(modifiedSubscription);
      }

      this.cancelStoppedChangingActivePaneItemTimeout();
      this.stoppedChangingActivePaneItemTimeout = setTimeout(function () {
        _this3.stoppedChangingActivePaneItemTimeout = null;
        _this3.emitter.emit('did-stop-changing-active-pane-item', item);
      }, STOPPED_CHANGING_ACTIVE_PANE_ITEM_DELAY);
    }
  }, {
    key: 'cancelStoppedChangingActivePaneItemTimeout',
    value: function cancelStoppedChangingActivePaneItemTimeout() {
      if (this.stoppedChangingActivePaneItemTimeout != null) {
        clearTimeout(this.stoppedChangingActivePaneItemTimeout);
      }
    }
  }, {
    key: 'didHideDock',
    value: function didHideDock() {
      this.getCenter().activate();
    }
  }, {
    key: 'setDraggingItem',
    value: function setDraggingItem(draggingItem) {
      _.values(this.paneContainers).forEach(function (dock) {
        dock.setDraggingItem(draggingItem);
      });
    }
  }, {
    key: 'subscribeToAddedItems',
    value: function subscribeToAddedItems() {
      var _this4 = this;

      this.onDidAddPaneItem(function (_ref3) {
        var item = _ref3.item;
        var pane = _ref3.pane;
        var index = _ref3.index;

        if (item instanceof TextEditor) {
          (function () {
            var subscriptions = new CompositeDisposable(_this4.textEditorRegistry.add(item), _this4.textEditorRegistry.maintainGrammar(item), _this4.textEditorRegistry.maintainConfig(item), item.observeGrammar(_this4.handleGrammarUsed.bind(_this4)));
            item.onDidDestroy(function () {
              subscriptions.dispose();
            });
            _this4.emitter.emit('did-add-text-editor', { textEditor: item, pane: pane, index: index });
          })();
        }
      });
    }
  }, {
    key: 'subscribeToMovedItems',
    value: function subscribeToMovedItems() {
      var _this5 = this;

      var _loop = function _loop(paneContainer) {
        paneContainer.observePanes(function (pane) {
          pane.onDidAddItem(function (_ref4) {
            var item = _ref4.item;

            if (typeof item.getURI === 'function' && _this5.enablePersistence) {
              var uri = item.getURI();
              if (uri) {
                var _location = paneContainer.getLocation();
                var defaultLocation = undefined;
                if (typeof item.getDefaultLocation === 'function') {
                  defaultLocation = item.getDefaultLocation();
                }
                defaultLocation = defaultLocation || 'center';
                if (_location === defaultLocation) {
                  _this5.itemLocationStore['delete'](item.getURI());
                } else {
                  _this5.itemLocationStore.save(item.getURI(), _location);
                }
              }
            }
          });
        });
      };

      for (var paneContainer of this.getPaneContainers()) {
        _loop(paneContainer);
      }
    }

    // Updates the application's title and proxy icon based on whichever file is
    // open.
  }, {
    key: 'updateWindowTitle',
    value: function updateWindowTitle() {
      var itemPath = undefined,
          itemTitle = undefined,
          projectPath = undefined,
          representedPath = undefined;
      var appName = 'Atom';
      var left = this.project.getPaths();
      var projectPaths = left != null ? left : [];
      var item = this.getActivePaneItem();
      if (item) {
        itemPath = typeof item.getPath === 'function' ? item.getPath() : undefined;
        var longTitle = typeof item.getLongTitle === 'function' ? item.getLongTitle() : undefined;
        itemTitle = longTitle == null ? typeof item.getTitle === 'function' ? item.getTitle() : undefined : longTitle;
        projectPath = _.find(projectPaths, function (projectPath) {
          return itemPath === projectPath || (itemPath != null ? itemPath.startsWith(projectPath + path.sep) : undefined);
        });
      }
      if (itemTitle == null) {
        itemTitle = 'untitled';
      }
      if (projectPath == null) {
        projectPath = itemPath ? path.dirname(itemPath) : projectPaths[0];
      }
      if (projectPath != null) {
        projectPath = fs.tildify(projectPath);
      }

      var titleParts = [];
      if (item != null && projectPath != null) {
        titleParts.push(itemTitle, projectPath);
        representedPath = itemPath != null ? itemPath : projectPath;
      } else if (projectPath != null) {
        titleParts.push(projectPath);
        representedPath = projectPath;
      } else {
        titleParts.push(itemTitle);
        representedPath = '';
      }

      if (process.platform !== 'darwin') {
        titleParts.push(appName);
      }

      document.title = titleParts.join(' — ');
      this.applicationDelegate.setRepresentedFilename(representedPath);
    }

    // On macOS, fades the application window's proxy icon when the current file
    // has been modified.
  }, {
    key: 'updateDocumentEdited',
    value: function updateDocumentEdited() {
      var activePaneItem = this.getActivePaneItem();
      var modified = activePaneItem != null && typeof activePaneItem.isModified === 'function' ? activePaneItem.isModified() || false : false;
      this.applicationDelegate.setWindowDocumentEdited(modified);
    }

    /*
    Section: Event Subscription
    */

  }, {
    key: 'onDidChangeActivePaneContainer',
    value: function onDidChangeActivePaneContainer(callback) {
      return this.emitter.on('did-change-active-pane-container', callback);
    }

    // Essential: Invoke the given callback with all current and future text
    // editors in the workspace.
    //
    // * `callback` {Function} to be called with current and future text editors.
    //   * `editor` An {TextEditor} that is present in {::getTextEditors} at the time
    //     of subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeTextEditors',
    value: function observeTextEditors(callback) {
      for (var textEditor of this.getTextEditors()) {
        callback(textEditor);
      }
      return this.onDidAddTextEditor(function (_ref5) {
        var textEditor = _ref5.textEditor;
        return callback(textEditor);
      });
    }

    // Essential: Invoke the given callback with all current and future panes items
    // in the workspace.
    //
    // * `callback` {Function} to be called with current and future pane items.
    //   * `item` An item that is present in {::getPaneItems} at the time of
    //      subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observePaneItems',
    value: function observePaneItems(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.observePaneItems(callback);
      })))))();
    }

    // Essential: Invoke the given callback when the active pane item changes.
    //
    // Because observers are invoked synchronously, it's important not to perform
    // any expensive operations via this method. Consider
    // {::onDidStopChangingActivePaneItem} to delay operations until after changes
    // stop occurring.
    //
    // * `callback` {Function} to be called when the active pane item changes.
    //   * `item` The active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActivePaneItem',
    value: function onDidChangeActivePaneItem(callback) {
      return this.emitter.on('did-change-active-pane-item', callback);
    }

    // Essential: Invoke the given callback when the active pane item stops
    // changing.
    //
    // Observers are called asynchronously 100ms after the last active pane item
    // change. Handling changes here rather than in the synchronous
    // {::onDidChangeActivePaneItem} prevents unneeded work if the user is quickly
    // changing or closing tabs and ensures critical UI feedback, like changing the
    // highlighted tab, gets priority over work that can be done asynchronously.
    //
    // * `callback` {Function} to be called when the active pane item stopts
    //   changing.
    //   * `item` The active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidStopChangingActivePaneItem',
    value: function onDidStopChangingActivePaneItem(callback) {
      return this.emitter.on('did-stop-changing-active-pane-item', callback);
    }

    // Essential: Invoke the given callback with the current active pane item and
    // with all future active pane items in the workspace.
    //
    // * `callback` {Function} to be called when the active pane item changes.
    //   * `item` The current active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActivePaneItem',
    value: function observeActivePaneItem(callback) {
      callback(this.getActivePaneItem());
      return this.onDidChangeActivePaneItem(callback);
    }

    // Essential: Invoke the given callback whenever an item is opened. Unlike
    // {::onDidAddPaneItem}, observers will be notified for items that are already
    // present in the workspace when they are reopened.
    //
    // * `callback` {Function} to be called whenever an item is opened.
    //   * `event` {Object} with the following keys:
    //     * `uri` {String} representing the opened URI. Could be `undefined`.
    //     * `item` The opened item.
    //     * `pane` The pane in which the item was opened.
    //     * `index` The index of the opened item on its pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidOpen',
    value: function onDidOpen(callback) {
      return this.emitter.on('did-open', callback);
    }

    // Extended: Invoke the given callback when a pane is added to the workspace.
    //
    // * `callback` {Function} to be called panes are added.
    //   * `event` {Object} with the following keys:
    //     * `pane` The added pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddPane',
    value: function onDidAddPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidAddPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback before a pane is destroyed in the
    // workspace.
    //
    // * `callback` {Function} to be called before panes are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `pane` The pane to be destroyed.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onWillDestroyPane',
    value: function onWillDestroyPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onWillDestroyPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane is destroyed in the
    // workspace.
    //
    // * `callback` {Function} to be called panes are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `pane` The destroyed pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidDestroyPane',
    value: function onDidDestroyPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidDestroyPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback with all current and future panes in the
    // workspace.
    //
    // * `callback` {Function} to be called with current and future panes.
    //   * `pane` A {Pane} that is present in {::getPanes} at the time of
    //      subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observePanes',
    value: function observePanes(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.observePanes(callback);
      })))))();
    }

    // Extended: Invoke the given callback when the active pane changes.
    //
    // * `callback` {Function} to be called when the active pane changes.
    //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActivePane',
    value: function onDidChangeActivePane(callback) {
      return this.emitter.on('did-change-active-pane', callback);
    }

    // Extended: Invoke the given callback with the current active pane and when
    // the active pane changes.
    //
    // * `callback` {Function} to be called with the current and future active#
    //   panes.
    //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActivePane',
    value: function observeActivePane(callback) {
      callback(this.getActivePane());
      return this.onDidChangeActivePane(callback);
    }

    // Extended: Invoke the given callback when a pane item is added to the
    // workspace.
    //
    // * `callback` {Function} to be called when pane items are added.
    //   * `event` {Object} with the following keys:
    //     * `item` The added pane item.
    //     * `pane` {Pane} containing the added item.
    //     * `index` {Number} indicating the index of the added item in its pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddPaneItem',
    value: function onDidAddPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidAddPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane item is about to be
    // destroyed, before the user is prompted to save it.
    //
    // * `callback` {Function} to be called before pane items are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `item` The item to be destroyed.
    //     * `pane` {Pane} containing the item to be destroyed.
    //     * `index` {Number} indicating the index of the item to be destroyed in
    //       its pane.
    //
    // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  }, {
    key: 'onWillDestroyPaneItem',
    value: function onWillDestroyPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onWillDestroyPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane item is destroyed.
    //
    // * `callback` {Function} to be called when pane items are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `item` The destroyed item.
    //     * `pane` {Pane} containing the destroyed item.
    //     * `index` {Number} indicating the index of the destroyed item in its
    //       pane.
    //
    // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  }, {
    key: 'onDidDestroyPaneItem',
    value: function onDidDestroyPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidDestroyPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a text editor is added to the
    // workspace.
    //
    // * `callback` {Function} to be called panes are added.
    //   * `event` {Object} with the following keys:
    //     * `textEditor` {TextEditor} that was added.
    //     * `pane` {Pane} containing the added text editor.
    //     * `index` {Number} indicating the index of the added text editor in its
    //        pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddTextEditor',
    value: function onDidAddTextEditor(callback) {
      return this.emitter.on('did-add-text-editor', callback);
    }

    /*
    Section: Opening
    */

    // Essential: Opens the given URI in Atom asynchronously.
    // If the URI is already open, the existing item for that URI will be
    // activated. If no URI is given, or no registered opener can open
    // the URI, a new empty {TextEditor} will be created.
    //
    // * `uri` (optional) A {String} containing a URI.
    // * `options` (optional) {Object}
    //   * `initialLine` A {Number} indicating which row to move the cursor to
    //     initially. Defaults to `0`.
    //   * `initialColumn` A {Number} indicating which column to move the cursor to
    //     initially. Defaults to `0`.
    //   * `split` Either 'left', 'right', 'up' or 'down'.
    //     If 'left', the item will be opened in leftmost pane of the current active pane's row.
    //     If 'right', the item will be opened in the rightmost pane of the current active pane's row. If only one pane exists in the row, a new pane will be created.
    //     If 'up', the item will be opened in topmost pane of the current active pane's column.
    //     If 'down', the item will be opened in the bottommost pane of the current active pane's column. If only one pane exists in the column, a new pane will be created.
    //   * `activatePane` A {Boolean} indicating whether to call {Pane::activate} on
    //     containing pane. Defaults to `true`.
    //   * `activateItem` A {Boolean} indicating whether to call {Pane::activateItem}
    //     on containing pane. Defaults to `true`.
    //   * `pending` A {Boolean} indicating whether or not the item should be opened
    //     in a pending state. Existing pending items in a pane are replaced with
    //     new pending items when they are opened.
    //   * `searchAllPanes` A {Boolean}. If `true`, the workspace will attempt to
    //     activate an existing item for the given URI on any pane.
    //     If `false`, only the active pane will be searched for
    //     an existing item for the same URI. Defaults to `false`.
    //   * `location` (optional) A {String} containing the name of the location
    //     in which this item should be opened (one of "left", "right", "bottom",
    //     or "center"). If omitted, Atom will fall back to the last location in
    //     which a user has placed an item with the same URI or, if this is a new
    //     URI, the default location specified by the item. NOTE: This option
    //     should almost always be omitted to honor user preference.
    //
    // Returns a {Promise} that resolves to the {TextEditor} for the file URI.
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (itemOrURI) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var uri = undefined,
          item = undefined;
      if (typeof itemOrURI === 'string') {
        uri = this.project.resolvePath(itemOrURI);
      } else if (itemOrURI) {
        item = itemOrURI;
        if (typeof item.getURI === 'function') uri = item.getURI();
      }

      if (!atom.config.get('core.allowPendingPaneItems')) {
        options.pending = false;
      }

      // Avoid adding URLs as recent documents to work-around this Spotlight crash:
      // https://github.com/atom/atom/issues/10071
      if (uri && (!url.parse(uri).protocol || process.platform === 'win32')) {
        this.applicationDelegate.addRecentDocument(uri);
      }

      var pane = undefined,
          itemExistsInWorkspace = undefined;

      // Try to find an existing item in the workspace.
      if (item || uri) {
        if (options.pane) {
          pane = options.pane;
        } else if (options.searchAllPanes) {
          pane = item ? this.paneForItem(item) : this.paneForURI(uri);
        } else {
          // If an item with the given URI is already in the workspace, assume
          // that item's pane container is the preferred location for that URI.
          var container = undefined;
          if (uri) container = this.paneContainerForURI(uri);
          if (!container) container = this.getActivePaneContainer();

          // The `split` option affects where we search for the item.
          pane = container.getActivePane();
          switch (options.split) {
            case 'left':
              pane = pane.findLeftmostSibling();
              break;
            case 'right':
              pane = pane.findRightmostSibling();
              break;
            case 'up':
              pane = pane.findTopmostSibling();
              break;
            case 'down':
              pane = pane.findBottommostSibling();
              break;
          }
        }

        if (pane) {
          if (item) {
            itemExistsInWorkspace = pane.getItems().includes(item);
          } else {
            item = pane.itemForURI(uri);
            itemExistsInWorkspace = item != null;
          }
        }
      }

      // If we already have an item at this stage, we won't need to do an async
      // lookup of the URI, so we yield the event loop to ensure this method
      // is consistently asynchronous.
      if (item) yield Promise.resolve();

      if (!itemExistsInWorkspace) {
        item = item || (yield this.createItemForURI(uri, options));
        if (!item) return;

        if (options.pane) {
          pane = options.pane;
        } else {
          var _location2 = options.location;
          if (!_location2 && !options.split && uri && this.enablePersistence) {
            _location2 = yield this.itemLocationStore.load(uri);
          }
          if (!_location2 && typeof item.getDefaultLocation === 'function') {
            _location2 = item.getDefaultLocation();
          }

          var allowedLocations = typeof item.getAllowedLocations === 'function' ? item.getAllowedLocations() : ALL_LOCATIONS;
          _location2 = allowedLocations.includes(_location2) ? _location2 : allowedLocations[0];

          var container = this.paneContainers[_location2] || this.getCenter();
          pane = container.getActivePane();
          switch (options.split) {
            case 'left':
              pane = pane.findLeftmostSibling();
              break;
            case 'right':
              pane = pane.findOrCreateRightmostSibling();
              break;
            case 'up':
              pane = pane.findTopmostSibling();
              break;
            case 'down':
              pane = pane.findOrCreateBottommostSibling();
              break;
          }
        }
      }

      if (!options.pending && pane.getPendingItem() === item) {
        pane.clearPendingItem();
      }

      this.itemOpened(item);

      if (options.activateItem === false) {
        pane.addItem(item, { pending: options.pending });
      } else {
        pane.activateItem(item, { pending: options.pending });
      }

      if (options.activatePane !== false) {
        pane.activate();
      }

      var initialColumn = 0;
      var initialLine = 0;
      if (!Number.isNaN(options.initialLine)) {
        initialLine = options.initialLine;
      }
      if (!Number.isNaN(options.initialColumn)) {
        initialColumn = options.initialColumn;
      }
      if (initialLine >= 0 || initialColumn >= 0) {
        if (typeof item.setCursorBufferPosition === 'function') {
          item.setCursorBufferPosition([initialLine, initialColumn]);
        }
      }

      var index = pane.getActiveItemIndex();
      this.emitter.emit('did-open', { uri: uri, pane: pane, item: item, index: index });
      return item;
    })

    // Essential: Search the workspace for items matching the given URI and hide them.
    //
    // * `itemOrURI` (optional) The item to hide or a {String} containing the URI
    //   of the item to hide.
    //
    // Returns a {boolean} indicating whether any items were found (and hidden).
  }, {
    key: 'hide',
    value: function hide(itemOrURI) {
      var foundItems = false;

      // If any visible item has the given URI, hide it
      for (var container of this.getPaneContainers()) {
        var isCenter = container === this.getCenter();
        if (isCenter || container.isVisible()) {
          for (var pane of container.getPanes()) {
            var activeItem = pane.getActiveItem();
            var foundItem = activeItem != null && (activeItem === itemOrURI || typeof activeItem.getURI === 'function' && activeItem.getURI() === itemOrURI);
            if (foundItem) {
              foundItems = true;
              // We can't really hide the center so we just destroy the item.
              if (isCenter) {
                pane.destroyItem(activeItem);
              } else {
                container.hide();
              }
            }
          }
        }
      }

      return foundItems;
    }

    // Essential: Search the workspace for items matching the given URI. If any are found, hide them.
    // Otherwise, open the URL.
    //
    // * `itemOrURI` (optional) The item to toggle or a {String} containing the URI
    //   of the item to toggle.
    //
    // Returns a Promise that resolves when the item is shown or hidden.
  }, {
    key: 'toggle',
    value: function toggle(itemOrURI) {
      if (this.hide(itemOrURI)) {
        return Promise.resolve();
      } else {
        return this.open(itemOrURI, { searchAllPanes: true });
      }
    }

    // Open Atom's license in the active pane.
  }, {
    key: 'openLicense',
    value: function openLicense() {
      return this.open('/usr/share/licenses/atom/LICENSE.md');
    }

    // Synchronously open the given URI in the active pane. **Only use this method
    // in specs. Calling this in production code will block the UI thread and
    // everyone will be mad at you.**
    //
    // * `uri` A {String} containing a URI.
    // * `options` An optional options {Object}
    //   * `initialLine` A {Number} indicating which row to move the cursor to
    //     initially. Defaults to `0`.
    //   * `initialColumn` A {Number} indicating which column to move the cursor to
    //     initially. Defaults to `0`.
    //   * `activatePane` A {Boolean} indicating whether to call {Pane::activate} on
    //     the containing pane. Defaults to `true`.
    //   * `activateItem` A {Boolean} indicating whether to call {Pane::activateItem}
    //     on containing pane. Defaults to `true`.
  }, {
    key: 'openSync',
    value: function openSync() {
      var uri_ = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var initialLine = options.initialLine;
      var initialColumn = options.initialColumn;

      var activatePane = options.activatePane != null ? options.activatePane : true;
      var activateItem = options.activateItem != null ? options.activateItem : true;

      var uri = this.project.resolvePath(uri_);
      var item = this.getActivePane().itemForURI(uri);
      if (uri && item == null) {
        for (var _opener of this.getOpeners()) {
          item = _opener(uri, options);
          if (item) break;
        }
      }
      if (item == null) {
        item = this.project.openSync(uri, { initialLine: initialLine, initialColumn: initialColumn });
      }

      if (activateItem) {
        this.getActivePane().activateItem(item);
      }
      this.itemOpened(item);
      if (activatePane) {
        this.getActivePane().activate();
      }
      return item;
    }
  }, {
    key: 'openURIInPane',
    value: function openURIInPane(uri, pane) {
      return this.open(uri, { pane: pane });
    }

    // Public: Creates a new item that corresponds to the provided URI.
    //
    // If no URI is given, or no registered opener can open the URI, a new empty
    // {TextEditor} will be created.
    //
    // * `uri` A {String} containing a URI.
    //
    // Returns a {Promise} that resolves to the {TextEditor} (or other item) for the given URI.
  }, {
    key: 'createItemForURI',
    value: function createItemForURI(uri, options) {
      if (uri != null) {
        for (var _opener2 of this.getOpeners()) {
          var item = _opener2(uri, options);
          if (item != null) return Promise.resolve(item);
        }
      }

      try {
        return this.openTextFile(uri, options);
      } catch (error) {
        switch (error.code) {
          case 'CANCELLED':
            return Promise.resolve();
          case 'EACCES':
            this.notificationManager.addWarning('Permission denied \'' + error.path + '\'');
            return Promise.resolve();
          case 'EPERM':
          case 'EBUSY':
          case 'ENXIO':
          case 'EIO':
          case 'ENOTCONN':
          case 'UNKNOWN':
          case 'ECONNRESET':
          case 'EINVAL':
          case 'EMFILE':
          case 'ENOTDIR':
          case 'EAGAIN':
            this.notificationManager.addWarning('Unable to open \'' + (error.path != null ? error.path : uri) + '\'', { detail: error.message });
            return Promise.resolve();
          default:
            throw error;
        }
      }
    }
  }, {
    key: 'openTextFile',
    value: function openTextFile(uri, options) {
      var _this6 = this;

      var filePath = this.project.resolvePath(uri);

      if (filePath != null) {
        try {
          fs.closeSync(fs.openSync(filePath, 'r'));
        } catch (error) {
          // allow ENOENT errors to create an editor for paths that dont exist
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }

      var fileSize = fs.getSizeSync(filePath);

      var largeFileMode = fileSize >= 2 * 1048576; // 2MB
      if (fileSize >= this.config.get('core.warnOnLargeFileLimit') * 1048576) {
        // 20MB by default
        var choice = this.applicationDelegate.confirm({
          message: 'Atom will be unresponsive during the loading of very large files.',
          detailedMessage: 'Do you still want to load this file?',
          buttons: ['Proceed', 'Cancel']
        });
        if (choice === 1) {
          var error = new Error();
          error.code = 'CANCELLED';
          throw error;
        }
      }

      return this.project.bufferForPath(filePath, options).then(function (buffer) {
        return _this6.textEditorRegistry.build(Object.assign({ buffer: buffer, largeFileMode: largeFileMode, autoHeight: false }, options));
      });
    }
  }, {
    key: 'handleGrammarUsed',
    value: function handleGrammarUsed(grammar) {
      if (grammar == null) {
        return;
      }
      return this.packageManager.triggerActivationHook(grammar.packageName + ':grammar-used');
    }

    // Public: Returns a {Boolean} that is `true` if `object` is a `TextEditor`.
    //
    // * `object` An {Object} you want to perform the check against.
  }, {
    key: 'isTextEditor',
    value: function isTextEditor(object) {
      return object instanceof TextEditor;
    }

    // Extended: Create a new text editor.
    //
    // Returns a {TextEditor}.
  }, {
    key: 'buildTextEditor',
    value: function buildTextEditor(params) {
      var editor = this.textEditorRegistry.build(params);
      var subscriptions = new CompositeDisposable(this.textEditorRegistry.maintainGrammar(editor), this.textEditorRegistry.maintainConfig(editor));
      editor.onDidDestroy(function () {
        subscriptions.dispose();
      });
      return editor;
    }

    // Public: Asynchronously reopens the last-closed item's URI if it hasn't already been
    // reopened.
    //
    // Returns a {Promise} that is resolved when the item is opened
  }, {
    key: 'reopenItem',
    value: function reopenItem() {
      var uri = this.destroyedItemURIs.pop();
      if (uri) {
        return this.open(uri);
      } else {
        return Promise.resolve();
      }
    }

    // Public: Register an opener for a uri.
    //
    // When a URI is opened via {Workspace::open}, Atom loops through its registered
    // opener functions until one returns a value for the given uri.
    // Openers are expected to return an object that inherits from HTMLElement or
    // a model which has an associated view in the {ViewRegistry}.
    // A {TextEditor} will be used if no opener returns a value.
    //
    // ## Examples
    //
    // ```coffee
    // atom.workspace.addOpener (uri) ->
    //   if path.extname(uri) is '.toml'
    //     return new TomlEditor(uri)
    // ```
    //
    // * `opener` A {Function} to be called when a path is being opened.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to remove the
    // opener.
    //
    // Note that the opener will be called if and only if the URI is not already open
    // in the current pane. The searchAllPanes flag expands the search from the
    // current pane to all panes. If you wish to open a view of a different type for
    // a file that is already open, consider changing the protocol of the URI. For
    // example, perhaps you wish to preview a rendered version of the file `/foo/bar/baz.quux`
    // that is already open in a text editor view. You could signal this by calling
    // {Workspace::open} on the URI `quux-preview://foo/bar/baz.quux`. Then your opener
    // can check the protocol for quux-preview and only handle those URIs that match.
  }, {
    key: 'addOpener',
    value: function addOpener(opener) {
      var _this7 = this;

      this.openers.push(opener);
      return new Disposable(function () {
        _.remove(_this7.openers, opener);
      });
    }
  }, {
    key: 'getOpeners',
    value: function getOpeners() {
      return this.openers;
    }

    /*
    Section: Pane Items
    */

    // Essential: Get all pane items in the workspace.
    //
    // Returns an {Array} of items.
  }, {
    key: 'getPaneItems',
    value: function getPaneItems() {
      return _.flatten(this.getPaneContainers().map(function (container) {
        return container.getPaneItems();
      }));
    }

    // Essential: Get the active {Pane}'s active item.
    //
    // Returns an pane item {Object}.
  }, {
    key: 'getActivePaneItem',
    value: function getActivePaneItem() {
      return this.getActivePaneContainer().getActivePaneItem();
    }

    // Essential: Get all text editors in the workspace.
    //
    // Returns an {Array} of {TextEditor}s.
  }, {
    key: 'getTextEditors',
    value: function getTextEditors() {
      return this.getPaneItems().filter(function (item) {
        return item instanceof TextEditor;
      });
    }

    // Essential: Get the active item if it is an {TextEditor}.
    //
    // Returns an {TextEditor} or `undefined` if the current active item is not an
    // {TextEditor}.
  }, {
    key: 'getActiveTextEditor',
    value: function getActiveTextEditor() {
      var activeItem = this.getActivePaneItem();
      if (activeItem instanceof TextEditor) {
        return activeItem;
      }
    }

    // Save all pane items.
  }, {
    key: 'saveAll',
    value: function saveAll() {
      this.getPaneContainers().forEach(function (container) {
        container.saveAll();
      });
    }
  }, {
    key: 'confirmClose',
    value: function confirmClose(options) {
      return this.getPaneContainers().map(function (container) {
        return container.confirmClose(options);
      }).every(function (saved) {
        return saved;
      });
    }

    // Save the active pane item.
    //
    // If the active pane item currently has a URI according to the item's
    // `.getURI` method, calls `.save` on the item. Otherwise
    // {::saveActivePaneItemAs} # will be called instead. This method does nothing
    // if the active item does not implement a `.save` method.
  }, {
    key: 'saveActivePaneItem',
    value: function saveActivePaneItem() {
      this.getActivePane().saveActiveItem();
    }

    // Prompt the user for a path and save the active pane item to it.
    //
    // Opens a native dialog where the user selects a path on disk, then calls
    // `.saveAs` on the item with the selected path. This method does nothing if
    // the active item does not implement a `.saveAs` method.
  }, {
    key: 'saveActivePaneItemAs',
    value: function saveActivePaneItemAs() {
      this.getActivePane().saveActiveItemAs();
    }

    // Destroy (close) the active pane item.
    //
    // Removes the active pane item and calls the `.destroy` method on it if one is
    // defined.
  }, {
    key: 'destroyActivePaneItem',
    value: function destroyActivePaneItem() {
      return this.getActivePane().destroyActiveItem();
    }

    /*
    Section: Panes
    */

    // Extended: Get the most recently focused pane container.
    //
    // Returns a {Dock} or the {WorkspaceCenter}.
  }, {
    key: 'getActivePaneContainer',
    value: function getActivePaneContainer() {
      return this.activePaneContainer;
    }

    // Extended: Get all panes in the workspace.
    //
    // Returns an {Array} of {Pane}s.
  }, {
    key: 'getPanes',
    value: function getPanes() {
      return _.flatten(this.getPaneContainers().map(function (container) {
        return container.getPanes();
      }));
    }

    // Extended: Get the active {Pane}.
    //
    // Returns a {Pane}.
  }, {
    key: 'getActivePane',
    value: function getActivePane() {
      return this.getActivePaneContainer().getActivePane();
    }

    // Extended: Make the next pane active.
  }, {
    key: 'activateNextPane',
    value: function activateNextPane() {
      return this.getActivePaneContainer().activateNextPane();
    }

    // Extended: Make the previous pane active.
  }, {
    key: 'activatePreviousPane',
    value: function activatePreviousPane() {
      return this.getActivePaneContainer().activatePreviousPane();
    }

    // Extended: Get the first pane container that contains an item with the given
    // URI.
    //
    // * `uri` {String} uri
    //
    // Returns a {Dock}, the {WorkspaceCenter}, or `undefined` if no item exists
    // with the given URI.
  }, {
    key: 'paneContainerForURI',
    value: function paneContainerForURI(uri) {
      return this.getPaneContainers().find(function (container) {
        return container.paneForURI(uri);
      });
    }

    // Extended: Get the first pane container that contains the given item.
    //
    // * `item` the Item that the returned pane container must contain.
    //
    // Returns a {Dock}, the {WorkspaceCenter}, or `undefined` if no item exists
    // with the given URI.
  }, {
    key: 'paneContainerForItem',
    value: function paneContainerForItem(uri) {
      return this.getPaneContainers().find(function (container) {
        return container.paneForItem(uri);
      });
    }

    // Extended: Get the first {Pane} that contains an item with the given URI.
    //
    // * `uri` {String} uri
    //
    // Returns a {Pane} or `undefined` if no item exists with the given URI.
  }, {
    key: 'paneForURI',
    value: function paneForURI(uri) {
      for (var _location3 of this.getPaneContainers()) {
        var pane = _location3.paneForURI(uri);
        if (pane != null) {
          return pane;
        }
      }
    }

    // Extended: Get the {Pane} containing the given item.
    //
    // * `item` the Item that the returned pane must contain.
    //
    // Returns a {Pane} or `undefined` if no pane exists for the given item.
  }, {
    key: 'paneForItem',
    value: function paneForItem(item) {
      for (var _location4 of this.getPaneContainers()) {
        var pane = _location4.paneForItem(item);
        if (pane != null) {
          return pane;
        }
      }
    }

    // Destroy (close) the active pane.
  }, {
    key: 'destroyActivePane',
    value: function destroyActivePane() {
      var activePane = this.getActivePane();
      if (activePane != null) {
        activePane.destroy();
      }
    }

    // Close the active pane item, or the active pane if it is empty,
    // or the current window if there is only the empty root pane.
  }, {
    key: 'closeActivePaneItemOrEmptyPaneOrWindow',
    value: function closeActivePaneItemOrEmptyPaneOrWindow() {
      if (this.getActivePaneItem() != null) {
        this.destroyActivePaneItem();
      } else if (this.getCenter().getPanes().length > 1) {
        this.destroyActivePane();
      } else if (this.config.get('core.closeEmptyWindows')) {
        atom.close();
      }
    }

    // Increase the editor font size by 1px.
  }, {
    key: 'increaseFontSize',
    value: function increaseFontSize() {
      this.config.set('editor.fontSize', this.config.get('editor.fontSize') + 1);
    }

    // Decrease the editor font size by 1px.
  }, {
    key: 'decreaseFontSize',
    value: function decreaseFontSize() {
      var fontSize = this.config.get('editor.fontSize');
      if (fontSize > 1) {
        this.config.set('editor.fontSize', fontSize - 1);
      }
    }

    // Restore to the window's original editor font size.
  }, {
    key: 'resetFontSize',
    value: function resetFontSize() {
      if (this.originalFontSize) {
        this.config.set('editor.fontSize', this.originalFontSize);
      }
    }
  }, {
    key: 'subscribeToFontSize',
    value: function subscribeToFontSize() {
      var _this8 = this;

      return this.config.onDidChange('editor.fontSize', function (_ref6) {
        var oldValue = _ref6.oldValue;

        if (_this8.originalFontSize == null) {
          _this8.originalFontSize = oldValue;
        }
      });
    }

    // Removes the item's uri from the list of potential items to reopen.
  }, {
    key: 'itemOpened',
    value: function itemOpened(item) {
      var uri = undefined;
      if (typeof item.getURI === 'function') {
        uri = item.getURI();
      } else if (typeof item.getUri === 'function') {
        uri = item.getUri();
      }

      if (uri != null) {
        _.remove(this.destroyedItemURIs, uri);
      }
    }

    // Adds the destroyed item's uri to the list of items to reopen.
  }, {
    key: 'didDestroyPaneItem',
    value: function didDestroyPaneItem(_ref7) {
      var item = _ref7.item;

      var uri = undefined;
      if (typeof item.getURI === 'function') {
        uri = item.getURI();
      } else if (typeof item.getUri === 'function') {
        uri = item.getUri();
      }

      if (uri != null) {
        this.destroyedItemURIs.push(uri);
      }
    }

    // Called by Model superclass when destroyed
  }, {
    key: 'destroyed',
    value: function destroyed() {
      this.paneContainers.center.destroy();
      this.paneContainers.left.destroy();
      this.paneContainers.right.destroy();
      this.paneContainers.bottom.destroy();
      this.cancelStoppedChangingActivePaneItemTimeout();
      if (this.activeItemSubscriptions != null) {
        this.activeItemSubscriptions.dispose();
      }
    }

    /*
    Section: Pane Locations
    */

  }, {
    key: 'getCenter',
    value: function getCenter() {
      return this.paneContainers.center;
    }
  }, {
    key: 'getLeftDock',
    value: function getLeftDock() {
      return this.paneContainers.left;
    }
  }, {
    key: 'getRightDock',
    value: function getRightDock() {
      return this.paneContainers.right;
    }
  }, {
    key: 'getBottomDock',
    value: function getBottomDock() {
      return this.paneContainers.bottom;
    }
  }, {
    key: 'getPaneContainers',
    value: function getPaneContainers() {
      return [this.paneContainers.center, this.paneContainers.left, this.paneContainers.right, this.paneContainers.bottom];
    }

    /*
    Section: Panels
     Panels are used to display UI related to an editor window. They are placed at one of the four
    edges of the window: left, right, top or bottom. If there are multiple panels on the same window
    edge they are stacked in order of priority: higher priority is closer to the center, lower
    priority towards the edge.
     *Note:* If your panel changes its size throughout its lifetime, consider giving it a higher
    priority, allowing fixed size panels to be closer to the edge. This allows control targets to
    remain more static for easier targeting by users that employ mice or trackpads. (See
    [atom/atom#4834](https://github.com/atom/atom/issues/4834) for discussion.)
    */

    // Essential: Get an {Array} of all the panel items at the bottom of the editor window.
  }, {
    key: 'getBottomPanels',
    value: function getBottomPanels() {
      return this.getPanels('bottom');
    }

    // Essential: Adds a panel item to the bottom of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addBottomPanel',
    value: function addBottomPanel(options) {
      return this.addPanel('bottom', options);
    }

    // Essential: Get an {Array} of all the panel items to the left of the editor window.
  }, {
    key: 'getLeftPanels',
    value: function getLeftPanels() {
      return this.getPanels('left');
    }

    // Essential: Adds a panel item to the left of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addLeftPanel',
    value: function addLeftPanel(options) {
      return this.addPanel('left', options);
    }

    // Essential: Get an {Array} of all the panel items to the right of the editor window.
  }, {
    key: 'getRightPanels',
    value: function getRightPanels() {
      return this.getPanels('right');
    }

    // Essential: Adds a panel item to the right of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addRightPanel',
    value: function addRightPanel(options) {
      return this.addPanel('right', options);
    }

    // Essential: Get an {Array} of all the panel items at the top of the editor window.
  }, {
    key: 'getTopPanels',
    value: function getTopPanels() {
      return this.getPanels('top');
    }

    // Essential: Adds a panel item to the top of the editor window above the tabs.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addTopPanel',
    value: function addTopPanel(options) {
      return this.addPanel('top', options);
    }

    // Essential: Get an {Array} of all the panel items in the header.
  }, {
    key: 'getHeaderPanels',
    value: function getHeaderPanels() {
      return this.getPanels('header');
    }

    // Essential: Adds a panel item to the header.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addHeaderPanel',
    value: function addHeaderPanel(options) {
      return this.addPanel('header', options);
    }

    // Essential: Get an {Array} of all the panel items in the footer.
  }, {
    key: 'getFooterPanels',
    value: function getFooterPanels() {
      return this.getPanels('footer');
    }

    // Essential: Adds a panel item to the footer.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addFooterPanel',
    value: function addFooterPanel(options) {
      return this.addPanel('footer', options);
    }

    // Essential: Get an {Array} of all the modal panel items
  }, {
    key: 'getModalPanels',
    value: function getModalPanels() {
      return this.getPanels('modal');
    }

    // Essential: Adds a panel item as a modal dialog.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be a DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     model option. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addModalPanel',
    value: function addModalPanel() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.addPanel('modal', options);
    }

    // Essential: Returns the {Panel} associated with the given item. Returns
    // `null` when the item has no panel.
    //
    // * `item` Item the panel contains
  }, {
    key: 'panelForItem',
    value: function panelForItem(item) {
      for (var _location5 in this.panelContainers) {
        var container = this.panelContainers[_location5];
        var panel = container.panelForItem(item);
        if (panel != null) {
          return panel;
        }
      }
      return null;
    }
  }, {
    key: 'getPanels',
    value: function getPanels(location) {
      return this.panelContainers[location].getPanels();
    }
  }, {
    key: 'addPanel',
    value: function addPanel(location, options) {
      if (options == null) {
        options = {};
      }
      return this.panelContainers[location].addPanel(new Panel(options, this.viewRegistry));
    }

    /*
    Section: Searching and Replacing
    */

    // Public: Performs a search across all files in the workspace.
    //
    // * `regex` {RegExp} to search with.
    // * `options` (optional) {Object}
    //   * `paths` An {Array} of glob patterns to search within.
    //   * `onPathsSearched` (optional) {Function} to be periodically called
    //     with number of paths searched.
    //   * `leadingContextLineCount` {Number} default `0`; The number of lines
    //      before the matched line to include in the results object.
    //   * `trailingContextLineCount` {Number} default `0`; The number of lines
    //      after the matched line to include in the results object.
    // * `iterator` {Function} callback on each file found.
    //
    // Returns a {Promise} with a `cancel()` method that will cancel all
    // of the underlying searches that were started as part of this scan.
  }, {
    key: 'scan',
    value: function scan(regex, options, iterator) {
      var _this9 = this;

      if (options === undefined) options = {};

      if (_.isFunction(options)) {
        iterator = options;
        options = {};
      }

      // Find a searcher for every Directory in the project. Each searcher that is matched
      // will be associated with an Array of Directory objects in the Map.
      var directoriesForSearcher = new Map();
      for (var directory of this.project.getDirectories()) {
        var searcher = this.defaultDirectorySearcher;
        for (var directorySearcher of this.directorySearchers) {
          if (directorySearcher.canSearchDirectory(directory)) {
            searcher = directorySearcher;
            break;
          }
        }
        var directories = directoriesForSearcher.get(searcher);
        if (!directories) {
          directories = [];
          directoriesForSearcher.set(searcher, directories);
        }
        directories.push(directory);
      }

      // Define the onPathsSearched callback.
      var onPathsSearched = undefined;
      if (_.isFunction(options.onPathsSearched)) {
        (function () {
          // Maintain a map of directories to the number of search results. When notified of a new count,
          // replace the entry in the map and update the total.
          var onPathsSearchedOption = options.onPathsSearched;
          var totalNumberOfPathsSearched = 0;
          var numberOfPathsSearchedForSearcher = new Map();
          onPathsSearched = function (searcher, numberOfPathsSearched) {
            var oldValue = numberOfPathsSearchedForSearcher.get(searcher);
            if (oldValue) {
              totalNumberOfPathsSearched -= oldValue;
            }
            numberOfPathsSearchedForSearcher.set(searcher, numberOfPathsSearched);
            totalNumberOfPathsSearched += numberOfPathsSearched;
            return onPathsSearchedOption(totalNumberOfPathsSearched);
          };
        })();
      } else {
        onPathsSearched = function () {};
      }

      // Kick off all of the searches and unify them into one Promise.
      var allSearches = [];
      directoriesForSearcher.forEach(function (directories, searcher) {
        var searchOptions = {
          inclusions: options.paths || [],
          includeHidden: true,
          excludeVcsIgnores: _this9.config.get('core.excludeVcsIgnoredPaths'),
          exclusions: _this9.config.get('core.ignoredNames'),
          follow: _this9.config.get('core.followSymlinks'),
          leadingContextLineCount: options.leadingContextLineCount || 0,
          trailingContextLineCount: options.trailingContextLineCount || 0,
          didMatch: function didMatch(result) {
            if (!_this9.project.isPathModified(result.filePath)) {
              return iterator(result);
            }
          },
          didError: function didError(error) {
            return iterator(null, error);
          },
          didSearchPaths: function didSearchPaths(count) {
            return onPathsSearched(searcher, count);
          }
        };
        var directorySearcher = searcher.search(directories, regex, searchOptions);
        allSearches.push(directorySearcher);
      });
      var searchPromise = Promise.all(allSearches);

      for (var buffer of this.project.getBuffers()) {
        if (buffer.isModified()) {
          var filePath = buffer.getPath();
          if (!this.project.contains(filePath)) {
            continue;
          }
          var matches = [];
          buffer.scan(regex, function (match) {
            return matches.push(match);
          });
          if (matches.length > 0) {
            iterator({ filePath: filePath, matches: matches });
          }
        }
      }

      // Make sure the Promise that is returned to the client is cancelable. To be consistent
      // with the existing behavior, instead of cancel() rejecting the promise, it should
      // resolve it with the special value 'cancelled'. At least the built-in find-and-replace
      // package relies on this behavior.
      var isCancelled = false;
      var cancellablePromise = new Promise(function (resolve, reject) {
        var onSuccess = function onSuccess() {
          if (isCancelled) {
            resolve('cancelled');
          } else {
            resolve(null);
          }
        };

        var onFailure = function onFailure() {
          for (var promise of allSearches) {
            promise.cancel();
          }
          reject();
        };

        searchPromise.then(onSuccess, onFailure);
      });
      cancellablePromise.cancel = function () {
        isCancelled = true;
        // Note that cancelling all of the members of allSearches will cause all of the searches
        // to resolve, which causes searchPromise to resolve, which is ultimately what causes
        // cancellablePromise to resolve.
        allSearches.map(function (promise) {
          return promise.cancel();
        });
      };

      // Although this method claims to return a `Promise`, the `ResultsPaneView.onSearch()`
      // method in the find-and-replace package expects the object returned by this method to have a
      // `done()` method. Include a done() method until find-and-replace can be updated.
      cancellablePromise.done = function (onSuccessOrFailure) {
        cancellablePromise.then(onSuccessOrFailure, onSuccessOrFailure);
      };
      return cancellablePromise;
    }

    // Public: Performs a replace across all the specified files in the project.
    //
    // * `regex` A {RegExp} to search with.
    // * `replacementText` {String} to replace all matches of regex with.
    // * `filePaths` An {Array} of file path strings to run the replace on.
    // * `iterator` A {Function} callback on each file with replacements:
    //   * `options` {Object} with keys `filePath` and `replacements`.
    //
    // Returns a {Promise}.
  }, {
    key: 'replace',
    value: function replace(regex, replacementText, filePaths, iterator) {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        var buffer = undefined;
        var openPaths = _this10.project.getBuffers().map(function (buffer) {
          return buffer.getPath();
        });
        var outOfProcessPaths = _.difference(filePaths, openPaths);

        var inProcessFinished = !openPaths.length;
        var outOfProcessFinished = !outOfProcessPaths.length;
        var checkFinished = function checkFinished() {
          if (outOfProcessFinished && inProcessFinished) {
            resolve();
          }
        };

        if (!outOfProcessFinished.length) {
          var flags = 'g';
          if (regex.ignoreCase) {
            flags += 'i';
          }

          var task = Task.once(require.resolve('./replace-handler'), outOfProcessPaths, regex.source, flags, replacementText, function () {
            outOfProcessFinished = true;
            checkFinished();
          });

          task.on('replace:path-replaced', iterator);
          task.on('replace:file-error', function (error) {
            iterator(null, error);
          });
        }

        for (buffer of _this10.project.getBuffers()) {
          if (!filePaths.includes(buffer.getPath())) {
            continue;
          }
          var replacements = buffer.replace(regex, replacementText, iterator);
          if (replacements) {
            iterator({ filePath: buffer.getPath(), replacements: replacements });
          }
        }

        inProcessFinished = true;
        checkFinished();
      });
    }
  }, {
    key: 'checkoutHeadRevision',
    value: function checkoutHeadRevision(editor) {
      var _this11 = this;

      if (editor.getPath()) {
        var checkoutHead = function checkoutHead() {
          return _this11.project.repositoryForDirectory(new Directory(editor.getDirectoryPath())).then(function (repository) {
            return repository != null ? repository.checkoutHeadForEditor(editor) : undefined;
          });
        };

        if (this.config.get('editor.confirmCheckoutHeadRevision')) {
          this.applicationDelegate.confirm({
            message: 'Confirm Checkout HEAD Revision',
            detailedMessage: 'Are you sure you want to discard all changes to "' + editor.getFileName() + '" since the last Git commit?',
            buttons: {
              OK: checkoutHead,
              Cancel: null
            }
          });
        } else {
          return checkoutHead();
        }
      } else {
        return Promise.resolve(false);
      }
    }
  }, {
    key: 'paneContainer',
    get: function get() {
      Grim.deprecate('`atom.workspace.paneContainer` has always been private, but it is now gone. Please use `atom.workspace.getCenter()` instead and consult the workspace API docs for public methods.');
      return this.paneContainers.center.paneContainer;
    }
  }]);

  return Workspace;
})(Model);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9idWlsZGRpci9idWlsZC9CVUlMRC9hdG9tLTI3OTE1NzJjZDIwYjFkOGM4NGExMDBlODMwOGRjY2U1N2QxODUzZDcvb3V0L2FwcC9zcmMvd29ya3NwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7QUFFWCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs7QUFFcEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxZQUFZO0FBQUUsV0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUUsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFBRSxVQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLEFBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQUFBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQUU7R0FBRSxBQUFDLE9BQU8sVUFBVSxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUFFLFFBQUksVUFBVSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQUFBQyxJQUFJLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQUFBQyxPQUFPLFdBQVcsQ0FBQztHQUFFLENBQUM7Q0FBRSxDQUFBLEVBQUcsQ0FBQzs7QUFFdGpCLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQUUsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEFBQUMsU0FBUyxFQUFFLE9BQU8sTUFBTSxFQUFFO0FBQUUsUUFBSSxNQUFNLEdBQUcsR0FBRztRQUFFLFFBQVEsR0FBRyxHQUFHO1FBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxBQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQUFBQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQUFBQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEFBQUMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQUUsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUFDLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUFFLGVBQU8sU0FBUyxDQUFDO09BQUUsTUFBTTtBQUFFLFdBQUcsR0FBRyxNQUFNLENBQUMsQUFBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEFBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxBQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxBQUFDLFNBQVMsU0FBUyxDQUFDO09BQUU7S0FBRSxNQUFNLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUFFLE1BQU07QUFBRSxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsZUFBTyxTQUFTLENBQUM7T0FBRSxBQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUFFO0dBQUU7Q0FBRSxDQUFDOztBQUVycEIsU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7QUFBRSxNQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFBRSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsT0FBTyxJQUFJLENBQUM7R0FBRSxNQUFNO0FBQUUsV0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQUU7Q0FBRTs7QUFFL0wsU0FBUyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUU7QUFBRSxTQUFPLFlBQVk7QUFBRSxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxBQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQUUsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQUFBQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxBQUFDLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFBRSxZQUFJO0FBQUUsY0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUFFLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFBRSxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEFBQUMsT0FBTztTQUFFLEFBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFLE1BQU07QUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxL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QUNoQixvQkFBTSxFQUFFLElBQUk7YUFDYjtXQUNGLENBQUMsQ0FBQTtTQUNILE1BQU07QUFDTCxpQkFBTyxZQUFZLEVBQUUsQ0FBQTtTQUN0QjtPQUNGLE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDOUI7S0FDRjtHQStSQSxFQUFFO0FBQ0QsT0FBRyxFQUFFLGVBQWU7QUFDcEIsT0FBRyxFQXo4RGEsU0FBQSxHQUFBLEdBQUc7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxvTEFBb0wsQ0FBQyxDQUFBO0FBQ3BNLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFBO0tBQ2hEO0dBMDhEQSxDQUFDLENBQUMsQ0FBQzs7QUFFSixTQXZnRXFCLFNBQVMsQ0FBQTtDQXdnRS9CLENBQUEsQ0F4Z0V3QyxLQUFLLENBaXVEN0MsQ0FBQSIsImZpbGUiOiIvYnVpbGRkaXIvYnVpbGQvQlVJTEQvYXRvbS0yNzkxNTcyY2QyMGIxZDhjODRhMTAwZTgzMDhkY2NlNTdkMTg1M2Q3L291dC9hcHAvc3JjL3dvcmtzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKVxuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHtFbWl0dGVyLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2V2ZW50LWtpdCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKVxuY29uc3Qge0RpcmVjdG9yeX0gPSByZXF1aXJlKCdwYXRod2F0Y2hlcicpXG5jb25zdCBHcmltID0gcmVxdWlyZSgnZ3JpbScpXG5jb25zdCBEZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXIgPSByZXF1aXJlKCcuL2RlZmF1bHQtZGlyZWN0b3J5LXNlYXJjaGVyJylcbmNvbnN0IERvY2sgPSByZXF1aXJlKCcuL2RvY2snKVxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJylcbmNvbnN0IFN0YXRlU3RvcmUgPSByZXF1aXJlKCcuL3N0YXRlLXN0b3JlJylcbmNvbnN0IFRleHRFZGl0b3IgPSByZXF1aXJlKCcuL3RleHQtZWRpdG9yJylcbmNvbnN0IFBhbmVsID0gcmVxdWlyZSgnLi9wYW5lbCcpXG5jb25zdCBQYW5lbENvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFuZWwtY29udGFpbmVyJylcbmNvbnN0IFRhc2sgPSByZXF1aXJlKCcuL3Rhc2snKVxuY29uc3QgV29ya3NwYWNlQ2VudGVyID0gcmVxdWlyZSgnLi93b3Jrc3BhY2UtY2VudGVyJylcbmNvbnN0IFdvcmtzcGFjZUVsZW1lbnQgPSByZXF1aXJlKCcuL3dvcmtzcGFjZS1lbGVtZW50JylcblxuY29uc3QgU1RPUFBFRF9DSEFOR0lOR19BQ1RJVkVfUEFORV9JVEVNX0RFTEFZID0gMTAwXG5jb25zdCBBTExfTE9DQVRJT05TID0gWydjZW50ZXInLCAnbGVmdCcsICdyaWdodCcsICdib3R0b20nXVxuXG4vLyBFc3NlbnRpYWw6IFJlcHJlc2VudHMgdGhlIHN0YXRlIG9mIHRoZSB1c2VyIGludGVyZmFjZSBmb3IgdGhlIGVudGlyZSB3aW5kb3cuXG4vLyBBbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGlzIGF2YWlsYWJsZSB2aWEgdGhlIGBhdG9tLndvcmtzcGFjZWAgZ2xvYmFsLlxuLy9cbi8vIEludGVyYWN0IHdpdGggdGhpcyBvYmplY3QgdG8gb3BlbiBmaWxlcywgYmUgbm90aWZpZWQgb2YgY3VycmVudCBhbmQgZnV0dXJlXG4vLyBlZGl0b3JzLCBhbmQgbWFuaXB1bGF0ZSBwYW5lcy4gVG8gYWRkIHBhbmVscywgdXNlIHtXb3Jrc3BhY2U6OmFkZFRvcFBhbmVsfVxuLy8gYW5kIGZyaWVuZHMuXG4vL1xuLy8gIyMgV29ya3NwYWNlIEl0ZW1zXG4vL1xuLy8gVGhlIHRlcm0gXCJpdGVtXCIgcmVmZXJzIHRvIGFueXRoaW5nIHRoYXQgY2FuIGJlIGRpc3BsYXllZFxuLy8gaW4gYSBwYW5lIHdpdGhpbiB0aGUgd29ya3NwYWNlLCBlaXRoZXIgaW4gdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9IG9yIGluIG9uZVxuLy8gb2YgdGhlIHRocmVlIHtEb2NrfXMuIFRoZSB3b3Jrc3BhY2UgZXhwZWN0cyBpdGVtcyB0byBjb25mb3JtIHRvIHRoZVxuLy8gZm9sbG93aW5nIGludGVyZmFjZTpcbi8vXG4vLyAjIyMgUmVxdWlyZWQgTWV0aG9kc1xuLy9cbi8vICMjIyMgYGdldFRpdGxlKClgXG4vL1xuLy8gUmV0dXJucyBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIHRpdGxlIG9mIHRoZSBpdGVtIHRvIGRpc3BsYXkgb24gaXRzXG4vLyBhc3NvY2lhdGVkIHRhYi5cbi8vXG4vLyAjIyMgT3B0aW9uYWwgTWV0aG9kc1xuLy9cbi8vICMjIyMgYGdldEVsZW1lbnQoKWBcbi8vXG4vLyBJZiB5b3VyIGl0ZW0gYWxyZWFkeSAqaXMqIGEgRE9NIGVsZW1lbnQsIHlvdSBkbyBub3QgbmVlZCB0byBpbXBsZW1lbnQgdGhpc1xuLy8gbWV0aG9kLiBPdGhlcndpc2UgaXQgc2hvdWxkIHJldHVybiB0aGUgZWxlbWVudCB5b3Ugd2FudCB0byBkaXNwbGF5IHRvXG4vLyByZXByZXNlbnQgdGhpcyBpdGVtLlxuLy9cbi8vICMjIyMgYGRlc3Ryb3koKWBcbi8vXG4vLyBEZXN0cm95cyB0aGUgaXRlbS4gVGhpcyB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBpdGVtIGlzIHJlbW92ZWQgZnJvbSBpdHNcbi8vIHBhcmVudCBwYW5lLlxuLy9cbi8vICMjIyMgYG9uRGlkRGVzdHJveShjYWxsYmFjaylgXG4vL1xuLy8gQ2FsbGVkIGJ5IHRoZSB3b3Jrc3BhY2Ugc28gaXQgY2FuIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGl0ZW0gaXMgZGVzdHJveWVkLlxuLy8gTXVzdCByZXR1cm4gYSB7RGlzcG9zYWJsZX0uXG4vL1xuLy8gIyMjIyBgc2VyaWFsaXplKClgXG4vL1xuLy8gU2VyaWFsaXplIHRoZSBzdGF0ZSBvZiB0aGUgaXRlbS4gTXVzdCByZXR1cm4gYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHBhc3NlZCB0b1xuLy8gYEpTT04uc3RyaW5naWZ5YC4gVGhlIHN0YXRlIHNob3VsZCBpbmNsdWRlIGEgZmllbGQgY2FsbGVkIGBkZXNlcmlhbGl6ZXJgLFxuLy8gd2hpY2ggbmFtZXMgYSBkZXNlcmlhbGl6ZXIgZGVjbGFyZWQgaW4geW91ciBgcGFja2FnZS5qc29uYC4gVGhpcyBtZXRob2QgaXNcbi8vIGludm9rZWQgb24gaXRlbXMgd2hlbiBzZXJpYWxpemluZyB0aGUgd29ya3NwYWNlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIHRvXG4vLyB0aGUgc2FtZSBsb2NhdGlvbiBsYXRlci5cbi8vXG4vLyAjIyMjIGBnZXRVUkkoKWBcbi8vXG4vLyBSZXR1cm5zIHRoZSBVUkkgYXNzb2NpYXRlZCB3aXRoIHRoZSBpdGVtLlxuLy9cbi8vICMjIyMgYGdldExvbmdUaXRsZSgpYFxuLy9cbi8vIFJldHVybnMgYSB7U3RyaW5nfSBjb250YWluaW5nIGEgbG9uZ2VyIHZlcnNpb24gb2YgdGhlIHRpdGxlIHRvIGRpc3BsYXkgaW5cbi8vIHBsYWNlcyBsaWtlIHRoZSB3aW5kb3cgdGl0bGUgb3Igb24gdGFicyB0aGVpciBzaG9ydCB0aXRsZXMgYXJlIGFtYmlndW91cy5cbi8vXG4vLyAjIyMjIGBvbkRpZENoYW5nZVRpdGxlYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIHRoZSBpdGVtJ3MgdGl0bGUgY2hhbmdlcy5cbi8vIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYGdldEljb25OYW1lKClgXG4vL1xuLy8gUmV0dXJuIGEge1N0cmluZ30gd2l0aCB0aGUgbmFtZSBvZiBhbiBpY29uLiBJZiB0aGlzIG1ldGhvZCBpcyBkZWZpbmVkIGFuZFxuLy8gcmV0dXJucyBhIHN0cmluZywgdGhlIGl0ZW0ncyB0YWIgZWxlbWVudCB3aWxsIGJlIHJlbmRlcmVkIHdpdGggdGhlIGBpY29uYCBhbmRcbi8vIGBpY29uLSR7aWNvbk5hbWV9YCBDU1MgY2xhc3Nlcy5cbi8vXG4vLyAjIyMgYG9uRGlkQ2hhbmdlSWNvbihjYWxsYmFjaylgXG4vL1xuLy8gQ2FsbGVkIGJ5IHRoZSB3b3Jrc3BhY2Ugc28gaXQgY2FuIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGl0ZW0ncyBpY29uIGNoYW5nZXMuXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBnZXREZWZhdWx0TG9jYXRpb24oKWBcbi8vXG4vLyBUZWxscyB0aGUgd29ya3NwYWNlIHdoZXJlIHlvdXIgaXRlbSBzaG91bGQgYmUgb3BlbmVkIGluIGFic2VuY2Ugb2YgYSB1c2VyXG4vLyBvdmVycmlkZS4gSXRlbXMgY2FuIGFwcGVhciBpbiB0aGUgY2VudGVyIG9yIGluIGEgZG9jayBvbiB0aGUgbGVmdCwgcmlnaHQsIG9yXG4vLyBib3R0b20gb2YgdGhlIHdvcmtzcGFjZS5cbi8vXG4vLyBSZXR1cm5zIGEge1N0cmluZ30gd2l0aCBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6IGAnY2VudGVyJ2AsIGAnbGVmdCdgLFxuLy8gYCdyaWdodCdgLCBgJ2JvdHRvbSdgLiBJZiB0aGlzIG1ldGhvZCBpcyBub3QgZGVmaW5lZCwgYCdjZW50ZXInYCBpcyB0aGVcbi8vIGRlZmF1bHQuXG4vL1xuLy8gIyMjIyBgZ2V0QWxsb3dlZExvY2F0aW9ucygpYFxuLy9cbi8vIFRlbGxzIHRoZSB3b3Jrc3BhY2Ugd2hlcmUgdGhpcyBpdGVtIGNhbiBiZSBtb3ZlZC4gUmV0dXJucyBhbiB7QXJyYXl9IG9mIG9uZVxuLy8gb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczogYCdjZW50ZXInYCwgYCdsZWZ0J2AsIGAncmlnaHQnYCwgb3Jcbi8vIGAnYm90dG9tJ2AuXG4vL1xuLy8gIyMjIyBgaXNQZXJtYW5lbnREb2NrSXRlbSgpYFxuLy9cbi8vIFRlbGxzIHRoZSB3b3Jrc3BhY2Ugd2hldGhlciBvciBub3QgdGhpcyBpdGVtIGNhbiBiZSBjbG9zZWQgYnkgdGhlIHVzZXIgYnlcbi8vIGNsaWNraW5nIGFuIGB4YCBvbiBpdHMgdGFiLiBVc2Ugb2YgdGhpcyBmZWF0dXJlIGlzIGRpc2NvdXJhZ2VkIHVubGVzcyB0aGVyZSdzXG4vLyBhIHZlcnkgZ29vZCByZWFzb24gbm90IHRvIGFsbG93IHVzZXJzIHRvIGNsb3NlIHlvdXIgaXRlbS4gSXRlbXMgY2FuIGJlIG1hZGVcbi8vIHBlcm1hbmVudCAqb25seSogd2hlbiB0aGV5IGFyZSBjb250YWluZWQgaW4gZG9ja3MuIENlbnRlciBwYW5lIGl0ZW1zIGNhblxuLy8gYWx3YXlzIGJlIHJlbW92ZWQuIE5vdGUgdGhhdCBpdCBpcyBjdXJyZW50bHkgc3RpbGwgcG9zc2libGUgdG8gY2xvc2UgZG9ja1xuLy8gaXRlbXMgdmlhIHRoZSBgQ2xvc2UgUGFuZWAgb3B0aW9uIGluIHRoZSBjb250ZXh0IG1lbnUgYW5kIHZpYSBBdG9tIEFQSXMsIHNvXG4vLyB5b3Ugc2hvdWxkIHN0aWxsIGJlIHByZXBhcmVkIHRvIGhhbmRsZSB5b3VyIGRvY2sgaXRlbXMgYmVpbmcgZGVzdHJveWVkIGJ5IHRoZVxuLy8gdXNlciBldmVuIGlmIHlvdSBpbXBsZW1lbnQgdGhpcyBtZXRob2QuXG4vL1xuLy8gIyMjIyBgc2F2ZSgpYFxuLy9cbi8vIFNhdmVzIHRoZSBpdGVtLlxuLy9cbi8vICMjIyMgYHNhdmVBcyhwYXRoKWBcbi8vXG4vLyBTYXZlcyB0aGUgaXRlbSB0byB0aGUgc3BlY2lmaWVkIHBhdGguXG4vL1xuLy8gIyMjIyBgZ2V0UGF0aCgpYFxuLy9cbi8vIFJldHVybnMgdGhlIGxvY2FsIHBhdGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgaXRlbS4gVGhpcyBpcyBvbmx5IHVzZWQgdG8gc2V0XG4vLyB0aGUgaW5pdGlhbCBsb2NhdGlvbiBvZiB0aGUgXCJzYXZlIGFzXCIgZGlhbG9nLlxuLy9cbi8vICMjIyMgYGlzTW9kaWZpZWQoKWBcbi8vXG4vLyBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGlzIG1vZGlmaWVkIHRvIHJlZmxlY3QgbW9kaWZpY2F0aW9uIGluIHRoZVxuLy8gVUkuXG4vL1xuLy8gIyMjIyBgb25EaWRDaGFuZ2VNb2RpZmllZCgpYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIGl0ZW0ncyBtb2RpZmllZCBzdGF0dXNcbi8vIGNoYW5nZXMuIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYGNvcHkoKWBcbi8vXG4vLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBpdGVtLiBJZiBkZWZpbmVkLCB0aGUgd29ya3NwYWNlIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCB0b1xuLy8gZHVwbGljYXRlIHRoZSBpdGVtIHdoZW4gc3BsaXR0aW5nIHBhbmVzIHZpYSBjZXJ0YWluIHNwbGl0IGNvbW1hbmRzLlxuLy9cbi8vICMjIyMgYGdldFByZWZlcnJlZEhlaWdodCgpYFxuLy9cbi8vIElmIHRoaXMgaXRlbSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGJvdHRvbSB7RG9ja30sIGNhbGxlZCBieSB0aGUgd29ya3NwYWNlIHdoZW5cbi8vIGluaXRpYWxseSBkaXNwbGF5aW5nIHRoZSBkb2NrIHRvIHNldCBpdHMgaGVpZ2h0LiBPbmNlIHRoZSBkb2NrIGhhcyBiZWVuXG4vLyByZXNpemVkIGJ5IHRoZSB1c2VyLCB0aGVpciBoZWlnaHQgd2lsbCBvdmVycmlkZSB0aGlzIHZhbHVlLlxuLy9cbi8vIFJldHVybnMgYSB7TnVtYmVyfS5cbi8vXG4vLyAjIyMjIGBnZXRQcmVmZXJyZWRXaWR0aCgpYFxuLy9cbi8vIElmIHRoaXMgaXRlbSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGxlZnQgb3IgcmlnaHQge0RvY2t9LCBjYWxsZWQgYnkgdGhlXG4vLyB3b3Jrc3BhY2Ugd2hlbiBpbml0aWFsbHkgZGlzcGxheWluZyB0aGUgZG9jayB0byBzZXQgaXRzIHdpZHRoLiBPbmNlIHRoZSBkb2NrXG4vLyBoYXMgYmVlbiByZXNpemVkIGJ5IHRoZSB1c2VyLCB0aGVpciB3aWR0aCB3aWxsIG92ZXJyaWRlIHRoaXMgdmFsdWUuXG4vL1xuLy8gUmV0dXJucyBhIHtOdW1iZXJ9LlxuLy9cbi8vICMjIyMgYG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlKGNhbGxiYWNrKWBcbi8vXG4vLyBJZiB0aGUgd29ya3NwYWNlIGlzIGNvbmZpZ3VyZWQgdG8gdXNlICpwZW5kaW5nIHBhbmUgaXRlbXMqLCB0aGUgd29ya3NwYWNlXG4vLyB3aWxsIHN1YnNjcmliZSB0byB0aGlzIG1ldGhvZCB0byB0ZXJtaW5hdGUgdGhlIHBlbmRpbmcgc3RhdGUgb2YgdGhlIGl0ZW0uXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBzaG91bGRQcm9tcHRUb1NhdmUoKWBcbi8vXG4vLyBUaGlzIG1ldGhvZCBpbmRpY2F0ZXMgd2hldGhlciBBdG9tIHNob3VsZCBwcm9tcHQgdGhlIHVzZXIgdG8gc2F2ZSB0aGlzIGl0ZW1cbi8vIHdoZW4gdGhlIHVzZXIgY2xvc2VzIG9yIHJlbG9hZHMgdGhlIHdpbmRvdy4gUmV0dXJucyBhIGJvb2xlYW4uXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFdvcmtzcGFjZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IgKHBhcmFtcykge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcblxuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUgPSB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlLmJpbmQodGhpcylcbiAgICB0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkID0gdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWREZXN0cm95UGFuZUl0ZW0gPSB0aGlzLmRpZERlc3Ryb3lQYW5lSXRlbS5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyID0gdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtT25QYW5lQ29udGFpbmVyID0gdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIgPSB0aGlzLmRpZEFjdGl2YXRlUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRIaWRlRG9jayA9IHRoaXMuZGlkSGlkZURvY2suYmluZCh0aGlzKVxuXG4gICAgdGhpcy5lbmFibGVQZXJzaXN0ZW5jZSA9IHBhcmFtcy5lbmFibGVQZXJzaXN0ZW5jZVxuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYXJhbXMucGFja2FnZU1hbmFnZXJcbiAgICB0aGlzLmNvbmZpZyA9IHBhcmFtcy5jb25maWdcbiAgICB0aGlzLnByb2plY3QgPSBwYXJhbXMucHJvamVjdFxuICAgIHRoaXMubm90aWZpY2F0aW9uTWFuYWdlciA9IHBhcmFtcy5ub3RpZmljYXRpb25NYW5hZ2VyXG4gICAgdGhpcy52aWV3UmVnaXN0cnkgPSBwYXJhbXMudmlld1JlZ2lzdHJ5XG4gICAgdGhpcy5ncmFtbWFyUmVnaXN0cnkgPSBwYXJhbXMuZ3JhbW1hclJlZ2lzdHJ5XG4gICAgdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlID0gcGFyYW1zLmFwcGxpY2F0aW9uRGVsZWdhdGVcbiAgICB0aGlzLmFzc2VydCA9IHBhcmFtcy5hc3NlcnRcbiAgICB0aGlzLmRlc2VyaWFsaXplck1hbmFnZXIgPSBwYXJhbXMuZGVzZXJpYWxpemVyTWFuYWdlclxuICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5ID0gcGFyYW1zLnRleHRFZGl0b3JSZWdpc3RyeVxuICAgIHRoaXMuc3R5bGVNYW5hZ2VyID0gcGFyYW1zLnN0eWxlTWFuYWdlclxuICAgIHRoaXMuZHJhZ2dpbmdJdGVtID0gZmFsc2VcbiAgICB0aGlzLml0ZW1Mb2NhdGlvblN0b3JlID0gbmV3IFN0YXRlU3RvcmUoJ0F0b21QcmV2aW91c0l0ZW1Mb2NhdGlvbnMnLCAxKVxuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMub3BlbmVycyA9IFtdXG4gICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcyA9IFtdXG4gICAgdGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgPSBudWxsXG5cbiAgICB0aGlzLmRlZmF1bHREaXJlY3RvcnlTZWFyY2hlciA9IG5ldyBEZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXIoKVxuICAgIHRoaXMuY29uc3VtZVNlcnZpY2VzKHRoaXMucGFja2FnZU1hbmFnZXIpXG5cbiAgICB0aGlzLnBhbmVDb250YWluZXJzID0ge1xuICAgICAgY2VudGVyOiB0aGlzLmNyZWF0ZUNlbnRlcigpLFxuICAgICAgbGVmdDogdGhpcy5jcmVhdGVEb2NrKCdsZWZ0JyksXG4gICAgICByaWdodDogdGhpcy5jcmVhdGVEb2NrKCdyaWdodCcpLFxuICAgICAgYm90dG9tOiB0aGlzLmNyZWF0ZURvY2soJ2JvdHRvbScpXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lciA9IHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyXG5cbiAgICB0aGlzLnBhbmVsQ29udGFpbmVycyA9IHtcbiAgICAgIHRvcDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ3RvcCd9KSxcbiAgICAgIGxlZnQ6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdsZWZ0JywgZG9jazogdGhpcy5wYW5lQ29udGFpbmVycy5sZWZ0fSksXG4gICAgICByaWdodDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ3JpZ2h0JywgZG9jazogdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodH0pLFxuICAgICAgYm90dG9tOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnYm90dG9tJywgZG9jazogdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b219KSxcbiAgICAgIGhlYWRlcjogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2hlYWRlcid9KSxcbiAgICAgIGZvb3RlcjogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2Zvb3Rlcid9KSxcbiAgICAgIG1vZGFsOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnbW9kYWwnfSlcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmliZVRvRXZlbnRzKClcbiAgfVxuXG4gIGdldCBwYW5lQ29udGFpbmVyICgpIHtcbiAgICBHcmltLmRlcHJlY2F0ZSgnYGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJgIGhhcyBhbHdheXMgYmVlbiBwcml2YXRlLCBidXQgaXQgaXMgbm93IGdvbmUuIFBsZWFzZSB1c2UgYGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpYCBpbnN0ZWFkIGFuZCBjb25zdWx0IHRoZSB3b3Jrc3BhY2UgQVBJIGRvY3MgZm9yIHB1YmxpYyBtZXRob2RzLicpXG4gICAgcmV0dXJuIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLnBhbmVDb250YWluZXJcbiAgfVxuXG4gIGdldEVsZW1lbnQgKCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBuZXcgV29ya3NwYWNlRWxlbWVudCgpLmluaXRpYWxpemUodGhpcywge1xuICAgICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgICBwcm9qZWN0OiB0aGlzLnByb2plY3QsXG4gICAgICAgIHZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksXG4gICAgICAgIHN0eWxlTWFuYWdlcjogdGhpcy5zdHlsZU1hbmFnZXJcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRcbiAgfVxuXG4gIGNyZWF0ZUNlbnRlciAoKSB7XG4gICAgcmV0dXJuIG5ldyBXb3Jrc3BhY2VDZW50ZXIoe1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGFwcGxpY2F0aW9uRGVsZWdhdGU6IHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZSxcbiAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IHRoaXMubm90aWZpY2F0aW9uTWFuYWdlcixcbiAgICAgIGRlc2VyaWFsaXplck1hbmFnZXI6IHRoaXMuZGVzZXJpYWxpemVyTWFuYWdlcixcbiAgICAgIHZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksXG4gICAgICBkaWRBY3RpdmF0ZTogdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lOiB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVPblBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lcixcbiAgICAgIGRpZERlc3Ryb3lQYW5lSXRlbTogdGhpcy5kaWREZXN0cm95UGFuZUl0ZW1cbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlRG9jayAobG9jYXRpb24pIHtcbiAgICByZXR1cm4gbmV3IERvY2soe1xuICAgICAgbG9jYXRpb24sXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgYXBwbGljYXRpb25EZWxlZ2F0ZTogdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLFxuICAgICAgZGVzZXJpYWxpemVyTWFuYWdlcjogdGhpcy5kZXNlcmlhbGl6ZXJNYW5hZ2VyLFxuICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcjogdGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyLFxuICAgICAgdmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSxcbiAgICAgIGRpZEhpZGU6IHRoaXMuZGlkSGlkZURvY2ssXG4gICAgICBkaWRBY3RpdmF0ZTogdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lOiB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVPblBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lcixcbiAgICAgIGRpZERlc3Ryb3lQYW5lSXRlbTogdGhpcy5kaWREZXN0cm95UGFuZUl0ZW1cbiAgICB9KVxuICB9XG5cbiAgcmVzZXQgKHBhY2thZ2VNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYWNrYWdlTWFuYWdlciA9IHBhY2thZ2VNYW5hZ2VyXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc3Ryb3koKVxuXG4gICAgXy52YWx1ZXModGhpcy5wYW5lbENvbnRhaW5lcnMpLmZvckVhY2gocGFuZWxDb250YWluZXIgPT4geyBwYW5lbENvbnRhaW5lci5kZXN0cm95KCkgfSlcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMgPSB7XG4gICAgICBjZW50ZXI6IHRoaXMuY3JlYXRlQ2VudGVyKCksXG4gICAgICBsZWZ0OiB0aGlzLmNyZWF0ZURvY2soJ2xlZnQnKSxcbiAgICAgIHJpZ2h0OiB0aGlzLmNyZWF0ZURvY2soJ3JpZ2h0JyksXG4gICAgICBib3R0b206IHRoaXMuY3JlYXRlRG9jaygnYm90dG9tJylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXJcblxuICAgIHRoaXMucGFuZWxDb250YWluZXJzID0ge1xuICAgICAgdG9wOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAndG9wJ30pLFxuICAgICAgbGVmdDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2xlZnQnLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLmxlZnR9KSxcbiAgICAgIHJpZ2h0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAncmlnaHQnLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0fSksXG4gICAgICBib3R0b206IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdib3R0b20nLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbX0pLFxuICAgICAgaGVhZGVyOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnaGVhZGVyJ30pLFxuICAgICAgZm9vdGVyOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnZm9vdGVyJ30pLFxuICAgICAgbW9kYWw6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdtb2RhbCd9KVxuICAgIH1cblxuICAgIHRoaXMub3JpZ2luYWxGb250U2l6ZSA9IG51bGxcbiAgICB0aGlzLm9wZW5lcnMgPSBbXVxuICAgIHRoaXMuZGVzdHJveWVkSXRlbVVSSXMgPSBbXVxuICAgIHRoaXMuZWxlbWVudCA9IG51bGxcbiAgICB0aGlzLmNvbnN1bWVTZXJ2aWNlcyh0aGlzLnBhY2thZ2VNYW5hZ2VyKVxuICB9XG5cbiAgc3Vic2NyaWJlVG9FdmVudHMgKCkge1xuICAgIHRoaXMucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgdGhpcy5zdWJzY3JpYmVUb0ZvbnRTaXplKClcbiAgICB0aGlzLnN1YnNjcmliZVRvQWRkZWRJdGVtcygpXG4gICAgdGhpcy5zdWJzY3JpYmVUb01vdmVkSXRlbXMoKVxuICB9XG5cbiAgY29uc3VtZVNlcnZpY2VzICh7c2VydmljZUh1Yn0pIHtcbiAgICB0aGlzLmRpcmVjdG9yeVNlYXJjaGVycyA9IFtdXG4gICAgc2VydmljZUh1Yi5jb25zdW1lKFxuICAgICAgJ2F0b20uZGlyZWN0b3J5LXNlYXJjaGVyJyxcbiAgICAgICdeMC4xLjAnLFxuICAgICAgcHJvdmlkZXIgPT4gdGhpcy5kaXJlY3RvcnlTZWFyY2hlcnMudW5zaGlmdChwcm92aWRlcilcbiAgICApXG4gIH1cblxuICAvLyBDYWxsZWQgYnkgdGhlIFNlcmlhbGl6YWJsZSBtaXhpbiBkdXJpbmcgc2VyaWFsaXphdGlvbi5cbiAgc2VyaWFsaXplICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnV29ya3NwYWNlJyxcbiAgICAgIHBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzOiB0aGlzLmdldFBhY2thZ2VOYW1lc1dpdGhBY3RpdmVHcmFtbWFycygpLFxuICAgICAgZGVzdHJveWVkSXRlbVVSSXM6IHRoaXMuZGVzdHJveWVkSXRlbVVSSXMuc2xpY2UoKSxcbiAgICAgIC8vIEVuc3VyZSBkZXNlcmlhbGl6aW5nIDEuMTcgc3RhdGUgd2l0aCBwcmUgMS4xNyBBdG9tIGRvZXMgbm90IGVycm9yXG4gICAgICAvLyBUT0RPOiBSZW1vdmUgYWZ0ZXIgMS4xNyBoYXMgYmVlbiBvbiBzdGFibGUgZm9yIGEgd2hpbGVcbiAgICAgIHBhbmVDb250YWluZXI6IHt2ZXJzaW9uOiAyfSxcbiAgICAgIHBhbmVDb250YWluZXJzOiB7XG4gICAgICAgIGNlbnRlcjogdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIuc2VyaWFsaXplKCksXG4gICAgICAgIGxlZnQ6IHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5zZXJpYWxpemUoKSxcbiAgICAgICAgcmlnaHQ6IHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHQuc2VyaWFsaXplKCksXG4gICAgICAgIGJvdHRvbTogdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b20uc2VyaWFsaXplKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXNlcmlhbGl6ZSAoc3RhdGUsIGRlc2VyaWFsaXplck1hbmFnZXIpIHtcbiAgICBjb25zdCBwYWNrYWdlc1dpdGhBY3RpdmVHcmFtbWFycyA9XG4gICAgICBzdGF0ZS5wYWNrYWdlc1dpdGhBY3RpdmVHcmFtbWFycyAhPSBudWxsID8gc3RhdGUucGFja2FnZXNXaXRoQWN0aXZlR3JhbW1hcnMgOiBbXVxuICAgIGZvciAobGV0IHBhY2thZ2VOYW1lIG9mIHBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzKSB7XG4gICAgICBjb25zdCBwa2cgPSB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldExvYWRlZFBhY2thZ2UocGFja2FnZU5hbWUpXG4gICAgICBpZiAocGtnICE9IG51bGwpIHtcbiAgICAgICAgcGtnLmxvYWRHcmFtbWFyc1N5bmMoKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3RhdGUuZGVzdHJveWVkSXRlbVVSSXMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcyA9IHN0YXRlLmRlc3Ryb3llZEl0ZW1VUklzXG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnBhbmVDb250YWluZXJzKSB7XG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5jZW50ZXIsIGRlc2VyaWFsaXplck1hbmFnZXIpXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQuZGVzZXJpYWxpemUoc3RhdGUucGFuZUNvbnRhaW5lcnMubGVmdCwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHQuZGVzZXJpYWxpemUoc3RhdGUucGFuZUNvbnRhaW5lcnMucmlnaHQsIGRlc2VyaWFsaXplck1hbmFnZXIpXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5ib3R0b20sIGRlc2VyaWFsaXplck1hbmFnZXIpXG4gICAgfSBlbHNlIGlmIChzdGF0ZS5wYW5lQ29udGFpbmVyKSB7XG4gICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBmYWxsYmFjayBvbmNlIGEgbG90IG9mIHRpbWUgaGFzIHBhc3NlZCBzaW5jZSAxLjE3IHdhcyByZWxlYXNlZFxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIuZGVzZXJpYWxpemUoc3RhdGUucGFuZUNvbnRhaW5lciwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlKClcbiAgfVxuXG4gIGdldFBhY2thZ2VOYW1lc1dpdGhBY3RpdmVHcmFtbWFycyAoKSB7XG4gICAgY29uc3QgcGFja2FnZU5hbWVzID0gW11cbiAgICBjb25zdCBhZGRHcmFtbWFyID0gKHtpbmNsdWRlZEdyYW1tYXJTY29wZXMsIHBhY2thZ2VOYW1lfSA9IHt9KSA9PiB7XG4gICAgICBpZiAoIXBhY2thZ2VOYW1lKSB7IHJldHVybiB9XG4gICAgICAvLyBQcmV2ZW50IGN5Y2xlc1xuICAgICAgaWYgKHBhY2thZ2VOYW1lcy5pbmRleE9mKHBhY2thZ2VOYW1lKSAhPT0gLTEpIHsgcmV0dXJuIH1cblxuICAgICAgcGFja2FnZU5hbWVzLnB1c2gocGFja2FnZU5hbWUpXG4gICAgICBmb3IgKGxldCBzY29wZU5hbWUgb2YgaW5jbHVkZWRHcmFtbWFyU2NvcGVzICE9IG51bGwgPyBpbmNsdWRlZEdyYW1tYXJTY29wZXMgOiBbXSkge1xuICAgICAgICBhZGRHcmFtbWFyKHRoaXMuZ3JhbW1hclJlZ2lzdHJ5LmdyYW1tYXJGb3JTY29wZU5hbWUoc2NvcGVOYW1lKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3JzID0gdGhpcy5nZXRUZXh0RWRpdG9ycygpXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIGVkaXRvcnMpIHsgYWRkR3JhbW1hcihlZGl0b3IuZ2V0R3JhbW1hcigpKSB9XG5cbiAgICBpZiAoZWRpdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBncmFtbWFyIG9mIHRoaXMuZ3JhbW1hclJlZ2lzdHJ5LmdldEdyYW1tYXJzKCkpIHtcbiAgICAgICAgaWYgKGdyYW1tYXIuaW5qZWN0aW9uU2VsZWN0b3IpIHtcbiAgICAgICAgICBhZGRHcmFtbWFyKGdyYW1tYXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXy51bmlxKHBhY2thZ2VOYW1lcylcbiAgfVxuXG4gIGRpZEFjdGl2YXRlUGFuZUNvbnRhaW5lciAocGFuZUNvbnRhaW5lcikge1xuICAgIGlmIChwYW5lQ29udGFpbmVyICE9PSB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKSkge1xuICAgICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gcGFuZUNvbnRhaW5lclxuICAgICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSh0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWNvbnRhaW5lcicsIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lcilcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lJywgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyLmdldEFjdGl2ZVBhbmUoKSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyIChwYW5lQ29udGFpbmVyLCBwYW5lKSB7XG4gICAgaWYgKHBhbmVDb250YWluZXIgPT09IHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1hY3RpdmUtcGFuZScsIHBhbmUpXG4gICAgfVxuICB9XG5cbiAgZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW1PblBhbmVDb250YWluZXIgKHBhbmVDb250YWluZXIsIGl0ZW0pIHtcbiAgICBpZiAocGFuZUNvbnRhaW5lciA9PT0gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkpIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oaXRlbSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCBpdGVtKVxuICAgIH1cbiAgfVxuXG4gIGRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSB7XG4gICAgdGhpcy51cGRhdGVXaW5kb3dUaXRsZSgpXG4gICAgdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZCgpXG4gICAgaWYgKHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMpIHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGxldCBtb2RpZmllZFN1YnNjcmlwdGlvbiwgdGl0bGVTdWJzY3JpcHRpb25cblxuICAgIGlmIChpdGVtICE9IG51bGwgJiYgdHlwZW9mIGl0ZW0ub25EaWRDaGFuZ2VUaXRsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGl0bGVTdWJzY3JpcHRpb24gPSBpdGVtLm9uRGlkQ2hhbmdlVGl0bGUodGhpcy51cGRhdGVXaW5kb3dUaXRsZSlcbiAgICB9IGVsc2UgaWYgKGl0ZW0gIT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGl0bGVTdWJzY3JpcHRpb24gPSBpdGVtLm9uKCd0aXRsZS1jaGFuZ2VkJywgdGhpcy51cGRhdGVXaW5kb3dUaXRsZSlcbiAgICAgIGlmICh0aXRsZVN1YnNjcmlwdGlvbiA9PSBudWxsIHx8IHR5cGVvZiB0aXRsZVN1YnNjcmlwdGlvbi5kaXNwb3NlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRpdGxlU3Vic2NyaXB0aW9uID0gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICAgIGl0ZW0ub2ZmKCd0aXRsZS1jaGFuZ2VkJywgdGhpcy51cGRhdGVXaW5kb3dUaXRsZSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLm9uRGlkQ2hhbmdlTW9kaWZpZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZGlmaWVkU3Vic2NyaXB0aW9uID0gaXRlbS5vbkRpZENoYW5nZU1vZGlmaWVkKHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQpXG4gICAgfSBlbHNlIGlmIChpdGVtICE9IG51bGwgJiYgdHlwZW9mIGl0ZW0ub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZGlmaWVkU3Vic2NyaXB0aW9uID0gaXRlbS5vbignbW9kaWZpZWQtc3RhdHVzLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkKVxuICAgICAgaWYgKG1vZGlmaWVkU3Vic2NyaXB0aW9uID09IG51bGwgfHwgdHlwZW9mIG1vZGlmaWVkU3Vic2NyaXB0aW9uLmRpc3Bvc2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbW9kaWZpZWRTdWJzY3JpcHRpb24gPSBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgICAgaXRlbS5vZmYoJ21vZGlmaWVkLXN0YXR1cy1jaGFuZ2VkJywgdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGl0bGVTdWJzY3JpcHRpb24gIT0gbnVsbCkgeyB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmFkZCh0aXRsZVN1YnNjcmlwdGlvbikgfVxuICAgIGlmIChtb2RpZmllZFN1YnNjcmlwdGlvbiAhPSBudWxsKSB7IHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMuYWRkKG1vZGlmaWVkU3Vic2NyaXB0aW9uKSB9XG5cbiAgICB0aGlzLmNhbmNlbFN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCgpXG4gICAgdGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0ID0gbnVsbFxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nLWFjdGl2ZS1wYW5lLWl0ZW0nLCBpdGVtKVxuICAgIH0sIFNUT1BQRURfQ0hBTkdJTkdfQUNUSVZFX1BBTkVfSVRFTV9ERUxBWSlcbiAgfVxuXG4gIGNhbmNlbFN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCAoKSB7XG4gICAgaWYgKHRoaXMuc3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0ICE9IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dClcbiAgICB9XG4gIH1cblxuICBkaWRIaWRlRG9jayAoKSB7XG4gICAgdGhpcy5nZXRDZW50ZXIoKS5hY3RpdmF0ZSgpXG4gIH1cblxuICBzZXREcmFnZ2luZ0l0ZW0gKGRyYWdnaW5nSXRlbSkge1xuICAgIF8udmFsdWVzKHRoaXMucGFuZUNvbnRhaW5lcnMpLmZvckVhY2goZG9jayA9PiB7XG4gICAgICBkb2NrLnNldERyYWdnaW5nSXRlbShkcmFnZ2luZ0l0ZW0pXG4gICAgfSlcbiAgfVxuXG4gIHN1YnNjcmliZVRvQWRkZWRJdGVtcyAoKSB7XG4gICAgdGhpcy5vbkRpZEFkZFBhbmVJdGVtKCh7aXRlbSwgcGFuZSwgaW5kZXh9KSA9PiB7XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5LmFkZChpdGVtKSxcbiAgICAgICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5tYWludGFpbkdyYW1tYXIoaXRlbSksXG4gICAgICAgICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkubWFpbnRhaW5Db25maWcoaXRlbSksXG4gICAgICAgICAgaXRlbS5vYnNlcnZlR3JhbW1hcih0aGlzLmhhbmRsZUdyYW1tYXJVc2VkLmJpbmQodGhpcykpXG4gICAgICAgIClcbiAgICAgICAgaXRlbS5vbkRpZERlc3Ryb3koKCkgPT4geyBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKSB9KVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWFkZC10ZXh0LWVkaXRvcicsIHt0ZXh0RWRpdG9yOiBpdGVtLCBwYW5lLCBpbmRleH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN1YnNjcmliZVRvTW92ZWRJdGVtcyAoKSB7XG4gICAgZm9yIChjb25zdCBwYW5lQ29udGFpbmVyIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgcGFuZUNvbnRhaW5lci5vYnNlcnZlUGFuZXMocGFuZSA9PiB7XG4gICAgICAgIHBhbmUub25EaWRBZGRJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nICYmIHRoaXMuZW5hYmxlUGVyc2lzdGVuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHVyaSA9IGl0ZW0uZ2V0VVJJKClcbiAgICAgICAgICAgIGlmICh1cmkpIHtcbiAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBwYW5lQ29udGFpbmVyLmdldExvY2F0aW9uKClcbiAgICAgICAgICAgICAgbGV0IGRlZmF1bHRMb2NhdGlvblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0RGVmYXVsdExvY2F0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uID0gaXRlbS5nZXREZWZhdWx0TG9jYXRpb24oKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRlZmF1bHRMb2NhdGlvbiA9IGRlZmF1bHRMb2NhdGlvbiB8fCAnY2VudGVyJ1xuICAgICAgICAgICAgICBpZiAobG9jYXRpb24gPT09IGRlZmF1bHRMb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbUxvY2F0aW9uU3RvcmUuZGVsZXRlKGl0ZW0uZ2V0VVJJKCkpXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtTG9jYXRpb25TdG9yZS5zYXZlKGl0ZW0uZ2V0VVJJKCksIGxvY2F0aW9uKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGVzIHRoZSBhcHBsaWNhdGlvbidzIHRpdGxlIGFuZCBwcm94eSBpY29uIGJhc2VkIG9uIHdoaWNoZXZlciBmaWxlIGlzXG4gIC8vIG9wZW4uXG4gIHVwZGF0ZVdpbmRvd1RpdGxlICgpIHtcbiAgICBsZXQgaXRlbVBhdGgsIGl0ZW1UaXRsZSwgcHJvamVjdFBhdGgsIHJlcHJlc2VudGVkUGF0aFxuICAgIGNvbnN0IGFwcE5hbWUgPSAnQXRvbSdcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBsZWZ0ICE9IG51bGwgPyBsZWZ0IDogW11cbiAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW1QYXRoID0gdHlwZW9mIGl0ZW0uZ2V0UGF0aCA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0UGF0aCgpIDogdW5kZWZpbmVkXG4gICAgICBjb25zdCBsb25nVGl0bGUgPSB0eXBlb2YgaXRlbS5nZXRMb25nVGl0bGUgPT09ICdmdW5jdGlvbicgPyBpdGVtLmdldExvbmdUaXRsZSgpIDogdW5kZWZpbmVkXG4gICAgICBpdGVtVGl0bGUgPSBsb25nVGl0bGUgPT0gbnVsbFxuICAgICAgICA/ICh0eXBlb2YgaXRlbS5nZXRUaXRsZSA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0VGl0bGUoKSA6IHVuZGVmaW5lZClcbiAgICAgICAgOiBsb25nVGl0bGVcbiAgICAgIHByb2plY3RQYXRoID0gXy5maW5kKFxuICAgICAgICBwcm9qZWN0UGF0aHMsXG4gICAgICAgIHByb2plY3RQYXRoID0+XG4gICAgICAgICAgKGl0ZW1QYXRoID09PSBwcm9qZWN0UGF0aCkgfHwgKGl0ZW1QYXRoICE9IG51bGwgPyBpdGVtUGF0aC5zdGFydHNXaXRoKHByb2plY3RQYXRoICsgcGF0aC5zZXApIDogdW5kZWZpbmVkKVxuICAgICAgKVxuICAgIH1cbiAgICBpZiAoaXRlbVRpdGxlID09IG51bGwpIHsgaXRlbVRpdGxlID0gJ3VudGl0bGVkJyB9XG4gICAgaWYgKHByb2plY3RQYXRoID09IG51bGwpIHsgcHJvamVjdFBhdGggPSBpdGVtUGF0aCA/IHBhdGguZGlybmFtZShpdGVtUGF0aCkgOiBwcm9qZWN0UGF0aHNbMF0gfVxuICAgIGlmIChwcm9qZWN0UGF0aCAhPSBudWxsKSB7XG4gICAgICBwcm9qZWN0UGF0aCA9IGZzLnRpbGRpZnkocHJvamVjdFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGVQYXJ0cyA9IFtdXG4gICAgaWYgKChpdGVtICE9IG51bGwpICYmIChwcm9qZWN0UGF0aCAhPSBudWxsKSkge1xuICAgICAgdGl0bGVQYXJ0cy5wdXNoKGl0ZW1UaXRsZSwgcHJvamVjdFBhdGgpXG4gICAgICByZXByZXNlbnRlZFBhdGggPSBpdGVtUGF0aCAhPSBudWxsID8gaXRlbVBhdGggOiBwcm9qZWN0UGF0aFxuICAgIH0gZWxzZSBpZiAocHJvamVjdFBhdGggIT0gbnVsbCkge1xuICAgICAgdGl0bGVQYXJ0cy5wdXNoKHByb2plY3RQYXRoKVxuICAgICAgcmVwcmVzZW50ZWRQYXRoID0gcHJvamVjdFBhdGhcbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGVQYXJ0cy5wdXNoKGl0ZW1UaXRsZSlcbiAgICAgIHJlcHJlc2VudGVkUGF0aCA9ICcnXG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2goYXBwTmFtZSlcbiAgICB9XG5cbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlUGFydHMuam9pbignIFxcdTIwMTQgJylcbiAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuc2V0UmVwcmVzZW50ZWRGaWxlbmFtZShyZXByZXNlbnRlZFBhdGgpXG4gIH1cblxuICAvLyBPbiBtYWNPUywgZmFkZXMgdGhlIGFwcGxpY2F0aW9uIHdpbmRvdydzIHByb3h5IGljb24gd2hlbiB0aGUgY3VycmVudCBmaWxlXG4gIC8vIGhhcyBiZWVuIG1vZGlmaWVkLlxuICB1cGRhdGVEb2N1bWVudEVkaXRlZCAoKSB7XG4gICAgY29uc3QgYWN0aXZlUGFuZUl0ZW0gPSB0aGlzLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBjb25zdCBtb2RpZmllZCA9IGFjdGl2ZVBhbmVJdGVtICE9IG51bGwgJiYgdHlwZW9mIGFjdGl2ZVBhbmVJdGVtLmlzTW9kaWZpZWQgPT09ICdmdW5jdGlvbidcbiAgICAgID8gYWN0aXZlUGFuZUl0ZW0uaXNNb2RpZmllZCgpIHx8IGZhbHNlXG4gICAgICA6IGZhbHNlXG4gICAgdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLnNldFdpbmRvd0RvY3VtZW50RWRpdGVkKG1vZGlmaWVkKVxuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogRXZlbnQgU3Vic2NyaXB0aW9uXG4gICovXG5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lQ29udGFpbmVyIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtY29udGFpbmVyJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCBhbGwgY3VycmVudCBhbmQgZnV0dXJlIHRleHRcbiAgLy8gZWRpdG9ycyBpbiB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2l0aCBjdXJyZW50IGFuZCBmdXR1cmUgdGV4dCBlZGl0b3JzLlxuICAvLyAgICogYGVkaXRvcmAgQW4ge1RleHRFZGl0b3J9IHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRUZXh0RWRpdG9yc30gYXQgdGhlIHRpbWVcbiAgLy8gICAgIG9mIHN1YnNjcmlwdGlvbiBvciB0aGF0IGlzIGFkZGVkIGF0IHNvbWUgbGF0ZXIgdGltZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZVRleHRFZGl0b3JzIChjYWxsYmFjaykge1xuICAgIGZvciAobGV0IHRleHRFZGl0b3Igb2YgdGhpcy5nZXRUZXh0RWRpdG9ycygpKSB7IGNhbGxiYWNrKHRleHRFZGl0b3IpIH1cbiAgICByZXR1cm4gdGhpcy5vbkRpZEFkZFRleHRFZGl0b3IoKHt0ZXh0RWRpdG9yfSkgPT4gY2FsbGJhY2sodGV4dEVkaXRvcikpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCBhbGwgY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzIGl0ZW1zXG4gIC8vIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSBwYW5lIGl0ZW1zLlxuICAvLyAgICogYGl0ZW1gIEFuIGl0ZW0gdGhhdCBpcyBwcmVzZW50IGluIHs6OmdldFBhbmVJdGVtc30gYXQgdGhlIHRpbWUgb2ZcbiAgLy8gICAgICBzdWJzY3JpcHRpb24gb3IgdGhhdCBpcyBhZGRlZCBhdCBzb21lIGxhdGVyIHRpbWUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVQYW5lSXRlbXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9ic2VydmVQYW5lSXRlbXMoY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXMuXG4gIC8vXG4gIC8vIEJlY2F1c2Ugb2JzZXJ2ZXJzIGFyZSBpbnZva2VkIHN5bmNocm9ub3VzbHksIGl0J3MgaW1wb3J0YW50IG5vdCB0byBwZXJmb3JtXG4gIC8vIGFueSBleHBlbnNpdmUgb3BlcmF0aW9ucyB2aWEgdGhpcyBtZXRob2QuIENvbnNpZGVyXG4gIC8vIHs6Om9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW19IHRvIGRlbGF5IG9wZXJhdGlvbnMgdW50aWwgYWZ0ZXIgY2hhbmdlc1xuICAvLyBzdG9wIG9jY3VycmluZy5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gY2hhbmdlcy5cbiAgLy8gICAqIGBpdGVtYCBUaGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIHN0b3BzXG4gIC8vIGNoYW5naW5nLlxuICAvL1xuICAvLyBPYnNlcnZlcnMgYXJlIGNhbGxlZCBhc3luY2hyb25vdXNseSAxMDBtcyBhZnRlciB0aGUgbGFzdCBhY3RpdmUgcGFuZSBpdGVtXG4gIC8vIGNoYW5nZS4gSGFuZGxpbmcgY2hhbmdlcyBoZXJlIHJhdGhlciB0aGFuIGluIHRoZSBzeW5jaHJvbm91c1xuICAvLyB7OjpvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtfSBwcmV2ZW50cyB1bm5lZWRlZCB3b3JrIGlmIHRoZSB1c2VyIGlzIHF1aWNrbHlcbiAgLy8gY2hhbmdpbmcgb3IgY2xvc2luZyB0YWJzIGFuZCBlbnN1cmVzIGNyaXRpY2FsIFVJIGZlZWRiYWNrLCBsaWtlIGNoYW5naW5nIHRoZVxuICAvLyBoaWdobGlnaHRlZCB0YWIsIGdldHMgcHJpb3JpdHkgb3ZlciB3b3JrIHRoYXQgY2FuIGJlIGRvbmUgYXN5bmNocm9ub3VzbHkuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIHN0b3B0c1xuICAvLyAgIGNoYW5naW5nLlxuICAvLyAgICogYGl0ZW1gIFRoZSBhY3RpdmUgcGFuZSBpdGVtLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zdG9wLWNoYW5naW5nLWFjdGl2ZS1wYW5lLWl0ZW0nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lIGl0ZW0gYW5kXG4gIC8vIHdpdGggYWxsIGZ1dHVyZSBhY3RpdmUgcGFuZSBpdGVtcyBpbiB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBjaGFuZ2VzLlxuICAvLyAgICogYGl0ZW1gIFRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lIGl0ZW0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVBY3RpdmVQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0aGlzLmdldEFjdGl2ZVBhbmVJdGVtKCkpXG4gICAgcmV0dXJuIHRoaXMub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuZXZlciBhbiBpdGVtIGlzIG9wZW5lZC4gVW5saWtlXG4gIC8vIHs6Om9uRGlkQWRkUGFuZUl0ZW19LCBvYnNlcnZlcnMgd2lsbCBiZSBub3RpZmllZCBmb3IgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeVxuICAvLyBwcmVzZW50IGluIHRoZSB3b3Jrc3BhY2Ugd2hlbiB0aGV5IGFyZSByZW9wZW5lZC5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW5ldmVyIGFuIGl0ZW0gaXMgb3BlbmVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHVyaWAge1N0cmluZ30gcmVwcmVzZW50aW5nIHRoZSBvcGVuZWQgVVJJLiBDb3VsZCBiZSBgdW5kZWZpbmVkYC5cbiAgLy8gICAgICogYGl0ZW1gIFRoZSBvcGVuZWQgaXRlbS5cbiAgLy8gICAgICogYHBhbmVgIFRoZSBwYW5lIGluIHdoaWNoIHRoZSBpdGVtIHdhcyBvcGVuZWQuXG4gIC8vICAgICAqIGBpbmRleGAgVGhlIGluZGV4IG9mIHRoZSBvcGVuZWQgaXRlbSBvbiBpdHMgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRPcGVuIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1vcGVuJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpcyBhZGRlZCB0byB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgcGFuZXMgYXJlIGFkZGVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHBhbmVgIFRoZSBhZGRlZCBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZEFkZFBhbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uRGlkQWRkUGFuZShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgYmVmb3JlIGEgcGFuZSBpcyBkZXN0cm95ZWQgaW4gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIGJlZm9yZSBwYW5lcyBhcmUgZGVzdHJveWVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHBhbmVgIFRoZSBwYW5lIHRvIGJlIGRlc3Ryb3llZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25XaWxsRGVzdHJveVBhbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uV2lsbERlc3Ryb3lQYW5lKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpcyBkZXN0cm95ZWQgaW4gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHBhbmVzIGFyZSBkZXN0cm95ZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgcGFuZWAgVGhlIGRlc3Ryb3llZCBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZERlc3Ryb3lQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbkRpZERlc3Ryb3lQYW5lKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIGFsbCBjdXJyZW50IGFuZCBmdXR1cmUgcGFuZXMgaW4gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdpdGggY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzLlxuICAvLyAgICogYHBhbmVgIEEge1BhbmV9IHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRQYW5lc30gYXQgdGhlIHRpbWUgb2ZcbiAgLy8gICAgICBzdWJzY3JpcHRpb24gb3IgdGhhdCBpcyBhZGRlZCBhdCBzb21lIGxhdGVyIHRpbWUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVQYW5lcyAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub2JzZXJ2ZVBhbmVzKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBjaGFuZ2VzLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHBhbmUgY2hhbmdlcy5cbiAgLy8gICAqIGBwYW5lYCBBIHtQYW5lfSB0aGF0IGlzIHRoZSBjdXJyZW50IHJldHVybiB2YWx1ZSBvZiB7OjpnZXRBY3RpdmVQYW5lfS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUgYW5kIHdoZW5cbiAgLy8gdGhlIGFjdGl2ZSBwYW5lIGNoYW5nZXMuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIHRoZSBjdXJyZW50IGFuZCBmdXR1cmUgYWN0aXZlI1xuICAvLyAgIHBhbmVzLlxuICAvLyAgICogYHBhbmVgIEEge1BhbmV9IHRoYXQgaXMgdGhlIGN1cnJlbnQgcmV0dXJuIHZhbHVlIG9mIHs6OmdldEFjdGl2ZVBhbmV9LlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlQWN0aXZlUGFuZSAoY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0aGlzLmdldEFjdGl2ZVBhbmUoKSlcbiAgICByZXR1cm4gdGhpcy5vbkRpZENoYW5nZUFjdGl2ZVBhbmUoY2FsbGJhY2spXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpdGVtIGlzIGFkZGVkIHRvIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHBhbmUgaXRlbXMgYXJlIGFkZGVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYGl0ZW1gIFRoZSBhZGRlZCBwYW5lIGl0ZW0uXG4gIC8vICAgICAqIGBwYW5lYCB7UGFuZX0gY29udGFpbmluZyB0aGUgYWRkZWQgaXRlbS5cbiAgLy8gICAgICogYGluZGV4YCB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBpbmRleCBvZiB0aGUgYWRkZWQgaXRlbSBpbiBpdHMgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRBZGRQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub25EaWRBZGRQYW5lSXRlbShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXRlbSBpcyBhYm91dCB0byBiZVxuICAvLyBkZXN0cm95ZWQsIGJlZm9yZSB0aGUgdXNlciBpcyBwcm9tcHRlZCB0byBzYXZlIGl0LlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgYmVmb3JlIHBhbmUgaXRlbXMgYXJlIGRlc3Ryb3llZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBpdGVtYCBUaGUgaXRlbSB0byBiZSBkZXN0cm95ZWQuXG4gIC8vICAgICAqIGBwYW5lYCB7UGFuZX0gY29udGFpbmluZyB0aGUgaXRlbSB0byBiZSBkZXN0cm95ZWQuXG4gIC8vICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gdG8gYmUgZGVzdHJveWVkIGluXG4gIC8vICAgICAgIGl0cyBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25XaWxsRGVzdHJveVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbldpbGxEZXN0cm95UGFuZUl0ZW0oY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gYSBwYW5lIGl0ZW0gaXMgZGVzdHJveWVkLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiBwYW5lIGl0ZW1zIGFyZSBkZXN0cm95ZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgaXRlbWAgVGhlIGRlc3Ryb3llZCBpdGVtLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGRlc3Ryb3llZCBpdGVtLlxuICAvLyAgICAgKiBgaW5kZXhgIHtOdW1iZXJ9IGluZGljYXRpbmcgdGhlIGluZGV4IG9mIHRoZSBkZXN0cm95ZWQgaXRlbSBpbiBpdHNcbiAgLy8gICAgICAgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2VgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkRGVzdHJveVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbkRpZERlc3Ryb3lQYW5lSXRlbShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHRleHQgZWRpdG9yIGlzIGFkZGVkIHRvIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBwYW5lcyBhcmUgYWRkZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgdGV4dEVkaXRvcmAge1RleHRFZGl0b3J9IHRoYXQgd2FzIGFkZGVkLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGFkZGVkIHRleHQgZWRpdG9yLlxuICAvLyAgICAgKiBgaW5kZXhgIHtOdW1iZXJ9IGluZGljYXRpbmcgdGhlIGluZGV4IG9mIHRoZSBhZGRlZCB0ZXh0IGVkaXRvciBpbiBpdHNcbiAgLy8gICAgICAgIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQWRkVGV4dEVkaXRvciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWRkLXRleHQtZWRpdG9yJywgY2FsbGJhY2spXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBPcGVuaW5nXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBPcGVucyB0aGUgZ2l2ZW4gVVJJIGluIEF0b20gYXN5bmNocm9ub3VzbHkuXG4gIC8vIElmIHRoZSBVUkkgaXMgYWxyZWFkeSBvcGVuLCB0aGUgZXhpc3RpbmcgaXRlbSBmb3IgdGhhdCBVUkkgd2lsbCBiZVxuICAvLyBhY3RpdmF0ZWQuIElmIG5vIFVSSSBpcyBnaXZlbiwgb3Igbm8gcmVnaXN0ZXJlZCBvcGVuZXIgY2FuIG9wZW5cbiAgLy8gdGhlIFVSSSwgYSBuZXcgZW1wdHkge1RleHRFZGl0b3J9IHdpbGwgYmUgY3JlYXRlZC5cbiAgLy9cbiAgLy8gKiBgdXJpYCAob3B0aW9uYWwpIEEge1N0cmluZ30gY29udGFpbmluZyBhIFVSSS5cbiAgLy8gKiBgb3B0aW9uc2AgKG9wdGlvbmFsKSB7T2JqZWN0fVxuICAvLyAgICogYGluaXRpYWxMaW5lYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggcm93IHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgaW5pdGlhbENvbHVtbmAgQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHdoaWNoIGNvbHVtbiB0byBtb3ZlIHRoZSBjdXJzb3IgdG9cbiAgLy8gICAgIGluaXRpYWxseS4gRGVmYXVsdHMgdG8gYDBgLlxuICAvLyAgICogYHNwbGl0YCBFaXRoZXIgJ2xlZnQnLCAncmlnaHQnLCAndXAnIG9yICdkb3duJy5cbiAgLy8gICAgIElmICdsZWZ0JywgdGhlIGl0ZW0gd2lsbCBiZSBvcGVuZWQgaW4gbGVmdG1vc3QgcGFuZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSdzIHJvdy5cbiAgLy8gICAgIElmICdyaWdodCcsIHRoZSBpdGVtIHdpbGwgYmUgb3BlbmVkIGluIHRoZSByaWdodG1vc3QgcGFuZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSdzIHJvdy4gSWYgb25seSBvbmUgcGFuZSBleGlzdHMgaW4gdGhlIHJvdywgYSBuZXcgcGFuZSB3aWxsIGJlIGNyZWF0ZWQuXG4gIC8vICAgICBJZiAndXAnLCB0aGUgaXRlbSB3aWxsIGJlIG9wZW5lZCBpbiB0b3Btb3N0IHBhbmUgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUncyBjb2x1bW4uXG4gIC8vICAgICBJZiAnZG93bicsIHRoZSBpdGVtIHdpbGwgYmUgb3BlbmVkIGluIHRoZSBib3R0b21tb3N0IHBhbmUgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUncyBjb2x1bW4uIElmIG9ubHkgb25lIHBhbmUgZXhpc3RzIGluIHRoZSBjb2x1bW4sIGEgbmV3IHBhbmUgd2lsbCBiZSBjcmVhdGVkLlxuICAvLyAgICogYGFjdGl2YXRlUGFuZWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlfSBvblxuICAvLyAgICAgY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIC8vICAgKiBgYWN0aXZhdGVJdGVtYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGVJdGVtfVxuICAvLyAgICAgb24gY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIC8vICAgKiBgcGVuZGluZ2AgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBzaG91bGQgYmUgb3BlbmVkXG4gIC8vICAgICBpbiBhIHBlbmRpbmcgc3RhdGUuIEV4aXN0aW5nIHBlbmRpbmcgaXRlbXMgaW4gYSBwYW5lIGFyZSByZXBsYWNlZCB3aXRoXG4gIC8vICAgICBuZXcgcGVuZGluZyBpdGVtcyB3aGVuIHRoZXkgYXJlIG9wZW5lZC5cbiAgLy8gICAqIGBzZWFyY2hBbGxQYW5lc2AgQSB7Qm9vbGVhbn0uIElmIGB0cnVlYCwgdGhlIHdvcmtzcGFjZSB3aWxsIGF0dGVtcHQgdG9cbiAgLy8gICAgIGFjdGl2YXRlIGFuIGV4aXN0aW5nIGl0ZW0gZm9yIHRoZSBnaXZlbiBVUkkgb24gYW55IHBhbmUuXG4gIC8vICAgICBJZiBgZmFsc2VgLCBvbmx5IHRoZSBhY3RpdmUgcGFuZSB3aWxsIGJlIHNlYXJjaGVkIGZvclxuICAvLyAgICAgYW4gZXhpc3RpbmcgaXRlbSBmb3IgdGhlIHNhbWUgVVJJLiBEZWZhdWx0cyB0byBgZmFsc2VgLlxuICAvLyAgICogYGxvY2F0aW9uYCAob3B0aW9uYWwpIEEge1N0cmluZ30gY29udGFpbmluZyB0aGUgbmFtZSBvZiB0aGUgbG9jYXRpb25cbiAgLy8gICAgIGluIHdoaWNoIHRoaXMgaXRlbSBzaG91bGQgYmUgb3BlbmVkIChvbmUgb2YgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJib3R0b21cIixcbiAgLy8gICAgIG9yIFwiY2VudGVyXCIpLiBJZiBvbWl0dGVkLCBBdG9tIHdpbGwgZmFsbCBiYWNrIHRvIHRoZSBsYXN0IGxvY2F0aW9uIGluXG4gIC8vICAgICB3aGljaCBhIHVzZXIgaGFzIHBsYWNlZCBhbiBpdGVtIHdpdGggdGhlIHNhbWUgVVJJIG9yLCBpZiB0aGlzIGlzIGEgbmV3XG4gIC8vICAgICBVUkksIHRoZSBkZWZhdWx0IGxvY2F0aW9uIHNwZWNpZmllZCBieSB0aGUgaXRlbS4gTk9URTogVGhpcyBvcHRpb25cbiAgLy8gICAgIHNob3VsZCBhbG1vc3QgYWx3YXlzIGJlIG9taXR0ZWQgdG8gaG9ub3IgdXNlciBwcmVmZXJlbmNlLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1Byb21pc2V9IHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHtUZXh0RWRpdG9yfSBmb3IgdGhlIGZpbGUgVVJJLlxuICBhc3luYyBvcGVuIChpdGVtT3JVUkksIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCB1cmksIGl0ZW1cbiAgICBpZiAodHlwZW9mIGl0ZW1PclVSSSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHVyaSA9IHRoaXMucHJvamVjdC5yZXNvbHZlUGF0aChpdGVtT3JVUkkpXG4gICAgfSBlbHNlIGlmIChpdGVtT3JVUkkpIHtcbiAgICAgIGl0ZW0gPSBpdGVtT3JVUklcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5nZXRVUkkgPT09ICdmdW5jdGlvbicpIHVyaSA9IGl0ZW0uZ2V0VVJJKClcbiAgICB9XG5cbiAgICBpZiAoIWF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKSkge1xuICAgICAgb3B0aW9ucy5wZW5kaW5nID0gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgVVJMcyBhcyByZWNlbnQgZG9jdW1lbnRzIHRvIHdvcmstYXJvdW5kIHRoaXMgU3BvdGxpZ2h0IGNyYXNoOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzEwMDcxXG4gICAgaWYgKHVyaSAmJiAoIXVybC5wYXJzZSh1cmkpLnByb3RvY29sIHx8IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpKSB7XG4gICAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuYWRkUmVjZW50RG9jdW1lbnQodXJpKVxuICAgIH1cblxuICAgIGxldCBwYW5lLCBpdGVtRXhpc3RzSW5Xb3Jrc3BhY2VcblxuICAgIC8vIFRyeSB0byBmaW5kIGFuIGV4aXN0aW5nIGl0ZW0gaW4gdGhlIHdvcmtzcGFjZS5cbiAgICBpZiAoaXRlbSB8fCB1cmkpIHtcbiAgICAgIGlmIChvcHRpb25zLnBhbmUpIHtcbiAgICAgICAgcGFuZSA9IG9wdGlvbnMucGFuZVxuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNlYXJjaEFsbFBhbmVzKSB7XG4gICAgICAgIHBhbmUgPSBpdGVtID8gdGhpcy5wYW5lRm9ySXRlbShpdGVtKSA6IHRoaXMucGFuZUZvclVSSSh1cmkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiBhbiBpdGVtIHdpdGggdGhlIGdpdmVuIFVSSSBpcyBhbHJlYWR5IGluIHRoZSB3b3Jrc3BhY2UsIGFzc3VtZVxuICAgICAgICAvLyB0aGF0IGl0ZW0ncyBwYW5lIGNvbnRhaW5lciBpcyB0aGUgcHJlZmVycmVkIGxvY2F0aW9uIGZvciB0aGF0IFVSSS5cbiAgICAgICAgbGV0IGNvbnRhaW5lclxuICAgICAgICBpZiAodXJpKSBjb250YWluZXIgPSB0aGlzLnBhbmVDb250YWluZXJGb3JVUkkodXJpKVxuICAgICAgICBpZiAoIWNvbnRhaW5lcikgY29udGFpbmVyID0gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKClcblxuICAgICAgICAvLyBUaGUgYHNwbGl0YCBvcHRpb24gYWZmZWN0cyB3aGVyZSB3ZSBzZWFyY2ggZm9yIHRoZSBpdGVtLlxuICAgICAgICBwYW5lID0gY29udGFpbmVyLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBzd2l0Y2ggKG9wdGlvbnMuc3BsaXQpIHtcbiAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRMZWZ0bW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kUmlnaHRtb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRUb3Btb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZEJvdHRvbW1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmUpIHtcbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtRXhpc3RzSW5Xb3Jrc3BhY2UgPSBwYW5lLmdldEl0ZW1zKCkuaW5jbHVkZXMoaXRlbSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtID0gcGFuZS5pdGVtRm9yVVJJKHVyaSlcbiAgICAgICAgICBpdGVtRXhpc3RzSW5Xb3Jrc3BhY2UgPSBpdGVtICE9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIGFscmVhZHkgaGF2ZSBhbiBpdGVtIGF0IHRoaXMgc3RhZ2UsIHdlIHdvbid0IG5lZWQgdG8gZG8gYW4gYXN5bmNcbiAgICAvLyBsb29rdXAgb2YgdGhlIFVSSSwgc28gd2UgeWllbGQgdGhlIGV2ZW50IGxvb3AgdG8gZW5zdXJlIHRoaXMgbWV0aG9kXG4gICAgLy8gaXMgY29uc2lzdGVudGx5IGFzeW5jaHJvbm91cy5cbiAgICBpZiAoaXRlbSkgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKClcblxuICAgIGlmICghaXRlbUV4aXN0c0luV29ya3NwYWNlKSB7XG4gICAgICBpdGVtID0gaXRlbSB8fCBhd2FpdCB0aGlzLmNyZWF0ZUl0ZW1Gb3JVUkkodXJpLCBvcHRpb25zKVxuICAgICAgaWYgKCFpdGVtKSByZXR1cm5cblxuICAgICAgaWYgKG9wdGlvbnMucGFuZSkge1xuICAgICAgICBwYW5lID0gb3B0aW9ucy5wYW5lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBvcHRpb25zLmxvY2F0aW9uXG4gICAgICAgIGlmICghbG9jYXRpb24gJiYgIW9wdGlvbnMuc3BsaXQgJiYgdXJpICYmIHRoaXMuZW5hYmxlUGVyc2lzdGVuY2UpIHtcbiAgICAgICAgICBsb2NhdGlvbiA9IGF3YWl0IHRoaXMuaXRlbUxvY2F0aW9uU3RvcmUubG9hZCh1cmkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsb2NhdGlvbiAmJiB0eXBlb2YgaXRlbS5nZXREZWZhdWx0TG9jYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBsb2NhdGlvbiA9IGl0ZW0uZ2V0RGVmYXVsdExvY2F0aW9uKClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbG93ZWRMb2NhdGlvbnMgPSB0eXBlb2YgaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zID09PSAnZnVuY3Rpb24nID8gaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zKCkgOiBBTExfTE9DQVRJT05TXG4gICAgICAgIGxvY2F0aW9uID0gYWxsb3dlZExvY2F0aW9ucy5pbmNsdWRlcyhsb2NhdGlvbikgPyBsb2NhdGlvbiA6IGFsbG93ZWRMb2NhdGlvbnNbMF1cblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnBhbmVDb250YWluZXJzW2xvY2F0aW9uXSB8fCB0aGlzLmdldENlbnRlcigpXG4gICAgICAgIHBhbmUgPSBjb250YWluZXIuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIHN3aXRjaCAob3B0aW9ucy5zcGxpdCkge1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZExlZnRtb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRPckNyZWF0ZVJpZ2h0bW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kVG9wbW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRPckNyZWF0ZUJvdHRvbW1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMucGVuZGluZyAmJiAocGFuZS5nZXRQZW5kaW5nSXRlbSgpID09PSBpdGVtKSkge1xuICAgICAgcGFuZS5jbGVhclBlbmRpbmdJdGVtKClcbiAgICB9XG5cbiAgICB0aGlzLml0ZW1PcGVuZWQoaXRlbSlcblxuICAgIGlmIChvcHRpb25zLmFjdGl2YXRlSXRlbSA9PT0gZmFsc2UpIHtcbiAgICAgIHBhbmUuYWRkSXRlbShpdGVtLCB7cGVuZGluZzogb3B0aW9ucy5wZW5kaW5nfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbSwge3BlbmRpbmc6IG9wdGlvbnMucGVuZGluZ30pXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYWN0aXZhdGVQYW5lICE9PSBmYWxzZSkge1xuICAgICAgcGFuZS5hY3RpdmF0ZSgpXG4gICAgfVxuXG4gICAgbGV0IGluaXRpYWxDb2x1bW4gPSAwXG4gICAgbGV0IGluaXRpYWxMaW5lID0gMFxuICAgIGlmICghTnVtYmVyLmlzTmFOKG9wdGlvbnMuaW5pdGlhbExpbmUpKSB7XG4gICAgICBpbml0aWFsTGluZSA9IG9wdGlvbnMuaW5pdGlhbExpbmVcbiAgICB9XG4gICAgaWYgKCFOdW1iZXIuaXNOYU4ob3B0aW9ucy5pbml0aWFsQ29sdW1uKSkge1xuICAgICAgaW5pdGlhbENvbHVtbiA9IG9wdGlvbnMuaW5pdGlhbENvbHVtblxuICAgIH1cbiAgICBpZiAoaW5pdGlhbExpbmUgPj0gMCB8fCBpbml0aWFsQ29sdW1uID49IDApIHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbl0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBwYW5lLmdldEFjdGl2ZUl0ZW1JbmRleCgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1vcGVuJywge3VyaSwgcGFuZSwgaXRlbSwgaW5kZXh9KVxuICAgIHJldHVybiBpdGVtXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IFNlYXJjaCB0aGUgd29ya3NwYWNlIGZvciBpdGVtcyBtYXRjaGluZyB0aGUgZ2l2ZW4gVVJJIGFuZCBoaWRlIHRoZW0uXG4gIC8vXG4gIC8vICogYGl0ZW1PclVSSWAgKG9wdGlvbmFsKSBUaGUgaXRlbSB0byBoaWRlIG9yIGEge1N0cmluZ30gY29udGFpbmluZyB0aGUgVVJJXG4gIC8vICAgb2YgdGhlIGl0ZW0gdG8gaGlkZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtib29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgYW55IGl0ZW1zIHdlcmUgZm91bmQgKGFuZCBoaWRkZW4pLlxuICBoaWRlIChpdGVtT3JVUkkpIHtcbiAgICBsZXQgZm91bmRJdGVtcyA9IGZhbHNlXG5cbiAgICAvLyBJZiBhbnkgdmlzaWJsZSBpdGVtIGhhcyB0aGUgZ2l2ZW4gVVJJLCBoaWRlIGl0XG4gICAgZm9yIChjb25zdCBjb250YWluZXIgb2YgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpKSB7XG4gICAgICBjb25zdCBpc0NlbnRlciA9IGNvbnRhaW5lciA9PT0gdGhpcy5nZXRDZW50ZXIoKVxuICAgICAgaWYgKGlzQ2VudGVyIHx8IGNvbnRhaW5lci5pc1Zpc2libGUoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBhbmUgb2YgY29udGFpbmVyLmdldFBhbmVzKCkpIHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gcGFuZS5nZXRBY3RpdmVJdGVtKClcbiAgICAgICAgICBjb25zdCBmb3VuZEl0ZW0gPSAoXG4gICAgICAgICAgICBhY3RpdmVJdGVtICE9IG51bGwgJiYgKFxuICAgICAgICAgICAgICBhY3RpdmVJdGVtID09PSBpdGVtT3JVUkkgfHxcbiAgICAgICAgICAgICAgdHlwZW9mIGFjdGl2ZUl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nICYmIGFjdGl2ZUl0ZW0uZ2V0VVJJKCkgPT09IGl0ZW1PclVSSVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgICBpZiAoZm91bmRJdGVtKSB7XG4gICAgICAgICAgICBmb3VuZEl0ZW1zID0gdHJ1ZVxuICAgICAgICAgICAgLy8gV2UgY2FuJ3QgcmVhbGx5IGhpZGUgdGhlIGNlbnRlciBzbyB3ZSBqdXN0IGRlc3Ryb3kgdGhlIGl0ZW0uXG4gICAgICAgICAgICBpZiAoaXNDZW50ZXIpIHtcbiAgICAgICAgICAgICAgcGFuZS5kZXN0cm95SXRlbShhY3RpdmVJdGVtKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyLmhpZGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmb3VuZEl0ZW1zXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IFNlYXJjaCB0aGUgd29ya3NwYWNlIGZvciBpdGVtcyBtYXRjaGluZyB0aGUgZ2l2ZW4gVVJJLiBJZiBhbnkgYXJlIGZvdW5kLCBoaWRlIHRoZW0uXG4gIC8vIE90aGVyd2lzZSwgb3BlbiB0aGUgVVJMLlxuICAvL1xuICAvLyAqIGBpdGVtT3JVUklgIChvcHRpb25hbCkgVGhlIGl0ZW0gdG8gdG9nZ2xlIG9yIGEge1N0cmluZ30gY29udGFpbmluZyB0aGUgVVJJXG4gIC8vICAgb2YgdGhlIGl0ZW0gdG8gdG9nZ2xlLlxuICAvL1xuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGl0ZW0gaXMgc2hvd24gb3IgaGlkZGVuLlxuICB0b2dnbGUgKGl0ZW1PclVSSSkge1xuICAgIGlmICh0aGlzLmhpZGUoaXRlbU9yVVJJKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW4oaXRlbU9yVVJJLCB7c2VhcmNoQWxsUGFuZXM6IHRydWV9KVxuICAgIH1cbiAgfVxuXG4gIC8vIE9wZW4gQXRvbSdzIGxpY2Vuc2UgaW4gdGhlIGFjdGl2ZSBwYW5lLlxuICBvcGVuTGljZW5zZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbignL3Vzci9zaGFyZS9saWNlbnNlcy9hdG9tL0xJQ0VOU0UubWQnKVxuICB9XG5cbiAgLy8gU3luY2hyb25vdXNseSBvcGVuIHRoZSBnaXZlbiBVUkkgaW4gdGhlIGFjdGl2ZSBwYW5lLiAqKk9ubHkgdXNlIHRoaXMgbWV0aG9kXG4gIC8vIGluIHNwZWNzLiBDYWxsaW5nIHRoaXMgaW4gcHJvZHVjdGlvbiBjb2RlIHdpbGwgYmxvY2sgdGhlIFVJIHRocmVhZCBhbmRcbiAgLy8gZXZlcnlvbmUgd2lsbCBiZSBtYWQgYXQgeW91LioqXG4gIC8vXG4gIC8vICogYHVyaWAgQSB7U3RyaW5nfSBjb250YWluaW5nIGEgVVJJLlxuICAvLyAqIGBvcHRpb25zYCBBbiBvcHRpb25hbCBvcHRpb25zIHtPYmplY3R9XG4gIC8vICAgKiBgaW5pdGlhbExpbmVgIEEge051bWJlcn0gaW5kaWNhdGluZyB3aGljaCByb3cgdG8gbW92ZSB0aGUgY3Vyc29yIHRvXG4gIC8vICAgICBpbml0aWFsbHkuIERlZmF1bHRzIHRvIGAwYC5cbiAgLy8gICAqIGBpbml0aWFsQ29sdW1uYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggY29sdW1uIHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgYWN0aXZhdGVQYW5lYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGV9IG9uXG4gIC8vICAgICB0aGUgY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIC8vICAgKiBgYWN0aXZhdGVJdGVtYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGVJdGVtfVxuICAvLyAgICAgb24gY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIG9wZW5TeW5jICh1cmlfID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbn0gPSBvcHRpb25zXG4gICAgY29uc3QgYWN0aXZhdGVQYW5lID0gb3B0aW9ucy5hY3RpdmF0ZVBhbmUgIT0gbnVsbCA/IG9wdGlvbnMuYWN0aXZhdGVQYW5lIDogdHJ1ZVxuICAgIGNvbnN0IGFjdGl2YXRlSXRlbSA9IG9wdGlvbnMuYWN0aXZhdGVJdGVtICE9IG51bGwgPyBvcHRpb25zLmFjdGl2YXRlSXRlbSA6IHRydWVcblxuICAgIGNvbnN0IHVyaSA9IHRoaXMucHJvamVjdC5yZXNvbHZlUGF0aCh1cmlfKVxuICAgIGxldCBpdGVtID0gdGhpcy5nZXRBY3RpdmVQYW5lKCkuaXRlbUZvclVSSSh1cmkpXG4gICAgaWYgKHVyaSAmJiAoaXRlbSA9PSBudWxsKSkge1xuICAgICAgZm9yIChjb25zdCBvcGVuZXIgb2YgdGhpcy5nZXRPcGVuZXJzKCkpIHtcbiAgICAgICAgaXRlbSA9IG9wZW5lcih1cmksIG9wdGlvbnMpXG4gICAgICAgIGlmIChpdGVtKSBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICBpdGVtID0gdGhpcy5wcm9qZWN0Lm9wZW5TeW5jKHVyaSwge2luaXRpYWxMaW5lLCBpbml0aWFsQ29sdW1ufSlcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZhdGVJdGVtKSB7XG4gICAgICB0aGlzLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZUl0ZW0oaXRlbSlcbiAgICB9XG4gICAgdGhpcy5pdGVtT3BlbmVkKGl0ZW0pXG4gICAgaWYgKGFjdGl2YXRlUGFuZSkge1xuICAgICAgdGhpcy5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKVxuICAgIH1cbiAgICByZXR1cm4gaXRlbVxuICB9XG5cbiAgb3BlblVSSUluUGFuZSAodXJpLCBwYW5lKSB7XG4gICAgcmV0dXJuIHRoaXMub3Blbih1cmksIHtwYW5lfSlcbiAgfVxuXG4gIC8vIFB1YmxpYzogQ3JlYXRlcyBhIG5ldyBpdGVtIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIHByb3ZpZGVkIFVSSS5cbiAgLy9cbiAgLy8gSWYgbm8gVVJJIGlzIGdpdmVuLCBvciBubyByZWdpc3RlcmVkIG9wZW5lciBjYW4gb3BlbiB0aGUgVVJJLCBhIG5ldyBlbXB0eVxuICAvLyB7VGV4dEVkaXRvcn0gd2lsbCBiZSBjcmVhdGVkLlxuICAvL1xuICAvLyAqIGB1cmlgIEEge1N0cmluZ30gY29udGFpbmluZyBhIFVSSS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQcm9taXNlfSB0aGF0IHJlc29sdmVzIHRvIHRoZSB7VGV4dEVkaXRvcn0gKG9yIG90aGVyIGl0ZW0pIGZvciB0aGUgZ2l2ZW4gVVJJLlxuICBjcmVhdGVJdGVtRm9yVVJJICh1cmksIG9wdGlvbnMpIHtcbiAgICBpZiAodXJpICE9IG51bGwpIHtcbiAgICAgIGZvciAobGV0IG9wZW5lciBvZiB0aGlzLmdldE9wZW5lcnMoKSkge1xuICAgICAgICBjb25zdCBpdGVtID0gb3BlbmVyKHVyaSwgb3B0aW9ucylcbiAgICAgICAgaWYgKGl0ZW0gIT0gbnVsbCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpdGVtKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuVGV4dEZpbGUodXJpLCBvcHRpb25zKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICAgICAgY2FzZSAnQ0FOQ0VMTEVEJzpcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkV2FybmluZyhgUGVybWlzc2lvbiBkZW5pZWQgJyR7ZXJyb3IucGF0aH0nYClcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgY2FzZSAnRVBFUk0nOlxuICAgICAgICBjYXNlICdFQlVTWSc6XG4gICAgICAgIGNhc2UgJ0VOWElPJzpcbiAgICAgICAgY2FzZSAnRUlPJzpcbiAgICAgICAgY2FzZSAnRU5PVENPTk4nOlxuICAgICAgICBjYXNlICdVTktOT1dOJzpcbiAgICAgICAgY2FzZSAnRUNPTk5SRVNFVCc6XG4gICAgICAgIGNhc2UgJ0VJTlZBTCc6XG4gICAgICAgIGNhc2UgJ0VNRklMRSc6XG4gICAgICAgIGNhc2UgJ0VOT1RESVInOlxuICAgICAgICBjYXNlICdFQUdBSU4nOlxuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRXYXJuaW5nKFxuICAgICAgICAgICAgYFVuYWJsZSB0byBvcGVuICcke2Vycm9yLnBhdGggIT0gbnVsbCA/IGVycm9yLnBhdGggOiB1cml9J2AsXG4gICAgICAgICAgICB7ZGV0YWlsOiBlcnJvci5tZXNzYWdlfVxuICAgICAgICAgIClcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5UZXh0RmlsZSAodXJpLCBvcHRpb25zKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLnByb2plY3QucmVzb2x2ZVBhdGgodXJpKVxuXG4gICAgaWYgKGZpbGVQYXRoICE9IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZzLmNsb3NlU3luYyhmcy5vcGVuU3luYyhmaWxlUGF0aCwgJ3InKSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIGFsbG93IEVOT0VOVCBlcnJvcnMgdG8gY3JlYXRlIGFuIGVkaXRvciBmb3IgcGF0aHMgdGhhdCBkb250IGV4aXN0XG4gICAgICAgIGlmIChlcnJvci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmaWxlU2l6ZSA9IGZzLmdldFNpemVTeW5jKGZpbGVQYXRoKVxuXG4gICAgY29uc3QgbGFyZ2VGaWxlTW9kZSA9IGZpbGVTaXplID49ICgyICogMTA0ODU3NikgLy8gMk1CXG4gICAgaWYgKGZpbGVTaXplID49ICh0aGlzLmNvbmZpZy5nZXQoJ2NvcmUud2Fybk9uTGFyZ2VGaWxlTGltaXQnKSAqIDEwNDg1NzYpKSB7IC8vIDIwTUIgYnkgZGVmYXVsdFxuICAgICAgY29uc3QgY2hvaWNlID0gdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLmNvbmZpcm0oe1xuICAgICAgICBtZXNzYWdlOiAnQXRvbSB3aWxsIGJlIHVucmVzcG9uc2l2ZSBkdXJpbmcgdGhlIGxvYWRpbmcgb2YgdmVyeSBsYXJnZSBmaWxlcy4nLFxuICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6ICdEbyB5b3Ugc3RpbGwgd2FudCB0byBsb2FkIHRoaXMgZmlsZT8nLFxuICAgICAgICBidXR0b25zOiBbJ1Byb2NlZWQnLCAnQ2FuY2VsJ11cbiAgICAgIH0pXG4gICAgICBpZiAoY2hvaWNlID09PSAxKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKClcbiAgICAgICAgZXJyb3IuY29kZSA9ICdDQU5DRUxMRUQnXG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvamVjdC5idWZmZXJGb3JQYXRoKGZpbGVQYXRoLCBvcHRpb25zKVxuICAgICAgLnRoZW4oYnVmZmVyID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5LmJ1aWxkKE9iamVjdC5hc3NpZ24oe2J1ZmZlciwgbGFyZ2VGaWxlTW9kZSwgYXV0b0hlaWdodDogZmFsc2V9LCBvcHRpb25zKSlcbiAgICAgIH0pXG4gIH1cblxuICBoYW5kbGVHcmFtbWFyVXNlZCAoZ3JhbW1hcikge1xuICAgIGlmIChncmFtbWFyID09IG51bGwpIHsgcmV0dXJuIH1cbiAgICByZXR1cm4gdGhpcy5wYWNrYWdlTWFuYWdlci50cmlnZ2VyQWN0aXZhdGlvbkhvb2soYCR7Z3JhbW1hci5wYWNrYWdlTmFtZX06Z3JhbW1hci11c2VkYClcbiAgfVxuXG4gIC8vIFB1YmxpYzogUmV0dXJucyBhIHtCb29sZWFufSB0aGF0IGlzIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIGBUZXh0RWRpdG9yYC5cbiAgLy9cbiAgLy8gKiBgb2JqZWN0YCBBbiB7T2JqZWN0fSB5b3Ugd2FudCB0byBwZXJmb3JtIHRoZSBjaGVjayBhZ2FpbnN0LlxuICBpc1RleHRFZGl0b3IgKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBUZXh0RWRpdG9yXG4gIH1cblxuICAvLyBFeHRlbmRlZDogQ3JlYXRlIGEgbmV3IHRleHQgZWRpdG9yLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1RleHRFZGl0b3J9LlxuICBidWlsZFRleHRFZGl0b3IgKHBhcmFtcykge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5LmJ1aWxkKHBhcmFtcylcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5tYWludGFpbkdyYW1tYXIoZWRpdG9yKSxcbiAgICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5Lm1haW50YWluQ29uZmlnKGVkaXRvcilcbiAgICApXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7IHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpIH0pXG4gICAgcmV0dXJuIGVkaXRvclxuICB9XG5cbiAgLy8gUHVibGljOiBBc3luY2hyb25vdXNseSByZW9wZW5zIHRoZSBsYXN0LWNsb3NlZCBpdGVtJ3MgVVJJIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW5cbiAgLy8gcmVvcGVuZWQuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBpdGVtIGlzIG9wZW5lZFxuICByZW9wZW5JdGVtICgpIHtcbiAgICBjb25zdCB1cmkgPSB0aGlzLmRlc3Ryb3llZEl0ZW1VUklzLnBvcCgpXG4gICAgaWYgKHVyaSkge1xuICAgICAgcmV0dXJuIHRoaXMub3Blbih1cmkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cbiAgfVxuXG4gIC8vIFB1YmxpYzogUmVnaXN0ZXIgYW4gb3BlbmVyIGZvciBhIHVyaS5cbiAgLy9cbiAgLy8gV2hlbiBhIFVSSSBpcyBvcGVuZWQgdmlhIHtXb3Jrc3BhY2U6Om9wZW59LCBBdG9tIGxvb3BzIHRocm91Z2ggaXRzIHJlZ2lzdGVyZWRcbiAgLy8gb3BlbmVyIGZ1bmN0aW9ucyB1bnRpbCBvbmUgcmV0dXJucyBhIHZhbHVlIGZvciB0aGUgZ2l2ZW4gdXJpLlxuICAvLyBPcGVuZXJzIGFyZSBleHBlY3RlZCB0byByZXR1cm4gYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBIVE1MRWxlbWVudCBvclxuICAvLyBhIG1vZGVsIHdoaWNoIGhhcyBhbiBhc3NvY2lhdGVkIHZpZXcgaW4gdGhlIHtWaWV3UmVnaXN0cnl9LlxuICAvLyBBIHtUZXh0RWRpdG9yfSB3aWxsIGJlIHVzZWQgaWYgbm8gb3BlbmVyIHJldHVybnMgYSB2YWx1ZS5cbiAgLy9cbiAgLy8gIyMgRXhhbXBsZXNcbiAgLy9cbiAgLy8gYGBgY29mZmVlXG4gIC8vIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpKSAtPlxuICAvLyAgIGlmIHBhdGguZXh0bmFtZSh1cmkpIGlzICcudG9tbCdcbiAgLy8gICAgIHJldHVybiBuZXcgVG9tbEVkaXRvcih1cmkpXG4gIC8vIGBgYFxuICAvL1xuICAvLyAqIGBvcGVuZXJgIEEge0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiBhIHBhdGggaXMgYmVpbmcgb3BlbmVkLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHJlbW92ZSB0aGVcbiAgLy8gb3BlbmVyLlxuICAvL1xuICAvLyBOb3RlIHRoYXQgdGhlIG9wZW5lciB3aWxsIGJlIGNhbGxlZCBpZiBhbmQgb25seSBpZiB0aGUgVVJJIGlzIG5vdCBhbHJlYWR5IG9wZW5cbiAgLy8gaW4gdGhlIGN1cnJlbnQgcGFuZS4gVGhlIHNlYXJjaEFsbFBhbmVzIGZsYWcgZXhwYW5kcyB0aGUgc2VhcmNoIGZyb20gdGhlXG4gIC8vIGN1cnJlbnQgcGFuZSB0byBhbGwgcGFuZXMuIElmIHlvdSB3aXNoIHRvIG9wZW4gYSB2aWV3IG9mIGEgZGlmZmVyZW50IHR5cGUgZm9yXG4gIC8vIGEgZmlsZSB0aGF0IGlzIGFscmVhZHkgb3BlbiwgY29uc2lkZXIgY2hhbmdpbmcgdGhlIHByb3RvY29sIG9mIHRoZSBVUkkuIEZvclxuICAvLyBleGFtcGxlLCBwZXJoYXBzIHlvdSB3aXNoIHRvIHByZXZpZXcgYSByZW5kZXJlZCB2ZXJzaW9uIG9mIHRoZSBmaWxlIGAvZm9vL2Jhci9iYXoucXV1eGBcbiAgLy8gdGhhdCBpcyBhbHJlYWR5IG9wZW4gaW4gYSB0ZXh0IGVkaXRvciB2aWV3LiBZb3UgY291bGQgc2lnbmFsIHRoaXMgYnkgY2FsbGluZ1xuICAvLyB7V29ya3NwYWNlOjpvcGVufSBvbiB0aGUgVVJJIGBxdXV4LXByZXZpZXc6Ly9mb28vYmFyL2Jhei5xdXV4YC4gVGhlbiB5b3VyIG9wZW5lclxuICAvLyBjYW4gY2hlY2sgdGhlIHByb3RvY29sIGZvciBxdXV4LXByZXZpZXcgYW5kIG9ubHkgaGFuZGxlIHRob3NlIFVSSXMgdGhhdCBtYXRjaC5cbiAgYWRkT3BlbmVyIChvcGVuZXIpIHtcbiAgICB0aGlzLm9wZW5lcnMucHVzaChvcGVuZXIpXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgXy5yZW1vdmUodGhpcy5vcGVuZXJzLCBvcGVuZXIpIH0pXG4gIH1cblxuICBnZXRPcGVuZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXJzXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lIEl0ZW1zXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYWxsIHBhbmUgaXRlbXMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7QXJyYXl9IG9mIGl0ZW1zLlxuICBnZXRQYW5lSXRlbXMgKCkge1xuICAgIHJldHVybiBfLmZsYXR0ZW4odGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLmdldFBhbmVJdGVtcygpKSlcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSBhY3RpdmUge1BhbmV9J3MgYWN0aXZlIGl0ZW0uXG4gIC8vXG4gIC8vIFJldHVybnMgYW4gcGFuZSBpdGVtIHtPYmplY3R9LlxuICBnZXRBY3RpdmVQYW5lSXRlbSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFsbCB0ZXh0IGVkaXRvcnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7QXJyYXl9IG9mIHtUZXh0RWRpdG9yfXMuXG4gIGdldFRleHRFZGl0b3JzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lSXRlbXMoKS5maWx0ZXIoaXRlbSA9PiBpdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvcilcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSBhY3RpdmUgaXRlbSBpZiBpdCBpcyBhbiB7VGV4dEVkaXRvcn0uXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge1RleHRFZGl0b3J9IG9yIGB1bmRlZmluZWRgIGlmIHRoZSBjdXJyZW50IGFjdGl2ZSBpdGVtIGlzIG5vdCBhblxuICAvLyB7VGV4dEVkaXRvcn0uXG4gIGdldEFjdGl2ZVRleHRFZGl0b3IgKCkge1xuICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSB0aGlzLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBpZiAoYWN0aXZlSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpIHsgcmV0dXJuIGFjdGl2ZUl0ZW0gfVxuICB9XG5cbiAgLy8gU2F2ZSBhbGwgcGFuZSBpdGVtcy5cbiAgc2F2ZUFsbCAoKSB7XG4gICAgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpLmZvckVhY2goY29udGFpbmVyID0+IHtcbiAgICAgIGNvbnRhaW5lci5zYXZlQWxsKClcbiAgICB9KVxuICB9XG5cbiAgY29uZmlybUNsb3NlIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKVxuICAgICAgLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLmNvbmZpcm1DbG9zZShvcHRpb25zKSlcbiAgICAgIC5ldmVyeShzYXZlZCA9PiBzYXZlZClcbiAgfVxuXG4gIC8vIFNhdmUgdGhlIGFjdGl2ZSBwYW5lIGl0ZW0uXG4gIC8vXG4gIC8vIElmIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGN1cnJlbnRseSBoYXMgYSBVUkkgYWNjb3JkaW5nIHRvIHRoZSBpdGVtJ3NcbiAgLy8gYC5nZXRVUklgIG1ldGhvZCwgY2FsbHMgYC5zYXZlYCBvbiB0aGUgaXRlbS4gT3RoZXJ3aXNlXG4gIC8vIHs6OnNhdmVBY3RpdmVQYW5lSXRlbUFzfSAjIHdpbGwgYmUgY2FsbGVkIGluc3RlYWQuIFRoaXMgbWV0aG9kIGRvZXMgbm90aGluZ1xuICAvLyBpZiB0aGUgYWN0aXZlIGl0ZW0gZG9lcyBub3QgaW1wbGVtZW50IGEgYC5zYXZlYCBtZXRob2QuXG4gIHNhdmVBY3RpdmVQYW5lSXRlbSAoKSB7XG4gICAgdGhpcy5nZXRBY3RpdmVQYW5lKCkuc2F2ZUFjdGl2ZUl0ZW0oKVxuICB9XG5cbiAgLy8gUHJvbXB0IHRoZSB1c2VyIGZvciBhIHBhdGggYW5kIHNhdmUgdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gdG8gaXQuXG4gIC8vXG4gIC8vIE9wZW5zIGEgbmF0aXZlIGRpYWxvZyB3aGVyZSB0aGUgdXNlciBzZWxlY3RzIGEgcGF0aCBvbiBkaXNrLCB0aGVuIGNhbGxzXG4gIC8vIGAuc2F2ZUFzYCBvbiB0aGUgaXRlbSB3aXRoIHRoZSBzZWxlY3RlZCBwYXRoLiBUaGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcgaWZcbiAgLy8gdGhlIGFjdGl2ZSBpdGVtIGRvZXMgbm90IGltcGxlbWVudCBhIGAuc2F2ZUFzYCBtZXRob2QuXG4gIHNhdmVBY3RpdmVQYW5lSXRlbUFzICgpIHtcbiAgICB0aGlzLmdldEFjdGl2ZVBhbmUoKS5zYXZlQWN0aXZlSXRlbUFzKClcbiAgfVxuXG4gIC8vIERlc3Ryb3kgKGNsb3NlKSB0aGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmVtb3ZlcyB0aGUgYWN0aXZlIHBhbmUgaXRlbSBhbmQgY2FsbHMgdGhlIGAuZGVzdHJveWAgbWV0aG9kIG9uIGl0IGlmIG9uZSBpc1xuICAvLyBkZWZpbmVkLlxuICBkZXN0cm95QWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmUoKS5kZXN0cm95QWN0aXZlSXRlbSgpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lc1xuICAqL1xuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIG1vc3QgcmVjZW50bHkgZm9jdXNlZCBwYW5lIGNvbnRhaW5lci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSBvciB0aGUge1dvcmtzcGFjZUNlbnRlcn0uXG4gIGdldEFjdGl2ZVBhbmVDb250YWluZXIgKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXJcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgYWxsIHBhbmVzIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiB7UGFuZX1zLlxuICBnZXRQYW5lcyAoKSB7XG4gICAgcmV0dXJuIF8uZmxhdHRlbih0aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIuZ2V0UGFuZXMoKSkpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogR2V0IHRoZSBhY3RpdmUge1BhbmV9LlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmV9LlxuICBnZXRBY3RpdmVQYW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkuZ2V0QWN0aXZlUGFuZSgpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogTWFrZSB0aGUgbmV4dCBwYW5lIGFjdGl2ZS5cbiAgYWN0aXZhdGVOZXh0UGFuZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpLmFjdGl2YXRlTmV4dFBhbmUoKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IE1ha2UgdGhlIHByZXZpb3VzIHBhbmUgYWN0aXZlLlxuICBhY3RpdmF0ZVByZXZpb3VzUGFuZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpLmFjdGl2YXRlUHJldmlvdXNQYW5lKClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIGZpcnN0IHBhbmUgY29udGFpbmVyIHRoYXQgY29udGFpbnMgYW4gaXRlbSB3aXRoIHRoZSBnaXZlblxuICAvLyBVUkkuXG4gIC8vXG4gIC8vICogYHVyaWAge1N0cmluZ30gdXJpXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RG9ja30sIHRoZSB7V29ya3NwYWNlQ2VudGVyfSwgb3IgYHVuZGVmaW5lZGAgaWYgbm8gaXRlbSBleGlzdHNcbiAgLy8gd2l0aCB0aGUgZ2l2ZW4gVVJJLlxuICBwYW5lQ29udGFpbmVyRm9yVVJJICh1cmkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lQ29udGFpbmVycygpLmZpbmQoY29udGFpbmVyID0+IGNvbnRhaW5lci5wYW5lRm9yVVJJKHVyaSkpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogR2V0IHRoZSBmaXJzdCBwYW5lIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBnaXZlbiBpdGVtLlxuICAvL1xuICAvLyAqIGBpdGVtYCB0aGUgSXRlbSB0aGF0IHRoZSByZXR1cm5lZCBwYW5lIGNvbnRhaW5lciBtdXN0IGNvbnRhaW4uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RG9ja30sIHRoZSB7V29ya3NwYWNlQ2VudGVyfSwgb3IgYHVuZGVmaW5lZGAgaWYgbm8gaXRlbSBleGlzdHNcbiAgLy8gd2l0aCB0aGUgZ2l2ZW4gVVJJLlxuICBwYW5lQ29udGFpbmVyRm9ySXRlbSAodXJpKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5maW5kKGNvbnRhaW5lciA9PiBjb250YWluZXIucGFuZUZvckl0ZW0odXJpKSlcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIGZpcnN0IHtQYW5lfSB0aGF0IGNvbnRhaW5zIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gVVJJLlxuICAvL1xuICAvLyAqIGB1cmlgIHtTdHJpbmd9IHVyaVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmV9IG9yIGB1bmRlZmluZWRgIGlmIG5vIGl0ZW0gZXhpc3RzIHdpdGggdGhlIGdpdmVuIFVSSS5cbiAgcGFuZUZvclVSSSAodXJpKSB7XG4gICAgZm9yIChsZXQgbG9jYXRpb24gb2YgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpKSB7XG4gICAgICBjb25zdCBwYW5lID0gbG9jYXRpb24ucGFuZUZvclVSSSh1cmkpXG4gICAgICBpZiAocGFuZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBwYW5lXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGdpdmVuIGl0ZW0uXG4gIC8vXG4gIC8vICogYGl0ZW1gIHRoZSBJdGVtIHRoYXQgdGhlIHJldHVybmVkIHBhbmUgbXVzdCBjb250YWluLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmV9IG9yIGB1bmRlZmluZWRgIGlmIG5vIHBhbmUgZXhpc3RzIGZvciB0aGUgZ2l2ZW4gaXRlbS5cbiAgcGFuZUZvckl0ZW0gKGl0ZW0pIHtcbiAgICBmb3IgKGxldCBsb2NhdGlvbiBvZiB0aGlzLmdldFBhbmVDb250YWluZXJzKCkpIHtcbiAgICAgIGNvbnN0IHBhbmUgPSBsb2NhdGlvbi5wYW5lRm9ySXRlbShpdGVtKVxuICAgICAgaWYgKHBhbmUgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcGFuZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERlc3Ryb3kgKGNsb3NlKSB0aGUgYWN0aXZlIHBhbmUuXG4gIGRlc3Ryb3lBY3RpdmVQYW5lICgpIHtcbiAgICBjb25zdCBhY3RpdmVQYW5lID0gdGhpcy5nZXRBY3RpdmVQYW5lKClcbiAgICBpZiAoYWN0aXZlUGFuZSAhPSBudWxsKSB7XG4gICAgICBhY3RpdmVQYW5lLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuXG4gIC8vIENsb3NlIHRoZSBhY3RpdmUgcGFuZSBpdGVtLCBvciB0aGUgYWN0aXZlIHBhbmUgaWYgaXQgaXMgZW1wdHksXG4gIC8vIG9yIHRoZSBjdXJyZW50IHdpbmRvdyBpZiB0aGVyZSBpcyBvbmx5IHRoZSBlbXB0eSByb290IHBhbmUuXG4gIGNsb3NlQWN0aXZlUGFuZUl0ZW1PckVtcHR5UGFuZU9yV2luZG93ICgpIHtcbiAgICBpZiAodGhpcy5nZXRBY3RpdmVQYW5lSXRlbSgpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLmRlc3Ryb3lBY3RpdmVQYW5lKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLmdldCgnY29yZS5jbG9zZUVtcHR5V2luZG93cycpKSB7XG4gICAgICBhdG9tLmNsb3NlKClcbiAgICB9XG4gIH1cblxuICAvLyBJbmNyZWFzZSB0aGUgZWRpdG9yIGZvbnQgc2l6ZSBieSAxcHguXG4gIGluY3JlYXNlRm9udFNpemUgKCkge1xuICAgIHRoaXMuY29uZmlnLnNldCgnZWRpdG9yLmZvbnRTaXplJywgdGhpcy5jb25maWcuZ2V0KCdlZGl0b3IuZm9udFNpemUnKSArIDEpXG4gIH1cblxuICAvLyBEZWNyZWFzZSB0aGUgZWRpdG9yIGZvbnQgc2l6ZSBieSAxcHguXG4gIGRlY3JlYXNlRm9udFNpemUgKCkge1xuICAgIGNvbnN0IGZvbnRTaXplID0gdGhpcy5jb25maWcuZ2V0KCdlZGl0b3IuZm9udFNpemUnKVxuICAgIGlmIChmb250U2l6ZSA+IDEpIHtcbiAgICAgIHRoaXMuY29uZmlnLnNldCgnZWRpdG9yLmZvbnRTaXplJywgZm9udFNpemUgLSAxKVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlc3RvcmUgdG8gdGhlIHdpbmRvdydzIG9yaWdpbmFsIGVkaXRvciBmb250IHNpemUuXG4gIHJlc2V0Rm9udFNpemUgKCkge1xuICAgIGlmICh0aGlzLm9yaWdpbmFsRm9udFNpemUpIHtcbiAgICAgIHRoaXMuY29uZmlnLnNldCgnZWRpdG9yLmZvbnRTaXplJywgdGhpcy5vcmlnaW5hbEZvbnRTaXplKVxuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZVRvRm9udFNpemUgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5vbkRpZENoYW5nZSgnZWRpdG9yLmZvbnRTaXplJywgKHtvbGRWYWx1ZX0pID0+IHtcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsRm9udFNpemUgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsRm9udFNpemUgPSBvbGRWYWx1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBSZW1vdmVzIHRoZSBpdGVtJ3MgdXJpIGZyb20gdGhlIGxpc3Qgb2YgcG90ZW50aWFsIGl0ZW1zIHRvIHJlb3Blbi5cbiAgaXRlbU9wZW5lZCAoaXRlbSkge1xuICAgIGxldCB1cmlcbiAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmkgPSBpdGVtLmdldFVSSSgpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbS5nZXRVcmkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVyaSA9IGl0ZW0uZ2V0VXJpKClcbiAgICB9XG5cbiAgICBpZiAodXJpICE9IG51bGwpIHtcbiAgICAgIF8ucmVtb3ZlKHRoaXMuZGVzdHJveWVkSXRlbVVSSXMsIHVyaSlcbiAgICB9XG4gIH1cblxuICAvLyBBZGRzIHRoZSBkZXN0cm95ZWQgaXRlbSdzIHVyaSB0byB0aGUgbGlzdCBvZiBpdGVtcyB0byByZW9wZW4uXG4gIGRpZERlc3Ryb3lQYW5lSXRlbSAoe2l0ZW19KSB7XG4gICAgbGV0IHVyaVxuICAgIGlmICh0eXBlb2YgaXRlbS5nZXRVUkkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVyaSA9IGl0ZW0uZ2V0VVJJKClcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtLmdldFVyaSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdXJpID0gaXRlbS5nZXRVcmkoKVxuICAgIH1cblxuICAgIGlmICh1cmkgIT0gbnVsbCkge1xuICAgICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcy5wdXNoKHVyaSlcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsZWQgYnkgTW9kZWwgc3VwZXJjbGFzcyB3aGVuIGRlc3Ryb3llZFxuICBkZXN0cm95ZWQgKCkge1xuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc3Ryb3koKVxuICAgIHRoaXMuY2FuY2VsU3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0KClcbiAgICBpZiAodGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIFNlY3Rpb246IFBhbmUgTG9jYXRpb25zXG4gICovXG5cbiAgZ2V0Q2VudGVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXJcbiAgfVxuXG4gIGdldExlZnREb2NrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lQ29udGFpbmVycy5sZWZ0XG4gIH1cblxuICBnZXRSaWdodERvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0XG4gIH1cblxuICBnZXRCb3R0b21Eb2NrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b21cbiAgfVxuXG4gIGdldFBhbmVDb250YWluZXJzICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LFxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b21cbiAgICBdXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lbHNcblxuICBQYW5lbHMgYXJlIHVzZWQgdG8gZGlzcGxheSBVSSByZWxhdGVkIHRvIGFuIGVkaXRvciB3aW5kb3cuIFRoZXkgYXJlIHBsYWNlZCBhdCBvbmUgb2YgdGhlIGZvdXJcbiAgZWRnZXMgb2YgdGhlIHdpbmRvdzogbGVmdCwgcmlnaHQsIHRvcCBvciBib3R0b20uIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBwYW5lbHMgb24gdGhlIHNhbWUgd2luZG93XG4gIGVkZ2UgdGhleSBhcmUgc3RhY2tlZCBpbiBvcmRlciBvZiBwcmlvcml0eTogaGlnaGVyIHByaW9yaXR5IGlzIGNsb3NlciB0byB0aGUgY2VudGVyLCBsb3dlclxuICBwcmlvcml0eSB0b3dhcmRzIHRoZSBlZGdlLlxuXG4gICpOb3RlOiogSWYgeW91ciBwYW5lbCBjaGFuZ2VzIGl0cyBzaXplIHRocm91Z2hvdXQgaXRzIGxpZmV0aW1lLCBjb25zaWRlciBnaXZpbmcgaXQgYSBoaWdoZXJcbiAgcHJpb3JpdHksIGFsbG93aW5nIGZpeGVkIHNpemUgcGFuZWxzIHRvIGJlIGNsb3NlciB0byB0aGUgZWRnZS4gVGhpcyBhbGxvd3MgY29udHJvbCB0YXJnZXRzIHRvXG4gIHJlbWFpbiBtb3JlIHN0YXRpYyBmb3IgZWFzaWVyIHRhcmdldGluZyBieSB1c2VycyB0aGF0IGVtcGxveSBtaWNlIG9yIHRyYWNrcGFkcy4gKFNlZVxuICBbYXRvbS9hdG9tIzQ4MzRdKGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzQ4MzQpIGZvciBkaXNjdXNzaW9uLilcbiAgKi9cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0Qm90dG9tUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ2JvdHRvbScpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSBib3R0b20gb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkQm90dG9tUGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgnYm90dG9tJywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyB0byB0aGUgbGVmdCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0TGVmdFBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCdsZWZ0JylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIGxlZnQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkTGVmdFBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ2xlZnQnLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIHRvIHRoZSByaWdodCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0UmlnaHRQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygncmlnaHQnKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgcmlnaHQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkUmlnaHRQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdyaWdodCcsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgYXQgdGhlIHRvcCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0VG9wUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ3RvcCcpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSB0b3Agb2YgdGhlIGVkaXRvciB3aW5kb3cgYWJvdmUgdGhlIHRhYnMuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkVG9wUGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgndG9wJywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyBpbiB0aGUgaGVhZGVyLlxuICBnZXRIZWFkZXJQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnaGVhZGVyJylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIGhlYWRlci5cbiAgLy9cbiAgLy8gKiBgb3B0aW9uc2Age09iamVjdH1cbiAgLy8gICAqIGBpdGVtYCBZb3VyIHBhbmVsIGNvbnRlbnQuIEl0IGNhbiBiZSBET00gZWxlbWVudCwgYSBqUXVlcnkgZWxlbWVudCwgb3JcbiAgLy8gICAgIGEgbW9kZWwgd2l0aCBhIHZpZXcgcmVnaXN0ZXJlZCB2aWEge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfS4gV2UgcmVjb21tZW5kIHRoZVxuICAvLyAgICAgbGF0dGVyLiBTZWUge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgLy8gICAqIGB2aXNpYmxlYCAob3B0aW9uYWwpIHtCb29sZWFufSBmYWxzZSBpZiB5b3Ugd2FudCB0aGUgcGFuZWwgdG8gaW5pdGlhbGx5IGJlIGhpZGRlblxuICAvLyAgICAgKGRlZmF1bHQ6IHRydWUpXG4gIC8vICAgKiBgcHJpb3JpdHlgIChvcHRpb25hbCkge051bWJlcn0gRGV0ZXJtaW5lcyBzdGFja2luZyBvcmRlci4gTG93ZXIgcHJpb3JpdHkgaXRlbXMgYXJlXG4gIC8vICAgICBmb3JjZWQgY2xvc2VyIHRvIHRoZSBlZGdlcyBvZiB0aGUgd2luZG93LiAoZGVmYXVsdDogMTAwKVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmVsfVxuICBhZGRIZWFkZXJQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdoZWFkZXInLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIGluIHRoZSBmb290ZXIuXG4gIGdldEZvb3RlclBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCdmb290ZXInKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgZm9vdGVyLlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZEZvb3RlclBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ2Zvb3RlcicsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgbW9kYWwgcGFuZWwgaXRlbXNcbiAgZ2V0TW9kYWxQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnbW9kYWwnKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSBhcyBhIG1vZGFsIGRpYWxvZy5cbiAgLy9cbiAgLy8gKiBgb3B0aW9uc2Age09iamVjdH1cbiAgLy8gICAqIGBpdGVtYCBZb3VyIHBhbmVsIGNvbnRlbnQuIEl0IGNhbiBiZSBhIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBtb2RlbCBvcHRpb24uIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZE1vZGFsUGFuZWwgKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdtb2RhbCcsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IFJldHVybnMgdGhlIHtQYW5lbH0gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBpdGVtLiBSZXR1cm5zXG4gIC8vIGBudWxsYCB3aGVuIHRoZSBpdGVtIGhhcyBubyBwYW5lbC5cbiAgLy9cbiAgLy8gKiBgaXRlbWAgSXRlbSB0aGUgcGFuZWwgY29udGFpbnNcbiAgcGFuZWxGb3JJdGVtIChpdGVtKSB7XG4gICAgZm9yIChsZXQgbG9jYXRpb24gaW4gdGhpcy5wYW5lbENvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGFuZWxDb250YWluZXJzW2xvY2F0aW9uXVxuICAgICAgY29uc3QgcGFuZWwgPSBjb250YWluZXIucGFuZWxGb3JJdGVtKGl0ZW0pXG4gICAgICBpZiAocGFuZWwgIT0gbnVsbCkgeyByZXR1cm4gcGFuZWwgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgZ2V0UGFuZWxzIChsb2NhdGlvbikge1xuICAgIHJldHVybiB0aGlzLnBhbmVsQ29udGFpbmVyc1tsb2NhdGlvbl0uZ2V0UGFuZWxzKClcbiAgfVxuXG4gIGFkZFBhbmVsIChsb2NhdGlvbiwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHsgb3B0aW9ucyA9IHt9IH1cbiAgICByZXR1cm4gdGhpcy5wYW5lbENvbnRhaW5lcnNbbG9jYXRpb25dLmFkZFBhbmVsKG5ldyBQYW5lbChvcHRpb25zLCB0aGlzLnZpZXdSZWdpc3RyeSkpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBTZWFyY2hpbmcgYW5kIFJlcGxhY2luZ1xuICAqL1xuXG4gIC8vIFB1YmxpYzogUGVyZm9ybXMgYSBzZWFyY2ggYWNyb3NzIGFsbCBmaWxlcyBpbiB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGByZWdleGAge1JlZ0V4cH0gdG8gc2VhcmNoIHdpdGguXG4gIC8vICogYG9wdGlvbnNgIChvcHRpb25hbCkge09iamVjdH1cbiAgLy8gICAqIGBwYXRoc2AgQW4ge0FycmF5fSBvZiBnbG9iIHBhdHRlcm5zIHRvIHNlYXJjaCB3aXRoaW4uXG4gIC8vICAgKiBgb25QYXRoc1NlYXJjaGVkYCAob3B0aW9uYWwpIHtGdW5jdGlvbn0gdG8gYmUgcGVyaW9kaWNhbGx5IGNhbGxlZFxuICAvLyAgICAgd2l0aCBudW1iZXIgb2YgcGF0aHMgc2VhcmNoZWQuXG4gIC8vICAgKiBgbGVhZGluZ0NvbnRleHRMaW5lQ291bnRgIHtOdW1iZXJ9IGRlZmF1bHQgYDBgOyBUaGUgbnVtYmVyIG9mIGxpbmVzXG4gIC8vICAgICAgYmVmb3JlIHRoZSBtYXRjaGVkIGxpbmUgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0cyBvYmplY3QuXG4gIC8vICAgKiBgdHJhaWxpbmdDb250ZXh0TGluZUNvdW50YCB7TnVtYmVyfSBkZWZhdWx0IGAwYDsgVGhlIG51bWJlciBvZiBsaW5lc1xuICAvLyAgICAgIGFmdGVyIHRoZSBtYXRjaGVkIGxpbmUgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0cyBvYmplY3QuXG4gIC8vICogYGl0ZXJhdG9yYCB7RnVuY3Rpb259IGNhbGxiYWNrIG9uIGVhY2ggZmlsZSBmb3VuZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQcm9taXNlfSB3aXRoIGEgYGNhbmNlbCgpYCBtZXRob2QgdGhhdCB3aWxsIGNhbmNlbCBhbGxcbiAgLy8gb2YgdGhlIHVuZGVybHlpbmcgc2VhcmNoZXMgdGhhdCB3ZXJlIHN0YXJ0ZWQgYXMgcGFydCBvZiB0aGlzIHNjYW4uXG4gIHNjYW4gKHJlZ2V4LCBvcHRpb25zID0ge30sIGl0ZXJhdG9yKSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgICAgaXRlcmF0b3IgPSBvcHRpb25zXG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICAvLyBGaW5kIGEgc2VhcmNoZXIgZm9yIGV2ZXJ5IERpcmVjdG9yeSBpbiB0aGUgcHJvamVjdC4gRWFjaCBzZWFyY2hlciB0aGF0IGlzIG1hdGNoZWRcbiAgICAvLyB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aCBhbiBBcnJheSBvZiBEaXJlY3Rvcnkgb2JqZWN0cyBpbiB0aGUgTWFwLlxuICAgIGNvbnN0IGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIgPSBuZXcgTWFwKClcbiAgICBmb3IgKGNvbnN0IGRpcmVjdG9yeSBvZiB0aGlzLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKSkge1xuICAgICAgbGV0IHNlYXJjaGVyID0gdGhpcy5kZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXJcbiAgICAgIGZvciAoY29uc3QgZGlyZWN0b3J5U2VhcmNoZXIgb2YgdGhpcy5kaXJlY3RvcnlTZWFyY2hlcnMpIHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeVNlYXJjaGVyLmNhblNlYXJjaERpcmVjdG9yeShkaXJlY3RvcnkpKSB7XG4gICAgICAgICAgc2VhcmNoZXIgPSBkaXJlY3RvcnlTZWFyY2hlclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBkaXJlY3RvcmllcyA9IGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIuZ2V0KHNlYXJjaGVyKVxuICAgICAgaWYgKCFkaXJlY3Rvcmllcykge1xuICAgICAgICBkaXJlY3RvcmllcyA9IFtdXG4gICAgICAgIGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIuc2V0KHNlYXJjaGVyLCBkaXJlY3RvcmllcylcbiAgICAgIH1cbiAgICAgIGRpcmVjdG9yaWVzLnB1c2goZGlyZWN0b3J5KVxuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgb25QYXRoc1NlYXJjaGVkIGNhbGxiYWNrLlxuICAgIGxldCBvblBhdGhzU2VhcmNoZWRcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9wdGlvbnMub25QYXRoc1NlYXJjaGVkKSkge1xuICAgICAgLy8gTWFpbnRhaW4gYSBtYXAgb2YgZGlyZWN0b3JpZXMgdG8gdGhlIG51bWJlciBvZiBzZWFyY2ggcmVzdWx0cy4gV2hlbiBub3RpZmllZCBvZiBhIG5ldyBjb3VudCxcbiAgICAgIC8vIHJlcGxhY2UgdGhlIGVudHJ5IGluIHRoZSBtYXAgYW5kIHVwZGF0ZSB0aGUgdG90YWwuXG4gICAgICBjb25zdCBvblBhdGhzU2VhcmNoZWRPcHRpb24gPSBvcHRpb25zLm9uUGF0aHNTZWFyY2hlZFxuICAgICAgbGV0IHRvdGFsTnVtYmVyT2ZQYXRoc1NlYXJjaGVkID0gMFxuICAgICAgY29uc3QgbnVtYmVyT2ZQYXRoc1NlYXJjaGVkRm9yU2VhcmNoZXIgPSBuZXcgTWFwKClcbiAgICAgIG9uUGF0aHNTZWFyY2hlZCA9IGZ1bmN0aW9uIChzZWFyY2hlciwgbnVtYmVyT2ZQYXRoc1NlYXJjaGVkKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gbnVtYmVyT2ZQYXRoc1NlYXJjaGVkRm9yU2VhcmNoZXIuZ2V0KHNlYXJjaGVyKVxuICAgICAgICBpZiAob2xkVmFsdWUpIHtcbiAgICAgICAgICB0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZCAtPSBvbGRWYWx1ZVxuICAgICAgICB9XG4gICAgICAgIG51bWJlck9mUGF0aHNTZWFyY2hlZEZvclNlYXJjaGVyLnNldChzZWFyY2hlciwgbnVtYmVyT2ZQYXRoc1NlYXJjaGVkKVxuICAgICAgICB0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZCArPSBudW1iZXJPZlBhdGhzU2VhcmNoZWRcbiAgICAgICAgcmV0dXJuIG9uUGF0aHNTZWFyY2hlZE9wdGlvbih0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb25QYXRoc1NlYXJjaGVkID0gZnVuY3Rpb24gKCkge31cbiAgICB9XG5cbiAgICAvLyBLaWNrIG9mZiBhbGwgb2YgdGhlIHNlYXJjaGVzIGFuZCB1bmlmeSB0aGVtIGludG8gb25lIFByb21pc2UuXG4gICAgY29uc3QgYWxsU2VhcmNoZXMgPSBbXVxuICAgIGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIuZm9yRWFjaCgoZGlyZWN0b3JpZXMsIHNlYXJjaGVyKSA9PiB7XG4gICAgICBjb25zdCBzZWFyY2hPcHRpb25zID0ge1xuICAgICAgICBpbmNsdXNpb25zOiBvcHRpb25zLnBhdGhzIHx8IFtdLFxuICAgICAgICBpbmNsdWRlSGlkZGVuOiB0cnVlLFxuICAgICAgICBleGNsdWRlVmNzSWdub3JlczogdGhpcy5jb25maWcuZ2V0KCdjb3JlLmV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHMnKSxcbiAgICAgICAgZXhjbHVzaW9uczogdGhpcy5jb25maWcuZ2V0KCdjb3JlLmlnbm9yZWROYW1lcycpLFxuICAgICAgICBmb2xsb3c6IHRoaXMuY29uZmlnLmdldCgnY29yZS5mb2xsb3dTeW1saW5rcycpLFxuICAgICAgICBsZWFkaW5nQ29udGV4dExpbmVDb3VudDogb3B0aW9ucy5sZWFkaW5nQ29udGV4dExpbmVDb3VudCB8fCAwLFxuICAgICAgICB0cmFpbGluZ0NvbnRleHRMaW5lQ291bnQ6IG9wdGlvbnMudHJhaWxpbmdDb250ZXh0TGluZUNvdW50IHx8IDAsXG4gICAgICAgIGRpZE1hdGNoOiByZXN1bHQgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5wcm9qZWN0LmlzUGF0aE1vZGlmaWVkKHJlc3VsdC5maWxlUGF0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRvcihyZXN1bHQpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkaWRFcnJvciAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3IobnVsbCwgZXJyb3IpXG4gICAgICAgIH0sXG4gICAgICAgIGRpZFNlYXJjaFBhdGhzIChjb3VudCkge1xuICAgICAgICAgIHJldHVybiBvblBhdGhzU2VhcmNoZWQoc2VhcmNoZXIsIGNvdW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBkaXJlY3RvcnlTZWFyY2hlciA9IHNlYXJjaGVyLnNlYXJjaChkaXJlY3RvcmllcywgcmVnZXgsIHNlYXJjaE9wdGlvbnMpXG4gICAgICBhbGxTZWFyY2hlcy5wdXNoKGRpcmVjdG9yeVNlYXJjaGVyKVxuICAgIH0pXG4gICAgY29uc3Qgc2VhcmNoUHJvbWlzZSA9IFByb21pc2UuYWxsKGFsbFNlYXJjaGVzKVxuXG4gICAgZm9yIChsZXQgYnVmZmVyIG9mIHRoaXMucHJvamVjdC5nZXRCdWZmZXJzKCkpIHtcbiAgICAgIGlmIChidWZmZXIuaXNNb2RpZmllZCgpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gYnVmZmVyLmdldFBhdGgoKVxuICAgICAgICBpZiAoIXRoaXMucHJvamVjdC5jb250YWlucyhmaWxlUGF0aCkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIHZhciBtYXRjaGVzID0gW11cbiAgICAgICAgYnVmZmVyLnNjYW4ocmVnZXgsIG1hdGNoID0+IG1hdGNoZXMucHVzaChtYXRjaCkpXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpdGVyYXRvcih7ZmlsZVBhdGgsIG1hdGNoZXN9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBQcm9taXNlIHRoYXQgaXMgcmV0dXJuZWQgdG8gdGhlIGNsaWVudCBpcyBjYW5jZWxhYmxlLiBUbyBiZSBjb25zaXN0ZW50XG4gICAgLy8gd2l0aCB0aGUgZXhpc3RpbmcgYmVoYXZpb3IsIGluc3RlYWQgb2YgY2FuY2VsKCkgcmVqZWN0aW5nIHRoZSBwcm9taXNlLCBpdCBzaG91bGRcbiAgICAvLyByZXNvbHZlIGl0IHdpdGggdGhlIHNwZWNpYWwgdmFsdWUgJ2NhbmNlbGxlZCcuIEF0IGxlYXN0IHRoZSBidWlsdC1pbiBmaW5kLWFuZC1yZXBsYWNlXG4gICAgLy8gcGFja2FnZSByZWxpZXMgb24gdGhpcyBiZWhhdmlvci5cbiAgICBsZXQgaXNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIGNvbnN0IGNhbmNlbGxhYmxlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uU3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzQ2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmVzb2x2ZSgnY2FuY2VsbGVkJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgb25GYWlsdXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGxldCBwcm9taXNlIG9mIGFsbFNlYXJjaGVzKSB7IHByb21pc2UuY2FuY2VsKCkgfVxuICAgICAgICByZWplY3QoKVxuICAgICAgfVxuXG4gICAgICBzZWFyY2hQcm9taXNlLnRoZW4ob25TdWNjZXNzLCBvbkZhaWx1cmUpXG4gICAgfSlcbiAgICBjYW5jZWxsYWJsZVByb21pc2UuY2FuY2VsID0gKCkgPT4ge1xuICAgICAgaXNDYW5jZWxsZWQgPSB0cnVlXG4gICAgICAvLyBOb3RlIHRoYXQgY2FuY2VsbGluZyBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgYWxsU2VhcmNoZXMgd2lsbCBjYXVzZSBhbGwgb2YgdGhlIHNlYXJjaGVzXG4gICAgICAvLyB0byByZXNvbHZlLCB3aGljaCBjYXVzZXMgc2VhcmNoUHJvbWlzZSB0byByZXNvbHZlLCB3aGljaCBpcyB1bHRpbWF0ZWx5IHdoYXQgY2F1c2VzXG4gICAgICAvLyBjYW5jZWxsYWJsZVByb21pc2UgdG8gcmVzb2x2ZS5cbiAgICAgIGFsbFNlYXJjaGVzLm1hcCgocHJvbWlzZSkgPT4gcHJvbWlzZS5jYW5jZWwoKSlcbiAgICB9XG5cbiAgICAvLyBBbHRob3VnaCB0aGlzIG1ldGhvZCBjbGFpbXMgdG8gcmV0dXJuIGEgYFByb21pc2VgLCB0aGUgYFJlc3VsdHNQYW5lVmlldy5vblNlYXJjaCgpYFxuICAgIC8vIG1ldGhvZCBpbiB0aGUgZmluZC1hbmQtcmVwbGFjZSBwYWNrYWdlIGV4cGVjdHMgdGhlIG9iamVjdCByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCB0byBoYXZlIGFcbiAgICAvLyBgZG9uZSgpYCBtZXRob2QuIEluY2x1ZGUgYSBkb25lKCkgbWV0aG9kIHVudGlsIGZpbmQtYW5kLXJlcGxhY2UgY2FuIGJlIHVwZGF0ZWQuXG4gICAgY2FuY2VsbGFibGVQcm9taXNlLmRvbmUgPSBvblN1Y2Nlc3NPckZhaWx1cmUgPT4ge1xuICAgICAgY2FuY2VsbGFibGVQcm9taXNlLnRoZW4ob25TdWNjZXNzT3JGYWlsdXJlLCBvblN1Y2Nlc3NPckZhaWx1cmUpXG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxsYWJsZVByb21pc2VcbiAgfVxuXG4gIC8vIFB1YmxpYzogUGVyZm9ybXMgYSByZXBsYWNlIGFjcm9zcyBhbGwgdGhlIHNwZWNpZmllZCBmaWxlcyBpbiB0aGUgcHJvamVjdC5cbiAgLy9cbiAgLy8gKiBgcmVnZXhgIEEge1JlZ0V4cH0gdG8gc2VhcmNoIHdpdGguXG4gIC8vICogYHJlcGxhY2VtZW50VGV4dGAge1N0cmluZ30gdG8gcmVwbGFjZSBhbGwgbWF0Y2hlcyBvZiByZWdleCB3aXRoLlxuICAvLyAqIGBmaWxlUGF0aHNgIEFuIHtBcnJheX0gb2YgZmlsZSBwYXRoIHN0cmluZ3MgdG8gcnVuIHRoZSByZXBsYWNlIG9uLlxuICAvLyAqIGBpdGVyYXRvcmAgQSB7RnVuY3Rpb259IGNhbGxiYWNrIG9uIGVhY2ggZmlsZSB3aXRoIHJlcGxhY2VtZW50czpcbiAgLy8gICAqIGBvcHRpb25zYCB7T2JqZWN0fSB3aXRoIGtleXMgYGZpbGVQYXRoYCBhbmQgYHJlcGxhY2VtZW50c2AuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0uXG4gIHJlcGxhY2UgKHJlZ2V4LCByZXBsYWNlbWVudFRleHQsIGZpbGVQYXRocywgaXRlcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGJ1ZmZlclxuICAgICAgY29uc3Qgb3BlblBhdGhzID0gdGhpcy5wcm9qZWN0LmdldEJ1ZmZlcnMoKS5tYXAoYnVmZmVyID0+IGJ1ZmZlci5nZXRQYXRoKCkpXG4gICAgICBjb25zdCBvdXRPZlByb2Nlc3NQYXRocyA9IF8uZGlmZmVyZW5jZShmaWxlUGF0aHMsIG9wZW5QYXRocylcblxuICAgICAgbGV0IGluUHJvY2Vzc0ZpbmlzaGVkID0gIW9wZW5QYXRocy5sZW5ndGhcbiAgICAgIGxldCBvdXRPZlByb2Nlc3NGaW5pc2hlZCA9ICFvdXRPZlByb2Nlc3NQYXRocy5sZW5ndGhcbiAgICAgIGNvbnN0IGNoZWNrRmluaXNoZWQgPSAoKSA9PiB7XG4gICAgICAgIGlmIChvdXRPZlByb2Nlc3NGaW5pc2hlZCAmJiBpblByb2Nlc3NGaW5pc2hlZCkge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghb3V0T2ZQcm9jZXNzRmluaXNoZWQubGVuZ3RoKSB7XG4gICAgICAgIGxldCBmbGFncyA9ICdnJ1xuICAgICAgICBpZiAocmVnZXguaWdub3JlQ2FzZSkgeyBmbGFncyArPSAnaScgfVxuXG4gICAgICAgIGNvbnN0IHRhc2sgPSBUYXNrLm9uY2UoXG4gICAgICAgICAgcmVxdWlyZS5yZXNvbHZlKCcuL3JlcGxhY2UtaGFuZGxlcicpLFxuICAgICAgICAgIG91dE9mUHJvY2Vzc1BhdGhzLFxuICAgICAgICAgIHJlZ2V4LnNvdXJjZSxcbiAgICAgICAgICBmbGFncyxcbiAgICAgICAgICByZXBsYWNlbWVudFRleHQsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgb3V0T2ZQcm9jZXNzRmluaXNoZWQgPSB0cnVlXG4gICAgICAgICAgICBjaGVja0ZpbmlzaGVkKClcbiAgICAgICAgICB9XG4gICAgICAgIClcblxuICAgICAgICB0YXNrLm9uKCdyZXBsYWNlOnBhdGgtcmVwbGFjZWQnLCBpdGVyYXRvcilcbiAgICAgICAgdGFzay5vbigncmVwbGFjZTpmaWxlLWVycm9yJywgZXJyb3IgPT4geyBpdGVyYXRvcihudWxsLCBlcnJvcikgfSlcbiAgICAgIH1cblxuICAgICAgZm9yIChidWZmZXIgb2YgdGhpcy5wcm9qZWN0LmdldEJ1ZmZlcnMoKSkge1xuICAgICAgICBpZiAoIWZpbGVQYXRocy5pbmNsdWRlcyhidWZmZXIuZ2V0UGF0aCgpKSkgeyBjb250aW51ZSB9XG4gICAgICAgIGNvbnN0IHJlcGxhY2VtZW50cyA9IGJ1ZmZlci5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudFRleHQsIGl0ZXJhdG9yKVxuICAgICAgICBpZiAocmVwbGFjZW1lbnRzKSB7XG4gICAgICAgICAgaXRlcmF0b3Ioe2ZpbGVQYXRoOiBidWZmZXIuZ2V0UGF0aCgpLCByZXBsYWNlbWVudHN9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluUHJvY2Vzc0ZpbmlzaGVkID0gdHJ1ZVxuICAgICAgY2hlY2tGaW5pc2hlZCgpXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrb3V0SGVhZFJldmlzaW9uIChlZGl0b3IpIHtcbiAgICBpZiAoZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgY29uc3QgY2hlY2tvdXRIZWFkID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkobmV3IERpcmVjdG9yeShlZGl0b3IuZ2V0RGlyZWN0b3J5UGF0aCgpKSlcbiAgICAgICAgICAudGhlbihyZXBvc2l0b3J5ID0+IHJlcG9zaXRvcnkgIT0gbnVsbCA/IHJlcG9zaXRvcnkuY2hlY2tvdXRIZWFkRm9yRWRpdG9yKGVkaXRvcikgOiB1bmRlZmluZWQpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXQoJ2VkaXRvci5jb25maXJtQ2hlY2tvdXRIZWFkUmV2aXNpb24nKSkge1xuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0NvbmZpcm0gQ2hlY2tvdXQgSEVBRCBSZXZpc2lvbicsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRpc2NhcmQgYWxsIGNoYW5nZXMgdG8gXCIke2VkaXRvci5nZXRGaWxlTmFtZSgpfVwiIHNpbmNlIHRoZSBsYXN0IEdpdCBjb21taXQ/YCxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBPSzogY2hlY2tvdXRIZWFkLFxuICAgICAgICAgICAgQ2FuY2VsOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrb3V0SGVhZCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuICB9XG59XG4iXX0=