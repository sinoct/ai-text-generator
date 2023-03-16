import { FunctionComponent, useState } from "react";
import { generateTexts } from "@/utils/similarTextGenerator";
import { generateTextFromExcel } from "@/utils/generateTextsFromExcel";
import * as xlsx from "xlsx";
import { BarLoader } from "react-spinners";
import ExcelDownloader from "./excelDownloader";

const SimilatTextGenerator: FunctionComponent = () => {
  const [copies, setCopies] = useState(1);
  const [excel, setExcel] = useState({});
  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState({ current: 0, from: 0 });
  const [downloadExcel, setDownloadExcel] = useState({});

  const copiesChangeHandler = (newText: any) => {
    setCopies(newText.target.value);
  };

  const generateVariations = async () => {
    setLoader(true);
    const json = await generateTextFromExcel(excel, copies, setProgress);
    console.log(json);
    setLoader(false);
    setDownloadExcel(json);
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
      <div className="flex gap-8 items-center">
        <div>
          <label htmlFor="upload">Upload File</label>
          <input
            type="file"
            name="upload"
            id="upload"
            onChange={readUploadFile}
          />
        </div>

        <div className="flex gap-4">
          <label htmlFor="width"> Number of Copies</label>
          <input
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
      <button
        className="bg-blue-700 hover:bg-blue-500 p-4 rounded"
        onClick={() => exportData(downloadExcel)}
      >
        Download
      </button>
    </div>
  );
};

export default SimilatTextGenerator;
