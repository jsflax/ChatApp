import React from "react";
import ReactDOM from "react-dom";
import ChatRoom from "./components/ChatRoom.js";
import "./styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import LoginView from "./components/LoginView.js";

export const client = Stitch.initializeDefaultAppClient('<your-app-id-here>');

const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('chats');
export const usersCollection = db.collection("users");
export const channelSubscriptionsCollection = db.collection("channel_subscriptions");
export const channelMessagesCollection = db.collection("messages");

const _defaultAvatars = [
	"img/mind_map_icn.png",
	"img/mind_map_icn_2.png",
	"img/mind_map_icn_3.png",
	"img/mind_map_icn_4.png",
	"img/mind_map_icn_5.png",
	"img/mind_map_icn_6.png",
	"img/mind_map_icn_7.png",
];

export function defaultAvatars(ordinal) {
	return _defaultAvatars[ordinal];
}

async function main() {
	library.add(faPaperPlane, faEllipsisV);
	const rootElement = document.getElementById("root");

	if (client.auth.isLoggedIn) {
		ReactDOM.render(<ChatRoom />, rootElement);	
	} else {
		ReactDOM.render(<LoginView />, rootElement);
	}
}

main();
