import { Column, RowMouseEventHandlerParams } from 'react-virtualized';
import {
  defaultBodyCell,
  defaultHeaderCell,
  VirtualizationTable,
} from 'components/virtualization-table';
import { STAFF_ASSIGNMENT_COLUMNS, TStaffAssignmentRow } from './staff-assignment.types';

type StaffAssignmentListProps = {
  rows: TStaffAssignmentRow[];
  onSelectRow: (row: TStaffAssignmentRow) => void;
};

export function StaffAssignmentList({ rows, onSelectRow }: StaffAssignmentListProps) {
  const handleRowClick = ({ rowData }: RowMouseEventHandlerParams) => {
    onSelectRow(rowData as TStaffAssignmentRow);
  };

  return (
    <div className="min-h-0 overflow-auto">
      <VirtualizationTable<TStaffAssignmentRow>
        dataSource={rows ?? []}
        onRowClick={handleRowClick}
        headerClassName="border-r border-cream-200/60 last:border-r-0"
      >
        {STAFF_ASSIGNMENT_COLUMNS.map(({ key, label, width }) => (
          <Column
            key={key || 'spacer'}
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
}
