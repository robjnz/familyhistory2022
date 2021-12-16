import { windi } from 'svelte-windicss-preprocess';
import vercel from '@sveltejs/adapter-vercel';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [windi({})],
	kit: {
		adapter: vercel(), // currently the adapter does not take any options
		target: '#svelte'
	}
};

export default config;
