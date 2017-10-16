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
              severity: 'warning',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItc3BlbGwvbGliL3Byb3ZpZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O29CQUU2QixNQUFNOztzQkFDaEIsUUFBUTs7SUFBZixDQUFDOztBQUhiLFdBQVcsQ0FBQTs7QUFJWCxJQUFNLG1CQUFtQixHQUFHLGtCQUFrQixDQUFBOztBQUV2QyxTQUFTLGNBQWMsR0FBSTtBQUNoQyxTQUFPLENBQUM7QUFDTixpQkFBYSxFQUFFLENBQ2IsWUFBWSxFQUNaLHlCQUF5QixDQUMxQjtBQUNELGlCQUFhLEVBQUU7QUFDYixrQkFBWSxFQUFFLElBQUk7QUFDbEIsK0JBQXlCLEVBQUUsSUFBSTtBQUMvQiwrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGdDQUEwQixFQUFFLEtBQUs7QUFDakMsa0NBQTRCLEVBQUUsS0FBSztBQUNuQyw4QkFBd0IsRUFBRSxLQUFLO0FBQy9CLCtCQUF5QixFQUFFLEtBQUs7QUFDaEMsK0JBQXlCLEVBQUUsS0FBSztBQUNoQywrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsNkJBQXVCLEVBQUUsS0FBSztBQUM5Qiw4QkFBd0IsRUFBRSxLQUFLO0FBQy9CLGdDQUEwQixFQUFFLEtBQUs7QUFDakMsNENBQXNDLEVBQUUsS0FBSztBQUM3Qyw2Q0FBdUMsRUFBRSxLQUFLO0FBQzlDLDRDQUFzQyxFQUFFLEtBQUs7QUFDN0MsMkNBQXFDLEVBQUUsS0FBSztBQUM1Qyw0Q0FBc0MsRUFBRSxLQUFLO0FBQzdDLDJDQUFxQyxFQUFFLEtBQUs7QUFDNUMsMkNBQXFDLEVBQUUsS0FBSztBQUM1QywyQ0FBcUMsRUFBRSxLQUFLO0FBQzVDLGtEQUE0QyxFQUFFLEtBQUs7QUFDbkQsNkNBQXVDLEVBQUUsS0FBSztBQUM5QyxnREFBMEMsRUFBRSxLQUFLO0FBQ2pELDJDQUFxQyxFQUFFLEtBQUs7QUFDNUMsOENBQXdDLEVBQUUsS0FBSztBQUMvQyw2Q0FBdUMsRUFBRSxLQUFLO0FBQzlDLDZDQUF1QyxFQUFFLEtBQUs7QUFDOUMsd0NBQWtDLEVBQUUsS0FBSztLQUMxQztHQUNGLEVBQUU7QUFDRCxpQkFBYSxFQUFFLENBQ2IsaUJBQWlCLENBQ2xCO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLHNDQUFnQyxFQUFFLElBQUk7S0FDdkM7R0FDRixFQUFFO0FBQ0QsaUJBQWEsRUFBRSxDQUNiLGlCQUFpQixDQUNsQjtBQUNELG9CQUFnQixFQUFFLDBCQUFBLFVBQVUsRUFBSTtBQUM5QixVQUFJLFNBQVMsR0FBRyxFQUFFLENBQUE7QUFDbEIsZ0JBQVUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxJQUFhLEVBQUs7WUFBakIsS0FBSyxHQUFOLElBQWEsQ0FBWixLQUFLO1lBQUUsSUFBSSxHQUFaLElBQWEsQ0FBTCxJQUFJOztBQUNoRCxpQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4QixZQUFJLEVBQUUsQ0FBQTtPQUNQLENBQUMsQ0FBQTtBQUNGLGFBQU8sU0FBUyxDQUFBO0tBQ2pCO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLHFDQUErQixFQUFFLEtBQUs7QUFDdEMsNEJBQXNCLEVBQUUsS0FBSztBQUM3QiwrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGdEQUEwQyxFQUFFLEtBQUs7QUFDakQsOEJBQXdCLEVBQUUsS0FBSztBQUMvQixvQ0FBOEIsRUFBRSxLQUFLO0FBQ3JDLG1DQUE2QixFQUFFLEtBQUs7QUFDcEMsZ0NBQTBCLEVBQUUsS0FBSztBQUNqQywrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGdDQUEwQixFQUFFLEtBQUs7QUFDakMscUNBQStCLEVBQUUsS0FBSztBQUN0QyxxQ0FBK0IsRUFBRSxLQUFLO0FBQ3RDLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsdUNBQWlDLEVBQUUsS0FBSztBQUN4QyxtQ0FBNkIsRUFBRSxLQUFLO0FBQ3BDLGdDQUEwQixFQUFFLEtBQUs7QUFDakMsbUNBQTZCLEVBQUUsS0FBSztBQUNwQyxnQ0FBMEIsRUFBRSxLQUFLO0FBQ2pDLCtCQUF5QixFQUFFLEtBQUs7QUFDaEMsbUNBQTZCLEVBQUUsS0FBSztBQUNwQyxvQ0FBOEIsRUFBRSxLQUFLO0FBQ3JDLHVDQUFpQyxFQUFFLEtBQUs7QUFDeEMsMENBQW9DLEVBQUUsS0FBSztBQUMzQyxxQ0FBK0IsRUFBRSxLQUFLO0FBQ3RDLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsK0JBQXlCLEVBQUUsS0FBSztBQUNoQyxtQ0FBNkIsRUFBRSxLQUFLO0FBQ3BDLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsa0NBQTRCLEVBQUUsS0FBSztBQUNuQyxxQ0FBK0IsRUFBRSxLQUFLO0FBQ3RDLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsa0NBQTRCLEVBQUUsS0FBSztBQUNuQyxpQ0FBMkIsRUFBRSxLQUFLO0FBQ2xDLGtDQUE0QixFQUFFLEtBQUs7QUFDbkMsbUNBQTZCLEVBQUUsS0FBSztBQUNwQyw4QkFBd0IsRUFBRSxLQUFLO0FBQy9CLGlDQUEyQixFQUFFLEtBQUs7QUFDbEMsaUNBQTJCLEVBQUUsS0FBSztBQUNsQyxpQ0FBMkIsRUFBRSxLQUFLO0FBQ2xDLGtDQUE0QixFQUFFLEtBQUs7QUFDbkMsa0NBQTRCLEVBQUUsS0FBSztBQUNuQyxnQ0FBMEIsRUFBRSxLQUFLO0FBQ2pDLGtDQUE0QixFQUFFLEtBQUs7QUFDbkMsaUNBQTJCLEVBQUUsS0FBSztBQUNsQywrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLGdDQUEwQixFQUFFLEtBQUs7QUFDakMsaUNBQTJCLEVBQUUsS0FBSztBQUNsQyw0QkFBc0IsRUFBRSxLQUFLO0FBQzdCLDJCQUFxQixFQUFFLEtBQUs7QUFDNUIscUNBQStCLEVBQUUsS0FBSztBQUN0Qyx1QkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLGdEQUEwQyxFQUFFLEtBQUs7S0FDbEQ7R0FDRixFQUFFO0FBQ0QsaUJBQWEsRUFBRSxDQUNiLFlBQVk7Ozs7S0FJYjtBQUNELGlCQUFhLEVBQUU7QUFDYixxQ0FBK0IsRUFBRSxLQUFLO0FBQ3RDLHFDQUErQixFQUFFLEtBQUs7QUFDdEMsNkJBQXVCLEVBQUUsS0FBSztBQUM5Qix5QkFBbUIsRUFBRSxLQUFLO0FBQzFCLCtCQUF5QixFQUFFLEtBQUs7QUFDaEMsOEJBQXdCLEVBQUUsS0FBSztBQUMvQiwyQkFBcUIsRUFBRSxLQUFLO0FBQzVCLDBCQUFvQixFQUFFLEtBQUs7QUFDM0IsMkJBQXFCLEVBQUUsS0FBSztBQUM1Qiw0QkFBc0IsRUFBRSxLQUFLO0FBQzdCLDhCQUF3QixFQUFFLEtBQUs7QUFDL0IsMkJBQXFCLEVBQUUsS0FBSztBQUM1Qiw4QkFBd0IsRUFBRSxLQUFLO0FBQy9CLHVCQUFpQixFQUFFLEtBQUs7QUFDeEIsMEJBQW9CLEVBQUUsS0FBSztBQUMzQiwrQkFBeUIsRUFBRSxLQUFLO0FBQ2hDLDRCQUFzQixFQUFFLEtBQUs7QUFDN0IsNEJBQXNCLEVBQUUsS0FBSztBQUM3QiwwQkFBb0IsRUFBRSxLQUFLO0FBQzNCLDRCQUFzQixFQUFFLEtBQUs7QUFDN0IsNkJBQXVCLEVBQUUsS0FBSztBQUM5Qiw0QkFBc0IsRUFBRSxLQUFLO0FBQzdCLDRCQUFzQixFQUFFLEtBQUs7QUFDN0IsMkJBQXFCLEVBQUUsS0FBSztBQUM1QixzQ0FBZ0MsRUFBRSxLQUFLO0FBQ3ZDLDhCQUF3QixFQUFFLEtBQUs7QUFDL0IseUJBQW1CLEVBQUUsS0FBSztBQUMxQiw0QkFBc0IsRUFBRSxLQUFLO0FBQzdCLDRCQUFzQixFQUFFLEtBQUs7QUFDN0IsNkJBQXVCLEVBQUUsS0FBSztBQUM5Qiw2QkFBdUIsRUFBRSxLQUFLO0FBQzlCLDJCQUFxQixFQUFFLEtBQUs7QUFDNUIsNkJBQXVCLEVBQUUsS0FBSztBQUM5QiwyQkFBcUIsRUFBRSxLQUFLO0FBQzVCLDRCQUFzQixFQUFFLEtBQUs7QUFDN0Isc0JBQWdCLEVBQUUsS0FBSztBQUN2QixpQ0FBMkIsRUFBRSxLQUFLO0FBQ2xDLGtCQUFZLEVBQUUsSUFBSTtBQUNsQix3QkFBa0IsRUFBRSxLQUFLO0FBQ3pCLCtCQUF5QixFQUFFLEtBQUs7QUFDaEMsMkJBQXFCLEVBQUUsS0FBSztBQUM1Qix3QkFBa0IsRUFBRSxJQUFJO0FBQ3hCLDhCQUF3QixFQUFFLEtBQUs7QUFDL0IsNEJBQXNCLEVBQUUsS0FBSztLQUM5QjtHQUNGLEVBQUU7QUFDRCxpQkFBYSxFQUFFLENBQ2IsU0FBUzs7O0tBR1Y7QUFDRCxpQkFBYSxFQUFFO0FBQ2IsNkNBQXVDLEVBQUUsS0FBSztBQUM5Qyw4Q0FBd0MsRUFBRSxLQUFLO0FBQy9DLHVDQUFpQyxFQUFFLEtBQUs7QUFDeEMsMEJBQW9CLEVBQUUsS0FBSztBQUMzQix3QkFBa0IsRUFBRSxJQUFJO0FBQ3hCLDZCQUF1QixFQUFFLEtBQUs7QUFDOUIsMEJBQW9CLEVBQUUsS0FBSztBQUMzQixzQkFBZ0IsRUFBRSxLQUFLO0FBQ3ZCLG1DQUE2QixFQUFFLEtBQUs7QUFDcEMsbUNBQTZCLEVBQUUsS0FBSztBQUNwQyxpREFBMkMsRUFBRSxLQUFLO0FBQ2xELG9CQUFjLEVBQUUsS0FBSztBQUNyQixpQ0FBMkIsRUFBRSxLQUFLO0FBQ2xDLG1DQUE2QixFQUFFLEtBQUs7QUFDcEMsd0NBQWtDLEVBQUUsS0FBSztBQUN6QyxlQUFTLEVBQUUsSUFBSTtBQUNmLDZCQUF1QixFQUFFLEtBQUs7S0FDL0I7R0FDRixDQUFDLENBQUE7Q0FDSDs7QUFFTSxTQUFTLGFBQWEsR0FBSTtBQUMvQixTQUFPO0FBQ0wsUUFBSSxFQUFFLFVBQVU7QUFDaEIsU0FBSyxFQUFFLE1BQU07QUFDYixpQkFBYSxFQUFFLENBQUMsR0FBRyxDQUFDO0FBQ3BCLGlCQUFhLEVBQUUsS0FBSztBQUNwQixRQUFJLG9CQUFFLFdBQU8sVUFBVSxFQUFFLFNBQVMsRUFBSztBQUNyQyxVQUFJLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDakIsWUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDaEQsVUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDNUQsVUFBSSxPQUFPLEVBQUU7QUFDWCxZQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDckMsWUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDakUsWUFBSSxRQUFRLEdBQUc7QUFDYixnQkFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzNDLHVCQUFhLEVBQUUsRUFBRTtTQUNsQixDQUFBO0FBQ0QsWUFBSSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM5QixZQUFJLE9BQU8sR0FBRyxZQUFNLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFOUQsZUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNoRCxjQUFJLElBQUksR0FBRyxZQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsY0FBSSxlQUFlLEdBQUcsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUUxRSxhQUFHO0FBQ0QsZ0JBQUksVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JFLGtCQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVixrQkFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7YUFDaEIsTUFBTTtBQUNMLGtCQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7YUFDZDtXQUNGLFFBQVEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUUsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUM7O0FBRW5LLGNBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ2xFLGNBQUksZUFBZSxHQUFHLFNBQVMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQTs7QUFFbEcsY0FBSSxlQUFlLElBQUksZUFBZSxDQUFDLFlBQVksRUFBRTtBQUNuRCxnQkFBTSxDQUFDLEdBQUcsZ0JBQVUsWUFBTSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLFlBQU0sVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQ2xGLGdCQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDdkMsNEJBQWMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQzVDLE1BQU07QUFDTCw0QkFBYyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ3pDO1dBQ0YsTUFBTTtBQUNMLDJCQUFlLEdBQUcsSUFBSSxDQUFBO1dBQ3ZCOztBQUVELGNBQUksU0FBUyxJQUFJLGVBQWUsRUFBRTs7QUFFaEMsZ0JBQUksT0FBTyxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFOztBQUV4QyxzQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBTSxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO2FBQ3hELE1BQU07O0FBRUwsa0JBQUksQ0FBQyxHQUFHLGdCQUFVLFlBQU0sVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxZQUFNLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQy9GLHNCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxZQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDeEQsa0JBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLFlBQVksRUFBRSxFQUFFO0FBQ3pDLHdCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtlQUMzQjthQUNGO1dBQ0Y7QUFDRCxpQkFBTyxHQUFHLElBQUksQ0FBQTtTQUNmOztBQUVELFlBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7QUFDdEQsa0JBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDN0Q7O0FBRUQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDMUMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUE7O0FBRXhELDJCQUF3QyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUU7OztjQUF0RCxlQUFlO2NBQUUsTUFBTTs7QUFDakMsY0FBSSxlQUFlLElBQUksZUFBZSxDQUFDLFlBQVksRUFBRTtBQUNuRCxnQkFBTSxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUN6RSxvQkFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQzFFLG9CQUFRLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUE7V0FDaEcsTUFBTTtBQUNMLG9CQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtXQUM3QjtTQUNGOzs4QkFFVSxZQUFZO0FBQ3JCLGtCQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFBLEtBQUssRUFBSTtBQUNwRCxnQkFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ3RDLGtCQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVixrQkFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDOUMsaUJBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQVUsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtlQUNuRDtBQUNELGtCQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMxQyxpQkFBQyxDQUFDLElBQUksQ0FBQyxnQkFBVSxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO2VBQy9DO0FBQ0QscUJBQU8sQ0FBQyxDQUFBO2FBQ1QsTUFBTTtBQUNMLHFCQUFPLEtBQUssQ0FBQTthQUNiO1dBQ0YsQ0FBQyxDQUFBOzs7QUFkSixhQUFLLElBQU0sWUFBWSxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUU7Z0JBQXhDLFlBQVk7U0FldEI7O0FBRUQsU0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQUEsS0FBSztpQkFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1NBQUEsQ0FBQyxDQUFBOztBQUU3RCxhQUFLLElBQUksVUFBVSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDdEMsY0FBTSxZQUFZLEdBQUcsTUFBTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7O2lDQUN0RixXQUFXO0FBQ3BCLGdCQUFJLElBQUksR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzdELGdCQUFJLFNBQVMsR0FBRyxFQUFFLENBQUE7QUFDbEIsZ0JBQUksV0FBVyxDQUFDLFdBQVcsRUFBRTtBQUMzQix1QkFBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFDekMsVUFBQyxVQUFVLEVBQUUsS0FBSzt1QkFBTTtBQUN0Qix1QkFBSyxrQkFBZ0IsVUFBVSxNQUFHO0FBQ2xDLDBCQUFRLEVBQUUsV0FBVyxDQUFDLEtBQUs7QUFDM0IsdUJBQUssRUFBRTsyQkFBTSxVQUFVLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7bUJBQUE7aUJBQzVFO2VBQUMsQ0FBQyxDQUFBO2FBQ0o7QUFDRCxnQkFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLHVCQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQzVCLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLO3VCQUFNO0FBQzdDLHVCQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7QUFDbkIsMEJBQVEsRUFBRSxXQUFXLENBQUMsS0FBSztBQUMzQix1QkFBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2lCQUNwQjtlQUFDLENBQUMsQ0FDSixDQUFBO2FBQ0Y7QUFDRCxvQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLHNCQUFRLEVBQUUsU0FBUztBQUNuQixxQkFBTyxFQUFLLElBQUksWUFBTyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBRTtBQUMzRCxzQkFBUSxFQUFFO0FBQ1Isb0JBQUksRUFBRSxRQUFRO0FBQ2Qsd0JBQVEsRUFBRSxXQUFXLENBQUMsS0FBSztlQUM1QjtBQUNELHVCQUFTLEVBQVQsU0FBUzthQUNWLENBQUMsQ0FBQTs7O0FBNUJKLGVBQUssSUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO21CQUE3QixXQUFXO1dBNkJyQjtTQUNGO09BQ0Y7QUFDRCxhQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0tBQ25DLENBQUE7R0FDRixDQUFBO0NBQ0YiLCJmaWxlIjoiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zcGVsbC9saWIvcHJvdmlkZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgUG9pbnQsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJ1xuY29uc3QgYXNjaWlEb2NMYW5nUGF0dGVybiA9IC9eOmxhbmc6XFxzKihcXFMrKS9tXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlR3JhbW1hciAoKSB7XG4gIHJldHVybiBbe1xuICAgIGdyYW1tYXJTY29wZXM6IFtcbiAgICAgICd0ZXh0LnBsYWluJyxcbiAgICAgICd0ZXh0LnBsYWluLm51bGwtZ3JhbW1hcidcbiAgICBdLFxuICAgIGNoZWNrZWRTY29wZXM6IHtcbiAgICAgICd0ZXh0LnBsYWluJzogdHJ1ZSxcbiAgICAgICd0ZXh0LnBsYWluLm51bGwtZ3JhbW1hcic6IHRydWUsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLnRvZG8nOiBmYWxzZSwgLy8gaWdub3JlIGZyb20gbGFuZ3VhZ2UtdG9kb1xuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy5maXhtZSc6IGZhbHNlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy5jaGFuZ2VkJzogZmFsc2UsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLnh4eCc6IGZhbHNlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy5pZGVhJzogZmFsc2UsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLmhhY2snOiBmYWxzZSxcbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3Mubm90ZSc6IGZhbHNlLFxuICAgICAgJ3N0b3JhZ2UudHlwZS5jbGFzcy5yZXZpZXcnOiBmYWxzZSxcbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3MubmInOiBmYWxzZSxcbiAgICAgICdzdG9yYWdlLnR5cGUuY2xhc3MuYnVnJzogZmFsc2UsXG4gICAgICAnc3RvcmFnZS50eXBlLmNsYXNzLnJhZGFyJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLmh0dHAuaHlwZXJsaW5rJzogZmFsc2UsIC8vIGlnbm9yZSBmcm9tIGxhbmd1YWdlLWh5cGVybGlua1xuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5odHRwcy5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuc2Z0cC5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuZnRwLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5maWxlLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5zbWIuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLmFmcC5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsubmZzLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay54LW1hbi1wYWdlLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay54LW1hbi5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsubWFuLXBhZ2UuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLm1hbi5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuZ29waGVyLmh5cGVybGluayc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay50eG1udC5oeXBlcmxpbmsnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAudW5kZXJsaW5lLmxpbmsuaXNzdWUuaHlwZXJsaW5rJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnVuZGVybGluZS5saW5rLi5oeXBlcmxpbmsnOiBmYWxzZVxuICAgIH1cbiAgfSwge1xuICAgIGdyYW1tYXJTY29wZXM6IFtcbiAgICAgICd0ZXh0LmdpdC1jb21taXQnXG4gICAgXSxcbiAgICBjaGVja2VkU2NvcGVzOiB7XG4gICAgICAnLm1ldGEuc2NvcGUubWVzc2FnZS5naXQtY29tbWl0JzogdHJ1ZVxuICAgIH1cbiAgfSwge1xuICAgIGdyYW1tYXJTY29wZXM6IFtcbiAgICAgICdzb3VyY2UuYXNjaWlkb2MnXG4gICAgXSxcbiAgICBmaW5kTGFuZ3VhZ2VUYWdzOiB0ZXh0RWRpdG9yID0+IHtcbiAgICAgIGxldCBsYW5ndWFnZXMgPSBbXVxuICAgICAgdGV4dEVkaXRvci5zY2FuKGFzY2lpRG9jTGFuZ1BhdHRlcm4sICh7bWF0Y2gsIHN0b3B9KSA9PiB7XG4gICAgICAgIGxhbmd1YWdlcy5wdXNoKG1hdGNoWzFdKVxuICAgICAgICBzdG9wKClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gbGFuZ3VhZ2VzXG4gICAgfSxcbiAgICBjaGVja2VkU2NvcGVzOiB7XG4gICAgICAnZW50aXR5Lm5hbWUuZnVuY3Rpb24uYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdlbnRpdHkubmFtZS50YWcueWFtbCc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5ibG9ja2lkLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuYXNjaWlkb2MucHJvcGVydGllcy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmMuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jbG9qdXJlLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY29mZmVlLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY3BwLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY3MuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jc3MuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jc3MubGVzcy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNzcy5zY3NzLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZGlmZi5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmRvY2tlcmZpbGUuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5lbGl4aXIuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5lbG0uYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5lcmxhbmcuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5nZm0uYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5nby5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmdyb292eS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmhhc2tlbGwuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5odG1sLmJhc2ljLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuaHRtbC5tdXN0YWNoZS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmh0bWwucGhwLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuamF2YS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmpzLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuanMuanN4LmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuanNvbi5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmp1bGlhLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUubWFrZWZpbGUuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5vYmpjLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUub2NhbWwuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5wZXJsLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucGVybDYuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5weXRob24uYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5yLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucnVieS5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnJ1c3QuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zYXNzLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuc2NhbGEuYXNjaWlkb2MnOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zaGVsbC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnNxbC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnN3aWZ0LmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUudG9tbC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnRzLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUueG1sLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUueWFtbC5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5saW5rLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnbWFya3VwLnJhdy5hc2NpaWRvYyc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5yYXcubW9ub3NwYWNlLmFzY2lpZG9jJzogZmFsc2UsXG4gICAgICAnc291cmNlLmFzY2lpZG9jJzogdHJ1ZSxcbiAgICAgICdzdXBwb3J0LmNvbnN0YW50LmF0dHJpYnV0ZS1uYW1lLmFzY2lpZG9jJzogZmFsc2VcbiAgICB9XG4gIH0sIHtcbiAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAnc291cmNlLmdmbScgLy8gbGFuZ3VhZ2UtZ2ZtXG4gICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZSBub3QgaW5jbHVkZWQgc2luY2UgZmlsdGVyUmFuZ2VzIGlzIG5vdCBuZWVkZWRcbiAgICAgIC8vIHNvdXJjZS5lbWJlZGRlZC5nZm0gZnJvbSBsYW5ndWFnZS1hc2NpaWRvY1xuICAgICAgLy8gdGV4dC5lbWJlZGRlZC5tZCBmcm9tIGxhbmd1YWdlLWdmbVxuICAgIF0sXG4gICAgY2hlY2tlZFNjb3Blczoge1xuICAgICAgJ2NvbnN0YW50LmNoYXJhY3Rlci5lbnRpdHkuZ2ZtJzogZmFsc2UsXG4gICAgICAnY29uc3RhbnQuY2hhcmFjdGVyLmVzY2FwZS5nZm0nOiBmYWxzZSxcbiAgICAgICdmcm9udC1tYXR0ZXIueWFtbC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNsb2p1cmUuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuY29mZmVlLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmNwcC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jcy5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5jc3MuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZGlmZi5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5lbGl4aXIuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuZWxtLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmVybGFuZy5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5nby5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5oYXNrZWxsLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmh0bWwuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUuamF2YS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5qcy5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5qc29uLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmp1bGlhLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLmxlc3MuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUub2JqYy5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5waHAuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucHl0aG9uLmNvbnNvbGUuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucHl0aG9uLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnIuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUucnVieS5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5ydXN0LmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnNjYWxhLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnNoZWxsLmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC5jb2RlLnNxbC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS5zd2lmdC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAuY29kZS54bWwuZ2ZtJzogZmFsc2UsXG4gICAgICAnbWFya3VwLmNvZGUueWFtbC5nZm0nOiBmYWxzZSxcbiAgICAgICdtYXJrdXAucmF3LmdmbSc6IGZhbHNlLFxuICAgICAgJ21hcmt1cC51bmRlcmxpbmUubGluay5nZm0nOiBmYWxzZSxcbiAgICAgICdzb3VyY2UuZ2ZtJzogdHJ1ZSxcbiAgICAgICdzdHJpbmcuZW1vamkuZ2ZtJzogZmFsc2UsXG4gICAgICAnc3RyaW5nLmlzc3VlLm51bWJlci5nZm0nOiBmYWxzZSxcbiAgICAgICdzdHJpbmcudXNlcm5hbWUuZ2ZtJzogZmFsc2UsXG4gICAgICAndGV4dC5lbWJlZGRlZC5tZCc6IHRydWUsXG4gICAgICAndmFyaWFibGUuaXNzdWUudGFnLmdmbSc6IGZhbHNlLFxuICAgICAgJ3ZhcmlhYmxlLm1lbnRpb24uZ2ZtJzogZmFsc2VcbiAgICB9XG4gIH0sIHtcbiAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAndGV4dC5tZCcgLy8gbGFuZ3VhZ2UtbWFya2Rvd25cbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgYXJlIG5vdCBpbmNsdWRlZCBzaW5jZSBmaWx0ZXJSYW5nZXMgaXMgbm90IG5lZWRlZFxuICAgICAgLy8gZW1iZWRkZWQudGV4dC5tZCBmcm9tIGxhbmd1YWdlLW1hcmtkb3duXG4gICAgXSxcbiAgICBjaGVja2VkU2NvcGVzOiB7XG4gICAgICAnYWJicmV2aWF0aW9uLnJlZmVyZW5jZS5saW5rLm1hcmt1cC5tZCc6IGZhbHNlLFxuICAgICAgJ2NsYXNzLm1ldGhvZC5yZWZlcmVuY2UuZ2ZtLnZhcmlhYmxlLm1kJzogZmFsc2UsXG4gICAgICAnY2xhc3MucmVmZXJlbmNlLmdmbS52YXJpYWJsZS5tZCc6IGZhbHNlLFxuICAgICAgJ2NvZGUucmF3Lm1hcmt1cC5tZCc6IGZhbHNlLFxuICAgICAgJ2VtYmVkZGVkLnRleHQubWQnOiB0cnVlLFxuICAgICAgJ2Vtb2ppLmNvbnN0YW50LmdmbS5tZCc6IGZhbHNlLFxuICAgICAgJ2VudGl0eS5jb25zdGFudC5tZCc6IGZhbHNlLFxuICAgICAgJ2ZlbmNlZC5jb2RlLm1kJzogZmFsc2UsXG4gICAgICAnZnJvbnQtbWF0dGVyLnRvbWwuc291cmNlLm1kJzogZmFsc2UsXG4gICAgICAnZnJvbnQtbWF0dGVyLnlhbWwuc291cmNlLm1kJzogZmFsc2UsXG4gICAgICAnaW5zdGFuY2UubWV0aG9kLnJlZmVyZW5jZS5nZm0udmFyaWFibGUubWQnOiBmYWxzZSxcbiAgICAgICdpc3N1ZS5nZm0ubWQnOiBmYWxzZSxcbiAgICAgICdyZWZlcmVuY2UuZ2ZtLnZhcmlhYmxlLm1kJzogZmFsc2UsXG4gICAgICAncm1hcmtkb3duLmF0dHJpYnV0ZS5tZXRhLm1kJzogZmFsc2UsXG4gICAgICAnc3BlY2lhbC1hdHRyaWJ1dGVzLnJhdy5tYXJrdXAubWQnOiBmYWxzZSxcbiAgICAgICd0ZXh0Lm1kJzogdHJ1ZSxcbiAgICAgICd1cmkudW5kZXJsaW5lLmxpbmsubWQnOiBmYWxzZVxuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVMaW50ZXIgKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdTcGVsbGluZycsXG4gICAgc2NvcGU6ICdmaWxlJyxcbiAgICBncmFtbWFyU2NvcGVzOiBbJyonXSxcbiAgICBsaW50c09uQ2hhbmdlOiBmYWxzZSxcbiAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvciwgc2NvcGVOYW1lKSA9PiB7XG4gICAgICBsZXQgbWVzc2FnZXMgPSBbXVxuICAgICAgZ2xvYmFsLmdyYW1tYXJNYW5hZ2VyLnVwZGF0ZUxhbmd1YWdlKHRleHRFZGl0b3IpXG4gICAgICBjb25zdCBncmFtbWFyID0gZ2xvYmFsLmdyYW1tYXJNYW5hZ2VyLmdldEdyYW1tYXIodGV4dEVkaXRvcilcbiAgICAgIGlmIChncmFtbWFyKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgY29uc3QgbGFuZ3VhZ2VzID0gZ2xvYmFsLmxhbmd1YWdlTWFuYWdlci5nZXRMYW5ndWFnZXModGV4dEVkaXRvcilcbiAgICAgICAgbGV0IGZpbHRlcmVkID0ge1xuICAgICAgICAgIHJhbmdlczogW3RleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UmFuZ2UoKV0sXG4gICAgICAgICAgaWdub3JlZFJhbmdlczogW11cbiAgICAgICAgfVxuICAgICAgICBsZXQgZW1iZWRkZWRSYW5nZXMgPSBuZXcgTWFwKClcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBQb2ludC5mcm9tT2JqZWN0KGZpbHRlcmVkLnJhbmdlc1swXS5zdGFydCwgdHJ1ZSlcblxuICAgICAgICB3aGlsZSAoZmlsdGVyZWQucmFuZ2VzWzBdLmNvbnRhaW5zUG9pbnQoY3VycmVudCkpIHtcbiAgICAgICAgICBsZXQgbmV4dCA9IFBvaW50LmZyb21PYmplY3QoY3VycmVudCwgdHJ1ZSlcbiAgICAgICAgICBsZXQgc2NvcGVEZXNjcmlwdG9yID0gdGV4dEVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihjdXJyZW50KVxuXG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhuZXh0LnJvdykgPT09IG5leHQuY29sdW1uKSB7XG4gICAgICAgICAgICAgIG5leHQucm93KytcbiAgICAgICAgICAgICAgbmV4dC5jb2x1bW4gPSAwXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXh0LmNvbHVtbisrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSB3aGlsZSAoZmlsdGVyZWQucmFuZ2VzWzBdLmNvbnRhaW5zUG9pbnQobmV4dCkgJiYgXy5pc0VxdWFsKHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpLCB0ZXh0RWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKG5leHQpLmdldFNjb3Blc0FycmF5KCkpKVxuXG4gICAgICAgICAgY29uc3QgaXNJZ25vcmVkID0gZ2xvYmFsLmdyYW1tYXJNYW5hZ2VyLmlzSWdub3JlZChzY29wZURlc2NyaXB0b3IpXG4gICAgICAgICAgbGV0IGVtYmVkZGVkR3JhbW1hciA9IGlzSWdub3JlZCA/IG51bGwgOiBnbG9iYWwuZ3JhbW1hck1hbmFnZXIuZ2V0RW1iZWRkZWRHcmFtbWFyKHNjb3BlRGVzY3JpcHRvcilcblxuICAgICAgICAgIGlmIChlbWJlZGRlZEdyYW1tYXIgJiYgZW1iZWRkZWRHcmFtbWFyLmZpbHRlclJhbmdlcykge1xuICAgICAgICAgICAgY29uc3QgZyA9IG5ldyBSYW5nZShQb2ludC5mcm9tT2JqZWN0KGN1cnJlbnQsIHRydWUpLCBQb2ludC5mcm9tT2JqZWN0KG5leHQsIHRydWUpKVxuICAgICAgICAgICAgaWYgKGVtYmVkZGVkUmFuZ2VzLmhhcyhlbWJlZGRlZEdyYW1tYXIpKSB7XG4gICAgICAgICAgICAgIGVtYmVkZGVkUmFuZ2VzLmdldChlbWJlZGRlZEdyYW1tYXIpLnB1c2goZylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVtYmVkZGVkUmFuZ2VzLnNldChlbWJlZGRlZEdyYW1tYXIsIFtnXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW1iZWRkZWRHcmFtbWFyID0gbnVsbFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0lnbm9yZWQgfHwgZW1iZWRkZWRHcmFtbWFyKSB7XG4gICAgICAgICAgICAvLyBUaGUgY3VycmVudCBzY29wZSBpcyBpZ25vcmVkIHNvIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSByYW5nZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPT09IGZpbHRlcmVkLnJhbmdlc1swXS5zdGFydCkge1xuICAgICAgICAgICAgICAvLyBUaGlzIHJhbmdlIHN0YXJ0ZWQgd2l0aCB0aGUgY3VycmVudCBzY29wZSBzbyBqdXN0IHJlbW92ZSB0aGUgaWdub3JlZCByYW5nZSBmcm9tIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgICAgZmlsdGVyZWQucmFuZ2VzWzBdLnN0YXJ0ID0gUG9pbnQuZnJvbU9iamVjdChuZXh0LCB0cnVlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyByYW5nZSBzdGFydGVkIHdpdGggYSBkaWZmZXJlbnQgc2NvcGUgdGhhdCB3YXMgbm90IGlnbm9yZWQgc28gd2UgbmVlZCB0byBwcmVzZXJ2ZSB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICAgIGxldCByID0gbmV3IFJhbmdlKFBvaW50LmZyb21PYmplY3QobmV4dCwgdHJ1ZSksIFBvaW50LmZyb21PYmplY3QoZmlsdGVyZWQucmFuZ2VzWzBdLmVuZCwgdHJ1ZSkpXG4gICAgICAgICAgICAgIGZpbHRlcmVkLnJhbmdlc1swXS5lbmQgPSBQb2ludC5mcm9tT2JqZWN0KGN1cnJlbnQsIHRydWUpXG4gICAgICAgICAgICAgIGlmIChyLmVuZC5yb3cgPCB0ZXh0RWRpdG9yLmdldExpbmVDb3VudCgpKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWQucmFuZ2VzLnVuc2hpZnQocilcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50ID0gbmV4dFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbHRlcmVkLnJhbmdlcy5sZW5ndGggPiAwICYmIGdyYW1tYXIuZmlsdGVyUmFuZ2VzKSB7XG4gICAgICAgICAgZmlsdGVyZWQgPSBncmFtbWFyLmZpbHRlclJhbmdlcyh0ZXh0RWRpdG9yLCBmaWx0ZXJlZC5yYW5nZXMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZpbHRlcmVkLnJhbmdlcykgZmlsdGVyZWQucmFuZ2VzID0gW11cbiAgICAgICAgaWYgKCFmaWx0ZXJlZC5pZ25vcmVkUmFuZ2VzKSBmaWx0ZXJlZC5pZ25vcmVkUmFuZ2VzID0gW11cblxuICAgICAgICBmb3IgKGNvbnN0IFtlbWJlZGRlZEdyYW1tYXIsIHJhbmdlc10gb2YgZW1iZWRkZWRSYW5nZXMuZW50cmllcygpKSB7XG4gICAgICAgICAgaWYgKGVtYmVkZGVkR3JhbW1hciAmJiBlbWJlZGRlZEdyYW1tYXIuZmlsdGVyUmFuZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCBlbWJlZGRlZEZpbHRlcmVkID0gZW1iZWRkZWRHcmFtbWFyLmZpbHRlclJhbmdlcyh0ZXh0RWRpdG9yLCByYW5nZXMpXG4gICAgICAgICAgICBmaWx0ZXJlZC5yYW5nZXMgPSBfLmNvbmNhdChmaWx0ZXJlZC5yYW5nZXMsIGVtYmVkZGVkRmlsdGVyZWQucmFuZ2VzIHx8IFtdKVxuICAgICAgICAgICAgZmlsdGVyZWQuaWdub3JlZFJhbmdlcyA9IF8uY29uY2F0KGZpbHRlcmVkLmlnbm9yZWRSYW5nZXMsIGVtYmVkZGVkRmlsdGVyZWQuaWdub3JlZFJhbmdlcyB8fCBbXSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyZWQucmFuZ2VzLnB1c2gocmFuZ2VzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaWdub3JlZFJhbmdlIG9mIGZpbHRlcmVkLmlnbm9yZWRSYW5nZXMpIHtcbiAgICAgICAgICBmaWx0ZXJlZC5yYW5nZXMgPSBfLmZsYXRNYXAoZmlsdGVyZWQucmFuZ2VzLCByYW5nZSA9PiB7XG4gICAgICAgICAgICBpZiAocmFuZ2UuaW50ZXJzZWN0c1dpdGgoaWdub3JlZFJhbmdlKSkge1xuICAgICAgICAgICAgICBsZXQgciA9IFtdXG4gICAgICAgICAgICAgIGlmIChyYW5nZS5zdGFydC5pc0xlc3NUaGFuKGlnbm9yZWRSYW5nZS5zdGFydCkpIHtcbiAgICAgICAgICAgICAgICByLnB1c2gobmV3IFJhbmdlKHJhbmdlLnN0YXJ0LCBpZ25vcmVkUmFuZ2Uuc3RhcnQpKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpZ25vcmVkUmFuZ2UuZW5kLmlzTGVzc1RoYW4ocmFuZ2UuZW5kKSkge1xuICAgICAgICAgICAgICAgIHIucHVzaChuZXcgUmFuZ2UoaWdub3JlZFJhbmdlLmVuZCwgcmFuZ2UuZW5kKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gclxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJhbmdlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIF8ucmVtb3ZlKGZpbHRlcmVkLnJhbmdlcywgcmFuZ2UgPT4gIXJhbmdlIHx8IHJhbmdlLmlzRW1wdHkoKSlcblxuICAgICAgICBmb3IgKGxldCBjaGVja1JhbmdlIG9mIGZpbHRlcmVkLnJhbmdlcykge1xuICAgICAgICAgIGNvbnN0IG1pc3NwZWxsaW5ncyA9IGF3YWl0IGdsb2JhbC5kaWN0aW9uYXJ5TWFuYWdlci5jaGVja1JhbmdlKHRleHRFZGl0b3IsIGxhbmd1YWdlcywgY2hlY2tSYW5nZSlcbiAgICAgICAgICBmb3IgKGNvbnN0IG1pc3NwZWxsaW5nIG9mIG1pc3NwZWxsaW5ncykge1xuICAgICAgICAgICAgbGV0IHdvcmQgPSB0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKG1pc3NwZWxsaW5nLnJhbmdlKVxuICAgICAgICAgICAgbGV0IHNvbHV0aW9ucyA9IFtdXG4gICAgICAgICAgICBpZiAobWlzc3BlbGxpbmcuc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgICAgc29sdXRpb25zID0gXy5tYXAobWlzc3BlbGxpbmcuc3VnZ2VzdGlvbnMsXG4gICAgICAgICAgICAgIChzdWdnZXN0aW9uLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogYENoYW5nZSB0byBcIiR7c3VnZ2VzdGlvbn1cImAsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG1pc3NwZWxsaW5nLnJhbmdlLFxuICAgICAgICAgICAgICAgIGFwcGx5OiAoKSA9PiB0ZXh0RWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKG1pc3NwZWxsaW5nLnJhbmdlLCBzdWdnZXN0aW9uKVxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtaXNzcGVsbGluZy5hY3Rpb25zKSB7XG4gICAgICAgICAgICAgIHNvbHV0aW9ucyA9IF8uY29uY2F0KHNvbHV0aW9ucyxcbiAgICAgICAgICAgICAgICBfLm1hcChtaXNzcGVsbGluZy5hY3Rpb25zLCAoYWN0aW9uLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiBhY3Rpb24udGl0bGUsXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbWlzc3BlbGxpbmcucmFuZ2UsXG4gICAgICAgICAgICAgICAgICBhcHBseTogYWN0aW9uLmFwcGx5XG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICBzZXZlcml0eTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICBleGNlcnB0OiBgJHt3b3JkfSAtPiAke21pc3NwZWxsaW5nLnN1Z2dlc3Rpb25zLmpvaW4oJywgJyl9YCxcbiAgICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICBmaWxlOiBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbWlzc3BlbGxpbmcucmFuZ2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNvbHV0aW9ucyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gXy5zb3J0QnkobWVzc2FnZXMsICdyYW5nZScpXG4gICAgfVxuICB9XG59XG4iXX0=