import { Column, RowMouseEventHandlerParams } from 'react-virtualized';

import { DRINK_COLUMNS, TDrink } from './drinks.types';
import {
  defaultBodyCell,
  defaultHeaderCell,
  VirtualizationTable,
} from 'components/virtualization-table';

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
    <div className="min-h-0 overflow-auto">
      <VirtualizationTable<TDrink>
        dataSource={drinks}
        onRowClick={handleRowClick}
        headerClassName="border-r border-cream-200/60 last:border-r-0"
      >
        {DRINK_COLUMNS.map(({ key, label, width }) => (
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
