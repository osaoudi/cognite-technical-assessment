import React from "react";
import ChatList from "../ChatList/ChatList";
import "./styles.scss";
import ChatConversationList from "../ChatConversationList/ChatConversationList";
import ChatInput from "../ChatInput/ChatInput";
import { UserProvider } from "../../hooks/UserChoiceContextProvider";

// Define the props type
interface ChatContainerProps {}

const ChatContainer: React.FC<ChatContainerProps> = ({}) => {
  return (
    <UserProvider>
      <div className="chat-container">
        <ChatConversationList></ChatConversationList>
        <div className="chat-container__right-panel">
          <ChatList></ChatList>
          <ChatInput></ChatInput>
        </div>
      </div>
    </UserProvider>
  );
};

export default ChatContainer;
