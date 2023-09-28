import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: './build'
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/svelte-youtube' : ''
		},
		alias: {
			$internal: resolve('./src/internal')
		}
	}
};

export default config;
