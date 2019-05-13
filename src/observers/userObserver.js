import { Observable } from "./observable";
import LRU from "lru-cache";
import { usersCollection } from "..";

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
