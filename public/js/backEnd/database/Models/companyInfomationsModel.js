const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const companyInformation = new Schema({
  companyId: { type: String, required: true },
  companyEnvironment: { type: String, required: true },
  companyName: { type: String, required: true },
  companyCnpj: { type: String, required: true },
  companyIM: { type: String, required: true },
});
const CompanyInformation = mongoose.model(
  'companyInformation',
  companyInformation,
  'companyInformation' 
);

module.exports = CompanyInformation;