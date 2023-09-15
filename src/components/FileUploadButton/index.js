import { FaPlus } from "react-icons/fa";
import "./styles.css";

const FileUploadButton = ({ handleFileSelect }) => {
  return (
    <div className="container flex items-center justify-center w-6 h-6 p-px mr-4 border-2 rounded-full border-cyan-800 ">
      <label htmlFor="file_input">
        <div>
          <FaPlus className="w-full h-full" color="#155e75" />
        </div>
        <input
          onChange={handleFileSelect}
          type="file"
          accept=".pdf"
          id="file_input"
          name="file_input"
          hidden
        />
      </label>
    </div>
  );
};

export default FileUploadButton;
