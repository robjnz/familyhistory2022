<script context="module">
	export const prerender = true;

	import Auckland from '../component/Newzealand/Auckland.svelte';
	import Companies from '../component/Newzealand/Companies.svelte';
	import Gazette from '../component/Newzealand/Gazette.svelte';
	import Historical from '../component/Newzealand/Historical.svelte';
	import State from '../component/Newzealand/State.svelte';

</script>

<svelte:head>
	<title>New Zealand</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img 
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638702403/newzealand-flag_w7h9cg.jpg"
				alt="image of new zealand flag"
			/>
		</div>
		
		New Zealand Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Auckland />
		<Companies />
		<Gazette />
	</div>

	<div class="grid sm:flex gap-4 mt-8 one">
		<Historical />
		<State />
		
	</div>
</section>

<style>
	.one {
		text-align: center;
		margin-top: 50px;
		margin-left: 100px;
		margin-right: 100px;
	}
</style>
