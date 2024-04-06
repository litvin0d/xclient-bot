import type { Bot as TelegramBot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import type { IBotContext } from '../context/context.interface';
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
			await ctx.reply(
				'Привет! Я — ваш персональный ИИ-ассистент из команды IT-компании X.',
				{
					reply_markup: startKeyboard,
				},
			);
		});

		this.bot.callbackQuery('become_client', async (ctx) => {
			await ctx.answerCallbackQuery();
			await ctx.reply('Очень приятно! Для этого свяжитесь, пожалуйста, с нашим менеджером — @litvinod.');
		});

		this.bot.callbackQuery('already_client', async (ctx) => {
			await ctx.answerCallbackQuery();
			ctx.session.state = 'auth';
			await ctx.reply('Супер! Отправьте мне, пожалуйста, номер вашего договора.');
		});
	}
}
