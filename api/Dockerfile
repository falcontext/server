FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./api/package*.json ./
WORKDIR /home/node
COPY ./libs ./
WORKDIR /home/node/libs
RUN yarn install
WORKDIR /home/node/app
USER node
RUN yarn add ../libs
RUN yarn install
COPY --chown=node:node ./api .
EXPOSE 8080
CMD yarn run start:prod