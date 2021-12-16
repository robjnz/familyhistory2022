import { respond } from "@sveltejs/kit/ssr";
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function afterUpdate() {
}
var root_svelte_svelte_type_style_lang = "";
const css = {
  code: "#svelte-announcer.svelte-1r92h5h{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: null
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css);
  {
    stores.page.set(page);
  }
  return `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
let base = "";
let assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<meta name="description" content="" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
let options = null;
const default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-4b5302b0.js",
      css: [assets + "/_app/assets/start-1f089c51.css"],
      js: [assets + "/_app/start-4b5302b0.js", assets + "/_app/chunks/vendor-3d2ece53.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error) => String(error),
    handle_error: (error, request) => {
      hooks.handleError({ error, request });
      error.stack = options.get_stack(error);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
const empty = () => ({});
const manifest = {
  assets: [{ "file": "favicon1.png", "size": 1571, "type": "image/png" }, { "file": "favicon.png", "size": 200521, "type": "image/png" }, { "file": "images/logo youtube.jpg", "size": 485909, "type": "image/jpeg" }, { "file": "images/logo.png", "size": 311689, "type": "image/png" }, { "file": "images/logotree.png", "size": 109976, "type": "image/png" }, { "file": "images/logotree.svg", "size": 134165, "type": "image/svg+xml" }, { "file": "images/logotreerobin.png", "size": 329212, "type": "image/png" }, { "file": "images/logotreerobin.svg", "size": 1065244, "type": "image/svg+xml" }, { "file": "images/square.png", "size": 513, "type": "image/png" }, { "file": "images/europe/1939c.jpg", "size": 10018, "type": "image/jpeg" }, { "file": "images/europe/american-flag.jpg", "size": 7845, "type": "image/jpeg" }, { "file": "images/europe/ancestry.jpg", "size": 5902, "type": "image/jpeg" }, { "file": "images/europe/archives.jpg", "size": 29905, "type": "image/jpeg" }, { "file": "images/europe/australia-flag.jpg", "size": 6575, "type": "image/jpeg" }, { "file": "images/europe/austria-flag.jpg", "size": 5889, "type": "image/jpeg" }, { "file": "images/europe/belarus-flag.jpg", "size": 7604, "type": "image/jpeg" }, { "file": "images/europe/belarus-map.jpg", "size": 26169, "type": "image/jpeg" }, { "file": "images/europe/belgium-flag.jpg", "size": 3352, "type": "image/jpeg" }, { "file": "images/europe/britmila.jpg", "size": 18491, "type": "image/jpeg" }, { "file": "images/europe/business.jpg", "size": 3672, "type": "image/jpeg" }, { "file": "images/europe/camps.jpg", "size": 10826, "type": "image/jpeg" }, { "file": "images/europe/canada-flag.jpg", "size": 3747, "type": "image/jpeg" }, { "file": "images/europe/censusireland.jpg", "size": 31898, "type": "image/jpeg" }, { "file": "images/europe/church.jpg", "size": 13236, "type": "image/jpeg" }, { "file": "images/europe/companies.jpg", "size": 11526, "type": "image/jpeg" }, { "file": "images/europe/cyrillic.jpg", "size": 31702, "type": "image/jpeg" }, { "file": "images/europe/database.jpg", "size": 15716, "type": "image/jpeg" }, { "file": "images/europe/dnipropetrovsk_arms.jpg", "size": 26546, "type": "image/jpeg" }, { "file": "images/europe/family-tree.jpg", "size": 16455, "type": "image/jpeg" }, { "file": "images/europe/first.jpg", "size": 9946, "type": "image/jpeg" }, { "file": "images/europe/flame.jpg", "size": 8874, "type": "image/jpeg" }, { "file": "images/europe/french-flag.jpg", "size": 1472, "type": "image/jpeg" }, { "file": "images/europe/gate.jpg", "size": 16290, "type": "image/jpeg" }, { "file": "images/europe/gazette.jpg", "size": 22586, "type": "image/jpeg" }, { "file": "images/europe/gen.jpg", "size": 10614, "type": "image/jpeg" }, { "file": "images/europe/graves.jpg", "size": 26310, "type": "image/jpeg" }, { "file": "images/europe/handwriting.jpg", "size": 9750, "type": "image/jpeg" }, { "file": "images/europe/hebrew.jpg", "size": 13356, "type": "image/jpeg" }, { "file": "images/europe/heritage.jpg", "size": 5169, "type": "image/jpeg" }, { "file": "images/europe/home.jpg", "size": 12463, "type": "image/jpeg" }, { "file": "images/europe/industral.jpg", "size": 11774, "type": "image/jpeg" }, { "file": "images/europe/ireland-flag.jpg", "size": 3114, "type": "image/jpeg" }, { "file": "images/europe/jc.jpg", "size": 11984, "type": "image/jpeg" }, { "file": "images/europe/jewish-graves.jpg", "size": 26756, "type": "image/jpeg" }, { "file": "images/europe/jfs.jpg", "size": 13899, "type": "image/jpeg" }, { "file": "images/europe/ketubot.jpg", "size": 14052, "type": "image/jpeg" }, { "file": "images/europe/liberty.jpg", "size": 8593, "type": "image/jpeg" }, { "file": "images/europe/loos.jpg", "size": 10999, "type": "image/jpeg" }, { "file": "images/europe/mag-glass.jpg", "size": 10789, "type": "image/jpeg" }, { "file": "images/europe/memorial-de-la-shoah.jpg", "size": 9861, "type": "image/jpeg" }, { "file": "images/europe/mohylivska.jpg", "size": 14236, "type": "image/jpeg" }, { "file": "images/europe/mohyliv_arms.jpg", "size": 25639, "type": "image/jpeg" }, { "file": "images/europe/netherlands-flag.jpg", "size": 3693, "type": "image/jpeg" }, { "file": "images/europe/newspaper.jpg", "size": 17154, "type": "image/jpeg" }, { "file": "images/europe/newyork.jpg", "size": 14348, "type": "image/jpeg" }, { "file": "images/europe/newzealand-flag.jpg", "size": 5835, "type": "image/jpeg" }, { "file": "images/europe/nz-birth-cert.jpg", "size": 10065, "type": "image/jpeg" }, { "file": "images/europe/nz-gazette.jpg", "size": 8007, "type": "image/jpeg" }, { "file": "images/europe/passenger.jpg", "size": 12985, "type": "image/jpeg" }, { "file": "images/europe/raf.jpg", "size": 14417, "type": "image/jpeg" }, { "file": "images/europe/relocation.jpg", "size": 13880, "type": "image/jpeg" }, { "file": "images/europe/roll.jpg", "size": 8794, "type": "image/jpeg" }, { "file": "images/europe/russian-flag.jpg", "size": 3765, "type": "image/jpeg" }, { "file": "images/europe/shamrock.jpg", "size": 25965, "type": "image/jpeg" }, { "file": "images/europe/shtetel.jpg", "size": 12269, "type": "image/jpeg" }, { "file": "images/europe/skala.jpg", "size": 16845, "type": "image/jpeg" }, { "file": "images/europe/soviet-map.jpg", "size": 14532, "type": "image/jpeg" }, { "file": "images/europe/soviet-medals.jpg", "size": 58166, "type": "image/jpeg" }, { "file": "images/europe/star-jewish.jpg", "size": 19282, "type": "image/jpeg" }, { "file": "images/europe/synagogue.jpg", "size": 32079, "type": "image/jpeg" }, { "file": "images/europe/trade.jpg", "size": 11204, "type": "image/jpeg" }, { "file": "images/europe/uk-flag.jpg", "size": 12377, "type": "image/jpeg" }, { "file": "images/europe/ukraine-flag.jpg", "size": 3049, "type": "image/jpeg" }, { "file": "images/europe/viennaparlament.jpg", "size": 34613, "type": "image/jpeg" }, { "file": "images/europe/war-graves.jpg", "size": 15718, "type": "image/jpeg" }, { "file": "images/europe/war.jpg", "size": 18683, "type": "image/jpeg" }, { "file": "images/europe/wedding.jpg", "size": 14597, "type": "image/jpeg" }, { "file": "images/europe/wills.jpg", "size": 7357, "type": "image/jpeg" }, { "file": "images/europe/workhouse.jpg", "size": 9988, "type": "image/jpeg" }, { "file": "images/europe/search.png", "size": 57114, "type": "image/png" }, { "file": "images/svg/bookreadingman.svg", "size": 97434, "type": "image/svg+xml" }, { "file": "images/svg/favicon.png", "size": 200521, "type": "image/png" }, { "file": "images/svg/favicon_io.zip", "size": 64172, "type": "application/zip" }, { "file": "images/svg/FX13_robin.svg", "size": 12944, "type": "image/svg+xml" }, { "file": "images/svg/logomanbook.png", "size": 66939, "type": "image/png" }, { "file": "images/svg/logomanrobin.png", "size": 66297, "type": "image/png" }, { "file": "images/svg/logotree.png", "size": 109976, "type": "image/png" }, { "file": "images/svg/logotree.svg", "size": 134165, "type": "image/svg+xml" }, { "file": "images/svg/logotreerobin.png", "size": 240048, "type": "image/png" }, { "file": "images/svg/logotreerobin.svg", "size": 1065244, "type": "image/svg+xml" }, { "file": "images/svg/oaktree.svg", "size": 73414, "type": "image/svg+xml" }, { "file": "images/svg/tree.svg", "size": 30168, "type": "image/svg+xml" }, { "file": "images/svg/tree1.png", "size": 321269, "type": "image/png" }, { "file": "images/svg/tree3.svg", "size": 1198878, "type": "image/svg+xml" }, { "file": "images/svg/favicon_io/android-chrome-192x192.png", "size": 8749, "type": "image/png" }, { "file": "images/svg/favicon_io/android-chrome-512x512.png", "size": 29725, "type": "image/png" }, { "file": "images/svg/favicon_io/apple-touch-icon.png", "size": 7805, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon-16x16.png", "size": 448, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon-32x32.png", "size": 956, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "images/svg/favicon_io/site.webmanifest", "size": 263, "type": "application/manifest+json" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/netherlands-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/netherlands-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/australia-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/australia-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/netherlands\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/netherlands.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/austrian-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/austrian-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/newzealand\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/newzealand.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/australia\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/australia.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/belarus-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/belarus-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/british-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/british-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/ireland-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/ireland-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/italian-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/italian-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/russian-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/russian-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/ukraine-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/ukraine-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/austrian\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/austrian.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/barbados\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/barbados.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/canada-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/canada-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/belarus\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/belarus.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/belgium\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/belgium.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/bermuda\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/bermuda.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/british\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/british.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/contact\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/contact.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/general\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/general.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/ireland\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/ireland.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/russian\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/russian.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/ukraine\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/ukraine.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/canada\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/canada.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/french\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/french.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/shoah\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/shoah.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/usa-j\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/usa-j.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/video\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/video.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/dna\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/dna.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/usa\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/usa.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
const get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve }) => resolve(request)),
  handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
  externalFetch: hooks.externalFetch || fetch
});
const module_lookup = {
  "src/routes/__layout.svelte": () => import("./__layout-cbac402b.js"),
  ".svelte-kit/build/components/error.svelte": () => import("./error-3f24e63c.js"),
  "src/routes/index.svelte": () => import("./index-757942b9.js"),
  "src/routes/netherlands-j.svelte": () => import("./netherlands-j-e023088c.js"),
  "src/routes/australia-j.svelte": () => import("./australia-j-20e85e69.js"),
  "src/routes/netherlands.svelte": () => import("./netherlands-05d2cfd9.js"),
  "src/routes/austrian-j.svelte": () => import("./austrian-j-a0b6f29d.js"),
  "src/routes/newzealand.svelte": () => import("./newzealand-d3b8133a.js"),
  "src/routes/australia.svelte": () => import("./australia-45744aac.js"),
  "src/routes/belarus-j.svelte": () => import("./belarus-j-cb85a988.js"),
  "src/routes/british-j.svelte": () => import("./british-j-88d2253d.js"),
  "src/routes/ireland-j.svelte": () => import("./ireland-j-ff7d8c61.js"),
  "src/routes/italian-j.svelte": () => import("./italian-j-1f7d3b14.js"),
  "src/routes/russian-j.svelte": () => import("./russian-j-8e40cf25.js"),
  "src/routes/ukraine-j.svelte": () => import("./ukraine-j-a068eb06.js"),
  "src/routes/austrian.svelte": () => import("./austrian-ce1470f9.js"),
  "src/routes/barbados.svelte": () => import("./barbados-78006c3c.js"),
  "src/routes/canada-j.svelte": () => import("./canada-j-c1cb9088.js"),
  "src/routes/belarus.svelte": () => import("./belarus-d0b348a9.js"),
  "src/routes/belgium.svelte": () => import("./belgium-f034680e.js"),
  "src/routes/bermuda.svelte": () => import("./bermuda-4bceb33a.js"),
  "src/routes/british.svelte": () => import("./british-e4f0a678.js"),
  "src/routes/contact.svelte": () => import("./contact-a3da161b.js"),
  "src/routes/general.svelte": () => import("./general-3fe66237.js"),
  "src/routes/ireland.svelte": () => import("./ireland-f2e915bb.js"),
  "src/routes/russian.svelte": () => import("./russian-2607cece.js"),
  "src/routes/ukraine.svelte": () => import("./ukraine-b2b08a6d.js"),
  "src/routes/canada.svelte": () => import("./canada-a523a1fd.js"),
  "src/routes/french.svelte": () => import("./french-d7921e29.js"),
  "src/routes/shoah.svelte": () => import("./shoah-6725fece.js"),
  "src/routes/usa-j.svelte": () => import("./usa-j-7de32103.js"),
  "src/routes/video.svelte": () => import("./video-99501ff0.js"),
  "src/routes/dna.svelte": () => import("./dna-edbd2660.js"),
  "src/routes/usa.svelte": () => import("./usa-9554c064.js")
};
const metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-53d9fdb1.js", "css": ["assets/pages/__layout.svelte-f1ec1d30.css"], "js": ["pages/__layout.svelte-53d9fdb1.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-0e63948c.js", "css": [], "js": ["error.svelte-0e63948c.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-9e7bcf7e.js", "css": ["assets/pages/index.svelte-30506a56.css"], "js": ["pages/index.svelte-9e7bcf7e.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/netherlands-j.svelte": { "entry": "pages/netherlands-j.svelte-a7d67b63.js", "css": ["assets/pages/netherlands-j.svelte-4fe5128b.css"], "js": ["pages/netherlands-j.svelte-a7d67b63.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/australia-j.svelte": { "entry": "pages/australia-j.svelte-03e203d5.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/australia-j.svelte-03e203d5.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/netherlands.svelte": { "entry": "pages/netherlands.svelte-fe63c8fb.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/netherlands.svelte-fe63c8fb.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/austrian-j.svelte": { "entry": "pages/austrian-j.svelte-5ee4e724.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/austrian-j.svelte-5ee4e724.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/newzealand.svelte": { "entry": "pages/newzealand.svelte-4a347075.js", "css": ["assets/pages/newzealand.svelte-4345acdd.css"], "js": ["pages/newzealand.svelte-4a347075.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/australia.svelte": { "entry": "pages/australia.svelte-bdd20ed0.js", "css": ["assets/pages/australia.svelte-b349f3b9.css"], "js": ["pages/australia.svelte-bdd20ed0.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/belarus-j.svelte": { "entry": "pages/belarus-j.svelte-7361b2b5.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/belarus-j.svelte-7361b2b5.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/british-j.svelte": { "entry": "pages/british-j.svelte-289ef619.js", "css": ["assets/pages/british-j.svelte-e0eaffd3.css"], "js": ["pages/british-j.svelte-289ef619.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/ireland-j.svelte": { "entry": "pages/ireland-j.svelte-b754f8bb.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/ireland-j.svelte-b754f8bb.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/italian-j.svelte": { "entry": "pages/italian-j.svelte-763f1939.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/italian-j.svelte-763f1939.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/russian-j.svelte": { "entry": "pages/russian-j.svelte-30b7555a.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/russian-j.svelte-30b7555a.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/ukraine-j.svelte": { "entry": "pages/ukraine-j.svelte-e4e85061.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/ukraine-j.svelte-e4e85061.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/austrian.svelte": { "entry": "pages/austrian.svelte-a90d8c72.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/austrian.svelte-a90d8c72.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/barbados.svelte": { "entry": "pages/barbados.svelte-df11a97b.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/barbados.svelte-df11a97b.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/canada-j.svelte": { "entry": "pages/canada-j.svelte-d8a05ea8.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/canada-j.svelte-d8a05ea8.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/belarus.svelte": { "entry": "pages/belarus.svelte-a49491b7.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/belarus.svelte-a49491b7.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/belgium.svelte": { "entry": "pages/belgium.svelte-e508296b.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/belgium.svelte-e508296b.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/bermuda.svelte": { "entry": "pages/bermuda.svelte-8064737e.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/bermuda.svelte-8064737e.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/british.svelte": { "entry": "pages/british.svelte-827964c7.js", "css": ["assets/pages/british.svelte-2a5d1767.css"], "js": ["pages/british.svelte-827964c7.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/contact.svelte": { "entry": "pages/contact.svelte-d135c471.js", "css": ["assets/pages/contact.svelte-08090ca1.css"], "js": ["pages/contact.svelte-d135c471.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/general.svelte": { "entry": "pages/general.svelte-af62cb0f.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/general.svelte-af62cb0f.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/ireland.svelte": { "entry": "pages/ireland.svelte-2aa07a57.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/ireland.svelte-2aa07a57.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/russian.svelte": { "entry": "pages/russian.svelte-d1231b81.js", "css": ["assets/pages/russian.svelte-4f0c37ac.css", "assets/Lost-ac4f0319.css"], "js": ["pages/russian.svelte-d1231b81.js", "chunks/vendor-3d2ece53.js", "chunks/Lost-408b2e53.js"], "styles": [] }, "src/routes/ukraine.svelte": { "entry": "pages/ukraine.svelte-9e3f7d9b.js", "css": ["assets/pages/general.svelte-d4ec155a.css", "assets/Lost-ac4f0319.css"], "js": ["pages/ukraine.svelte-9e3f7d9b.js", "chunks/vendor-3d2ece53.js", "chunks/Lost-408b2e53.js"], "styles": [] }, "src/routes/canada.svelte": { "entry": "pages/canada.svelte-e8d5b6e0.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/canada.svelte-e8d5b6e0.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/french.svelte": { "entry": "pages/french.svelte-1e138b84.js", "css": ["assets/pages/russian-j.svelte-a94d9f0c.css"], "js": ["pages/french.svelte-1e138b84.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/shoah.svelte": { "entry": "pages/shoah.svelte-9a99bccf.js", "css": ["assets/pages/shoah.svelte-e173945f.css"], "js": ["pages/shoah.svelte-9a99bccf.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/usa-j.svelte": { "entry": "pages/usa-j.svelte-3b10cb72.js", "css": ["assets/pages/usa-j.svelte-3bd1a4bc.css"], "js": ["pages/usa-j.svelte-3b10cb72.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/video.svelte": { "entry": "pages/video.svelte-4607bb19.js", "css": ["assets/pages/video.svelte-87eed3f2.css"], "js": ["pages/video.svelte-4607bb19.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/dna.svelte": { "entry": "pages/dna.svelte-cb5828e0.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/dna.svelte-cb5828e0.js", "chunks/vendor-3d2ece53.js"], "styles": [] }, "src/routes/usa.svelte": { "entry": "pages/usa.svelte-eefd0e67.js", "css": ["assets/pages/general.svelte-d4ec155a.css"], "js": ["pages/usa.svelte-eefd0e67.js", "chunks/vendor-3d2ece53.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
export { create_ssr_component as c, escape as e, init as i, render as r, validate_component as v };
