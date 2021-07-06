const SupplierInfo = require('../Models/supplierInfoModel');
const dialogMessages = require('../../dialogMessage/dialogMessages.js');
const fetch = require('node-fetch');

const supplierActions = {
  insertSupplierInfBD: async (values) => {
    let supplierInformations = {
      supCnpj: values.cnpj,
      supName: values.name,
      supInscMunic: values.cityRegistration,
      supInscEstad: values.stateRegistration,
      supCep: values.cep,
      supUf: values.uf,
      supCity: values.city,
      supBairro: values.neighborhood,
      supTypeAddress: values.typeAddress,
      supAddress: values.address,
      supComp: values.complement,
      supTel: values.telephone,
      supMail: values.mail,
      supNum: values.number,
    };

    try {
      let createSupplier = await SupplierInfo.findOneAndUpdate(
        supplierInformations,
        supplierInformations,
        { upsert: true, setDefaultsOnInsert: true, new: true }
      );
      dialogMessages.registredInformation();
    } catch (err) {
      dialogMessages.notRegistredInformation();
    }
  },

  searchSupplierInfBD: async (cnpj) => {
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
      let supTel = supplierInf.supTel
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
  },

  getAddressInfApi: async (cep) => {
    try {
      let apiUrl = `https://brasilapi.com.br/api/cep/v1/${cep}`;
      let apiResponse = await fetch(apiUrl);
      let responseObject = await apiResponse.json();

      return responseObject;
    } catch (err) {
      console.log('Não foi possível se conectar com a API');
    }
  },

  getSupplierInfApi: async (cnpj) => {
    try {
      let apiUrl = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
      let apiResponse = await fetch(apiUrl);
      let responseObject = await apiResponse.json();
      if (responseObject.message == `CNPJ ${cnpj} inválido.` ||
      responseObject.message == `CNPJ ${cnpj} não encontrado.`){
        dialogMessages.cpfOrCnpjNotFound(cnpj)
        return { success: false, data: {} }; }

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
      let supTel = responseObject.ddd_telefone_1.replace(/ /g,"");
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
  },
};

module.exports = supplierActions;
