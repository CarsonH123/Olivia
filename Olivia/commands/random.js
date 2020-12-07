module.exports = {
	name: 'random',
	description: 'random',
	execute(message, commandTerms){
		
		//checking formatting, else assigning vars
		if(commandTerms.length != 3 || parseInt(commandTerms[1]) < 0 || parseInt(commandTerms[2] < 0) || commandTerms[1] >= commandTerms[2]) {
			message.channel.send("Improper formatting. Cancelling procedure.");
			message.channel.send("`+random [min] [max]`");
			return;
		}else {
			var min = parseInt(commandTerms[1]);
			var max = parseInt(commandTerms[2]);
		}	
		
		console.log("Max: " + max);
		console.log("Min: " + min);

		//sending message
		message.channel.send(Math.floor(Math.random() * (max - min)) + min);	//fix this
	}
}