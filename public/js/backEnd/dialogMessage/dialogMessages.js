const { dialog } = require('electron');

const dialogMessages = {
    registredInformation: () => {
        dialog.showMessageBox({
          title: '[SUCESSO] Procedimento concluído:',
          message: 'Procedimento concluído, informações cadastradas com sucesso.',
          type: 'info',
        });
      },
      notRegistredInformation: () => {
        dialog.showMessageBox({
          title: '[ERRO] Procedimento abortado:',
          message: 'Não foi possível cadastrar as informações',
          type: 'error',
        });
      },
      companyNotFound: () => {
        dialog.showMessageBox({
          title: '[Erro] Empresa não encontrada: ',
          message: 'A Empresa com o Id e o Ambiente informados não existe. ',
          type: 'error',
        });
      },
      createdFile: () => {
        dialog.showMessageBox({
          title: '[Sucerro] Arquivo Criado: ',
          message: 'O arquivo foi criado com sucesso. ',
          type: 'info',
        });
      },
      noCreatedFile: () => {
        dialog.showMessageBox({
          title: '[Erro] Arquivo não foi salvo: ',
          message: 'Não foi possível criar o arquivo. ',
          type: 'error',
        }); 
      },
      cpfOrCnpjInvalid: (cnpj) => {
        dialog.showMessageBox({
          title: '[ERRO] Procedimento abortado:',
          message: `CPF(s) ou CNPJ(s): \n ${cnpj.join(
            '\n'
          )} \n não existe(m)`,
          type: 'error',
        })
      }, 
      pathNotExist: (path) => {
        dialog.showMessageBox({
          title: '[ERRO] Caminho Inexistente:',
          message: `O Caminho ${path} não Existe`,
          type: 'error',
        })
      },
      withoutConnectionApi: () => {
        dialog.showMessageBox({
          title: '[ERRO] Sem conexão com a API:',
          message: `Não foi possível se conectar com a API, Fovor tente novamente em instantes`,
          type: 'error',
        })
      },
      cpfOrCnpjNotFound: (cnpj) => {
        dialog.showMessageBox({
          title: '[ERRO] Procedimento abortado:',
          message: `CPF(s) ou CNPJ(s): ${cnpj} não encontrado`,
          type: 'error',
        })
      }, 
      datesIsNotEqual: () => {
        dialog.showMessageBox({
          title: '[ERRO] Procedimento abortado:',
          message: `Não existe aquivos com a data de emissão igual à competência selecionada`,
          type: 'error',
        })
      }, 
}

module.exports = dialogMessages