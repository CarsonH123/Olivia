module.exports = {
    name: "schedule",
    description: "scheduling messages",
    execute(message, commandTerms, client) {
        var confirmationStatus = false;

        //checking formatting
        for(var i = 0; i < 5; i++) {
            if (commandTerms[i] == null) {
                message.channel.send("Improper formatting. Cancelling procedure.");
                message.channel.send("`+schedule [text channel] [days]d [hours]h [minutes]m [message]`");
                return;
            }
        }

        //removing unneeded ends of the channel ID
        commandTerms[1] = commandTerms[1].slice(2, -1);

        //checking that the channel exists
        if(!client.channels.cache.get(commandTerms[1])) {
            message.channel.send("That text channel doesn't exist!");
            message.channel.send("`+schedule [text channel] [days]d [hours]h [minutes]m [message]`");
            return;
        } 

        //assigning values from array
        var days = commandTerms[2]
        var hours = commandTerms[3];
        var minutes = commandTerms[4];
        var output = '';
        
        //combining all terms following time into one string
        for (i = 5; i < commandTerms.length; i++) {
            output = output.concat(commandTerms[i]);
            output = output.concat(' ');
        }
        output = output.slice(0, -1);

        //more format checking
        if (!days.endsWith('d') || !hours.endsWith('h') || !minutes.endsWith('m')) {
            message.channel.send("Improper formatting. Cancelling procedure.");
            message.channel.send("`+schedule [text channel] [days]d [hours]h [minutes]m [message]`");
            return;
        }

        //removing h/m suffix
        days = days.slice(0, -1);
        hours = hours.slice(0, -1);
        minutes = minutes.slice(0, -1);

        //user confirmation (with timeout)
        message.channel.send("Scheduled to send in " + commandTerms[2] + " " + commandTerms[3] + " " + commandTerms[4] + " to <#" + commandTerms[1] + ">: \"**" + output + "**\"");
        message.author.send("Scheduled to send in " + commandTerms[2] + " " + commandTerms[3] + " " + commandTerms[4] + " to <#" + commandTerms[1] + ">: \"**" + output + "**\"");
        
        message.channel.send("Please `confirm` or `deny` this");
        
        var loop = setInterval (() => {
            if (message.channel.lastMessage.content == 'confirm') {
                
                clearInterval(loop);
                clearInterval(timeout);
                
                var time = (days * 86400000) + (hours * 3600000) + (minutes * 60000);
                
                message.channel.send("Message confirmed");
                message.author.send("Message confirmed");
                client.commands.get('scheduledMessageManager').execute(message.author.id, commandTerms[1], time + Date.now(), output);

            } else if (message.channel.lastMessage.content == 'deny') {

                clearInterval(loop);
                clearInterval(timeout);

                message.channel.send("Message denied");
                message.author.send("Message denied");
                return;

            }

        }, 1000);

        //timer to run after no user input in 30 seconds
        var timeout = setTimeout (() => {
            message.channel.send("No reply. Cancelling message");
            message.author.send("No reply. Cancelling message");
            clearInterval(loop);
            return;
        }, 30000);
    }
}