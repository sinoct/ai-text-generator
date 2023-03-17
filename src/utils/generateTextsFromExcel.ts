import { Dispatch, SetStateAction } from "react";
import { generateTexts } from "./similarTextGenerator";

export const generateTextFromExcel = async (
  excel: any,
  count: number,
  updateProgress: Dispatch<
    SetStateAction<{
      current: number;
      from: number;
    }>
  >
) => {
  //   excel.map((item: any, index: any) => {
  //     console.log(item);
  //   });
  let json = [];
  for (let i = 0; i < 1; i++) {
    updateProgress({ current: i, from: excel.length });
    try {
      const generated = await generateTexts(excel[i]["Rövid Leírás"], count);
      let updated = excel[i];
      const choices = generated.data.choices;
      updated["TR"] = choices[0].text || "";
      updated["TD"] = choices[1].text || "";
      updated["TV"] = choices[2].text || "";
      updated["TS"] = choices[3].text || "";
      updated["PR"] = choices[4].text || "";
      json.push(updated);
    } catch (error) {
      json.push(excel[i]);
    }
  }
  return json;
};
