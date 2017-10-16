'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function denamespace(klass) {
  return klass.substr(klass.lastIndexOf('.') + 1);
}

function packagify(klass) {
  return klass.substr(0, klass.lastIndexOf('.'));
}

/**
 * Returns the name from a method identifier.
 * e.g. `someMethod(String arg1)` => `someMethod`
 */
function nameify(methodIdentifier) {
  return methodIdentifier.match(/^([^\(]*).*$/)[1];
}

function filterFalsyArray(entries) {
  return entries.filter(Boolean);
}

/**
 * Extracts the dot chain which ends at the end of `code`.
 *
 * ```
 * SomeCode;
 * OtherCode.methods();
 * return this.is(Some.Argument).
 *   a.dotChain("this is a string!").ne<Cursor>
 * ```
 * Would extract `this.is(Some.Argument).a.dotChain("this is a string!").ne`
 */
function extractDotChain(code) {
  var result = [];

  var parensDepth = 0;
  var quoted = false;
  var transitioning = false;
  var hasDot = false;
  for (var i = code.length - 1; i >= 0; i--) {
    var char = code[i];
    var isWhitespace = /\s/.test(char);
    var isDot = '.' === char;

    switch (char) {
      case '"':
        if (code[i - 1] !== '\\') quoted = !quoted;
        break;

      case ')':
        // Traversing backwards, this increases depth
        if (!quoted) parensDepth++;
        break;

      case '(':
        // Traversing backwards, this decreases depth
        if (!quoted) parensDepth--;
        break;
    }

    if (quoted) {
      // Anything goes here
      result.unshift(char);
      continue;
    }

    if (parensDepth < 0) {
      // This means we reached a (, without a ) first
      break;
    }

    if (parensDepth > 0 || '(' === char) {
      // Anything goes here, but skip whitespaces for convenience
      if (!isWhitespace) {
        result.unshift(char);
      }
      continue;
    }

    if (transitioning && isWhitespace) {
      continue;
    }

    if (-1 !== [';', '{', '('].indexOf(char) && !quoted && parensDepth === 0) {
      break;
    }

    if (transitioning && !isWhitespace && !hasDot && !isDot) {
      // Previous was white space, this is not a whitespace and there has not been a dot.
      // This must be the end of the dotchain
      if (char === 'w' && code[i - 1] === 'e' && code[i - 2] === 'n') {
        // Include the keyword `new` so it can later be identified that this is a constructor.
        result.unshift('n', 'e', 'w', ' ');
      }
      break;
    }

    transitioning = isWhitespace || isDot;
    hasDot = isDot;
    if (!isWhitespace) {
      result.unshift(char);
    }
  }

  return result.join('');
}

/**
 * Parses a Java Dot chain, like
 * `Root.Class.method().other("args etc, with dots.", Other.Thing.class)`
 * Into an array which is split on the "top level dots", that is
 * [ 'Root', 'Class', 'method()', 'other("args etc, with dots.", Other.Thing.class)' ]
 */
function parseDotChain(dotChain) {
  var parts = [];

  var parensDepth = 0;
  var quoted = false;
  var current = '';
  for (var char of dotChain) {
    current += char;
    switch (char) {
      case '"':
        if (current[current.length - 2] !== '\\') quoted = !quoted;
        break;

      case '(':
        if (!quoted) parensDepth++;
        break;

      case ')':
        if (!quoted) parensDepth--;
        break;

      case '.':
        if (parensDepth === 0 && !quoted) {
          parts.push(current.slice(0, -1)); // Skip the dot
          current = '';
        }
        break;
    }
  }

  if (parensDepth > 0 || quoted) {
    // This is not a complete dotChain. We are in a parenthesis or quotes. Do nothing
    return [];
  }

  // Push the final part
  parts.push(current);

  return parts;
}

exports.denamespace = denamespace;
exports.packagify = packagify;
exports.nameify = nameify;
exports.filterFalsyArray = filterFalsyArray;
exports.extractDotChain = extractDotChain;
exports.parseDotChain = parseDotChain;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvdXRpbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O0FBRVosU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQzFCLFNBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2pEOztBQUVELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN4QixTQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztDQUNoRDs7Ozs7O0FBTUQsU0FBUyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7QUFDakMsU0FBTyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDbEQ7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7QUFDakMsU0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2hDOzs7Ozs7Ozs7Ozs7O0FBYUQsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQzdCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsTUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLE1BQUksTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNuQixNQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ25CLE9BQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxRQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENB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M0IsY0FBTTs7QUFBQSxBQUVSLFdBQUssR0FBRztBQUNOLFlBQUksV0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoQyxlQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxpQkFBTyxHQUFHLEVBQUUsQ0FBQztTQUNkO0FBQ0QsY0FBTTtBQUFBLEtBQ1Q7R0FDRjs7QUFFRCxNQUFJLFdBQVcsR0FBRyxDQUFDLElBQUksTUFBTSxFQUFFOztBQUU3QixXQUFPLEVBQUUsQ0FBQztHQUNYOzs7QUFHRCxPQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVwQixTQUFPLEtBQUssQ0FBQztDQUNkOztRQUdDLFdBQVcsR0FBWCxXQUFXO1FBQ1gsU0FBUyxHQUFULFNBQVM7UUFDVCxPQUFPLEdBQVAsT0FBTztRQUNQLGdCQUFnQixHQUFoQixnQkFBZ0I7UUFDaEIsZUFBZSxHQUFmLGVBQWU7UUFDZixhQUFhLEdBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWphdmEtbWludXMvbGliL3V0aWwvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZnVuY3Rpb24gZGVuYW1lc3BhY2Uoa2xhc3MpIHtcbiAgcmV0dXJuIGtsYXNzLnN1YnN0cihrbGFzcy5sYXN0SW5kZXhPZignLicpICsgMSk7XG59XG5cbmZ1bmN0aW9uIHBhY2thZ2lmeShrbGFzcykge1xuICByZXR1cm4ga2xhc3Muc3Vic3RyKDAsIGtsYXNzLmxhc3RJbmRleE9mKCcuJykpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIG5hbWUgZnJvbSBhIG1ldGhvZCBpZGVudGlmaWVyLlxuICogZS5nLiBgc29tZU1ldGhvZChTdHJpbmcgYXJnMSlgID0+IGBzb21lTWV0aG9kYFxuICovXG5mdW5jdGlvbiBuYW1laWZ5KG1ldGhvZElkZW50aWZpZXIpIHtcbiAgcmV0dXJuIG1ldGhvZElkZW50aWZpZXIubWF0Y2goL14oW15cXChdKikuKiQvKVsxXTtcbn1cblxuZnVuY3Rpb24gZmlsdGVyRmFsc3lBcnJheShlbnRyaWVzKSB7XG4gIHJldHVybiBlbnRyaWVzLmZpbHRlcihCb29sZWFuKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgZG90IGNoYWluIHdoaWNoIGVuZHMgYXQgdGhlIGVuZCBvZiBgY29kZWAuXG4gKlxuICogYGBgXG4gKiBTb21lQ29kZTtcbiAqIE90aGVyQ29kZS5tZXRob2RzKCk7XG4gKiByZXR1cm4gdGhpcy5pcyhTb21lLkFyZ3VtZW50KS5cbiAqICAgYS5kb3RDaGFpbihcInRoaXMgaXMgYSBzdHJpbmchXCIpLm5lPEN1cnNvcj5cbiAqIGBgYFxuICogV291bGQgZXh0cmFjdCBgdGhpcy5pcyhTb21lLkFyZ3VtZW50KS5hLmRvdENoYWluKFwidGhpcyBpcyBhIHN0cmluZyFcIikubmVgXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3REb3RDaGFpbihjb2RlKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gIGxldCBwYXJlbnNEZXB0aCA9IDA7XG4gIGxldCBxdW90ZWQgPSBmYWxzZTtcbiAgbGV0IHRyYW5zaXRpb25pbmcgPSBmYWxzZTtcbiAgbGV0IGhhc0RvdCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gY29kZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGNoYXIgPSBjb2RlW2ldO1xuICAgIGNvbnN0IGlzV2hpdGVzcGFjZSA9IC9cXHMvLnRlc3QoY2hhcik7XG4gICAgY29uc3QgaXNEb3QgPSAnLicgPT09IGNoYXI7XG5cbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgaWYgKGNvZGVbaSAtIDFdICE9PSAnXFxcXCcpIHF1b3RlZCA9ICFxdW90ZWQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICcpJzogLy8gVHJhdmVyc2luZyBiYWNrd2FyZHMsIHRoaXMgaW5jcmVhc2VzIGRlcHRoXG4gICAgICAgIGlmICghcXVvdGVkKSBwYXJlbnNEZXB0aCsrO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnKCc6IC8vIFRyYXZlcnNpbmcgYmFja3dhcmRzLCB0aGlzIGRlY3JlYXNlcyBkZXB0aFxuICAgICAgICBpZiAoIXF1b3RlZCkgcGFyZW5zRGVwdGgtLTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHF1b3RlZCkge1xuICAgICAgLy8gQW55dGhpbmcgZ29lcyBoZXJlXG4gICAgICByZXN1bHQudW5zaGlmdChjaGFyKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnNEZXB0aCA8IDApIHtcbiAgICAgIC8vIFRoaXMgbWVhbnMgd2UgcmVhY2hlZCBhICgsIHdpdGhvdXQgYSApIGZpcnN0XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAocGFyZW5zRGVwdGggPiAwIHx8ICcoJyA9PT0gY2hhcikge1xuICAgICAgLy8gQW55dGhpbmcgZ29lcyBoZXJlLCBidXQgc2tpcCB3aGl0ZXNwYWNlcyBmb3IgY29udmVuaWVuY2VcbiAgICAgIGlmICghaXNXaGl0ZXNwYWNlKSB7XG4gICAgICAgIHJlc3VsdC51bnNoaWZ0KGNoYXIpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRyYW5zaXRpb25pbmcgJiYgaXNXaGl0ZXNwYWNlKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoLTEgIT09IFsgJzsnLCAneycsICcoJyBdLmluZGV4T2YoY2hhcikgJiYgIXF1b3RlZCAmJiBwYXJlbnNEZXB0aCA9PT0gMCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHRyYW5zaXRpb25pbmcgJiYgIWlzV2hpdGVzcGFjZSAmJiAhaGFzRG90ICYmICFpc0RvdCkge1xuICAgICAgLy8gUHJldmlvdXMgd2FzIHdoaXRlIHNwYWNlLCB0aGlzIGlzIG5vdCBhIHdoaXRlc3BhY2UgYW5kIHRoZXJlIGhhcyBub3QgYmVlbiBhIGRvdC5cbiAgICAgIC8vIFRoaXMgbXVzdCBiZSB0aGUgZW5kIG9mIHRoZSBkb3RjaGFpblxuICAgICAgaWYgKGNoYXIgPT09ICd3JyAmJiBjb2RlW2kgLSAxXSA9PT0gJ2UnICYmIGNvZGVbaSAtIDJdID09PSAnbicpIHtcbiAgICAgICAgLy8gSW5jbHVkZSB0aGUga2V5d29yZCBgbmV3YCBzbyBpdCBjYW4gbGF0ZXIgYmUgaWRlbnRpZmllZCB0aGF0IHRoaXMgaXMgYSBjb25zdHJ1Y3Rvci5cbiAgICAgICAgcmVzdWx0LnVuc2hpZnQoJ24nLCAnZScsICd3JywgJyAnKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRyYW5zaXRpb25pbmcgPSBpc1doaXRlc3BhY2UgfHwgaXNEb3Q7XG4gICAgaGFzRG90ID0gaXNEb3Q7XG4gICAgaWYgKCFpc1doaXRlc3BhY2UpIHtcbiAgICAgIHJlc3VsdC51bnNoaWZ0KGNoYXIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQuam9pbignJyk7XG59XG5cbi8qKlxuICogUGFyc2VzIGEgSmF2YSBEb3QgY2hhaW4sIGxpa2VcbiAqIGBSb290LkNsYXNzLm1ldGhvZCgpLm90aGVyKFwiYXJncyBldGMsIHdpdGggZG90cy5cIiwgT3RoZXIuVGhpbmcuY2xhc3MpYFxuICogSW50byBhbiBhcnJheSB3aGljaCBpcyBzcGxpdCBvbiB0aGUgXCJ0b3AgbGV2ZWwgZG90c1wiLCB0aGF0IGlzXG4gKiBbICdSb290JywgJ0NsYXNzJywgJ21ldGhvZCgpJywgJ290aGVyKFwiYXJncyBldGMsIHdpdGggZG90cy5cIiwgT3RoZXIuVGhpbmcuY2xhc3MpJyBdXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRG90Q2hhaW4oZG90Q2hhaW4pIHtcbiAgY29uc3QgcGFydHMgPSBbXTtcblxuICBsZXQgcGFyZW5zRGVwdGggPSAwO1xuICBsZXQgcXVvdGVkID0gZmFsc2U7XG4gIGxldCBjdXJyZW50ID0gJyc7XG4gIGZvciAoY29uc3QgY2hhciBvZiBkb3RDaGFpbikge1xuICAgIGN1cnJlbnQgKz0gY2hhcjtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgaWYgKGN1cnJlbnRbY3VycmVudC5sZW5ndGggLSAyXSAhPT0gJ1xcXFwnKSBxdW90ZWQgPSAhcXVvdGVkO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnKCc6XG4gICAgICAgIGlmICghcXVvdGVkKSBwYXJlbnNEZXB0aCsrO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnKSc6XG4gICAgICAgIGlmICghcXVvdGVkKSBwYXJlbnNEZXB0aC0tO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnLic6XG4gICAgICAgIGlmIChwYXJlbnNEZXB0aCA9PT0gMCAmJiAhcXVvdGVkKSB7XG4gICAgICAgICAgcGFydHMucHVzaChjdXJyZW50LnNsaWNlKDAsIC0xKSk7IC8vIFNraXAgdGhlIGRvdFxuICAgICAgICAgIGN1cnJlbnQgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAocGFyZW5zRGVwdGggPiAwIHx8IHF1b3RlZCkge1xuICAgIC8vIFRoaXMgaXMgbm90IGEgY29tcGxldGUgZG90Q2hhaW4uIFdlIGFyZSBpbiBhIHBhcmVudGhlc2lzIG9yIHF1b3Rlcy4gRG8gbm90aGluZ1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8vIFB1c2ggdGhlIGZpbmFsIHBhcnRcbiAgcGFydHMucHVzaChjdXJyZW50KTtcblxuICByZXR1cm4gcGFydHM7XG59XG5cbmV4cG9ydCB7XG4gIGRlbmFtZXNwYWNlLFxuICBwYWNrYWdpZnksXG4gIG5hbWVpZnksXG4gIGZpbHRlckZhbHN5QXJyYXksXG4gIGV4dHJhY3REb3RDaGFpbixcbiAgcGFyc2VEb3RDaGFpblxufTtcbiJdfQ==