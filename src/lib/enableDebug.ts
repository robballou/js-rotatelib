import type { Params } from '../types';
import Debug from 'debug';

/**
 * Turn on the debug output if debug is part of the params
 */
export function enableDebug(params: Params) {
	if ('debug' in params && params.debug) {
		Debug.enable('rotatelib*');
		Debug('rotatelib')('Enabled debug mode');
	}
}
