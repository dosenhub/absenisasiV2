const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const BASE_URL = "https://portal.polinema.ac.id";
const moment = require("moment");

const portal = {
  browser: null,
  page: null,
  maxDelay: 5000,
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
      await portal.page.goto(BASE_URL);
    } catch (error) {
      //kalo error langsung close browser
      console.log(error.stack);
      await portal.browser.close();
    }
  },
  finalize: async () => {
    try {
      await portal.page.waitForTimeout(3000);
      await portal.browser.close();
    } catch (error) {
      await portal.page.waitForTimeout(3000);
      console.log(error.stack);
      await portal.browser.close();
    }
  },
  login: async (username, password) => {
    try {
      console.log("Start Login");
      await portal.page.type("#username", username);
      await portal.page.waitForTimeout(3000);
      await portal.page.type("#password", password);
      await portal.page.waitForTimeout(3000);
      await portal.page.click(".submit");
    } catch (error) {
      console.log("Start Login");
      console.log(error.stack);
    }
  },
  cekSurvey: async () => {},
  isiSurvey: async () => {},
  cekAbsensiAvailable: async () => {},
  clickDataKehadiran: async () => {
    try {
      console.log("Start Click Kehadiran");
      await portal.page.waitForTimeout(3000);
      let tabKehadiran = await portal.page.waitForSelector(
        "ul.nav:nth-child(2) > li:nth-child(3) > a:nth-child(1)"
      );
      await portal.page.waitForTimeout(3000);
      await tabKehadiran.click();
    } catch (error) {
      console.log(error.stack);
    }
  },
  clickPresensiOnline: async () => {
    try {
      console.log("Start Click Presensi Button");
      await portal.page.waitForTimeout(3000);
      let presensiButton = await portal.page.waitForSelector(
        "button.btn:nth-child(5)"
      );
      await portal.page.waitForTimeout(3000);
      await presensiButton.click();
    } catch (error) {
      console.log("Gagal Click Presensi Button");
      console.log(error.stack);
    }
  },
  cekButtonAbsen: async () => {
    try {
      console.log("Start Check Button Absen");
      await portal.page.waitForTimeout(3000);
      let buttonAbsen = await portal.page.waitForSelector(
        "button.btn-sm:nth-child(1)"
      );
    } catch (error) {
      console.log("Gagal Check Button Absen");
      console.log(error.stack);
    }
  },
  clickAbsen: async () => {
    try {
      console.log("Start Klik Absen");
      await portal.page.waitForTimeout(3000);
      let buttonAbsen = await portal.page.waitForSelector(
        "button.btn-sm:nth-child(1)"
      );
      if (buttonAbsen != undefined) {
        console.log("Click Button");
        // await buttonAbsen.click();
      } else {
        console.log("Ga Di Klik Button");
      }
    } catch (error) {
      console.log("Gagal Klik Absen");
      console.log(error.stack);
    }
  },
  takeScreenShot: async (username) => {
    try {
      console.log("Start Screenshot");
      const date = new Date();
      const formattedDate = moment(date).format("YYYYMMDD");
      await portal.page.waitForTimeout(3000);
      await fs.mkdirp("logs/" + username);
      await portal.page.screenshot({
        path: "logs/" + username + "/" + formattedDate + ".png",
      });
    } catch (error) {
      console.log("Gagal Screenshot");
      console.log(error.stack);
    }
  },
  logout: async () => {
    try {
      console.log("Start Logout");
      await portal.page.waitForTimeout(3000);
      let dropdownProfile = await portal.page.waitForSelector(
        ".dropdown-toggle"
      );
      await dropdownProfile.click();
      await portal.page.waitForTimeout(3000);
      let logoutButton = await portal.page.waitForSelector(
        ".dropdown-menu > li:nth-child(2) > a:nth-child(1)"
      );
      await logoutButton.click();
      await portal.page.waitForTimeout(3000);
    } catch (error) {
      console.log("Gagal Logout");
      console.log(error.stack);
    }
  },
};
module.exports = portal;
