const mongoose = require('mongoose');

//Mongoose connection
(async function dbConnect() {
  try{
  const uri =
    'mongodb+srv://Eder:Bertoloto30@cluster0.jugkn.mongodb.net/nfProject?retryWrites=true&w=majority';

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('Conectado com sucesso!');
}catch(err){
  console.log('Não foi Possível Realizar a Conexão com o Banco de Dados!');
}
})();
