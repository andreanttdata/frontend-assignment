// @ts-nocheck

import React from 'react';
import { map, uniq, unnest, pipe, includes } from 'ramda';
import { Table as AntdTable, Input, Button, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { TagsList } from './components/TagsList';
import { SearchedResultHighlighter } from './components/SearchedResultHighlighter';
import { getDeviceType, getItemsFilteredByName } from '../../../../utils';
import { TableProps, TableState } from './types';

export class Table extends React.Component<TableProps, TableState> {
	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			searchedColumn: '',
			filteredInfo: null,
			data: [],
		};
	}

	updateTableData = (freshTableData) => {
		this.setState({
			data: freshTableData,
		});
	};

	componentDidMount() {
		this.setState({
			data: this.props.initialData,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const nextProps = this.props;

		if (prevProps.initialData !== nextProps.initialData) {
			if (
				prevProps.viewportWidth !== nextProps.viewportWidth ||
				prevProps.viewportHeight !== nextProps.viewportHeight ||
				prevProps.networkStatus !== nextProps.networkStatus
			) {
				return null;
			}
			this.updateTableData(nextProps.initialData);
			message.success('More pokemons added!');
		}
	}

	// Search
	getColumnSearchProps = (dataIndex) => {
		const { searchedColumn, searchText } = this.state;

		const columnSearchProps = {
			filterDropdown: ({
				setSelectedKeys,
				selectedKeys,
				confirm,
				clearFilters,
			}) => (
				<Space direction="vertical" style={{ padding: 8 }}>
					<Input
						ref={(node) => {
							this.searchInput = node;
						}}
						placeholder={`Search ${dataIndex}`}
						value={selectedKeys}
						onChange={(e) => {
							const pressedKeys = e.target.value;
							setSelectedKeys(pressedKeys ? [pressedKeys] : []);
							this.handleSearch(pressedKeys, confirm, dataIndex);
						}}
						onPressEnter={() =>
							this.handleSearch(selectedKeys, confirm, dataIndex)
						}
					/>
					<Button
						type="primary"
						onClick={() => this.handleReset(clearFilters)}
						size="small"
						block
					>
						Reset
					</Button>
				</Space>
			),
			filterIcon: (filtered) => (
				<SearchOutlined style={{ color: filtered ? '#1890ff' : '' }} />
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
				searchedColumn === dataIndex ? (
					<SearchedResultHighlighter searchWords={[searchText]} text={text} />
				) : (
					text
				),
		};

		return columnSearchProps;
	};

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		this.setState((prevState, props) => {
			const pokemonsFilteredByName = getItemsFilteredByName(
				props.initialData,
				selectedKeys
			);

			return {
				data: pokemonsFilteredByName,
				searchText: selectedKeys,
				searchedColumn: dataIndex,
			};
		});
	};

	handleReset = (clearFilters) => {
		clearFilters();
		this.setState((prevState, props) => ({
			data: props.initialData,
			searchText: '',
		}));
	};

	// Filters
	handleFiltersChange = (pagination, filters) => {
		this.setState({
			filteredInfo: filters,
		});
	};

	render() {
		const { data, filteredInfo = {} } = this.state;
		const { viewportWidth, viewportHeight, loading } = this.props;

		const { isMobile } = getDeviceType(viewportWidth);
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
				ellipsis: false,
				render: (tags) => <TagsList tags={tags} isMobile={isMobile} />,
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
				loading={loading}
				rowKey="id"
				scroll={{ y: viewportHeight - 150 }}
				tableLayout="fixed"
				bordered
			/>
		);
	}
}
