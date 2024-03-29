const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const BASE_URL = "https://portal.polinema.ac.id";
const moment = require("moment");
const yn = require("yn");
const { max } = require("moment");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const portal = {
  browser: null,
  page: null,
  // konfigurasi min delay
  maxDelay: process.env.MAX || 5000,
  // konfigurasi max delay
  minDelay: process.env.MIN || 3000,
  init: async () => {
    try {
      console.log("Browser Start");
      portal.browser = await puppeteer.launch({
        product: process.env.PUPPETEER_PRODUCT || "chrome",
        headless: yn(process.env.HEADLESS),
        defaultViewport: null,
        ignoreHTTPSErrors: true,
        acceptInsecureCerts: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--ignore-certificate-errors",
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
  clickAbsen: async (username) => {
    try {
      console.log("Start Klik Absen");
      await portal.page.waitForTimeout(3000);
      let buttonAbsen = await portal.page.waitForSelector(
        "button.btn-sm:nth-child(1)"
      );
      if (buttonAbsen != undefined) {
        console.log("Click Button");
        bot.telegram.sendMessage(
          process.env.GROUP_ID,
          "Absensi Atas Nama : " + username + " Sukses Dilakukan"
        );
        await buttonAbsen.click();
        await portal.page.waitForTimeout(9000);
      } else {
        bot.telegram.sendMessage(
          process.env.GROUP_ID,
          "Absensi Atas Nama : " + username + " Sudah Absen"
        );
      }
    } catch (error) {
      bot.telegram.sendMessage(
        process.env.GROUP_ID,
        "Absensi Atas Nama : " + username + " Gagal Dilakukan Absen"
      );
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
  addDelay: async () => {
    try {
      let random = Math.random();
      let delay = Math.floor(
        random * (Math.ceil(portal.maxDelay) - Math.ceil(portal.minDelay)) +
          Math.ceil(portal.minDelay)
      );
      console.log("Delay Dulu " + delay);
      await portal.page.waitForTimeout(delay);
    } catch (error) {
      console.log("Gagal addDelay");
    }
  },
  shuffle: async (users) => {
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = users[i];
      users[i] = users[j];
      users[j] = temp;
    }
  },
};
module.exports = portal;
