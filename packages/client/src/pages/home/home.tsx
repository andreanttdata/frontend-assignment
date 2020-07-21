import React, { FC } from 'react';
import { map, pathOr } from 'ramda';
import { Button } from 'antd';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { GET_POKEMON } from './query';
import { Table } from './components/Table/Table';
import { Pokemon } from '../../typings/index';
import { useWindowSize } from '../../utils/useWindowSize';
import { fetchMorePokemons } from './utils/fetchMorePokemons';
import { Loader } from '../../components/Loader';
import { getDeviceType } from '../../utils/getDeviceType';

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

	const { isMobile } = getDeviceType(width);
	const { hasNextPage }: { hasNextPage: boolean } = data.pokemons.pageInfo;
	const results: object[] = pathOr([], ['pokemons', 'edges'], data);
	const pokemons: Pokemon[] = map(
		(pokemon: PokemonNode) => pokemon?.node,
		results
	);

	return (
		<>
			<StyledButton
				type="primary"
				disabled={!hasNextPage}
				loading={isFetchingMore}
				block={isMobile}
				size={isMobile ? 'large' : 'middle'}
				onClick={() => {
					fetchMorePokemons(data, fetchMore);
				}}
			>
				Load More
			</StyledButton>
			<Table
				initialData={pokemons}
				viewportWidth={width}
				viewportHeight={height}
				networkStatus={networkStatus}
				loading={isLoadingAtStart || isFetchingMore}
			/>
		</>
	);
};

const StyledButton = styled(Button)`
	margin-bottom: 8px;

	@media (max-width: 768px) {
		position: fixed;
		bottom: 0;
		z-index: 1;
		margin-bottom: 0;
	}
`;
