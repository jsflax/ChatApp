/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import format from "date-fns/format";
import { defaultAvatars } from "..";
import { usersObserver } from "../observers/userObserver";

export default class ChatMessage extends React.Component {
  async observeUser() {
    // TODO: subscribe to user observer
    // TODO: on updates, change state
    // TODO: sync message.ownerId
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.observeUser();
  }

  render() {
    const direction = this.props.isFromCurrentUser ? "right" : "left";
    const { isLastFromUser, isFirstFromUser, shouldShowHeader } = this.props;
    const { sentAt, content } = this.props.message;
    const avatar = this.state.user && this.state.user.avatar ? 'data:image/jpeg;base64,' + 
      this.state.user.avatar.buffer.toString('base64') : 
        this.state.user ? defaultAvatars(this.state.user.defaultAvatarOrdinal) : "img/mind_map_icn_3.png";    
    return (
      <Layout isLastFromUser={isLastFromUser} isFirstFromUser={isFirstFromUser} isFromCurrentUser={this.props.isFromCurrentUser}>
          <Avatar src={shouldShowHeader ? avatar : "http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif"}/>

          <div>
          {shouldShowHeader && (<Sender direction={direction}>{this.state.user ? this.state.user.name : ""}</Sender>)}
          <Content>
          <Message direction={direction} hasNext={!isLastFromUser}>
            <Timestamp direction={direction} ts={sentAt} />
            <div
              css={css`
                white-space: pre-wrap;
              `}
            >
              {content}
            </div>
          </Message>
        </Content>
        </div>
        
      </Layout>
    );
  }
}
const Layout = styled.div`
  margin: 6px 12px;
  margin-top: ${props => (props.isFirstFromUser ? "6px" : "1px")};
  margin-bottom: ${props => (props.isLastFromUser ? "6px" : "1px")};
  background-color: white;
  display: flex;
  flex-direction: ${props => (props.isFromCurrentUser ? "row-reverse" : "row")};
`;

const Content = styled.div`
  height: 100%;
  display: flex;
`;

const Sender = styled.p`
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
  margin-left: ${props => (props.direction === "left" ? "0px" : "auto")};
  margin-right: ${props => (props.direction === "right" ? "0px" : "auto")};
`;

const Message = styled.div`
  display: inline-block;
  background-color: ${props =>
    props.direction === "left" ? "lightgrey" : "lightblue"};
  border-radius: 12px;
  margin-left: ${props => (props.direction === "left" ? "0px" : "auto")};
  margin-right: ${props => (props.direction === "right" ? "0px" : "auto")};
  border-top-left-radius: ${props =>
    props.direction === "left" ? "0px" : "12px"};
  border-top-right-radius: ${props =>
    props.direction === "right" ? "0px" : "12px"};
  border-bottom-left-radius: ${props =>
    props.direction === "left" ? props.hasNext && "0px" : "12px"};
  border-bottom-right-radius: ${props =>
    props.direction === "right" ? props.hasNext && "0px" : "12px"};
  padding: 10px;
`;

const Avatar = styled.img`
    width: 50px;
    height: 50px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 5px;
    border-color: "lightgrey"
`;

const Timestamp = props => {
  const direction = props.direction;
  const date = new Date(props.ts);
  const MessageDate = props => {
    const formatted = format(date, "MM/DD/YYYY");
    const dateStyle = css``;
    return <span css={dateStyle}>{formatted}</span>;
  };
  const MessageTime = props => {
    const formatted = format(date, "HH:MM:SS A");
    const timeStyle = css``;
    return <span css={timeStyle}>{formatted}</span>;
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <div
        css={css`
          margin-left: ${direction === "left" ? "0px" : "auto"};
          margin-right: ${direction === "right" ? "0px" : "auto"};
          font-size: 12px;
          font-style: italic;
          padding-bottom: 4px;
        `}
      >
        <MessageDate />@<MessageTime />
      </div>
    </div>
  );
};
