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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var OUTPUT_PATTERN = new RegExp('' + '^Output\\swritten\\son\\s' + // Leading text.
'(.*)' + // Output path.
'\\s\\(.*\\)\\.$' // Trailing text.
);

// Error pattern
var ERROR_PATTERN = new RegExp('' + '^(?:(.*):(\\d+):|!)' + // File path and line number
'(?: (.+) Error:)? ' + // Error type
'(.+?)\\.?$' // Message text, the ending period is optional for MiKTeX
);

// Pattern for overfull/underfull boxes
var BOX_PATTERN = new RegExp('' + '^((?:Over|Under)full \\\\[vh]box \\([^)]*\\))' + // Message text
' in paragraph at lines (\\d+)--(\\d+)$' // Line range
);

// Warning and Info pattern
var WARNING_INFO_PATTERN = new RegExp('' + '^((?:(?:Class|Package) \\S+)|LaTeX|LaTeX Font) ' + // Message origin
'(Warning|Info):\\s+' + // Message type
'(.*?)' + // Message text
'(?: on input line (\\d+))?\\.$' // Line number
);

// Pattern for font messages that overflow onto the next line. We do not capture
// anything from the match, but we need to know where the error message is
// located in the log file.
var INCOMPLETE_FONT_PATTERN = /^LaTeX Font .*[^.]$/;

var LogParser = (function (_Parser) {
  _inherits(LogParser, _Parser);

  function LogParser(filePath, texFilePath) {
    _classCallCheck(this, LogParser);

    _get(Object.getPrototypeOf(LogParser.prototype), 'constructor', this).call(this, filePath);
    this.texFilePath = texFilePath;
    this.projectPath = _path2['default'].dirname(texFilePath);
  }

  _createClass(LogParser, [{
    key: 'parse',
    value: function parse() {
      var _this = this;

      var result = {
        logFilePath: this.filePath,
        outputFilePath: null,
        messages: []
      };

      var lines = this.getLines();
      lines.forEach(function (line, index) {
        // Simplest Thing That Works™ and KISS®
        var logRange = [[index, 0], [index, line.length]];
        var match = line.match(OUTPUT_PATTERN);
        if (match) {
          var filePath = match[1].replace(/"/g, ''); // TODO: Fix with improved regex.
          result.outputFilePath = _path2['default'].resolve(_this.projectPath, filePath);
          return;
        }

        match = line.match(ERROR_PATTERN);
        if (match) {
          var lineNumber = match[2] ? parseInt(match[2], 10) : undefined;
          result.messages.push({
            type: 'error',
            text: match[3] && match[3] !== 'LaTeX' ? match[3] + ': ' + match[4] : match[4],
            filePath: match[1] ? _path2['default'].resolve(_this.projectPath, match[1]) : _this.texFilePath,
            range: lineNumber ? [[lineNumber - 1, 0], [lineNumber - 1, 65536]] : undefined,
            logPath: _this.filePath,
            logRange: logRange
          });
          return;
        }

        match = line.match(BOX_PATTERN);
        if (match) {
          result.messages.push({
            type: 'warning',
            text: match[1],
            filePath: _this.texFilePath,
            range: [[parseInt(match[2], 10) - 1, 0], [parseInt(match[3], 10) - 1, 65536]],
            logPath: _this.filePath,
            logRange: logRange
          });
          return;
        }

        match = (INCOMPLETE_FONT_PATTERN.test(line) ? line + lines[index + 1].substring(15) : line).match(WARNING_INFO_PATTERN);
        if (match) {
          var lineNumber = match[4] ? parseInt(match[4], 10) : undefined;
          result.messages.push({
            type: match[2].toLowerCase(),
            text: (match[1] !== 'LaTeX' ? match[1] + ': ' + match[3] : match[3]).replace(/\s+/g, ' '),
            filePath: _this.texFilePath,
            range: lineNumber ? [[lineNumber - 1, 0], [lineNumber - 1, 65536]] : undefined,
            logPath: _this.filePath,
            logRange: logRange
          });
        }
      });

      return result;
    }
  }]);

  return LogParser;
})(_parserJs2['default']);

exports['default'] = LogParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2Vycy9sb2ctcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBRW1CLGNBQWM7Ozs7b0JBQ2hCLE1BQU07Ozs7QUFFdkIsSUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUNsQywyQkFBMkI7QUFDM0IsTUFBTTtBQUNOLGlCQUFpQjtDQUNsQixDQUFBOzs7QUFHRCxJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ2pDLHFCQUFxQjtBQUNyQixvQkFBb0I7QUFDcEIsWUFBWTtDQUNiLENBQUE7OztBQUdELElBQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsR0FDL0IsK0NBQStDO0FBQy9DLHdDQUF3QztDQUN6QyxDQUFBOzs7QUFHRCxJQUFNLG9CQUFvQixHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsR0FDeEMsaURBQWlEO0FBQ2pELHFCQUFxQjtBQUNyQixPQUFPO0FBQ1AsZ0NBQWdDO0NBQ2pDLENBQUE7Ozs7O0FBS0QsSUFBTSx1QkFBdUIsR0FBRyxxQkFBcUIsQ0FBQTs7SUFFaEMsU0FBUztZQUFULFNBQVM7O0FBQ2hCLFdBRE8sU0FBUyxDQUNmLFFBQVEsRUFBRSxXQUFXLEVBQUU7MEJBRGpCLFNBQVM7O0FBRTFCLCtCQUZpQixTQUFTLDZDQUVwQixRQUFRLEVBQUM7QUFDZixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixRQUFJLENBQUMsV0FBVyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtHQUM3Qzs7ZUFMa0IsU0FBUzs7V0FPdEIsaUJBQUc7OztBQUNQLFVBQU0sTUFBTSxHQUFHO0FBQ2IsbUJBQVcsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUMxQixzQkFBYyxFQUFFLElBQUk7QUFDcEIsZ0JBQVEsRUFBRSxFQUFFO09BQ2IsQ0FBQTs7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QUFFO0FBQ1QsY0FBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFBO0FBQ2hFLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztBQUNuQixnQkFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFDNUIsZ0JBQUksRUFBRSxDQUFDLEFBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sR0FBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBRSxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztBQUMzRixvQkFBUSxFQUFFLE1BQUssV0FBVztBQUMxQixpQkFBSyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxTQUFTO0FBQzlFLG1CQUFPLEVBQUUsTUFBSyxRQUFRO0FBQ3RCLG9CQUFRLEVBQUUsUUFBUTtXQUNuQixDQUFDLENBQUE7U0FDSDtPQUNGLENBQUMsQ0FBQTs7QUFFRixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7U0FuRWtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2Vycy9sb2ctcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgUGFyc2VyIGZyb20gJy4uL3BhcnNlci5qcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IE9VVFBVVF9QQVRURVJOID0gbmV3IFJlZ0V4cCgnJyArXG4gICdeT3V0cHV0XFxcXHN3cml0dGVuXFxcXHNvblxcXFxzJyArIC8vIExlYWRpbmcgdGV4dC5cbiAgJyguKiknICsgICAgICAgICAgICAgICAgICAgICAgLy8gT3V0cHV0IHBhdGguXG4gICdcXFxcc1xcXFwoLipcXFxcKVxcXFwuJCcgICAgICAgICAgICAgLy8gVHJhaWxpbmcgdGV4dC5cbilcblxuLy8gRXJyb3IgcGF0dGVyblxuY29uc3QgRVJST1JfUEFUVEVSTiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXig/OiguKik6KFxcXFxkKyk6fCEpJyArIC8vIEZpbGUgcGF0aCBhbmQgbGluZSBudW1iZXJcbiAgJyg/OiAoLispIEVycm9yOik/ICcgKyAgLy8gRXJyb3IgdHlwZVxuICAnKC4rPylcXFxcLj8kJyAgICAgICAgICAgLy8gTWVzc2FnZSB0ZXh0LCB0aGUgZW5kaW5nIHBlcmlvZCBpcyBvcHRpb25hbCBmb3IgTWlLVGVYXG4pXG5cbi8vIFBhdHRlcm4gZm9yIG92ZXJmdWxsL3VuZGVyZnVsbCBib3hlc1xuY29uc3QgQk9YX1BBVFRFUk4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ14oKD86T3ZlcnxVbmRlcilmdWxsIFxcXFxcXFxcW3ZoXWJveCBcXFxcKFteKV0qXFxcXCkpJyArIC8vIE1lc3NhZ2UgdGV4dFxuICAnIGluIHBhcmFncmFwaCBhdCBsaW5lcyAoXFxcXGQrKS0tKFxcXFxkKykkJyAgICAgICAgICAvLyBMaW5lIHJhbmdlXG4pXG5cbi8vIFdhcm5pbmcgYW5kIEluZm8gcGF0dGVyblxuY29uc3QgV0FSTklOR19JTkZPX1BBVFRFUk4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ14oKD86KD86Q2xhc3N8UGFja2FnZSkgXFxcXFMrKXxMYVRlWHxMYVRlWCBGb250KSAnICsgLy8gTWVzc2FnZSBvcmlnaW5cbiAgJyhXYXJuaW5nfEluZm8pOlxcXFxzKycgKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWVzc2FnZSB0eXBlXG4gICcoLio/KScgKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNZXNzYWdlIHRleHRcbiAgJyg/OiBvbiBpbnB1dCBsaW5lIChcXFxcZCspKT9cXFxcLiQnICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIG51bWJlclxuKVxuXG4vLyBQYXR0ZXJuIGZvciBmb250IG1lc3NhZ2VzIHRoYXQgb3ZlcmZsb3cgb250byB0aGUgbmV4dCBsaW5lLiBXZSBkbyBub3QgY2FwdHVyZVxuLy8gYW55dGhpbmcgZnJvbSB0aGUgbWF0Y2gsIGJ1dCB3ZSBuZWVkIHRvIGtub3cgd2hlcmUgdGhlIGVycm9yIG1lc3NhZ2UgaXNcbi8vIGxvY2F0ZWQgaW4gdGhlIGxvZyBmaWxlLlxuY29uc3QgSU5DT01QTEVURV9GT05UX1BBVFRFUk4gPSAvXkxhVGVYIEZvbnQgLipbXi5dJC9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nUGFyc2VyIGV4dGVuZHMgUGFyc2VyIHtcbiAgY29uc3RydWN0b3IgKGZpbGVQYXRoLCB0ZXhGaWxlUGF0aCkge1xuICAgIHN1cGVyKGZpbGVQYXRoKVxuICAgIHRoaXMudGV4RmlsZVBhdGggPSB0ZXhGaWxlUGF0aFxuICAgIHRoaXMucHJvamVjdFBhdGggPSBwYXRoLmRpcm5hbWUodGV4RmlsZVBhdGgpXG4gIH1cblxuICBwYXJzZSAoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgbG9nRmlsZVBhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICBvdXRwdXRGaWxlUGF0aDogbnVsbCxcbiAgICAgIG1lc3NhZ2VzOiBbXVxuICAgIH1cblxuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5nZXRMaW5lcygpXG4gICAgbGluZXMuZm9yRWFjaCgobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIC8vIFNpbXBsZXN0IFRoaW5nIFRoYXQgV29ya3PihKIgYW5kIEtJU1PCrlxuICAgICAgY29uc3QgbG9nUmFuZ2UgPSBbW2luZGV4LCAwXSwgW2luZGV4LCBsaW5lLmxlbmd0aF1dXG4gICAgICBsZXQgbWF0Y2ggPSBsaW5lLm1hdGNoKE9VVFBVVF9QQVRURVJOKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gbWF0Y2hbMV0ucmVwbGFjZSgvXCIvZywgJycpIC8vIFRPRE86IEZpeCB3aXRoIGltcHJvdmVkIHJlZ2V4LlxuICAgICAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSBwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBtYXRjaCA9IGxpbmUubWF0Y2goRVJST1JfUEFUVEVSTilcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBsaW5lTnVtYmVyID0gbWF0Y2hbMl0gPyBwYXJzZUludChtYXRjaFsyXSwgMTApIDogdW5kZWZpbmVkXG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIHRleHQ6IChtYXRjaFszXSAmJiBtYXRjaFszXSAhPT0gJ0xhVGVYJykgPyBtYXRjaFszXSArICc6ICcgKyBtYXRjaFs0XSA6IG1hdGNoWzRdLFxuICAgICAgICAgIGZpbGVQYXRoOiBtYXRjaFsxXSA/IHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3RQYXRoLCBtYXRjaFsxXSkgOiB0aGlzLnRleEZpbGVQYXRoLFxuICAgICAgICAgIHJhbmdlOiBsaW5lTnVtYmVyID8gW1tsaW5lTnVtYmVyIC0gMSwgMF0sIFtsaW5lTnVtYmVyIC0gMSwgNjU1MzZdXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBsb2dQYXRoOiB0aGlzLmZpbGVQYXRoLFxuICAgICAgICAgIGxvZ1JhbmdlOiBsb2dSYW5nZVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBsaW5lLm1hdGNoKEJPWF9QQVRURVJOKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGV4dDogbWF0Y2hbMV0sXG4gICAgICAgICAgZmlsZVBhdGg6IHRoaXMudGV4RmlsZVBhdGgsXG4gICAgICAgICAgcmFuZ2U6IFtbcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDEsIDBdLCBbcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDEsIDY1NTM2XV0sXG4gICAgICAgICAgbG9nUGF0aDogdGhpcy5maWxlUGF0aCxcbiAgICAgICAgICBsb2dSYW5nZTogbG9nUmFuZ2VcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gKElOQ09NUExFVEVfRk9OVF9QQVRURVJOLnRlc3QobGluZSkgPyBsaW5lICsgbGluZXNbaW5kZXggKyAxXS5zdWJzdHJpbmcoMTUpIDogbGluZSkubWF0Y2goV0FSTklOR19JTkZPX1BBVFRFUk4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IG1hdGNoWzRdID8gcGFyc2VJbnQobWF0Y2hbNF0sIDEwKSA6IHVuZGVmaW5lZFxuICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogbWF0Y2hbMl0udG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICB0ZXh0OiAoKG1hdGNoWzFdICE9PSAnTGFUZVgnKSA/IG1hdGNoWzFdICsgJzogJyArIG1hdGNoWzNdIDogbWF0Y2hbM10pLnJlcGxhY2UoL1xccysvZywgJyAnKSxcbiAgICAgICAgICBmaWxlUGF0aDogdGhpcy50ZXhGaWxlUGF0aCxcbiAgICAgICAgICByYW5nZTogbGluZU51bWJlciA/IFtbbGluZU51bWJlciAtIDEsIDBdLCBbbGluZU51bWJlciAtIDEsIDY1NTM2XV0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgbG9nUGF0aDogdGhpcy5maWxlUGF0aCxcbiAgICAgICAgICBsb2dSYW5nZTogbG9nUmFuZ2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG4iXX0=