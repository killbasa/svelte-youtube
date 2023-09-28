import type { EmbedState } from './types/media';

export class Embed {
	public seeking = false;
	public buffered = 0;
	public lastBuffered: number | null = null;
	public paused = true;
	public duration = 0;
	public currentTime = 0;
	public ended = false;

	public getState(): EmbedState {
		return {
			seeking: this.seeking,
			buffered: this.buffered,
			lastBuffered: this.lastBuffered,
			paused: this.paused,
			duration: this.duration,
			currentTime: this.currentTime,
			ended: this.ended
		};
	}
}
