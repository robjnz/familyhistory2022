import { c as create_ssr_component } from "./app-a05be494.js";
import "@sveltejs/kit/ssr";
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: ".one.svelte-f3km4q{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.h-96.svelte-f3km4q{height:24rem}.text-6xl.svelte-f3km4q{font-size:3.75rem;line-height:1}.text-3xl.svelte-f3km4q{font-size:1.875rem;line-height:2.25rem}.text-xl.svelte-f3km4q{font-size:1.25rem;line-height:1.75rem}.object-fill.svelte-f3km4q{-o-object-fit:fill;object-fit:fill}.p-4.svelte-f3km4q{padding:1rem}.text-left.svelte-f3km4q{text-align:left}.text-center.svelte-f3km4q{text-align:center}.text-purple-500.svelte-f3km4q{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.text-purple-400.svelte-f3km4q{--tw-text-opacity:1;color:rgba(167, 139, 250, var(--tw-text-opacity))}.text-gray-600.svelte-f3km4q{--tw-text-opacity:1;color:rgba(75, 85, 99, var(--tw-text-opacity))}.w-full.svelte-f3km4q{width:100%}.gap-4.svelte-f3km4q{grid-gap:1rem;gap:1rem}.grid-cols-2.svelte-f3km4q{grid-template-columns:repeat(2, minmax(0, 1fr))}@media(min-width: 640px){.sm\\:grid.svelte-f3km4q{display:-ms-grid;display:grid}}@media(min-width: 768px){.md\\:grid.svelte-f3km4q{display:-ms-grid;display:grid}}",
  map: null
};
const prerender = true;
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Family History</title>`, ""}`, ""}

<section class="${"one svelte-f3km4q"}"><h1 class="${"text-center text-purple-500 text-font-sans text-6xl svelte-f3km4q"}">Welcome to Family History Tips
	</h1>
	<p class="${"text-center text-purple-400 text-font-sans text-3xl svelte-f3km4q"}">Informing you on what information is available and where to find them.
	</p>
	<br>

	<div class="${"sm:grid cols-1 md:grid grid-cols-2 gap-4 svelte-f3km4q"}"><div><img class="${"h-96 w-full object-fill p-4 svelte-f3km4q"}" src="${"/images/logotreerobin.svg"}" alt="${"logo"}"></div>
		<div><ul class="${"text-left text-gray-600 text-font-sans text-xl p-4 svelte-f3km4q"}"><li>Births records</li>
				<li>School records</li>
				<li>Marriage records</li>
				<li>Death records</li>
				<li>Burial records</li>
				<li>Will and Probate records</li>
				<li>Census records</li>
				<li>Electoral roll</li>
				<li>Military records</li>
				<li>Immigration &amp; Travel records</li>
				<li>Naturalisation records</li>
				<li>Trade Directories</li></ul></div></div>
</section>`;
});
export { Routes as default, prerender };
