import axios from "axios";

const botapi = axios.create({
  baseURL: "http://localhost:7071/api/ChatBotTrigger",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // whatever you want
  },
});

const postBotApiRequest = async (context) => {
  console.log(context);
  const response = await botapi.post("/", {
    context,
  });

  return response.data;
};

export default postBotApiRequest;
