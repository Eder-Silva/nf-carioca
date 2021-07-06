const { ipcMain } = require('electron');
const companyActions = require('../database/actions/actionsCompanyInf.js');
const supplierActions = require('../database/actions/actionsSupplierInf');
const {
  manipulateFilesVitoria,
  manipulateFilesRj,
} = require('../manipulateFile/readFile/main.js');
const dialogMessages = require('../dialogMessage/dialogMessages');

ipcMain.handle('get-company-inf', async (event, companyInfo) => {
  let companyInf = await companyActions.findCompanyInfBD(companyInfo);
  return companyInf;
});

ipcMain.handle('insert-company-inf', async (event, companyInfo) => {
  let companyInf = await companyActions.insertCompanyInfBD(companyInfo);
  return companyInf;
});

ipcMain.handle('file-txt-vitoria', async (event, arguments) => {
  await manipulateFilesVitoria(arguments);   
});
//prettier-ignore
ipcMain.handle('file-txt-rj', async (event, arguments) => 
  await manipulateFilesRj(arguments));

ipcMain.handle('register-supplier-inf', async (event, values) => {
  let supplierInf = await supplierActions.insertSupplierInfBD(values);
  return supplierInf;
});

ipcMain.handle('search-supplier-inf', async (event, cnpj) => {
  let supplierInfBD = await supplierActions.searchSupplierInfBD(cnpj);
  if (supplierInfBD.success == false) {
    let supplierInfAPI = await supplierActions.getSupplierInfApi(cnpj);
    
    return supplierInfAPI;
  }

  return supplierInfBD;
});

ipcMain.handle('get-address-inf', async (event, cep) => {
  let addressInf = await supplierActions.getAddressInfApi(cep);
  return addressInf;
});
