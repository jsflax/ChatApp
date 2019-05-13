import { Observable } from "./observable";
import { channelMessagesCollection, channelSubscriptionsCollection } from "..";
import { channelMessageObserver } from "./channelMessageObserver";

export class ChannelSubscriptionObserver extends Observable {
	constructor() {
		super();
	}

	async updateLocalVector(documentId, subscription) {
		// fetch latest message ids from logical time vector
        const latestMessageIds = (await channelMessagesCollection.find({
                    channelId: subscription.channelId,
                    remoteTimestamp: {
                        $gt: subscription.localTimestamp,
                        $lte: subscription.remoteTimestamp
					}
				})
				.asArray())
				.map(it => it["_id"])
				
        await channelMessageObserver.sync(latestMessageIds)

        await channelSubscriptionsCollection.updateOne(
            { _id: documentId },
            { $set : { localTimestamp: subscription.remoteTimestamp }}
        )
	}

	async notify(data) {
		const subscription = data.fullDocument

        if (data.operationType != "update"
            || subscription == null
            || subscription.localTimestamp == subscription.remoteTimestamp) {
            return
        }

        await this.updateLocalVector(data.documentKey["_id"], subscription)

		super.notify(data);
	}

	async sync(id) {
		// this.stream.close();
		const sub = await channelSubscriptionsCollection.find({_id: id }).first();
		await this.updateLocalVector(id, sub);
		this.stream = await channelSubscriptionsCollection.watch([id]);
		this.stream.onNext((data) => { this.notify(data) });
	}
}

export const channelSubscriptionObserver = new ChannelSubscriptionObserver();