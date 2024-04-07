import { GrammyError, HttpError, Bot as TelegramBot, session } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { configServiceInstance } from './config/config.service';
import type { IConfigService } from './config/config.interface';
import type { IBotContext, ISessionData } from './context/context.interface';
import type { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { MessageCommand } from './commands/message.command.ts';

class Bot {
	bot: TelegramBot<IBotContext>;

	commands: Command[] = [];

	constructor(private readonly configService: IConfigService) {
		this.bot = new TelegramBot<IBotContext>(this.configService.get('TELEGRAM_BOT_TOKEN'));
		this.bot.use(session({ initial: (): ISessionData => ({ state: 'default' }) }));
		this.bot.api.config.use(autoRetry({
			maxRetryAttempts: 1,
			maxDelaySeconds: 5,
		}));

		this.bot.catch((err) => {
			const ctx = err.ctx;
			console.error(`Error while handling update ${ctx.update.update_id}:`);

			const e = err.error;
			if (e instanceof GrammyError)
				console.error('Error in request:', e.description);
			else if (e instanceof HttpError)
				console.error('Could not contact Telegram:', e);
			else
				console.error('Unknown error:', e);
		});
	}

	init() {
		this.commands = [new StartCommand(this.bot), new MessageCommand(this.bot)];

		for (const command of this.commands)
			command.handle();

		this.bot.start();
	}
}

const bot = new Bot(configServiceInstance);
bot.init();
