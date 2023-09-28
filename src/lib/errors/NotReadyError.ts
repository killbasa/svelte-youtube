export class NotReadyError extends Error {
	public constructor() {
		super(
			[
				'You cannot access YTPlayer properties before it is ready.',
				'Make sure to listen to the on:ready event to know when it is safe to interact.'
			].join(' ')
		);
	}
}
