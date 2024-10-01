import React, { memo, useCallback, useEffect, useState } from "react";
import "./styles.scss";
import {
  MessageResponse,
  useUserChoice,
} from "../../hooks/UserChoiceContextProvider";
import { useWebSocket } from "../../hooks/UseWebSocket";

// Define the props type
interface conversationsProps {
  conversation: { id: number; name: string; image: string; new: Boolean };
}

const ChatConversationListItem: React.FC<conversationsProps> = memo(
  ({ conversation }) => {
    const { user, setUser } = useUserChoice();
    const { messages, setMessages } = useUserChoice();
    const { conversation: selectedConversation, setConversation } =
      useUserChoice();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<Boolean>(false);
    const {
      clientId,
      messages: msgs,
      isConnected,
      sendMessage,
    } = useWebSocket();

    const fetchMessages = useCallback(() => {
      if (msgs.length > 0) {
        let conv = JSON.parse(
          JSON.parse(msgs[msgs.length - 1]).content
        ).conversation;
        if (conv === conversation.id && conv !== selectedConversation)
          setNewMessage(true);
      }
    }, [msgs]);

    useEffect(() => {
      fetchMessages();
    }, [fetchMessages]); // Re-run the effect only if conversationId or fetchMessages changes

    const openConversation = useCallback(
      async (convId: number) => {
        setLoading(true); // Set loading to true when the function starts
        try {
          setConversation(convId); // Update the conversation state
          // Logic to mark new message as false
          if (convId === conversation.id && conversation.new) {
            setNewMessage(false);
          }
        } catch (err: any) {
          setError(err.message); // Set error if any
        } finally {
          setLoading(false); // Ensure loading is set to false when the request completes
        }
      },
      [conversation] // Dependency array to memoize openConversation
    );

    return conversation.id !== user ? (
      <div
        onClick={() => openConversation(conversation.id)}
        className={
          selectedConversation === conversation.id
            ? "chat-conversation-list-item chat-conversation-list-item--selected"
            : newMessage
            ? "chat-conversation-list-item chat-conversation-list-item--new"
            : "chat-conversation-list-item"
        }
      >
        <div>
          <img
            className="chat-conversation-list-item__image"
            src={conversation.image}
          />
        </div>
        <div className="chat-conversation-list-item__label">
          <h6>{conversation.name}</h6>
        </div>
      </div>
    ) : (
      <></>
    );
  }
);

export default ChatConversationListItem;
