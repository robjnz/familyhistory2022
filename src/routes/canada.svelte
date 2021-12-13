<script context="module">
	export const prerender = true;

	import Canstate from '../component/Canada/Canstate.svelte';
</script>

<svelte:head>
	<title>Canada</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639243547/webp/canada-flag.webp"
				alt="image of Canadian flag"
			/>
		</div>

		Canadian Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 ">
			<Canstate />
		</div>
	</section>
</section>
