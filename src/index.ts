#!/usr/bin/env node

import 'source-map-support/register';

import log from '#logger';
import { glob } from '#utils';
import { Command } from 'commander';

import type { ICommand } from '#interfaces/ICommand';

const fur = (new Command())
	.name('fur')
	.version('0.1.0', '-v, --version', 'returns the current version')
	.showHelpAfterError()
	.showSuggestionAfterError();

async function loadCommands(): Promise<void> {
	return new Promise((resolve, reject) => {
		glob('./commands/*.js', async (err: Error | null, files: string[]) => {
			if (err) reject(err);
			for (const file of files) {
				const imported = (await import(file)).default as ICommand;
				const command = fur.command(imported.name).description(imported.description).action(imported.action);
		
				if (imported.aliases) command.aliases(imported.aliases);
				if (imported.arguments) imported.arguments.map(arg => command.argument(arg.name, arg.description, arg.default));
				if (imported.options) imported.options.map(opt => command.argument(opt.name, opt.description, opt.default));
			}

			resolve();
		});
	});
};

loadCommands()
	.then(async () => await fur.parseAsync(process.argv))
	.catch((err: any) => log.error('Bootstrapper', err))
