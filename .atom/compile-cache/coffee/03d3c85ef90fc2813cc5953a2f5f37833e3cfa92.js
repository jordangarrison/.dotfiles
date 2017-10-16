(function() {
  var Disposable, FileTypes, ImageTypes, SubFiles, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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
      var activeFile, i, item, j, len, len1, ref, ref1, suggestions;
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
      activeFile = atom.workspace.getActiveTextEditor().getPath();
      ref1 = this.items;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        item = ref1[j];
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
      var dirName, e, extType, i, item, len, pos, ref, relPath, results;
      dirName = path.dirname(this.latex.mainFile);
      try {
        if (!images && (splice == null)) {
          relPath = path.relative(dirName, file);
          extType = path.extname(relPath);
          return this.items.push({
            text: relPath.replace(/\\/g, "/").replace(/(\.tex)/g, ""),
            displayText: relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"),
            rightLabel: extType.replace(".", ""),
            iconHTML: "<i class=\"" + (extType in FileTypes ? FileTypes[extType] : "icon-file-text") + "\"></i>",
            latexType: 'files',
            texImage: false
          });
        } else if (images && path.extname(file) in ImageTypes && (splice == null)) {
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
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            if (!(item.text === relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"))) {
              continue;
            }
            pos = this.items.map(function(item) {
              return item.text.indexOf(relPath.substr(0, relPath.lastIndexOf('.')).replace(/\\/g, "/"));
            });
            this.items.splice(pos.indexOf(0), 1);
            results.push(console.log("File: " + relPath + " removed to suggestion"));
          }
          return results;
        }
      } catch (error) {
        e = error;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL2F1dG9jb21wbGV0ZS9zdWJGaWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1Msa0JBQUMsS0FBRDtNQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUhFOzt1QkFLYixPQUFBLEdBQVMsU0FBQyxNQUFELEVBQVEsTUFBUjtBQUNQLFVBQUE7TUFBQSxXQUFBLEdBQWM7TUFDZCxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQW5CO0FBQ0U7QUFBQSxhQUFBLHFDQUFBOztVQUNFLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFWLENBQWtCLE1BQWxCLENBQUEsR0FBNEIsQ0FBQyxDQUFoQztZQUNFLElBQUksQ0FBQyxpQkFBTCxHQUF5QjtZQUN6QixXQUFXLENBQUMsSUFBWixDQUFpQixJQUFqQixFQUZGOztBQURGO1FBSUEsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNmLGlCQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLE1BQWYsQ0FBQSxHQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQVAsQ0FBZSxNQUFmO1FBRGpCLENBQWpCO0FBRUEsZUFBTyxZQVBUOztNQVNBLElBQUcsQ0FBQyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFmLENBQUEsQ0FBSjtBQUNFLGVBQU8sWUFEVDs7TUFFQSxV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TyxDQUFDLE1BQVIsQ0FDNUIsQ0FENEIsRUFDekIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsR0FBcEIsQ0FEeUIsQ0FDQSxDQUFDLE9BREQsQ0FDVSxLQURWLEVBQ2lCLEdBRGpCOzs7WUFFbkMsR0FBQSxHQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFNBQUMsSUFBRDtxQkFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVYsQ0FBa0IsT0FBTyxDQUFDLE1BQVIsQ0FDckMsQ0FEcUMsRUFDbEMsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsR0FBcEIsQ0FEa0MsQ0FDVCxDQUFDLE9BRFEsQ0FDQyxLQURELEVBQ1EsR0FEUixDQUFsQjtZQUFWLENBQVg7WUFFUCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsT0FBSixDQUFZLENBQVosQ0FBZCxFQUE2QixDQUE3Qjt5QkFDQSxPQUFPLENBQUMsR0FBUixDQUFZLFFBQUEsR0FBUyxPQUFULEdBQWlCLHdCQUE3QjtBQUxGO3lCQUhHO1NBdEJQO09BQUEsYUFBQTtRQStCTSxVQS9CTjs7SUFGWTs7dUJBbUNkLGNBQUEsR0FBZ0IsU0FBQTthQUNkLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFESzs7OztLQWpFSzs7RUFxRXZCLFVBQUEsR0FDRTtJQUFBLE1BQUEsRUFBVSwrQkFBVjtJQUNBLE1BQUEsRUFBVSwrQ0FEVjtJQUVBLE9BQUEsRUFBVSw4QkFGVjtJQUdBLE1BQUEsRUFBVSw4QkFIVjtJQUlBLE1BQUEsRUFBVSwwQkFKVjs7O0VBS0YsU0FBQSxHQUNFO0lBQUEsTUFBQSxFQUFRLHFDQUFSO0lBQ0EsTUFBQSxFQUFRLHVDQURSO0lBRUEsT0FBQSxFQUFTLHNDQUZUO0lBR0EsTUFBQSxFQUFRLHNDQUhSOztBQWpGRiIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTdWJGaWxlcyBleHRlbmRzIERpc3Bvc2FibGVcbiAgY29uc3RydWN0b3I6IChsYXRleCkgLT5cbiAgICBAbGF0ZXggPSBsYXRleFxuICAgIEBzdWdnZXN0aW9ucyA9IFtdXG4gICAgQGl0ZW1zID0gW11cblxuICBwcm92aWRlOiAocHJlZml4LGltYWdlcykgLT5cbiAgICBzdWdnZXN0aW9ucyA9IFtdXG4gICAgaWYgcHJlZml4Lmxlbmd0aCA+IDBcbiAgICAgIGZvciBpdGVtIGluIEBzdWdnZXN0aW9uc1xuICAgICAgICBpZiBpdGVtLnRleHQuaW5kZXhPZihwcmVmaXgpID4gLTFcbiAgICAgICAgICBpdGVtLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG4gICAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgICByZXR1cm4gYS50ZXh0LmluZGV4T2YocHJlZml4KSAtIGIudGV4dC5pbmRleE9mKHByZWZpeCkpXG4gICAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICAgIGlmICFAbGF0ZXgubWFuYWdlci5maW5kQWxsKClcbiAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuICAgIGFjdGl2ZUZpbGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpXG4gICAgZm9yIGl0ZW0gaW4gQGl0ZW1zIHdoZW4gaXRlbS50ZXhJbWFnZSBpcyBpbWFnZXM/IGFuZFxcXG4gICAgICAgaXRlbS50ZXh0IGlzbnQgcGF0aC5iYXNlbmFtZShhY3RpdmVGaWxlLHBhdGguZXh0bmFtZShhY3RpdmVGaWxlKSlcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaCBpdGVtXG5cbiAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSAtPlxuICAgICAgcmV0dXJuIC0xIGlmIGEudGV4dCA8IGIudGV4dFxuICAgICAgcmV0dXJuIDEpXG4gICAgQHN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnNcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcblxuICBnZXRGaWxlSXRlbXM6IChmaWxlLGltYWdlcyxzcGxpY2UpIC0+XG4gICAgZGlyTmFtZSA9IHBhdGguZGlybmFtZShAbGF0ZXgubWFpbkZpbGUpXG4gICAgdHJ5XG4gICAgICBpZiAhaW1hZ2VzIGFuZCAhc3BsaWNlP1xuICAgICAgICByZWxQYXRoID0gcGF0aC5yZWxhdGl2ZShkaXJOYW1lLGZpbGUpXG4gICAgICAgIGV4dFR5cGUgPSBwYXRoLmV4dG5hbWUocmVsUGF0aClcbiAgICAgICAgQGl0ZW1zLnB1c2hcbiAgICAgICAgIHRleHQ6IHJlbFBhdGgucmVwbGFjZSgvXFxcXC9nLCBcIi9cIikucmVwbGFjZSgvKFxcLnRleCkvZyxcIlwiKVxuICAgICAgICAgZGlzcGxheVRleHQ6IHJlbFBhdGguc3Vic3RyKFxuICAgICAgICAgICAgICAgICAgMCwgcmVsUGF0aC5sYXN0SW5kZXhPZignLicpKS5yZXBsYWNlKCAvXFxcXC9nLCBcIi9cIilcbiAgICAgICAgIHJpZ2h0TGFiZWw6IGV4dFR5cGUucmVwbGFjZShcIi5cIiwgXCJcIilcbiAgICAgICAgIGljb25IVE1MOiBcIlwiXCI8aSBjbGFzcz1cIiN7aWYgZXh0VHlwZSBvZiBGaWxlVHlwZXMgdGhlbiBGaWxlVHlwZXNbZXh0VHlwZV0gZWxzZSAgXCJpY29uLWZpbGUtdGV4dFwifVwiPjwvaT5cIlwiXCJcbiAgICAgICAgIGxhdGV4VHlwZTogJ2ZpbGVzJ1xuICAgICAgICAgdGV4SW1hZ2U6IGZhbHNlXG4gICAgICBlbHNlIGlmIGltYWdlcyBhbmQgcGF0aC5leHRuYW1lKGZpbGUpIG9mIEltYWdlVHlwZXMgYW5kICFzcGxpY2U/XG4gICAgICAgICByZWxQYXRoID0gcGF0aC5yZWxhdGl2ZShkaXJOYW1lLGZpbGUpXG4gICAgICAgICBleHRUeXBlID0gcGF0aC5leHRuYW1lKHJlbFBhdGgpXG4gICAgICAgICBAaXRlbXMucHVzaFxuICAgICAgICAgIHRleHQ6IHJlbFBhdGguc3Vic3RyKFxuICAgICAgICAgICAgICAgICAgIDAsIHJlbFBhdGgubGFzdEluZGV4T2YoJy4nKSkucmVwbGFjZSggL1xcXFwvZywgXCIvXCIpXG4gICAgICAgICAgcmlnaHRMYWJlbDogZXh0VHlwZS5yZXBsYWNlKFwiLlwiLCBcIlwiKVxuICAgICAgICAgIGljb25IVE1MOiBcIlwiXCI8aSBjbGFzcz1cIiN7SW1hZ2VUeXBlc1tleHRUeXBlXX1cIj48L2k+XCJcIlwiXG4gICAgICAgICAgbGF0ZXhUeXBlOiAnZmlsZXMnXG4gICAgICAgICAgdGV4SW1hZ2U6IHRydWVcbiAgICAgIGVsc2UgaWYgc3BsaWNlP1xuICAgICAgICByZWxQYXRoID0gcGF0aC5yZWxhdGl2ZShkaXJOYW1lLGZpbGUpXG4gICAgICAgIGV4dFR5cGUgPSBwYXRoLmV4dG5hbWUocmVsUGF0aClcbiAgICAgICAgZm9yIGl0ZW0gaW4gQGl0ZW1zIHdoZW4gaXRlbS50ZXh0IGlzIHJlbFBhdGguc3Vic3RyKFxuICAgICAgICAgICAgICAgICAwLCByZWxQYXRoLmxhc3RJbmRleE9mKCcuJykpLnJlcGxhY2UoIC9cXFxcL2csIFwiL1wiKVxuICAgICAgICAgIHBvcyA9ICBAaXRlbXMubWFwIChpdGVtKSAtPiBpdGVtLnRleHQuaW5kZXhPZihyZWxQYXRoLnN1YnN0cihcbiAgICAgICAgICAgICAgICAgICAwLCByZWxQYXRoLmxhc3RJbmRleE9mKCcuJykpLnJlcGxhY2UoIC9cXFxcL2csIFwiL1wiKSlcbiAgICAgICAgICBAaXRlbXMuc3BsaWNlKHBvcy5pbmRleE9mKDApLDEpXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJGaWxlOiAje3JlbFBhdGh9IHJlbW92ZWQgdG8gc3VnZ2VzdGlvblwiXG4gICAgY2F0Y2ggZVxuXG4gIHJlc2V0RmlsZUl0ZW1zOiAtPlxuICAgIEBpdGVtcyA9IFtdXG5cbiMgVXNlIGZpbGUtaWNvbnMgYXMgZGVmYXVsdCB3aXRoIEdpdCBPY3RpY29ucyBhcyBiYWNrdXBzXG5JbWFnZVR5cGVzID1cbiAgJy5wbmcnOiAgIFwibWVkaXVtLW9yYW5nZSBpY29uLWZpbGUtbWVkaWFcIlxuICAnLmVwcyc6ICAgXCJwb3N0c2NyaXB0LWljb24gbWVkaXVtLW9yYW5nZSBpY29uLWZpbGUtbWVkaWFcIlxuICAnLmpwZWcnOiAgXCJtZWRpdW0tZ3JlZW4gaWNvbi1maWxlLW1lZGlhXCJcbiAgJy5qcGcnOiAgIFwibWVkaXVtLWdyZWVuIGljb24tZmlsZS1tZWRpYVwiXG4gICcucGRmJzogICBcIm1lZGl1bS1yZWQgaWNvbi1maWxlLXBkZlwiXG5GaWxlVHlwZXMgID1cbiAgJy50ZXgnOiBcInRleC1pY29uIG1lZGl1bS1ibHVlIGljb24tZmlsZS10ZXh0XCJcbiAgJy5jbHMnOiBcInRleC1pY29uIG1lZGl1bS1vcmFuZ2UgaWNvbi1maWxlLXRleHRcIlxuICAnLnRpa3onOiBcInRleC1pY29uIG1lZGl1bS1ncmVlbiBpY29uLWZpbGUtdGV4dFwiXG4gICcuUm53JzogXCJ0ZXgtaWNvbiBtZWRpdW0tZ3JlZW4gaWNvbi1maWxlLXRleHRcIlxuIl19
