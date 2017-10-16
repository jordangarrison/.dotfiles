Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _optionScopes = require('./option-scopes');

var _optionScopes2 = _interopRequireDefault(_optionScopes);

'use babel';

var options = {
  normalizeSlashes: {
    type: 'boolean',
    description: 'Replaces backward slashes with forward slashes on windows (if possible)',
    'default': true
  },
  maxFileCount: {
    type: 'number',
    description: 'The maximum amount of files to be handled',
    'default': 2000
  },
  suggestionPriority: {
    type: 'number',
    description: 'Suggestion priority of this provider. If set to a number larger than or equal to 1, suggestions will be displayed on top of default suggestions.',
    'default': 2
  },
  ignoredNames: {
    type: 'boolean',
    'default': true,
    description: 'Ignore items matched by the `Ignore Names` core option.'
  },
  ignoreSubmodules: {
    type: 'boolean',
    'default': false,
    description: 'Ignore submodule directories.'
  },
  scopes: {
    type: 'array',
    'default': [],
    items: {
      type: 'object',
      properties: {
        scopes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        prefixes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        extensions: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        relative: {
          type: 'boolean',
          'default': true
        },
        replaceOnInsert: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: ['string', 'string']
            }
          }
        }
      }
    }
  }
};

for (var key in _optionScopes2['default']) {
  options[key] = {
    type: 'boolean',
    'default': false
  };
}

exports['default'] = options;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL2NvbmZpZy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7NEJBRXlCLGlCQUFpQjs7OztBQUYxQyxXQUFXLENBQUE7O0FBSVgsSUFBTSxPQUFPLEdBQUc7QUFDZCxrQkFBZ0IsRUFBRTtBQUNoQixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVcsRUFBRSx5RUFBeUU7QUFDdEYsZUFBUyxJQUFJO0dBQ2Q7QUFDRCxjQUFZLEVBQUU7QUFDWixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVcsRUFBRSwyQ0FBMkM7QUFDeEQsZUFBUyxJQUFJO0dBQ2Q7QUFDRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVcsRUFBRSxrSkFBa0o7QUFDL0osZUFBUyxDQUFDO0dBQ1g7QUFDRCxjQUFZLEVBQUU7QUFDWixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLGVBQVcsRUFBRSx5REFBeUQ7R0FDdkU7QUFDRCxrQkFBZ0IsRUFBRTtBQUNoQixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLGVBQVcsRUFBRSwrQkFBK0I7R0FDN0M7QUFDRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsT0FBTztBQUNiLGVBQVMsRUFBRTtBQUNYLFNBQUssRUFBRTtBQUNMLFVBQUksRUFBRSxRQUFRO0FBQ2QsZ0JBQVUsRUFBRTtBQUNWLGNBQU0sRUFBRTtBQUNOLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUNmLGVBQUssRUFBRTtBQUNMLGdCQUFJLEVBQUUsUUFBUTtXQUNmO1NBQ0Y7QUFDRCxnQkFBUSxFQUFFO0FBQ1IsY0FBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ2YsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRSxRQUFRO1dBQ2Y7U0FDRjtBQUNELGtCQUFVLEVBQUU7QUFDVixjQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDZixlQUFLLEVBQUU7QUFDTCxnQkFBSSxFQUFFLFFBQVE7V0FDZjtTQUNGO0FBQ0QsZ0JBQVEsRUFBRTtBQUNSLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsSUFBSTtTQUNkO0FBQ0QsdUJBQWUsRUFBRTtBQUNmLGNBQUksRUFBRSxPQUFPO0FBQ2IsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQUssRUFBRTtBQUNMLGtCQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2FBQzNCO1dBQ0Y7U0FDRjtPQUNGO0tBQ0Y7R0FDRjtDQUNGLENBQUE7O0FBRUQsS0FBSyxJQUFJLEdBQUcsK0JBQWtCO0FBQzVCLFNBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRztBQUNiLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2YsQ0FBQTtDQUNGOztxQkFFYyxPQUFPIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL2NvbmZpZy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBPcHRpb25TY29wZXMgZnJvbSAnLi9vcHRpb24tc2NvcGVzJ1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBub3JtYWxpemVTbGFzaGVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlc2NyaXB0aW9uOiAnUmVwbGFjZXMgYmFja3dhcmQgc2xhc2hlcyB3aXRoIGZvcndhcmQgc2xhc2hlcyBvbiB3aW5kb3dzIChpZiBwb3NzaWJsZSknLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgbWF4RmlsZUNvdW50OiB7XG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVzY3JpcHRpb246ICdUaGUgbWF4aW11bSBhbW91bnQgb2YgZmlsZXMgdG8gYmUgaGFuZGxlZCcsXG4gICAgZGVmYXVsdDogMjAwMFxuICB9LFxuICBzdWdnZXN0aW9uUHJpb3JpdHk6IHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZXNjcmlwdGlvbjogJ1N1Z2dlc3Rpb24gcHJpb3JpdHkgb2YgdGhpcyBwcm92aWRlci4gSWYgc2V0IHRvIGEgbnVtYmVyIGxhcmdlciB0aGFuIG9yIGVxdWFsIHRvIDEsIHN1Z2dlc3Rpb25zIHdpbGwgYmUgZGlzcGxheWVkIG9uIHRvcCBvZiBkZWZhdWx0IHN1Z2dlc3Rpb25zLicsXG4gICAgZGVmYXVsdDogMlxuICB9LFxuICBpZ25vcmVkTmFtZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBkZXNjcmlwdGlvbjogJ0lnbm9yZSBpdGVtcyBtYXRjaGVkIGJ5IHRoZSBgSWdub3JlIE5hbWVzYCBjb3JlIG9wdGlvbi4nXG4gIH0sXG4gIGlnbm9yZVN1Ym1vZHVsZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246ICdJZ25vcmUgc3VibW9kdWxlIGRpcmVjdG9yaWVzLidcbiAgfSxcbiAgc2NvcGVzOiB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBkZWZhdWx0OiBbXSxcbiAgICBpdGVtczoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNjb3Blczoge1xuICAgICAgICAgIHR5cGU6IFsnYXJyYXknXSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHByZWZpeGVzOiB7XG4gICAgICAgICAgdHlwZTogWydhcnJheSddLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXh0ZW5zaW9uczoge1xuICAgICAgICAgIHR5cGU6IFsnYXJyYXknXSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbGF0aXZlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcmVwbGFjZU9uSW5zZXJ0OiB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ3N0cmluZyddXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZvciAobGV0IGtleSBpbiBPcHRpb25TY29wZXMpIHtcbiAgb3B0aW9uc1trZXldID0ge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wdGlvbnNcbiJdfQ==