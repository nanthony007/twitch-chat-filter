import { createStore } from "solid-js/store";
import { createReconnectingWS } from "@solid-primitives/websocket";
import { createEffect } from "solid-js";
import { For } from "solid-js";

import Chat from "./Chat";

const username = "timewellwasted007";
const password = "tmgo5ng50f2m4fcslp5gsvxcl3leid";
const channel = "tsm_imperialhal";

function ChatListView() {
	const ws = createReconnectingWS("ws://irc-ws.chat.twitch.tv:80");
	console.log("connected");
	createEffect(() => ws.send(`PASS oauth:${password}`));
	console.log("sent pass");
	createEffect(() => ws.send(`NICK ${username}`));
	console.log("sent nick");
	createEffect(() => ws.send(`JOIN #${channel}`));
	console.log("sent join");
	const [messages, setMessages] = createStore<string[]>([]);
	ws.addEventListener("message", (ev) => {
		if (ev.data.includes("PRIVMSG")) {
			console.log("message received");
			console.log(`ev.data: ${ev.data}`);
			let message: string = ev.data.split(channel).at(-1);
			message = message.trimStart().substring(1);
			console.log(`message: ${message}`);
			setMessages([...messages, message]);
		}
	});

	return <For each={messages}>{(message) => <Chat msg={message} />}</For>;
}

export default ChatListView;
