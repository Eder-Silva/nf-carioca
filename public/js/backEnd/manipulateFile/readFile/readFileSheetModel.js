const ExcelWorkbook = require('./excel.js');
const fetch = require('node-fetch');
const parserXml = require('xml2js');
const fs = require('fs');

const SupplierInfo = require('../../database/Models/supplierInfoModel');
const dialogMessages = require('../../dialogMessage/dialogMessages');

const getSupplierInfInBD = async (cnpj) => {
  try {
    let supplierInf = await SupplierInfo.findOne({
      supCnpj: cnpj,
    });

    let supCnpj = supplierInf.supCnpj;
    let supName = supplierInf.supName;
    let supInscMunic = supplierInf.supInscMunic;
    let supInscEstad = supplierInf.supInscEstad;
    let supCep = supplierInf.supCep;
    let supUf = supplierInf.supUf;
    let supCity = supplierInf.supCity;
    let supBairro = supplierInf.supBairro;
    let supTypeAddress = supplierInf.supTypeAddress;
    let supAddress = supplierInf.supAddress;
    let supComp = supplierInf.supComp;
    let supTel = supplierInf.supTel;
    let supMail = supplierInf.supMail;
    let supNum = supplierInf.supNum;
    return {
      success: true,
      data: {
        supCnpj,
        supName,
        supInscMunic,
        supInscEstad,
        supCep,
        supUf,
        supCity,
        supBairro,
        supTypeAddress,
        supAddress,
        supComp,
        supTel,
        supMail,
        supNum,
      },
    };
  } catch (err) {
    return { success: false, data: {} };
  }
};

const getSupplierInfApi = async (cnpj) => {
  try {
    let apiUrl = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
    let apiResponse = await fetch(apiUrl);
    let responseObject = await apiResponse.json();

    if (
      responseObject.message == `CNPJ ${cnpj} inválido.` ||
      responseObject.message == `CNPJ ${cnpj} não encontrado.`
    )
      return {
        success: false,
        data: {},
      };

    let supCnpj = responseObject.cnpj;
    let supName = responseObject.razao_social;
    let supInscMunic = '';
    let supInscEstad = '';
    let supCep = responseObject.cep;
    let supUf = responseObject.uf;
    let supCity = responseObject.municipio;
    let supBairro = responseObject.bairro;
    let supTypeAddress = responseObject.descricao_tipo_logradouro;
    let supAddress = responseObject.logradouro;
    let supComp = responseObject.complemento;
    let supTel = responseObject.ddd_telefone_1.replace(/ /g, '');
    let supMail = '';
    let supNum = responseObject.numero;

    return {
      success: true,
      data: {
        supCnpj,
        supName,
        supInscMunic,
        supInscEstad,
        supCep,
        supUf,
        supCity,
        supBairro,
        supTypeAddress,
        supAddress,
        supComp,
        supTel,
        supMail,
        supNum,
      },
    };
  } catch (err) {
    dialogMessages.withoutConnectionApi();
    return;
  }
};

const validateCpf = (strCPF) => {
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == '00000000000') return false;
  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;
  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;
  Soma = 0;
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;
  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
};

const validateCnpj = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == '00000000000000' ||
    cnpj == '11111111111111' ||
    cnpj == '22222222222222' ||
    cnpj == '33333333333333' ||
    cnpj == '44444444444444' ||
    cnpj == '55555555555555' ||
    cnpj == '66666666666666' ||
    cnpj == '77777777777777' ||
    cnpj == '88888888888888' ||
    cnpj == '99999999999999'
  )
    return false;

  // Valida DVs
  tamanho = cnpj.length - 2;
  numeros = cnpj.substring(0, tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
};

const validateCPFeCNPJ = (value) => {
  if (value.length == 11) {
    let getCpf = validateCpf(value);
    if (getCpf == false) return false;
  } else if (value.length == 14) {
    let getCnpj = validateCnpj(value);
    if (getCnpj == false) return false;
  } else return false;

  return true;
};

const isSavedInBdOrApi = async (cnpj) => {
  let supplierInfs = await getSupplierInfInBD(cnpj);
  if (supplierInfs.success) return true;

  supplierInfs = await getSupplierInfApi(cnpj);
  if (supplierInfs.success == true) return true;
  return false;
};

const isUndefined = (value) => {
  if (value == null || value == undefined) return '';
  return value;
};

let parser = new parserXml.Parser({ mergeAttrs: true });

const readXml = (file) =>
  new Promise((resolve, reject) => {
    let xml_string = fs.readFileSync(file, 'utf8');
    parser.parseString(xml_string, function (error, result) {
      if (error) reject(error);
      resolve(result);
    });
  });

const getDate = (value) => {
  let sharedValue = value.split('T');
  let date = sharedValue[0];
  let sharedDate = date.split('-');
  return `${sharedDate[2]}/${sharedDate[1]}/${sharedDate[0]}`;
};

const formatValue = (value) => {
  return value.replace('.', ',');
};

const getAllXmlFiles = (directory) => {
  let files = [];
  (function getAllFiles(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const pathAbsolute = `${directory}/${file}`;
      if (fs.statSync(pathAbsolute).isDirectory())
        return getAllFiles(pathAbsolute);
      else return files.push(pathAbsolute);
    });
  })(directory);
  return files;
};

const getInfoFromXmlFileVit = async (agroupmentPath, competence) => {
  let filesXml = await getAllXmlFiles(agroupmentPath);
  let isXmlFile = filesXml.filter(
    (file) => file.split('.').pop().toLowerCase() == 'xml'
  );
  let isEqualDate = [];
  for (let counter = 0; counter < isXmlFile.length; counter++) {
    let file = isXmlFile[counter];
    let xml = await readXml(file);
    let issuedDate =
      xml?.ConsultarNfseResposta?.ListaNfse[0]?.CompNfse[0]?.Nfse[0]?.InfNfse[0]
        ?.DataEmissao[0];
    let dateAreEqual = issuedDate.substr(0, 7) == competence.substr(0, 7);
    if (dateAreEqual) isEqualDate.push(file);
  }

  if (isEqualDate.length == 0) return;

  let response = [];

  for (let counter = 0; counter < isEqualDate.length; counter++) {
    let file = isEqualDate[counter];
    let xml = await readXml(file);

    let propPath =
      xml?.ConsultarNfseResposta?.ListaNfse[0]?.CompNfse[0]?.Nfse[0]
        ?.InfNfse[0];
    let issueDate = getDate(propPath?.DataEmissao[0]);

    let competenceDate = getDate(propPath?.DataEmissao[0]); //verificar com Natália
    let invoice = propPath?.Numero[0];
    let serie = propPath?.IdentificacaoRps[0]?.Serie[0];
    let cnpjsupplier =
      propPath?.PrestadorServico[0]?.IdentificacaoPrestador[0]?.Cnpj[0];
    let codeServcity = ''; //ItemListaServico  VERIFICAR NO FUTURO
    let branch = ''; //NÃO ESTAMOS USANDO
    let typeTaxation = formatValue(''); //NÃO ESTAMOS USANDO
    let taxBenefit = formatValue(''); //NÃO ESTAMOS USANDO
    let invoiceType = propPath?.IdentificacaoRps[0]?.Tipo[0];
    let simpleOptant = propPath?.OptanteSimplesNacional[0];
    let supplier = propPath?.PrestadorServico[0]?.RazaoSocial[0];
    let valueService = parseFloat(
      propPath?.Servico[0]?.Valores[0]?.ValorServicos[0]
    );
    let deductionsValue = formatValue(
      propPath?.Servico[0]?.Valores[0]?.ValorDeducoes[0]
    );
    let issAliquot = parseFloat(propPath?.Servico[0]?.Valores[0]?.Aliquota[0]);
    let issRetained = parseFloat(
      propPath?.Servico[0]?.Valores[0]?.ValorIssRetido[0]
    );
    let issAnalize = formatValue('');

    //========================verificar com abraão=========================
    let address = propPath?.PrestadorServico[0]?.Endereco[0]?.Endereco[0];
    let codeServCities =
      propPath?.PrestadorServico[0]?.Endereco[0]?.CodigoMunicipio;
    let codeServCity = '';
    if (codeServCities != undefined) codeServCity = codeServCities[0];
    let cep = propPath?.PrestadorServico[0]?.Endereco[0]?.Cep[0];
    //USAREMOS O CEP PARA A API

    let inssRetained11 = formatValue('');
    let irrf1708 = formatValue('');
    let irrf8045 = formatValue('');
    let pcc5952 = formatValue('');
    let pis5979 = formatValue('');
    let cofin5960 = formatValue('');
    let liquid = formatValue(
      propPath?.Servico[0]?.Valores[0]?.ValorLiquidoNfse[0]
    );
    let comments = propPath?.Servico[0]?.Discriminacao[0];
    let cei = ''; //NÃO ESTAMOS USANDO
    let isCountsConditionedValues = formatValue(
      propPath?.Servico[0]?.Valores[0]?.DescontoCondicionado[0]
    );
    let isCountsUnconditionedValues = formatValue(
      propPath?.Servico[0]?.Valores[0]?.DescontoIncondicionado[0]
    );

    response.push({
      issueDate,
      competenceDate,
      invoice,
      serie,
      cnpjsupplier,
      codeServcity,
      branch,
      typeTaxation,
      taxBenefit,
      invoiceType,
      simpleOptant,
      supplier,
      valueService,
      deductionsValue,
      issAliquot,
      issRetained,
      issAnalize,
      address,
      codeServCity,
      cep,
      inssRetained11,
      irrf1708,
      irrf8045,
      pcc5952,
      pis5979,
      cofin5960,
      liquid,
      comments,
      cei,
      isCountsConditionedValues,
      isCountsUnconditionedValues,
    });
  }

  let invalidsCpfOrCnpj = response.filter((nf) =>
  validateCPFeCNPJ(nf.cnpjsupplier.toString())
  );

  let notSavedSuppliers = [];
  for (let count = 0; count < invalidsCpfOrCnpj.length; count++) {
    let isSaved = await isSavedInBdOrApi(invalidsCpfOrCnpj[count].cnpjsupplier);
    if (!isSaved) notSavedSuppliers.push(invalidsCpfOrCnpj[count].cnpjsupplier);
  }

  if (notSavedSuppliers.length > 0) {
    let isInvalids = notSavedSuppliers.map((invalids) => invalids.cnpjsupplier);
    dialogMessages.cpfOrCnpjInvalid(isInvalids);
    return false;
  }

  return response;
};

const getInfoFromXmlFileRj = async (agroupmentPath) => {
  let response = [];
  //prettier-ignore
  let worksheetData = await ExcelWorkbook.getFirstSheetData(agroupmentPath);
  let usableData = worksheetData.filter((excelLine) => !isNaN(excelLine[0]));

  let nfData = usableData.map((excelLine) =>
    [...excelLine].map((excelCell) => isUndefined(excelCell))
  );

  for (let counter = 0; counter < nfData.length; counter++) {
    let excelLine = nfData[counter];

    response.push({
      issueDate: await ExcelWorkbook.convertToDate(excelLine[0]),
      competenceDate: await ExcelWorkbook.convertToDate(excelLine[1]),
      invoice: excelLine[2],
      serie: excelLine[3],
      cnpjsupplier: excelLine[4],
      codeServcity: excelLine[5],
      branch: excelLine[6],
      typeTaxation: excelLine[7],
      taxBenefit: excelLine[8],
      invoiceType: excelLine[9],
      simpleOptant: excelLine[10],
      supplier: excelLine[11],
      valueService: excelLine[12] || 0,
      deductionsValue: excelLine[13] || 0,
      issAliquot: excelLine[14],
      issRetained: excelLine[15] || 0,
      issAnalize: excelLine[16],
      citysupplier: excelLine[17],
      inssRetained11: excelLine[18],
      irrf1708: excelLine[19],
      irrf8045: excelLine[20],
      pcc5952: excelLine[21],
      pis5979: excelLine[22],
      cofin5960: excelLine[23],
      liquid: excelLine[24],
      comments: excelLine[25],
      cei: excelLine[26],
      isCountsConditionedValues: 0,
      isCountsUnconditionedValues: 0,
    });
  }
  let invalidsCpfOrCnpj = response.filter(
    (nf) => !validateCPFeCNPJ(nf.cnpjsupplier.toString())
  );

  let notSavedSuppliers = [];
  for (let count = 0; count < invalidsCpfOrCnpj.length; count++) {
    let isSaved = await isSavedInBdOrApi(invalidsCpfOrCnpj[count].cnpjsupplier);
    if (!isSaved) notSavedSuppliers.push(invalidsCpfOrCnpj[count]);
  }

  if (notSavedSuppliers.length > 0) {
    let isInvalids = notSavedSuppliers.map((invalids) => invalids.cnpjsupplier);
    dialogMessages.cpfOrCnpjInvalid(isInvalids);
    return false;
  }

  return response;
};

module.exports = { getInfoFromXmlFileVit, getInfoFromXmlFileRj };

