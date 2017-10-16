Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require('./werkzeug');

function toArray(value) {
  return typeof value === 'string' ? value.split(',').map(function (item) {
    return item.trim();
  }) : Array.from(value);
}

function toBoolean(value) {
  return typeof value === 'string' ? !!value.match(/^(true|yes)$/i) : !!value;
}

var JobState = (function () {
  function JobState(parent, jobName) {
    _classCallCheck(this, JobState);

    this.parent = parent;
    this.jobName = jobName;
  }

  _createClass(JobState, [{
    key: 'getOutputFilePath',
    value: function getOutputFilePath() {
      return this.outputFilePath;
    }
  }, {
    key: 'setOutputFilePath',
    value: function setOutputFilePath(value) {
      this.outputFilePath = value;
    }
  }, {
    key: 'getFileDatabase',
    value: function getFileDatabase() {
      return this.fileDatabase;
    }
  }, {
    key: 'setFileDatabase',
    value: function setFileDatabase(value) {
      this.fileDatabase = value;
    }
  }, {
    key: 'getLogMessages',
    value: function getLogMessages() {
      return this.logMessages;
    }
  }, {
    key: 'setLogMessages',
    value: function setLogMessages(value) {
      this.logMessages = value;
    }
  }, {
    key: 'getJobName',
    value: function getJobName() {
      return this.jobName;
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath() {
      return this.parent.getFilePath();
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      return this.parent.getProjectPath();
    }
  }, {
    key: 'getTexFilePath',
    value: function getTexFilePath() {
      return this.parent.getTexFilePath();
    }
  }, {
    key: 'setTexFilePath',
    value: function setTexFilePath(value) {
      this.parent.setTexFilePath(value);
    }
  }, {
    key: 'getKnitrFilePath',
    value: function getKnitrFilePath() {
      return this.parent.getKnitrFilePath();
    }
  }, {
    key: 'setKnitrFilePath',
    value: function setKnitrFilePath(value) {
      this.parent.setKnitrFilePath(value);
    }
  }, {
    key: 'getCleanPatterns',
    value: function getCleanPatterns() {
      return this.parent.getCleanPatterns();
    }
  }, {
    key: 'getEnableSynctex',
    value: function getEnableSynctex() {
      return this.parent.getEnableSynctex();
    }
  }, {
    key: 'getEnableShellEscape',
    value: function getEnableShellEscape() {
      return this.parent.getEnableShellEscape();
    }
  }, {
    key: 'getEnableExtendedBuildMode',
    value: function getEnableExtendedBuildMode() {
      return this.parent.getEnableExtendedBuildMode();
    }
  }, {
    key: 'getEngine',
    value: function getEngine() {
      return this.parent.getEngine();
    }
  }, {
    key: 'getMoveResultToSourceDirectory',
    value: function getMoveResultToSourceDirectory() {
      return this.parent.getMoveResultToSourceDirectory();
    }
  }, {
    key: 'getOutputDirectory',
    value: function getOutputDirectory() {
      return this.parent.getOutputDirectory();
    }
  }, {
    key: 'getOutputFormat',
    value: function getOutputFormat() {
      return this.parent.getOutputFormat();
    }
  }, {
    key: 'getProducer',
    value: function getProducer() {
      return this.parent.getProducer();
    }
  }, {
    key: 'getShouldRebuild',
    value: function getShouldRebuild() {
      return this.parent.getShouldRebuild();
    }
  }]);

  return JobState;
})();

var BuildState = (function () {
  function BuildState(filePath) {
    var jobNames = arguments.length <= 1 || arguments[1] === undefined ? [null] : arguments[1];
    var shouldRebuild = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, BuildState);

    this.setFilePath(filePath);
    this.setJobNames(jobNames);
    this.setShouldRebuild(shouldRebuild);
    this.setEnableSynctex(false);
    this.setEnableShellEscape(false);
    this.setEnableExtendedBuildMode(false);
    this.subfiles = new Set();
  }

  _createClass(BuildState, [{
    key: 'getKnitrFilePath',
    value: function getKnitrFilePath() {
      return this.knitrFilePath;
    }
  }, {
    key: 'setKnitrFilePath',
    value: function setKnitrFilePath(value) {
      this.knitrFilePath = value;
    }
  }, {
    key: 'getTexFilePath',
    value: function getTexFilePath() {
      return this.texFilePath;
    }
  }, {
    key: 'setTexFilePath',
    value: function setTexFilePath(value) {
      this.texFilePath = value;
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      return this.projectPath;
    }
  }, {
    key: 'setProjectPath',
    value: function setProjectPath(value) {
      this.projectPath = value;
    }
  }, {
    key: 'getCleanPatterns',
    value: function getCleanPatterns() {
      return this.cleanPatterns;
    }
  }, {
    key: 'setCleanPatterns',
    value: function setCleanPatterns(value) {
      this.cleanPatterns = toArray(value);
    }
  }, {
    key: 'getEnableSynctex',
    value: function getEnableSynctex() {
      return this.enableSynctex;
    }
  }, {
    key: 'setEnableSynctex',
    value: function setEnableSynctex(value) {
      this.enableSynctex = toBoolean(value);
    }
  }, {
    key: 'getEnableShellEscape',
    value: function getEnableShellEscape() {
      return this.enableShellEscape;
    }
  }, {
    key: 'setEnableShellEscape',
    value: function setEnableShellEscape(value) {
      this.enableShellEscape = toBoolean(value);
    }
  }, {
    key: 'getEnableExtendedBuildMode',
    value: function getEnableExtendedBuildMode() {
      return this.enableExtendedBuildMode;
    }
  }, {
    key: 'setEnableExtendedBuildMode',
    value: function setEnableExtendedBuildMode(value) {
      this.enableExtendedBuildMode = toBoolean(value);
    }
  }, {
    key: 'getEngine',
    value: function getEngine() {
      return this.engine;
    }
  }, {
    key: 'setEngine',
    value: function setEngine(value) {
      this.engine = value;
    }
  }, {
    key: 'getJobStates',
    value: function getJobStates() {
      return this.jobStates;
    }
  }, {
    key: 'setJobStates',
    value: function setJobStates(value) {
      this.jobStates = value;
    }
  }, {
    key: 'getMoveResultToSourceDirectory',
    value: function getMoveResultToSourceDirectory() {
      return this.moveResultToSourceDirectory;
    }
  }, {
    key: 'setMoveResultToSourceDirectory',
    value: function setMoveResultToSourceDirectory(value) {
      this.moveResultToSourceDirectory = toBoolean(value);
    }
  }, {
    key: 'getOutputFormat',
    value: function getOutputFormat() {
      return this.outputFormat;
    }
  }, {
    key: 'setOutputFormat',
    value: function setOutputFormat(value) {
      this.outputFormat = value;
    }
  }, {
    key: 'getOutputDirectory',
    value: function getOutputDirectory() {
      return this.outputDirectory;
    }
  }, {
    key: 'setOutputDirectory',
    value: function setOutputDirectory(value) {
      this.outputDirectory = value;
    }
  }, {
    key: 'getProducer',
    value: function getProducer() {
      return this.producer;
    }
  }, {
    key: 'setProducer',
    value: function setProducer(value) {
      this.producer = value;
    }
  }, {
    key: 'getSubfiles',
    value: function getSubfiles() {
      return Array.from(this.subfiles.values());
    }
  }, {
    key: 'addSubfile',
    value: function addSubfile(value) {
      this.subfiles.add(value);
    }
  }, {
    key: 'hasSubfile',
    value: function hasSubfile(value) {
      return this.subfiles.has(value);
    }
  }, {
    key: 'getShouldRebuild',
    value: function getShouldRebuild() {
      return this.shouldRebuild;
    }
  }, {
    key: 'setShouldRebuild',
    value: function setShouldRebuild(value) {
      this.shouldRebuild = toBoolean(value);
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath() {
      return this.filePath;
    }
  }, {
    key: 'setFilePath',
    value: function setFilePath(value) {
      this.filePath = value;
      this.texFilePath = (0, _werkzeug.isTexFile)(value) ? value : undefined;
      this.knitrFilePath = (0, _werkzeug.isKnitrFile)(value) ? value : undefined;
      this.projectPath = _path2['default'].dirname(value);
    }
  }, {
    key: 'getJobNames',
    value: function getJobNames() {
      return this.jobStates.map(function (jobState) {
        return jobState.getJobName();
      });
    }
  }, {
    key: 'setJobNames',
    value: function setJobNames(value) {
      var _this = this;

      this.jobStates = toArray(value).map(function (jobName) {
        return new JobState(_this, jobName);
      });
    }
  }]);

  return BuildState;
})();

exports['default'] = BuildState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGQtc3RhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3dCQUNnQixZQUFZOztBQUVuRCxTQUFTLE9BQU8sQ0FBRSxLQUFLLEVBQUU7QUFDdkIsU0FBTyxBQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsR0FBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7V0FBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0dBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FDbkc7O0FBRUQsU0FBUyxTQUFTLENBQUUsS0FBSyxFQUFFO0FBQ3pCLFNBQU8sQUFBQyxPQUFPLEtBQUssS0FBSyxRQUFRLEdBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQTtDQUM5RTs7SUFFSyxRQUFRO0FBQ0EsV0FEUixRQUFRLENBQ0MsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFEMUIsUUFBUTs7QUFFVixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtHQUN2Qjs7ZUFKRyxRQUFROztXQU1NLDZCQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQTtLQUMzQjs7O1dBRWlCLDJCQUFDLEtBQUssRUFBRTtBQUN4QixVQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQTtLQUM1Qjs7O1dBRWUsMkJBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFBO0tBQ3pCOzs7V0FFZSx5QkFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUE7S0FDMUI7OztXQUVjLDBCQUFHO0FBQ2hCLGFB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O0FBQ3ZCLFVBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ3RDOzs7V0FFVyx1QkFBRztBQUNiLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtLQUNyQjs7O1dBRVcscUJBQUMsS0FBSyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxXQUFXLEdBQUcseUJBQVUsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN2RCxVQUFJLENBQUMsYUFBYSxHQUFHLDJCQUFZLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDM0QsVUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdkM7OztXQUVXLHVCQUFHO0FBQ2IsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7ZUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO09BQUEsQ0FBQyxDQUFBO0tBQzdEOzs7V0FFVyxxQkFBQyxLQUFLLEVBQUU7OztBQUNsQixVQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2VBQUksSUFBSSxRQUFRLFFBQU8sT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQzVFOzs7U0F4SmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGQtc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBpc1RleEZpbGUsIGlzS25pdHJGaWxlIH0gZnJvbSAnLi93ZXJremV1ZydcblxuZnVuY3Rpb24gdG9BcnJheSAodmFsdWUpIHtcbiAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSA/IHZhbHVlLnNwbGl0KCcsJykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpIDogQXJyYXkuZnJvbSh2YWx1ZSlcbn1cblxuZnVuY3Rpb24gdG9Cb29sZWFuICh2YWx1ZSkge1xuICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpID8gISF2YWx1ZS5tYXRjaCgvXih0cnVlfHllcykkL2kpIDogISF2YWx1ZVxufVxuXG5jbGFzcyBKb2JTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yIChwYXJlbnQsIGpvYk5hbWUpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudFxuICAgIHRoaXMuam9iTmFtZSA9IGpvYk5hbWVcbiAgfVxuXG4gIGdldE91dHB1dEZpbGVQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy5vdXRwdXRGaWxlUGF0aFxuICB9XG5cbiAgc2V0T3V0cHV0RmlsZVBhdGggKHZhbHVlKSB7XG4gICAgdGhpcy5vdXRwdXRGaWxlUGF0aCA9IHZhbHVlXG4gIH1cblxuICBnZXRGaWxlRGF0YWJhc2UgKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVEYXRhYmFzZVxuICB9XG5cbiAgc2V0RmlsZURhdGFiYXNlICh2YWx1ZSkge1xuICAgIHRoaXMuZmlsZURhdGFiYXNlID0gdmFsdWVcbiAgfVxuXG4gIGdldExvZ01lc3NhZ2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dNZXNzYWdlc1xuICB9XG5cbiAgc2V0TG9nTWVzc2FnZXMgKHZhbHVlKSB7XG4gICAgdGhpcy5sb2dNZXNzYWdlcyA9IHZhbHVlXG4gIH1cblxuICBnZXRKb2JOYW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5qb2JOYW1lXG4gIH1cblxuICBnZXRGaWxlUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldEZpbGVQYXRoKClcbiAgfVxuXG4gIGdldFByb2plY3RQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0UHJvamVjdFBhdGgoKVxuICB9XG5cbiAgZ2V0VGV4RmlsZVBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRUZXhGaWxlUGF0aCgpXG4gIH1cblxuICBzZXRUZXhGaWxlUGF0aCAodmFsdWUpIHtcbiAgICB0aGlzLnBhcmVudC5zZXRUZXhGaWxlUGF0aCh2YWx1ZSlcbiAgfVxuXG4gIGdldEtuaXRyRmlsZVBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRLbml0ckZpbGVQYXRoKClcbiAgfVxuXG4gIHNldEtuaXRyRmlsZVBhdGggKHZhbHVlKSB7XG4gICAgdGhpcy5wYXJlbnQuc2V0S25pdHJGaWxlUGF0aCh2YWx1ZSlcbiAgfVxuXG4gIGdldENsZWFuUGF0dGVybnMgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRDbGVhblBhdHRlcm5zKClcbiAgfVxuXG4gIGdldEVuYWJsZVN5bmN0ZXggKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRFbmFibGVTeW5jdGV4KClcbiAgfVxuXG4gIGdldEVuYWJsZVNoZWxsRXNjYXBlICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0RW5hYmxlU2hlbGxFc2NhcGUoKVxuICB9XG5cbiAgZ2V0RW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSgpXG4gIH1cblxuICBnZXRFbmdpbmUgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRFbmdpbmUoKVxuICB9XG5cbiAgZ2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5KClcbiAgfVxuXG4gIGdldE91dHB1dERpcmVjdG9yeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldE91dHB1dERpcmVjdG9yeSgpXG4gIH1cblxuICBnZXRPdXRwdXRGb3JtYXQgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRPdXRwdXRGb3JtYXQoKVxuICB9XG5cbiAgZ2V0UHJvZHVjZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRQcm9kdWNlcigpXG4gIH1cblxuICBnZXRTaG91bGRSZWJ1aWxkICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0U2hvdWxkUmVidWlsZCgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yIChmaWxlUGF0aCwgam9iTmFtZXMgPSBbbnVsbF0sIHNob3VsZFJlYnVpbGQgPSBmYWxzZSkge1xuICAgIHRoaXMuc2V0RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgdGhpcy5zZXRKb2JOYW1lcyhqb2JOYW1lcylcbiAgICB0aGlzLnNldFNob3VsZFJlYnVpbGQoc2hvdWxkUmVidWlsZClcbiAgICB0aGlzLnNldEVuYWJsZVN5bmN0ZXgoZmFsc2UpXG4gICAgdGhpcy5zZXRFbmFibGVTaGVsbEVzY2FwZShmYWxzZSlcbiAgICB0aGlzLnNldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlKGZhbHNlKVxuICAgIHRoaXMuc3ViZmlsZXMgPSBuZXcgU2V0KClcbiAgfVxuXG4gIGdldEtuaXRyRmlsZVBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLmtuaXRyRmlsZVBhdGhcbiAgfVxuXG4gIHNldEtuaXRyRmlsZVBhdGggKHZhbHVlKSB7XG4gICAgdGhpcy5rbml0ckZpbGVQYXRoID0gdmFsdWVcbiAgfVxuXG4gIGdldFRleEZpbGVQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXhGaWxlUGF0aFxuICB9XG5cbiAgc2V0VGV4RmlsZVBhdGggKHZhbHVlKSB7XG4gICAgdGhpcy50ZXhGaWxlUGF0aCA9IHZhbHVlXG4gIH1cblxuICBnZXRQcm9qZWN0UGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvamVjdFBhdGhcbiAgfVxuXG4gIHNldFByb2plY3RQYXRoICh2YWx1ZSkge1xuICAgIHRoaXMucHJvamVjdFBhdGggPSB2YWx1ZVxuICB9XG5cbiAgZ2V0Q2xlYW5QYXR0ZXJucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xlYW5QYXR0ZXJuc1xuICB9XG5cbiAgc2V0Q2xlYW5QYXR0ZXJucyAodmFsdWUpIHtcbiAgICB0aGlzLmNsZWFuUGF0dGVybnMgPSB0b0FycmF5KHZhbHVlKVxuICB9XG5cbiAgZ2V0RW5hYmxlU3luY3RleCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5hYmxlU3luY3RleFxuICB9XG5cbiAgc2V0RW5hYmxlU3luY3RleCAodmFsdWUpIHtcbiAgICB0aGlzLmVuYWJsZVN5bmN0ZXggPSB0b0Jvb2xlYW4odmFsdWUpXG4gIH1cblxuICBnZXRFbmFibGVTaGVsbEVzY2FwZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5hYmxlU2hlbGxFc2NhcGVcbiAgfVxuXG4gIHNldEVuYWJsZVNoZWxsRXNjYXBlICh2YWx1ZSkge1xuICAgIHRoaXMuZW5hYmxlU2hlbGxFc2NhcGUgPSB0b0Jvb2xlYW4odmFsdWUpXG4gIH1cblxuICBnZXRFbmFibGVFeHRlbmRlZEJ1aWxkTW9kZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGVcbiAgfVxuXG4gIHNldEVuYWJsZUV4dGVuZGVkQnVpbGRNb2RlICh2YWx1ZSkge1xuICAgIHRoaXMuZW5hYmxlRXh0ZW5kZWRCdWlsZE1vZGUgPSB0b0Jvb2xlYW4odmFsdWUpXG4gIH1cblxuICBnZXRFbmdpbmUgKCkge1xuICAgIHJldHVybiB0aGlzLmVuZ2luZVxuICB9XG5cbiAgc2V0RW5naW5lICh2YWx1ZSkge1xuICAgIHRoaXMuZW5naW5lID0gdmFsdWVcbiAgfVxuXG4gIGdldEpvYlN0YXRlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuam9iU3RhdGVzXG4gIH1cblxuICBzZXRKb2JTdGF0ZXMgKHZhbHVlKSB7XG4gICAgdGhpcy5qb2JTdGF0ZXMgPSB2YWx1ZVxuICB9XG5cbiAgZ2V0TW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcbiAgfVxuXG4gIHNldE1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSAodmFsdWUpIHtcbiAgICB0aGlzLm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeSA9IHRvQm9vbGVhbih2YWx1ZSlcbiAgfVxuXG4gIGdldE91dHB1dEZvcm1hdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3V0cHV0Rm9ybWF0XG4gIH1cblxuICBzZXRPdXRwdXRGb3JtYXQgKHZhbHVlKSB7XG4gICAgdGhpcy5vdXRwdXRGb3JtYXQgPSB2YWx1ZVxuICB9XG5cbiAgZ2V0T3V0cHV0RGlyZWN0b3J5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5vdXRwdXREaXJlY3RvcnlcbiAgfVxuXG4gIHNldE91dHB1dERpcmVjdG9yeSAodmFsdWUpIHtcbiAgICB0aGlzLm91dHB1dERpcmVjdG9yeSA9IHZhbHVlXG4gIH1cblxuICBnZXRQcm9kdWNlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvZHVjZXJcbiAgfVxuXG4gIHNldFByb2R1Y2VyICh2YWx1ZSkge1xuICAgIHRoaXMucHJvZHVjZXIgPSB2YWx1ZVxuICB9XG5cbiAgZ2V0U3ViZmlsZXMgKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3ViZmlsZXMudmFsdWVzKCkpXG4gIH1cblxuICBhZGRTdWJmaWxlICh2YWx1ZSkge1xuICAgIHRoaXMuc3ViZmlsZXMuYWRkKHZhbHVlKVxuICB9XG5cbiAgaGFzU3ViZmlsZSAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zdWJmaWxlcy5oYXModmFsdWUpXG4gIH1cblxuICBnZXRTaG91bGRSZWJ1aWxkICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaG91bGRSZWJ1aWxkXG4gIH1cblxuICBzZXRTaG91bGRSZWJ1aWxkICh2YWx1ZSkge1xuICAgIHRoaXMuc2hvdWxkUmVidWlsZCA9IHRvQm9vbGVhbih2YWx1ZSlcbiAgfVxuXG4gIGdldEZpbGVQYXRoICgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0aFxuICB9XG5cbiAgc2V0RmlsZVBhdGggKHZhbHVlKSB7XG4gICAgdGhpcy5maWxlUGF0aCA9IHZhbHVlXG4gICAgdGhpcy50ZXhGaWxlUGF0aCA9IGlzVGV4RmlsZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZFxuICAgIHRoaXMua25pdHJGaWxlUGF0aCA9IGlzS25pdHJGaWxlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkXG4gICAgdGhpcy5wcm9qZWN0UGF0aCA9IHBhdGguZGlybmFtZSh2YWx1ZSlcbiAgfVxuXG4gIGdldEpvYk5hbWVzICgpIHtcbiAgICByZXR1cm4gdGhpcy5qb2JTdGF0ZXMubWFwKGpvYlN0YXRlID0+IGpvYlN0YXRlLmdldEpvYk5hbWUoKSlcbiAgfVxuXG4gIHNldEpvYk5hbWVzICh2YWx1ZSkge1xuICAgIHRoaXMuam9iU3RhdGVzID0gdG9BcnJheSh2YWx1ZSkubWFwKGpvYk5hbWUgPT4gbmV3IEpvYlN0YXRlKHRoaXMsIGpvYk5hbWUpKVxuICB9XG59XG4iXX0=