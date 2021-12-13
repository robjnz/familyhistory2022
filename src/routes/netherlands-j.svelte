<script context="module">
	export const prerender = true;

	import Akevoth99 from '../component/Netherlands/Akevoth99.svelte';
	import Amst99 from '../component/Netherlands/Amst99.svelte';
	import Cemeteries99 from '../component/Netherlands/Cemeteries99.svelte';
	import Joods99 from '../component/Netherlands/Joods99.svelte';
	import Sephardic99 from '../component/Netherlands/Sephardic99.svelte';
</script>

<svelte:head>
	<title>Netherlands Jewish</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638904035/webp/netherlands-flag.webp"
				alt="image of netherlands flag"
			/>
		</div>
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"
				alt="image of star of david"
			/>
		</div>
		Netherlands Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20 ">
			<Akevoth99 />
			<Amst99 />
			<Cemeteries99 />
		</div>

		<div class="grid sm:flex gap-4 mt-8 ">
			<Joods99 />
            <Sephardic99 />
		</div>
	</section>
</section>
