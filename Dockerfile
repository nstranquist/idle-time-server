# Express API for Idle Time

FROM ubuntu:20.04

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get -y install nodejs

# Connection to Database
ENV PORT=8080
ENV API_SECRET="nodeRestApi"
ENV NODE_ENV="production"
ENV DB_PRODUCTION="placeholder"

# Copy and Install Dependencies
RUN mkdir /api
WORKDIR /api
COPY package.json /api/package.json
COPY yarn.lock /api/yarn.lock
RUN npm install -g yarn
COPY .babelrc /api/.babelrc
RUN yarn install

# Copy API
COPY src /api/src
COPY swagger.json /api/swagger.json

RUN yarn dockerstart

EXPOSE 8080

# Start the Server
CMD [ "yarn", "start" ]
