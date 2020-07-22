import { uniq, unnest, pipe } from 'ramda';
import { getListOfItemsByProperty } from './getListOfItemsByProperty';

const getListOfObjectsByTypes = (data: object[]) => getListOfItemsByProperty('types', data);

export const getTypes = pipe(getListOfObjectsByTypes, unnest, uniq);
