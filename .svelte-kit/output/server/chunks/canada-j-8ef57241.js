import { c as create_ssr_component, v as validate_component } from "./app-47d52543.js";
import { B as Belgstate, A as Ancestry, G as Genealogy } from "./Belgstate-9844c5b4.js";
var canadaJ_svelte_svelte_type_style_lang = "";
const css = {
  code: ".inline-block.svelte-dond3t{display:inline-block}.grid.svelte-dond3t{display:-ms-grid;display:grid}.h-10.svelte-dond3t{height:2.5rem}.text-4xl.svelte-dond3t{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-dond3t{margin-left:2rem}.mt-3.svelte-dond3t{margin-top:0.75rem}.mt-8.svelte-dond3t{margin-top:2rem}.text-center.svelte-dond3t{text-align:center}.text-purple-500.svelte-dond3t{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-dond3t{width:3.5rem}.gap-4.svelte-dond3t{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-dond3t{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
  map: null
};
const prerender = true;
const Canada_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Canada Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-dond3t"}"><div class="${"h-10 w-14 inline-block svelte-dond3t"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639243547/webp/canada-flag.webp"}" alt="${"image of Canadian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-dond3t"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Canadian Jewish Family History Resourses
	</h1>
	<br>
<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-8 svelte-dond3t"}">${validate_component(Belgstate, "Belgstate").$$render($$result, {}, {}, {})}
		${validate_component(Ancestry, "Ancestry").$$render($$result, {}, {}, {})}
		${validate_component(Genealogy, "Genealogy").$$render($$result, {}, {}, {})}</div></section>
</section>`;
});
export { Canada_j as default, prerender };
