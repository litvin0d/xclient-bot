import type { Context, SessionFlavor } from 'grammy';

export interface ISessionData {
	state: 'default' | 'auth' | 'active';
}

export interface IBotContext extends Context, SessionFlavor<ISessionData> {}
