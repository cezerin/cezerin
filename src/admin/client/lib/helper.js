import messages from './text'

export const formatNumber = (number, settings) => {
  const x = 3;
  const floatNumber = parseFloat(number || 0) || 0;

  const re = '\\d(?=(\\d{' + x + '})+' + (settings.decimal_number > 0
    ? '\\D'
    : '$') + ')';

  let num = floatNumber.toFixed(Math.max(0, ~~ settings.decimal_number));

  return (settings.decimal_separator
    ? num.replace('.', settings.decimal_separator)
    : num).replace(new RegExp(re, 'g'), '$&' + (settings.thousand_separator));
};

const amountPattern = '{amount}';
export const formatCurrency = (number = 0, settings) => {
  return settings.currency_format.replace(amountPattern, formatNumber(number, settings));
}

export const getThumbnailUrl = (originalUrl, width) => {
  if(originalUrl && originalUrl.length > 0) {
    const pos = originalUrl.lastIndexOf('/');
    const thumbnailUrl = originalUrl.substring(0, pos) + `/${width}/` + originalUrl.substring(pos + 1);
    return thumbnailUrl;
  } else {
    return '';
  }
}

export const getOrderFieldLabelByKey = (key) => {
  switch (key) {
    case 'full_name':
      return messages.fullName;
    case 'address1':
      return messages.address1;
    case 'address2':
      return messages.address2;
    case 'postal_code':
      return messages.postal_code;
    case 'phone':
      return messages.phone;
    case 'company':
      return messages.company;
    case 'mobile':
      return messages.mobile;
    case 'city':
      return messages.city;
    case 'comments':
      return messages.customerComment;
    default:
      return '';
  }
}
