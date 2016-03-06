var server = require('./server');
//var router = require('./router');
var config = require('./config');

var cfg = config.config;

if (!cfg.port) {
	cfg.port = 8000;
}

server.start(cfg);

console.log('Server started on port ' + cfg.port);
