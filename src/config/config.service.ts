import { type DotenvParseOutput, config } from 'dotenv';
import type { IConfigService } from './config.interface';

class ConfigService implements IConfigService {
	private static instance: ConfigService;
	private readonly config: DotenvParseOutput;

	constructor() {
		const { error, parsed } = config();

		if (error)
			throw new Error('No .env file found');

		if (!parsed)
			throw new Error('Empty .env file');

		this.config = parsed;
	}

	static getInstance(): ConfigService {
		if (!ConfigService.instance)
			ConfigService.instance = new ConfigService();

		return ConfigService.instance;
	}

	get(key: string): string {
		const res = this.config[key];

		if (!res)
			throw new Error(`No key found: ${key}`);

		return res;
	}
}

export const configServiceInstance = ConfigService.getInstance();
