<script context="module">
	export const prerender = true;

	import Ancestry from '../component/General/Ancestry.svelte';
	import Graves from '../component/General/Graves.svelte';
	import Mormons from '../component/General/Mormons.svelte';
	import Find from '../component/General/Find.svelte';
	import Past from '../component/General/Past.svelte';
	import Geneanet from '../component/General/Geneanet.svelte';
	import Heritage from '../component/General/Heritage.svelte';
	import Prisoners from '../component/General/Prisoners.svelte';
	import Cemeteries from '../component/General/Cemeteries.svelte';
	import Gems from '../component/General/Gems.svelte';
	import JewishGen from '../component/General/JewishGen.svelte';
	import Jri from '../component/General/Jri.svelte';
	import Roots from '../component/General/Roots.svelte';
	import Simcha from '../component/General/Simcha.svelte';
	import Mate from '../component/General/Mate.svelte';
	import Ahnenblatt from '../component/General/Ahnenblatt.svelte';
	import Convert from '../component/General/Convert.svelte';
	import Hebrew from '../component/General/Hebrew.svelte';
	import Shtetl from '../component/General/Shtetl.svelte';
	import Transkribus from '../component/General/Transkribus.svelte';
</script>

<svelte:head>
	<title>General</title>
</svelte:head>
<section class="one">
	<h1 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
		<div class="h-10 w-14 inline-block">
			<img
				src="https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639481977/webp/search.webp"
				alt="image of man searching"
			/>
		</div>

		General Family History Resourses
	</h1>
	<br />
	<section class="one">
		<div class="grid sm:flex gap-4 mt-20">
			<Ancestry />
			<Graves />
			<Mormons />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Find />
			<Past />
			<Geneanet />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Heritage />
			<Prisoners />
		</div>

		<h2 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
			General Jewish Family History Resourses
		</h2>
		<br />
		<div class="grid sm:flex gap-4 mt-8">
			<Cemeteries />
			<Convert />
			<Gems />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<JewishGen />
			<Jri />
			<Hebrew />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Roots />
			<Shtetl />
			<Simcha />
		</div>

		<div class="grid sm:flex gap-4 mt-8">
			<Mate />
		</div>

		<h2 class="ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl">
			General Family History Resourses
		</h2>
		<br />
		<div class="grid sm:flex gap-4 mt-8">
			<Ahnenblatt />
			<Transkribus />
		</div>
	</section>
</section>
