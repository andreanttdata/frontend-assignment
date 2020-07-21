import React from 'react';
import { Tag, Space } from 'antd';

export const TagsList = ({ tags, isDesktop }) => {
	return (
		<Space direction={isDesktop ? 'horizontal' : 'vertical'}>
			{tags.map((tag, i) => (
				<Tag color="blue" key={`${tag}-i`}>
					{tag}
				</Tag>
			))}
		</Space>
	);
};
