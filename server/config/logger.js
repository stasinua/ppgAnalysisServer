var winston = require('winston');
var path = require('path');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `./logs/app.log`,
    // handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

var mainLogger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exceptions.log' })
  ],
  exitOnError: false
});

// create a stream object with a 'write' function that will be used by `morgan`
mainLogger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    mainLogger.info(message);
  }
};

module.exports = mainLogger;
