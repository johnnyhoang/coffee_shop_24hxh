import {
  Column,
  RowMouseEventHandlerParams,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';

import { DRINK_COLUMNS, TDrink } from './drinks.types';
import { VirtualizationTable } from 'components/virtualization-table';

import clsx from 'clsx';

type DrinksListProps = {
  drinks: TDrink[];
  onSelectRow: (drink: TDrink) => void;
};

export const DrinksList = ({
  drinks,
  onSelectRow,
}: DrinksListProps) => {

  const handleRowClick = (info: RowMouseEventHandlerParams) => {
    onSelectRow({ ...info.rowData });
  };

  return (
    <div
      className={clsx(
        'flex flex-col flex-[1_0_auto] overflow-auto',
        'border border-[#dedede]',
      )}
    >
      <VirtualizationTable<TDrink>
        dataSource={drinks}
        onRowClick={handleRowClick}
        headerClassName="p-2 border-r"
      >
        {DRINK_COLUMNS.map(({ key, label, width }) => (
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

const headerRenderer = ({ label }: TableHeaderProps) => {
  return <span>{label}</span>;
};

const cellRenderer = ({ rowData, dataKey }: TableCellProps) => {
  return <span title={rowData[dataKey]}>{rowData[dataKey]}</span>;
};
