const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\netherlands-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\australia-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\netherlands.svelte"),
	() => import("..\\..\\..\\src\\routes\\austrian-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\newzealand.svelte"),
	() => import("..\\..\\..\\src\\routes\\australia.svelte"),
	() => import("..\\..\\..\\src\\routes\\belarus-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\british-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\ireland-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\italian-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\russian-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\ukraine-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\austrian.svelte"),
	() => import("..\\..\\..\\src\\routes\\barbados.svelte"),
	() => import("..\\..\\..\\src\\routes\\canada-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\belarus.svelte"),
	() => import("..\\..\\..\\src\\routes\\belgium.svelte"),
	() => import("..\\..\\..\\src\\routes\\bermuda.svelte"),
	() => import("..\\..\\..\\src\\routes\\british.svelte"),
	() => import("..\\..\\..\\src\\routes\\contact.svelte"),
	() => import("..\\..\\..\\src\\routes\\general.svelte"),
	() => import("..\\..\\..\\src\\routes\\ireland.svelte"),
	() => import("..\\..\\..\\src\\routes\\russian.svelte"),
	() => import("..\\..\\..\\src\\routes\\ukraine.svelte"),
	() => import("..\\..\\..\\src\\routes\\canada.svelte"),
	() => import("..\\..\\..\\src\\routes\\french.svelte"),
	() => import("..\\..\\..\\src\\routes\\shoah.svelte"),
	() => import("..\\..\\..\\src\\routes\\usa-j.svelte"),
	() => import("..\\..\\..\\src\\routes\\video.svelte"),
	() => import("..\\..\\..\\src\\routes\\dna.svelte"),
	() => import("..\\..\\..\\src\\routes\\usa.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/netherlands-j.svelte
	[/^\/netherlands-j\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/australia-j.svelte
	[/^\/australia-j\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/netherlands.svelte
	[/^\/netherlands\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/austrian-j.svelte
	[/^\/austrian-j\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/newzealand.svelte
	[/^\/newzealand\/?$/, [c[0], c[7]], [c[1]]],

	// src/routes/australia.svelte
	[/^\/australia\/?$/, [c[0], c[8]], [c[1]]],

	// src/routes/belarus-j.svelte
	[/^\/belarus-j\/?$/, [c[0], c[9]], [c[1]]],

	// src/routes/british-j.svelte
	[/^\/british-j\/?$/, [c[0], c[10]], [c[1]]],

	// src/routes/ireland-j.svelte
	[/^\/ireland-j\/?$/, [c[0], c[11]], [c[1]]],

	// src/routes/italian-j.svelte
	[/^\/italian-j\/?$/, [c[0], c[12]], [c[1]]],

	// src/routes/russian-j.svelte
	[/^\/russian-j\/?$/, [c[0], c[13]], [c[1]]],

	// src/routes/ukraine-j.svelte
	[/^\/ukraine-j\/?$/, [c[0], c[14]], [c[1]]],

	// src/routes/austrian.svelte
	[/^\/austrian\/?$/, [c[0], c[15]], [c[1]]],

	// src/routes/barbados.svelte
	[/^\/barbados\/?$/, [c[0], c[16]], [c[1]]],

	// src/routes/canada-j.svelte
	[/^\/canada-j\/?$/, [c[0], c[17]], [c[1]]],

	// src/routes/belarus.svelte
	[/^\/belarus\/?$/, [c[0], c[18]], [c[1]]],

	// src/routes/belgium.svelte
	[/^\/belgium\/?$/, [c[0], c[19]], [c[1]]],

	// src/routes/bermuda.svelte
	[/^\/bermuda\/?$/, [c[0], c[20]], [c[1]]],

	// src/routes/british.svelte
	[/^\/british\/?$/, [c[0], c[21]], [c[1]]],

	// src/routes/contact.svelte
	[/^\/contact\/?$/, [c[0], c[22]], [c[1]]],

	// src/routes/general.svelte
	[/^\/general\/?$/, [c[0], c[23]], [c[1]]],

	// src/routes/ireland.svelte
	[/^\/ireland\/?$/, [c[0], c[24]], [c[1]]],

	// src/routes/russian.svelte
	[/^\/russian\/?$/, [c[0], c[25]], [c[1]]],

	// src/routes/ukraine.svelte
	[/^\/ukraine\/?$/, [c[0], c[26]], [c[1]]],

	// src/routes/canada.svelte
	[/^\/canada\/?$/, [c[0], c[27]], [c[1]]],

	// src/routes/french.svelte
	[/^\/french\/?$/, [c[0], c[28]], [c[1]]],

	// src/routes/shoah.svelte
	[/^\/shoah\/?$/, [c[0], c[29]], [c[1]]],

	// src/routes/usa-j.svelte
	[/^\/usa-j\/?$/, [c[0], c[30]], [c[1]]],

	// src/routes/video.svelte
	[/^\/video\/?$/, [c[0], c[31]], [c[1]]],

	// src/routes/dna.svelte
	[/^\/dna\/?$/, [c[0], c[32]], [c[1]]],

	// src/routes/usa.svelte
	[/^\/usa\/?$/, [c[0], c[33]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];