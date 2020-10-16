const path = require("path");
const portal = require("./portal");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

(async () => {
  //   await portal.init();
  // looping user
  let users = await db.get("users").value();
  for (let user of users) {
    console.log(user);
  }
})();
