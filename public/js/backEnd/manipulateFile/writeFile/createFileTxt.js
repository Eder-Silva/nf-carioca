const fs = require('fs');
const fetch = require('node-fetch');
const SupplierInfo = require('../../database/Models/supplierInfoModel');

const formatValue = (value) => {
  return value.replace('.', ',');
};

const competenceMonth = (date) => date.split('/')[1];
const competenceYear = (date) => date.split('/')[2];

const createFile = async (savePath, txtContent) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(savePath, txtContent, (err) => {
      if (err) reject;
      resolve('Arquivo Criado');
    });
  });
};

const getHeaderContentVitoria = (headerData) => {
  let {
    monthCompetence,
    yearCompetence,
    itemAmount,
    formatedDecValue,
    formatedIssWithheldValue,
    citySubscription,
  } = headerData;

  let initials = 'DST'; // FIXED: 'Declaração de Serviços Tomados'
  let cityCode = '05309'; // FIXED: IBGE City Code for Vitória City

  return [
    initials,
    cityCode,
    monthCompetence,
    yearCompetence,
    itemAmount,
    formatedDecValue,
    formatedIssWithheldValue,
    citySubscription,
  ].join('|');
};

const convertSerie = (serie) => {
  let notNumber = serie.replace(/\D+/g, '').length < serie.length;
  if (serie == !/[^0]/ || notNumber) return '001';
  return serie;
};

const getBodyContentVitoria = (nf) => {
  let {
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
  } = nf;

  let dfNumber = invoice;
  let dfModel = '04'; //'Nota Fiscal'
  console.log(serie)
  let dfSerie = convertSerie(serie);
  let dfType = 'Nota Fiscal'; //VERIFICAR COM O ABRAÃO
  let contractNumber = ''; //VERIFICAR COM O ABRAÃO
  let dfIssuanceDate = issueDate;
  let dfPaymentDate = competenceDate;
  let dfSituation = 'Normal';
  let IncidentTaxRate = formatValue(issAliquot.toFixed(1));
  let dfValue = formatValue(valueService.toFixed(2));
  let dfAppliedDisallowanceValue = '';
  let dfMaterialValueIncluded = ''; //Pode acontecer, mas essa opção deve estar na planilha modelo, até por que impacta no valor do ISS.
  let dfSubcontractedValueIncluded = '';
  let dfISSAmountRetained = formatValue(issRetained.toFixed(2));
  let supplierCnpj = '';
  let cpfSupplier = '';

  if (cnpjsupplier.toString().length > 11) supplierCnpj = cnpjsupplier;
  else cpfSupplier = cnpjsupplier;

  return [
    dfNumber,
    dfModel,
    dfSerie,
    dfType,
    contractNumber,
    dfIssuanceDate,
    dfPaymentDate,
    dfSituation,
    IncidentTaxRate,
    dfValue,
    dfAppliedDisallowanceValue,
    dfMaterialValueIncluded,
    dfSubcontractedValueIncluded,
    dfISSAmountRetained,
    supplierCnpj,
    cpfSupplier,
    '',
  ].join('|');
};

const createNewFileTxtVitoria = async (
  nfsData,
  savePath,
  citySubscription = 'municipio de teste'
) => {
  let competence = nfsData[0].competenceDate;
  let monthCompetence = competenceMonth(competence);
  let yearCompetence = competenceYear(competence);
  let itemAmount = nfsData.length;

  let serviceValue = (acc, excelLine) => acc + excelLine.valueService;
  let decValue = nfsData.reduce(serviceValue, 0).toFixed(2);
  let formatedDecValue = await formatValue(decValue);

  let issValue = (acc, excelLine) => acc + excelLine.issRetained;
  let issWithheldValue = nfsData.reduce(issValue, 0).toFixed(2);
  let formatedIssWithheldValue = await formatValue(issWithheldValue);

  let headerData = {
    monthCompetence,
    yearCompetence,
    itemAmount,
    formatedDecValue,
    formatedIssWithheldValue,
    citySubscription, // TEMP: Vem do front-end
  };

  let headerContent = getHeaderContentVitoria(headerData);
  let bodyCotent = nfsData.map((nf) => getBodyContentVitoria(nf));

  let txtContent = [headerContent, ...bodyCotent].join('\n');
  let isCreated = await createFile(savePath, txtContent);
};

const converteDate = (info) => {
  let splitDate = info.split('/');
  let formatedDate = `${splitDate[2]}${splitDate[1]}${splitDate[0]}`;
  return formatedDate;
};

const numericStandard = (info, standard) => {
  if (info.toString().length > standard) return info;
  if (info.toString().length === standard) return info;
  return numericStandard(`0${info}`, standard);
};

const stringStandard = (info, standard, { before = true } = {}) => {
  if (info.length > standard) return info.substr(0, standard);

  let isBeforeAndShort = before && info.length < standard;
  if (isBeforeAndShort) return `${' '.repeat(standard - info.length)}${info}`;

  let isAfterAndShort = info.length < standard;
  if (isAfterAndShort) return `${info}${' '.repeat(standard - info.length)}`;

  return info;
};

const getHeaderContentRj = async (headerData) => {
  let { cnpjProvider, citySubscription, competence } = headerData;

  let recordType = '10';
  let archiveVersion = '003';

  if (cnpjProvider == '') cnpjProvider = '0';
  let taxpayerId = cnpjProvider.toString().length > 11 ? 2 : 1;
  cnpjProvider = numericStandard(cnpjProvider, 14);
  citySubscription = numericStandard(citySubscription, 15);

  let startDate = 0;
  let endDate = 0;

  for (let chave in headerData) {
    if (chave != 'competence') continue;

    let competence = headerData[chave];
    if (startDate === 0) {
      startDate = competence;
      endDate = competence;
    }

    if (competence < startDate) startDate = competence;
    if (competence > endDate) endDate = competence;
  }

  startDate = await converteDate(startDate);
  endDate = await converteDate(endDate);

  return [
    recordType,
    archiveVersion,
    taxpayerId,
    cnpjProvider,
    citySubscription,
    startDate,
    endDate,
  ].join('');
};

const verifyCpfCnpj = (info) => {
  if (info == 0) return (info = 3);
  let taxpayerId = info.toString().length > 11 ? 2 : 1;
  return taxpayerId;
};

const removeFloat = (value, { isNumeric = true } = {}) => {
  if (isNumeric) return value.toFixed(2).replace(/\./g, '');
  return value.replace(/\./g, '');
};

const convertNumbersLessTen = (value) => {
  if (value < 10) return `0${value}`;
  return `${value}`;
};

const getCodeFederalService = (code) => {
  let removeFloatCode = removeFloat(code, { isNumeric: false });
  return removeFloatCode.substr(0, 4);
};

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
    if (responseObject.message == `CNPJ ${cnpj} inválido.`)
      return { success: false, data: {} };

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
    console.log('Não foi possível se conectar com a API');
  }
};

const getBodyContentRj = (nf, citySubscription, supplierInfs) => {
  let {
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
    citysupplier,
    inssRetained11,
    irrf1708,
    irrf8045,
    pcc5952,
    pis5979,
    cofin5960,
    liquid,
    comments,
    cei,
  } = nf;

  let {
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
  } = supplierInfs.data;

  //FUNÇÃO PARA BUSCAR OS DADOS NO BANCO DE DADOS

  let recordType = '40';
  let noteTypeConventional = convertNumbersLessTen(invoiceType);
  let noteSeriesConventional = numericStandard(serie, 5);
  let noteNumberConventional = stringStandard(invoice.toString(), 15);
  let DateIssueNoteConventional = converteDate(competenceDate);
  let noteStatusConventional = 1;
  if (cnpjsupplier == '') cnpjsupplier = '0';
  let supplierDocumentType = verifyCpfCnpj(cnpjsupplier);
  let documentNumber = numericStandard(cnpjsupplier, 14);
  let citysupplierRegistration = stringStandard(citySubscription, 15);
  let nameIdentificationsupplier = stringStandard(supplier, 40);
  let typeTaxationServices = convertNumbersLessTen(typeTaxation);
  let reserved23 = stringStandard('', 54);
  let optionBySimple = simpleOptant.toUpperCase() == 'NÃO' ? 0 : 1; //
  let codeFederalService = getCodeFederalService(codeServcity);
  let reserved26 = stringStandard('', 11);
  let codeBenefit = numericStandard(taxBenefit, 3);
  let codecityService = removeFloat(codeServcity, {
    isNumeric: false,
  });
  let aliquot = numericStandard(issAliquot, 5);
  valueService = removeFloat(valueService);
  let serviceValue = numericStandard(valueService, 15);
  deductionsValue = removeFloat(deductionsValue);
  let valueDeductions = numericStandard(deductionsValue, 15);
  let reserved30 = stringStandard('', 30);
  let removedFloatIssRetained = removeFloat(issRetained);
  let issValue = numericStandard(removedFloatIssRetained, 15);
  let retainedIss = issRetained ? 1 : 0;
  let dateCompetence = converteDate(competenceDate);
  let codeWork = stringStandard(cei, 15);
  let annotationResponsibilityTechnique = stringStandard('', 15);
  let discriminationServices = stringStandard(comments, 4000, {
    before: false,
  });

  let supplierStateRegistration;
  let addressTypesupplier;
  let addresssupplier;
  let numberAdresssupplier;
  let complementAddresssupplier;
  let neighborhoodsupplier;
  let cityOfsupplier;
  let ufsupplier;
  let cepsupplier;
  let supplierPhone;
  let emailsupplier;

  if (supplierInfs.success == false) {
    supplierStateRegistration = numericStandard('', 15);
    addressTypesupplier = stringStandard('', 3);
    addresssupplier = stringStandard('', 125);
    numberAdresssupplier = stringStandard('', 10);
    complementAddresssupplier = stringStandard('', 60);
    neighborhoodsupplier = stringStandard('', 72);
    cityOfsupplier = stringStandard('', 50);
    ufsupplier = stringStandard('', 2);
    cepsupplier = numericStandard('', 8);
    supplierPhone = stringStandard('', 11);
    emailsupplier = stringStandard('', 80);

    return [
      recordType,
      noteTypeConventional,
      noteSeriesConventional,
      noteNumberConventional,
      DateIssueNoteConventional,
      noteStatusConventional,
      supplierDocumentType,
      documentNumber,
      citysupplierRegistration,
      supplierStateRegistration,
      nameIdentificationsupplier,
      addressTypesupplier,
      addresssupplier,
      numberAdresssupplier,
      complementAddresssupplier,
      neighborhoodsupplier,
      cityOfsupplier,
      ufsupplier,
      cepsupplier,
      supplierPhone,
      emailsupplier,
      typeTaxationServices,
      reserved23,
      optionBySimple,
      codeFederalService,
      reserved26,
      codeBenefit,
      codecityService,
      aliquot,
      serviceValue,
      valueDeductions,
      reserved30,
      issValue,
      retainedIss,
      dateCompetence,
      codeWork,
      annotationResponsibilityTechnique,
      discriminationServices,
    ].join('');
  }

  supplierStateRegistration = numericStandard(supInscEstad, 15);
  addressTypesupplier = stringStandard(supTypeAddress, 3);
  addresssupplier = stringStandard(supAddress, 125);
  numberAdresssupplier = stringStandard(supNum, 10);
  complementAddresssupplier = stringStandard(supComp, 60);
  neighborhoodsupplier = stringStandard(supBairro, 72);
  cityOfsupplier = stringStandard(supCity, 50);
  ufsupplier = stringStandard(supUf, 2);
  cepsupplier = stringStandard(supCep, 8);
  supplierPhone = stringStandard(supTel, 11);
  emailsupplier = stringStandard(supMail, 80);

  return [
    recordType,
    noteTypeConventional,
    noteSeriesConventional,
    noteNumberConventional,
    DateIssueNoteConventional,
    noteStatusConventional,
    supplierDocumentType,
    documentNumber,
    citysupplierRegistration,
    supplierStateRegistration,
    nameIdentificationsupplier,
    addressTypesupplier,
    addresssupplier,
    numberAdresssupplier,
    complementAddresssupplier,
    neighborhoodsupplier,
    cityOfsupplier,
    ufsupplier,
    cepsupplier,
    supplierPhone,
    emailsupplier,
    typeTaxationServices,
    reserved23,
    optionBySimple,
    codeFederalService,
    reserved26,
    codeBenefit,
    codecityService,
    aliquot,
    serviceValue,
    valueDeductions,
    reserved30,
    issValue,
    retainedIss,
    dateCompetence,
    codeWork,
    annotationResponsibilityTechnique,
    discriminationServices,
  ].join('');
};

const formatedValue = (value, qtd) => {
  let totalValueWithoutFloat = removeFloat(value);
  let totalValue = numericStandard(totalValueWithoutFloat, qtd);
  return totalValue;
};

const getFooterRj = async (nf) => {
  let {
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
    citysupplier,
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
  } = nf;

  let registrationType = '90';
  let numberLineDetails = numericStandard(nf.length, 8);

  let valuesServices = (acc, excelLine) => acc + excelLine.valueService;
  let totalValueServices = nf.reduce(valuesServices, 0);
  let totalServices = formatedValue(totalValueServices, 15);

  let valuesDeductions = (acc, excelLine) => acc + excelLine.deductionsValue;
  let totalValueDeductions = nf.reduce(valuesDeductions, 0);
  let totalDeduction = formatedValue(totalValueDeductions, 15);

  let valuesDiscountsConditioned = (acc, excelLine) =>
    acc + excelLine.isCountsConditionedValues;
  let totalValueDiscountsConditioned = nf.reduce(valuesDiscountsConditioned, 0);
  let totalConditioned = formatedValue(totalValueDiscountsConditioned, 15);

  let valuesDiscountsUnconditioned = (acc, excelLine) =>
    acc + excelLine.isCountsUnconditionedValues;
  let totalValueDiscountsUnconditioned = nf.reduce(
    valuesDiscountsUnconditioned,
    0
  );
  let totalUnconditioned = formatedValue(totalValueDiscountsUnconditioned, 15);

  return [
    registrationType,
    numberLineDetails,
    totalServices,
    totalDeduction,
    totalConditioned,
    totalUnconditioned,
  ].join('');
};

const createNewFileTxtRj = async (
  nfsData,
  savePath,
  citySubscription = 'municipio de teste'
) => {
  let cnpjProvider = nfsData[0].cnpjsupplier;
  let competence = nfsData[0].competenceDate;

  let headerData = {
    cnpjProvider,
    citySubscription,
    competence,
  };

  let headerContent = await getHeaderContentRj(headerData);

  let supplierInfs = await getSupplierInfInBD(headerData.cnpjProvider);
  if (supplierInfs.success == false) {
    supplierInfs = await getSupplierInfApi(headerData.cnpjProvider);
  }

  let bodyCotent = nfsData.map((nf) =>
    getBodyContentRj(nf, citySubscription, supplierInfs)
  );

  let footerContent = await getFooterRj(nfsData);
  let txtContent = [headerContent, ...bodyCotent, footerContent].join('\n');
  let isCreated = await createFile(savePath, txtContent);
};

module.exports = { createNewFileTxtVitoria, createNewFileTxtRj };
