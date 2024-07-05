<script lang="ts">
	import { PUBLIC_AUTH_URL } from '$env/static/public';
</script>

<svelte:head>
	<title>Twitch Chat Filters</title>
	<link rel="icon" href="%sveltekit.assets%/favicon.png" />
	<meta name="description" content="Twitch Chat Filters" />
</svelte:head>

<section>
	<!-- TODO: style -->
	<h1 class="uppercase font-bold">Welcome</h1>
	<a href={PUBLIC_AUTH_URL}>Connect with Twitch</a>
</section>
