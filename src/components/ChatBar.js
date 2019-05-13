/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usersCollection, client } from "..";
import { Binary } from "bson";

export default class ChatBar extends React.Component {
  constructor(props) {
    super(props);
  }

  async onAvatarChosen() {
    var reader = new FileReader();
    reader.onload = function(e) { 
      const buffer = new Uint8Array(e.target.result);
      const binary = new Binary(buffer);
      binary.write(buffer);
    }
    reader.readAsArrayBuffer(document.querySelector('input').files[0]);
  }

  render() {
    const { sendMessage, setMessageText, messageText } = props;
    const handleMessageSend = () => {
      sendMessage(messageText);
      setMessageText("");
    };
    const handleInput = e => setMessageText(e.target.value);
    const handleKeyPress = e => {
      if (e.key === "Enter") {
        handleMessageSend();
      }
    };
    return (
      <ChatBarLayout>
        <div className="dropdown">
        <FontAwesomeIcon
          icon="ellipsis-v"
          css={css`
            cursor: pointer;
            padding-right: 8px;
            padding-top: 6px;
          `}
          onClick={() => {
            document.getElementById("myDropdown").classList.toggle("show");
          }}
        />
        <div id="myDropdown" className="dropdown-content">
          <label href="#">set avatar
          <input type="file" id="file-upload" onChange={() => {
            this.onAvatarChosen();
          }}/>
          </label>
        </div>
        </div>
        <ChatBarInput
          type="text"
          value={messageText}
          onChange={handleInput}
          onKeyDown={handleKeyPress}
        />
        <ChatBarButton onClick={handleMessageSend} />
      </ChatBarLayout>
    );
  }
}

const ChatBarLayout = styled.div`
  width: 100%;
  min-height: 52px;
  background-color: lightgray;
  display: flex;
  flex-direction: row;
  padding: 12px 12px;
  box-sizing: border-box;
  flex-grow: 0;
`;

const ChatBarInput = styled("input")`
  padding-left: 8px;
  padding-right: 8px;
  border: none;
  border-radius: 4px;
  flex-grow: 1;
  line-height: 24px;
  font-size: 16px;
  // overflow-x: scroll;
  max-height: 100%;
  // min-height: 100%;
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const ChatBarButton = props => {
  return (
    <button
      css={css`
        height: 100%;
        border-radius: 4px;
        line-height: 16px;
        font-size: 16px;
        text-align: center;
        border: none;
        margin-left: 12px;
        background-color: transparent;
        background-color: rgba(0, 123, 255, 0.25);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
        &:focus,
        :hover {
          // background-color: darkblue;
          // color: white;
          outline: 0;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
        }
      `}
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        icon="paper-plane"
        css={css`
          padding: 2px 8px;
        `}
      />
    </button>
  );
};
