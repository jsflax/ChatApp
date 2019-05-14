/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

import ChatFeed from "./ChatFeed";
import ChatBar from "./ChatBar";
import { client, channelMessagesCollection } from "..";
import { ObjectId } from "bson";
import { BSON } from "mongodb-stitch-core-sdk";
import { ChannelMessage } from "../models/channelMessage";
import { channelSubscriptionObserver } from "../observers/channelSubscriptionObserver";
import { channelMessageObserver } from "../observers/channelMessageObserver";

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
    // TODO: subscribe to channel observer
    // TODO: subscribeToChannel function
    // TODO: sync to subscriptionId
  }

  async sendMessage(text) {
    // TODO: instantiate new message, insert, push to state, and set state
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
