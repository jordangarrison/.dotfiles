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
    this.hasActiveTextEditor = false;

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
      this.hasActiveTextEditor = false;

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
      this.subscribeToDockToggling();
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

      this.hasActiveTextEditor = this.getActiveTextEditor() != null;

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

      if (paneContainer === this.getCenter()) {
        var hadActiveTextEditor = this.hasActiveTextEditor;
        this.hasActiveTextEditor = item instanceof TextEditor;

        if (this.hasActiveTextEditor || hadActiveTextEditor) {
          var itemValue = this.hasActiveTextEditor ? item : undefined;
          this.emitter.emit('did-change-active-text-editor', itemValue);
        }
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
    key: 'subscribeToDockToggling',
    value: function subscribeToDockToggling() {
      var _this5 = this;

      var docks = [this.getLeftDock(), this.getRightDock(), this.getBottomDock()];
      docks.forEach(function (dock) {
        dock.onDidChangeVisible(function (visible) {
          if (visible) return;
          var activeElement = document.activeElement;

          var dockElement = dock.getElement();
          if (dockElement === activeElement || dockElement.contains(activeElement)) {
            _this5.getCenter().activate();
          }
        });
      });
    }
  }, {
    key: 'subscribeToMovedItems',
    value: function subscribeToMovedItems() {
      var _this6 = this;

      var _loop = function _loop(paneContainer) {
        paneContainer.observePanes(function (pane) {
          pane.onDidAddItem(function (_ref4) {
            var item = _ref4.item;

            if (typeof item.getURI === 'function' && _this6.enablePersistence) {
              var uri = item.getURI();
              if (uri) {
                var _location = paneContainer.getLocation();
                var defaultLocation = undefined;
                if (typeof item.getDefaultLocation === 'function') {
                  defaultLocation = item.getDefaultLocation();
                }
                defaultLocation = defaultLocation || 'center';
                if (_location === defaultLocation) {
                  _this6.itemLocationStore['delete'](item.getURI());
                } else {
                  _this6.itemLocationStore.save(item.getURI(), _location);
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
      this.emitter.emit('did-change-window-title');
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
    //   * `editor` A {TextEditor} that is present in {::getTextEditors} at the time
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

    // Essential: Invoke the given callback when a text editor becomes the active
    // text editor and when there is no longer an active text editor.
    //
    // * `callback` {Function} to be called when the active text editor changes.
    //   * `editor` The active {TextEditor} or undefined if there is no longer an
    //      active text editor.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActiveTextEditor',
    value: function onDidChangeActiveTextEditor(callback) {
      return this.emitter.on('did-change-active-text-editor', callback);
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

    // Essential: Invoke the given callback with the current active text editor
    // (if any), with all future active text editors, and when there is no longer
    // an active text editor.
    //
    // * `callback` {Function} to be called when the active text editor changes.
    //   * `editor` The active {TextEditor} or undefined if there is not an
    //      active text editor.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActiveTextEditor',
    value: function observeActiveTextEditor(callback) {
      callback(this.getActiveTextEditor());

      return this.onDidChangeActiveTextEditor(callback);
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
  }, {
    key: 'onDidChangeWindowTitle',
    value: function onDidChangeWindowTitle(callback) {
      return this.emitter.on('did-change-window-title', callback);
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
      var _this7 = this;

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
        return _this7.textEditorRegistry.build(Object.assign({ buffer: buffer, largeFileMode: largeFileMode, autoHeight: false }, options));
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
      var _this8 = this;

      this.openers.push(opener);
      return new Disposable(function () {
        _.remove(_this8.openers, opener);
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

    // Essential: Get the workspace center's active item if it is a {TextEditor}.
    //
    // Returns a {TextEditor} or `undefined` if the workspace center's current
    // active item is not a {TextEditor}.
  }, {
    key: 'getActiveTextEditor',
    value: function getActiveTextEditor() {
      var activeItem = this.getCenter().getActivePaneItem();
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
      return Promise.all(this.getPaneContainers().map(function (container) {
        return container.confirmClose(options);
      })).then(function (results) {
        return !results.includes(false);
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
      return this.getCenter().getActivePane().saveActiveItem();
    }

    // Prompt the user for a path and save the active pane item to it.
    //
    // Opens a native dialog where the user selects a path on disk, then calls
    // `.saveAs` on the item with the selected path. This method does nothing if
    // the active item does not implement a `.saveAs` method.
  }, {
    key: 'saveActivePaneItemAs',
    value: function saveActivePaneItemAs() {
      this.getCenter().getActivePane().saveActiveItemAs();
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
  }, {
    key: 'getVisiblePanes',
    value: function getVisiblePanes() {
      return _.flatten(this.getVisiblePaneContainers().map(function (container) {
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

    // Close the active center pane item, or the active center pane if it is
    // empty, or the current window if there is only the empty root pane.
  }, {
    key: 'closeActivePaneItemOrEmptyPaneOrWindow',
    value: function closeActivePaneItemOrEmptyPaneOrWindow() {
      if (this.getCenter().getActivePaneItem() != null) {
        this.getCenter().getActivePane().destroyActiveItem();
      } else if (this.getCenter().getPanes().length > 1) {
        this.getCenter().destroyActivePane();
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
      var _this9 = this;

      return this.config.onDidChange('editor.fontSize', function (_ref6) {
        var oldValue = _ref6.oldValue;

        if (_this9.originalFontSize == null) {
          _this9.originalFontSize = oldValue;
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

    // Essential: Get the {WorkspaceCenter} at the center of the editor window.
  }, {
    key: 'getCenter',
    value: function getCenter() {
      return this.paneContainers.center;
    }

    // Essential: Get the {Dock} to the left of the editor window.
  }, {
    key: 'getLeftDock',
    value: function getLeftDock() {
      return this.paneContainers.left;
    }

    // Essential: Get the {Dock} to the right of the editor window.
  }, {
    key: 'getRightDock',
    value: function getRightDock() {
      return this.paneContainers.right;
    }

    // Essential: Get the {Dock} below the editor window.
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
  }, {
    key: 'getVisiblePaneContainers',
    value: function getVisiblePaneContainers() {
      var center = this.getCenter();
      return atom.workspace.getPaneContainers().filter(function (container) {
        return container === center || container.isVisible();
      });
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
      var _this10 = this;

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
          excludeVcsIgnores: _this10.config.get('core.excludeVcsIgnoredPaths'),
          exclusions: _this10.config.get('core.ignoredNames'),
          follow: _this10.config.get('core.followSymlinks'),
          leadingContextLineCount: options.leadingContextLineCount || 0,
          trailingContextLineCount: options.trailingContextLineCount || 0,
          didMatch: function didMatch(result) {
            if (!_this10.project.isPathModified(result.filePath)) {
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
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        var buffer = undefined;
        var openPaths = _this11.project.getBuffers().map(function (buffer) {
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

        for (buffer of _this11.project.getBuffers()) {
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
      var _this12 = this;

      if (editor.getPath()) {
        var checkoutHead = function checkoutHead() {
          return _this12.project.repositoryForDirectory(new Directory(editor.getDirectoryPath())).then(function (repository) {
            return repository && repository.checkoutHeadForEditor(editor);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9idWlsZGRpci9idWlsZC9CVUlMRC9hdG9tLTk2NmRmY2NiZGU5ZmYxN2M3NzI2NDJlYmNjNTZkNzAyZGQ4ZmZiMGMvb3V0L2FwcC9zcmMvd29ya3NwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7QUFFWCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs7QUFFcEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxZQUFZO0FBQUUsV0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUUsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFBRSxVQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLEFBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQUFBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQUU7R0FBRSxBQUFDLE9BQU8sVUFBVSxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUFFLFFBQUksVUFBVSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQUFBQyxJQUFJLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQUFBQyxPQUFPLFdBQVcsQ0FBQztHQUFFLENBQUM7Q0FBRSxDQUFBLEVBQUcsQ0FBQzs7QUFFdGpCLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQUUsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEFBQUMsU0FBUyxFQUFFLE9BQU8sTUFBTSxFQUFFO0FBQUUsUUFBSSxNQUFNLEdBQUcsR0FBRztRQUFFLFFBQVEsR0FBRyxHQUFHO1FBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxBQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQUFBQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQUFBQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEFBQUMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQUUsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUFDLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUFFLGVBQU8sU0FBUyxDQUFDO09BQUUsTUFBTTtBQUFFLFdBQUcsR0FBRyxNQUFNLENBQUMsQUFBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEFBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxBQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxBQUFDLFNBQVMsU0FBUyxDQUFDO09BQUU7S0FBRSxNQUFNLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUFFLE1BQU07QUFBRSxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsZUFBTyxTQUFTLENBQUM7T0FBRSxBQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUFFO0dBQUU7Q0FBRSxDQUFDOztBQUVycEIsU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7QUFBRSxNQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFBRSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsT0FBTyxJQUFJLENBQUM7R0FBRSxNQUFNO0FBQUUsV0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQUU7Q0FBRTs7QUFFL0wsU0FBUyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUU7QUFBRSxTQUFPLFlBQVk7QUFBRSxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxBQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQUUsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQUFBQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxBQUFDLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFBRSxZQUFJO0FBQUUsY0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUFFLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFBRSxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEFBQUMsT0FBTztTQUFFLEFBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFLE1BQU07QUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxL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OUUsQ0FBQTs7QUFFRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEVBQUU7QUFDekQsY0FBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztBQUMvQixtQkFBTyxFQUFFLGdDQUFnQztBQUN6QywyQkFBZSxFQUFBLG1EQUFBLEdBQXNELE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBQSw4QkFBOEI7QUFDdkgsbUJBQU8sRUFBRTtBQUNQLGdCQUFFLEVBQUUsWUFBWTtBQUNoQixvQkFBTSxFQUFFLElBQUk7YUFDYjtXQUNGLENBQUMsQ0FBQTtTQUNILE1BQU07QUFDTCxpQkFBTyxZQUFZLEVBQUUsQ0FBQTtTQUN0QjtPQUNGLE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDOUI7S0FDRjtHQStTQSxFQUFFO0FBQ0QsT0FBRyxFQUFFLGVBQWU7QUFDcEIsT0FBRyxFQTloRWEsU0FBQSxHQUFBLEdBQUc7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxvTEFBb0wsQ0FBQyxDQUFBO0FBQ3BNLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFBO0tBQ2hEO0dBK2hFQSxDQUFDLENBQUMsQ0FBQzs7QUFFSixTQTVsRXFCLFNBQVMsQ0FBQTtDQTZsRS9CLENBQUEsQ0E3bEV3QyxLQUFLLENBc3lEN0MsQ0FBQSIsImZpbGUiOiIvYnVpbGRkaXIvYnVpbGQvQlVJTEQvYXRvbS05NjZkZmNjYmRlOWZmMTdjNzcyNjQyZWJjYzU2ZDcwMmRkOGZmYjBjL291dC9hcHAvc3JjL3dvcmtzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKVxuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHtFbWl0dGVyLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2V2ZW50LWtpdCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKVxuY29uc3Qge0RpcmVjdG9yeX0gPSByZXF1aXJlKCdwYXRod2F0Y2hlcicpXG5jb25zdCBHcmltID0gcmVxdWlyZSgnZ3JpbScpXG5jb25zdCBEZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXIgPSByZXF1aXJlKCcuL2RlZmF1bHQtZGlyZWN0b3J5LXNlYXJjaGVyJylcbmNvbnN0IERvY2sgPSByZXF1aXJlKCcuL2RvY2snKVxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJylcbmNvbnN0IFN0YXRlU3RvcmUgPSByZXF1aXJlKCcuL3N0YXRlLXN0b3JlJylcbmNvbnN0IFRleHRFZGl0b3IgPSByZXF1aXJlKCcuL3RleHQtZWRpdG9yJylcbmNvbnN0IFBhbmVsID0gcmVxdWlyZSgnLi9wYW5lbCcpXG5jb25zdCBQYW5lbENvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFuZWwtY29udGFpbmVyJylcbmNvbnN0IFRhc2sgPSByZXF1aXJlKCcuL3Rhc2snKVxuY29uc3QgV29ya3NwYWNlQ2VudGVyID0gcmVxdWlyZSgnLi93b3Jrc3BhY2UtY2VudGVyJylcbmNvbnN0IFdvcmtzcGFjZUVsZW1lbnQgPSByZXF1aXJlKCcuL3dvcmtzcGFjZS1lbGVtZW50JylcblxuY29uc3QgU1RPUFBFRF9DSEFOR0lOR19BQ1RJVkVfUEFORV9JVEVNX0RFTEFZID0gMTAwXG5jb25zdCBBTExfTE9DQVRJT05TID0gWydjZW50ZXInLCAnbGVmdCcsICdyaWdodCcsICdib3R0b20nXVxuXG4vLyBFc3NlbnRpYWw6IFJlcHJlc2VudHMgdGhlIHN0YXRlIG9mIHRoZSB1c2VyIGludGVyZmFjZSBmb3IgdGhlIGVudGlyZSB3aW5kb3cuXG4vLyBBbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGlzIGF2YWlsYWJsZSB2aWEgdGhlIGBhdG9tLndvcmtzcGFjZWAgZ2xvYmFsLlxuLy9cbi8vIEludGVyYWN0IHdpdGggdGhpcyBvYmplY3QgdG8gb3BlbiBmaWxlcywgYmUgbm90aWZpZWQgb2YgY3VycmVudCBhbmQgZnV0dXJlXG4vLyBlZGl0b3JzLCBhbmQgbWFuaXB1bGF0ZSBwYW5lcy4gVG8gYWRkIHBhbmVscywgdXNlIHtXb3Jrc3BhY2U6OmFkZFRvcFBhbmVsfVxuLy8gYW5kIGZyaWVuZHMuXG4vL1xuLy8gIyMgV29ya3NwYWNlIEl0ZW1zXG4vL1xuLy8gVGhlIHRlcm0gXCJpdGVtXCIgcmVmZXJzIHRvIGFueXRoaW5nIHRoYXQgY2FuIGJlIGRpc3BsYXllZFxuLy8gaW4gYSBwYW5lIHdpdGhpbiB0aGUgd29ya3NwYWNlLCBlaXRoZXIgaW4gdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9IG9yIGluIG9uZVxuLy8gb2YgdGhlIHRocmVlIHtEb2NrfXMuIFRoZSB3b3Jrc3BhY2UgZXhwZWN0cyBpdGVtcyB0byBjb25mb3JtIHRvIHRoZVxuLy8gZm9sbG93aW5nIGludGVyZmFjZTpcbi8vXG4vLyAjIyMgUmVxdWlyZWQgTWV0aG9kc1xuLy9cbi8vICMjIyMgYGdldFRpdGxlKClgXG4vL1xuLy8gUmV0dXJucyBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIHRpdGxlIG9mIHRoZSBpdGVtIHRvIGRpc3BsYXkgb24gaXRzXG4vLyBhc3NvY2lhdGVkIHRhYi5cbi8vXG4vLyAjIyMgT3B0aW9uYWwgTWV0aG9kc1xuLy9cbi8vICMjIyMgYGdldEVsZW1lbnQoKWBcbi8vXG4vLyBJZiB5b3VyIGl0ZW0gYWxyZWFkeSAqaXMqIGEgRE9NIGVsZW1lbnQsIHlvdSBkbyBub3QgbmVlZCB0byBpbXBsZW1lbnQgdGhpc1xuLy8gbWV0aG9kLiBPdGhlcndpc2UgaXQgc2hvdWxkIHJldHVybiB0aGUgZWxlbWVudCB5b3Ugd2FudCB0byBkaXNwbGF5IHRvXG4vLyByZXByZXNlbnQgdGhpcyBpdGVtLlxuLy9cbi8vICMjIyMgYGRlc3Ryb3koKWBcbi8vXG4vLyBEZXN0cm95cyB0aGUgaXRlbS4gVGhpcyB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBpdGVtIGlzIHJlbW92ZWQgZnJvbSBpdHNcbi8vIHBhcmVudCBwYW5lLlxuLy9cbi8vICMjIyMgYG9uRGlkRGVzdHJveShjYWxsYmFjaylgXG4vL1xuLy8gQ2FsbGVkIGJ5IHRoZSB3b3Jrc3BhY2Ugc28gaXQgY2FuIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGl0ZW0gaXMgZGVzdHJveWVkLlxuLy8gTXVzdCByZXR1cm4gYSB7RGlzcG9zYWJsZX0uXG4vL1xuLy8gIyMjIyBgc2VyaWFsaXplKClgXG4vL1xuLy8gU2VyaWFsaXplIHRoZSBzdGF0ZSBvZiB0aGUgaXRlbS4gTXVzdCByZXR1cm4gYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHBhc3NlZCB0b1xuLy8gYEpTT04uc3RyaW5naWZ5YC4gVGhlIHN0YXRlIHNob3VsZCBpbmNsdWRlIGEgZmllbGQgY2FsbGVkIGBkZXNlcmlhbGl6ZXJgLFxuLy8gd2hpY2ggbmFtZXMgYSBkZXNlcmlhbGl6ZXIgZGVjbGFyZWQgaW4geW91ciBgcGFja2FnZS5qc29uYC4gVGhpcyBtZXRob2QgaXNcbi8vIGludm9rZWQgb24gaXRlbXMgd2hlbiBzZXJpYWxpemluZyB0aGUgd29ya3NwYWNlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIHRvXG4vLyB0aGUgc2FtZSBsb2NhdGlvbiBsYXRlci5cbi8vXG4vLyAjIyMjIGBnZXRVUkkoKWBcbi8vXG4vLyBSZXR1cm5zIHRoZSBVUkkgYXNzb2NpYXRlZCB3aXRoIHRoZSBpdGVtLlxuLy9cbi8vICMjIyMgYGdldExvbmdUaXRsZSgpYFxuLy9cbi8vIFJldHVybnMgYSB7U3RyaW5nfSBjb250YWluaW5nIGEgbG9uZ2VyIHZlcnNpb24gb2YgdGhlIHRpdGxlIHRvIGRpc3BsYXkgaW5cbi8vIHBsYWNlcyBsaWtlIHRoZSB3aW5kb3cgdGl0bGUgb3Igb24gdGFicyB0aGVpciBzaG9ydCB0aXRsZXMgYXJlIGFtYmlndW91cy5cbi8vXG4vLyAjIyMjIGBvbkRpZENoYW5nZVRpdGxlYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIHRoZSBpdGVtJ3MgdGl0bGUgY2hhbmdlcy5cbi8vIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYGdldEljb25OYW1lKClgXG4vL1xuLy8gUmV0dXJuIGEge1N0cmluZ30gd2l0aCB0aGUgbmFtZSBvZiBhbiBpY29uLiBJZiB0aGlzIG1ldGhvZCBpcyBkZWZpbmVkIGFuZFxuLy8gcmV0dXJucyBhIHN0cmluZywgdGhlIGl0ZW0ncyB0YWIgZWxlbWVudCB3aWxsIGJlIHJlbmRlcmVkIHdpdGggdGhlIGBpY29uYCBhbmRcbi8vIGBpY29uLSR7aWNvbk5hbWV9YCBDU1MgY2xhc3Nlcy5cbi8vXG4vLyAjIyMgYG9uRGlkQ2hhbmdlSWNvbihjYWxsYmFjaylgXG4vL1xuLy8gQ2FsbGVkIGJ5IHRoZSB3b3Jrc3BhY2Ugc28gaXQgY2FuIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGl0ZW0ncyBpY29uIGNoYW5nZXMuXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBnZXREZWZhdWx0TG9jYXRpb24oKWBcbi8vXG4vLyBUZWxscyB0aGUgd29ya3NwYWNlIHdoZXJlIHlvdXIgaXRlbSBzaG91bGQgYmUgb3BlbmVkIGluIGFic2VuY2Ugb2YgYSB1c2VyXG4vLyBvdmVycmlkZS4gSXRlbXMgY2FuIGFwcGVhciBpbiB0aGUgY2VudGVyIG9yIGluIGEgZG9jayBvbiB0aGUgbGVmdCwgcmlnaHQsIG9yXG4vLyBib3R0b20gb2YgdGhlIHdvcmtzcGFjZS5cbi8vXG4vLyBSZXR1cm5zIGEge1N0cmluZ30gd2l0aCBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6IGAnY2VudGVyJ2AsIGAnbGVmdCdgLFxuLy8gYCdyaWdodCdgLCBgJ2JvdHRvbSdgLiBJZiB0aGlzIG1ldGhvZCBpcyBub3QgZGVmaW5lZCwgYCdjZW50ZXInYCBpcyB0aGVcbi8vIGRlZmF1bHQuXG4vL1xuLy8gIyMjIyBgZ2V0QWxsb3dlZExvY2F0aW9ucygpYFxuLy9cbi8vIFRlbGxzIHRoZSB3b3Jrc3BhY2Ugd2hlcmUgdGhpcyBpdGVtIGNhbiBiZSBtb3ZlZC4gUmV0dXJucyBhbiB7QXJyYXl9IG9mIG9uZVxuLy8gb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczogYCdjZW50ZXInYCwgYCdsZWZ0J2AsIGAncmlnaHQnYCwgb3Jcbi8vIGAnYm90dG9tJ2AuXG4vL1xuLy8gIyMjIyBgaXNQZXJtYW5lbnREb2NrSXRlbSgpYFxuLy9cbi8vIFRlbGxzIHRoZSB3b3Jrc3BhY2Ugd2hldGhlciBvciBub3QgdGhpcyBpdGVtIGNhbiBiZSBjbG9zZWQgYnkgdGhlIHVzZXIgYnlcbi8vIGNsaWNraW5nIGFuIGB4YCBvbiBpdHMgdGFiLiBVc2Ugb2YgdGhpcyBmZWF0dXJlIGlzIGRpc2NvdXJhZ2VkIHVubGVzcyB0aGVyZSdzXG4vLyBhIHZlcnkgZ29vZCByZWFzb24gbm90IHRvIGFsbG93IHVzZXJzIHRvIGNsb3NlIHlvdXIgaXRlbS4gSXRlbXMgY2FuIGJlIG1hZGVcbi8vIHBlcm1hbmVudCAqb25seSogd2hlbiB0aGV5IGFyZSBjb250YWluZWQgaW4gZG9ja3MuIENlbnRlciBwYW5lIGl0ZW1zIGNhblxuLy8gYWx3YXlzIGJlIHJlbW92ZWQuIE5vdGUgdGhhdCBpdCBpcyBjdXJyZW50bHkgc3RpbGwgcG9zc2libGUgdG8gY2xvc2UgZG9ja1xuLy8gaXRlbXMgdmlhIHRoZSBgQ2xvc2UgUGFuZWAgb3B0aW9uIGluIHRoZSBjb250ZXh0IG1lbnUgYW5kIHZpYSBBdG9tIEFQSXMsIHNvXG4vLyB5b3Ugc2hvdWxkIHN0aWxsIGJlIHByZXBhcmVkIHRvIGhhbmRsZSB5b3VyIGRvY2sgaXRlbXMgYmVpbmcgZGVzdHJveWVkIGJ5IHRoZVxuLy8gdXNlciBldmVuIGlmIHlvdSBpbXBsZW1lbnQgdGhpcyBtZXRob2QuXG4vL1xuLy8gIyMjIyBgc2F2ZSgpYFxuLy9cbi8vIFNhdmVzIHRoZSBpdGVtLlxuLy9cbi8vICMjIyMgYHNhdmVBcyhwYXRoKWBcbi8vXG4vLyBTYXZlcyB0aGUgaXRlbSB0byB0aGUgc3BlY2lmaWVkIHBhdGguXG4vL1xuLy8gIyMjIyBgZ2V0UGF0aCgpYFxuLy9cbi8vIFJldHVybnMgdGhlIGxvY2FsIHBhdGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgaXRlbS4gVGhpcyBpcyBvbmx5IHVzZWQgdG8gc2V0XG4vLyB0aGUgaW5pdGlhbCBsb2NhdGlvbiBvZiB0aGUgXCJzYXZlIGFzXCIgZGlhbG9nLlxuLy9cbi8vICMjIyMgYGlzTW9kaWZpZWQoKWBcbi8vXG4vLyBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGlzIG1vZGlmaWVkIHRvIHJlZmxlY3QgbW9kaWZpY2F0aW9uIGluIHRoZVxuLy8gVUkuXG4vL1xuLy8gIyMjIyBgb25EaWRDaGFuZ2VNb2RpZmllZCgpYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIGl0ZW0ncyBtb2RpZmllZCBzdGF0dXNcbi8vIGNoYW5nZXMuIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYGNvcHkoKWBcbi8vXG4vLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBpdGVtLiBJZiBkZWZpbmVkLCB0aGUgd29ya3NwYWNlIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCB0b1xuLy8gZHVwbGljYXRlIHRoZSBpdGVtIHdoZW4gc3BsaXR0aW5nIHBhbmVzIHZpYSBjZXJ0YWluIHNwbGl0IGNvbW1hbmRzLlxuLy9cbi8vICMjIyMgYGdldFByZWZlcnJlZEhlaWdodCgpYFxuLy9cbi8vIElmIHRoaXMgaXRlbSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGJvdHRvbSB7RG9ja30sIGNhbGxlZCBieSB0aGUgd29ya3NwYWNlIHdoZW5cbi8vIGluaXRpYWxseSBkaXNwbGF5aW5nIHRoZSBkb2NrIHRvIHNldCBpdHMgaGVpZ2h0LiBPbmNlIHRoZSBkb2NrIGhhcyBiZWVuXG4vLyByZXNpemVkIGJ5IHRoZSB1c2VyLCB0aGVpciBoZWlnaHQgd2lsbCBvdmVycmlkZSB0aGlzIHZhbHVlLlxuLy9cbi8vIFJldHVybnMgYSB7TnVtYmVyfS5cbi8vXG4vLyAjIyMjIGBnZXRQcmVmZXJyZWRXaWR0aCgpYFxuLy9cbi8vIElmIHRoaXMgaXRlbSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGxlZnQgb3IgcmlnaHQge0RvY2t9LCBjYWxsZWQgYnkgdGhlXG4vLyB3b3Jrc3BhY2Ugd2hlbiBpbml0aWFsbHkgZGlzcGxheWluZyB0aGUgZG9jayB0byBzZXQgaXRzIHdpZHRoLiBPbmNlIHRoZSBkb2NrXG4vLyBoYXMgYmVlbiByZXNpemVkIGJ5IHRoZSB1c2VyLCB0aGVpciB3aWR0aCB3aWxsIG92ZXJyaWRlIHRoaXMgdmFsdWUuXG4vL1xuLy8gUmV0dXJucyBhIHtOdW1iZXJ9LlxuLy9cbi8vICMjIyMgYG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlKGNhbGxiYWNrKWBcbi8vXG4vLyBJZiB0aGUgd29ya3NwYWNlIGlzIGNvbmZpZ3VyZWQgdG8gdXNlICpwZW5kaW5nIHBhbmUgaXRlbXMqLCB0aGUgd29ya3NwYWNlXG4vLyB3aWxsIHN1YnNjcmliZSB0byB0aGlzIG1ldGhvZCB0byB0ZXJtaW5hdGUgdGhlIHBlbmRpbmcgc3RhdGUgb2YgdGhlIGl0ZW0uXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBzaG91bGRQcm9tcHRUb1NhdmUoKWBcbi8vXG4vLyBUaGlzIG1ldGhvZCBpbmRpY2F0ZXMgd2hldGhlciBBdG9tIHNob3VsZCBwcm9tcHQgdGhlIHVzZXIgdG8gc2F2ZSB0aGlzIGl0ZW1cbi8vIHdoZW4gdGhlIHVzZXIgY2xvc2VzIG9yIHJlbG9hZHMgdGhlIHdpbmRvdy4gUmV0dXJucyBhIGJvb2xlYW4uXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFdvcmtzcGFjZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IgKHBhcmFtcykge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcblxuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUgPSB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlLmJpbmQodGhpcylcbiAgICB0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkID0gdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWREZXN0cm95UGFuZUl0ZW0gPSB0aGlzLmRpZERlc3Ryb3lQYW5lSXRlbS5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyID0gdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtT25QYW5lQ29udGFpbmVyID0gdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIgPSB0aGlzLmRpZEFjdGl2YXRlUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLmVuYWJsZVBlcnNpc3RlbmNlID0gcGFyYW1zLmVuYWJsZVBlcnNpc3RlbmNlXG4gICAgdGhpcy5wYWNrYWdlTWFuYWdlciA9IHBhcmFtcy5wYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuY29uZmlnID0gcGFyYW1zLmNvbmZpZ1xuICAgIHRoaXMucHJvamVjdCA9IHBhcmFtcy5wcm9qZWN0XG4gICAgdGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyID0gcGFyYW1zLm5vdGlmaWNhdGlvbk1hbmFnZXJcbiAgICB0aGlzLnZpZXdSZWdpc3RyeSA9IHBhcmFtcy52aWV3UmVnaXN0cnlcbiAgICB0aGlzLmdyYW1tYXJSZWdpc3RyeSA9IHBhcmFtcy5ncmFtbWFyUmVnaXN0cnlcbiAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUgPSBwYXJhbXMuYXBwbGljYXRpb25EZWxlZ2F0ZVxuICAgIHRoaXMuYXNzZXJ0ID0gcGFyYW1zLmFzc2VydFxuICAgIHRoaXMuZGVzZXJpYWxpemVyTWFuYWdlciA9IHBhcmFtcy5kZXNlcmlhbGl6ZXJNYW5hZ2VyXG4gICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkgPSBwYXJhbXMudGV4dEVkaXRvclJlZ2lzdHJ5XG4gICAgdGhpcy5zdHlsZU1hbmFnZXIgPSBwYXJhbXMuc3R5bGVNYW5hZ2VyXG4gICAgdGhpcy5kcmFnZ2luZ0l0ZW0gPSBmYWxzZVxuICAgIHRoaXMuaXRlbUxvY2F0aW9uU3RvcmUgPSBuZXcgU3RhdGVTdG9yZSgnQXRvbVByZXZpb3VzSXRlbUxvY2F0aW9ucycsIDEpXG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5vcGVuZXJzID0gW11cbiAgICB0aGlzLmRlc3Ryb3llZEl0ZW1VUklzID0gW11cbiAgICB0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCA9IG51bGxcblxuICAgIHRoaXMuZGVmYXVsdERpcmVjdG9yeVNlYXJjaGVyID0gbmV3IERlZmF1bHREaXJlY3RvcnlTZWFyY2hlcigpXG4gICAgdGhpcy5jb25zdW1lU2VydmljZXModGhpcy5wYWNrYWdlTWFuYWdlcilcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMgPSB7XG4gICAgICBjZW50ZXI6IHRoaXMuY3JlYXRlQ2VudGVyKCksXG4gICAgICBsZWZ0OiB0aGlzLmNyZWF0ZURvY2soJ2xlZnQnKSxcbiAgICAgIHJpZ2h0OiB0aGlzLmNyZWF0ZURvY2soJ3JpZ2h0JyksXG4gICAgICBib3R0b206IHRoaXMuY3JlYXRlRG9jaygnYm90dG9tJylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXJcbiAgICB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPSBmYWxzZVxuXG4gICAgdGhpcy5wYW5lbENvbnRhaW5lcnMgPSB7XG4gICAgICB0b3A6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICd0b3AnfSksXG4gICAgICBsZWZ0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnbGVmdCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdH0pLFxuICAgICAgcmlnaHQ6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdyaWdodCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHR9KSxcbiAgICAgIGJvdHRvbTogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2JvdHRvbScsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tfSksXG4gICAgICBoZWFkZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdoZWFkZXInfSksXG4gICAgICBmb290ZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdmb290ZXInfSksXG4gICAgICBtb2RhbDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ21vZGFsJ30pXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb0V2ZW50cygpXG4gIH1cblxuICBnZXQgcGFuZUNvbnRhaW5lciAoKSB7XG4gICAgR3JpbS5kZXByZWNhdGUoJ2BhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyYCBoYXMgYWx3YXlzIGJlZW4gcHJpdmF0ZSwgYnV0IGl0IGlzIG5vdyBnb25lLiBQbGVhc2UgdXNlIGBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKWAgaW5zdGVhZCBhbmQgY29uc3VsdCB0aGUgd29ya3NwYWNlIEFQSSBkb2NzIGZvciBwdWJsaWMgbWV0aG9kcy4nKVxuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5wYW5lQ29udGFpbmVyXG4gIH1cblxuICBnZXRFbGVtZW50ICgpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gbmV3IFdvcmtzcGFjZUVsZW1lbnQoKS5pbml0aWFsaXplKHRoaXMsIHtcbiAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgICAgcHJvamVjdDogdGhpcy5wcm9qZWN0LFxuICAgICAgICB2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LFxuICAgICAgICBzdHlsZU1hbmFnZXI6IHRoaXMuc3R5bGVNYW5hZ2VyXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbGVtZW50XG4gIH1cblxuICBjcmVhdGVDZW50ZXIgKCkge1xuICAgIHJldHVybiBuZXcgV29ya3NwYWNlQ2VudGVyKHtcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBhcHBsaWNhdGlvbkRlbGVnYXRlOiB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUsXG4gICAgICBub3RpZmljYXRpb25NYW5hZ2VyOiB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIsXG4gICAgICBkZXNlcmlhbGl6ZXJNYW5hZ2VyOiB0aGlzLmRlc2VyaWFsaXplck1hbmFnZXIsXG4gICAgICB2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LFxuICAgICAgZGlkQWN0aXZhdGU6IHRoaXMuZGlkQWN0aXZhdGVQYW5lQ29udGFpbmVyLFxuICAgICAgZGlkQ2hhbmdlQWN0aXZlUGFuZTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyLFxuICAgICAgZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW06IHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW1PblBhbmVDb250YWluZXIsXG4gICAgICBkaWREZXN0cm95UGFuZUl0ZW06IHRoaXMuZGlkRGVzdHJveVBhbmVJdGVtXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZURvY2sgKGxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBEb2NrKHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGFwcGxpY2F0aW9uRGVsZWdhdGU6IHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZSxcbiAgICAgIGRlc2VyaWFsaXplck1hbmFnZXI6IHRoaXMuZGVzZXJpYWxpemVyTWFuYWdlcixcbiAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IHRoaXMubm90aWZpY2F0aW9uTWFuYWdlcixcbiAgICAgIHZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksXG4gICAgICBkaWRBY3RpdmF0ZTogdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lOiB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVPblBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lcixcbiAgICAgIGRpZERlc3Ryb3lQYW5lSXRlbTogdGhpcy5kaWREZXN0cm95UGFuZUl0ZW1cbiAgICB9KVxuICB9XG5cbiAgcmVzZXQgKHBhY2thZ2VNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYWNrYWdlTWFuYWdlciA9IHBhY2thZ2VNYW5hZ2VyXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc3Ryb3koKVxuXG4gICAgXy52YWx1ZXModGhpcy5wYW5lbENvbnRhaW5lcnMpLmZvckVhY2gocGFuZWxDb250YWluZXIgPT4geyBwYW5lbENvbnRhaW5lci5kZXN0cm95KCkgfSlcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMgPSB7XG4gICAgICBjZW50ZXI6IHRoaXMuY3JlYXRlQ2VudGVyKCksXG4gICAgICBsZWZ0OiB0aGlzLmNyZWF0ZURvY2soJ2xlZnQnKSxcbiAgICAgIHJpZ2h0OiB0aGlzLmNyZWF0ZURvY2soJ3JpZ2h0JyksXG4gICAgICBib3R0b206IHRoaXMuY3JlYXRlRG9jaygnYm90dG9tJylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXJcbiAgICB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPSBmYWxzZVxuXG4gICAgdGhpcy5wYW5lbENvbnRhaW5lcnMgPSB7XG4gICAgICB0b3A6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICd0b3AnfSksXG4gICAgICBsZWZ0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnbGVmdCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdH0pLFxuICAgICAgcmlnaHQ6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdyaWdodCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHR9KSxcbiAgICAgIGJvdHRvbTogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2JvdHRvbScsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tfSksXG4gICAgICBoZWFkZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdoZWFkZXInfSksXG4gICAgICBmb290ZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdmb290ZXInfSksXG4gICAgICBtb2RhbDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ21vZGFsJ30pXG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbEZvbnRTaXplID0gbnVsbFxuICAgIHRoaXMub3BlbmVycyA9IFtdXG4gICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcyA9IFtdXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxuICAgIHRoaXMuY29uc3VtZVNlcnZpY2VzKHRoaXMucGFja2FnZU1hbmFnZXIpXG4gIH1cblxuICBzdWJzY3JpYmVUb0V2ZW50cyAoKSB7XG4gICAgdGhpcy5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHModGhpcy51cGRhdGVXaW5kb3dUaXRsZSlcbiAgICB0aGlzLnN1YnNjcmliZVRvRm9udFNpemUoKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9BZGRlZEl0ZW1zKClcbiAgICB0aGlzLnN1YnNjcmliZVRvTW92ZWRJdGVtcygpXG4gICAgdGhpcy5zdWJzY3JpYmVUb0RvY2tUb2dnbGluZygpXG4gIH1cblxuICBjb25zdW1lU2VydmljZXMgKHtzZXJ2aWNlSHVifSkge1xuICAgIHRoaXMuZGlyZWN0b3J5U2VhcmNoZXJzID0gW11cbiAgICBzZXJ2aWNlSHViLmNvbnN1bWUoXG4gICAgICAnYXRvbS5kaXJlY3Rvcnktc2VhcmNoZXInLFxuICAgICAgJ14wLjEuMCcsXG4gICAgICBwcm92aWRlciA9PiB0aGlzLmRpcmVjdG9yeVNlYXJjaGVycy51bnNoaWZ0KHByb3ZpZGVyKVxuICAgIClcbiAgfVxuXG4gIC8vIENhbGxlZCBieSB0aGUgU2VyaWFsaXphYmxlIG1peGluIGR1cmluZyBzZXJpYWxpemF0aW9uLlxuICBzZXJpYWxpemUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdXb3Jrc3BhY2UnLFxuICAgICAgcGFja2FnZXNXaXRoQWN0aXZlR3JhbW1hcnM6IHRoaXMuZ2V0UGFja2FnZU5hbWVzV2l0aEFjdGl2ZUdyYW1tYXJzKCksXG4gICAgICBkZXN0cm95ZWRJdGVtVVJJczogdGhpcy5kZXN0cm95ZWRJdGVtVVJJcy5zbGljZSgpLFxuICAgICAgLy8gRW5zdXJlIGRlc2VyaWFsaXppbmcgMS4xNyBzdGF0ZSB3aXRoIHByZSAxLjE3IEF0b20gZG9lcyBub3QgZXJyb3JcbiAgICAgIC8vIFRPRE86IFJlbW92ZSBhZnRlciAxLjE3IGhhcyBiZWVuIG9uIHN0YWJsZSBmb3IgYSB3aGlsZVxuICAgICAgcGFuZUNvbnRhaW5lcjoge3ZlcnNpb246IDJ9LFxuICAgICAgcGFuZUNvbnRhaW5lcnM6IHtcbiAgICAgICAgY2VudGVyOiB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5zZXJpYWxpemUoKSxcbiAgICAgICAgbGVmdDogdGhpcy5wYW5lQ29udGFpbmVycy5sZWZ0LnNlcmlhbGl6ZSgpLFxuICAgICAgICByaWdodDogdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5zZXJpYWxpemUoKSxcbiAgICAgICAgYm90dG9tOiB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5zZXJpYWxpemUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzdGF0ZSwgZGVzZXJpYWxpemVyTWFuYWdlcikge1xuICAgIGNvbnN0IHBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzID1cbiAgICAgIHN0YXRlLnBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzICE9IG51bGwgPyBzdGF0ZS5wYWNrYWdlc1dpdGhBY3RpdmVHcmFtbWFycyA6IFtdXG4gICAgZm9yIChsZXQgcGFja2FnZU5hbWUgb2YgcGFja2FnZXNXaXRoQWN0aXZlR3JhbW1hcnMpIHtcbiAgICAgIGNvbnN0IHBrZyA9IHRoaXMucGFja2FnZU1hbmFnZXIuZ2V0TG9hZGVkUGFja2FnZShwYWNrYWdlTmFtZSlcbiAgICAgIGlmIChwa2cgIT0gbnVsbCkge1xuICAgICAgICBwa2cubG9hZEdyYW1tYXJzU3luYygpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdGF0ZS5kZXN0cm95ZWRJdGVtVVJJcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmRlc3Ryb3llZEl0ZW1VUklzID0gc3RhdGUuZGVzdHJveWVkSXRlbVVSSXNcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUucGFuZUNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc2VyaWFsaXplKHN0YXRlLnBhbmVDb250YWluZXJzLmNlbnRlciwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5sZWZ0LCBkZXNlcmlhbGl6ZXJNYW5hZ2VyKVxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5yaWdodCwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc2VyaWFsaXplKHN0YXRlLnBhbmVDb250YWluZXJzLmJvdHRvbSwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICB9IGVsc2UgaWYgKHN0YXRlLnBhbmVDb250YWluZXIpIHtcbiAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGZhbGxiYWNrIG9uY2UgYSBsb3Qgb2YgdGltZSBoYXMgcGFzc2VkIHNpbmNlIDEuMTcgd2FzIHJlbGVhc2VkXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVyLCBkZXNlcmlhbGl6ZXJNYW5hZ2VyKVxuICAgIH1cblxuICAgIHRoaXMuaGFzQWN0aXZlVGV4dEVkaXRvciA9IHRoaXMuZ2V0QWN0aXZlVGV4dEVkaXRvcigpICE9IG51bGxcblxuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUoKVxuICB9XG5cbiAgZ2V0UGFja2FnZU5hbWVzV2l0aEFjdGl2ZUdyYW1tYXJzICgpIHtcbiAgICBjb25zdCBwYWNrYWdlTmFtZXMgPSBbXVxuICAgIGNvbnN0IGFkZEdyYW1tYXIgPSAoe2luY2x1ZGVkR3JhbW1hclNjb3BlcywgcGFja2FnZU5hbWV9ID0ge30pID0+IHtcbiAgICAgIGlmICghcGFja2FnZU5hbWUpIHsgcmV0dXJuIH1cbiAgICAgIC8vIFByZXZlbnQgY3ljbGVzXG4gICAgICBpZiAocGFja2FnZU5hbWVzLmluZGV4T2YocGFja2FnZU5hbWUpICE9PSAtMSkgeyByZXR1cm4gfVxuXG4gICAgICBwYWNrYWdlTmFtZXMucHVzaChwYWNrYWdlTmFtZSlcbiAgICAgIGZvciAobGV0IHNjb3BlTmFtZSBvZiBpbmNsdWRlZEdyYW1tYXJTY29wZXMgIT0gbnVsbCA/IGluY2x1ZGVkR3JhbW1hclNjb3BlcyA6IFtdKSB7XG4gICAgICAgIGFkZEdyYW1tYXIodGhpcy5ncmFtbWFyUmVnaXN0cnkuZ3JhbW1hckZvclNjb3BlTmFtZShzY29wZU5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmdldFRleHRFZGl0b3JzKClcbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgZWRpdG9ycykgeyBhZGRHcmFtbWFyKGVkaXRvci5nZXRHcmFtbWFyKCkpIH1cblxuICAgIGlmIChlZGl0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGdyYW1tYXIgb2YgdGhpcy5ncmFtbWFyUmVnaXN0cnkuZ2V0R3JhbW1hcnMoKSkge1xuICAgICAgICBpZiAoZ3JhbW1hci5pbmplY3Rpb25TZWxlY3Rvcikge1xuICAgICAgICAgIGFkZEdyYW1tYXIoZ3JhbW1hcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfLnVuaXEocGFja2FnZU5hbWVzKVxuICB9XG5cbiAgZGlkQWN0aXZhdGVQYW5lQ29udGFpbmVyIChwYW5lQ29udGFpbmVyKSB7XG4gICAgaWYgKHBhbmVDb250YWluZXIgIT09IHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpKSB7XG4gICAgICB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIgPSBwYW5lQ29udGFpbmVyXG4gICAgICB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lci5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtY29udGFpbmVyJywgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUnLCB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZSgpKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtaXRlbScsIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lci5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuICAgIH1cbiAgfVxuXG4gIGRpZENoYW5nZUFjdGl2ZVBhbmVPblBhbmVDb250YWluZXIgKHBhbmVDb250YWluZXIsIHBhbmUpIHtcbiAgICBpZiAocGFuZUNvbnRhaW5lciA9PT0gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lJywgcGFuZSlcbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lciAocGFuZUNvbnRhaW5lciwgaXRlbSkge1xuICAgIGlmIChwYW5lQ29udGFpbmVyID09PSB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKSkge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShpdGVtKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtaXRlbScsIGl0ZW0pXG4gICAgfVxuXG4gICAgaWYgKHBhbmVDb250YWluZXIgPT09IHRoaXMuZ2V0Q2VudGVyKCkpIHtcbiAgICAgIGNvbnN0IGhhZEFjdGl2ZVRleHRFZGl0b3IgPSB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3JcbiAgICAgIHRoaXMuaGFzQWN0aXZlVGV4dEVkaXRvciA9IGl0ZW0gaW5zdGFuY2VvZiBUZXh0RWRpdG9yXG5cbiAgICAgIGlmICh0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgfHwgaGFkQWN0aXZlVGV4dEVkaXRvcikge1xuICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPyBpdGVtIDogdW5kZWZpbmVkXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS10ZXh0LWVkaXRvcicsIGl0ZW1WYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkge1xuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUoKVxuICAgIHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQoKVxuICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zKSB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBsZXQgbW9kaWZpZWRTdWJzY3JpcHRpb24sIHRpdGxlU3Vic2NyaXB0aW9uXG5cbiAgICBpZiAoaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLm9uRGlkQ2hhbmdlVGl0bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRpdGxlU3Vic2NyaXB0aW9uID0gaXRlbS5vbkRpZENoYW5nZVRpdGxlKHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgfSBlbHNlIGlmIChpdGVtICE9IG51bGwgJiYgdHlwZW9mIGl0ZW0ub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRpdGxlU3Vic2NyaXB0aW9uID0gaXRlbS5vbigndGl0bGUtY2hhbmdlZCcsIHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgICBpZiAodGl0bGVTdWJzY3JpcHRpb24gPT0gbnVsbCB8fCB0eXBlb2YgdGl0bGVTdWJzY3JpcHRpb24uZGlzcG9zZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aXRsZVN1YnNjcmlwdGlvbiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBpdGVtLm9mZigndGl0bGUtY2hhbmdlZCcsIHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0gIT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5vbkRpZENoYW5nZU1vZGlmaWVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2RpZmllZFN1YnNjcmlwdGlvbiA9IGl0ZW0ub25EaWRDaGFuZ2VNb2RpZmllZCh0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkKVxuICAgIH0gZWxzZSBpZiAoaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2RpZmllZFN1YnNjcmlwdGlvbiA9IGl0ZW0ub24oJ21vZGlmaWVkLXN0YXR1cy1jaGFuZ2VkJywgdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZClcbiAgICAgIGlmIChtb2RpZmllZFN1YnNjcmlwdGlvbiA9PSBudWxsIHx8IHR5cGVvZiBtb2RpZmllZFN1YnNjcmlwdGlvbi5kaXNwb3NlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1vZGlmaWVkU3Vic2NyaXB0aW9uID0gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICAgIGl0ZW0ub2ZmKCdtb2RpZmllZC1zdGF0dXMtY2hhbmdlZCcsIHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRpdGxlU3Vic2NyaXB0aW9uICE9IG51bGwpIHsgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucy5hZGQodGl0bGVTdWJzY3JpcHRpb24pIH1cbiAgICBpZiAobW9kaWZpZWRTdWJzY3JpcHRpb24gIT0gbnVsbCkgeyB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmFkZChtb2RpZmllZFN1YnNjcmlwdGlvbikgfVxuXG4gICAgdGhpcy5jYW5jZWxTdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQoKVxuICAgIHRoaXMuc3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCA9IG51bGxcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtc3RvcC1jaGFuZ2luZy1hY3RpdmUtcGFuZS1pdGVtJywgaXRlbSlcbiAgICB9LCBTVE9QUEVEX0NIQU5HSU5HX0FDVElWRV9QQU5FX0lURU1fREVMQVkpXG4gIH1cblxuICBjYW5jZWxTdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgKCkge1xuICAgIGlmICh0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQpXG4gICAgfVxuICB9XG5cbiAgc2V0RHJhZ2dpbmdJdGVtIChkcmFnZ2luZ0l0ZW0pIHtcbiAgICBfLnZhbHVlcyh0aGlzLnBhbmVDb250YWluZXJzKS5mb3JFYWNoKGRvY2sgPT4ge1xuICAgICAgZG9jay5zZXREcmFnZ2luZ0l0ZW0oZHJhZ2dpbmdJdGVtKVxuICAgIH0pXG4gIH1cblxuICBzdWJzY3JpYmVUb0FkZGVkSXRlbXMgKCkge1xuICAgIHRoaXMub25EaWRBZGRQYW5lSXRlbSgoe2l0ZW0sIHBhbmUsIGluZGV4fSkgPT4ge1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5hZGQoaXRlbSksXG4gICAgICAgICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkubWFpbnRhaW5HcmFtbWFyKGl0ZW0pLFxuICAgICAgICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5Lm1haW50YWluQ29uZmlnKGl0ZW0pLFxuICAgICAgICAgIGl0ZW0ub2JzZXJ2ZUdyYW1tYXIodGhpcy5oYW5kbGVHcmFtbWFyVXNlZC5iaW5kKHRoaXMpKVxuICAgICAgICApXG4gICAgICAgIGl0ZW0ub25EaWREZXN0cm95KCgpID0+IHsgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCkgfSlcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1hZGQtdGV4dC1lZGl0b3InLCB7dGV4dEVkaXRvcjogaXRlbSwgcGFuZSwgaW5kZXh9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzdWJzY3JpYmVUb0RvY2tUb2dnbGluZyAoKSB7XG4gICAgY29uc3QgZG9ja3MgPSBbdGhpcy5nZXRMZWZ0RG9jaygpLCB0aGlzLmdldFJpZ2h0RG9jaygpLCB0aGlzLmdldEJvdHRvbURvY2soKV1cbiAgICBkb2Nrcy5mb3JFYWNoKGRvY2sgPT4ge1xuICAgICAgZG9jay5vbkRpZENoYW5nZVZpc2libGUodmlzaWJsZSA9PiB7XG4gICAgICAgIGlmICh2aXNpYmxlKSByZXR1cm5cbiAgICAgICAgY29uc3Qge2FjdGl2ZUVsZW1lbnR9ID0gZG9jdW1lbnRcbiAgICAgICAgY29uc3QgZG9ja0VsZW1lbnQgPSBkb2NrLmdldEVsZW1lbnQoKVxuICAgICAgICBpZiAoZG9ja0VsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQgfHwgZG9ja0VsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICB0aGlzLmdldENlbnRlcigpLmFjdGl2YXRlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc3Vic2NyaWJlVG9Nb3ZlZEl0ZW1zICgpIHtcbiAgICBmb3IgKGNvbnN0IHBhbmVDb250YWluZXIgb2YgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpKSB7XG4gICAgICBwYW5lQ29udGFpbmVyLm9ic2VydmVQYW5lcyhwYW5lID0+IHtcbiAgICAgICAgcGFuZS5vbkRpZEFkZEl0ZW0oKHtpdGVtfSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgaXRlbS5nZXRVUkkgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5lbmFibGVQZXJzaXN0ZW5jZSkge1xuICAgICAgICAgICAgY29uc3QgdXJpID0gaXRlbS5nZXRVUkkoKVxuICAgICAgICAgICAgaWYgKHVyaSkge1xuICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHBhbmVDb250YWluZXIuZ2V0TG9jYXRpb24oKVxuICAgICAgICAgICAgICBsZXQgZGVmYXVsdExvY2F0aW9uXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbS5nZXREZWZhdWx0TG9jYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0TG9jYXRpb24gPSBpdGVtLmdldERlZmF1bHRMb2NhdGlvbigpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uID0gZGVmYXVsdExvY2F0aW9uIHx8ICdjZW50ZXInXG4gICAgICAgICAgICAgIGlmIChsb2NhdGlvbiA9PT0gZGVmYXVsdExvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtTG9jYXRpb25TdG9yZS5kZWxldGUoaXRlbS5nZXRVUkkoKSlcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1Mb2NhdGlvblN0b3JlLnNhdmUoaXRlbS5nZXRVUkkoKSwgbG9jYXRpb24pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIFVwZGF0ZXMgdGhlIGFwcGxpY2F0aW9uJ3MgdGl0bGUgYW5kIHByb3h5IGljb24gYmFzZWQgb24gd2hpY2hldmVyIGZpbGUgaXNcbiAgLy8gb3Blbi5cbiAgdXBkYXRlV2luZG93VGl0bGUgKCkge1xuICAgIGxldCBpdGVtUGF0aCwgaXRlbVRpdGxlLCBwcm9qZWN0UGF0aCwgcmVwcmVzZW50ZWRQYXRoXG4gICAgY29uc3QgYXBwTmFtZSA9ICdBdG9tJ1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIGNvbnN0IHByb2plY3RQYXRocyA9IGxlZnQgIT0gbnVsbCA/IGxlZnQgOiBbXVxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBpZiAoaXRlbSkge1xuICAgICAgaXRlbVBhdGggPSB0eXBlb2YgaXRlbS5nZXRQYXRoID09PSAnZnVuY3Rpb24nID8gaXRlbS5nZXRQYXRoKCkgOiB1bmRlZmluZWRcbiAgICAgIGNvbnN0IGxvbmdUaXRsZSA9IHR5cGVvZiBpdGVtLmdldExvbmdUaXRsZSA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0TG9uZ1RpdGxlKCkgOiB1bmRlZmluZWRcbiAgICAgIGl0ZW1UaXRsZSA9IGxvbmdUaXRsZSA9PSBudWxsXG4gICAgICAgID8gKHR5cGVvZiBpdGVtLmdldFRpdGxlID09PSAnZnVuY3Rpb24nID8gaXRlbS5nZXRUaXRsZSgpIDogdW5kZWZpbmVkKVxuICAgICAgICA6IGxvbmdUaXRsZVxuICAgICAgcHJvamVjdFBhdGggPSBfLmZpbmQoXG4gICAgICAgIHByb2plY3RQYXRocyxcbiAgICAgICAgcHJvamVjdFBhdGggPT5cbiAgICAgICAgICAoaXRlbVBhdGggPT09IHByb2plY3RQYXRoKSB8fCAoaXRlbVBhdGggIT0gbnVsbCA/IGl0ZW1QYXRoLnN0YXJ0c1dpdGgocHJvamVjdFBhdGggKyBwYXRoLnNlcCkgOiB1bmRlZmluZWQpXG4gICAgICApXG4gICAgfVxuICAgIGlmIChpdGVtVGl0bGUgPT0gbnVsbCkgeyBpdGVtVGl0bGUgPSAndW50aXRsZWQnIH1cbiAgICBpZiAocHJvamVjdFBhdGggPT0gbnVsbCkgeyBwcm9qZWN0UGF0aCA9IGl0ZW1QYXRoID8gcGF0aC5kaXJuYW1lKGl0ZW1QYXRoKSA6IHByb2plY3RQYXRoc1swXSB9XG4gICAgaWYgKHByb2plY3RQYXRoICE9IG51bGwpIHtcbiAgICAgIHByb2plY3RQYXRoID0gZnMudGlsZGlmeShwcm9qZWN0UGF0aClcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZVBhcnRzID0gW11cbiAgICBpZiAoKGl0ZW0gIT0gbnVsbCkgJiYgKHByb2plY3RQYXRoICE9IG51bGwpKSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2goaXRlbVRpdGxlLCBwcm9qZWN0UGF0aClcbiAgICAgIHJlcHJlc2VudGVkUGF0aCA9IGl0ZW1QYXRoICE9IG51bGwgPyBpdGVtUGF0aCA6IHByb2plY3RQYXRoXG4gICAgfSBlbHNlIGlmIChwcm9qZWN0UGF0aCAhPSBudWxsKSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2gocHJvamVjdFBhdGgpXG4gICAgICByZXByZXNlbnRlZFBhdGggPSBwcm9qZWN0UGF0aFxuICAgIH0gZWxzZSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2goaXRlbVRpdGxlKVxuICAgICAgcmVwcmVzZW50ZWRQYXRoID0gJydcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICAgIHRpdGxlUGFydHMucHVzaChhcHBOYW1lKVxuICAgIH1cblxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGVQYXJ0cy5qb2luKCcgXFx1MjAxNCAnKVxuICAgIHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5zZXRSZXByZXNlbnRlZEZpbGVuYW1lKHJlcHJlc2VudGVkUGF0aClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS13aW5kb3ctdGl0bGUnKVxuICB9XG5cbiAgLy8gT24gbWFjT1MsIGZhZGVzIHRoZSBhcHBsaWNhdGlvbiB3aW5kb3cncyBwcm94eSBpY29uIHdoZW4gdGhlIGN1cnJlbnQgZmlsZVxuICAvLyBoYXMgYmVlbiBtb2RpZmllZC5cbiAgdXBkYXRlRG9jdW1lbnRFZGl0ZWQgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhbmVJdGVtID0gdGhpcy5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY29uc3QgbW9kaWZpZWQgPSBhY3RpdmVQYW5lSXRlbSAhPSBudWxsICYmIHR5cGVvZiBhY3RpdmVQYW5lSXRlbS5pc01vZGlmaWVkID09PSAnZnVuY3Rpb24nXG4gICAgICA/IGFjdGl2ZVBhbmVJdGVtLmlzTW9kaWZpZWQoKSB8fCBmYWxzZVxuICAgICAgOiBmYWxzZVxuICAgIHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5zZXRXaW5kb3dEb2N1bWVudEVkaXRlZChtb2RpZmllZClcbiAgfVxuXG4gIC8qXG4gIFNlY3Rpb246IEV2ZW50IFN1YnNjcmlwdGlvblxuICAqL1xuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlUGFuZUNvbnRhaW5lciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWNvbnRhaW5lcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggYWxsIGN1cnJlbnQgYW5kIGZ1dHVyZSB0ZXh0XG4gIC8vIGVkaXRvcnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdpdGggY3VycmVudCBhbmQgZnV0dXJlIHRleHQgZWRpdG9ycy5cbiAgLy8gICAqIGBlZGl0b3JgIEEge1RleHRFZGl0b3J9IHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRUZXh0RWRpdG9yc30gYXQgdGhlIHRpbWVcbiAgLy8gICAgIG9mIHN1YnNjcmlwdGlvbiBvciB0aGF0IGlzIGFkZGVkIGF0IHNvbWUgbGF0ZXIgdGltZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZVRleHRFZGl0b3JzIChjYWxsYmFjaykge1xuICAgIGZvciAobGV0IHRleHRFZGl0b3Igb2YgdGhpcy5nZXRUZXh0RWRpdG9ycygpKSB7IGNhbGxiYWNrKHRleHRFZGl0b3IpIH1cbiAgICByZXR1cm4gdGhpcy5vbkRpZEFkZFRleHRFZGl0b3IoKHt0ZXh0RWRpdG9yfSkgPT4gY2FsbGJhY2sodGV4dEVkaXRvcikpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCBhbGwgY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzIGl0ZW1zXG4gIC8vIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSBwYW5lIGl0ZW1zLlxuICAvLyAgICogYGl0ZW1gIEFuIGl0ZW0gdGhhdCBpcyBwcmVzZW50IGluIHs6OmdldFBhbmVJdGVtc30gYXQgdGhlIHRpbWUgb2ZcbiAgLy8gICAgICBzdWJzY3JpcHRpb24gb3IgdGhhdCBpcyBhZGRlZCBhdCBzb21lIGxhdGVyIHRpbWUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVQYW5lSXRlbXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9ic2VydmVQYW5lSXRlbXMoY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXMuXG4gIC8vXG4gIC8vIEJlY2F1c2Ugb2JzZXJ2ZXJzIGFyZSBpbnZva2VkIHN5bmNocm9ub3VzbHksIGl0J3MgaW1wb3J0YW50IG5vdCB0byBwZXJmb3JtXG4gIC8vIGFueSBleHBlbnNpdmUgb3BlcmF0aW9ucyB2aWEgdGhpcyBtZXRob2QuIENvbnNpZGVyXG4gIC8vIHs6Om9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW19IHRvIGRlbGF5IG9wZXJhdGlvbnMgdW50aWwgYWZ0ZXIgY2hhbmdlc1xuICAvLyBzdG9wIG9jY3VycmluZy5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gY2hhbmdlcy5cbiAgLy8gICAqIGBpdGVtYCBUaGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIHN0b3BzXG4gIC8vIGNoYW5naW5nLlxuICAvL1xuICAvLyBPYnNlcnZlcnMgYXJlIGNhbGxlZCBhc3luY2hyb25vdXNseSAxMDBtcyBhZnRlciB0aGUgbGFzdCBhY3RpdmUgcGFuZSBpdGVtXG4gIC8vIGNoYW5nZS4gSGFuZGxpbmcgY2hhbmdlcyBoZXJlIHJhdGhlciB0aGFuIGluIHRoZSBzeW5jaHJvbm91c1xuICAvLyB7OjpvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtfSBwcmV2ZW50cyB1bm5lZWRlZCB3b3JrIGlmIHRoZSB1c2VyIGlzIHF1aWNrbHlcbiAgLy8gY2hhbmdpbmcgb3IgY2xvc2luZyB0YWJzIGFuZCBlbnN1cmVzIGNyaXRpY2FsIFVJIGZlZWRiYWNrLCBsaWtlIGNoYW5naW5nIHRoZVxuICAvLyBoaWdobGlnaHRlZCB0YWIsIGdldHMgcHJpb3JpdHkgb3ZlciB3b3JrIHRoYXQgY2FuIGJlIGRvbmUgYXN5bmNocm9ub3VzbHkuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIHN0b3B0c1xuICAvLyAgIGNoYW5naW5nLlxuICAvLyAgICogYGl0ZW1gIFRoZSBhY3RpdmUgcGFuZSBpdGVtLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zdG9wLWNoYW5naW5nLWFjdGl2ZS1wYW5lLWl0ZW0nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgdGV4dCBlZGl0b3IgYmVjb21lcyB0aGUgYWN0aXZlXG4gIC8vIHRleHQgZWRpdG9yIGFuZCB3aGVuIHRoZXJlIGlzIG5vIGxvbmdlciBhbiBhY3RpdmUgdGV4dCBlZGl0b3IuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgdGV4dCBlZGl0b3IgY2hhbmdlcy5cbiAgLy8gICAqIGBlZGl0b3JgIFRoZSBhY3RpdmUge1RleHRFZGl0b3J9IG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBubyBsb25nZXIgYW5cbiAgLy8gICAgICBhY3RpdmUgdGV4dCBlZGl0b3IuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlVGV4dEVkaXRvciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS10ZXh0LWVkaXRvcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUgaXRlbSBhbmRcbiAgLy8gd2l0aCBhbGwgZnV0dXJlIGFjdGl2ZSBwYW5lIGl0ZW1zIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXMuXG4gIC8vICAgKiBgaXRlbWAgVGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKHRoaXMuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICByZXR1cm4gdGhpcy5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlIHRleHQgZWRpdG9yXG4gIC8vIChpZiBhbnkpLCB3aXRoIGFsbCBmdXR1cmUgYWN0aXZlIHRleHQgZWRpdG9ycywgYW5kIHdoZW4gdGhlcmUgaXMgbm8gbG9uZ2VyXG4gIC8vIGFuIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSB0ZXh0IGVkaXRvciBjaGFuZ2VzLlxuICAvLyAgICogYGVkaXRvcmAgVGhlIGFjdGl2ZSB7VGV4dEVkaXRvcn0gb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vdCBhblxuICAvLyAgICAgIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IgKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodGhpcy5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG5cbiAgICByZXR1cm4gdGhpcy5vbkRpZENoYW5nZUFjdGl2ZVRleHRFZGl0b3IoY2FsbGJhY2spXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbmV2ZXIgYW4gaXRlbSBpcyBvcGVuZWQuIFVubGlrZVxuICAvLyB7OjpvbkRpZEFkZFBhbmVJdGVtfSwgb2JzZXJ2ZXJzIHdpbGwgYmUgbm90aWZpZWQgZm9yIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHlcbiAgLy8gcHJlc2VudCBpbiB0aGUgd29ya3NwYWNlIHdoZW4gdGhleSBhcmUgcmVvcGVuZWQuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuZXZlciBhbiBpdGVtIGlzIG9wZW5lZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGB1cmlgIHtTdHJpbmd9IHJlcHJlc2VudGluZyB0aGUgb3BlbmVkIFVSSS4gQ291bGQgYmUgYHVuZGVmaW5lZGAuXG4gIC8vICAgICAqIGBpdGVtYCBUaGUgb3BlbmVkIGl0ZW0uXG4gIC8vICAgICAqIGBwYW5lYCBUaGUgcGFuZSBpbiB3aGljaCB0aGUgaXRlbSB3YXMgb3BlbmVkLlxuICAvLyAgICAgKiBgaW5kZXhgIFRoZSBpbmRleCBvZiB0aGUgb3BlbmVkIGl0ZW0gb24gaXRzIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkT3BlbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtb3BlbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXMgYWRkZWQgdG8gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHBhbmVzIGFyZSBhZGRlZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBwYW5lYCBUaGUgYWRkZWQgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRBZGRQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbkRpZEFkZFBhbmUoY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIGJlZm9yZSBhIHBhbmUgaXMgZGVzdHJveWVkIGluIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBiZWZvcmUgcGFuZXMgYXJlIGRlc3Ryb3llZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBwYW5lYCBUaGUgcGFuZSB0byBiZSBkZXN0cm95ZWQuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uV2lsbERlc3Ryb3lQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbldpbGxEZXN0cm95UGFuZShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXMgZGVzdHJveWVkIGluIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBwYW5lcyBhcmUgZGVzdHJveWVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHBhbmVgIFRoZSBkZXN0cm95ZWQgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWREZXN0cm95UGFuZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub25EaWREZXN0cm95UGFuZShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCBhbGwgY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzIGluIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSBwYW5lcy5cbiAgLy8gICAqIGBwYW5lYCBBIHtQYW5lfSB0aGF0IGlzIHByZXNlbnQgaW4gezo6Z2V0UGFuZXN9IGF0IHRoZSB0aW1lIG9mXG4gIC8vICAgICAgc3Vic2NyaXB0aW9uIG9yIHRoYXQgaXMgYWRkZWQgYXQgc29tZSBsYXRlciB0aW1lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlUGFuZXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9ic2VydmVQYW5lcyhjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiB0aGUgYWN0aXZlIHBhbmUgY2hhbmdlcy5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSBwYW5lIGNoYW5nZXMuXG4gIC8vICAgKiBgcGFuZWAgQSB7UGFuZX0gdGhhdCBpcyB0aGUgY3VycmVudCByZXR1cm4gdmFsdWUgb2Ygezo6Z2V0QWN0aXZlUGFuZX0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlUGFuZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lIGFuZCB3aGVuXG4gIC8vIHRoZSBhY3RpdmUgcGFuZSBjaGFuZ2VzLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2l0aCB0aGUgY3VycmVudCBhbmQgZnV0dXJlIGFjdGl2ZSNcbiAgLy8gICBwYW5lcy5cbiAgLy8gICAqIGBwYW5lYCBBIHtQYW5lfSB0aGF0IGlzIHRoZSBjdXJyZW50IHJldHVybiB2YWx1ZSBvZiB7OjpnZXRBY3RpdmVQYW5lfS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZUFjdGl2ZVBhbmUgKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodGhpcy5nZXRBY3RpdmVQYW5lKCkpXG4gICAgcmV0dXJuIHRoaXMub25EaWRDaGFuZ2VBY3RpdmVQYW5lKGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXRlbSBpcyBhZGRlZCB0byB0aGVcbiAgLy8gd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiBwYW5lIGl0ZW1zIGFyZSBhZGRlZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBpdGVtYCBUaGUgYWRkZWQgcGFuZSBpdGVtLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGFkZGVkIGl0ZW0uXG4gIC8vICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGFkZGVkIGl0ZW0gaW4gaXRzIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQWRkUGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uRGlkQWRkUGFuZUl0ZW0oY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gYSBwYW5lIGl0ZW0gaXMgYWJvdXQgdG8gYmVcbiAgLy8gZGVzdHJveWVkLCBiZWZvcmUgdGhlIHVzZXIgaXMgcHJvbXB0ZWQgdG8gc2F2ZSBpdC5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIGJlZm9yZSBwYW5lIGl0ZW1zIGFyZSBkZXN0cm95ZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgaXRlbWAgVGhlIGl0ZW0gdG8gYmUgZGVzdHJveWVkLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGl0ZW0gdG8gYmUgZGVzdHJveWVkLlxuICAvLyAgICAgKiBgaW5kZXhgIHtOdW1iZXJ9IGluZGljYXRpbmcgdGhlIGluZGV4IG9mIHRoZSBpdGVtIHRvIGJlIGRlc3Ryb3llZCBpblxuICAvLyAgICAgICBpdHMgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2VgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uV2lsbERlc3Ryb3lQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub25XaWxsRGVzdHJveVBhbmVJdGVtKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpdGVtIGlzIGRlc3Ryb3llZC5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gcGFuZSBpdGVtcyBhcmUgZGVzdHJveWVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYGl0ZW1gIFRoZSBkZXN0cm95ZWQgaXRlbS5cbiAgLy8gICAgICogYHBhbmVgIHtQYW5lfSBjb250YWluaW5nIHRoZSBkZXN0cm95ZWQgaXRlbS5cbiAgLy8gICAgICogYGluZGV4YCB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBpbmRleCBvZiB0aGUgZGVzdHJveWVkIGl0ZW0gaW4gaXRzXG4gIC8vICAgICAgIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZERlc3Ryb3lQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub25EaWREZXN0cm95UGFuZUl0ZW0oY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gYSB0ZXh0IGVkaXRvciBpcyBhZGRlZCB0byB0aGVcbiAgLy8gd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgcGFuZXMgYXJlIGFkZGVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHRleHRFZGl0b3JgIHtUZXh0RWRpdG9yfSB0aGF0IHdhcyBhZGRlZC5cbiAgLy8gICAgICogYHBhbmVgIHtQYW5lfSBjb250YWluaW5nIHRoZSBhZGRlZCB0ZXh0IGVkaXRvci5cbiAgLy8gICAgICogYGluZGV4YCB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBpbmRleCBvZiB0aGUgYWRkZWQgdGV4dCBlZGl0b3IgaW4gaXRzXG4gIC8vICAgICAgICBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZEFkZFRleHRFZGl0b3IgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWFkZC10ZXh0LWVkaXRvcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25EaWRDaGFuZ2VXaW5kb3dUaXRsZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXdpbmRvdy10aXRsZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogT3BlbmluZ1xuICAqL1xuXG4gIC8vIEVzc2VudGlhbDogT3BlbnMgdGhlIGdpdmVuIFVSSSBpbiBBdG9tIGFzeW5jaHJvbm91c2x5LlxuICAvLyBJZiB0aGUgVVJJIGlzIGFscmVhZHkgb3BlbiwgdGhlIGV4aXN0aW5nIGl0ZW0gZm9yIHRoYXQgVVJJIHdpbGwgYmVcbiAgLy8gYWN0aXZhdGVkLiBJZiBubyBVUkkgaXMgZ2l2ZW4sIG9yIG5vIHJlZ2lzdGVyZWQgb3BlbmVyIGNhbiBvcGVuXG4gIC8vIHRoZSBVUkksIGEgbmV3IGVtcHR5IHtUZXh0RWRpdG9yfSB3aWxsIGJlIGNyZWF0ZWQuXG4gIC8vXG4gIC8vICogYHVyaWAgKG9wdGlvbmFsKSBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgYSBVUkkuXG4gIC8vICogYG9wdGlvbnNgIChvcHRpb25hbCkge09iamVjdH1cbiAgLy8gICAqIGBpbml0aWFsTGluZWAgQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHdoaWNoIHJvdyB0byBtb3ZlIHRoZSBjdXJzb3IgdG9cbiAgLy8gICAgIGluaXRpYWxseS4gRGVmYXVsdHMgdG8gYDBgLlxuICAvLyAgICogYGluaXRpYWxDb2x1bW5gIEEge051bWJlcn0gaW5kaWNhdGluZyB3aGljaCBjb2x1bW4gdG8gbW92ZSB0aGUgY3Vyc29yIHRvXG4gIC8vICAgICBpbml0aWFsbHkuIERlZmF1bHRzIHRvIGAwYC5cbiAgLy8gICAqIGBzcGxpdGAgRWl0aGVyICdsZWZ0JywgJ3JpZ2h0JywgJ3VwJyBvciAnZG93bicuXG4gIC8vICAgICBJZiAnbGVmdCcsIHRoZSBpdGVtIHdpbGwgYmUgb3BlbmVkIGluIGxlZnRtb3N0IHBhbmUgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUncyByb3cuXG4gIC8vICAgICBJZiAncmlnaHQnLCB0aGUgaXRlbSB3aWxsIGJlIG9wZW5lZCBpbiB0aGUgcmlnaHRtb3N0IHBhbmUgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUncyByb3cuIElmIG9ubHkgb25lIHBhbmUgZXhpc3RzIGluIHRoZSByb3csIGEgbmV3IHBhbmUgd2lsbCBiZSBjcmVhdGVkLlxuICAvLyAgICAgSWYgJ3VwJywgdGhlIGl0ZW0gd2lsbCBiZSBvcGVuZWQgaW4gdG9wbW9zdCBwYW5lIG9mIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lJ3MgY29sdW1uLlxuICAvLyAgICAgSWYgJ2Rvd24nLCB0aGUgaXRlbSB3aWxsIGJlIG9wZW5lZCBpbiB0aGUgYm90dG9tbW9zdCBwYW5lIG9mIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lJ3MgY29sdW1uLiBJZiBvbmx5IG9uZSBwYW5lIGV4aXN0cyBpbiB0aGUgY29sdW1uLCBhIG5ldyBwYW5lIHdpbGwgYmUgY3JlYXRlZC5cbiAgLy8gICAqIGBhY3RpdmF0ZVBhbmVgIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciB0byBjYWxsIHtQYW5lOjphY3RpdmF0ZX0gb25cbiAgLy8gICAgIGNvbnRhaW5pbmcgcGFuZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAvLyAgICogYGFjdGl2YXRlSXRlbWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlSXRlbX1cbiAgLy8gICAgIG9uIGNvbnRhaW5pbmcgcGFuZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAvLyAgICogYHBlbmRpbmdgIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdGhlIGl0ZW0gc2hvdWxkIGJlIG9wZW5lZFxuICAvLyAgICAgaW4gYSBwZW5kaW5nIHN0YXRlLiBFeGlzdGluZyBwZW5kaW5nIGl0ZW1zIGluIGEgcGFuZSBhcmUgcmVwbGFjZWQgd2l0aFxuICAvLyAgICAgbmV3IHBlbmRpbmcgaXRlbXMgd2hlbiB0aGV5IGFyZSBvcGVuZWQuXG4gIC8vICAgKiBgc2VhcmNoQWxsUGFuZXNgIEEge0Jvb2xlYW59LiBJZiBgdHJ1ZWAsIHRoZSB3b3Jrc3BhY2Ugd2lsbCBhdHRlbXB0IHRvXG4gIC8vICAgICBhY3RpdmF0ZSBhbiBleGlzdGluZyBpdGVtIGZvciB0aGUgZ2l2ZW4gVVJJIG9uIGFueSBwYW5lLlxuICAvLyAgICAgSWYgYGZhbHNlYCwgb25seSB0aGUgYWN0aXZlIHBhbmUgd2lsbCBiZSBzZWFyY2hlZCBmb3JcbiAgLy8gICAgIGFuIGV4aXN0aW5nIGl0ZW0gZm9yIHRoZSBzYW1lIFVSSS4gRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgLy8gICAqIGBsb2NhdGlvbmAgKG9wdGlvbmFsKSBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIG5hbWUgb2YgdGhlIGxvY2F0aW9uXG4gIC8vICAgICBpbiB3aGljaCB0aGlzIGl0ZW0gc2hvdWxkIGJlIG9wZW5lZCAob25lIG9mIFwibGVmdFwiLCBcInJpZ2h0XCIsIFwiYm90dG9tXCIsXG4gIC8vICAgICBvciBcImNlbnRlclwiKS4gSWYgb21pdHRlZCwgQXRvbSB3aWxsIGZhbGwgYmFjayB0byB0aGUgbGFzdCBsb2NhdGlvbiBpblxuICAvLyAgICAgd2hpY2ggYSB1c2VyIGhhcyBwbGFjZWQgYW4gaXRlbSB3aXRoIHRoZSBzYW1lIFVSSSBvciwgaWYgdGhpcyBpcyBhIG5ld1xuICAvLyAgICAgVVJJLCB0aGUgZGVmYXVsdCBsb2NhdGlvbiBzcGVjaWZpZWQgYnkgdGhlIGl0ZW0uIE5PVEU6IFRoaXMgb3B0aW9uXG4gIC8vICAgICBzaG91bGQgYWxtb3N0IGFsd2F5cyBiZSBvbWl0dGVkIHRvIGhvbm9yIHVzZXIgcHJlZmVyZW5jZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQcm9taXNlfSB0aGF0IHJlc29sdmVzIHRvIHRoZSB7VGV4dEVkaXRvcn0gZm9yIHRoZSBmaWxlIFVSSS5cbiAgYXN5bmMgb3BlbiAoaXRlbU9yVVJJLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgdXJpLCBpdGVtXG4gICAgaWYgKHR5cGVvZiBpdGVtT3JVUkkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB1cmkgPSB0aGlzLnByb2plY3QucmVzb2x2ZVBhdGgoaXRlbU9yVVJJKVxuICAgIH0gZWxzZSBpZiAoaXRlbU9yVVJJKSB7XG4gICAgICBpdGVtID0gaXRlbU9yVVJJXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nKSB1cmkgPSBpdGVtLmdldFVSSSgpXG4gICAgfVxuXG4gICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuYWxsb3dQZW5kaW5nUGFuZUl0ZW1zJykpIHtcbiAgICAgIG9wdGlvbnMucGVuZGluZyA9IGZhbHNlXG4gICAgfVxuXG4gICAgLy8gQXZvaWQgYWRkaW5nIFVSTHMgYXMgcmVjZW50IGRvY3VtZW50cyB0byB3b3JrLWFyb3VuZCB0aGlzIFNwb3RsaWdodCBjcmFzaDpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2lzc3Vlcy8xMDA3MVxuICAgIGlmICh1cmkgJiYgKCF1cmwucGFyc2UodXJpKS5wcm90b2NvbCB8fCBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSkge1xuICAgICAgdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLmFkZFJlY2VudERvY3VtZW50KHVyaSlcbiAgICB9XG5cbiAgICBsZXQgcGFuZSwgaXRlbUV4aXN0c0luV29ya3NwYWNlXG5cbiAgICAvLyBUcnkgdG8gZmluZCBhbiBleGlzdGluZyBpdGVtIGluIHRoZSB3b3Jrc3BhY2UuXG4gICAgaWYgKGl0ZW0gfHwgdXJpKSB7XG4gICAgICBpZiAob3B0aW9ucy5wYW5lKSB7XG4gICAgICAgIHBhbmUgPSBvcHRpb25zLnBhbmVcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zZWFyY2hBbGxQYW5lcykge1xuICAgICAgICBwYW5lID0gaXRlbSA/IHRoaXMucGFuZUZvckl0ZW0oaXRlbSkgOiB0aGlzLnBhbmVGb3JVUkkodXJpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgYW4gaXRlbSB3aXRoIHRoZSBnaXZlbiBVUkkgaXMgYWxyZWFkeSBpbiB0aGUgd29ya3NwYWNlLCBhc3N1bWVcbiAgICAgICAgLy8gdGhhdCBpdGVtJ3MgcGFuZSBjb250YWluZXIgaXMgdGhlIHByZWZlcnJlZCBsb2NhdGlvbiBmb3IgdGhhdCBVUkkuXG4gICAgICAgIGxldCBjb250YWluZXJcbiAgICAgICAgaWYgKHVyaSkgY29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVyRm9yVVJJKHVyaSlcbiAgICAgICAgaWYgKCFjb250YWluZXIpIGNvbnRhaW5lciA9IHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpXG5cbiAgICAgICAgLy8gVGhlIGBzcGxpdGAgb3B0aW9uIGFmZmVjdHMgd2hlcmUgd2Ugc2VhcmNoIGZvciB0aGUgaXRlbS5cbiAgICAgICAgcGFuZSA9IGNvbnRhaW5lci5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgc3dpdGNoIChvcHRpb25zLnNwbGl0KSB7XG4gICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kTGVmdG1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZFJpZ2h0bW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kVG9wbW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRCb3R0b21tb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwYW5lKSB7XG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgaXRlbUV4aXN0c0luV29ya3NwYWNlID0gcGFuZS5nZXRJdGVtcygpLmluY2x1ZGVzKGl0ZW0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbSA9IHBhbmUuaXRlbUZvclVSSSh1cmkpXG4gICAgICAgICAgaXRlbUV4aXN0c0luV29ya3NwYWNlID0gaXRlbSAhPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBhbHJlYWR5IGhhdmUgYW4gaXRlbSBhdCB0aGlzIHN0YWdlLCB3ZSB3b24ndCBuZWVkIHRvIGRvIGFuIGFzeW5jXG4gICAgLy8gbG9va3VwIG9mIHRoZSBVUkksIHNvIHdlIHlpZWxkIHRoZSBldmVudCBsb29wIHRvIGVuc3VyZSB0aGlzIG1ldGhvZFxuICAgIC8vIGlzIGNvbnNpc3RlbnRseSBhc3luY2hyb25vdXMuXG4gICAgaWYgKGl0ZW0pIGF3YWl0IFByb21pc2UucmVzb2x2ZSgpXG5cbiAgICBpZiAoIWl0ZW1FeGlzdHNJbldvcmtzcGFjZSkge1xuICAgICAgaXRlbSA9IGl0ZW0gfHwgYXdhaXQgdGhpcy5jcmVhdGVJdGVtRm9yVVJJKHVyaSwgb3B0aW9ucylcbiAgICAgIGlmICghaXRlbSkgcmV0dXJuXG5cbiAgICAgIGlmIChvcHRpb25zLnBhbmUpIHtcbiAgICAgICAgcGFuZSA9IG9wdGlvbnMucGFuZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gb3B0aW9ucy5sb2NhdGlvblxuICAgICAgICBpZiAoIWxvY2F0aW9uICYmICFvcHRpb25zLnNwbGl0ICYmIHVyaSAmJiB0aGlzLmVuYWJsZVBlcnNpc3RlbmNlKSB7XG4gICAgICAgICAgbG9jYXRpb24gPSBhd2FpdCB0aGlzLml0ZW1Mb2NhdGlvblN0b3JlLmxvYWQodXJpKVxuICAgICAgICB9XG4gICAgICAgIGlmICghbG9jYXRpb24gJiYgdHlwZW9mIGl0ZW0uZ2V0RGVmYXVsdExvY2F0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgbG9jYXRpb24gPSBpdGVtLmdldERlZmF1bHRMb2NhdGlvbigpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbGxvd2VkTG9jYXRpb25zID0gdHlwZW9mIGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucygpIDogQUxMX0xPQ0FUSU9OU1xuICAgICAgICBsb2NhdGlvbiA9IGFsbG93ZWRMb2NhdGlvbnMuaW5jbHVkZXMobG9jYXRpb24pID8gbG9jYXRpb24gOiBhbGxvd2VkTG9jYXRpb25zWzBdXG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVyc1tsb2NhdGlvbl0gfHwgdGhpcy5nZXRDZW50ZXIoKVxuICAgICAgICBwYW5lID0gY29udGFpbmVyLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBzd2l0Y2ggKG9wdGlvbnMuc3BsaXQpIHtcbiAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRMZWZ0bW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kT3JDcmVhdGVSaWdodG1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZFRvcG1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kT3JDcmVhdGVCb3R0b21tb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnBlbmRpbmcgJiYgKHBhbmUuZ2V0UGVuZGluZ0l0ZW0oKSA9PT0gaXRlbSkpIHtcbiAgICAgIHBhbmUuY2xlYXJQZW5kaW5nSXRlbSgpXG4gICAgfVxuXG4gICAgdGhpcy5pdGVtT3BlbmVkKGl0ZW0pXG5cbiAgICBpZiAob3B0aW9ucy5hY3RpdmF0ZUl0ZW0gPT09IGZhbHNlKSB7XG4gICAgICBwYW5lLmFkZEl0ZW0oaXRlbSwge3BlbmRpbmc6IG9wdGlvbnMucGVuZGluZ30pXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0sIHtwZW5kaW5nOiBvcHRpb25zLnBlbmRpbmd9KVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmFjdGl2YXRlUGFuZSAhPT0gZmFsc2UpIHtcbiAgICAgIHBhbmUuYWN0aXZhdGUoKVxuICAgIH1cblxuICAgIGxldCBpbml0aWFsQ29sdW1uID0gMFxuICAgIGxldCBpbml0aWFsTGluZSA9IDBcbiAgICBpZiAoIU51bWJlci5pc05hTihvcHRpb25zLmluaXRpYWxMaW5lKSkge1xuICAgICAgaW5pdGlhbExpbmUgPSBvcHRpb25zLmluaXRpYWxMaW5lXG4gICAgfVxuICAgIGlmICghTnVtYmVyLmlzTmFOKG9wdGlvbnMuaW5pdGlhbENvbHVtbikpIHtcbiAgICAgIGluaXRpYWxDb2x1bW4gPSBvcHRpb25zLmluaXRpYWxDb2x1bW5cbiAgICB9XG4gICAgaWYgKGluaXRpYWxMaW5lID49IDAgfHwgaW5pdGlhbENvbHVtbiA+PSAwKSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaXRlbS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbaW5pdGlhbExpbmUsIGluaXRpYWxDb2x1bW5dKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gcGFuZS5nZXRBY3RpdmVJdGVtSW5kZXgoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtb3BlbicsIHt1cmksIHBhbmUsIGl0ZW0sIGluZGV4fSlcbiAgICByZXR1cm4gaXRlbVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBTZWFyY2ggdGhlIHdvcmtzcGFjZSBmb3IgaXRlbXMgbWF0Y2hpbmcgdGhlIGdpdmVuIFVSSSBhbmQgaGlkZSB0aGVtLlxuICAvL1xuICAvLyAqIGBpdGVtT3JVUklgIChvcHRpb25hbCkgVGhlIGl0ZW0gdG8gaGlkZSBvciBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIFVSSVxuICAvLyAgIG9mIHRoZSBpdGVtIHRvIGhpZGUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7Ym9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIGFueSBpdGVtcyB3ZXJlIGZvdW5kIChhbmQgaGlkZGVuKS5cbiAgaGlkZSAoaXRlbU9yVVJJKSB7XG4gICAgbGV0IGZvdW5kSXRlbXMgPSBmYWxzZVxuXG4gICAgLy8gSWYgYW55IHZpc2libGUgaXRlbSBoYXMgdGhlIGdpdmVuIFVSSSwgaGlkZSBpdFxuICAgIGZvciAoY29uc3QgY29udGFpbmVyIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgY29uc3QgaXNDZW50ZXIgPSBjb250YWluZXIgPT09IHRoaXMuZ2V0Q2VudGVyKClcbiAgICAgIGlmIChpc0NlbnRlciB8fCBjb250YWluZXIuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBwYW5lIG9mIGNvbnRhaW5lci5nZXRQYW5lcygpKSB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlSXRlbSA9IHBhbmUuZ2V0QWN0aXZlSXRlbSgpXG4gICAgICAgICAgY29uc3QgZm91bmRJdGVtID0gKFxuICAgICAgICAgICAgYWN0aXZlSXRlbSAhPSBudWxsICYmIChcbiAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9PT0gaXRlbU9yVVJJIHx8XG4gICAgICAgICAgICAgIHR5cGVvZiBhY3RpdmVJdGVtLmdldFVSSSA9PT0gJ2Z1bmN0aW9uJyAmJiBhY3RpdmVJdGVtLmdldFVSSSgpID09PSBpdGVtT3JVUklcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICAgaWYgKGZvdW5kSXRlbSkge1xuICAgICAgICAgICAgZm91bmRJdGVtcyA9IHRydWVcbiAgICAgICAgICAgIC8vIFdlIGNhbid0IHJlYWxseSBoaWRlIHRoZSBjZW50ZXIgc28gd2UganVzdCBkZXN0cm95IHRoZSBpdGVtLlxuICAgICAgICAgICAgaWYgKGlzQ2VudGVyKSB7XG4gICAgICAgICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oYWN0aXZlSXRlbSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lci5oaWRlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmRJdGVtc1xuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBTZWFyY2ggdGhlIHdvcmtzcGFjZSBmb3IgaXRlbXMgbWF0Y2hpbmcgdGhlIGdpdmVuIFVSSS4gSWYgYW55IGFyZSBmb3VuZCwgaGlkZSB0aGVtLlxuICAvLyBPdGhlcndpc2UsIG9wZW4gdGhlIFVSTC5cbiAgLy9cbiAgLy8gKiBgaXRlbU9yVVJJYCAob3B0aW9uYWwpIFRoZSBpdGVtIHRvIHRvZ2dsZSBvciBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIFVSSVxuICAvLyAgIG9mIHRoZSBpdGVtIHRvIHRvZ2dsZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBpdGVtIGlzIHNob3duIG9yIGhpZGRlbi5cbiAgdG9nZ2xlIChpdGVtT3JVUkkpIHtcbiAgICBpZiAodGhpcy5oaWRlKGl0ZW1PclVSSSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuKGl0ZW1PclVSSSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlfSlcbiAgICB9XG4gIH1cblxuICAvLyBPcGVuIEF0b20ncyBsaWNlbnNlIGluIHRoZSBhY3RpdmUgcGFuZS5cbiAgb3BlbkxpY2Vuc2UgKCkge1xuICAgIHJldHVybiB0aGlzLm9wZW4oJy91c3Ivc2hhcmUvbGljZW5zZXMvYXRvbS9MSUNFTlNFLm1kJylcbiAgfVxuXG4gIC8vIFN5bmNocm9ub3VzbHkgb3BlbiB0aGUgZ2l2ZW4gVVJJIGluIHRoZSBhY3RpdmUgcGFuZS4gKipPbmx5IHVzZSB0aGlzIG1ldGhvZFxuICAvLyBpbiBzcGVjcy4gQ2FsbGluZyB0aGlzIGluIHByb2R1Y3Rpb24gY29kZSB3aWxsIGJsb2NrIHRoZSBVSSB0aHJlYWQgYW5kXG4gIC8vIGV2ZXJ5b25lIHdpbGwgYmUgbWFkIGF0IHlvdS4qKlxuICAvL1xuICAvLyAqIGB1cmlgIEEge1N0cmluZ30gY29udGFpbmluZyBhIFVSSS5cbiAgLy8gKiBgb3B0aW9uc2AgQW4gb3B0aW9uYWwgb3B0aW9ucyB7T2JqZWN0fVxuICAvLyAgICogYGluaXRpYWxMaW5lYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggcm93IHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgaW5pdGlhbENvbHVtbmAgQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHdoaWNoIGNvbHVtbiB0byBtb3ZlIHRoZSBjdXJzb3IgdG9cbiAgLy8gICAgIGluaXRpYWxseS4gRGVmYXVsdHMgdG8gYDBgLlxuICAvLyAgICogYGFjdGl2YXRlUGFuZWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlfSBvblxuICAvLyAgICAgdGhlIGNvbnRhaW5pbmcgcGFuZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAvLyAgICogYGFjdGl2YXRlSXRlbWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlSXRlbX1cbiAgLy8gICAgIG9uIGNvbnRhaW5pbmcgcGFuZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICBvcGVuU3luYyAodXJpXyA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7aW5pdGlhbExpbmUsIGluaXRpYWxDb2x1bW59ID0gb3B0aW9uc1xuICAgIGNvbnN0IGFjdGl2YXRlUGFuZSA9IG9wdGlvbnMuYWN0aXZhdGVQYW5lICE9IG51bGwgPyBvcHRpb25zLmFjdGl2YXRlUGFuZSA6IHRydWVcbiAgICBjb25zdCBhY3RpdmF0ZUl0ZW0gPSBvcHRpb25zLmFjdGl2YXRlSXRlbSAhPSBudWxsID8gb3B0aW9ucy5hY3RpdmF0ZUl0ZW0gOiB0cnVlXG5cbiAgICBjb25zdCB1cmkgPSB0aGlzLnByb2plY3QucmVzb2x2ZVBhdGgodXJpXylcbiAgICBsZXQgaXRlbSA9IHRoaXMuZ2V0QWN0aXZlUGFuZSgpLml0ZW1Gb3JVUkkodXJpKVxuICAgIGlmICh1cmkgJiYgKGl0ZW0gPT0gbnVsbCkpIHtcbiAgICAgIGZvciAoY29uc3Qgb3BlbmVyIG9mIHRoaXMuZ2V0T3BlbmVycygpKSB7XG4gICAgICAgIGl0ZW0gPSBvcGVuZXIodXJpLCBvcHRpb25zKVxuICAgICAgICBpZiAoaXRlbSkgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGl0ZW0gPT0gbnVsbCkge1xuICAgICAgaXRlbSA9IHRoaXMucHJvamVjdC5vcGVuU3luYyh1cmksIHtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbn0pXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2YXRlSXRlbSkge1xuICAgICAgdGhpcy5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGVJdGVtKGl0ZW0pXG4gICAgfVxuICAgIHRoaXMuaXRlbU9wZW5lZChpdGVtKVxuICAgIGlmIChhY3RpdmF0ZVBhbmUpIHtcbiAgICAgIHRoaXMuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKClcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1cbiAgfVxuXG4gIG9wZW5VUklJblBhbmUgKHVyaSwgcGFuZSkge1xuICAgIHJldHVybiB0aGlzLm9wZW4odXJpLCB7cGFuZX0pXG4gIH1cblxuICAvLyBQdWJsaWM6IENyZWF0ZXMgYSBuZXcgaXRlbSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBwcm92aWRlZCBVUkkuXG4gIC8vXG4gIC8vIElmIG5vIFVSSSBpcyBnaXZlbiwgb3Igbm8gcmVnaXN0ZXJlZCBvcGVuZXIgY2FuIG9wZW4gdGhlIFVSSSwgYSBuZXcgZW1wdHlcbiAgLy8ge1RleHRFZGl0b3J9IHdpbGwgYmUgY3JlYXRlZC5cbiAgLy9cbiAgLy8gKiBgdXJpYCBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgYSBVUkkuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gdGhhdCByZXNvbHZlcyB0byB0aGUge1RleHRFZGl0b3J9IChvciBvdGhlciBpdGVtKSBmb3IgdGhlIGdpdmVuIFVSSS5cbiAgY3JlYXRlSXRlbUZvclVSSSAodXJpLCBvcHRpb25zKSB7XG4gICAgaWYgKHVyaSAhPSBudWxsKSB7XG4gICAgICBmb3IgKGxldCBvcGVuZXIgb2YgdGhpcy5nZXRPcGVuZXJzKCkpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG9wZW5lcih1cmksIG9wdGlvbnMpXG4gICAgICAgIGlmIChpdGVtICE9IG51bGwpIHJldHVybiBQcm9taXNlLnJlc29sdmUoaXRlbSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMub3BlblRleHRGaWxlKHVyaSwgb3B0aW9ucylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc3dpdGNoIChlcnJvci5jb2RlKSB7XG4gICAgICAgIGNhc2UgJ0NBTkNFTExFRCc6XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIGNhc2UgJ0VBQ0NFUyc6XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZFdhcm5pbmcoYFBlcm1pc3Npb24gZGVuaWVkICcke2Vycm9yLnBhdGh9J2ApXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIGNhc2UgJ0VQRVJNJzpcbiAgICAgICAgY2FzZSAnRUJVU1knOlxuICAgICAgICBjYXNlICdFTlhJTyc6XG4gICAgICAgIGNhc2UgJ0VJTyc6XG4gICAgICAgIGNhc2UgJ0VOT1RDT05OJzpcbiAgICAgICAgY2FzZSAnVU5LTk9XTic6XG4gICAgICAgIGNhc2UgJ0VDT05OUkVTRVQnOlxuICAgICAgICBjYXNlICdFSU5WQUwnOlxuICAgICAgICBjYXNlICdFTUZJTEUnOlxuICAgICAgICBjYXNlICdFTk9URElSJzpcbiAgICAgICAgY2FzZSAnRUFHQUlOJzpcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkV2FybmluZyhcbiAgICAgICAgICAgIGBVbmFibGUgdG8gb3BlbiAnJHtlcnJvci5wYXRoICE9IG51bGwgPyBlcnJvci5wYXRoIDogdXJpfSdgLFxuICAgICAgICAgICAge2RldGFpbDogZXJyb3IubWVzc2FnZX1cbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuVGV4dEZpbGUgKHVyaSwgb3B0aW9ucykge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5wcm9qZWN0LnJlc29sdmVQYXRoKHVyaSlcblxuICAgIGlmIChmaWxlUGF0aCAhPSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBmcy5jbG9zZVN5bmMoZnMub3BlblN5bmMoZmlsZVBhdGgsICdyJykpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBhbGxvdyBFTk9FTlQgZXJyb3JzIHRvIGNyZWF0ZSBhbiBlZGl0b3IgZm9yIHBhdGhzIHRoYXQgZG9udCBleGlzdFxuICAgICAgICBpZiAoZXJyb3IuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVNpemUgPSBmcy5nZXRTaXplU3luYyhmaWxlUGF0aClcblxuICAgIGNvbnN0IGxhcmdlRmlsZU1vZGUgPSBmaWxlU2l6ZSA+PSAoMiAqIDEwNDg1NzYpIC8vIDJNQlxuICAgIGlmIChmaWxlU2l6ZSA+PSAodGhpcy5jb25maWcuZ2V0KCdjb3JlLndhcm5PbkxhcmdlRmlsZUxpbWl0JykgKiAxMDQ4NTc2KSkgeyAvLyAyME1CIGJ5IGRlZmF1bHRcbiAgICAgIGNvbnN0IGNob2ljZSA9IHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5jb25maXJtKHtcbiAgICAgICAgbWVzc2FnZTogJ0F0b20gd2lsbCBiZSB1bnJlc3BvbnNpdmUgZHVyaW5nIHRoZSBsb2FkaW5nIG9mIHZlcnkgbGFyZ2UgZmlsZXMuJyxcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiAnRG8geW91IHN0aWxsIHdhbnQgdG8gbG9hZCB0aGlzIGZpbGU/JyxcbiAgICAgICAgYnV0dG9uczogWydQcm9jZWVkJywgJ0NhbmNlbCddXG4gICAgICB9KVxuICAgICAgaWYgKGNob2ljZSA9PT0gMSkge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpXG4gICAgICAgIGVycm9yLmNvZGUgPSAnQ0FOQ0VMTEVEJ1xuICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3QuYnVmZmVyRm9yUGF0aChmaWxlUGF0aCwgb3B0aW9ucylcbiAgICAgIC50aGVuKGJ1ZmZlciA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5idWlsZChPYmplY3QuYXNzaWduKHtidWZmZXIsIGxhcmdlRmlsZU1vZGUsIGF1dG9IZWlnaHQ6IGZhbHNlfSwgb3B0aW9ucykpXG4gICAgICB9KVxuICB9XG5cbiAgaGFuZGxlR3JhbW1hclVzZWQgKGdyYW1tYXIpIHtcbiAgICBpZiAoZ3JhbW1hciA9PSBudWxsKSB7IHJldHVybiB9XG4gICAgcmV0dXJuIHRoaXMucGFja2FnZU1hbmFnZXIudHJpZ2dlckFjdGl2YXRpb25Ib29rKGAke2dyYW1tYXIucGFja2FnZU5hbWV9OmdyYW1tYXItdXNlZGApXG4gIH1cblxuICAvLyBQdWJsaWM6IFJldHVybnMgYSB7Qm9vbGVhbn0gdGhhdCBpcyBgdHJ1ZWAgaWYgYG9iamVjdGAgaXMgYSBgVGV4dEVkaXRvcmAuXG4gIC8vXG4gIC8vICogYG9iamVjdGAgQW4ge09iamVjdH0geW91IHdhbnQgdG8gcGVyZm9ybSB0aGUgY2hlY2sgYWdhaW5zdC5cbiAgaXNUZXh0RWRpdG9yIChvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgVGV4dEVkaXRvclxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IENyZWF0ZSBhIG5ldyB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtUZXh0RWRpdG9yfS5cbiAgYnVpbGRUZXh0RWRpdG9yIChwYXJhbXMpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5idWlsZChwYXJhbXMpXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkubWFpbnRhaW5HcmFtbWFyKGVkaXRvciksXG4gICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5tYWludGFpbkNvbmZpZyhlZGl0b3IpXG4gICAgKVxuICAgIGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4geyBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKSB9KVxuICAgIHJldHVybiBlZGl0b3JcbiAgfVxuXG4gIC8vIFB1YmxpYzogQXN5bmNocm9ub3VzbHkgcmVvcGVucyB0aGUgbGFzdC1jbG9zZWQgaXRlbSdzIFVSSSBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuXG4gIC8vIHJlb3BlbmVkLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1Byb21pc2V9IHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgaXRlbSBpcyBvcGVuZWRcbiAgcmVvcGVuSXRlbSAoKSB7XG4gICAgY29uc3QgdXJpID0gdGhpcy5kZXN0cm95ZWRJdGVtVVJJcy5wb3AoKVxuICAgIGlmICh1cmkpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW4odXJpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gIH1cblxuICAvLyBQdWJsaWM6IFJlZ2lzdGVyIGFuIG9wZW5lciBmb3IgYSB1cmkuXG4gIC8vXG4gIC8vIFdoZW4gYSBVUkkgaXMgb3BlbmVkIHZpYSB7V29ya3NwYWNlOjpvcGVufSwgQXRvbSBsb29wcyB0aHJvdWdoIGl0cyByZWdpc3RlcmVkXG4gIC8vIG9wZW5lciBmdW5jdGlvbnMgdW50aWwgb25lIHJldHVybnMgYSB2YWx1ZSBmb3IgdGhlIGdpdmVuIHVyaS5cbiAgLy8gT3BlbmVycyBhcmUgZXhwZWN0ZWQgdG8gcmV0dXJuIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gSFRNTEVsZW1lbnQgb3JcbiAgLy8gYSBtb2RlbCB3aGljaCBoYXMgYW4gYXNzb2NpYXRlZCB2aWV3IGluIHRoZSB7Vmlld1JlZ2lzdHJ5fS5cbiAgLy8gQSB7VGV4dEVkaXRvcn0gd2lsbCBiZSB1c2VkIGlmIG5vIG9wZW5lciByZXR1cm5zIGEgdmFsdWUuXG4gIC8vXG4gIC8vICMjIEV4YW1wbGVzXG4gIC8vXG4gIC8vIGBgYGNvZmZlZVxuICAvLyBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKHVyaSkgLT5cbiAgLy8gICBpZiBwYXRoLmV4dG5hbWUodXJpKSBpcyAnLnRvbWwnXG4gIC8vICAgICByZXR1cm4gbmV3IFRvbWxFZGl0b3IodXJpKVxuICAvLyBgYGBcbiAgLy9cbiAgLy8gKiBgb3BlbmVyYCBBIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gYSBwYXRoIGlzIGJlaW5nIG9wZW5lZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byByZW1vdmUgdGhlXG4gIC8vIG9wZW5lci5cbiAgLy9cbiAgLy8gTm90ZSB0aGF0IHRoZSBvcGVuZXIgd2lsbCBiZSBjYWxsZWQgaWYgYW5kIG9ubHkgaWYgdGhlIFVSSSBpcyBub3QgYWxyZWFkeSBvcGVuXG4gIC8vIGluIHRoZSBjdXJyZW50IHBhbmUuIFRoZSBzZWFyY2hBbGxQYW5lcyBmbGFnIGV4cGFuZHMgdGhlIHNlYXJjaCBmcm9tIHRoZVxuICAvLyBjdXJyZW50IHBhbmUgdG8gYWxsIHBhbmVzLiBJZiB5b3Ugd2lzaCB0byBvcGVuIGEgdmlldyBvZiBhIGRpZmZlcmVudCB0eXBlIGZvclxuICAvLyBhIGZpbGUgdGhhdCBpcyBhbHJlYWR5IG9wZW4sIGNvbnNpZGVyIGNoYW5naW5nIHRoZSBwcm90b2NvbCBvZiB0aGUgVVJJLiBGb3JcbiAgLy8gZXhhbXBsZSwgcGVyaGFwcyB5b3Ugd2lzaCB0byBwcmV2aWV3IGEgcmVuZGVyZWQgdmVyc2lvbiBvZiB0aGUgZmlsZSBgL2Zvby9iYXIvYmF6LnF1dXhgXG4gIC8vIHRoYXQgaXMgYWxyZWFkeSBvcGVuIGluIGEgdGV4dCBlZGl0b3Igdmlldy4gWW91IGNvdWxkIHNpZ25hbCB0aGlzIGJ5IGNhbGxpbmdcbiAgLy8ge1dvcmtzcGFjZTo6b3Blbn0gb24gdGhlIFVSSSBgcXV1eC1wcmV2aWV3Oi8vZm9vL2Jhci9iYXoucXV1eGAuIFRoZW4geW91ciBvcGVuZXJcbiAgLy8gY2FuIGNoZWNrIHRoZSBwcm90b2NvbCBmb3IgcXV1eC1wcmV2aWV3IGFuZCBvbmx5IGhhbmRsZSB0aG9zZSBVUklzIHRoYXQgbWF0Y2guXG4gIGFkZE9wZW5lciAob3BlbmVyKSB7XG4gICAgdGhpcy5vcGVuZXJzLnB1c2gob3BlbmVyKVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IF8ucmVtb3ZlKHRoaXMub3BlbmVycywgb3BlbmVyKSB9KVxuICB9XG5cbiAgZ2V0T3BlbmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyc1xuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogUGFuZSBJdGVtc1xuICAqL1xuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFsbCBwYW5lIGl0ZW1zIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiBpdGVtcy5cbiAgZ2V0UGFuZUl0ZW1zICgpIHtcbiAgICByZXR1cm4gXy5mbGF0dGVuKHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5nZXRQYW5lSXRlbXMoKSkpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUgYWN0aXZlIHtQYW5lfSdzIGFjdGl2ZSBpdGVtLlxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHBhbmUgaXRlbSB7T2JqZWN0fS5cbiAgZ2V0QWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbGwgdGV4dCBlZGl0b3JzIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiB7VGV4dEVkaXRvcn1zLlxuICBnZXRUZXh0RWRpdG9ycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZUl0ZW1zKCkuZmlsdGVyKGl0ZW0gPT4gaXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUgd29ya3NwYWNlIGNlbnRlcidzIGFjdGl2ZSBpdGVtIGlmIGl0IGlzIGEge1RleHRFZGl0b3J9LlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1RleHRFZGl0b3J9IG9yIGB1bmRlZmluZWRgIGlmIHRoZSB3b3Jrc3BhY2UgY2VudGVyJ3MgY3VycmVudFxuICAvLyBhY3RpdmUgaXRlbSBpcyBub3QgYSB7VGV4dEVkaXRvcn0uXG4gIGdldEFjdGl2ZVRleHRFZGl0b3IgKCkge1xuICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBpZiAoYWN0aXZlSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpIHsgcmV0dXJuIGFjdGl2ZUl0ZW0gfVxuICB9XG5cbiAgLy8gU2F2ZSBhbGwgcGFuZSBpdGVtcy5cbiAgc2F2ZUFsbCAoKSB7XG4gICAgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpLmZvckVhY2goY29udGFpbmVyID0+IHtcbiAgICAgIGNvbnRhaW5lci5zYXZlQWxsKClcbiAgICB9KVxuICB9XG5cbiAgY29uZmlybUNsb3NlIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+XG4gICAgICBjb250YWluZXIuY29uZmlybUNsb3NlKG9wdGlvbnMpXG4gICAgKSkudGhlbigocmVzdWx0cykgPT4gIXJlc3VsdHMuaW5jbHVkZXMoZmFsc2UpKVxuICB9XG5cbiAgLy8gU2F2ZSB0aGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gSWYgdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gY3VycmVudGx5IGhhcyBhIFVSSSBhY2NvcmRpbmcgdG8gdGhlIGl0ZW0nc1xuICAvLyBgLmdldFVSSWAgbWV0aG9kLCBjYWxscyBgLnNhdmVgIG9uIHRoZSBpdGVtLiBPdGhlcndpc2VcbiAgLy8gezo6c2F2ZUFjdGl2ZVBhbmVJdGVtQXN9ICMgd2lsbCBiZSBjYWxsZWQgaW5zdGVhZC4gVGhpcyBtZXRob2QgZG9lcyBub3RoaW5nXG4gIC8vIGlmIHRoZSBhY3RpdmUgaXRlbSBkb2VzIG5vdCBpbXBsZW1lbnQgYSBgLnNhdmVgIG1ldGhvZC5cbiAgc2F2ZUFjdGl2ZVBhbmVJdGVtICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKCkuc2F2ZUFjdGl2ZUl0ZW0oKVxuICB9XG5cbiAgLy8gUHJvbXB0IHRoZSB1c2VyIGZvciBhIHBhdGggYW5kIHNhdmUgdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gdG8gaXQuXG4gIC8vXG4gIC8vIE9wZW5zIGEgbmF0aXZlIGRpYWxvZyB3aGVyZSB0aGUgdXNlciBzZWxlY3RzIGEgcGF0aCBvbiBkaXNrLCB0aGVuIGNhbGxzXG4gIC8vIGAuc2F2ZUFzYCBvbiB0aGUgaXRlbSB3aXRoIHRoZSBzZWxlY3RlZCBwYXRoLiBUaGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcgaWZcbiAgLy8gdGhlIGFjdGl2ZSBpdGVtIGRvZXMgbm90IGltcGxlbWVudCBhIGAuc2F2ZUFzYCBtZXRob2QuXG4gIHNhdmVBY3RpdmVQYW5lSXRlbUFzICgpIHtcbiAgICB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKS5zYXZlQWN0aXZlSXRlbUFzKClcbiAgfVxuXG4gIC8vIERlc3Ryb3kgKGNsb3NlKSB0aGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmVtb3ZlcyB0aGUgYWN0aXZlIHBhbmUgaXRlbSBhbmQgY2FsbHMgdGhlIGAuZGVzdHJveWAgbWV0aG9kIG9uIGl0IGlmIG9uZSBpc1xuICAvLyBkZWZpbmVkLlxuICBkZXN0cm95QWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmUoKS5kZXN0cm95QWN0aXZlSXRlbSgpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lc1xuICAqL1xuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIG1vc3QgcmVjZW50bHkgZm9jdXNlZCBwYW5lIGNvbnRhaW5lci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSBvciB0aGUge1dvcmtzcGFjZUNlbnRlcn0uXG4gIGdldEFjdGl2ZVBhbmVDb250YWluZXIgKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXJcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgYWxsIHBhbmVzIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiB7UGFuZX1zLlxuICBnZXRQYW5lcyAoKSB7XG4gICAgcmV0dXJuIF8uZmxhdHRlbih0aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIuZ2V0UGFuZXMoKSkpXG4gIH1cblxuICBnZXRWaXNpYmxlUGFuZXMgKCkge1xuICAgIHJldHVybiBfLmZsYXR0ZW4odGhpcy5nZXRWaXNpYmxlUGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5nZXRQYW5lcygpKSlcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIGFjdGl2ZSB7UGFuZX0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZX0uXG4gIGdldEFjdGl2ZVBhbmUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKS5nZXRBY3RpdmVQYW5lKClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBNYWtlIHRoZSBuZXh0IHBhbmUgYWN0aXZlLlxuICBhY3RpdmF0ZU5leHRQYW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkuYWN0aXZhdGVOZXh0UGFuZSgpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogTWFrZSB0aGUgcHJldmlvdXMgcGFuZSBhY3RpdmUuXG4gIGFjdGl2YXRlUHJldmlvdXNQYW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkuYWN0aXZhdGVQcmV2aW91c1BhbmUoKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgZmlyc3QgcGFuZSBjb250YWluZXIgdGhhdCBjb250YWlucyBhbiBpdGVtIHdpdGggdGhlIGdpdmVuXG4gIC8vIFVSSS5cbiAgLy9cbiAgLy8gKiBgdXJpYCB7U3RyaW5nfSB1cmlcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSwgdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9LCBvciBgdW5kZWZpbmVkYCBpZiBubyBpdGVtIGV4aXN0c1xuICAvLyB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIHBhbmVDb250YWluZXJGb3JVUkkgKHVyaSkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVDb250YWluZXJzKCkuZmluZChjb250YWluZXIgPT4gY29udGFpbmVyLnBhbmVGb3JVUkkodXJpKSlcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIGZpcnN0IHBhbmUgY29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIGl0ZW0uXG4gIC8vXG4gIC8vICogYGl0ZW1gIHRoZSBJdGVtIHRoYXQgdGhlIHJldHVybmVkIHBhbmUgY29udGFpbmVyIG11c3QgY29udGFpbi5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSwgdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9LCBvciBgdW5kZWZpbmVkYCBpZiBubyBpdGVtIGV4aXN0c1xuICAvLyB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIHBhbmVDb250YWluZXJGb3JJdGVtICh1cmkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lQ29udGFpbmVycygpLmZpbmQoY29udGFpbmVyID0+IGNvbnRhaW5lci5wYW5lRm9ySXRlbSh1cmkpKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgZmlyc3Qge1BhbmV9IHRoYXQgY29udGFpbnMgYW4gaXRlbSB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIC8vXG4gIC8vICogYHVyaWAge1N0cmluZ30gdXJpXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZX0gb3IgYHVuZGVmaW5lZGAgaWYgbm8gaXRlbSBleGlzdHMgd2l0aCB0aGUgZ2l2ZW4gVVJJLlxuICBwYW5lRm9yVVJJICh1cmkpIHtcbiAgICBmb3IgKGxldCBsb2NhdGlvbiBvZiB0aGlzLmdldFBhbmVDb250YWluZXJzKCkpIHtcbiAgICAgIGNvbnN0IHBhbmUgPSBsb2NhdGlvbi5wYW5lRm9yVVJJKHVyaSlcbiAgICAgIGlmIChwYW5lICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHBhbmVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBFeHRlbmRlZDogR2V0IHRoZSB7UGFuZX0gY29udGFpbmluZyB0aGUgZ2l2ZW4gaXRlbS5cbiAgLy9cbiAgLy8gKiBgaXRlbWAgdGhlIEl0ZW0gdGhhdCB0aGUgcmV0dXJuZWQgcGFuZSBtdXN0IGNvbnRhaW4uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZX0gb3IgYHVuZGVmaW5lZGAgaWYgbm8gcGFuZSBleGlzdHMgZm9yIHRoZSBnaXZlbiBpdGVtLlxuICBwYW5lRm9ySXRlbSAoaXRlbSkge1xuICAgIGZvciAobGV0IGxvY2F0aW9uIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgY29uc3QgcGFuZSA9IGxvY2F0aW9uLnBhbmVGb3JJdGVtKGl0ZW0pXG4gICAgICBpZiAocGFuZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBwYW5lXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRGVzdHJveSAoY2xvc2UpIHRoZSBhY3RpdmUgcGFuZS5cbiAgZGVzdHJveUFjdGl2ZVBhbmUgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSB0aGlzLmdldEFjdGl2ZVBhbmUoKVxuICAgIGlmIChhY3RpdmVQYW5lICE9IG51bGwpIHtcbiAgICAgIGFjdGl2ZVBhbmUuZGVzdHJveSgpXG4gICAgfVxuICB9XG5cbiAgLy8gQ2xvc2UgdGhlIGFjdGl2ZSBjZW50ZXIgcGFuZSBpdGVtLCBvciB0aGUgYWN0aXZlIGNlbnRlciBwYW5lIGlmIGl0IGlzXG4gIC8vIGVtcHR5LCBvciB0aGUgY3VycmVudCB3aW5kb3cgaWYgdGhlcmUgaXMgb25seSB0aGUgZW1wdHkgcm9vdCBwYW5lLlxuICBjbG9zZUFjdGl2ZVBhbmVJdGVtT3JFbXB0eVBhbmVPcldpbmRvdyAoKSB7XG4gICAgaWYgKHRoaXMuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZUl0ZW0oKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKS5kZXN0cm95QWN0aXZlSXRlbSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5nZXRDZW50ZXIoKS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5nZXQoJ2NvcmUuY2xvc2VFbXB0eVdpbmRvd3MnKSkge1xuICAgICAgYXRvbS5jbG9zZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gSW5jcmVhc2UgdGhlIGVkaXRvciBmb250IHNpemUgYnkgMXB4LlxuICBpbmNyZWFzZUZvbnRTaXplICgpIHtcbiAgICB0aGlzLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIHRoaXMuY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJykgKyAxKVxuICB9XG5cbiAgLy8gRGVjcmVhc2UgdGhlIGVkaXRvciBmb250IHNpemUgYnkgMXB4LlxuICBkZWNyZWFzZUZvbnRTaXplICgpIHtcbiAgICBjb25zdCBmb250U2l6ZSA9IHRoaXMuY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJylcbiAgICBpZiAoZm9udFNpemUgPiAxKSB7XG4gICAgICB0aGlzLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIGZvbnRTaXplIC0gMSlcbiAgICB9XG4gIH1cblxuICAvLyBSZXN0b3JlIHRvIHRoZSB3aW5kb3cncyBvcmlnaW5hbCBlZGl0b3IgZm9udCBzaXplLlxuICByZXNldEZvbnRTaXplICgpIHtcbiAgICBpZiAodGhpcy5vcmlnaW5hbEZvbnRTaXplKSB7XG4gICAgICB0aGlzLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIHRoaXMub3JpZ2luYWxGb250U2l6ZSlcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmVUb0ZvbnRTaXplICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5mb250U2l6ZScsICh7b2xkVmFsdWV9KSA9PiB7XG4gICAgICBpZiAodGhpcy5vcmlnaW5hbEZvbnRTaXplID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbEZvbnRTaXplID0gb2xkVmFsdWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gUmVtb3ZlcyB0aGUgaXRlbSdzIHVyaSBmcm9tIHRoZSBsaXN0IG9mIHBvdGVudGlhbCBpdGVtcyB0byByZW9wZW4uXG4gIGl0ZW1PcGVuZWQgKGl0ZW0pIHtcbiAgICBsZXQgdXJpXG4gICAgaWYgKHR5cGVvZiBpdGVtLmdldFVSSSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdXJpID0gaXRlbS5nZXRVUkkoKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0uZ2V0VXJpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmkgPSBpdGVtLmdldFVyaSgpXG4gICAgfVxuXG4gICAgaWYgKHVyaSAhPSBudWxsKSB7XG4gICAgICBfLnJlbW92ZSh0aGlzLmRlc3Ryb3llZEl0ZW1VUklzLCB1cmkpXG4gICAgfVxuICB9XG5cbiAgLy8gQWRkcyB0aGUgZGVzdHJveWVkIGl0ZW0ncyB1cmkgdG8gdGhlIGxpc3Qgb2YgaXRlbXMgdG8gcmVvcGVuLlxuICBkaWREZXN0cm95UGFuZUl0ZW0gKHtpdGVtfSkge1xuICAgIGxldCB1cmlcbiAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmkgPSBpdGVtLmdldFVSSSgpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbS5nZXRVcmkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVyaSA9IGl0ZW0uZ2V0VXJpKClcbiAgICB9XG5cbiAgICBpZiAodXJpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZGVzdHJveWVkSXRlbVVSSXMucHVzaCh1cmkpXG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IE1vZGVsIHN1cGVyY2xhc3Mgd2hlbiBkZXN0cm95ZWRcbiAgZGVzdHJveWVkICgpIHtcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQuZGVzdHJveSgpXG4gICAgdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5kZXN0cm95KClcbiAgICB0aGlzLmNhbmNlbFN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCgpXG4gICAgaWYgKHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lIExvY2F0aW9uc1xuICAqL1xuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSB7V29ya3NwYWNlQ2VudGVyfSBhdCB0aGUgY2VudGVyIG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRDZW50ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlclxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgdGhlIHtEb2NrfSB0byB0aGUgbGVmdCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0TGVmdERvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmxlZnRcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSB7RG9ja30gdG8gdGhlIHJpZ2h0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRSaWdodERvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0XG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUge0RvY2t9IGJlbG93IHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRCb3R0b21Eb2NrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b21cbiAgfVxuXG4gIGdldFBhbmVDb250YWluZXJzICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LFxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b21cbiAgICBdXG4gIH1cblxuICBnZXRWaXNpYmxlUGFuZUNvbnRhaW5lcnMgKCkge1xuICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKClcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUNvbnRhaW5lcnMoKVxuICAgICAgLmZpbHRlcihjb250YWluZXIgPT4gY29udGFpbmVyID09PSBjZW50ZXIgfHwgY29udGFpbmVyLmlzVmlzaWJsZSgpKVxuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogUGFuZWxzXG5cbiAgUGFuZWxzIGFyZSB1c2VkIHRvIGRpc3BsYXkgVUkgcmVsYXRlZCB0byBhbiBlZGl0b3Igd2luZG93LiBUaGV5IGFyZSBwbGFjZWQgYXQgb25lIG9mIHRoZSBmb3VyXG4gIGVkZ2VzIG9mIHRoZSB3aW5kb3c6IGxlZnQsIHJpZ2h0LCB0b3Agb3IgYm90dG9tLiBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgcGFuZWxzIG9uIHRoZSBzYW1lIHdpbmRvd1xuICBlZGdlIHRoZXkgYXJlIHN0YWNrZWQgaW4gb3JkZXIgb2YgcHJpb3JpdHk6IGhpZ2hlciBwcmlvcml0eSBpcyBjbG9zZXIgdG8gdGhlIGNlbnRlciwgbG93ZXJcbiAgcHJpb3JpdHkgdG93YXJkcyB0aGUgZWRnZS5cblxuICAqTm90ZToqIElmIHlvdXIgcGFuZWwgY2hhbmdlcyBpdHMgc2l6ZSB0aHJvdWdob3V0IGl0cyBsaWZldGltZSwgY29uc2lkZXIgZ2l2aW5nIGl0IGEgaGlnaGVyXG4gIHByaW9yaXR5LCBhbGxvd2luZyBmaXhlZCBzaXplIHBhbmVscyB0byBiZSBjbG9zZXIgdG8gdGhlIGVkZ2UuIFRoaXMgYWxsb3dzIGNvbnRyb2wgdGFyZ2V0cyB0b1xuICByZW1haW4gbW9yZSBzdGF0aWMgZm9yIGVhc2llciB0YXJnZXRpbmcgYnkgdXNlcnMgdGhhdCBlbXBsb3kgbWljZSBvciB0cmFja3BhZHMuIChTZWVcbiAgW2F0b20vYXRvbSM0ODM0XShodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2lzc3Vlcy80ODM0KSBmb3IgZGlzY3Vzc2lvbi4pXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIGF0IHRoZSBib3R0b20gb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldEJvdHRvbVBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCdib3R0b20nKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgYm90dG9tIG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZEJvdHRvbVBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ2JvdHRvbScsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgdG8gdGhlIGxlZnQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldExlZnRQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnbGVmdCcpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSBsZWZ0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZExlZnRQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdsZWZ0Jywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyB0byB0aGUgcmlnaHQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldFJpZ2h0UGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ3JpZ2h0JylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIHJpZ2h0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZFJpZ2h0UGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgncmlnaHQnLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldFRvcFBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCd0b3AnKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgdG9wIG9mIHRoZSBlZGl0b3Igd2luZG93IGFib3ZlIHRoZSB0YWJzLlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZFRvcFBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ3RvcCcsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgaW4gdGhlIGhlYWRlci5cbiAgZ2V0SGVhZGVyUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ2hlYWRlcicpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSBoZWFkZXIuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkSGVhZGVyUGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgnaGVhZGVyJywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyBpbiB0aGUgZm9vdGVyLlxuICBnZXRGb290ZXJQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnZm9vdGVyJylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIGZvb3Rlci5cbiAgLy9cbiAgLy8gKiBgb3B0aW9uc2Age09iamVjdH1cbiAgLy8gICAqIGBpdGVtYCBZb3VyIHBhbmVsIGNvbnRlbnQuIEl0IGNhbiBiZSBET00gZWxlbWVudCwgYSBqUXVlcnkgZWxlbWVudCwgb3JcbiAgLy8gICAgIGEgbW9kZWwgd2l0aCBhIHZpZXcgcmVnaXN0ZXJlZCB2aWEge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfS4gV2UgcmVjb21tZW5kIHRoZVxuICAvLyAgICAgbGF0dGVyLiBTZWUge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgLy8gICAqIGB2aXNpYmxlYCAob3B0aW9uYWwpIHtCb29sZWFufSBmYWxzZSBpZiB5b3Ugd2FudCB0aGUgcGFuZWwgdG8gaW5pdGlhbGx5IGJlIGhpZGRlblxuICAvLyAgICAgKGRlZmF1bHQ6IHRydWUpXG4gIC8vICAgKiBgcHJpb3JpdHlgIChvcHRpb25hbCkge051bWJlcn0gRGV0ZXJtaW5lcyBzdGFja2luZyBvcmRlci4gTG93ZXIgcHJpb3JpdHkgaXRlbXMgYXJlXG4gIC8vICAgICBmb3JjZWQgY2xvc2VyIHRvIHRoZSBlZGdlcyBvZiB0aGUgd2luZG93LiAoZGVmYXVsdDogMTAwKVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmVsfVxuICBhZGRGb290ZXJQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdmb290ZXInLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIG1vZGFsIHBhbmVsIGl0ZW1zXG4gIGdldE1vZGFsUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ21vZGFsJylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gYXMgYSBtb2RhbCBkaWFsb2cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgYSBET00gZWxlbWVudCwgYSBqUXVlcnkgZWxlbWVudCwgb3JcbiAgLy8gICAgIGEgbW9kZWwgd2l0aCBhIHZpZXcgcmVnaXN0ZXJlZCB2aWEge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfS4gV2UgcmVjb21tZW5kIHRoZVxuICAvLyAgICAgbW9kZWwgb3B0aW9uLiBTZWUge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgLy8gICAqIGB2aXNpYmxlYCAob3B0aW9uYWwpIHtCb29sZWFufSBmYWxzZSBpZiB5b3Ugd2FudCB0aGUgcGFuZWwgdG8gaW5pdGlhbGx5IGJlIGhpZGRlblxuICAvLyAgICAgKGRlZmF1bHQ6IHRydWUpXG4gIC8vICAgKiBgcHJpb3JpdHlgIChvcHRpb25hbCkge051bWJlcn0gRGV0ZXJtaW5lcyBzdGFja2luZyBvcmRlci4gTG93ZXIgcHJpb3JpdHkgaXRlbXMgYXJlXG4gIC8vICAgICBmb3JjZWQgY2xvc2VyIHRvIHRoZSBlZGdlcyBvZiB0aGUgd2luZG93LiAoZGVmYXVsdDogMTAwKVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmVsfVxuICBhZGRNb2RhbFBhbmVsIChvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgnbW9kYWwnLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBSZXR1cm5zIHRoZSB7UGFuZWx9IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gaXRlbS4gUmV0dXJuc1xuICAvLyBgbnVsbGAgd2hlbiB0aGUgaXRlbSBoYXMgbm8gcGFuZWwuXG4gIC8vXG4gIC8vICogYGl0ZW1gIEl0ZW0gdGhlIHBhbmVsIGNvbnRhaW5zXG4gIHBhbmVsRm9ySXRlbSAoaXRlbSkge1xuICAgIGZvciAobGV0IGxvY2F0aW9uIGluIHRoaXMucGFuZWxDb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnBhbmVsQ29udGFpbmVyc1tsb2NhdGlvbl1cbiAgICAgIGNvbnN0IHBhbmVsID0gY29udGFpbmVyLnBhbmVsRm9ySXRlbShpdGVtKVxuICAgICAgaWYgKHBhbmVsICE9IG51bGwpIHsgcmV0dXJuIHBhbmVsIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGdldFBhbmVscyAobG9jYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbENvbnRhaW5lcnNbbG9jYXRpb25dLmdldFBhbmVscygpXG4gIH1cblxuICBhZGRQYW5lbCAobG9jYXRpb24sIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7IG9wdGlvbnMgPSB7fSB9XG4gICAgcmV0dXJuIHRoaXMucGFuZWxDb250YWluZXJzW2xvY2F0aW9uXS5hZGRQYW5lbChuZXcgUGFuZWwob3B0aW9ucywgdGhpcy52aWV3UmVnaXN0cnkpKVxuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogU2VhcmNoaW5nIGFuZCBSZXBsYWNpbmdcbiAgKi9cblxuICAvLyBQdWJsaWM6IFBlcmZvcm1zIGEgc2VhcmNoIGFjcm9zcyBhbGwgZmlsZXMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgcmVnZXhgIHtSZWdFeHB9IHRvIHNlYXJjaCB3aXRoLlxuICAvLyAqIGBvcHRpb25zYCAob3B0aW9uYWwpIHtPYmplY3R9XG4gIC8vICAgKiBgcGF0aHNgIEFuIHtBcnJheX0gb2YgZ2xvYiBwYXR0ZXJucyB0byBzZWFyY2ggd2l0aGluLlxuICAvLyAgICogYG9uUGF0aHNTZWFyY2hlZGAgKG9wdGlvbmFsKSB7RnVuY3Rpb259IHRvIGJlIHBlcmlvZGljYWxseSBjYWxsZWRcbiAgLy8gICAgIHdpdGggbnVtYmVyIG9mIHBhdGhzIHNlYXJjaGVkLlxuICAvLyAgICogYGxlYWRpbmdDb250ZXh0TGluZUNvdW50YCB7TnVtYmVyfSBkZWZhdWx0IGAwYDsgVGhlIG51bWJlciBvZiBsaW5lc1xuICAvLyAgICAgIGJlZm9yZSB0aGUgbWF0Y2hlZCBsaW5lIHRvIGluY2x1ZGUgaW4gdGhlIHJlc3VsdHMgb2JqZWN0LlxuICAvLyAgICogYHRyYWlsaW5nQ29udGV4dExpbmVDb3VudGAge051bWJlcn0gZGVmYXVsdCBgMGA7IFRoZSBudW1iZXIgb2YgbGluZXNcbiAgLy8gICAgICBhZnRlciB0aGUgbWF0Y2hlZCBsaW5lIHRvIGluY2x1ZGUgaW4gdGhlIHJlc3VsdHMgb2JqZWN0LlxuICAvLyAqIGBpdGVyYXRvcmAge0Z1bmN0aW9ufSBjYWxsYmFjayBvbiBlYWNoIGZpbGUgZm91bmQuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gd2l0aCBhIGBjYW5jZWwoKWAgbWV0aG9kIHRoYXQgd2lsbCBjYW5jZWwgYWxsXG4gIC8vIG9mIHRoZSB1bmRlcmx5aW5nIHNlYXJjaGVzIHRoYXQgd2VyZSBzdGFydGVkIGFzIHBhcnQgb2YgdGhpcyBzY2FuLlxuICBzY2FuIChyZWdleCwgb3B0aW9ucyA9IHt9LCBpdGVyYXRvcikge1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgIGl0ZXJhdG9yID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgLy8gRmluZCBhIHNlYXJjaGVyIGZvciBldmVyeSBEaXJlY3RvcnkgaW4gdGhlIHByb2plY3QuIEVhY2ggc2VhcmNoZXIgdGhhdCBpcyBtYXRjaGVkXG4gICAgLy8gd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggYW4gQXJyYXkgb2YgRGlyZWN0b3J5IG9iamVjdHMgaW4gdGhlIE1hcC5cbiAgICBjb25zdCBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyID0gbmV3IE1hcCgpXG4gICAgZm9yIChjb25zdCBkaXJlY3Rvcnkgb2YgdGhpcy5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkpIHtcbiAgICAgIGxldCBzZWFyY2hlciA9IHRoaXMuZGVmYXVsdERpcmVjdG9yeVNlYXJjaGVyXG4gICAgICBmb3IgKGNvbnN0IGRpcmVjdG9yeVNlYXJjaGVyIG9mIHRoaXMuZGlyZWN0b3J5U2VhcmNoZXJzKSB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlTZWFyY2hlci5jYW5TZWFyY2hEaXJlY3RvcnkoZGlyZWN0b3J5KSkge1xuICAgICAgICAgIHNlYXJjaGVyID0gZGlyZWN0b3J5U2VhcmNoZXJcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgZGlyZWN0b3JpZXMgPSBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyLmdldChzZWFyY2hlcilcbiAgICAgIGlmICghZGlyZWN0b3JpZXMpIHtcbiAgICAgICAgZGlyZWN0b3JpZXMgPSBbXVxuICAgICAgICBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyLnNldChzZWFyY2hlciwgZGlyZWN0b3JpZXMpXG4gICAgICB9XG4gICAgICBkaXJlY3Rvcmllcy5wdXNoKGRpcmVjdG9yeSlcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIG9uUGF0aHNTZWFyY2hlZCBjYWxsYmFjay5cbiAgICBsZXQgb25QYXRoc1NlYXJjaGVkXG4gICAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zLm9uUGF0aHNTZWFyY2hlZCkpIHtcbiAgICAgIC8vIE1haW50YWluIGEgbWFwIG9mIGRpcmVjdG9yaWVzIHRvIHRoZSBudW1iZXIgb2Ygc2VhcmNoIHJlc3VsdHMuIFdoZW4gbm90aWZpZWQgb2YgYSBuZXcgY291bnQsXG4gICAgICAvLyByZXBsYWNlIHRoZSBlbnRyeSBpbiB0aGUgbWFwIGFuZCB1cGRhdGUgdGhlIHRvdGFsLlxuICAgICAgY29uc3Qgb25QYXRoc1NlYXJjaGVkT3B0aW9uID0gb3B0aW9ucy5vblBhdGhzU2VhcmNoZWRcbiAgICAgIGxldCB0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZCA9IDBcbiAgICAgIGNvbnN0IG51bWJlck9mUGF0aHNTZWFyY2hlZEZvclNlYXJjaGVyID0gbmV3IE1hcCgpXG4gICAgICBvblBhdGhzU2VhcmNoZWQgPSBmdW5jdGlvbiAoc2VhcmNoZXIsIG51bWJlck9mUGF0aHNTZWFyY2hlZCkge1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IG51bWJlck9mUGF0aHNTZWFyY2hlZEZvclNlYXJjaGVyLmdldChzZWFyY2hlcilcbiAgICAgICAgaWYgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgdG90YWxOdW1iZXJPZlBhdGhzU2VhcmNoZWQgLT0gb2xkVmFsdWVcbiAgICAgICAgfVxuICAgICAgICBudW1iZXJPZlBhdGhzU2VhcmNoZWRGb3JTZWFyY2hlci5zZXQoc2VhcmNoZXIsIG51bWJlck9mUGF0aHNTZWFyY2hlZClcbiAgICAgICAgdG90YWxOdW1iZXJPZlBhdGhzU2VhcmNoZWQgKz0gbnVtYmVyT2ZQYXRoc1NlYXJjaGVkXG4gICAgICAgIHJldHVybiBvblBhdGhzU2VhcmNoZWRPcHRpb24odG90YWxOdW1iZXJPZlBhdGhzU2VhcmNoZWQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uUGF0aHNTZWFyY2hlZCA9IGZ1bmN0aW9uICgpIHt9XG4gICAgfVxuXG4gICAgLy8gS2ljayBvZmYgYWxsIG9mIHRoZSBzZWFyY2hlcyBhbmQgdW5pZnkgdGhlbSBpbnRvIG9uZSBQcm9taXNlLlxuICAgIGNvbnN0IGFsbFNlYXJjaGVzID0gW11cbiAgICBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyLmZvckVhY2goKGRpcmVjdG9yaWVzLCBzZWFyY2hlcikgPT4ge1xuICAgICAgY29uc3Qgc2VhcmNoT3B0aW9ucyA9IHtcbiAgICAgICAgaW5jbHVzaW9uczogb3B0aW9ucy5wYXRocyB8fCBbXSxcbiAgICAgICAgaW5jbHVkZUhpZGRlbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZVZjc0lnbm9yZXM6IHRoaXMuY29uZmlnLmdldCgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJyksXG4gICAgICAgIGV4Y2x1c2lvbnM6IHRoaXMuY29uZmlnLmdldCgnY29yZS5pZ25vcmVkTmFtZXMnKSxcbiAgICAgICAgZm9sbG93OiB0aGlzLmNvbmZpZy5nZXQoJ2NvcmUuZm9sbG93U3ltbGlua3MnKSxcbiAgICAgICAgbGVhZGluZ0NvbnRleHRMaW5lQ291bnQ6IG9wdGlvbnMubGVhZGluZ0NvbnRleHRMaW5lQ291bnQgfHwgMCxcbiAgICAgICAgdHJhaWxpbmdDb250ZXh0TGluZUNvdW50OiBvcHRpb25zLnRyYWlsaW5nQ29udGV4dExpbmVDb3VudCB8fCAwLFxuICAgICAgICBkaWRNYXRjaDogcmVzdWx0ID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMucHJvamVjdC5pc1BhdGhNb2RpZmllZChyZXN1bHQuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3IocmVzdWx0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlkRXJyb3IgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yKG51bGwsIGVycm9yKVxuICAgICAgICB9LFxuICAgICAgICBkaWRTZWFyY2hQYXRocyAoY291bnQpIHtcbiAgICAgICAgICByZXR1cm4gb25QYXRoc1NlYXJjaGVkKHNlYXJjaGVyLCBjb3VudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgZGlyZWN0b3J5U2VhcmNoZXIgPSBzZWFyY2hlci5zZWFyY2goZGlyZWN0b3JpZXMsIHJlZ2V4LCBzZWFyY2hPcHRpb25zKVxuICAgICAgYWxsU2VhcmNoZXMucHVzaChkaXJlY3RvcnlTZWFyY2hlcilcbiAgICB9KVxuICAgIGNvbnN0IHNlYXJjaFByb21pc2UgPSBQcm9taXNlLmFsbChhbGxTZWFyY2hlcylcblxuICAgIGZvciAobGV0IGJ1ZmZlciBvZiB0aGlzLnByb2plY3QuZ2V0QnVmZmVycygpKSB7XG4gICAgICBpZiAoYnVmZmVyLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGJ1ZmZlci5nZXRQYXRoKClcbiAgICAgICAgaWYgKCF0aGlzLnByb2plY3QuY29udGFpbnMoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdXG4gICAgICAgIGJ1ZmZlci5zY2FuKHJlZ2V4LCBtYXRjaCA9PiBtYXRjaGVzLnB1c2gobWF0Y2gpKVxuICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaXRlcmF0b3Ioe2ZpbGVQYXRoLCBtYXRjaGVzfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgUHJvbWlzZSB0aGF0IGlzIHJldHVybmVkIHRvIHRoZSBjbGllbnQgaXMgY2FuY2VsYWJsZS4gVG8gYmUgY29uc2lzdGVudFxuICAgIC8vIHdpdGggdGhlIGV4aXN0aW5nIGJlaGF2aW9yLCBpbnN0ZWFkIG9mIGNhbmNlbCgpIHJlamVjdGluZyB0aGUgcHJvbWlzZSwgaXQgc2hvdWxkXG4gICAgLy8gcmVzb2x2ZSBpdCB3aXRoIHRoZSBzcGVjaWFsIHZhbHVlICdjYW5jZWxsZWQnLiBBdCBsZWFzdCB0aGUgYnVpbHQtaW4gZmluZC1hbmQtcmVwbGFjZVxuICAgIC8vIHBhY2thZ2UgcmVsaWVzIG9uIHRoaXMgYmVoYXZpb3IuXG4gICAgbGV0IGlzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICBjb25zdCBjYW5jZWxsYWJsZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvblN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc0NhbmNlbGxlZCkge1xuICAgICAgICAgIHJlc29sdmUoJ2NhbmNlbGxlZCcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9uRmFpbHVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvbWlzZSBvZiBhbGxTZWFyY2hlcykgeyBwcm9taXNlLmNhbmNlbCgpIH1cbiAgICAgICAgcmVqZWN0KClcbiAgICAgIH1cblxuICAgICAgc2VhcmNoUHJvbWlzZS50aGVuKG9uU3VjY2Vzcywgb25GYWlsdXJlKVxuICAgIH0pXG4gICAgY2FuY2VsbGFibGVQcm9taXNlLmNhbmNlbCA9ICgpID0+IHtcbiAgICAgIGlzQ2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgLy8gTm90ZSB0aGF0IGNhbmNlbGxpbmcgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFsbFNlYXJjaGVzIHdpbGwgY2F1c2UgYWxsIG9mIHRoZSBzZWFyY2hlc1xuICAgICAgLy8gdG8gcmVzb2x2ZSwgd2hpY2ggY2F1c2VzIHNlYXJjaFByb21pc2UgdG8gcmVzb2x2ZSwgd2hpY2ggaXMgdWx0aW1hdGVseSB3aGF0IGNhdXNlc1xuICAgICAgLy8gY2FuY2VsbGFibGVQcm9taXNlIHRvIHJlc29sdmUuXG4gICAgICBhbGxTZWFyY2hlcy5tYXAoKHByb21pc2UpID0+IHByb21pc2UuY2FuY2VsKCkpXG4gICAgfVxuXG4gICAgLy8gQWx0aG91Z2ggdGhpcyBtZXRob2QgY2xhaW1zIHRvIHJldHVybiBhIGBQcm9taXNlYCwgdGhlIGBSZXN1bHRzUGFuZVZpZXcub25TZWFyY2goKWBcbiAgICAvLyBtZXRob2QgaW4gdGhlIGZpbmQtYW5kLXJlcGxhY2UgcGFja2FnZSBleHBlY3RzIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgdG8gaGF2ZSBhXG4gICAgLy8gYGRvbmUoKWAgbWV0aG9kLiBJbmNsdWRlIGEgZG9uZSgpIG1ldGhvZCB1bnRpbCBmaW5kLWFuZC1yZXBsYWNlIGNhbiBiZSB1cGRhdGVkLlxuICAgIGNhbmNlbGxhYmxlUHJvbWlzZS5kb25lID0gb25TdWNjZXNzT3JGYWlsdXJlID0+IHtcbiAgICAgIGNhbmNlbGxhYmxlUHJvbWlzZS50aGVuKG9uU3VjY2Vzc09yRmFpbHVyZSwgb25TdWNjZXNzT3JGYWlsdXJlKVxuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsbGFibGVQcm9taXNlXG4gIH1cblxuICAvLyBQdWJsaWM6IFBlcmZvcm1zIGEgcmVwbGFjZSBhY3Jvc3MgYWxsIHRoZSBzcGVjaWZpZWQgZmlsZXMgaW4gdGhlIHByb2plY3QuXG4gIC8vXG4gIC8vICogYHJlZ2V4YCBBIHtSZWdFeHB9IHRvIHNlYXJjaCB3aXRoLlxuICAvLyAqIGByZXBsYWNlbWVudFRleHRgIHtTdHJpbmd9IHRvIHJlcGxhY2UgYWxsIG1hdGNoZXMgb2YgcmVnZXggd2l0aC5cbiAgLy8gKiBgZmlsZVBhdGhzYCBBbiB7QXJyYXl9IG9mIGZpbGUgcGF0aCBzdHJpbmdzIHRvIHJ1biB0aGUgcmVwbGFjZSBvbi5cbiAgLy8gKiBgaXRlcmF0b3JgIEEge0Z1bmN0aW9ufSBjYWxsYmFjayBvbiBlYWNoIGZpbGUgd2l0aCByZXBsYWNlbWVudHM6XG4gIC8vICAgKiBgb3B0aW9uc2Age09iamVjdH0gd2l0aCBrZXlzIGBmaWxlUGF0aGAgYW5kIGByZXBsYWNlbWVudHNgLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1Byb21pc2V9LlxuICByZXBsYWNlIChyZWdleCwgcmVwbGFjZW1lbnRUZXh0LCBmaWxlUGF0aHMsIGl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBidWZmZXJcbiAgICAgIGNvbnN0IG9wZW5QYXRocyA9IHRoaXMucHJvamVjdC5nZXRCdWZmZXJzKCkubWFwKGJ1ZmZlciA9PiBidWZmZXIuZ2V0UGF0aCgpKVxuICAgICAgY29uc3Qgb3V0T2ZQcm9jZXNzUGF0aHMgPSBfLmRpZmZlcmVuY2UoZmlsZVBhdGhzLCBvcGVuUGF0aHMpXG5cbiAgICAgIGxldCBpblByb2Nlc3NGaW5pc2hlZCA9ICFvcGVuUGF0aHMubGVuZ3RoXG4gICAgICBsZXQgb3V0T2ZQcm9jZXNzRmluaXNoZWQgPSAhb3V0T2ZQcm9jZXNzUGF0aHMubGVuZ3RoXG4gICAgICBjb25zdCBjaGVja0ZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgICBpZiAob3V0T2ZQcm9jZXNzRmluaXNoZWQgJiYgaW5Qcm9jZXNzRmluaXNoZWQpIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW91dE9mUHJvY2Vzc0ZpbmlzaGVkLmxlbmd0aCkge1xuICAgICAgICBsZXQgZmxhZ3MgPSAnZydcbiAgICAgICAgaWYgKHJlZ2V4Lmlnbm9yZUNhc2UpIHsgZmxhZ3MgKz0gJ2knIH1cblxuICAgICAgICBjb25zdCB0YXNrID0gVGFzay5vbmNlKFxuICAgICAgICAgIHJlcXVpcmUucmVzb2x2ZSgnLi9yZXBsYWNlLWhhbmRsZXInKSxcbiAgICAgICAgICBvdXRPZlByb2Nlc3NQYXRocyxcbiAgICAgICAgICByZWdleC5zb3VyY2UsXG4gICAgICAgICAgZmxhZ3MsXG4gICAgICAgICAgcmVwbGFjZW1lbnRUZXh0LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIG91dE9mUHJvY2Vzc0ZpbmlzaGVkID0gdHJ1ZVxuICAgICAgICAgICAgY2hlY2tGaW5pc2hlZCgpXG4gICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICAgICAgdGFzay5vbigncmVwbGFjZTpwYXRoLXJlcGxhY2VkJywgaXRlcmF0b3IpXG4gICAgICAgIHRhc2sub24oJ3JlcGxhY2U6ZmlsZS1lcnJvcicsIGVycm9yID0+IHsgaXRlcmF0b3IobnVsbCwgZXJyb3IpIH0pXG4gICAgICB9XG5cbiAgICAgIGZvciAoYnVmZmVyIG9mIHRoaXMucHJvamVjdC5nZXRCdWZmZXJzKCkpIHtcbiAgICAgICAgaWYgKCFmaWxlUGF0aHMuaW5jbHVkZXMoYnVmZmVyLmdldFBhdGgoKSkpIHsgY29udGludWUgfVxuICAgICAgICBjb25zdCByZXBsYWNlbWVudHMgPSBidWZmZXIucmVwbGFjZShyZWdleCwgcmVwbGFjZW1lbnRUZXh0LCBpdGVyYXRvcilcbiAgICAgICAgaWYgKHJlcGxhY2VtZW50cykge1xuICAgICAgICAgIGl0ZXJhdG9yKHtmaWxlUGF0aDogYnVmZmVyLmdldFBhdGgoKSwgcmVwbGFjZW1lbnRzfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpblByb2Nlc3NGaW5pc2hlZCA9IHRydWVcbiAgICAgIGNoZWNrRmluaXNoZWQoKVxuICAgIH0pXG4gIH1cblxuICBjaGVja291dEhlYWRSZXZpc2lvbiAoZWRpdG9yKSB7XG4gICAgaWYgKGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgIGNvbnN0IGNoZWNrb3V0SGVhZCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KG5ldyBEaXJlY3RvcnkoZWRpdG9yLmdldERpcmVjdG9yeVBhdGgoKSkpXG4gICAgICAgICAgLnRoZW4ocmVwb3NpdG9yeSA9PiByZXBvc2l0b3J5ICYmIHJlcG9zaXRvcnkuY2hlY2tvdXRIZWFkRm9yRWRpdG9yKGVkaXRvcikpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXQoJ2VkaXRvci5jb25maXJtQ2hlY2tvdXRIZWFkUmV2aXNpb24nKSkge1xuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0NvbmZpcm0gQ2hlY2tvdXQgSEVBRCBSZXZpc2lvbicsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRpc2NhcmQgYWxsIGNoYW5nZXMgdG8gXCIke2VkaXRvci5nZXRGaWxlTmFtZSgpfVwiIHNpbmNlIHRoZSBsYXN0IEdpdCBjb21taXQ/YCxcbiAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICBPSzogY2hlY2tvdXRIZWFkLFxuICAgICAgICAgICAgQ2FuY2VsOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrb3V0SGVhZCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuICB9XG59XG4iXX0=