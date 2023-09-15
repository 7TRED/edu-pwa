import { useContext, useEffect, useRef } from "react";
import Message from "../Message";
import "./styles.css";
import DropDown from "../DropDown";
import { TabContext } from "../../context/TabContext";

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
        {messages.map((message, index) => {
          return <Message key={index} {...message} />;
        })}
      </div>
    </div>
  );
}
