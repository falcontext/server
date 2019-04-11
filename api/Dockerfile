FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/libs/node_modules && chown -R node:node /home/node/app && chown -R node:node /home/node/libs
USER node
WORKDIR /home/node/app
COPY --chown=node:node ./api/package*.json ./
WORKDIR /home/node/libs
COPY --chown=node:node ./libs/package*.json ./
RUN yarn install
COPY --chown=node:node ./libs .
WORKDIR /home/node/
RUN yarn --cwd ./app add ../libs
WORKDIR /home/node/app
RUN yarn install
COPY --chown=node:node ./api .
EXPOSE 8080
CMD yarn run start:prod