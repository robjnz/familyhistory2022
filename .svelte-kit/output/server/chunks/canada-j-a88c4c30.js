import { c as create_ssr_component, v as validate_component } from "./app-305be29e.js";
import "@sveltejs/kit/ssr";
var Network_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
  map: null
};
const Network = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Network</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Searchable Database<br>The Canadian<br> Jewish Heritage<br> Network</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fVzRij"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
});
var canadaJ_svelte_svelte_type_style_lang = "";
const css = {
  code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
  map: null
};
const prerender = true;
const Canada_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Canada Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639243547/webp/canada-flag.webp"}" alt="${"image of Canadian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Canadian Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Network, "Network").$$render($$result, {}, {}, {})}</div></section>
</section>`;
});
export { Canada_j as default, prerender };
