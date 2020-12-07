module.exports = {
    name: 'purge',
    description: 'deletes a specified number of messages',
    execute(message, commandTerms) {
        //checking formatting
        if (commandTerms.length > 2 || commandTerms[1] <= 0) {
            message.channel.send("Improper formatting. Cancelling procedure.");
            message.channel.send("`+purge [numberOfMessagesToDelete]`");
            return;
        } 
            
        //deleting and then sending confirmation
        message.channel.bulkDelete(parseInt(commandTerms[1]) + 1)
        .then(message.channel.send("Deleted " + commandTerms[1] + " messages!"));
    
        //deleting confirmation
        setTimeout(() => {message.channel.bulkDelete(1); }, 5000);
    }
}