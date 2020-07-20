import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import './app.css';

import { Home } from './pages';
import { Layout } from './containers';

const client = new ApolloClient({
	uri: 'http://localhost:4000/',
});

export const App: FC = () => (
	<Layout>
		<Home />
	</Layout>
);

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);
