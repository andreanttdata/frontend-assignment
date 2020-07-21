import React, { FC } from 'react';
import { map, pathOr } from 'ramda';
import { Button, Space } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_POKEMON } from './query';
import { Table } from './components/Table';
import { Pokemon } from '../../typings/index';
import { useWindowSize } from '../../utils/useWindowSize';
import { fetchMorePokemons } from './utils/fetchMorePokemons';
import { Loader } from '../../components/Loader';

interface PokemonNode {
	node: Pokemon;
}

export const Home: FC = () => {
	const { loading, error, data, fetchMore, networkStatus } = useQuery(
		GET_POKEMON,
		{
			notifyOnNetworkStatusChange: true,
		}
	);
	const [height, width] = useWindowSize();
	const isLoadingAtStart = loading && networkStatus === 1;
	const isFetchingMore = loading && networkStatus === 3;

	if (isLoadingAtStart) return <Loader />;
	if (error) return <div>Error! {error.message}</div>;

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
				loading={isFetchingMore}
				onClick={() => {
					fetchMorePokemons(data, fetchMore);
				}}
			>
				Load More
			</Button>
			<Table
				initialData={pokemons}
				viewportWidth={width}
				viewportHeight={height}
			/>
		</Space>
	);
};
