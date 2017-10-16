(function() {
  module.exports = {
    setComboRenderer: function(comboRenderer) {
      return this.combo = comboRenderer;
    },
    enable: function() {
      this.combo.enable();
      return this.combo.initConfigSubscribers();
    },
    disable: function() {
      return this.combo.destroy();
    },
    onChangePane: function(editor, editorElement) {
      this.combo.reset();
      if (editor) {
        return this.combo.setup(editorElement);
      }
    },
    onInput: function(cursor, screenPosition, input, data) {
      var qty;
      if (data['reset']) {
        this.combo.resetCounter();
        return;
      }
      qty = 1;
      if (data['qty']) {
        qty = data['qty'];
      }
      return this.combo.modifyStreak(qty);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi9jb21iby1tb2RlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxnQkFBQSxFQUFrQixTQUFDLGFBQUQ7YUFDaEIsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURPLENBQWxCO0lBR0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMscUJBQVAsQ0FBQTtJQUZNLENBSFI7SUFPQSxPQUFBLEVBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBO0lBRE8sQ0FQVDtJQVVBLFlBQUEsRUFBYyxTQUFDLE1BQUQsRUFBUyxhQUFUO01BQ1osSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQUE7TUFDQSxJQUE4QixNQUE5QjtlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFhLGFBQWIsRUFBQTs7SUFGWSxDQVZkO0lBY0EsT0FBQSxFQUFTLFNBQUMsTUFBRCxFQUFTLGNBQVQsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEM7QUFDUCxVQUFBO01BQUEsSUFBRyxJQUFLLENBQUEsT0FBQSxDQUFSO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQUE7QUFDQSxlQUZGOztNQUlBLEdBQUEsR0FBTTtNQUNOLElBQUcsSUFBSyxDQUFBLEtBQUEsQ0FBUjtRQUNFLEdBQUEsR0FBTSxJQUFLLENBQUEsS0FBQSxFQURiOzthQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixHQUFwQjtJQVRPLENBZFQ7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIHNldENvbWJvUmVuZGVyZXI6IChjb21ib1JlbmRlcmVyKSAtPlxuICAgIEBjb21ibyA9IGNvbWJvUmVuZGVyZXJcblxuICBlbmFibGU6IC0+XG4gICAgQGNvbWJvLmVuYWJsZSgpXG4gICAgQGNvbWJvLmluaXRDb25maWdTdWJzY3JpYmVycygpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAY29tYm8uZGVzdHJveSgpXG5cbiAgb25DaGFuZ2VQYW5lOiAoZWRpdG9yLCBlZGl0b3JFbGVtZW50KSAtPlxuICAgIEBjb21iby5yZXNldCgpXG4gICAgQGNvbWJvLnNldHVwIGVkaXRvckVsZW1lbnQgaWYgZWRpdG9yXG5cbiAgb25JbnB1dDogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBkYXRhKSAtPlxuICAgIGlmIGRhdGFbJ3Jlc2V0J11cbiAgICAgIEBjb21iby5yZXNldENvdW50ZXIoKVxuICAgICAgcmV0dXJuXG5cbiAgICBxdHkgPSAxXG4gICAgaWYgZGF0YVsncXR5J11cbiAgICAgIHF0eSA9IGRhdGFbJ3F0eSddXG5cbiAgICBAY29tYm8ubW9kaWZ5U3RyZWFrIHF0eVxuIl19
