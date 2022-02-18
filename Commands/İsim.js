const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const settings = require("../settings.json");

module.exports.execute = async (client, message, args, emoji) => {
  //Tanımlamalar
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(settings.bot.footer).setColor("RANDOM").setTimestamp();
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  //HATALAR
  if (!message.member.roles.cache.has(settings.register.registery) && !message.member.hasPermission(8)) return;
  if (!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({ timeout: 5000 }));
  if (uye.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))


  //İSİM DEĞİŞTİRME
  args = args.filter(a => a !== "" && a !== " ").splice(1);
  let yazilacakIsim;
  if (settings.server.isimyas) {
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (!isim || !yaş) return message.channel.send(embed.setDescription("Geçerli bir isim ve yaş belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
    yazilacakIsim = `${uye.user.username.includes(settings.server.tag) ? settings.server.tag : (settings.server.tagsıztag ? settings.server.tagsıztag : (settings.server.tag || ""))} ${isim} | ${yaş}`;
  } else {
    let isim = args.join(' ');
    if (!isim) return message.channel.send(embed.setDescription("Geçerli bir isim belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
    yazilacakIsim = `${uye.user.username.includes(settings.server.tag) ? settings.server.tag : (settings.server.tagsıztag ? settings.server.tagsıztag : (settings.server.tag || ""))} ${isim}`;
  };


  //DATABASEYE KAYIT
    await qdb.push(`isimler.${uye.id}`, { isim: yazilacakIsim, rol: "İsim Değiştirme", yetkili: message.author.id, zaman: Date.now() })


  //SON KISIM
  uye.setNickname(`${yazilacakIsim}`).catch();
  let xpw = await qdb.get(`isimler.${uye.id}`)
  if (xpw) {
    let isimlerr = xpw.filter(uye => uye.userID === uye.id).map((isimlerxd, index) => `İsim: \`${isimlerxd.isim}\``).splice(0, 10)
    message.channel.send(new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")
      .setFooter(settings.bot.footer)
      .setTimestamp()
      .setDescription(`
    ${uye} (\`${uye.id}\`) Kullanıcısının Başarıyla İsmi: ${yazilacakIsim} Olarak Değiştirildi Kullanıcının Toplamda ${client.emojiSayi(isimlerr.length)} Kayıtı Bulundu Bunlar;
    ${isimlerr.join("\n")}
    `)).catch();
  };
  message.react(settings.emoji.diğer.onay)
}

module.exports.configuration = {
  name: "isim",
  aliases: ["name", "nick", "i"],
  usage: "isim [üye] [isim] [yaş]",
  description: "Belirtilen üyenin isim ve yaşını değiştirir."
};