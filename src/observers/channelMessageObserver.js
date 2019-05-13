import { Observable } from "./observable";
import { channelMessagesCollection } from "..";

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
