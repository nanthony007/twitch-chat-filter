import { writable } from "svelte/store";
import type { ParsedMessage } from "./parser";
import type { Option } from "./utilities";

export const networkError = writable(false);
export const socketClosed = writable(false);
export const chatMessages = writable<ParsedMessage[]>([]);

export interface FilterSettings {
	filterSubs: boolean;
	filterMods: boolean;
	subFilterRange: {
		minimum: number;
		maximum: number;
	};
	searchString: Option<string>;
}

export const filterSettingsStore = writable<FilterSettings>({
	filterSubs: false,
	filterMods: false,
	subFilterRange: {
		minimum: 0,
		maximum: 0,
	},
	searchString: null,
});
