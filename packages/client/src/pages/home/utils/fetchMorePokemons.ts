export const fetchMorePokemons = (data, fetchMore) => {
	return fetchMore({
		variables: {
			after: data.pokemons.pageInfo.endCursor,
		},
		updateQuery: (prev, { fetchMoreResult, queryVariables }) => {
			if (!fetchMoreResult) return prev;
			return {
				pokemons: {
					edges: [...prev.pokemons.edges, ...fetchMoreResult.pokemons.edges],
					pageInfo: {
						...fetchMoreResult.pokemons.pageInfo,
					},
					__typename: 'PokemonsConnection',
				},
			};
		},
	});
};
