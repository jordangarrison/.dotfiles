Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _util = require('../util');

var _entryFinder = require('./entry-finder');

'use babel';

var PlainEntryFinder = (function (_EntryFinder) {
  _inherits(PlainEntryFinder, _EntryFinder);

  function PlainEntryFinder() {
    _classCallCheck(this, PlainEntryFinder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(PlainEntryFinder.prototype), 'constructor', this).apply(this, args);
  }

  _createClass(PlainEntryFinder, [{
    key: 'getLocalFieldSuggestions',
    value: function getLocalFieldSuggestions(editor, bufferPosition, prefix, tokens) {
      return [].concat(this.getClassLocalFields(tokens, editor), this.getMethodLocalFields(tokens, editor, bufferPosition)).filter(function (entry) {
        return entry.name.startsWith(prefix);
      }).map(function (_ref) {
        var type = _ref.type;
        var name = _ref.name;
        return {
          name: name,
          type: type,
          _type: 'field',
          variable: true
        };
      });
    }
  }, {
    key: 'getInheritedFieldSuggestions',
    value: function getInheritedFieldSuggestions(prefix, superFullyQualifiedClass) {
      return this.getAllFields(superFullyQualifiedClass).filter(function (entry) {
        return entry.name.startsWith(prefix);
      }).map(function (field) {
        return _extends({}, field, {
          variable: true,
          _type: 'field'
        });
      });
    }
  }, {
    key: 'getLocalMethodSuggestions',
    value: function getLocalMethodSuggestions(editor, prefix, tokens) {
      return this.getLocalMethods(tokens, editor).filter(function (method) {
        return method.name.startsWith(prefix);
      }).map(function (method) {
        return _extends({}, method, { _type: 'method' });
      });
    }
  }, {
    key: 'getInheritedMethodSuggestions',
    value: function getInheritedMethodSuggestions(prefix, superFullyQualifiedClass) {
      return this.getAllMethods(superFullyQualifiedClass).filter(function (method) {
        return method.name.startsWith(prefix);
      }).map(function (method) {
        return _extends({}, method, { _type: 'method' });
      });
    }
  }, {
    key: 'getClassSuggestions',
    value: function getClassSuggestions(prefix) {
      return this.registry.filter(function (fullyQualifiedClass) {
        return (0, _util.denamespace)(fullyQualifiedClass).startsWith(prefix);
      }).filter(function (klass) {
        return -1 === klass.name.indexOf('$', prefix.length);
      }) // Remove any nested classes of the nested class
      .map(function (entry) {
        return _extends({}, entry, { _type: 'class' });
      });
    }
  }, {
    key: 'get',
    value: function get(editor, bufferPosition, prefix) {
      var tokens = this.editorTokens.get(editor);
      var superClass = this.getSuperClass(tokens);
      var superFullyQualifiedClass = this.getFullyQualifiedClass(editor, superClass);

      return [].concat(this.getLocalFieldSuggestions(editor, bufferPosition, prefix, tokens), this.getInheritedFieldSuggestions(prefix, superFullyQualifiedClass), this.getLocalMethodSuggestions(editor, prefix, tokens), this.getInheritedMethodSuggestions(prefix, superFullyQualifiedClass), this.getClassSuggestions(prefix));
    }
  }]);

  return PlainEntryFinder;
})(_entryFinder.EntryFinder);

exports.PlainEntryFinder = PlainEntryFinder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvZW50cnlmaW5kZXJzL3BsYWluLWVudHJ5LWZpbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFNEIsU0FBUzs7MkJBQ1QsZ0JBQWdCOztBQUg1QyxXQUFXLENBQUM7O0lBS04sZ0JBQWdCO1lBQWhCLGdCQUFnQjs7QUFFVCxXQUZQLGdCQUFnQixHQUVDOzBCQUZqQixnQkFBZ0I7O3NDQUVMLElBQUk7QUFBSixVQUFJOzs7QUFDakIsK0JBSEUsZ0JBQWdCLDhDQUdULElBQUksRUFBRTtHQUNoQjs7ZUFKRyxnQkFBZ0I7O1dBTUksa0NBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQy9ELGFBQU8sRUFBRSxDQUFDLE1BQU0sQ0FDWixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUN4QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FDMUQsQ0FDQSxNQUFNLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUM5QyxHQUFHLENBQUMsVUFBQyxJQUFjO1lBQVosSUFBSSxHQUFOLElBQWMsQ0FBWixJQUFJO1lBQUUsSUFBSSxHQUFaLElBQWMsQ0FBTixJQUFJO2VBQVE7QUFDeEIsY0FBSSxFQUFKLElBQUk7QUFDSixjQUFJLEVBQUosSUFBSTtBQUNKLGVBQUssRUFBRSxPQUFPO0FBQ2Qsa0JBQVEsRUFBRSxJQUFJO1NBQ2Y7T0FBQyxDQUFDLENBQUM7S0FDUDs7O1dBRTJCLHNDQUFDLE1BQU0sRUFBRSx3QkFBd0IsRUFBRTtBQUM3RCxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsQ0FDL0MsTUFBTSxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FDOUMsR0FBRyxDQUFDLFVBQUEsS0FBSzs0QkFDTCxLQUFLO0FBQ1Isa0JBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBSyxFQUFFLE9BQU87O09BQ2QsQ0FBQyxDQUFDO0tBQ1A7OztXQUV3QixtQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUNoRCxhQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUN4QyxNQUFNLENBQUMsVUFBQSxNQUFNO2VBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUNoRCxHQUFHLENBQUMsVUFBQSxNQUFNOzRCQUFVLE1BQU0sSUFBRSxLQUFLLEVBQUUsUUFBUTtPQUFHLENBQUMsQ0FBQztLQUNwRDs7O1dBRTRCLHVDQUFDLE1BQU0sRUFBRSx3QkFBd0IsRUFBRTtBQUM5RCxhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FDaEQsTUFBTSxDQUFDLFVBQUEsTUFBTTtlQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FDaEQsR0FBRyxDQUFDLFVBQUEsTUFBTTs0QkFBVSxNQUFNLElBQUUsS0FBSyxFQUFFLFFBQVE7T0FBRyxDQUFDLENBQUM7S0FDcEQ7OztXQUVrQiw2QkFBQyxNQUFNLEVBQUU7QUFDMUIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLG1CQUFtQjtlQUFJLHVCQUFZLG1CQUFtQixDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FDcEcsTUFBTSxDQUFDLFVBQUEsS0FBSztlQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQztPQUM5RCxHQUFHLENBQUMsVUFBQSxLQUFLOzRCQUFVLEtBQUssSUFBRSxLQUFLLEVBQUUsT0FBTztPQUFHLENBQUMsQ0FBQztLQUNqRDs7O1dBRUUsYUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFVBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFakYsYUFBTyxFQUFFLENBQUMsTUFBTSxDQUNkLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFDckUsSUFBSSxDQUFDLDRCQUE0QixDQUFDLE1BQU0sRUFBRSx3QkFBd0IsQ0FBQyxFQUNuRSxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFDdEQsSUFBSSxDQUFDLDZCQUE2QixDQUFDLE1BQU0sRUFBRSx3QkFBd0IsQ0FBQyxFQUNwRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQ2pDLENBQUM7S0FDSDs7O1NBNURHLGdCQUFnQjs7O1FBK0RiLGdCQUFnQixHQUFoQixnQkFBZ0IiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qYXZhLW1pbnVzL2xpYi9lbnRyeWZpbmRlcnMvcGxhaW4tZW50cnktZmluZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGRlbmFtZXNwYWNlIH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgeyBFbnRyeUZpbmRlciB9IGZyb20gJy4vZW50cnktZmluZGVyJztcblxuY2xhc3MgUGxhaW5FbnRyeUZpbmRlciBleHRlbmRzIEVudHJ5RmluZGVyIHtcblxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gIH1cblxuICBnZXRMb2NhbEZpZWxkU3VnZ2VzdGlvbnMoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4LCB0b2tlbnMpIHtcbiAgICByZXR1cm4gW10uY29uY2F0KFxuICAgICAgICB0aGlzLmdldENsYXNzTG9jYWxGaWVsZHModG9rZW5zLCBlZGl0b3IpLFxuICAgICAgICB0aGlzLmdldE1ldGhvZExvY2FsRmllbGRzKHRva2VucywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIClcbiAgICAgIC5maWx0ZXIoZW50cnkgPT4gZW50cnkubmFtZS5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgICAubWFwKCh7IHR5cGUsIG5hbWUgfSkgPT4gKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgX3R5cGU6ICdmaWVsZCcsXG4gICAgICAgIHZhcmlhYmxlOiB0cnVlXG4gICAgICB9KSk7XG4gIH1cblxuICBnZXRJbmhlcml0ZWRGaWVsZFN1Z2dlc3Rpb25zKHByZWZpeCwgc3VwZXJGdWxseVF1YWxpZmllZENsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsRmllbGRzKHN1cGVyRnVsbHlRdWFsaWZpZWRDbGFzcylcbiAgICAgIC5maWx0ZXIoZW50cnkgPT4gZW50cnkubmFtZS5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgICAubWFwKGZpZWxkID0+ICh7XG4gICAgICAgIC4uLmZpZWxkLFxuICAgICAgICB2YXJpYWJsZTogdHJ1ZSxcbiAgICAgICAgX3R5cGU6ICdmaWVsZCdcbiAgICAgIH0pKTtcbiAgfVxuXG4gIGdldExvY2FsTWV0aG9kU3VnZ2VzdGlvbnMoZWRpdG9yLCBwcmVmaXgsIHRva2Vucykge1xuICAgIHJldHVybiB0aGlzLmdldExvY2FsTWV0aG9kcyh0b2tlbnMsIGVkaXRvcilcbiAgICAgIC5maWx0ZXIobWV0aG9kID0+IG1ldGhvZC5uYW1lLnN0YXJ0c1dpdGgocHJlZml4KSlcbiAgICAgIC5tYXAobWV0aG9kID0+ICh7IC4uLm1ldGhvZCwgX3R5cGU6ICdtZXRob2QnIH0pKTtcbiAgfVxuXG4gIGdldEluaGVyaXRlZE1ldGhvZFN1Z2dlc3Rpb25zKHByZWZpeCwgc3VwZXJGdWxseVF1YWxpZmllZENsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsTWV0aG9kcyhzdXBlckZ1bGx5UXVhbGlmaWVkQ2xhc3MpXG4gICAgICAuZmlsdGVyKG1ldGhvZCA9PiBtZXRob2QubmFtZS5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgICAubWFwKG1ldGhvZCA9PiAoeyAuLi5tZXRob2QsIF90eXBlOiAnbWV0aG9kJyB9KSk7XG4gIH1cblxuICBnZXRDbGFzc1N1Z2dlc3Rpb25zKHByZWZpeCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5LmZpbHRlcihmdWxseVF1YWxpZmllZENsYXNzID0+IGRlbmFtZXNwYWNlKGZ1bGx5UXVhbGlmaWVkQ2xhc3MpLnN0YXJ0c1dpdGgocHJlZml4KSlcbiAgICAgIC5maWx0ZXIoa2xhc3MgPT4gLTEgPT09IGtsYXNzLm5hbWUuaW5kZXhPZignJCcsIHByZWZpeC5sZW5ndGgpKSAvLyBSZW1vdmUgYW55IG5lc3RlZCBjbGFzc2VzIG9mIHRoZSBuZXN0ZWQgY2xhc3NcbiAgICAgIC5tYXAoZW50cnkgPT4gKHsgLi4uZW50cnksIF90eXBlOiAnY2xhc3MnIH0pKTtcbiAgfVxuXG4gIGdldChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBwcmVmaXgpIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLmVkaXRvclRva2Vucy5nZXQoZWRpdG9yKTtcbiAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKHRva2Vucyk7XG4gICAgY29uc3Qgc3VwZXJGdWxseVF1YWxpZmllZENsYXNzID0gdGhpcy5nZXRGdWxseVF1YWxpZmllZENsYXNzKGVkaXRvciwgc3VwZXJDbGFzcyk7XG5cbiAgICByZXR1cm4gW10uY29uY2F0KFxuICAgICAgdGhpcy5nZXRMb2NhbEZpZWxkU3VnZ2VzdGlvbnMoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4LCB0b2tlbnMpLFxuICAgICAgdGhpcy5nZXRJbmhlcml0ZWRGaWVsZFN1Z2dlc3Rpb25zKHByZWZpeCwgc3VwZXJGdWxseVF1YWxpZmllZENsYXNzKSxcbiAgICAgIHRoaXMuZ2V0TG9jYWxNZXRob2RTdWdnZXN0aW9ucyhlZGl0b3IsIHByZWZpeCwgdG9rZW5zKSxcbiAgICAgIHRoaXMuZ2V0SW5oZXJpdGVkTWV0aG9kU3VnZ2VzdGlvbnMocHJlZml4LCBzdXBlckZ1bGx5UXVhbGlmaWVkQ2xhc3MpLFxuICAgICAgdGhpcy5nZXRDbGFzc1N1Z2dlc3Rpb25zKHByZWZpeClcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCB7IFBsYWluRW50cnlGaW5kZXIgfTtcblxuIl19