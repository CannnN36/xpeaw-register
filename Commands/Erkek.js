const { MessageEmbed, MessageAttachment } = require("discord.js");
const qdb = require("quick.db");
const settings = require("../settings.json");

module.exports.onLoad = (client) => {
  client.sayilariCevir = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
}

module.exports.execute = async (client, message, args, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(settings.bot.footer).setColor("RANDOM").setTimestamp();
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  
    // HATALAR
    if (!message.member.roles.cache.has(settings.register.registery) && !message.member.hasPermission(8)) return message.channel.send(embed.setDescription(`Bu Komutu Kullanmak İçin Yeterli Yetkin Yok!`))
    if (!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({ timeout: 5000 }));
    if (uye.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
  
    //İSİM KODU
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
    await qdb.add(`teyit.${message.author.id}.erkek`, 1);
    await qdb.push(`isimler.${uye.id}`, { isim: yazilacakIsim, rol: settings.register.isimler.erkek, yetkili: message.author.id, zaman: Date.now() })
  
    //KAYIT KISMI
    let yetkiliBilgisi = ``;
    let teyit = qdb.get(`teyit.${message.author.id}`) || {};
    if(!message.member.roles.cache.has(settings.register.registery) && (!message.member.hasPermission("ADMINISTRATOR"))) return;
    if (teyit) {
      let erkekTeyit = teyit.erkek || 0;
      let kizTeyit = teyit.kiz || 0;
      yetkiliBilgisi += `${erkekTeyit + kizTeyit}`;
    }
    uye.setNickname(`${yazilacakIsim}`).catch();
    await uye.roles.add(settings.register.man || []).catch();
    await uye.roles.remove(settings.register.unregister || []).catch();
    if (settings.server.tag && uye.user.username.includes(settings.server.tag)) uye.roles.add(settings.register.tagrol).catch();
    let xpw = await qdb.get(`isimler.${uye.id}`)
    if (xpw) {
      let isimlerr = xpw.filter(uye => uye.userID === uye.id).map((isimlerxd, index) => `\`${isimlerxd.isim}\` | (<@&${isimlerxd.rol}>)`).splice(0, 10)
      message.channel.send(new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setColor("RANDOM")
        .setFooter(`Toplam: ${yetkiliBilgisi} kaydınız var`)
        .setTimestamp()
        .setDescription(`
      ${uye} (\`${uye.id}\`) Kullanıcısının Başarıyla İsmi: ${yazilacakIsim} Olarak Değiştirildi, <@&${settings.register.isimler.erkek}> Rolü İle Kaydoldu!
      Kullanıcının Toplamda ${client.emojiSayi(isimlerr.length)} Kayıtı Bulundu Bunlar;
      ${isimlerr.join("\n")}
      `)).then(x => x.delete({ timeout: 10000 })).catch();
      if (settings.server.chat && client.channels.cache.has(settings.server.chat)) client.channels.cache.get(settings.server.chat).send(embed
        .setAuthor(uye.displayName, uye.user.avatarURL({ dynamic: true }))
        .setDescription(`${uye} Aramıza Hoş Geldin! Seninle Birlikte \`${message.guild.memberCount}\` Kişiyiz.`)).then(x => x.delete({ timeout: 5000 })).catch();
    }
    message.react(settings.emoji.diğer.onay)
  };
  
  
  module.exports.configuration = {
    name: "erkek",
    aliases: ["e", "erkek", "man", "boy"],
    usage: "erkek [üye] [isim] [yaş]",
    description: "Belirtilen üyeyi erkek olarak kaydeder."
  };