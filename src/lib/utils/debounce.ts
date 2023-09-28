/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function debounce<F extends Function>(func: F, delay: number): F {
	let timeout: number;

	const result = function (this: any, ...args: any[]) {
		window.clearTimeout(timeout);
		const context = this;

		timeout = window.setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};

	return result as unknown as F;
}
