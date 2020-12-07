module.exports = {
    name: "scheduled",
    descriptiom: "prints a list of all currently scheduled messages",
    execute(message, commandTerms, schedulingArrays) {

        //format check
        if (commandTerms.length > 2 || commandTerms[1] > schedulingArrays.length) {
            message.channel.send ("Improper formatting. Cancelling procedure.");
            message.channel.send ("`+scheduled {messageID}`");
            return;
        }

        //user looking for specific message info
        if (commandTerms.length == 2 && commandTerms[1] <= schedulingArrays.length) {

            var timeLeft = schedulingArrays[commandTerms[1]][2] - Date.now();

            var specificOutput = "Information about `Message "      + commandTerms[1] + "`\n\n";

            specificOutput = specificOutput.concat("Message: "      + schedulingArrays[commandTerms[1]][3]   + "\n");
            specificOutput = specificOutput.concat("User: <@"       + schedulingArrays[commandTerms[1]][0]   + ">\n");
            specificOutput = specificOutput.concat("Channel: "      + schedulingArrays[commandTerms[1]][1]   + "\n");
            specificOutput = specificOutput.concat("Time Left: "    + timeLeft                               + " ms\n");
        
            message.channel.send(specificOutput);
        }

        //user not looking for specific message info
        if (commandTerms.length == 1) {
            var overviewOutput = "**Scheduled Messages:**\n\n---\n";

            for(var i = 0; i < schedulingArrays.length; i++) {
                overviewOutput = overviewOutput.concat("`Message " + i + "` " + schedulingArrays[i][3] + "\n---\n"); //message
            }

            message.channel.send(overviewOutput);
        }
    }
}