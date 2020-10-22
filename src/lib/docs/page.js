import path from 'path';
import { readFile } from '../fs-utils';
import { removeFromLast } from './utils';

const MANIFEST_PATH = path.resolve('./docs/manifest.json');

export async function fetchDocsManifest() {
  const res = await readFile(MANIFEST_PATH, 'utf8');
  return JSON.parse(res);
}

export function findRouteByPath(path, routes) {
  // eslint-disable-next-line
  for (const route of routes) {
    if (route.path && removeFromLast(route.path, '.') === path) {
      return route;
    }
    const childPath = route.routes && findRouteByPath(path, route.routes);
    if (childPath) return childPath;
  }
}

export function getPaths(nextRoutes, carry = [{ params: { slug: [] } }]) {
  nextRoutes.forEach(({ path, routes }) => {
    if (path) {
      carry.push(removeFromLast(path, '.'));
    } else if (routes) {
      getPaths(routes, carry);
    }
  });

  return carry;
}
