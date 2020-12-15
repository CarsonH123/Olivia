module.exports = {
    name: "scheduled",
    descriptiom: "prints a list of all currently scheduled messages",
    execute(message, commandTerms, client) {

        var fs = require('fs');
        
        var output;
        var jsData;

        fs.readFile('./resources/scheduledMessages.json', 'utf8', (err, data) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return;
            } else {
                jsData = JSON.parse(data);

                if (commandTerms.length > 2 || commandTerms[1] > 9) { //format checking

                    message.channel.send("Improper formatting! Cancelling procedure!");
                    message.channel.send("`+scheduled {indexOfMessage}`");
                    return;

                } else if (commandTerms.length == 1) { //no specific message info needed
                    output = "**Scheduled Messages:**\n\n";
        
                    for (var i = 0; i < 10; i++) {
        
                        if (jsData.messages[i].used) {
        
                            output = output.concat("`Message " + i + ":`\n");
                            output = output.concat(jsData.messages[i].message + "\n\n");
        
                        }
                    }

                    message.channel.send(output);
        
                } else { //specific info needed

                    var timeLeft = jsData.messages[commandTerms[1]].endTime - Date.now();
                    var daysLeft = Math.floor(timeLeft / 86400000);
                    var hoursLeft = Math.floor((timeLeft - daysLeft * 86400000) / 3600000);
                    var minutesLeft = Math.floor((timeLeft - (daysLeft * 86400000 + hoursLeft * 3600000)) / 60000);
                    
                   message.channel.send("```\n" +
                   "User: " + client.users.cache.get(jsData.messages[commandTerms[1]].userID).username + "\n" + 
                   "Channel: " + client.channels.cache.get(jsData.messages[commandTerms[1]].channel).name + "\n" + 
                   "Time Left: " + daysLeft + "d " + hoursLeft + "h " + minutesLeft + "m " + "\n" + 
                   "Message: " + jsData.messages[commandTerms[1]].message + "```");
                }
            }
        });

        

        


    }
}