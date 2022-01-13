import ora from 'ora';
import urljoin from 'url-join';
import http from '#services/http';
import { createDir} from '#utils';
import { join, resolve } from 'path';
import sanitize from 'sanitize-filename';
import { YIFFER_API_URL_BASE, YIFFER_IMAGE_URL_BASE } from '#constants';

import type { ICommand } from '#interfaces/ICommand';

/**
 * @internal
 */
interface IComicData {
	name: string,
	numberOfPages: number,
	artist: string,
	id: number,
	cat: string,
	tag: string,
	created: Date,
	updated: Date,
	yourRating: number | null,
	userRating: number,
	keywords: string[],
	previousComic: string | null,
	nextComic: string | null,
};

export default {
	name: 'yiffer',
	description: 'downloads comic pages from yiffer.xyz',
	aliases: ['xyz', 'yiff'],
	arguments: [
		{ name: '<comic>', description: 'name of the comic, wrap in quotes if it contains spaces' },
		{ name: '[output]', description: 'path to create the comic directory to download pages to, defaults to the CWD', default: './' },
	],
	async action(comicName: string, outputPath: string) {
		outputPath = resolve(outputPath);

		const progress = ora('Retrieving comic data').start();
		const comicApiUrl = urljoin(YIFFER_API_URL_BASE, comicName);

		try {
			const { data: comicData } = await http.get(comicApiUrl);
			progress.text = 'Starting download';
	
			const { id, name, numberOfPages } = comicData;
			const folderName = join(outputPath, `${id} - ${sanitize(name)}`);
		
			createDir(folderName);
		
			for (let i = 0; i < numberOfPages; i++) {
				const count = i + 1;
		
				progress.text = `Downloading page ${count}...`;
		
				const paddedNumber = count.toString().padStart(3, '0');
				const filename = `${paddedNumber}.jpg`;
				const imageUrl = urljoin(YIFFER_IMAGE_URL_BASE, encodeURIComponent(name), filename);
				const imagePath = join(folderName, filename);
		
				try {
					await http.downloadFile(imageUrl, imagePath);
				} catch (err: any) {
					progress.stopAndPersist({ symbol: '✖', text: `Unable to download page ${count}: ${err}` });
				}
			}
		
			progress.succeed(`Finished downloading ${numberOfPages} pages!`);
		} catch (err: any) {
			progress.fail(err.response.data);
		};
	}
} as ICommand;
