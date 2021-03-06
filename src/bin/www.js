const http = require('http');
// const https = require('https)
// const fs = require('fs)
const initConfig = require('../config');
const startApp = require('../app');
const db = require('../lib/db');

const config = initConfig();

const app = startApp(config);

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
const port = normalizePort(config.port);

// FOR SSL ENCRYPTION
// const options = {
//   key: fs.readFileSync('./fixtures/keys/agent2-key.pem'),
//   cert: fs.readFileSync('./fixtures/keys/agent2-cert.pem'),
// };

// Create HTTP/HTTPS server and listen on port
const server = http.createServer(app);
// const server = https.createServer(options, app).listen(port);

// db.connect(config.db.connection)
//   .then(() => {
//     config.log.info('Connected to MongoDB');
//     server.listen(port);
//   })
//   .catch((err) => {
//     config.log.fatal(`mongo failed to connect: ${err}`);
//   });
server.listen(port);

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  config.log.info(`Listening on ${bind}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    config.log.fatal(`${bind} requires elevated privileges`);
    process.exit(1);
    break;
  case 'EADDRINUSE':
    config.log.fatal(`${bind} is already in use`);
    process.exit(1);
    break;
  default:
    config.log.info(error);
    // throw error;
  }
});

// const numCPUs = os.cpus().length;

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
//   db.connect(config.db.connection)
//     .then(() => {
//       log.info('Connected to MongoDB');
//       server.listen(port);
//     })
//     .catch((err) => {
//       log.fatal(err);
//     });
// }
