import {
  Column,
  RowMouseEventHandlerParams,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';
import { VirtualizationTable } from 'components/virtualization-table';
import { STAFF_ASSIGNMENT_COLUMNS, TStaffAssignmentRow } from './staff-assignment.types';

type StaffAssignmentListProps = {
  rows: TStaffAssignmentRow[];
  onSelectRow: (row: TStaffAssignmentRow) => void;
};

const headerRenderer = ({ label }: TableHeaderProps) => (
  <span className="text-espresso-800">{label}</span>
);

const cellRenderer = ({ rowData, dataKey }: TableCellProps) => (
  <span className="block truncate text-espresso-800" title={String(rowData[dataKey] ?? '')}>
    {rowData[dataKey]}
  </span>
);

export function StaffAssignmentList({ rows, onSelectRow }: StaffAssignmentListProps) {
  const handleRowClick = ({ rowData }: RowMouseEventHandlerParams) => {
    onSelectRow(rowData as TStaffAssignmentRow);
  };

  if (!rows?.length) {
    return <div className="p-4 text-center text-espresso-600">Chưa có phân công nào.</div>;
  }

  return (
    <div className="flex flex-col overflow-auto border border-cream-200 rounded-b-lg">
      <VirtualizationTable<TStaffAssignmentRow>
        dataSource={rows}
        onRowClick={handleRowClick}
      >
        {STAFF_ASSIGNMENT_COLUMNS.map(({ key, label, width }) => (
          <Column
            key={key || 'spacer'}
            label={label}
            dataKey={key}
            width={width}
            headerRenderer={headerRenderer}
            cellRenderer={cellRenderer}
          />
        ))}
      </VirtualizationTable>
    </div>
  );
}
