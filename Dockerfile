# Express API for Idle Time

FROM node:14.5.0-buster-slim

# Connection to Database
ENV PORT=8080
ENV API_SECRET="nodeRestApi"

# Copy and Install Dependencies
RUN mkdir /api
WORKDIR /api
COPY package.json /api/package.json
RUN npm install

# Copy API
COPY server.js /api/server.js
COPY app /api/app
COPY constants /api/constants
COPY routes /api/routes
COPY database.js /api/database.js

EXPOSE 8080

# Start the Server
CMD [ "npm", "start" ]