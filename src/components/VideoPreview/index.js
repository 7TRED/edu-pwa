import React from "react";
import ReactPlayer from "react-player";

const isValidURL = (url) => {
  try {
    const uri = new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

function VideoPreview({ url }) {
  return (
    isValidURL(url) && (
      <div className=" shadow-lg mt-4 z-12 p-px rounder-lg flex items-center justify-center">
        <ReactPlayer controls={true} url={url} width={"26rem"} height={"14.625rem"} />
      </div>
    )
  );
}

export default VideoPreview;
