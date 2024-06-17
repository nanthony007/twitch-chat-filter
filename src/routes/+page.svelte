<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { redirect } from '@sveltejs/kit';
</script>

<svelte:head>
	<title>Better Chat Filter</title>
	<link rel="icon" href="%sveltekit.assets%/favicon.png" />
	<meta name="description" content="Better Chat Filter for Twitch" />
</svelte:head>

<section>
	<h1 class="text-emerald-900">
		<span class="welcome"> </span>

		to your new<br />SvelteKit app
	</h1>

	<div class="wrapper-form">
		<button on:click={() => signIn('twitch').then(() => redirect(300, 'chat'))}
			>Sign In with GitHub</button
		>
	</div>
	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
</section>
