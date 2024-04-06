import type { Bot as TelegramBot } from 'grammy';
import type { IBotContext } from '../context/context.interface';

export abstract class Command {
	protected constructor(public bot: TelegramBot<IBotContext>) { }

	abstract handle(): void;
}
