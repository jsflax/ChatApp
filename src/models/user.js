/**
 * The customer user object relative to our Stitch user that contains
 * extended profile information.
 * 
 * @param _id {String} the id of the associated Stitch user
 * @param name {String} the chosen username of this user
 * @param defaultAvatarOrdinal {Number} 0-7 the default avatar we choose for this user
 * @param avatar {Binary?} the uploaded avatar for this user
 * @param channelsSubscribedTo {StringArray} the channels this user is subscribed to
 */
export function User(_id, name, defaultAvatarOrdinal, avatar, channelsSubscribedTo) {
	return {
		_id, name, defaultAvatarOrdinal, avatar, channelsSubscribedTo
	};
}
