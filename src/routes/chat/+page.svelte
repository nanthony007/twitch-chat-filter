<script lang="ts">
	import { page } from '$app/stores';
	const token = $page.data.session?.access_token;
	const username = $page.data.session?.user?.name;
	if (!token || !username) {
		// redirect to the home page if the user is not signed in
		import { redirect } from '@sveltejs/kit';
		redirect(300, '/');
	}

	let messages: string[] = [];
	let openConnection = false;
	let errorConnection = false;
	let closedConnection = false;
	let selectedUsername = 'username';

	function addMessage(message: string) {
		messages = [...messages, message];
	}

	let ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
	ws.onopen = () => {
		// tags and commands capabilities
		// tags required for filtering on user status
		ws.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
		ws.send(`PASS oauth:${token}`);
		ws.send(`NICK ${username}`);
		// default join your channel
		ws.send(`JOIN #${username}`);
		openConnection = true;
	};
	ws.onmessage = (event) => {
		console.log(event.data);
		addMessage(event.data);
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

		{#if openConnection}
			<p>Connection opened</p>
		{:else if errorConnection}
			<p class="text-red-700">Connection error, see logs. Refresh page</p>
		{:else if closedConnection}
			<p class="text-green-700">Connection closed</p>
		{/if}
	{:else}
		<h1 class="underline font-bold text-xl">Access Denied</h1>
	{/if}
</section>
