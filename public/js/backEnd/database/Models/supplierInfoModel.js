const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierSchema = new Schema({ 
  supCnpj: { type: String, required: true },
  supName: { type: String, required: true },
  supInscMunic: { type: String },
  supInscEstad: { type: String },
  supCep: { type: String, required: true },
  supUf: { type: String, required: true },
  supCity: { type: String, required: true },
  supBairro: { type: String, required: true },
  supTypeAddress: { type: String, required: true },
  supAddress: { type: String, required: true },
  supComp: { type: String },
  supTel: { type: String },
  supMail: { type: String },
  supNum: { type: String },
});

const SupplierInfo = mongoose.model('SupplierInfo', supplierSchema);

module.exports =  SupplierInfo ;
