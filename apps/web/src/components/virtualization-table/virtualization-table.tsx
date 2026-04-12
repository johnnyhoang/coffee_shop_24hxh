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

/** Đồng bộ với hooks/use-table (chiều cao hàng dễ chạm, mobile-first) */
const ROW_HEIGHT = 44;
const HEADER_HEIGHT = 52;

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
    return clsx(
      'flex border-b border-cream-200/90 text-left text-sm text-espresso-800',
      {
        'cursor-default bg-cream-100/95 font-display font-semibold tracking-tight text-espresso-900 shadow-[inset_0_-1px_0_0_rgba(229,217,200,0.9)]':
          index === -1,
        'cursor-pointer transition-colors hover:bg-cream-50 active:bg-cream-100/80':
          index !== -1,
      },
    );
  };

  const tableProps = {
    rowHeight,
    headerHeight,
    disableHeader: false,
    rowCount: dataSource ? dataSource.length : 0,
    overscanRowCount: 10,
    className: 'shadow-none',
    rowClassName: getRowClassName,
    noRowsRenderer: () => (
      <div className="flex min-h-[120px] items-center justify-center px-4 py-8 text-sm text-espresso-500">
        Không có dữ liệu
      </div>
    ),
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
