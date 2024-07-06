<script lang="ts">
	import { onMount } from 'svelte';
	import ChatList from './lib/components/ChatList.svelte';
	import Login from './lib/components/Login.svelte';
	import { parseTokenFromUrl } from './lib/utilities';

	let token: string | null = null;

	onMount(() => {
		const parsedToken = parseTokenFromUrl(window.location.hash.trim());
		if (parsedToken) {
			token = parsedToken;
		}
	});
</script>

<svelte:head>
	<title>Chat Filters</title>
	<link rel="icon" href="%sveltekit.assets%/favicon.png" />
	<meta name="description" content="Chat Filters for Twitch Creators" />
</svelte:head>

<main>
	<div class="h-screen v-screen bg-gray-100 dark:bg-slate-900 overflow-y-auto">
		{#if !token}
			<Login />
		{:else}
			<ChatList {token} />
		{/if}
	</div>
</main>
