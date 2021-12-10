<script context="module">
	export const prerender = true;

	import Historical99 from '../component/Australia/Historical99.svelte';
	import Society99 from '../component/Australia/Society99.svelte';
</script>

<svelte:head>
	<title>Australia Jewish</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860154/webp/australia-flag.webp"
				alt="image of australian flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
		<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>
		Australian Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Society99 />
			<Historical99 />
		</div>
	</section>
</section>
