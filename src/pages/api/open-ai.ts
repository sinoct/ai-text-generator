import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const createEdits = async (
  input: string,
  instruction: string,
  copies: number,
  temperature: number
) => {
  const res = await openai.createEdit(
    {
      model: "text-davinci-edit-001",
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
