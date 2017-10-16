(function() {
  var CompositeDisposable, debounce, defer, sample;

  CompositeDisposable = require("atom").CompositeDisposable;

  debounce = require("lodash.debounce");

  defer = require("lodash.defer");

  sample = require("lodash.sample");

  module.exports = {
    subscriptions: null,
    conf: [],
    isEnable: false,
    currentStreak: 0,
    level: 0,
    maxStreakReached: false,
    setPluginManager: function(pluginManager) {
      return this.pluginManager = pluginManager;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.comboMode." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    enable: function() {
      this.isEnable = true;
      return this.initConfigSubscribers();
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('exclamationEvery');
      this.observe('activationThreshold');
      this.observe('exclamationTexts');
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:reset-max-combo": (function(_this) {
          return function() {
            return _this.resetMaxStreak();
          };
        })(this)
      }));
    },
    reset: function() {
      var ref, ref1;
      return (ref = this.container) != null ? (ref1 = ref.parentNode) != null ? ref1.removeChild(this.container) : void 0 : void 0;
    },
    destroy: function() {
      var ref, ref1, ref2, ref3;
      this.isEnable = false;
      this.reset();
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.container = null;
      if ((ref1 = this.debouncedEndStreak) != null) {
        ref1.cancel();
      }
      this.debouncedEndStreak = null;
      if ((ref2 = this.streakTimeoutObserver) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.opacityObserver) != null) {
        ref3.dispose();
      }
      this.currentStreak = 0;
      this.level = 0;
      return this.maxStreakReached = false;
    },
    createElement: function(name, parent) {
      this.element = document.createElement("div");
      this.element.classList.add(name);
      if (parent) {
        parent.appendChild(this.element);
      }
      return this.element;
    },
    setup: function(editorElement) {
      var leftTimeout, ref, ref1;
      if (!this.container) {
        this.maxStreak = this.getMaxStreak();
        this.container = this.createElement("streak-container");
        this.container.classList.add("combo-zero");
        this.title = this.createElement("title", this.container);
        this.title.textContent = "Combo";
        this.max = this.createElement("max", this.container);
        this.max.textContent = "Max " + this.maxStreak;
        this.counter = this.createElement("counter", this.container);
        this.bar = this.createElement("bar", this.container);
        this.exclamations = this.createElement("exclamations", this.container);
        if ((ref = this.streakTimeoutObserver) != null) {
          ref.dispose();
        }
        this.streakTimeoutObserver = atom.config.observe('activate-power-mode.comboMode.streakTimeout', (function(_this) {
          return function(value) {
            var ref1;
            _this.streakTimeout = value * 1000;
            _this.endStreak();
            if ((ref1 = _this.debouncedEndStreak) != null) {
              ref1.cancel();
            }
            return _this.debouncedEndStreak = debounce(_this.endStreak.bind(_this), _this.streakTimeout);
          };
        })(this));
        if ((ref1 = this.opacityObserver) != null) {
          ref1.dispose();
        }
        this.opacityObserver = atom.config.observe('activate-power-mode.comboMode.opacity', (function(_this) {
          return function(value) {
            var ref2;
            return (ref2 = _this.container) != null ? ref2.style.opacity = value : void 0;
          };
        })(this));
      }
      this.exclamations.innerHTML = '';
      editorElement.querySelector(".scroll-view").appendChild(this.container);
      if (this.currentStreak) {
        leftTimeout = this.streakTimeout - (performance.now() - this.lastStreak);
        this.refreshStreakBar(leftTimeout);
      }
      return this.renderStreak();
    },
    resetCounter: function() {
      if (this.currentStreak === 0) {
        return;
      }
      this.showExclamation("" + (-this.currentStreak), 'down', false);
      return this.endStreak();
    },
    modifyStreak: function(n) {
      var oldStreak;
      if (this.currentStreak === 0 && n < 0) {
        return;
      }
      this.lastStreak = performance.now();
      this.debouncedEndStreak();
      if (n > 0) {
        n = n * (this.level + 1);
      }
      oldStreak = this.currentStreak;
      this.currentStreak += n;
      if (this.currentStreak < 0) {
        this.currentStreak = 0;
      }
      if (n > 0) {
        this.streakIncreased(n);
      }
      if (n < 0) {
        this.streakDecreased(n);
      }
      if (this.currentStreak === 0) {
        this.endStreak();
      } else {
        this.refreshStreakBar();
      }
      this.renderStreak();
      if (oldStreak === 0 && n > 0) {
        return this.pluginManager.runOnComboStartStreak();
      }
    },
    streakIncreased: function(n) {
      this.container.classList.remove("combo-zero");
      if (this.currentStreak > this.maxStreak) {
        this.increaseMaxStreak();
      }
      if (this.checkLevel()) {
        return;
      }
      if (this.currentStreak % this.conf['exclamationEvery'] === 0) {
        return this.showExclamation();
      } else {
        return this.showExclamation("+" + n, 'up', false);
      }
    },
    streakDecreased: function(n) {
      this.showExclamation("" + n, 'down', false);
      this.checkLevel();
      if (this.currentStreak === 0) {
        return this.container.classList.add("combo-zero");
      }
    },
    checkLevel: function() {
      var i, j, len, level, ref, threshold;
      level = 0;
      ref = this.conf['activationThreshold'];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        threshold = ref[i];
        if (this.currentStreak < threshold) {
          break;
        }
        level++;
      }
      if (level !== this.level) {
        this.container.classList.remove("level-" + this.level);
        this.container.classList.add("level-" + level);
        this.showExclamation((level + 1) + "x", 'level', false);
        this.pluginManager.runOnComboLevelChange(level, this.level);
        this.level = level;
        return true;
      }
    },
    getLevel: function() {
      return this.level;
    },
    endStreak: function() {
      this.currentStreak = 0;
      this.maxStreakReached = false;
      this.container.classList.add("combo-zero");
      this.container.classList.remove("level-" + this.level);
      this.level = 0;
      this.container.classList.add("level-" + this.level);
      this.renderStreak();
      this.refreshStreakBar(0);
      return this.pluginManager.runOnComboEndStreak();
    },
    renderStreak: function() {
      this.counter.textContent = this.currentStreak;
      this.counter.classList.remove("bump");
      return defer((function(_this) {
        return function() {
          return _this.counter.classList.add("bump");
        };
      })(this));
    },
    refreshStreakBar: function(leftTimeout) {
      var scale;
      if (leftTimeout == null) {
        leftTimeout = this.streakTimeout;
      }
      scale = leftTimeout / this.streakTimeout;
      this.bar.style.transition = "none";
      this.bar.style.transform = "scaleX(" + scale + ")";
      return setTimeout((function(_this) {
        return function() {
          _this.bar.style.transform = "";
          return _this.bar.style.transition = "transform " + leftTimeout + "ms linear";
        };
      })(this), 100);
    },
    showExclamation: function(text, type, trigger) {
      var exclamation;
      if (text == null) {
        text = null;
      }
      if (type == null) {
        type = 'message';
      }
      if (trigger == null) {
        trigger = true;
      }
      exclamation = document.createElement("span");
      exclamation.classList.add("exclamation");
      exclamation.classList.add(type);
      if (text === null) {
        text = sample(this.conf['exclamationTexts']);
      }
      exclamation.textContent = text;
      this.exclamations.appendChild(exclamation);
      setTimeout((function(_this) {
        return function() {
          if (exclamation.parentNode === _this.exclamations) {
            return _this.exclamations.removeChild(exclamation);
          }
        };
      })(this), 2000);
      if (trigger) {
        return this.pluginManager.runOnComboExclamation(text);
      }
    },
    getMaxStreak: function() {
      var maxStreak;
      maxStreak = localStorage.getItem("activate-power-mode.maxStreak");
      if (maxStreak === null) {
        maxStreak = 0;
      }
      return maxStreak;
    },
    increaseMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", this.currentStreak);
      this.maxStreak = this.currentStreak;
      this.max.textContent = "Max " + this.maxStreak;
      if (this.maxStreakReached === false) {
        this.showExclamation("NEW MAX!!!", 'max-combo', false);
        this.pluginManager.runOnComboMaxStreak(this.maxStreak);
      }
      return this.maxStreakReached = true;
    },
    resetMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", 0);
      this.maxStreakReached = false;
      this.maxStreak = 0;
      if (this.max) {
        return this.max.textContent = "Max 0";
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbWJvLXJlbmRlcmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsSUFBQSxFQUFNLEVBRE47SUFFQSxRQUFBLEVBQVUsS0FGVjtJQUdBLGFBQUEsRUFBZSxDQUhmO0lBSUEsS0FBQSxFQUFPLENBSlA7SUFLQSxnQkFBQSxFQUFrQixLQUxsQjtJQU9BLGdCQUFBLEVBQWtCLFNBQUMsYUFBRDthQUNoQixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQURELENBUGxCO0lBVUEsT0FBQSxFQUFTLFNBQUMsR0FBRDthQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FDakIsZ0NBQUEsR0FBaUMsR0FEaEIsRUFDdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQ3RDLEtBQUMsQ0FBQSxJQUFLLENBQUEsR0FBQSxDQUFOLEdBQWE7UUFEeUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHZCLENBQW5CO0lBRE8sQ0FWVDtJQWdCQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxRQUFELEdBQVk7YUFDWixJQUFDLENBQUEscUJBQUQsQ0FBQTtJQUZNLENBaEJSO0lBb0JBLHFCQUFBLEVBQXVCLFNBQUE7TUFDckIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsT0FBRCxDQUFTLGtCQUFUO01BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxxQkFBVDtNQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsa0JBQVQ7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLHFDQUFBLEVBQXVDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGNBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QztPQURpQixDQUFuQjtJQUxxQixDQXBCdkI7SUE0QkEsS0FBQSxFQUFPLFNBQUE7QUFDTCxVQUFBO29GQUFzQixDQUFFLFdBQXhCLENBQW9DLElBQUMsQ0FBQSxTQUFyQztJQURLLENBNUJQO0lBK0JBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsS0FBRCxDQUFBOztXQUNjLENBQUUsT0FBaEIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhOztZQUNNLENBQUUsTUFBckIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7O1lBQ0EsQ0FBRSxPQUF4QixDQUFBOzs7WUFDZ0IsQ0FBRSxPQUFsQixDQUFBOztNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxLQUFELEdBQVM7YUFDVCxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFYYixDQS9CVDtJQTRDQSxhQUFBLEVBQWUsU0FBQyxJQUFELEVBQU8sTUFBUDtNQUNiLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixJQUF2QjtNQUNBLElBQStCLE1BQS9CO1FBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsSUFBQyxDQUFBLE9BQXBCLEVBQUE7O2FBQ0EsSUFBQyxDQUFBO0lBSlksQ0E1Q2Y7SUFrREEsS0FBQSxFQUFPLFNBQUMsYUFBRDtBQUNMLFVBQUE7TUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLFNBQVI7UUFDRSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxZQUFELENBQUE7UUFDYixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxhQUFELENBQWUsa0JBQWY7UUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFyQixDQUF5QixZQUF6QjtRQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLGFBQUQsQ0FBZSxPQUFmLEVBQXdCLElBQUMsQ0FBQSxTQUF6QjtRQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBUCxHQUFxQjtRQUNyQixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxhQUFELENBQWUsS0FBZixFQUFzQixJQUFDLENBQUEsU0FBdkI7UUFDUCxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUIsTUFBQSxHQUFPLElBQUMsQ0FBQTtRQUMzQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxhQUFELENBQWUsU0FBZixFQUEwQixJQUFDLENBQUEsU0FBM0I7UUFDWCxJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxhQUFELENBQWUsS0FBZixFQUFzQixJQUFDLENBQUEsU0FBdkI7UUFDUCxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsYUFBRCxDQUFlLGNBQWYsRUFBK0IsSUFBQyxDQUFBLFNBQWhDOzthQUVNLENBQUUsT0FBeEIsQ0FBQTs7UUFDQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDZDQUFwQixFQUFtRSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7QUFDMUYsZ0JBQUE7WUFBQSxLQUFDLENBQUEsYUFBRCxHQUFpQixLQUFBLEdBQVE7WUFDekIsS0FBQyxDQUFBLFNBQUQsQ0FBQTs7a0JBQ21CLENBQUUsTUFBckIsQ0FBQTs7bUJBQ0EsS0FBQyxDQUFBLGtCQUFELEdBQXNCLFFBQUEsQ0FBUyxLQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBVCxFQUFnQyxLQUFDLENBQUEsYUFBakM7VUFKb0U7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5FOztjQU1ULENBQUUsT0FBbEIsQ0FBQTs7UUFDQSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsdUNBQXBCLEVBQTZELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDtBQUM5RSxnQkFBQTswREFBVSxDQUFFLEtBQUssQ0FBQyxPQUFsQixHQUE0QjtVQURrRDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0QsRUFwQnJCOztNQXVCQSxJQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsR0FBMEI7TUFFMUIsYUFBYSxDQUFDLGFBQWQsQ0FBNEIsY0FBNUIsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxJQUFDLENBQUEsU0FBekQ7TUFFQSxJQUFHLElBQUMsQ0FBQSxhQUFKO1FBQ0UsV0FBQSxHQUFjLElBQUMsQ0FBQSxhQUFELEdBQWlCLENBQUMsV0FBVyxDQUFDLEdBQVosQ0FBQSxDQUFBLEdBQW9CLElBQUMsQ0FBQSxVQUF0QjtRQUMvQixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsV0FBbEIsRUFGRjs7YUFJQSxJQUFDLENBQUEsWUFBRCxDQUFBO0lBaENLLENBbERQO0lBb0ZBLFlBQUEsRUFBYyxTQUFBO01BQ1osSUFBVSxJQUFDLENBQUEsYUFBRCxLQUFrQixDQUE1QjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsRUFBQSxHQUFFLENBQUMsQ0FBQyxJQUFDLENBQUEsYUFBSCxDQUFuQixFQUF1QyxNQUF2QyxFQUErQyxLQUEvQzthQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFKWSxDQXBGZDtJQTBGQSxZQUFBLEVBQWMsU0FBQyxDQUFEO0FBQ1osVUFBQTtNQUFBLElBQVUsSUFBQyxDQUFBLGFBQUQsS0FBa0IsQ0FBbEIsSUFBd0IsQ0FBQSxHQUFJLENBQXRDO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLFdBQVcsQ0FBQyxHQUFaLENBQUE7TUFDZCxJQUFDLENBQUEsa0JBQUQsQ0FBQTtNQUVBLElBQXdCLENBQUEsR0FBSSxDQUE1QjtRQUFBLENBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQVYsRUFBUjs7TUFFQSxTQUFBLEdBQVksSUFBQyxDQUFBO01BQ2IsSUFBQyxDQUFBLGFBQUQsSUFBa0I7TUFDbEIsSUFBc0IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBdkM7UUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQUFqQjs7TUFFQSxJQUFzQixDQUFBLEdBQUksQ0FBMUI7UUFBQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFqQixFQUFBOztNQUNBLElBQXNCLENBQUEsR0FBSSxDQUExQjtRQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQWpCLEVBQUE7O01BRUEsSUFBRyxJQUFDLENBQUEsYUFBRCxLQUFrQixDQUFyQjtRQUNFLElBQUMsQ0FBQSxTQUFELENBQUEsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUhGOztNQUlBLElBQUMsQ0FBQSxZQUFELENBQUE7TUFFQSxJQUFHLFNBQUEsS0FBYSxDQUFiLElBQW1CLENBQUEsR0FBSSxDQUExQjtlQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMscUJBQWYsQ0FBQSxFQURGOztJQXJCWSxDQTFGZDtJQWtIQSxlQUFBLEVBQWlCLFNBQUMsQ0FBRDtNQUNmLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQXJCLENBQTRCLFlBQTVCO01BQ0EsSUFBRyxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsU0FBckI7UUFDRSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQURGOztNQUdBLElBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFWO0FBQUEsZUFBQTs7TUFFQSxJQUFHLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxJQUFLLENBQUEsa0JBQUEsQ0FBdkIsS0FBOEMsQ0FBakQ7ZUFDRSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsR0FBQSxHQUFJLENBQXJCLEVBQTBCLElBQTFCLEVBQWdDLEtBQWhDLEVBSEY7O0lBUGUsQ0FsSGpCO0lBOEhBLGVBQUEsRUFBaUIsU0FBQyxDQUFEO01BQ2YsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsRUFBQSxHQUFHLENBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLEtBQWpDO01BRUEsSUFBQyxDQUFBLFVBQUQsQ0FBQTtNQUNBLElBQUcsSUFBQyxDQUFBLGFBQUQsS0FBa0IsQ0FBckI7ZUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFyQixDQUF5QixZQUF6QixFQURGOztJQUplLENBOUhqQjtJQXFJQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxLQUFBLEdBQVE7QUFDUjtBQUFBLFdBQUEsNkNBQUE7O1FBQ0UsSUFBUyxJQUFDLENBQUEsYUFBRCxHQUFpQixTQUExQjtBQUFBLGdCQUFBOztRQUNBLEtBQUE7QUFGRjtNQUlBLElBQUcsS0FBQSxLQUFTLElBQUMsQ0FBQSxLQUFiO1FBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBckIsQ0FBNEIsUUFBQSxHQUFTLElBQUMsQ0FBQSxLQUF0QztRQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLFFBQUEsR0FBUyxLQUFsQztRQUNBLElBQUMsQ0FBQSxlQUFELENBQW1CLENBQUMsS0FBQSxHQUFNLENBQVAsQ0FBQSxHQUFTLEdBQTVCLEVBQWdDLE9BQWhDLEVBQXlDLEtBQXpDO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxxQkFBZixDQUFxQyxLQUFyQyxFQUE0QyxJQUFDLENBQUEsS0FBN0M7UUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0FBQ1QsZUFBTyxLQU5UOztJQU5VLENBcklaO0lBbUpBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBO0lBRE8sQ0FuSlY7SUFzSkEsU0FBQSxFQUFXLFNBQUE7TUFDVCxJQUFDLENBQUEsYUFBRCxHQUFpQjtNQUNqQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFDcEIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsWUFBekI7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFyQixDQUE0QixRQUFBLEdBQVMsSUFBQyxDQUFBLEtBQXRDO01BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLFFBQUEsR0FBUyxJQUFDLENBQUEsS0FBbkM7TUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQWxCO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFBO0lBVFMsQ0F0Slg7SUFpS0EsWUFBQSxFQUFjLFNBQUE7TUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsR0FBdUIsSUFBQyxDQUFBO01BQ3hCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQW5CLENBQTBCLE1BQTFCO2FBRUEsS0FBQSxDQUFNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSixLQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixNQUF2QjtRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFOO0lBSlksQ0FqS2Q7SUF3S0EsZ0JBQUEsRUFBa0IsU0FBQyxXQUFEO0FBQ2hCLFVBQUE7O1FBRGlCLGNBQWMsSUFBQyxDQUFBOztNQUNoQyxLQUFBLEdBQVEsV0FBQSxHQUFjLElBQUMsQ0FBQTtNQUN2QixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFYLEdBQXdCO01BQ3hCLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVgsR0FBdUIsU0FBQSxHQUFVLEtBQVYsR0FBZ0I7YUFFdkMsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNULEtBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVgsR0FBdUI7aUJBQ3ZCLEtBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVgsR0FBd0IsWUFBQSxHQUFhLFdBQWIsR0FBeUI7UUFGeEM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFHRSxHQUhGO0lBTGdCLENBeEtsQjtJQWtMQSxlQUFBLEVBQWlCLFNBQUMsSUFBRCxFQUFjLElBQWQsRUFBZ0MsT0FBaEM7QUFDZixVQUFBOztRQURnQixPQUFPOzs7UUFBTSxPQUFPOzs7UUFBVyxVQUFVOztNQUN6RCxXQUFBLEdBQWMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFDZCxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQXRCLENBQTBCLGFBQTFCO01BQ0EsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUF0QixDQUEwQixJQUExQjtNQUNBLElBQTJDLElBQUEsS0FBUSxJQUFuRDtRQUFBLElBQUEsR0FBTyxNQUFBLENBQU8sSUFBQyxDQUFBLElBQUssQ0FBQSxrQkFBQSxDQUFiLEVBQVA7O01BQ0EsV0FBVyxDQUFDLFdBQVosR0FBMEI7TUFFMUIsSUFBQyxDQUFBLFlBQVksQ0FBQyxXQUFkLENBQTBCLFdBQTFCO01BQ0EsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNULElBQUcsV0FBVyxDQUFDLFVBQVosS0FBMEIsS0FBQyxDQUFBLFlBQTlCO21CQUNFLEtBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixXQUExQixFQURGOztRQURTO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBR0UsSUFIRjtNQUtBLElBQUcsT0FBSDtlQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMscUJBQWYsQ0FBcUMsSUFBckMsRUFERjs7SUFiZSxDQWxMakI7SUFrTUEsWUFBQSxFQUFjLFNBQUE7QUFDWixVQUFBO01BQUEsU0FBQSxHQUFZLFlBQVksQ0FBQyxPQUFiLENBQXFCLCtCQUFyQjtNQUNaLElBQWlCLFNBQUEsS0FBYSxJQUE5QjtRQUFBLFNBQUEsR0FBWSxFQUFaOzthQUNBO0lBSFksQ0FsTWQ7SUF1TUEsaUJBQUEsRUFBbUIsU0FBQTtNQUNqQixZQUFZLENBQUMsT0FBYixDQUFxQiwrQkFBckIsRUFBc0QsSUFBQyxDQUFBLGFBQXZEO01BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUE7TUFDZCxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUIsTUFBQSxHQUFPLElBQUMsQ0FBQTtNQUMzQixJQUFHLElBQUMsQ0FBQSxnQkFBRCxLQUFxQixLQUF4QjtRQUNFLElBQUMsQ0FBQSxlQUFELENBQWlCLFlBQWpCLEVBQStCLFdBQS9CLEVBQTRDLEtBQTVDO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxJQUFDLENBQUEsU0FBcEMsRUFGRjs7YUFHQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFQSCxDQXZNbkI7SUFnTkEsY0FBQSxFQUFnQixTQUFBO01BQ2QsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsK0JBQXJCLEVBQXNELENBQXREO01BQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CO01BQ3BCLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFHLElBQUMsQ0FBQSxHQUFKO2VBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CLFFBRHJCOztJQUpjLENBaE5oQjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcbmRlYm91bmNlID0gcmVxdWlyZSBcImxvZGFzaC5kZWJvdW5jZVwiXG5kZWZlciA9IHJlcXVpcmUgXCJsb2Rhc2guZGVmZXJcIlxuc2FtcGxlID0gcmVxdWlyZSBcImxvZGFzaC5zYW1wbGVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgY29uZjogW11cbiAgaXNFbmFibGU6IGZhbHNlXG4gIGN1cnJlbnRTdHJlYWs6IDBcbiAgbGV2ZWw6IDBcbiAgbWF4U3RyZWFrUmVhY2hlZDogZmFsc2VcblxuICBzZXRQbHVnaW5NYW5hZ2VyOiAocGx1Z2luTWFuYWdlcikgLT5cbiAgICBAcGx1Z2luTWFuYWdlciA9IHBsdWdpbk1hbmFnZXJcblxuICBvYnNlcnZlOiAoa2V5KSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLmNvbWJvTW9kZS4je2tleX1cIiwgKHZhbHVlKSA9PlxuICAgICAgICBAY29uZltrZXldID0gdmFsdWVcbiAgICApXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBpc0VuYWJsZSA9IHRydWVcbiAgICBAaW5pdENvbmZpZ1N1YnNjcmliZXJzKClcblxuICBpbml0Q29uZmlnU3Vic2NyaWJlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvYnNlcnZlICdleGNsYW1hdGlvbkV2ZXJ5J1xuICAgIEBvYnNlcnZlICdhY3RpdmF0aW9uVGhyZXNob2xkJ1xuICAgIEBvYnNlcnZlICdleGNsYW1hdGlvblRleHRzJ1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGU6cmVzZXQtbWF4LWNvbWJvXCI6ID0+IEByZXNldE1heFN0cmVhaygpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQGNvbnRhaW5lcj8ucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQgQGNvbnRhaW5lclxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGlzRW5hYmxlID0gZmFsc2VcbiAgICBAcmVzZXQoKVxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAY29udGFpbmVyID0gbnVsbFxuICAgIEBkZWJvdW5jZWRFbmRTdHJlYWs/LmNhbmNlbCgpXG4gICAgQGRlYm91bmNlZEVuZFN0cmVhayA9IG51bGxcbiAgICBAc3RyZWFrVGltZW91dE9ic2VydmVyPy5kaXNwb3NlKClcbiAgICBAb3BhY2l0eU9ic2VydmVyPy5kaXNwb3NlKClcbiAgICBAY3VycmVudFN0cmVhayA9IDBcbiAgICBAbGV2ZWwgPSAwXG4gICAgQG1heFN0cmVha1JlYWNoZWQgPSBmYWxzZVxuXG4gIGNyZWF0ZUVsZW1lbnQ6IChuYW1lLCBwYXJlbnQpLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJkaXZcIlxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQgbmFtZVxuICAgIHBhcmVudC5hcHBlbmRDaGlsZCBAZWxlbWVudCBpZiBwYXJlbnRcbiAgICBAZWxlbWVudFxuXG4gIHNldHVwOiAoZWRpdG9yRWxlbWVudCkgLT5cbiAgICBpZiBub3QgQGNvbnRhaW5lclxuICAgICAgQG1heFN0cmVhayA9IEBnZXRNYXhTdHJlYWsoKVxuICAgICAgQGNvbnRhaW5lciA9IEBjcmVhdGVFbGVtZW50IFwic3RyZWFrLWNvbnRhaW5lclwiXG4gICAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJjb21iby16ZXJvXCJcbiAgICAgIEB0aXRsZSA9IEBjcmVhdGVFbGVtZW50IFwidGl0bGVcIiwgQGNvbnRhaW5lclxuICAgICAgQHRpdGxlLnRleHRDb250ZW50ID0gXCJDb21ib1wiXG4gICAgICBAbWF4ID0gQGNyZWF0ZUVsZW1lbnQgXCJtYXhcIiwgQGNvbnRhaW5lclxuICAgICAgQG1heC50ZXh0Q29udGVudCA9IFwiTWF4ICN7QG1heFN0cmVha31cIlxuICAgICAgQGNvdW50ZXIgPSBAY3JlYXRlRWxlbWVudCBcImNvdW50ZXJcIiwgQGNvbnRhaW5lclxuICAgICAgQGJhciA9IEBjcmVhdGVFbGVtZW50IFwiYmFyXCIsIEBjb250YWluZXJcbiAgICAgIEBleGNsYW1hdGlvbnMgPSBAY3JlYXRlRWxlbWVudCBcImV4Y2xhbWF0aW9uc1wiLCBAY29udGFpbmVyXG5cbiAgICAgIEBzdHJlYWtUaW1lb3V0T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgICAgQHN0cmVha1RpbWVvdXRPYnNlcnZlciA9IGF0b20uY29uZmlnLm9ic2VydmUgJ2FjdGl2YXRlLXBvd2VyLW1vZGUuY29tYm9Nb2RlLnN0cmVha1RpbWVvdXQnLCAodmFsdWUpID0+XG4gICAgICAgIEBzdHJlYWtUaW1lb3V0ID0gdmFsdWUgKiAxMDAwXG4gICAgICAgIEBlbmRTdHJlYWsoKVxuICAgICAgICBAZGVib3VuY2VkRW5kU3RyZWFrPy5jYW5jZWwoKVxuICAgICAgICBAZGVib3VuY2VkRW5kU3RyZWFrID0gZGVib3VuY2UgQGVuZFN0cmVhay5iaW5kKHRoaXMpLCBAc3RyZWFrVGltZW91dFxuXG4gICAgICBAb3BhY2l0eU9ic2VydmVyPy5kaXNwb3NlKClcbiAgICAgIEBvcGFjaXR5T2JzZXJ2ZXIgPSBhdG9tLmNvbmZpZy5vYnNlcnZlICdhY3RpdmF0ZS1wb3dlci1tb2RlLmNvbWJvTW9kZS5vcGFjaXR5JywgKHZhbHVlKSA9PlxuICAgICAgICBAY29udGFpbmVyPy5zdHlsZS5vcGFjaXR5ID0gdmFsdWVcblxuICAgIEBleGNsYW1hdGlvbnMuaW5uZXJIVE1MID0gJydcblxuICAgIGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zY3JvbGwtdmlld1wiKS5hcHBlbmRDaGlsZCBAY29udGFpbmVyXG5cbiAgICBpZiBAY3VycmVudFN0cmVha1xuICAgICAgbGVmdFRpbWVvdXQgPSBAc3RyZWFrVGltZW91dCAtIChwZXJmb3JtYW5jZS5ub3coKSAtIEBsYXN0U3RyZWFrKVxuICAgICAgQHJlZnJlc2hTdHJlYWtCYXIgbGVmdFRpbWVvdXRcblxuICAgIEByZW5kZXJTdHJlYWsoKVxuXG4gIHJlc2V0Q291bnRlcjogLT5cbiAgICByZXR1cm4gaWYgQGN1cnJlbnRTdHJlYWsgaXMgMFxuXG4gICAgQHNob3dFeGNsYW1hdGlvbiBcIiN7LUBjdXJyZW50U3RyZWFrfVwiLCAnZG93bicsIGZhbHNlXG4gICAgQGVuZFN0cmVhaygpXG5cbiAgbW9kaWZ5U3RyZWFrOiAobikgLT5cbiAgICByZXR1cm4gaWYgQGN1cnJlbnRTdHJlYWsgaXMgMCBhbmQgbiA8IDBcblxuICAgIEBsYXN0U3RyZWFrID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBAZGVib3VuY2VkRW5kU3RyZWFrKClcblxuICAgIG4gPSBuICogKEBsZXZlbCArIDEpIGlmIG4gPiAwXG5cbiAgICBvbGRTdHJlYWsgPSBAY3VycmVudFN0cmVha1xuICAgIEBjdXJyZW50U3RyZWFrICs9IG5cbiAgICBAY3VycmVudFN0cmVhayA9IDAgaWYgQGN1cnJlbnRTdHJlYWsgPCAwXG5cbiAgICBAc3RyZWFrSW5jcmVhc2VkIG4gaWYgbiA+IDBcbiAgICBAc3RyZWFrRGVjcmVhc2VkIG4gaWYgbiA8IDBcblxuICAgIGlmIEBjdXJyZW50U3RyZWFrIGlzIDBcbiAgICAgIEBlbmRTdHJlYWsoKVxuICAgIGVsc2VcbiAgICAgIEByZWZyZXNoU3RyZWFrQmFyKClcbiAgICBAcmVuZGVyU3RyZWFrKClcblxuICAgIGlmIG9sZFN0cmVhayBpcyAwIGFuZCBuID4gMFxuICAgICAgQHBsdWdpbk1hbmFnZXIucnVuT25Db21ib1N0YXJ0U3RyZWFrKClcblxuICBzdHJlYWtJbmNyZWFzZWQ6IChuKSAtPlxuICAgIEBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSBcImNvbWJvLXplcm9cIlxuICAgIGlmIEBjdXJyZW50U3RyZWFrID4gQG1heFN0cmVha1xuICAgICAgQGluY3JlYXNlTWF4U3RyZWFrKClcblxuICAgIHJldHVybiBpZiBAY2hlY2tMZXZlbCgpXG5cbiAgICBpZiBAY3VycmVudFN0cmVhayAlIEBjb25mWydleGNsYW1hdGlvbkV2ZXJ5J10gaXMgMFxuICAgICAgQHNob3dFeGNsYW1hdGlvbigpXG4gICAgZWxzZVxuICAgICAgQHNob3dFeGNsYW1hdGlvbiBcIisje259XCIsICd1cCcsIGZhbHNlXG5cbiAgc3RyZWFrRGVjcmVhc2VkOiAobikgLT5cbiAgICBAc2hvd0V4Y2xhbWF0aW9uIFwiI3tufVwiLCAnZG93bicsIGZhbHNlXG5cbiAgICBAY2hlY2tMZXZlbCgpXG4gICAgaWYgQGN1cnJlbnRTdHJlYWsgPT0gMFxuICAgICAgQGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkIFwiY29tYm8temVyb1wiXG5cbiAgY2hlY2tMZXZlbDogLT5cbiAgICBsZXZlbCA9IDBcbiAgICBmb3IgdGhyZXNob2xkLCBpIGluIEBjb25mWydhY3RpdmF0aW9uVGhyZXNob2xkJ11cbiAgICAgIGJyZWFrIGlmIEBjdXJyZW50U3RyZWFrIDwgdGhyZXNob2xkXG4gICAgICBsZXZlbCsrXG5cbiAgICBpZiBsZXZlbCAhPSBAbGV2ZWxcbiAgICAgIEBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSBcImxldmVsLSN7QGxldmVsfVwiXG4gICAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJsZXZlbC0je2xldmVsfVwiXG4gICAgICBAc2hvd0V4Y2xhbWF0aW9uIFwiI3tsZXZlbCsxfXhcIiwgJ2xldmVsJywgZmFsc2VcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ29tYm9MZXZlbENoYW5nZShsZXZlbCwgQGxldmVsKVxuICAgICAgQGxldmVsID0gbGV2ZWxcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgZ2V0TGV2ZWw6IC0+XG4gICAgQGxldmVsXG5cbiAgZW5kU3RyZWFrOiAtPlxuICAgIEBjdXJyZW50U3RyZWFrID0gMFxuICAgIEBtYXhTdHJlYWtSZWFjaGVkID0gZmFsc2VcbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJjb21iby16ZXJvXCJcbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUgXCJsZXZlbC0je0BsZXZlbH1cIlxuICAgIEBsZXZlbCA9IDBcbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJsZXZlbC0je0BsZXZlbH1cIlxuICAgIEByZW5kZXJTdHJlYWsoKVxuICAgIEByZWZyZXNoU3RyZWFrQmFyKDApXG4gICAgQHBsdWdpbk1hbmFnZXIucnVuT25Db21ib0VuZFN0cmVhaygpXG5cbiAgcmVuZGVyU3RyZWFrOiAtPlxuICAgIEBjb3VudGVyLnRleHRDb250ZW50ID0gQGN1cnJlbnRTdHJlYWtcbiAgICBAY291bnRlci5jbGFzc0xpc3QucmVtb3ZlIFwiYnVtcFwiXG5cbiAgICBkZWZlciA9PlxuICAgICAgQGNvdW50ZXIuY2xhc3NMaXN0LmFkZCBcImJ1bXBcIlxuXG4gIHJlZnJlc2hTdHJlYWtCYXI6IChsZWZ0VGltZW91dCA9IEBzdHJlYWtUaW1lb3V0KSAtPlxuICAgIHNjYWxlID0gbGVmdFRpbWVvdXQgLyBAc3RyZWFrVGltZW91dFxuICAgIEBiYXIuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiXG4gICAgQGJhci5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlWCgje3NjYWxlfSlcIlxuXG4gICAgc2V0VGltZW91dCA9PlxuICAgICAgQGJhci5zdHlsZS50cmFuc2Zvcm0gPSBcIlwiXG4gICAgICBAYmFyLnN0eWxlLnRyYW5zaXRpb24gPSBcInRyYW5zZm9ybSAje2xlZnRUaW1lb3V0fW1zIGxpbmVhclwiXG4gICAgLCAxMDBcblxuICBzaG93RXhjbGFtYXRpb246ICh0ZXh0ID0gbnVsbCwgdHlwZSA9ICdtZXNzYWdlJywgdHJpZ2dlciA9IHRydWUpIC0+XG4gICAgZXhjbGFtYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwic3BhblwiXG4gICAgZXhjbGFtYXRpb24uY2xhc3NMaXN0LmFkZCBcImV4Y2xhbWF0aW9uXCJcbiAgICBleGNsYW1hdGlvbi5jbGFzc0xpc3QuYWRkIHR5cGVcbiAgICB0ZXh0ID0gc2FtcGxlIEBjb25mWydleGNsYW1hdGlvblRleHRzJ10gaWYgdGV4dCBpcyBudWxsXG4gICAgZXhjbGFtYXRpb24udGV4dENvbnRlbnQgPSB0ZXh0XG5cbiAgICBAZXhjbGFtYXRpb25zLmFwcGVuZENoaWxkIGV4Y2xhbWF0aW9uXG4gICAgc2V0VGltZW91dCA9PlxuICAgICAgaWYgZXhjbGFtYXRpb24ucGFyZW50Tm9kZSBpcyBAZXhjbGFtYXRpb25zXG4gICAgICAgIEBleGNsYW1hdGlvbnMucmVtb3ZlQ2hpbGQgZXhjbGFtYXRpb25cbiAgICAsIDIwMDBcblxuICAgIGlmIHRyaWdnZXJcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ29tYm9FeGNsYW1hdGlvbih0ZXh0KVxuXG4gIGdldE1heFN0cmVhazogLT5cbiAgICBtYXhTdHJlYWsgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSBcImFjdGl2YXRlLXBvd2VyLW1vZGUubWF4U3RyZWFrXCJcbiAgICBtYXhTdHJlYWsgPSAwIGlmIG1heFN0cmVhayBpcyBudWxsXG4gICAgbWF4U3RyZWFrXG5cbiAgaW5jcmVhc2VNYXhTdHJlYWs6IC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gXCJhY3RpdmF0ZS1wb3dlci1tb2RlLm1heFN0cmVha1wiLCBAY3VycmVudFN0cmVha1xuICAgIEBtYXhTdHJlYWsgPSBAY3VycmVudFN0cmVha1xuICAgIEBtYXgudGV4dENvbnRlbnQgPSBcIk1heCAje0BtYXhTdHJlYWt9XCJcbiAgICBpZiBAbWF4U3RyZWFrUmVhY2hlZCBpcyBmYWxzZVxuICAgICAgQHNob3dFeGNsYW1hdGlvbiBcIk5FVyBNQVghISFcIiwgJ21heC1jb21ibycsIGZhbHNlXG4gICAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNvbWJvTWF4U3RyZWFrKEBtYXhTdHJlYWspXG4gICAgQG1heFN0cmVha1JlYWNoZWQgPSB0cnVlXG5cbiAgcmVzZXRNYXhTdHJlYWs6IC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gXCJhY3RpdmF0ZS1wb3dlci1tb2RlLm1heFN0cmVha1wiLCAwXG4gICAgQG1heFN0cmVha1JlYWNoZWQgPSBmYWxzZVxuICAgIEBtYXhTdHJlYWsgPSAwXG4gICAgaWYgQG1heFxuICAgICAgQG1heC50ZXh0Q29udGVudCA9IFwiTWF4IDBcIlxuIl19
