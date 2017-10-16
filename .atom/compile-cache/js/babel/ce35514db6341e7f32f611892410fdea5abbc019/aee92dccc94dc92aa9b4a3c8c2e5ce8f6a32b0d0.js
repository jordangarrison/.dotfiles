var _libUtil = require('../lib/util');

'use babel';

describe('Util', function () {
  describe('extractDotChain', function () {
    it('should extract plain variables when there are spaces to previous token', function () {
      expect((0, _libUtil.extractDotChain)('return variable')).toEqual('variable');
    });

    it('should extract members of plain variables when there are spaces to previous token', function () {
      expect((0, _libUtil.extractDotChain)('return variable.method')).toEqual('variable.method');
    });

    it('should extract plain method calls when there are spaces to previous token', function () {
      expect((0, _libUtil.extractDotChain)('return someMethod()')).toEqual('someMethod()');
    });

    it('should extract member method calls when there are spaces to previous token', function () {
      expect((0, _libUtil.extractDotChain)('return variable.method()')).toEqual('variable.method()');
    });

    it('should extract methods with quoted arguments', function () {
      expect((0, _libUtil.extractDotChain)('return variable.method("string")')).toEqual('variable.method("string")');
    });

    it('should extract methods with dotted arguments', function () {
      expect((0, _libUtil.extractDotChain)('return variable.method(Domain.Namespace.Class.method())')).toEqual('variable.method(Domain.Namespace.Class.method())');
    });

    it('should extract when there are newlines', function () {
      expect((0, _libUtil.extractDotChain)('return\nvariable\n.method("string",\nAnother.arg.methodCall())')).toEqual('variable.method("string",Another.arg.methodCall())');
    });

    it('should extract with multiple whitespaces combined', function () {
      expect((0, _libUtil.extractDotChain)('variable\n.argument.\nother\n\n\n\n       . deep')).toEqual('variable.argument.other.deep');
    });

    it('should extract when there\'s very compact code', function () {
      expect((0, _libUtil.extractDotChain)('int a=5;variable.methodCall().otherThing')).toEqual('variable.methodCall().otherThing');
    });

    it('should extract the first statement of a method', function () {
      expect((0, _libUtil.extractDotChain)('public void m(Root.Class somearg) {\n return someVariable.result()')).toEqual('someVariable.result()');
    });

    it('should extract the first statement of a method even if very compact code', function () {
      expect((0, _libUtil.extractDotChain)('public void method(){somevariable.method()')).toEqual('somevariable.method()');
    });

    it('should extract nested completions', function () {
      expect((0, _libUtil.extractDotChain)('someMethodCall(Root.completion.other("args")')).toEqual('Root.completion.other("args")');
    });

    it('should ignore escaped quotes in quotes', function () {
      expect((0, _libUtil.extractDotChain)('var.someMethodCall(" \\"quote me\\" ")')).toEqual('var.someMethodCall(" \\"quote me\\" ")');
    });

    it('should extract keyword new and constructor', function () {
      expect((0, _libUtil.extractDotChain)('new Constructor("some argument").someMethod()')).toEqual('new Constructor("some argument").someMethod()');
    });
  });

  describe('parseDotChain', function () {
    it('should split on dots between static classes', function () {
      expect((0, _libUtil.parseDotChain)('Root.Class.NestedClass')).toEqual(['Root', 'Class', 'NestedClass']);
    });

    it('should parse an empty string if code ends with a dot', function () {
      expect((0, _libUtil.parseDotChain)('Root.')).toEqual(['Root', '']);
    });

    it('should work with no-args method calls', function () {
      expect((0, _libUtil.parseDotChain)('Root.method().Class')).toEqual(['Root', 'method()', 'Class']);
    });

    it('should work with arguments in method calls', function () {
      expect((0, _libUtil.parseDotChain)('Root.method(someArgument).Class')).toEqual(['Root', 'method(someArgument)', 'Class']);

      expect((0, _libUtil.parseDotChain)('Root.method(arg1, arg2).Class')).toEqual(['Root', 'method(arg1, arg2)', 'Class']);
    });

    it('should work with quoted arguments', function () {
      expect((0, _libUtil.parseDotChain)('Root.method("this arg").Class')).toEqual(['Root', 'method("this arg")', 'Class']);

      expect((0, _libUtil.parseDotChain)('Root.method("this.arg").Class')).toEqual(['Root', 'method("this.arg")', 'Class']);

      expect((0, _libUtil.parseDotChain)('Root.method("this.arg", Some.Dotted.Path).Class')).toEqual(['Root', 'method("this.arg", Some.Dotted.Path)', 'Class']);

      expect((0, _libUtil.parseDotChain)('Root.method("quoted\\"escaped(").Class')).toEqual(['Root', 'method("quoted\\"escaped(")', 'Class']);
    });

    it('should work with lambdas', function () {
      expect((0, _libUtil.parseDotChain)('Root.method(someArg -> someArg.doStuff())')).toEqual(['Root', 'method(someArg -> someArg.doStuff())']);
    });

    it('should work with contructors', function () {
      expect((0, _libUtil.parseDotChain)('new Constructor().someMethod()')).toEqual(['new Constructor()', 'someMethod()']);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9zcGVjL3V0aWwtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoidUJBRStDLGFBQWE7O0FBRjVELFdBQVcsQ0FBQzs7QUFJWixRQUFRLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDckIsVUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07QUFDaEMsTUFBRSxDQUFDLHdFQUF3RSxFQUFFLFlBQU07QUFDakYsWUFBTSxDQUFDLDhCQUFnQixpQkFBaUIsQ0FBQyxDQUFDLENBQ3ZDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLG1GQUFtRixFQUFFLFlBQU07QUFDNUYsWUFBTSxDQUFDLDhCQUFnQix3QkFBd0IsQ0FBQyxDQUFDLENBQzlDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQy9CLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMkVBQTJFLEVBQUUsWUFBTTtBQUNwRixZQUFNLENBQUMsOEJBQWdCLHFCQUFxQixDQUFDLENBQUMsQ0FDM0MsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzVCLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsNEVBQTRFLEVBQUUsWUFBTTtBQUNyRixZQUFNLENBQUMsOEJBQWdCLDBCQUEwQixDQUFDLENBQUMsQ0FDaEQsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDakMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw4Q0FBOEMsRUFBRSxZQUFNO0FBQ3ZELFlBQU0sQ0FBQyw4QkFBZ0Isa0NBQWtDLENBQUMsQ0FBQyxDQUN4RCxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztLQUN6QyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDhDQUE4QyxFQUFFLFlBQU07QUFDdkQsWUFBTSxDQUFDLDhCQUFnQix5REFBeUQsQ0FBQyxDQUFDLENBQy9FLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0tBQ2hFLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsd0NBQXdDLEVBQUUsWUFBTTtBQUNqRCxZQUFNLENBQUMsOEJBQWdCLGdFQUFnRSxDQUFDLENBQUMsQ0FDdEYsT0FBTyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7S0FDbEUsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxtREFBbUQsRUFBRSxZQUFNO0FBQzVELFlBQU0sQ0FBQyw4QkFBZ0Isa0RBQWtELENBQUMsQ0FBQyxDQUN4RSxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztLQUM1QyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLGdEQUFnRCxFQUFFLFlBQU07QUFDekQsWUFBTSxDQUFDLDhCQUFnQiwwQ0FBMEMsQ0FBQyxDQUFDLENBQ2hFLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0tBQ2hELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsZ0RBQWdELEVBQUUsWUFBTTtBQUN6RCxZQUFNLENBQUMsOEJBQWdCLG9FQUFvRSxDQUFDLENBQUMsQ0FDMUYsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDckMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwRUFBMEUsRUFBRSxZQUFNO0FBQ25GLFlBQU0sQ0FBQyw4QkFBZ0IsNENBQTRDLENBQUMsQ0FBQyxDQUNsRSxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNyQyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLG1DQUFtQyxFQUFFLFlBQU07QUFDNUMsWUFBTSxDQUFDLDhCQUFnQiw4Q0FBOEMsQ0FBQyxDQUFDLENBQ3BFLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQzdDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsd0NBQXdDLEVBQUUsWUFBTTtBQUNqRCxZQUFNLENBQUMsOEJBQWdCLHdDQUF3QyxDQUFDLENBQUMsQ0FDOUQsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7S0FDdEQsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw0Q0FBNEMsRUFBRSxZQUFNO0FBQ3JELFlBQU0sQ0FBQyw4QkFBZ0IsK0NBQStDLENBQUMsQ0FBQyxDQUNyRSxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztLQUM3RCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQzlCLE1BQUUsQ0FBQyw2Q0FBNkMsRUFBRSxZQUFNO0FBQ3RELFlBQU0sQ0FBQyw0QkFBYyx3QkFBd0IsQ0FBQyxDQUFDLENBQzVDLE9BQU8sQ0FBQyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFFLENBQUMsQ0FBQztLQUNoRCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHNEQUFzRCxFQUFFLFlBQU07QUFDL0QsWUFBTSxDQUFDLDRCQUFjLE9BQU8sQ0FBQyxDQUFDLENBQzNCLE9BQU8sQ0FBQyxDQUFFLE1BQU0sRUFBRSxFQUFFLENBQUUsQ0FBQyxDQUFDO0tBQzVCLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsdUNBQXVDLEVBQUUsWUFBTTtBQUNoRCxZQUFNLENBQUMsNEJBQWMscUJBQXFCLENBQUMsQ0FBQyxDQUN6QyxPQUFPLENBQUMsQ0FBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBRSxDQUFDLENBQUM7S0FDN0MsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw0Q0FBNEMsRUFBRSxZQUFNO0FBQ3JELFlBQU0sQ0FBQyw0QkFBYyxpQ0FBaUMsQ0FBQyxDQUFDLENBQ3JELE9BQU8sQ0FBQyxDQUFFLE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxPQUFPLENBQUUsQ0FBQyxDQUFDOztBQUV4RCxZQUFNLENBQUMsNEJBQWMsK0JBQStCLENBQUMsQ0FBQyxDQUNuRCxPQUFPLENBQUMsQ0FBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsT0FBTyxDQUFFLENBQUMsQ0FBQztLQUN2RCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLG1DQUFtQyxFQUFFLFlBQU07QUFDNUMsWUFBTSxDQUFDLDRCQUFjLCtCQUErQixDQUFDLENBQUMsQ0FDbkQsT0FBTyxDQUFDLENBQUUsTUFBTSxFQUFFLG9CQUFvQixFQUFFLE9BQU8sQ0FBRSxDQUFDLENBQUM7O0FBRXRELFlBQU0sQ0FBQyw0QkFBYywrQkFBK0IsQ0FBQyxDQUFDLENBQ25ELE9BQU8sQ0FBQyxDQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxPQUFPLENBQUUsQ0FBQyxDQUFDOztBQUV0RCxZQUFNLENBQUMsNEJBQWMsaURBQWlELENBQUMsQ0FBQyxDQUNyRSxPQUFPLENBQUMsQ0FBRSxNQUFNLEVBQUUsc0NBQXNDLEVBQUUsT0FBTyxDQUFFLENBQUMsQ0FBQzs7QUFFeEUsWUFBTSxDQUFDLDRCQUFjLHdDQUF3QyxDQUFDLENBQUMsQ0FDNUQsT0FBTyxDQUFDLENBQUUsTUFBTSxFQUFFLDZCQUE2QixFQUFFLE9BQU8sQ0FBRSxDQUFDLENBQUM7S0FDaEUsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwQkFBMEIsRUFBRSxZQUFNO0FBQ25DLFlBQU0sQ0FBQyw0QkFBYywyQ0FBMkMsQ0FBQyxDQUFDLENBQy9ELE9BQU8sQ0FBQyxDQUFFLE1BQU0sRUFBRSxzQ0FBc0MsQ0FBRSxDQUFDLENBQUM7S0FDaEUsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFNO0FBQ3ZDLFlBQU0sQ0FBQyw0QkFBYyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQ3BELE9BQU8sQ0FBQyxDQUFFLG1CQUFtQixFQUFFLGNBQWMsQ0FBRSxDQUFDLENBQUM7S0FDckQsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtamF2YS1taW51cy9zcGVjL3V0aWwtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBleHRyYWN0RG90Q2hhaW4sIHBhcnNlRG90Q2hhaW4gfSBmcm9tICcuLi9saWIvdXRpbCc7XG5cbmRlc2NyaWJlKCdVdGlsJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZXh0cmFjdERvdENoYWluJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZXh0cmFjdCBwbGFpbiB2YXJpYWJsZXMgd2hlbiB0aGVyZSBhcmUgc3BhY2VzIHRvIHByZXZpb3VzIHRva2VuJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV4dHJhY3REb3RDaGFpbigncmV0dXJuIHZhcmlhYmxlJykpXG4gICAgICAgIC50b0VxdWFsKCd2YXJpYWJsZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IG1lbWJlcnMgb2YgcGxhaW4gdmFyaWFibGVzIHdoZW4gdGhlcmUgYXJlIHNwYWNlcyB0byBwcmV2aW91cyB0b2tlbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChleHRyYWN0RG90Q2hhaW4oJ3JldHVybiB2YXJpYWJsZS5tZXRob2QnKSlcbiAgICAgICAgLnRvRXF1YWwoJ3ZhcmlhYmxlLm1ldGhvZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IHBsYWluIG1ldGhvZCBjYWxscyB3aGVuIHRoZXJlIGFyZSBzcGFjZXMgdG8gcHJldmlvdXMgdG9rZW4nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXh0cmFjdERvdENoYWluKCdyZXR1cm4gc29tZU1ldGhvZCgpJykpXG4gICAgICAgIC50b0VxdWFsKCdzb21lTWV0aG9kKCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZXh0cmFjdCBtZW1iZXIgbWV0aG9kIGNhbGxzIHdoZW4gdGhlcmUgYXJlIHNwYWNlcyB0byBwcmV2aW91cyB0b2tlbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChleHRyYWN0RG90Q2hhaW4oJ3JldHVybiB2YXJpYWJsZS5tZXRob2QoKScpKVxuICAgICAgICAudG9FcXVhbCgndmFyaWFibGUubWV0aG9kKCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZXh0cmFjdCBtZXRob2RzIHdpdGggcXVvdGVkIGFyZ3VtZW50cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChleHRyYWN0RG90Q2hhaW4oJ3JldHVybiB2YXJpYWJsZS5tZXRob2QoXCJzdHJpbmdcIiknKSlcbiAgICAgICAgLnRvRXF1YWwoJ3ZhcmlhYmxlLm1ldGhvZChcInN0cmluZ1wiKScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IG1ldGhvZHMgd2l0aCBkb3R0ZWQgYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV4dHJhY3REb3RDaGFpbigncmV0dXJuIHZhcmlhYmxlLm1ldGhvZChEb21haW4uTmFtZXNwYWNlLkNsYXNzLm1ldGhvZCgpKScpKVxuICAgICAgICAudG9FcXVhbCgndmFyaWFibGUubWV0aG9kKERvbWFpbi5OYW1lc3BhY2UuQ2xhc3MubWV0aG9kKCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4dHJhY3Qgd2hlbiB0aGVyZSBhcmUgbmV3bGluZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXh0cmFjdERvdENoYWluKCdyZXR1cm5cXG52YXJpYWJsZVxcbi5tZXRob2QoXCJzdHJpbmdcIixcXG5Bbm90aGVyLmFyZy5tZXRob2RDYWxsKCkpJykpXG4gICAgICAgIC50b0VxdWFsKCd2YXJpYWJsZS5tZXRob2QoXCJzdHJpbmdcIixBbm90aGVyLmFyZy5tZXRob2RDYWxsKCkpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4dHJhY3Qgd2l0aCBtdWx0aXBsZSB3aGl0ZXNwYWNlcyBjb21iaW5lZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChleHRyYWN0RG90Q2hhaW4oJ3ZhcmlhYmxlXFxuLmFyZ3VtZW50Llxcbm90aGVyXFxuXFxuXFxuXFxuICAgICAgIC4gZGVlcCcpKVxuICAgICAgICAudG9FcXVhbCgndmFyaWFibGUuYXJndW1lbnQub3RoZXIuZGVlcCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IHdoZW4gdGhlcmVcXCdzIHZlcnkgY29tcGFjdCBjb2RlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV4dHJhY3REb3RDaGFpbignaW50IGE9NTt2YXJpYWJsZS5tZXRob2RDYWxsKCkub3RoZXJUaGluZycpKVxuICAgICAgICAudG9FcXVhbCgndmFyaWFibGUubWV0aG9kQ2FsbCgpLm90aGVyVGhpbmcnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZXh0cmFjdCB0aGUgZmlyc3Qgc3RhdGVtZW50IG9mIGEgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV4dHJhY3REb3RDaGFpbigncHVibGljIHZvaWQgbShSb290LkNsYXNzIHNvbWVhcmcpIHtcXG4gcmV0dXJuIHNvbWVWYXJpYWJsZS5yZXN1bHQoKScpKVxuICAgICAgICAudG9FcXVhbCgnc29tZVZhcmlhYmxlLnJlc3VsdCgpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4dHJhY3QgdGhlIGZpcnN0IHN0YXRlbWVudCBvZiBhIG1ldGhvZCBldmVuIGlmIHZlcnkgY29tcGFjdCBjb2RlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV4dHJhY3REb3RDaGFpbigncHVibGljIHZvaWQgbWV0aG9kKCl7c29tZXZhcmlhYmxlLm1ldGhvZCgpJykpXG4gICAgICAgIC50b0VxdWFsKCdzb21ldmFyaWFibGUubWV0aG9kKCknKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZXh0cmFjdCBuZXN0ZWQgY29tcGxldGlvbnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXh0cmFjdERvdENoYWluKCdzb21lTWV0aG9kQ2FsbChSb290LmNvbXBsZXRpb24ub3RoZXIoXCJhcmdzXCIpJykpXG4gICAgICAgIC50b0VxdWFsKCdSb290LmNvbXBsZXRpb24ub3RoZXIoXCJhcmdzXCIpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGlnbm9yZSBlc2NhcGVkIHF1b3RlcyBpbiBxdW90ZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXh0cmFjdERvdENoYWluKCd2YXIuc29tZU1ldGhvZENhbGwoXCIgXFxcXFwicXVvdGUgbWVcXFxcXCIgXCIpJykpXG4gICAgICAgIC50b0VxdWFsKCd2YXIuc29tZU1ldGhvZENhbGwoXCIgXFxcXFwicXVvdGUgbWVcXFxcXCIgXCIpJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4dHJhY3Qga2V5d29yZCBuZXcgYW5kIGNvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGV4dHJhY3REb3RDaGFpbignbmV3IENvbnN0cnVjdG9yKFwic29tZSBhcmd1bWVudFwiKS5zb21lTWV0aG9kKCknKSlcbiAgICAgICAgLnRvRXF1YWwoJ25ldyBDb25zdHJ1Y3RvcihcInNvbWUgYXJndW1lbnRcIikuc29tZU1ldGhvZCgpJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZURvdENoYWluJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3BsaXQgb24gZG90cyBiZXR3ZWVuIHN0YXRpYyBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBhcnNlRG90Q2hhaW4oJ1Jvb3QuQ2xhc3MuTmVzdGVkQ2xhc3MnKSlcbiAgICAgICAgLnRvRXF1YWwoWyAnUm9vdCcsICdDbGFzcycsICdOZXN0ZWRDbGFzcycgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGFuIGVtcHR5IHN0cmluZyBpZiBjb2RlIGVuZHMgd2l0aCBhIGRvdCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCdSb290LicpKVxuICAgICAgICAudG9FcXVhbChbICdSb290JywgJycgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBuby1hcmdzIG1ldGhvZCBjYWxscycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCdSb290Lm1ldGhvZCgpLkNsYXNzJykpXG4gICAgICAgIC50b0VxdWFsKFsgJ1Jvb3QnLCAnbWV0aG9kKCknLCAnQ2xhc3MnIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggYXJndW1lbnRzIGluIG1ldGhvZCBjYWxscycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCdSb290Lm1ldGhvZChzb21lQXJndW1lbnQpLkNsYXNzJykpXG4gICAgICAgIC50b0VxdWFsKFsgJ1Jvb3QnLCAnbWV0aG9kKHNvbWVBcmd1bWVudCknLCAnQ2xhc3MnIF0pO1xuXG4gICAgICBleHBlY3QocGFyc2VEb3RDaGFpbignUm9vdC5tZXRob2QoYXJnMSwgYXJnMikuQ2xhc3MnKSlcbiAgICAgICAgLnRvRXF1YWwoWyAnUm9vdCcsICdtZXRob2QoYXJnMSwgYXJnMiknLCAnQ2xhc3MnIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggcXVvdGVkIGFyZ3VtZW50cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCdSb290Lm1ldGhvZChcInRoaXMgYXJnXCIpLkNsYXNzJykpXG4gICAgICAgIC50b0VxdWFsKFsgJ1Jvb3QnLCAnbWV0aG9kKFwidGhpcyBhcmdcIiknLCAnQ2xhc3MnIF0pO1xuXG4gICAgICBleHBlY3QocGFyc2VEb3RDaGFpbignUm9vdC5tZXRob2QoXCJ0aGlzLmFyZ1wiKS5DbGFzcycpKVxuICAgICAgICAudG9FcXVhbChbICdSb290JywgJ21ldGhvZChcInRoaXMuYXJnXCIpJywgJ0NsYXNzJyBdKTtcblxuICAgICAgZXhwZWN0KHBhcnNlRG90Q2hhaW4oJ1Jvb3QubWV0aG9kKFwidGhpcy5hcmdcIiwgU29tZS5Eb3R0ZWQuUGF0aCkuQ2xhc3MnKSlcbiAgICAgICAgLnRvRXF1YWwoWyAnUm9vdCcsICdtZXRob2QoXCJ0aGlzLmFyZ1wiLCBTb21lLkRvdHRlZC5QYXRoKScsICdDbGFzcycgXSk7XG5cbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCdSb290Lm1ldGhvZChcInF1b3RlZFxcXFxcImVzY2FwZWQoXCIpLkNsYXNzJykpXG4gICAgICAgIC50b0VxdWFsKFsgJ1Jvb3QnLCAnbWV0aG9kKFwicXVvdGVkXFxcXFwiZXNjYXBlZChcIiknLCAnQ2xhc3MnIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggbGFtYmRhcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCdSb290Lm1ldGhvZChzb21lQXJnIC0+IHNvbWVBcmcuZG9TdHVmZigpKScpKVxuICAgICAgICAudG9FcXVhbChbICdSb290JywgJ21ldGhvZChzb21lQXJnIC0+IHNvbWVBcmcuZG9TdHVmZigpKScgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBjb250cnVjdG9ycycsICgpID0+IHtcbiAgICAgIGV4cGVjdChwYXJzZURvdENoYWluKCduZXcgQ29uc3RydWN0b3IoKS5zb21lTWV0aG9kKCknKSlcbiAgICAgICAgLnRvRXF1YWwoWyAnbmV3IENvbnN0cnVjdG9yKCknLCAnc29tZU1ldGhvZCgpJyBdKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==