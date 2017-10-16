Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.provideGrammar = provideGrammar;
exports.provideLinter = provideLinter;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

'use babel';

var asciiDocLangPattern = /^:lang:\s*(\S+)/m;

function provideGrammar() {
  return [{
    grammarScopes: ['text.plain', 'text.plain.null-grammar'],
    checkedScopes: {
      'text.plain': true,
      'text.plain.null-grammar': true,
      'storage.type.class.todo': false, // ignore from language-todo
      'storage.type.class.fixme': false,
      'storage.type.class.changed': false,
      'storage.type.class.xxx': false,
      'storage.type.class.idea': false,
      'storage.type.class.hack': false,
      'storage.type.class.note': false,
      'storage.type.class.review': false,
      'storage.type.class.nb': false,
      'storage.type.class.bug': false,
      'storage.type.class.radar': false,
      'markup.underline.link.http.hyperlink': false, // ignore from language-hyperlink
      'markup.underline.link.https.hyperlink': false,
      'markup.underline.link.sftp.hyperlink': false,
      'markup.underline.link.ftp.hyperlink': false,
      'markup.underline.link.file.hyperlink': false,
      'markup.underline.link.smb.hyperlink': false,
      'markup.underline.link.afp.hyperlink': false,
      'markup.underline.link.nfs.hyperlink': false,
      'markup.underline.link.x-man-page.hyperlink': false,
      'markup.underline.link.x-man.hyperlink': false,
      'markup.underline.link.man-page.hyperlink': false,
      'markup.underline.link.man.hyperlink': false,
      'markup.underline.link.gopher.hyperlink': false,
      'markup.underline.link.txmnt.hyperlink': false,
      'markup.underline.link.issue.hyperlink': false,
      'markup.underline.link..hyperlink': false
    }
  }, {
    grammarScopes: ['text.git-commit'],
    checkedScopes: {
      '.meta.scope.message.git-commit': true
    }
  }, {
    grammarScopes: ['source.asciidoc'],
    findLanguageTags: function findLanguageTags(textEditor) {
      var languages = [];
      textEditor.scan(asciiDocLangPattern, function (_ref) {
        var match = _ref.match;
        var stop = _ref.stop;

        languages.push(match[1]);
        stop();
      });
      return languages;
    },
    checkedScopes: {
      'entity.name.function.asciidoc': false,
      'entity.name.tag.yaml': false,
      'markup.blockid.asciidoc': false,
      'markup.code.asciidoc.properties.asciidoc': false,
      'markup.code.c.asciidoc': false,
      'markup.code.clojure.asciidoc': false,
      'markup.code.coffee.asciidoc': false,
      'markup.code.cpp.asciidoc': false,
      'markup.code.cs.asciidoc': false,
      'markup.code.css.asciidoc': false,
      'markup.code.css.less.asciidoc': false,
      'markup.code.css.scss.asciidoc': false,
      'markup.code.diff.asciidoc': false,
      'markup.code.dockerfile.asciidoc': false,
      'markup.code.elixir.asciidoc': false,
      'markup.code.elm.asciidoc': false,
      'markup.code.erlang.asciidoc': false,
      'markup.code.gfm.asciidoc': false,
      'markup.code.go.asciidoc': false,
      'markup.code.groovy.asciidoc': false,
      'markup.code.haskell.asciidoc': false,
      'markup.code.html.basic.asciidoc': false,
      'markup.code.html.mustache.asciidoc': false,
      'markup.code.html.php.asciidoc': false,
      'markup.code.java.asciidoc': false,
      'markup.code.js.asciidoc': false,
      'markup.code.js.jsx.asciidoc': false,
      'markup.code.json.asciidoc': false,
      'markup.code.julia.asciidoc': false,
      'markup.code.makefile.asciidoc': false,
      'markup.code.objc.asciidoc': false,
      'markup.code.ocaml.asciidoc': false,
      'markup.code.perl.asciidoc': false,
      'markup.code.perl6.asciidoc': false,
      'markup.code.python.asciidoc': false,
      'markup.code.r.asciidoc': false,
      'markup.code.ruby.asciidoc': false,
      'markup.code.rust.asciidoc': false,
      'markup.code.sass.asciidoc': false,
      'markup.code.scala.asciidoc': false,
      'markup.code.shell.asciidoc': false,
      'markup.code.sql.asciidoc': false,
      'markup.code.swift.asciidoc': false,
      'markup.code.toml.asciidoc': false,
      'markup.code.ts.asciidoc': false,
      'markup.code.xml.asciidoc': false,
      'markup.code.yaml.asciidoc': false,
      'markup.link.asciidoc': false,
      'markup.raw.asciidoc': false,
      'markup.raw.monospace.asciidoc': false,
      'source.asciidoc': true,
      'support.constant.attribute-name.asciidoc': false
    }
  }, {
    grammarScopes: ['source.gfm' // language-gfm
    // The following are not included since filterRanges is not needed
    // source.embedded.gfm from language-asciidoc
    // text.embedded.md from language-gfm
    ],
    checkedScopes: {
      'constant.character.entity.gfm': false,
      'constant.character.escape.gfm': false,
      'front-matter.yaml.gfm': false,
      'markup.code.c.gfm': false,
      'markup.code.clojure.gfm': false,
      'markup.code.coffee.gfm': false,
      'markup.code.cpp.gfm': false,
      'markup.code.cs.gfm': false,
      'markup.code.css.gfm': false,
      'markup.code.diff.gfm': false,
      'markup.code.elixir.gfm': false,
      'markup.code.elm.gfm': false,
      'markup.code.erlang.gfm': false,
      'markup.code.gfm': false,
      'markup.code.go.gfm': false,
      'markup.code.haskell.gfm': false,
      'markup.code.html.gfm': false,
      'markup.code.java.gfm': false,
      'markup.code.js.gfm': false,
      'markup.code.json.gfm': false,
      'markup.code.julia.gfm': false,
      'markup.code.less.gfm': false,
      'markup.code.objc.gfm': false,
      'markup.code.php.gfm': false,
      'markup.code.python.console.gfm': false,
      'markup.code.python.gfm': false,
      'markup.code.r.gfm': false,
      'markup.code.ruby.gfm': false,
      'markup.code.rust.gfm': false,
      'markup.code.scala.gfm': false,
      'markup.code.shell.gfm': false,
      'markup.code.sql.gfm': false,
      'markup.code.swift.gfm': false,
      'markup.code.xml.gfm': false,
      'markup.code.yaml.gfm': false,
      'markup.raw.gfm': false,
      'markup.underline.link.gfm': false,
      'source.gfm': true,
      'string.emoji.gfm': false,
      'string.issue.number.gfm': false,
      'string.username.gfm': false,
      'text.embedded.md': true,
      'variable.issue.tag.gfm': false,
      'variable.mention.gfm': false
    }
  }, {
    grammarScopes: ['text.md' // language-markdown
    // The following are not included since filterRanges is not needed
    // embedded.text.md from language-markdown
    ],
    checkedScopes: {
      'abbreviation.reference.link.markup.md': false,
      'class.method.reference.gfm.variable.md': false,
      'class.reference.gfm.variable.md': false,
      'code.raw.markup.md': false,
      'embedded.text.md': true,
      'emoji.constant.gfm.md': false,
      'entity.constant.md': false,
      'fenced.code.md': false,
      'front-matter.toml.source.md': false,
      'front-matter.yaml.source.md': false,
      'instance.method.reference.gfm.variable.md': false,
      'issue.gfm.md': false,
      'reference.gfm.variable.md': false,
      'rmarkdown.attribute.meta.md': false,
      'special-attributes.raw.markup.md': false,
      'text.md': true,
      'uri.underline.link.md': false
    }
  }];
}

function provideLinter() {
  return {
    name: 'Spelling',
    scope: 'file',
    grammarScopes: ['*'],
    lintsOnChange: false,
    lint: _asyncToGenerator(function* (textEditor, scopeName) {
      var messages = [];
      global.grammarManager.updateLanguage(textEditor);
      var grammar = global.grammarManager.getGrammar(textEditor);
      if (grammar) {
        var filePath = textEditor.getPath();
        var languages = global.languageManager.getLanguages(textEditor);
        var filtered = {
          ranges: [textEditor.getBuffer().getRange()],
          ignoredRanges: []
        };
        var embeddedRanges = new Map();
        var current = _atom.Point.fromObject(filtered.ranges[0].start, true);

        while (filtered.ranges[0].containsPoint(current)) {
          var next = _atom.Point.fromObject(current, true);
          var scopeDescriptor = textEditor.scopeDescriptorForBufferPosition(current);

          do {
            if (textEditor.getBuffer().lineLengthForRow(next.row) === next.column) {
              next.row++;
              next.column = 0;
            } else {
              next.column++;
            }
          } while (filtered.ranges[0].containsPoint(next) && _.isEqual(scopeDescriptor.getScopesArray(), textEditor.scopeDescriptorForBufferPosition(next).getScopesArray()));

          var isIgnored = global.grammarManager.isIgnored(scopeDescriptor);
          var embeddedGrammar = isIgnored ? null : global.grammarManager.getEmbeddedGrammar(scopeDescriptor);

          if (embeddedGrammar && embeddedGrammar.filterRanges) {
            var g = new _atom.Range(_atom.Point.fromObject(current, true), _atom.Point.fromObject(next, true));
            if (embeddedRanges.has(embeddedGrammar)) {
              embeddedRanges.get(embeddedGrammar).push(g);
            } else {
              embeddedRanges.set(embeddedGrammar, [g]);
            }
          } else {
            embeddedGrammar = null;
          }

          if (isIgnored || embeddedGrammar) {
            // The current scope is ignored so we need to remove the range
            if (current === filtered.ranges[0].start) {
              // This range started with the current scope so just remove the ignored range from the beginning
              filtered.ranges[0].start = _atom.Point.fromObject(next, true);
            } else {
              // This range started with a different scope that was not ignored so we need to preserve the beginning
              var r = new _atom.Range(_atom.Point.fromObject(next, true), _atom.Point.fromObject(filtered.ranges[0].end, true));
              filtered.ranges[0].end = _atom.Point.fromObject(current, true);
              if (r.end.row < textEditor.getLineCount()) {
                filtered.ranges.unshift(r);
              }
            }
          }
          current = next;
        }

        if (filtered.ranges.length > 0 && grammar.filterRanges) {
          filtered = grammar.filterRanges(textEditor, filtered.ranges);
        }

        if (!filtered.ranges) filtered.ranges = [];
        if (!filtered.ignoredRanges) filtered.ignoredRanges = [];

        for (var _ref23 of embeddedRanges.entries()) {
          var _ref22 = _slicedToArray(_ref23, 2);

          var embeddedGrammar = _ref22[0];
          var ranges = _ref22[1];

          if (embeddedGrammar && embeddedGrammar.filterRanges) {
            var embeddedFiltered = embeddedGrammar.filterRanges(textEditor, ranges);
            filtered.ranges = _.concat(filtered.ranges, embeddedFiltered.ranges || []);
            filtered.ignoredRanges = _.concat(filtered.ignoredRanges, embeddedFiltered.ignoredRanges || []);
          } else {
            filtered.ranges.push(ranges);
          }
        }

        var _loop = function (ignoredRange) {
          filtered.ranges = _.flatMap(filtered.ranges, function (range) {
            if (range.intersectsWith(ignoredRange)) {
              var r = [];
              if (range.start.isLessThan(ignoredRange.start)) {
                r.push(new _atom.Range(range.start, ignoredRange.start));
              }
              if (ignoredRange.end.isLessThan(range.end)) {
                r.push(new _atom.Range(ignoredRange.end, range.end));
              }
              return r;
            } else {
              return range;
            }
          });
        };

        for (var ignoredRange of filtered.ignoredRanges) {
          _loop(ignoredRange);
        }

        _.remove(filtered.ranges, function (range) {
          return !range || range.isEmpty();
        });

        for (var checkRange of filtered.ranges) {
          var misspellings = yield global.dictionaryManager.checkRange(textEditor, languages, checkRange);

          var _loop2 = function (misspelling) {
            var word = textEditor.getTextInBufferRange(misspelling.range);
            var solutions = [];
            if (misspelling.suggestions) {
              solutions = _.map(misspelling.suggestions, function (suggestion, index) {
                return {
                  title: 'Change to "' + suggestion + '"',
                  position: misspelling.range,
                  apply: function apply() {
                    return textEditor.setTextInBufferRange(misspelling.range, suggestion);
                  }
                };
              });
            }
            if (misspelling.actions) {
              solutions = _.concat(solutions, _.map(misspelling.actions, function (action, index) {
                return {
                  title: action.title,
                  position: misspelling.range,
                  apply: action.apply
                };
              }));
            }
            messages.push({
              severity: atom.config.get('linter-spell.spellingErrorSeverity'),
              excerpt: word + ' -> ' + misspelling.suggestions.join(', '),
              location: {
                file: filePath,
                position: misspelling.range
              },
              solutions: solutions
            });
          };

          for (var misspelling of misspellings) {
            _loop2(misspelling);
          }
        }
      }
      return _.sortBy(messages, 'range');
    })
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL3Byb3ZpZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O29CQUU2QixNQUFNOztzQkFDaEIsUUFBUTs7SUFBZixDQUFDOztBQUhiLFdBQVcsQ0FBQTs7QUFJWCxJQUFNLG1CQUFtQixHQUFHLGtCQUFrQixDQUFBOztBQUV2QyxTQUFTLGNBQWMsR0FBSTtBQUNoQyxTQUFPLENBQUM7QUFDTixpQkFBYSxFQUFFLENBQ2IsWUFBWSxFQUNaLHlCQUF5QixDQUMxQjtBQUNELGlCQUFhLEVBQUU7QUFDYixrQkFBWSxFQUFFLElBQUk7QUFDbEIsK0JBQXlCLEVBQUUsSUFBSTtBQUMvQiwrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGdDQUEwQixFQUFFLEtBQUs7QUFDakMsa0NBQTRCLEVBQUUsS0FBSztBQUNuQyw4QkFBd0IsRUFBRSxLQUFLO0FBQy9CLCtCQUF5QixFQUFFLEtBQUs7QUFDaEMsK0JBQXlCLEVBQUUsS0FBSztBQUNoQywrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsNkJBQXVCLEVBQUUsS0FBSztBQUM5Qiw4QkFBd0IsRUFBRSxLQUFLO0FBQy9CLGdDQUEwQixFQUFFLEtBQUs7QUFDakMsNENBQXNDLEVBQUUsS0FBSztBQUM3Qyw2Q0FBdUMsRUFBRSxLQUFLO0FBQzlDLDRDQUFzQyxFQUFFLEtBQUs7QUFDN0MsMkNBQXFDLEVBQUUsS0FBSztBQUM1Qyw0Q0FBc0MsRUFBRSxLQUFLO0FBQzdDLDJDQUFxQyxFQUFFLEtBQUs7QUFDNUMsMkNBQXFDLEVBQUUsS0FBSztBQUM1QywyQ0FBcUMsRUFBRSxLQUFLO0FBQzVDLGtEQUE0QyxFQUFFLEtBQUs7QUFDbkQsNkNBQXVDLEVBQUUsS0FBSztBQUM5QyxnREFBMEMsRUFBRSxLQUFLO0FBQ2pELDJDQUFxQyxFQUFFLEtBQUs7QUFDNUMsOENBQXdDLEVBQUUs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V0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUU7QUFDM0Qsc0JBQVEsRUFBRTtBQUNSLG9CQUFJLEVBQUUsUUFBUTtBQUNkLHdCQUFRLEVBQUUsV0FBVyxDQUFDLEtBQUs7ZUFDNUI7QUFDRCx1QkFBUyxFQUFULFNBQVM7YUFDVixDQUFDLENBQUE7OztBQTVCSixlQUFLLElBQU0sV0FBVyxJQUFJLFlBQVksRUFBRTttQkFBN0IsV0FBVztXQTZCckI7U0FDRjtPQUNGO0FBQ0QsYUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUNuQyxDQUFBO0dBQ0YsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL3Byb3ZpZGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IFBvaW50LCBSYW5nZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcbmNvbnN0IGFzY2lpRG9jTGFuZ1BhdHRlcm4gPSAvXjpsYW5nOlxccyooXFxTKykvbVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUdyYW1tYXIgKCkge1xuICByZXR1cm4gW3tcbiAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAndGV4dC5wbGFpbicsXG4gICAgICAndGV4dC5wbGFpbi5udWxsLWdyYW1tYXInXG4gICAgXSxcbiAgICBjaGVja2VkU2NvcGVzOiB7XG4gICAgICAndGV4dC5wbGFpbic6IHRydWUsXG4gICAgICAndGV4dC5wbGFpbi5udWxsLWdyYW1tYXInOiB0cnVlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy50b2RvJzogZmFsc2UsIC8vIGlnbm9yZSBmcm9tIGxhbmd1YWdlLXRvZG9cbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3MuZml4bWUnOiBmYWxzZSxcbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3MuY2hhbmdlZCc6IGZhbHNlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy54eHgnOiBmYWxzZSxcbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3MuaWRlYSc6IGZhbHNlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy5oYWNrJzogZmFsc2UsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLm5vdGUnOiBmYWxzZSxcbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3MucmV2aWV3JzogZmFsc2UsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLm5iJzogZmFsc2UsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLmJ1Zyc6IGZhbHNlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy5yYWRhcic6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5odHRwLmh5cGVybGluayc6IGZhbHNlLCAvLyBpZ25vcmUgZnJvbSBsYW5ndWFnZS1oeXBlcmxpbmtcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuaHR0cHMuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLnNmdHAuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLmZ0cC5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuZmlsZS5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuc21iLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5hZnAuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLm5mcy5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsueC1tYW4tcGFnZS5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsueC1tYW4uaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLm1hbi1wYWdlLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5tYW4uaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLmdvcGhlci5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsudHhtbnQuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLmlzc3VlLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay4uaHlwZXJsaW5rJzogZmFsc2VcbiAgICB9XG4gIH0sIHtcbiAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAndGV4dC5naXQtY29tbWl0J1xuICAgIF0sXG4gICAgY2hlY2tlZFNjb3Blczoge1xuICAgICAgJy5tZXRhLnNjb3BlLm1lc3NhZ2UuZ2l0LWNvbW1pdCc6IHRydWVcbiAgICB9XG4gIH0sIHtcbiAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAnc291cmNlLmFzY2lpZG9jJ1xuICAgIF0sXG4gICAgZmluZExhbmd1YWdlVGFnczogdGV4dEVkaXRvciA9PiB7XG4gICAgICBsZXQgbGFuZ3VhZ2VzID0gW11cbiAgICAgIHRleHRFZGl0b3Iuc2Nhbihhc2NpaURvY0xhbmdQYXR0ZXJuLCAoe21hdGNoLCBzdG9wfSkgPT4ge1xuICAgICAgICBsYW5ndWFnZXMucHVzaChtYXRjaFsxXSlcbiAgICAgICAgc3RvcCgpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGxhbmd1YWdlc1xuICAgIH0sXG4gICAgY2hlY2tlZFNjb3Blczoge1xuICAgICAgJ2VudGl0eS5uYW1lLmZ1bmN0aW9uLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnZW50aXR5Lm5hbWUudGFnLnlhbWwnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuYmxvY2tpZC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmFzY2lpZG9jLnByb3BlcnRpZXMuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY2xvanVyZS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNvZmZlZS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNwcC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNzLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY3NzLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY3NzLmxlc3MuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jc3Muc2Nzcy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmRpZmYuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5kb2NrZXJmaWxlLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZWxpeGlyLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZWxtLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZXJsYW5nLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZ2ZtLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZ28uYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5ncm9vdnkuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5oYXNrZWxsLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuaHRtbC5iYXNpYy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmh0bWwubXVzdGFjaGUuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5odG1sLnBocC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmphdmEuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5qcy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmpzLmpzeC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmpzb24uYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5qdWxpYS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLm1ha2VmaWxlLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUub2JqYy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLm9jYW1sLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucGVybC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnBlcmw2LmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucHl0aG9uLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuci5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnJ1YnkuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5ydXN0LmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuc2Fzcy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnNjYWxhLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuc2hlbGwuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zcWwuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zd2lmdC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnRvbWwuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS50cy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnhtbC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnlhbWwuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAubGluay5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5yYXcuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAucmF3Lm1vbm9zcGFjZS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ3NvdXJjZS5hc2NpaWRvYyc6IHRydWUsXG4gICAgICAnc3VwcG9ydC5jb25zdGFudC5hdHRyaWJ1dGUtbmFtZS5hc2NpaWRvYyc6IGZhbHNlXG4gICAgfVxuICB9LCB7XG4gICAgZ3JhbW1hclNjb3BlczogW1xuICAgICAgJ3NvdXJjZS5nZm0nIC8vIGxhbmd1YWdlLWdmbVxuICAgICAgLy8gVGhlIGZvbGxvd2luZyBhcmUgbm90IGluY2x1ZGVkIHNpbmNlIGZpbHRlclJhbmdlcyBpcyBub3QgbmVlZGVkXG4gICAgICAvLyBzb3VyY2UuZW1iZWRkZWQuZ2ZtIGZyb20gbGFuZ3VhZ2UtYXNjaWlkb2NcbiAgICAgIC8vIHRleHQuZW1iZWRkZWQubWQgZnJvbSBsYW5ndWFnZS1nZm1cbiAgICBdLFxuICAgIGNoZWNrZWRTY29wZXM6IHtcbiAgICAgICdjb25zdGFudC5jaGFyYWN0ZXIuZW50aXR5LmdmbSc6IGZhbHNlLFxuICAgICAgJ2NvbnN0YW50LmNoYXJhY3Rlci5lc2NhcGUuZ2ZtJzogZmFsc2UsXG4gICAgICAnZnJvbnQtbWF0dGVyLnlhbWwuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuYy5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jbG9qdXJlLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNvZmZlZS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jcHAuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY3MuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY3NzLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmRpZmYuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZWxpeGlyLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmVsbS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5lcmxhbmcuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZ28uZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuaGFza2VsbC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5odG1sLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmphdmEuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuanMuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuanNvbi5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5qdWxpYS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5sZXNzLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLm9iamMuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucGhwLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnB5dGhvbi5jb25zb2xlLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnB5dGhvbi5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5yLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnJ1YnkuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucnVzdC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zY2FsYS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zaGVsbC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zcWwuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuc3dpZnQuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUueG1sLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnlhbWwuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnJhdy5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuZ2ZtJzogZmFsc2UsXG4gICAgICAnc291cmNlLmdmbSc6IHRydWUsXG4gICAgICAnc3RyaW5nLmVtb2ppLmdmbSc6IGZhbHNlLFxuICAgICAgJ3N0cmluZy5pc3N1ZS5udW1iZXIuZ2ZtJzogZmFsc2UsXG4gICAgICAnc3RyaW5nLnVzZXJuYW1lLmdmbSc6IGZhbHNlLFxuICAgICAgJ3RleHQuZW1iZWRkZWQubWQnOiB0cnVlLFxuICAgICAgJ3ZhcmlhYmxlLmlzc3VlLnRhZy5nZm0nOiBmYWxzZSxcbiAgICAgICd2YXJpYWJsZS5tZW50aW9uLmdmbSc6IGZhbHNlXG4gICAgfVxuICB9LCB7XG4gICAgZ3JhbW1hclNjb3BlczogW1xuICAgICAgJ3RleHQubWQnIC8vIGxhbmd1YWdlLW1hcmtkb3duXG4gICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZSBub3QgaW5jbHVkZWQgc2luY2UgZmlsdGVyUmFuZ2VzIGlzIG5vdCBuZWVkZWRcbiAgICAgIC8vIGVtYmVkZGVkLnRleHQubWQgZnJvbSBsYW5ndWFnZS1tYXJrZG93blxuICAgIF0sXG4gICAgY2hlY2tlZFNjb3Blczoge1xuICAgICAgJ2FiYnJldmlhdGlvbi5yZWZlcmVuY2UubGluay5tYXJrdXAubWQnOiBmYWxzZSxcbiAgICAgICdjbGFzcy5tZXRob2QucmVmZXJlbmNlLmdmbS52YXJpYWJsZS5tZCc6IGZhbHNlLFxuICAgICAgJ2NsYXNzLnJlZmVyZW5jZS5nZm0udmFyaWFibGUubWQnOiBmYWxzZSxcbiAgICAgICdjb2RlLnJhdy5tYXJrdXAubWQnOiBmYWxzZSxcbiAgICAgICdlbWJlZGRlZC50ZXh0Lm1kJzogdHJ1ZSxcbiAgICAgICdlbW9qaS5jb25zdGFudC5nZm0ubWQnOiBmYWxzZSxcbiAgICAgICdlbnRpdHkuY29uc3RhbnQubWQnOiBmYWxzZSxcbiAgICAgICdmZW5jZWQuY29kZS5tZCc6IGZhbHNlLFxuICAgICAgJ2Zyb250LW1hdHRlci50b21sLnNvdXJjZS5tZCc6IGZhbHNlLFxuICAgICAgJ2Zyb250LW1hdHRlci55YW1sLnNvdXJjZS5tZCc6IGZhbHNlLFxuICAgICAgJ2luc3RhbmNlLm1ldGhvZC5yZWZlcmVuY2UuZ2ZtLnZhcmlhYmxlLm1kJzogZmFsc2UsXG4gICAgICAnaXNzdWUuZ2ZtLm1kJzogZmFsc2UsXG4gICAgICAncmVmZXJlbmNlLmdmbS52YXJpYWJsZS5tZCc6IGZhbHNlLFxuICAgICAgJ3JtYXJrZG93bi5hdHRyaWJ1dGUubWV0YS5tZCc6IGZhbHNlLFxuICAgICAgJ3NwZWNpYWwtYXR0cmlidXRlcy5yYXcubWFya3VwLm1kJzogZmFsc2UsXG4gICAgICAndGV4dC5tZCc6IHRydWUsXG4gICAgICAndXJpLnVuZGVybGluZS5saW5rLm1kJzogZmFsc2VcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlTGludGVyICgpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnU3BlbGxpbmcnLFxuICAgIHNjb3BlOiAnZmlsZScsXG4gICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgbGludHNPbkNoYW5nZTogZmFsc2UsXG4gICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IsIHNjb3BlTmFtZSkgPT4ge1xuICAgICAgbGV0IG1lc3NhZ2VzID0gW11cbiAgICAgIGdsb2JhbC5ncmFtbWFyTWFuYWdlci51cGRhdGVMYW5ndWFnZSh0ZXh0RWRpdG9yKVxuICAgICAgY29uc3QgZ3JhbW1hciA9IGdsb2JhbC5ncmFtbWFyTWFuYWdlci5nZXRHcmFtbWFyKHRleHRFZGl0b3IpXG4gICAgICBpZiAoZ3JhbW1hcikge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIGNvbnN0IGxhbmd1YWdlcyA9IGdsb2JhbC5sYW5ndWFnZU1hbmFnZXIuZ2V0TGFuZ3VhZ2VzKHRleHRFZGl0b3IpXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IHtcbiAgICAgICAgICByYW5nZXM6IFt0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmdldFJhbmdlKCldLFxuICAgICAgICAgIGlnbm9yZWRSYW5nZXM6IFtdXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVtYmVkZGVkUmFuZ2VzID0gbmV3IE1hcCgpXG4gICAgICAgIGxldCBjdXJyZW50ID0gUG9pbnQuZnJvbU9iamVjdChmaWx0ZXJlZC5yYW5nZXNbMF0uc3RhcnQsIHRydWUpXG5cbiAgICAgICAgd2hpbGUgKGZpbHRlcmVkLnJhbmdlc1swXS5jb250YWluc1BvaW50KGN1cnJlbnQpKSB7XG4gICAgICAgICAgbGV0IG5leHQgPSBQb2ludC5mcm9tT2JqZWN0KGN1cnJlbnQsIHRydWUpXG4gICAgICAgICAgbGV0IHNjb3BlRGVzY3JpcHRvciA9IHRleHRFZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oY3VycmVudClcblxuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3cobmV4dC5yb3cpID09PSBuZXh0LmNvbHVtbikge1xuICAgICAgICAgICAgICBuZXh0LnJvdysrXG4gICAgICAgICAgICAgIG5leHQuY29sdW1uID0gMFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV4dC5jb2x1bW4rK1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gd2hpbGUgKGZpbHRlcmVkLnJhbmdlc1swXS5jb250YWluc1BvaW50KG5leHQpICYmIF8uaXNFcXVhbChzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKSwgdGV4dEVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihuZXh0KS5nZXRTY29wZXNBcnJheSgpKSlcblxuICAgICAgICAgIGNvbnN0IGlzSWdub3JlZCA9IGdsb2JhbC5ncmFtbWFyTWFuYWdlci5pc0lnbm9yZWQoc2NvcGVEZXNjcmlwdG9yKVxuICAgICAgICAgIGxldCBlbWJlZGRlZEdyYW1tYXIgPSBpc0lnbm9yZWQgPyBudWxsIDogZ2xvYmFsLmdyYW1tYXJNYW5hZ2VyLmdldEVtYmVkZGVkR3JhbW1hcihzY29wZURlc2NyaXB0b3IpXG5cbiAgICAgICAgICBpZiAoZW1iZWRkZWRHcmFtbWFyICYmIGVtYmVkZGVkR3JhbW1hci5maWx0ZXJSYW5nZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBuZXcgUmFuZ2UoUG9pbnQuZnJvbU9iamVjdChjdXJyZW50LCB0cnVlKSwgUG9pbnQuZnJvbU9iamVjdChuZXh0LCB0cnVlKSlcbiAgICAgICAgICAgIGlmIChlbWJlZGRlZFJhbmdlcy5oYXMoZW1iZWRkZWRHcmFtbWFyKSkge1xuICAgICAgICAgICAgICBlbWJlZGRlZFJhbmdlcy5nZXQoZW1iZWRkZWRHcmFtbWFyKS5wdXNoKGcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbWJlZGRlZFJhbmdlcy5zZXQoZW1iZWRkZWRHcmFtbWFyLCBbZ10pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVtYmVkZGVkR3JhbW1hciA9IG51bGxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNJZ25vcmVkIHx8IGVtYmVkZGVkR3JhbW1hcikge1xuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgc2NvcGUgaXMgaWdub3JlZCBzbyB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgcmFuZ2VcbiAgICAgICAgICAgIGlmIChjdXJyZW50ID09PSBmaWx0ZXJlZC5yYW5nZXNbMF0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyByYW5nZSBzdGFydGVkIHdpdGggdGhlIGN1cnJlbnQgc2NvcGUgc28ganVzdCByZW1vdmUgdGhlIGlnbm9yZWQgcmFuZ2UgZnJvbSB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICAgIGZpbHRlcmVkLnJhbmdlc1swXS5zdGFydCA9IFBvaW50LmZyb21PYmplY3QobmV4dCwgdHJ1ZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgcmFuZ2Ugc3RhcnRlZCB3aXRoIGEgZGlmZmVyZW50IHNjb3BlIHRoYXQgd2FzIG5vdCBpZ25vcmVkIHNvIHdlIG5lZWQgdG8gcHJlc2VydmUgdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgICBsZXQgciA9IG5ldyBSYW5nZShQb2ludC5mcm9tT2JqZWN0KG5leHQsIHRydWUpLCBQb2ludC5mcm9tT2JqZWN0KGZpbHRlcmVkLnJhbmdlc1swXS5lbmQsIHRydWUpKVxuICAgICAgICAgICAgICBmaWx0ZXJlZC5yYW5nZXNbMF0uZW5kID0gUG9pbnQuZnJvbU9iamVjdChjdXJyZW50LCB0cnVlKVxuICAgICAgICAgICAgICBpZiAoci5lbmQucm93IDwgdGV4dEVkaXRvci5nZXRMaW5lQ291bnQoKSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkLnJhbmdlcy51bnNoaWZ0KHIpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudCA9IG5leHRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWx0ZXJlZC5yYW5nZXMubGVuZ3RoID4gMCAmJiBncmFtbWFyLmZpbHRlclJhbmdlcykge1xuICAgICAgICAgIGZpbHRlcmVkID0gZ3JhbW1hci5maWx0ZXJSYW5nZXModGV4dEVkaXRvciwgZmlsdGVyZWQucmFuZ2VzKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmaWx0ZXJlZC5yYW5nZXMpIGZpbHRlcmVkLnJhbmdlcyA9IFtdXG4gICAgICAgIGlmICghZmlsdGVyZWQuaWdub3JlZFJhbmdlcykgZmlsdGVyZWQuaWdub3JlZFJhbmdlcyA9IFtdXG5cbiAgICAgICAgZm9yIChjb25zdCBbZW1iZWRkZWRHcmFtbWFyLCByYW5nZXNdIG9mIGVtYmVkZGVkUmFuZ2VzLmVudHJpZXMoKSkge1xuICAgICAgICAgIGlmIChlbWJlZGRlZEdyYW1tYXIgJiYgZW1iZWRkZWRHcmFtbWFyLmZpbHRlclJhbmdlcykge1xuICAgICAgICAgICAgY29uc3QgZW1iZWRkZWRGaWx0ZXJlZCA9IGVtYmVkZGVkR3JhbW1hci5maWx0ZXJSYW5nZXModGV4dEVkaXRvciwgcmFuZ2VzKVxuICAgICAgICAgICAgZmlsdGVyZWQucmFuZ2VzID0gXy5jb25jYXQoZmlsdGVyZWQucmFuZ2VzLCBlbWJlZGRlZEZpbHRlcmVkLnJhbmdlcyB8fCBbXSlcbiAgICAgICAgICAgIGZpbHRlcmVkLmlnbm9yZWRSYW5nZXMgPSBfLmNvbmNhdChmaWx0ZXJlZC5pZ25vcmVkUmFuZ2VzLCBlbWJlZGRlZEZpbHRlcmVkLmlnbm9yZWRSYW5nZXMgfHwgW10pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlcmVkLnJhbmdlcy5wdXNoKHJhbmdlcylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGlnbm9yZWRSYW5nZSBvZiBmaWx0ZXJlZC5pZ25vcmVkUmFuZ2VzKSB7XG4gICAgICAgICAgZmlsdGVyZWQucmFuZ2VzID0gXy5mbGF0TWFwKGZpbHRlcmVkLnJhbmdlcywgcmFuZ2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJhbmdlLmludGVyc2VjdHNXaXRoKGlnbm9yZWRSYW5nZSkpIHtcbiAgICAgICAgICAgICAgbGV0IHIgPSBbXVxuICAgICAgICAgICAgICBpZiAocmFuZ2Uuc3RhcnQuaXNMZXNzVGhhbihpZ25vcmVkUmFuZ2Uuc3RhcnQpKSB7XG4gICAgICAgICAgICAgICAgci5wdXNoKG5ldyBSYW5nZShyYW5nZS5zdGFydCwgaWdub3JlZFJhbmdlLnN0YXJ0KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWdub3JlZFJhbmdlLmVuZC5pc0xlc3NUaGFuKHJhbmdlLmVuZCkpIHtcbiAgICAgICAgICAgICAgICByLnB1c2gobmV3IFJhbmdlKGlnbm9yZWRSYW5nZS5lbmQsIHJhbmdlLmVuZCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiByYW5nZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBfLnJlbW92ZShmaWx0ZXJlZC5yYW5nZXMsIHJhbmdlID0+ICFyYW5nZSB8fCByYW5nZS5pc0VtcHR5KCkpXG5cbiAgICAgICAgZm9yIChsZXQgY2hlY2tSYW5nZSBvZiBmaWx0ZXJlZC5yYW5nZXMpIHtcbiAgICAgICAgICBjb25zdCBtaXNzcGVsbGluZ3MgPSBhd2FpdCBnbG9iYWwuZGljdGlvbmFyeU1hbmFnZXIuY2hlY2tSYW5nZSh0ZXh0RWRpdG9yLCBsYW5ndWFnZXMsIGNoZWNrUmFuZ2UpXG4gICAgICAgICAgZm9yIChjb25zdCBtaXNzcGVsbGluZyBvZiBtaXNzcGVsbGluZ3MpIHtcbiAgICAgICAgICAgIGxldCB3b3JkID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShtaXNzcGVsbGluZy5yYW5nZSlcbiAgICAgICAgICAgIGxldCBzb2x1dGlvbnMgPSBbXVxuICAgICAgICAgICAgaWYgKG1pc3NwZWxsaW5nLnN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICAgIHNvbHV0aW9ucyA9IF8ubWFwKG1pc3NwZWxsaW5nLnN1Z2dlc3Rpb25zLFxuICAgICAgICAgICAgICAoc3VnZ2VzdGlvbiwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGBDaGFuZ2UgdG8gXCIke3N1Z2dlc3Rpb259XCJgLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBtaXNzcGVsbGluZy5yYW5nZSxcbiAgICAgICAgICAgICAgICBhcHBseTogKCkgPT4gdGV4dEVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShtaXNzcGVsbGluZy5yYW5nZSwgc3VnZ2VzdGlvbilcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWlzc3BlbGxpbmcuYWN0aW9ucykge1xuICAgICAgICAgICAgICBzb2x1dGlvbnMgPSBfLmNvbmNhdChzb2x1dGlvbnMsXG4gICAgICAgICAgICAgICAgXy5tYXAobWlzc3BlbGxpbmcuYWN0aW9ucywgKGFjdGlvbiwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogYWN0aW9uLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IG1pc3NwZWxsaW5nLnJhbmdlLFxuICAgICAgICAgICAgICAgICAgYXBwbHk6IGFjdGlvbi5hcHBseVxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgc2V2ZXJpdHk6IGF0b20uY29uZmlnLmdldCgnbGludGVyLXNwZWxsLnNwZWxsaW5nRXJyb3JTZXZlcml0eScpLFxuICAgICAgICAgICAgICBleGNlcnB0OiBgJHt3b3JkfSAtPiAke21pc3NwZWxsaW5nLnN1Z2dlc3Rpb25zLmpvaW4oJywgJyl9YCxcbiAgICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICBmaWxlOiBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbWlzc3BlbGxpbmcucmFuZ2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNvbHV0aW9ucyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gXy5zb3J0QnkobWVzc2FnZXMsICdyYW5nZScpXG4gICAgfVxuICB9XG59XG4iXX0=