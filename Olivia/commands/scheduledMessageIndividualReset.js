module.exports = {
    name: "scheduledMessageIndividualReset",
    description: "wipes an individual message block in the scheduledMessages.json file",
    execute(index) {
        
        const fs = require('fs');
        var defaultJSON;

        fs.readFile('./resources/scheduledMessages.json', 'utf8', (err, data) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return;
            } else {
                defaultJSON = JSON.parse(data);

                defaultJSON.messages[index].used     = false;
                defaultJSON.messages[index].userID   = null;
                defaultJSON.messages[index].channel  = null;
                defaultJSON.messages[index].endTime  = 0;
                defaultJSON.messages[index].message  = null;

                defaultJSON = JSON.stringify(defaultJSON, null, 4);

                fs.writeFile('./resources/scheduledMessages.json', defaultJSON, (err) => {
                    if (err) {
                        console.log("Error");
                        console.log(err);
                        return;
                    }
                })
            }
        });
    }
}