import React, { useEffect, useState } from "react";
import useIDBCache from "../hooks/useIDBCache";
import postBotApiRequest, {
  postQAApiRequest,
  postYTSummarizerApiRequest,
} from "../services/chatbot";
import _ from "lodash";
import commands, { commandsList, generateMarkdown } from "./commands";

export const TabContext = React.createContext(null);

export const TUTOR_BOT_CACHE_NAME = "edu.ai-tutor-bot-cache";
export const YT_SUMMARIZER_BOT_CACHE_NAME = "edu.ai-yt-bot-cache";
export const BOOK_SUMMARIZER_BOT_CACHE_NAME = "edu.ai-book-summarizer";

const CURRENT_CACHE_NAME = "current_cache";

export const TabContextProvider = ({ children }) => {
  const [cacheName, setCacheName] = useState(TUTOR_BOT_CACHE_NAME);
  const [currentCache, setCurrentCache] = useState([]);
  const [apiRequestMethod, SetApiRequestMethod] = useState(() => makeTutorBotAPIRequest);
  const { getCache, createCache, clearCache, updateCache } = useIDBCache(cacheName, []);
  const { getCache: getCurrentCacheName, updateCache: updateCacheName } = useIDBCache(
    CURRENT_CACHE_NAME,
    TUTOR_BOT_CACHE_NAME
  );

  //as the cachename gets changed the API request method will change accordingly
  useEffect(() => {
    async function setUpTabContext() {
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

      const cache = await getCache();
      await updateCacheName((oldCacheName) => cacheName);
      setCurrentCache(cache);
    }

    setUpTabContext();
  }, [cacheName]);

  // useEffect to fetch the current cache name
  useEffect(() => {
    async function fetchCacheName() {
      const name = await getCurrentCacheName();
      setCacheName(cacheName);
    }

    fetchCacheName();
  }, []);

  async function clearCurrentCache() {
    await clearCache();
    const cache = await getCache();
    setCurrentCache(cache);
  }

  async function createCurrentCache() {
    await createCache([]);
    const cache = await getCache();
    setCurrentCache(cache);
  }

  async function updateCurrentCache(updaterCallback) {
    await updateCache(updaterCallback);
    const cache = await getCache();
    setCurrentCache(cache);
  }

  async function makeTutorBotAPIRequest(prompt) {
    console.log(prompt);
    // check for command
    const [command, content] = parseCommand(prompt.message.content);

    let response = {};
    console.log(command);
    switch (command?.cmd) {
      case commandsList.SUMMARIZE_YT_VIDEO:
        response = await postYTSummarizerApiRequest({ url: content });
        break;

      case commandsList.HELP:
        response = {
          role: "assistant",
          content: `## Commands \n\n${generateMarkdown(commands)}`,
        };
        break;

      default:
        const context = await generateContextFromCache();
        context.push({
          role: prompt.sender,
          content: content,
        });

        response = await postBotApiRequest(context);
        console.log(response);
    }

    return addResponseToCache(prompt, response);
  }

  async function makeYTSummarizerBotRequest(prompt) {
    console.log(prompt);
    // check for command
    const [command, content] = parseCommand(prompt.message.content);

    let response = {};
    console.log(command);
    switch (command?.cmd) {
      case commandsList.SUMMARIZE_YT_VIDEO:
        response = await postYTSummarizerApiRequest({ url: content });
        break;

      case commandsList.HELP:
        response = {
          role: "assistant",
          content: `## Commands \n\n${generateMarkdown(commands)}`,
        };
        break;

      default:
        const context = await generateContextFromCache();
        context.push({
          role: prompt.sender,
          content: content,
        });

        response = await postBotApiRequest(context);
    }

    return addResponseToCache(prompt, response);
  }

  async function makeQARequest(prompt) {
    const request = {
      collection_name: prompt.message.collection_name,
      query: prompt.message.content,
    };

    const response = await postQAApiRequest(request);

    return addResponseToCache(prompt, response);
  }

  async function addResponseToCache(prompt, response) {
    let promptToCache = { prompt, output: {} };

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

  function parseCommand(content) {
    let cmds = commands.filter((cmd) => {
      return content.trim().startsWith(cmd.cmd);
    });
    let command = null;
    if (cmds.length > 0) {
      command = cmds[0];
    }

    return [command, content.slice(command?.cmd.length)];
  }

  return (
    <TabContext.Provider
      value={{
        currentCache,
        cacheName,
        setCacheName,
        getCache,
        clearCurrentCache,
        updateCurrentCache,
        createCurrentCache,
        apiRequestMethod,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
