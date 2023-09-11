import { useContext, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { MessagesContext } from "../context/MessagesContext";


export default function Chat({messages}) {
    

    return (
        <div className="container max-h-full mx-auto">
            <div className="chat-messages">
                {messages.map((message, index)=>{
                    return (
                        <Message key={index} {...message} />
                    )
                })}
            </div>
        </div>
    )
}
