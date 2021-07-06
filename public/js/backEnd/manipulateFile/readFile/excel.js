const XLSX = require('xlsx');

const ExcelWorkbook = {
    async getFirstSheetData(filePath) {
        let wb = XLSX.readFile(filePath);
        let firstSheetName = wb.SheetNames[0];
        let ws = wb.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(ws, { header: 1 });
        return json;
      },

    async convertToDate(date){ 
      if (date != undefined) {
        let convertDate = XLSX.SSF.parse_date_code(date);
    
        if (convertDate.d < 10) convertDate.d = `0${convertDate.d}`;
    
        if (convertDate.m < 10) convertDate.m = `0${convertDate.m}`;
    
        return `${convertDate.d}/${convertDate.m}/${convertDate.y}`;
      }
    }
}

module.exports = ExcelWorkbook;