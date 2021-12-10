<script context="module">
	export const prerender = true;

	import Weiner99 from '../component/Belarus/Weiner99.svelte';
	import Sig99 from '../component/Belarus/Sig99.svelte';
	import Resources99 from '../component/Belarus/Resources99.svelte';
	import Mogilev99 from '../component/Belarus/Mogilev99.svelte';
</script>

<svelte:head>
	<title>Belarus Jewish</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638877031/webp/belarus-flag.webp"
				alt="image of Belarus flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>
		Belarus Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 one">
			<Weiner99 />
			<Sig99 />
			<Resources99 />
		</div>

		<div class="grid sm:flex gap-4 mt-8 one">
			<Mogilev99 />
		</div>
	</section>
</section>
