import React, { useContext } from "react";
import { BsFillSendFill } from "react-icons/bs";
import FileUploadButton from "../FileUploadButton";
import UploadPreview from "../UploadPreview";
import ProgressBar from "../ProgressBar";
import _ from "lodash";
import useMobileDetect from "../../hooks/useMobileDetect";

import "./styles.css";
import { BOOK_SUMMARIZER_BOT_CACHE_NAME, TabContext } from "../../context/TabContext";

export default function ChatInput({ onSend }) {
  const { isMobile } = useMobileDetect();
  const { cacheName } = useContext(TabContext);

  const [input, setInput] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");

  // can be used to provide a preview of the files
  //   const [filePreview, setFilePreview] = React.useState(null);

  const [showFilePreview, setShowFilePreview] = React.useState(false);

  const [fileUploadProgress, setFileUploadProgress] = React.useState(0);
  const [isFileUploading, setIsFileUploading] = React.useState(false);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = () => {
    console.log(input);
    if (input.trim() || file) {
      onSend({
        content: input,
        file: file
          ? {
              file: _.cloneDeep(file),
              url: URL.createObjectURL(file),
              filename: _.cloneDeep(fileName),
            }
          : null,
      });
      setInput("");
      setShowFilePreview(false);
      setFilesToDefault();
    }
  };

  const setFilesToDefault = () => {
    setFile(null);
    // setFilePreview(null);
    setFileName(null);
    setShowFilePreview(false);
  };

  const calculateRows = () => {
    return Math.min(input.split(/\n/g).length, 7);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();

    reader.readAsDataURL(selectedFile);

    reader.onloadstart = (progressEvent) => {
      setIsFileUploading(true);
    };

    reader.onload = (progressEvent) => {
      const { loaded, total } = progressEvent;
      setFileUploadProgress(Math.floor((loaded * 100) / total));
    };

    reader.onloadend = (progressEvent) => {
      setIsFileUploading(false);
      // setFilePreview(reader.result);
      setFileUploadProgress(0);
      setShowFilePreview(true);
    };
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey || isMobile()) {
        return;
      }
      handleSubmit();
      event.preventDefault();
    }
  };

  const handleFileUploadCancel = (e) => {
    e.preventDefault();
    setFilesToDefault();
  };

  return (
    <div className="chat-input-container container flex flex-col shadow-md mt-8 mb-2">
      <div className="chat-input container m-1 flex-start">
        <textarea
          rows={calculateRows()}
          value={input}
          maxLength={2000}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your messsage here..."
          className="container outline-none border-0 focus:border-0 focus:outline-none"
        />
        {cacheName === BOOK_SUMMARIZER_BOT_CACHE_NAME && (
          <FileUploadButton handleFileSelect={handleFileSelect} />
        )}
        <button onClick={(e) => handleSubmit()}>
          <BsFillSendFill className="h-full w-full rotate-45" color="#155e75" />
        </button>
      </div>
      {showFilePreview && (
        <div className="chat-options flex items-end justify-end p-2 w-full">
          {showFilePreview && (
            <UploadPreview
              fileObjectURL={URL.createObjectURL(file)}
              filename={fileName}
              onCancel={handleFileUploadCancel}
            />
          )}
          {isFileUploading && <ProgressBar percentage={fileUploadProgress} />}
        </div>
      )}
    </div>
  );
}
