import { useEffect, useState, useRef } from "react";

// Define a custom hook
export const useWebSocket = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Retrieve the stored client ID from localStorage if available
    const storedClientId = localStorage.getItem("clientId");

    // Connect to WebSocket server with the stored clientId if it exists
    ws.current = new WebSocket(
      `ws://localhost:8030?clientId=${storedClientId || ""}`
    );

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Handle initial ID assignment
      if (message.type === "assign_id") {
        setClientId(message.clientId);
        // Store the assigned clientId in localStorage
        localStorage.setItem("clientId", message.clientId);
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Function to send a message
  const sendMessage = (targetClientId: string, messageContent: string) => {
    if (ws.current && clientId) {
      const messageObject = {
        type: "send_to",
        targetClientId,
        message: messageContent,
      };
      ws.current.send(JSON.stringify(messageObject));
    }
  };

  // Return the state and functions from the hook
  return {
    clientId,
    messages,
    isConnected,
    sendMessage,
  };
};
