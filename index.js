const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const portal = require("./portal");
const db = require("./db.json");

(async () => {
  const { users } = db;
  await portal.init();
  for (const user of users) {
    await portal.login(user.username, user.password);
    await portal.clickDataKehadiran();
    await portal.clickPresensiOnline();
    await portal.addDelay();
    await portal.clickAbsen();
    await portal.takeScreenShot(user.username);
    await portal.logout();
  }
  await portal.finalize();
})();
