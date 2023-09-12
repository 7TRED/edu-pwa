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
        code: process.env.REACT_APP_EDU_AI_API_CODE,
      },
    }
  );

  return response.data;
};

export default postBotApiRequest;
