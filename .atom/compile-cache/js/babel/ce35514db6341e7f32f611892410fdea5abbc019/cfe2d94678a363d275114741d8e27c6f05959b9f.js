Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entryFinder = require('./entry-finder');

var _util = require('../util');

'use babel';

var DotEntryFinder = (function (_EntryFinder) {
  _inherits(DotEntryFinder, _EntryFinder);

  function DotEntryFinder() {
    _classCallCheck(this, DotEntryFinder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(DotEntryFinder.prototype), 'constructor', this).apply(this, args);
  }

  _createClass(DotEntryFinder, [{
    key: 'getDotChain',
    value: function getDotChain(editor, bufferPosition) {
      var textToBufferPosition = editor.getTextInRange([[0, 0], bufferPosition]);
      var dotChain = (0, _util.extractDotChain)(textToBufferPosition);
      return (0, _util.parseDotChain)(dotChain);
    }

    /**
     * Returns the return value (fully qualified) from
     * `klass` with `name`. It can be the return value from
     * a method, or a field (in which case it's the storage type
     * of the field).
     * Will return null if that name does not exist on klass.
     */
  }, {
    key: 'getMemberReturnValue',
    value: function getMemberReturnValue(klass, name) {
      var plainName = (0, _util.nameify)(name);
      var fieldMember = klass.fields.find(function (field) {
        return field.name === plainName;
      });
      if (fieldMember) {
        return fieldMember.type;
      }

      var methodMember = klass.methods.find(function (method) {
        return method.name === plainName;
      });
      if (methodMember) {
        return methodMember.signature.returnValue;
      }

      return null;
    }
  }, {
    key: 'reduceDotChain',
    value: function reduceDotChain(editor, bufferPosition) {
      var _this = this;

      return function (state, entry, index, array) {
        if (index === array.length - 1) {
          // The "last" entry in array is current candidate for completion
          // It is likely not complete. Do not reduce it.
          return state;
        }

        if (!state.fullyQualifiedClass) {
          // No class in the state yet.
          // This is first entry of chain and some guesswork is in order.
          return _this.guessType(editor, entry, bufferPosition);
        }

        if (state['static']) {
          // May still be completing static classes, e.g. Response.Status
          // where Status is a nested class of Response. Nested classes are separated by
          // a dollar ($) rather than a dot (.) in the registry.
          var nestedClass = _this.registry.get(state.fullyQualifiedClass + '$' + entry);
          if (nestedClass) {
            return {
              fullyQualifiedClass: nestedClass.name,
              'static': true
            };
          }
        }

        var klass = _this.registry.get(state.fullyQualifiedClass);
        if (!klass) {
          // This may be a primitive value, or fullyQualifiedClass is not in classpath
          return {};
        }

        return {
          fullyQualifiedClass: _this.getMemberReturnValue(klass, entry),
          'static': false
        };
      };
    }
  }, {
    key: 'getNestedClasses',
    value: function getNestedClasses(fullyQualifiedClass, prefix) {
      var nestedClassSearch = fullyQualifiedClass + '$' + (prefix || '');
      var nestedClassSuggestions = this.registry.filter(nestedClassSearch);
      if (nestedClassSuggestions) {
        return nestedClassSuggestions.filter(function (klass) {
          return -1 === klass.name.indexOf('$', nestedClassSearch.length) && // Remove any nested classes of the nested class
          klass.modifiers.includes('public');
        }).map(function (klass) {
          return _extends({}, klass, { _type: 'class' });
        });
      }

      return [];
    }
  }, {
    key: 'get',
    value: function get(editor, bufferPosition, prefix) {
      var dotChain = this.getDotChain(editor, bufferPosition);
      var dotChainEndContext = dotChain.reduce(this.reduceDotChain(editor, bufferPosition), {});

      var entryFilter = function entryFilter(entry) {
        return entry.modifiers.includes('public') && entry.modifiers.includes('static') === dotChainEndContext['static'] && entry.name !== '<init>' && ( // Do not include constructors if this is a method
        prefix === '.' || entry.name.startsWith(prefix));
      };

      var fieldSuggestions = this.getAllFields(dotChainEndContext.fullyQualifiedClass).filter(entryFilter).map(function (field) {
        return _extends({}, field, { _type: 'field' });
      });

      var methodSuggestions = this.getAllMethods(dotChainEndContext.fullyQualifiedClass).filter(entryFilter).map(function (method) {
        return _extends({}, method, { _type: 'method' });
      });

      var classSuggestions = [];
      if (dotChainEndContext['static']) {
        // Since we're in a static context, there may be nested classes
        classSuggestions = this.getNestedClasses(dotChainEndContext.fullyQualifiedClass, prefix);
      }

      return [].concat(fieldSuggestions, methodSuggestions, classSuggestions);
    }
  }]);

  return DotEntryFinder;
})(_entryFinder.EntryFinder);

exports.DotEntryFinder = DotEntryFinder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvZW50cnlmaW5kZXJzL2RvdC1lbnRyeS1maW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7MkJBRTRCLGdCQUFnQjs7b0JBQ1ksU0FBUzs7QUFIakUsV0FBVyxDQUFDOztJQUtOLGNBQWM7WUFBZCxjQUFjOztBQUVQLFdBRlAsY0FBYyxHQUVHOzBCQUZqQixjQUFjOztzQ0FFSCxJQUFJO0FBQUosVUFBSTs7O0FBQ2pCLCtCQUhFLGNBQWMsOENBR1AsSUFBSSxFQUFFO0dBQ2hCOztlQUpHLGNBQWM7O1dBTVAscUJBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRTtBQUNsQyxVQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQzdFLFVBQU0sUUFBUSxHQUFHLDJCQUFnQixvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZELGFBQU8seUJBQWMsUUFBUSxDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7Ozs7O1dBU21CLDhCQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDaEMsVUFBTSxTQUFTLEdBQUcsbUJBQVEsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTO09BQUEsQ0FBQyxDQUFDO0FBQ3pFLFVBQUksV0FBVyxFQUFFO0FBQ2YsZUFBTyxXQUFXLENBQUMsSUFBSSxDQUFDO09BQ3pCOztBQUVELFVBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtlQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUztPQUFBLENBQUMsQ0FBQztBQUM3RSxV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Q0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FDL0UsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUNuQixHQUFHLENBQUMsVUFBQSxLQUFLOzRCQUFVLEtBQUssSUFBRSxLQUFLLEVBQUUsT0FBTztPQUFHLENBQUMsQ0FBQzs7QUFFaEQsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQ2pGLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FDbkIsR0FBRyxDQUFDLFVBQUEsTUFBTTs0QkFBVSxNQUFNLElBQUUsS0FBSyxFQUFFLFFBQVE7T0FBRyxDQUFDLENBQUM7O0FBRW5ELFVBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzFCLFVBQUksa0JBQWtCLFVBQU8sRUFBRTs7QUFFN0Isd0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzFGOztBQUVELGFBQU8sRUFBRSxDQUFDLE1BQU0sQ0FDZCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGdCQUFnQixDQUNqQixDQUFDO0tBQ0g7OztTQXRIRyxjQUFjOzs7UUF5SFgsY0FBYyxHQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhLW1pbnVzL2xpYi9lbnRyeWZpbmRlcnMvZG90LWVudHJ5LWZpbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBFbnRyeUZpbmRlciB9IGZyb20gJy4vZW50cnktZmluZGVyJztcbmltcG9ydCB7IG5hbWVpZnksIGV4dHJhY3REb3RDaGFpbiwgcGFyc2VEb3RDaGFpbiB9IGZyb20gJy4uL3V0aWwnO1xuXG5jbGFzcyBEb3RFbnRyeUZpbmRlciBleHRlbmRzIEVudHJ5RmluZGVyIHtcblxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gIH1cblxuICBnZXREb3RDaGFpbihlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG4gICAgY29uc3QgdGV4dFRvQnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1swLCAwXSwgYnVmZmVyUG9zaXRpb25dKTtcbiAgICBjb25zdCBkb3RDaGFpbiA9IGV4dHJhY3REb3RDaGFpbih0ZXh0VG9CdWZmZXJQb3NpdGlvbik7XG4gICAgcmV0dXJuIHBhcnNlRG90Q2hhaW4oZG90Q2hhaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJldHVybiB2YWx1ZSAoZnVsbHkgcXVhbGlmaWVkKSBmcm9tXG4gICAqIGBrbGFzc2Agd2l0aCBgbmFtZWAuIEl0IGNhbiBiZSB0aGUgcmV0dXJuIHZhbHVlIGZyb21cbiAgICogYSBtZXRob2QsIG9yIGEgZmllbGQgKGluIHdoaWNoIGNhc2UgaXQncyB0aGUgc3RvcmFnZSB0eXBlXG4gICAqIG9mIHRoZSBmaWVsZCkuXG4gICAqIFdpbGwgcmV0dXJuIG51bGwgaWYgdGhhdCBuYW1lIGRvZXMgbm90IGV4aXN0IG9uIGtsYXNzLlxuICAgKi9cbiAgZ2V0TWVtYmVyUmV0dXJuVmFsdWUoa2xhc3MsIG5hbWUpIHtcbiAgICBjb25zdCBwbGFpbk5hbWUgPSBuYW1laWZ5KG5hbWUpO1xuICAgIGNvbnN0IGZpZWxkTWVtYmVyID0ga2xhc3MuZmllbGRzLmZpbmQoZmllbGQgPT4gZmllbGQubmFtZSA9PT0gcGxhaW5OYW1lKTtcbiAgICBpZiAoZmllbGRNZW1iZXIpIHtcbiAgICAgIHJldHVybiBmaWVsZE1lbWJlci50eXBlO1xuICAgIH1cblxuICAgIGNvbnN0IG1ldGhvZE1lbWJlciA9IGtsYXNzLm1ldGhvZHMuZmluZChtZXRob2QgPT4gbWV0aG9kLm5hbWUgPT09IHBsYWluTmFtZSk7XG4gICAgaWYgKG1ldGhvZE1lbWJlcikge1xuICAgICAgcmV0dXJuIG1ldGhvZE1lbWJlci5zaWduYXR1cmUucmV0dXJuVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZWR1Y2VEb3RDaGFpbihlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIChzdGF0ZSwgZW50cnksIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgaWYgKGluZGV4ID09PSBhcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICAgIC8vIFRoZSBcImxhc3RcIiBlbnRyeSBpbiBhcnJheSBpcyBjdXJyZW50IGNhbmRpZGF0ZSBmb3IgY29tcGxldGlvblxuICAgICAgICAvLyBJdCBpcyBsaWtlbHkgbm90IGNvbXBsZXRlLiBEbyBub3QgcmVkdWNlIGl0LlxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghc3RhdGUuZnVsbHlRdWFsaWZpZWRDbGFzcykge1xuICAgICAgICAvLyBObyBjbGFzcyBpbiB0aGUgc3RhdGUgeWV0LlxuICAgICAgICAvLyBUaGlzIGlzIGZpcnN0IGVudHJ5IG9mIGNoYWluIGFuZCBzb21lIGd1ZXNzd29yayBpcyBpbiBvcmRlci5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ3Vlc3NUeXBlKGVkaXRvciwgZW50cnksIGJ1ZmZlclBvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLnN0YXRpYykge1xuICAgICAgICAvLyBNYXkgc3RpbGwgYmUgY29tcGxldGluZyBzdGF0aWMgY2xhc3NlcywgZS5nLiBSZXNwb25zZS5TdGF0dXNcbiAgICAgICAgLy8gd2hlcmUgU3RhdHVzIGlzIGEgbmVzdGVkIGNsYXNzIG9mIFJlc3BvbnNlLiBOZXN0ZWQgY2xhc3NlcyBhcmUgc2VwYXJhdGVkIGJ5XG4gICAgICAgIC8vIGEgZG9sbGFyICgkKSByYXRoZXIgdGhhbiBhIGRvdCAoLikgaW4gdGhlIHJlZ2lzdHJ5LlxuICAgICAgICBjb25zdCBuZXN0ZWRDbGFzcyA9IHRoaXMucmVnaXN0cnkuZ2V0KGAke3N0YXRlLmZ1bGx5UXVhbGlmaWVkQ2xhc3N9JCR7ZW50cnl9YCk7XG4gICAgICAgIGlmIChuZXN0ZWRDbGFzcykge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmdWxseVF1YWxpZmllZENsYXNzOiBuZXN0ZWRDbGFzcy5uYW1lLFxuICAgICAgICAgICAgc3RhdGljOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBrbGFzcyA9IHRoaXMucmVnaXN0cnkuZ2V0KHN0YXRlLmZ1bGx5UXVhbGlmaWVkQ2xhc3MpO1xuICAgICAgaWYgKCFrbGFzcykge1xuICAgICAgICAvLyBUaGlzIG1heSBiZSBhIHByaW1pdGl2ZSB2YWx1ZSwgb3IgZnVsbHlRdWFsaWZpZWRDbGFzcyBpcyBub3QgaW4gY2xhc3NwYXRoXG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnVsbHlRdWFsaWZpZWRDbGFzczogdGhpcy5nZXRNZW1iZXJSZXR1cm5WYWx1ZShrbGFzcywgZW50cnkpLFxuICAgICAgICBzdGF0aWM6IGZhbHNlXG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICBnZXROZXN0ZWRDbGFzc2VzKGZ1bGx5UXVhbGlmaWVkQ2xhc3MsIHByZWZpeCkge1xuICAgIGNvbnN0IG5lc3RlZENsYXNzU2VhcmNoID0gYCR7ZnVsbHlRdWFsaWZpZWRDbGFzc30kJHtwcmVmaXggfHwgJyd9YDtcbiAgICBjb25zdCBuZXN0ZWRDbGFzc1N1Z2dlc3Rpb25zID0gdGhpcy5yZWdpc3RyeS5maWx0ZXIobmVzdGVkQ2xhc3NTZWFyY2gpO1xuICAgIGlmIChuZXN0ZWRDbGFzc1N1Z2dlc3Rpb25zKSB7XG4gICAgICByZXR1cm4gbmVzdGVkQ2xhc3NTdWdnZXN0aW9uc1xuICAgICAgICAuZmlsdGVyKGtsYXNzID0+XG4gICAgICAgICAgLTEgPT09IGtsYXNzLm5hbWUuaW5kZXhPZignJCcsIG5lc3RlZENsYXNzU2VhcmNoLmxlbmd0aCkgJiYgLy8gUmVtb3ZlIGFueSBuZXN0ZWQgY2xhc3NlcyBvZiB0aGUgbmVzdGVkIGNsYXNzXG4gICAgICAgICAga2xhc3MubW9kaWZpZXJzLmluY2x1ZGVzKCdwdWJsaWMnKVxuICAgICAgICApXG4gICAgICAgIC5tYXAoa2xhc3MgPT4gKHsgLi4ua2xhc3MsIF90eXBlOiAnY2xhc3MnIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4KSB7XG4gICAgY29uc3QgZG90Q2hhaW4gPSB0aGlzLmdldERvdENoYWluKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pO1xuICAgIGNvbnN0IGRvdENoYWluRW5kQ29udGV4dCA9IGRvdENoYWluLnJlZHVjZSh0aGlzLnJlZHVjZURvdENoYWluKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLCB7fSk7XG5cbiAgICBjb25zdCBlbnRyeUZpbHRlciA9IGVudHJ5ID0+XG4gICAgICBlbnRyeS5tb2RpZmllcnMuaW5jbHVkZXMoJ3B1YmxpYycpICYmXG4gICAgICBlbnRyeS5tb2RpZmllcnMuaW5jbHVkZXMoJ3N0YXRpYycpID09PSBkb3RDaGFpbkVuZENvbnRleHQuc3RhdGljICYmXG4gICAgICBlbnRyeS5uYW1lICE9PSAnPGluaXQ+JyAmJiAvLyBEbyBub3QgaW5jbHVkZSBjb25zdHJ1Y3RvcnMgaWYgdGhpcyBpcyBhIG1ldGhvZFxuICAgICAgKHByZWZpeCA9PT0gJy4nIHx8IGVudHJ5Lm5hbWUuc3RhcnRzV2l0aChwcmVmaXgpKTtcblxuICAgIGNvbnN0IGZpZWxkU3VnZ2VzdGlvbnMgPSB0aGlzLmdldEFsbEZpZWxkcyhkb3RDaGFpbkVuZENvbnRleHQuZnVsbHlRdWFsaWZpZWRDbGFzcylcbiAgICAgIC5maWx0ZXIoZW50cnlGaWx0ZXIpXG4gICAgICAubWFwKGZpZWxkID0+ICh7IC4uLmZpZWxkLCBfdHlwZTogJ2ZpZWxkJyB9KSk7XG5cbiAgICBjb25zdCBtZXRob2RTdWdnZXN0aW9ucyA9IHRoaXMuZ2V0QWxsTWV0aG9kcyhkb3RDaGFpbkVuZENvbnRleHQuZnVsbHlRdWFsaWZpZWRDbGFzcylcbiAgICAgIC5maWx0ZXIoZW50cnlGaWx0ZXIpXG4gICAgICAubWFwKG1ldGhvZCA9PiAoeyAuLi5tZXRob2QsIF90eXBlOiAnbWV0aG9kJyB9KSk7XG5cbiAgICBsZXQgY2xhc3NTdWdnZXN0aW9ucyA9IFtdO1xuICAgIGlmIChkb3RDaGFpbkVuZENvbnRleHQuc3RhdGljKSB7XG4gICAgICAvLyBTaW5jZSB3ZSdyZSBpbiBhIHN0YXRpYyBjb250ZXh0LCB0aGVyZSBtYXkgYmUgbmVzdGVkIGNsYXNzZXNcbiAgICAgIGNsYXNzU3VnZ2VzdGlvbnMgPSB0aGlzLmdldE5lc3RlZENsYXNzZXMoZG90Q2hhaW5FbmRDb250ZXh0LmZ1bGx5UXVhbGlmaWVkQ2xhc3MsIHByZWZpeCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdLmNvbmNhdChcbiAgICAgIGZpZWxkU3VnZ2VzdGlvbnMsXG4gICAgICBtZXRob2RTdWdnZXN0aW9ucyxcbiAgICAgIGNsYXNzU3VnZ2VzdGlvbnNcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IERvdEVudHJ5RmluZGVyIH07XG4iXX0=