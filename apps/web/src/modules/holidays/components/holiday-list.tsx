import {
  Column,
  RowMouseEventHandlerParams,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';

import { COLUMN_TITLES } from '../constants';

import { HolidayQueryParams, THoliday } from '../types';

import { VirtualizationTable } from 'components/virtualization-table';
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
  let cellClassName = 'block truncate';

  if (fieldName === 'holiday') {
    const typeClass = getDateColorClass(String(cellValue), -30);
    cellClassName = clsx(cellClassName, typeClass);
  }

  return (
    <span className={cellClassName} title={rowData[dataKey]}>
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

  const headerRenderer = ({ label }: TableHeaderProps) => {
    const headerClassName = clsx(
      'pt-4 flex flex-row', 'cursor-default',
    );
    return (
      <div className={headerClassName}>
        <span className="flex items-center" key={`${label}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        'flex flex-col flex-[1_0_auto] overflow-auto',
        'border border-[#dedede]',
      )}
    >
      <VirtualizationTable<THoliday>
        dataSource={holidays}
        onRowClick={handleRowClick}
        headerClassName="p-2 border-r"
      >
        {COLUMN_TITLES.map(({ key, label, width }) => (
          <Column
            key={key}
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
};
