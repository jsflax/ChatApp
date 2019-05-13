/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

import ChatFeed from "./ChatFeed";
import ChatBar from "./ChatBar";
import { channelSubscriptionObserver, channelMessageObserver, ChannelMessage } from "../models";
import { client, channelMessagesCollection } from "..";
import { ObjectId } from "bson";
import { BSON } from "mongodb-stitch-core-sdk";

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      messages: [],
      messageText: ""
    }
  }

  componentDidMount() {
    this.subscribeToChannel();
  }

  async subscribeToChannel() {
    channelMessageObserver.subscribe(event => {
      this.state.messages.push(event.fullDocument);
      this.setState(this.state);
    });

    const subscriptionId = await client.callFunction("subscribeToChannel", [
      client.auth.user.id, 
      new ObjectId().toHexString, 
      "default"
    ]);

    channelSubscriptionObserver.sync(subscriptionId);
  }

  async sendMessage(text) {
    const msg = ChannelMessage(new BSON.ObjectId(), client.auth.user.id, "default", text, Date.now(), undefined);
    await channelMessagesCollection.insertOne(msg);
    this.state.messages.push(msg);
    this.setState(this.state);
  }

  render() {
    return <ChatLayout>
      <ChatFeed messages={this.state.messages} />
      <ChatBar
        sendMessage={text => this.sendMessage(text)}
        setMessageText={(txt) => {
          this.state.messageText = txt
          this.setState(this.state)
        }}
        messageText={this.state.messageText}
      />
    </ChatLayout>;
  }
}

const ChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background-color: white;
`;
