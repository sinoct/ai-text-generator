import { Dispatch, SetStateAction } from "react";
import { generateTexts } from "./similarTextGenerator";

export const generateTextFromExcel = async (
  excel: any,
  count: number,
  random: number,
  updateProgress: Dispatch<
    SetStateAction<{
      current: number;
      from: number;
    }>
  >
) => {
  let progress = 0;
  let json: any[] = [];
  updateProgress({ current: progress, from: excel.length });
  await Promise.all(
    excel.map(async (item: any, index: any) => {
      try {
        const generated = await generateTexts(
          item["Rövid Leírás"],
          count,
          random
        );
        let updated = item;
        const choices = generated.data.choices;
        updated["TR"] = choices[0].text || "";
        updated["TD"] = choices[1].text || "";
        updated["TV"] = choices[2].text || "";
        updated["TS"] = choices[3].text || "";
        updated["PR"] = choices[4].text || "";
        json[index] = updated;
        progress += 1;
        updateProgress({ current: progress, from: excel.length });
      } catch (error) {
        json[index] = item;
        progress += 1;
        updateProgress({ current: progress, from: excel.length });
      }
    })
  );
  return json;
};
