import React, { useEffect, useState } from "react";
import useIDBCache from "../hooks/useIDBCache";
import postBotApiRequest from "../services/chatbot";
import _ from "lodash";

export const TabContext = React.createContext(null);

export const TUTOR_BOT_CACHE_NAME = "edu.ai-tutor-bot-cache";
export const YT_SUMMARIZER_BOT_CACHE_NAME = "edu.ai-yt-bot-cache";
export const BOOK_SUMMARIZER_BOT_CACHE_NAME = "edu.ai-book-summarizer";

export const TabContextProvider = ({ children }) => {
  const [cacheName, setCacheName] = useState(TUTOR_BOT_CACHE_NAME);
  const [apiRequestMethod, SetApiRequestMethod] = useState(() => makeTutorBotAPIRequest);
  const { getCache, createCache, clearCache, updateCache } = useIDBCache(cacheName, []);

  //as the cachename gets changed the API request method will change accordingly
  useEffect(() => {
    switch (cacheName) {
      case TUTOR_BOT_CACHE_NAME:
        SetApiRequestMethod((c) => makeTutorBotAPIRequest);
        break;
      case YT_SUMMARIZER_BOT_CACHE_NAME:
        SetApiRequestMethod((c) => makeYTSummarizerBotRequest);
        break;
      case BOOK_SUMMARIZER_BOT_CACHE_NAME:
        SetApiRequestMethod((c) => makeQARequest);
        break;
      default:
        SetApiRequestMethod((c) => makeTutorBotAPIRequest);
    }
  }, [cacheName]);

  async function makeTutorBotAPIRequest(prompt) {
    const promptToCache = { prompt, output: {} };
    console.log(prompt);
    const context = await generateContextFromCache();
    context.push({
      role: prompt.sender,
      content: prompt.message.content,
    });

    const response = await postBotApiRequest(context);

    promptToCache.output = {
      message: {
        content: response.content,
        file: null,
      },
      sender: response.role,
      time: new Date().toLocaleTimeString(),
    };

    await updateCache((oldValue) => [promptToCache, ...oldValue]);
    return promptToCache;
  }

  async function makeYTSummarizerBotRequest(prompt) {}

  async function makeQARequest(prompt) {}

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

  return (
    <TabContext.Provider
      value={{
        cacheName,
        setCacheName,
        getCache,
        clearCache,
        updateCache,
        createCache,
        apiRequestMethod,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
