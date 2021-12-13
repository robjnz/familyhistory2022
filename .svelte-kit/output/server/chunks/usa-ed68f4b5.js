import { c as create_ssr_component, v as validate_component } from "./app-cac05392.js";
import { S as Society99 } from "./Society99-8e7f9b61.js";
import "@sveltejs/kit/ssr";
var usa_svelte_svelte_type_style_lang = "";
const css = {
  code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
  map: null
};
const prerender = true;
const Usa = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>USA</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639389123/webp/american-flag.webp"}" alt="${"image of USA flag"}"></div>

		USA Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Society99, "Society99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
});
export { Usa as default, prerender };