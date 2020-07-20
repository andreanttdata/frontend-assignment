import { gql } from 'apollo-boost';

export const GET_POKEMON = gql`
	query($after: ID) {
		pokemons(after: $after) {
			edges {
				node {
					id
					name
					types
					classification
				}
			}
			pageInfo {
				endCursor
				hasNextPage
			}
		}
	}
`;
