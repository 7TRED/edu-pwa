import React, { useEffect } from "react";
import useIDBCache from "../hooks/useIDBCache";
import postBotApiRequest from "../services/chatbot";
import _ from "lodash";

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
    const promptToCache = { prompt, output: {} };

    //to-do process the message
    setMessages((oldValue) => [prompt, ...oldValue]);

    const context = await generateContextFromCache();
    context.push({
      role: prompt.sender,
      content: prompt.message.content,
    });

    console.log(context);
    // response format is context[i]
    const response = await postBotApiRequest(context);
    console.log(response);
    promptToCache.output = {
      message: {
        content: response.content,
        file: null,
      },
      sender: response.role,
      time: new Date().toLocaleTimeString(),
    };

    await updateCache((oldValue) => [promptToCache, ...oldValue]);

    setMessages((oldValue) => [promptToCache.output, ...oldValue]);
  };

  async function generateContextFromCache() {
    const cache = await getCache();
    const context = [];

    if (cache.length <= 0) {
      return context;
    }

    cache.forEach((c) => {
      if (!_.isEmpty(c.output)) {
        context.push({
          role: c.output.sender,
          content: c.output.message.content,
        });
      }
      if (!_.isEmpty(c.prompt)) {
        context.push({
          role: c.prompt.sender,
          content: c.prompt.message.content,
        });
      }
    });

    return context.reverse().slice(Math.max(0, context.length - 6));
  }

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
