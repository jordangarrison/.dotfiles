(function() {
  var Disposable, FileExtsRegString, FileTypes, ImageTypes, SubFiles, fs, path,
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

    SubFiles.prototype.provide = function(prefix, latexType) {
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
          FileExts.push.apply(FileExts, [".tex", ".bib"].concat(slice.call(this.latex.manager.config.latex_ext)));
        }
        results = fs.listTreeSync(dirName).filter(function(res) {
          return res.match(RegExp("(|[\\/\\\\])\\.(?:" + (FileExts.join("|").replace(/\./g, '')) + ")", "g"));
        });
        for (j = 0, len1 = results.length; j < len1; j++) {
          file = results[j];
          this.getFileItems(file);
        }
      }
      activeFile = atom.project.relativizePath(atom.workspace.getActiveTextEditor().getPath())[1];
      ref2 = this.items;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        item = ref2[k];
        if (item.latexType === (latexType || 'files-tex') && item.relPath !== activeFile) {
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

    SubFiles.prototype.getFileItems = function(file) {
      var dirName, error, extType, latexType, relPath;
      dirName = path.dirname(this.latex.mainFile);
      relPath = path.relative(dirName, file);
      extType = path.extname(relPath);
      if (ImageTypes[extType] != null) {
        latexType = 'files-img';
      } else if (extType === '.bib') {
        latexType = 'files-bib';
      } else {
        latexType = 'files-tex';
      }
      try {
        return this.items.push({
          relPath: relPath,
          text: relPath.replace(/\\/g, '/').replace(RegExp("\\.(?:tex|" + FileExtsRegString + ")"), ''),
          displayText: relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, '/'),
          rightLabel: extType.replace('.', ''),
          iconHTML: "<i class=\"" + (ImageTypes[extType] || FileTypes[extType] || "icon-file-text") + "\"></i>",
          latexType: latexType
        });
      } catch (error1) {
        error = error1;
        return console.log(error);
      }
    };

    SubFiles.prototype.resetFileItems = function(file) {
      var pos, relPath;
      if (file != null) {
        relPath = path.relative(path.dirname(this.latex.mainFile), file);
        pos = this.items.map(function(item) {
          return item.relPath;
        }).indexOf(relPath);
        return this.items.splice(pos, 1);
      } else {
        return this.items = [];
      }
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
    '.Rnw': "tex-icon medium-green icon-file-text",
    '.bib': "bibtex-icon medium-yellow icon-file-text"
  };

  FileExtsRegString = "" + (Object.keys(ImageTypes).join("|").replace(/\./g, ''));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9zdWJGaWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdFQUFBO0lBQUE7Ozs7RUFBRSxhQUFlLE9BQUEsQ0FBUSxNQUFSOztFQUNqQixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLGtCQUFDLEtBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFIRTs7dUJBS2IsT0FBQSxHQUFTLFNBQUMsTUFBRCxFQUFRLFNBQVI7QUFDUCxVQUFBO01BQUEsV0FBQSxHQUFjO01BQ2QsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtBQUNFO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFBLEdBQTRCLENBQUMsQ0FBaEM7WUFDRSxJQUFJLENBQUMsaUJBQUwsR0FBeUI7WUFDekIsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBakIsRUFGRjs7QUFERjtRQUlBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDZixpQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxNQUFmLENBQUEsR0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsTUFBZjtRQURqQixDQUFqQjtBQUVBLGVBQU8sWUFQVDs7TUFTQSxJQUFHLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBZixDQUFBLENBQUo7QUFDRSxlQUFPLFlBRFQ7O01BR0Es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O0FBN0Z0QiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdWJGaWxlcyBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuICAgIEBzdWdnZXN0aW9ucyA9IFtdXG4gICAgQGl0ZW1zID0gW11cblxuICBwcm92aWRlOiAocHJlZml4LGxhdGV4VHlwZSkgLT5cbiAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgaWYgcHJlZml4Lmxlbmd0aCA+IDBcbiAgICAgIGZvciBpdGVtIGluIEBzdWdnZXN0aW9uc1xuICAgICAgICBpZiBpdGVtLnRleHQuaW5kZXhPZihwcmVmaXgpID4gLTFcbiAgICAgICAgICBpdGVtLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG4gICAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgICByZXR1cm4gYS50ZXh0LmluZGV4T2YocHJlZml4KSAtIGIudGV4dC5pbmRleE9mKHByZWZpeCkpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgIGlmICFAbGF0ZXgubWFuYWdlci5maW5kQWxsKClcbiAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuXG4gICAgaWYgQGxhdGV4Lm1hbmFnZXIuZGlzYWJsZV93YXRjaGVyXG4gICAgICBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKEBsYXRleC5tYWluRmlsZSlcbiAgICAgIHJlc3VsdHMgPSAgZnMubGlzdFRyZWVTeW5jKGRpck5hbWUpXG4gICAgICBGaWxlRXh0cyA9IE9iamVjdC5rZXlzKEltYWdlVHlwZXMpXG4gICAgICBpZiBAbGF0ZXgubWFuYWdlci5jb25maWc/LmxhdGV4X2V4dD9cbiAgICAgICAgRmlsZUV4dHMucHVzaCBcIi50ZXhcIiAsIFwiLmJpYlwiICwgQGxhdGV4Lm1hbmFnZXIuY29uZmlnLmxhdGV4X2V4dC4uLlxuICAgICAgIyBGaWx0ZXIgcmVzdWx0c1xuICAgICAgcmVzdWx0cyA9IGZzLmxpc3RUcmVlU3luYyhkaXJOYW1lKS5maWx0ZXIgKHJlcykgLT4gcmV0dXJuIFxcXG4gICAgICAgcmVzLm1hdGNoKC8vLyh8W1xcL1xcXFxdKVxcLig/OiN7RmlsZUV4dHMuam9pbihcInxcIikucmVwbGFjZSgvXFwuL2csJycpfSkvLy9nKVxuICAgICAgQGdldEZpbGVJdGVtcyhmaWxlKSBmb3IgZmlsZSBpbiByZXN1bHRzXG5cbiAgICBhY3RpdmVGaWxlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKCkpWzFdXG4gICAgIyBQdXNoIGZpbHRlcmVkIGl0ZW1zIHRvIHN1Z2dlc3Rpb25zXG4gICAgZm9yIGl0ZW0gaW4gQGl0ZW1zIHdoZW4gaXRlbS5sYXRleFR5cGUgaXMgKGxhdGV4VHlwZSB8fCAnZmlsZXMtdGV4JykgYW5kXFxcbiAgICAgIGl0ZW0ucmVsUGF0aCBpc250IGFjdGl2ZUZpbGVcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG5cbiAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgcmV0dXJuIC0xIGlmIGEudGV4dCA8IGIudGV4dFxuICAgICAgcmV0dXJuIDEpXG4gICAgQHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnNcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICBnZXRGaWxlSXRlbXM6IChmaWxlKSAtPlxuICAgIGRpck5hbWUgPSBwYXRoLmRpcm5hbWUoQGxhdGV4Lm1haW5GaWxlKVxuICAgIHJlbFBhdGggPSBwYXRoLnJlbGF0aXZlKGRpck5hbWUsZmlsZSlcbiAgICBleHRUeXBlID0gcGF0aC5leHRuYW1lKHJlbFBhdGgpXG4gICAgaWYgSW1hZ2VUeXBlc1tleHRUeXBlXT9cbiAgICAgIGxhdGV4VHlwZSA9ICdmaWxlcy1pbWcnXG4gICAgZWxzZSBpZiBleHRUeXBlID09ICcuYmliJ1xuICAgICAgbGF0ZXhUeXBlID0gJ2ZpbGVzLWJpYidcbiAgICBlbHNlXG4gICAgICBsYXRleFR5cGUgPSAnZmlsZXMtdGV4J1xuICAgIHRyeVxuICAgICAgQGl0ZW1zLnB1c2hcbiAgICAgICAgcmVsUGF0aDogcmVsUGF0aFxuICAgICAgICB0ZXh0OiByZWxQYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC8vL1xcLig/OnRleHwje0ZpbGVFeHRzUmVnU3RyaW5nfSkvLy8sJycpXG4gICAgICAgIGRpc3BsYXlUZXh0OiByZWxQYXRoLnN1YnN0cihcbiAgICAgICAgICAgICAgICAgMCwgcmVsUGF0aC5sYXN0SW5kZXhPZignLicpKS5yZXBsYWNlKCAvXFxcXC9nLCcvJylcbiAgICAgICAgcmlnaHRMYWJlbDogZXh0VHlwZS5yZXBsYWNlKCcuJywnJylcbiAgICAgICAgaWNvbkhUTUw6IFwiXCJcIjxpIGNsYXNzPVwiI3soSW1hZ2VUeXBlc1tleHRUeXBlXSB8fCBGaWxlVHlwZXNbZXh0VHlwZV0gfHwgXCJpY29uLWZpbGUtdGV4dFwiKX1cIj48L2k+XCJcIlwiXG4gICAgICAgIGxhdGV4VHlwZTogbGF0ZXhUeXBlXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgcmVzZXRGaWxlSXRlbXM6KGZpbGUpIC0+XG4gICAgaWYgZmlsZT9cbiAgICAgIHJlbFBhdGggPSBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShAbGF0ZXgubWFpbkZpbGUpLGZpbGUpXG4gICAgICBwb3MgPSBAaXRlbXMubWFwKChpdGVtKSAtPiBpdGVtLnJlbFBhdGgpLmluZGV4T2YocmVsUGF0aClcbiAgICAgIEBpdGVtcy5zcGxpY2UocG9zLDEpXG4gICAgZWxzZVxuICAgICAgQGl0ZW1zID0gW11cblxuIyBVc2UgZmlsZS1pY29ucyBhcyBkZWZhdWx0IHdpdGggR2l0IE9jdGljb25zIGFzIGJhY2t1cHNcbkltYWdlVHlwZXMgPVxuICAnLnBuZyc6ICAgXCJtZWRpdW0tb3JhbmdlIGljb24tZmlsZS1tZWRpYVwiXG4gICcuZXBzJzogICBcInBvc3RzY3JpcHQtaWNvbiBtZWRpdW0tb3JhbmdlIGljb24tZmlsZS1tZWRpYVwiXG4gICcuanBlZyc6ICBcIm1lZGl1bS1ncmVlbiBpY29uLWZpbGUtbWVkaWFcIlxuICAnLmpwZyc6ICAgXCJtZWRpdW0tZ3JlZW4gaWNvbi1maWxlLW1lZGlhXCJcbiAgJy5wZGYnOiAgIFwibWVkaXVtLXJlZCBpY29uLWZpbGUtcGRmXCJcbkZpbGVUeXBlcyAgPVxuICAnLnRleCc6IFwidGV4LWljb24gbWVkaXVtLWJsdWUgaWNvbi1maWxlLXRleHRcIlxuICAnLmNscyc6IFwidGV4LWljb24gbWVkaXVtLW9yYW5nZSBpY29uLWZpbGUtdGV4dFwiXG4gICcudGlreic6IFwidGV4LWljb24gbWVkaXVtLWdyZWVuIGljb24tZmlsZS10ZXh0XCJcbiAgJy5SbncnOiBcInRleC1pY29uIG1lZGl1bS1ncmVlbiBpY29uLWZpbGUtdGV4dFwiXG4gICcuYmliJzogXCJiaWJ0ZXgtaWNvbiBtZWRpdW0teWVsbG93IGljb24tZmlsZS10ZXh0XCJcblxuIyBTdHJpbmcgb2YgZmlsZSB0eXBlcyB0byBzdHJpcCBleHRlbnRpb25zXG5GaWxlRXh0c1JlZ1N0cmluZyA9IFwiI3tPYmplY3Qua2V5cyhJbWFnZVR5cGVzKS5qb2luKFwifFwiKS5yZXBsYWNlKC9cXC4vZywnJyl9XCJcbiJdfQ==
