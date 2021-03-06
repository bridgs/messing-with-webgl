//configure requirejs
var requirejs = require('requirejs');
requirejs.config({
	baseUrl: __dirname + '/javascripts/server',
	paths: {
		'shared': '../shared'
	},
	nodeRequire: require
});
require = requirejs;

//create web server
var express = require('express');
var app = express();
//hosted directories
app.use(express.static(__dirname + '/web'));
app.use('/javascripts/client', express.static(__dirname + '/javascripts/client'));
app.use('/javascripts/shared', express.static(__dirname + '/javascripts/shared'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/shaders', express.static(__dirname + '/shaders'));
app.use('/img', express.static(__dirname + '/img'));
//hosted files
app.get('/lib/noisejs.js', function(req, res) { res.sendFile(__dirname + '/node_modules/noisejs/index.js'); });
app.get('/lib/require.js', function(req, res) { res.sendFile(__dirname + '/node_modules/requirejs/require.js'); });
app.get('/lib/gl-matrix.js', function(req, res) { res.sendFile(__dirname + '/node_modules/gl-matrix/dist/gl-matrix-min.js'); });
app.get('/lib/cookies-js.js', function(req, res) { res.sendFile(__dirname + '/node_modules/cookies-js/dist/cookies.min.js'); });
var server = app.listen(process.env.PORT || 3000);

//start server application
require('main')(server);