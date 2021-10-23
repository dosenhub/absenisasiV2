const path = require("path");
//load dotenv
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

//load portal
const portal = require("./portal");
const db = require("./db.json");

(async () => {
  const { users } = db;
  await portal.shuffle(users);
  await portal.init();
  //iterate for each users
  for (const user of users) {
    await portal.login(user.username, user.password);
    await portal.clickDataKehadiran();
    await portal.clickPresensiOnline();
    await portal.addDelay();
    await portal.clickAbsen(user.username);
    await portal.takeScreenShot(user.username);
    await portal.logout();
  }
  await portal.finalize();
})();
