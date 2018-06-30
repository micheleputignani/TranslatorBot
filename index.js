// Imports
const translate = require('google-translate-api');
const Discord = require("discord.js");

// variables
const Client = new Discord.Client();
const TOKEN = "INSERT YOUR DISCORD APPLICATION TOKEN HERE";
const prefix = "-t ";
const MessagesTypes = { SUCCESS: 'SUCCESS', ERROR: 'ERROR', HELP: 'HELP' };
const Colors = { Success: 3447003, Failure: 15158332, Help: 0x0080ff };

// Languages list
const languagesList = 'en: English\n' +
                  'fr: French\n' +
                  'it: Italian\n' +
                  'es: Spanish\n' +
                  'nl: Dutch\n' +
                  'de: German\n' +
                  'pt: Portuguese\n';

Client.on("ready", ()=> {
    console.log(`Logged in as ${Client.user.tag}!`);
});

Client.on("message", (message)=> {
    // no prefix detected
    if (!message.content.startsWith(prefix)) return;
    // help message
    else if (message.content.startsWith(prefix + 'help'))
        sendMessage(message, languagesList, MessagesTypes.HELP);
    else if (message.content.startsWith(prefix + 'channel'))
         message.channel.send(message.channel.id);
    else {
        let targetLanguage = message.content.split(" ")[1];
        let sentence = message.content.split(" ").splice(2).join(" ");
        translate(sentence, { from: 'auto', to: targetLanguage })
            .then(res => {
                let sentenceTranslated = res.text;
                sendMessage(message, sentenceTranslated, MessagesTypes.SUCCESS); 
            });   
    }
});

// send custom message depending to type
function sendMessage(message, sentence, type) {
    let embed;
    switch (type) {
        case MessagesTypes.HELP:
        embed = new Discord.RichEmbed()
            .setTitle("Translator Help")
            .setColor(Colors.Help)
            .addField("Command format", "-t language message", true)
            .addField("Example", "-t en Hola", true)
            .addField("Some languages", sentence)
            .setFooter("All languages supported.")
        break;
        case MessagesTypes.SUCCESS:
            embed = new Discord.RichEmbed()
            .setColor(Colors.Success)
            .setAuthor(message.author.username)
            .setDescription(sentence);
        break;
        case MessagesTypes.ERROR:
            embed = new Discord.RichEmbed()
            .setColor(Colors.Failure)
            .setDescription(sentence);
        break;
    }
    message.channel.send(embed);
}

// login using token
Client.login(TOKEN);