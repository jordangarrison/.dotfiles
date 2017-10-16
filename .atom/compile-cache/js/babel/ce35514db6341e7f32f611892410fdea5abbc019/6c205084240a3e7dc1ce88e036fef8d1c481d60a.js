Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.provideBuilder = provideBuilder;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _child_process = require('child_process');

var _voucher = require('voucher');

var _voucher2 = _interopRequireDefault(_voucher);

var _events = require('events');

/**
 * Returns the folder of the currently opened file.
 * If an error occurrs (i.e. the settings pane is open or such),
 * null is returned.
 */
'use babel';

function getCurFilesPath() {
    try {
        editor = atom.workspace.getActivePaneItem();
        ret = _path2['default'].dirname(editor.buffer.file.path);
        return ret;
    } catch (err) {
        return null;
    }
}

var config = {
    jobs: {
        title: 'Simultaneous jobs',
        description: 'Limits how many jobs make will run simultaneously. Defaults to number of processors-1. Set to 1 for default behavior of make.',
        type: 'number',
        'default': _os2['default'].cpus().length - 1,
        minimum: 1,
        maximum: _os2['default'].cpus().length,
        order: 1
    },
    makefileNames: {
        title: 'Considered makefile names',
        description: 'Comma separated list of makefile names to search for in the folder of the current file.',
        type: 'string',
        'default': 'Makefile, GNUmakefile, makefile',
        order: 2
    }
};

exports.config = config;

function provideBuilder() {
    var errorMatch = [
    // match make errors
    '(?<file>[^:\\n]+):(?<line>\\d+):(?<col>\\d+):\\s*(fatal error|error|warning):\\s*(?<message>.+)',
    // match LaTeX errors. Given the '-file-line-error' command line switch was passed to LaTeX
    '(?<file>.+\\.tex):(?<line>\\d+):\\s+(?<message>.*)'];

    return (function (_EventEmitter) {
        _inherits(MakeBuildProvider, _EventEmitter);

        function MakeBuildProvider(cwd) {
            var _this = this;

            _classCallCheck(this, MakeBuildProvider);

            _get(Object.getPrototypeOf(MakeBuildProvider.prototype), 'constructor', this).call(this);
            this.cwd = cwd;
            atom.config.observe('build-make-file.jobs', function () {
                return _this.emit('refresh');
            });
            atom.config.observe('build-make-file.makefileNames', function () {
                return _this.emit('refresh');
            });
            this.makefiles = atom.config.get('build-make-file.makefileNames').split(',').map(function (n) {
                return n.trim();
            });
        }

        _createClass(MakeBuildProvider, [{
            key: 'getNiceName',
            value: function getNiceName() {
                return 'GNU Make in the folder of the current file';
            }

            // Returns true, if a makefile was found in the current file's folder.
        }, {
            key: 'isEligible',
            value: function isEligible() {
                curFilePath = getCurFilesPath();
                if (!curFilePath) {
                    return false;
                }

                foundMakefiles = this.makefiles.map(function (f) {
                    return _path2['default'].join(curFilePath, f);
                }).filter(_fs2['default'].existsSync);
                return foundMakefiles.length > 0;
            }

            // Either returns all make targets reported by 'make -prRn',
            // or an "empty" target which just states that there were no targets in the makefile.
        }, {
            key: 'settings',
            value: function settings() {
                var emptyTarget = {
                    exec: 'echo "There is no target in the makefile!" && false',
                    name: 'No target found in makefile.',
                    args: [],
                    sh: true,
                    errorMatch: []
                };

                curFilePath = getCurFilesPath();
                if (!curFilePath) {
                    return [emptyTarget];
                }

                var args = ['-j' + atom.config.get('build-make-file.jobs')];
                var promise = (0, _voucher2['default'])(_child_process.exec, 'make -prRn', { cwd: curFilePath });
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                return promise.then(function (output) {
                    return output.toString('utf8').split(/[\r\n]{1,2}/).filter(function (line) {
                        return (/^[a-zA-Z0-9][^$#\/\t=]*:([^=]|$)/.test(line)
                        );
                    }).filter(onlyUnique).map(function (targetLine) {
                        return targetLine.split(':').shift();
                    }).map(function (target) {
                        return {
                            exec: 'make',
                            cwd: curFilePath,
                            args: args.concat([target]),
                            name: 'GNU Make in current file\'s folder: ' + target,
                            sh: false,
                            errorMatch: errorMatch
                        };
                    });
                })['catch'](function (e) {
                    return [emptyTarget];
                });
            }
        }]);

        return MakeBuildProvider;
    })(_events.EventEmitter);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC1tYWtlLWZpbGUvbGliL21ha2UtZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztrQkFDUixJQUFJOzs7OzZCQUNFLGVBQWU7O3VCQUNoQixTQUFTOzs7O3NCQUNBLFFBQVE7Ozs7Ozs7QUFQckMsV0FBVyxDQUFDOztBQWdCWixTQUFTLGVBQWUsR0FBRztBQUN2QixRQUFJO0FBQ0EsY0FBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUM1QyxXQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLGVBQU8sR0FBRyxDQUFDO0tBQ2QsQ0FDRCxPQUFNLEdBQUcsRUFBRTtBQUNQLGVBQU8sSUFBSSxDQUFDO0tBQ2Y7Q0FFSjs7QUFJTSxJQUFNLE1BQU0sR0FBRztBQUNsQixRQUFJLEVBQUU7QUFDRixhQUFLLEVBQUUsbUJBQW1CO0FBQzFCLG1CQUFXLEVBQUUsK0hBQStIO0FBQzVJLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsZ0JBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUM7QUFDN0IsZUFBTyxFQUFFLENBQUM7QUFDVixlQUFPLEVBQUUsZ0JBQUcsSUFBSSxFQUFFLENBQUMsTUFBTTtBQUN6QixhQUFLLEVBQUUsQ0FBQztLQUNYO0FBQ0QsaUJBQWEsRUFBRTtBQUNYLGFBQUssRUFBRSwyQkFBMkI7QUFDbEMsbUJBQVcsRUFBRSx5RkFBeUY7QUFDdEcsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxpQ0FBaUM7QUFDMUMsYUFBSyxFQUFFLENBQUM7S0FDWDtDQUNKLENBQUM7Ozs7QUFJSyxTQUFTLGNBQWMsR0FBRztBQUM3QixRQUFNLFVBQVUsR0FBRzs7QUFFZixxR0FB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QUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsZ0NBQUksMkNBQXdDLE1BQU0sQUFBRTtBQUNwRCw4QkFBRSxFQUFFLEtBQUs7QUFDVCxzQ0FBVSxFQUFFLFVBQVU7eUJBQ3pCO3FCQUFDLENBQUMsQ0FBQztpQkFDUCxDQUFDLFNBQU0sQ0FBQyxVQUFBLENBQUM7MkJBQUksQ0FBRSxXQUFXLENBQUU7aUJBQUEsQ0FBQyxDQUFDO2FBQ2xDOzs7ZUE3RFEsaUJBQWlCOzZCQThENUI7Q0FDTCIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYnVpbGQtbWFrZS1maWxlL2xpYi9tYWtlLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB2b3VjaGVyIGZyb20gJ3ZvdWNoZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgZm9sZGVyIG9mIHRoZSBjdXJyZW50bHkgb3BlbmVkIGZpbGUuXG4gKiBJZiBhbiBlcnJvciBvY2N1cnJzIChpLmUuIHRoZSBzZXR0aW5ncyBwYW5lIGlzIG9wZW4gb3Igc3VjaCksXG4gKiBudWxsIGlzIHJldHVybmVkLlxuICovXG5mdW5jdGlvbiBnZXRDdXJGaWxlc1BhdGgoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICAgICAgcmV0ID0gcGF0aC5kaXJuYW1lKGVkaXRvci5idWZmZXIuZmlsZS5wYXRoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgY2F0Y2goZXJyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxufVxuXG5cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgICBqb2JzOiB7XG4gICAgICAgIHRpdGxlOiAnU2ltdWx0YW5lb3VzIGpvYnMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0xpbWl0cyBob3cgbWFueSBqb2JzIG1ha2Ugd2lsbCBydW4gc2ltdWx0YW5lb3VzbHkuIERlZmF1bHRzIHRvIG51bWJlciBvZiBwcm9jZXNzb3JzLTEuIFNldCB0byAxIGZvciBkZWZhdWx0IGJlaGF2aW9yIG9mIG1ha2UuJyxcbiAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgIGRlZmF1bHQ6IG9zLmNwdXMoKS5sZW5ndGggLSAxLFxuICAgICAgICBtaW5pbXVtOiAxLFxuICAgICAgICBtYXhpbXVtOiBvcy5jcHVzKCkubGVuZ3RoLFxuICAgICAgICBvcmRlcjogMVxuICAgIH0sXG4gICAgbWFrZWZpbGVOYW1lczoge1xuICAgICAgICB0aXRsZTogJ0NvbnNpZGVyZWQgbWFrZWZpbGUgbmFtZXMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIG1ha2VmaWxlIG5hbWVzIHRvIHNlYXJjaCBmb3IgaW4gdGhlIGZvbGRlciBvZiB0aGUgY3VycmVudCBmaWxlLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBkZWZhdWx0OiAnTWFrZWZpbGUsIEdOVW1ha2VmaWxlLCBtYWtlZmlsZScsXG4gICAgICAgIG9yZGVyOiAyXG4gICAgfVxufTtcblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlQnVpbGRlcigpIHtcbiAgICBjb25zdCBlcnJvck1hdGNoID0gW1xuICAgICAgICAvLyBtYXRjaCBtYWtlIGVycm9yc1xuICAgICAgICAnKD88ZmlsZT5bXjpcXFxcbl0rKTooPzxsaW5lPlxcXFxkKyk6KD88Y29sPlxcXFxkKyk6XFxcXHMqKGZhdGFsIGVycm9yfGVycm9yfHdhcm5pbmcpOlxcXFxzKig/PG1lc3NhZ2U+LispJyxcbiAgICAgICAgLy8gbWF0Y2ggTGFUZVggZXJyb3JzLiBHaXZlbiB0aGUgJy1maWxlLWxpbmUtZXJyb3InIGNvbW1hbmQgbGluZSBzd2l0Y2ggd2FzIHBhc3NlZCB0byBMYVRlWFxuICAgICAgICAnKD88ZmlsZT4uK1xcXFwudGV4KTooPzxsaW5lPlxcXFxkKyk6XFxcXHMrKD88bWVzc2FnZT4uKiknLFxuICAgIF07XG5cbiAgICByZXR1cm4gY2xhc3MgTWFrZUJ1aWxkUHJvdmlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgICAgICBjb25zdHJ1Y3Rvcihjd2QpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLmN3ZCA9IGN3ZDtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLW1ha2UtZmlsZS5qb2JzJywgKCkgPT4gdGhpcy5lbWl0KCdyZWZyZXNoJykpO1xuICAgICAgICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQtbWFrZS1maWxlLm1ha2VmaWxlTmFtZXMnLCAoKSA9PiB0aGlzLmVtaXQoJ3JlZnJlc2gnKSk7XG4gICAgICAgICAgICB0aGlzLm1ha2VmaWxlcyA9IGF0b20uY29uZmlnLmdldCgnYnVpbGQtbWFrZS1maWxlLm1ha2VmaWxlTmFtZXMnKS5zcGxpdCgnLCcpLm1hcChuID0+IG4udHJpbSgpKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0TmljZU5hbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0dOVSBNYWtlIGluIHRoZSBmb2xkZXIgb2YgdGhlIGN1cnJlbnQgZmlsZSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm5zIHRydWUsIGlmIGEgbWFrZWZpbGUgd2FzIGZvdW5kIGluIHRoZSBjdXJyZW50IGZpbGUncyBmb2xkZXIuXG4gICAgICAgIGlzRWxpZ2libGUoKSB7XG4gICAgICAgICAgICBjdXJGaWxlUGF0aCA9IGdldEN1ckZpbGVzUGF0aCgpXG4gICAgICAgICAgICBpZiAoIWN1ckZpbGVQYXRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3VuZE1ha2VmaWxlcyA9IHRoaXMubWFrZWZpbGVzLm1hcChmID0+IHBhdGguam9pbihjdXJGaWxlUGF0aCwgZikpLmZpbHRlcihmcy5leGlzdHNTeW5jKTtcbiAgICAgICAgICAgIHJldHVybiAoZm91bmRNYWtlZmlsZXMubGVuZ3RoID4gMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFaXRoZXIgcmV0dXJucyBhbGwgbWFrZSB0YXJnZXRzIHJlcG9ydGVkIGJ5ICdtYWtlIC1wclJuJyxcbiAgICAgICAgLy8gb3IgYW4gXCJlbXB0eVwiIHRhcmdldCB3aGljaCBqdXN0IHN0YXRlcyB0aGF0IHRoZXJlIHdlcmUgbm8gdGFyZ2V0cyBpbiB0aGUgbWFrZWZpbGUuXG4gICAgICAgIHNldHRpbmdzKCkge1xuICAgICAgICAgICAgY29uc3QgZW1wdHlUYXJnZXQgPSB7XG4gICAgICAgICAgICAgICAgZXhlYzogJ2VjaG8gXCJUaGVyZSBpcyBubyB0YXJnZXQgaW4gdGhlIG1ha2VmaWxlIVwiICYmIGZhbHNlJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBgTm8gdGFyZ2V0IGZvdW5kIGluIG1ha2VmaWxlLmAsXG4gICAgICAgICAgICAgICAgYXJnczogW10sXG4gICAgICAgICAgICAgICAgc2g6IHRydWUsXG4gICAgICAgICAgICAgICAgZXJyb3JNYXRjaDogW11cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGN1ckZpbGVQYXRoID0gZ2V0Q3VyRmlsZXNQYXRoKClcbiAgICAgICAgICAgIGlmICghY3VyRmlsZVBhdGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2VtcHR5VGFyZ2V0XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYXJncyA9IFsnLWonICsgYXRvbS5jb25maWcuZ2V0KCdidWlsZC1tYWtlLWZpbGUuam9icycpXTtcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSB2b3VjaGVyKGV4ZWMsICdtYWtlIC1wclJuJywgeyBjd2Q6IGN1ckZpbGVQYXRoIH0pXG4gICAgICAgICAgICBmdW5jdGlvbiBvbmx5VW5pcXVlKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihvdXRwdXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQudG9TdHJpbmcoJ3V0ZjgnKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvW1xcclxcbl17MSwyfS8pXG4gICAgICAgICAgICAgICAgLmZpbHRlcihsaW5lID0+IC9eW2EtekEtWjAtOV1bXiQjXFwvXFx0PV0qOihbXj1dfCQpLy50ZXN0KGxpbmUpKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIob25seVVuaXF1ZSlcbiAgICAgICAgICAgICAgICAubWFwKHRhcmdldExpbmUgPT4gdGFyZ2V0TGluZS5zcGxpdCgnOicpLnNoaWZ0KCkpXG4gICAgICAgICAgICAgICAgLm1hcCh0YXJnZXQgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgZXhlYzogJ21ha2UnLFxuICAgICAgICAgICAgICAgICAgICBjd2Q6ICBjdXJGaWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncy5jb25jYXQoW3RhcmdldF0pLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBgR05VIE1ha2UgaW4gY3VycmVudCBmaWxlJ3MgZm9sZGVyOiAke3RhcmdldH1gLFxuICAgICAgICAgICAgICAgICAgICBzaDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWF0Y2g6IGVycm9yTWF0Y2hcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IFsgZW1wdHlUYXJnZXQgXSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIl19