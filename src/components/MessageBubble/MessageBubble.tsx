import React, { memo } from "react";
import "./styles.scss";

// Define the props type
interface MessageBubbleProps {
  message: string;
  type: string;
  read: Boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = memo(
  ({ message, type, read }) => {
    return (
      <div className={`message-bubble message-bubble--${type}`}>
        <span className="message-content">{message}</span>
        <span className={`message-read message-read--${type}`}>
          {type === "sender" ? (
            read ? (
              <img src="read.png" />
            ) : (
              <img src="unread.png" />
            )
          ) : null}
        </span>
      </div>
    );
  }
);

export default MessageBubble;
