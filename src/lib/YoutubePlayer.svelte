<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { YTPlayerEvents } from './types/events';
	import { PlayerHandler } from './PlayerHandler';

	const dispatch = createEventDispatcher<YTPlayerEvents>();

	export let videoId: string | undefined = undefined;
	export let player: PlayerHandler;

	const playerId = 'youtube-player';

	onMount(() => {
		player = new PlayerHandler(playerId, dispatch);

		return () => {
			player.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://www.youtube-nocookie.com" />
	<link rel="preconnect" href="https://www.google.com" />

	<script src="https://www.youtube.com/iframe_api" async></script>
</svelte:head>

{#if videoId}
	<iframe
		id={playerId}
		title={playerId}
		src="https://www.youtube-nocookie.com/embed/{videoId}?enablejsapi=1&controls=0"
		frameborder="0"
		allow="accelerometer; encrypted-media; gyroscope; picture-in-picture;"
		allowfullscreen
		{...$$restProps}
	/>
{/if}

<style>
	iframe {
		position: relative;
		aspect-ratio: 16/9;
		height: 100%;
		width: 100%;
	}
</style>
