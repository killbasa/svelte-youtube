<script lang="ts">
	import { YoutubePlayer, type EmbedState } from '$lib';
	import { PlayerHandler } from '$lib/PlayerHandler';

	let player: PlayerHandler;

	let inputCurrent = 0;
	let duration = 100;
	let isPlaying = false;
	let isMuted = false;

	function expand(input: number): number {
		return input * 100;
	}

	function contract(input: number): number {
		return input / 100;
	}

	function handleUpdate(event: CustomEvent<EmbedState>) {
		inputCurrent = expand(event.detail.currentTime);

		if (duration !== event.detail.duration) {
			duration = expand(event.detail.duration);
		}
	}

	const handleInput = PlayerHandler.seek(
		() => {
			player.setCurrentTime(contract(inputCurrent));
		},
		{ debounce: 50 }
	);

	function handleMousedown() {
		player.startSeeking();
		player.pause();
	}

	function handleMouseup() {
		player.play();
	}
</script>

<svelte:head>
	<title>Tag | Tagg</title>
</svelte:head>

<section>
	<YoutubePlayer
		videoId="J---aiyznGQ"
		bind:player
		on:timeupdate={handleUpdate}
		on:play={() => (isPlaying = true)}
		on:pause={() => (isPlaying = false)}
	/>

	<div class="video-controls">
		<div class="progress-bar">
			<input
				type="range"
				class="slider"
				bind:value={inputCurrent}
				max={duration}
				on:input={handleInput}
				on:mousedown={handleMousedown}
				on:mouseup={handleMouseup}
			/>
		</div>

		<div>
			<button on:click={() => player.play()} class:toggled={isPlaying}>Play</button>
			<button on:click={() => player.pause()} class:toggled={!isPlaying}>Pause</button>
			<button on:click={() => player.seekBackward(5)}>Backward 5s</button>
			<button on:click={() => player.seekForward(5)}>Forward 5s</button>
		</div>
		<div>
			<button on:click={() => (isMuted = player.toggleMute())} class:toggled={isMuted}>
				Mute
			</button>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		max-width: 960px;
		width: 100%;
		margin: 6rem auto 0 auto;
	}

	.video-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.slider {
		width: 100%;
		height: 1rem;
		border-radius: 9999px;
		background-color: var(--background-alt);
		margin-top: 1rem;

		appearance: none;
		-webkit-appearance: none;
		background: #d3d3d3;
		outline: none;
		opacity: 0.7;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #04aa6d;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #04aa6d;
		cursor: pointer;
	}

	.toggled {
		background-color: red;
	}
</style>
