import { writable } from "svelte/store";
import type { ParsedMessage } from "./parser";

export const networkError = writable(false);
export const socketClosed = writable(false);
export const chatMessages = writable<ParsedMessage[]>([]);

export interface FilterSettings {
	filterSubs: boolean;
	filterMods: boolean;
	minMonthsSubbed: number;
	searchString: string;
}

export const filterSettingsStore = writable<FilterSettings>({
	filterSubs: false,
	filterMods: false,
	minMonthsSubbed: 0,
	searchString: "",
});
