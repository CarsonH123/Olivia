module.exports = {
    name: "scheduledMessageReset",
    description: "resets the scheduledMessages JSON file back to normal",
    execute(message) {
        const fs = require('fs');

        var defaultJSON;

        fs.readFile('./resources/scheduledMessages.json', 'utf8', (err, data) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return;
            } else {
                defaultJSON = JSON.parse(data); //converts data into JS object

                for (var i = 0; i < 10; i++) {
                    defaultJSON.messages[i].used = false;
                    defaultJSON.messages[i].userID = null;
                    defaultJSON.messages[i].channel = null;
                    defaultJSON.messages[i].endTime = 0;
                    defaultJSON.messages[i].message = null;
                }

                defaultJSON = JSON.stringify(defaultJSON, null, 4); //convert defaultJSON back into JSON format

                fs.writeFile('./resources/scheduledMessages.json', defaultJSON, (err) => {
                    if (err) {
                        console.log("Error");
                        console.log(err);
                        return;
                    }
                });
                message.channel.send("All scheduled messages reset.");
            }
        });
    }
}