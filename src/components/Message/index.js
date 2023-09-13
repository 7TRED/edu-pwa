import ReactMarkdown from "react-markdown";
import UploadPreview from "../UploadPreview";
import "./styles.css";

export default function Message({ message, sender, time }) {
  return (
    <div
      className={`message ${
        sender === "user" ? "user-message" : "assistant-message"
      } shadow-lg p-2`}
    >
      <div
        className="border rounded-xl p-2"
        style={{ borderColor: sender === "user" ? "#f7f7f7" : "#ccc" }}
      >
        {message.content && (
          <ReactMarkdown className="message-text mb-2">{message.content}</ReactMarkdown>
        )}

        {message.file && (
          <>
            <hr />
            <div className="container w-full p-2 flex">
              <UploadPreview
                fileObjectURL={message.file.url}
                filename={message.file.filename}
              />
            </div>
          </>
        )}
      </div>

      <div
        style={{
          color: sender === "user" ? "white" : "#333333",
        }}
        className="message-time"
      >
        {time}
      </div>
    </div>
  );
}
