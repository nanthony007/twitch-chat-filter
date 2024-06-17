<script lang="ts">
	import { page } from '$app/stores';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
</script>

<header>
	<div class="signedInStatus">
		<div class="nojs-show loaded">
			<img
				alt="User avatar"
				src={$page.data?.session?.user?.image ?? 'https://source.boringavatars.com/marble/120'}
				class="avatar"
			/>
			{#if $page.data.session}
				<span class="signedInText">
					{$page.data.session.user?.email ?? $page.data.session.user?.name}
				</span>
				<p>{$page.data.session.user}</p>
				<SignOut>
					<div slot="submitButton" class="buttonPrimary">Sign out</div>
				</SignOut>
				<p class="underline bg-red-300 font-bold">
					{$page.data.session.access_token}
				</p>
			{:else}
				<span class="notSignedInText">You are not signed in</span>
				<SignIn>
					<div slot="submitButton" class="buttonPrimary">Sign in</div>
				</SignIn>
			{/if}
		</div>
	</div>
	<nav>
		<ul class="navItems">
			<li class="navItem"><a href="/">Home</a></li>
			<li class="navItem"><a href="/chat">Chat</a></li>
		</ul>
	</nav>
</header>
