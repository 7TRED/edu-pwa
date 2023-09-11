import {FaFileAlt, FaTimes } from "react-icons/fa";



function UploadPreview({fileObjectURL, filename, fileType, onCancel}){
    console.log(filename)
    return (
        fileObjectURL && (<a href={fileObjectURL} target="blank" className="upload-container flex justify-evenly items-center border-2 rounded-20 bg-white ">
            <div className="preview-container h-full m-2">
                <FaFileAlt className="h-full" color="#777"/>
            </div>
            { filename && <p className="file-name text-slate-500">{filename?.substring(0, 10) + "..."}</p> }
            {onCancel && <button className="cross-button" onClick={onCancel}>
                <FaTimes />
            </button>}
        </a>)
    )
}


export default UploadPreview;