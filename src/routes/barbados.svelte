<script context="module">
	export const prerender = true;

	import Genbarb from '../component/Barbados/Genbarb.svelte';
	import Family from '../component/Barbados/Family.svelte';
	import Barbstate from '../component/Barbados/Barbstate.svelte';
</script>

<svelte:head>
	<title>Barbados</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/v1608289948/barbados-flag_mngc34.png"
				alt="image of Barbados flag"
			/>
		</div>

		Barbados Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Genbarb />
		<Family />
        <Barbstate />
	</div>
</section>
