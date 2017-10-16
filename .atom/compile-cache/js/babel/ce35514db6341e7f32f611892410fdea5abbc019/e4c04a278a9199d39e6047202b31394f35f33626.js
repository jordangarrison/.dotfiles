Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('../util');

var _localMethods = require('./local-methods');

var _classLocalFields = require('./class-local-fields');

var _methodLocalFields = require('./method-local-fields');

'use babel';

var EntryFinder = (function () {
  function EntryFinder(registry, editorTokens) {
    _classCallCheck(this, EntryFinder);

    this.IMPORT_REGEX = /import\s+([^;]+);/g;

    if (new.target === EntryFinder) {
      throw new TypeError('Can not directly create instance of EntryFinder');
    }

    if (this.get === EntryFinder.prototype.get) {
      throw new TypeError('Method `get` must be overriden by child');
    }

    this.registry = registry;
    this.editorTokens = editorTokens;
  }

  /**
   * Returns an array of all the imports in the specified editor.
   */

  _createClass(EntryFinder, [{
    key: 'getImports',
    value: function getImports(editor) {
      var imports = [];
      editor.scan(this.IMPORT_REGEX, function (_ref) {
        var match = _ref.match;
        return imports.push(match[1]);
      });
      return imports;
    }
  }, {
    key: 'getSuperClass',
    value: function getSuperClass(tokens) {
      var superToken = [].concat.apply([], tokens).find(function (token) {
        return token.scopes.includes('entity.other.inherited-class.java');
      });

      return superToken ? superToken.value : 'Object';
    }

    /**
     * Guess the type of the unqualified token in the editor.
     * It will test multiple things it may be and the first
     * hit will return an object { fullyQualifiedClass, static }.
     *
     * Precedence
     *   1. Constructors
     *   2. Local fields
     *   3. Local methods
     *   4. Inherited fields
     *   5. Inherited methods
     *   6. Imported static classes
     */
  }, {
    key: 'guessType',
    value: function guessType(editor, token, bufferPosition) {
      var tokens = this.editorTokens.get(editor);
      var findByToken = function findByToken(member) {
        return member.name === (0, _util.nameify)(token);
      };

      var newMatch = token.match(/^new ([\w$]+)/);
      if (newMatch) {
        var klass = newMatch[1];
        return {
          fullyQualifiedClass: this.getFullyQualifiedClass(editor, klass) || klass,
          'static': false
        };
      }

      var classLocalField = this.getClassLocalFields(tokens, editor).find(findByToken);
      if (classLocalField) {
        return { fullyQualifiedClass: classLocalField.type, 'static': false };
      }

      var methodLocalField = this.getMethodLocalFields(tokens, editor, bufferPosition).find(findByToken);
      if (methodLocalField) {
        return { fullyQualifiedClass: methodLocalField.type, 'static': false };
      }

      var localMethod = this.getLocalMethods(tokens, editor).find(findByToken);
      if (localMethod) {
        return { fullyQualifiedClass: localMethod.signature.returnValue, 'static': false };
      }

      var superClass = this.getSuperClass(tokens);
      var superFullyQualifiedClass = this.getFullyQualifiedClass(editor, superClass);

      var inheritedField = this.getAllFields(superFullyQualifiedClass).find(findByToken);
      if (inheritedField) {
        return { fullyQualifiedClass: inheritedField.type, 'static': false };
      }

      var inheritedMethod = this.getAllMethods(superFullyQualifiedClass).find(findByToken);
      if (inheritedMethod) {
        return { fullyQualifiedClass: inheritedMethod.signature.returnValue, 'static': false };
      }

      return { fullyQualifiedClass: this.getFullyQualifiedClass(editor, token), 'static': true };
    }

    /**
     * Retrieves the fully qualified class by examining the imports
     * in the specified editor. For instance:
     * klass = `Arrays`
     * if import statements contain either `java.util.*;` or `java.util.Arrays`
     * then `java.util.Arrays` will be returned.
     */
  }, {
    key: 'getFullyQualifiedClass',
    value: function getFullyQualifiedClass(editor, klass) {
      var _this = this;

      var imports = this.getImports(editor);
      var importCandidates = imports.filter(function (imp) {
        return (0, _util.denamespace)(imp) === klass || (0, _util.denamespace)(imp) === '*';
      });

      importCandidates.push('java.lang.*'); // Implicitly allowed in Java

      var existingImport = importCandidates.find(function (importCandidate) {
        return _this.registry.get((0, _util.packagify)(importCandidate) + '.' + klass);
      });

      return existingImport ? (0, _util.packagify)(existingImport) + '.' + klass : null;
    }
  }, {
    key: 'getAllFields',
    value: function getAllFields(fullyQualifiedClass) {
      var klass = this.registry.get(fullyQualifiedClass);
      if (!klass) {
        return [];
      }
      var fields = klass.fields.filter(function (field) {
        return field.modifiers.includes('public') || field.modifiers.includes('protected');
      }).map(function (field) {
        return _extends({}, field, { origin: fullyQualifiedClass });
      });

      return fields.concat(this.getAllFields(klass['super']));
    }
  }, {
    key: 'getAllMethods',
    value: function getAllMethods(fullyQualifiedClass) {
      var klass = this.registry.get(fullyQualifiedClass);
      if (!klass) {
        return [];
      }

      var methods = klass.methods.filter(function (method) {
        return method.modifiers.includes('public') || method.modifiers.includes('protected');
      }).map(function (method) {
        return _extends({}, method, { origin: fullyQualifiedClass });
      });

      return methods.concat(this.getAllMethods(klass['super']));
    }
  }, {
    key: 'get',
    value: function get(editor, bufferPosition, prefix) {
      throw new TypeError('Super `get` called from child.');
    }
  }]);

  return EntryFinder;
})();

EntryFinder.prototype.getLocalMethods = _localMethods.getLocalMethods;
EntryFinder.prototype.getClassLocalFields = _classLocalFields.getClassLocalFields;
EntryFinder.prototype.getMethodLocalFields = _methodLocalFields.getMethodLocalFields;

exports['default'] = { EntryFinder: EntryFinder };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvZW50cnlmaW5kZXJzL2VudHJ5LWZpbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVnRCxTQUFTOzs0QkFDekIsaUJBQWlCOztnQ0FDYixzQkFBc0I7O2lDQUNyQix1QkFBdUI7O0FBTDVELFdBQVcsQ0FBQzs7SUFPTixXQUFXO0FBR0osV0FIUCxXQUFXLENBR0gsUUFBUSxFQUFFLFlBQVksRUFBRTswQkFIaEMsV0FBVzs7U0FDZixZQUFZLEdBQUcsb0JBQW9COztBQUdqQyxRQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO0FBQzlCLFlBQU0sSUFBSSxTQUFTLENBQUMsaURBQWlELENBQUMsQ0FBQztLQUN4RTs7QUFFRCxRQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7QUFDMUMsWUFBTSxJQUFJLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0tBQ2hFOztBQUVELFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0dBQ2xDOzs7Ozs7ZUFkRyxXQUFXOztXQW1CTCxvQkFBQyxNQUFNLEVBQUU7QUFDakIsVUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFlBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFDLElBQVM7WUFBUCxLQUFLLEdBQVAsSUFBUyxDQUFQLEtBQUs7ZUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUN0RSxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRVksdUJBQUMsTUFBTSxFQUFFO0FBQ3BCLFVBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FB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Q0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBTSxDQUFDLENBQUMsQ0FBQztLQUN0RDs7O1dBRVksdUJBQUMsbUJBQW1CLEVBQUU7QUFDakMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsZUFBTyxFQUFFLENBQUM7T0FDWDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUMxQixNQUFNLENBQUMsVUFBQSxNQUFNO2VBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO09BQUEsQ0FBQyxDQUMvRixHQUFHLENBQUMsVUFBQSxNQUFNOzRCQUFVLE1BQU0sSUFBRSxNQUFNLEVBQUUsbUJBQW1CO09BQUcsQ0FBQyxDQUFDOztBQUUvRCxhQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLFNBQU0sQ0FBQyxDQUFDLENBQUM7S0FDeEQ7OztXQUVFLGFBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUU7QUFDbEMsWUFBTSxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0tBQ3ZEOzs7U0EzSUcsV0FBVzs7O0FBOElqQixXQUFXLENBQUMsU0FBUyxDQUFDLGVBQWUsZ0NBQWtCLENBQUM7QUFDeEQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsd0NBQXNCLENBQUM7QUFDaEUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsMENBQXVCLENBQUM7O3FCQUVuRCxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhLW1pbnVzL2xpYi9lbnRyeWZpbmRlcnMvZW50cnktZmluZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGRlbmFtZXNwYWNlLCBwYWNrYWdpZnksIG5hbWVpZnkgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7IGdldExvY2FsTWV0aG9kcyB9IGZyb20gJy4vbG9jYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBnZXRDbGFzc0xvY2FsRmllbGRzIH0gZnJvbSAnLi9jbGFzcy1sb2NhbC1maWVsZHMnO1xuaW1wb3J0IHsgZ2V0TWV0aG9kTG9jYWxGaWVsZHMgfSBmcm9tICcuL21ldGhvZC1sb2NhbC1maWVsZHMnO1xuXG5jbGFzcyBFbnRyeUZpbmRlciB7XG4gIElNUE9SVF9SRUdFWCA9IC9pbXBvcnRcXHMrKFteO10rKTsvZztcblxuICBjb25zdHJ1Y3RvcihyZWdpc3RyeSwgZWRpdG9yVG9rZW5zKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEVudHJ5RmluZGVyKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW4gbm90IGRpcmVjdGx5IGNyZWF0ZSBpbnN0YW5jZSBvZiBFbnRyeUZpbmRlcicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdldCA9PT0gRW50cnlGaW5kZXIucHJvdG90eXBlLmdldCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTWV0aG9kIGBnZXRgIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGNoaWxkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RyeSA9IHJlZ2lzdHJ5O1xuICAgIHRoaXMuZWRpdG9yVG9rZW5zID0gZWRpdG9yVG9rZW5zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoZSBpbXBvcnRzIGluIHRoZSBzcGVjaWZpZWQgZWRpdG9yLlxuICAgKi9cbiAgZ2V0SW1wb3J0cyhlZGl0b3IpIHtcbiAgICBjb25zdCBpbXBvcnRzID0gW107XG4gICAgZWRpdG9yLnNjYW4odGhpcy5JTVBPUlRfUkVHRVgsICh7IG1hdGNoIH0pID0+IGltcG9ydHMucHVzaChtYXRjaFsxXSkpO1xuICAgIHJldHVybiBpbXBvcnRzO1xuICB9XG5cbiAgZ2V0U3VwZXJDbGFzcyh0b2tlbnMpIHtcbiAgICBjb25zdCBzdXBlclRva2VuID0gW10uY29uY2F0LmFwcGx5KFtdLCB0b2tlbnMpLmZpbmQodG9rZW4gPT5cbiAgICAgIHRva2VuLnNjb3Blcy5pbmNsdWRlcygnZW50aXR5Lm90aGVyLmluaGVyaXRlZC1jbGFzcy5qYXZhJylcbiAgICApO1xuXG4gICAgcmV0dXJuIHN1cGVyVG9rZW4gPyBzdXBlclRva2VuLnZhbHVlIDogJ09iamVjdCc7XG4gIH1cblxuICAvKipcbiAgICogR3Vlc3MgdGhlIHR5cGUgb2YgdGhlIHVucXVhbGlmaWVkIHRva2VuIGluIHRoZSBlZGl0b3IuXG4gICAqIEl0IHdpbGwgdGVzdCBtdWx0aXBsZSB0aGluZ3MgaXQgbWF5IGJlIGFuZCB0aGUgZmlyc3RcbiAgICogaGl0IHdpbGwgcmV0dXJuIGFuIG9iamVjdCB7IGZ1bGx5UXVhbGlmaWVkQ2xhc3MsIHN0YXRpYyB9LlxuICAgKlxuICAgKiBQcmVjZWRlbmNlXG4gICAqICAgMS4gQ29uc3RydWN0b3JzXG4gICAqICAgMi4gTG9jYWwgZmllbGRzXG4gICAqICAgMy4gTG9jYWwgbWV0aG9kc1xuICAgKiAgIDQuIEluaGVyaXRlZCBmaWVsZHNcbiAgICogICA1LiBJbmhlcml0ZWQgbWV0aG9kc1xuICAgKiAgIDYuIEltcG9ydGVkIHN0YXRpYyBjbGFzc2VzXG4gICAqL1xuICBndWVzc1R5cGUoZWRpdG9yLCB0b2tlbiwgYnVmZmVyUG9zaXRpb24pIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLmVkaXRvclRva2Vucy5nZXQoZWRpdG9yKTtcbiAgICBjb25zdCBmaW5kQnlUb2tlbiA9IG1lbWJlciA9PiBtZW1iZXIubmFtZSA9PT0gbmFtZWlmeSh0b2tlbik7XG5cbiAgICBjb25zdCBuZXdNYXRjaCA9IHRva2VuLm1hdGNoKC9ebmV3IChbXFx3JF0rKS8pO1xuICAgIGlmIChuZXdNYXRjaCkge1xuICAgICAgY29uc3Qga2xhc3MgPSBuZXdNYXRjaFsxXTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZ1bGx5UXVhbGlmaWVkQ2xhc3M6IHRoaXMuZ2V0RnVsbHlRdWFsaWZpZWRDbGFzcyhlZGl0b3IsIGtsYXNzKSB8fCBrbGFzcyxcbiAgICAgICAgc3RhdGljOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc0xvY2FsRmllbGQgPSB0aGlzLmdldENsYXNzTG9jYWxGaWVsZHModG9rZW5zLCBlZGl0b3IpLmZpbmQoZmluZEJ5VG9rZW4pO1xuICAgIGlmIChjbGFzc0xvY2FsRmllbGQpIHtcbiAgICAgIHJldHVybiB7IGZ1bGx5UXVhbGlmaWVkQ2xhc3M6IGNsYXNzTG9jYWxGaWVsZC50eXBlLCBzdGF0aWM6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgY29uc3QgbWV0aG9kTG9jYWxGaWVsZCA9IHRoaXMuZ2V0TWV0aG9kTG9jYWxGaWVsZHModG9rZW5zLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS5maW5kKGZpbmRCeVRva2VuKTtcbiAgICBpZiAobWV0aG9kTG9jYWxGaWVsZCkge1xuICAgICAgcmV0dXJuIHsgZnVsbHlRdWFsaWZpZWRDbGFzczogbWV0aG9kTG9jYWxGaWVsZC50eXBlLCBzdGF0aWM6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYWxNZXRob2QgPSB0aGlzLmdldExvY2FsTWV0aG9kcyh0b2tlbnMsIGVkaXRvcikuZmluZChmaW5kQnlUb2tlbik7XG4gICAgaWYgKGxvY2FsTWV0aG9kKSB7XG4gICAgICByZXR1cm4geyBmdWxseVF1YWxpZmllZENsYXNzOiBsb2NhbE1ldGhvZC5zaWduYXR1cmUucmV0dXJuVmFsdWUsIHN0YXRpYzogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKHRva2Vucyk7XG4gICAgY29uc3Qgc3VwZXJGdWxseVF1YWxpZmllZENsYXNzID0gdGhpcy5nZXRGdWxseVF1YWxpZmllZENsYXNzKGVkaXRvciwgc3VwZXJDbGFzcyk7XG5cbiAgICBjb25zdCBpbmhlcml0ZWRGaWVsZCA9IHRoaXMuZ2V0QWxsRmllbGRzKHN1cGVyRnVsbHlRdWFsaWZpZWRDbGFzcykuZmluZChmaW5kQnlUb2tlbik7XG4gICAgaWYgKGluaGVyaXRlZEZpZWxkKSB7XG4gICAgICByZXR1cm4geyBmdWxseVF1YWxpZmllZENsYXNzOiBpbmhlcml0ZWRGaWVsZC50eXBlLCBzdGF0aWM6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgY29uc3QgaW5oZXJpdGVkTWV0aG9kID0gdGhpcy5nZXRBbGxNZXRob2RzKHN1cGVyRnVsbHlRdWFsaWZpZWRDbGFzcykuZmluZChmaW5kQnlUb2tlbik7XG4gICAgaWYgKGluaGVyaXRlZE1ldGhvZCkge1xuICAgICAgcmV0dXJuIHsgZnVsbHlRdWFsaWZpZWRDbGFzczogaW5oZXJpdGVkTWV0aG9kLnNpZ25hdHVyZS5yZXR1cm5WYWx1ZSwgc3RhdGljOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IGZ1bGx5UXVhbGlmaWVkQ2xhc3M6IHRoaXMuZ2V0RnVsbHlRdWFsaWZpZWRDbGFzcyhlZGl0b3IsIHRva2VuKSwgc3RhdGljOiB0cnVlIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBmdWxseSBxdWFsaWZpZWQgY2xhc3MgYnkgZXhhbWluaW5nIHRoZSBpbXBvcnRzXG4gICAqIGluIHRoZSBzcGVjaWZpZWQgZWRpdG9yLiBGb3IgaW5zdGFuY2U6XG4gICAqIGtsYXNzID0gYEFycmF5c2BcbiAgICogaWYgaW1wb3J0IHN0YXRlbWVudHMgY29udGFpbiBlaXRoZXIgYGphdmEudXRpbC4qO2Agb3IgYGphdmEudXRpbC5BcnJheXNgXG4gICAqIHRoZW4gYGphdmEudXRpbC5BcnJheXNgIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBnZXRGdWxseVF1YWxpZmllZENsYXNzKGVkaXRvciwga2xhc3MpIHtcbiAgICBjb25zdCBpbXBvcnRzID0gdGhpcy5nZXRJbXBvcnRzKGVkaXRvcik7XG4gICAgY29uc3QgaW1wb3J0Q2FuZGlkYXRlcyA9IGltcG9ydHMuZmlsdGVyKGltcCA9PiB7XG4gICAgICByZXR1cm4gKGRlbmFtZXNwYWNlKGltcCkgPT09IGtsYXNzIHx8IGRlbmFtZXNwYWNlKGltcCkgPT09ICcqJyk7XG4gICAgfSk7XG5cbiAgICBpbXBvcnRDYW5kaWRhdGVzLnB1c2goJ2phdmEubGFuZy4qJyk7IC8vIEltcGxpY2l0bHkgYWxsb3dlZCBpbiBKYXZhXG5cbiAgICBjb25zdCBleGlzdGluZ0ltcG9ydCA9IGltcG9ydENhbmRpZGF0ZXMuZmluZChpbXBvcnRDYW5kaWRhdGUgPT5cbiAgICAgIHRoaXMucmVnaXN0cnkuZ2V0KGAke3BhY2thZ2lmeShpbXBvcnRDYW5kaWRhdGUpfS4ke2tsYXNzfWApXG4gICAgKTtcblxuICAgIHJldHVybiBleGlzdGluZ0ltcG9ydCA/IGAke3BhY2thZ2lmeShleGlzdGluZ0ltcG9ydCl9LiR7a2xhc3N9YCA6IG51bGw7XG4gIH1cblxuICBnZXRBbGxGaWVsZHMoZnVsbHlRdWFsaWZpZWRDbGFzcykge1xuICAgIGNvbnN0IGtsYXNzID0gdGhpcy5yZWdpc3RyeS5nZXQoZnVsbHlRdWFsaWZpZWRDbGFzcyk7XG4gICAgaWYgKCFrbGFzcykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBmaWVsZHMgPSBrbGFzcy5maWVsZHNcbiAgICAgIC5maWx0ZXIoZmllbGQgPT4gZmllbGQubW9kaWZpZXJzLmluY2x1ZGVzKCdwdWJsaWMnKSB8fCBmaWVsZC5tb2RpZmllcnMuaW5jbHVkZXMoJ3Byb3RlY3RlZCcpKVxuICAgICAgLm1hcChmaWVsZCA9PiAoeyAuLi5maWVsZCwgb3JpZ2luOiBmdWxseVF1YWxpZmllZENsYXNzIH0pKTtcblxuICAgIHJldHVybiBmaWVsZHMuY29uY2F0KHRoaXMuZ2V0QWxsRmllbGRzKGtsYXNzLnN1cGVyKSk7XG4gIH1cblxuICBnZXRBbGxNZXRob2RzKGZ1bGx5UXVhbGlmaWVkQ2xhc3MpIHtcbiAgICBjb25zdCBrbGFzcyA9IHRoaXMucmVnaXN0cnkuZ2V0KGZ1bGx5UXVhbGlmaWVkQ2xhc3MpO1xuICAgIGlmICgha2xhc3MpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXRob2RzID0ga2xhc3MubWV0aG9kc1xuICAgICAgLmZpbHRlcihtZXRob2QgPT4gbWV0aG9kLm1vZGlmaWVycy5pbmNsdWRlcygncHVibGljJykgfHwgbWV0aG9kLm1vZGlmaWVycy5pbmNsdWRlcygncHJvdGVjdGVkJykpXG4gICAgICAubWFwKG1ldGhvZCA9PiAoeyAuLi5tZXRob2QsIG9yaWdpbjogZnVsbHlRdWFsaWZpZWRDbGFzcyB9KSk7XG5cbiAgICByZXR1cm4gbWV0aG9kcy5jb25jYXQodGhpcy5nZXRBbGxNZXRob2RzKGtsYXNzLnN1cGVyKSk7XG4gIH1cblxuICBnZXQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgYGdldGAgY2FsbGVkIGZyb20gY2hpbGQuJyk7XG4gIH1cbn1cblxuRW50cnlGaW5kZXIucHJvdG90eXBlLmdldExvY2FsTWV0aG9kcyA9IGdldExvY2FsTWV0aG9kcztcbkVudHJ5RmluZGVyLnByb3RvdHlwZS5nZXRDbGFzc0xvY2FsRmllbGRzID0gZ2V0Q2xhc3NMb2NhbEZpZWxkcztcbkVudHJ5RmluZGVyLnByb3RvdHlwZS5nZXRNZXRob2RMb2NhbEZpZWxkcyA9IGdldE1ldGhvZExvY2FsRmllbGRzO1xuXG5leHBvcnQgZGVmYXVsdCB7IEVudHJ5RmluZGVyIH07XG4iXX0=