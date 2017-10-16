(function() {
  var Disposable, Server, fs, http, path, ws,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  http = require('http');

  ws = require('ws');

  fs = require('fs');

  path = require('path');

  module.exports = Server = (function(superClass) {
    extend(Server, superClass);

    function Server(latex) {
      this.latex = latex;
      this.http = http.createServer((function(_this) {
        return function(req, res) {
          return _this.httpHandler(req, res);
        };
      })(this));
      this.httpRoot = (path.dirname(__filename)) + "/../viewer";
      this.listen = new Promise((function(_this) {
        return function(c, e) {
          return _this.http.listen(0, 'localhost', void 0, function(err) {
            if (err) {
              return e(err);
            } else if (_this.latex.server.openTab) {
              return _this.latex.viewer.openViewerNewWindow();
            }
          });
        };
      })(this));
      this.ws = ws.createServer({
        server: this.http
      });
      this.ws.on("connection", (function(_this) {
        return function(ws) {
          ws.on("message", function(msg) {
            return _this.latex.viewer.wsHandler(ws, msg);
          });
          return ws.on("close", function() {
            return _this.latex.viewer.wsHandler(ws, '{"type":"close"}');
          });
        };
      })(this));
    }

    Server.prototype.httpHandler = function(request, response) {
      var contentType, file, pdfPath, pdfSize;
      if (request.url.indexOf('viewer.html') > -1) {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.end(fs.readFileSync(this.httpRoot + "/viewer.html"), 'utf-8');
        return;
      }
      if (request.url.indexOf('preview.pdf') > -1) {
        if (!this.latex.manager.findMain()) {
          response.writeHead(404);
          response.end();
          return;
        }
        pdfPath = (this.latex.mainFile.substr(0, this.latex.mainFile.lastIndexOf('.'))) + ".pdf";
        pdfSize = fs.statSync(pdfPath).size;
        response.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfSize
        });
        fs.createReadStream(pdfPath).pipe(response);
        return;
      }
      file = path.join(this.httpRoot, request.url.split('?')[0]);
      switch (path.extname(file)) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
        default:
          contentType = 'text/html';
      }
      return fs.readFile(file, function(err, content) {
        if (err) {
          if (err.code === 'ENOENT') {
            response.writeHead(404);
          } else {
            response.writeHead(500);
          }
          return response.end();
        } else {
          response.writeHead(200, {
            'Content-Type': contentType
          });
          return response.end(content, 'utf-8');
        }
      });
    };

    return Server;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7OztFQUFFLGFBQWUsT0FBQSxDQUFRLE1BQVI7O0VBQ2pCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDUyxnQkFBQyxLQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUVULElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTSxHQUFOO2lCQUFjLEtBQUMsQ0FBQSxXQUFELENBQWEsR0FBYixFQUFrQixHQUFsQjtRQUFkO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQjtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQWdCLENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLENBQUQsQ0FBQSxHQUEwQjtNQUMxQyxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFELEVBQUksQ0FBSjtpQkFDcEIsS0FBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsQ0FBYixFQUFnQixXQUFoQixFQUE2QixNQUE3QixFQUF3QyxTQUFDLEdBQUQ7WUFDdEMsSUFBRyxHQUFIO3FCQUNFLENBQUEsQ0FBRSxHQUFGLEVBREY7YUFBQSxNQUVLLElBQUcsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBakI7cUJBQ0gsS0FBQyxDQUFBLEtBQUssQ0FB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SUFBSixLQUFZLFFBQWY7WUFDRSxRQUFRLENBQUMsU0FBVCxDQUFtQixHQUFuQixFQURGO1dBQUEsTUFBQTtZQUdFLFFBQVEsQ0FBQyxTQUFULENBQW1CLEdBQW5CLEVBSEY7O2lCQUlBLFFBQVEsQ0FBQyxHQUFULENBQUEsRUFMRjtTQUFBLE1BQUE7VUFPRSxRQUFRLENBQUMsU0FBVCxDQUFtQixHQUFuQixFQUF3QjtZQUFBLGNBQUEsRUFBZ0IsV0FBaEI7V0FBeEI7aUJBQ0EsUUFBUSxDQUFDLEdBQVQsQ0FBYSxPQUFiLEVBQXNCLE9BQXRCLEVBUkY7O01BRGdCLENBQWxCO0lBcENXOzs7O0tBbEJNO0FBUHJCIiwic291cmNlc0NvbnRlbnQiOlsieyBEaXNwb3NhYmxlIH0gPSByZXF1aXJlICdhdG9tJ1xuaHR0cCA9IHJlcXVpcmUgJ2h0dHAnXG53cyA9IHJlcXVpcmUgJ3dzJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTZXJ2ZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gIGNvbnN0cnVjdG9yOiAobGF0ZXgpIC0+XG4gICAgQGxhdGV4ID0gbGF0ZXhcblxuICAgIEBodHRwID0gaHR0cC5jcmVhdGVTZXJ2ZXIgKHJlcSwgcmVzKSA9PiBAaHR0cEhhbmRsZXIocmVxLCByZXMpXG4gICAgQGh0dHBSb290ID0gXCJcIlwiI3twYXRoLmRpcm5hbWUoX19maWxlbmFtZSl9Ly4uL3ZpZXdlclwiXCJcIlxuICAgIEBsaXN0ZW4gPSBuZXcgUHJvbWlzZSAoYywgZSkgPT5cbiAgICAgIEBodHRwLmxpc3RlbiAwLCAnbG9jYWxob3N0JywgdW5kZWZpbmVkLCAoZXJyKSA9PlxuICAgICAgICBpZiBlcnJcbiAgICAgICAgICBlKGVycilcbiAgICAgICAgZWxzZSBpZiBAbGF0ZXguc2VydmVyLm9wZW5UYWJcbiAgICAgICAgICBAbGF0ZXgudmlld2VyLm9wZW5WaWV3ZXJOZXdXaW5kb3coKVxuXG4gICAgQHdzID0gd3MuY3JlYXRlU2VydmVyIHNlcnZlcjogQGh0dHBcbiAgICBAd3Mub24gXCJjb25uZWN0aW9uXCIsICh3cykgPT5cbiAgICAgIHdzLm9uIFwibWVzc2FnZVwiLCAobXNnKSA9PiBAbGF0ZXgudmlld2VyLndzSGFuZGxlcih3cywgbXNnKVxuICAgICAgd3Mub24gXCJjbG9zZVwiLCAoKSA9PiBAbGF0ZXgudmlld2VyLndzSGFuZGxlcih3cywgJ3tcInR5cGVcIjpcImNsb3NlXCJ9JylcblxuICBodHRwSGFuZGxlcjogKHJlcXVlc3QsIHJlc3BvbnNlKSAtPlxuICAgIGlmIHJlcXVlc3QudXJsLmluZGV4T2YoJ3ZpZXdlci5odG1sJykgPiAtMVxuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2h0bWwnXG4gICAgICByZXNwb25zZS5lbmQgZnMucmVhZEZpbGVTeW5jKFwiXCJcIiN7QGh0dHBSb290fS92aWV3ZXIuaHRtbFwiXCJcIiksICd1dGYtOCdcbiAgICAgIHJldHVyblxuXG4gICAgaWYgcmVxdWVzdC51cmwuaW5kZXhPZigncHJldmlldy5wZGYnKSA+IC0xXG4gICAgICBpZiAhQGxhdGV4Lm1hbmFnZXIuZmluZE1haW4oKVxuICAgICAgICByZXNwb25zZS53cml0ZUhlYWQgNDA0XG4gICAgICAgIHJlc3BvbnNlLmVuZCgpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBwZGZQYXRoID0gXCJcIlwiI3tAbGF0ZXgubWFpbkZpbGUuc3Vic3RyKFxuICAgICAgICAwLCBAbGF0ZXgubWFpbkZpbGUubGFzdEluZGV4T2YoJy4nKSl9LnBkZlwiXCJcIlxuICAgICAgcGRmU2l6ZSA9IGZzLnN0YXRTeW5jKHBkZlBhdGgpLnNpemVcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vcGRmJyxcbiAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogcGRmU2l6ZVxuICAgICAgZnMuY3JlYXRlUmVhZFN0cmVhbShwZGZQYXRoKS5waXBlKHJlc3BvbnNlKVxuICAgICAgcmV0dXJuXG5cbiAgICBmaWxlID0gcGF0aC5qb2luIEBodHRwUm9vdCwgcmVxdWVzdC51cmwuc3BsaXQoJz8nKVswXVxuICAgIHN3aXRjaCBwYXRoLmV4dG5hbWUoZmlsZSlcbiAgICAgIHdoZW4gJy5qcydcbiAgICAgICAgY29udGVudFR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgICAgd2hlbiAnLmNzcydcbiAgICAgICAgY29udGVudFR5cGUgPSAndGV4dC9jc3MnXG4gICAgICB3aGVuICcuanNvbidcbiAgICAgICAgY29udGVudFR5cGUgPSAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIHdoZW4gJy5wbmcnXG4gICAgICAgIGNvbnRlbnRUeXBlID0gJ2ltYWdlL3BuZydcbiAgICAgIHdoZW4gJy5qcGcnXG4gICAgICAgIGNvbnRlbnRUeXBlID0gJ2ltYWdlL2pwZydcbiAgICAgIGVsc2VcbiAgICAgICAgY29udGVudFR5cGUgPSAndGV4dC9odG1sJ1xuXG4gICAgZnMucmVhZEZpbGUgZmlsZSwgKGVyciwgY29udGVudCkgLT5cbiAgICAgIGlmIGVyclxuICAgICAgICBpZiBlcnIuY29kZSA9PSAnRU5PRU5UJ1xuICAgICAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCA0MDRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCA1MDBcbiAgICAgICAgcmVzcG9uc2UuZW5kKClcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgJ0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlXG4gICAgICAgIHJlc3BvbnNlLmVuZCBjb250ZW50LCAndXRmLTgnXG4iXX0=
