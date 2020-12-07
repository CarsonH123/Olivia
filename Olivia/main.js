const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

const prefix = '+';
const adminPrefix = '?';


//each scheduled message is given an array with its information, the user can call for the information using the array index
var schedulingArrays = []; // [userID, location, end time, message]

const fs = require('fs');
const { setPriority } = require('os');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Client Online');		
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "+help"
        }
    });
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) && !message.content.startsWith(adminPrefix)) return;
    if (message.author.bot) return;

    //checking if user has perms to use admin commands
    if(!message.guild == null) { //checking to see if message is in a DM
        if (!message.member.roles.cache.some(roles => roles.name === 'Operator') && message.content.startsWith(adminPrefix)) {
            message.channel.send("You do not have permission to use that command!");
            return;
        }
    }   
    
    const args = message.content.split(/ + /);
    var command = args.shift();
    var commandTerms = command.split(' '); //array to store each individual word within a command

    console.log(command); //debug statement
    
    switch (commandTerms[0]) {
        case '+help':
            client.commands.get('help').execute(message, commandTerms);
        break;
        case '+random':
            client.commands.get('random').execute(message, commandTerms);
        break;
        case '+schedule':
            message.channel.send("Command deprecated! Use `+advSch` instead!");
            //client.commands.get('schedule').execute(message, commandTerms, client);
        break;
        case '?purge':
            client.commands.get('purge').execute(message, commandTerms);
        break;
        case '+advSch':
            client.commands.get('advSch').execute(message, commandTerms, client, schedulingArrays);
        break;
        case '+scheduled':
            client.commands.get('scheduled').execute(message, commandTerms, schedulingArrays);
        break;
        case '+sdebug':
            message.channel.send(schedulingArrays[commandTerms[1]]);
        break;
    
    }
});

client.login(config.token); //end