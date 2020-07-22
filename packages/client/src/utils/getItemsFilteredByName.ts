import { filter, includes } from 'ramda';

export interface Item {
	name: string;
}

export const getItemsFilteredByName = <T extends Item>(items: T[], selectedKeys: string): T[] => {
	return filter((item: T) => {
		return includes(selectedKeys.toLowerCase(), item.name.toLowerCase());
	}, items);
};
