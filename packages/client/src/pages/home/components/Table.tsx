// @ts-nocheck

import React from 'react';
import { map, filter, uniq, unnest, pipe, includes } from 'ramda';
import { Table as AntdTable, Input, Button, Tag, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Pokemon } from '../../../typings/index';

interface TableState {
	searchText: string;
	searchedColumn: string;
	filteredInfo: object;
	data: object;
}

interface TableProps {
	initialData: Pokemon[];
}

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
		if (prevProps.initialData !== this.props.initialData) {
			this.updateTableData(this.props.initialData);
			message.success('More pokemons added!');
		}
	}

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
					value={selectedKeys}
					onChange={(e) => {
						const pressedKeys = e.target.value;
						setSelectedKeys(pressedKeys ? [pressedKeys] : []);
						this.handleSearch(pressedKeys, confirm, dataIndex);
					}}
					onPressEnter={() =>
						this.handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ maxWidth: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleReset(clearFilters)}
					size="small"
					style={{ width: '100%' }}
				>
					Reset
				</Button>
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
		this.setState((prevState, props) => {
			return {
				data: filter((pokemon) => {
					return includes(
						selectedKeys.toLowerCase(),
						pokemon.name.toLowerCase()
					);
				}, props.initialData),
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
				data-testid="table"
			/>
		);
	}
}
