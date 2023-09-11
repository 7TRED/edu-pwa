import UploadPreview from "./UploadPreview";


export default function Message ({message, sender, time}){
    console.log(message.file)
    return (
        <div className={`message ${sender === "user" ? "user-message" : "assistant-message"} shadow-lg p-2`}>
            {message.content && <p className="message-text">{message.content}</p> }
            <hr/>
            <div className="container w-full p-2 flex">
                {message.file && <UploadPreview fileObjectURL={message.file.url} filename={message.file.filename}/>}
            </div>
            
            <div style={{
                color : sender === "user" ? "white" : "#333333"
            }} className="message-time">{time}</div>
        </div>
    );
}