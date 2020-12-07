module.exports = {
    name: 'help',
    description: 'lists commands',
    execute(message, commandTerms) {

        //var def
        var commandList = [
            ["schedule", "Allows you to schedule messages to be sent after a certain amount of time passes"],
            ["random", "Generates a random number between the specified minimum and maximum"],
            ["purge", "Deletes the specified number of messages in the channel where the command was issued"],
        ]

        var commandListOutput = "```\nCommands:\n\n";

        //format checking
        if (commandTerms.length > 2) {
            message.channel.send("Improper formatting. Cancelling procedure.");
            message.channel.send("`+help {command}`");
            return;
        } else {
            var command = commandTerms[1];
        }

        //all available command descriptions
        switch (command) {
            case 'schedule':
                message.author.send("```\nThe Schedule Command: \n---\n!schedule {text channel} [days]d [hours]h [minutes]m [message]\n---\n" + 
                "Can be used to schedule various messages to be sent out after a certain time period passes. Limited to a maximum of 14d 23h 59m.```");
            break;
            case 'random':
                message.author.send("```\nThe Random Command: \n---\n!random [min] [max]\n---\n" + 
                "Will generate a random number between the specified minimum and maximum (inclusive).```");
            break;
            case 'purge':
                message.author.send("```\nThe Purge Command: \n---\n!purge [numberOfMessagesToDelete]\n---\n" + 
                "Will delete a number of messages equal to the specified amount in the channel it is called in.```");
            break;
            case 'setup':
                message.author.send("```\nInitial Bot Setup: \n\n" + 
                "There are some restricted commands only usable by users with a role titled \"Operator\"\n---\n" +
                "Resticted commands: ?purge```");
            break;
            default:
                for(var i = 0; i < commandList.length; i++) {
                    commandListOutput = commandListOutput.concat(commandList[i][0] + ": ");
                    commandListOutput = commandListOutput.concat(commandList[i][1]);
                    commandListOutput = commandListOutput.concat("\n");
                }
                commandListOutput = commandListOutput.concat("```")
                message.author.send(commandListOutput);
            break;
        }
    }
    
}