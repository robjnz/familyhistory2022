<script context="module">
	export const prerender = true;

	import Society99 from '../component/Usa/Society99.svelte';
	import Cemny99 from '../component/Usa/Cemny99.svelte';
</script>

<svelte:head>
	<title>USA Jewish</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639389123/webp/american-flag.webp"
				alt="image of USA flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>
		USA Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 ">
			<Society99 />
		</div>
		<h2 class="text-purple-500 text-font-sans text-4xl">Jewish Cemeteries New York</h2>
	</section>

	<section class="two" />
	<div class="grid grid-cols-1 gap-4">
		<Cemny99 />
		<div />
	</div>
</section>
