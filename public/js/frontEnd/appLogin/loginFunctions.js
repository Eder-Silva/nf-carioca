const { ipcRenderer } = require('electron');
const appMainScreen = require('../appMainScreen');

class contentInteractionLogin {
  contentHtml(clickedInnerText) {
    let content = `
  <div class="container-login">
  <div>
        <img id="resetContent" class="btn-form-close" src="../images/close-window.png" />        
  </div>
    <div>
        <span class="signUp ${
          clickedInnerText === 'signUp' ? 'active' : ''
        }" id="signUp"> Cadastrar </span>
        <span class="logIn ${
          clickedInnerText === 'logIn' ? 'active' : ''
        }" id="logIn"> Logar </span>
    </div>
    <form action="" method="post" id="form">
          <input id="${
            clickedInnerText === 'logIn' ? 'companyId' : 'companyIdRegister'
          }" class="companyId" type="number" placeholder="Id da Empresa"/>
          <select id="${
            clickedInnerText === 'logIn'
              ? 'companyEnvironment'
              : 'companyEnvironmentRegister'
          }" class="companyEnvironment">
            <option value="">Ambiente da Empresa</option>
            <option value="MCS001PRD">MCS001PRD</option>
            <option value="MCS002PRD">MCS002PRD</option>
            <option value="MCS003PRD">MCS003PRD</option>
            <option value="MCS004PRD">MCS004PRD</option>
            <option value="MCS005PRD">MCS005PRD</option>
            <option value="MCS006PRD">MCS006PRD</option>
            <option value="MCS007PRD">MCS007PRD</option>
            <option value="PROTEUS">PROTEUS</option>
          </select>  
          <input id="${
            clickedInnerText === 'logIn' ? 'companyName' : 'companyNameRegister'
          }" class="companyName ${
      clickedInnerText === 'logIn' ? 'colorInative' : 'colorActive'
    }" type="text" placeholder="Nome da Empresa" ${
      clickedInnerText === 'logIn' ? 'disabled' : ''
    }/>
                <input id="${
                  clickedInnerText === 'logIn'
                    ? 'companyCnpj'
                    : 'companyCnpjRegister'
                }" class="companyCnpj ${
      clickedInnerText === 'logIn' ? 'colorInative' : 'colorActive'
    }" type="text" placeholder="CNPJ da Empresa" ${
      clickedInnerText === 'logIn' ? 'disabled' : ''
    }/ >
                <input id="${
                  clickedInnerText === 'logIn'
                    ? 'companyIM'
                    : 'companyIMRegister'
                }" class="companyIM ${
      clickedInnerText === 'logIn' ? 'colorInative' : 'colorActive'
    }" type="text" placeholder="Inscrição Municipal da Empresa" ${
      clickedInnerText === 'logIn' ? 'disabled' : ''
    }/>
              <span type="submit"  class="${
                clickedInnerText === 'logIn' ? 'logar' : 'cadastrar'
              }" id=${
      clickedInnerText === 'logIn' ? 'btn-logIn' : 'btn-signUp'
    }>${clickedInnerText === 'logIn' ? 'Conectar' : 'Cadastrar'}</span>
          </form>
        </div>
      </div>`;

    return content;
  }

  nfpSetHtml(event) {
    let clickedInnerText = event.target.id;
    let content = document.querySelector('#content');
    content.innerHTML = this.contentHtml(clickedInnerText);
  }

  idPattern = (id) => {
    if (id.length == 1) return `0${id}`;
    return id;
  };

  inputsHasInvalidInformation(companyInformations) {
    let hasEmptyValue =
      companyInformations.includes(undefined) ||
      companyInformations.includes('');
    if (hasEmptyValue) return true;
    return false;
  }

  async searchCompanyInBD() {
    const companyId = document.querySelector('#companyId').value;
    const companyEnvironment = document.querySelector('#companyEnvironment')
      .value;

    let hasInvalidValue = await this.inputsHasInvalidInformation([
      companyEnvironment,
      companyId,
    ]);

    if (hasInvalidValue) {
      document.querySelector('#companyName').value = '';
      document.querySelector('#companyCnpj').value = '';
      document.querySelector('#companyIM').value = '';
      return;
    }

    let companyIdentification = this.idPattern(companyId);

    let data = [companyIdentification, companyEnvironment];
    ipcRenderer.invoke('get-company-inf', data).then((response) => {
      if (!response.success) {
        document.querySelector('#companyId').value = '';
        document.querySelector('#companyEnvironment').value = '';
        document.querySelector('#companyName').value = '';
        document.querySelector('#companyCnpj').value = '';
        document.querySelector('#companyIM').value = '';
        return;
      }
      document.querySelector('#companyName').value = response.data.companyName;
      document.querySelector('#companyCnpj').value = response.data.companyCnpj;
      document.querySelector('#companyIM').value = response.data.companyIM;
    });
  }

  async InsertCompanyInBD() {
    let companyId = document.querySelector('#companyIdRegister').value;
    let companyEnvironment = document.querySelector(
      '#companyEnvironmentRegister'
    ).value;
    let companyName = document.querySelector('#companyNameRegister').value;
    let companyCnpj = document.querySelector('#companyCnpjRegister').value;
    let companyIM = document.querySelector('#companyIMRegister').value;

    let hasInvalidValue = await this.inputsHasInvalidInformation([
      companyId,
      companyEnvironment,
      companyName,
      companyCnpj,
      companyIM,
    ]);

    if (hasInvalidValue) {
      companyId = '';
      companyEnvironment = '';
      companyName = '';
      companyCnpj = '';
      companyIM = '';
      return;
    }

    let companyIdentification = 0 + companyId;

    let companyInformations = {
      companyIdentification,
      companyEnvironment,
      companyName,
      companyCnpj,
      companyIM,
    };

    ipcRenderer
      .invoke('insert-company-inf', companyInformations)
      .then((response) => {
        document.querySelector('#companyIdRegister').value = '';
        document.querySelector('#companyEnvironmentRegister').value = '';
        document.querySelector('#companyNameRegister').value = '';
        document.querySelector('#companyCnpjRegister').value = '';
        document.querySelector('#companyIMRegister').value = '';
      });
  }

  async InsertCompanyInLS() {
    let companyId = document.querySelector('#companyId').value;
    let companyEnvironment = document.querySelector('#companyEnvironment')
      .value;
    let companyName = document.querySelector('#companyName').value;
    let companyCnpj = document.querySelector('#companyCnpj').value;
    let companyIM = document.querySelector('#companyIM').value;

    let companyInformations = {
      companyId,
      companyEnvironment,
      companyName,
      companyCnpj,
      companyIM,
    };

    localStorage.setItem(
      'companyInformations',
      JSON.stringify(companyInformations)
    );
    await appMainScreen.setFooterInformation();
    document.querySelector('#content').innerHTML = '';
    return;
  }
}

module.exports = contentInteractionLogin;
