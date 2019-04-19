const env = require("dotenv").config();
const express = require("express");
const appInfo = require("./utils/AppInfo");
const config = {
  appInfo: appInfo
};
const libs = require("libs")(config);
const logger = libs.logger;
const routes = require("./routes/RoutesDispatcher")(libs);
const bodyParser = require("body-parser");

if (env.error) {
  logger.error(`error parsing .env file ${env.error}`);
  return;
} else {
  logger.info(`.env file loaded`);
}

const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(routes);

logger.info(`starting auth microservice`);
const server = app.listen(appInfo.port, "0.0.0.0", () => {
  const port = server.address().port;
  logger.info(`listening on port: ${port}`);
});
