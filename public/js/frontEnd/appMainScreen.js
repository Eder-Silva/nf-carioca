const remote = require('electron').remote
const {getItemInLS} = require('./appGetItemInLS.js')

// Minimize application button
document.querySelector('#minWin').addEventListener('click', () => {
  remote.BrowserWindow.getFocusedWindow().minimize();
});

// Maximize application button
document.querySelector('#maxWin').addEventListener('click', () => {
  let isWindowMaximized = remote.BrowserWindow.getFocusedWindow().isMaximized();
  isWindowMaximized
    ? remote.BrowserWindow.getFocusedWindow().unmaximize()
    : remote.BrowserWindow.getFocusedWindow().maximize();
});

// Close application button
document.querySelector('#closeWin').addEventListener('click', () => {
  remote.BrowserWindow.getFocusedWindow().close();
});

const setFooterInformation = async () => {
  let footer = document.querySelector('#footer')   

  let companyInfosInLs = await getItemInLS()
  if(!companyInfosInLs) return footer.innerText = '';
  
  let id = companyInfosInLs.companyId
  let environment = companyInfosInLs.companyEnvironment
  let name = companyInfosInLs.companyName
  let cnpj = companyInfosInLs.companyCnpj
  let im = companyInfosInLs.companyIM
  footer.innerText = `Id: ${id} | Ambiente: ${environment} | Nome: ${name} | CNPJ: ${cnpj} | Inscrição Municipal: ${im}`
}

module.exports = {setFooterInformation}