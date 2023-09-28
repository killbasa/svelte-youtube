import type { EventDispatcher } from 'svelte';
import type { YTPlayerEvents } from '$lib/types/events';
import { Embed } from './Embed';
import { NotReadyError } from './errors/NotReadyError';
import { debounce } from '$lib/utils/debounce';
import type { Awaitable } from './types/generic';

export class PlayerHandler {
	public readonly videoId: string;

	private player!: YT.Player;
	private dispatch: EventDispatcher<YTPlayerEvents>;

	private timers = new Map<'playing' | 'buffering', NodeJS.Timeout>();
	private ready = false;
	private embed = new Embed();

	public constructor(videoId: string, dispatcher: EventDispatcher<YTPlayerEvents>) {
		this.dispatch = dispatcher;
		this.videoId = videoId;

		const ready = (): void => {
			this.player = new YT.Player(this.videoId, {
				events: {
					onReady: this.handleOnReady,
					onStateChange: this.handleStateChange
				}
			});
		};

		if (window.YT && window.YT.Player) {
			ready();
		} else {
			window.onYouTubeIframeAPIReady = () => {
				ready();
			};
		}
	}

	public isReady(): boolean {
		return this.ready;
	}

	public get currentTime(): number {
		this.assertReady();

		return Number(this.player.getCurrentTime());
	}

	public setCurrentTime(seconds: number): void {
		this.assertReady();

		this.player.seekTo(seconds, true);
	}

	public get duration(): number {
		this.assertReady();

		return this.embed.duration;
	}

	public get muted(): boolean {
		this.assertReady();

		return this.player.isMuted();
	}

	public toggleMute(): boolean {
		this.assertReady();

		const muted = this.player.isMuted();
		if (muted) {
			this.player.unMute();
		} else {
			this.player.mute();
		}

		return !muted;
	}

	public get ended(): boolean {
		this.assertReady();

		return this.player.getCurrentTime() === this.player.getDuration();
	}

	public play(): void {
		this.assertReady();

		if (!this.embed.paused) return;
		this.player.playVideo();
	}

	public pause(): void {
		this.assertReady();

		if (this.embed.paused) return;
		this.player.pauseVideo();
	}

	public seekForward(seconds: number): void {
		this.assertReady();

		const time = this.player.getCurrentTime();
		const duration = this.embed.duration;
		const result = time + seconds > duration;
		const newTime = result ? duration : time + seconds;

		this.player.seekTo(newTime, !result);

		this.emitNewTime(newTime);
	}

	public seekBackward(seconds: number): void {
		this.assertReady();

		const time = this.player.getCurrentTime();
		const newTime = time < seconds ? 0 : time - seconds;

		this.player.seekTo(newTime, true);

		this.emitNewTime(newTime);
	}

	public startSeeking(): void {
		this.assertReady();

		if (this.embed.seeking) return;

		this.embed.seeking = true;
		this.dispatch('seeking', this.embed.getState());
	}

	public destroy(): void {
		this.assertReady();

		for (const timer of this.timers.values()) {
			clearInterval(timer);
		}

		this.player.destroy();
	}

	public static seek(callback: () => Awaitable<unknown>, options?: { debounce: number }) {
		return debounce(async () => await callback(), options?.debounce ?? 0);
	}

	private emitNewTime(time?: number) {
		this.embed.currentTime = time ?? this.player.getCurrentTime();
		this.dispatch('timeupdate', this.embed.getState());
	}

	private assertReady() {
		if (!this.ready) throw new NotReadyError();
	}

	private setPlaybackState(play: boolean): void {
		if (this.embed.paused === play) {
			this.embed.paused = !play;
			this.dispatch(play ? 'play' : 'pause', this.embed.getState());
		}
	}

	private handleOnReady: YT.PlayerEventHandler<YT.PlayerEvent> = () => {
		this.embed.duration = this.player.getDuration();

		this.dispatch('durationchange', this.embed.getState());

		clearInterval(this.timers.get('buffering'));
		this.timers.set(
			'buffering',
			setInterval(() => {
				this.embed.buffered = this.player.getVideoLoadedFraction();

				if (
					this.embed.lastBuffered === null ||
					this.embed.lastBuffered < this.embed.buffered
				) {
					this.dispatch('bufferprogress', this.embed.getState());
				}

				this.embed.lastBuffered = this.embed.buffered;

				if (this.embed.buffered === 1) {
					clearInterval(this.timers.get('buffering'));
					this.dispatch('buffercomplete', this.embed.getState());
				}
			}, 200)
		);

		this.ready = true;
		this.dispatch('ready', this.embed.getState());
	};

	private handleStateChange: YT.PlayerEventHandler<YT.OnStateChangeEvent> = (
		event: YT.OnStateChangeEvent
	) => {
		clearInterval(this.timers.get('playing'));

		const seeked = this.embed.seeking && [1, 2].includes(event.data);
		if (seeked) {
			this.embed.seeking = false;
			this.dispatch('seeked', this.embed.getState());
		}

		switch (event.data) {
			case YT.PlayerState.UNSTARTED: {
				this.dispatch('timeupdate', this.embed.getState());

				this.embed.buffered = this.player.getVideoLoadedFraction();
				this.dispatch('bufferprogress', this.embed.getState());

				break;
			}
			case YT.PlayerState.ENDED: {
				this.setPlaybackState(false);
				this.dispatch('ended', this.embed.getState());

				break;
			}
			case YT.PlayerState.PLAYING: {
				this.setPlaybackState(true);

				clearInterval(this.timers.get('playing'));
				this.timers.set(
					'playing',
					setInterval(() => {
						this.emitNewTime();
					}, 50)
				);

				break;
			}
			case YT.PlayerState.PAUSED: {
				this.setPlaybackState(false);

				break;
			}
			case YT.PlayerState.BUFFERING: {
				this.dispatch('bufferwaiting', this.embed.getState());

				break;
			}
		}
	};
}
