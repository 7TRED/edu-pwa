import React from "react";

function ImagePreview({ url, alt }) {
  console.log(url);
  return (
    url && (
      <div className="flex items-center justify-center mx-auto">
        <img
          style={{
            width: "max(100px, 5%)",
            height: "auto",
          }}
          className="shadow-lg bg-white p-2 rounded-md"
          src={url}
          alt={alt}
        />
      </div>
    )
  );
}

export default ImagePreview;
