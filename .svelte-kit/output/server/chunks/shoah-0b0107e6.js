import { c as create_ssr_component, v as validate_component } from "./app-b335685e.js";
import { S as Society99 } from "./Society99-fd8ac453.js";
import "@sveltejs/kit/ssr";
var shoah_svelte_svelte_type_style_lang = "";
const css = {
  code: ".inline-block.svelte-i290id{display:inline-block}.grid.svelte-i290id{display:-ms-grid;display:grid}.h-10.svelte-i290id{height:2.5rem}.h-full.svelte-i290id{height:100%}.text-4xl.svelte-i290id{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-i290id{margin-left:2rem}.mt-3.svelte-i290id{margin-top:0.75rem}.mr-20.svelte-i290id{margin-right:5rem}.mt-20.svelte-i290id{margin-top:5rem}.object-fill.svelte-i290id{-o-object-fit:fill;object-fit:fill}.text-center.svelte-i290id{text-align:center}.text-purple-500.svelte-i290id{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-i290id{width:3.5rem}.w-50.svelte-i290id{width:12.5rem}.gap-4.svelte-i290id{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-i290id{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
  map: null
};
const prerender = true;
const Shoah = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Shoah</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-i290id"}"><div class="${"h-10 w-14 inline-block mr-20 svelte-i290id"}"><iframe class="${"h-full w-50 object-fill svelte-i290id"}" title="${"candle flame"}" src="${"https://giphy.com/embed/j7N0GKEWqZxNC"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe></div>

		Shoah Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-i290id"}">${validate_component(Society99, "Society99").$$render($$result, {}, {}, {})}</div></section>
    </section>`;
});
export { Shoah as default, prerender };
