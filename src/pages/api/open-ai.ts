import { Configuration, OpenAIApi } from "openai";

export const createEdits = async (
  input: string,
  instruction: string,
  copies: number
) => {
  const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);
  const res = await openai.createEdit(
    {
      model: "text-davinci-edit-001",
      input,
      instruction,
      n: Number(copies),
    },
    {
      headers: {
        "User-Agent": "PostmanRuntime/7.30.0",
      },
    }
  );
  return res;
};
