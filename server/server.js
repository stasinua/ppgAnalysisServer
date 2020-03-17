var http;
if (process.env.NODE_ENV === 'production') {
  http = require('http');
} else if (process.env.NODE_ENV === 'development') {
  http = require('https');
} else {
  http = require('http');
}
// const fs = require('fs');
var dotenv = require('dotenv');
dotenv.config();
var express = require('express');
// var RateLimit = require('express-rate-limit');
var bodyParser = require('body-parser');

const mainLogger = require('./config/logger');
const morgan = require('morgan');

var path = require('path');
var mongoose = require('mongoose');


// var userController = require('./controllers/user/user');

mongoose.Promise = require('q').Promise;
// var expressValidator = require('express-validator');

//Config various environment and system variables
var pathToFrontend = require('./config/routes').pathToFrontend;
var passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
 mongoose.connect(
   'mongodb://127.0.0.1:27017/',
   { dbName: 'ppgData', useNewUrlParser: true }
 )
 .then(
   () => {
     console.log('Database connected');
   },
   err => {
     console.log('Database connection error', err);
     process.exit(1);
   }
 );

/**
 * Express configuration.
 */
app.set('port', process.env.EXPRESS_PORT || 4040);

app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] - :user-agent [:date[iso]]'
  )
);
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use((res, req, next) => {
  res.header('Cache-Control', 'no-cache, must-revalidate');
  res.header('Last-Modified', new Date().toGMTString());
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Autorization, Cache-Control, Last-Modified'
  );
  next();
});
app.disable('x-powered-by');

/**
 * Start Express server.
 */
var server = http.createServer(app);

server.listen(app.get('port'), function() {
  console.log(
    'Express server listening on port %d in %s mode',
    app.get('port'),
    app.get('env')
  );
});

/**
 * Primary app routes.
 */
// Requests rate limiting
app.enable('trust proxy'); // only if behind a reverse proxy

app.use(function(req, res, next) {
  passportConfig.serializeUser(req, res, next);
});
var internalAPIRoutes = require('./controllers/internalAPI')(
  app,
  express,
  // wss,
  // redisClient
);
var authRoutes = require('./controllers/authAPI')(
  app,
  express
);

app.use('/api', internalAPIRoutes);

app.use('/auth', authRoutes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../' + pathToFrontend));
});

app.use(
  express.static(
    path.join(
      __dirname,
      process.env.NODE_ENV === 'production' ? '../build' : '../public'
    ),
    { maxAge: 86400000 }
  )
);
