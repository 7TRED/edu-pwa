import { useContext, useEffect, useRef } from "react";
import Message from "../Message";
import "./styles.css";
import DropDown from "../DropDown";
import { TUTOR_BOT_CACHE_NAME, TabContext } from "../../context/TabContext";

export default function Chat({ messages }) {
  const { cacheName } = useContext(TabContext);
  const messageEndRef = useRef(null);
  const scrollToBotton = () => {
    messageEndRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBotton();
  }, [cacheName]);

  return (
    <div className="container w-full mx-auto">
      <div className="chat-messages">
        <div ref={messageEndRef} />
        {cacheName === TUTOR_BOT_CACHE_NAME && messages.length <= 0 && (
          <Message
            type={"welcome"}
            sender={"assistant"}
            time={new Date().toLocaleTimeString()}
          />
        )}
        {messages.map((message, index) => {
          return <Message key={index} {...message} />;
        })}
      </div>
    </div>
  );
}
