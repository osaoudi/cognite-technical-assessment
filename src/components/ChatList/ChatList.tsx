import React, { memo, useCallback, useEffect } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import "./styles.scss";
import { useUserChoice } from "../../hooks/UserChoiceContextProvider";
import { useWebSocket } from "../../hooks/UseWebSocket";

// Define the props type
export interface Message {
  message: string;
  type: "receiver" | "sender";
  read: boolean;
}

const ChatList: React.FC = memo(() => {
  const { messages, setMessages, conversation } = useUserChoice();
  const { clientId, messages: msgs } = useWebSocket();
  console.log(messages);
  // Function to update the messages
  const updateMessages = useCallback(() => {
    if (msgs.length > 0) {
      console.log(msgs);
      const lastMessage = JSON.parse(JSON.parse(msgs[msgs.length - 1]).content);

      const newMessage = lastMessage.message;
      const sender = lastMessage.user;

      const updatedMessages = {
        ...messages,
        [lastMessage.conversation]: {
          ...messages[lastMessage.conversation],
          data: [
            ...(messages[lastMessage.conversation]?.data || []),
            {
              type: sender === clientId ? "sender" : "receiver",
              read: false,
              message: newMessage,
            },
          ],
        },
      };
      //@ts-ignore
      setMessages(updatedMessages);
    }
  }, [msgs]);

  useEffect(() => {
    updateMessages();
  }, [updateMessages]);

  if (!conversation) return null;

  return (
    <div className="chat-list">
      {messages[conversation]?.data.map((msg, index) => (
        <MessageBubble
          key={index}
          type={msg.type}
          read={msg.read}
          message={msg.message}
        />
      ))}
    </div>
  );
});

export default ChatList;
