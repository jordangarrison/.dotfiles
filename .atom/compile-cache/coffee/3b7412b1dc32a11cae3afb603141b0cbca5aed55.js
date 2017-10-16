(function() {
  var Command, Parser;

  Command = require('./command');

  Parser = require('./parser');

  module.exports = {
    activate: function() {
      atom.commands.add('atom-workspace', 'java-generator:generate-getters-setters', (function(_this) {
        return function() {
          return _this.generateGettersAndSetters();
        };
      })(this));
      atom.commands.add('atom-workspace', 'java-generator:generate-constructor', (function(_this) {
        return function() {
          return _this.generateConstructor();
        };
      })(this));
      atom.commands.add('atom-workspace', 'java-generator:generate-to-string', (function(_this) {
        return function() {
          return _this.generateToString();
        };
      })(this));
      return atom.commands.add('atom-workspace', 'java-generator:generate-builder', (function(_this) {
        return function() {
          return _this.generateBuilder();
        };
      })(this));
    },
    parseVars: function(removeFinalVars, removeStaticVars) {
      var cmd, data, i, parser, variable;
      cmd = new Command();
      parser = new Parser();
      parser.setContent(cmd.getEditorText());
      data = parser.getVars();
      if (removeFinalVars) {
        i = data.length - 1;
        while (i >= 0) {
          variable = data[i];
          if (variable.getIsFinal()) {
            data.splice(i, 1);
          }
          i--;
        }
      }
      if (removeStaticVars) {
        i = data.length - 1;
        while (i >= 0) {
          variable = data[i];
          if (variable.getIsStatic()) {
            data.splice(i, 1);
          }
          i--;
        }
      }
      return data;
    },
    createGetter: function(variable) {
      var code;
      code = "";
      if (atom.config.get('java-generator.toggles.generateMethodComments')) {
        code += "\n\t/**\n\t* Returns value of ";
        code += variable.getName();
        code += "\n\t* @return\n\t*/";
      }
      code += "\n\tpublic ";
      if (variable.getIsStatic()) {
        code += "static ";
      }
      code += variable.getType();
      if (variable.getType() === "boolean") {
        code += " is";
      } else {
        code += " get";
      }
      code += variable.getCapitalizedName() + "() {\n\t\treturn ";
      if (atom.config.get('java-generator.toggles.appendThisToGetters')) {
        code += "this.";
      }
      code += variable.getName() + ";\n\t}\n";
      return code;
    },
    createSetter: function(variable) {
      var cmd, code, parser;
      code = "";
      if (atom.config.get('java-generator.toggles.generateMethodComments')) {
        code += "\n\t/**\n\t* Sets new value of ";
        code += variable.getName();
        code += "\n\t* @param\n\t*/";
      }
      code += "\n\tpublic ";
      if (variable.getIsStatic()) {
        code += "static ";
      }
      code += "void set" + variable.getCapitalizedName() + "(" + variable.getType() + " " + variable.getName() + ") {\n\t\t";
      if (variable.getIsStatic()) {
        cmd = new Command();
        parser = new Parser();
        parser.setContent(cmd.getEditorText());
        code += parser.getClassName() + ".";
      } else {
        code += "this.";
      }
      code += variable.getName() + " = " + variable.getName() + ";\n\t}\n";
      return code;
    },
    createGetterAndSetter: function(variable) {
      var code;
      code = this.createGetter(variable);
      if (!variable.getIsFinal()) {
        code += this.createSetter(variable);
      }
      return code;
    },
    createToString: function(data) {
      var className, cmd, code, counter, j, len, name, parser, size, variable;
      counter = 0;
      code = "";
      cmd = new Command();
      parser = new Parser();
      parser.setContent(cmd.getEditorText());
      className = parser.getClassName();
      if (atom.config.get('java-generator.toggles.generateMethodComments')) {
        code += "\n\t/**\n\t* Create string representation of ";
        code += className;
        code += " for printing\n\t* @return\n\t*/";
      }
      code += "\n\t@Override\n\tpublic String toString() {\n\t\treturn \"";
      code += className;
      code += " [";
      counter = 0;
      size = data.length;
      for (j = 0, len = data.length; j < len; j++) {
        variable = data[j];
        name = variable.getName();
        code += name + "=\" + " + name + " + \"";
        if (counter + 1 < size) {
          code += ", ";
        } else {
          code += "]\";\n\t}\n";
        }
        counter++;
      }
      return code;
    },
    createBuilder: function(data) {
      var className, cmd, code, j, k, len, len1, name, parser, type, variable;
      code = "";
      cmd = new Command();
      parser = new Parser();
      parser.setContent(cmd.getEditorText());
      className = parser.getClassName();
      code += "\n\tpublic static class Builder {";
      for (j = 0, len = data.length; j < len; j++) {
        variable = data[j];
        name = variable.getName();
        type = variable.getType();
        code += "\n\t\t private static " + type + " " + name + ";";
      }
      for (k = 0, len1 = data.length; k < len1; k++) {
        variable = data[k];
        name = variable.getName();
        type = variable.getType();
        code += "\n\n\t\t public static Builder " + name + "(";
        code += type + " " + name + ") {";
        code += "\n\t\t\t this." + name + " = " + name + ";";
        code += "\n\t\t\t return this;";
        code += "\n\t\t}";
      }
      code += "\n\n\t\tpublic " + className + " create() {";
      code += "\n\n\t\t}";
      code += "\n\t}\n";
      return code;
    },
    createConstructor: function(data) {
      var className, cmd, code, counter, j, k, len, len1, parser, size, variable;
      code = "";
      cmd = new Command();
      parser = new Parser();
      parser.setContent(cmd.getEditorText());
      className = parser.getClassName();
      if (atom.config.get('java-generator.toggles.generateMethodComments')) {
        code += "\n\t/**\n\t* Default empty ";
        code += className;
        code += " constructor\n\t*/";
      }
      code += "\n\tpublic " + className + "() {\n\t\tsuper();\n\t}\n";
      if (atom.config.get('java-generator.toggles.generateMethodComments')) {
        code += "\n\t/**\n\t* Default ";
        code += className;
        code += " constructor\n\t*/";
      }
      code += "\n\tpublic " + className + "(";
      counter = 0;
      size = data.length;
      for (j = 0, len = data.length; j < len; j++) {
        variable = data[j];
        code += variable.getType() + " " + variable.getName();
        if (counter + 1 < size) {
          code += ", ";
        } else {
          code += ")";
        }
        counter++;
      }
      code += " {\n\t\tsuper();";
      for (k = 0, len1 = data.length; k < len1; k++) {
        variable = data[k];
        code += "\n\t\tthis." + variable.getName() + " = " + variable.getName() + ";";
      }
      code += "\n\t}\n";
      return code;
    },
    generateGetters: function() {
      var cmd, code, data, editor, j, len, variable;
      editor = atom.workspace.getActiveTextEditor();
      if (!(editor.getGrammar().scopeName === 'text.java' || editor.getGrammar().scopeName === 'source.java')) {
        alert('This command is meant for java files only.');
        return;
      }
      data = this.parseVars(false, false);
      code = "";
      for (j = 0, len = data.length; j < len; j++) {
        variable = data[j];
        code += this.createGetter(variable);
      }
      cmd = new Command();
      return cmd.insertAtEndOfFile(code);
    },
    generateSetters: function() {
      var cmd, code, data, editor, j, len, variable;
      editor = atom.workspace.getActiveTextEditor();
      if (!(editor.getGrammar().scopeName === 'text.java' || editor.getGrammar().scopeName === 'source.java')) {
        alert('This command is meant for java files only.');
        return;
      }
      data = this.parseVars(true, false);
      code = "";
      for (j = 0, len = data.length; j < len; j++) {
        variable = data[j];
        code += this.createSetter(variable);
      }
      cmd = new Command();
      return cmd.insertAtEndOfFile(code);
    },
    generateToString: function() {
      var cmd, code, data, editor;
      editor = atom.workspace.getActiveTextEditor();
      if (!(editor.getGrammar().scopeName === 'text.java' || editor.getGrammar().scopeName === 'source.java')) {
        alert('This command is meant for java files only.');
        return;
      }
      data = this.parseVars(false, true);
      code = this.createToString(data);
      cmd = new Command();
      return cmd.insertAtEndOfFile(code);
    },
    generateConstructor: function() {
      var cmd, code, data, editor;
      editor = atom.workspace.getActiveTextEditor();
      if (!(editor.getGrammar().scopeName === 'text.java' || editor.getGrammar().scopeName === 'source.java')) {
        alert('This command is meant for java files only.');
        return;
      }
      data = this.parseVars(true, true);
      code = this.createConstructor(data);
      cmd = new Command();
      return cmd.insertAtEndOfFile(code);
    },
    generateBuilder: function() {
      var cmd, code, data, editor;
      editor = atom.workspace.getActiveTextEditor();
      if (!(editor.getGrammar().scopeName === 'text.java' || editor.getGrammar().scopeName === 'source.java')) {
        alert('This command is meant for java files only.');
        return;
      }
      data = this.parseVars(true, true);
      code = this.createBuilder(data);
      cmd = new Command();
      return cmd.insertAtEndOfFile(code);
    },
    generateGettersAndSetters: function() {
      var cmd, code, data, editor, j, len, variable;
      editor = atom.workspace.getActiveTextEditor();
      if (!(editor.getGrammar().scopeName === 'text.java' || editor.getGrammar().scopeName === 'source.java')) {
        alert('This command is meant for java files only.');
        return;
      }
      data = this.parseVars(false, false);
      if (atom.config.get('java-generator.toggles.generateGettersThenSetters')) {
        this.generateGetters();
        this.generateSetters();
      } else {
        code = "";
        for (j = 0, len = data.length; j < len; j++) {
          variable = data[j];
          code += this.createGetterAndSetter(variable);
        }
      }
      cmd = new Command();
      return cmd.insertAtEndOfFile(code);
    },
    config: {
      toggles: {
        type: 'object',
        order: 1,
        properties: {
          appendThisToGetters: {
            title: 'Append \'this\' to Getters',
            description: 'Return satements look like `return this.param`',
            type: 'boolean',
            "default": false
          },
          generateGettersThenSetters: {
            title: 'Generate Getters then Setters',
            description: 'Generates all Getters then all Setters instead of grouping them together.',
            type: 'boolean',
            "default": false
          },
          generateMethodComments: {
            title: 'Generate Method Comments',
            description: 'Generate default method comments',
            type: 'boolean',
            "default": true
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2phdmEtZ2VuZXJhdG9yLXBsdXMvbGliL2phdmEtZ2VuZXJhdG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUNWLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsUUFBQSxFQUFVLFNBQUE7TUFFTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHlDQUFwQyxFQUErRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLHlCQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0U7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHFDQUFwQyxFQUEyRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLG1CQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0U7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG1DQUFwQyxFQUF5RSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGdCQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekU7YUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlDQUFwQyxFQUF1RSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RTtJQUxNLENBQVY7SUFPQSxTQUFBLEVBQVcs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LFdBQUEsRUFBYSxnREFEYjtZQUVBLElBQUEsRUFBTSxTQUZOO1lBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1dBREY7VUFLQSwwQkFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLCtCQUFQO1lBQ0EsV0FBQSxFQUFhLDJFQURiO1lBRUEsSUFBQSxFQUFNLFNBRk47WUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7V0FORjtVQVVBLHNCQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sMEJBQVA7WUFDQSxXQUFBLEVBQWEsa0NBRGI7WUFFQSxJQUFBLEVBQU0sU0FGTjtZQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtXQVhGO1NBSEY7T0FERjtLQXZVRjs7QUFKSiIsInNvdXJjZXNDb250ZW50IjpbIkNvbW1hbmQgPSByZXF1aXJlICcuL2NvbW1hbmQnXG5QYXJzZXIgPSByZXF1aXJlICcuL3BhcnNlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIGFjdGl2YXRlOiAtPlxuICAgICAgICAjIFJlZ2lzdGVyIGNvbW1hbmRzXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdqYXZhLWdlbmVyYXRvcjpnZW5lcmF0ZS1nZXR0ZXJzLXNldHRlcnMnLCA9PiBAZ2VuZXJhdGVHZXR0ZXJzQW5kU2V0dGVycygpXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdqYXZhLWdlbmVyYXRvcjpnZW5lcmF0ZS1jb25zdHJ1Y3RvcicsID0+IEBnZW5lcmF0ZUNvbnN0cnVjdG9yKClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2phdmEtZ2VuZXJhdG9yOmdlbmVyYXRlLXRvLXN0cmluZycsID0+IEBnZW5lcmF0ZVRvU3RyaW5nKClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2phdmEtZ2VuZXJhdG9yOmdlbmVyYXRlLWJ1aWxkZXInLCA9PiBAZ2VuZXJhdGVCdWlsZGVyKClcblxuICAgIHBhcnNlVmFyczogKHJlbW92ZUZpbmFsVmFycywgcmVtb3ZlU3RhdGljVmFycykgLT5cbiAgICAgICAgY21kID0gbmV3IENvbW1hbmQoKVxuICAgICAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKClcblxuICAgICAgICBwYXJzZXIuc2V0Q29udGVudChjbWQuZ2V0RWRpdG9yVGV4dCgpKVxuXG4gICAgICAgIGRhdGEgPSBwYXJzZXIuZ2V0VmFycygpXG5cbiAgICAgICAgIyBSZW1vdmUgRmluYWwgVmFyaWFibGVzLCBpdGVyYXRlIGluIHJldmVyc2Ugc28gd2UgZG9uJ3Qgc2tpcCByZWNvcmRzIG9uIHNwbGljZVxuICAgICAgICBpZiByZW1vdmVGaW5hbFZhcnNcbiAgICAgICAgICAgIGkgPSBkYXRhLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIHdoaWxlIGkgPj0gMFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gZGF0YVtpXVxuICAgICAgICAgICAgICAgIGlmIHZhcmlhYmxlLmdldElzRmluYWwoKVxuICAgICAgICAgICAgICAgICAgICBkYXRhLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIGktLVxuXG4gICAgICAgICMgUmVtb3ZlIFN0YXRpYyBWYXJpYWJsZXMsIGl0ZXJhdGUgaW4gcmV2ZXJzZSBzbyB3ZSBkb24ndCBza2lwIHJlY29yZHMgb24gc3BsaWNlXG4gICAgICAgIGlmIHJlbW92ZVN0YXRpY1ZhcnNcbiAgICAgICAgICAgIGkgPSBkYXRhLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIHdoaWxlIGkgPj0gMFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gZGF0YVtpXVxuICAgICAgICAgICAgICAgIGlmIHZhcmlhYmxlLmdldElzU3RhdGljKClcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBpLS1cblxuXG4gICAgICAgIHJldHVybiBkYXRhXG5cbiAgICBjcmVhdGVHZXR0ZXI6ICh2YXJpYWJsZSkgLT5cbiAgICAgICAgY29kZSA9IFwiXCJcblxuICAgICAgICAjIE1ha2UgbWV0aG9kIGNvbW1lbnRzXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnamF2YS1nZW5lcmF0b3IudG9nZ2xlcy5nZW5lcmF0ZU1ldGhvZENvbW1lbnRzJylcbiAgICAgICAgICAgIGNvZGUgKz0gXCJcXG5cXHQvKipcXG5cXHQqIFJldHVybnMgdmFsdWUgb2YgXCJcbiAgICAgICAgICAgIGNvZGUgKz0gdmFyaWFibGUuZ2V0TmFtZSgpXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0KiBAcmV0dXJuXFxuXFx0Ki9cIlxuXG4gICAgICAgICMgTWFrZSBwdWJsaWNcbiAgICAgICAgY29kZSArPSBcIlxcblxcdHB1YmxpYyBcIlxuXG4gICAgICAgICMgQ2hlY2sgaWYgaXQgc2hvdWxkIGJlIHN0YXRpY1xuICAgICAgICBpZiB2YXJpYWJsZS5nZXRJc1N0YXRpYygpXG4gICAgICAgICAgICBjb2RlICs9IFwic3RhdGljIFwiXG5cbiAgICAgICAgIyBVc2UgJ2lzJyBpZiBib29sZWFuLCBvdGhlcndpc2UgJ2dldCdcbiAgICAgICAgY29kZSArPSB2YXJpYWJsZS5nZXRUeXBlKClcbiAgICAgICAgaWYgdmFyaWFibGUuZ2V0VHlwZSgpID09IFwiYm9vbGVhblwiXG4gICAgICAgICAgICBjb2RlICs9IFwiIGlzXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIGNvZGUgKz0gXCIgZ2V0XCJcblxuICAgICAgICAjIEZpbmlzaCBtZXRob2QgbmFtZSBhbmQgcmV0dXJuXG4gICAgICAgIGNvZGUgKz0gdmFyaWFibGUuZ2V0Q2FwaXRhbGl6ZWROYW1lKCkgKyBcIigpIHtcXG5cXHRcXHRyZXR1cm4gXCJcbiAgICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdqYXZhLWdlbmVyYXRvci50b2dnbGVzLmFwcGVuZFRoaXNUb0dldHRlcnMnKSB0aGVuIGNvZGUgKz0gXCJ0aGlzLlwiXG4gICAgICAgIGNvZGUgKz0gdmFyaWFibGUuZ2V0TmFtZSgpICsgXCI7XFxuXFx0fVxcblwiXG5cbiAgICAgICAgcmV0dXJuIGNvZGVcblxuICAgIGNyZWF0ZVNldHRlcjogKHZhcmlhYmxlKSAtPlxuICAgICAgICBjb2RlID0gXCJcIlxuXG4gICAgICAgICMgTWFrZSBtZXRob2QgY29tbWVudHNcbiAgICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdqYXZhLWdlbmVyYXRvci50b2dnbGVzLmdlbmVyYXRlTWV0aG9kQ29tbWVudHMnKVxuICAgICAgICAgICAgY29kZSArPSBcIlxcblxcdC8qKlxcblxcdCogU2V0cyBuZXcgdmFsdWUgb2YgXCJcbiAgICAgICAgICAgIGNvZGUgKz0gdmFyaWFibGUuZ2V0TmFtZSgpXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0KiBAcGFyYW1cXG5cXHQqL1wiXG5cbiAgICAgICAgIyBNYWtlIHB1YmxpY1xuICAgICAgICBjb2RlICs9IFwiXFxuXFx0cHVibGljIFwiXG5cbiAgICAgICAgIyBDaGVjayBpZiAgaXQgc2hvdWxkIGJlIHN0YXRpY1xuICAgICAgICBpZiB2YXJpYWJsZS5nZXRJc1N0YXRpYygpXG4gICAgICAgICAgICBjb2RlICs9IFwic3RhdGljIFwiXG5cbiAgICAgICAgIyBNZXRob2Qgc2lnbmF0dXJlXG4gICAgICAgIGNvZGUgKz0gXCJ2b2lkIHNldFwiICsgdmFyaWFibGUuZ2V0Q2FwaXRhbGl6ZWROYW1lKCkgKyBcIihcIiArIHZhcmlhYmxlLmdldFR5cGUoKSArIFwiIFwiICsgdmFyaWFibGUuZ2V0TmFtZSgpICsgXCIpIHtcXG5cXHRcXHRcIlxuXG4gICAgICAgICMgQXBwZW5kIGNsYXNzIG9yIHRoaXMgdG8gdmFyaWFibGUgbmFtZVxuICAgICAgICBpZiB2YXJpYWJsZS5nZXRJc1N0YXRpYygpXG4gICAgICAgICAgICBjbWQgPSBuZXcgQ29tbWFuZCgpXG4gICAgICAgICAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKClcbiAgICAgICAgICAgIHBhcnNlci5zZXRDb250ZW50KGNtZC5nZXRFZGl0b3JUZXh0KCkpXG4gICAgICAgICAgICBjb2RlICs9IHBhcnNlci5nZXRDbGFzc05hbWUoKSArIFwiLlwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvZGUgKz0gXCJ0aGlzLlwiXG5cbiAgICAgICAgIyBQdXQgaW4gdmFyaWFibGUgbmFtZSBhbmQgZmluaXNoIG1ldGhvZFxuICAgICAgICBjb2RlICs9IHZhcmlhYmxlLmdldE5hbWUoKSArIFwiID0gXCIgKyB2YXJpYWJsZS5nZXROYW1lKCkgKyBcIjtcXG5cXHR9XFxuXCJcblxuICAgICAgICByZXR1cm4gY29kZVxuXG4gICAgY3JlYXRlR2V0dGVyQW5kU2V0dGVyOiAodmFyaWFibGUpIC0+XG4gICAgICAgICMgQWx3YXlzIG1ha2UgdGhlIGdldHRlclxuICAgICAgICBjb2RlID0gQGNyZWF0ZUdldHRlcih2YXJpYWJsZSlcblxuICAgICAgICAjIE1ha2UgdGhlIHNldHRlciBpZiBpdCBpcyBOT1QgZmluYWxcbiAgICAgICAgaWYgIXZhcmlhYmxlLmdldElzRmluYWwoKVxuICAgICAgICAgIGNvZGUgKz0gQGNyZWF0ZVNldHRlcih2YXJpYWJsZSlcblxuICAgICAgICByZXR1cm4gY29kZVxuXG4gICAgY3JlYXRlVG9TdHJpbmc6IChkYXRhKSAtPlxuICAgICAgICBjb3VudGVyID0gMFxuICAgICAgICBjb2RlID0gXCJcIlxuICAgICAgICBjbWQgPSBuZXcgQ29tbWFuZCgpXG4gICAgICAgIHBhcnNlciA9IG5ldyBQYXJzZXIoKVxuICAgICAgICBwYXJzZXIuc2V0Q29udGVudChjbWQuZ2V0RWRpdG9yVGV4dCgpKVxuICAgICAgICBjbGFzc05hbWUgPSBwYXJzZXIuZ2V0Q2xhc3NOYW1lKClcblxuICAgICAgICAjIE1ha2UgbWV0aG9kIGNvbW1lbnRzXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnamF2YS1nZW5lcmF0b3IudG9nZ2xlcy5nZW5lcmF0ZU1ldGhvZENvbW1lbnRzJylcbiAgICAgICAgICAgIGNvZGUgKz0gXCJcXG5cXHQvKipcXG5cXHQqIENyZWF0ZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgXCJcbiAgICAgICAgICAgIGNvZGUgKz0gY2xhc3NOYW1lXG4gICAgICAgICAgICBjb2RlICs9IFwiIGZvciBwcmludGluZ1xcblxcdCogQHJldHVyblxcblxcdCovXCJcblxuICAgICAgICAjIE1ldGhvZCBzaWduYXR1cmVcbiAgICAgICAgY29kZSArPSBcIlxcblxcdEBPdmVycmlkZVxcblxcdHB1YmxpYyBTdHJpbmcgdG9TdHJpbmcoKSB7XFxuXFx0XFx0cmV0dXJuIFxcXCJcIlxuXG4gICAgICAgIGNvZGUgKz0gY2xhc3NOYW1lXG4gICAgICAgIGNvZGUgKz0gXCIgW1wiXG5cbiAgICAgICAgIyBMaXN0IG91dCB2YXJpYWJsZXNcbiAgICAgICAgY291bnRlciA9IDA7XG4gICAgICAgIHNpemUgPSBkYXRhLmxlbmd0aFxuICAgICAgICBmb3IgdmFyaWFibGUgaW4gZGF0YVxuICAgICAgICAgICAgbmFtZSA9IHZhcmlhYmxlLmdldE5hbWUoKVxuICAgICAgICAgICAgY29kZSArPSBuYW1lICsgXCI9XFxcIiArIFwiICsgbmFtZSArIFwiICsgXFxcIlwiXG5cbiAgICAgICAgICAgIGlmIGNvdW50ZXIgKyAxIDwgc2l6ZVxuICAgICAgICAgICAgICAgIGNvZGUgKz0gXCIsIFwiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29kZSArPSBcIl1cXFwiO1xcblxcdH1cXG5cIlxuXG4gICAgICAgICAgICBjb3VudGVyKytcblxuICAgICAgICByZXR1cm4gY29kZVxuXG4gICAgY3JlYXRlQnVpbGRlcjogKGRhdGEpIC0+XG4gICAgICAgIGNvZGUgPSBcIlwiO1xuICAgICAgICBjbWQgPSBuZXcgQ29tbWFuZCgpXG4gICAgICAgIHBhcnNlciA9IG5ldyBQYXJzZXIoKVxuICAgICAgICBwYXJzZXIuc2V0Q29udGVudChjbWQuZ2V0RWRpdG9yVGV4dCgpKVxuICAgICAgICBjbGFzc05hbWUgPSBwYXJzZXIuZ2V0Q2xhc3NOYW1lKClcblxuICAgICAgICAjIENsYXNzIHNpZ25hdHVyZVxuICAgICAgICBjb2RlICs9IFwiXFxuXFx0cHVibGljIHN0YXRpYyBjbGFzcyBCdWlsZGVyIHtcIlxuXG4gICAgICAgICMgVmFyaWFibGVzXG4gICAgICAgIGZvciB2YXJpYWJsZSBpbiBkYXRhXG4gICAgICAgICAgICBuYW1lID0gdmFyaWFibGUuZ2V0TmFtZSgpXG4gICAgICAgICAgICB0eXBlID0gdmFyaWFibGUuZ2V0VHlwZSgpXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0XFx0IHByaXZhdGUgc3RhdGljIFwiICsgdHlwZSArIFwiIFwiICsgbmFtZSArIFwiO1wiXG5cbiAgICAgICAgIyBWYXJpYWJsZSByZWxhdGVkIG1ldGhvZHNcbiAgICAgICAgZm9yIHZhcmlhYmxlIGluIGRhdGFcbiAgICAgICAgICAgIG5hbWUgPSB2YXJpYWJsZS5nZXROYW1lKClcbiAgICAgICAgICAgIHR5cGUgPSB2YXJpYWJsZS5nZXRUeXBlKClcblxuICAgICAgICAgICAgY29kZSArPSBcIlxcblxcblxcdFxcdCBwdWJsaWMgc3RhdGljIEJ1aWxkZXIgXCIgKyBuYW1lICsgXCIoXCJcbiAgICAgICAgICAgIGNvZGUgKz0gdHlwZSArIFwiIFwiICsgbmFtZSArICBcIikge1wiXG5cbiAgICAgICAgICAgIGNvZGUgKz0gXCJcXG5cXHRcXHRcXHQgdGhpcy5cIiArIG5hbWUgKyBcIiA9IFwiICsgbmFtZSArIFwiO1wiXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0XFx0XFx0IHJldHVybiB0aGlzO1wiXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0XFx0fVwiXG5cbiAgICAgICAgIyBjcmVhdGUoKSBtZXRob2RcbiAgICAgICAgY29kZSArPSBcIlxcblxcblxcdFxcdHB1YmxpYyBcIiArIGNsYXNzTmFtZSArIFwiIGNyZWF0ZSgpIHtcIlxuICAgICAgICBjb2RlICs9IFwiXFxuXFxuXFx0XFx0fVwiXG4gICAgICAgIGNvZGUgKz0gXCJcXG5cXHR9XFxuXCJcbiAgICAgICAgcmV0dXJuIGNvZGVcblxuICAgIGNyZWF0ZUNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cbiAgICAgICAgY29kZSA9IFwiXCJcbiAgICAgICAgY21kID0gbmV3IENvbW1hbmQoKVxuICAgICAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKClcbiAgICAgICAgcGFyc2VyLnNldENvbnRlbnQoY21kLmdldEVkaXRvclRleHQoKSlcbiAgICAgICAgY2xhc3NOYW1lID0gcGFyc2VyLmdldENsYXNzTmFtZSgpXG5cbiAgICAgICAgIyBNYWtlIG1ldGhvZCBjb21tZW50c1xuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2phdmEtZ2VuZXJhdG9yLnRvZ2dsZXMuZ2VuZXJhdGVNZXRob2RDb21tZW50cycpXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0LyoqXFxuXFx0KiBEZWZhdWx0IGVtcHR5IFwiXG4gICAgICAgICAgICBjb2RlICs9IGNsYXNzTmFtZVxuICAgICAgICAgICAgY29kZSArPSBcIiBjb25zdHJ1Y3RvclxcblxcdCovXCJcblxuICAgICAgICAjIEZpcnN0LCBhbiBlbXB0eSBvbmVcbiAgICAgICAgY29kZSArPSBcIlxcblxcdHB1YmxpYyBcIiArIGNsYXNzTmFtZSArIFwiKCkge1xcblxcdFxcdHN1cGVyKCk7XFxuXFx0fVxcblwiXG5cbiAgICAgICAgIyBNYWtlIG1ldGhvZCBjb21tZW50c1xuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2phdmEtZ2VuZXJhdG9yLnRvZ2dsZXMuZ2VuZXJhdGVNZXRob2RDb21tZW50cycpXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0LyoqXFxuXFx0KiBEZWZhdWx0IFwiXG4gICAgICAgICAgICBjb2RlICs9IGNsYXNzTmFtZVxuICAgICAgICAgICAgY29kZSArPSBcIiBjb25zdHJ1Y3RvclxcblxcdCovXCJcblxuICAgICAgICAjIFNlY29uZCwgb25lIHdpdGggYWxsIHZhcmlhYmxlc1xuICAgICAgICBjb2RlICs9IFwiXFxuXFx0cHVibGljIFwiICsgY2xhc3NOYW1lICsgXCIoXCJcblxuICAgICAgICAjIGFkZCBwYXJhbXNcbiAgICAgICAgY291bnRlciA9IDBcbiAgICAgICAgc2l6ZSA9IGRhdGEubGVuZ3RoXG4gICAgICAgIGZvciB2YXJpYWJsZSBpbiBkYXRhXG4gICAgICAgICAgICBjb2RlICs9IHZhcmlhYmxlLmdldFR5cGUoKSArIFwiIFwiICsgdmFyaWFibGUuZ2V0TmFtZSgpXG4gICAgICAgICAgICBpZiBjb3VudGVyICsgMSA8IHNpemVcbiAgICAgICAgICAgICAgICBjb2RlICs9IFwiLCBcIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvZGUgKz0gXCIpXCJcblxuICAgICAgICAgICAgY291bnRlcisrXG5cbiAgICAgICAgY29kZSArPSBcIiB7XFxuXFx0XFx0c3VwZXIoKTtcIlxuXG4gICAgICAgICMgQWRkIGFzc2lnbm1lbnRzXG4gICAgICAgIGZvciB2YXJpYWJsZSBpbiBkYXRhXG4gICAgICAgICAgICBjb2RlICs9IFwiXFxuXFx0XFx0dGhpcy5cIiArIHZhcmlhYmxlLmdldE5hbWUoKSArIFwiID0gXCIgKyB2YXJpYWJsZS5nZXROYW1lKCkgKyBcIjtcIlxuXG4gICAgICAgIGNvZGUgKz0gXCJcXG5cXHR9XFxuXCJcblxuICAgICAgICByZXR1cm4gY29kZVxuXG4gICAgZ2VuZXJhdGVHZXR0ZXJzOiAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgdW5sZXNzIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lIGlzICd0ZXh0LmphdmEnIG9yIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lIGlzICdzb3VyY2UuamF2YSdcbiAgICAgICAgICAgIGFsZXJ0ICgnVGhpcyBjb21tYW5kIGlzIG1lYW50IGZvciBqYXZhIGZpbGVzIG9ubHkuJylcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgUGFyc2UgdmFyaWFibGVzXG4gICAgICAgIGRhdGEgPSBAcGFyc2VWYXJzKGZhbHNlLCBmYWxzZSlcblxuICAgICAgICAjIE1ha2UgZ2V0dGVyIG1ldGhvZFxuICAgICAgICBjb2RlID0gXCJcIlxuICAgICAgICBmb3IgdmFyaWFibGUgaW4gZGF0YVxuICAgICAgICAgICAgY29kZSArPSBAY3JlYXRlR2V0dGVyKHZhcmlhYmxlKVxuXG4gICAgICAgICMgSW5zZXJ0IGNvZGVcbiAgICAgICAgY21kID0gbmV3IENvbW1hbmQoKVxuICAgICAgICBjbWQuaW5zZXJ0QXRFbmRPZkZpbGUoY29kZSlcblxuICAgIGdlbmVyYXRlU2V0dGVyczogLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHVubGVzcyBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSBpcyAndGV4dC5qYXZhJyBvciBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSBpcyAnc291cmNlLmphdmEnXG4gICAgICAgICAgICBhbGVydCAoJ1RoaXMgY29tbWFuZCBpcyBtZWFudCBmb3IgamF2YSBmaWxlcyBvbmx5LicpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIFBhcnNlIHZhcmlhYmxlc1xuICAgICAgICBkYXRhID0gQHBhcnNlVmFycyh0cnVlLCBmYWxzZSlcblxuICAgICAgICAjIE1ha2Ugc2V0dGVyIG1ldGhvZFxuICAgICAgICBjb2RlID0gXCJcIlxuICAgICAgICBmb3IgdmFyaWFibGUgaW4gZGF0YVxuICAgICAgICAgICAgY29kZSArPSBAY3JlYXRlU2V0dGVyKHZhcmlhYmxlKVxuXG4gICAgICAgICMgSW5zZXJ0IGNvZGVcbiAgICAgICAgY21kID0gbmV3IENvbW1hbmQoKVxuICAgICAgICBjbWQuaW5zZXJ0QXRFbmRPZkZpbGUoY29kZSlcblxuICAgIGdlbmVyYXRlVG9TdHJpbmc6IC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICB1bmxlc3MgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgaXMgJ3RleHQuamF2YScgb3IgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgaXMgJ3NvdXJjZS5qYXZhJ1xuICAgICAgICAgICAgYWxlcnQgKCdUaGlzIGNvbW1hbmQgaXMgbWVhbnQgZm9yIGphdmEgZmlsZXMgb25seS4nKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyBQYXJzZSB2YXJpYWJsZXNcbiAgICAgICAgZGF0YSA9IEBwYXJzZVZhcnMoZmFsc2UsIHRydWUpXG5cbiAgICAgICAgIyBNYWtlIGNvZGUgYW5kIGluc2VydCBpdFxuICAgICAgICBjb2RlID0gQGNyZWF0ZVRvU3RyaW5nKGRhdGEpXG4gICAgICAgIGNtZCA9IG5ldyBDb21tYW5kKClcbiAgICAgICAgY21kLmluc2VydEF0RW5kT2ZGaWxlKGNvZGUpXG5cbiAgICBnZW5lcmF0ZUNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgdW5sZXNzIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lIGlzICd0ZXh0LmphdmEnIG9yIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lIGlzICdzb3VyY2UuamF2YSdcbiAgICAgICAgICAgIGFsZXJ0ICgnVGhpcyBjb21tYW5kIGlzIG1lYW50IGZvciBqYXZhIGZpbGVzIG9ubHkuJylcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgUGFyc2UgdmFyaWFibGVzXG4gICAgICAgIGRhdGEgPSBAcGFyc2VWYXJzKHRydWUsIHRydWUpXG5cbiAgICAgICAgIyBNYWtlIGNvZGUgYW5kIGluc2VydCBpdFxuICAgICAgICBjb2RlID0gQGNyZWF0ZUNvbnN0cnVjdG9yKGRhdGEpXG4gICAgICAgIGNtZCA9IG5ldyBDb21tYW5kKClcbiAgICAgICAgY21kLmluc2VydEF0RW5kT2ZGaWxlKGNvZGUpXG5cbiAgICBnZW5lcmF0ZUJ1aWxkZXI6IC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICB1bmxlc3MgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgaXMgJ3RleHQuamF2YScgb3IgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgaXMgJ3NvdXJjZS5qYXZhJ1xuICAgICAgICAgICAgYWxlcnQgKCdUaGlzIGNvbW1hbmQgaXMgbWVhbnQgZm9yIGphdmEgZmlsZXMgb25seS4nKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyBQYXJzZSB2YXJpYWJsZXNcbiAgICAgICAgZGF0YSA9IEBwYXJzZVZhcnModHJ1ZSwgdHJ1ZSlcblxuICAgICAgICAjIE1ha2UgY29kZSBhbmQgaW5zZXJ0IGl0XG4gICAgICAgIGNvZGUgPSBAY3JlYXRlQnVpbGRlcihkYXRhKVxuICAgICAgICBjbWQgPSBuZXcgQ29tbWFuZCgpXG4gICAgICAgIGNtZC5pbnNlcnRBdEVuZE9mRmlsZShjb2RlKVxuXG4gICAgZ2VuZXJhdGVHZXR0ZXJzQW5kU2V0dGVyczogLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHVubGVzcyBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSBpcyAndGV4dC5qYXZhJyBvciBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSBpcyAnc291cmNlLmphdmEnXG4gICAgICAgICAgICBhbGVydCAoJ1RoaXMgY29tbWFuZCBpcyBtZWFudCBmb3IgamF2YSBmaWxlcyBvbmx5LicpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIFBhcnNlIHZhcmlhYmxlc1xuICAgICAgICBkYXRhID0gQHBhcnNlVmFycyhmYWxzZSwgZmFsc2UpXG5cbiAgICAgICAgIyBHZW5lcmF0ZSBjb2RlXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnamF2YS1nZW5lcmF0b3IudG9nZ2xlcy5nZW5lcmF0ZUdldHRlcnNUaGVuU2V0dGVycycpXG4gICAgICAgICAgICBAZ2VuZXJhdGVHZXR0ZXJzKClcbiAgICAgICAgICAgIEBnZW5lcmF0ZVNldHRlcnMoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29kZSA9IFwiXCJcbiAgICAgICAgICBmb3IgdmFyaWFibGUgaW4gZGF0YVxuICAgICAgICAgICAgY29kZSArPSBAY3JlYXRlR2V0dGVyQW5kU2V0dGVyKHZhcmlhYmxlKVxuXG4gICAgICAgICMgSW5zZXJ0IGNvZGVcbiAgICAgICAgY21kID0gbmV3IENvbW1hbmQoKVxuICAgICAgICBjbWQuaW5zZXJ0QXRFbmRPZkZpbGUoY29kZSlcblxuICAgIGNvbmZpZzpcbiAgICAgIHRvZ2dsZXM6XG4gICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgYXBwZW5kVGhpc1RvR2V0dGVyczpcbiAgICAgICAgICAgIHRpdGxlOiAnQXBwZW5kIFxcJ3RoaXNcXCcgdG8gR2V0dGVycydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUmV0dXJuIHNhdGVtZW50cyBsb29rIGxpa2UgYHJldHVybiB0aGlzLnBhcmFtYCdcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICBnZW5lcmF0ZUdldHRlcnNUaGVuU2V0dGVyczpcbiAgICAgICAgICAgIHRpdGxlOiAnR2VuZXJhdGUgR2V0dGVycyB0aGVuIFNldHRlcnMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dlbmVyYXRlcyBhbGwgR2V0dGVycyB0aGVuIGFsbCBTZXR0ZXJzIGluc3RlYWQgb2YgZ3JvdXBpbmcgdGhlbSB0b2dldGhlci4nXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgZ2VuZXJhdGVNZXRob2RDb21tZW50czpcbiAgICAgICAgICAgIHRpdGxlOiAnR2VuZXJhdGUgTWV0aG9kIENvbW1lbnRzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZW5lcmF0ZSBkZWZhdWx0IG1ldGhvZCBjb21tZW50cydcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuIl19
