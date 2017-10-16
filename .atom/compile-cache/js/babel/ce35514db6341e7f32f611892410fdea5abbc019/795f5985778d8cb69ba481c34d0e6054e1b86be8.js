var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jdjs = require('jdjs');

var _jdjs2 = _interopRequireDefault(_jdjs);

'use babel';

function collect(entries) {
  var _this = this;

  return Promise.resolve(entries).then(function (allFiles) {
    return Promise.all(allFiles.map(function (filename) {
      return Promise.all([filename, (0, _jdjs2['default'])(filename)])['catch'](function (err) {
        console.warn('Failed to parse', filename, err.message);
        return [];
      });
    }));
  }).then(function (result) {
    result.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var filename = _ref2[0];
      var descriptions = _ref2[1];

      descriptions.filter(function (entry) {
        return entry.modifiers.includes('public');
      }).forEach(function (entry) {
        _this.emit('entry', filename, entry);
      });
    });
  })['catch'](function (err) {
    console.error('collector-task failed:', err.stack);
  });
}

module.exports = function (entries) {
  var callback = this.async();

  if (0 === entries.length) {
    return callback();
  }

  return collect(entries).then(function () {
    callback();
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS9saWIvY29sbGVjdG9yLXRhc2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFaUIsTUFBTTs7OztBQUZ2QixXQUFXLENBQUM7O0FBSVosU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFOzs7QUFDeEIsU0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUM1QixJQUFJLENBQUMsVUFBQSxRQUFRO1dBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTthQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUUsUUFBUSxFQUFFLHVCQUFLLFFBQVEsQ0FBQyxDQUFFLENBQUMsU0FDakMsQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNaLGVBQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxlQUFPLEVBQUUsQ0FBQztPQUNYLENBQUM7S0FBQSxDQUNMLENBQUM7R0FBQSxDQUFDLENBQ0YsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2QsVUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQTBCLEVBQUs7aUNBQS9CLElBQTBCOztVQUF4QixRQUFRO1VBQUUsWUFBWTs7QUFDbEMsa0JBQVksQ0FDVCxNQUFNLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO09BQUEsQ0FBQyxDQUNuRCxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDaEIsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNyQyxDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7R0FDSixDQUFDLFNBQ0ksQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNaLFdBQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3BELENBQUMsQ0FBQztDQUNOOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxPQUFPLEVBQUU7QUFDbEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUU5QixNQUFJLENBQUMsS0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3hCLFdBQU8sUUFBUSxFQUFFLENBQUM7R0FDbkI7O0FBRUQsU0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDakMsWUFBUSxFQUFFLENBQUM7R0FDWixDQUFDLENBQUM7Q0FDSixDQUFDIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9qYXZhLWNsYXNzcGF0aC1yZWdpc3RyeS9saWIvY29sbGVjdG9yLXRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGpkanMgZnJvbSAnamRqcyc7XG5cbmZ1bmN0aW9uIGNvbGxlY3QoZW50cmllcykge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVudHJpZXMpXG4gICAgLnRoZW4oYWxsRmlsZXMgPT4gUHJvbWlzZS5hbGwoYWxsRmlsZXMubWFwKGZpbGVuYW1lID0+XG4gICAgICBQcm9taXNlLmFsbChbIGZpbGVuYW1lLCBqZGpzKGZpbGVuYW1lKSBdKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBwYXJzZScsIGZpbGVuYW1lLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9KVxuICAgICkpKVxuICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICByZXN1bHQubWFwKChbIGZpbGVuYW1lLCBkZXNjcmlwdGlvbnMgXSkgPT4ge1xuICAgICAgICBkZXNjcmlwdGlvbnNcbiAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5Lm1vZGlmaWVycy5pbmNsdWRlcygncHVibGljJykpXG4gICAgICAgICAgLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlbnRyeScsIGZpbGVuYW1lLCBlbnRyeSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignY29sbGVjdG9yLXRhc2sgZmFpbGVkOicsIGVyci5zdGFjayk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmFzeW5jKCk7XG5cbiAgaWYgKDAgPT09IGVudHJpZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICByZXR1cm4gY29sbGVjdChlbnRyaWVzKS50aGVuKCgpID0+IHtcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcbn07XG4iXX0=