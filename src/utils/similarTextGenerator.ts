import { createEdits } from "@/pages/api/open-ai";

export const generateTexts = async (
  input: string,
  number: number,
  temperature: number
) => {
  const res = await createEdits(
    input,
    "Fogalmazd át a termék leírást",
    number,
    temperature
  );
  return res;
};
