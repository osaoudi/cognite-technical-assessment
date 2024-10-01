import React, { createContext, useContext, useState, ReactNode } from "react";
import { Message } from "../components/ChatList/ChatList";

export interface MessageResponse {
  [conversationId: number]: { data: Message[]; success: Boolean };
}

// Define the shape of the context value
interface UserChoiceContextType {
  user: number;
  conversation: number;
  messages: MessageResponse;
  setUser: React.Dispatch<React.SetStateAction<number>>;
  setConversation: React.Dispatch<React.SetStateAction<number>>;
  setMessages: React.Dispatch<React.SetStateAction<MessageResponse>>;
}

// Create a context with a default value of undefined
const UserContext = createContext<UserChoiceContextType | undefined>(undefined);

// Create a provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<number>(0);
  const [conversation, setConversation] = useState<number>(0);
  const [messages, setMessages] = useState<MessageResponse>({});

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        messages,
        setMessages,
        conversation,
        setConversation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the Count context
export const useUserChoice = (): UserChoiceContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
};
