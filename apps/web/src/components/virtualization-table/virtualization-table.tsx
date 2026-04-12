import clsx from 'clsx';
import { useTable } from 'hooks/use-table';
import { forwardRef, ForwardedRef } from 'react';
import { Table, AutoSizer, Index, TableProps } from 'react-virtualized';

export type VirtualizationTableProps<T> = Partial<TableProps> & {
  dataSource: T[];
  rowHeight?: number;
};

declare module 'react' {
  function forwardRef<T, P>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 70;

export const VirtualizationTableInner = <T,>(
  {
    width,
    children,
    dataSource,
    rowHeight = ROW_HEIGHT,
    headerHeight = HEADER_HEIGHT,
    isFixedTableHeight,
    ...rest
  }: VirtualizationTableProps<T>,
  ref: ForwardedRef<Table>,
) => {
  const { tableRef, getTableHeight } = useTable(dataSource || []);

  const handleRowGetter = ({ index }: Index) => {
    return dataSource[index];
  };

  const getRowClassName = ({ index }: Index) => {
    // for the header row an index of -1 is provided
    return clsx('flex border-b border-[#dedede] text-left text-sm', {
      'font-bold bg-[#f8f9fa]': index === -1,
      'hover:cursor-pointer': index !== -1,
    });
  };

  const tableProps = {
    rowHeight,
    headerHeight,
    disableHeader: false,
    rowCount: dataSource ? dataSource.length : 0,
    overscanRowCount: 10,
    className: 'shadow-[0_0_0_1px_#dedede]',
    rowClassName: getRowClassName,
    noRowsRenderer: () => <div>No rows</div>,
    ...rest,
  };

  return (
    <div ref={tableRef}>
      <AutoSizer disableHeight>
        {({ width: viewportWidth }) => {
          const tableWidth = width || viewportWidth;
          const tableHeight = !isFixedTableHeight
            ? getTableHeight()
            : ROW_HEIGHT * (dataSource ? dataSource.length : 0) + HEADER_HEIGHT;

          return (
            <Table
              ref={ref}
              width={tableWidth}
              height={tableHeight}
              style={{ width: `${tableWidth}px` }}
              rowGetter={handleRowGetter}
              rowStyle={{ width: `${tableWidth}px` }}
              {...tableProps}
            >
              {children}
            </Table>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export const VirtualizationTable = forwardRef(VirtualizationTableInner);
