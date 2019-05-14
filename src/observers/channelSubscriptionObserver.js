import { Observable } from "./observable";
import { channelMessagesCollection, channelSubscriptionsCollection } from "..";
import { channelMessageObserver } from "./channelMessageObserver";

export class ChannelSubscriptionObserver extends Observable {
	constructor() {
		super();
	}

	async synchronizeChannelSubscription(documentId, subscription) {
		// TODO: fetch latest message ids from logical time vector
		// TODO: sync the message ids
		// TODO: update the local timestamp on the remote
	}

	async notify(data) {
		const subscription = data.fullDocument

        if (data.operationType != "update"
            || subscription == null
            || subscription.localTimestamp == subscription.remoteTimestamp) {
            return
        }

        await this.synchronizeChannelSubscription(data.documentKey["_id"], subscription)

		super.notify(data);
	}

	async sync(id) {
		// TODO: if stream, close it
		// TODO: find subscription
		// TODO: update the local vector
		// TODO: watch the collection
		// TODO: setup stream for observable
	}
}

export const channelSubscriptionObserver = new ChannelSubscriptionObserver();