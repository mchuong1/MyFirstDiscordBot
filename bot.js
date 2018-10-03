var Discord = require('discord.io');
var winston = require('winston');
var auth = require('./auth.json');
var firebase = require('firebase');
//database
var serviceAccount = require('./admin.json');
var admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://discord-leveling-system.firebaseio.com'
});
var config = {
    apiKey: "AIzaSyAn5P_3Z67ZWNGYc3h7y6ZRY-45l3iG0CU",
    authDomain: "discord-leveling-system.firebaseapp.com",
    databaseURL: "https://discord-leveling-system.firebaseio.com",
    projectId: "discord-leveling-system",
    storageBucket: "discord-leveling-system.appspot.com",
    messagingSenderId: "383122305937"
}
firebase.initializeApp(config);
var database = firebase.database();

//logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function(evt) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});
//Commmands
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'barb':
                bot.sendMessage({
                    to: channelID,
                    message: '<:barb:496777782463037462>'
                });
                break;
            case 'exp':
                bot.getMessages({
                    channelID: channelID,
                    limit: 5
                }, (err,res)=>{
                    for(var i = 0; i < res.length; i++)
                        {
                            console.log(res[i].author.username + ": " + res[i].content);
                        }
                });
                //bot.sendMessage({
                //    to: channelID,
                //    message: "<@!" + userID + ">"+' your current exp is: ' + 5
                //});
                break;
            // Just add any case commands if you want to..
         }//endSwitch
     }//endIF
   // var data = {
    //    Name: user.username,
    //    Exp: 
    //}
    //database.ref('members').push(data);
    //console.log("Writing to database")
});
//Greeting Message
bot.on('guildMemberAdd', function (member) { //Confirm Member ID is correct (verified) 
    console.dir(member.id); 
    bot.sendMessage({ to: member.id, message: 'Test' }); 
    //var name = user.username;
    //var data = {
    //    Name:name,
    //    Exp:0
    //}
    //database.ref('members').push(data);
   // console.log("attempting to add member to database");
});
