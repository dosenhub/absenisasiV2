const path = require("path");
const portal = require("./portal");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
(async () => {
  //   await portal.init();
  const users = await db.get("users").value();
  await portal.init();
  for (const user of users) {
    await portal.login(user.username, user.password);
    await portal.clickDataKehadiran();
    await portal.clickPresensiOnline();
    await portal.clickAbsen();
    await portal.takeScreenShot(user.username);
    await portal.logout();
    // const contents = await fs.readFile(file, 'utf8');
    // console.log(contents);
  }
  await portal.finalize();
})();
