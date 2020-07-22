import { map } from 'ramda';

export const getListOfItemsByProperty = (prop: string, items: object[]) => map((item) => item[prop], items);
