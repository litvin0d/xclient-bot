import type { Bot as TelegramBot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import type { IBotContext } from '../context/context.interface';
import { apiService } from '../api/api.service.ts';
import { Command } from './command.class';

export class StartCommand extends Command {
	constructor(bot: TelegramBot<IBotContext>) {
		super(bot);
	}

	handle(): void {
		const startKeyboard = new InlineKeyboard()
			.text('Хочу стать клиентом', 'become_client').row()
			.text('Я уже смешарик', 'already_client');

		this.bot.command('start', async (ctx) => {
			ctx.session.state = 'default';

			await ctx.replyWithChatAction('typing');

			const prompt = 'Ответь на запрос "/start" вот так: Привет! Я — ваш персональный ИИ-ассистент из команды IT-компании X. Можешь использовать другие слова, но главное передать тот же смысл и обязательно указать, что ты ИИ-ассистент из IT-компании X. Будь очень краток и креативен. Не говори как тебя зовут.';
			const res = await apiService.postText(prompt, '/start');

			await ctx.reply(res, {
				reply_markup: startKeyboard,
			});
		});

		this.bot.callbackQuery('become_client', async (ctx) => {
			await ctx.answerCallbackQuery();

			ctx.session.state = 'default';

			await ctx.replyWithChatAction('typing');

			const prompt = 'Ответь на запрос "Хочу стать клиентом" просьбой обратиться к менеджеру и предоставь контакт менеджера: @litvinod. Будь креативнее. Пример: Для этого свяжитесь, пожалуйста, с нашим менеджером — @litvinod.';
			const res = await apiService.postText(prompt, 'Хочу стать клиентом');

			await ctx.reply(res);
		});

		this.bot.callbackQuery('already_client', async (ctx) => {
			await ctx.answerCallbackQuery();
			ctx.session.state = 'auth';

			await ctx.replyWithChatAction('typing');

			const prompt = 'Ответь на запрос "Я уже клиент" просьбой написать номер договора. Не здоровайся. Будь креативнее. Пришлите, пожалуйста, номер договора.';
			const res = await apiService.postText(prompt, 'Я уже клиент');

			await ctx.reply(res);
		});
	}
}
