import React from "react";
import ChatPage from "./pages/ChatPage";
import { MessagesContextProvider } from "./context/MessagesContext";

function App() {
  return (
    <MessagesContextProvider>
      <ChatPage />
    </MessagesContextProvider>
  );
}

export default App;
