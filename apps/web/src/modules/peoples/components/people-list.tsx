import { Column, RowMouseEventHandlerParams, TableCellProps, TableHeaderProps } from 'react-virtualized';
import { VirtualizationTable } from 'components/virtualization-table';
import { TPeople, PEOPLE_COLUMNS } from '../types/type';

// Define the prop types for the PeopleList component
type PeopleListProps = {
  peoples: TPeople[]; // List of people to display
  queryParams: PeopleQueryParams | null; // Query parameters for filtering/searching
  onSelectRow: (people: TPeople) => void; // Callback for row selection
};

// Cell renderer for table cells
const cellRenderer = ({ rowData, dataKey }: TableCellProps) => {
  return <span title={rowData[dataKey]}>{rowData[dataKey]}</span>;
};

// Header renderer for table headers
const headerRenderer = ({ label }: TableHeaderProps) => {
  return <span>{label}</span>;
};

// PeopleList component to render the list of people in a virtualized table
export const PeopleList = ({ peoples, onSelectRow }: PeopleListProps) => {
  // Handle row click event
  const handleRowClick = ({ rowData }: RowMouseEventHandlerParams) => {
    onSelectRow(rowData);
  };

  // If no people data, show an empty state
  if (!peoples || peoples.length === 0) {
    return <div className="p-4 text-center">No data available.</div>;
  }

  return (
    <div className="flex flex-col overflow-auto">
      <VirtualizationTable<TPeople>
        dataSource={peoples} // Data source for the table
        onRowClick={handleRowClick} // Row click handler
      >
        {PEOPLE_COLUMNS.map(({ key, label, width }) => (
          <Column
            key={key}
            label={label} // Column label
            dataKey={key} // Data key for the column
            width={width} // Column width
            headerRenderer={headerRenderer} // Header renderer
            cellRenderer={cellRenderer} // Cell renderer
          />
        ))}
      </VirtualizationTable>
    </div>
  );
};
