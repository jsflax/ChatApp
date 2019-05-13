/**
 * A vector clock that notifies us when a new message has been sent.
 * 
 * @param _id {ObjectId} the unique id of this subscription
 * @param ownerId {String} the user id of the owner of this subscription
 * @param deviceId {String} the device id of the owner of this subscription
 * @param localTimestamp {Numer} the local logical time
 * @param remoteTimestamp {Number} the remote logical time
 */
export function ChannelSubscription(_id, channelId, ownerId, subscriptionId, localTimestamp, remoteTimestamp) {
	return {
		_id, channelId, ownerId, deviceId: subscriptionId, localTimestamp, remoteTimestamp 
	};
}
