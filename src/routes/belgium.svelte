<script context="module">
	export const prerender = true;

	import Belgstate from '../component/Belgium/Belgstate.svelte';
	import Ancestry from '../component/Belgium/Ancestry.svelte';
	import Genealogy from '../component/Belgium/Genealogy.svelte';
</script>

<svelte:head>
	<title>Belgium</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638802245/belgium-flag_ht5dyb.jpg"
				alt="image of Belgium flag"
			/>
		</div>

		Belgium Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Belgstate />
		<Ancestry />
		<Genealogy />
	</div>
</section>
