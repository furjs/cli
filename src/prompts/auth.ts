import type { PromptObject } from 'prompts';

export default (service: AuthService) => {
	let prompt: PromptObject<any>[];
	switch (service) {
		case 'e621':
		case 'e6':
		case 'e926':
		case 'e9':
			prompt = [
				{
					type: 'text',
					name: 'apiKey',
					message: 'Enter your E621/E926 API key as found at Account > Manage API Access',
					validate: v => v.trim().length !== 24 ?
						'e621 API keys are typically 24 characters long, if this is NOT the case then please open an issue' :
						true
				}
			];
			break;
		case 'furaffinity':
		case 'fa':
			prompt = [
				{
					type: 'text',
					name: 'cookieA',
					message: 'Enter your FurAffinity "a" cookie',
					validate: v => v.trim().length !== 36 ?
						'Cookie value is an invalid length' :
						true
				},
				{
					type: 'text',
					name: 'cookieB',
					message: 'Enter your FurAffinity "b" cookie',
					validate: v => v.trim().length !== 36 ?
						'Cookie value is an invalid length' :
						true
				}
			];
			break;
		case 'inkbunny':
		case 'ink':
		case 'ib':
			prompt = [
				{
					type: 'text',
					name: 'username',
					message: 'Enter your InkBunny username',
					initial: 'AzureDiamond'
				},
				{
					type: 'password',
					name: 'password',
					message: 'Enter your InkBunny password',
					initial: 'hunter2'
				}
			];
			break;
	}

	return prompt;
};
