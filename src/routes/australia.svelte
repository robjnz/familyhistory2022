<script context="module">
	export const prerender = true;

	import Gen from '../component/Australia/Gen.svelte';
	import Ausstate from '../component/Australia/Ausstate.svelte';

</script>

<svelte:head>
	<title>Australia</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860154/webp/australia-flag.webp"
				alt="image of australian flag"
			/>
		</div>
		Australian Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Gen />
		<Ausstate />
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
