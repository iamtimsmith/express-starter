const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const promisify = require('es6-promisify');
const helpers = require('./helpers');
const handlers = require('./handlers');

module.exports = (app) => {
	// Set port for the app
	app.set('port', process.env.PORT || 1125);
	// Set default view engine
	app.set('view engine', 'pug');
	// Configure directory for public assets
	app.use(express.static('public'));
	// Takes the raw requests and turns them into usable properties on req.body
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	// Sessions allow us to store data on visitors from request to request
	// This keeps users logged in and allows us to send flash messages
	app.use(session({
		secret: process.env.SECRET,
		key: process.env.KEY,
		resave: false,
		saveUninitialized: false
	}));
	// Use PassportJS to handle logins
	app.use(passport.initialize());
	app.use(passport.session());
	// Add flash messages to send to page
	app.use(flash());
	// pass variables to our templates + all requests
	app.use((req, res, next) => {
		res.locals.h = helpers;
		res.locals.flashes = req.flash();
		res.locals.user = req.user || null;
		res.locals.currentPath = req.path;
		next();
	});
	// Include route files
	app.use('/', require('./routes/web.routes'));
	app.use('/api', require('./routes/api.routes'));
	// Handle 404 pages
	app.use(handlers.notFound);
	// Check to see if errors are validation errors
	app.use(handlers.flashValidationErrors);
	// Otherwise this was a really bad error we didn't expect!
	if (app.get('env') === 'development') {
		/* Development Error Handler - Prints stack trace */
		app.use(handlers.developmentErrors);
	}
	// production error handler
	app.use(handlers.productionErrors);
}
