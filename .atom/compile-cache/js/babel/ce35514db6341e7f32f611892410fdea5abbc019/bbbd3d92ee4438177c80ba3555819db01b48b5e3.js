Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mappers = require('./mappers');

var _entryfinders = require('./entryfinders');

var _editorTokens = require('./editor-tokens');

var _util = require('./util');

'use babel';

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.selector = '.source.java';
    this.disableForSelector = '.source.java .comment, .source.java .string';
    this.inclusionPriority = 1000;
    this.excludeLowerPriority = true;

    this.editorTokens = new _editorTokens.EditorTokens();
  }

  _createClass(Provider, [{
    key: 'setImportHandler',
    value: function setImportHandler(importHandler) {
      this.importHandler = importHandler;
    }
  }, {
    key: 'setRegistry',
    value: function setRegistry(registry) {
      this.registry = registry;
      this.finders = {
        plain: new _entryfinders.PlainEntryFinder(this.registry, this.editorTokens),
        dot: new _entryfinders.DotEntryFinder(this.registry, this.editorTokens),
        constructor: new _entryfinders.ConstructorEntryFinder(this.registry, this.editorTokens)
      };
    }

    /**
     * Checks if the current prefix is in a dot-chain.
     * e.g. `someClass.method().field`.
     *
     * It will *not* be true if only a plain entry is being input, e.g. `someClass`
     *
     */
  }, {
    key: 'hasDotPrefix',
    value: function hasDotPrefix(editor, bufferPosition) {
      var lineText = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return !!lineText.match(/\.[^(\s]*$/);
    }

    /**
     * Checks if the current prefix is preceded by the keyword `new`.
     *
     * The new prefix will be the word typed after the keyword `new`.
     * For example, typing; `new Class` would return true.
     */
  }, {
    key: 'hasNewPrefix',
    value: function hasNewPrefix(editor, bufferPosition) {
      var lineText = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return !!lineText.match(/new \w*$/);
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var scopeDescriptor = _ref.scopeDescriptor;
      var prefix = _ref.prefix;
      var activatedManually = _ref.activatedManually;

      var entries = [];
      if (!this.registry) {
        // No registry, no completion - even if it would technically be possible for some local fields/methods.
        if (!this.registryWarningDisplayed) {
          atom.notifications.addWarning('No classpath registry for autocompletion found.', {
            description: 'You should install [java-plus](http://atom.io/packages/java-plus) for all Java goodies!',
            dismissable: true
          });
          this.registryWarningDisplayed = true;
        }

        return entries;
      }

      var hasDotPrefix = this.hasDotPrefix(editor, bufferPosition);
      var hasNewPrefix = this.hasNewPrefix(editor, bufferPosition);
      if (hasDotPrefix) {
        /**
         * Dot prefixed, e.g. `something[.something].prefix<cusor>`.
         * This should show members of `something` (Nested classes, Static fields, etc).
         */
        entries = this.finders.dot.get(editor, bufferPosition, prefix);
      } else if (hasNewPrefix) {
        /**
         * Prefix is immediately preceded by the word `new`, eg. `new Prefix<cursor>`
         * This should return public constructors.
         */
        entries = this.finders.constructor.get(editor, bufferPosition, prefix);
      } else if (prefix) {
        /**
         * The default case where a class is plainly typed out, e.g. `Prefix<cursor>
         */
        entries = this.finders.plain.get(editor, bufferPosition, prefix);
      }

      return [].concat.apply([], entries.sort(function (lhs, rhs) {
        return (0, _util.denamespace)(lhs.name).length - (0, _util.denamespace)(rhs.name).length;
      }) // Sort it by name length, so "closest" matches comes first
      .slice(0, 50) // More than 50 suggestions is just silly. Running `mapper` can be slow, thus this limit.
      .map(_mappers.mapToSuggestion));
    }
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion(_ref2) {
      var editor = _ref2.editor;
      var triggerPosition = _ref2.triggerPosition;
      var suggestion = _ref2.suggestion;

      if (!this.importHandler || suggestion.type !== 'class') {
        return;
      }

      this.importHandler(editor, suggestion.klass.name);
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7dUJBRWdDLFdBQVc7OzRCQUM4QixnQkFBZ0I7OzRCQUM1RCxpQkFBaUI7O29CQUNsQixRQUFROztBQUxwQyxXQUFXLENBQUM7O0lBT04sUUFBUTtBQU1ELFdBTlAsUUFBUSxHQU1FOzBCQU5WLFFBQVE7O1NBQ1osUUFBUSxHQUFHLGNBQWM7U0FDekIsa0JBQWtCLEdBQUcsNkNBQTZDO1NBQ2xFLGlCQUFpQixHQUFHLElBQUk7U0FDeEIsb0JBQW9CLEdBQUcsSUFBSTs7QUFHekIsUUFBSSxDQUFDLFlBQVksR0FBRyxnQ0FBa0IsQ0FBQztHQUN4Qzs7ZUFSRyxRQUFROztXQVVJLDBCQUFDLGFBQWEsRUFBRTtBQUM5QixVQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztLQUNwQzs7O1dBRVUscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxPQUFPLEdBQUc7QUFDYixhQUFLLEVBQUUsbUNBQXFCLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUM3RCxXQUFHLEVBQUUsaUNBQW1CLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUN6RCxtQkFBVyxFQUFFLHlDQUEyQixJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7T0FDMUUsQ0FBQztLQUNIOzs7Ozs7Ozs7OztXQVNXLHNCQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUU7QUFDbkMsVUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLGFB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LCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhLW1pbnVzL2xpYi9wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBtYXBUb1N1Z2dlc3Rpb24gfSBmcm9tICcuL21hcHBlcnMnO1xuaW1wb3J0IHsgUGxhaW5FbnRyeUZpbmRlciwgRG90RW50cnlGaW5kZXIsIENvbnN0cnVjdG9yRW50cnlGaW5kZXIgfSBmcm9tICcuL2VudHJ5ZmluZGVycyc7XG5pbXBvcnQgeyBFZGl0b3JUb2tlbnMgfSBmcm9tICcuL2VkaXRvci10b2tlbnMnO1xuaW1wb3J0IHsgZGVuYW1lc3BhY2UgfSBmcm9tICcuL3V0aWwnO1xuXG5jbGFzcyBQcm92aWRlciB7XG4gIHNlbGVjdG9yID0gJy5zb3VyY2UuamF2YSc7XG4gIGRpc2FibGVGb3JTZWxlY3RvciA9ICcuc291cmNlLmphdmEgLmNvbW1lbnQsIC5zb3VyY2UuamF2YSAuc3RyaW5nJztcbiAgaW5jbHVzaW9uUHJpb3JpdHkgPSAxMDAwO1xuICBleGNsdWRlTG93ZXJQcmlvcml0eSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lZGl0b3JUb2tlbnMgPSBuZXcgRWRpdG9yVG9rZW5zKCk7XG4gIH1cblxuICBzZXRJbXBvcnRIYW5kbGVyKGltcG9ydEhhbmRsZXIpIHtcbiAgICB0aGlzLmltcG9ydEhhbmRsZXIgPSBpbXBvcnRIYW5kbGVyO1xuICB9XG5cbiAgc2V0UmVnaXN0cnkocmVnaXN0cnkpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5ID0gcmVnaXN0cnk7XG4gICAgdGhpcy5maW5kZXJzID0ge1xuICAgICAgcGxhaW46IG5ldyBQbGFpbkVudHJ5RmluZGVyKHRoaXMucmVnaXN0cnksIHRoaXMuZWRpdG9yVG9rZW5zKSxcbiAgICAgIGRvdDogbmV3IERvdEVudHJ5RmluZGVyKHRoaXMucmVnaXN0cnksIHRoaXMuZWRpdG9yVG9rZW5zKSxcbiAgICAgIGNvbnN0cnVjdG9yOiBuZXcgQ29uc3RydWN0b3JFbnRyeUZpbmRlcih0aGlzLnJlZ2lzdHJ5LCB0aGlzLmVkaXRvclRva2VucylcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBwcmVmaXggaXMgaW4gYSBkb3QtY2hhaW4uXG4gICAqIGUuZy4gYHNvbWVDbGFzcy5tZXRob2QoKS5maWVsZGAuXG4gICAqXG4gICAqIEl0IHdpbGwgKm5vdCogYmUgdHJ1ZSBpZiBvbmx5IGEgcGxhaW4gZW50cnkgaXMgYmVpbmcgaW5wdXQsIGUuZy4gYHNvbWVDbGFzc2BcbiAgICpcbiAgICovXG4gIGhhc0RvdFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG4gICAgY29uc3QgbGluZVRleHQgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIHJldHVybiAhIWxpbmVUZXh0Lm1hdGNoKC9cXC5bXihcXHNdKiQvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgcHJlZml4IGlzIHByZWNlZGVkIGJ5IHRoZSBrZXl3b3JkIGBuZXdgLlxuICAgKlxuICAgKiBUaGUgbmV3IHByZWZpeCB3aWxsIGJlIHRoZSB3b3JkIHR5cGVkIGFmdGVyIHRoZSBrZXl3b3JkIGBuZXdgLlxuICAgKiBGb3IgZXhhbXBsZSwgdHlwaW5nOyBgbmV3IENsYXNzYCB3b3VsZCByZXR1cm4gdHJ1ZS5cbiAgICovXG4gIGhhc05ld1ByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG4gICAgY29uc3QgbGluZVRleHQgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIHJldHVybiAhIWxpbmVUZXh0Lm1hdGNoKC9uZXcgXFx3KiQvKTtcbiAgfVxuXG4gIGdldFN1Z2dlc3Rpb25zKHsgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXgsIGFjdGl2YXRlZE1hbnVhbGx5IH0pIHtcbiAgICBsZXQgZW50cmllcyA9IFtdO1xuICAgIGlmICghdGhpcy5yZWdpc3RyeSkge1xuICAgICAgLy8gTm8gcmVnaXN0cnksIG5vIGNvbXBsZXRpb24gLSBldmVuIGlmIGl0IHdvdWxkIHRlY2huaWNhbGx5IGJlIHBvc3NpYmxlIGZvciBzb21lIGxvY2FsIGZpZWxkcy9tZXRob2RzLlxuICAgICAgaWYgKCF0aGlzLnJlZ2lzdHJ5V2FybmluZ0Rpc3BsYXllZCkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnTm8gY2xhc3NwYXRoIHJlZ2lzdHJ5IGZvciBhdXRvY29tcGxldGlvbiBmb3VuZC4nLCB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdZb3Ugc2hvdWxkIGluc3RhbGwgW2phdmEtcGx1c10oaHR0cDovL2F0b20uaW8vcGFja2FnZXMvamF2YS1wbHVzKSBmb3IgYWxsIEphdmEgZ29vZGllcyEnLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5V2FybmluZ0Rpc3BsYXllZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgIH1cblxuICAgIGNvbnN0IGhhc0RvdFByZWZpeCA9IHRoaXMuaGFzRG90UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgIGNvbnN0IGhhc05ld1ByZWZpeCA9IHRoaXMuaGFzTmV3UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgIGlmIChoYXNEb3RQcmVmaXgpIHtcbiAgICAgIC8qKlxuICAgICAgICogRG90IHByZWZpeGVkLCBlLmcuIGBzb21ldGhpbmdbLnNvbWV0aGluZ10ucHJlZml4PGN1c29yPmAuXG4gICAgICAgKiBUaGlzIHNob3VsZCBzaG93IG1lbWJlcnMgb2YgYHNvbWV0aGluZ2AgKE5lc3RlZCBjbGFzc2VzLCBTdGF0aWMgZmllbGRzLCBldGMpLlxuICAgICAgICovXG4gICAgICBlbnRyaWVzID0gdGhpcy5maW5kZXJzLmRvdC5nZXQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4KTtcbiAgICB9IGVsc2UgaWYgKGhhc05ld1ByZWZpeCkge1xuICAgICAgLyoqXG4gICAgICAgKiBQcmVmaXggaXMgaW1tZWRpYXRlbHkgcHJlY2VkZWQgYnkgdGhlIHdvcmQgYG5ld2AsIGVnLiBgbmV3IFByZWZpeDxjdXJzb3I+YFxuICAgICAgICogVGhpcyBzaG91bGQgcmV0dXJuIHB1YmxpYyBjb25zdHJ1Y3RvcnMuXG4gICAgICAgKi9cbiAgICAgIGVudHJpZXMgPSB0aGlzLmZpbmRlcnMuY29uc3RydWN0b3IuZ2V0KGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHByZWZpeCk7XG4gICAgfSBlbHNlIGlmIChwcmVmaXgpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmF1bHQgY2FzZSB3aGVyZSBhIGNsYXNzIGlzIHBsYWlubHkgdHlwZWQgb3V0LCBlLmcuIGBQcmVmaXg8Y3Vyc29yPlxuICAgICAgICovXG4gICAgICBlbnRyaWVzID0gdGhpcy5maW5kZXJzLnBsYWluLmdldChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBwcmVmaXgpO1xuICAgIH1cblxuICAgIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIGVudHJpZXNcbiAgICAgIC5zb3J0KChsaHMsIHJocykgPT4gZGVuYW1lc3BhY2UobGhzLm5hbWUpLmxlbmd0aCAtIGRlbmFtZXNwYWNlKHJocy5uYW1lKS5sZW5ndGgpIC8vIFNvcnQgaXQgYnkgbmFtZSBsZW5ndGgsIHNvIFwiY2xvc2VzdFwiIG1hdGNoZXMgY29tZXMgZmlyc3RcbiAgICAgIC5zbGljZSgwLCA1MCkgLy8gTW9yZSB0aGFuIDUwIHN1Z2dlc3Rpb25zIGlzIGp1c3Qgc2lsbHkuIFJ1bm5pbmcgYG1hcHBlcmAgY2FuIGJlIHNsb3csIHRodXMgdGhpcyBsaW1pdC5cbiAgICAgIC5tYXAobWFwVG9TdWdnZXN0aW9uKVxuICAgICk7XG4gIH1cblxuICBvbkRpZEluc2VydFN1Z2dlc3Rpb24oeyBlZGl0b3IsIHRyaWdnZXJQb3NpdGlvbiwgc3VnZ2VzdGlvbiB9KSB7XG4gICAgaWYgKCF0aGlzLmltcG9ydEhhbmRsZXIgfHwgc3VnZ2VzdGlvbi50eXBlICE9PSAnY2xhc3MnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pbXBvcnRIYW5kbGVyKGVkaXRvciwgc3VnZ2VzdGlvbi5rbGFzcy5uYW1lKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm92aWRlcjtcbiJdfQ==