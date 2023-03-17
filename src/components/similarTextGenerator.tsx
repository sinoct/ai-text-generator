import { FunctionComponent, useState } from "react";
import { generateTextFromExcel } from "@/utils/generateTextsFromExcel";
import * as xlsx from "xlsx";
import { BarLoader } from "react-spinners";

const SimilatTextGenerator: FunctionComponent = () => {
  const [copies, setCopies] = useState(1);
  const [excel, setExcel] = useState({});
  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState({ current: 0, from: 0 });
  const [downloadExcel, setDownloadExcel] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);

  const copiesChangeHandler = (newText: any) => {
    setCopies(newText.target.value);
  };

  const generateVariations = async () => {
    setLoader(true);
    const json = await generateTextFromExcel(excel, copies, setProgress);
    console.log(json);
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
    xlsx.writeFile(workbook, "DataSheet.xlsx");
  };

  const exportData = (json: any) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(json)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
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
            className="p-1 text-center"
            type="number"
            max="5"
            min="0"
            value={copies}
            name="width"
            onInput={copiesChangeHandler}
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
      <div>
        <BarLoader color="#36d7b7" loading={loader} />
        {loader && (
          <div>
            {progress.current}/{progress.from}
          </div>
        )}
      </div>
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
