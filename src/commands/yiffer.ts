import log from '#logger';
import urljoin from 'url-join';
import http from '#services/http';
import { join, resolve } from 'path';
import prettyBytes from 'pretty-bytes';
import sanitize from 'sanitize-filename';
import { createDir, fileExists, getFileSize } from '#utils';

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
	options: [
		{ name: '--overwrite', description: 'whether to overwrite existing comic pages when downloading' }
	],
	async action(comicName: string, outputPath: string, options: any) {
		const { overwrite } = options;
		outputPath = resolve(outputPath);

		const comicApiUrl = urljoin(YIFFER_API_URL_BASE, comicName);
		try {
			log.silly('yiffer', 'Retrieving comic data');

			const { data: comicData } = await http.get(comicApiUrl);
			
			log.silly('yiffer', 'Starting download');
	
			const { id, name, numberOfPages } = <IComicData>comicData;
			const folderName = join(outputPath, `${id} - ${sanitize(name)}`);
		
			await createDir(folderName);
		
			let downloaded = 0;
			let totalBytes = 0;
			for (let i = 0; i < numberOfPages; i++) {
				const count = i + 1;
				const paddedNumber = count.toString().padStart(3, '0');
				const filename = `${paddedNumber}.jpg`;
				const imageUrl = urljoin(YIFFER_IMAGE_URL_BASE, encodeURIComponent(name), filename);
				const imagePath = join(folderName, filename);
		
				try {
					const pageExists = await fileExists(imagePath);
					if (!pageExists || overwrite) {
						await http.downloadFile(imageUrl, imagePath);
						const { bytes, formatted } = await getFileSize(imagePath);
						downloaded++;
						totalBytes += bytes;
						log.info('yiffer', 'Downloaded page', count, `(${formatted})`);
					} else {
						log.info('yiffer', 'Skipping page', count, 'because it already exists');
					}
				} catch (err: any) {
					log.error('yiffer', 'Unable to download page', count);
					log.error('yiffer', err);
				}
			}
		
			if (downloaded > 0) {
				log.info('yiffer', 'Finished downloading', downloaded, 'pages', `(${prettyBytes(totalBytes)})`);
			} else {
				log.info('yiffer', 'Nothing was downloaded');
			}
		} catch (err: any) {
			log.error('yiffer', err);
		};
	}
} as ICommand;
