/**
 * A message one would send to a channel.
 *
 * @param _id {ObjectId} the unique id of the message
 * @param channelId {String} the id of the channel this was sent to
 * @param content {String} the actual text of the message
 * @param sentAt {Number} the time the message was sent to the server or the time the message hit the server
 * @param remoteTimestamp {Number} the logical time of the message (to be updated by the server trigger)
 */
export function ChannelMessage(_id, ownerId, channelId, content, sentAt, remoteTimestamp) {
	return { _id, ownerId, channelId, content, sentAt, remoteTimestamp };
}
