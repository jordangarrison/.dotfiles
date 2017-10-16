(function() {
  var CompositeDisposable, colorHelper, random;

  CompositeDisposable = require("atom").CompositeDisposable;

  random = require("lodash.random");

  colorHelper = require("./color-helper");

  module.exports = {
    colorHelper: colorHelper,
    subscriptions: null,
    conf: [],
    phaseStep: 0,
    setEffectRegistry: function(effectRegistry) {
      return this.effectRegistry = effectRegistry;
    },
    enable: function() {
      this.initConfigSubscribers();
      return this.colorHelper.init();
    },
    init: function() {
      this.effectRegistry.effect.init();
      return this.animationOn();
    },
    resetCanvas: function() {
      var ref;
      this.animationOff();
      if ((ref = this.canvas) != null) {
        ref.style.display = "none";
      }
      this.editor = null;
      return this.editorElement = null;
    },
    animationOff: function() {
      cancelAnimationFrame(this.animationFrame);
      return this.animationFrame = null;
    },
    animationOn: function() {
      return this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    },
    destroy: function() {
      var ref, ref1, ref2, ref3;
      this.resetCanvas();
      if ((ref = this.effectRegistry) != null) {
        ref.effect.disable();
      }
      if ((ref1 = this.canvas) != null) {
        ref1.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      if ((ref2 = this.subscriptions) != null) {
        ref2.dispose();
      }
      return (ref3 = this.colorHelper) != null ? ref3.disable() : void 0;
    },
    setupCanvas: function(editor, editorElement) {
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.classList.add("power-mode-canvas");
        this.initConfigSubscribers();
      }
      this.scrollView = editorElement.querySelector(".scroll-view");
      this.editorContents = editorElement.querySelector(".editor-contents--private");
      this.editorContents.appendChild(this.canvas);
      this.canvas.style.display = "block";
      this.editorElement = editorElement;
      this.editor = editor;
      this.updateCanvasDimesions();
      this.calculateOffsets();
      window.addEventListener('resize', (function(_this) {
        return function() {
          _this.updateCanvasDimesions();
          return _this.calculateOffsets();
        };
      })(this));
      return this.init();
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.particles." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('spawnCount.min');
      this.observe('spawnCount.max');
      this.observe('totalCount.max');
      this.observe('size.min');
      return this.observe('size.max');
    },
    spawn: function(cursor, screenPosition, input, size) {
      var colorGenerate, colorGenerator, position, randomSize;
      position = this.calculatePositions(screenPosition);
      colorGenerator = this.colorHelper.generateColors(cursor, this.editorElement);
      randomSize = (function(_this) {
        return function() {
          return _this.randomSize(size);
        };
      })(this);
      colorGenerate = function() {
        return colorGenerator.next().value;
      };
      return this.effectRegistry.effect.spawn(position, colorGenerate, input, randomSize, this.conf);
    },
    randomSize: function(size) {
      var max, min;
      min = this.conf['size.min'];
      max = this.conf['size.max'];
      if (size === 'max') {
        return random(max - min + 2, max + 2, true);
      } else if (size === 'min') {
        return random(min - 1, max - min, true);
      } else {
        return random(min, max, true);
      }
    },
    calculatePositions: function(screenPosition) {
      var left, ref, top;
      ref = this.editorElement.pixelPositionForScreenPosition(screenPosition), left = ref.left, top = ref.top;
      return {
        left: left + this.offsetLeft - this.editorElement.getScrollLeft(),
        top: top + this.offsetTop - this.editorElement.getScrollTop() + this.editor.getLineHeightInPixels() / 2
      };
    },
    calculateOffsets: function() {
      if (!this.scrollView) {
        return;
      }
      this.offsetLeft = this.scrollView.offsetLeft;
      return this.offsetTop = this.scrollView.offsetTop;
    },
    updateCanvasDimesions: function() {
      if (!this.editorElement) {
        return;
      }
      this.canvas.width = this.editorElement.offsetWidth;
      this.canvas.height = this.editorElement.offsetHeight;
      this.canvas.style.width = this.editorElement.width;
      return this.canvas.style.height = this.editorElement.height;
    },
    animate: function() {
      this.animationOn();
      this.effectRegistry.effect.update();
      if (this.phaseStep === 0) {
        this.canvas.width = this.canvas.width;
        this.effectRegistry.effect.animate(this.context);
      }
      this.phaseStep++;
      if (this.phaseStep > 2) {
        return this.phaseStep = 0;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NhbnZhcy1yZW5kZXJlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSOztFQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFdBQUEsRUFBYSxXQUFiO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxJQUFBLEVBQU0sRUFGTjtJQUdBLFNBQUEsRUFBVyxDQUhYO0lBS0EsaUJBQUEsRUFBbUIsU0FBQyxjQUFEO2FBQ2pCLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBREQsQ0FMbkI7SUFRQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxxQkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUE7SUFGTSxDQVJSO0lBWUEsSUFBQSxFQUFNLFNBQUE7TUFDSixJQUFDLENBQUEsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUF2QixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUZJLENBWk47SUFnQkEsV0FBQSxFQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLFlBQUQsQ0FBQTs7V0FDTyxDQUFFLEtBQUssQ0FBQyxPQUFmLEdBQXlCOztNQUN6QixJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFKTixDQWhCYjtJQXNCQSxZQUFBLEVBQWMsU0FBQTtNQUNaLG9CQUFBLENBQXFCLElBQUMsQ0FBQSxjQUF0QjthQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBRk4sQ0F0QmQ7SUEwQkEsV0FBQSxFQUFhLFNBQUE7YUFDWCxJQUFDLENB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c0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxucmFuZG9tID0gcmVxdWlyZSBcImxvZGFzaC5yYW5kb21cIlxuY29sb3JIZWxwZXIgPSByZXF1aXJlIFwiLi9jb2xvci1oZWxwZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbG9ySGVscGVyOiBjb2xvckhlbHBlclxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGNvbmY6IFtdXG4gIHBoYXNlU3RlcDogMFxuXG4gIHNldEVmZmVjdFJlZ2lzdHJ5OiAoZWZmZWN0UmVnaXN0cnkpIC0+XG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gZWZmZWN0UmVnaXN0cnlcblxuICBlbmFibGU6IC0+XG4gICAgQGluaXRDb25maWdTdWJzY3JpYmVycygpXG4gICAgQGNvbG9ySGVscGVyLmluaXQoKVxuXG4gIGluaXQ6IC0+XG4gICAgQGVmZmVjdFJlZ2lzdHJ5LmVmZmVjdC5pbml0KClcbiAgICBAYW5pbWF0aW9uT24oKVxuXG4gIHJlc2V0Q2FudmFzOiAtPlxuICAgIEBhbmltYXRpb25PZmYoKVxuICAgIEBjYW52YXM/LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgIEBlZGl0b3IgPSBudWxsXG4gICAgQGVkaXRvckVsZW1lbnQgPSBudWxsXG5cbiAgYW5pbWF0aW9uT2ZmOiAtPlxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKEBhbmltYXRpb25GcmFtZSlcbiAgICBAYW5pbWF0aW9uRnJhbWUgPSBudWxsXG5cbiAgYW5pbWF0aW9uT246IC0+XG4gICAgQGFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBhbmltYXRlLmJpbmQodGhpcylcblxuICBkZXN0cm95OiAtPlxuICAgIEByZXNldENhbnZhcygpXG4gICAgQGVmZmVjdFJlZ2lzdHJ5Py5lZmZlY3QuZGlzYWJsZSgpXG4gICAgQGNhbnZhcz8ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCBAY2FudmFzXG4gICAgQGNhbnZhcyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGNvbG9ySGVscGVyPy5kaXNhYmxlKClcblxuICBzZXR1cENhbnZhczogKGVkaXRvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBpZiBub3QgQGNhbnZhc1xuICAgICAgQGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJjYW52YXNcIlxuICAgICAgQGNvbnRleHQgPSBAY2FudmFzLmdldENvbnRleHQgXCIyZFwiXG4gICAgICBAY2FudmFzLmNsYXNzTGlzdC5hZGQgXCJwb3dlci1tb2RlLWNhbnZhc1wiXG4gICAgICBAaW5pdENvbmZpZ1N1YnNjcmliZXJzKClcblxuICAgIEBzY3JvbGxWaWV3ID0gZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjcm9sbC12aWV3XCIpXG4gICAgQGVkaXRvckNvbnRlbnRzID0gZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRvci1jb250ZW50cy0tcHJpdmF0ZVwiKVxuICAgIEBlZGl0b3JDb250ZW50cy5hcHBlbmRDaGlsZCBAY2FudmFzXG4gICAgQGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgQGVkaXRvckVsZW1lbnQgPSBlZGl0b3JFbGVtZW50XG4gICAgQGVkaXRvciA9IGVkaXRvclxuICAgIEB1cGRhdGVDYW52YXNEaW1lc2lvbnMoKVxuICAgIEBjYWxjdWxhdGVPZmZzZXRzKClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgPT5cbiAgICAgIEB1cGRhdGVDYW52YXNEaW1lc2lvbnMoKVxuICAgICAgQGNhbGN1bGF0ZU9mZnNldHMoKVxuXG4gICAgQGluaXQoKVxuXG4gIG9ic2VydmU6IChrZXkpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLnBhcnRpY2xlcy4je2tleX1cIiwgKHZhbHVlKSA9PlxuICAgICAgQGNvbmZba2V5XSA9IHZhbHVlXG5cbiAgaW5pdENvbmZpZ1N1YnNjcmliZXJzOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb2JzZXJ2ZSAnc3Bhd25Db3VudC5taW4nXG4gICAgQG9ic2VydmUgJ3NwYXduQ291bnQubWF4J1xuICAgIEBvYnNlcnZlICd0b3RhbENvdW50Lm1heCdcbiAgICBAb2JzZXJ2ZSAnc2l6ZS5taW4nXG4gICAgQG9ic2VydmUgJ3NpemUubWF4J1xuXG4gIHNwYXduOiAoY3Vyc29yLCBzY3JlZW5Qb3NpdGlvbiwgaW5wdXQsIHNpemUpIC0+XG4gICAgcG9zaXRpb24gPSBAY2FsY3VsYXRlUG9zaXRpb25zIHNjcmVlblBvc2l0aW9uXG4gICAgY29sb3JHZW5lcmF0b3IgPSBAY29sb3JIZWxwZXIuZ2VuZXJhdGVDb2xvcnMgY3Vyc29yLCBAZWRpdG9yRWxlbWVudFxuICAgIHJhbmRvbVNpemUgPSA9PiBAcmFuZG9tU2l6ZShzaXplKVxuICAgIGNvbG9yR2VuZXJhdGUgPSAtPiBjb2xvckdlbmVyYXRvci5uZXh0KCkudmFsdWVcblxuICAgIEBlZmZlY3RSZWdpc3RyeS5lZmZlY3Quc3Bhd24gcG9zaXRpb24sIGNvbG9yR2VuZXJhdGUsIGlucHV0LCByYW5kb21TaXplLCBAY29uZlxuXG4gIHJhbmRvbVNpemU6IChzaXplKSAtPlxuICAgIG1pbiA9IEBjb25mWydzaXplLm1pbiddXG4gICAgbWF4ID0gQGNvbmZbJ3NpemUubWF4J11cblxuICAgIGlmIHNpemUgaXMgJ21heCdcbiAgICAgIHJhbmRvbSBtYXggLSBtaW4gKyAyLCBtYXggKyAyLCB0cnVlXG4gICAgZWxzZSBpZiBzaXplIGlzICdtaW4nXG4gICAgICByYW5kb20gbWluIC0gMSwgbWF4IC0gbWluLCB0cnVlXG4gICAgZWxzZVxuICAgICAgcmFuZG9tIG1pbiwgbWF4LCB0cnVlXG5cbiAgY2FsY3VsYXRlUG9zaXRpb25zOiAoc2NyZWVuUG9zaXRpb24pIC0+XG4gICAge2xlZnQsIHRvcH0gPSBAZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24gc2NyZWVuUG9zaXRpb25cbiAgICBsZWZ0OiBsZWZ0ICsgQG9mZnNldExlZnQgLSBAZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgICB0b3A6IHRvcCArIEBvZmZzZXRUb3AgLSBAZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKSArIEBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgLyAyXG5cbiAgY2FsY3VsYXRlT2Zmc2V0czogLT5cbiAgICByZXR1cm4gaWYgbm90IEBzY3JvbGxWaWV3XG4gICAgQG9mZnNldExlZnQgPSBAc2Nyb2xsVmlldy5vZmZzZXRMZWZ0XG4gICAgQG9mZnNldFRvcCA9IEBzY3JvbGxWaWV3Lm9mZnNldFRvcFxuXG4gIHVwZGF0ZUNhbnZhc0RpbWVzaW9uczogLT5cbiAgICByZXR1cm4gaWYgbm90IEBlZGl0b3JFbGVtZW50XG4gICAgQGNhbnZhcy53aWR0aCA9IEBlZGl0b3JFbGVtZW50Lm9mZnNldFdpZHRoXG4gICAgQGNhbnZhcy5oZWlnaHQgPSBAZWRpdG9yRWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgICBAY2FudmFzLnN0eWxlLndpZHRoID0gQGVkaXRvckVsZW1lbnQud2lkdGhcbiAgICBAY2FudmFzLnN0eWxlLmhlaWdodCA9IEBlZGl0b3JFbGVtZW50LmhlaWdodFxuXG4gIGFuaW1hdGU6IC0+XG4gICAgQGFuaW1hdGlvbk9uKClcbiAgICBAZWZmZWN0UmVnaXN0cnkuZWZmZWN0LnVwZGF0ZSgpXG4gICAgaWYgQHBoYXNlU3RlcCBpcyAwXG4gICAgICBAY2FudmFzLndpZHRoID0gQGNhbnZhcy53aWR0aFxuICAgICAgQGVmZmVjdFJlZ2lzdHJ5LmVmZmVjdC5hbmltYXRlKEBjb250ZXh0KVxuXG4gICAgQHBoYXNlU3RlcCsrXG4gICAgQHBoYXNlU3RlcCA9IDAgaWYgQHBoYXNlU3RlcCA+IDJcbiJdfQ==
