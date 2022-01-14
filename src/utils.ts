import { Glob } from 'glob';
import { join } from 'node:path';
import prettyBytes from 'pretty-bytes';
import { stat, access, mkdir, readFile } from 'node:fs/promises';

import type { IGlob } from 'glob';

/**
 * Waits
 * @param duration Duration to wait in milliseconds
 */
export async function wait(duration: number) {
	return new Promise(resolve => setTimeout(resolve, duration));
};

/**
 * Returns `true` if the path exists, `false` otherwise
 * @param path Path to the file or directory
 */
export async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch (_) {
		return false;
	}
};

/**
 * Gets file size of a file
 * @param path Path to the file
 */
export async function getFileSize(path: string): Promise<{ 'bytes': number; 'formatted': string; }> {
	try {
		const stats = await stat(path);
		const bytes = stats.size;
		const formatted = prettyBytes(bytes);
		return { bytes, formatted };
	} catch (_) {
		return {
			bytes: 0,
			formatted: ''
		};
	}
};

/**
 * Creates a directory from a string
 * @param directory Directory to create
 */
export async function createDir(directory: string) : Promise<void>;
/**
 * Creates a directory from an array
 * @param directories Array of directories to create
 */
export async function createDir(directories: string[]) : Promise<void>;
/**
 * Creates a directory from a string or multiple directories from an array
 * @param directory Directory to create as a string or an array of directories to create
 */
export async function createDir(directory: string|string[]) : Promise<void> {
	if (Array.isArray(directory)) {
		for (const dir of directory) {
			if (!await fileExists(dir)) await mkdir(dir, { recursive: true });
		}
	} else {
		if (!await fileExists(directory)) await mkdir(directory, { recursive: true });
	}
};

/**
 * Returns a Glob instance with the CWD set to `__dirname`.
 */
export function glob(pattern: string, callback: (err: Error | null, matches: string[]) => void): IGlob {
	return new Glob(pattern, { cwd: __dirname }, (err: Error | null, matches: string[]) => callback(err, matches));
};

/**
 * Gets the currently-installed version via package.json
 */
export async function getInstalledVersion(): Promise<string> {
	const packagePath = join(__dirname, '../', 'package.json');
	const packageContents = await readFile(packagePath, 'utf8');
	const packageJSON = JSON.parse(packageContents);

	return packageJSON.version;
};
