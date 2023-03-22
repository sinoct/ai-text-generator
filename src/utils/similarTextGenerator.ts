import { createChat, createEdits } from "@/pages/api/open-ai";

export const generateTexts = async (
  input: string,
  number: number,
  temperature: number
) => {
  // const res = await createEdits(
  //   input,
  //   "Fogalmazd át a termék leírást",
  //   number,
  //   temperature
  // );
  const res = await createChat(
    `Fogalmazd át a termék leírást: ${input}`,
    number,
    temperature
  );
  return res;
};
