const { Client, Discord, MessageEmbed, Collection, WebhookClient } = require('discord.js');
const client = global.client = new Client({ fetchAllMembers: true });
const qdb = require('quick.db');
const moment = require('moment');
require("moment-duration-format");
const fs = require("fs");
const conf = require("./settings.json");
global.conf = conf; // guildMemberAdd, userUpdate gibi etkinliklerde işimiz kolaylaşsın.
const express = require('express');

/*
* İsterseniz Açın İsterseniz Kapatın
const app = express();
app.get("/foo", (req, res, next) => {
  const foo = JSON.parse(req.body.jsonString);
});
process.on("unhandledRejection", (reason, promise) => { });
*/

const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;
global.client = client;
fs.readdir("./Commands", (err, files) => {
  if (err) return console.error(err);
  files = files.filter(file => file.endsWith(".js"));
  console.log(`${files.length} komut yüklenecek.`);
  files.forEach(file => {
    let prop = require(`./Commands/${file}`);
    if (!prop.configuration) return console.log("Eklediğiniz Bir Komutun Name Kısmı Yanlış Lütfen Bakınız")
    console.log(`${prop.configuration.name} komutu yükleniyor!`);
    if (typeof prop.onLoad === "function") prop.onLoad(client);
    commands.set(prop.configuration.name, prop);
    if (prop.configuration.aliases) prop.configuration.aliases.forEach(aliase => aliases.set(aliase, prop));
  });
});

fs.readdir("./Events", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    if (!prop.configuration) return;
    client.on(prop.configuration.name, prop);
  });
});

client.on("message", async msg => {
if (msg.author.bot) return;
if (msg.content.toLowerCase() === "sa" || msg.content.toLowerCase().startsWith("sea") || msg.content.toLowerCase().startsWith("selam") || msg.content.toLowerCase().startsWith("slm") || msg.content.toLowerCase().startsWith("s.a")) msg.reply(`Aleyküm selam, hoş geldin!`).then(x => x.delete({timeout: 15000}));});
 
client.on("message", async msg => {
if (msg.author.bot) return;
if (msg.content.toLowerCase() === "tag" ||  msg.content.toLowerCase().startsWith("TAG") || msg.content.toLowerCase().startsWith("!tag") || msg.content.toLowerCase().startsWith("?tag")) msg.channel.send(`**\`${conf.server.tag}\`**`).then(x => x.delete({timeout: 30000}));});


  const emoji = global.emoji; 
  const sayiEmojiler = {
      0: conf.emoji.sayı.sıfır,
      1: conf.emoji.sayı.bir,
      2: conf.emoji.sayı.iki,
      3: conf.emoji.sayı.üç,
      4: conf.emoji.sayı.dört,
      5: conf.emoji.sayı.beş,
      6: conf.emoji.sayı.altı,
      7: conf.emoji.sayı.yedi,
      8: conf.emoji.sayı.sekiz,
      9: conf.emoji.sayı.dokuz,
  };
  
  client.emojiSayi = function (sayi) {
    var yeniMetin = "";
    var arr = Array.from(sayi);
    for (var x = 0; x < arr.length; x++) {
      yeniMetin += (sayiEmojiler[arr[x]] == "" ? arr[x] : sayiEmojiler[arr[x]]);
    }
    return yeniMetin;
};

Date.prototype.toTurkishFormatDate = function (format) {
    let date = this,
      day = date.getDate(),
      weekDay = date.getDay(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
  
    let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");
  
    if (!format) {
      format = "dd MM yyyy | hh:ii:ss";
    };
    format = format.replace("mm", month.toString().padStart(2, "0"));
    format = format.replace("MM", monthNames[month]);
  
    if (format.indexOf("yyyy") > -1) {
      format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
      format = format.replace("yy", year.toString().substr(2, 2));
    };
  
    format = format.replace("dd", day.toString().padStart(2, "0"));
    format = format.replace("DD", dayNames[weekDay]);
  
    if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    if (format.indexOf("hh") > -1) {
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;
      format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
    };
    if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
    if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    return format;
  };
  
  client.tarihHesapla = (date) => {
    const startedAt = Date.parse(date);
    var msecs = Math.abs(new Date() - startedAt);
  
    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
    msecs -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
    msecs -= months * 1000 * 60 * 60 * 24 * 30;
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
    msecs -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(msecs / (1000 * 60 * 60));
    msecs -= hours * 1000 * 60 * 60;
    const mins = Math.floor((msecs / (1000 * 60)));
    msecs -= mins * 1000 * 60;
    const secs = Math.floor(msecs / 1000);
    msecs -= secs * 1000;
  
    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`
    else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
    else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
    else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
    else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
    else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
    else if (secs > 0) string += `${secs} saniye`
    else string += `saniyeler`;
  
    string = string.trim();
    return `\`${string} önce\``;
  };

client.on('message', async (message) => {
    const waitLimit = {};
  if (message.author.bot || !message.content.startsWith(conf.bot.prefix) || !message.channel || message.channel.type == "dm") return;
  if (waitLimit[message.author.id] && (Date.now() - waitLimit[message.author.id]) / (1000) <= conf.bot.waitLimit) return;
  
  let args = message.content.substring(conf.bot.prefix.length).split(" ");
  let command = args[0];
  let bot = message.client;
  args = args.splice(1);
  let emoji = global.emoji;
  let calistirici;

  if (commands.has(command)) {
    calistirici = commands.get(command);
    if ((conf.register.unregister && conf.register.unregister.some(rol => message.member.roles.cache.has(rol)))) return;
    calistirici.execute(bot, message, args, emoji);

  } else
    if (aliases.has(command)) {
      calistirici = aliases.get(command);
      if ((conf.register.unregister && conf.register.unregister.some(rol => message.member.roles.cache.has(rol)))) return;
      calistirici.execute(bot, message, args, emoji);

    }
  waitLimit[message.member.id] = Date.now();
})

client.login(process.env.token).then(console.log("Bot başarılı bir şekilde giriş yaptı.")).catch(err => console.error("Bot giriş yapamadı | Hata: " + err));