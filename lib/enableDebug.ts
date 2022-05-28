import type { Params } from '../types';
import Debug from 'debug';

export function enableDebug(params: Params) {
  if ('debug' in params && params.debug) {
    Debug.enable('rotatelib*');
    Debug('rotatelib')('Enabled debug mode');
  }
}
