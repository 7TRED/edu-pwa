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
      <div className=" mt-4 z-12 p-px rounder-lg shadow-md flex">
        <ReactPlayer controls={true} url={url} width={"29rem"} height={"16.3125rem"} />
      </div>
    )
  );
}

export default VideoPreview;
