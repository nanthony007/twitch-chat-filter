<script lang="ts">
	import { page } from '$app/stores';

	const token = $page.data.session?.access_token;
	const username = $page.data.session?.user?.name;

	console.log(token);
	console.log(username);

	let messages: string[] = [];
	let errorConnection = false;
	let closedConnection = false;

	let ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
	ws.onopen = (event) => {
		ws.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
		ws.send(`PASS oauth:${token}`);
		ws.send(`NICK ${username}`);
		ws.send(`JOIN #${username}`);
		console.log(event);
	};
	ws.onmessage = (event) => {
		console.log(event.data);
		messages = [...messages, event.data];
	};
	ws.onerror = (error) => {
		console.error(error);
		errorConnection = true;
	};
	ws.onclose = () => {
		console.log('Connection closed');
		closedConnection = true;
	};
</script>

<svelte:head>
	<title>Better Chat Filter</title>
	<link rel="icon" href="%sveltekit.assets%/favicon.png" />
	<meta name="description" content="Better Chat Filter for Twitch" />
</svelte:head>

<section>
	{#if $page.data.session}
		<label for="username">
			<span>Username</span>
			<input type="text" value={username} />
		</label>

		<p>Session expiry: {$page.data.session?.expires}</p>

		{#each messages as message}
			<p class="font-thin">{message}</p>
		{/each}

		{#if errorConnection}
			<p class="text-red-700">Connection error, see logs. Refresh page</p>
		{/if}
		{#if closedConnection}
			<p class="text-green-700">Connection closed</p>
		{/if}
	{:else}
		<h1 class="underline font-bold text-xl">Access Denied</h1>
	{/if}
</section>
