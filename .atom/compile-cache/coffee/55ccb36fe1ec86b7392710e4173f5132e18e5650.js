(function() {
  var initCount, themeConfig;

  initCount = 0;

  themeConfig = null;

  module.exports = {
    config: {
      theme: {
        title: 'Theme',
        description: 'Use the dark or light adwaita color theme. Auto will guess based on your syntax theme.',
        type: 'string',
        "default": 'auto',
        "enum": ['auto', 'light', 'dark']
      },
      fontFamily: {
        title: 'Font Family',
        description: 'Experimental: set to gtk-3 to load the font settings from ~/.config/gtk-3.0/settings.ini',
        type: 'string',
        "default": 'Cantarell',
        "enum": ['Cantarell', 'Sans Serif', 'DejaVu Sans', 'Oxygen-Sans', 'Droid Sans', 'gtk-3']
      },
      fontSize: {
        title: 'Font Size',
        description: 'Set to -1 for auto',
        type: 'number',
        "default": '-1'
      },
      iconTheme: {
        title: 'Icon Theme',
        type: 'string',
        "default": 'No Icons',
        "enum": ['No Icons', 'Octicons']
      }
    },
    activate: function(state) {
      var _initCount;
      initCount++;
      _initCount = initCount;
      return setTimeout(function() {
        var ThemeConfig;
        if (_initCount !== initCount) {
          return;
        }
        ThemeConfig = require('./config');
        console.log("Loading adwaita-pro-ui...");
        themeConfig = new ThemeConfig();
        return themeConfig.init();
      }, 10);
    },
    deactivate: function(state) {
      if (themeConfig != null) {
        themeConfig.destroy();
      }
      return themeConfig = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2Fkd2FpdGEtcHJvLXVpL2xpYi9hZHdhaXRhLXByby11aS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFNBQUEsR0FBWTs7RUFDWixXQUFBLEdBQWM7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLE1BQUEsRUFDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxPQUFQO1FBQ0EsV0FBQSxFQUFhLHdGQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BSFQ7UUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQ0osTUFESSxFQUVKLE9BRkksRUFHSixNQUhJLENBSk47T0FERjtNQVVBLFVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxhQUFQO1FBQ0EsV0FBQSxFQUFhLDBGQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFdBSFQ7UUFJQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQ0osV0FESSxFQUVKLFlBRkksRUFHSixhQUhJLEVBSUosYUFKSSxFQUtKLFlBTEksRUFNSixPQU5JLENBSk47T0FYRjtNQXVCQSxRQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sV0FBUDtRQUNBLFdBQUEsRUFBYSxvQkFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO09BeEJGO01BNEJBLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxZQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRlQ7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQ0osVUFESSxFQUVKLFVBRkksQ0FITjtPQTdCRjtLQURGO0lBd0NBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFFUixVQUFBO01BQUEsU0FBQTtNQUNBLFVBQUEsR0FBYTthQUNiLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsWUFBQTtRQUFBLElBQUcsVUFBQSxLQUFnQixTQUFuQjtBQUFrQyxpQkFBbEM7O1FBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSO1FBQ2QsT0FBTyxDQUFDLEdBQVIsQ0FBWSwyQkFBWjtRQUNBLFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQUE7ZUFDbEIsV0FBVyxDQUFDLElBQVosQ0FBQTtNQUxTLENBQVgsRUFNRSxFQU5GO0lBSlEsQ0F4Q1Y7SUFtREEsVUFBQSxFQUFZLFNBQUMsS0FBRDs7UUFDVixXQUFXLENBQUUsT0FBYixDQUFBOzthQUNBLFdBQUEsR0FBYztJQUZKLENBbkRaOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsiaW5pdENvdW50ID0gMFxudGhlbWVDb25maWcgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgdGhlbWU6XG4gICAgICB0aXRsZTogJ1RoZW1lJ1xuICAgICAgZGVzY3JpcHRpb246ICdVc2UgdGhlIGRhcmsgb3IgbGlnaHQgYWR3YWl0YSBjb2xvciB0aGVtZS4gQXV0byB3aWxsIGd1ZXNzIGJhc2VkIG9uIHlvdXIgc3ludGF4IHRoZW1lLidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnYXV0bydcbiAgICAgIGVudW06IFtcbiAgICAgICAgJ2F1dG8nLFxuICAgICAgICAnbGlnaHQnLFxuICAgICAgICAnZGFyaycsXG4gICAgICBdXG4gICAgZm9udEZhbWlseTpcbiAgICAgIHRpdGxlOiAnRm9udCBGYW1pbHknXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4cGVyaW1lbnRhbDogc2V0IHRvIGd0ay0zIHRvIGxvYWQgdGhlIGZvbnQgc2V0dGluZ3MgZnJvbSB+Ly5jb25maWcvZ3RrLTMuMC9zZXR0aW5ncy5pbmknXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0NhbnRhcmVsbCdcbiAgICAgIGVudW06IFtcbiAgICAgICAgJ0NhbnRhcmVsbCcsXG4gICAgICAgICdTYW5zIFNlcmlmJyxcbiAgICAgICAgJ0RlamFWdSBTYW5zJyxcbiAgICAgICAgJ094eWdlbi1TYW5zJyxcbiAgICAgICAgJ0Ryb2lkIFNhbnMnLFxuICAgICAgICAnZ3RrLTMnXG4gICAgICBdXG4gICAgZm9udFNpemU6XG4gICAgICB0aXRsZTogJ0ZvbnQgU2l6ZSdcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHRvIC0xIGZvciBhdXRvJ1xuICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgIGRlZmF1bHQ6ICctMSdcbiAgICBpY29uVGhlbWU6XG4gICAgICB0aXRsZTogJ0ljb24gVGhlbWUnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ05vIEljb25zJ1xuICAgICAgZW51bTogW1xuICAgICAgICAnTm8gSWNvbnMnLFxuICAgICAgICAnT2N0aWNvbnMnLFxuICAgICAgICAjICdBZHdhaXRhJyxcbiAgICAgICAgIyAnQnJlZXplJ1xuICAgICAgXVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBjb2RlIGluIHNlcGFyYXRlIGZpbGUgc28gZGVmZXJyYWwga2VlcHMgYWN0aXZhdGlvbiB0aW1lIGRvd25cbiAgICBpbml0Q291bnQrK1xuICAgIF9pbml0Q291bnQgPSBpbml0Q291bnRcbiAgICBzZXRUaW1lb3V0IC0+XG4gICAgICBpZiBfaW5pdENvdW50IGlzbnQgaW5pdENvdW50IHRoZW4gcmV0dXJuXG4gICAgICBUaGVtZUNvbmZpZyA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIGFkd2FpdGEtcHJvLXVpLi4uXCIpXG4gICAgICB0aGVtZUNvbmZpZyA9IG5ldyBUaGVtZUNvbmZpZygpXG4gICAgICB0aGVtZUNvbmZpZy5pbml0KClcbiAgICAsIDEwXG4gIGRlYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICB0aGVtZUNvbmZpZz8uZGVzdHJveSgpXG4gICAgdGhlbWVDb25maWcgPSBudWxsXG4iXX0=
