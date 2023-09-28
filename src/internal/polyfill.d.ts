declare global {
	interface Window {
		/**
		 * This will only ever be available on {@link Window} if the YouTube Iframe API is loaded.
		 *
		 * Reference: https://developers.google.com/youtube/iframe_api_reference
		 */
		onYouTubeIframeAPIReady: undefined | (() => void);
	}
}

export {};
