const Discord = require('discord.js');
const bot = new Discord.Client();
const mysql = require('mysql');

const db = require('require-dir-all')('./commands/db');
const other = require('require-dir-all')('./commands/other');

var con;
if(process.env.JAWSDB_URL) {
    con = mysql.createConnection(process.env.JAWSDB_URL);
};

bot.on('message', (message) => {
  let msg = message.content.toLowerCase();

  if (message.channel.id == '466370937562857474') {
    if (msg.startsWith('!assign ')){
      other.roles.assign(message);
    }
  }

  if (msg == '!register') {
    db.player.register(message, con);
  }

  if (msg == '!profile') {
    db.player.prof(message, con);
  }

  if (msg.startsWith('!clear ')) {
    db.player.clears(message, con);
  }

  if (msg == '!log') {
    db.log.log(message, con);
  }

  if (msg.startsWith('!add ')) {
    db.log.entry(message, con);
  }

  if (msg.startsWith('!lose ')) {
    db.log.lose(message, con);
  }
})

bot.login(process.env.BOT_TOKEN);
