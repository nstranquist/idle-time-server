// require('dotenv').config();
const http = require('http');
// const cluster = require('cluster'); // native node module for clustering processes
// const os = require('os'); // for os operations
const config = require('../server/config')[process.env.NODE_ENV || 'development'];
const app = require('../server/app')(config);
const db = require('../server/lib/db');

const log = config.logger();

// const numCPUs = os.cpus().length;

// Normlize port into a number, string, or false
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

// Get port from environment and store in express
const port = normalizePort(process.env.PORT || '5000');
// app.set('port', port);

// Create HTTP server and listen on port
const server = http.createServer(app);

// Logic for clustering
// if (cluster.isMaster) {
//   log.info(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i += 1) {
//     cluster.fork(); // creates a worker
//   }
//   cluster.on('exit', (worker) => {
//     log.fatal(`Worker ${worker.process.pid} just died`);
//     // fork a new worker if worker dies
//     cluster.fork();
//   });
// } else {
//   // if process is a child, connect to db and listen
//   db.connect(config.mongodb.connection)
//     .then(() => {
//       log.info('Connected to MongoDB');
//       server.listen(port);
//     })
//     .catch((err) => {
//       log.fatal(err);
//     });
// }
log.info('connecting to db');
db.connect(config.mongodb.connection)
  .then(() => {
    log.info('Connected to MongoDB');
    server.listen(port);
  })
  .catch((err) => {
    log.fatal(`fdjlkdfjslkf   ${err}`);
  });

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  log.info(`Listening on ${bind}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.fatal(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.fatal(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      log.info(error);
    // throw error;
  }
});
