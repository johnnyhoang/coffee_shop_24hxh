import {
  Column,
  RowMouseEventHandlerParams,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';

import { LOCATION_COLUMNS } from './location.type';

import { useToggle } from 'hooks/use-toggle';
import { LocationModal } from './location.modal';
import { VirtualizationTable } from 'components/virtualization-table';

import { TLocation } from './location.type';
import clsx from 'clsx';
import { useState } from 'react';
import { ActionType } from 'types';


export const LocationList = ({ locations }: { locations: TLocation[] }) => {
  const [isModalOpen, toggle] = useToggle();
  const [selectedLocation, setSelectedLocation] = useState<TLocation>(null);
  const handleRowClick = (info: RowMouseEventHandlerParams) => {
    setSelectedLocation(info.rowData);
    toggle();
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

  return (
    <div
      className={clsx(
        'flex flex-col flex-[1_0_auto] overflow-auto',
        'border border-[#dedede]',
      )}
    >
      <VirtualizationTable<TLocation>
        dataSource={locations}
        onRowClick={handleRowClick}
        headerClassName="p-2 border-r"
      >
        {LOCATION_COLUMNS.map(({ key, label, width }) => (
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


      <LocationModal
        isOpen={isModalOpen}
        actionType={ActionType.Edit}
        onOpenChange={toggle}
        title="Sửa chi nhánh"
        location={selectedLocation}
      />
    </div>
  );
};
