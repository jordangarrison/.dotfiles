(function() {
  var Api, ComboApi, ParticlesEffect, audioPlayer, canvasRenderer, comboMode, comboRenderer, defaultEffect, defaultFlow, editorRegistry, playAudio, powerCanvas, screenShake, screenShaker, switcher, userFileFlow;

  Api = require("./api");

  ParticlesEffect = require("./effect/particles");

  comboRenderer = require("./combo-renderer");

  canvasRenderer = require("./canvas-renderer");

  editorRegistry = require("./service/editor-registry");

  ComboApi = require("./service/combo-api");

  screenShaker = require("./service/screen-shaker");

  audioPlayer = require("./service/audio-player");

  screenShake = require("./plugin/screen-shake");

  playAudio = require("./plugin/play-audio");

  powerCanvas = require("./plugin/power-canvas");

  comboMode = require("./plugin/combo-mode");

  defaultEffect = require("./effect/default");

  defaultFlow = require("./flow/default");

  userFileFlow = require("./flow/user-file");

  switcher = require("./switcher");

  module.exports = {
    comboRenderer: comboRenderer,
    canvasRenderer: canvasRenderer,
    switcher: switcher,
    defaultEffect: defaultEffect,
    defaultFlow: defaultFlow,
    userFileFlow: userFileFlow,
    editorRegistry: editorRegistry,
    screenShaker: screenShaker,
    audioPlayer: audioPlayer,
    screenShake: screenShake,
    playAudio: playAudio,
    comboMode: comboMode,
    powerCanvas: powerCanvas,
    init: function(config, pluginRegistry, flowRegistry, effectRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.flowRegistry = flowRegistry;
      this.effectRegistry = effectRegistry;
      this.initApi();
      pluginRegistry.init(config, this.api);
      this.initCoreFlows();
      this.initCoreEffects();
      return this.initCorePlugins();
    },
    initApi: function() {
      this.comboRenderer.setPluginManager(this);
      this.comboApi = new ComboApi(this.comboRenderer);
      this.canvasRenderer.setEffectRegistry(this.effectRegistry);
      this.screenShaker.init();
      this.audioPlayer.init();
      return this.api = new Api(this.editorRegistry, this.comboApi, this.screenShaker, this.audioPlayer);
    },
    initCorePlugins: function() {
      this.comboMode.setComboRenderer(this.comboRenderer);
      this.powerCanvas.setCanvasRenderer(this.canvasRenderer);
      this.pluginRegistry.addCorePlugin('particles', this.powerCanvas);
      this.pluginRegistry.addCorePlugin('comboMode', this.comboMode);
      this.pluginRegistry.addPlugin('screenShake', this.screenShake);
      return this.pluginRegistry.addPlugin('playAudio', this.playAudio);
    },
    initCoreFlows: function() {
      this.flowRegistry.setDefaultFlow(this.defaultFlow);
      return this.flowRegistry.addFlow('user-file', this.userFileFlow);
    },
    initCoreEffects: function() {
      var effect;
      effect = new ParticlesEffect(defaultEffect);
      return this.effectRegistry.setDefaultEffect(effect);
    },
    enable: function() {
      this.pluginRegistry.enable(this.api);
      this.flowRegistry.enable();
      return this.effectRegistry.enable();
    },
    disable: function() {
      this.screenShaker.disable();
      this.audioPlayer.disable();
      this.flowRegistry.disable();
      this.effectRegistry.disable();
      this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.disable === "function" ? plugin.disable() : void 0;
      });
      return this.pluginRegistry.disable();
    },
    runOnChangePane: function(editor, editorElement) {
      if (editor == null) {
        editor = null;
      }
      if (editorElement == null) {
        editorElement = null;
      }
      this.editorRegistry.setEditor(editor);
      this.editorRegistry.setEditorElement(editorElement);
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onChangePane === "function" ? plugin.onChangePane(editor, editorElement) : void 0;
      });
    },
    runOnNewCursor: function(cursor) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onNewCursor === "function" ? plugin.onNewCursor(cursor) : void 0;
      });
    },
    runOnInput: function(cursor, screenPosition, input) {
      this.switcher.reset();
      this.flowRegistry.flow.handle(input, this.switcher, this.comboApi.getLevel());
      return this.pluginRegistry.onEnabled((function(_this) {
        return function(code, plugin) {
          if (_this.switcher.isOff(code)) {
            return true;
          }
          return typeof plugin.onInput === "function" ? plugin.onInput(cursor, screenPosition, input, _this.switcher.getData(code)) : void 0;
        };
      })(this));
    },
    runOnComboStartStreak: function() {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboStartStreak === "function" ? plugin.onComboStartStreak() : void 0;
      });
    },
    runOnComboLevelChange: function(newLvl, oldLvl) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboLevelChange === "function" ? plugin.onComboLevelChange(newLvl, oldLvl) : void 0;
      });
    },
    runOnComboEndStreak: function() {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboEndStreak === "function" ? plugin.onComboEndStreak() : void 0;
      });
    },
    runOnComboExclamation: function(text) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboExclamation === "function" ? plugin.onComboExclamation(text) : void 0;
      });
    },
    runOnComboMaxStreak: function(maxStreak) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboMaxStreak === "function" ? plugin.onComboMaxStreak(maxStreak) : void 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztFQUNOLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSOztFQUNsQixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUjs7RUFDaEIsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUNqQixRQUFBLEdBQVcsT0FBQSxDQUFRLHFCQUFSOztFQUNYLFlBQUEsR0FBZSxPQUFBLENBQVEseUJBQVI7O0VBQ2YsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLHVCQUFSOztFQUNkLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVI7O0VBQ1osV0FBQSxHQUFjLE9BQUEsQ0FBUSx1QkFBUjs7RUFDZCxTQUFBLEdBQVksT0FBQSxDQUFRLHFCQUFSOztFQUNaLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBQ2YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxhQUFBLEVBQWUsYUFBZjtJQUNBLGNBQUEsRUFBZ0IsY0FEaEI7SUFFQSxRQUFBLEVBQVUsUUFGVjtJQUdBLGFBQUEsRUFBZSxhQUhmO0lBSUEsV0FBQSxFQUFhLFdBSmI7SUFLQSxZQUFBLEVBQWMsWUFMZDtJQU1BLGNBQUEsRUFBZ0IsY0FOaEI7SUFPQSxZQUFBLEVBQWMsWUFQZDtJQVFBLFdBQUEsRUFBYSxXQVJiO0lB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QUFBLENBQUEsQ0FBQSxJQUFBLENBREY7SUFKVSxDQTdFWjtJQXVGQSxxQkFBQSxFQUF1QixTQUFBO2FBQ3JCLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FDRSxTQUFDLElBQUQsRUFBTyxNQUFQO2lFQUFrQixNQUFNLENBQUM7TUFBekIsQ0FERjtJQURxQixDQXZGdkI7SUE0RkEscUJBQUEsRUFBdUIsU0FBQyxNQUFELEVBQVMsTUFBVDthQUNyQixJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQ0UsU0FBQyxJQUFELEVBQU8sTUFBUDtpRUFBa0IsTUFBTSxDQUFDLG1CQUFvQixRQUFRO01BQXJELENBREY7SUFEcUIsQ0E1RnZCO0lBaUdBLG1CQUFBLEVBQXFCLFNBQUE7YUFDbkIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUNFLFNBQUMsSUFBRCxFQUFPLE1BQVA7K0RBQWtCLE1BQU0sQ0FBQztNQUF6QixDQURGO0lBRG1CLENBakdyQjtJQXNHQSxxQkFBQSxFQUF1QixTQUFDLElBQUQ7YUFDckIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUNFLFNBQUMsSUFBRCxFQUFPLE1BQVA7aUVBQWtCLE1BQU0sQ0FBQyxtQkFBb0I7TUFBN0MsQ0FERjtJQURxQixDQXRHdkI7SUEyR0EsbUJBQUEsRUFBcUIsU0FBQyxTQUFEO2FBQ25CLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FDRSxTQUFDLElBQUQsRUFBTyxNQUFQOytEQUFrQixNQUFNLENBQUMsaUJBQWtCO01BQTNDLENBREY7SUFEbUIsQ0EzR3JCOztBQWxCRiIsInNvdXJjZXNDb250ZW50IjpbIkFwaSA9IHJlcXVpcmUgXCIuL2FwaVwiXG5QYXJ0aWNsZXNFZmZlY3QgPSByZXF1aXJlIFwiLi9lZmZlY3QvcGFydGljbGVzXCJcbmNvbWJvUmVuZGVyZXIgPSByZXF1aXJlIFwiLi9jb21iby1yZW5kZXJlclwiXG5jYW52YXNSZW5kZXJlciA9IHJlcXVpcmUgXCIuL2NhbnZhcy1yZW5kZXJlclwiXG5lZGl0b3JSZWdpc3RyeSA9IHJlcXVpcmUgXCIuL3NlcnZpY2UvZWRpdG9yLXJlZ2lzdHJ5XCJcbkNvbWJvQXBpID0gcmVxdWlyZSBcIi4vc2VydmljZS9jb21iby1hcGlcIlxuc2NyZWVuU2hha2VyID0gcmVxdWlyZSBcIi4vc2VydmljZS9zY3JlZW4tc2hha2VyXCJcbmF1ZGlvUGxheWVyID0gcmVxdWlyZSBcIi4vc2VydmljZS9hdWRpby1wbGF5ZXJcIlxuc2NyZWVuU2hha2UgPSByZXF1aXJlIFwiLi9wbHVnaW4vc2NyZWVuLXNoYWtlXCJcbnBsYXlBdWRpbyA9IHJlcXVpcmUgXCIuL3BsdWdpbi9wbGF5LWF1ZGlvXCJcbnBvd2VyQ2FudmFzID0gcmVxdWlyZSBcIi4vcGx1Z2luL3Bvd2VyLWNhbnZhc1wiXG5jb21ib01vZGUgPSByZXF1aXJlIFwiLi9wbHVnaW4vY29tYm8tbW9kZVwiXG5kZWZhdWx0RWZmZWN0ID0gcmVxdWlyZSBcIi4vZWZmZWN0L2RlZmF1bHRcIlxuZGVmYXVsdEZsb3cgPSByZXF1aXJlIFwiLi9mbG93L2RlZmF1bHRcIlxudXNlckZpbGVGbG93ID0gcmVxdWlyZSBcIi4vZmxvdy91c2VyLWZpbGVcIlxuc3dpdGNoZXIgPSByZXF1aXJlIFwiLi9zd2l0Y2hlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29tYm9SZW5kZXJlcjogY29tYm9SZW5kZXJlclxuICBjYW52YXNSZW5kZXJlcjogY2FudmFzUmVuZGVyZXJcbiAgc3dpdGNoZXI6IHN3aXRjaGVyXG4gIGRlZmF1bHRFZmZlY3Q6IGRlZmF1bHRFZmZlY3RcbiAgZGVmYXVsdEZsb3c6IGRlZmF1bHRGbG93XG4gIHVzZXJGaWxlRmxvdzogdXNlckZpbGVGbG93XG4gIGVkaXRvclJlZ2lzdHJ5OiBlZGl0b3JSZWdpc3RyeVxuICBzY3JlZW5TaGFrZXI6IHNjcmVlblNoYWtlclxuICBhdWRpb1BsYXllcjogYXVkaW9QbGF5ZXJcbiAgc2NyZWVuU2hha2U6IHNjcmVlblNoYWtlXG4gIHBsYXlBdWRpbzogcGxheUF1ZGlvXG4gIGNvbWJvTW9kZTogY29tYm9Nb2RlXG4gIHBvd2VyQ2FudmFzOiBwb3dlckNhbnZhc1xuXG4gIGluaXQ6IChjb25maWcsIHBsdWdpblJlZ2lzdHJ5LCBmbG93UmVnaXN0cnksIGVmZmVjdFJlZ2lzdHJ5KSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeSA9IHBsdWdpblJlZ2lzdHJ5XG4gICAgQGZsb3dSZWdpc3RyeSA9IGZsb3dSZWdpc3RyeVxuICAgIEBlZmZlY3RSZWdpc3RyeSA9IGVmZmVjdFJlZ2lzdHJ5XG4gICAgQGluaXRBcGkoKVxuICAgIHBsdWdpblJlZ2lzdHJ5LmluaXQgY29uZmlnLCBAYXBpXG4gICAgQGluaXRDb3JlRmxvd3MoKVxuICAgIEBpbml0Q29yZUVmZmVjdHMoKVxuICAgIEBpbml0Q29yZVBsdWdpbnMoKVxuXG4gIGluaXRBcGk6IC0+XG4gICAgQGNvbWJvUmVuZGVyZXIuc2V0UGx1Z2luTWFuYWdlciB0aGlzXG4gICAgQGNvbWJvQXBpID0gbmV3IENvbWJvQXBpKEBjb21ib1JlbmRlcmVyKVxuICAgIEBjYW52YXNSZW5kZXJlci5zZXRFZmZlY3RSZWdpc3RyeSBAZWZmZWN0UmVnaXN0cnlcbiAgICBAc2NyZWVuU2hha2VyLmluaXQoKVxuICAgIEBhdWRpb1BsYXllci5pbml0KClcbiAgICBAYXBpID0gbmV3IEFwaShAZWRpdG9yUmVnaXN0cnksIEBjb21ib0FwaSwgQHNjcmVlblNoYWtlciwgQGF1ZGlvUGxheWVyKVxuXG4gIGluaXRDb3JlUGx1Z2luczogLT5cbiAgICBAY29tYm9Nb2RlLnNldENvbWJvUmVuZGVyZXIgQGNvbWJvUmVuZGVyZXJcbiAgICBAcG93ZXJDYW52YXMuc2V0Q2FudmFzUmVuZGVyZXIgQGNhbnZhc1JlbmRlcmVyXG4gICAgQHBsdWdpblJlZ2lzdHJ5LmFkZENvcmVQbHVnaW4gJ3BhcnRpY2xlcycsIEBwb3dlckNhbnZhc1xuICAgIEBwbHVnaW5SZWdpc3RyeS5hZGRDb3JlUGx1Z2luICdjb21ib01vZGUnLCBAY29tYm9Nb2RlXG4gICAgQHBsdWdpblJlZ2lzdHJ5LmFkZFBsdWdpbiAnc2NyZWVuU2hha2UnLCBAc2NyZWVuU2hha2VcbiAgICBAcGx1Z2luUmVnaXN0cnkuYWRkUGx1Z2luICdwbGF5QXVkaW8nLCBAcGxheUF1ZGlvXG5cbiAgaW5pdENvcmVGbG93czogLT5cbiAgICBAZmxvd1JlZ2lzdHJ5LnNldERlZmF1bHRGbG93IEBkZWZhdWx0Rmxvd1xuICAgIEBmbG93UmVnaXN0cnkuYWRkRmxvdyAndXNlci1maWxlJywgQHVzZXJGaWxlRmxvd1xuXG4gIGluaXRDb3JlRWZmZWN0czogLT5cbiAgICBlZmZlY3QgPSBuZXcgUGFydGljbGVzRWZmZWN0KGRlZmF1bHRFZmZlY3QpXG4gICAgQGVmZmVjdFJlZ2lzdHJ5LnNldERlZmF1bHRFZmZlY3QgZWZmZWN0XG5cbiAgZW5hYmxlOiAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5lbmFibGUgQGFwaVxuICAgIEBmbG93UmVnaXN0cnkuZW5hYmxlKClcbiAgICBAZWZmZWN0UmVnaXN0cnkuZW5hYmxlKClcblxuICBkaXNhYmxlOiAtPlxuICAgIEBzY3JlZW5TaGFrZXIuZGlzYWJsZSgpXG4gICAgQGF1ZGlvUGxheWVyLmRpc2FibGUoKVxuICAgIEBmbG93UmVnaXN0cnkuZGlzYWJsZSgpXG4gICAgQGVmZmVjdFJlZ2lzdHJ5LmRpc2FibGUoKVxuXG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pIC0+IHBsdWdpbi5kaXNhYmxlPygpXG4gICAgKVxuICAgIEBwbHVnaW5SZWdpc3RyeS5kaXNhYmxlKClcblxuICBydW5PbkNoYW5nZVBhbmU6IChlZGl0b3IgPSBudWxsLCBlZGl0b3JFbGVtZW50ID0gbnVsbCkgLT5cbiAgICBAZWRpdG9yUmVnaXN0cnkuc2V0RWRpdG9yIGVkaXRvclxuICAgIEBlZGl0b3JSZWdpc3RyeS5zZXRFZGl0b3JFbGVtZW50IGVkaXRvckVsZW1lbnRcblxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25DaGFuZ2VQYW5lPyhlZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgKVxuXG4gIHJ1bk9uTmV3Q3Vyc29yOiAoY3Vyc29yKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25OZXdDdXJzb3I/KGN1cnNvcilcbiAgICApXG5cbiAgcnVuT25JbnB1dDogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0KSAtPlxuICAgIEBzd2l0Y2hlci5yZXNldCgpXG4gICAgQGZsb3dSZWdpc3RyeS5mbG93LmhhbmRsZSBpbnB1dCwgQHN3aXRjaGVyLCBAY29tYm9BcGkuZ2V0TGV2ZWwoKVxuXG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pID0+XG4gICAgICAgIHJldHVybiB0cnVlIGlmIEBzd2l0Y2hlci5pc09mZiBjb2RlXG4gICAgICAgIHBsdWdpbi5vbklucHV0PyhjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgQHN3aXRjaGVyLmdldERhdGEgY29kZSlcbiAgICApXG5cbiAgcnVuT25Db21ib1N0YXJ0U3RyZWFrOiAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib1N0YXJ0U3RyZWFrPygpXG4gICAgKVxuXG4gIHJ1bk9uQ29tYm9MZXZlbENoYW5nZTogKG5ld0x2bCwgb2xkTHZsKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib0xldmVsQ2hhbmdlPyhuZXdMdmwsIG9sZEx2bClcbiAgICApXG5cbiAgcnVuT25Db21ib0VuZFN0cmVhazogLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLm9uQ29tYm9FbmRTdHJlYWs/KClcbiAgICApXG5cbiAgcnVuT25Db21ib0V4Y2xhbWF0aW9uOiAodGV4dCkgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLm9uQ29tYm9FeGNsYW1hdGlvbj8odGV4dClcbiAgICApXG5cbiAgcnVuT25Db21ib01heFN0cmVhazogKG1heFN0cmVhaykgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLm9uQ29tYm9NYXhTdHJlYWs/KG1heFN0cmVhaylcbiAgICApXG4iXX0=
