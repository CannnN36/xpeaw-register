const { MessageEmbed } = require("discord.js");
const settings = require("../settings.json");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");

module.exports.execute = async (client, message, args, emoji) => {
  if (!message.member.roles.cache.has(settings.register.registery) && (!message.member.hasPermission("ADMINISTRATOR"))) return;

  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first() : message.author) || message.author;
  let uye = message.guild.member(kullanici);

  let guild = message.guild;
  let yetkiliBilgisi = ``;
  let teyit = qdb.get(`teyit.${uye.id}`) || {};
  if (!message.member.roles.cache.has(settings.register.registery) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için yetkili olman gerekiyor.")).then(x => x.delete({ timeout: 5000 }));
  if (teyit) {
    let erkekTeyit = teyit.erkek || 0;
    let kizTeyit = teyit.kiz || 0;
    yetkiliBilgisi += `\`Teyitleri:\` ${erkekTeyit + kizTeyit} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
  }
  let victim = kullanici;
  const embed = new MessageEmbed().setTimestamp().setColor("RANDOM").setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 })).setAuthor(kullanici.tag.replace("`", ""), kullanici.avatarURL({ dynamic: true, size: 2048 }))
    .setDescription(yetkiliBilgisi)
  message.channel.send(embed);
};
module.exports.configuration = {
  name: `teyit`,
  aliases: [],
  usage: "teyit [üye]",
  description: "Belirtilen üyenin teyit bilgilerini gösterir."
};