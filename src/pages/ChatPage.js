import { useState, useContext, useEffect, useRef } from "react";


import Chat from "../components/Chat";
import ChatHeader from "../components/ChatHeader";
import { MessagesContext } from "../context/MessagesContext";
import ChatInput from "../components/ChatInput";


export default function ChatPage(){
    const {messages, setMessages} = useContext(MessagesContext);
    const [assistantName, setAssistantName] = useState("Bing");
    const [assistantMode, setAssistantMode] = useState("Balanced");
    const messageEndRef = useRef(null);

     // Function that adds a new message to the state
    function addMessage(input, sender) {
        const time = new Date().toLocaleTimeString();
        const message = {message: input, sender, time};
        setMessages((prevMessages)=>[message, ...prevMessages]);
        messageEndRef.current.scrollIntoView({behavior:'smooth'})
    }

    //Function that handles the user input and sends it to the assistant
    function handleUserInput(input) {
        addMessage(input, "user");

        //Implement the logic to send the prompt to the assistant

        const response = "Hello, this is Bing. How can I help? ";
        handleAssistantResponse({content : response});
    }

    function handleAssistantResponse(response){
        addMessage(response, "assistant");
    }

    const scrollToBotton = ()=>{
        messageEndRef.current.scrollIntoView({behavior:'smooth'});
    }

    useEffect(()=>{
        const greeting = `Hi, I'm ${assistantName}. I'm here to chat with you in ${assistantMode} mode.`;
        handleAssistantResponse({content: greeting});
    },[])

    return (
        <div className="container relative h-screen flex flex-col items-center px-2 mx-auto">
            <ChatHeader name={assistantName} mode={assistantMode}/>
            <div className="chat-container container mx-auto overflow-y-scroll">
                 <Chat messages={messages} />
                 <div ref={messageEndRef}></div>
            </div>
           
            <ChatInput onSend={handleUserInput} />
        </div>
    )
}