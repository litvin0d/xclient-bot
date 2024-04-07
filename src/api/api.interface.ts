export interface IApiInterface {
	postText: (prompt: string, trigger: string, temp: number) => Promise<string>;
	getDocument: (message: string) => Promise<string>;
}
