import log from '#logger';
import prompts from 'prompts';
import auth from '#prompts/auth';
import { join } from 'node:path';
import { AUTH_PATH } from '#constants';
import { writeFile } from 'node:fs/promises';
import { createDir, fileExists } from '#utils';

import type { ICommand } from '#interfaces/ICommand';

/**
 * @internal
 */
interface IE621Data {
	apiKey: string;
};

/**
 * @internal
 */
interface IFurAffinityData {
	a: string;
	b: string;
};

/**
 * @internal
 */
interface IInkBunnyData {
	username: string;
	password: string;
};

/**
 * @internal
 */
type AuthData = IE621Data | IFurAffinityData | IInkBunnyData;

async function _createWarningFile() {
	const warningFile = join(AUTH_PATH, '_warning.txt');

	if (!await fileExists(warningFile)) {
		log.silly('auth', 'Writing warning file to auth directory');
		const warning = [
			'!! WARNING !!',
			'Do not share these files with anyone as they may give access to your account or perform actions on your behalf.'
		].join('\n');
		await writeFile(warningFile, warning, 'utf8');
	}
};

async function _saveAuthFile(service: AuthService, data: AuthData) {
	let fileName: string;
	switch (service) {
		case 'e621':
		case 'e6':
		case 'e926':
		case 'e9':
			fileName = 'auth_e621';
			break;
		case 'furaffinity':
		case 'fa':
			fileName = 'auth_furaffinity';
			break;
		case 'inkbunny':
		case 'ink':
		case 'ib':
			fileName = 'auth_inkbunny';
			break;
	}

	const authData = JSON.stringify(data);
	const authFile = join(AUTH_PATH, `${fileName}.fja`);

	await writeFile(authFile, authData, 'utf8');
	await _createWarningFile();
};

export default {
	name: 'auth',
	description: 'creates an auth file for commands that require authentication',
	arguments: [
		{ name: '<service>', description: 'the service to create an auth file for - e621, furaffinity, or inkbunny' }
	],
	async action(service: AuthService) {
		await createDir(AUTH_PATH);

		log.silly('auth', 'Prompting user');

		const res = <AuthData>await prompts(auth(service), {
			onCancel: () => process.exit(0)
		});

		log.silly('auth', 'Validating response', res);
		
		try {
			await _saveAuthFile(service, res);

			log.info('auth', 'Saved auth file!');
		} catch (err: any) {
			log.error('auth', 'Failed to save auth file');
			log.error('auth', err);
		}
	}
} as ICommand;
