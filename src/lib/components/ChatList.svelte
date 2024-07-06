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
		type FilterSettings
	} from '../stores';

	let username: string;
	let inputString = '';

	// update min/max whenever chatMessages change
	$: {
		filterSettingsStore.update((s) => {
			s.subFilterRange.maximum = $chatMessages
				.map((msg) => msg.tags.subMonths || 0)
				.reduce((a, b) => Math.max(a, b), 0);
			s.subFilterRange.minimum = $chatMessages
				.map((msg) => msg.tags.subMonths || 0)
				.reduce((a, b) => Math.min(a, b), 0);
			return s;
		});
	}
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
			return $chatMessages.filter((m) => {
				if ($filterSettingsStore.filterSubs && m.tags.isSub) {
					return true;
				}
				if ($filterSettingsStore.filterMods && m.tags.isMod) {
					return true;
				}
				if (m.tags.subMonths && m.tags.subMonths > $filterSettingsStore.subFilterRange.minimum) {
					return true;
				}
				if (m.tags.subMonths && m.tags.subMonths < $filterSettingsStore.subFilterRange.maximum) {
					return true;
				}
				if ($filterSettingsStore.searchString) {
					if (
						m.content.toLowerCase().includes($filterSettingsStore.searchString.toLowerCase()) ||
						m.tags.displayName
							.toLowerCase()
							.includes($filterSettingsStore.searchString.toLowerCase())
					) {
						return true;
					}
				}
				return false;
			});
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
			<div class="px-8 space-y-2 mx-auto w-full xl:w-3/4 scroll-auto h-screen">
				<Filters
					filterSubs={$filterSettingsStore.filterSubs}
					filterMods={$filterSettingsStore.filterMods}
					minMonths={$filterSettingsStore.subFilterRange.minimum}
					maxMonths={$filterSettingsStore.subFilterRange.maximum}
				/>
				<Search bind:inputString />
				<table class="table-auto mx-auto text-colored">
					<thead class="border-b-2">
						<tr>
							<th class="px-4 text-center">Display Name</th>
							<th class="px-4 text-center">Message</th>
							<th class="px-4 text-center">Subbed</th>
							<th class="px-4 text-center">Modded</th>
							<th class="px-4 text-center">Sub Months</th>
						</tr>
					</thead>
					<tbody>
						{#each $filteredMessages as msg}
							<tr class="border-b-2">
								<td class="font-bold">
									@{msg.tags.displayName ? msg.tags.displayName : 'Unknown'}</td
								>
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
								<td class="text-center font-thin">{msg.tags.subMonths ? msg.tags.subMonths : ''}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</section>
