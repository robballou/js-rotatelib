import { Params } from '../../types';
import { HandlerBase } from './HandlerBase';

export class FilesystemHandler extends HandlerBase {
  applies(params: Partial<Params>): boolean {
    return 'directory' in params && !!params.directory;
  }

  list(params: Partial<Params>): string[] {
    return [];
  }
}
