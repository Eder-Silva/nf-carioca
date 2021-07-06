const puppeteer = require('puppeteer');

const getIdentifier = (value) => {
  return value == 'headoffice' ? 1 : 2;
};
const getDescription = (value) => {
  return value == 'headoffice' ? 'Matriz' : 'Filial';
};
const convertDate = (date) => {
  let splitDate = date.split('/');
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
};

(async (cnpj) => {
  //try {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://consulta.guru/consultar-cnpj-gratis/${cnpj}`);

  await page.waitForSelector('#ember18');
  const companyName = await page.$eval('#ember18', (element) => {
    return element.children[1].innerText;
  });

  if (companyName == '') return { message: `CNPJ ${cnpj} inválido.` };

  await page.waitForSelector('#partner');
  const [unityId, unityDesc] = await page.$eval('#ember19', (element) => {
    let text = element.children[1].innerText;
    let identifier = getIdentifier(text);
    let description = getDescription(text);
    return [identifier, description];
  });

  const registerStatus = await page.$eval('#ember24', (element) => {
    let text = element.children[1].innerText;
    return text;
  });

  const [registerDate, startDate] = await page.$eval('#ember21', (element) => {
    let text = element.children[1].innerText
    let cadastralDate = convertDate(text);
    let activityStartDate = convertDate(text);
    return [cadastralDate, activityStartDate];
  });

  const legalNature = await page.$eval('#ember22', (element) => {
    return text.split(' ')[0].replace(/\D+/g, '')
  });

  const address = await page.$eval('#ember25', (element) => {
    let text = element.children[0].innerText;
    return text
  });

  const contact = await page.$eval('#contact', (element) => {
    return element.children[1].innerText;
  });
  let mail = '';
  let telephone = '';
  if (contact.split('\n')[0] == 'E-mail') {
    mail = contact.split('\n')[2];
    telephone = contact.split('\n')[6].replace(/\D+/g, '').trim();
  } else if (contact.split('\n')[0] == 'Telefone') {
    telephone = contact.split('\n')[2].replace(/\D+/g, '').trim();
  }
  await page.close();

  console.log({
    success: true,
    data: {
      cnpj: cnpj,
      identificador_matriz_filial: unityId,
      descricao_matriz_filial: unityDesc,
      razao_social: companyName,
      descricao_situacao_cadastral: registerStatus,
      data_situacao_cadastral: registerDate, 
      codigo_natureza_juridica: legalNature,
      data_inicio_atividade: startDate,
      logradouro: address,
      ddd_telefone_1: telephone,
      email: mail,
    },
  });
})('01475178000585');
