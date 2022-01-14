import { join } from 'node:path';

/**
 * File paths
 */
export const BASE_PATH = __dirname;
export const DATA_PATH = join(process.env.APPDATA ||
	(process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share'),
	'Caprine Logic',
	'Fur.JS'
);
export const AUTH_PATH = join(DATA_PATH, 'auth');

/**
 * Enums
 */
export const enum UserAgent {
	Bot = 'Fur.JS (depthbomb on e621, github.com/furjs)',
	Browser = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
};
