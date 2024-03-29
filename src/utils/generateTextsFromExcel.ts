import { Dispatch, SetStateAction } from "react";
import { generateTexts } from "./similarTextGenerator";

const generateVariations = async (
  item: any,
  input: string,
  number: number,
  temperature: number,
  instruction: string,
  iteration: number,
  model: string
) => {
  try {
    let variations = await generateTexts(
      input,
      number,
      temperature,
      instruction,
      model
    );
    return variations;
  } catch (error) {
    if (iteration > 3) {
      return item;
    } else {
      generateVariations(
        item,
        input,
        number,
        temperature,
        instruction,
        iteration + 1,
        model
      );
    }
  }
};

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
  excelFieldName: string,
  model: string
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
        const generated = await generateVariations(
          item,
          item[fieldName],
          count,
          random,
          instruction,
          1,
          model
        );
        let updated = item;
        const choices = generated.data.choices;
        for (let i = 0; i < count; i++) {
          let string =
            choices[i].message?.content.trim().replace(/^\s+|\s+$/gi, "\n") ||
            "";
          updated[`variant-${i + 1}`] = string;
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
