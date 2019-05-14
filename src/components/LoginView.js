/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { client, usersCollection } from "../index";
import ChatRoom from "./ChatRoom";
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import React from "react";
import ReactDOM from "react-dom";
import { User } from "../models/user";
import { EJSON } from "bson";

export default class LoginView extends React.Component {
  async onLogin() {  
    if (this.state.inputValue.length < 3) {
      return
    }

    // TODO: Login and add new custom user
  
    const rootElement = document.getElementById("root");
    ReactDOM.render(<ChatRoom />, rootElement);
  }

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }
  
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {
    return (
      <ChatLayout>
        <LinearLayout>
          <ChitChat>chit chat</ChitChat>
          <Block />
          <LoginInput placeholder="username"
            style={{marginBottom: 20 + "px"}} 
            value={this.state.inputValue} 
            onChange={evt => this.updateInputValue(evt)} />
          <LoginButton onClick={async () => await this.onLogin()}>login</LoginButton>
        </LinearLayout>
      </ChatLayout>
    );
  }
}

const ChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background-color: blue;
`;

const LinearLayout = styled.div`
margin: auto;
width: 50%;
border: 3px solid green;
padding: 10px;
background-color: white;
`;

const ChitChat = styled.p`
text-align: center;
`;

const Block = styled.div`
width: 100%;
height: 30vh;
`;
const LoginInput = styled("input")`
  display: block;
  border-radius: 12px;
  border-top-left-radius: "12px";
  border-top-right-radius: "12px"
  border-bottom-left-radius: "12px"
  border-bottom-right-radius: "12px"
  padding: 10px;
  padding-left: 8px;
  padding-right: 8px;
  border: solid;
  border-width: 1px;
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  background-color: white;
  margin: auto;
  width: 50%;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const LoginButton = styled("button")`
  display: block;
  border-radius: 12px;
  border-top-left-radius: "12px";
  border-top-right-radius: "12px"
  border-bottom-left-radius: "12px"
  border-bottom-right-radius: "12px"
  padding: 10px;
  padding-left: 8px;
  padding-right: 8px;
  border: solid;
  border-width: 2px;
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  background-color: green;
  color: white;
  box-shadow: 5px 10px;
  margin: auto;
  width: 50%;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;