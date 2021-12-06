<script>
	import Nav from '$lib/Nav.svelte';
	import '../global.css';
	import TheFooter from '$lib/TheFooter.svelte';
	import Dropdown from '../component/Dropdown.svelte';

</script>

<Nav />

<slot />
<Dropdown />
<TheFooter />

<style windi:preflights:global windi:safelist:global>
</style>
