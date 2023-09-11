import Message from "../Message";
import "./styles.css";

export default function Chat({ messages }) {
  return (
    <div className="container max-h-full mx-auto">
      <div className="chat-messages">
        {messages.map((message, index) => {
          return <Message key={index} {...message} />;
        })}
      </div>
    </div>
  );
}
