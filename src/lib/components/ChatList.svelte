<script lang="ts">
	// props
	export let token: string;

	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { connectWS, fetchDisplayName } from '../twitch_api';
	import Filters from './Filters.svelte';
	import Search from './Search.svelte';
	import {
		networkError,
		socketClosed,
		chatMessages,
		filterSettingsStore,
	} from '../stores';

	let username: string;
	let inputString = '';
	let selectedMinMonths = 0;

	// update min whenever chatMessages change
	$:maxMonths = Math.max(
		...$chatMessages.map((m) => m.tags.subMonths || 0)
	);
	// update search string only when input is changed
	$: {
		filterSettingsStore.update((s) => {
			s.searchString = inputString;
			return s;
		});
	}

	const filteredMessages = derived(
		[chatMessages, filterSettingsStore],
		([$chatMessages, $filterSettingsStore]) => {
			let filtered = $chatMessages;
			if ($filterSettingsStore.filterSubs) {
				filtered = filtered.filter((m) => m.tags.isSub);
				if (selectedMinMonths > 0) {
					filtered = filtered.filter((m) => {
						let months = m.tags.subMonths ? m.tags.subMonths : 0;
						return months>= selectedMinMonths;
					});
				}
			}
			if ($filterSettingsStore.filterMods) {
				filtered = filtered.filter((m) => m.tags.isMod);
			}
			if ($filterSettingsStore.searchString) {
				filtered = filtered.filter((m) =>
					m.tags.displayName
						.toLowerCase()
						.includes($filterSettingsStore.searchString.toLowerCase()) ||
					m.content.toLowerCase().includes($filterSettingsStore.searchString.toLowerCase())
				);
			}
			return filtered;
		}	
	);

	onMount(async () => {
		const userInfo = await fetchDisplayName(token);
		// set username to default (hal) if dev mode
		if (import.meta.env.DEV && userInfo.display_name === import.meta.env.VITE_PUBLIC_BOT_USERNAME) {
			username = 'imperialhal__';
		} else {
			username = userInfo.display_name;
		}
		connectWS(token, username);
	});
</script>

<section>
	<div class="flex flex-col justify-center space-y-4 py-8 font-berkeley">
		<a
			class="text-center px-6 font-bold underline text-2xl text-colored"
			href={`https://www.twitch.tv/${username}`}
			target="_blank"
		>
			@{username}
		</a>
		{#if $networkError}
			<p class="text-error">Something went wrong, consult the logs.</p>
		{:else if $socketClosed}
			<p class="text-success">Connection closed</p>
		{:else}
			<div class="px-8 space-y-2 mx-auto w-full xl:w-3/4">
				<Filters
					bind:filterSubs={$filterSettingsStore.filterSubs}
					bind:filterMods={$filterSettingsStore.filterMods}
					bind:selectedMinMonths={selectedMinMonths}
					bind:maxMonths={maxMonths}
				/>
				<Search bind:inputString />

				<table class="table-auto mx-auto">
					<thead>
						<tr class="border-b-2">
							<th class="px-4 text-center font-bold">Username</th>
							<th class="px-4 text-center font-bold">Message</th>
							<th class="px-4 text-center font-bold">Subbed</th>
							<th class="px-4 text-center font-bold">Modded</th>
							<th class="px-4 text-center font-bold">SubMonths</th>
						</tr>
					</thead>
					<tbody>
						{#each $filteredMessages as msg}
						<tr class="border-b-2 hover:bg-slate-200 dark:hover:bg-slate-400">
							<td class="font-bold underline border-r-2 text-left">
								<a href={`https://twitch.tv/${msg.tags.displayName || ''}`}>
									@{msg.tags.displayName ? msg.tags.displayName : 'Unknown'}
								</a>
							</td>
							<td class="font-thin">{msg.content}</td>
							<td class="mx-auto">
								{#if msg.tags.isSub}
									<div class="flex justify-center">
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
												d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
											/>
										</svg>
									</div>
								{/if}
							</td>
							<td>
								{#if msg.tags.isMod}
									<div class="flex justify-center">
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
												d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
											/>
										</svg>
									</div>
								{/if}
							</td>
							<td class="text-center font-thin">
								{#if msg.tags.subMonths}
									{msg.tags.subMonths}					
								{/if}
							</td>
						</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</section>
