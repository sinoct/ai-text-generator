import { FunctionComponent, useState } from "react";
import { generateTextFromExcel } from "@/utils/generateTextsFromExcel";
import * as xlsx from "xlsx";
import { BarLoader } from "react-spinners";

const SimilatTextGenerator: FunctionComponent = () => {
  const [copies, setCopies] = useState(5);
  const [random, setRandom] = useState(1);
  const [fileName, setFileName] = useState("table");
  const [instruction, setInstruction] = useState(
    "Fogalmazd át a termék leírást"
  );
  const [descriptionFieldName, setdescriptionFieldName] =
    useState("Rövid Leírás");
  const [excel, setExcel] = useState({});
  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState({ current: 0, from: 0 });
  const [downloadExcel, setDownloadExcel] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);
  const models = ["gpt-4", "gpt-4-turbo-preview", "gpt-3.5-turbo"];
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const copiesChangeHandler = (newText: any) => {
    setCopies(newText.target.value);
  };

  const fileNameChangeHandler = (newText: any) => {
    setFileName(newText.target.value);
  };

  const descriptionFieldChangeHandler = (newText: any) => {
    setdescriptionFieldName(newText.target.value);
  };

  const instructionChangeHandler = (newText: any) => {
    setInstruction(newText.target.value);
  };

  const randomChangeHandler = (newText: any) => {
    setRandom(newText.target.value);
  };
  const modelSelect = (newText: any) => {
    setSelectedModel(newText.target.value);
  };

  const generateVariations = async () => {
    setDownloadReady(false);
    setLoader(true);
    const json = await generateTextFromExcel(
      excel,
      copies,
      random,
      setProgress,
      instruction,
      descriptionFieldName,
      selectedModel
    );
    setLoader(false);
    setDownloadExcel(json);
    setDownloadReady(true);
  };

  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setExcel(json);
      };
      try {
        reader.readAsArrayBuffer(e.target.files[0]);
      } catch {}
    }
  };

  const convertToJson = (json: any) => {
    const worksheet = xlsx.utils.json_to_sheet(json);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-16 md:gap-0 md:flex-row justify-center w-full">
      <div className="flex flex-col lg:flex-col gap-8 sm:gap-4 items-center justify-center basis-1/2">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label
            className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white w-full basis-1/2"
            htmlFor="upload"
          >
            Upload File:
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            name="upload"
            id="upload"
            onChange={readUploadFile}
          />
        </div>

        <label className="flex flex-col md:flex-row gap-4 items-center">
          Select language model:
          <select name="colors" id="colorID" onChange={modelSelect}>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col sm:flex-row  gap-4 items-center">
          <label htmlFor="copies"> Number of Copies</label>
          <input
            className="p-1 text-center rounded w-[64px]"
            type="number"
            min="0"
            value={copies}
            name="copies"
            onInput={copiesChangeHandler}
          />
        </div>

        <div className="flex flex-col sm:flex-row  gap-4 items-center">
          <label htmlFor="random"> Random factor</label>
          <input
            className="p-1 text-center rounded w-[64px]"
            type="number"
            max="2"
            min="0"
            step="0.1"
            value={random}
            name="random"
            onInput={randomChangeHandler}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label htmlFor="descField"> Name of Description field: </label>
          <input
            className="p-1 text-center rounded"
            value={descriptionFieldName}
            name="descField"
            onInput={descriptionFieldChangeHandler}
          />
        </div>

        <div className="flex flex-col sm:flex-row  gap-4 items-center">
          <label htmlFor="filename"> File Name: </label>
          <input
            className="p-1 text-center rounded md:w-[256px]"
            value={fileName}
            name="filename"
            onInput={fileNameChangeHandler}
          />
        </div>

        <div className="flex flex-col sm:flex-row  gap-4 items-center">
          <label htmlFor="instruction"> Instruction: </label>
          <input
            className="p-1 text-center md:rounded w-[256px]"
            value={instruction}
            name="instruction"
            onInput={instructionChangeHandler}
          />
        </div>

        <div className="flex pt-0 md:pt-16">
          <button
            className={`bg-blue-700 hover:bg-blue-500 p-4 rounded ${
              Object.keys(excel).length === 0
                ? "bg-gray-500 hover:bg-gray-500  cursor-not-allowed"
                : ""
            } ${loader ? "bg-gray-500 cursor-wait" : ""}`}
            onClick={() => {
              if (Object.keys(excel).length !== 0 || !loader)
                generateVariations();
            }}
          >
            Create similar text
          </button>
        </div>
      </div>
      <div className="flex justify-center itmes-center basis-1/2 w-full">
        {loader && (
          <div className="flex justify-center items-center gap-4 p-4">
            <BarLoader color="#36d7b7" loading={loader} />
            <div>
              {progress.current}/{progress.from}
            </div>
          </div>
        )}
        {downloadReady && (
          <div className="flex justify-center items-center">
            <button
              className="bg-blue-700 hover:bg-blue-500 p-4 rounded h-24"
              onClick={() => convertToJson(downloadExcel)}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilatTextGenerator;
