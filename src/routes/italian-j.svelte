<script context="module">
	export const prerender = true;

	import Italygen99 from '../component/Italian/Italygen99.svelte';
	import Sicily99 from '../component/Italian/Sicily99.svelte';
</script>

<svelte:head>
	<title>Italian Jewish</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639305963/webp/italian_flag.webp"
				alt="image of Italian flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>
		Italian Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 ">
			<Italygen99 />
			<Sicily99 />
		</div>
	</section>
</section>
