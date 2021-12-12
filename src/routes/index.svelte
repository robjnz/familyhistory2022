<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>Family History</title>
</svelte:head>

<section class="one">
	<h1 class="text-center text-purple-500 text-font-sans text-6xl">
		Welcome to Family History Tips
	</h1>
	<p class="text-center text-purple-400 text-font-sans text-3xl">
		Informing you on what information is available and where to find them.
	</p>
	<br />

	<div class="sm:grid cols-1 md:grid grid-cols-2 gap-4">
		<div>
			<img class="h-96 w-full object-fill p-4" src="/images/logotreerobin.svg" alt="logo" />
		</div>
		<div>
			<ul class="text-left text-gray-600 text-font-sans text-xl p-4">
				<li>Births records</li>
				<li>School records</li>
				<li>Marriage records</li>
				<li>Death records</li>
				<li>Burial records</li>
				<li>Will and Probate records</li>
				<li>Census records</li>
				<li>Electoral roll</li>
				<li>Military records</li>
				<li>Immigration & Travel records</li>
				<li>Naturalisation records</li>
				<li>Trade Directories</li>
			</ul>
		</div>
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
