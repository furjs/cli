import { Glob } from 'glob';
import { existsSync, mkdirSync } from 'fs';

import type { IGlob } from 'glob';

/**
 * Waits
 * @param duration Duration to wait in milliseconds
 */
export async function wait (duration: number) {
	return new Promise(resolve => setTimeout(resolve, duration));
};

/**
 * Creates a directory from a string
 * @param directory Directory to create
 */
export function createDir (directory: string) : void;
/**
 * Creates a directory from an array
 * @param directories Array of directories to create
 */
export function createDir (directories: string[]) : void;
/**
 * Creates a directory from a string or multiple directories from an array
 * @param directory Directory to create as a string or an array of directories to create
 */
export function createDir (directory: string|string[]) : void {
	if (Array.isArray(directory)) {
		for (const dir of directory) {
			if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
		}
	} else {
		if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
	}
};

/**
 * Returns a Glob instance with the CWD set to `__dirname`.
 */
 export function glob(pattern: string, callback: (err: Error | null, matches: string[]) => void): IGlob {
	return new Glob(pattern, { cwd: __dirname }, (err: Error | null, matches: string[]) => callback(err, matches));
};
