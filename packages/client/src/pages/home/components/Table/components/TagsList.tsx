import React from 'react';
import { Tag, Space } from 'antd';

export const TagsList = ({ tags, isMobile }) => {
	return (
		<Space direction={isMobile ? 'vertical' : 'horizontal'}>
			{tags.map((tag, i) => (
				<Tag color="blue" key={`${tag}-i`}>
					{tag}
				</Tag>
			))}
		</Space>
	);
};
