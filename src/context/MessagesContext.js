import React, { useContext, useEffect } from "react";
import useIDBCache from "../hooks/useIDBCache";
import postBotApiRequest from "../services/chatbot";
import _ from "lodash";
import { TabContext } from "./TabContext";

export const MessagesContext = React.createContext(null);

// const cachedPromptsObjectDefault = {
//   prompt: {
//     message: {
//       content: "",
//       file: {
//         file: null,
//         url: "",
//         filename: "",
//       },
//     },
//     sender: "user|assistant",
//     time: Date.now(),
//   },
//   output: "same as above",
// };

export const MessagesContextProvider = ({ children }) => {
  const { cacheName, getCache, createCache, apiRequestMethod } = useContext(TabContext);
  const [messages, setMessages] = React.useState([]);

  const makeOpenAIBotRequest = async (prompt) => {
    //to-do process the message
    setMessages((oldValue) => [prompt, ...oldValue]);

    const response = await apiRequestMethod(prompt);

    setMessages((oldValue) => [response.output, ...oldValue]);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      //do some message fetching or something
      let cache = await getCache();
      if (!cache) {
        await createCache();
        cache = await getCache();
      }
      const newMessages = [];
      cache.forEach((element) => {
        if (element.output) {
          newMessages.push(element.output);
        }

        if (element.prompt) {
          newMessages.push(element.prompt);
        }
      });

      setMessages(newMessages);
    };

    fetchMessages();
  }, [cacheName]);

  return (
    <MessagesContext.Provider value={{ messages, setMessages, makeOpenAIBotRequest }}>
      {children}
    </MessagesContext.Provider>
  );
};
