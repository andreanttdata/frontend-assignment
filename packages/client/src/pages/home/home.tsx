import React, { FC } from 'react';
import { map, pathOr } from 'ramda';
import { useQuery } from '@apollo/react-hooks';
import { GET_POKEMON } from './query';
import { Table } from './components/Table';
import { Pokemon } from '../../typings/index';

interface PokemonNode {
	node: Pokemon;
}

const Home: FC = () => {
	const { loading, error, data } = useQuery(GET_POKEMON);

	const results: object[] = pathOr([], ['pokemons', 'edges'], data);
	const pokemons: Pokemon[] = map(
		(pokemon: PokemonNode) => pokemon?.node,
		results
	);

	return (
		<>
			{loading && <div>Loading...</div>}
			{error && <div>{`Error! ${error.message}`}</div>}
			{!loading && !error && <Table initialData={pokemons} />}
		</>
	);
};
export default Home;
