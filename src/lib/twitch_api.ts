import { parseMessage } from "./parser";
import { networkError, socketClosed, chatMessages } from "./stores";

export interface UserInfo {
	id: string;
	login: string;
	display_name: string;
	type: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	email: string;
	created_at: string;
}

interface UsersData {
	data: UserInfo[];
}

export const connectWS = (token: string, username: string): WebSocket => {
	const ws = new WebSocket("ws://irc-ws.chat.twitch.tv:80");
	ws.onopen = () => {
		ws.send("CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands");
		ws.send(`PASS oauth:${token}`);
		ws.send(`NICK ${import.meta.env.VITE_PUBLIC_BOT_USERNAME}`);
		ws.send(`JOIN #${username}`);
		// reset error and closed
		networkError.set(false);
		socketClosed.set(false);
		chatMessages.set([]);
	};
	ws.onmessage = (event) => {
		// console.log(event.data);
		const parsed = parseMessage(event.data);
		if (parsed instanceof Error) {
			console.error(parsed.message);
			networkError.set(true);
			return;
		}
		// otherwise ignore
		if (parsed.command.command === "PRIVMSG") {
			chatMessages.update((msgs) => [...msgs, parsed]);
			return;
		}
	};
	ws.onerror = (event) => {
		console.error(`WebSocket error: ${event}`);
		networkError.set(true);
	};
	ws.onclose = () => {
		connectWS(token, username);
		socketClosed.set(true);
	};
	return ws;
};

export const fetchDisplayName = async (token: string): Promise<UserInfo> => {
	const users = await fetch("https://api.twitch.tv/helix/users", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Client-Id": import.meta.env.VITE_PUBLIC_CLIENT_ID,
		},
	})
		.then((res) => res.json())
		.then((data) => data as UsersData)
		.catch((err) => {
			console.error(err);
			networkError.set(true);
		});
	if (!users) {
		throw new Error("Failed to fetch user data");
	}
	return users.data[0];
};
