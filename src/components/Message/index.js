import ReactMarkdown from "react-markdown";
import UploadPreview from "../UploadPreview";
import "./styles.css";
import remarkGfm from "remark-gfm";
import Logo from "../../images/logo.png";
import { useContext } from "react";
import { MessagesContext } from "../../context/MessagesContext";
import { toast } from "react-toastify";

export default function Message({ message, sender, time, type }) {
  const { changeProfile } = useContext(MessagesContext);

  const handleStellarEducator = async (e) => {
    const newProfile = "educator";
    await toast.promise(changeProfile(newProfile), {
      pending: "Welcome 😃",
    });
  };

  const handleDigitalLearner = async (e) => {
    const newProfile = "learner";
    await toast.promise(changeProfile(newProfile), {
      pending: "Learning begins 😃",
    });
  };

  function renderWelcomeMessage() {
    return (
      <div className="card flex w-full flex-col">
        <div className="card-body flex items-center justify-start p-2 ">
          <div className="card-content flex flex-col">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className={`px-2 prose`}
              components={{ a: LinkRenderer }}
            >
              {
                " ## Welcome to EduAI \n Hello, nice to meet you, I'm EduAI, happy to help you in your learning journey😃, please tell me who are you ?"
              }
            </ReactMarkdown>
            <div className="card-actions mt-2">
              <button
                onClick={handleStellarEducator}
                className=".card-action px-2 py-1 border border-2 border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white duration-300 m-px rounded-md"
              >
                Stellar Educator
              </button>
              <button
                onClick={handleDigitalLearner}
                className=".card-action px-2 py-1 border border-2 border-cyan-800 text-cyan-800 hover:bg-cyan-800 hover:text-white duration-300 m-1 rounded-md"
              >
                Digital Learner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`message ${
        sender === "user" ? "user-message" : "assistant-message"
      } shadow-lg`}
    >
      <div
        className={`${sender === "user" ? "" : "border rounded-lg p-px"} tracking-wider`}
        style={{ borderColor: sender === "user" ? "#f7f7f7" : "#ccc" }}
      >
        {type === "welcome" && renderWelcomeMessage()}
        {message && message.content && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className={`px-2 ${sender === "user" ? "" : "prose"}`}
            components={{ a: LinkRenderer }}
          >
            {`${message.content}`}
          </ReactMarkdown>
        )}

        {message && message.file && (
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
