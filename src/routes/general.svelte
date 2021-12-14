<script context="module">
	export const prerender = true;

	import Intelius99 from '../component/Usa/Intelius99.svelte';
</script>

<svelte:head>
	<title>General</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639481977/webp/search.webp"
				alt="image of man searching"
			/>
		</div>

		General Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Intelius99 />
		</div>
	</section>
</section>
