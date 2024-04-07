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
			if (ctx.session.state === 'default')
				return await ctx.reply('Укажите являетесь ли вы клиентом.');

			if (ctx.session.state === 'active')
				return await ctx.reply('Спасибо, что выбрали нас.');

			const message = ctx.message.text;

			if (!message)
				return await ctx.reply('Бот поддерживает только текстовые сообщения.');

			await ctx.replyWithChatAction('typing');

			const prompt = 'Клиент может прислать номер договора (номер выглядит примерно так: 24-24-DEV, 22-22-SUP, 33-334-SEO, 26-02-PPS, 28-29-HOST), если договор был прислан, то ты должен поблагодарить клиента за это (например: Благодарю за номер договора.). Запрещается после того как клиент отправил номер договора здороваться с клиентом.';
			const res = await apiService.postText(prompt, message);

			await ctx.reply(res);

			ctx.session.state = 'active';
		});
	}
}
