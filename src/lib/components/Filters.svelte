<script lang="ts">
	export let filterSubs: boolean;
	export let filterMods: boolean;
	export let selectedMinMonths: number;
	export let maxMonths: number;
</script>

<section>
	<div class="flex flex-row space-x-4 justify-around items-center w-1/2 mx-auto">
		<label class="inline-flex items-center cursor-pointer">
			<input type="checkbox" bind:checked={filterMods} class="sr-only peer" />
			<div
				class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			></div>
			<span class="ms-3 text-sm font-medium text-colored">Mods Only</span>
		</label>

		<label class="inline-flex items-center cursor-pointer">
			<input type="checkbox" bind:checked={filterSubs} class="sr-only peer" />
			<div
				class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			></div>
			<span class="ms-3 text-sm font-medium text-colored">Subscribed Only</span>
		</label>

		<label for="number-input" class="block mb-2 text-sm font-medium text-colored">
			<span>Min Months:</span>
			<input
				type="number"
				id="min-months-input"
				aria-describedby="min-months-input"
				class="bg-slate-100 dark:bg-slate-400 border border-gray-300 disabled:bg-slate-300 disabled:dark:bg-slate-900 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none text-colored text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
				bind:value={selectedMinMonths}
				min={0}
				max={maxMonths}
				disabled={!filterSubs}
			/>
		</label>	
	</div>
</section>
