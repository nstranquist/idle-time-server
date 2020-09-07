# IdleTime Server
This is the server for the IdleTime app

### Architecture Overview

This project is using Node / Express for the api, Mongoose / MongoDb for the database layer.

### Code Coverage

[![Coverage Status](https://coveralls.io/repos/github/nstranquist/idle-time-server/badge.svg)](https://coveralls.io/github/nstranquist/idle-time-server)

### Linting

To run the linter, make sure node_modules are installed, and then run `yarn pretty`

### Swagger

To test documenation, run: `npx swagger-jsdoc -d src/docs/swaggerDoc.js src/routes/index.js`
