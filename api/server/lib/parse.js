var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

getString = (value) => {
  return value ? value.toString() : null;
}

getDateIfValid = (value) => {
  var date = Date.parse(value);
  return isNaN(date) ? null : new Date(date);
}

getArrayIfValid = (value) => {
  return _.isArray(value) ? value : null;
}

getNumberIfValid = (value) => {
  const n = parseFloat(value);
  return n ? n : null;
}

getNumberIfPositive = (value) => {
  const n = parseFloat(value);
  return n >= 0 ? n : null;
}

getBooleanIfValid = (value, defaultValue = null) => {
  if(value === null || value === undefined) {
  	return defaultValue;
  }
  value = value.toString()
  return (value === "true" || value === "false") ? value === "true" : defaultValue;
}

getCurrencyIfValid = (value) => {
  return (value && value.length === 3) ? value : null;
}

getObjectIDIfValid = (value) => {
  return ObjectID.isValid(value) ? value : null;
}

module.exports = {
  getString: getString,
  getObjectIDIfValid: getObjectIDIfValid,
  getDateIfValid: getDateIfValid,
  getArrayIfValid: getArrayIfValid,
  getNumberIfValid: getNumberIfValid,
  getNumberIfPositive: getNumberIfPositive,
  getBooleanIfValid: getBooleanIfValid,
  getCurrencyIfValid: getCurrencyIfValid
}
