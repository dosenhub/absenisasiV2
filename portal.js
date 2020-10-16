const puppeteer = require("puppeteer");
const BASE_URL = "https://portal.polinema.ac.id";
const moment = require("moment");

const portal = {
  browser: null,
  page: null,
  // konfigurasi min delay
  maxDelay: 5000,
  // konfigurasi max delay
  minDelay: 3000,
  init: async () => {
    try {
      console.log("Browser Start");
      portal.browser = await puppeteer.launch({
        product: "firefox",
        headless: false,
        defaultViewport: null,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          // "--start-fullscreen",
        ],
      });

      portal.page = await portal.browser.newPage();

      await portal.page.goto(BASE_URL, { waitUntil: "networkidle2" });
    } catch (error) {
      //kalo error langsung close browser
      console.log(error.stack);
      await portal.browser.close();
    }
  },
  login: async () => {},
  cekSurvey: async () => {},
  isiSurvey: async () => {},
  cekAbsensiAvailable: async () => {},
  clickDataKehadiran: async () => {},
  clickPresensiOnline: async () => {},
  cekButtonAbsen: async () => {},
  clickAbsen: async () => {},
  takeScreenShot: async () => {},
};
module.exports = portal;
