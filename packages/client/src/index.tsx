import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import * as serviceWorker from './serviceWorker';
import './app.css';

import { Home, Scripts } from './pages';
import { Layout } from './containers';

const client = new ApolloClient({
	uri: 'http://localhost:4000/',
});

export const App: FC = () => (
	<Router>
		<Layout>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/scripts" component={Scripts} />
			</Switch>
		</Layout>
	</Router>
);

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
