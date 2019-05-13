import { usersCollection, channelSubscriptionsCollection, channelMessagesCollection } from ".";
import { EJSON } from "bson";
import LRU from "lru-cache";

/**
 * The customer user object relative to our Stitch user that contains
 * extended profile information.
 * 
 * @param id {String}
 * @param name {String}
 * @param defaultAvatarOrdinal {Number} 0-7
 * @param avatar {ByteArray}
 * @param channelsSubscribedTo {StringArray}
 */
export function User(_id, name, defaultAvatarOrdinal, avatar, channelsSubscribedTo) {
	return {
		_id, name, defaultAvatarOrdinal, avatar, channelsSubscribedTo
	};
}

// define a class
export class Observable {
	// each instance of the Observer class
	// starts with an empty array of things (observers)
	// that react to a state change
	constructor() {
	  this.observers = [];
	}
  
	// add the ability to subscribe to a new object / DOM element
	// essentially, add something to the observers array
	subscribe(f) {
	  this.observers.push(f);
	}
  
	// add the ability to unsubscribe from a particular object
	// essentially, remove something from the observers array
	unsubscribe(f) {
	  this.observers = this.observers.filter(subscriber => subscriber !== f);
	}
  
	// update all subscribed objects / DOM elements
	// and pass some data to each of them
	notify(data) {
	  this.observers.forEach(observer => observer(data));
	}
  }

export class UserObserver extends Observable {
	constructor() {
		super();
		this.cache = new LRU(50);
	}

	async sync(id) {
		if (this.stream) {
			this.stream.close();
		}

		if (this.cache.has(id)) {
			return this.cache.get(id);
		}

		const user = await usersCollection.find({ _id: id }).first();
		this.cache.set(id, user);
		this.stream = await usersCollection.watch(this.cache.keys());
		this.stream.onNext((event) => { this.notify(event) });
		return user;
	}
}

export const usersObserver = new UserObserver();

export function ChannelMessage(_id, ownerId, channelId, content, sentAt, remoteTimestamp) {
	return { _id, ownerId, channelId, content, sentAt, remoteTimestamp };
}

export class ChannelMessageObserver extends Observable {
	async sync(ids) {
		if (this.stream) {
			this.stream.close();
		}
		(await channelMessagesCollection.find({_id: { $in: ids }}).asArray()).forEach((msg) => {
			this.notify({fullDocument: msg, operationType: "insert"})
		});
		this.stream = await channelMessagesCollection.watch(ids);
		this.stream.onNext(this.notify);
	}
}

export const channelMessageObserver = new ChannelMessageObserver();

export function ChannelSubscription(_id, channelId, ownerId, subscriptionId, localTimestamp, remoteTimestamp) {
	return {
		_id, channelId, ownerId, deviceId: subscriptionId, localTimestamp, remoteTimestamp 
	};
}

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