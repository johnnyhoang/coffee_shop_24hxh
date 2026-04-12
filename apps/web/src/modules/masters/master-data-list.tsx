import {
  Column,
  RowMouseEventHandlerParams,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';


import { VirtualizationTable } from 'components/virtualization-table';

import clsx from 'clsx';
import { MASTER_DATA_COLUMNS, TMasterData } from './master-data.types';

type MasterDataListProps = {
  masterDataList: TMasterData[];
  queryParams: Record<string, string>;
  onSelectRow: (masterDataItem: TMasterData) => void;
};


const headerRenderer = ({ label }: TableHeaderProps) => (
  <div className="pt-4 flex cursor-default">
    <span>{label}</span>
  </div>
);

const cellRenderer = ({ rowData, dataKey }: TableCellProps) => (
  <span className="block truncate" title={rowData[dataKey]}>
    {rowData[dataKey]}
  </span>
);


export const MasterDataList = ({
  masterDataList,
  onSelectRow
}: MasterDataListProps) => {

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
      <VirtualizationTable<TMasterData>
        dataSource={masterDataList}
        onRowClick={handleRowClick}
        headerClassName="p-2 border-r"
      >
        {MASTER_DATA_COLUMNS.map(({ key, label, width }) => (
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
