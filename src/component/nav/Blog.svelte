<!-- component -->
<div class="group inline-block">
	<button
		class="outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32"
	>
		<span class="pr-1 font-semibold flex-1">Blog Posts </span>
		<span>
			<svg
				class="fill-current h-4 w-4 transform group-hover:-rotate-180
        transition duration-150 ease-in-out"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			>
				<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
			</svg>
		</span>
	</button>
	<ul
		class="bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute 
  transition duration-150 ease-in-out origin-top min-w-32"
	>
		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-a-find-a-record-of-births-online-in-england-and-wales/"
				>Birth Records UK</g-link
			>
		</li>
		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-use-companies-house-records-for-family-history-research"
				>Companies House Records</g-link
			>
		</li>

		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-find-a-person-on-the-electorial-register-in-the-uk/"
				>Electorial Register</g-link
			>
		</li>
		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-find-where-a-jewish-person-is-buried-in-london-uk/"
				>Jewish Burial Records</g-link
			>
		</li>
		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-a-find-a-jewish-record-of-marriage-online-in-england-and-wales/"
				>Jewish Marriage Records</g-link
			>
		</li>
		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-a-find-a-record-of-marriage-online-in-england-and-wales/"
				>Marrage Records UK</g-link
			>
		</li>
		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-a-find-a-naturalization-certificate-online-in-britain/"
				>Naturalization UK</g-link
			>
		</li>

		<li class="rounded-sm px-3 py-1 hover:bg-gray-100">
			<g-link
				class="text-cyan-900 hover:text-orange-500"
				to="/blog/how-to-a-find-a-record-of-births-of-siblings-online-in-england-and-wales/"
				>Siblings Records UK</g-link
			>
		</li>
	</ul>
</div>

<style>
	/* since nested groupes are not supported we have to use 
     regular css for the nested dropdowns 
  */
	li > ul {
		transform: translatex(100%) scale(0);
	}
	li:hover > ul {
		transform: translatex(101%) scale(1);
	}
	li > button svg {
		transform: rotate(-90deg);
	}
	li:hover > button svg {
		transform: rotate(-270deg);
	}

	/* Below styles fake what can be achieved with the tailwind config
     you need to add the group-hover variant to scale and define your custom
     min width style.
  	 See https://codesandbox.io/s/tailwindcss-multilevel-dropdown-y91j7?file=/index.html
  	 for implementation with config file
  */
	.group:hover .group-hover\:scale-100 {
		transform: scale(1);
	}
	.group:hover .group-hover\:-rotate-180 {
		transform: rotate(180deg);
	}
	.scale-0 {
		transform: scale(0);
	}
	.min-w-32 {
		min-width: 8rem;
	}
</style>
