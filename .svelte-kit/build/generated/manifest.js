const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\newzealand.svelte"),
	() => import("..\\..\\..\\src\\routes\\australia.svelte"),
	() => import("..\\..\\..\\src\\routes\\austrian.svelte"),
	() => import("..\\..\\..\\src\\routes\\barbados.svelte"),
	() => import("..\\..\\..\\src\\routes\\belarus.svelte"),
	() => import("..\\..\\..\\src\\routes\\bermuda.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/newzealand.svelte
	[/^\/newzealand\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/australia.svelte
	[/^\/australia\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/austrian.svelte
	[/^\/austrian\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/barbados.svelte
	[/^\/barbados\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/belarus.svelte
	[/^\/belarus\/?$/, [c[0], c[7]], [c[1]]],

	// src/routes/bermuda.svelte
	[/^\/bermuda\/?$/, [c[0], c[8]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];