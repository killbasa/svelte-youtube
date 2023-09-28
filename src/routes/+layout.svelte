<script lang="ts">
	import '$internal/styles/fonts.css';
	import '$internal/styles/reset.css';
	import '$internal/styles/global.css';
</script>

<div>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 2rem;
		margin-right: 2rem;
	}
</style>
