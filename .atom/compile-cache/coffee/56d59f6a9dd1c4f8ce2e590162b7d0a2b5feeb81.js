(function() {
  var Parser, Variable;

  Variable = require('./variable');

  module.exports = Parser = (function() {
    function Parser() {}

    Parser.prototype.varRegexArray = /(public|private|protected)\s*(static)?\s*(final)?\s*(volatile|transient)?\s*([a-zA-Z0-9_$]+)\s*(\<.*\>)*\s*([a-zA-Z0-9_$]+)(\(.*\))?/g;

    Parser.prototype.varRegex = /(public|private|protected)\s*(static)?\s*(final)?\s*(volatile|transient)?\s*([a-zA-Z0-9_$]+)\s*(\<.*\>)*\s*([a-zA-Z0-9_$]+)(\(.*\))?/;

    Parser.prototype.methodRegex = /\(([a-zA-Z0-9_$\<\>\.\,\s]+)?\)/;

    Parser.prototype.classNameRegex = /(?:class)\s+([a-zA-Z0-9_$]+)/;

    Parser.prototype.classRegex = /class/;

    Parser.prototype.finalRegex = /^final$/;

    Parser.prototype.staticRegex = /^static$/;

    Parser.prototype.typeParameterRegex = /^\<.*\>$/;

    Parser.prototype.content = '';

    Parser.prototype.setContent = function(content) {
      this.content = content;
    };

    Parser.prototype.getContent = function() {
      return this.content;
    };

    Parser.prototype.getVars = function() {
      var group, i, isFinal, isStatic, len, line, type, varLines, variable, variables;
      varLines = this.content.match(this.varRegexArray);
      if (!varLines) {
        alert('No variables were found.');
        return {};
      }
      variables = [];
      for (i = 0, len = varLines.length; i < len; i++) {
        line = varLines[i];
        if (!this.methodRegex.test(line) && !this.classRegex.test(line)) {
          group = this.varRegex.exec(line);
          if (group !== null) {
            isStatic = false;
            isFinal = false;
            type = group[5];
            if (group[2] !== null && this.staticRegex.test(group[2])) {
              isStatic = true;
            }
            if (group[3] !== null && this.finalRegex.test(group[3])) {
              isFinal = true;
            }
            if (group[6] !== null && this.typeParameterRegex.test(group[6])) {
              type = type + group[6];
            }
            variable = new Variable(group[7], type, isStatic, isFinal);
            variables.push(variable);
          }
        }
      }
      return variables;
    };

    Parser.prototype.getClassName = function() {
      var match;
      match = this.content.match(this.classNameRegex);
      return match[1];
    };

    return Parser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2phdmEtZ2VuZXJhdG9yLXBsdXMvbGliL3BhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7cUJBQ0YsYUFBQSxHQUFlOztxQkFDZixRQUFBLEdBQVU7O3FCQUNWLFdBQUEsR0FBYTs7cUJBQ2IsY0FBQSxHQUFnQjs7cUJBQ2hCLFVBQUEsR0FBWTs7cUJBQ1osVUFBQSxHQUFZOztxQkFDWixXQUFBLEdBQWE7O3FCQUNiLGtCQUFBLEdBQW9COztxQkFDcEIsT0FBQSxHQUFTOztxQkFFVCxVQUFBLEdBQVksU0FBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7SUFBRDs7cUJBRVosVUFBQSxHQUFZLFNBQUE7QUFDUixhQUFPLElBQUMsQ0FBQTtJQURBOztxQkFHWixPQUFBLEdBQVMsU0FBQTtBQUVMLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQWUsSUFBQyxDQUFBLGFBQWhCO01BR1gsSUFBRyxDQUFFLFFBQUw7UUFDSSxLQUFBLENBQU8sMEJBQVA7QUFDQSxlQUFPLEdBRlg7O01BSUEsU0FBQSxHQUFZO0FBQ1osV0FBQSwwQ0FBQTs7UUFFSSxJQUFHLENBQUUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLElBQWxCLENBQUYsSUFBNkIsQ0FBRSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakIsQ0FBbEM7VUFDSSxLQUFBLEdBQVEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBZjtVQUNSLElBQUcsS0FBQSxLQUFTLElBQVo7WUFDSSxRQUFBLEdBQVc7WUFDWCxPQUFBLEdBQVU7WUFDVixJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUE7WUFHYixJQUFHLEtBQU0sQ0FBQSxDQUFBLENBQU4sS0FBWSxJQUFaLElBQW9CLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUF4QixDQUF2QjtjQUNJLFFBQUEsR0FBVyxLQURmOztZQUlBLElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBTixLQUFZLElBQVosSUFBb0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFaLENBQWlCLEtBQU0sQ0FBQSxDQUFBLENBQXZCLENBQXZCO2NBQ0ksT0FBQSxHQUFVLEtBRGQ7O1lBR0EsSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFOLEtBQVksSUFBWixJQUFvQixJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBeUIsS0FBTSxDQUFBLENBQUEsQ0FBL0IsQ0FBdkI7Y0FDSSxJQUFBLEdBQU8sSUFBQSxHQUFPLEtBQU0sQ0FBQSxDQUFBLEVBRHhCOztZQUlBLFFBQUEsR0FBZSxJQUFBLFFBQUEsQ0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLEVBQW1CLElBQW5CLEVBQXlCLFFBQXpCLEVBQW1DLE9BQW5DO1lBQ2YsU0FBUyxDQUFDLElBQVYsQ0FBZ0IsUUFBaEIsRUFsQko7V0FGSjs7QUFGSjtBQXdCQSxhQUFPO0lBbENGOztxQkFvQ1QsWUFBQSxHQUFjLFNBQUE7QUFFVixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFlLElBQUMsQ0FBQSxjQUFoQjtBQUNSLGFBQU8sS0FBTSxDQUFBLENBQUE7SUFISDs7Ozs7QUF2RGxCIiwic291cmNlc0NvbnRlbnQiOlsiVmFyaWFibGUgPSByZXF1aXJlICcuL3ZhcmlhYmxlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQYXJzZXJcbiAgICB2YXJSZWdleEFycmF5OiAvKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClcXHMqKHN0YXRpYyk/XFxzKihmaW5hbCk/XFxzKih2b2xhdGlsZXx0cmFuc2llbnQpP1xccyooW2EtekEtWjAtOV8kXSspXFxzKihcXDwuKlxcPikqXFxzKihbYS16QS1aMC05XyRdKykoXFwoLipcXCkpPy9nXG4gICAgdmFyUmVnZXg6IC8ocHVibGljfHByaXZhdGV8cHJvdGVjdGVkKVxccyooc3RhdGljKT9cXHMqKGZpbmFsKT9cXHMqKHZvbGF0aWxlfHRyYW5zaWVudCk/XFxzKihbYS16QS1aMC05XyRdKylcXHMqKFxcPC4qXFw+KSpcXHMqKFthLXpBLVowLTlfJF0rKShcXCguKlxcKSk/L1xuICAgIG1ldGhvZFJlZ2V4OiAvXFwoKFthLXpBLVowLTlfJFxcPFxcPlxcLlxcLFxcc10rKT9cXCkvXG4gICAgY2xhc3NOYW1lUmVnZXg6IC8oPzpjbGFzcylcXHMrKFthLXpBLVowLTlfJF0rKS9cbiAgICBjbGFzc1JlZ2V4OiAvY2xhc3MvXG4gICAgZmluYWxSZWdleDogL15maW5hbCQvXG4gICAgc3RhdGljUmVnZXg6IC9ec3RhdGljJC9cbiAgICB0eXBlUGFyYW1ldGVyUmVnZXg6IC9eXFw8LipcXD4kL1xuICAgIGNvbnRlbnQ6ICcnXG5cbiAgICBzZXRDb250ZW50OiAoQGNvbnRlbnQpIC0+XG5cbiAgICBnZXRDb250ZW50OiAtPlxuICAgICAgICByZXR1cm4gQGNvbnRlbnRcblxuICAgIGdldFZhcnM6IC0+XG4gICAgICAgICMgRmluZCBsaW5lcyB3aXRoIHZhcmlhYmxlc1xuICAgICAgICB2YXJMaW5lcyA9IEBjb250ZW50Lm1hdGNoKEB2YXJSZWdleEFycmF5KVxuXG4gICAgICAgICMgQ2hlY2sgaWYgYW55IHdlcmUgZm91bmRcbiAgICAgICAgaWYgISB2YXJMaW5lc1xuICAgICAgICAgICAgYWxlcnQgKCdObyB2YXJpYWJsZXMgd2VyZSBmb3VuZC4nKVxuICAgICAgICAgICAgcmV0dXJuIHt9XG5cbiAgICAgICAgdmFyaWFibGVzID0gW11cbiAgICAgICAgZm9yIGxpbmUgaW4gdmFyTGluZXNcbiAgICAgICAgICAgICMgU2tpcCBtZXRob2QgYW5kIGNsYXNzIGRlY2xhcmF0aW9uc1xuICAgICAgICAgICAgaWYgISBAbWV0aG9kUmVnZXgudGVzdChsaW5lKSAmJiAhIEBjbGFzc1JlZ2V4LnRlc3QobGluZSlcbiAgICAgICAgICAgICAgICBncm91cCA9IEB2YXJSZWdleC5leGVjKGxpbmUpXG4gICAgICAgICAgICAgICAgaWYgZ3JvdXAgIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICBpc1N0YXRpYyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIGlzRmluYWwgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gZ3JvdXBbNV1cblxuICAgICAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHN0YXRpY1xuICAgICAgICAgICAgICAgICAgICBpZiBncm91cFsyXSAhPSBudWxsICYmIEBzdGF0aWNSZWdleC50ZXN0KGdyb3VwWzJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTdGF0aWMgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgIyBDaGVjayBpZiBmaW5hbFxuICAgICAgICAgICAgICAgICAgICBpZiBncm91cFszXSAhPSBudWxsICYmIEBmaW5hbFJlZ2V4LnRlc3QoZ3JvdXBbM10pXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0ZpbmFsID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIGdyb3VwWzZdICE9IG51bGwgJiYgQHR5cGVQYXJhbWV0ZXJSZWdleC50ZXN0KGdyb3VwWzZdKVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHR5cGUgKyBncm91cFs2XVxuXG4gICAgICAgICAgICAgICAgICAgICMgQ3JlYXRlIHZhcmlhYmxlIGFuZCBzdG9yZSBpdFxuICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShncm91cFs3XSwgdHlwZSwgaXNTdGF0aWMsIGlzRmluYWwpXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlcy5wdXNoICh2YXJpYWJsZSlcblxuICAgICAgICByZXR1cm4gdmFyaWFibGVzXG5cbiAgICBnZXRDbGFzc05hbWU6IC0+XG4gICAgICAgICMgRmluZCBjbGFzcyBuYW1lIGFuZCByZXR1cm4gaXRcbiAgICAgICAgbWF0Y2ggPSBAY29udGVudC5tYXRjaChAY2xhc3NOYW1lUmVnZXgpXG4gICAgICAgIHJldHVybiBtYXRjaFsxXVxuIl19
