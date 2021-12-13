<script context="module">
	export const prerender = true;

	import Society99 from '../component/Usa/Society99.svelte';
</script>

<svelte:head>
	<title>Shoah</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block mr-20">
			<iframe
				class="h-full w-50 object-fill"
				title="candle flame"
				src="https://giphy.com/embed/j7N0GKEWqZxNC"
				frameborder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			/>
		</div>

		Shoah Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 ">
			<Society99 />
		</div>
	</section>
    </section>

	
