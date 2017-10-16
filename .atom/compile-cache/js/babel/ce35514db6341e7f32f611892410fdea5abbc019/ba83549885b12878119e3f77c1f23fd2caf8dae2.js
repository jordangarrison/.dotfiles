Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var Parser = (function () {
  function Parser(filePath) {
    _classCallCheck(this, Parser);

    this.filePath = filePath;
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse() {}
  }, {
    key: 'getLines',
    value: function getLines(defaultLines) {
      if (!_fsPlus2['default'].existsSync(this.filePath)) {
        if (defaultLines) return defaultLines;
        throw new Error('No such file: ' + this.filePath);
      }

      var rawFile = _fsPlus2['default'].readFileSync(this.filePath, { encoding: 'utf-8' });
      var lines = rawFile.replace(/(\r\n)|\r/g, '\n').split('\n');
      return lines;
    }
  }]);

  return Parser;
})();

exports['default'] = Parser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O0lBRUgsTUFBTTtBQUNiLFdBRE8sTUFBTSxDQUNaLFFBQVEsRUFBRTswQkFESixNQUFNOztBQUV2QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtHQUN6Qjs7ZUFIa0IsTUFBTTs7V0FLbkIsaUJBQUcsRUFBRTs7O1dBRUYsa0JBQUMsWUFBWSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLFlBQUksWUFBWSxFQUFFLE9BQU8sWUFBWSxDQUFBO0FBQ3JDLGNBQU0sSUFBSSxLQUFLLG9CQUFrQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUE7T0FDbEQ7O0FBRUQsVUFBTSxPQUFPLEdBQUcsb0JBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtBQUNuRSxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDN0QsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1NBaEJrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlciB7XG4gIGNvbnN0cnVjdG9yIChmaWxlUGF0aCkge1xuICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aFxuICB9XG5cbiAgcGFyc2UgKCkge31cblxuICBnZXRMaW5lcyAoZGVmYXVsdExpbmVzKSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpKSB7XG4gICAgICBpZiAoZGVmYXVsdExpbmVzKSByZXR1cm4gZGVmYXVsdExpbmVzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHN1Y2ggZmlsZTogJHt0aGlzLmZpbGVQYXRofWApXG4gICAgfVxuXG4gICAgY29uc3QgcmF3RmlsZSA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLmZpbGVQYXRoLCB7ZW5jb2Rpbmc6ICd1dGYtOCd9KVxuICAgIGNvbnN0IGxpbmVzID0gcmF3RmlsZS5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgJ1xcbicpLnNwbGl0KCdcXG4nKVxuICAgIHJldHVybiBsaW5lc1xuICB9XG59XG4iXX0=