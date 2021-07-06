const CompanyInformation = require('../Models/companyInfomationsModel.js');
const dialogMessages = require('../../dialogMessage/dialogMessages.js');

const companyActions = {
  findCompanyInfBD: async ([idCompany, environmentName]) => {
    try {
      let companyInf = await CompanyInformation.findOne({
        companyId: idCompany,
        companyEnvironment: environmentName,
      });

      let companyName = companyInf.companyName;
      let companyCnpj = companyInf.companyCnpj;
      let companyIM = companyInf.companyIM;
      return {
        success: true,
        data: {
          companyName,
          companyCnpj,
          companyIM,
        },
      };
    } catch (err) {
      dialogMessages.companyNotFound();
      return { success: false, data: {} };
    }
  },

  insertCompanyInfBD: async (companyInfo) => {
    let companyInformations = {
      companyId: companyInfo.companyIdentification,
      companyEnvironment: companyInfo.companyEnvironment,
      companyName: companyInfo.companyName,
      companyCnpj: companyInfo.companyCnpj,
      companyIM: companyInfo.companyIM,
    };

    try {
      let createCompany = await CompanyInformation.findOneAndUpdate(
        companyInformations,
        companyInformations,
        { upsert: true, setDefaultsOnInsert: true, new: true }
      );
      dialogMessages.registredInformation();
    } catch (err) {
      dialogMessages.notRegistredInformation();
    }
  },
};

module.exports = companyActions;
