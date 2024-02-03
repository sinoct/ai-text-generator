import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const createEdits = async (
  input: string,
  instruction: string,
  copies: number,
  temperature: number,
  model: string
) => {
  const res = await openai.createEdit(
    {
      model: model,
      input,
      instruction,
      n: Number(copies),
      temperature: Number(temperature),
    },
    {
      headers: {
        "User-Agent": "PostmanRuntime/7.30.0",
      },
    }
  );
  return res;
};

export const getModels = async () => {
  const res = await openai.listModels();
  return res.data;
};

export const createChat = async (
  input: string,
  copies: number,
  temperature: number,
  model: string
) => {
  const completion = await openai.createChatCompletion({
    model: model,
    n: Number(copies),
    temperature: Number(temperature),
    messages: [{ role: "user", content: input }],
  });
  return completion;
};
