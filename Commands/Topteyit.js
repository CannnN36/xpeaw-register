const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const settings = require("../settings.json");

module.exports.onLoad = (client) => {
  client.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
}

module.exports.execute = async (client, message, args, emoji) => {
  if (!message.member.roles.cache.has(settings.register.registery) && !message.member.hasPermission(8)) return;
  let embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setThumbnail(message.guild.iconURL({ dynamic: true })).setFooter(settings.bot.footer).setColor("RANDOM").setTimestamp();
  let data = await qdb.get("teyit") || {};
  let arr = Object.keys(data);
  let listedMembers = arr.filter(dat => message.guild.members.cache.has(dat)).sort((a, b) => Number((data[b].erkek || 0) + (data[b].kiz || 0)) - Number((data[a].erkek || 0) + (data[a].kiz || 0))).map((value, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(value)} | \`${client.sayilariCevir((data[value].erkek || 0) + (data[value].kiz || 0))} teyit\``).splice(0, 30);
  message.channel.send(embed.setDescription(`**Top Teyit Listesi**\n\n${listedMembers.join("\n") || "Teyit verisi bulunamadı!"}`)).catch();
};
module.exports.configuration = {
  name: "topteyit",
  aliases: ["top-teyit", 'teyit-top'],
  usage: "topteyit",
  description: "Top teyit istatistikleri."
};