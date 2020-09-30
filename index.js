const path = require("path");
const portal = require("./portal");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
(async () => {
  await portal.init();
})();
