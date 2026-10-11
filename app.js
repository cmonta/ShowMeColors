var express = require('express'),
		path = require('path'),
		fs = require('fs'),
		app = express();

// Dossier des images envoyées : ignoré par git, donc on le crée au démarrage
var uploadDir = path.join(__dirname, 'public', 'upload');
fs.mkdirSync(uploadDir, { recursive: true });
app.set('uploadDir', uploadDir);

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('./controllers'));

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Listening on port ' + port + '...')
})
