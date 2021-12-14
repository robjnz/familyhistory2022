<script context="module">
	export const prerender = true;

	import Intelius99 from '../component/Usa/Intelius99.svelte';
	import Step99 from '../component/Usa/Step99.svelte';
	import Usstate from '../component/Usa/Usstate.svelte';
	import Wargraves from '../component/Usa/Wargraves.svelte';
	import Brooklyn from '../component/Usa/Brooklyn.svelte';
	import Nyarchives from '../component/Usa/Nyarchives.svelte';
	import Ellis from '../component/Usa/Ellis.svelte';
	import York from '../component/Usa/York.svelte';
	import Nyindex from '../component/Usa/Nyindex.svelte';
</script>

<svelte:head>
	<title>USA</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639389123/webp/american-flag.webp"
				alt="image of USA flag"
			/>
		</div>

		USA Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Intelius99 />
			<Step99 />
			<Usstate />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Wargraves />
		</div>
		<h2 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
			New York
		</h2>

		<div class="grid sm:flex gap-4 mt-8">
			<Brooklyn />
			<Nyarchives />
			<Ellis />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<York />
			<Nyindex />
		</div>
	</section>
</section>
