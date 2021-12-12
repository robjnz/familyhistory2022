<script context="module">
	export const prerender = true;

	import Network from '../component/Canada/Network.svelte';
</script>

<svelte:head>
	<title>Canada Jewish</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639243547/webp/canada-flag.webp"
				alt="image of Canadian flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>
		Canadian Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 ">
			<Network />
		</div>
	</section>
</section>
