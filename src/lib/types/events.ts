import type { EmbedState } from './media';

export type YTPlayerEvents = {
	ready: EmbedState;

	// Time
	durationchange: EmbedState;
	timeupdate: EmbedState;
	ended: EmbedState;

	// Seeking
	play: EmbedState;
	pause: EmbedState;
	seeking: EmbedState;
	seeked: EmbedState;

	// Buffering
	bufferwaiting: EmbedState;
	bufferprogress: EmbedState;
	buffercomplete: EmbedState;
};
