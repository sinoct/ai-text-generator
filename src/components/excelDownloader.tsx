import { FunctionComponent } from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

interface ExcelDownloaderProps {
  dataset: any;
}

const ExcelDownloader: FunctionComponent<ExcelDownloaderProps> = ({
  dataset,
}) => {
  return (
    <ExcelFile>
      <ExcelSheet data={dataset} name="Items">
        <ExcelColumn label="Cikkszám" value="name" />
        <ExcelColumn label="Termék Név" value="amount" />
        <ExcelColumn label="Rövid Leírás" value="sex" />
        <ExcelColumn label="Parancs" value="name" />
        <ExcelColumn label="TR" value="name" />
        <ExcelColumn label="TD" value="name" />
        <ExcelColumn label="TV" value="name" />
        <ExcelColumn label="TS" value="name" />
        <ExcelColumn label="PR" value="name" />
        <ExcelColumn label="Paraméter: Djeco cikkszám||text" value="name" />
      </ExcelSheet>
    </ExcelFile>
  );
};
export default ExcelDownloader;
