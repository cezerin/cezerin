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
  return _.isNumber(value) ? value : null;
}

getNumberIfPositive = (value) => {
  return (_.isNumber(value) && value >= 0) ? value : null;
}

getBooleanIfValid = (value) => {
  return _.isBoolean(value) ? value : null;
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
