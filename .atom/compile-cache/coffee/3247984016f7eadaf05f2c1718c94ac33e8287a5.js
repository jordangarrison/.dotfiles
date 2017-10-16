(function() {
  var crypto, fs, shasum;

  crypto = require('crypto');

  fs = require('fs');

  console.log("Let's hash these bugs out");

  shasum = crypto.createHash('sha1');

  shasum.update('I like it when you sum.');

  console.log(shasum.digest('hex'));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9leGFtcGxlcy9oYXNoaWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE9BQU8sQ0FBQyxHQUFSLENBQVksMkJBQVo7O0VBRUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE1BQWxCOztFQUNULE1BQU0sQ0FBQyxNQUFQLENBQWMseUJBQWQ7O0VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLEtBQWQsQ0FBWjtBQVBBIiwic291cmNlc0NvbnRlbnQiOlsiY3J5cHRvID0gcmVxdWlyZSAnY3J5cHRvJ1xuZnMgPSByZXF1aXJlICdmcydcblxuY29uc29sZS5sb2cgXCJMZXQncyBoYXNoIHRoZXNlIGJ1Z3Mgb3V0XCJcblxuc2hhc3VtID0gY3J5cHRvLmNyZWF0ZUhhc2ggJ3NoYTEnXG5zaGFzdW0udXBkYXRlICdJIGxpa2UgaXQgd2hlbiB5b3Ugc3VtLidcbmNvbnNvbGUubG9nIHNoYXN1bS5kaWdlc3QgJ2hleCdcbiJdfQ==
