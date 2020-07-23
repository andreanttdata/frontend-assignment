import React, { Component } from 'react';
import { map, includes } from 'ramda';
import { Table as AntdTable, Input, Button, message, Space } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { TagsList } from './components/TagsList';
import { SearchedResultHighlighter } from './components/SearchedResultHighlighter';
import { getDeviceType, getItemsFilteredByName, getTypes } from '../../../../utils';
import { TableProps, TableState, FilteredInfo } from './types';
import { Pokemon } from '../../../../typings';

export class Table extends Component<TableProps, TableState> {
	constructor(props: TableProps) {
		super(props);
		this.state = {
			searchText: '',
			searchedColumn: '',
			filteredInfo: null,
			pokemons: [],
		};
		this.searchInput = null;
	}

	searchInput: Input | null;

	updateTableData = (freshTableData: Pokemon[]) => {
		this.setState({
			pokemons: freshTableData,
		});
	};

	componentDidMount() {
		this.setState({
			pokemons: this.props.initialData,
		});
	}

	componentDidUpdate(prevProps: TableProps, prevState) {
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
	getColumnSearchProps = (dataIndex: string) => {
		const { searchedColumn, searchText } = this.state;

		const columnSearchProps = {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
					/>
					<Button type="primary" onClick={() => this.handleReset(clearFilters)} size="small" block>
						Reset
					</Button>
				</Space>
			),
			filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : '' }} />,
			onFilter: (value, record) =>
				record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
			onFilterDropdownVisibleChange: (visible: boolean) => {
				if (visible) {
					setTimeout(() => this.searchInput?.select());
				}
			},
			render: (text) =>
				searchedColumn === dataIndex ? <SearchedResultHighlighter searchWords={[searchText]} text={text} /> : text,
		};

		return columnSearchProps;
	};

	handleSearch = (selectedKeys: string, confirm: () => void, dataIndex: string) => {
		this.setState((prevState: TableState, props: TableProps) => {
			const pokemonsFilteredByName: Pokemon[] = getItemsFilteredByName(props.initialData, selectedKeys);

			return {
				pokemons: pokemonsFilteredByName,
				searchText: selectedKeys,
				searchedColumn: dataIndex,
			};
		});
	};

	handleReset = (clearFilters: () => void) => {
		clearFilters();
		this.setState((prevState, props) => ({
			pokemons: props.initialData,
			searchText: '',
		}));
	};

	// Filters
	handleFiltersChange = (
		pagination: TablePaginationConfig,
		filters: Record<string, React.ReactText[]> & FilteredInfo
	) => {
		this.setState({
			filteredInfo: filters,
		});
	};

	render() {
		const { pokemons, filteredInfo } = this.state;
		const { viewportWidth, viewportHeight, loading } = this.props;

		const { isMobile } = getDeviceType(viewportWidth);
		const pokemonTypes: string[] = getTypes(pokemons);
		const filters = map((type) => ({ text: type, value: type }), pokemonTypes);

		const columns: ColumnsType<Pokemon> = [
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
				dataSource={pokemons}
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
