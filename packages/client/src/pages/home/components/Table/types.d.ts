import { Pokemon } from '../../../../typings/index';

export interface TableProps {
	initialData: Pokemon[];
	viewportWidth: number;
	viewportHeight: number;
	networkStatus: number;
	loading: boolean;
}

export interface TableState {
	searchText: string;
	searchedColumn: string;
	filteredInfo: object;
	data: object;
}
