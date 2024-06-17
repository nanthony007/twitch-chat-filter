<script lang="ts">
	import { page } from '$app/stores';

	// let ws = new WebSocket('ws://localhost:3000');
	// ws.onopen = () => {
	// 	ws.send(JSON.stringify({ type: 'auth', token: $page.data.session?.token }));
	// };
	// ws.onmessage = (event) => {
	// 	console.log(event.data);
	// };
	// ws.onclose = () => {
	// 	console.log('Connection closed');
	// };
	// ws.onerror = (error) => {
	// 	console.error(error);
	// };
</script>

{#if $page.data.session}
	<h1>Protected page</h1>
	<p>This is a protected content. You can access this content because you are signed in.</p>
	<p>Session expiry: {$page.data.session?.expires}</p>
{:else}
	<h1>Access Denied</h1>
{/if}
