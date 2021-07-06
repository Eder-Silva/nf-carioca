const { getItemInLS } = require('./appGetItemInLS');

const loginHtml = `
  <div class="container-login">
  <div>
        <img class="btn-form-close" id="resetContent" src="../images/close-window.png" />        
  </div>
    <div>
        <span class="signUp" id="signUp"> Cadastrar </span>
        <span class="logIn active" id="logIn"> Logar </span>
    </div>
    <form action="" method="post" id="form">
          <input class="companyId" type="number" id="companyId" placeholder="Id da Empresa"/>
          <select class="companyEnvironment" id="companyEnvironment">
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
          <input id="companyName" class="companyName colorInative" type="text" placeholder="Nome da Empresa" readonly/>
          <input id="companyCnpj" class="companyCnpj colorInative" type="text" placeholder="CNPJ da Empresa" readonly/>
          <input id="companyIM" class="companyIM colorInative" type="text" placeholder="Inscrição Municipal da Empresa" readonly/>
        <span type="submit" class="logar" id="btn-logIn">Conectar</span>
    </form>
  </div>
  </div>`;

const registerSupplierHtml = `
<div class="container-register">  
  <h1 class="register" id="register"> > Fornecedores > Cadastrar</h1>  
  <hr>

  <form action="" method="post" id="formRegister">
      <div>
        <input class="mandatory" type="text" id="supCnpj" placeholder="CPF/CNPJ*"/> 
        <input class="mandatory" type="text" id="supName" placeholder="Razão Social*"/>
      </div>
      <div>
        <input class="supInscMunic" type="text" id="supInscMunic" placeholder="Inscrição Municipal"/>
        <input class="supInscEstad" type="text" id="supInscEstad" placeholder="Inscrição Estadual"/>
      </div> 
      <div> 
        <input class="mandatory" type="text" id="supCep" placeholder="CEP*"/>

        <select class="mandatory" id="supTypeAddress" placeholder="Tipo*">
          <option value="">Tipo*</option>
          <option value="AEROPORTO">AEROPORTO</option>
          <option value="ALAMEDA">ALAMEDA</option>
          <option value="AREA">ÁREA</option>
          <option value="AVENIDA">AV</option>
          <option value="CAMPO">CAMPO</option>
          <option value="CHACARA">CHÁCARA</option>
          <option value="COLONIA">COLÔNIA</option>
          <option value="CONDOMINIO">CONDOMÍNIO</option>
          <option value="CONJUNTO">CONJUNTO</option>
          <option value="DISTRITO">DISTRITO</option>
          <option value="ESPLANADA">ESPLANADA</option>
          <option value="ESTACAO">ESTAÇÃO</option>
          <option value="ESTRADA">ESTRADA</option>
          <option value="FAVELA">FAVELA</option>
          <option value="FAZENDA">FAZENDA</option>
          <option value="FEIRA">FEIRA</option>
          <option value="JARDIM">JARDIM</option>
          <option value="LADEIRA">LADEIRA</option>
          <option value="LAGO">LAGO</option>
          <option value="LAGOA">LAGOA</option>
          <option value="LARGO">LARGO</option>
          <option value="LOTEAMENTO">LOTEAMENTO</option>
          <option value="MORRO">MORRO</option>
          <option value="NUCLEO">NÚCLEO</option>
          <option value="PARQUE">PARQUE</option>
          <option value="PASSARELA">PASSARELA</option>
          <option value="PATIO">PÁTIO</option>
          <option value="PRACA">PRAÇA</option>
          <option value="QUADRA">QUADRA</option>
          <option value="RECANTO">RECANTO</option>
          <option value="RESIDENCIAL">RESIDENCIAL</option>
          <option value="RODOVIA">RODOVIA</option>
          <option value="RUA">RUA</option>
          <option value="SETOR">SETOR</option>
          <option value="SITIO">SÍTIO</option>
          <option value="TRAVESSA">TRAVESSA</option>
          <option value="TRECHO">TRECHO</option>
          <option value="TREVO">TREVO</option>
          <option value="VALE">VALE</option>
          <option value="VEREDA">VEREDA</option>
          <option value="VIA">VIA</option>
          <option value="VIADUTO">VIADUTO</option>
          <option value="VIELA">VIELA</option>
          <option value="VILA">VILA</option>
        </select>

        <input class="mandatory" type="text" id="supAddress" placeholder="Endereço*"/>
      </div> 
      <div>
        <input class="supNum " type="text" id="supNum" placeholder="N°"/>
        <input class="supComp" type="text" id="supComp" placeholder="Complemento"/>
    </div> 
      <div> 
      <select class="mandatory" id="supUf" placeholder="UF*">
        <option value="">UF*</option>
        <option value="AC">AC</option>
        <option value="AL">AL</option>
        <option value="AM">AM</option>
        <option value="AP">AP</option>
        <option value="BA">BA</option>
        <option value="CE">CE</option>
        <option value="DF">DF</option>
        <option value="ES">ES</option> 
        <option value="GO">GO</option> 
        <option value="MA">MA</option>
        <option value="MG">MG</option> 
        <option value="MS">MS</option>
        <option value="MT">MT</option>   
        <option value="RN">RN</option> 
        <option value="RO">RO</option> 
        <option value="RR">RR</option>
        <option value="PA">PA</option>
        <option value="TO">TO</option> 
        <option value="PB">PB</option>
        <option value="PE">PE</option>
        <option value="PI">PI</option>
        <option value="PR">PR</option>
        <option value="RJ">RJ</option>
        <option value="RN">RN</option>
        <option value="RS">RS</option>
        <option value="SC">SC</option>
        <option value="SE">SE</option>
        <option value="SP">SP</option>
      </select>

      <input class="mandatory" type="text" id="supCity" placeholder="Cidade*"/>
      <input class="mandatory" type="text" id="supBairro" placeholder="Bairro*"/>
        
      </div>  

      <div>   
        <input class="supTel" type="text" id="supTel" placeholder="Telefone"/>
        <input class="supMail" type="email" id="supMail" placeholder="E-mail"/>
      </div>
      <div class="containerBtn">
        <span id="btn-cancel" class="btn-cancel">Cancelar</span>
        <span id="cleanFormFields" class="btnCleanFormFields">Limpar Campos</span>
        <span type="submit" id="importSupplierXL">Importar Fornecedores</span>
        <span type="submit" id="btn-register-supplier">Salvar Fornecedor</span>
      </div>
        
  </form>
</div>
</div>`;

const importHtmlVit = () => {
  return `
  <div class="cityForm">
    <h1> > Vitória > Gerar TXT </h1>
    <hr/>

    <span>
      <label>Competência: </label>
      <input type="date" id="inputDate"/>
    </span>  
    
    <span class="btnGroup">
      <button id="btn-cancel" class="btn-cancel">Cancelar</button>
      <button id="btn-send-mail" class="btn-send-mail">Enviar por Email</button>
      <button id="btn-import-vitoria" class="btn-import">Salva TXT</button>
    </span>

  </div>`;
};

const importHtmlRj = () => {
  return `
  <div class="cityFormRj">
    <h1> > Rio de Janeiro > Gerar TXT </h1>
    <hr/>

    <span>
      <label for="inputFilePath">Arquivo: </label>
      <input type="text" id="inputFilePath" placeholder="Selecione um Arquivo"></input>
      <button id="btn-search">Selecionar Arquivo</button>
    </span>    
    
    <span class="btnGroup">
      <button id="btn-cancel" class="btn-cancel">Cancelar</button>
      <button id="btn-import-rj" class="btn-import">Importar Dados</button>
    </span>

  </div>`;
};


const setLoginHtml = (event) => {
  event.preventDefault();

  let content = document.querySelector('#content');
  content.innerHTML = loginHtml;
};
let btnLogIn = document.querySelector('#btn-log');
btnLogIn.addEventListener('click', (event) => setLoginHtml(event));

const setcontentHtmlRj = async (event) => {
  event.preventDefault();
  let companyInfosInLs = await getItemInLS();
  let content = document.querySelector('#content');
  if (!companyInfosInLs) return (content.innerHTML = loginHtml);
  content.innerHTML = importHtmlRj();
};
let generateRj = document.querySelector('#btnGenerateTxtRj');
generateRj.addEventListener('click', (event) => setcontentHtmlRj(event));

const setcontentHtmlVit = async (event) => {
  event.preventDefault();
  let companyInfosInLs = await getItemInLS();
  let content = document.querySelector('#content');
  if (!companyInfosInLs) return (content.innerHTML = loginHtml);
  content.innerHTML = importHtmlVit();
};
let generateVit = document.querySelector('#btnGenerateTxtVit');
generateVit.addEventListener('click', (event) => setcontentHtmlVit(event));

const setRegisterSupplierHtml = async (event) => {
  event.preventDefault();
  let supplier = event.target.innerText;

  if (supplier == 'Cadastrar')
    document.querySelector('#content').innerHTML = registerSupplierHtml;
  //if (!companyInfosInLs) return (content.innerHTML = loginHtml);

  //content.innerHTML = importHtml(subMenu, idCity);
};
let btnSupplier = document.querySelector('#supplier');
btnSupplier.addEventListener('click', (event) =>
  setRegisterSupplierHtml(event)
);
