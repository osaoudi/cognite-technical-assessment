import React, { memo, useEffect, useState } from "react";
import "./styles.scss";
import ChatConversationListItem from "../ChatConversationListItem/ChatConversationListItem";
import { useWebSocket } from "../../hooks/UseWebSocket";

// Define the props type
interface ConversationResponse {
  success: Boolean;
  data: { id: number; name: string; image: string; new: Boolean }[];
}

const ChatConversationList: React.FC = memo(({}) => {
  const [conversations, setConversations] = useState<ConversationResponse>({
    success: false,
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { messages: msgs } = useWebSocket();

  const updateConversations = (
    convs: ConversationResponse
  ): ConversationResponse => {
    if (msgs.length > 0) {
      let messages = JSON.parse(msgs[msgs.length - 1]);

      convs.data = convs.data.map((conv) => {
        conv.id === JSON.parse(messages.content).conversation
          ? (conv.new = true)
          : (conv.new = false);
        return conv;
      });
    }

    return convs;
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/conversations"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const convs: ConversationResponse = await response.json(); // Specify the type of the fetched data
        setConversations(updateConversations(convs));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [msgs]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="chat-conversation-list">
      {conversations?.data.map((conversation) => (
        <ChatConversationListItem
          key={conversation.id}
          conversation={conversation}
        ></ChatConversationListItem>
      ))}
    </div>
  );
});

export default ChatConversationList;
