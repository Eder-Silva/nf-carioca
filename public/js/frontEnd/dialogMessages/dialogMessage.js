const  dialog  = require('electron').remote.dialog;

const dialogMessages = {    
      fieldNotFilled: () => {
        dialog.showMessageBox({
          title: '[Erro] Campos não preenchido: ',
          message: 'Favor preencher o(s) campo(s) obrigatório(s)*. ',
          type: 'error',
        }); 
      },

      cpfNotFilled: (cpf) => {
        dialog.showMessageBox({
          title: '[Erro] CPF Inválido: ',
          message: `O CPF ${cpf} não é Válido. Favor preencher um CPF Válido! `,
          type: 'error',
        }); 
      }, 

      cnpjNotFilled: (cnpj) => { 
        dialog.showMessageBox({
          title: '[Erro] Cnpj Inválido: ',
          message: `O CNPJ ${cnpj} não é Válido. Favor preencher um CNPJ Válido! `,
          type: 'error',
        }); 
      },

      waitProcess: () => {
        dialog.showMessageBox({
          title: '[Info] Aguarde um Instante: ',
          message: 'Favor, Aguarge um instante, este processo poder demorar alguns minutos. ',
          type: 'info',
        });
      },
}

module.exports = dialogMessages