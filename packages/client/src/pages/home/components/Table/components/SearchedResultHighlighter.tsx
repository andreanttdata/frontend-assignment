import React from 'react';
import Highlighter from 'react-highlight-words';

export const SearchedResultHighlighter = ({ searchWords, text }) => {
	return (
		<Highlighter
			highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
			searchWords={searchWords}
			autoEscape
			textToHighlight={text ? text.toString() : ''}
		/>
	);
};
