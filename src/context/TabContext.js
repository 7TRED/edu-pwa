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

  async function makeYTSummarizerBotRequest(prompt) {}

  async function makeQARequest(prompt) {
    const request = {
      collection_name: prompt.message.collection_name,
      query: prompt.message.content,
    };

    const response = await postQAApiRequest(request);

    return addResponseToCache(prompt, response);
  }

  async function addResponseToCache(prompt, response) {
    const promptToCache = { prompt, output: {} };
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
