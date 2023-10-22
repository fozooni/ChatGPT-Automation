import {OpenAIAutomationChatBot} from "./OpenAI";

(async () => {
	const openAi = new OpenAIAutomationChatBot();
	try {
		await openAi.startBot();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
})();
