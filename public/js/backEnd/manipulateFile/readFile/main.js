const {
  getInfoFromXmlFileVit,
  getInfoFromXmlFileRj,
} = require('./readFileSheetModel');
const {
  createNewFileTxtVitoria,
  createNewFileTxtRj,
} = require('../writeFile/createFileTxt');

const dialogMessages = require('../../dialogMessage/dialogMessages');


let manipulateFilesVitoria = async (arguments) => {
  let mainPath = 'C:/Users/eder.souza/Desktop/FIT_XML_TERCEIRO'
  let savePath = arguments[0]
  let companyInf = arguments[1]
  let companyIM = companyInf.companyIM
  let companyCnpj = companyInf.companyCnpj
  let competence = arguments[2]
  let folderContainingXmlFiles = `${mainPath}/${companyCnpj}/`

  //prettier-ignore
  let wsModelGroup = await getInfoFromXmlFileVit(folderContainingXmlFiles, competence);
  if (!wsModelGroup) return false;

   let newFileTxt = await createNewFileTxtVitoria(
    wsModelGroup,
    savePath,
    companyIM
  );
  dialogMessages.createdFile();
};

let manipulateFilesRj = async (arguments) => {
  //prettier-ignore
  let filePathSheetModel = arguments[0];
  let savePath = arguments[1];
  let companyIM = arguments[2].companyIM;
  //prettier-ignore
  let wsModelGroup = await getInfoFromXmlFileRj(filePathSheetModel);
  if (!wsModelGroup) return;
  await createNewFileTxtRj(wsModelGroup, savePath, companyIM);
  dialogMessages.createdFile();
};

module.exports = { manipulateFilesVitoria, manipulateFilesRj };
