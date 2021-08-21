function vw(px, base = 750, unit = true) {
  if (typeof px !== 'number') {
    throw new Error('px is required and should be a number');
  }
  if (typeof base !== 'number') {
    throw new Error('base is required and should be a number');
  }
  return (Math.round(px) / base) * 100 + (unit ? 'vw' : '');
}

export default vw;
