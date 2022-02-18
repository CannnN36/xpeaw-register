const { MessageEmbed, MessageAttachment}= require("discord.js");
const qdb = require("quick.db");
const conf = require("../settings.json");

module.exports = async (member) => {
  if(member.user.bot) return;
  let client = global.client;
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;

if (guvenilirlik) {
if(conf.register.şüpheli) member.roles.set([conf.register.şüpheli]).catch();
    if(conf.logs.suspilog && member.guild.channels.cache.has(conf.logs.suspiciouslog)) return member.guild.channels.cache.get(conf.logs.suspiciouslog).send(new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({dynamic: true})).setDescription(`${member} üyesi sunucuya katıldı fakat hesabı ${member.client.tarihHesapla(member.user.createdAt)} açıldığı için jaile atıldı!`).setTimestamp().setFooter(conf.bot.footer));
  } else 
  if(conf.register.unregister) member.roles.add(conf.register.unregister).catch();
  member.setNickname("İsim | Yaş");
  
if(member.user.username.includes(conf.server.tag)) {
  member.roles.add(conf.register.tagrol)
}

// GIRIŞ MESAJI
if(conf.register.welcome && member.guild.channels.cache.has(conf.register.welcome)) member.guild.channels.cache.get(conf.register.welcome).send(`
Merhabalar, ${member} aramıza hoş geldin. Seninle beraber sunucumuz ${client.emojiSayi(`${member.guild.memberCount}`)} üye sayısına ulaştı 🎉

Hesabın (${member.client.tarihHesapla(member.user.createdAt)}) oluşturulmuş ${guvenilirlik ? `${conf.emoji.diğer.iptal}` : `${conf.emoji.diğer.onay}`}

Sunucu kurallarımız <#${conf.server.kurallar}> kanalınad belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları olduğunu varsayarak gerçekleştirilecek. 
<@&${conf.register.registery}> Rolündeki yetkililer seninle ilgilenecektir.

Sol tarafta bulunun **V.Confirmed** odalarından birine girerek kayıt olabilirsin, (${conf.server.tag}) tagımızı alırsan seviniriz. İyi eğlenceler :tada: :tada: :tada:

`)
};
module.exports.configuration = {
  name: "guildMemberAdd"
}