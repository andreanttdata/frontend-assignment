import { Pokemon } from '../../../../typings/index';

interface FilteredInfo {
	name: null;
	types: string[] | null;
}

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
	filteredInfo: FilteredInfo | null;
	pokemons: Pokemon[];
}
