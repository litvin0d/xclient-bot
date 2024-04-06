import { Bot as TelegramBot, session } from 'grammy';
import { configServiceInstance } from './config/config.service';
import type { IConfigService } from './config/config.interface';
import type { IBotContext, ISessionData } from './context/context.interface';
import type { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';

class Bot {
	bot: TelegramBot<IBotContext>;

	commands: Command[] = [];

	constructor(private readonly configService: IConfigService) {
		this.bot = new TelegramBot<IBotContext>(this.configService.get('TELEGRAM_BOT_TOKEN'));
		this.bot.use(session({ initial: (): ISessionData => ({ state: 'default' }) }));
	}

	init() {
		this.commands = [new StartCommand(this.bot)];

		for (const command of this.commands)
			command.handle();

		this.bot.start();
	}
}

const bot = new Bot(configServiceInstance);
bot.init();
