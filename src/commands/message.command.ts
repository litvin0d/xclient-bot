import type { Bot as TelegramBot } from 'grammy';
import type { IBotContext } from '../context/context.interface.ts';
import { apiService } from '../api/api.service.ts';
import { Command } from './command.class.ts';

export class MessageCommand extends Command {
	constructor(bot: TelegramBot<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.on('message', async (ctx) => {
			const message = ctx.message.text;

			if (!message)
				return await ctx.reply('Бот поддерживает только текстовые сообщения');

			await ctx.replyWithChatAction('typing');

			const prompt = 'Если клиент пришлёт номер договора в формате 00-00-XX (например: 24-24-DEV, 22-22-SUP, 33-334-SEO, 26-02-PPS, 28-29-HOST), то поблагодари за это. Не здоровайся. Будь креативнее. Если его сообщение не будет содержать номер договора, то попроси его отправить номер договора в формате 00-00-XX.';
			const res = await apiService.postText(prompt, message);

			await ctx.reply(res);
		});
	}
}
