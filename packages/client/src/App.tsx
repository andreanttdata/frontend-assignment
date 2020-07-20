import React, { FC } from 'react';
import styled from 'styled-components';
import './app.css';
import { Home } from './pages/home/home';

export const App: FC = () => (
	<Main>
		<Home />
	</Main>
);

const Main = styled.main`
	margin: 5% auto;
	max-width: 1200px;
`;
