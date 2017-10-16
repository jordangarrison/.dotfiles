(function() {
  var AskStack, AskStackApiClient, AskStackResultView, AskStackView, CompositeDisposable, TextEditorView, View, ref, url,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  url = require('url');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  ref = require('atom-space-pen-views'), TextEditorView = ref.TextEditorView, View = ref.View;

  AskStack = require('./ask-stack');

  AskStackApiClient = require('./ask-stack-api-client');

  AskStackResultView = require('./ask-stack-result-view');

  module.exports = AskStackView = (function(superClass) {
    extend(AskStackView, superClass);

    function AskStackView() {
      return AskStackView.__super__.constructor.apply(this, arguments);
    }

    AskStackView.content = function() {
      return this.div({
        "class": 'ask-stack overlay from-top padded'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, function() {
              return _this.span('Ask Stack Overflow');
            });
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div(function() {
                _this.subview('questionField', new TextEditorView({
                  mini: true,
                  placeholderText: 'Question (eg. Sort array)'
                }));
                _this.subview('tagsField', new TextEditorView({
                  mini: true,
                  placeholderText: 'Language / Tags (eg. Ruby;Rails)'
                }));
                _this.div({
                  "class": 'pull-right'
                }, function() {
                  _this.br();
                  return _this.button({
                    outlet: 'askButton',
                    "class": 'btn btn-primary'
                  }, ' Ask! ');
                });
                return _this.div({
                  "class": 'pull-left'
                }, function() {
                  _this.br();
                  _this.label('Sort by:');
                  _this.br();
                  _this.label({
                    "for": 'relevance',
                    "class": 'radio-label'
                  }, 'Relevance: ');
                  _this.input({
                    outlet: 'sortByRelevance',
                    id: 'relevance',
                    type: 'radio',
                    name: 'sort_by',
                    value: 'relevance',
                    checked: 'checked'
                  });
                  _this.label({
                    "for": 'votes',
                    "class": 'radio-label last'
                  }, 'Votes: ');
                  return _this.input({
                    outlet: 'sortByVote',
                    id: 'votes',
                    type: 'radio',
                    name: 'sort_by',
                    value: 'votes'
                  });
                });
              });
              return _this.div({
                outlet: 'progressIndicator'
              }, function() {
                return _this.span({
                  "class": 'loading loading-spinner-medium'
                });
              });
            });
          });
        };
      })(this));
    };

    AskStackView.prototype.initialize = function(serializeState) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'ask-stack:ask-question', (function(_this) {
        return function() {
          return _this.presentPanel();
        };
      })(this)));
      this.handleEvents();
      this.autoDetectObserveSubscription = atom.config.observe('ask-stack.autoDetectLanguage', (function(_this) {
        return function(autoDetect) {
          if (!autoDetect) {
            return _this.tagsField.setText("");
          }
        };
      })(this));
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, ref1;
        try {
          ref1 = url.parse(uriToOpen), protocol = ref1.protocol, host = ref1.host, pathname = ref1.pathname;
        } catch (error1) {
          error = error1;
          return;
        }
        if (protocol !== 'ask-stack:') {
          return;
        }
        return new AskStackResultView();
      });
    };

    AskStackView.prototype.serialize = function() {};

    AskStackView.prototype.destroy = function() {
      this.hideView();
      return this.detach();
    };

    AskStackView.prototype.hideView = function() {
      this.panel.hide();
      return this.focusout();
    };

    AskStackView.prototype.onDidChangeTitle = function() {};

    AskStackView.prototype.onDidChangeModified = function() {};

    AskStackView.prototype.handleEvents = function() {
      this.askButton.on('click', (function(_this) {
        return function() {
          return _this.askStackRequest();
        };
      })(this));
      this.subscriptions.add(atom.commands.add(this.questionField.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.askStackRequest();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideView();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add(this.tagsField.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.askStackRequest();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideView();
          };
        })(this)
      }));
    };

    AskStackView.prototype.presentPanel = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
      }
      this.panel.show();
      this.progressIndicator.hide();
      this.questionField.focus();
      if (atom.config.get('ask-stack.autoDetectLanguage')) {
        return this.setLanguageField();
      }
    };

    AskStackView.prototype.askStackRequest = function() {
      this.progressIndicator.show();
      AskStackApiClient.resetInputs();
      AskStackApiClient.question = this.questionField.getText();
      AskStackApiClient.tag = this.tagsField.getText();
      AskStackApiClient.sort_by = this.sortByVote.is(':checked') ? 'votes' : 'relevance';
      return AskStackApiClient.search((function(_this) {
        return function(response) {
          _this.progressIndicator.hide();
          _this.hideView();
          if (response === null) {
            return alert('Encountered a problem with the Stack Exchange API');
          } else {
            return _this.showResults(response);
          }
        };
      })(this));
    };

    AskStackView.prototype.showResults = function(answersJson) {
      var uri;
      uri = 'ask-stack://result-view';
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).then(function(askStackResultView) {
        if (askStackResultView instanceof AskStackResultView) {
          askStackResultView.renderAnswers(answersJson);
          return atom.workspace.activatePreviousPane();
        }
      });
    };

    AskStackView.prototype.setLanguageField = function() {
      var lang;
      lang = this.getCurrentLanguage();
      if (lang === null || lang === 'Null Grammar') {
        return;
      }
      return this.tagsField.setText(lang);
    };

    AskStackView.prototype.getCurrentLanguage = function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      if (editor === void 0) {
        return null;
      } else {
        return editor.getGrammar().name;
      }
    };

    return AskStackView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9saWIvYXNrLXN0YWNrLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrSEFBQTtJQUFBOzs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBRUwsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUN4QixNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxtQ0FBRCxFQUFpQjs7RUFFakIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUjs7RUFDcEIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUNBQVA7T0FBTCxFQUFpRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQy9DLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7V0FBTCxFQUEyQixTQUFBO1lBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2QixTQUFBO3FCQUMzQixLQUFDLENBQUEsSUFBRCxDQUFNLG9CQUFOO1lBRDJCLENBQTdCO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1CQUFQO2FBQUwsRUFBaUMsU0FBQTtjQUMvQixLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7Z0JBQ0gsS0FBQyxDQUFBLE9BQUQsQ0FBUyxlQUFULEVBQThCLElBQUEsY0FBQSxDQUFlO2tCQUFBLElBQUEsRUFBSyxJQUFMO2tCQUFXLGVBQUEsRUFBaUIsMkJBQTVCO2lCQUFmLENBQTlCO2dCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsV0FBVCxFQUEwQixJQUFBLGNBQUEsQ0FBZTtrQkFBQSxJQUFBLEVBQUssSUFBTDtrQkFBVyxlQUFBLEVBQWlCLGtDQUE1QjtpQkFBZixDQUExQjtnQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtpQkFBTCxFQUEwQixTQUFBO2tCQUN4QixLQUFDLENBQUEsRUFBRCxDQUFBO3lCQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7b0JBQUEsTUFBQSxFQUFRLFdBQVI7b0JBQXFCLENBQUEsS0FBQSxDQUFBLEVBQU8saUJBQTVCO21CQUFSLEVBQXVELFFBQXZEO2dCQUZ3QixDQUExQjt1QkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtpQkFBTCxFQUF5QixTQUFBO2tCQUN2QixLQUFDLENBQUEsRUFBRCxDQUFBO2tCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sVUFBUDtrQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFBO2tCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU87b0JBQUEsQ0FBQSxHQUFBLENBQUEsRUFBSyxXQUFMO29CQUFrQixDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQXpCO21CQUFQLEVBQStDLGFBQS9DO2tCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU87b0JBQUEsTUFBQSxFQUFRLGlCQUFSO29CQUEyQixFQUFBLEVBQUksV0FBL0I7b0JBQTRDLElBQUEsRUFBTSxPQUFsRDtvQkFBMkQsSUFBQSxFQUFNLFNBQWpFO29CQUE0RSxLQUFBLEVBQU8sV0FBbkY7b0JBQWdHLE9BQUEsRUFBUyxTQUF6RzttQkFBUDtrQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPO29CQUFBLENBQUEsR0FBQSxDQUFBLEVBQUssT0FBTDtvQkFBYyxDQUFBLEtBQUEsQ0FBQSxFQUFPLGtCQUFyQjttQkFBUCxFQUFnRCxTQUFoRDt5QkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPO29CQUFBLE1BQUEsRUFBUSxZQUFSO29CQUFzQixFQUFBLEVBQUksT0FBMUI7b0JBQW1DLElBQUEsRUFBTSxPQUF6QztvQkFBa0QsSUFBQSxFQUFNLFNBQXhEO29CQUFtRSxLQUFBLEVBQU8sT0FBMUU7bUJBQVA7Z0JBUHVCLENBQXpCO2NBTkcsQ0FBTDtxQkFjQSxLQUFDLENBQUEsR0FBRCxDQUFLO2dCQUFBLE1BQUEsRUFBUSxtQkFBUjtlQUFMLEVBQWtDLFNBQUE7dUJBQ2hDLEtBQUMsQ0FBQSxJQUFELENBQU07a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQ0FBUDtpQkFBTjtjQURnQyxDQUFsQztZQWYrQixDQUFqQztVQUh5QixDQUEzQjtRQUQrQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQ7SUFEUTs7MkJBdUJWLFVBQUEsR0FBWSxTQUFDLGNBQUQ7TUFDVixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCLHdCQURpQixFQUNTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFQsQ0FBbkI7TUFHQSxJQUFDLENBQUEsWUFBRCxDQUFBO01BRUEsSUFBQyxDQUFBLDZCQUFELEdBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDhCQUFwQixFQUFvRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsVUFBRDtVQUNsRCxJQUFBLENBQW1DLFVBQW5DO21CQUFBLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBaEIsQ0FBd0IsRUFBeEIsRUFBQTs7UUFEa0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBEO2FBR0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLFNBQUMsU0FBRDtBQUN2QixZQUFBO0FBQUE7VUFDRSxPQUE2QixHQUFHLENBQUMsS0FBSixDQUFVLFNBQVYsQ0FBN0IsRUFBQyx3QkFBRCxFQUFXLGdCQUFYLEVBQWlCLHlCQURuQjtTQUFBLGNBQUE7VUFFTTtBQUNKLGlCQUhGOztRQUtBLElBQWMsUUFBQSxLQUFZLFlBQTFCO0FBQUEsaUJBQUE7O0FBRUEsZUFBVyxJQUFBLGtCQUFBLENBQUE7TUFSWSxDQUF6QjtJQVhVOzsyQkFzQlosU0FBQSxHQUFXLFNBQUEsR0FBQTs7MkJBR1gsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsUUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZPOzsyQkFJVCxRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFDLFFBQUYsQ0FBQTtJQUZROzsyQkFJVixnQkFBQSxHQUFrQixTQUFBLEdBQUE7OzJCQUNsQixtQkFBQSxHQUFxQixTQUFBLEdBQUE7OzJCQUVyQixZQUFBLEdBQWMsU0FBQTtNQUNaLElBQUMsQ0FBQSxTQUFTLENBQUMsRUFBWCxDQUFjLE9BQWQsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxlQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBakMsRUFDakI7UUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtRQUNBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEZjtPQURpQixDQUFuQjthQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUE3QixFQUNqQjtRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO1FBQ0EsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURmO09BRGlCLENBQW5CO0lBUFk7OzJCQVdkLFlBQUEsR0FBYyxTQUFBOztRQUVaLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1VBQVMsT0FBQSxFQUFTLElBQWxCO1NBQTdCOztNQUVWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLElBQW5CLENBQUE7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBQTtNQUNBLElBQXVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBdkI7ZUFBQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQUFBOztJQVBZOzsyQkFTZCxlQUFBLEdBQWlCLFNBQUE7TUFDZixJQUFDLENBQUEsaUJBQWlCLENBQUMsSUFBbkIsQ0FBQTtNQUVBLGlCQUFpQixDQUFDLFdBQWxCLENBQUE7TUFDQSxpQkFBaUIsQ0FBQyxRQUFsQixHQUE2QixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtNQUM3QixpQkFBaUIsQ0FBQyxHQUFsQixHQUF3QixJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQTtNQUN4QixpQkFBaUIsQ0FBQyxPQUFsQixHQUErQixJQUFDLENBQUEsVUFBVSxDQUFDLEVBQVosQ0FBZSxVQUFmLENBQUgsR0FBbUMsT0FBbkMsR0FBZ0Q7YUFDNUUsaUJBQWlCLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQ7VUFDdkIsS0FBQyxDQUFBLGlCQUFpQixDQUFDLElBQW5CLENBQUE7VUFDQSxLQUFJLENBQUMsUUFBTCxDQUFBO1VBQ0EsSUFBRyxRQUFBLEtBQVksSUFBZjttQkFDRSxLQUFBLENBQU0sbURBQU4sRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLEVBSEY7O1FBSHVCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtJQVBlOzsyQkFlakIsV0FBQSxHQUFhLFNBQUMsV0FBRDtBQUNYLFVBQUE7TUFBQSxHQUFBLEdBQU07YUFFTixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsRUFBeUI7UUFBQSxLQUFBLEVBQU8sT0FBUDtRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BQXpCLENBQThELENBQUMsSUFBL0QsQ0FBb0UsU0FBQyxrQkFBRDtRQUNsRSxJQUFHLGtCQUFBLFlBQThCLGtCQUFqQztVQUNFLGtCQUFrQixDQUFDLGFBQW5CLENBQWlDLFdBQWpDO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQWYsQ0FBQSxFQUZGOztNQURrRSxDQUFwRTtJQUhXOzsyQkFRYixnQkFBQSxHQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLGtCQUFELENBQUE7TUFDUCxJQUFVLElBQUEsS0FBUSxJQUFSLElBQWdCLElBQUEsS0FBUSxjQUFsQztBQUFBLGVBQUE7O2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLElBQW5CO0lBSGdCOzsyQkFLbEIsa0JBQUEsR0FBb0IsU0FBQTtBQUNsQixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULElBQUcsTUFBQSxLQUFVLE1BQWI7ZUFBNEIsS0FBNUI7T0FBQSxNQUFBO2VBQXNDLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxLQUExRDs7SUFGa0I7Ozs7S0E1R0s7QUFWM0IiLCJzb3VyY2VzQ29udGVudCI6WyJ1cmwgPSByZXF1aXJlICd1cmwnXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbntUZXh0RWRpdG9yVmlldywgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuQXNrU3RhY2sgPSByZXF1aXJlICcuL2Fzay1zdGFjaydcbkFza1N0YWNrQXBpQ2xpZW50ID0gcmVxdWlyZSAnLi9hc2stc3RhY2stYXBpLWNsaWVudCdcbkFza1N0YWNrUmVzdWx0VmlldyA9IHJlcXVpcmUgJy4vYXNrLXN0YWNrLXJlc3VsdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBBc2tTdGFja1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdhc2stc3RhY2sgb3ZlcmxheSBmcm9tLXRvcCBwYWRkZWQnLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ2luc2V0LXBhbmVsJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3BhbmVsLWhlYWRpbmcnLCA9PlxuICAgICAgICAgIEBzcGFuICdBc2sgU3RhY2sgT3ZlcmZsb3cnXG4gICAgICAgIEBkaXYgY2xhc3M6ICdwYW5lbC1ib2R5IHBhZGRlZCcsID0+XG4gICAgICAgICAgQGRpdiA9PlxuICAgICAgICAgICAgQHN1YnZpZXcgJ3F1ZXN0aW9uRmllbGQnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTp0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdRdWVzdGlvbiAoZWcuIFNvcnQgYXJyYXkpJylcbiAgICAgICAgICAgIEBzdWJ2aWV3ICd0YWdzRmllbGQnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTp0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdMYW5ndWFnZSAvIFRhZ3MgKGVnLiBSdWJ5O1JhaWxzKScpXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgICAgIEBicigpXG4gICAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnYXNrQnV0dG9uJywgY2xhc3M6ICdidG4gYnRuLXByaW1hcnknLCAnIEFzayEgJ1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtbGVmdCcsID0+XG4gICAgICAgICAgICAgIEBicigpXG4gICAgICAgICAgICAgIEBsYWJlbCAnU29ydCBieTonXG4gICAgICAgICAgICAgIEBicigpXG4gICAgICAgICAgICAgIEBsYWJlbCBmb3I6ICdyZWxldmFuY2UnLCBjbGFzczogJ3JhZGlvLWxhYmVsJywgJ1JlbGV2YW5jZTogJ1xuICAgICAgICAgICAgICBAaW5wdXQgb3V0bGV0OiAnc29ydEJ5UmVsZXZhbmNlJywgaWQ6ICdyZWxldmFuY2UnLCB0eXBlOiAncmFkaW8nLCBuYW1lOiAnc29ydF9ieScsIHZhbHVlOiAncmVsZXZhbmNlJywgY2hlY2tlZDogJ2NoZWNrZWQnXG4gICAgICAgICAgICAgIEBsYWJlbCBmb3I6ICd2b3RlcycsIGNsYXNzOiAncmFkaW8tbGFiZWwgbGFzdCcsICdWb3RlczogJ1xuICAgICAgICAgICAgICBAaW5wdXQgb3V0bGV0OiAnc29ydEJ5Vm90ZScsIGlkOiAndm90ZXMnLCB0eXBlOiAncmFkaW8nLCBuYW1lOiAnc29ydF9ieScsIHZhbHVlOiAndm90ZXMnXG4gICAgICAgICAgQGRpdiBvdXRsZXQ6ICdwcm9ncmVzc0luZGljYXRvcicsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ2xvYWRpbmcgbG9hZGluZy1zcGlubmVyLW1lZGl1bSdcblxuICBpbml0aWFsaXplOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2Fzay1zdGFjazphc2stcXVlc3Rpb24nLCA9PiBAcHJlc2VudFBhbmVsKClcblxuICAgIEBoYW5kbGVFdmVudHMoKVxuXG4gICAgQGF1dG9EZXRlY3RPYnNlcnZlU3Vic2NyaXB0aW9uID1cbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2Fzay1zdGFjay5hdXRvRGV0ZWN0TGFuZ3VhZ2UnLCAoYXV0b0RldGVjdCkgPT5cbiAgICAgICAgX3RoaXMudGFnc0ZpZWxkLnNldFRleHQoXCJcIikgdW5sZXNzIGF1dG9EZXRlY3RcblxuICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpVG9PcGVuKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHtwcm90b2NvbCwgaG9zdCwgcGF0aG5hbWV9ID0gdXJsLnBhcnNlKHVyaVRvT3BlbilcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJldHVyblxuXG4gICAgICByZXR1cm4gdW5sZXNzIHByb3RvY29sIGlzICdhc2stc3RhY2s6J1xuXG4gICAgICByZXR1cm4gbmV3IEFza1N0YWNrUmVzdWx0VmlldygpXG5cbiAgIyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNhbiBiZSByZXRyaWV2ZWQgd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZFxuICBzZXJpYWxpemU6IC0+XG5cbiAgIyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveTogLT5cbiAgICBAaGlkZVZpZXcoKVxuICAgIEBkZXRhY2goKVxuXG4gIGhpZGVWaWV3OiAtPlxuICAgIEBwYW5lbC5oaWRlKClcbiAgICBALmZvY3Vzb3V0KClcblxuICBvbkRpZENoYW5nZVRpdGxlOiAtPlxuICBvbkRpZENoYW5nZU1vZGlmaWVkOiAtPlxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAYXNrQnV0dG9uLm9uICdjbGljaycsID0+IEBhc2tTdGFja1JlcXVlc3QoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBxdWVzdGlvbkZpZWxkLmVsZW1lbnQsXG4gICAgICAnY29yZTpjb25maXJtJzogPT4gQGFza1N0YWNrUmVxdWVzdCgpXG4gICAgICAnY29yZTpjYW5jZWwnOiA9PiBAaGlkZVZpZXcoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEB0YWdzRmllbGQuZWxlbWVudCxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiA9PiBAYXNrU3RhY2tSZXF1ZXN0KClcbiAgICAgICdjb3JlOmNhbmNlbCc6ID0+IEBoaWRlVmlldygpXG5cbiAgcHJlc2VudFBhbmVsOiAtPlxuICAgICNhdG9tLndvcmtzcGFjZVZpZXcuYXBwZW5kKHRoaXMpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogQCwgdmlzaWJsZTogdHJ1ZSlcblxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAcHJvZ3Jlc3NJbmRpY2F0b3IuaGlkZSgpXG4gICAgQHF1ZXN0aW9uRmllbGQuZm9jdXMoKVxuICAgIEBzZXRMYW5ndWFnZUZpZWxkKCkgaWYgYXRvbS5jb25maWcuZ2V0KCdhc2stc3RhY2suYXV0b0RldGVjdExhbmd1YWdlJylcblxuICBhc2tTdGFja1JlcXVlc3Q6IC0+XG4gICAgQHByb2dyZXNzSW5kaWNhdG9yLnNob3coKVxuXG4gICAgQXNrU3RhY2tBcGlDbGllbnQucmVzZXRJbnB1dHMoKVxuICAgIEFza1N0YWNrQXBpQ2xpZW50LnF1ZXN0aW9uID0gQHF1ZXN0aW9uRmllbGQuZ2V0VGV4dCgpXG4gICAgQXNrU3RhY2tBcGlDbGllbnQudGFnID0gQHRhZ3NGaWVsZC5nZXRUZXh0KClcbiAgICBBc2tTdGFja0FwaUNsaWVudC5zb3J0X2J5ID0gaWYgQHNvcnRCeVZvdGUuaXMoJzpjaGVja2VkJykgdGhlbiAndm90ZXMnIGVsc2UgJ3JlbGV2YW5jZSdcbiAgICBBc2tTdGFja0FwaUNsaWVudC5zZWFyY2ggKHJlc3BvbnNlKSA9PlxuICAgICAgQHByb2dyZXNzSW5kaWNhdG9yLmhpZGUoKVxuICAgICAgdGhpcy5oaWRlVmlldygpXG4gICAgICBpZiByZXNwb25zZSA9PSBudWxsXG4gICAgICAgIGFsZXJ0KCdFbmNvdW50ZXJlZCBhIHByb2JsZW0gd2l0aCB0aGUgU3RhY2sgRXhjaGFuZ2UgQVBJJylcbiAgICAgIGVsc2VcbiAgICAgICAgQHNob3dSZXN1bHRzKHJlc3BvbnNlKVxuXG4gIHNob3dSZXN1bHRzOiAoYW5zd2Vyc0pzb24pIC0+XG4gICAgdXJpID0gJ2Fzay1zdGFjazovL3Jlc3VsdC12aWV3J1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih1cmksIHNwbGl0OiAncmlnaHQnLCBzZWFyY2hBbGxQYW5lczogdHJ1ZSkudGhlbiAoYXNrU3RhY2tSZXN1bHRWaWV3KSAtPlxuICAgICAgaWYgYXNrU3RhY2tSZXN1bHRWaWV3IGluc3RhbmNlb2YgQXNrU3RhY2tSZXN1bHRWaWV3XG4gICAgICAgIGFza1N0YWNrUmVzdWx0Vmlldy5yZW5kZXJBbnN3ZXJzKGFuc3dlcnNKc29uKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5hY3RpdmF0ZVByZXZpb3VzUGFuZSgpXG5cbiAgc2V0TGFuZ3VhZ2VGaWVsZDogLT5cbiAgICBsYW5nID0gQGdldEN1cnJlbnRMYW5ndWFnZSgpXG4gICAgcmV0dXJuIGlmIGxhbmcgPT0gbnVsbCBvciBsYW5nID09ICdOdWxsIEdyYW1tYXInXG4gICAgQHRhZ3NGaWVsZC5zZXRUZXh0KGxhbmcpXG5cbiAgZ2V0Q3VycmVudExhbmd1YWdlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIGVkaXRvciA9PSB1bmRlZmluZWQgdGhlbiBudWxsIGVsc2UgZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG4iXX0=
