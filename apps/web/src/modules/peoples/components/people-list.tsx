import { Column, RowMouseEventHandlerParams } from 'react-virtualized';
import {
  defaultBodyCell,
  defaultHeaderCell,
  VirtualizationTable,
} from 'components/virtualization-table';
import { PeopleQueryParams, TPeople, PEOPLE_COLUMNS } from '../types/type';

// Define the prop types for the PeopleList component
type PeopleListProps = {
  peoples: TPeople[]; // List of people to display
  queryParams: PeopleQueryParams | null; // Query parameters for filtering/searching
  onSelectRow: (people: TPeople) => void; // Callback for row selection
};

export const PeopleList = ({ peoples, onSelectRow }: PeopleListProps) => {
  const handleRowClick = ({ rowData }: RowMouseEventHandlerParams) => {
    onSelectRow(rowData);
  };

  return (
    <div className="min-h-0 overflow-auto">
      <VirtualizationTable<TPeople>
        dataSource={peoples ?? []}
        onRowClick={handleRowClick}
        headerClassName="border-r border-cream-200/60 last:border-r-0"
      >
        {PEOPLE_COLUMNS.map(({ key, label, width }) => (
          <Column
            key={key}
            label={label}
            dataKey={key}
            width={width}
            headerRenderer={defaultHeaderCell}
            cellRenderer={defaultBodyCell}
          />
        ))}
      </VirtualizationTable>
    </div>
  );
};
