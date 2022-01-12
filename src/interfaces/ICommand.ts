interface ICommandArgumentsOrOptions {
	name: string;
	description: string;
	default?: any;
};

export interface ICommand {
	name: string;
	description: string;
	aliases?: string[];
	arguments?: ICommandArgumentsOrOptions[];
	options?: ICommandArgumentsOrOptions[];
	action(...args: any): Promise<void>;
};
