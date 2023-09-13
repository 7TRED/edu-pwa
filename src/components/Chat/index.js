import { useEffect, useRef } from "react";
import Message from "../Message";
import "./styles.css";
import DropDown from "../DropDown";

export default function Chat({ messages }) {
  const messageEndRef = useRef(null);
  const scrollToBotton = () => {
    messageEndRef?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // useEffect(() => {
  //   scrollToBotton();
  // }, [messages.length]);

  return (
    <div className="container max-h-full mx-auto">
      <div className="chat-messages">
        {messages.map((message, index) => {
          return <Message key={index} {...message} />;
        })}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}
