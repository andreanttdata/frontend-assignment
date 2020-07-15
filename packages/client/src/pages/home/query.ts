import { gql } from 'apollo-boost';

export const GET_POKEMON = gql`
	query {
		pokemons {
			edges {
				node {
					id
					name
					types
					classification
				}
			}
		}
	}
`;
