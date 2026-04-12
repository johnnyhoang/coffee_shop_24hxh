import { Column, RowMouseEventHandlerParams } from 'react-virtualized';

import {
  defaultBodyCell,
  defaultHeaderCell,
  VirtualizationTable,
} from 'components/virtualization-table';

import { MASTER_DATA_COLUMNS, TMasterData } from './master-data.types';

type MasterDataListProps = {
  masterDataList: TMasterData[];
  queryParams: Record<string, string>;
  onSelectRow: (masterDataItem: TMasterData) => void;
};


export const MasterDataList = ({
  masterDataList,
  onSelectRow
}: MasterDataListProps) => {

  const handleRowClick = (info: RowMouseEventHandlerParams) => {
    onSelectRow({ ...info.rowData });
  };

  return (
    <div className="min-h-0 overflow-auto">
      <VirtualizationTable<TMasterData>
        dataSource={masterDataList}
        onRowClick={handleRowClick}
        headerClassName="border-r border-cream-200/60 last:border-r-0"
      >
        {MASTER_DATA_COLUMNS.map(({ key, label, width }) => (
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
