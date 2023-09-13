import { useState, useContext } from "react";

import Chat from "../../components/Chat";
import ChatHeader from "../../components/ChatHeader";
import { MessagesContext } from "../../context/MessagesContext";
import ChatInput from "../../components/ChatInput";

import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatPage() {
  const { messages, makeOpenAIBotRequest } = useContext(MessagesContext);
  const [assistantName, setAssistantName] = useState("Bing");
  const [assistantMode, setAssistantMode] = useState("Balanced");

  // Function that adds a new message to the state
  function createMessage(input, sender) {
    const time = new Date().toLocaleTimeString();
    const message = { message: input, sender, time };
    return message;
  }

  //Function that handles the user input and sends it to the assistant
  async function handleUserInput(input) {
    const message = createMessage(input, "user");
    //Implement the logic to send the prompt to the assistant

    const request = makeOpenAIBotRequest(message);
    await toast.promise(request, {
      pending: "Processing",
      error: "There was some error",
    });
  }

  return (
    <div className="container relative h-screen flex flex-col items-center px-2 mx-auto">
      <ChatHeader name={assistantName} mode={assistantMode} />
      <div className="chat-container relative container mx-auto overflow-y-scroll scroll-auto scroll-smooth">
        <Chat messages={messages} />
      </div>

      <ChatInput onSend={handleUserInput} />
      <ToastContainer />
    </div>
  );
}
