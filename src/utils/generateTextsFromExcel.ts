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
  >,
  instruction: string,
  excelFieldName: string
) => {
  let progress = 0;
  let json: any[] = [];
  updateProgress({ current: progress, from: excel.length });
  await Promise.all(
    excel.map(async (item: any, index: any) => {
      try {
        let fieldName = excelFieldName;
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
        const generated = await generateTexts(
          item[fieldName],
          count,
          random,
          instruction
        );
        let updated = item;
        const choices = generated.data.choices;
        for (let i = 0; i < count; i++) {
          updated[`variant-${i + 1}`] = choices[i].message?.content || "";
        }
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
