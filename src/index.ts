#!/usr/bin/env node
import 'source-map-support/register';

import log from '#logger';
import { Command } from 'commander';
import { glob, getInstalledVersion } from '#utils';

import type { ICommand } from '#interfaces/ICommand';

async function loadCommands(fur: Command): Promise<void> {
	return new Promise((resolve, reject) => {
		glob('./commands/*.js', async (err: Error | null, files: string[]) => {
			if (err) reject(err);
			for (const file of files) {
				const imported = (await import(file)).default as ICommand;
				const command = fur.command(imported.name).description(imported.description).action(imported.action);
		
				if (imported.aliases) command.aliases(imported.aliases);
				if (imported.arguments) imported.arguments.map(arg => command.argument(arg.name, arg.description, arg.default));
				if (imported.options) imported.options.map(opt => command.option(opt.name, opt.description, opt.default));
			}

			resolve();
		});
	});
};

(async () => {
	const version = await getInstalledVersion();
	const fur = (new Command())
		.name('fur')
		.version(version, '-v, --version', 'returns the current version')
		.option('--silly', 'enables verbose logging', false)
		.enablePositionalOptions()
		.showHelpAfterError()
		.showSuggestionAfterError();

	fur.on('option:silly', () => log.level = 'silly');

	let exitCode = 0;
	try {
		await loadCommands(fur);
		await fur.parseAsync(process.argv);
	} catch (err: any) {
		log.error('Bootstrapper', err);
		exitCode = 1;
	} finally {
		process.exit(exitCode);
	}
})();
