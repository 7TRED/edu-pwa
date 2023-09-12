import axios from "axios";

const botapi = axios.create({
  baseURL: "https://eduai.azurewebsites.net/api/ChatBotTrigger",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // whatever you want
  },
});

const postBotApiRequest = async (context) => {
  console.log(context);
  const response = await botapi.post(
    "/",
    {
      context,
    },
    {
      params: {
        code: "h1SPW8Gs_Jh2Q77nZO7BaVQvuCCFpeXkO54NGnc0ZlygAzFuKGImwQ==",
      },
    }
  );

  return response.data;
};

export default postBotApiRequest;
