<script context="module">
	export const prerender = true;

	import Belstate from '../component/Belarus/Belstate.svelte';
	import Mogilev from '../component/Belarus/Mogilev.svelte';
</script>

<svelte:head>
	<title>Belarus</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638784725/belarus-flag_ejcomp.jpg"
				alt="image of Austrian flag"
			/>
		</div>

		Belarus Family History Resourses
	</h1>
	<br />

	<div class="grid sm:flex gap-4 mt-20 one">
		<Belstate />
		<Mogilev />
	</div>
</section>
