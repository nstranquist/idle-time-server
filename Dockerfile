# Express API for Idle Time

FROM node:14.5.0-buster-slim

# Connection to Database
ENV PORT=8080
ENV API_SECRET="nodeRestApi"

# Copy and Install Dependencies
RUN sudo apt-get install python3
RUN mkdir /api
WORKDIR /api
COPY package.json /api/package.json
RUN npm install

# Copy API
COPY server /api/server
COPY public /api/public
COPY bin /api/bin
COPY routes /api/routes

EXPOSE 8080

# Start the Server
CMD [ "npm", "start" ]
