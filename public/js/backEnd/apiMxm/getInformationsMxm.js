const fetch = require('node-fetch');

const idPattern = (id) => {
    if (id.length == 1) return `0${id}`;
    return id;
  };

  let apiNewResponse = async (companyInfo, apiUrl, options) => {
    let apiResponse = await fetch(apiUrl, options);
    let responseObject = await apiResponse.json();
  
    let notHasCompanyName =
      responseObject.Data == undefined || responseObject.Data[0] == undefined;
  
    let response;
    if (!notHasCompanyName) {
      response = await responseObject.Data[0].NomeEmpresa;
      return response;
    }
    response = false;
    return response;
  };
  
  const returnCompanyName = async ([idCompany, environmentName]) => {
    idCompany = idPattern(idCompany);

    let apiUrl =
      'https://mcs001.mxmwebmanager.com.br/api/InterfaceEmpresaFilial/ConsultarEmpresa';
  
    let contentBody = {
      AutheticationToken: {
        Username: 'MCS.ABRAAO',
        Password: 'markup01',
        EnvironmentName: environmentName
      },
      Data: {
        Codigo: idCompany
      }
    };
  
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contentBody)
    };
  
    let response = await apiNewResponse(
      [idCompany, environmentName],
      apiUrl,
      options
    );
      
    return response;
  };
  
  module.exports = returnCompanyName;