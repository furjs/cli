import { join } from 'node:path';

/**
 * File paths
 */
export const BASE_PATH = __dirname;
export const DATA_PATH = join(__dirname, 'data');

/**
 * Enums
 */
export const enum UserAgent {
	Bot = 'Fur.JS (depthbomb @ e621, github.com/depthbomb)',
	Browser = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
};
