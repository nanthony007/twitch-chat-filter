<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<div class="container">
	<Header />
	<slot />
	<Footer />
</div>
