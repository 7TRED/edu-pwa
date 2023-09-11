
export default function ChatHeader({name, mode}) {
    return (
        <div className="chat-header w-full bg-white sticky shadow-md p-5">
            <div className="chat-name">{name}</div>
            <div className="chat-mode">{mode}</div>
        </div>
    )
}