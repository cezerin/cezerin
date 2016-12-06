var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

const getString = (value) => {
  return value ? value.toString() : "";
}

const getDateIfValid = (value) => {
  var date = Date.parse(value);
  return isNaN(date) ? null : new Date(date);
}

const getArrayIfValid = (value) => {
  return _.isArray(value) ? value : null;
}

const getNumberIfValid = (value) => {
  const n = parseFloat(value);
  return n ? n : null;
}

const getNumberIfPositive = (value) => {
  const n = parseFloat(value);
  return n >= 0 ? n : null;
}

const getBooleanIfValid = (value, defaultValue = null) => {
  if(value === null || value === undefined) {
  	return defaultValue;
  }
  value = value.toString()
  return (value === "true" || value === "false") ? value === "true" : defaultValue;
}

const getCurrencyIfValid = (value) => {
  return (value && value.length === 3) ? value.toUpperCase() : null;
}

const getObjectIDIfValid = (value) => {
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
