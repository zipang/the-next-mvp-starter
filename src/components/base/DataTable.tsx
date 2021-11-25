import { Box, SimpleGrid } from "@chakra-ui/layout";
import { getProperty } from "lib/utils/NestedObjects";
import React from "react";

const getData = (data, accessor) => {
	if (typeof accessor === "function") {
		return accessor(data);
	} else {
		getProperty(data, accessor);
	}
};

/**
 * @typedef ColumnDefinition
 * @property {String|Function} header Label to use as column header
 * @property {String|Function} accessor How to access the displayed value from a row data
 * @property {String} width Use fr or a fixed dimension
 */
export type ColumnDefinition = {
	header: string | Function;
	accessor: string | Function;
	width: string;
};

/**
 * @typedef DataTableProperties
 * @property {Array<ColumnDefinition>} columnsDef
 * @property {Array<Object>} rows
 */
export type DataTableProperties = {
	columnsDef: ColumnDefinition[];
	data: Object[];
};
/**
 *
 * @param {DataTableProperties} props
 */
export const DataTable = ({ columnDefs, data }) => {
	const templateColumns = columnDefs.reduce(
		(prec: string, def: string) => prec + " " + def,
		""
	);

	return (
		<SimpleGrid templateColumns={templateColumns}>
			{
				// Display the Headers
				columnDefs.map(({ header, width }, i) => (
					<Box className="header" key={`column-${i}`} width={width}>
						{header}
					</Box>
				))
			}
			{columnDefs.map(({ accessor, width }, i) => (
				<Box className="column" key={`column-${i}`} width={width}>
					{getData(data, accessor)}
				</Box>
			))}
		</SimpleGrid>
	);
};
