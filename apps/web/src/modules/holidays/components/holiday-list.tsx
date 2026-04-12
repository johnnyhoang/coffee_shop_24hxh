import { Column, RowMouseEventHandlerParams, TableCellProps } from 'react-virtualized';

import { COLUMN_TITLES } from '../constants';

import { HolidayQueryParams, THoliday } from '../types';

import {
  defaultHeaderCell,
  VirtualizationTable,
} from 'components/virtualization-table';
import clsx from 'clsx';
import { get } from 'lodash';
import { getDateColorClass } from 'common/utils/color';

type HolidayListProps = {
  holidays: THoliday[];
  queryParams: HolidayQueryParams;
  onSelectRow: (holiday: THoliday) => void;
};

const cellRenderer = ({ rowData, dataKey, columnIndex }: TableCellProps) => {
  const fieldName = COLUMN_TITLES[columnIndex].key;
  const cellValue = get(rowData, fieldName);
  let cellClassName = 'block truncate px-3 py-2.5 text-sm';

  if (fieldName === 'holiday') {
    const typeClass = getDateColorClass(String(cellValue), -30);
    cellClassName = clsx(cellClassName, typeClass);
  } else {
    cellClassName = clsx(cellClassName, 'text-espresso-800');
  }

  return (
    <span className={cellClassName} title={rowData[dataKey] != null ? String(rowData[dataKey]) : ''}>
      {rowData[dataKey]}
    </span>
  );
};

export const HolidayList = ({
  holidays,
  onSelectRow,
}: HolidayListProps) => {

  const handleRowClick = (info: RowMouseEventHandlerParams) => {
    onSelectRow({ ...info.rowData });
  };

  return (
    <div className="min-h-0 overflow-auto">
      <VirtualizationTable<THoliday>
        dataSource={holidays}
        onRowClick={handleRowClick}
        headerClassName="border-r border-cream-200/60 last:border-r-0"
      >
        {COLUMN_TITLES.map(({ key, label, width }) => (
          <Column
            key={key}
            label={label}
            dataKey={key}
            width={width}
            headerRenderer={defaultHeaderCell}
            cellRenderer={cellRenderer}
          />
        ))}
      </VirtualizationTable>
    </div>
  );
};
