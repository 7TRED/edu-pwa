import { useContext } from "react";
import "./styles.css";
import { BOOK_SUMMARIZER_BOT_CACHE_NAME, TabContext } from "../../context/TabContext";

export default function ChatHeader({ name, mode }) {
  const { setCacheName } = useContext(TabContext);
  return (
    <div className="chat-header w-full bg-white sticky shadow-xl z-30 rounded-md p-5">
      <div className="chat-name">{name}</div>
      <div className="chat-mode">{mode}</div>
    </div>
  );
}
