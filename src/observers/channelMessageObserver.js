import { Observable } from "./observable";
import { channelMessagesCollection } from "..";

export class ChannelMessageObserver extends Observable {
	async sync(ids) {
		// TODO: if stream, close it
		// TODO: find ids in messages, pull them down, and notify observers
		// TODO: watch the ids we're syncing on
		// TODO: setup stream for observable
	}
}

export const channelMessageObserver = new ChannelMessageObserver();
