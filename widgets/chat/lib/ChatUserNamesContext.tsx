import React, { createContext, useCallback, useContext } from "react";
import { getUserName } from "./users";

type ResolveChatUserName = (userId: string, displayName?: string) => string;

const ChatUserNamesContext = createContext<ResolveChatUserName>((userId, displayName) =>
  displayName?.trim() || getUserName(userId)
);

export function ChatUserNamesProvider({
  namesById,
  children,
}: {
  namesById: Map<string, string>;
  children: React.ReactNode;
}) {
  const resolve = useCallback<ResolveChatUserName>(
    (userId, displayName) => {
      const fromMessage = displayName?.trim();
      if (fromMessage) return fromMessage;
      if (userId === "system") return "System";
      const fromMap = namesById.get(userId);
      if (fromMap) return fromMap;
      return getUserName(userId);
    },
    [namesById]
  );

  return (
    <ChatUserNamesContext.Provider value={resolve}>{children}</ChatUserNamesContext.Provider>
  );
}

export function useResolveChatUserName() {
  return useContext(ChatUserNamesContext);
}
