const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const settings = require("../settings.json");
const moment = require("moment")
require("moment-duration-format")

module.exports.execute = async (client, message, args, emoji) => {


    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(settings.bot.footer).setColor("RANDOM").setTimestamp();
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    //HATALAR
    if (!message.member.roles.cache.has(settings.register.registery) && !message.member.hasPermission(8)) return;
    if (!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({ timeout: 5000 }));

    //DATABASEDEN İSİMLERİ ÇEKMEK
    let xpw = await qdb.get(`isimler.${uye.id}`)
    if (!xpw) return message.channel.send(`Kişin Önceki İsimleri Bulunmamakta!`)
    if (xpw) {
        let isimlerr = xpw.filter(uye => uye.userID === uye.id).map((isimlerxd, index) => `\n İsim: \`${isimlerxd.isim}\` \n Rol: (<@&${isimlerxd.rol}>) \n Yetkili: <@${isimlerxd.yetkili}> \n Zaman: \`${moment(Date.now()).format('LLL')}\` `).splice(0, 10)

        message.channel.send(new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setColor("RANDOM")
            .setFooter(settings.bot.footer)
            .setTimestamp()
            .setDescription(`
Kişinin toplamda ${client.emojiSayi(isimlerr.length)} kayıtı bulundu
${isimlerr.join("\n")}
`)).catch();
        message.react(settings.emoji.diğer.onay)
    }
}

module.exports.configuration = {
    name: "isimler",
    aliases: ["isimler", "İsimler"],
    usage: "isimler [üye]",
    description: "Belirtilen üyenin isim ve yaşını değiştirir."
};