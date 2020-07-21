import React, { FC } from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

export const Loader: FC = () => {
	const antIcon = <LoadingOutlined spin />;

	return <StyledSpin indicator={antIcon} />;
};

const StyledSpin = styled(Spin)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 30%;

	& svg {
		font-size: 80px;
	}
`;
