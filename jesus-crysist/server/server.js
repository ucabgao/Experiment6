var http = require('http');
var fs = require('fs');
var config;

var testing_on = true; //Needed in order to export more stuff than needed for normal running of the server

function startServer(cfg) {
	config = cfg;
//	console.log(config);
	http.createServer(response).listen(cfg.port);
}

function response (req, res) {
	var folder, file, statusCode, path, fileExt, contType, fileBuff;
	
	folder = config.htmlFolder;
	file = resolveFile(req.url);
	
	while(true) {
	
		if (file) {
			statusCode = 200;
		} else {
			file = '404.html';
			statusCode = 404;
		}
	
		path = './' + folder + (folder.lastIndexOf('/') === folder.length-1 ? '' : '/') + file;
		fileExt = file.substring(file.lastIndexOf('.') + 1);
		contType = config.contentType[fileExt];
	
//		console.log(req.url, folder, file, fileExt, path, contType);
//		console.log('--------------');
	
		res.writeHead(statusCode, { 'Content-Type': contType });
	
		fileBuff = readFile(path);
		if (fileBuff) {
			res.write(fileBuff);
			break;
		} else {
			file = null;
		}
		
	}

//console.log(readFile(path));
	
	res.end();
}

function resolveFile(url) {
		
	var paths = config.paths,
		i, len, subpaths, j, sublen, path;
		
	url = url.substring(1);
		
	console.log('url', '"' + url + '"');
		
	for (i = 0, len = paths.length; i < len; i += 1){
		path = paths[i];
		subpaths = path.urls;
//			console.log(subpaths);
		
		for (j = 0, sublen = subpaths.length; j < sublen; j += 1) {
//			console.log(subpaths[j], subpaths[j] === url);
			if (subpaths[j] === url) {
//				console.log('match');
				return path.file;
			}
		}
	}
	
	return url;
}

function readFile(path) {
	return fs.readFileSync(path);
}

exports.start = startServer;

//Export the following only if the testing flag is on
if(testing_on) {
    exports.response_callback = response;
}
