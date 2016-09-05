var express = require('express'),
		path = require('path'),
		app = express();

app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('./controllers'));

app.listen(3000, function () {
	console.log('Listening on port 3000...')
})