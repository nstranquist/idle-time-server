# Express API for Idle Time

FROM node:14.5.0-buster-slim

# Connection to Database
ENV PORT=8080
ENV API_SECRET="nodeRestApi"
ENV NODE_ENV="production"
ENV DB_PRODUCTION="placeholder"

# Copy and Install Dependencies
RUN sudo apt-get install python3
RUN mkdir /api
WORKDIR /api
COPY package.json /api/package.json
RUN npm install

# Copy API
COPY src /api/src
COPY swagger.json /api/swagger.json

RUN npm run build

EXPOSE 8080

# Start the Server
CMD [ "npm", "start" ]
