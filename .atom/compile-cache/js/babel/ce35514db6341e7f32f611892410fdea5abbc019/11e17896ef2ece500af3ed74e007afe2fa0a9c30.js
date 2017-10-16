Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.rankRange = rankRange;
exports.rangeMatches = rangeMatches;
exports.parseRange = parseRange;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

'use babel';

var tags = require('language-tags');

function rankRange(range, tag) {
  // From https://tools.ietf.org/html/rfc4647
  range = range.toLowerCase().split(/[-_]/);
  tag = tag.toLowerCase().split(/[-_]/);
  var rank = 1;
  // Split both the extended language range and the language tag being
  // compared into a list of subtags by dividing on the hyphen (%x2D)
  // character.  Two subtags match if either they are the same when
  // compared case-insensitively or the language range's subtag is the
  // wildcard '*'.

  // Begin with the first subtag in each list.  If the first subtag in
  // the range does not match the first subtag in the tag, the overall
  // match fails.  Otherwise, move to the next subtag in both the
  // range and the tag.
  if (range[0] !== '*' && range[0] !== tag[0]) {
    return 0;
  }

  // While there are more subtags left in the language range's list:
  for (var i = 1, j = 1; i < range.length;) {
    if (range[i] === '*') {
      // If the subtag currently being examined in the range is the
      // wildcard ('*'), move to the next subtag in the range and
      // continue with the loop.
      i++;
    } else if (j >= tag.length) {
      // Else, if there are no more subtags in the language tag's
      // list, the match fails.
      return 0;
    } else if (range[i] === '*' || range[i] === tag[j]) {
      // Else, if the current subtag in the range's list matches the
      // current subtag in the language tag's list, move to the next
      // subtag in both lists and continue with the loop.
      if (range[i] !== '*') rank += Math.pow(2, i);
      i++;
      j++;
    } else if (tag[j].length === 1) {
      // Else, if the language tag's subtag is a "singleton" (a single
      // letter or digit, which includes the private-use subtag 'x')
      // the match fails.
      return 0;
    } else {
      // Else, move to the next subtag in the language tag's list and
      // continue with the loop.
      j++;
    }
  }

  return rank;
}

function rangeMatches(range, tag) {
  return rankRange(range, tag) > 0;
}

function parseRange(name) {
  var parts = name.split(/[-_]/);
  var i = 0;
  var lang = [];
  for (var type of ['language', 'extlang', 'script', 'region', 'variant']) {
    if (i < parts.length) {
      lang.push(tags.type(parts[i], type) && (type !== 'region' || parts[i].match(/^[A-Z]+$/)) ? parts[i++] : '*');
    }
  }
  return _.dropRightWhile(lang, function (p) {
    return p === '*';
  }).join('-') || '*';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL2xhbmd1YWdlLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O3NCQUVtQixRQUFROztJQUFmLENBQUM7O0FBRmIsV0FBVyxDQUFBOztBQUdYLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTs7QUFFNUIsU0FBUyxTQUFTLENBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTs7QUFFckMsT0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDekMsS0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckMsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFBOzs7Ozs7Ozs7OztBQVdaLE1BQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzNDLFdBQU8sQ0FBQyxDQUFBO0dBQ1Q7OztBQUdELE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUc7QUFDeEMsUUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFOzs7O0FBSXBCLE9BQUMsRUFBRSxDQUFBO0tBQ0osTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFOzs7QUFHMUIsYUFBTyxDQUFDLENBQUE7S0FDVCxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7O0FBSWxELFVBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDNUMsT0FBQyxFQUFFLENBQUE7QUFDSCxPQUFDLEVBQUUsQ0FBQTtLQUNKLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7OztBQUk5QixhQUFPLENBQUMsQ0FBQTtLQUNULE1BQU07OztBQUdMLE9BQUMsRUFBRSxDQUFBO0tBQ0o7R0FDRjs7QUFFRCxTQUFPLElBQUksQ0FBQTtDQUNaOztBQUVNLFNBQVMsWUFBWSxDQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDeEMsU0FBTyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtDQUNqQzs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxJQUFJLEVBQUU7QUFDaEMsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM5QixNQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDVCxNQUFJLElBQUksR0FBRyxFQUFFLENBQUE7QUFDYixPQUFLLElBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFO0FBQ3pFLFFBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDcEIsVUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQSxBQUFDLEdBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7S0FDL0c7R0FDRjtBQUNELFNBQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBQSxDQUFDO1dBQUksQ0FBQyxLQUFLLEdBQUc7R0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQTtDQUMvRCIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvbGludGVyLXNwZWxsL2xpYi9sYW5ndWFnZS1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnXG52YXIgdGFncyA9IHJlcXVpcmUoJ2xhbmd1YWdlLXRhZ3MnKVxuXG5leHBvcnQgZnVuY3Rpb24gcmFua1JhbmdlIChyYW5nZSwgdGFnKSB7XG4gIC8vIEZyb20gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQ2NDdcbiAgcmFuZ2UgPSByYW5nZS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9bLV9dLylcbiAgdGFnID0gdGFnLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1stX10vKVxuICBsZXQgcmFuayA9IDFcbiAgLy8gU3BsaXQgYm90aCB0aGUgZXh0ZW5kZWQgbGFuZ3VhZ2UgcmFuZ2UgYW5kIHRoZSBsYW5ndWFnZSB0YWcgYmVpbmdcbiAgLy8gY29tcGFyZWQgaW50byBhIGxpc3Qgb2Ygc3VidGFncyBieSBkaXZpZGluZyBvbiB0aGUgaHlwaGVuICgleDJEKVxuICAvLyBjaGFyYWN0ZXIuICBUd28gc3VidGFncyBtYXRjaCBpZiBlaXRoZXIgdGhleSBhcmUgdGhlIHNhbWUgd2hlblxuICAvLyBjb21wYXJlZCBjYXNlLWluc2Vuc2l0aXZlbHkgb3IgdGhlIGxhbmd1YWdlIHJhbmdlJ3Mgc3VidGFnIGlzIHRoZVxuICAvLyB3aWxkY2FyZCAnKicuXG5cbiAgLy8gQmVnaW4gd2l0aCB0aGUgZmlyc3Qgc3VidGFnIGluIGVhY2ggbGlzdC4gIElmIHRoZSBmaXJzdCBzdWJ0YWcgaW5cbiAgLy8gdGhlIHJhbmdlIGRvZXMgbm90IG1hdGNoIHRoZSBmaXJzdCBzdWJ0YWcgaW4gdGhlIHRhZywgdGhlIG92ZXJhbGxcbiAgLy8gbWF0Y2ggZmFpbHMuICBPdGhlcndpc2UsIG1vdmUgdG8gdGhlIG5leHQgc3VidGFnIGluIGJvdGggdGhlXG4gIC8vIHJhbmdlIGFuZCB0aGUgdGFnLlxuICBpZiAocmFuZ2VbMF0gIT09ICcqJyAmJiByYW5nZVswXSAhPT0gdGFnWzBdKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuXG4gIC8vIFdoaWxlIHRoZXJlIGFyZSBtb3JlIHN1YnRhZ3MgbGVmdCBpbiB0aGUgbGFuZ3VhZ2UgcmFuZ2UncyBsaXN0OlxuICBmb3IgKGxldCBpID0gMSwgaiA9IDE7IGkgPCByYW5nZS5sZW5ndGg7KSB7XG4gICAgaWYgKHJhbmdlW2ldID09PSAnKicpIHtcbiAgICAgIC8vIElmIHRoZSBzdWJ0YWcgY3VycmVudGx5IGJlaW5nIGV4YW1pbmVkIGluIHRoZSByYW5nZSBpcyB0aGVcbiAgICAgIC8vIHdpbGRjYXJkICgnKicpLCBtb3ZlIHRvIHRoZSBuZXh0IHN1YnRhZyBpbiB0aGUgcmFuZ2UgYW5kXG4gICAgICAvLyBjb250aW51ZSB3aXRoIHRoZSBsb29wLlxuICAgICAgaSsrXG4gICAgfSBlbHNlIGlmIChqID49IHRhZy5sZW5ndGgpIHtcbiAgICAgIC8vIEVsc2UsIGlmIHRoZXJlIGFyZSBubyBtb3JlIHN1YnRhZ3MgaW4gdGhlIGxhbmd1YWdlIHRhZydzXG4gICAgICAvLyBsaXN0LCB0aGUgbWF0Y2ggZmFpbHMuXG4gICAgICByZXR1cm4gMFxuICAgIH0gZWxzZSBpZiAocmFuZ2VbaV0gPT09ICcqJyB8fCByYW5nZVtpXSA9PT0gdGFnW2pdKSB7XG4gICAgICAvLyBFbHNlLCBpZiB0aGUgY3VycmVudCBzdWJ0YWcgaW4gdGhlIHJhbmdlJ3MgbGlzdCBtYXRjaGVzIHRoZVxuICAgICAgLy8gY3VycmVudCBzdWJ0YWcgaW4gdGhlIGxhbmd1YWdlIHRhZydzIGxpc3QsIG1vdmUgdG8gdGhlIG5leHRcbiAgICAgIC8vIHN1YnRhZyBpbiBib3RoIGxpc3RzIGFuZCBjb250aW51ZSB3aXRoIHRoZSBsb29wLlxuICAgICAgaWYgKHJhbmdlW2ldICE9PSAnKicpIHJhbmsgKz0gTWF0aC5wb3coMiwgaSlcbiAgICAgIGkrK1xuICAgICAgaisrXG4gICAgfSBlbHNlIGlmICh0YWdbal0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBFbHNlLCBpZiB0aGUgbGFuZ3VhZ2UgdGFnJ3Mgc3VidGFnIGlzIGEgXCJzaW5nbGV0b25cIiAoYSBzaW5nbGVcbiAgICAgIC8vIGxldHRlciBvciBkaWdpdCwgd2hpY2ggaW5jbHVkZXMgdGhlIHByaXZhdGUtdXNlIHN1YnRhZyAneCcpXG4gICAgICAvLyB0aGUgbWF0Y2ggZmFpbHMuXG4gICAgICByZXR1cm4gMFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBFbHNlLCBtb3ZlIHRvIHRoZSBuZXh0IHN1YnRhZyBpbiB0aGUgbGFuZ3VhZ2UgdGFnJ3MgbGlzdCBhbmRcbiAgICAgIC8vIGNvbnRpbnVlIHdpdGggdGhlIGxvb3AuXG4gICAgICBqKytcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmFua1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VNYXRjaGVzIChyYW5nZSwgdGFnKSB7XG4gIHJldHVybiByYW5rUmFuZ2UocmFuZ2UsIHRhZykgPiAwXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJhbmdlIChuYW1lKSB7XG4gIGxldCBwYXJ0cyA9IG5hbWUuc3BsaXQoL1stX10vKVxuICBsZXQgaSA9IDBcbiAgbGV0IGxhbmcgPSBbXVxuICBmb3IgKGNvbnN0IHR5cGUgb2YgWydsYW5ndWFnZScsICdleHRsYW5nJywgJ3NjcmlwdCcsICdyZWdpb24nLCAndmFyaWFudCddKSB7XG4gICAgaWYgKGkgPCBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgIGxhbmcucHVzaCgodGFncy50eXBlKHBhcnRzW2ldLCB0eXBlKSAmJiAodHlwZSAhPT0gJ3JlZ2lvbicgfHwgcGFydHNbaV0ubWF0Y2goL15bQS1aXSskLykpKSA/IHBhcnRzW2krK10gOiAnKicpXG4gICAgfVxuICB9XG4gIHJldHVybiBfLmRyb3BSaWdodFdoaWxlKGxhbmcsIHAgPT4gcCA9PT0gJyonKS5qb2luKCctJykgfHwgJyonXG59XG4iXX0=