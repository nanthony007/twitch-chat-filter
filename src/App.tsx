import type { Component } from "solid-js";

import ChatListView from "./components/ChatList";
import LoginSection from "./components/Login";

const App: Component = () => {
	return (
		<div>
			<LoginSection />
			<ChatListView />
		</div>
	);
};

export default App;
