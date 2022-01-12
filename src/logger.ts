import { red, gray, blue, bold } from 'colorette';

function _getDatePrefix(): string {
	const now = new Date();
	return gray(`[${now}]`);
};

export default {
	info(...args: any[]) {
		console.log(_getDatePrefix(), bold(blue('INF')), ...args);
	},

	error(...args: any[]) {
		console.log(_getDatePrefix(), bold(red('ERR')), ...args);
	},
};
