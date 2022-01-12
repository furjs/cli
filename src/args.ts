import mri from 'mri';

const argv = mri(process.argv.slice(2));

export const command: string = argv._[0] ?? null;
export const verbose: boolean = argv.verbose ?? argv.v ?? false;
export default argv;