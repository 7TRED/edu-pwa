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

function VideoPreview({ url, width, height }) {
  return (
    isValidURL(url) && (
      <div className=" shadow-lg mt-3 p-2 rounder-lg flex items-center justify-center">
        <ReactPlayer
          controls={true}
          url={url}
          width={width ? width : "26rem"}
          height={height ? height : "14.625rem"}
        />
      </div>
    )
  );
}

export default VideoPreview;
