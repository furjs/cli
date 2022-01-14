import log from '#logger';
import { gt } from 'semver';
import { request } from '@octokit/request';
import { getInstalledVersion } from '#utils';

import type { ICommand } from '#interfaces/ICommand';

export default {
	name: 'update',
	description: 'checks for updates to Fur.JS',
	aliases: ['upd', 'up'],
	async action() {
		log.info('update', 'Checking for new releases');
		log.silly('update', 'Grabbing installed version from package.json');

		const installedTag = await getInstalledVersion();

		log.silly('update', 'Got version', installedTag);
		log.silly('update', 'Sending request');

		const { data: release } = await request('GET /repos/{owner}/{repo}/releases/latest', { owner: 'furjs', repo: 'cli' });

		log.silly('update', 'Latest release tag =',  release.tag_name);

		if (gt(release.tag_name, installedTag)) {
			log.info('update', `A new version of Fur.JS is available to download:`, release.name);
			if (release.body) {
				log.info('update', release.body);
			}
			log.info('update', 'Run `npm i -g @furjs/cli@latest` or `yarn global add @furjs/cli@latest` to update.');
		} else {
			log.info('update', 'You are using the latest version of Fur.JS!');
		}
	}
} as ICommand;
