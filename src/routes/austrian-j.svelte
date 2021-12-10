<script context="module">
	export const prerender = true;

	import Birth99 from '../component/Austrian/Birth99.svelte';
	import Weddings99 from '../component/Austrian/Weddings99.svelte';
	import Buried99 from '../component/Austrian/Buried99.svelte';
	import Community99 from '../component/Austrian/Community99.svelte';
</script>

<svelte:head>
	<title>Austrian Jewish</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638876704/webp/austria-flag.webp"
				alt="image of Austrian flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
		<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>

		Austrian Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Birth99 />
			<Weddings99 />
			<Buried99 />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Community99 />
		</div>
	</section>
</section>
