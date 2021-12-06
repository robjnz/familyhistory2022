<script context="module">
	export const prerender = true;

	import Birth from '../component/British/birth.svelte';
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
</script>

<svelte:head>
	<title>British</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638803290/uk-flag_f5im0i.jpg"
				alt="image of British flag"
			/>
		</div>

		British Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Birth />
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
	</section>
</section>
