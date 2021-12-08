<script context="module">
	export const prerender = true;

	import Latin from '../component/Russian/Latin.svelte';
	import Cursive from '../component/Russian/Cursive.svelte';
	import Family from '../component/Russian/Family.svelte';
	import Forebears from '../component/Russian/Forebears.svelte';
	import War from '../component/Russian/War.svelte';
	import Leningrad from '../component/Russian/Leningrad.svelte';
	import Lost from '../component/Russian/Lost.svelte';
	import Awards from '../component/Russian/Awards.svelte';
	import Memorial from '../component/Russian/Memorial.svelte';
	import Soviet from '../component/Russian/Soviet.svelte';
	import Stalingrad from '../component/Russian/Stalingrad.svelte';
	import First from '../component/Russian/First.svelte';
</script>

<svelte:head>
	<title>Russian</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638945399/webp/russian-flag.webp"
				alt="image of Russian flag"
			/>
		</div>

		Russian Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Latin />
			<Cursive />
			<Family />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Forebears />
			<War />
			<Leningrad />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Lost />
			<Awards />
			<Memorial />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<First />
			<Soviet />
			<Stalingrad />
		</div>
	</section>
</section>
