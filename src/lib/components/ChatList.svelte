<script lang="ts">
	import type { ParsedMessage } from '$lib/parser';
	import Chat from './Chat.svelte';

	// prop
	export let messages: ParsedMessage[] = [];

	// TODO: add cleaning/processing of message strings
	//
	//
</script>

<section>
	<!-- TODO: style -->
	{#each messages as msg}
		<Chat {msg} />
	{/each}
</section>
