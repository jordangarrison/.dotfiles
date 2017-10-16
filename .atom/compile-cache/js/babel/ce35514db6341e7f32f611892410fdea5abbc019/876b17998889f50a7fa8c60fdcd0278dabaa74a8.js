Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = require('./util');

'use babel';

function methodEntryToSnippet(entry) {
  var args = entry.signature.arguments || [];
  var mapArg = function mapArg(arg, index) {
    return '${' + (index + 1) + ':' + (0, _util.denamespace)(arg).replace(/\$/, '.') + '}';
  };
  return entry.name + '(' + args.map(mapArg).join(', ') + ')$' + (args.length + 1);
}

function mapClassEntryToConstructorSuggestion(klass) {
  var constructors = klass.methods.filter(function (method) {
    return method.name === '<init>';
  });
  return constructors.map(function (constructor) {
    return {
      snippet: methodEntryToSnippet(_extends({}, constructor, { name: (0, _util.denamespace)(klass.name) })),
      rightLabel: (0, _util.packagify)(klass.name),
      leftLabel: klass.name,
      type: 'class',

      // Not part of autocomplete-api, passed so that the classname can be given to importHandler.
      klass: klass
    };
  });
}

function mapClassEntryToSuggestion(klass) {
  return {
    // The `text`/`snippet` thingie here is quite hacky. Snippet will be inserted into editor.
    // Setting `text` as the fully qualified class will make any duplicate class names,
    // but from different packages show up in suggestion list.
    // Issue: https://github.com/atom/autocomplete-plus/issues/615
    text: klass.name,
    snippet: (0, _util.denamespace)(klass.name.replace(/\$/g, '.')),
    rightLabel: (0, _util.packagify)(klass.name),
    type: 'class',

    // Not part of autocomplete-api, passed so that the classname can be given to importHandler.
    klass: klass
  };
}

function mapMethodEntryToSuggestion(method) {
  return {
    snippet: methodEntryToSnippet(method),
    leftLabel: method.signature.returnValue,
    rightLabel: method.origin,
    type: 'method'
  };
}

function mapFieldEntryToSuggestion(field) {
  return {
    text: field.name,
    leftLabel: field.type,
    rightLabel: field.origin,
    type: field.variable ? 'variable' : 'constant'
  };
}

function mapToSuggestion(entry) {
  switch (entry._type) {
    case 'class':
      return mapClassEntryToSuggestion(entry);
    case 'method':
      return mapMethodEntryToSuggestion(entry);
    case 'field':
      return mapFieldEntryToSuggestion(entry);
    case 'constructor':
      return mapClassEntryToConstructorSuggestion(entry);
    default:
      console.warn('Unknown map entry:', entry);
      return false;
  }
}

exports.mapToSuggestion = mapToSuggestion;
exports.mapClassEntryToConstructorSuggestion = mapClassEntryToConstructorSuggestion;
exports.mapClassEntryToSuggestion = mapClassEntryToSuggestion;
exports.mapMethodEntryToSuggestion = mapMethodEntryToSuggestion;
exports.mapFieldEntryToSuggestion = mapFieldEntryToSuggestion;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvbWFwcGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRXVDLFFBQVE7O0FBRi9DLFdBQVcsQ0FBQzs7QUFJWixTQUFTLG9CQUFvQixDQUFDLEtBQUssRUFBRTtBQUNuQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7QUFDN0MsTUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFFLEtBQUs7bUJBQVcsS0FBSyxHQUFHLENBQUMsQ0FBQSxTQUFJLHVCQUFZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO0dBQUcsQ0FBQztBQUN6RixTQUFVLEtBQUssQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQU0sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsQ0FBRztDQUM1RTs7QUFFRCxTQUFTLG9DQUFvQyxDQUFDLEtBQUssRUFBRTtBQUNuRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU07V0FBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVE7R0FBQSxDQUFDLENBQUM7QUFDOUUsU0FBTyxZQUFZLENBQ2hCLEdBQUcsQ0FBQyxVQUFBLFdBQVc7V0FBSztBQUNuQixhQUFPLEVBQUUsb0JBQW9CLGNBQU0sV0FBVyxJQUFFLElBQUksRUFBRSx1QkFBWSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUc7QUFDaEYsZ0JBQVUsRUFBRSxxQkFBVSxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2pDLGVBQVMsRUFBRSxLQUFLLENBQUMsSUFBSTtBQUNyQixVQUFJLEVBQUUsT0FBTzs7O0FBR2IsV0FBSyxFQUFMLEtBQUs7S0FDTjtHQUFDLENBQUMsQ0FBQztDQUNQOztBQUVELFNBQVMseUJBQXlCLENBQUMsS0FBSyxFQUFFO0FBQ3hDLFNBQU87Ozs7O0FBS0wsUUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ2hCLFdBQU8sRUFBRSx1QkFBWSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDcEQsY0FBVSxFQUFFLHFCQUFVLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDakMsUUFBSSxFQUFFLE9BQU87OztBQUdiLFNBQUssRUFBTCxLQUFLO0dBQ04sQ0FBQztDQUNIOztBQUVELFNBQVMsMEJBQTBCLENBQUMsTUFBTSxFQUFFO0FBQzFDLFNBQU87QUFDTCxXQUFPLEVBQUUsb0JBQW9CLENBQUMsTUFBTSxDQUFDO0FBQ3JDLGFBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVc7QUFDdkMsY0FBVSxFQUFFLE1BQU0sQ0FBQyxNQUFNO0FBQ3pCLFFBQUksRUFBRSxRQUFRO0dBQ2YsQ0FBQztDQUNIOztBQUVELFNBQVMseUJBQXlCLENBQUMsS0FBSyxFQUFFO0FBQ3hDLFNBQU87QUFDTCxRQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsYUFBUyxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ3JCLGNBQVUsRUFBRSxLQUFLLENBQUMsTUFBTTtBQUN4QixRQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsVUFBVTtHQUMvQyxDQUFDO0NBQ0g7O0FBRUQsU0FBUyxlQUFlLENBQUMsS0FBSyxFQUFFO0FBQzlCLFVBQVEsS0FBSyxDQUFDLEtBQUs7QUFDakIsU0FBSyxPQUFPO0FBQUUsYUFBTyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUFBLEFBQ3RELFNBQUssUUFBUTtBQUFFLGFBQU8sMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFBQSxBQUN4RCxTQUFLLE9BQU87QUFBRSxhQUFPLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQUEsQUFDdEQsU0FBSyxhQUFhO0FBQUUsYUFBTyxvQ0FBb0MsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUFBLEFBQ3ZFO0FBQ0UsYUFBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxhQUFPLEtBQUssQ0FBQztBQUFBLEdBQ2hCO0NBQ0Y7O1FBR0MsZUFBZSxHQUFmLGVBQWU7UUFDZixvQ0FBb0MsR0FBcEMsb0NBQW9DO1FBQ3BDLHlCQUF5QixHQUF6Qix5QkFBeUI7UUFDekIsMEJBQTBCLEdBQTFCLDBCQUEwQjtRQUMxQix5QkFBeUIsR0FBekIseUJBQXlCIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9saWIvbWFwcGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBkZW5hbWVzcGFjZSwgcGFja2FnaWZ5IH0gZnJvbSAnLi91dGlsJztcblxuZnVuY3Rpb24gbWV0aG9kRW50cnlUb1NuaXBwZXQoZW50cnkpIHtcbiAgY29uc3QgYXJncyA9IGVudHJ5LnNpZ25hdHVyZS5hcmd1bWVudHMgfHwgW107XG4gIGNvbnN0IG1hcEFyZyA9IChhcmcsIGluZGV4KSA9PiBgXFwkeyR7aW5kZXggKyAxfToke2RlbmFtZXNwYWNlKGFyZykucmVwbGFjZSgvXFwkLywgJy4nKX19YDtcbiAgcmV0dXJuIGAke2VudHJ5Lm5hbWV9KCR7YXJncy5tYXAobWFwQXJnKS5qb2luKCcsICcpfSlcXCQke2FyZ3MubGVuZ3RoICsgMX1gO1xufVxuXG5mdW5jdGlvbiBtYXBDbGFzc0VudHJ5VG9Db25zdHJ1Y3RvclN1Z2dlc3Rpb24oa2xhc3MpIHtcbiAgY29uc3QgY29uc3RydWN0b3JzID0ga2xhc3MubWV0aG9kcy5maWx0ZXIobWV0aG9kID0+IG1ldGhvZC5uYW1lID09PSAnPGluaXQ+Jyk7XG4gIHJldHVybiBjb25zdHJ1Y3RvcnNcbiAgICAubWFwKGNvbnN0cnVjdG9yID0+ICh7XG4gICAgICBzbmlwcGV0OiBtZXRob2RFbnRyeVRvU25pcHBldCh7IC4uLmNvbnN0cnVjdG9yLCBuYW1lOiBkZW5hbWVzcGFjZShrbGFzcy5uYW1lKSB9KSxcbiAgICAgIHJpZ2h0TGFiZWw6IHBhY2thZ2lmeShrbGFzcy5uYW1lKSxcbiAgICAgIGxlZnRMYWJlbDoga2xhc3MubmFtZSxcbiAgICAgIHR5cGU6ICdjbGFzcycsXG5cbiAgICAgIC8vIE5vdCBwYXJ0IG9mIGF1dG9jb21wbGV0ZS1hcGksIHBhc3NlZCBzbyB0aGF0IHRoZSBjbGFzc25hbWUgY2FuIGJlIGdpdmVuIHRvIGltcG9ydEhhbmRsZXIuXG4gICAgICBrbGFzc1xuICAgIH0pKTtcbn1cblxuZnVuY3Rpb24gbWFwQ2xhc3NFbnRyeVRvU3VnZ2VzdGlvbihrbGFzcykge1xuICByZXR1cm4ge1xuICAgIC8vIFRoZSBgdGV4dGAvYHNuaXBwZXRgIHRoaW5naWUgaGVyZSBpcyBxdWl0ZSBoYWNreS4gU25pcHBldCB3aWxsIGJlIGluc2VydGVkIGludG8gZWRpdG9yLlxuICAgIC8vIFNldHRpbmcgYHRleHRgIGFzIHRoZSBmdWxseSBxdWFsaWZpZWQgY2xhc3Mgd2lsbCBtYWtlIGFueSBkdXBsaWNhdGUgY2xhc3MgbmFtZXMsXG4gICAgLy8gYnV0IGZyb20gZGlmZmVyZW50IHBhY2thZ2VzIHNob3cgdXAgaW4gc3VnZ2VzdGlvbiBsaXN0LlxuICAgIC8vIElzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdXRvY29tcGxldGUtcGx1cy9pc3N1ZXMvNjE1XG4gICAgdGV4dDoga2xhc3MubmFtZSxcbiAgICBzbmlwcGV0OiBkZW5hbWVzcGFjZShrbGFzcy5uYW1lLnJlcGxhY2UoL1xcJC9nLCAnLicpKSxcbiAgICByaWdodExhYmVsOiBwYWNrYWdpZnkoa2xhc3MubmFtZSksXG4gICAgdHlwZTogJ2NsYXNzJyxcblxuICAgIC8vIE5vdCBwYXJ0IG9mIGF1dG9jb21wbGV0ZS1hcGksIHBhc3NlZCBzbyB0aGF0IHRoZSBjbGFzc25hbWUgY2FuIGJlIGdpdmVuIHRvIGltcG9ydEhhbmRsZXIuXG4gICAga2xhc3NcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFwTWV0aG9kRW50cnlUb1N1Z2dlc3Rpb24obWV0aG9kKSB7XG4gIHJldHVybiB7XG4gICAgc25pcHBldDogbWV0aG9kRW50cnlUb1NuaXBwZXQobWV0aG9kKSxcbiAgICBsZWZ0TGFiZWw6IG1ldGhvZC5zaWduYXR1cmUucmV0dXJuVmFsdWUsXG4gICAgcmlnaHRMYWJlbDogbWV0aG9kLm9yaWdpbixcbiAgICB0eXBlOiAnbWV0aG9kJ1xuICB9O1xufVxuXG5mdW5jdGlvbiBtYXBGaWVsZEVudHJ5VG9TdWdnZXN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiB7XG4gICAgdGV4dDogZmllbGQubmFtZSxcbiAgICBsZWZ0TGFiZWw6IGZpZWxkLnR5cGUsXG4gICAgcmlnaHRMYWJlbDogZmllbGQub3JpZ2luLFxuICAgIHR5cGU6IGZpZWxkLnZhcmlhYmxlID8gJ3ZhcmlhYmxlJyA6ICdjb25zdGFudCdcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFwVG9TdWdnZXN0aW9uKGVudHJ5KSB7XG4gIHN3aXRjaCAoZW50cnkuX3R5cGUpIHtcbiAgICBjYXNlICdjbGFzcyc6IHJldHVybiBtYXBDbGFzc0VudHJ5VG9TdWdnZXN0aW9uKGVudHJ5KTtcbiAgICBjYXNlICdtZXRob2QnOiByZXR1cm4gbWFwTWV0aG9kRW50cnlUb1N1Z2dlc3Rpb24oZW50cnkpO1xuICAgIGNhc2UgJ2ZpZWxkJzogcmV0dXJuIG1hcEZpZWxkRW50cnlUb1N1Z2dlc3Rpb24oZW50cnkpO1xuICAgIGNhc2UgJ2NvbnN0cnVjdG9yJzogcmV0dXJuIG1hcENsYXNzRW50cnlUb0NvbnN0cnVjdG9yU3VnZ2VzdGlvbihlbnRyeSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbnNvbGUud2FybignVW5rbm93biBtYXAgZW50cnk6JywgZW50cnkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIG1hcFRvU3VnZ2VzdGlvbixcbiAgbWFwQ2xhc3NFbnRyeVRvQ29uc3RydWN0b3JTdWdnZXN0aW9uLFxuICBtYXBDbGFzc0VudHJ5VG9TdWdnZXN0aW9uLFxuICBtYXBNZXRob2RFbnRyeVRvU3VnZ2VzdGlvbixcbiAgbWFwRmllbGRFbnRyeVRvU3VnZ2VzdGlvblxufTtcbiJdfQ==