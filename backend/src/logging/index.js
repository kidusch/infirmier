import { createLogger, format, transports } from 'winston'


export default function (app) {

   const logsDir = app.get('config').LOGS_DIR

   const logger = createLogger({
      format: format.combine(
          format.timestamp(),
          format.json(),
      ),
      // define all log transports
      transports: [
          // write all logs on console
          new transports.Console({ level: 'silly' }),
  
          // Write all logs with level `error` or less (= 'error') to `/var/log/myapp/error.log`
          new transports.File({ filename: `${logsDir}/error.log`, level: 'error' }),
  
          // Write all logs with level `info` or less (= 'info', 'warn', 'error') to `/var/log/myapp/info.log`
          new transports.File({ filename: `${logsDir}/info.log`, level: 'info' }),
      ],
   })
  
   app.set('logger', logger)
   return logger
}
