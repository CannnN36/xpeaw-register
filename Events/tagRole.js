const discord = require("discord.js");
const qdb = require("quick.db");
const settings = require("../settings.json");

module.exports = (oldUser, newUser) => {
  if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
  if(!settings.server.tag) return;
  let client = oldUser.client;
  let guild = client.guilds.cache.get(settings.server.sunucuId);
  if(!guild) return console.error(`${__filename} Sunucu bulunamadı!`);
  let user = guild.members.cache.get(oldUser.id);
  const member = guild.members.cache.get(newUser.id)
  if(!member) return;
  if(!user) return;
  const embed = new discord.MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({dynamic: true})).setFooter(settings.bot.footer).setColor("RANDOM").setTimestamp();
  let log = client.channels.cache.get(settings.logs.taglog);

  if(newUser.username.includes(settings.server.tag) && !user.roles.cache.has(settings.register.tagrol)) {

      if(user.manageable && settings.server.tagsıztag) user.setNickname(user.displayName.replace(settings.server.tagsıztag, settings.server.tag)).catch();
      if(settings.register.tagrol) user.roles.add(settings.register.tagrol).catch();

      if(settings.logs.taglog && log) log.send(embed.setDescription(`${user} kişisi ismine \`${settings.server.tag}\` sembolünü alarak <@&${settings.register.tagrol}> ekibimize katıldı!`).setColor("#32FF00")).catch();
  } else if(!newUser.username.includes(settings.server.tag) && user.roles.cache.has(settings.register.tagrol)){
      if(user.manageable && settings.server.tagsıztag) user.setNickname(user.displayName.replace(settings.server.tag, settings.server.tagsıztag)).catch();
      if(settings.register.tagrol){
        let ekipRol = guild.roles.cache.get(settings.register.tagrol);
        user.roles.remove(user.roles.cache.filter(rol => ekipRol.position <= rol.position)).catch();
      }
      if(settings.logs.taglog && log) log.send(embed.setDescription(`${user} kişisi isminden \`${settings.server.tag}\` sembolünü çıkararak <@&${settings.register.tagrol}> ekibimizden ayrıldı!`).setColor("#B20000")).catch();
  }
}

module.exports.configuration = {
  name: "userUpdate"
}