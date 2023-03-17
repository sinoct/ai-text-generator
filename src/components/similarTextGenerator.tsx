import { FunctionComponent, useState } from "react";
import { generateTextFromExcel } from "@/utils/generateTextsFromExcel";
import * as xlsx from "xlsx";
import { BarLoader } from "react-spinners";

const SimilatTextGenerator: FunctionComponent = () => {
  const [copies, setCopies] = useState(5);
  const [fileName, setFileName] = useState("table");
  const [excel, setExcel] = useState({});
  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState({ current: 0, from: 0 });
  const [downloadExcel, setDownloadExcel] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);

  const copiesChangeHandler = (newText: any) => {
    setCopies(newText.target.value);
  };
  const fileNameChangeHandler = (newText: any) => {
    setFileName(newText.target.value);
  };

  const generateVariations = async () => {
    setDownloadReady(false);
    setLoader(true);
    const json = await generateTextFromExcel(excel, copies, setProgress);
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
    <div>
      <div className="flex gap-8 items-center justify-center">
        <div className="flex gap-4 items-center py-8">
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

        <div className="flex gap-4 items-center">
          <label htmlFor="width"> Number of Copies</label>
          <input
            className="p-1 text-center rounded"
            type="number"
            max="5"
            min="0"
            value={copies}
            name="width"
            onInput={copiesChangeHandler}
          />
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="width"> File Name: </label>
          <input
            className="p-1 text-center rounded"
            value={fileName}
            name="width"
            onInput={fileNameChangeHandler}
          />
        </div>

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
      {loader && (
        <div className="flex justify-center items-center gap-4 p-4">
          <BarLoader color="#36d7b7" loading={loader} />
          <div>
            {progress.current}/{progress.from}
          </div>
        </div>
      )}
      {downloadReady && (
        <div className="flex justify-center">
          <button
            className="bg-blue-700 hover:bg-blue-500 p-4 rounded"
            onClick={() => convertToJson(downloadExcel)}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default SimilatTextGenerator;
