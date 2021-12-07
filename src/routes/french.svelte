<script context="module">
	export const prerender = true;

	import Naturalisation from '../component/French/Naturalisation.svelte';
	import Fstate from '../component/French/Fstate.svelte';
</script>

<svelte:head>
	<title>French</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638892550/webp/french-flag.webp"
				alt="image of French flag"
			/>
		</div>

		French Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Naturalisation />
			<Fstate />
		</div>
	</section>
</section>
