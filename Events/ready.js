const setttings = require("../settings.json");
const Discord = require("discord.js");
const moment = require('moment');
const qdb = require('quick.db');
require("moment-duration-format");
moment.locale("tr");

const client = global.client;

module.exports = () => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username} ismi ile giriş yapıldı!`);

    if (setttings.bot.botSesKanalı && client.channels.cache.has(setttings.bot.botSesKanalı)) client.channels.cache.get(setttings.bot.botSesKanalı).join().catch();
  client.user.setActivity(setttings.bot.footer)
}              
module.exports.configuration = {
  name: "ready"
}