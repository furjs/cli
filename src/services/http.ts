import axios from 'axios';
import stream from 'node:stream';
import { promisify } from 'node:util';
import { UserAgent } from '#constants';
import { createWriteStream } from 'node:fs';

import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

export default new class HttpService {
	private readonly _axios: AxiosInstance;

	public constructor() {
		this._axios = axios.create({
			headers: {
				'user-agent': UserAgent.Browser
			}
		});
	};

	public async get(url: string, config: AxiosRequestConfig<any> | undefined = {}): Promise<AxiosResponse<any, any>> {
		return this._axios.get(url, config);
	};

	public async put(url: string, config: AxiosRequestConfig<any> | undefined = {}): Promise<AxiosResponse<any, any>> {
		return this._axios.put(url, config);
	};

	public async post(url: string, config: AxiosRequestConfig<any> | undefined = {}): Promise<AxiosResponse<any, any>> {
		return this._axios.post(url, config);
	};

	public async head(url: string, config: AxiosRequestConfig<any> | undefined = {}): Promise<AxiosResponse<any, any>> {
		return this._axios.head(url, config);
	};

	public async patch(url: string, config: AxiosRequestConfig<any> | undefined = {}): Promise<AxiosResponse<any, any>> {
		return this._axios.patch(url, config);
	};

	public async delete(url: string, config: AxiosRequestConfig<any> | undefined = {}): Promise<AxiosResponse<any, any>> {
		return this._axios.delete(url, config);
	};

	public async downloadFile(url: string, destination: string, config: AxiosRequestConfig<any> | undefined = {}) {
		try {
			const pipeline = promisify(stream.pipeline);
			const res = await this._axios({
				method: 'get',
				url,
				responseType: 'stream',
				...config
			});

			await pipeline(res.data, createWriteStream(destination));
		} catch (err: any) {
			throw new Error(err);
		}
	};
};
