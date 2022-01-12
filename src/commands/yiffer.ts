import ora from 'ora';
import log from '#logger';
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

async function _getComicData(url: string): Promise<IComicData | null> {
	try {
		const { data } = await http.get(url);
		return data;
	} catch (err) {
		log.error('yiffer', 'Error retrieving comic data', err);
		return null;
	}
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

		let progress = ora('Retrieving comic data').start();
		const comicApiUrl = urljoin(YIFFER_API_URL_BASE, comicName);
		const comicData = await _getComicData(comicApiUrl);
	
		if (!comicData) throw new Error('There was a problem fetching comic data');
	
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
				progress = progress.stopAndPersist({ symbol: '✖', text: `Unable to download page ${count}: ${err}` });
			}
		}
	
		progress.succeed(`Finished downloading ${numberOfPages} pages!`);
	}
} as ICommand;
