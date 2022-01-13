import log from '#logger';
import urljoin from 'url-join';
import http from '#services/http';
import { createDir} from '#utils';
import { join, resolve } from 'path';
import sanitize from 'sanitize-filename';

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

const YIFFER_API_URL_BASE = 'https://yiffer.xyz/api/comics/' as const;
const YIFFER_IMAGE_URL_BASE = 'https://static.yiffer.xyz/comics/' as const;

export default {
	name: 'yiffer',
	description: 'downloads comic pages from yiffer.xyz',
	aliases: ['xyz', 'yiff'],
	arguments: [
		{ name: '<comic>', description: 'name of the comic, wrap in quotes if it contains spaces' },
		{ name: '[output]', description: 'path to create the comic directory to download pages to', default: './' },
	],
	async action(comicName: string, outputPath: string) {
		outputPath = resolve(outputPath);

		log.info('yiffer', 'Retrieving comic data');
		const comicApiUrl = urljoin(YIFFER_API_URL_BASE, comicName);

		try {
			const { data: comicData } = await http.get(comicApiUrl);
			
			log.info('yiffer', 'Starting download');
	
			const { id, name, numberOfPages } = <IComicData>comicData;
			const folderName = join(outputPath, `${id} - ${sanitize(name)}`);
		
			createDir(folderName);
		
			for (let i = 0; i < numberOfPages; i++) {
				const count = i + 1;
		
				log.info('yiffer', `Downloading page ${count}...`);
		
				const paddedNumber = count.toString().padStart(3, '0');
				const filename = `${paddedNumber}.jpg`;
				const imageUrl = urljoin(YIFFER_IMAGE_URL_BASE, encodeURIComponent(name), filename);
				const imagePath = join(folderName, filename);
		
				try {
					await http.downloadFile(imageUrl, imagePath);
				} catch (err: any) {
					log.error('yiffer', `Unable to download page ${count}`);
					log.error('yiffer', err);
				}
			}
		
			log.info('yiffer', 'Finished download operations');
		} catch (err: any) {
			log.error('yiffer', err);
		};
	}
} as ICommand;
