var fs = require("fs");
var url = require("url");
var jade = require("jade");
var connect = require("connect");

connect.createServer(function(req, res){
    var request = url.parse(req.url, false);
    var filename = request.pathname.slice(1);

    if (request.pathname == "/") {
        filename = "index.html";
    }

	console.log("Serving request: " + request.pathname + " => " + filename);

    var contentType = "text/plain";
    var cache = false;

    var pathToRead;

	if (filename.match(".js$")) {
		contentType = "text/javascript";
        pathToRead = "static/" + filename;
	} else if (filename.match(".html$")) {
		contentType = "text/html";
        pathToRead = "static/" + filename;
	} else if (filename.match(".png$")) {
		contentType = "image/png";
        pathToRead = "static/" + filename;
        cache = true;
	} else if (filename.match(".jpg$")) {
		contentType = "image/jpg";
        pathToRead = "static/" + filename;
        cache = true;
	} else if (filename.match(".css$")) {
		contentType = "text/css";
        pathToRead = "static/" + filename;
	} else if (filename.match(".jade$")) {
        contentType = "text/plain";
        pathToRead = "jade/" + filename;
    }

	try {
		fs.realpathSync(pathToRead);
	} catch (e) {
		res.writeHead(404);
		res.end();
	}

	fs.readFile(pathToRead, function(err, data) {
		if (err) {
			res.writeHead(500);
			res.end();
			return;
		}

        if (cache == true) {
		    res.writeHead(200, {"Content-Type": contentType, "Cache-Control": "public, max-age=31557600"});
        } else {
            res.writeHead(200, {"Content-Type": contentType});
        }

		res.write(data);
		res.end();
	});
}).listen(8080);