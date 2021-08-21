import vw from './vw';
import vwToPx from './vwToPx';

function vpx(value) {
  return vwToPx(vw(value));
}

export default vpx;
