import React, { useEffect } from "react";
import useIDBCache from "../hooks/useIDBCache";

export const MessagesContext = React.createContext(null);

const cachedPromptsObjectDefault = {
  prompt: {
    message: {
      content: "",
      file: {
        file: null,
        url: "",
        filename: "",
      },
    },
    sender: "user|assistant",
    time: Date.now(),
  },
  output: "same as above",
};

export const MessagesContextProvider = ({ children }) => {
  const { createCache, getCache, updateCache, clearCache } = useIDBCache(
    "edu.ai-chat-cache",
    []
  );
  const [messages, setMessages] = React.useState([]);

  const makeOpenAIChatBotRequest = async (prompt) => {
    const promptToCache = { prompt, output: "" };

    setMessages((oldValue) => [prompt, ...oldValue]);

    const response = await new Promise((resolve) =>
      setTimeout(() => resolve("Hey, I'm Bing. How can I help?"), 3000)
    );
    promptToCache.output = {
      message: {
        content: response,
        file: null,
      },
      sender: "assistant",
      time: new Date().toLocaleTimeString(),
    };

    await updateCache((oldValue) => [promptToCache, ...oldValue]);

    setMessages((oldValue) => [promptToCache.output, ...oldValue]);
  };

  useEffect(async () => {
    //do some message fetching or something
    const cache = await getCache();
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
  }, []);

  return (
    <MessagesContext.Provider value={{ messages, setMessages, makeOpenAIChatBotRequest }}>
      {children}
    </MessagesContext.Provider>
  );
};
