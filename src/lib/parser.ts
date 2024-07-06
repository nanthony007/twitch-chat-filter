// SOURCE: https://dev.twitch.tv/docs/irc/example-parser/
// Parses an IRC message and returns a JSON object with the message's
// component parts (tags, source (nick and host), command, parameters).
// Expects the caller to pass a single message. (Remember, the Twitch
// IRC server may send one or more IRC messages in a single message.)

import { type Result, type Option } from "./utilities";

function stringToBoolean(x: string): Result<boolean> {
	switch (x) {
		case "1":
			return true;
		case "0":
			return false;
		case "":
			return false;
		default:
			return Error("Invalid boolean string");
	}
}

/** Fully parsed message data,
 * does not parse all messages only relevant ones. */
interface ParsedMessage {
	tags: TagData;
	source: Option<SourceData>;
	/** Command data  */
	command: CommandData;
	/** Message content */
	content: string;
}

interface TagData {
	isSub: boolean;
	subMonths: Option<number>;
	isMod: boolean;
	isTurbo: boolean;
	displayName: string;
}

function parseTagSection(x: string): Result<TagData> {
	const tagData: TagData = {
		isSub: false,
		subMonths: null,
		isMod: false,
		isTurbo: false,
		displayName: "",
	};
	// this is bad lol
	// TODO: handle:
	// =;badges=moderator/1,partner/1;c
	x.split(";").forEach((tag) => {
		const [key, value] = tag.split("=");
		if (value !== "") {
			switch (key) {
				case "badge-info":
					if (value !== "") {
						// skip if empty
						value.split(",").forEach((badge) => {
							const [label, data] = badge.split("/");
							if (data !== "") {
								const intValue = parseInt(data);
								if (isNaN(intValue)) {
									return Error("Invalid badge info");
								}
								switch (label) {
									// sub months
									case "subscriber": {
										tagData.subMonths = intValue;
									}
								}
							}
						});
					}
					break;
				case "turbo":
				case "subscriber":
				case "mod": {
					const booleanValue = stringToBoolean(value.trim());
					if (booleanValue instanceof Error) {
						return booleanValue;
					}
					if (key == "turbo") {
						tagData.isTurbo = booleanValue;
					} else if (key == "subscriber") {
						tagData.isSub = booleanValue;
					} else if (key == "mod") {
						tagData.isMod = booleanValue;
					} else {
						return Error(`Unexpected key: ${key}`);
					}
					break;
				}
				case "display-name":
					tagData.displayName = value.trim();
					break;
			}
		}
	});
	return tagData;
}

interface SourceData {
	host: string;
	nick: Option<string>;
}

/** Parse the source section for host and nick if available */
function parseSourceSection(x: string): Result<Option<SourceData>> {
	const sourceParts = x.split("!");
	if (sourceParts.length === 0) {
		return null;
	} else if (sourceParts.length === 1) {
		return {
			host: sourceParts[0],
			nick: null,
		};
	} else if (sourceParts.length === 2) {
		return {
			host: sourceParts[1],
			nick: sourceParts[0],
		};
	} else {
		return Error("Invalid source section");
	}
}

/** Command Enum */
enum Command {
	JOIN = "JOIN", // user or bot joins channel, won't be used for >1k users in chatroom
	PART = "PART", // user leaves channel
	PRIVMSG = "PRIVMSG",
	LOGIN = "LOGIN",
	// other section, not really needed for our purposes right now
	// IRC commands
	NOTICE = "NOTICE", // something like banning a user
	USERNOTICE = "USERNOTICE", // sent when events occur like subbing
	CLEARCHAT = "CLEARCHAT", // bot/mod removes all messages
	CLEARMSG = "CLEARMSG", // bot/mod removes a single message
	GLOBALUSERSTATE = "GLOBALUSERSTATE", // sent after bot auths
	HOSTTARGET = "HOSTTARGET", // sent when channel starts/stops hosting
	RECONNECT = "RECONNECT", // server is going to restart
	ROOMSTATE = "ROOMSTATE", // sent when bot joins channel or channel settings change
	USERSTATE = "USERSTATE", // sent when user joins channel or bot sends PRIVMSG
	WHISPER = "WHISPER", // sent when user sends a whisper
	// others...
	PING = "PING",
	CAP = "CAP",
	OTHERS = "OTHERS",
}

/** Convert a string to a Command enum */
function stringToCommand(x: string): Result<Command> {
	switch (x) {
		case "JOIN":
			return Command.JOIN;
		case "PRIVMSG":
			return Command.PRIVMSG;
		case "001":
			return Command.LOGIN;
		case "353":
			return Command.OTHERS;
		case "PART":
			return Command.PART;
		case "NOTICE":
			return Command.NOTICE;
		case "USERNOTICE":
			return Command.USERNOTICE;
		case "CLEARCHAT":
			return Command.CLEARCHAT;
		case "CLEARMSG":
			return Command.CLEARMSG;
		case "GLOBALUSERSTATE":
			return Command.GLOBALUSERSTATE;
		case "HOSTTARGET":
			return Command.HOSTTARGET;
		case "RECONNECT":
			return Command.RECONNECT;
		case "ROOMSTATE":
			return Command.ROOMSTATE;
		case "USERSTATE":
			return Command.USERSTATE;
		case "WHISPER":
			return Command.WHISPER;
		case "PING":
			return Command.PING;
		case "CAP":
			return Command.CAP;
		default:
			return Error(
				`Invalid command string: ${x}. Expected one of ${Object.values(Command).join(", ")}`
			);
	}
}
interface CommandData {
	command: Command;
	channel: string;
}

function parseCommandSection(x: string): Result<CommandData> {
	const commandParts = x.split(" ");
	const commandResult = stringToCommand(commandParts[0]);
	if (commandResult instanceof Error) {
		return commandResult;
	} else {
		return {
			command: commandResult,
			channel: commandParts[1],
		};
	}
}

function parseMessage(message: string): Result<ParsedMessage> {
	// The start index. Increments as we parse the IRC message.
	let idx = 0;

	let tagData: TagData = {
		isSub: false,
		subMonths: null,
		isMod: false,
		isTurbo: false,
		displayName: "",
	};
	let sourceData: Option<SourceData> = null;
	let commandData: Option<CommandData> = null;
	let contentData: Option<string> = null;

	if (message[idx] === "@") {
		// message has tags
		const endIdx = message.indexOf(" ");
		const tagsSection = message.slice(1, endIdx);
		const tagResult = parseTagSection(tagsSection);
		if (tagResult instanceof Error) {
			return tagResult;
		} else {
			tagData = tagResult;
		}
		idx = endIdx + 1;
	}

	// Get the source component (nick and host) of the IRC message.
	// The idx should point to the source part; otherwise, it's a PING command.
	if (message[idx] === ":") {
		// skip the colon
		idx += 1;
		const endIdx = message.indexOf(" ", idx);
		const sourceSection = message.slice(idx, endIdx);
		const sourceResult = parseSourceSection(sourceSection);
		if (sourceResult instanceof Error) {
			return sourceResult;
		} else {
			sourceData = sourceResult;
		}
		idx = endIdx + 1;
	}

	// Get the command component of the IRC message.
	// next colon is the message content section, so we go until there
	const endIdx = message.indexOf(":", idx);
	const commandSection = message.slice(idx, endIdx);
	const commandResult = parseCommandSection(commandSection);
	if (commandResult instanceof Error) {
		return commandResult;
	} else {
		commandData = commandResult;
	}

	// Finally get the message content itself
	if (endIdx != message.length) {
		// Check if the IRC message contains a parameters component.
		// skip the colon
		idx = endIdx + 1; // Should point to the parameters part of the message.
		const contentSection = message.slice(idx);
		contentData = contentSection;
	} else {
		return Error("No content section found");
	}

	const parsed: ParsedMessage = {
		tags: tagData,
		source: sourceData,
		command: commandData,
		content: contentData,
	};
	return parsed;
}

export { parseMessage, type ParsedMessage };
