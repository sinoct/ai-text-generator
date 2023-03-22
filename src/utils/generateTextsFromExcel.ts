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
        let fieldName = "Rövid Leírás";
        const keys = Object.keys(item);
        for (let i = 0; i < keys.length; i++) {
          if (
            keys[i].localeCompare(fieldName, "en", { sensitivity: "base" }) ===
            0
          ) {
            fieldName = keys[i];
            break;
          }
        }
        const generated = await generateTexts(item[fieldName], count, random);
        let updated = item;
        const choices = generated.data.choices;
        updated["TR"] = choices[0].message?.content || "";
        updated["TD"] = choices[1].message?.content || "";
        updated["TV"] = choices[2].message?.content || "";
        updated["TS"] = choices[3].message?.content || "";
        updated["PR"] = choices[4].message?.content || "";
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
