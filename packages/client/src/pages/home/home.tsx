// @ts-nocheck

import React, { FC } from 'react';
import { map, pathOr } from 'ramda';
import { Button, Space } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_POKEMON } from './query';
import { Table } from './components/Table';
import { Pokemon } from '../../typings/index';
import { useWindowSize } from '../../utils/useWindowSize';

interface PokemonNode {
	node: Pokemon;
}

export const Home: FC = () => {
	const { loading, error, data, fetchMore } = useQuery(GET_POKEMON);
	const [height, width] = useWindowSize();

	if (loading) return 'Loading...';
	if (error) return `Error! ${error.message}`;

	const { hasNextPage }: { hasNextPage: boolean } = data.pokemons.pageInfo;
	const results: object[] = pathOr([], ['pokemons', 'edges'], data);
	const pokemons: Pokemon[] = map(
		(pokemon: PokemonNode) => pokemon?.node,
		results
	);

	return (
		<Space direction="vertical">
			<Button
				type="primary"
				disabled={!hasNextPage}
				onClick={() =>
					fetchMore({
						variables: {
							after: data.pokemons.pageInfo.endCursor,
						},
						updateQuery: (prev, { fetchMoreResult, queryVariables }) => {
							if (!fetchMoreResult) return prev;
							return {
								pokemons: {
									edges: [
										...prev.pokemons.edges,
										...fetchMoreResult.pokemons.edges,
									],
									pageInfo: {
										...fetchMoreResult.pokemons.pageInfo,
									},
									__typename: 'PokemonsConnection',
								},
							};
						},
					})
				}
			>
				Load More
			</Button>
			<Table initialData={pokemons} width={width} />
		</Space>
	);
};
