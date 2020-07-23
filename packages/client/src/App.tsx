import React, { FC } from 'react';
import styled from 'styled-components';
import { Home } from './pages/home/home';
import './app.css';

export const App: FC = () => (
	<Main>
		<Home />
	</Main>
);

const Main = styled.main`
	max-width: 1200px;
	padding: 5%;
	margin: auto;

	@media (max-width: 768px) {
		padding: 0;
		margin: 0;
	}
`;
