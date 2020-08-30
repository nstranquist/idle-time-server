# Express API for Idle Time

FROM ubuntu:20.04

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get -y install nodejs

# Connection to Database
ENV PORT=8080
ENV API_SECRET="nodeRestApi"

# Copy and Install Dependencies
RUN mkdir /api
WORKDIR /api
COPY package.json /api/package.json
RUN npm install

# Copy API
COPY server /api/server
COPY bin /api/bin

EXPOSE 8080

# Start the Server
CMD [ "npm", "start" ]
