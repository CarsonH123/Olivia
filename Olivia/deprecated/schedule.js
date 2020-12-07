module.exports = {
    name: 'schedule',
    description: 'schedules a message to be sent in a certain amount of time',
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

        //integer overflow prevention
        if (days > 14 || hours >= 24 || minutes >= 60) {
            message.channel.send("The time specified is too long! Max time limit is **14d 23h 59m**");
            return;
        }

        //user confirmation
        message.channel.send("*Scheduled to send in " + days + "d " + hours + "h " + minutes + "m to " + "<#" + commandTerms[1] + ">:* \"**" + output + "**\"");      
        message.channel.send("Please confirm this action by replying either \"confirm\" to confirm it, or \"cancel\" to undo this action. You have 60 seconds to do so.")

        //cancel feature
        var cancelProcedure = setInterval(() => {
            if(message.channel.lastMessage.content == "cancel" || message.channel.lastMessage.content == 'Cancel') {
                message.channel.bulkDelete(4);
                message.author.send("The scheduled message has been cancelled");
                clearInterval(outputInterval);
                clearInterval(cancelProcedure);
            } else if (message.channel.lastMessage.content == "confirm" || message.channel.lastMessage.content == "Confirm") {
                message.channel.bulkDelete(4);
                message.author.send("The scheduled message has been confirmed");
                confirmationStatus = true;
                clearInterval(cancelProcedure);
            }
        }, 1000);

        //timeout cancel feature after a minute
        setTimeout(() => {
            clearInterval(cancelProcedure);
        }, 60000);

        //sending user confirmation through DM
        message.author.send("*Scheduled to send to <#" + commandTerms[1] + "> in " + days + "d " + hours + "h " + minutes + "m:* \"**" + output + "**\"");

        var outputInterval = setInterval(() => {
            if (confirmationStatus) {
                //calculating time until send
                var msTime = (days * 24 * 60 * 60000) + (hours * 60 * 60000) + (minutes * 60000);
                if (msTime < 7500) {
                    msTime = 7500;
                }

                console.log ("sending...");
                //timer to send
                setTimeout(() => {
                    client.channels.cache.get(commandTerms[1]).send("*<@" + message.author.id + "> said:* \n\n " + output);
                }, msTime);

                clearInterval(outputInterval); //break loop
            } 
        }, 1000);
    }
}