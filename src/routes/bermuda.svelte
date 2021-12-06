<script context="module">
	export const prerender = true;

	import Berfamily from '../component/Bermuda/Berfamily.svelte';
	import National from '../component/Bermuda/National.svelte';
	import Berstate from '../component/Bermuda/Berstate.svelte';
</script>

<svelte:head>
	<title>Bermuda</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1608290955/bermuda-flag_rgvbdd.png"
				alt="image of Bermuda flag"
			/>
		</div>

		Bermuda Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Berfamily />
		<National />
		<Berstate />
	</div>
</section>
