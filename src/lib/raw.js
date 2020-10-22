import { resolve } from 'path';
import { getError } from './utils';
import { readFile } from './fs-utils';

export async function getFileContent(path) {
  const doc = resolve(`.${path}`);
  const res = await readFile(doc, 'utf8');

  if (res) return res;
  throw await getError('Read file error', res);
}