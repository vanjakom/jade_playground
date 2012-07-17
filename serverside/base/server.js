var fs = require("fs");
var url = require("url");
var jade = require("jade");
var connect = require("connect");

connect.createServer(function(req, res){
    var request = url.parse(req.url, false);
    var filename = request.pathname.slice(1);

    if (request.pathname == '/') {
        filename = 'index.html';
    }

	console.log("Serving request: " + request.pathname + " => " + filename);

    var jadeFilename = "jade/" + filename.slice(0, filename.lastIndexOf(".")) + ".jade";

    console.log("Serving jade file: " + jadeFilename);

	try {
		fs.realpathSync(jadeFilename);
	} catch (e) {
		res.writeHead(404);
		res.end();
	}

	fs.readFile(jadeFilename, function(err, data) {
		if (err) {
            console.log(err);
			res.writeHead(500);
			res.end();
			return;
		}

        res.writeHead(200, {"Content-Type": "text/html"});

        var fn = jade.compile(data);
        var html = fn({});

		res.write(html);
		res.end();
	});
}).listen(8080);