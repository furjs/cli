import log from '#logger';
import { gt } from 'semver';
import { join } from 'node:path';
import { request } from '@octokit/request';
import { readFile } from 'node:fs/promises';

import type { ICommand } from '#interfaces/ICommand';

async function _getInstalledTag() {
	const packagePath = join(__dirname, '../', '../', 'package.json');
	const packageContents = await readFile(packagePath, 'utf8');
	const packageJSON = JSON.parse(packageContents);

	return packageJSON.version;
};

export default {
	name: 'update',
	description: 'checks for updates to Fur.JS',
	aliases: ['upd', 'up'],
	async action() {
		const installedTag = await _getInstalledTag();
		const { data: release } = await request('GET /repos/{owner}/{repo}/releases/latest', {
			owner: 'furjs',
			repo: 'cli'
		});
		if (gt(release.tag_name, installedTag)) {
			log.info('update', `A new version of Fur.JS is available to download: ${release.name}`);
			if (release.body) {
				log.info('update', release.body);
			}
			log.info('update', 'Run `npm i -g @furjs/cli@latest` or `yarn global add @furjs/cli@latest` to update.');
		} else {
			log.info('update', 'You are using the latest version of Fur.JS!');
		}
	}
} as ICommand;
