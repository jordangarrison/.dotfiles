(function() {
  var Disposable, FileTypes, ImageTypes, SubFiles, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Disposable = require('atom').Disposable;

  path = require('path');

  fs = require('fs-plus');

  module.exports = SubFiles = (function(superClass) {
    extend(SubFiles, superClass);

    function SubFiles(latex) {
      this.latex = latex;
      this.suggestions = [];
      this.items = [];
    }

    SubFiles.prototype.provide = function(prefix, images) {
      var FileExts, activeFile, dirName, file, i, item, j, k, len, len1, len2, ref, ref1, ref2, results, suggestions;
      suggestions = [];
      if (prefix.length > 0) {
        ref = this.suggestions;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.text.indexOf(prefix) > -1) {
            item.replacementPrefix = prefix;
            suggestions.push(item);
          }
        }
        suggestions.sort(function(a, b) {
          return a.text.indexOf(prefix) - b.text.indexOf(prefix);
        });
        return suggestions;
      }
      if (!this.latex.manager.findAll()) {
        return suggestions;
      }
      if (this.latex.manager.disable_watcher) {
        dirName = path.dirname(this.latex.mainFile);
        results = fs.listTreeSync(dirName);
        FileExts = Object.keys(ImageTypes);
        if (((ref1 = this.latex.manager.config) != null ? ref1.latex_ext : void 0) != null) {
          FileExts.push.apply(FileExts, [".tex"].concat(slice.call(this.latex.manager.config.latex_ext)));
        }
        results = fs.listTreeSync(dirName).filter(function(res) {
          return res.match(RegExp("(|[\\/\\\\])\\.(?:" + (FileExts.join("|").replace(/\./g, '')) + ")", "g"));
        });
        for (j = 0, len1 = results.length; j < len1; j++) {
          file = results[j];
          this.getFileItems(file, !this.latex.manager.isTexFile(file));
        }
      }
      activeFile = atom.workspace.getActiveTextEditor().getPath();
      ref2 = this.items;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        item = ref2[k];
        if (item.texImage === (images != null) && item.text !== path.basename(activeFile, path.extname(activeFile))) {
          suggestions.push(item);
        }
      }
      suggestions.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        return 1;
      });
      this.suggestions = suggestions;
      return suggestions;
    };

    SubFiles.prototype.getFileItems = function(file, images, splice) {
      var dirName, e, extType, i, item, len, pos, ref, relPath, results1;
      dirName = path.dirname(this.latex.mainFile);
      try {
        if (!images && (splice == null)) {
          relPath = path.relative(dirName, file);
          extType = path.extname(relPath);
          return this.items.push({
            text: relPath.replace(/\\/g, "/").replace(/(\.tex)/g, ""),
            displayText: relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"),
            rightLabel: extType.replace(".", ""),
            iconHTML: "<i class=\"" + (FileTypes[extType] || "icon-file-text") + "\"></i>",
            latexType: 'files',
            texImage: false
          });
        } else if (images && (splice == null)) {
          relPath = path.relative(dirName, file);
          extType = path.extname(relPath);
          return this.items.push({
            text: relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"),
            rightLabel: extType.replace(".", ""),
            iconHTML: "<i class=\"" + ImageTypes[extType] + "\"></i>",
            latexType: 'files',
            texImage: true
          });
        } else if (splice != null) {
          relPath = path.relative(dirName, file);
          extType = path.extname(relPath);
          ref = this.items;
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            if (!(item.text === relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"))) {
              continue;
            }
            pos = this.items.map(function(item) {
              return item.text.indexOf(relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"));
            });
            results1.push(this.items.splice(pos.indexOf(0), 1));
          }
          return results1;
        }
      } catch (error) {
        e = error;
        return console.log(e);
      }
    };

    SubFiles.prototype.resetFileItems = function() {
      return this.items = [];
    };

    return SubFiles;

  })(Disposable);

  ImageTypes = {
    '.png': "medium-orange icon-file-media",
    '.eps': "postscript-icon medium-orange icon-file-media",
    '.jpeg': "medium-green icon-file-media",
    '.jpg': "medium-green icon-file-media",
    '.pdf': "medium-red icon-file-pdf"
  };

  FileTypes = {
    '.tex': "tex-icon medium-blue icon-file-text",
    '.cls': "tex-icon medium-orange icon-file-text",
    '.tikz': "tex-icon medium-green icon-file-text",
    '.Rnw': "tex-icon medium-green icon-file-text"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9zdWJGaWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7Ozs7RUFBRSxhQUFlLE9BQUEsQ0FBUSxNQUFSOztFQUNqQixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGtCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFIRTs7dUJBS2IsT0FBQSxHQUFTLFNBQUMsTUFBRCxFQUFRLE1BQVI7QUFDUCxVQUFBO01BQUEsV0FBQSxHQUFjO01BQ2QsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtBQUNFO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFBLEdBQTRCLENBQUMsQ0FBaEM7WUFDRSxJQUFJLENBQUMsaUJBQUwsR0FBeUI7WUFDekIsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBakIsRUFGRjs7QUFERjtRQUlBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDZixpQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxNQUFmLENBQUEsR0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZjtRQURqQixDQUFqQjtBQUVBLGVBQU8sWUFQVDs7TUFTQSxJQUFHLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBZixDQUFBLENBQUo7QUFDRSxlQUFPLFlBRFQ7O01BR0Es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QURELEVBQ1EsR0FEUixDQUFsQjtZQUFWLENBQVg7MEJBRVAsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE9BQUosQ0FBWSxDQUFaLENBQWQsRUFBNkIsQ0FBN0I7QUFKRjswQkFIRztTQXRCUDtPQUFBLGFBQUE7UUE4Qk07ZUFDSixPQUFPLENBQUMsR0FBUixDQUFZLENBQVosRUEvQkY7O0lBRlk7O3VCQW1DZCxjQUFBLEdBQWdCLFNBQUE7YUFDZCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBREs7Ozs7S0E3RUs7O0VBaUZ2QixVQUFBLEdBQ0U7SUFBQSxNQUFBLEVBQVUsK0JBQVY7SUFDQSxNQUFBLEVBQVUsK0NBRFY7SUFFQSxPQUFBLEVBQVUsOEJBRlY7SUFHQSxNQUFBLEVBQVUsOEJBSFY7SUFJQSxNQUFBLEVBQVUsMEJBSlY7OztFQUtGLFNBQUEsR0FDRTtJQUFBLE1BQUEsRUFBUSxxQ0FBUjtJQUNBLE1BQUEsRUFBUSx1Q0FEUjtJQUVBLE9BQUEsRUFBUyxzQ0FGVDtJQUdBLE1BQUEsRUFBUSxzQ0FIUjs7QUE3RkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7IERpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU3ViRmlsZXMgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcbiAgICBAc3VnZ2VzdGlvbnMgPSBbXVxuICAgIEBpdGVtcyA9IFtdXG5cbiAgcHJvdmlkZTogKHByZWZpeCxpbWFnZXMpIC0+XG4gICAgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIGlmIHByZWZpeC5sZW5ndGggPiAwXG4gICAgICBmb3IgaXRlbSBpbiBAc3VnZ2VzdGlvbnNcbiAgICAgICAgaWYgaXRlbS50ZXh0LmluZGV4T2YocHJlZml4KSA+IC0xXG4gICAgICAgICAgaXRlbS5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2ggaXRlbVxuICAgICAgc3VnZ2VzdGlvbnMuc29ydCgoYSwgYikgLT5cbiAgICAgICAgcmV0dXJuIGEudGV4dC5pbmRleE9mKHByZWZpeCkgLSBiLnRleHQuaW5kZXhPZihwcmVmaXgpKVxuICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG5cbiAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZEFsbCgpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgIGlmIEBsYXRleC5tYW5hZ2VyLmRpc2FibGVfd2F0Y2hlclxuICAgICAgZGlyTmFtZSA9IHBhdGguZGlybmFtZShAbGF0ZXgubWFpbkZpbGUpXG4gICAgICByZXN1bHRzID0gIGZzLmxpc3RUcmVlU3luYyhkaXJOYW1lKVxuICAgICAgRmlsZUV4dHMgPSBPYmplY3Qua2V5cyhJbWFnZVR5cGVzKVxuICAgICAgaWYgQGxhdGV4Lm1hbmFnZXIuY29uZmlnPy5sYXRleF9leHQ/XG4gICAgICAgIEZpbGVFeHRzLnB1c2ggXCIudGV4XCIgLCBAbGF0ZXgubWFuYWdlci5jb25maWcubGF0ZXhfZXh0Li4uXG4gICAgICAjIEZpbHRlciByZXN1bHRzXG4gICAgICByZXN1bHRzID0gZnMubGlzdFRyZWVTeW5jKGRpck5hbWUpLmZpbHRlciAocmVzKSAtPiByZXR1cm4gXFxcbiAgICAgICByZXMubWF0Y2goLy8vKHxbXFwvXFxcXF0pXFwuKD86I3tGaWxlRXh0cy5qb2luKFwifFwiKS5yZXBsYWNlKC9cXC4vZywnJyl9KS8vL2cpXG4gICAgICBAZ2V0RmlsZUl0ZW1zKGZpbGUsIUBsYXRleC5tYW5hZ2VyLmlzVGV4RmlsZShmaWxlKSkgZm9yIGZpbGUgaW4gcmVzdWx0c1xuXG4gICAgYWN0aXZlRmlsZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKClcbiAgICBmb3IgaXRlbSBpbiBAaXRlbXMgd2hlbiBpdGVtLnRleEltYWdlIGlzIGltYWdlcz8gYW5kXFxcbiAgICAgICBpdGVtLnRleHQgaXNudCBwYXRoLmJhc2VuYW1lKGFjdGl2ZUZpbGUscGF0aC5leHRuYW1lKGFjdGl2ZUZpbGUpKVxuICAgICAgICBzdWdnZXN0aW9ucy5wdXNoIGl0ZW1cblxuICAgIHN1Z2dlc3Rpb25zLnNvcnQoKGEsIGIpIC0+XG4gICAgICByZXR1cm4gLTEgaWYgYS50ZXh0IDwgYi50ZXh0XG4gICAgICByZXR1cm4gMSlcbiAgICBAc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uc1xuICAgIHJldHVybiBzdWdnZXN0aW9uc1xuXG4gIGdldEZpbGVJdGVtczogKGZpbGUsaW1hZ2VzLHNwbGljZSkgLT5cbiAgICBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKEBsYXRleC5tYWluRmlsZSlcbiAgICB0cnlcbiAgICAgIGlmICFpbWFnZXMgYW5kICFzcGxpY2U/XG4gICAgICAgIHJlbFBhdGggPSBwYXRoLnJlbGF0aXZlKGRpck5hbWUsZmlsZSlcbiAgICAgICAgZXh0VHlwZSA9IHBhdGguZXh0bmFtZShyZWxQYXRoKVxuICAgICAgICBAaXRlbXMucHVzaFxuICAgICAgICAgdGV4dDogcmVsUGF0aC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKS5yZXBsYWNlKC8oXFwudGV4KS9nLFwiXCIpXG4gICAgICAgICBkaXNwbGF5VGV4dDogcmVsUGF0aC5zdWJzdHIoXG4gICAgICAgICAgICAgICAgICAwLCByZWxQYXRoLmxhc3RJbmRleE9mKCcuJykpLnJlcGxhY2UoIC9cXFxcL2csIFwiL1wiKVxuICAgICAgICAgcmlnaHRMYWJlbDogZXh0VHlwZS5yZXBsYWNlKFwiLlwiLCBcIlwiKVxuICAgICAgICAgaWNvbkhUTUw6IFwiXCJcIjxpIGNsYXNzPVwiI3soRmlsZVR5cGVzW2V4dFR5cGVdIHx8IFwiaWNvbi1maWxlLXRleHRcIil9XCI+PC9pPlwiXCJcIlxuICAgICAgICAgbGF0ZXhUeXBlOiAnZmlsZXMnXG4gICAgICAgICB0ZXhJbWFnZTogZmFsc2VcbiAgICAgIGVsc2UgaWYgaW1hZ2VzIGFuZCAhc3BsaWNlP1xuICAgICAgICAgcmVsUGF0aCA9IHBhdGgucmVsYXRpdmUoZGlyTmFtZSxmaWxlKVxuICAgICAgICAgZXh0VHlwZSA9IHBhdGguZXh0bmFtZShyZWxQYXRoKVxuICAgICAgICAgQGl0ZW1zLnB1c2hcbiAgICAgICAgICB0ZXh0OiByZWxQYXRoLnN1YnN0cihcbiAgICAgICAgICAgICAgICAgICAwLCByZWxQYXRoLmxhc3RJbmRleE9mKCcuJykpLnJlcGxhY2UoIC9cXFxcL2csIFwiL1wiKVxuICAgICAgICAgIHJpZ2h0TGFiZWw6IGV4dFR5cGUucmVwbGFjZShcIi5cIiwgXCJcIilcbiAgICAgICAgICBpY29uSFRNTDogXCJcIlwiPGkgY2xhc3M9XCIje0ltYWdlVHlwZXNbZXh0VHlwZV19XCI+PC9pPlwiXCJcIlxuICAgICAgICAgIGxhdGV4VHlwZTogJ2ZpbGVzJ1xuICAgICAgICAgIHRleEltYWdlOiB0cnVlXG4gICAgICBlbHNlIGlmIHNwbGljZT9cbiAgICAgICAgcmVsUGF0aCA9IHBhdGgucmVsYXRpdmUoZGlyTmFtZSxmaWxlKVxuICAgICAgICBleHRUeXBlID0gcGF0aC5leHRuYW1lKHJlbFBhdGgpXG4gICAgICAgIGZvciBpdGVtIGluIEBpdGVtcyB3aGVuIGl0ZW0udGV4dCBpcyByZWxQYXRoLnN1YnN0cihcbiAgICAgICAgICAgICAgICAgMCwgcmVsUGF0aC5sYXN0SW5kZXhPZignLicpKS5yZXBsYWNlKCAvXFxcXC9nLCBcIi9cIilcbiAgICAgICAgICBwb3MgPSAgQGl0ZW1zLm1hcCAoaXRlbSkgLT4gaXRlbS50ZXh0LmluZGV4T2YocmVsUGF0aC5zdWJzdHIoXG4gICAgICAgICAgICAgICAgICAgMCwgcmVsUGF0aC5sYXN0SW5kZXhPZignLicpKS5yZXBsYWNlKCAvXFxcXC9nLCBcIi9cIikpXG4gICAgICAgICAgQGl0ZW1zLnNwbGljZShwb3MuaW5kZXhPZigwKSwxKVxuICAgIGNhdGNoIGVcbiAgICAgIGNvbnNvbGUubG9nIGVcblxuICByZXNldEZpbGVJdGVtczogLT5cbiAgICBAaXRlbXMgPSBbXVxuXG4jIFVzZSBmaWxlLWljb25zIGFzIGRlZmF1bHQgd2l0aCBHaXQgT2N0aWNvbnMgYXMgYmFja3Vwc1xuSW1hZ2VUeXBlcyA9XG4gICcucG5nJzogICBcIm1lZGl1bS1vcmFuZ2UgaWNvbi1maWxlLW1lZGlhXCJcbiAgJy5lcHMnOiAgIFwicG9zdHNjcmlwdC1pY29uIG1lZGl1bS1vcmFuZ2UgaWNvbi1maWxlLW1lZGlhXCJcbiAgJy5qcGVnJzogIFwibWVkaXVtLWdyZWVuIGljb24tZmlsZS1tZWRpYVwiXG4gICcuanBnJzogICBcIm1lZGl1bS1ncmVlbiBpY29uLWZpbGUtbWVkaWFcIlxuICAnLnBkZic6ICAgXCJtZWRpdW0tcmVkIGljb24tZmlsZS1wZGZcIlxuRmlsZVR5cGVzICA9XG4gICcudGV4JzogXCJ0ZXgtaWNvbiBtZWRpdW0tYmx1ZSBpY29uLWZpbGUtdGV4dFwiXG4gICcuY2xzJzogXCJ0ZXgtaWNvbiBtZWRpdW0tb3JhbmdlIGljb24tZmlsZS10ZXh0XCJcbiAgJy50aWt6JzogXCJ0ZXgtaWNvbiBtZWRpdW0tZ3JlZW4gaWNvbi1maWxlLXRleHRcIlxuICAnLlJudyc6IFwidGV4LWljb24gbWVkaXVtLWdyZWVuIGljb24tZmlsZS10ZXh0XCJcbiJdfQ==
