/** @jsx jsx */
import { useEffect } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import ChatMessage from "./ChatMessage.js";
import { animateScroll as scroll } from "react-scroll";
import { client } from "../index.js";

const ChatFeed = props => {
  const { messages } = props;
  useEffect(
    () => {
      scroll.scrollToBottom({
        containerId: "feed",
        duration: 320,
        delay: 40,
      });
    },
    [messages],
  );
  const isFromCurrentUser = message => {
    return !!message && message.ownerId === client.auth.user.id;
  };
  const isFromSameUser = (m1, m2)=> {
    return m1.ownerId == m2.ownerId;
  }
  return (
    <ChatFeedLayout id="feed">
      <Feed messages={messages}>
        {messages.map((m, i) => {
          const isFirst = i === 0;
          const isLast = i === messages.length - 1;
          const nextIsFromCurrentUser =
            isFromCurrentUser(messages[i + 1]) || false;
          const shouldShowHeader = isFirst || !isFromSameUser(messages[i - 1], m);
          const isLastFromUser =
            isLast || isFromCurrentUser(m)
              ? !nextIsFromCurrentUser
              : nextIsFromCurrentUser;
          return (
            <ChatMessage
              key={m._id}
              message={m}
              isFromCurrentUser={isFromCurrentUser(m)}
              shouldShowHeader={shouldShowHeader}
              isFirstFromUser={shouldShowHeader}
              isLastFromUser={isLastFromUser}
            />
          );
        })}
      </Feed>
    </ChatFeedLayout>
  );
};
export default ChatFeed;

const ChatFeedLayout = styled.div`
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  overflow-y: scroll;
`;
const Feed = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  box-sizing: border-box;
`;
