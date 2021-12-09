<script context="module">
	export const prerender = true;

	import Latin from '../component/Russian/Latin.svelte';
    
	
</script>

<svelte:head>
	<title>Ukraine</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638978523/webp/ukraine-flag.webp"
				alt="image of Ukraine flag"
			/>
		</div>

		Ukraine Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Latin />
		</div>
	</section>
</section>
