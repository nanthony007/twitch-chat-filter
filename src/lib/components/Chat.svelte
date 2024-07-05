<script lang="ts">
	import type { ParsedMessage } from '$lib/parser';

	export let msg: ParsedMessage;
	let displayName = msg.tags.displayName || 'Unknown';
	let isSub = msg.tags.isSub;
	let isMod = msg.tags.isMod;
	let isTurbo = msg.tags.isTurbo;
	let content = msg.content;
</script>

<section>
	<!-- TODO: style -->
	<div class="container border border-cyan-400">
		<p>Display Name: {displayName}</p>
		<p>Content: {content}</p>
		<p>Subbed: {isSub}</p>
		<p>Sub Months: {msg.tags.subMonths}</p>
		<p>Mod: {isMod}</p>
		<p>Turbo: {isTurbo}</p>
	</div>
</section>
