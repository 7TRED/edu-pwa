import axios from "axios";

const botapi = axios.create({
  baseURL: "https://eduai.azurewebsites.net/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // whatever you want
  },
  params: {
    code: "h1SPW8Gs_Jh2Q77nZO7BaVQvuCCFpeXkO54NGnc0ZlygAzFuKGImwQ==",
  },
});

// comment
export const postTeacherBotApiRequest = async (context) => {
  console.log(context);
  const response = await botapi.post("/ChatBotTeacherTrigger", {
    context,
  });

  return response.data;
};

const postBotApiRequest = async (context) => {
  console.log(context);
  const response = await botapi.post("/ChatBotTrigger", {
    context,
  });

  return response.data;
};

export const postQAApiRequest = async (body) => {
  console.log(body);
  const response = await botapi.post("/QATrigger", {
    ...body,
  });

  return response.data;
};

export const postYTSummarizerApiRequest = async (body) => {
  console.log(body);
  const response = await botapi.post("/YTTrigger", {
    ...body,
  });

  return response.data;
};

export default postBotApiRequest;
