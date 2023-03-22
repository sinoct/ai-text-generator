import { createChat, createEdits } from "@/pages/api/open-ai";

export const generateTexts = async (
  input: string,
  number: number,
  temperature: number,
  instruction: string
) => {
  const res = await createChat(`${instruction}: ${input}`, number, temperature);
  return res;
};
