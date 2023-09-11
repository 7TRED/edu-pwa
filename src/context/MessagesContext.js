import React, { useEffect } from "react";


export const MessagesContext = React.createContext(null);


export const MessagesContextProvider = ({children})=>{
    const [messages, setMessages] = React.useState([]);

    useEffect(()=>{
        //do some message fetching or something
    })

    return (
        <MessagesContext.Provider value={{messages, setMessages}}>
            {children}
        </MessagesContext.Provider>
    )
}