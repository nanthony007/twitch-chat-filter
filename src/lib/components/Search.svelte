<script lang="ts">
	export let inputString: string;
</script>

<div class="max-w-sm mx-auto">
	<label for="search-input" class="block mb-2 text-sm font-medium text-colored" hidden></label>
	<div class="relative">
		<div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</div>
		<input
			type="text"
			id="search-input"
			class="text-colored bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Search for something..."
			autocomplete="off"
			bind:value={inputString}
			on:input
		/>
	</div>
</div>
