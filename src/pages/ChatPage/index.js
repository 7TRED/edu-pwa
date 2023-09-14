import { useState, useContext } from "react";

import Chat from "../../components/Chat";
import ChatHeader from "../../components/ChatHeader";
import { MessagesContext } from "../../context/MessagesContext";
import ChatInput from "../../components/ChatInput";

import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropDown from "../../components/DropDown";
import { TabContext, BOOK_SUMMARIZER_BOT_CACHE_NAME } from "../../context/TabContext";
import { books } from "../../dummy_data/classdata";

function generateChapterData() {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      value: `${i}`,
      displayName: `Chapter ${i}`,
    });
  }

  return data;
}

export default function ChatPage() {
  const { messages, makeOpenAIBotRequest } = useContext(MessagesContext);
  const { cacheName } = useContext(TabContext);
  const [standard, setStandard] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState(1);

  // Function that adds a new message to the state
  function createMessage(input, sender) {
    const time = new Date().toLocaleTimeString();
    const message = { message: input, sender, time };
    return message;
  }

  //Function that handles the user input and sends it to the assistant
  async function handleUserInput(input) {
    if (cacheName === BOOK_SUMMARIZER_BOT_CACHE_NAME) {
      input.collection_name = book === "test" ? book : `${book}-${chapter}`;
    }
    const message = createMessage(input, "user");
    //Implement the logic to send the prompt to the assistant

    const request = makeOpenAIBotRequest(message);
    await toast.promise(request, {
      pending: "Processing",
      error: "There was some error",
    });
  }

  return (
    <div className="container relative h-screen flex flex-col items-center mx-auto">
      <ChatHeader />
      {cacheName === BOOK_SUMMARIZER_BOT_CACHE_NAME && (
        <div className="max-w-md mt-2 z-10 shadow-md flex">
          <DropDown
            label={"Class"}
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            data={[{ value: "class12", displayName: "Class XII" }]}
          />
          <DropDown
            data={standard ? books[standard] : []}
            value={book}
            onChange={(e) => setBook(e.target.value)}
            label={"Book"}
          />
          <DropDown
            data={book ? generateChapterData() : []}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            label={"Chapter"}
          />
        </div>
      )}
      <div className="chat-container relative container mx-auto overflow-y-scroll scroll-auto scroll-smooth">
        <Chat messages={messages} />
      </div>

      <ChatInput onSend={handleUserInput} />
      <ToastContainer />
    </div>
  );
}
