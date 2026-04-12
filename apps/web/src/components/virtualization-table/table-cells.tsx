import { TableCellProps, TableHeaderProps } from 'react-virtualized';

/** Ô tiêu đề cột — dùng chung cho VirtualizationTable */
export function defaultHeaderCell({ label }: TableHeaderProps) {
  return (
    <div className="flex items-center px-3 py-2.5">
      <span className="font-display text-sm font-semibold text-espresso-800">{label}</span>
    </div>
  );
}

/** Ô dữ liệu — dùng chung */
export function defaultBodyCell({ rowData, dataKey }: TableCellProps) {
  const v = rowData[dataKey];
  return (
    <span className="block truncate px-3 py-2.5 text-sm text-espresso-800" title={v != null ? String(v) : ''}>
      {v}
    </span>
  );
}
