// @ts-nocheck

import React, { FC, useState } from 'react';
import { map, pathOr } from 'ramda';
import { Button, Space } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_POKEMON } from './query';
import { Table } from './components/Table';
import { Pokemon } from '../../typings/index';

interface PokemonNode {
	node: Pokemon;
}

const Home: FC = () => {
	const [paginationIndex, setPaginationIndex] = useState('000');
	const { loading, error, data } = useQuery(GET_POKEMON, {
		variables: { after: paginationIndex },
	});

	if (loading) return 'Loading...';
	if (error) return `Error! ${error.message}`;

	const {
		endCursor,
		hasNextPage,
	}: { endCursor: string; hasNextPage: boolean } = data.pokemons.pageInfo;
	const results: object[] = pathOr([], ['pokemons', 'edges'], data);
	const pokemons: Pokemon[] = map(
		(pokemon: PokemonNode) => pokemon?.node,
		results
	);

	return (
		<Space direction="vertical">
			<Button
				onClick={() => setPaginationIndex(endCursor)}
				disabled={!hasNextPage}
			>
				LOAD MORE
			</Button>
			<Table initialData={pokemons} />
		</Space>
	);
};
export default Home;
