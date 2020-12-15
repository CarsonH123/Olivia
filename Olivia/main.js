const Discord = require('discord.js');
const config = require('./config.json');
// const scheduledMessages = require('./resources/scheduledMessages.json');

const client = new Discord.Client();

const prefix = '+';
const adminPrefix = '?';

const fs = require('fs');
const { setPriority } = require('os');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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

    setInterval(() => {
        fs.readFile('./resources/scheduledMessages.json', 'utf8', (err, data) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return;
            } else {
                var jsData = JSON.parse(data);

                
                for(var i = 0; i < 10; i++) {
                    if (jsData.messages[i].used) {
                        if (Date.now() >= jsData.messages[i].endTime) {
                            
                            client.channels.cache.get(jsData.messages[i].channel).send("<@" + jsData.messages[i].userID + "> said:\n" + jsData.messages[i].message);
                            client.commands.get('scheduledMessageIndividualReset').execute(i);
                        }
                    }
                }
            }
        });
    }, 1000);
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
            client.commands.get('schedule').execute(message, commandTerms, client);       
        break;
        case '?purge':
            client.commands.get('purge').execute(message, commandTerms);
        break;
        case '+scheduled':
            client.commands.get('scheduled').execute(message, commandTerms, client);
        break;
        case '?smr':
            client.commands.get('scheduledMessageReset').execute(message);
        break;
        case '+cancel':
            client.commands.get('scheduledMessageIndividualReset').execute(commandTerms[1]);
            message.channel.send("Message " + commandTerms[1] + " cancelled!");
        break;
    }
});

client.login(config.token); //end