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

var MAGIC_COMMENT_PATTERN = new RegExp('' + '^%\\s*' + // Optional whitespace.
'!T[Ee]X' + // Magic marker.
'\\s+' + // Semi-optional whitespace.
'(\\w+)' + // [1] Captures the magic keyword. E.g. 'root'.
'\\s*=\\s*' + // Equal sign wrapped in optional whitespace.
'(.*)' + // [2] Captures everything following the equal sign.
'$' // EOL.
);

var LATEX_COMMAND_PATTERN = new RegExp('' + '\\' + // starting command \
'\\w+' + // command name e.g. input
'(\\{|\\w|\\}|/|\\]|\\[)*' // options to the command
);

var MagicParser = (function (_Parser) {
  _inherits(MagicParser, _Parser);

  function MagicParser() {
    _classCallCheck(this, MagicParser);

    _get(Object.getPrototypeOf(MagicParser.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MagicParser, [{
    key: 'parse',
    value: function parse() {
      var result = {};
      var lines = this.getLines([]);
      for (var line of lines) {
        var latexCommandMatch = line.match(LATEX_COMMAND_PATTERN);
        if (latexCommandMatch) {
          break;
        } // Stop parsing if a latex command was found

        var match = line.match(MAGIC_COMMENT_PATTERN);
        if (match != null) {
          result[match[1]] = match[2].trim();
        }
      }

      return result;
    }
  }]);

  return MagicParser;
})(_parserJs2['default']);

exports['default'] = MagicParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2Vycy9tYWdpYy1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFFbUIsY0FBYzs7OztBQUVqQyxJQUFNLHFCQUFxQixHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsR0FDekMsUUFBUTtBQUNSLFNBQVM7QUFDVCxNQUFNO0FBQ04sUUFBUTtBQUNSLFdBQVc7QUFDWCxNQUFNO0FBQ04sR0FBRztDQUNKLENBQUE7O0FBRUQsSUFBTSxxQkFBcUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ3pDLElBQUk7QUFDSixNQUFNO0FBQ04sMEJBQTBCO0NBQzNCLENBQUE7O0lBRW9CLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7O2VBQVgsV0FBVzs7V0FDeEIsaUJBQUc7QUFDUCxVQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDakIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUMvQixXQUFLLElBQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN4QixZQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUMzRCxZQUFJLGlCQUFpQixFQUFFO0FBQUUsZ0JBQUs7U0FBRTs7QUFFaEMsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQy9DLFlBQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUNqQixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNuQztPQUNGOztBQUVELGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztTQWZrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgUGFyc2VyIGZyb20gJy4uL3BhcnNlci5qcydcblxuY29uc3QgTUFHSUNfQ09NTUVOVF9QQVRURVJOID0gbmV3IFJlZ0V4cCgnJyArXG4gICdeJVxcXFxzKicgKyAgICAvLyBPcHRpb25hbCB3aGl0ZXNwYWNlLlxuICAnIVRbRWVdWCcgKyAgIC8vIE1hZ2ljIG1hcmtlci5cbiAgJ1xcXFxzKycgKyAgICAgIC8vIFNlbWktb3B0aW9uYWwgd2hpdGVzcGFjZS5cbiAgJyhcXFxcdyspJyArICAgIC8vIFsxXSBDYXB0dXJlcyB0aGUgbWFnaWMga2V5d29yZC4gRS5nLiAncm9vdCcuXG4gICdcXFxccyo9XFxcXHMqJyArIC8vIEVxdWFsIHNpZ24gd3JhcHBlZCBpbiBvcHRpb25hbCB3aGl0ZXNwYWNlLlxuICAnKC4qKScgKyAgICAgIC8vIFsyXSBDYXB0dXJlcyBldmVyeXRoaW5nIGZvbGxvd2luZyB0aGUgZXF1YWwgc2lnbi5cbiAgJyQnICAgICAgICAgICAvLyBFT0wuXG4pXG5cbmNvbnN0IExBVEVYX0NPTU1BTkRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXFxcXCcgKyAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFydGluZyBjb21tYW5kIFxcXG4gICdcXFxcdysnICsgICAgICAgICAgICAgICAgICAgIC8vIGNvbW1hbmQgbmFtZSBlLmcuIGlucHV0XG4gICcoXFxcXHt8XFxcXHd8XFxcXH18L3xcXFxcXXxcXFxcWykqJyAgLy8gb3B0aW9ucyB0byB0aGUgY29tbWFuZFxuKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWdpY1BhcnNlciBleHRlbmRzIFBhcnNlciB7XG4gIHBhcnNlICgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fVxuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5nZXRMaW5lcyhbXSlcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgIGNvbnN0IGxhdGV4Q29tbWFuZE1hdGNoID0gbGluZS5tYXRjaChMQVRFWF9DT01NQU5EX1BBVFRFUk4pXG4gICAgICBpZiAobGF0ZXhDb21tYW5kTWF0Y2gpIHsgYnJlYWsgfSAvLyBTdG9wIHBhcnNpbmcgaWYgYSBsYXRleCBjb21tYW5kIHdhcyBmb3VuZFxuXG4gICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goTUFHSUNfQ09NTUVOVF9QQVRURVJOKVxuICAgICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgICAgcmVzdWx0W21hdGNoWzFdXSA9IG1hdGNoWzJdLnRyaW0oKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuIl19