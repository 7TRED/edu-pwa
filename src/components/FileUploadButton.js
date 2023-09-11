import {FaPlus} from 'react-icons/fa'

const FileUploadButton = ({handleFileSelect})=>{

    return ( 
        <div className='container flex items-center justify-center w-6 h-6 p-px mr-4 border-2 rounded-full border-purple-500/50 '>
            <label htmlFor="file_input">
                <div>
                    <FaPlus className='w-full h-full' color="#ba4bff"/>
                </div>
                <input onChange={handleFileSelect} type="file" accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .doc, .docx" id="file_input" name="file_input" hidden/>
            </label>
        </div>
    )
}

export default FileUploadButton;