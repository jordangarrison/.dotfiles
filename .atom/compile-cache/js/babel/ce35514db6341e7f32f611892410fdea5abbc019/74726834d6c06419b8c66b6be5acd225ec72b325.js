Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _parserJs = require('../parser.js');

var _parserJs2 = _interopRequireDefault(_parserJs);

var SECTION_PATTERN = /^\["([^"]+)"]/;
var GROUP_PATTERN = /^\s+\(([^)]+)\)/;
var FILE_PATTERN = /^\s+"([^"]*)"/;

var FdbParser = (function (_Parser) {
  _inherits(FdbParser, _Parser);

  function FdbParser() {
    _classCallCheck(this, FdbParser);

    _get(Object.getPrototypeOf(FdbParser.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FdbParser, [{
    key: 'parse',
    value: function parse() {
      var results = {};
      var section = undefined;
      var group = undefined;

      for (var line of this.getLines()) {
        var sectionMatch = line.match(SECTION_PATTERN);
        if (sectionMatch) {
          section = sectionMatch[1];
          results[section] = {};
          group = 'source';
          results[section][group] = [];
          continue;
        }

        if (!section) continue;

        var groupMatch = line.match(GROUP_PATTERN);
        if (groupMatch) {
          group = groupMatch[1];
          if (!results[section][group]) {
            results[section][group] = [];
          }
          continue;
        }

        if (!group) continue;

        var fileMatch = line.match(FILE_PATTERN);
        if (fileMatch) {
          results[section][group].push(fileMatch[1]);
        }
      }

      return results;
    }
  }]);

  return FdbParser;
})(_parserJs2['default']);

exports['default'] = FdbParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2Vycy9mZGItcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBRW1CLGNBQWM7Ozs7QUFFakMsSUFBTSxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBQ3ZDLElBQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFBO0FBQ3ZDLElBQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQTs7SUFFZixTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztlQUFULFNBQVM7O1dBQ3RCLGlCQUFHO0FBQ1AsVUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2hCLFVBQUksT0FBTyxZQUFBLENBQUE7QUFDWCxVQUFJLEtBQUssWUFBQSxDQUFBOztBQUVULFdBQUssSUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO0FBQ2xDLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDaEQsWUFBSSxZQUFZLEVBQUU7QUFDaEIsaUJBQU8sR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsaUJBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDckIsZUFBSyxHQUFHLFFBQVEsQ0FBQTtBQUNoQixpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUM1QixtQkFBUTtTQUNUOztBQUVELFlBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUTs7QUFFdEIsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM1QyxZQUFJLFVBQVUsRUFBRTtBQUNkLGVBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDckIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QixtQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtXQUM3QjtBQUNELG1CQUFRO1NBQ1Q7O0FBRUQsWUFBSSxDQUFDLEtBQUssRUFBRSxTQUFROztBQUVwQixZQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzFDLFlBQUksU0FBUyxFQUFFO0FBQ2IsaUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDM0M7T0FDRjs7QUFFRCxhQUFPLE9BQU8sQ0FBQTtLQUNmOzs7U0FwQ2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2Vycy9mZGItcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgUGFyc2VyIGZyb20gJy4uL3BhcnNlci5qcydcblxuY29uc3QgU0VDVElPTl9QQVRURVJOID0gL15cXFtcIihbXlwiXSspXCJdL1xuY29uc3QgR1JPVVBfUEFUVEVSTiA9IC9eXFxzK1xcKChbXildKylcXCkvXG5jb25zdCBGSUxFX1BBVFRFUk4gPSAvXlxccytcIihbXlwiXSopXCIvXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZkYlBhcnNlciBleHRlbmRzIFBhcnNlciB7XG4gIHBhcnNlICgpIHtcbiAgICBsZXQgcmVzdWx0cyA9IHt9XG4gICAgbGV0IHNlY3Rpb25cbiAgICBsZXQgZ3JvdXBcblxuICAgIGZvciAoY29uc3QgbGluZSBvZiB0aGlzLmdldExpbmVzKCkpIHtcbiAgICAgIGNvbnN0IHNlY3Rpb25NYXRjaCA9IGxpbmUubWF0Y2goU0VDVElPTl9QQVRURVJOKVxuICAgICAgaWYgKHNlY3Rpb25NYXRjaCkge1xuICAgICAgICBzZWN0aW9uID0gc2VjdGlvbk1hdGNoWzFdXG4gICAgICAgIHJlc3VsdHNbc2VjdGlvbl0gPSB7fVxuICAgICAgICBncm91cCA9ICdzb3VyY2UnXG4gICAgICAgIHJlc3VsdHNbc2VjdGlvbl1bZ3JvdXBdID0gW11cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFzZWN0aW9uKSBjb250aW51ZVxuXG4gICAgICBjb25zdCBncm91cE1hdGNoID0gbGluZS5tYXRjaChHUk9VUF9QQVRURVJOKVxuICAgICAgaWYgKGdyb3VwTWF0Y2gpIHtcbiAgICAgICAgZ3JvdXAgPSBncm91cE1hdGNoWzFdXG4gICAgICAgIGlmICghcmVzdWx0c1tzZWN0aW9uXVtncm91cF0pIHtcbiAgICAgICAgICByZXN1bHRzW3NlY3Rpb25dW2dyb3VwXSA9IFtdXG4gICAgICAgIH1cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFncm91cCkgY29udGludWVcblxuICAgICAgY29uc3QgZmlsZU1hdGNoID0gbGluZS5tYXRjaChGSUxFX1BBVFRFUk4pXG4gICAgICBpZiAoZmlsZU1hdGNoKSB7XG4gICAgICAgIHJlc3VsdHNbc2VjdGlvbl1bZ3JvdXBdLnB1c2goZmlsZU1hdGNoWzFdKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbn1cbiJdfQ==