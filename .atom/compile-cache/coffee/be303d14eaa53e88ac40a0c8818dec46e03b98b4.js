(function() {
  module.exports = {
    toolchain: {
      title: 'Toolchain to use',
      order: 1,
      description: 'The toolchain to build LaTeX. `auto` tries `latexmk toolchain` and fallbacks to the default `custom toolchain`.',
      type: 'string',
      "default": 'auto',
      "enum": ['auto', 'latexmk toolchain', 'custom toolchain']
    },
    latexmk_param: {
      title: 'latexmk execution parameters',
      order: 2,
      description: 'The parameters to use when invoking `latexmk`.',
      type: 'string',
      "default": '-synctex=1 -interaction=nonstopmode -file-line-error -pdf'
    },
    custom_toolchain: {
      title: 'Custom toolchain commands',
      order: 3,
      description: 'The commands to execute in `custom` toolchain. Multiple commands should be separated by `&&`. Placeholders `%TEX` `%ARG` `%BIB` will be replaced by the following settings, and `%DOC` will be replaced by the main LaTeX file which is either automatically detected or manually set',
      type: 'string',
      "default": '%TEX %ARG %DOC && %BIB %DOC && %TEX %ARG %DOC && %TEX %ARG %DOC'
    },
    compiler: {
      title: 'LaTeX compiler to use',
      order: 4,
      description: 'The LaTeX compiler to use in `custom` toolchain. Replaces all `%TEX` string in `custom` toolchain command.',
      type: 'string',
      "default": 'pdflatex'
    },
    compiler_param: {
      title: 'LaTeX compiler execution parameters',
      order: 5,
      description: 'The parameters to use when invoking the custom compiler. Replaces all `%ARG` string in `custom` toolchain command.',
      type: 'string',
      "default": '-synctex=1 -interaction=nonstopmode -file-line-error'
    },
    bibtex: {
      title: 'bibTeX compiler to use',
      order: 6,
      description: 'The bibTeX compiler to use in `custom` toolchain. Replaces all `%BIB` string in `custom` toolchain command.',
      type: 'string',
      "default": 'bibtex'
    },
    build_after_save: {
      title: 'Build LaTeX after saving',
      order: 7,
      description: 'Start building with toolchain after saving a `.tex` file.',
      type: 'boolean',
      "default": true
    },
    save_on_build: {
      title: 'Save files before Build',
      order: 8,
      description: 'Save all files in current document prior building LateX',
      type: 'boolean',
      "default": false
    },
    focus_viewer: {
      title: 'Focus PDF viewer window after building',
      order: 9,
      description: 'PDF viewer window will gain focus after building LaTeX or forward SyncTeX.',
      type: 'boolean',
      "default": false
    },
    preview_after_build: {
      title: 'Preview PDF after building process',
      order: 10,
      description: 'Use PDF viewer to preview the generated PDF file after successfully building LaTeX.',
      type: 'string',
      "default": 'View in PDF viewer window',
      "enum": ['View in PDF viewer window', 'View in PDF viewer tab', 'Do nothing']
    },
    combine_typesetting_log: {
      title: 'Combine typesetting log messages',
      order: 11,
      description: 'Combine typesetting log messages in log panel. Sometimes typesetting messages may clutter the panel. Enable this config to display one message for all typesetting entries.',
      type: 'boolean',
      "default": true
    },
    hide_log_if_success: {
      title: 'Hide LaTeX log messages on successful build',
      order: 12,
      description: 'Hide the LaTeX log panel if the build process is successful. This will save some space for the editor, but warnings are hidden unless manually clicking the `Show build log` icon.',
      type: 'boolean',
      "default": false
    },
    file_ext_to_clean: {
      title: 'Files to clean',
      order: 13,
      description: 'All files under the LaTeX project root directory with the setextensions will be removed when cleaning LaTeX project. Multiple file extensions are joint with commas.',
      type: 'string',
      "default": '*.aux, *.bbl, *.blg, *.idx, *.ind, *.lof, *.lot, *.out, *.toc, *.acn, *.acr, *.alg, *.glg, *.glo, *.gls, *.ist, *.fls, *.log, *.fdb_latexmk'
    },
    clean_after_build: {
      title: 'Clean LaTeX auxiliary files after building process',
      order: 14,
      description: 'Clean all auxiliary files after building LaTeX project by the defined file extensions.',
      type: 'boolean',
      "default": false
    },
    delayed_minimap_refresh: {
      title: 'Delay the refresh actions of atom-minimap',
      order: 15,
      description: 'Delay the refresh actions of atom-minimap upon typing. This setting can reduce the keystroke stuttering in very long LaTeX source files caused by minimap extension. Reload Atom to take effect.',
      type: 'boolean',
      "default": false
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsU0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGtCQUFQO01BQ0EsS0FBQSxFQUFPLENBRFA7TUFFQSxXQUFBLEVBQWEsaUhBRmI7TUFJQSxJQUFBLEVBQU0sUUFKTjtNQUtBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFMVDtNQU1BLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FDSixNQURJLEVBRUosbUJBRkksRUFHSixrQkFISSxDQU5OO0tBREY7SUFZQSxhQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sOEJBQVA7TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFdBQUEsRUFBYSxnREFGYjtNQUdBLElBQUEsRUFBTSxRQUhOO01BSUEsQ0FBQSxPQUFBLENBQUEsRUFBUywyREFKVDtLQWJGO0lBa0JBLGdCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sMkJBQVA7TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFdBQUEsRUFBYSx1UkFGYjtNQU9BLElBQUEsRUFBTSxRQVBOO01BUUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxpRUFSVDtLQW5CRjtJQTRCQSxRQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sdUJBQVA7TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFdBQUEsRUFBYSw0R0FGYjtNQUlBLElBQUEsRUFBTSxRQUpOO01BS0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxVQUxUO0tBN0JGO0lBbUNBLGNBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxxQ0FBUDtNQUNBLEtBQUEsRUFBTyxDQURQO01BRUEsV0FBQSxFQUFhLG9IQUZiO01BSUEsSUFBQSxFQUFNLFFBSk47TUFLQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLHNEQUxUO0tBcENGO0lBMENBLE1BQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyx3QkFBUDtNQUNBLEtBQUEsRUFBTyxDQURQO01BRUEsV0FBQSxFQUFhLDZHQUZiO01BSUEsSUFBQSxFQUFNLFFBSk47TUFLQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFFBTFQ7S0EzQ0Y7SUFpREEsZ0JBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTywwQkFBUDtNQUNBLEtBQUEsRUFBTyxDQURQO01BRUEsV0FBQSxFQUFhLDJEQUZiO01BR0EsSUFBQSxFQUFNLFNBSE47TUFJQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSlQ7S0FsREY7SUF1REEsYUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHlCQUFQO01BQ0EsS0FBQSxFQUFPLENBRFA7TUFFQSxXQUFBLEVBQWEseURBRmI7TUFHQSxJQUFBLEVBQU0sU0FITjtNQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FKVDtLQXhERjtJQTZEQSxZQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sd0NBQVA7TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFdBQUEsRUFBYSw0RUFGYjtNQUlBLElBQUEsRUFBTSxTQUpOO01BS0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUxUO0tBOURGO0lBb0VBLG1CQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sb0NBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxxRkFGYjtNQUlBLElBQUEsRUFBTSxRQUpOO01BS0EsQ0FBQSxPQUFBLENBQUEsRUFBUywyQkFMVDtNQU1BLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FDSiwyQkFESSxFQUVKLHdCQUZJLEVBR0osWUFISSxDQU5OO0tBckVGO0lBZ0ZBLHVCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sa0NBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSw2S0FGYjtNQUtBLElBQUEsRUFBTSxTQUxOO01BTUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQU5UO0tBakZGO0lBd0ZBLG1CQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sNkNBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxvTEFGYjtNQUtBLElBQUEsRUFBTSxTQUxOO01BTUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQU5UO0tBekZGO0lBZ0dBLGlCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZ0JBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxzS0FGYjtNQUtBLElBQUEsRUFBTSxRQUxOO01BTUEsQ0FBQSxPQUFBLENBQUEsRUFBUyw2SUFOVDtLQWpHRjtJQTBHQSxpQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLG9EQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsd0ZBRmI7TUFJQSxJQUFBLEVBQU0sU0FKTjtNQUtBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FMVDtLQTNHRjtJQWlIQSx1QkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLDJDQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsa01BRmI7TUFNQSxJQUFBLEVBQU0sU0FOTjtNQU9BLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FQVDtLQWxIRjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgdG9vbGNoYWluOlxuICAgIHRpdGxlOiAnVG9vbGNoYWluIHRvIHVzZSdcbiAgICBvcmRlcjogMVxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHRvb2xjaGFpbiB0byBidWlsZCBMYVRlWC4gYGF1dG9gIHRyaWVzIGBsYXRleG1rIFxcXG4gICAgICAgICAgICAgICAgICB0b29sY2hhaW5gIGFuZCBmYWxsYmFja3MgdG8gdGhlIGRlZmF1bHQgYGN1c3RvbSB0b29sY2hhaW5gLidcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICdhdXRvJ1xuICAgIGVudW06IFtcbiAgICAgICdhdXRvJ1xuICAgICAgJ2xhdGV4bWsgdG9vbGNoYWluJ1xuICAgICAgJ2N1c3RvbSB0b29sY2hhaW4nXG4gICAgXVxuICBsYXRleG1rX3BhcmFtOlxuICAgIHRpdGxlOiAnbGF0ZXhtayBleGVjdXRpb24gcGFyYW1ldGVycydcbiAgICBvcmRlcjogMlxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHBhcmFtZXRlcnMgdG8gdXNlIHdoZW4gaW52b2tpbmcgYGxhdGV4bWtgLidcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICctc3luY3RleD0xIC1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZSAtZmlsZS1saW5lLWVycm9yIC1wZGYnXG4gIGN1c3RvbV90b29sY2hhaW46XG4gICAgdGl0bGU6ICdDdXN0b20gdG9vbGNoYWluIGNvbW1hbmRzJ1xuICAgIG9yZGVyOiAzXG4gICAgZGVzY3JpcHRpb246ICdUaGUgY29tbWFuZHMgdG8gZXhlY3V0ZSBpbiBgY3VzdG9tYCB0b29sY2hhaW4uIE11bHRpcGxlIFxcXG4gICAgICAgICAgICAgICAgICBjb21tYW5kcyBzaG91bGQgYmUgc2VwYXJhdGVkIGJ5IGAmJmAuIFBsYWNlaG9sZGVycyBgJVRFWGAgXFxcbiAgICAgICAgICAgICAgICAgIGAlQVJHYCBgJUJJQmAgd2lsbCBiZSByZXBsYWNlZCBieSB0aGUgZm9sbG93aW5nIHNldHRpbmdzLCBcXFxuICAgICAgICAgICAgICAgICAgYW5kIGAlRE9DYCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZSBtYWluIExhVGVYIGZpbGUgd2hpY2ggXFxcbiAgICAgICAgICAgICAgICAgIGlzIGVpdGhlciBhdXRvbWF0aWNhbGx5IGRldGVjdGVkIG9yIG1hbnVhbGx5IHNldCdcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICclVEVYICVBUkcgJURPQyAmJiAlQklCICVET0MgJiYgJVRFWCAlQVJHICVET0MgJiYgJVRFWCAlQVJHICVET0MnXG4gIGNvbXBpbGVyOlxuICAgIHRpdGxlOiAnTGFUZVggY29tcGlsZXIgdG8gdXNlJ1xuICAgIG9yZGVyOiA0XG4gICAgZGVzY3JpcHRpb246ICdUaGUgTGFUZVggY29tcGlsZXIgdG8gdXNlIGluIGBjdXN0b21gIHRvb2xjaGFpbi4gUmVwbGFjZXMgXFxcbiAgICAgICAgICAgICAgICAgIGFsbCBgJVRFWGAgc3RyaW5nIGluIGBjdXN0b21gIHRvb2xjaGFpbiBjb21tYW5kLidcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICdwZGZsYXRleCdcbiAgY29tcGlsZXJfcGFyYW06XG4gICAgdGl0bGU6ICdMYVRlWCBjb21waWxlciBleGVjdXRpb24gcGFyYW1ldGVycydcbiAgICBvcmRlcjogNVxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHBhcmFtZXRlcnMgdG8gdXNlIHdoZW4gaW52b2tpbmcgdGhlIGN1c3RvbSBjb21waWxlci4gXFxcbiAgICAgICAgICAgICAgICAgIFJlcGxhY2VzIGFsbCBgJUFSR2Agc3RyaW5nIGluIGBjdXN0b21gIHRvb2xjaGFpbiBjb21tYW5kLidcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICctc3luY3RleD0xIC1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZSAtZmlsZS1saW5lLWVycm9yJ1xuICBiaWJ0ZXg6XG4gICAgdGl0bGU6ICdiaWJUZVggY29tcGlsZXIgdG8gdXNlJ1xuICAgIG9yZGVyOiA2XG4gICAgZGVzY3JpcHRpb246ICdUaGUgYmliVGVYIGNvbXBpbGVyIHRvIHVzZSBpbiBgY3VzdG9tYCB0b29sY2hhaW4uIFJlcGxhY2VzIFxcXG4gICAgICAgICAgICAgICAgICBhbGwgYCVCSUJgIHN0cmluZyBpbiBgY3VzdG9tYCB0b29sY2hhaW4gY29tbWFuZC4nXG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnYmlidGV4J1xuICBidWlsZF9hZnRlcl9zYXZlOlxuICAgIHRpdGxlOiAnQnVpbGQgTGFUZVggYWZ0ZXIgc2F2aW5nJ1xuICAgIG9yZGVyOiA3XG4gICAgZGVzY3JpcHRpb246ICdTdGFydCBidWlsZGluZyB3aXRoIHRvb2xjaGFpbiBhZnRlciBzYXZpbmcgYSBgLnRleGAgZmlsZS4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogdHJ1ZVxuICBzYXZlX29uX2J1aWxkOlxuICAgIHRpdGxlOiAnU2F2ZSBmaWxlcyBiZWZvcmUgQnVpbGQnXG4gICAgb3JkZXI6IDhcbiAgICBkZXNjcmlwdGlvbjogJ1NhdmUgYWxsIGZpbGVzIGluIGN1cnJlbnQgZG9jdW1lbnQgcHJpb3IgYnVpbGRpbmcgTGF0ZVgnXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgZm9jdXNfdmlld2VyOlxuICAgIHRpdGxlOiAnRm9jdXMgUERGIHZpZXdlciB3aW5kb3cgYWZ0ZXIgYnVpbGRpbmcnXG4gICAgb3JkZXI6IDlcbiAgICBkZXNjcmlwdGlvbjogJ1BERiB2aWV3ZXIgd2luZG93IHdpbGwgZ2FpbiBmb2N1cyBhZnRlciBidWlsZGluZyBMYVRlWCBvciBcXFxuICAgICAgICAgICAgICAgICAgZm9yd2FyZCBTeW5jVGVYLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICBwcmV2aWV3X2FmdGVyX2J1aWxkOlxuICAgIHRpdGxlOiAnUHJldmlldyBQREYgYWZ0ZXIgYnVpbGRpbmcgcHJvY2VzcydcbiAgICBvcmRlcjogMTBcbiAgICBkZXNjcmlwdGlvbjogJ1VzZSBQREYgdmlld2VyIHRvIHByZXZpZXcgdGhlIGdlbmVyYXRlZCBQREYgZmlsZSBhZnRlciBcXFxuICAgICAgICAgICAgICAgICAgc3VjY2Vzc2Z1bGx5IGJ1aWxkaW5nIExhVGVYLidcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICdWaWV3IGluIFBERiB2aWV3ZXIgd2luZG93J1xuICAgIGVudW06IFtcbiAgICAgICdWaWV3IGluIFBERiB2aWV3ZXIgd2luZG93J1xuICAgICAgJ1ZpZXcgaW4gUERGIHZpZXdlciB0YWInXG4gICAgICAnRG8gbm90aGluZydcbiAgICBdXG4gIGNvbWJpbmVfdHlwZXNldHRpbmdfbG9nOlxuICAgIHRpdGxlOiAnQ29tYmluZSB0eXBlc2V0dGluZyBsb2cgbWVzc2FnZXMnXG4gICAgb3JkZXI6IDExXG4gICAgZGVzY3JpcHRpb246ICdDb21iaW5lIHR5cGVzZXR0aW5nIGxvZyBtZXNzYWdlcyBpbiBsb2cgcGFuZWwuIFNvbWV0aW1lcyBcXFxuICAgICAgICAgICAgICAgICAgdHlwZXNldHRpbmcgbWVzc2FnZXMgbWF5IGNsdXR0ZXIgdGhlIHBhbmVsLiBFbmFibGUgdGhpcyBcXFxuICAgICAgICAgICAgICAgICAgY29uZmlnIHRvIGRpc3BsYXkgb25lIG1lc3NhZ2UgZm9yIGFsbCB0eXBlc2V0dGluZyBlbnRyaWVzLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gIGhpZGVfbG9nX2lmX3N1Y2Nlc3M6XG4gICAgdGl0bGU6ICdIaWRlIExhVGVYIGxvZyBtZXNzYWdlcyBvbiBzdWNjZXNzZnVsIGJ1aWxkJ1xuICAgIG9yZGVyOiAxMlxuICAgIGRlc2NyaXB0aW9uOiAnSGlkZSB0aGUgTGFUZVggbG9nIHBhbmVsIGlmIHRoZSBidWlsZCBwcm9jZXNzIGlzIHN1Y2Nlc3NmdWwuIFxcXG4gICAgICAgICAgICAgICAgICBUaGlzIHdpbGwgc2F2ZSBzb21lIHNwYWNlIGZvciB0aGUgZWRpdG9yLCBidXQgd2FybmluZ3MgYXJlIFxcXG4gICAgICAgICAgICAgICAgICBoaWRkZW4gdW5sZXNzIG1hbnVhbGx5IGNsaWNraW5nIHRoZSBgU2hvdyBidWlsZCBsb2dgIGljb24uJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIGZpbGVfZXh0X3RvX2NsZWFuOlxuICAgIHRpdGxlOiAnRmlsZXMgdG8gY2xlYW4nXG4gICAgb3JkZXI6IDEzXG4gICAgZGVzY3JpcHRpb246ICdBbGwgZmlsZXMgdW5kZXIgdGhlIExhVGVYIHByb2plY3Qgcm9vdCBkaXJlY3Rvcnkgd2l0aCB0aGUgc2V0XFxcbiAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMgd2lsbCBiZSByZW1vdmVkIHdoZW4gY2xlYW5pbmcgTGFUZVggcHJvamVjdC4gXFxcbiAgICAgICAgICAgICAgICAgIE11bHRpcGxlIGZpbGUgZXh0ZW5zaW9ucyBhcmUgam9pbnQgd2l0aCBjb21tYXMuJ1xuICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgZGVmYXVsdDogJyouYXV4LCAqLmJibCwgKi5ibGcsICouaWR4LCAqLmluZCwgKi5sb2YsICoubG90LCAqLm91dCwgKi50b2MsIFxcXG4gICAgICAgICAgICAgICouYWNuLCAqLmFjciwgKi5hbGcsICouZ2xnLCAqLmdsbywgKi5nbHMsICouaXN0LCAqLmZscywgKi5sb2csIFxcXG4gICAgICAgICAgICAgICouZmRiX2xhdGV4bWsnXG4gIGNsZWFuX2FmdGVyX2J1aWxkOlxuICAgIHRpdGxlOiAnQ2xlYW4gTGFUZVggYXV4aWxpYXJ5IGZpbGVzIGFmdGVyIGJ1aWxkaW5nIHByb2Nlc3MnXG4gICAgb3JkZXI6IDE0XG4gICAgZGVzY3JpcHRpb246ICdDbGVhbiBhbGwgYXV4aWxpYXJ5IGZpbGVzIGFmdGVyIGJ1aWxkaW5nIExhVGVYIHByb2plY3QgYnkgXFxcbiAgICAgICAgICAgICAgICAgIHRoZSBkZWZpbmVkIGZpbGUgZXh0ZW5zaW9ucy4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgZGVsYXllZF9taW5pbWFwX3JlZnJlc2g6XG4gICAgdGl0bGU6ICdEZWxheSB0aGUgcmVmcmVzaCBhY3Rpb25zIG9mIGF0b20tbWluaW1hcCdcbiAgICBvcmRlcjogMTVcbiAgICBkZXNjcmlwdGlvbjogJ0RlbGF5IHRoZSByZWZyZXNoIGFjdGlvbnMgb2YgYXRvbS1taW5pbWFwIHVwb24gdHlwaW5nLiBUaGlzIFxcXG4gICAgICAgICAgICAgICAgICBzZXR0aW5nIGNhbiByZWR1Y2UgdGhlIGtleXN0cm9rZSBzdHV0dGVyaW5nIGluIHZlcnkgbG9uZyBcXFxuICAgICAgICAgICAgICAgICAgTGFUZVggc291cmNlIGZpbGVzIGNhdXNlZCBieSBtaW5pbWFwIGV4dGVuc2lvbi4gUmVsb2FkIEF0b20gXFxcbiAgICAgICAgICAgICAgICAgIHRvIHRha2UgZWZmZWN0LidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuIl19
