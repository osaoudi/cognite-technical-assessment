import React, { memo, useEffect, useRef, useState } from "react";
import "./styles.scss";
import {
  MessageResponse,
  useUserChoice,
} from "../../hooks/UserChoiceContextProvider";
import { useWebSocket } from "../../hooks/UseWebSocket";

// Define the props type
interface ChatInputProps {}

const ChatInput: React.FC<ChatInputProps> = memo(({}) => {
  const [message, setMessage] = useState<string>("");
  const { setMessages, conversation, user } = useUserChoice();
  const { clientId, sendMessage } = useWebSocket();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value); // Update the state with the new value
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Handle "Enter" key press
      handleSendMessage();
      // You can add your logic to handle the input value when "Enter" is pressed.
    }
  };

  const handleSendMessage = () => {
    sendMessage(
      clientId || "",
      JSON.stringify({
        message: message,
        conversation: conversation,
        user: clientId,
      })
    );
    setMessage(""); // Clear the input after sending
  };

  if (!conversation) return null;

  return (
    <div className="chat-input">
      <div className="chat-input__text-input">
        <input
          onKeyUp={handleKeyPress}
          placeholder="Type a message"
          type="text"
          onChange={handleInputChange}
          value={message}
          className="chat-input__text"
          src="profile.png"
        />
      </div>
      <div>
        <button
          className="chat-input__button"
          type="button"
          disabled={!message}
          onClick={handleSendMessage}
        ></button>
      </div>
    </div>
  );
});

export default ChatInput;
