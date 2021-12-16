<script context="module">
	export const prerender = true;

	import Buried from '../component/Film/Buried.svelte';
	import Name from '../component/Film/Name.svelte';
	import Companies from '../component/Film/Companies.svelte';
	import Electorial from '../component/Film/Electorial.svelte';
	import Nat from '../component/Film/Nat.svelte';
	import Marriage from '../component/Film/Marriage.svelte';
	import Raf from '../component/Film/Raf.svelte';
	import Probate from '../component/Film/Probate.svelte';
</script>

<svelte:head>
	<title>Video's</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639596218/webp/video_icon.webp"
				alt="image of video icon"
			/>
		</div>

		Family History Youtube video's
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Buried />
			<Name />
			<Companies />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Electorial />
			<Nat />
			<Marriage />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Raf />
			<Probate />
		</div>
	</section>
</section>
