<script lang="ts">
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { redirect } from '@sveltejs/kit';

	function signInAndRedirect() {
		signIn('twitch').then(() => redirect(300, '/chat'));
	}

	function signOutAndRedirect() {
		signOut().then(() => redirect(300, '/'));
	}
</script>

<header>
	<nav>
		<ul class="flex justify-between bg-slate-400 font-bold text-lg">
			<li class="mr-3">
				<img
					alt="User avatar"
					src={$page.data?.session?.user?.image ?? 'https://source.boringavatars.com/marble/120'}
					class="avatar"
				/>
			</li>
			<li class="mr-3">
				{#if $page.data.session}
					<p class="inline-block border">{$page.data?.session?.user?.name}</p>
				{:else}
					<button
						class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
						on:click={() => signInAndRedirect()}>Sign In</button
					>
				{/if}
			</li>
			<li class="mr-3">
				{#if $page.data.session}
					<button
						class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
						on:click={() => signOutAndRedirect()}>Sign Out</button
					>
				{/if}
			</li>
		</ul>
	</nav>
</header>
