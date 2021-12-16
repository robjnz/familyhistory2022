<script context="module">
	export const prerender = true;

	import Ancestrydna from '../component/Dna/Ancestrydna.svelte';
	import Painter from '../component/Dna/Painter.svelte';
	import Familydna from '../component/Dna/Familydna.svelte';
	import GedMatch from '../component/Dna/GedMatch.svelte';
	import Living from '../component/Dna/Living.svelte';
	import Illatrative from '../component/Dna/Illatrative.svelte';
	import Myheritage from '../component/Dna/Myheritage.svelte';
	import Medna from '../component/Dna/Medna.svelte';
</script>

<svelte:head>
	<title>DNA</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639580261/webp/dna_icon1.webp"
				alt="image of dna icon"
			/>
		</div>

		DNA Testing
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Ancestrydna />
			<Painter />
			<Familydna />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<GedMatch />
			<Living />
			<Illatrative />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Myheritage />
			<Medna />
		</div>
	</section>
</section>
