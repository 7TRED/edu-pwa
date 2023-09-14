import ReactMarkdown from "react-markdown";
import UploadPreview from "../UploadPreview";
import "./styles.css";
import remarkGfm from "remark-gfm";

export default function Message({ message, sender, time }) {
  return (
    <div
      className={`message ${
        sender === "user" ? "user-message" : "assistant-message"
      } shadow-lg p-2`}
    >
      <div
        className="border rounded-xl p-px overflow-auto"
        style={{ borderColor: sender === "user" ? "#f7f7f7" : "#ccc" }}
      >
        {message.content && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className={`p-2 ${sender === "user" ? "" : "prose"}`}
            components={{ a: LinkRenderer }}
          >
            {`${message.content}`}
          </ReactMarkdown>
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

function LinkRenderer(props) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}
