import { useState, useContext } from "react";

import Chat from "../../components/Chat";
import ChatHeader from "../../components/ChatHeader";
import { MessagesContext } from "../../context/MessagesContext";
import ChatInput from "../../components/ChatInput";

import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropDown from "../../components/DropDown";
import {
  TabContext,
  BOOK_SUMMARIZER_BOT_CACHE_NAME,
  YT_SUMMARIZER_BOT_CACHE_NAME,
} from "../../context/TabContext";
import { books } from "../../dummy_data/classdata";
import ImagePreview from "../../components/ImagePreview";
import commands, { commandsList } from "../../context/commands";
import ReactPlayer from "react-player";
import VideoPreview from "../../components/VideoPreview";

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
  const [chapter, setChapter] = useState(0);
  const [ytURL, setYtURL] = useState("");

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

  //Function to handle YTSummarizer Input field
  const handleYTSummarizerInputField = async (event) => {
    event.preventDefault();
    const input = {
      content: `${commandsList.SUMMARIZE_YT_VIDEO} ${ytURL}`,
      file: null,
    };

    await handleUserInput(input);
  };

  function renderImagePreview() {
    const classsBooks = books[standard];
    if (classsBooks) {
      const selectedBooks = classsBooks.filter((b) => b.value === book);
      if (selectedBooks[0]) {
        const selectedBook = selectedBooks[0];

        if (chapter > 0) {
          const url = selectedBook?.chapters[chapter]?.url;
          const name = selectedBook?.chapters[chapter]?.name;

          return <ImagePreview url={url} alt={name} />;
        }
      }
    }
  }

  return (
    <div className="container relative h-screen flex flex-col items-center mx-auto">
      <ChatHeader />
      {cacheName === BOOK_SUMMARIZER_BOT_CACHE_NAME && (
        <>
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
        </>
      )}
      {cacheName === YT_SUMMARIZER_BOT_CACHE_NAME && (
        <>
          <div style={{ width: "80%" }} className="max-w-xl mt-4 z-10 shadow-md flex">
            <label htmlFor="yt-link" hidden></label>
            <input
              value={ytURL}
              className="outline-none p-2 w-full"
              placeholder="Enter your youtube video URL here..."
              type="url"
              id="yt-link"
              name="yt-link"
              onChange={(e) => setYtURL(e.target.value)}
            />
            {ytURL && (
              <button className="tab-button" onClick={(e) => setYtURL("")}>
                X
              </button>
            )}
            <button
              className="tab-button btn-primary"
              onClick={handleYTSummarizerInputField}
            >
              Go
            </button>
          </div>
          <VideoPreview url={ytURL} />
        </>
      )}
      <div className="chat-container relative flex flex-col items-center container mx-auto overflow-y-scroll scroll-auto scroll-smooth">
        {cacheName === BOOK_SUMMARIZER_BOT_CACHE_NAME && renderImagePreview()}
        {/* {cacheName === YT_SUMMARIZER_BOT_CACHE_NAME && <VideoPreview url={ytURL} />} */}
        <Chat messages={messages} />
      </div>

      <ChatInput onSend={handleUserInput} />
      <ToastContainer />
    </div>
  );
}
