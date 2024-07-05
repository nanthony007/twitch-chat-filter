<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_STATE, PUBLIC_BOT_USERNAME } from '$env/static/public';
	import ChatList from '$lib/components/ChatList.svelte';
	import { parseMessage, type ParsedMessage } from '$lib/parser';

	let messages: ParsedMessage[] = [];
	let ignoredMessages: ParsedMessage[] = [];
	let error = false;
	let closed = false;
	let token = '';
	// let username = PUBLIC_BOT_USERNAME;
	let username = 'imperialhal__';

	function connectWS(token: string, username: string) {
		let ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
		ws.onopen = (_) => {
			ws.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
			ws.send(`PASS oauth:${token}`);
			ws.send(`NICK ${PUBLIC_BOT_USERNAME}`);
			ws.send(`JOIN #${username}`);
			// reset error and closed
			error = false;
			closed = false;
		};
		ws.onmessage = (event) => {
			console.log(event.data);
			const parsed = parseMessage(event.data);
			if (parsed instanceof Error) {
				console.error(parsed);
				return;
			}
			// TODO: what other kinds do we want to use?
			if (parsed.command.command !== 'PRIVMSG') {
				console.log(`Ignoring command: ${parsed.command.command}`);
				ignoredMessages = [...ignoredMessages, parsed];
				return;
			} else {
				messages = [...messages, parsed];
			}
		};
		ws.onerror = (err) => {
			console.error(`Error: ${err}`);
			error = true;
		};
		ws.onclose = () => {
			console.log('Connection closed');
			console.log('Reconnecting...');
			connectWS(token, username);
			closed = true;
		};
	}

	onMount(() => {
		const urlHash = window.location.hash.trim();
		const urlParams = new URLSearchParams(urlHash);
		const urlToken = urlParams.get('#access_token');
		if (!urlToken) {
			console.error('No token found');
			error = true;
			return;
		} else {
			console.log('Token found');
			token = urlToken;
		}
		const state = urlParams.get('state');
		// compare to env set to validate
		if (state !== PUBLIC_STATE) {
			console.error('Invalid state');
			error = true;
			return;
		}

		connectWS(token, username);
	});
</script>

<svelte:head>
	<title>Better Chat Filter</title>
	<link rel="icon" href="%sveltekit.assets%/favicon.png" />
	<meta name="description" content="Better Chat Filter for Twitch" />
</svelte:head>

<section>
	<form on:submit|preventDefault={() => connectWS(token, username)}>
		<label for="username">
			<span>Username</span>
			<input type="text" bind:value={username} />
		</label>
	</form>

	{#if error}
		<p class="text-red-700">Something went wrong, consult the logs.</p>
	{/if}
	{#if closed}
		<p class="text-green-700">Connection closed</p>
	{/if}

	<div class="flex flex-col-reverse overflow-y-auto scroll-auto h-screen">
		<ChatList {messages} />
	</div>
</section>
