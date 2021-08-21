function isInt(value) {
  return (
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
}

function randomInt(min, max) {
  if (!isInt(min)) {
    throw Error('min should be an integer');
  }
  if (!isInt(max)) {
    throw Error('max should be an integer');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default randomInt;
