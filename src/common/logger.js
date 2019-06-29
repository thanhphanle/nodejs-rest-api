const { createLogger, format, transports } = require('winston')
const { combine, label, printf } = format;
require('winston-daily-rotate-file');
const application = require('../config/application.json')
 
var transport = new (transports.DailyRotateFile)({
    dirname: application.logDir,  
    filename: 'nodejs-rest-api-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '5m',
    maxFiles: '30d'
});

const customFormat = printf(({ level, label, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()} [${label}] ${message}`;
});
 
const logger = function(moduleName) {
  if (moduleName === null || moduleName.trim() === '') {
      moduleName = 'unknown_module'
  }
  return createLogger({
      level: 'debug', // Level to log message
      format: combine(
          label({ label: moduleName }),
          format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss' // Local time by timezone
          }),
          customFormat
        ),
      transports: [
        transport
      ]
  });
}

module.exports = logger
