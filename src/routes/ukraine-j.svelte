<script context="module">
	export const prerender = true;

	import Dnipropetrovsk99 from '../component/Ukraine/Dnipropetrovsk99.svelte';
	import Memorial99 from '../component/Ukraine/Memorial99.svelte';
	import Dnipro99 from '../component/Ukraine/Dnipro99.svelte';
	import Moved from '../component/Ukraine/Moved.svelte';
	import Yar99 from '../component/Ukraine/Yar99.svelte';
	import Mohyliv99 from '../component/Ukraine/Mohyliv99.svelte';
	import Odessa99 from '../component/Ukraine/Odessa99.svelte';
	import Skala99 from '../component/Ukraine/Skala99.svelte';
	import Kehilalinks99 from '../component/Ukraine/Kehilalinks99.svelte';
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

		Ukraine Jewish Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Dnipropetrovsk99 />
			<Memorial99 />
			<Dnipro99 />
		</div>
		<div class="grid sm:flex gap-4 mt-8">
			<Moved />
			<Yar99 />
			<Kehilalinks99 />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Mohyliv99 />
			<Odessa99 />
			<Skala99 />
		</div>
	</section>
</section>
