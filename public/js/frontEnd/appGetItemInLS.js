const getItemInLS = async () => {
  let companyInfosInLs = await localStorage.getItem('companyInformations');
  companyInfosInLs = await JSON.parse(companyInfosInLs);
  return companyInfosInLs
};

const getCompanyImInfoInLs = async () => {
    let companyInfoInLs = await localStorage.getItem(
      'companyInformations'
    );
    companyInfoInLs = await JSON.parse(companyInfoInLs);
    let companyIM = companyInfoInLs.companyIM;
    let companyCnpj = companyInfoInLs.companyCnpj
    return {
      companyIM,
      companyCnpj
    }
  }

module.exports = {getItemInLS, getCompanyImInfoInLs}
