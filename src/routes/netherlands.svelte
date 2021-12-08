<script context="module">
	export const prerender = true;

	import Amsterdam from '../component/Netherlands/Amsterdam.svelte';
	import Roots from '../component/Netherlands/Roots.svelte';
	import Open from '../component/Netherlands/Open.svelte';
	import Wie from '../component/Netherlands/Wie.svelte';
</script>

<svelte:head>
	<title>Netherlands</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638904035/webp/netherlands-flag.webp"
				alt="image of netherlands flag"
			/>
		</div>

		Netherlands Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Amsterdam />
			<Roots />
			<Open />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
		<Wie />
	</section>
</section>
