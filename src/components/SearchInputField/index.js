import React from "react";
import useMobileDetect from "../../hooks/useMobileDetect";

function SearchInputField({ value, type, onChange, onSubmit, clearButton }) {
  const { isMobile } = useMobileDetect();
  return (
    <div
      style={{ width: "80%" }}
      className={
        "max-w-xl  bg-white mt-4 z-10 shadow-md flex " +
        `${isMobile() ? "mb-px" : "mb-2"}`
      }
    >
      <label htmlFor="yt-link" hidden></label>
      <input
        value={value}
        className="outline-none p-2 w-full"
        placeholder="Enter your youtube video URL here..."
        type={type ? type : "text"}
        id="yt-link"
        name="yt-link"
        onChange={onChange}
      />
      {value && (
        <button className="tab-button" onClick={clearButton}>
          X
        </button>
      )}
      <button className="tab-button btn-primary" onClick={onSubmit}>
        Go
      </button>
    </div>
  );
}

export default SearchInputField;
