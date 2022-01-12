import 'reflect-metadata';
import 'source-map-support/register';

import log from '#logger';
import { glob } from '#utils';
import { Command } from 'commander';

import type { ICommand } from '#interfaces/ICommand';

const fur = (new Command()).name('fur').version('0.1.0', '-v, --version', 'returns the current version');

glob('./commands/*.js', async (err: Error | null, files: string[]) => {
	for (const file of files) {
		const imported = (await import(file)).default as ICommand;
		const command = fur.command(imported.name).description(imported.description).action(imported.action);

		if (imported.aliases) command.aliases(imported.aliases);
		if (imported.arguments) {
			for (const arg of imported.arguments) {
				command.argument(arg.name, arg.description, arg.default);
			}
		}

		if (imported.options) {
			for (const opt of imported.options) {
				command.argument(opt.name, opt.description, opt.default);
			}
		}
	}

	fur.parse(process.argv);
});
