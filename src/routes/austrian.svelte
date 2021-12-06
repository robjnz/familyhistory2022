<script context="module">
	export const prerender = true;

	import Auststate from '../component/Austrian/Auststate.svelte';
	import Vienna from '../component/Austrian/Vienna.svelte';
</script>

<svelte:head>
	<title>Austrian</title>
</svelte:head>

<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638780727/austria-flag_yoeqvh.jpg"
				alt="image of Austrian flag"
			/>
		</div>

		Austrian Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Auststate />
		<Vienna />
	</div>
</section>
