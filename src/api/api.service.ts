import axios from 'axios';
import type { IConfigService } from '../config/config.interface.ts';
import { configServiceInstance } from '../config/config.service.ts';
import type { IApiInterface } from './api.interface.ts';

export class ApiService implements IApiInterface {
	private static instance: ApiService;

	constructor(private readonly configService: IConfigService) {}

	static getInstance(): ApiService {
		if (!ApiService.instance)
			ApiService.instance = new ApiService(configServiceInstance);

		return ApiService.instance;
	}

	async postText(prompt: string, trigger: string, temp: number = 0.7): Promise<string> {
		const data = {
			modelUri: this.configService.get('YANDEX_GPT_MODEL'),
			completionOptions: {
				stream: false,
				temperature: temp,
				maxTokens: '500',
			},
			messages: [
				{
					text: prompt,
					role: 'system',
				},
				{
					text: trigger,
					role: 'user',
				},
			],
		};

		const url = this.configService.get('YANDEX_GPT_ENDPOINT');
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Api-Key ${this.configService.get('YANDEX_GPT_KEY')}`,
		};

		try {
			const response = await axios.post(url, data, { headers });
			const result = response.data.result;
			return result.alternatives[0].message.text;
		}
		catch (error) {
			console.error('Ошибка запроса:', error);
			return 'Ошибка запроса.';
		}
	}

	async getDocument(message: string): Promise<string> {
		const data = {
			modelUri: this.configService.get('YANDEX_GPT_MODEL'),
			completionOptions: {
				stream: false,
				temperature: 0.5,
				maxTokens: '500',
			},
			messages: [
				{
					text: 'Ты отвечаешь от лица мужского рода. \nТы помощник компании X. \nТы говоришь на темы касающиеся помощи клиентам \n \nТвое предназначение – помогать людям предоставляя данные которые они запрашивают.\nТы отвечаешь за помощь людям, предоставляя необходимые данные. \nТы должен предоставить данные из  ячейки СКАН_ССЫЛКА в зависимости от запроса пользователя. Пользователь предосавляет данные по нескольким или одному признаку и ты должен в соответствии с данными подобрать нужную строчку и вывести информацию из ячейки столбца СКАН_ССЫЛКА этой строки, который ищет пользователь. Пользователь может предоставить: Тип документа, РМ, Номер, Дату, Сумма а также название компании в основном на английском. \nВот примерные данные: столбец с компаниями - содержит(Xpage, Gigaschool, People DO, Napoleon IT, Gigaschool), столбец РМ содержит(Бодрягин, Трухачева, Бодрягин, Трухачева, Бодрягин), столбец Тип документа содержит(Договор, Доп. соглашение, Договор, Договор, Доп. соглашения), столбец Номер содержит(24-24-DEV, -, 33-334-SEO, 26-02-PPS, -), столбец Дата содержит(10.01.2024, 10.01.2023, 11.11.2024, 01.01.2024, 02.01.2024), столбец Доп. Согл. к какому договору содержит(-, 22-22-SUP, -, -, 28-29-HOST), столбец тип услуги (Разработка сайта, Тех.под, Продвижение сайта SEO (г.Челябинск), Контекстная реклама Яндекс.Директ, хостинг), столбец сумма(руб) содержит(р.1000000, р.500000, р.100000, р.150000, р.80000), столбец СКАН содержит(Договор 24-24-DEV // TEST, Доп. соглашение к договору 22-22-SUP // TEST, Договор 33-334-SEO // TEST, Договор 26-02-PPS // TEST, Договор 26-02-PPS // TEST), столбец СКАН_ССЫЛКА содержит(https://docs.google.com/document/d/1N7o3KVimhMM2dhQnnMQHQlUd3eEl4ZF0hGmaPkMFBwY/edit, https://docs.google.com/document/d/1CWXV676b5LqeuwTUjBjVB2Bbhq_dNTTgE0DvTP9gyqQ/edit, https://docs.google.com/document/d/1ONVki06B4HLi9A56GXX5XKNj5f56x9om8J_fqfMabEM/edit, https://docs.google.com/document/d/1MuMWPAbj_u6og-_-Yb4vDyqW8cGcCqaDCrTAtgj8lpo/edit, https://docs.google.com/document/d/1d_rqJ6oAXKfOa5axLuCRcHqK_vSuu_GlO5i5Bbl44fs/edit), \n Если ответ задан не по теме, ты должен ответить, что это не входит в твои обязанности',
					role: 'system',
				},
				{
					text: 'Мне нужен договор 10.01.2024',
					role: `${message}`,
				},
			],
		};

		const url = this.configService.get('YANDEX_GPT_ENDPOINT');
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Api-Key ${this.configService.get('YANDEX_GPT_KEY')}`,
		};

		try {
			const response = await axios.post(url, data, { headers });
			const result = response.data.result;
			return result.alternatives[0].message.text;
		}
		catch (error) {
			console.error('Ошибка запроса:', error);
			return 'Ошибка запроса.';
		}
	}
}

export const apiService = ApiService.getInstance();
