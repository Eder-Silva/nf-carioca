const { ipcRenderer } = require('electron');
const dialogMessages = require('./dialogMessages/dialogMessage');

const isEmpty = (input) => {
  let hasEmptyValue = false;
  for (let count = 0; count < input.length; count++) {
    let element = input[count];
    element.style.border =
      element.value === '' ? '1px solid red' : '1px solid rgb(207, 205, 205)';
    if (element.value === '') hasEmptyValue = true;
  }
  return hasEmptyValue;
};

const validateCPF = (strCPF) => {
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

const validateCNPJ = (cnpj) => {
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
    let getCpf = validateCPF(value);
    if (getCpf == false) {
      dialogMessages.cpfNotFilled(value);
      return false;
    }
  } else if (value.length == 14) {
    let getCnpj = validateCNPJ(value);
    if (getCnpj == false) {
      dialogMessages.cnpjNotFilled(value);
      return false;
    }
  } else return false; 
  return true;
};

const registerSupplier = (event) => {
  event.preventDefault();
  if (event.target.id != 'btn-register-supplier') return;
  let inputMandatory = document.querySelectorAll('.mandatory');
  let inputValue = isEmpty(inputMandatory);

  if (inputValue === true) {
    dialogMessages.fieldNotFilled();
    return;
  }

  let cnpj = document
    .querySelector('#supCnpj')
    .value.replace(/\D+/g, '')
    .trim();
  let name = document.querySelector('#supName').value.toUpperCase().trim();
  let cityRegistration = document
    .querySelector('#supInscMunic')
    .value.replace(/\D+/g, '')
    .trim();
  let stateRegistration = document
    .querySelector('#supInscEstad')
    .value.replace(/\D+/g, '')
    .trim();
  let cep = document.querySelector('#supCep').value.replace(/\D+/g, '').trim();
  let uf = document.querySelector('#supUf').value;
  let city = document.querySelector('#supCity').value.toUpperCase().trim();
  let neighborhood = document
    .querySelector('#supBairro')
    .value.toUpperCase()
    .trim();
  let typeAddress = document.querySelector('#supTypeAddress').value;
  let address = document
    .querySelector('#supAddress')
    .value.toUpperCase()
    .trim();
  let complement = document
    .querySelector('#supComp')
    .value.toUpperCase()
    .trim();
  let telephone = document
    .querySelector('#supTel')
    .value.replace(/\D+/g, '')
    .trim();
  let mail = document.querySelector('#supMail').value.trim();
  let number = document.querySelector('#supNum').value.toUpperCase().trim();

  let companyInformations = {
    cnpj,
    name,
    cityRegistration,
    stateRegistration,
    cep,
    uf,
    city,
    neighborhood,
    typeAddress,
    address,
    complement,
    telephone,
    mail,
    number,
  };

  ipcRenderer
    .invoke('register-supplier-inf', companyInformations)
    .then((response) => {
      document.querySelector('#supCnpj').value = '';
      document.querySelector('#supName').value = '';
      document.querySelector('#supInscMunic').value = '';
      document.querySelector('#supInscEstad').value = '';
      document.querySelector('#supCep').value = '';
      document.querySelector('#supUf').value = '';
      document.querySelector('#supCity').value = '';
      document.querySelector('#supBairro').value = '';
      document.querySelector('#supTypeAddress').value = '';
      document.querySelector('#supAddress').value = '';
      document.querySelector('#supComp').value = '';
      document.querySelector('#supTel').value = '';
      document.querySelector('#supMail').value = '';
      document.querySelector('#supNum').value = '';
    });
};
let content = document.querySelector('#content');
content.addEventListener('click', (event) => registerSupplier(event));

const searchSupplier = (event) => {
  event.preventDefault();

  if (event.target.id != 'supCnpj') return;

  let cnpj = document
    .querySelector('#supCnpj')
    .value.replace(/[\/\(\)\.\-]/g, '')
    .trim();

  let notValidArgument = !validateCPFeCNPJ(cnpj);
  if (notValidArgument) return;

  ipcRenderer.invoke('search-supplier-inf', cnpj).then((response) => { 
    if (response.success == false) {
      document.querySelector('#supName').value = '';
      document.querySelector('#supInscMunic').value = '';
      document.querySelector('#supInscEstad').value = '';
      document.querySelector('#supCep').value = '';
      document.querySelector('#supUf').value = '';
      document.querySelector('#supCity').value = '';
      document.querySelector('#supBairro').value = '';
      document.querySelector('#supTypeAddress').value = '';
      document.querySelector('#supAddress').value = '';
      document.querySelector('#supComp').value = '';
      document.querySelector('#supTel').value = '';
      document.querySelector('#supMail').value = '';
      document.querySelector('#supNum').value = '';
    }
    if (response.success == true) {
      let {
        supAddress,
        supBairro,
        supCep,
        supCity,
        supCnpj,
        supComp,
        supInscEstad,
        supInscMunic,
        supMail,
        supName,
        supNum,
        supTel,
        supTypeAddress,
        supUf,
      } = response.data;
      document.querySelector('#supCnpj').value = supCnpj;
      document.querySelector('#supName').value = supName;
      document.querySelector('#supInscMunic').value = supInscMunic;
      document.querySelector('#supInscEstad').value = supInscEstad;
      document.querySelector('#supCep').value = supCep;
      document.querySelector('#supUf').value = supUf;
      document.querySelector('#supCity').value = supCity;
      document.querySelector('#supBairro').value = supBairro;
      document.querySelector('#supTypeAddress').value = supTypeAddress;
      document.querySelector('#supAddress').value = supAddress;
      document.querySelector('#supComp').value = supComp;
      document.querySelector('#supTel').value = supTel;
      document.querySelector('#supMail').value = supMail;
      document.querySelector('#supNum').value = supNum;
    }
  });
};
content.addEventListener('change', (event) => searchSupplier(event));

const cleanFormFields = (event) => {
  event.preventDefault();
  if (event.target.id != 'cleanFormFields') return;
  let inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
};
content.addEventListener('click', (event) => cleanFormFields(event));

const resetHtml = (event) => {
  event.preventDefault();
  if (event.target.id != 'btn-cancel') return;
  document.querySelector('#content').innerHTML = '';
};
content.addEventListener('click', (event) => resetHtml(event));

const getAddressInfApi = (event) => {
  event.preventDefault();

  if (event.target.id != 'supCep') return;
  let cep = document.querySelector('#supCep').value;

  ipcRenderer.invoke('get-address-inf', cep).then((response) => {
    let { cep, city, neighborhood, service, state, street } = response;

    if (response.message == 'Todos os serviços de CEP retornaram erro.') {
      document.querySelector('#supUf').value = '';
      document.querySelector('#supCity').value = '';
      document.querySelector('#supBairro').value = '';
      document.querySelector('#supTypeAddress').value = '';
      document.querySelector('#supAddress').value = '';
      document.querySelector('#supComp').value = '';
      return;
    }

    document.querySelector('#supCep').value = cep
      .replace(/[\/\(\)\.\-]/g, '')
      .toUpperCase();
    document.querySelector('#supUf').value = state.toUpperCase();
    document.querySelector('#supCity').value = city.toUpperCase();
    document.querySelector('#supBairro').value = neighborhood.toUpperCase();

    let indexOfSpace = street.indexOf(' '); //3
    let typeAddressApi = street.substr(0, indexOfSpace); //Rua
    let addressApi = street.substr(indexOfSpace, street.length);

    document.querySelector(
      '#supTypeAddress'
    ).value = typeAddressApi.toUpperCase();
    document.querySelector(
      '#supAddress'
    ).value = addressApi.toUpperCase().trim();
  });
};

content.addEventListener('change', (event) => getAddressInfApi(event));

const formatSubscription = (event) => {
  event.preventDefault();

  if (event.target.id == 'supInscMunic') {
    let supInscMunic = document.querySelector('#supInscMunic');
    supInscMunic.value = supInscMunic.value.replace(/[\/\(\)\.\-]/g, '').trim();
  }
  if (event.target.id == 'supInscEstad') {
    let supInscEstad = document.querySelector('#supInscEstad');
    supInscEstad.value = supInscEstad.value.replace(/[\/\(\)\.\-]/g, '').trim();
  }

  return;
};
content.addEventListener('change', (event) => formatSubscription(event));
