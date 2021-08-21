function isValidNum(value) {
  return !isNaN(Number(value));
}

function vwToPx(value) {
  if (typeof value === 'string') {
    value = value.replace(/vw$/, '');
  }
  if (!isValidNum(value)) {
    throw new Error(
      'value is required and should be a number or value can be parsed by Number()'
    );
  }
  const oneVw = window.innerWidth / 100;
  return Math.round(oneVw * Number(value));
}

export default vwToPx;
