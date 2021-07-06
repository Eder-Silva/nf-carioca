const { resetHtml } = require('./mainContent.js');
const{getCompanyImInfoInLs} = require('./appGetItemInLS.js')

const dialog = require('electron').remote.dialog;
const { ipcRenderer } = require('electron');
const dialogMessages = require('./dialogMessages/dialogMessage.js');

const xlPath = async (event) => {
  let path = await dialog.showOpenDialog({
    title: 'Escolha um arquivo excel:',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    properties: ['openFile'],
  });

  if (path.canceled) return;
  let inputFilePath = document.querySelector('#inputFilePath');
  inputFilePath.value = path.filePaths[0];
};

const saveTxtPath = async (event) => {
  let path = await dialog.showSaveDialog({
    title: 'Escolha o caminho para salvar o arquivo:',
  });

  if (path.canceled) return 'cancelado';

  let extension = path.filePath.split('.').pop().toUpperCase();
  if (extension != 'TXT') path.filePath = `${path.filePath}.txt`;

  return path.filePath;
};

const importContentClickEvents = async (event) => {
  event.preventDefault();
  if (event.target.id === 'btn-cancel') {
    resetHtml();
    return;
  }

  if (event.target.id === 'btn-search') {
    xlPath(event);
    return;
  }

  if (event.target.id === 'btn-import-rj') {
    let companyIM = await getCompanyImInfoInLs()    

    let savePath = await saveTxtPath();    
    if (savePath == 'cancelado') return;

    let filePath = document.querySelector('#inputFilePath').value;
    if (filePath == '' || savePath == '') return;
    ipcRenderer.invoke('file-txt-rj', [filePath, savePath, companyIM]);
    return;
  }

  if (event.target.id === 'btn-import-vitoria') {

    let competence = document.querySelector('#inputDate')
    if(competence.value == '') {
      competence.style.border = '1px solid red'
      dialogMessages.fieldNotFilled();
      return
    }

    let companyInf = await getCompanyImInfoInLs()   

    let savePath = await saveTxtPath();
    if (savePath == 'cancelado') return;

    dialogMessages.waitProcess()

    ipcRenderer.invoke('file-txt-vitoria', [savePath, companyInf, competence.value]);
    return;
  }
};

let content = document.querySelector('#content');
content.addEventListener('click', (event) => importContentClickEvents(event));
