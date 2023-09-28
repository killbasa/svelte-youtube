export type EmbedState = {
	seeking: boolean;
	buffered: number;
	lastBuffered: number | null;
	paused: boolean;
	duration: number;
	currentTime: number;
	ended: boolean;
};
