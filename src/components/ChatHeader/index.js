import "./styles.css";

export default function ChatHeader({ name, mode }) {
  return (
    <div className="chat-header w-full bg-white sticky shadow-xl z-30 rounded-md p-5">
      <div className="chat-name">{name}</div>
      <div className="chat-mode">{mode}</div>
    </div>
  );
}
