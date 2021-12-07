<script context="module">
	export const prerender = true;

	import Bmd from '../component/British/Bmd.svelte';
	import Children from '../component/British/Children.svelte';
	import Companies from '../component/British/Companies.svelte';
	import Electoral from '../component/British/Electoral.svelte';
	import Directories from '../component/British/Directories.svelte';
	import Industral from '../component/British/Industral.svelte';
	import Gazette from '../component/British/Gazette.svelte';
	import Newspaper from '../component/British/Newspaper.svelte';
	import Raf from '../component/British/Raf.svelte';
	import Navy from '../component/British/Navy.svelte';
	import Britstate from '../component/British/Britstate.svelte';
	import Graves from '../component/British/Graves.svelte';
	import Wills from '../component/British/Wills.svelte';
	import Workhouse from '../component/British/Workhouse.svelte';
	import Thirtynine from '../component/British/Thirtynine.svelte';
	import Scotland from '../component/British/Scotland.svelte';
</script>

<svelte:head>
	<title>British</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864273/webp/uk-flag.webp"
				alt="image of British flag"
			/>
		</div>

		British Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Bmd />
			<Children />
			<Companies />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Electoral />
			<Directories />
			<Industral />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Gazette />
			<Newspaper />
			<Raf />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Navy />
			<Britstate />
			<Graves />
		</div>
		<div class="grid sm:flex gap-4 mt-8">
			<Wills />
			<Workhouse />
			<Thirtynine />
		</div>
		<br />

<h2 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878880/webp/scotish-flag.webp"
				alt="image of Scottish flag"
			/>
		</div>

		Scottish Family History Resourses
	</h2>

		<div class="grid sm:flex gap-4 mt-8">
			<Scotland />
		</div>
	</section>
</section>
