import { useContext, useRef } from "react";
import "./styles.css";
import {
  BOOK_SUMMARIZER_BOT_CACHE_NAME,
  TUTOR_BOT_CACHE_NAME,
  TabContext,
} from "../../context/TabContext";
import { MdDelete } from "react-icons/md";

export default function ChatHeader({ name, mode }) {
  const { setCacheName, clearCurrentCache } = useContext(TabContext);
  let buttonRef = useRef(null);

  const handleTabButtonClick = (tabName) => {
    setCacheName(tabName);
  };

  const handleClearButtonClick = async (event) => {
    await clearCurrentCache();
    // window.location.reload();
  };

  const highlightCurrentTab = (event) => {
    const prevTab = document.querySelector(".active");
    prevTab?.classList.remove("active");

    event.currentTarget.classList.add("active");
  };

  return (
    <div className="chat-header w-full bg-white sticky shadow-xl z-30 rounded-md">
      <div className="p-2 flex items-end justify-end ml-4">
        <div className="logo-container h-full">
          <img className="logo" src="/logo.png" alt="Edu.ai" />
        </div>
        <h1 className="title ml-2">Edu.ai</h1>
      </div>
      <div className="tabs-container container flex items-center justify-end mr-8">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.preventDefault();
            highlightCurrentTab(e);
            handleTabButtonClick(TUTOR_BOT_CACHE_NAME);
          }}
          className="tab-button active"
        >
          Tutor
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            highlightCurrentTab(e);
            handleTabButtonClick(BOOK_SUMMARIZER_BOT_CACHE_NAME);
          }}
          className="tab-button"
        >
          QnA
        </button>
        <button
          onClick={handleClearButtonClick}
          className="tab-button flex items-center justify-evenly delete"
        >
          <MdDelete className="icon h-full mr-2" />
          Clear
        </button>
      </div>
    </div>
  );
}
