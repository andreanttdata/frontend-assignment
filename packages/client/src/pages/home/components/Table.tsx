// @ts-nocheck

import React from 'react';
import { map, uniq, unnest, pipe, includes } from 'ramda';
import { Table as AntdTable, Input, Button, Space, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

export class Table extends React.Component {
	state = {
		searchText: '',
		searchedColumn: '',
		filteredInfo: null,
	};

	// Search
	getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						this.handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => this.handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: '',
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: (text) =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = (clearFilters) => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	// Filters
	handleFiltersChange = (pagination, filters) => {
		this.setState({
			filteredInfo: filters,
		});
	};

	render() {
		const { data } = this.props;
		const { filteredInfo = {} } = this.state;

		const selectType = (pokemons) => map((pokemon) => pokemon.types, pokemons);
		const getTypesList = pipe(selectType, unnest, uniq);
		const pokemonTypes = getTypesList(data);
		const filters = map((type) => ({ text: type, value: type }), pokemonTypes);

		const columns = [
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				...this.getColumnSearchProps('name'),
			},
			{
				title: 'Types',
				dataIndex: 'types',
				key: 'types',
				filters,
				filteredValue: filteredInfo?.types,
				onFilter: (value, record) => includes(value, record?.types),
				ellipsis: true,
				render: (tags) => (
					<>
						{tags.map((tag) => (
							<Tag color="blue" key={tag}>
								{tag}
							</Tag>
						))}
					</>
				),
			},
			{
				title: 'Classification',
				dataIndex: 'classification',
				key: 'classification',
			},
		];

		return (
			<AntdTable
				columns={columns}
				dataSource={data}
				onChange={this.handleFiltersChange}
				tableLayout="fixed"
				bordered
			/>
		);
	}
}
