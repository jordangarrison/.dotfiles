(function() {
  var Variable;

  module.exports = Variable = (function() {
    Variable.prototype.name = ' ';

    Variable.prototype.capitalizedName = ' ';

    Variable.prototype.type = ' ';

    Variable.prototype.isStatic = false;

    Variable.prototype.isFinal = false;

    function Variable(name, type, isStatic, isFinal) {
      this.name = name;
      this.capitalizedName = name.charAt(0).toUpperCase() + name.substring(1, name.length);
      this.type = type;
      this.isStatic = isStatic;
      this.isFinal = isFinal;
    }

    Variable.prototype.getName = function() {
      return this.name;
    };

    Variable.prototype.setName = function(value) {
      return this.name = value;
    };

    Variable.prototype.getType = function() {
      return this.type;
    };

    Variable.prototype.setType = function(value) {
      return this.type = value;
    };

    Variable.prototype.getIsStatic = function() {
      return this.isStatic;
    };

    Variable.prototype.setIsStatic = function(value) {
      return this.isStatic = value;
    };

    Variable.prototype.getIsFinal = function() {
      return this.isFinal;
    };

    Variable.prototype.setIsFinal = function(value) {
      return this.isFinal = value;
    };

    Variable.prototype.getCapitalizedName = function() {
      return this.capitalizedName;
    };

    Variable.prototype.toString = function() {
      return "Name: " + this.name + " - " + "Type: " + this.type + " - " + "isStatic: " + this.isStatic + " - " + "isFinal: " + this.isFinal;
    };

    return Variable;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2phdmEtZ2VuZXJhdG9yLXBsdXMvbGliL3ZhcmlhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTt1QkFDRixJQUFBLEdBQU07O3VCQUNOLGVBQUEsR0FBaUI7O3VCQUNqQixJQUFBLEdBQU07O3VCQUNOLFFBQUEsR0FBVTs7dUJBQ1YsT0FBQSxHQUFTOztJQUVJLGtCQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsUUFBYixFQUF1QixPQUF2QjtNQUNULElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLENBQUMsTUFBTCxDQUFZLENBQVosQ0FBYyxDQUFDLFdBQWYsQ0FBQSxDQUFBLEdBQStCLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQixJQUFJLENBQUMsTUFBdkI7TUFDbEQsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFXO0lBTEY7O3VCQU9iLE9BQUEsR0FBUyxTQUFBO0FBQ0wsYUFBTyxJQUFDLENBQUE7SUFESDs7dUJBR1QsT0FBQSxHQUFTLFNBQUMsS0FBRDthQUNMLElBQUMsQ0FBQSxJQUFELEdBQVE7SUFESDs7dUJBR1QsT0FBQSxHQUFTLFNBQUE7QUFDTCxhQUFPLElBQUMsQ0FBQTtJQURIOzt1QkFHVCxPQUFBLEdBQVMsU0FBQyxLQUFEO2FBQ0wsSUFBQyxDQUFBLElBQUQsR0FBUTtJQURIOzt1QkFHVCxXQUFBLEdBQWEsU0FBQTtBQUNULGFBQU8sSUFBQyxDQUFBO0lBREM7O3VCQUdiLFdBQUEsR0FBYSxTQUFDLEtBQUQ7YUFDVCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBREg7O3VCQUdiLFVBQUEsR0FBWSxTQUFBO0FBQ1IsYUFBTyxJQUFDLENBQUE7SUFEQTs7dUJBR1osVUFBQSxHQUFZLFNBQUMsS0FBRDthQUNSLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFESDs7dUJBR1osa0JBQUEsR0FBb0IsU0FBQTtBQUNoQixhQUFPLElBQUMsQ0FBQTtJQURROzt1QkFHcEIsUUFBQSxHQUFVLFNBQUE7QUFDTixhQUFPLFFBQUEsR0FBVyxJQUFDLENBQUEsSUFBWixHQUFtQixLQUFuQixHQUEyQixRQUEzQixHQUFzQyxJQUFDLENBQUEsSUFBdkMsR0FBOEMsS0FBOUMsR0FBc0QsWUFBdEQsR0FBcUUsSUFBQyxDQUFBLFFBQXRFLEdBQWlGLEtBQWpGLEdBQXlGLFdBQXpGLEdBQXVHLElBQUMsQ0FBQTtJQUR6Rzs7Ozs7QUExQ2QiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBWYXJpYWJsZVxuICAgIG5hbWU6ICcgJ1xuICAgIGNhcGl0YWxpemVkTmFtZTogJyAnXG4gICAgdHlwZTogJyAnXG4gICAgaXNTdGF0aWM6IGZhbHNlXG4gICAgaXNGaW5hbDogZmFsc2VcblxuICAgIGNvbnN0cnVjdG9yOiAobmFtZSwgdHlwZSwgaXNTdGF0aWMsIGlzRmluYWwpIC0+XG4gICAgICAgIEBuYW1lID0gbmFtZVxuICAgICAgICBAY2FwaXRhbGl6ZWROYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEsIG5hbWUubGVuZ3RoKVxuICAgICAgICBAdHlwZSA9IHR5cGVcbiAgICAgICAgQGlzU3RhdGljID0gaXNTdGF0aWNcbiAgICAgICAgQGlzRmluYWwgPSBpc0ZpbmFsXG5cbiAgICBnZXROYW1lOiAtPlxuICAgICAgICByZXR1cm4gQG5hbWVcblxuICAgIHNldE5hbWU6ICh2YWx1ZSkgLT5cbiAgICAgICAgQG5hbWUgPSB2YWx1ZVxuXG4gICAgZ2V0VHlwZTogLT5cbiAgICAgICAgcmV0dXJuIEB0eXBlXG5cbiAgICBzZXRUeXBlOiAodmFsdWUpIC0+XG4gICAgICAgIEB0eXBlID0gdmFsdWVcblxuICAgIGdldElzU3RhdGljOiAtPlxuICAgICAgICByZXR1cm4gQGlzU3RhdGljXG5cbiAgICBzZXRJc1N0YXRpYzogKHZhbHVlKSAtPlxuICAgICAgICBAaXNTdGF0aWMgPSB2YWx1ZVxuXG4gICAgZ2V0SXNGaW5hbDogLT5cbiAgICAgICAgcmV0dXJuIEBpc0ZpbmFsXG5cbiAgICBzZXRJc0ZpbmFsOiAodmFsdWUpIC0+XG4gICAgICAgIEBpc0ZpbmFsID0gdmFsdWVcblxuICAgIGdldENhcGl0YWxpemVkTmFtZTogLT5cbiAgICAgICAgcmV0dXJuIEBjYXBpdGFsaXplZE5hbWVcblxuICAgIHRvU3RyaW5nOiAtPlxuICAgICAgICByZXR1cm4gXCJOYW1lOiBcIiArIEBuYW1lICsgXCIgLSBcIiArIFwiVHlwZTogXCIgKyBAdHlwZSArIFwiIC0gXCIgKyBcImlzU3RhdGljOiBcIiArIEBpc1N0YXRpYyArIFwiIC0gXCIgKyBcImlzRmluYWw6IFwiICsgQGlzRmluYWxcbiJdfQ==
