module.exports = {
    name: 'scheduledMessageManager',
    description: "Manages the scheduledMessages.json file",
    execute(userID, channel, endTime, schMessage) {
        const fs = require('fs');
        var originalMessage;

        fs.readFile('./resources/scheduledMessages.json', 'utf8', (err, data) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return;
            } else {
                originalMessage = JSON.parse(data); //converts data into a JS object (assigned to originalMessage)

                for(var i = 0; originalMessage.messages[i].used; i++);// i = index of unused storage slot
                originalMessage.messages[i].used      = true;
                originalMessage.messages[i].userID    = userID;
                originalMessage.messages[i].channel   = channel;
                originalMessage.messages[i].endTime   = endTime;
                originalMessage.messages[i].message   = schMessage;
                originalMessage = JSON.stringify(originalMessage, null, 4); //converting originalMessage back into JSON format
        
                fs.writeFile('./resources/scheduledMessages.json', originalMessage, (err) => {
                    if (err) {
                        console.log("Error");
                        console.log(err);
                        return;
                    } else {
                        return i;
                    }
                });

            }
        });


    }
}