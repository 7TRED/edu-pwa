import React, { useContext, useEffect } from "react";
import _ from "lodash";
import { TUTOR_BOT_CACHE_NAME, TabContext } from "./TabContext";
import useIDBCache from "../hooks/useIDBCache";
import { toast } from "react-toastify";

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
  const { cacheName, currentCache, getCache, createCurrentCache, apiRequestMethod } =
    useContext(TabContext);
  const [messages, setMessages] = React.useState([]);
  const [profile, setProfile] = React.useState("learner");
  const {
    getCache: getProfileCache,
    updateCache,
    createCache,
  } = useIDBCache("profile", "");

  const makeOpenAIBotRequest = async (prompt, currentProfile) => {
    //to-do process the message

    setMessages((oldValue) => (oldValue.length > 0 ? [prompt, ...oldValue] : oldValue));

    const response = await apiRequestMethod(prompt, currentProfile);

    setMessages((oldValue) => [response.output, ...oldValue]);
  };

  const changeProfile = async (newProfile) => {
    await updateCache((oldValue) => newProfile);
    let prompt = {
      message: {
        content: "",
        file: null,
      },
      sender: "user",
      type: "profile",
      time: new Date().toLocaleTimeString(),
    };
    if (newProfile === "learner") {
      prompt.message.content =
        "Hello Edu.ai, my profile is of a learner, would love your help in learning";
    } else {
      prompt.message.content =
        "Hello Edu.ai, I'm an educator, would love your help in educating people";
    }

    await makeOpenAIBotRequest(prompt, newProfile);
    setProfile(newProfile);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      //do some message fetching or something
      let cache = await getCache();
      if (!cache) {
        await createCurrentCache();
        cache = await getCache();
      }
      const newMessages = [];
      let profilePrompt = {};
      cache.forEach((element) => {
        if (element.output) {
          newMessages.push(element.output);
        }

        if (
          element.prompt &&
          !Object.keys(element.prompt).includes("type") &&
          element.prompt.type !== "profile"
        ) {
          newMessages.push(element.prompt);
        }
      });

      if (cacheName === TUTOR_BOT_CACHE_NAME && newMessages.length <= 0) {
        if (newMessages.length <= 0) {
          let cachedProfile = await getProfileCache();
          if (!cachedProfile) {
            await createCache();
          }
          await updateCache((oldValue) => "learner");
          setProfile("learner");
        } else {
          let cachedProfile = await getProfileCache();
          setProfile(cachedProfile);
        }
      }

      setMessages(newMessages);
    };

    fetchMessages();
  }, [cacheName, currentCache]);

  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, profile, changeProfile, makeOpenAIBotRequest }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
