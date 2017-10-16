'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = [{
  scopes: ['source.js', 'source.js.jsx', 'source.coffee', 'source.coffee.jsx', 'source.ts', 'source.tsx'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'vue', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['css', 'sass', 'scss', 'less', 'styl'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.coffee', 'source.coffee.jsx'],
  prefixes: ['require\\s+[\'"]', // require './foo'
  'define\\s+\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['source.php'],
  prefixes: ['require_once\\([\'"]', // require_once('foo.php')
  'include\\([\'"]' // include('./foo.php')
  ],
  extensions: ['php'],
  relative: true
}, {
  scopes: ['source.sass', 'source.css.scss', 'source.less', 'source.stylus'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['sass', 'scss', 'css'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.css'],
  prefixes: ['@import\\s+[\'"]?', // @import 'foo.css'
  '@import\\s+url\\([\'"]?' // @import url('foo.css')
  ],
  extensions: ['css'],
  relative: true
}, {
  scopes: ['source.css', 'source.sass', 'source.less', 'source.css.scss', 'source.stylus'],
  prefixes: ['url\\([\'"]?'],
  extensions: ['png', 'gif', 'jpeg', 'jpg', 'woff', 'ttf', 'svg', 'otf'],
  relative: true
}, {
  scopes: ['source.c', 'source.cpp'],
  prefixes: ['^\\s*#include\\s+[\'"]'],
  extensions: ['h', 'hpp'],
  relative: true,
  includeCurrentDirectory: false
}, {
  scopes: ['source.lua'],
  prefixes: ['require[\\s+|\\(][\'"]'],
  extensions: ['lua'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.lua$', '']]
}, {
  scopes: ['source.ruby'],
  prefixes: ['^\\s*require[\\s+|\\(][\'"]'],
  extensions: ['rb'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\.rb$', '']]
}, {
  scopes: ['source.python'],
  prefixes: ['^\\s*from\\s+', '^\\s*import\\s+'],
  extensions: ['py'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.py$', '']]
}];
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL2NvbmZpZy9kZWZhdWx0LXNjb3Blcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7O3FCQUVJLENBQ2I7QUFDRSxRQUFNLEVBQUUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDO0FBQ3ZHLFVBQVEsRUFBRSxDQUNSLDRCQUE0QjtBQUM1QixtQkFBaUI7QUFDakIsbUJBQWlCO0FBQ2pCLHNCQUFvQjtHQUNyQjtBQUNELFlBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7QUFDaEQsVUFBUSxFQUFFLElBQUk7QUFDZCxpQkFBZSxFQUFFLENBQ2YsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQ2hCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUNkLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUNuQjtDQUNGLEVBQ0Q7QUFDRSxRQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDekIsVUFBUSxFQUFFLENBQ1IsNEJBQTRCO0FBQzVCLG1CQUFpQjtBQUNqQixtQkFBaUI7QUFDakIsc0JBQW9CO0dBQ3JCO0FBQ0QsWUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7QUFDdkQsVUFBUSxFQUFFLElBQUk7QUFDZCxpQkFBZSxFQUFFLENBQ2YsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQ2hCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUNkLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUNuQjtDQUNGLEVBQ0Q7QUFDRSxRQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDekIsVUFBUSxFQUFF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Q0FDZixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FDZjtDQUNGLEVBQ0Q7QUFDRSxRQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDekIsVUFBUSxFQUFFLENBQ1IsZUFBZSxFQUNmLGlCQUFpQixDQUNsQjtBQUNELFlBQVUsRUFBRSxDQUFDLElBQUksQ0FBQztBQUNsQixVQUFRLEVBQUUsSUFBSTtBQUNkLHlCQUF1QixFQUFFLEtBQUs7QUFDOUIsaUJBQWUsRUFBRSxDQUNmLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUNaLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUNiLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUNmO0NBQ0YsQ0FDRiIsImZpbGUiOiIvaG9tZS9qZ2Fycmlzb24vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9jb25maWcvZGVmYXVsdC1zY29wZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnLCAnc291cmNlLmNvZmZlZScsICdzb3VyY2UuY29mZmVlLmpzeCcsICdzb3VyY2UudHMnLCAnc291cmNlLnRzeCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnaW1wb3J0XFxcXHMrLio/ZnJvbVxcXFxzK1tcXCdcIl0nLCAvLyBpbXBvcnQgZm9vIGZyb20gJy4vZm9vJ1xuICAgICAgJ2ltcG9ydFxcXFxzK1tcXCdcIl0nLCAvLyBpbXBvcnQgJy4vZm9vJ1xuICAgICAgJ3JlcXVpcmVcXFxcKFtcXCdcIl0nLCAvLyByZXF1aXJlKCcuL2ZvbycpXG4gICAgICAnZGVmaW5lXFxcXChcXFxcWz9bXFwnXCJdJyAvLyBkZWZpbmUoWycuL2ZvbyddKSBvciBkZWZpbmUoJy4vZm9vJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnanMnLCAnanN4JywgJ3RzJywgJ3RzeCcsICdjb2ZmZWUnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC5qc3g/JCcsICcnXSxcbiAgICAgIFsnXFxcXC50cyQnLCAnJ10sXG4gICAgICBbJ1xcXFwuY29mZmVlJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwudnVlJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdpbXBvcnRcXFxccysuKj9mcm9tXFxcXHMrW1xcJ1wiXScsIC8vIGltcG9ydCBmb28gZnJvbSAnLi9mb28nXG4gICAgICAnaW1wb3J0XFxcXHMrW1xcJ1wiXScsIC8vIGltcG9ydCAnLi9mb28nXG4gICAgICAncmVxdWlyZVxcXFwoW1xcJ1wiXScsIC8vIHJlcXVpcmUoJy4vZm9vJylcbiAgICAgICdkZWZpbmVcXFxcKFxcXFxbP1tcXCdcIl0nIC8vIGRlZmluZShbJy4vZm9vJ10pIG9yIGRlZmluZSgnLi9mb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydqcycsICdqc3gnLCAndnVlJywgJ3RzJywgJ3RzeCcsICdjb2ZmZWUnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC5qc3g/JCcsICcnXSxcbiAgICAgIFsnXFxcXC50cyQnLCAnJ10sXG4gICAgICBbJ1xcXFwuY29mZmVlJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwudnVlJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdAaW1wb3J0W1xcXFwofFxcXFxzK10/W1xcJ1wiXScgLy8gQGltcG9ydCAnZm9vJyBvciBAaW1wb3J0KCdmb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydjc3MnLCAnc2FzcycsICdzY3NzJywgJ2xlc3MnLCAnc3R5bCddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWycoLyk/XyhbXi9dKj8pJCcsICckMSQyJ10gLy8gZGlyMS9fZGlyMi9fZmlsZS5zYXNzID0+IGRpcjEvX2RpcjIvZmlsZS5zYXNzXG4gICAgXVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5jb2ZmZWUnLCAnc291cmNlLmNvZmZlZS5qc3gnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3JlcXVpcmVcXFxccytbXFwnXCJdJywgLy8gcmVxdWlyZSAnLi9mb28nXG4gICAgICAnZGVmaW5lXFxcXHMrXFxcXFs/W1xcJ1wiXScgLy8gZGVmaW5lKFsnLi9mb28nXSkgb3IgZGVmaW5lKCcuL2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2pzJywgJ2pzeCcsICd0cycsICd0c3gnLCAnY29mZmVlJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwuanN4PyQnLCAnJ10sXG4gICAgICBbJ1xcXFwudHMkJywgJyddLFxuICAgICAgWydcXFxcLmNvZmZlZSQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnBocCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAncmVxdWlyZV9vbmNlXFxcXChbXFwnXCJdJywgLy8gcmVxdWlyZV9vbmNlKCdmb28ucGhwJylcbiAgICAgICdpbmNsdWRlXFxcXChbXFwnXCJdJyAvLyBpbmNsdWRlKCcuL2Zvby5waHAnKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydwaHAnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5zYXNzJywgJ3NvdXJjZS5jc3Muc2NzcycsICdzb3VyY2UubGVzcycsICdzb3VyY2Uuc3R5bHVzJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdAaW1wb3J0W1xcXFwofFxcXFxzK10/W1xcJ1wiXScgLy8gQGltcG9ydCAnZm9vJyBvciBAaW1wb3J0KCdmb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydzYXNzJywgJ3Njc3MnLCAnY3NzJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJygvKT9fKFteL10qPykkJywgJyQxJDInXSAvLyBkaXIxL19kaXIyL19maWxlLnNhc3MgPT4gZGlyMS9fZGlyMi9maWxlLnNhc3NcbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmNzcyddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnQGltcG9ydFxcXFxzK1tcXCdcIl0/JywgLy8gQGltcG9ydCAnZm9vLmNzcydcbiAgICAgICdAaW1wb3J0XFxcXHMrdXJsXFxcXChbXFwnXCJdPycgLy8gQGltcG9ydCB1cmwoJ2Zvby5jc3MnKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydjc3MnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5jc3MnLCAnc291cmNlLnNhc3MnLCAnc291cmNlLmxlc3MnLCAnc291cmNlLmNzcy5zY3NzJywgJ3NvdXJjZS5zdHlsdXMnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3VybFxcXFwoW1xcJ1wiXT8nXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3BuZycsICdnaWYnLCAnanBlZycsICdqcGcnLCAnd29mZicsICd0dGYnLCAnc3ZnJywgJ290ZiddLFxuICAgIHJlbGF0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmMnLCAnc291cmNlLmNwcCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnXlxcXFxzKiNpbmNsdWRlXFxcXHMrW1xcJ1wiXSdcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnaCcsICdocHAnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBpbmNsdWRlQ3VycmVudERpcmVjdG9yeTogZmFsc2VcbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UubHVhJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdyZXF1aXJlW1xcXFxzK3xcXFxcKF1bXFwnXCJdJ1xuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydsdWEnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBpbmNsdWRlQ3VycmVudERpcmVjdG9yeTogZmFsc2UsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwvJywgJy4nXSxcbiAgICAgIFsnXFxcXFxcXFwnLCAnLiddLFxuICAgICAgWydcXFxcLmx1YSQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnJ1YnknXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ15cXFxccypyZXF1aXJlW1xcXFxzK3xcXFxcKF1bXFwnXCJdJ1xuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydyYiddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIGluY2x1ZGVDdXJyZW50RGlyZWN0b3J5OiBmYWxzZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC5yYiQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnB5dGhvbiddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnXlxcXFxzKmZyb21cXFxccysnLFxuICAgICAgJ15cXFxccyppbXBvcnRcXFxccysnXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3B5J10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgaW5jbHVkZUN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWydcXFxcLycsICcuJ10sXG4gICAgICBbJ1xcXFxcXFxcJywgJy4nXSxcbiAgICAgIFsnXFxcXC5weSQnLCAnJ11cbiAgICBdXG4gIH1cbl1cbiJdfQ==