import { filter, includes } from 'ramda';

interface Item {
	name: string;
}

export const getItemsFilteredByName = (items: Item[], selectedKeys: string) => {
	return filter((item: Item) => {
		return includes(selectedKeys.toLowerCase(), item.name.toLowerCase());
	}, items);
};
